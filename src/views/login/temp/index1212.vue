<template>
  <div class="login-container" style="flex-direction: column;">




    <div class="body">
        <div class="body_box">
            <div class="body_right">
                <div style="display: flex;justify-content: space-between;background:rgba(0,0,0,.2)">
                    <el-image class="login-logo" :src="define.comUrl+sysConfig.loginIcon"  v-if="sysConfig && sysConfig.loginIcon">
                      <template slot="error">
                        <img class="login-logo" src="@/assets/images/login_logo.png" alt="">
                      </template>
                    </el-image>
                    <img class="login-logo" src="@/assets/images/login_logo.png" alt="" v-else>
                    <!-- <img class="login-logo" src="@/assets/images/login_logo.png">  -->
                    <div v-if="sysConfig && sysConfig.sysVersion" class="login-version">
                      {{ sysConfig.sysVersion }}
                    </div>
                </div>
                <div class="login-content">
                  <div class="login-form" >
                    <div class="login-tab" :class="'active'+active">
                      <a class="item" :class="{'active': active==1}" @click="active=1">{{$t('login.title')}}</a>
                      <a class="item" :class="{'active': active==2}"
                        @click="active=2">{{$t('login.scanTitle')}}</a>
                    </div>
                    <el-form v-show="active==1" ref="loginForm" :model="loginForm" :rules="loginRules"
                      autocomplete="on" label-position="left">
                      <el-form-item>
                       <el-select class="sel-item"  v-model="loginForm.sys" size="medium" v-if="false">
                            <el-option value="1" label="222222"></el-option>
                            <!--  v-if="false" -->
                        </el-select>
                      </el-form-item>

                      <el-form-item prop="account" >
                        <el-input ref="account" v-model="loginForm.account" :placeholder="$t('login.username')"
                          name="account" type="text" tabindex="1" autocomplete="on" prefix-icon="el-icon-user"
                          size="large" @change="getConfig"></el-input>
                      </el-form-item>
                      <!-- <el-form-item class="rule-tip">{{$t('login.rule')}}</el-form-item> -->
                      <el-tooltip v-model="capsTooltip" :content="$t('login.upper')" placement="right" manual>
                        <el-form-item prop="password">
                          <el-input ref="password" v-model="loginForm.password" show-password
                            :placeholder="$t('login.password')" name="password" tabindex="2" autocomplete="on"
                            @keyup.native="checkCapslock" @blur="capsTooltip = false" prefix-icon="el-icon-lock"
                            size="large"></el-input>
                        </el-form-item>
                      </el-tooltip>
                      <el-form-item prop="code" v-if="needCode">
                        <el-row type="flex" justify="space-between">
                          <el-col class="sms-input">
                            <el-input v-model="loginForm.code" :placeholder="$t('login.codeTip')" name="code"
                              autocomplete="on" prefix-icon="el-icon-key" size="large">
                            </el-input>
                          </el-col>
                          <el-col class="sms-right code-right">
                            <el-tooltip :content="$t('login.changeCode')" placement="bottom">
                              <img id="imgcode" :alt="$t('login.changeCode')" :src="define.comUrl+imgUrl"
                                @click="changeImg">
                            </el-tooltip>
                          </el-col>
                        </el-row>
                      </el-form-item>
                      <el-button :loading="loading" type="primary" class="login-btn" size="large"
                        @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

                    </el-form>

                    <div v-show="active==2" class="login-form-QRCode">
                      <img class="qrcode-img" src="@/assets/images/login_qr.png">
                      <p class="qrcode-tip"><br>正在测试,敬请期待</p>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>

    <p class="componey"><i class="icon-ym icon-ym-lianxi"/>　0574-89079512　　　<a href="http://nbjuxuan.com/" target="_blank">{{sysConfig.copyright}}</a>　　　备案号：<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备12041571号-2</a></p>
  </div>
</template>

