<template>
  <div id="app">
    <router-view />
    <el-dialog title="公告" v-model="dialogVisible" width="30%" center>
      <!--        <span>{{this.noticeContent}}</span>-->
      <el-card class="el-dialog-div">
        &nbsp&nbsp我突然发现，所谓的坚强，不过是真正的不幸没有降临在自己头上。 --陈年喜《微尘》
      </el-card>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false" :append-to-body="true">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { printBuildInfo } from '@/utils'
import { editBimBusinessData } from '@/api/basicData/index'
export default {
  name: 'App',
  mounted() {
    let fontSizeValue = localStorage.getItem('fontSizeValue') ? localStorage.getItem('fontSizeValue') : 16
    document.getElementsByTagName('body')[0].style.setProperty('--fSize', fontSizeValue + 'px')

    // if (process.env.NODE_ENV === 'development') return
    // this.$nextTick(() => {
    //   window.addEventListener('beforeunload', this.beforeUnload)
    // })
  },
  beforeDestroy() {
    // if (process.env.NODE_ENV === 'development') return
    // window.removeEventListener('beforeunload', this.beforeUnload)
  },
  created() {
    // let imgURL = localStorage.getItem('aaa') === 'zgt' ? location.origin + '/favicon1.ico' : location.origin + '/favicon1.ico'
    // var head = document.getElementsByTagName('head')[0];
    // var linkTag = document.createElement('link');
    // linkTag.type = "image/x-icon";
    // linkTag.rel = "shortcut icon";
    // linkTag.setAttribute('href', imgURL)
    // head.appendChild(linkTag);
    console.log(this.$store.state.user.userInfo,'[[[]]]')
    this.userInfo = this.$store.state.user.userInfo
    // if (this.$store.state.user.userInfo) {
    //   if (!this.$store.state.user.userInfo.projectId) {
    //     console.log('userInfo')

    //     var isAgree = confirm('系统管理员首次登录后就要确定是否启动项目管理,是否启动？')
    //     if (isAgree) {
    //       // alert('谢谢你的同意！');
    //       let query = {
    //         active: true,
    //         businessCode: 'system',
    //         configKey: 'project',
    //         configKeyLabel: '启用项目管理',
    //         configValue1: 1,
    //         configValue2: '',
    //         configValue3: '',
    //         createByName: null,
    //         description: '该设置涉及到整个系统是否使用多个项目管理，一但设置则不允许修改。',
    //         editFlag: false,
    //         id: '401',
    //         parentId: null,
    //         radio: 0,
    //         state: true,
    //         updateByName: null
    //       }
    //       editBimBusinessData(query).then((res) => {
    //         if (res.code == '200') {
    //           this.$message({
    //             message: '修改成功',
    //             type: 'success'
    //           })
    //           this.formLoading = false
    //         } else {
    //           this.formLoading = false
    //         }
    //       })
    //       this.$message('启动项目管理成功')
    //     } else {
    //       // alert('很遗憾，你没有同意。');
    //     }
    //   }
    // }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    beforeUnload(e) {
      if (!this.$store.state.user.isLeaveToast) {
        this.$store.commit('user/SET_TOAST', false)
        return false
      }
      e = e || window.event
      if (e || window.event) e.returnValue = 1
      return 1
    }
  }
}
</script>
