<template>
    <div style="width:100vw;height:100vh;">
        <div class="login-container" v-show="isLogin">
            <div style="margin:0 auto;font-size:30px;">
                <span class='el-icon-loading'></span>
                <span> 跳转中…</span>
            </div>
        </div>
        <div class="login-container" v-show="!isLogin">

            <!-- <el-image class="login-bg" :src="" @load="bgload"></el-image> -->
            <el-image class="login-bg" :src="define.comUrl + sysConfig.loginBg" @load="bgload" v-show="isbgload"></el-image>
            <img class="login-bg" src="@/assets/images/login_b_img1.jpg" alt="" v-show="!isbgload" />
            <div class="body">
                <div style="opacity: .8;">
                    <div v-for="(value, key) in berning" :key="key" :style="value" class="ber" :class="222"></div>
                </div>
                <div class="body_box">
                    <div class="body_right">
                        <div
                            style="display: flex;justify-content: space-between;background:rgba(0, 0, 0, 0.6);height: 82px;align-items: center;">
                            <div style='display:flex;font-size:34px;font-weight:bold;color:white;align-items: center;'>
                                <!-- <el-image class="login-logo" :src="define.comUrl+sysConfig.loginIcon" v-if="sysConfig && sysConfig.loginIcon"> -->
                                <!-- <template slot="error"> -->
                                <!-- <img class="login-logo" src="@/assets/images/1-11.png" alt=""> -->
                                <img class="login-logo" src="@/assets/images/jnpf2.png" alt="">
                                <!-- </template> -->
                                <!-- </el-image> -->
                                <!-- <img class="login-logo" src="@/assets/images/1-11.png" alt="" v-else> -->

                                &nbsp;<span class="title">{{ aaa }}</span>
                            </div>
                            <!-- <img class="login-logo" :src="define.comUrl+sysConfig.loginIcon"> -->
                            <div v-if="sysConfig && sysConfig.sysVersion" class="login-version">
                                {{ sysConfig.sysVersion }}
                            </div>
                        </div>
                        <div class="login-content">
                            <div class="login-form">
                                <div class="login-tab" :class="'active' + active">
                                    <a class="item" :class="{ 'active': active == 1 }" @click="active = 1">{{
                                        $t('login.title') }}</a>
                                    <a class="item" :class="{ 'active': active == 2 }" @click="active = 2">{{
                                        $t('login.scanTitle') }}</a>
                                </div>
                                <el-form v-show="active == 1" ref="loginForm" :model="loginForm" :rules="loginRules"
                                    autocomplete="on" label-position="left">
                                    <!-- <el-form-item>
                                        <el-select class="sel-item" v-model="loginForm.sys" @change="getConfig"
                                            size="medium" v-show="showTenancy">
                                            <el-option v-for="(value, key) in tanants" :key="key" :value="value.enCode"
                                                :label="value.companyName"></el-option>
                                        </el-select>
                                    </el-form-item> -->
                                    <el-form-item prop="busCode">
                                        <el-input ref="account" v-model="loginForm.busCode"
                                            :placeholder="$t('login.busCode')" name="busCode" type="text" tabindex="1"
                                            autocomplete="on" prefix-icon="el-icon-user" size="large" @change="getConfig">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="account">
                                        <el-input ref="account" v-model="loginForm.account"
                                            :placeholder="$t('login.username')" name="account" type="text" tabindex="1"
                                            autocomplete="on" prefix-icon="el-icon-user" size="large" @change="getConfig">
                                        </el-input>
                                    </el-form-item>
                                    <!-- <el-form-item class="rule-tip">{{$t('login.rule')}}</el-form-item> -->
                                    <el-tooltip v-model="capsTooltip" :content="$t('login.upper')" placement="right" manual>
                                        <el-form-item prop="password">
                                            <el-input ref="password" v-model="loginForm.password" show-password
                                                :placeholder="$t('login.password')" name="password" tabindex="2"
                                                autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false"
                                                prefix-icon="el-icon-lock" size="large"></el-input>
                                        </el-form-item>
                                    </el-tooltip>
                                    <el-form-item prop="code" v-if="needCode">
                                        <el-row type="flex" justify="space-between">
                                            <el-col class="sms-input">
                                                <el-input v-model="loginForm.code" :placeholder="$t('login.codeTip')"
                                                    name="code" autocomplete="on" prefix-icon="el-icon-key" size="large">
                                                </el-input>
                                            </el-col>
                                            <el-col class="sms-right code-right">
                                                <el-tooltip :content="$t('login.changeCode')" placement="bottom">
                                                    <img id="imgcode" :alt="$t('login.changeCode')"
                                                        :src="define.comUrl + imgUrl" @click="changeImg">
                                                </el-tooltip>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                    <el-button :loading="loading" type="primary" class="login-btn" size="large"
                                        @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

                                </el-form>

                                <div v-show="active == 2" class="login-form-QRCode">
                                    <img class="qrcode-img" src="@/assets/images/login_qr.png">
                                    <p class="qrcode-tip"><br>正在测试,敬请期待</p>
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
                <a :href="(sysConfig.companyUrl ? sysConfig.companyUrl : 'http://www.nbjuxuan.com')" target="_blank">{{
                    sysConfig.copyright ? sysConfig.copyright : "Copyright @ 2012 宁波聚轩信息科技有限公司版权所有" }}</a>
                <!-- <a :href="(sysConfig.companyUrl ? sysConfig.companyUrl : 'http://www.nbjuxuan.com')" target="_blank">{{"Copyright @ 2012 浙江聚果工业互联网科技有限公司版权所有"}}</a> -->
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                备案号：<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备12041571号-2</a>
            </p>
        </div>
    </div>
</template>

<script>
import {
    getConfig
} from '@/api/user'
export default {
    name: 'Login',
    data() {
        return {
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
                busCode:'',
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
            isLogin: true

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
            immediate: true
        }
    },
    created() {
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
                this.isLogin = false;
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
                        localStorage.setItem('qhxt', false)
                        this.$store.commit('jx/SET_LOGO')
                        localStorage.setItem("sys", this.loginForm.busCode)
                        location.reload()
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
        content: "";
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
                background: rgba(255, 255, 255, .8);
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
                        img {
                            width: 180px;
                        }

                        .qrcode-tip {
                            color: black;
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



.componey {
    color: white;
    text-align: center;
    position: fixed;
    bottom: 10px;
    width: 100%;
    font-size: 14px !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

// div{border: 1px solid black;}
</style>
<style scoped>
.sel-item {
    width: 100%;
}

/deep/ .login-form .el-input__inner {
    height: 40px !important;
    border-radius: 2px
}

.body_right .title {
    white-space: nowrap;
    font-size: 26px;
}
</style>