<script>
import { getConfig } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        sys:'1',
        account: '',
        password: '',
        code: '',
        origin: 'password'
      },
      loginRules: {
        account: [
          { required: true, trigger: 'blur', message: this.$t('login.accountTip') }
        ],
        password: [
          { required: true, trigger: 'blur', message: this.$t('login.passwordTip') }
        ],
        code: [
          { required: true, trigger: 'blur', message: this.$t('login.codeTip') }
        ],
      },
      imgUrl: "",
      timestamp: '',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      needCode: false,
      codeLength: 4,
      redirect: undefined,
      showTxt: false,
      otherQuery: {},
      active: 1,
      url:'http://www.nbjuxuan.com',
      companyName:'聚轩科技'

    }
  },
  computed: {
    sysConfig() {
      return this.$store.state.settings.sysConfig
    },
    loginLoading() {
      return this.$store.state.user.loginLoading
    }
  },
  watch: {
    loginLoading(val) {
      if (!val) this.loading = false
    },
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    console.log( this.$route.query.sys);
    this.loginForm.account = ''


    const _this = this
    document.onkeydown = function (e) {
      const { keyCode } = e
      if (keyCode === 13) {
        _this.handleLogin()
      }
    }
    if (this.needCode) this.changeImg()
  },
  mounted() {
    this.$store.commit('user/SET_LOGIN_LOADING', false)
    this.setShowTxt()
    window.onresize = () => {
      // this.setShowTxt()
    }
  },
  destroyed() {
    document.onkeydown = function (e) {
      const { keyCode } = e
      if (keyCode === 13) { }
    }
  },
  methods: {
    setShowTxt() {
      this.showTxt = true
      if (document.documentElement.clientHeight <= 840) {
        // this.showTxt = false
      } else {
        // this.showTxt = true
      }
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    getConfig(val) {
      if (!val) return
      getConfig(this.loginForm.account).then(res => {
        this.needCode = !!res.data.enableVerificationCode
        if (this.needCode) {
          this.codeLength = res.data.verificationCodeNumber || 4
          this.changeImg()
        }
      })
    },
    handleLogin() {
      if (this.loading) return
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.commit('user/SET_LOGIN_LOADING', true)
          const query = {
            ...this.loginForm,
            timestamp: this.timestamp
          }
          this.$store.dispatch('user/login', query).then(res => {
            this.$router.push({
              path: this.redirect || '/home',
              query: this.otherQuery
            })
          }).catch(() => {
            this.$store.commit('user/SET_LOGIN_LOADING', false)
          })
        } else {
          return false
        }
      })
    },
    changeImg() {
      let timestamp = Math.random()
      this.timestamp = timestamp
      this.imgUrl = `/api/oauth/ImageCode/${this.codeLength || 4}/${timestamp}`
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    // background-image: url('./login_bg.png') ;
    // background: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdingyue.nosdn.127.net%2FErJkwrWKC43YPrL2CDgnKv50hnLKy%3D7nQtwqRwE0%3DtxZp1536128831565compressflag.jpg&refer=http%3A%2F%2Fdingyue.nosdn.127.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671938755&t=af4b2bf6700b34086b71ac965498c2df') ;

    background-size: 100vw 100vh;



    .login-logo {
        margin: 16px 30px;
        height: 50px;
    }

    .body{
        // border-top: 3px solid #1890FF;
        // border-bottom: 3px solid #1890FF;


        .body_box{
            display: flex;
            margin: 0 auto;
            justify-content: center;
            align-items: center;


            .body_left{
                flex:1
            }
            .body_right{
                background: rgba(0,0,0,.3);
                border-radius: 3px;
                overflow: hidden;
                box-shadow: 5px 5px 5px black;
                width: 330px;
                min-width: 330px;
                height: 420px;

                .login-version {
                  // position: relative;
                  width: 117px;
                  height: 30px;
                  text-align:center;
                  background:orange;
                  margin-right:-28px;
                  margin-top:15px;
                  line-height: 30px;
                  color: #fff;
                  font-size: 16px;
                  font-weight:bold;
                  transform: rotate(45deg);
                }

                .login-form{
                    padding: 0 30px;
                    text-align: center;
                    .login-btn{
                        width: 100%;
                    }

                    .el-input__inner{
                        // width: 90%;
                        border-radius: 20px !important;
                    }
                    // el-form-item{
                    //     margin: 20px;
                    // }

                    .login-form-QRCode{
                        img{
                            padding: 10px;
                            background: white;
                            width: 180px;
                        }
                        .qrcode-tip{
                            color:white;
                        }
                    }
                }

                .login-tab {
                  height: 58px;
                  margin-bottom: 30px;
                  position: relative;
                  // font-weight: bold;
                  border-bottom: 1px solid rgba(0,0,0,0);

                  &::after {
                    position: absolute;
                    left: 0;
                    width: 50%;
                    height: 2px;
                    content: '';
                    display: block;
                    bottom: -1px;
                    background-color: silver;
                    z-index: 100;
                    transition: .5s;
                  }

                  &.active1 {
                    &::after {
                      left: 0;
                    }
                  }

                  &.active2 {
                    &::after {
                      left: 50%;
                    }
                  }


                  .item {
                    position: relative;
                    width: 50%;
                    font-size: 20px;
                    line-height: 58px;
                    color: silver;
                    display: inline-block;
                    height: 58px;
                    text-align: center;

                    &.active {
                      color: #1890ff;
                    }
                  }
                }

            }
        }

    }


}



.componey{color: silver;text-align: center;position: fixed;bottom: 10px;width: 100%;font-size: 14px !important; display: flex;align-items: center;justify-content: center;}

// div{border: 1px solid black;}
</style>
<style  scoped >
        .sel-item{
            width: 100%;
        }
        /deep/ .login-form .el-input__inner{
           height: 40px !important;
           border-radius:2px;
           background:rgba(255,255,255,.8)
       }
</style>
