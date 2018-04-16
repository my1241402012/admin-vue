export default {
  async created () {
    this.loadUsersByPage(1)
  },
  data () {
    return {
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      searchText: '',
      tableData: [],
      totalSize: 0,
      currentPage: 1,
      pageSize: 1,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 改变每页显示的个数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.loadUsersByPage(1, pageSize)
      this.currentPage = 1
    },

    // 改变当前页码
    handleCurrentChange (currentPage) {
      // this.currentPage = currentPage
      this.loadUsersByPage(currentPage)
    },

    // 根据当前页码加载用户列表
    async loadUsersByPage (page) {
      const res = await this.$http.get('/users', {
        params: {
          pagenum: page,
          pagesize: this.pageSize,
          query: this.searchText
        }
      })

      const {users, total} = res.data.data
      this.tableData = users
      this.totalSize = total
    },

    // 处理搜索
    async handleSearch () {
      this.loadUsersByPage(1)
    },

    // 改变用户状态
    async handleStateChange (val, user) {
      const {id: userId} = user
      const res = await this.$http.put(`/users/${userId}/state/${val}`)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: `用户状态${val ? '启用' : '禁用'}成功`
        })
      }
    },

    // 显示添加用户表单
    handleShowAddUser () {
      this.dialogFormVisible = true
    },

    // 添加用户
    async handleAddUser () {
      this.$refs['addUserForm'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        const res = await this.$http.post('/users', this.userForm)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '用户添加成功'
          })
        }
        // 关闭弹出框
        this.dialogFormVisible = false
        // 重新加载页面
        this.loadUsersByPage(this.currentPage)
        for (let key in this.userForm) {
          this.userForm[key] = ''
        }
      })
    },

    // 删除用户
    async handleDeleteUser (user) {
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // const {id: userId} = user
        const res = await this.$http.delete(`/users/${user.id}`)
        if (res.data.meta.sttus === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        // 删除成功，重新加载用户列表
        this.loadUsersByPage(this.currentPage)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 显示编辑用户表单
    async handleShowEditUser (user) {
      this.dialogEditFormVisible = true
      const res = await this.$http.get(`/users/${user.id}`)
      this.editUserForm = res.data.data
    },

    // 编辑用户信息
    async handleEditUser () {
      const user = this.editUserForm
      const res = await this.$http.put(`users/${user.id}`, user)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '用户信息修改成功'
        })
      }
      this.dialogEditFormVisible = false
      this.loadUsersByPage(this.currentPage)
    }
  }
}
