<template>
  <div style="width:100vw;height:100vh;">
    <div class="login-container" v-show="isLogin">
      <div style="margin:0 auto;font-size:30px;">
        <span class='el-icon-loading'></span>
        <span> 跳转中…</span>
      </div>
    </div>
    <div class="login-container" v-show="!isLogin" v-if="loginpattern.pattern=='1'">

      <!-- <el-image class="login-bg" :src="" @load="bgload"></el-image> -->
      <el-image class="login-bg" :src="define.comUrl + loginpattern.loginBg" @load="bgload" v-show="isbgload"></el-image>
      <img class="login-bg" src="@/assets/images/login_bg.png" alt="" v-show="!isbgload" />
      <div class="body">
        <div style="opacity: .8;">
          <div v-for="(value, key) in berning" :key="key" :style="value" class="ber" :class="222"></div>
        </div>
        <div class="body_box">
          <div class="body_right">
            <div style="display: flex;justify-content: space-between;background:rgba(0, 0, 0, 0.6);height: 82px;align-items: center;">
              <div style='display:flex;font-size:34px;font-weight:bold;color:white;align-items: center;'>
                <el-image class="login-logo" :src="define.comUrl+loginpattern.loginIcon" v-if="loginpattern && loginpattern.loginIcon">
                  <template slot="error">
                    <img class="login-logo" src="@/assets/images/jnpf.png" alt="">
                  </template>
                </el-image>
                <!-- <template slot="error"> -->
                <!-- <img class="login-logo" src="@/assets/images/1-11.png" alt=""> -->
                <img class="login-logo" src="@/assets/images/jnpf.png" alt="" v-else>
                <!-- </template> -->
                <!-- </el-image> -->
                <!-- <img class="login-logo" src="@/assets/images/1-11.png" alt="" v-else> -->

                &nbsp;<span class="title">{{ aaa }}</span>
              </div>
              <!-- <img class="login-logo" :src="define.comUrl+sysConfig.loginIcon"> -->
              <div class="login-version">
                {{ sysConfig.sysVersion || 'V4.0.0' }}
              </div>
            </div>
            <div class="login-content">
              <div class="login-form">
                <div class="login-tab" :class="'active' + active">
                  <a class="item" :class="{ 'active': active == 1 }" @click="tableactive">{{
                    $t('login.title') }}</a>
                  <a class="item" :class="{ 'active': active == 2 }" @click="tabactive">{{
                    $t('login.scanTitle') }}</a>
                </div>
                <el-form v-show="active == 1" ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">
                  <!-- <el-form-item>
                                        <el-select class="sel-item" v-model="loginForm.sys" @change="getConfig"
                                            size="medium" v-show="showTenancy">
                                            <el-option v-for="(value, key) in tanants" :key="key" :value="value.enCode"
                                                :label="value.companyName"></el-option>
                                        </el-select>
                                    </el-form-item> -->
                  <el-form-item prop="busCode" v-show="isDomain">
                    <el-input ref="account" v-model="loginForm.busCode" :placeholder="$t('login.busCode')" name="busCode" type="text" tabindex="1" autocomplete="on" prefix-icon="el-icon-user" size="large" @change="getConfig">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="account">
                    <el-input ref="account" v-model="loginForm.account" :placeholder="$t('login.username')" name="account" type="text" tabindex="1" autocomplete="on" prefix-icon="el-icon-user" size="large" @change="getConfig">
                    </el-input>
                  </el-form-item>
                  <!-- <el-form-item class="rule-tip">{{$t('login.rule')}}</el-form-item> -->
                  <el-tooltip v-model="capsTooltip" :content="$t('login.upper')" placement="right" manual>
                    <el-form-item prop="password">
                      <el-input ref="password" v-model="loginForm.password" show-password :placeholder="$t('login.password')" name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" prefix-icon="el-icon-lock" size="large"></el-input>
                    </el-form-item>
                  </el-tooltip>
                  <el-form-item prop="code" v-if="needCode">
                    <el-row type="flex" justify="space-between">
                      <el-col class="sms-input">
                        <el-input v-model="loginForm.code" :placeholder="$t('login.codeTip')" name="code" autocomplete="on" prefix-icon="el-icon-key" size="large">
                        </el-input>
                      </el-col>
                      <el-col class="sms-right code-right">
                        <el-tooltip :content="$t('login.changeCode')" placement="bottom">
                          <img id="imgcode" :alt="$t('login.changeCode')" :src="define.comUrl + imgUrl" @click="changeImg">
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-button :loading="loading" type="primary" class="login-btn" size="large" @click.native.prevent="handleLogin">{{
                      $t('login.logIn') }}</el-button>

                </el-form>

                <div v-show="active == 2" class="login-form-QRCode">
                  <div @click="Refreshqrcode"><img src="@/assets/images/shuaxin.png" v-if="qrcodetype=='expire'"></div>
                  <div><img src="@/assets/images/ok.png" v-if="qrcodetype=='success'"></div>
                  <div id="qrcode" ref="qrCode" style="text-align:center" v-if="qrcodetype=='scancode'"></div>
                  <p class="qrcode-tip"><br>{{qrcodetip}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="componey">
        <i class="icon-ym icon-ym-lianxi" />
        &nbsp;&nbsp;
        {{ sysConfig.companyTelePhone ? sysConfig.companyTelePhone : "0574-89079512" }}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        备案号：<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备12041571号-2</a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a :href="(sysConfig.companyUrl ? sysConfig.companyUrl : 'http://www.nbjuxuan.com')" target="_blank">{{
          sysConfig.copyright ? sysConfig.copyright : "Copyright @ 2012 宁波聚轩信息科技有限公司版权所有" }}</a>
        <!-- <a :href="(sysConfig.companyUrl ? sysConfig.companyUrl : 'http://www.nbjuxuan.com')" target="_blank">{{"Copyright @ 2012 浙江聚果工业互联网科技有限公司版权所有"}}</a> -->
      </p>
    </div>
    <div class="login-container2" v-show="!isLogin" v-else>
      <el-image class="login-bg" :src="define.comUrl + loginpattern.loginBg" v-if="loginpattern && loginpattern.loginBg" @load="bgload" v-show="isbgload"></el-image>
      <img class="login-bg" src="@/assets/images/sybj.jpg" alt="" v-show="!isbgload" />
      <div class="body">
        <div style="opacity: .8;">
          <div v-for="(value, key) in berning" :key="key" :style="value" class="ber" :class="222"></div>
        </div>
        <div class="body_box">
          <div class="body-title">
            <el-image class="login-logo" :src="define.comUrl+loginpattern.loginIcon" v-if="loginpattern && loginpattern.loginIcon">
              <template slot="error">
                <img class="login-logo" src="@/assets/images/jnpf.png" alt="">
              </template>
            </el-image>
            <img class="login-logo" src="@/assets/images/jnpf.png" alt="" v-else><span class="title">{{aaa}}</span>
          </div>
          <div style="width:500px;height: 100vh;position: absolute;right: 0;top: 0;background-color: #fff;z-index: 100;overflow: hidden;">
            <div class="body_right" :style="{top:needCode?'370px':'336px'}">
              <div class="login-content">
                <div class="login-form">
                  <div class="login-tab" :class="'active' + active">
                    <a class="item" :class="{ 'active': active == 1 }" @click="tableactive">{{
                      $t('login.title') }}</a>
                    <a class="item" :class="{ 'active': active == 2 }" @click="tabactive">{{
                      $t('login.scanTitle') }}</a>
                  </div>
                  <div v-show="active == 1">
                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on"
                    label-position="left">
                    <el-form-item prop="busCode"  v-show="isDomain">
                      <el-input ref="account" v-model="loginForm.busCode" :placeholder="$t('login.busCode')"
                        name="busCode" type="text" tabindex="1" autocomplete="on" prefix-icon="el-icon-user"
                        size="large" @change="getConfig">
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="account">
                      <el-input ref="account" v-model="loginForm.account" :placeholder="$t('login.username')"
                        name="account" type="text" tabindex="1" autocomplete="on" prefix-icon="el-icon-user"
                        size="large" @change="getConfig">
                      </el-input>
                    </el-form-item>
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
                            <el-input v-model="loginForm.code" :placeholder="$t('login.codeTip')" name="code" autocomplete="on" prefix-icon="el-icon-key" size="large">
                            </el-input>
                          </el-col>
                          <el-col class="sms-right code-right">
                            <el-tooltip :content="$t('login.changeCode')" placement="bottom">
                              <img id="imgcode" :alt="$t('login.changeCode')" :src="define.comUrl + imgUrl" @click="changeImg">
                            </el-tooltip>
                          </el-col>
                        </el-row>
                      </el-form-item>
                      <div class="sms-password">
                        <el-switch v-model="value1" active-text="记住我">
                        </el-switch>
                        <a href="#">忘记密码?</a>
                      </div>
                      <el-button :loading="loading" type="primary" class="login-btn" size="large" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

                    </el-form>
                  </div>
                  <div v-show="active == 2" class="login-form-QRCode">
                    <div @click="Refreshqrcode"><img src="@/assets/images/shuaxin.png" v-if="qrcodetype=='expire'"></div>
                    <div><img src="@/assets/images/ok.png" v-if="qrcodetype=='success'"></div>
                    <div id="qrcode" ref="qrCode" style="text-align:center" v-if="qrcodetype=='scancode'"></div>
                    <p class="qrcode-tip"><br>{{qrcodetip}}</p>
                  </div>
                </div>
              </div>
              <div class="userxy">登录代表您已阅读并同意<a href='https://www.nbjuxuan.com/user_agreement.html' target="_blank">《用户协议》</a>和<a href='https://www.nbjuxuan.com/privacy_policy.html' target="_blank">《隐私政策》</a></div>
              <el-popover placement="bottom" width="172" trigger="hover">
                <img src="@/assets/images/qygzh.png" alt="">
                <div slot="reference" style="text-align:center;font-size:16px;cursor: pointer"><i class="el-icon-info"></i>公众号</div>
              </el-popover>
              <div v-show="active == 2" :style="{width: '100%',height: needCode?'141px':'72px',}"></div>
            </div>
            <div class="componey">
              <div>
                <i class="icon-ym icon-ym-lianxi" />
                &nbsp;
                {{ sysConfig.companyTelePhone ? sysConfig.companyTelePhone : "0574-89079512" }}
                <!-- <a :href="(sysConfig.companyUrl ? sysConfig.companyUrl : 'http://www.nbjuxuan.com')" target="_blank">{{"Copyright @ 2012 浙江聚果工业互联网科技有限公司版权所有"}}</a> -->
                &nbsp;&nbsp;&nbsp;&nbsp;
                备案号：<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备12041571号-2</a>
              </div>
              <a :href="(sysConfig.companyUrl ? sysConfig.companyUrl : 'http://www.nbjuxuan.com')" target="_blank">{{
              sysConfig.copyright ? sysConfig.copyright : "Copyright @ 2012 宁波聚轩信息科技有限公司版权所有" }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { setToken } from '@/utils/auth'
import {
  getConfig, getpattern
} from '@/api/user'
import { login, logout, getInfo, unlock } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      socket: null,
      intervalId: null,
      qrcodetype: 'scancode',
      qrcodetip: '请使用App进行扫码登录',
      value1: false,
      loginLeftText: '',
      loginLeftTopic: '',
      filteredList: [],
      aaa: '',
      argSys: this.GetQueryString("sys"),
      localSys: localStorage.getItem("sys"),
      loginForm: {
        sys: '',
        account1: '',
        account: '',
        password: '',
        code: '',
        origin: 'password',
        passCode: true,
        busCode: localStorage.getItem("sys"),
      },
      loginRules: {
        account: [{
          required: true,
          trigger: 'blur',
          message: this.$t('login.accountTip')
        }],
        password: [{
          required: true,
          trigger: 'blur',
          message: this.$t('login.passwordTip')
        }],
        code: [{
          required: true,
          trigger: 'blur',
          message: this.$t('login.codeTip')
        }],
        busCode: [{
          required: true,
          trigger: 'blur',
          message: this.$t('login.busCodeTip')
        }],
      },
      imgUrl: "",
      timestamp: '',
      capsTooltip: false,
      loading: false,
      needCode: false,
      codeLength: 4,
      redirect: undefined,
      otherQuery: {},
      active: 1,
      isTenancy: false,
      showTenancy: false,
      sysConfig: {},
      tanants: [],
      berning: [],
      isbgload: false,
      isLogin: true,
      loginpattern: {},
      isDomain:true
    }
  },
  computed: {
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
        let aaa = ''
        if (location.host.substring(0, 3) === 'jlw') {
          this.aaa = '机联网'
          aaa = 'iot'
        } else {
          aaa = 'zgt'
          this.aaa = '轴管通'
        }
        localStorage.setItem('aaa', aaa)
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
          delete this.otherQuery.sys;
          delete this.otherQuery.pass;
          delete this.otherQuery.uname;
        }
      },
      immediate: true,
    }
  },
  created() {
      // 判断是否是域名 是域名进行截取 不是域名 放开企业代码
      function isValidIP(ip) {
          const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          return ipRegex.test(ip);
      }

      function extractHost(url) {
          const urlPattern = /^(?:http[s]?:\/\/)?([^:/]+)/;
          const match = url.match(urlPattern);
          return match ? match[1] : null;
      }

      function classifyUrl(url) {
          const host = extractHost(url);
          if (host) {
              if (host === 'localhost') {
                  return 'localhost';
              } else if (isValidIP(host)) {
                  return 'IP';
              } else {
                  return 'Domain';
              }
          }
          return 'Invalid URL';
      }
      const result = classifyUrl(location.origin);
      console.log(result);
      
    
    if (result === 'Domain'){
      const url = location.origin;
      // const url = 'http://zgt_zy.test.zgt.nbjuxuan.com/';
      const regex = /http:\/\/([^\.]+)/;
      const match = url.match(regex);

      if (match) {
          const result = match[1]; // 捕获组中的内容
          console.log(result); // 输出: zgt_zy
          this.isDomain = false;
          this.loginForm.busCode = result
      }
    }else{
      this.isDomain = true
    }
   
    this.berning = []
    for (var i = 0; i < 5; i++) {
      let x = Math.floor(Math.random() * 80)
      let y = Math.floor(Math.random() * 80)
      let s = Math.floor(Math.random() * 300 + 50)
      let dir = 'ber' + Math.round(Math.random())
      let bers = {
        width: s + 'px',
        height: s + 'px',
        left: x + 'vw',
        top: y + 'vh'
      }
      // this.berning.push(bers);
    }

    let uname = this.GetQueryString("uname")
    let pass = this.GetQueryString("pass")


    this.loginForm.sys = this.argSys ? this.argSys : this.localSys
    getpattern().then(res => {
      for (let key in res.data) {
        res.data[key] = res.data[key].replace(new RegExp('\"', 'g'), '')
      }
      this.loginpattern = res.data
      this.isbgload = false
      this.isLogin = false
    })
    // getConfig('isTenancy').then(res => {


    //     this.isTenancy = res.data.tenancy
    //     this.tanants = res.data.tanants
    //     if (this.argSys && uname && pass) {
    //         this.isLogin = true

    //         this.loginForm.account = uname
    //         this.loginForm.password = pass
    //         this.loginForm.account1 = this.loginForm.sys + "@" + this.loginForm.account

    //         this.handleLogin()
    //     } else {
    // this.isLogin = false;
    this.loginForm.account1 = this.loginForm.busCode + "@" + this.loginForm.account
    //         if (this.isTenancy) {
    //             this.showTenancy = (this.argSys == 'all' || location.host.indexOf("localhost") > -1 || '默认展示租户')
    //             if (this.showTenancy) {
    //                 // this.loginForm.sys = res.data.tanants[0].enCode
    //             } else {
    //                 this.loginForm.sys = this.argSys ? this.argSys : this.localSys
    //             }

    //         }
    //         this.getConfig('lbq')

    //     }

    // })
    this.changeImg()
    // this.loginForm.account = ''
    const _this = this
    document.onkeydown = function (e) {
      const {
        keyCode
      } = e
      if (keyCode === 13) {
        _this.handleLogin()
      }
    }
    if (this.needCode) this.changeImg()
  },
  mounted() {
    this.$store.commit('user/SET_LOGIN_LOADING', false)
    window.onresize = () => {

    }
  },
  destroyed() {
    document.onkeydown = function (e) {
      const {
        keyCode
      } = e
      if (keyCode === 13) { }
    }
  },
  methods: {
    tableactive() {
      this.active = 1
      this.socket.close()
      clearInterval(this.intervalId)
      this.qrcodetype = 'scancode'
      this.qrcodetip = '请使用App进行扫码登录'
    },
    //刷新二维码
    Refreshqrcode() {
      this.qrcodetype = 'scancode'
      this.qrcodetip = '请使用App进行扫码登录'
      this.$nextTick(() => {
        this.tabactive()
      })
    },
    tabactive() {
      this.active = 2
      let uuid = this.generateUUID().replace(/-/g, "")
      this.$refs.qrCode.innerHTML = "";
      let qrcode = new QRCode(this.$refs.qrCode, {
        width: 180,
        height: 180, // 高度
        text: uuid, // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
        correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      })
      if ('WebSocket' in window) {
        let that = this
        const webSocketUrl = `${this.define.WebSocketqrcode}api/oauth/websocket/${uuid}`
        this.socket = new WebSocket(webSocketUrl)
        this.socket.onopen = () => {
          this.intervalId = setInterval(function () {
            that.socket.send("123")
          }, 3000)
        }
        // 收到消息时执行的回调函数
        this.socket.onmessage = function (event) {
          if (event.data === 'EXPIRED') {
            clearInterval(that.intervalId);
            that.socket.close()
            that.qrcodetype = 'expire'
            that.qrcodetip = '请刷新二维码'
            // 处理心跳响应
          } else if (event.data === 'SCANNED') {
            clearInterval(that.intervalId);
            that.qrcodetype = 'success'
            that.qrcodetip = '请在App上授权操作'
            // 处理其他消息
          } else if (event.data === 'NORMAL') {

          } else {
            let data = JSON.parse(event.data)
            const layoutList = ['classic', 'functional', 'plain', 'blend']
            let layoutType = data.theme && layoutList.indexOf(data.theme) > -1 ? data.theme : 'classic'
            that.$store.commit('user/SET_TOKEN', data.token)
            that.$store.commit('settings/CHANGE_SETTING', { key: "layoutType", value: layoutType }, { root: true })
            setToken(data.token)
            if (data.tenantId == 'ys') {
              localStorage.setItem('aaa', 'zgt')
            } else if (data.tenantId == 'jz') {
              localStorage.setItem('aaa', 'jz')
            }
            getInfo("").then(response => {
              localStorage.setItem('qhxt', false)
              that.$store.commit('jx/SET_LOGO')
              localStorage.setItem("sys", data.tenantId)
              location.href = location.origin + '/' + response.data.systemVO.homeAdress
            }).catch(error => {
              that.$store.commit('user/SET_LOGIN_LOADING', false)
            })
            that.socket.close()
          }
        };
        // 连接关闭时执行的回调函数
        this.socket.onclose = function (event) {
          clearInterval(that.intervalId)
        };

        // 处理错误
        this.socket.onerror = function (error) {
          clearInterval(that.intervalId)
        };
      }

    },
    //生成唯一id
    generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    },
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    },
    bgload() {
      this.isbgload = true
    },

    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    getConfig(val) {
      if (!this.loginForm.busCode || !this.loginForm.account) return
      if (this.isTenancy) {
        if (this.loginForm.sys == '') return
        this.loginForm.account1 = this.loginForm.busCode + '@' + (this.loginForm.account ? this.loginForm.account : 'admin')
      } else {
        this.loginForm.account1 = this.loginForm.busCode + '@' + this.loginForm.account
      }
      if (!val) return


      getConfig(this.loginForm.account1).then(res => {
        this.needCode = !!res.data.enableVerificationCode
        if (this.needCode) {
          this.codeLength = res.data.verificationCodeNumber || 4
        }
        this.sysConfig = res.data.baseSystemInfo
        this.isbgload = false
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
            account: this.loginForm.account1,
            timestamp: this.timestamp,

          }
          this.$store.dispatch('user/login', query).then(res => {
            if (this.loginForm.sys == 'ys') {
              localStorage.setItem('aaa', 'zgt')

            } else if (this.loginForm.sys == 'jz') {
              localStorage.setItem('aaa', 'jz')

            }
            getInfo("").then(response => {
              localStorage.setItem('qhxt', false)
              this.$store.commit('jx/SET_LOGO')
              localStorage.setItem("sys", this.loginForm.busCode)
              if (['zgt_zy','zhongya'].includes(this.loginForm.busCode)) {
                localStorage.setItem('loginTenant', '0')
              } else if (['zgt_xzy','xzhongya'].includes(this.loginForm.busCode)) {
                localStorage.setItem('loginTenant', '1')
              } else {
                localStorage.setItem('loginTenant', '')
              }
              location.href = location.origin + '/' + response.data.systemVO.homeAdress
            }).catch(error => {
              this.$store.commit('user/SET_LOGIN_LOADING', false)

            })

            // location.reload()
            // this.$router.push({
            //   path: this.redirect ,
            //   query: this.otherQuery
            // })

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
.login-container {
  display: flex;
  flex-direction: column;
  // background-image:
  // 	linear-gradient(40deg,transparent 30%,  white 50%, transparent 70%),
  // 	linear-gradient(0deg, gray 0%, #ddd 100%);
  justify-content: center;
  height: 100%;
  background-size: 100vw 100vh;
  // background-image:url('./login_bg.png');

  .login-bg {
    position: absolute;
    z-index: 0;
    width: 100vw;
    height: 100vh;
    // object-fit: cover;
  }

  .ber {
    /* width: 10vw;
       height: 10vw; */
    z-index: 10;
    position: fixed;
    background-image: url('22.png');
    background-size: 100% 100%;
  }

  @keyframes im {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes imr {
    0% {
      transform: rotate(360deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  .ber::before {
    background-image: url('33.png');
    display: block;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    content: '';
    animation: im 10s linear infinite;
  }

  .login-logo {
    height: 50px;
    width: auto;
    margin-left: 30px;
    max-width: 241px;
  }

  .login-logo img {
    margin-left: 0px;
  }

  .body {
    .body_box {
      display: flex;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      .body_right {
        z-index: 100;
        // background: rgba(0,0,0,.1);
        background: rgba(255, 255, 255, 0.8);
        border-radius: 3px;
        overflow: hidden;
        border-left: 1px solid rgba(0, 0, 0, 0.6);
        box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.6);
        width: 360px;
        min-width: 360px;
        height: 480px;

        .login-version {
          width: 117px;
          height: 30px;
          text-align: center;
          background: orange;
          margin-right: -28px;
          margin-top: -19px;
          line-height: 30px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          transform: rotate(45deg);
        }

        .code-right {
          text-align: right;
        }

        .login-form {
          padding: 0 30px;
          text-align: center;

          .login-btn {
            width: 100%;
          }

          .el-input__inner {
            border-radius: 20px !important;
          }

          .login-form-QRCode {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
              width: 180px;
            }

            .qrcode-tip {
              color: black;
            }
            .qrcode-overlay {
              position: absolute;
              top: 0;
              left: 59;
              width: 180px;
              height: 180px;
              background-color: rgba(0, 0, 0, 0.8); /* 半透明蒙层 */
            }
          }
        }

        .login-tab {
          height: 58px;
          margin-bottom: 30px;
          position: relative;
          // font-weight: bold;
          border-bottom: 1px solid rgba(0, 0, 0, 0);

          &::after {
            position: absolute;
            left: 0;
            width: 50%;
            height: 2px;
            content: '';
            display: block;
            bottom: -1px;
            background-color: black;
            z-index: 100;
            transition: 0.5s;
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
            color: black;
            display: inline-block;
            height: 58px;
            text-align: center;

            &.active {
              color: #1890ff;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  .componey {
    color: white;
    text-align: center;
    position: fixed;
    bottom: 10px;
    width: 100%;
    font-size: 13px !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
<style scoped>
.sel-item {
  width: 100%;
}

/deep/ .login-form .el-input__inner {
  height: 40px !important;
  border-radius: 2px;
}

.body_right .title {
  white-space: nowrap;
  font-size: 26px;
}
</style>
<style lang="scss" scoped>
.login-container2 {
  display: flex;
  flex-direction: column;
  // background-image:
  // 	linear-gradient(40deg,transparent 30%,  white 50%, transparent 70%),
  // 	linear-gradient(0deg, gray 0%, #ddd 100%);
  justify-content: center;
  height: 100%;
  background-size: 100vw 100vh;
  // background-image:url('./login_bg.png');

  .login-bg {
    position: absolute;
    z-index: 0;
    width: calc(100vw - 500px);
    height: 100vh;
    // object-fit: cover;
  }

  .ber {
    /* width: 10vw;
       height: 10vw; */
    z-index: 10;
    position: fixed;
    background-image: url('22.png');
    background-size: 100% 100%;
  }

  @keyframes im {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes imr {
    0% {
      transform: rotate(360deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  .ber::before {
    background-image: url('33.png');
    display: block;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    content: '';
    animation: im 10s linear infinite;
  }

  .login-logo {
    height: 50px;
    width: auto;
    margin-left: 0px;
    max-width: 241px;
  }

  .login-logo img {
    margin-left: 0px;
  }

  .body {
    .body_box {
      display: flex;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      .body-title {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 99;
        display: flex;
        font-size: 24px;
        font-weight: bold;
        color: white;
        align-items: center;
      }
      .body_left {
        position: absolute;
        left: 50px;
        width: 480px;
        height: 400px;
        z-index: 99;
        overflow: hidden;

        p:nth-child(1) {
          color: orange;
          font-size: 44px;
          font-weight: bold;
        }

        p {
          font-size: 40px;
          line-height: 52px;
          color: #fff;
        }

        & > div:nth-child(3) {
          display: flex;
          padding: 10px 0;
        }
      }
      .componey {
        padding: 0 20px;
        color: #000;
        text-align: center;
        position: absolute;
        bottom: 20px;
        font-size: 13px !important;
        width: 100%;
      }
      .body_right {
        .userxy {
          padding: 30px 0;
          text-align: center;
          font-size: 14px;
          a {
            color: #1890ff;
          }
        }
        padding: 0 33px;
        position: absolute;
        // right: 50px;
        left: 50%;
        // top: 336px;
        transform: translate(-50%, -50%);
        z-index: 100;
        // background: rgba(0,0,0,.1);
        background: rgba(255, 255, 255, 0.8);
        border-radius: 0px;
        overflow: hidden;
        // border-left: 1px solid rgba(0, 0, 0, 0.6);
        // box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.6);
        width: 500px;
        min-width: 500px;
        // height: 570px;
        .title {
          white-space: nowrap;
          font-size: 26px;
          color: #000;
        }

        .login-version {
          width: 117px;
          height: 30px;
          text-align: center;
          background: orange;
          margin-right: -28px;
          margin-top: -19px;
          line-height: 30px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          transform: rotate(45deg);
        }

        .code-right {
          text-align: right;
        }

        .login-form {
          .sms-password {
            padding: 28px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            a {
              color: #1890ff;
              font-size: 14px;
            }
          }
          padding: 0 30px;
          text-align: center;

          .login-btn {
            width: 100%;
          }

          .el-input__inner {
            border-radius: 20px !important;
          }

          .login-form-QRCode {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
              width: 180px;
            }

            .qrcode-tip {
              color: black;
            }
            .qrcode-overlay {
              position: absolute;
              top: 0;
              left: 59;
              width: 180px;
              height: 180px;
              background-color: rgba(0, 0, 0, 0.8); /* 半透明蒙层 */
            }
          }
        }

        .login-tab {
          height: 58px;
          margin-bottom: 30px;
          position: relative;
          // font-weight: bold;
          border-bottom: 1px solid rgba(0, 0, 0, 0);

          &::after {
            position: absolute;
            left: 0;
            width: 50%;
            height: 2px;
            content: '';
            display: block;
            bottom: -1px;
            background-color: black;
            z-index: 100;
            transition: 0.5s;
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
            color: black;
            display: inline-block;
            height: 58px;
            text-align: center;

            &.active {
              color: #1890ff;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
