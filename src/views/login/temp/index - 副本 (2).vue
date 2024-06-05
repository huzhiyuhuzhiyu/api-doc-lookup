<template>
  <div class="login-container" style="flex-direction: column;">
    <!-- <div class="login-version" v-if="sysConfig && sysConfig.sysVersion">
      <p class="login-version-text">{{sysConfig.sysVersion}}</p>
    </div> -->

    <!--    <div>

    </div>
    <div style="display:flex;border:1px solid black;">
        <div class="login-left" style="background:rgba(0,0,0,0);">
          <img class="login-banner" src="@/assets/images/login-banner.png" alt="">

        </div>

    </div>

 -->
    <div class="header">
      <div>
        <!-- <el-image v-if="sysConfig && sysConfig.loginIcon" class="login-logo" :src="define.comUrl+sysConfig.loginIcon">
          <template slot="error">
            <img class="login-logo" src="@/assets/images/login_logo.png" alt="">
          </template> -->
        <!-- </el-image> -->
        <!-- <img v-else class="login-logo" src="@/assets/images/login_logo.png" alt=""> -->
        <img class="login-logo" src="@/assets/images/login_logo.png"> 
      </div>
    </div>
    <div class="body">
      <div class="body_box">
        <div class="body_left">
          <img height="430" src="../login-center-left.png">
        </div>
        <div class="body_right">
          <div class="login-content">
            <div class="login-form">

              <div class="login-tab" :class="'active'+active">
                <a class="item" :class="{'active': active==1}" @click="active=1">{{ $t('login.title') }}</a>
                <a
                  class="item"
                  :class="{'active': active==2}"
                  @click="active=2"
                >{{ $t('login.scanTitle') }}</a>
              </div>
              <el-form
                v-show="active==1"
                ref="loginForm"
                :model="loginForm"
                :rules="loginRules"
                autocomplete="on"
                label-position="left"
              >
                <el-form-item>
                  <!-- <el-input ref="account" v-model="loginForm.account" :placeholder="$t('login.username')"
                            name="account" type="s" tabindex="1" autocomplete="on" prefix-icon="el-icon-user"
                            size="large" @change="getConfig"></el-input> -->
                  <el-select v-if="false" v-model="loginForm.sys" class="sel-item" size="medium">
                    <el-option value="1" label="222222" />
                  </el-select>
                </el-form-item>

                <el-form-item prop="account">
                  <el-input
                    ref="account"
                    v-model="loginForm.account"
                    :placeholder="$t('login.username')"
                    name="account"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    prefix-icon="el-icon-user"
                    size="large"
                    @change="getConfig"
                  />
                </el-form-item>
                <!-- <el-form-item class="rule-tip">{{$t('login.rule')}}</el-form-item> -->
                <el-tooltip v-model="capsTooltip" :content="$t('login.upper')" placement="right" manual>
                  <el-form-item prop="password">
                    <el-input
                      ref="password"
                      v-model="loginForm.password"
                      show-password
                      :placeholder="$t('login.password')"
                      name="password"
                      tabindex="2"
                      autocomplete="on"
                      prefix-icon="el-icon-lock"
                      size="large"
                      @keyup.native="checkCapslock"
                      @blur="capsTooltip = false"
                    />
                  </el-form-item>
                </el-tooltip>
                <el-form-item v-if="needCode" prop="code">
                  <el-row type="flex" justify="space-between">
                    <el-col class="sms-input">
                      <el-input
                        v-model="loginForm.code"
                        :placeholder="$t('login.codeTip')"
                        name="code"
                        autocomplete="on"
                        prefix-icon="el-icon-key"
                        size="large"
                      />
                    </el-col>
                    <el-col class="sms-right code-right">
                      <el-tooltip :content="$t('login.changeCode')" placement="bottom">
                        <img
                          id="imgcode"
                          :alt="$t('login.changeCode')"
                          :src="define.comUrl+imgUrl"
                          @click="changeImg"
                        >
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-button
                  :loading="loading"
                  type="primary"
                  class="login-btn"
                  size="large"
                  @click.native.prevent="handleLogin"
                >{{ $t('login.logIn') }}</el-button>

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
    <div class="footer">
      <p class="componey">{{ sysConfig.copyright }}　　备案号：<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备12041571号-2</a></p>
    </div>
  </div>
</template>

<script>
import { getConfig } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        sys: '1',
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
        ]
      },
      imgUrl: '',
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
      url: 'http://www.nbjuxuan.com',
      companyName: '聚轩科技'

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
      handler: function(route) {
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
    console.log(this.$route.query.sys)
    this.loginForm.account = ''

    const _this = this
    document.onkeydown = function(e) {
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
    document.onkeydown = function(e) {
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
      const timestamp = Math.random()
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
    height: 100%;
    .header{
        flex: 2;
        display: flex;
        width: 1180px;
        margin: 0 auto;
        // justify-content: flex-end;
        align-items: flex-end;
        .login-logo {
          height: 50px;
        }
    }
    .body{
        border-top: 3px solid #1890FF;
        border-bottom: 3px solid #1890FF;
        // background-image: url('../login_bg.jpg') ;

        .body_box{
            display: flex;
            height: 540px;
            width: 1180px;
            min-width: 1180px;
            margin: 0 auto;
            justify-content: center;
            align-items: center;

            .body_left{
                flex:1
            }
            .body_right{
                background: rgba(255,255,255, 0.8);
                width: 360px;
                padding: 20px 30px;
                height: 429px;
                margin-top: -4px;
                // border-radius: 3px;

                .login-form{
                    text-align: center;
                    .sel-item,.login-btn{
                        width: 100%;
                    }
                    .el-input__inner{
                        width: 90%;
                        border-radius: 0px !important;
                    }
                    // el-form-item{
                    //     margin: 20px;
                    // }

                    .login-form-QRCode img{
                        padding: 10px;
                        background: white;
                        width: 220px;
                    }
                }

                .login-tab {
                  height: 58px;
                  margin-bottom: 30px;
                  position: relative;
                  font-weight: bold;
                  border-bottom: 1px solid gray;

                  &::after {
                    position: absolute;
                    left: 0;
                    width: 50%;
                    height: 2px;
                    content: '';
                    display: block;
                    bottom: -1px;
                    background-color: #1890ff;
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
                    color: #666;
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
    .footer{
        flex: 2;
    }

}

.componey{color: gray;text-align: center;position: fixed;bottom: 10px;width: 100%;font-size: 14px !important;}

// div{border: 1px solid black;}
</style>
