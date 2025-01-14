<template>
  <div>
    <el-dialog title="收藏" :visible.sync="addVisible" width="30%" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false" class="JNPF-dialog JNPF-dialog_center selectPro">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" style="margin: 0 10px;">
        <el-form-item label="名称" prop="urlName">
          <el-input v-model="ruleForm.urlName"></el-input>
        </el-form-item>
        <el-form-item label="路由">
          <el-input v-model="ruleForm.urlAddress" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addUserFavorites } from '@/api/permission/user'
export default {
  name: 'addList',
  components: {},
  data() {
    return {
      ruleForm: {
        urlName: '',
        urlAddress: ''
      },
      rules: {
        urlName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      top: 0,
      left: 0,
      selectedTag: {},
      visitedViews: '',
      addVisible: false,

      loading: false
    }
  },
  created() { },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$confirm('此操作将新建收藏, 是否继续?', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.ruleForm.userId = this.userInfo.userId
          //   addUserFavorites(this.ruleForm).then(res => {
          //     this.addVisible = false
          //     this.$message({
          //       type: 'success',
          //       message: '新建成功!'
          //     });
          //   })

          // }).catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消新建'
          //   });
          // });
          this.ruleForm.userId = this.userInfo.userId
          addUserFavorites(this.ruleForm).then((res) => {
            this.addVisible = false
            this.$message({
              type: 'success',
              message: '新建成功!'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    init() {
      this.finish = false
      this.addVisible = true
      console.log(this.$router.currentRoute,'kk')
      this.ruleForm.urlName = this.$router.currentRoute.meta.zhTitle
      this.ruleForm.urlAddress = this.$router.currentRoute.fullPath
      console.log(this.ruleForm, 'jjj')
    }
  }
}
</script>