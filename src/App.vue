<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { printBuildInfo } from '@/utils'
import { editBimBusinessData, getBimBusinessSwitchConfigList } from '@/api/basicData/index'
export default {
  name: 'App',
  mounted() {
    let fontSizeValue = localStorage.getItem('fontSizeValue') ? localStorage.getItem('fontSizeValue') : 14
    document.getElementsByTagName('body')[0].style.setProperty('--fSize', fontSizeValue + 'px')

    this.$store.dispatch('base/refreshConfigData')
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
    // this.getProjectSwitch()


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
    },
    getProjectSwitch() {
      let obj = {
        businessCode: 'system',
        pageSize: -1
      }
      getBimBusinessSwitchConfigList(obj).then((res) => {
        res.data.system.forEach((item) => {
          if (item.configKey == 'project') {
            this.isProjectSwitch = item.configValue1
            if (this.isProjectSwitch === '0') {
              var isAgree = confirm('系统管理员首次登录后就要确定是否启动项目管理,是否启动？')
              if (isAgree) {
                let query = [{
                  active: true,
                  businessCode: 'system',
                  configKey: 'project',
                  configKeyLabel: '启用项目管理',
                  configValue1: 1,
                  configValue2: '',
                  configValue3: '',
                  createByName: null,
                  description: '该设置涉及到整个系统是否使用多个项目管理，一但设置则不允许修改。',
                  editFlag: false,
                  id: '401',
                  parentId: null,
                  radio: 0,
                  state: true,
                  updateByName: null
                }]
                editBimBusinessData(query).then((res) => {
                  if (res.code == '200') {
                    this.$message({
                      message: '启用成功',
                      type: 'success'
                    })
                    this.formLoading = false
                  } else {
                    this.formLoading = false
                  }
                })
              } else {
                alert('很遗憾，你没有同意。');
              }
            }
          }


        })
      })
    },
  }
}
</script>
