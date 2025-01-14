<template>
    <div class="right-menu">
        <el-tooltip content="收藏" placement="bottom">
            <i class="el-icon-star-off right-menu-item hover-effect" @click="openAddList()"
                :class="{ 'twinkle': isTwinkle }"></i>
        </el-tooltip>
        <el-tooltip content="收藏夹" placement="bottom">
            <i class="el-icon-collection right-menu-item hover-effect" @click="openRouterList()"
                :class="{ 'twinkle': isTwinkle }"></i>
        </el-tooltip>
        <!-- <template v-if="device !== 'mobile'"> -->
        <template v-if="showSearch">
            <search id="header-search" class="right-menu-item hover-effect" />
        </template>
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
        <el-tooltip :content="$t('navbar.chat')" placement="bottom">
            <i class="icon-ym icon-ym-header-IM right-menu-item hover-effect" @click="openUserList()"
                :class="{ 'twinkle': isTwinkle }"></i>
        </el-tooltip>
        <el-tooltip :content="$t('navbar.notice')" placement="bottom">
            <div class="right-menu-item hover-effect" @click="$refs.MessageList.init()">
                <el-badge :value="messageCount" :hidden="!messageCount" :max="99">
                    <i class="icon-ym icon-ym-header-message"></i>
                </el-badge>
            </div>
        </el-tooltip>
        <div class="right-menu-item hover-effect">
            <i @click="enter_full_screen" v-if="!full" class="ym-custom ym-custom-fullscreen"
                style="font-size:26px"></i>
            <i @click="exitFullscreen" v-else class="ym-custom ym-custom-fullscreen-exit" style="font-size:26px"></i>
        </div>
        <!-- <template v-if="showLanguage">
                <lang-select class="right-menu-item hover-effect" />
            </template> -->
        <template v-if="showSwitch">
            <system-select class="right-menu-item hover-effect" key="system-select" />
        </template>
        <!-- </template> -->
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger='click'>
            <div class="avatar-wrapper">
                <el-avatar :size="26" :src="define.comUrl + userInfo.headIcon" class="user-avatar"
                    v-if="userInfo.headIcon" />
                <span>{{ userInfo.userName }}</span>
                <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <router-link to="/profile">
                    <el-dropdown-item>
                        <i class="icon-ym icon-ym-header-userInfo"></i>{{ $t('navbar.profile') }}
                    </el-dropdown-item>
                </router-link>
                <!-- <el-dropdown placement="right-start" v-if="userInfo.systemIds&&userInfo.systemIds.length>1">
                    <el-dropdown-item>
                        <i class="icon-ym icon-ym-systemToggle"></i>{{ $t('navbar.systemChange') }}
                    </el-dropdown-item>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in userInfo.systemIds" :key="item.id"
                            @click.native="changeMajor(item.id,'System')" :disabled="item.currentSystem"> <i
                                :class="item.icon"></i>{{item.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <!-- <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=dA0dGhkVHQcbEgA0BQVaFxsZ"
          target="_blank">
          <el-dropdown-item>
            <i class="icon-ym icon-ym-header-feedBack"></i>{{ $t('navbar.feedback') }}
          </el-dropdown-item>
        </a> -->
                <el-dropdown-item @click.native="visible = true">
                    <i class="icon-ym icon-ym-header-about"></i>{{ $t('navbar.about') }}
                </el-dropdown-item>
                <!-- <el-dropdown-item @click.native="visible2 = true">
                    <i class="icon-ym icon-ym-generator-card"></i>{{ $t('navbar.statement') }}
                </el-dropdown-item> -->
                <el-dropdown-item @click.native="lock">
                    <i class="icon-ym icon-ym-header-lockScreen"></i>{{ $t('navbar.lockScreen') }}
                </el-dropdown-item>
                <!-- <el-dropdown-item @click.native="downFileS">
                    <i class="icon-ym icon-ym icon-ym-dataInterface"></i>{{ $t('navbar.downFile') }}
                </el-dropdown-item> -->
                <el-dropdown-item divided @click.native="handleLogout">
                    <i class="icon-ym icon-ym-header-loginOut"></i>{{ $t('navbar.logout') }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip :content="$t('navbar.setting')" placement="bottom">
            <div class="right-menu-item hover-effect" @click="$refs.Settings.init()" v-if="showSettings">
                <i class="icon-ym icon-ym-header-pannel"></i>
            </div>
        </el-tooltip>
        <el-dialog title="关于平台" :close-on-click-modal="false" :visible.sync="visible" v-drag-dialog
            class="JNPF-dialog JNPF-dialog_center about-dialog" lock-scroll width="800px">
            <div class="about-dialog-main">
                <el-image :src="define.comUrl + sysConfig.logoIcon" class="about-logo"
                    v-if="sysConfig && sysConfig.logoIcon">
                    <template slot="error">
                        <img src="@/assets/images/jnpf.png" class="about-logo" />
                    </template>
                </el-image>
                <img src="@/assets/images/jnpf.png" class="about-logo" v-else />

                <div>
                    <p class="title"><a :href="sysConfig.companyUrl" target="_blank">{{ sysConfig.sysName }}</a></p>
                    <p>版本：{{ sysConfig.sysVersion }}</p>
                    <p>作者：{{ sysConfig.companyName }}</p>
                </div>
            </div>
            <!-- <p class="about-dialog-main-tip" style="line-height: 24px;text-indent:30px;padding-right: 30px;">
                {{sysConfig.sysDescription}}
            </p> -->
            <div style="margin-top: 30px;display: flex;">
                <template v-for="(item, index) in sysQrcode">
                    <div v-if="item.url" style="margin:0 40px;text-align: center;" :key="index">
                        <img :src="item.imgUrl" style="width: 120px;height: 120px;">
                        <p class="qrcode-tip">{{ item.name }}</p>
                    </div>
                </template>
            </div>

            <!-- <p class="about-dialog-main-tip">解放90%重复性的代码编写工作，让你更加专注于业务和体验！</p> -->
        </el-dialog>
        <el-dialog title="官方声明" :close-on-click-modal="false" :visible.sync="visible2" v-drag-dialog
            class="JNPF-dialog JNPF-dialog_center about-dialog" lock-scroll width="400px">
            <div class="about-dialog-main">
                <div>
                    本系统对外开放性体验产品，平台内所有数据为我司虚构的测试数据，是随机生成非敏感数据，所以严禁任何人在平台上修改数据内容、扭曲数据目的、传播或售卖测试数据，特此警告。
                </div>
            </div>
        </el-dialog>
        <MessageList ref="MessageList" @read='read' />
        <Settings ref="Settings" />
        <UserList ref="UserList" @changeTwinkle='changeTwinkle' />
        <AddList ref="AddList" @changeTwinkle='changeTwinkle' />
        <RouterList ref="RouterList" @changeTwinkle='changeTwinkle' />
    </div>
</template>

<script>
import {
    mapGetters,
    mapState
} from 'vuex'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import SystemSelect from '@/components/SystemSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import MessageList from './MessageList'
import Settings from './settings'
import UserList from './userList/UserList'
import AddList from '../components/routerList/add.vue'
import RouterList from '../components/routerList/routerList.vue'
import dragDialog from "@/directive/el-drag-dialog";
import ReconnectingWebSocket from 'reconnecting-websocket'
// import Notify from '@/utils/notify';
import {
    setMajor
} from '@/api/permission/userSetting'
export default {
    directives: {
        dragDialog
    },
    components: {
        Screenfull,
        SizeSelect,
        LangSelect,
        Search,
        MessageList,
        UserList,
        AddList,
        RouterList,
        Settings,
        activeIndex2: '2',
        SystemSelect
    },
    computed: {
        ...mapState({
            showLanguage: state => state.settings.showLanguage,
            showSearch: state => state.settings.showSearch,
            showSettings: state => state.settings.showSettings,
            showSwitch: state => state.settings.showSwitch,
        }),
        ...mapGetters(['device', 'userInfo']),
        sysConfig() {
            return this.$store.state.settings.sysConfig
        }
    },
    data() {
        return {
            visible: false,
            visible2: false,
            isTwinkle: false,
            messageCount: 0,
            notify: null,
            userList: [],
            full: false,
            sysQrcode: [{
                name: "下载安卓APP",
                url: 'http://10.10.67.113:3088/files/esnoo.apk',
                imgUrl: require('@/assets/images/ysApk.png')
            },
                // {
                //     name: "下载IOSAPP",
                //     url: this.$store.state.settings.sysConfig.iosURL
                // },
                // {
                //     name: "预览微信小程序",
                //     url: this.$store.state.settings.sysConfig.xsxURL
                // },
                // {
                //     name: "手机H5预览",
                //     url: this.$store.state.settings.sysConfig.h5URL
                // }

            ]
        }
    },
    watch: {
        isTwinkle(val) {
            // if (val) {
            //   this.notify.setTitle(true)
            // } else {
            //   this.notify.setTitle()
            // }
        }
    },
    created() {
        this.initWebSocket()
        this.initNotify()
        window.onresize = () => {
            if (!this.checkFull()) {
                // 退出全屏后要执行的动作 
                this.full = false;
            }
        };
    },
    mounted() {
        //这里是监听F11案件的
        window.addEventListener("keydown", this.KeyDown, true); // 监听按键事件
    },
    methods: {
        changeMajor(majorId, majorType) { //切换系统
            let query = {
                majorId,
                majorType
            }
            setMajor(query).then(res => {
                this.$message({
                    message: res.msg,
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                        this.$store.commit('user/SET_TOAST', false)
                        location.reload()
                    }
                })
            })
        },
        initWebSocket() {
            this.socket = this.$store.getters.socket || null
            if ('WebSocket' in window) {
                if (!this.socket) {
                    const webSocketUrl = `${this.define.WebSocketUrl}/${this.$store.getters.token}`
                    this.socket = new ReconnectingWebSocket(webSocketUrl)
                    this.$store.commit('user/SET_SOCKET', this.socket)
                }
                //添加事件监听
                let socket = this.socket
                socket.onopen = () => {
                    var onConnection = {
                        "method": "OnConnection",
                        "token": this.$store.getters.token,
                        "mobileDevice": false
                    }
                    socket.send(JSON.stringify(onConnection))
                }
                socket.onmessage = (event) => {
                    let data = JSON.parse(event.data)
                    if (data.method == 'initMessage') {
                        this.messageCount = data.unreadMessageCount + data.unreadNoticeCount
                        this.isTwinkle = !!data.unreadNums.length
                    }
                    //用户在线
                    if (data.method == 'Online') { }
                    //用户离线
                    if (data.method == 'Offline') { }
                    //消息推送（消息公告用的）
                    if (data.method == 'messagePush') {
                        this.messageCount += data.unreadNoticeCount
                        if (this.$refs.MessageList.visible) this.$refs.MessageList.init()
                    }
                    //用户过期
                    if (data.method == 'logout') {
                        if (this.socket) {
                            this.socket.close()
                            this.socket = null
                            this.$store.commit('user/SET_SOCKET', this.socket)
                        }
                        this.$message({
                            message: data.msg || '登录过期,请重新登录',
                            type: 'error',
                            duration: 1000,
                            onClose: () => {
                                this.$store.dispatch('user/resetToken').then(() => {
                                    location.reload()
                                })
                            }
                        })
                    }
                    //断开websocket连接
                    if (data.method == 'closeSocket') {
                        if (this.socket) {
                            this.socket.close()
                            this.socket = null
                            this.$store.commit('user/SET_SOCKET', this.socket)
                        }
                    }
                    //接收对方发送的消息
                    if (data.method == 'receiveMessage') {

                        // if (window.Notification && Notification.permission !== "granted") {
                        //     Notification.requestPermission(function(status) {
                        //         if (Notification.permission !== status) {
                        //             Notification.permission = status;
                        //         }
                        //     });
                        // }


                        // if (window.Notification && Notification.permission === "granted") {
                        //     // var n = new Notification("Hi!");

                        //     var mess = {
                        //         type: "basic",
                        //         title: "nidaye",
                        //         iconUrl: "https://cn-assets.gitee.com/assets/new_dashboard_guide-1fc95f6abb937b7e40808617fea8820f.gif",
                        //         message: data.formMessage
                        //     }
                        //
                        //     var n = new Notification(mess);
                        //     // n.created("ddd",mess)
                        // }
                        // if (status === "granted") {
                        //     var n = new Notification(data);
                        // }

                        //判断是否打开窗口
                        if (this.$refs.UserList && this.$refs.UserList.$refs.JNPFIm && this.$refs.UserList.$refs
                            .JNPFIm
                            .visible) {
                            if (this.$refs.UserList.$refs.JNPFIm.info.id === data.formUserId) {
                                let messItem = {
                                    userId: data.formUserId,
                                    messageType: data.messageType,
                                    message: data.formMessage,
                                    dateTime: this.jnpf.toDate(data.dateTime)
                                }
                                this.$refs.UserList.$refs.JNPFIm.addItem(messItem)
                                //更新已读
                                let updateReadMessage = {
                                    method: "UpdateReadMessage",
                                    formUserId: data.formUserId,
                                    token: this.$store.getters.token
                                }
                                socket.send(JSON.stringify(updateReadMessage))
                                this.$refs.UserList.updateReply(data)
                            } else {
                                this.$refs.UserList.updateReply(data, 1)
                                this.isTwinkle = true
                            }
                        } else {
                            function sendNotification() {
                                new Notification(data.realName + '：', {
                                    body: data.formMessage,
                                    icon: 'https://zhouguantong.com' + data.headIcon,
                                    silent: true,
                                    renotify: false

                                })
                            }
                            if (window.Notification.permission == "granted") { // 判断是否有权限
                                sendNotification();
                            } else if (window.Notification.permission != "denied") {
                                window.Notification.requestPermission(function (permission) { // 没有权限发起请求
                                    sendNotification();
                                });
                            }


                            this.$refs.UserList.updateReply(data, 1)
                            this.isTwinkle = true
                        }
                    }
                    //显示自己发送的消息
                    if (data.method == 'sendMessage') {
                        if (this.$refs.UserList.$refs.JNPFIm.info.id !== data.toUserId) return
                        //添加到客户端
                        let messItem = {
                            userId: data.UserId,
                            messageType: data.messageType,
                            message: data.toMessage,
                            dateTime: this.jnpf.toDate(data.dateTime)
                        }
                        this.$refs.UserList.updateLatestMessage(data)
                        this.$refs.UserList.$refs.JNPFIm.addItem(messItem)
                    }
                    //消息列表
                    if (data.method == 'messageList') {
                        this.$refs.UserList.$refs.JNPFIm.getList(data)
                    }
                }
            }
        },
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        handleLogout() {
            this.$confirm('您确定要退出应用程序吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.logout();
            }).catch(() => { });
        },
        downFileS() {
            window.open("/static/manual.pdf")
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            this.$router.push(`/login`)
        },
        lock() {
            this.$store.dispatch('user/setLock')
            this.$nextTick(() => {
                this.$router.push('/lockScreen')
            })
        },
        read(isAll) {
            if (isAll) {
                this.messageCount = 0
            } else {
                this.messageCount -= 1
                this.messageCount = this.messageCount >= 0 ? this.messageCount : 0
            }
        },
        openUserList() {
            this.$refs.UserList.init()
        },
        openAddList() {
            this.$refs.AddList.init()
        },
        openRouterList() {
            this.$refs.RouterList.init()
        },
        changeTwinkle(boo) {
            this.isTwinkle = boo
        },
        initNotify() {
            // this.notify = new Notify({
            //   message: '您有新消息',
            //   effect: 'flash', // flash | scroll
            //   interval: 1000
            // });
        },
        //进入全屏模式
        enter_full_screen() {
            this.full = true;
            document.documentElement.webkitRequestFullScreen();
        },
        //退出全屏模式
        exitFullscreen() {
            this.full = false;
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },
        //监听解决F11打开后无法esc退出同时退出全屏的按钮也失效问题。
        KeyDown(event) {
            if (event.keyCode === 122) {
                event.returnValue = false;
                this.enter_full_screen(); //这里方的是触发全屏的方法
            }
        },
        //监听ESC事件，解决点击按钮全屏后按ESC退出再点击按钮不生效问题。
        checkFull() {
            //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
            //火狐浏览器
            var isFull =
                document.mozFullScreen ||
                document.fullScreen ||
                //谷歌浏览器及Webkit内核浏览器
                document.webkitIsFullScreen ||
                document.webkitRequestFullScreen ||
                document.mozRequestFullScreen ||
                document.msFullscreenEnabled;
            if (isFull === undefined) {
                isFull = false;
            }
            return isFull;
        },
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    .right-menu {
        float: right;
        height: 100%;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #fff;
            vertical-align: text-bottom;
            line-height: 60px;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }

            ::v-deep .el-badge {
                line-height: 1;

                .el-badge__content {
                    top: -3px;
                }
            }

            >>>.icon-ym {
                font-size: 18px;
            }
        }

        .avatar-container {
            // margin-right: 30px;

            .avatar-wrapper {
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    vertical-align: top;
                    margin-top: 18px;
                    margin-right: 2px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 24px;
                    font-size: 18px;
                }

                span {
                    font-size: 14px;
                    line-height: 60px;
                }
            }
        }
    }
}

.about-dialog {
    &.JNPF-dialog.JNPF-dialog_center>>>.el-dialog .el-dialog__body {
        padding: 0 0 40px 0;
    }

    .about-dialog-main {
        display: flex;
        align-items: center;
        // height: 150px;
        padding: 0 30px;

        .about-logo {
            display: inline-block;
            width: 95px;
            height: 95px;
            line-height: 95px;
            text-align: center;
            border-radius: 10px;
            color: #fff;
            margin-right: 30px;
        }

        line-height: 24px;
    }

    .about-dialog-main-tip {
        font-size: 12px;
        padding-left: 30px;
        margin: 0;
    }

    .title {
        font-size: 16px;
        font-weight: 600;
    }
}

/* 定义keyframe动画，命名为blink */
@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 1;
    }

    50.01% {
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
}

.twinkle {
    animation: blink 0.5s linear infinite;
}
</style>
