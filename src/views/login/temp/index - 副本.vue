<template>
  <div class="login-container">
    <div v-if="sysConfig && sysConfig.sysVersion" class="login-version">
      <p class="login-version-text">{{ sysConfig.sysVersion }}</p>
    </div>
    <div class="login-left">
      <a class="login-company-logo" target="_blank" :href="url">
        <!--          <span style="font-size: 36px;color: white;font-weight: bold;">{{companyName}}</span>-->
        <img class="login-company-logo-img" src="@/assets/images/login-company-logo.png" alt="">
      </a>
      <img class="login-banner" src="@/assets/images/login-banner.png" alt="">
      <div v-if="showTxt" class="login-left-txt">
        <p class="title1">一套数字化平台，实现ERP、MES、WMS、机联网全集成，解决企业生产管理所有问题</p>
        <p class="title2">已帮助<span>200+</span>家企业完成数字化转型升级</p>
        <a class="link" target="_blank" :href="url">了解更多</a>
        <p class="componey">{{ sysConfig.copyright }}　　备案号：<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备12041571号-2</a>
        </p>
      </div>
    </div>
    <div class="login-content">
      <div class="login-form">
        <el-image
          v-if="sysConfig && sysConfig.loginIcon"
          class="login-logo"
          :src="define.comUrl+sysConfig.loginIcon"
        >
          <template slot="error">
            <img class="login-logo" src="@/assets/images/login_logo.png" alt="">
          </template>
        </el-image>
        <img v-else class="login-logo" src="@/assets/images/login_logo.png" alt="">
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
          <el-form-item class="rule-tip">{{ $t('login.rule') }}</el-form-item>
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
              <!-- @keyup.enter.native="handleLogin" -->
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

          <!-- <div class="login-form-QRCode" style="padding-top: 60px;">
              <img class="qrcode-img" src="@/assets/images/zgt.png" style="width: 120px;height: auto;">
              <p class="qrcode-tip">扫码下载安卓APP</p>
            </div> -->
          <!-- {{sysConfig}} -->
        </el-form>

        <div v-show="active==2" class="login-form-QRCode">
          <img class="qrcode-img" src="@/assets/images/login_qr.png">
          <p class="qrcode-tip">正在测试,敬请期待</p>
        </div>
      </div>
    </div>
    <!--    <div class="login-foot">Copyright 宁波圣泽网络科技有限公司, All Rights Reserved. 沪ICP备17044791号-1-->
    <!--      助力企业和团队快速实现目标</div>-->
  </div>
</template>

<script>
import { getConfig } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
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
    .login-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .login-version {
        position: fixed;
        right: 0px;
        top: 0px;
        width: 82px;
        height: 82px;
        background: url('../../../assets/images/login_version.png') no-repeat center;
        background-size: 100%;

        .login-version-text {
          width: 82px;
          height: 82px;
          line-height: 50px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          transform: rotate(45deg);
        }
      }

      .login-left {
        flex: 1;
        height: 100%;
        background: #4393FA;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .login-company-logo {
          position: absolute;
          left: 0;
          top: 50px;
          display: block;
          height: 76px;
          padding-top: 18px;
          padding-left: 40px;
          width: 806px;
          max-width: 100%;
          margin-bottom: 82px;
          background: linear-gradient(270deg, rgba(67, 147, 250, 0.5) 0%, rgba(133, 182, 252, 0.5) 100%);

          .login-company-logo-img {
            height: 40px;
            position: fixed;
            left: 40px;
            top: 68px;
          }
        }

        .login-banner {
          display: block;
          width: 60vh;
          height: 50vh;
        }

        .login-left-txt {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 80px;
        }

        .title1 {
          text-align: center;
          font-size: 20px;
          line-height: 28px;
          color: #F8F8F8;
          font-weight: 700;
        }

        .title2 {
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #BCD7FA;
          margin: 12px 0 30px;
        }

        .link {
          margin: 30px auto 0;
          display: block;
          color: #fff;
          width: 88px;
          height: 40px;
          border: 1px solid #FFFFFF;
          opacity: 1;
          border-radius: 4px;
          line-height: 38px;
          text-align: center;
          font-size: 14px;
        }
      }

      .login-content {
        width: 600px;
        height: 100%;
        flex-shrink: 0;
        display: flex;
        // top: 100px;
        justify-content: center;
        align-items: center;
        position: relative;

        .login-cap {
          font-size: 26px;
          line-height: 38px;
          margin-bottom: 26px;
          color: #666666;
        }
      }

      .login-form {
        // height: 530px;
        width: 400px;
        // padding: 30px 0;
        border-radius: 6px;

        .sms-input {
          width: 260px;
        }

        .sms-right {
          width: 120px;

          &.code-right {
            height: 40px;
            cursor: pointer;
          }

          #imgcode {
            width: 100%;
            height: 40px;
          }

          .smsBtn {
            width: 100%;
          }
        }

        .login-logo {
          width: 100%;
          height: 36px;
          margin-bottom: 35px;
        }

        .login-tab {
          height: 58px;
          margin-bottom: 30px;
          position: relative;
          border-bottom: 1px solid #DCDFE6;

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

        .rule-tip {
          color: #a0acb7;
          font-size: 12px;
          line-height: 12px;
          text-align: left;

          >>>.el-form-item__content {
            line-height: 12px;
          }
        }

        .el-form {
          input:-webkit-autofill {
            box-shadow: 0 0 0px 1000px #fff inset !important;
            -webkit-text-fill-color: #606266 !important;
          }

          input::-webkit-input-placeholder {
            color: #a0acb7;
          }

          .login-btn {
            width: 100%;
            font-size: 16px;
            margin-top: 12px;
          }

          .foot {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #188ae2;

            .register,
            .forget {
              cursor: pointer;
            }
          }
        }

        .login-form-QRCode {
          width: 100%;
          text-align: center;

          .qrcode-img {
            position: relative;
            margin-bottom: 18px;
            width: 220px;
            height: 220px;
          }

          .qrcode-tip {
            color: #334d65;
            line-height: 22px;
            font-size: 16px;
            text-align: center;
          }
        }
      }

      .login-foot {
        position: absolute;
        width: 1060px;
        color: #999;
        font-size: 12px;
        position: fixed;
        bottom: 20px;
        left: 31%;
        text-align: left;
        margin-left: 110px;
      }
    }
    .componey{color: white;text-align: center;position: fixed;bottom: 10px;width: calc( 100vw - 600px );font-size: 14px !important;}

</style>
