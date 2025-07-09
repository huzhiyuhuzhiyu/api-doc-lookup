<template>
  <el-drawer :visible.sync="drawer" direction="rtl" :with-header="false"
    class="drawer-container setting" size="299px">
    <el-divider>{{$t('settings.mode')}}</el-divider>
    <ul class="nav_items">
      <li v-for="(item1,index1) in imgUrl1" :key="index1" @click="checkList(item1)">
        <div class="imgItems">
          <div class="img">
            <img :src="item1.imgrurl" alt="">
            <div class="icon-checked" v-if="item1.layoutType===layoutType">
              <i class=" el-icon-check"></i>
            </div>
          </div>
        </div>
        <span>{{$t(`settings.${item1.layoutType}`)}}</span>
      </li>
      <li style="cursor: default;">
        <div class="imgItems"></div>
      </li>
    </ul>

    <el-divider>{{$t('settings.theme')}}</el-divider>
    <div class="colorList">
      <el-tooltip class="item" effect="dark" :content="$t(`settings.${item3.className}`)"
        placement="top" v-for="(item3,index3) in imgUrl3" :key="index3">
        <el-tag @click="checkList3(item3)" :color="item3.color">
          <i class="el-icon-check" v-if="item3.className===themeClass"></i>
        </el-tag>
      </el-tooltip>
    </div>
    <el-divider>{{$t('settings.head')}}</el-divider>
    <div class="colorList">
      <el-tooltip class="item" effect="dark" :content="$t(`settings.${item4.className}`)"
        placement="top" v-for="(item4,index4) in imgUrl4" :key="index4">
        <el-tag @click="checkList4(item4)" :color="item4.color">
          <i class="el-icon-check" v-if="item4.className===headClass"></i>
        </el-tag>
      </el-tooltip>
    </div>
    <el-divider>{{$t('settings.menu')}}</el-divider>
    <div class="colorList">
      <el-tooltip class="item" effect="dark" :content="$t(`settings.${item2.className}`)"
        placement="top" v-for="(item2,index2) in imgUrl2" :key="index2">
        <el-tag @click="checkList2(item2)" :color="item2.color">
          <i :class="['el-icon-check',slideClass === 'lightWhite' ? 'el-icon-check2' : '']" v-if="item2.className===slideClass"></i>
        </el-tag>
      </el-tooltip>
    </div>


    <el-divider>{{$t('settings.fontSize')}}</el-divider>
    <div class="drawer-item">
      <el-radio-group v-model="fontSize" @change="agreeChange">
          <el-radio label="small"><span style="font-size: 12px;">{{$t('settings.small')}}</span></el-radio>
          <el-radio label="middle"><span style="font-size: 14px;">{{$t('settings.middle')}}</span></el-radio>
          <el-radio label="big"><span style="font-size: 16px;">{{$t('settings.big')}}</span></el-radio>
      </el-radio-group>
    </div>
    <div class="drawer-item">
      <span>{{$t('settings.customFontSize')}}　</span>
      <el-input-number size="mini" :min=10 :max=24 v-model="fontSizeValue"  @change="agreeValueChange"></el-input-number>
    </div>


    <el-divider>{{$t('settings.otherSet')}}</el-divider>
    <div class="drawer-item">
      <span>{{$t('settings.tagsView')}}</span>
      <el-switch v-model="tagsView" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>{{$t('settings.tagsViewIcon')}}</span>
      <el-switch v-model="tagsIcon" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>{{$t('settings.cache')}}</span>
      <el-switch v-model="useCache" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>{{$t('settings.language')}}</span>
      <el-switch v-model="showLanguage" class="drawer-switch" />
    </div>
    <div class="drawer-item">
      <span>{{$t('settings.search')}}</span>
      <el-switch v-model="showSearch" class="drawer-switch" />
    </div>
    <!-- <a href="/static/manual.pdf" target="_blank">用户手册下载</a> -->
  </el-drawer>

</template>

<script>
import { UpdateTheme } from '@/api/permission/userSetting'
import themeColor from '@/assets/scss/theme.scss'
import headColor from '@/assets/scss/headSubject.scss'
import themeMinix from './minix'
export default {
  mixins: [themeMinix],
  name: 'Settings',
  data() {
    return {
      drawer: false,
      themeClass: '',
      fontSize:'middle',
      fontSizeValue:14,
      imgUrl1: [
        {
          imgrurl: require('@/assets/images/settings/classic.png'),
          name: '侧边导航',
          layoutType: 'classic'
        },
        {
          imgrurl: require('@/assets/images/settings/functional.png'),
          name: '顶部导航',
          layoutType: 'functional'
        },
        {
          imgrurl: require('@/assets/images/settings/blend.png'),
          name: '混合导航',
          layoutType: 'blend'
        },
        {
          imgrurl: require('@/assets/images/settings/plain.png'),
          name: '简约导航',
          layoutType: 'plain'
        }
      ],
      imgUrl2: [
        {
          name: '暗黑模式',
          className: 'dark',
          color:'#304156',
        },
        {
          name: '黑色模式',
          className: 'black',
          color:'#000000',
        },
        {
          name: '蓝黑模式',
          className: 'blueblack',
          color:'#1c253e',
        },
        {
          name: '亮白模式',
          className: 'lightWhite',
          color:'#fff',
        },
        {
          name: '黑灰模式',
          className: 'gray',
          color:'#394664',
        },
        {
          name: '深灰模式',
          className: 'darkgray',
          color:'#344058',
        },
        {
          name: '经典蓝',
          className: 'blues',
          color: '#1890ff',
        },
        {
          name: '玫紫',
          className: 'purples',
          color: '#722ED1',
        },
        {
          name: '海洋',
          className: 'oceans',
          color: '#13C2C2',
        },
        {
          name: '少女粉',
          className: 'girlPink',
          color: '#ED1299',
        },
      ],
      imgUrl3: [
        {
          name: '经典蓝',
          className: 'blue',
          color: themeColor.blueTheme,
        },
        {
          name: '玫紫',
          className: 'purple',
          color: themeColor.purpleTheme,
        },
        {
          name: '湛蓝',
          className: 'azure',
          color: themeColor.azureTheme,
        },
        {
          name: '玫粉',
          className: 'pick',
          color: themeColor.pickTheme,
        },
        {
          name: '海洋',
          className: 'ocean',
          color: themeColor.oceanTheme,
        },
        {
          name: '生机',
          className: 'green',
          color: themeColor.greenTheme,
        },
        {
          name: '丰收',
          className: 'yellow',
          color: themeColor.yellowTheme,
        },
        {
          name: '阳橙',
          className: 'orange',
          color: themeColor.orangeTheme,
        },
        {
          name: '热情',
          className: 'red',
          color: themeColor.redTheme,
        },
        {
          name: '樱桃红',
          className: 'cherryRed',
          color: themeColor.cherryRedTheme,
        },
      ],
      imgUrl4: [
        {
          name: '热情',
          className: 'black',
          color: headColor.blackHead,
        },
        {
          name: '生机',
          className: 'green',
          color: headColor.greenHead,
        },
        {
          name: '经典蓝',
          className: 'blue',
          color: headColor.blueHead,
        },
        {
          name: '玫紫',
          className: 'purple',
          color: headColor.purpleHead,
        },
        {
          name: '湛蓝',
          className: 'azure',
          color: headColor.azureHead,
        },
        {
          name: '海洋',
          className: 'ocean',
          color: headColor.oceanHead,
        },
        {
          name: '丰收',
          className: 'grey',
          color: headColor.greyHead,
        },
        {
          name: '阳橙',
          className: 'orange',
          color: headColor.orangeHead,
        },
        {
          name: '热情',
          className: 'red',
          color: headColor.redHead,
        },
        {
          name: '少女粉',
          className: 'girlPink',
          color: headColor.girlPinkHead,
        },
      ]
    }
  },
  computed: {
    defaultThemeClass() {
      return this.$store.state.settings.themeClass
    },
    defaultHeadClass() {
      return this.$store.state.settings.headClass
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    tagsIcon: {
      get() {
        return this.$store.state.settings.tagsIcon;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsIcon",
          value: val
        });
      }
    },
    showLanguage: {
      get() {
        return this.$store.state.settings.showLanguage;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showLanguage",
          value: val
        });
      }
    },
    showSearch: {

      get() {
        return this.$store.state.settings.showSearch;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSearch",
          value: val
        });
      }
    },
    useCache: {
      get() {
        return this.$store.state.settings.useCache;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "useCache",
          value: val
        });
      }
    },
    slideClass: {
      get() {
        return this.$store.state.settings.slideClass;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "slideClass",
          value: val
        });
      }
    },
    headClass: {
      get() {
        return this.$store.state.settings.headClass;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "headClass",
          value: val
        });
      }
    },
    layoutType: {
      get() {
        return this.$store.state.settings.layoutType;
      },
      set(val) {
        UpdateTheme({ theme: val }).then(res => {
        })
        this.$store.dispatch("settings/changeSetting", {
          key: "layoutType",
          value: val
        });
      }
    },
  },
  watch: {
    defaultThemeClass: {
      handler: function (val, oldVal) {
        // if (!val) return
        // this.themeClass = val
        // let activeItem = this.imgUrl3.filter(o => o.className === val)[0]
        // this.theme = activeItem && activeItem.color ? activeItem.color : "#1890ff"
      },
      immediate: true
    },
    defaultHeadClass: {
      handler: function (val, oldVal) {
        // if (!val) return
        // this.headClass = val
        // let activeItem = this.imgUrl4.filter(o => o.className === val)[0]
        // this.head = activeItem && activeItem.color ? activeItem.color : "#1890ff"
      },
      immediate: true
    },
  },
  created() {
    this.fontSize = localStorage.getItem('fontSize') ? localStorage.getItem('fontSize') : 'middle'
    this.fontSizeValue = localStorage.getItem('fontSizeValue') ? localStorage.getItem('fontSizeValue') : 14
  },
  methods: {
    init() {
      this.drawer = true
    },
    checkList(item) {
      if (item.layoutType === this.layoutType) return
      this.layoutType = item.layoutType
    },
    checkList2(item) {
      if (item.className === this.slideClass) return
      this.slideClass = item.className
    },
    checkList3(item) {
      if (item.className === this.themeClass) return
      this.$store.dispatch("settings/changeSetting", {
        key: "themeClass",
        value: item.className
      });
    },
    checkList4(item) {
      if (item.className === this.headClass) return
      this.$store.dispatch("settings/changeSetting", {
        key: "headClass",
        value: item.className
      });
    },
    fontSizeSave(){
      localStorage.setItem('fontSize',this.fontSize)
      localStorage.setItem('fontSizeValue',this.fontSizeValue)
      document.getElementsByTagName('body')[0].style.setProperty('--fSize', this.fontSizeValue+'px');
    },
    agreeChange(){
      switch (this.fontSize){
        case 'small':
          this.fontSizeValue = 12
          break;
        case 'middle':
          this.fontSizeValue = 14
          break;
        case 'big':
          this.fontSizeValue = 16
          break;
      }
      this.fontSizeSave()

    },
    agreeValueChange(){
      switch (this.fontSizeValue){
        case 12:
          this.fontSize = 'small'
          break;
        case 14:
          this.fontSize = 'middle'
          break;
        case 16:
          this.fontSize = 'big'
          break;
        default:
          this.fontSize = 'other'
          break;
      }
      this.fontSizeSave()

      // $(*).css("font-size",this.fontSizeValue)
    }
  }
}
</script>
<style scoped>
/deep/.el-drawer__body {
    padding: 30px 20px;
    overflow: auto;
    overflow-x: hidden;
  }
</style>
<style lang="scss" scoped>
.drawer-container {
  font-size: 14px;
  line-height: 1.5;
  z-index:4000 !important;
  word-wrap: break-word;
.el-drawer__body {
    padding: 30px 20px;
    overflow: auto;
    overflow-x: hidden;
  }
.nav_items {
        display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    li {
      list-style: none;
      text-align: center;
      display: flex;
      flex-direction: column;
      padding-bottom: 10px;
      cursor: pointer;
      width: 65px;
      .imgItems {
        position: relative;
        .img {
          width: 65px;
          height: 55px;
          border-radius: 10px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .icon-checked {
          display: block;
          width: 10px;
          height: 10px;
          border: 10px solid #409eff;
          border-left: 10px solid transparent;
          border-top: 10px solid transparent;
          border-bottom-right-radius: 10px;
          position: absolute;
          transform: scale(0.8);
          right: -1px;
          bottom: -1px;
          i {
            position: absolute;
            top: -2px;
            left: -3px;
            font-size: 12px;
            color: #fff;
            transform: scale(0.8);
          }
        }
      }
      span {
        font-size: 12px;
        color: #606266;
        margin-top: 10px;
      }
    }
  }
  .drawer-title {
    margin-bottom: 15px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    margin-top: 24px;
    font-weight: bolder;
  }

  .drawer-item {
    color: #606266;
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
  .colorList {
    padding: 10px 0;
    .el-tag {
      width: 20px;
      height: 20px;
      // border: none !important;
      margin-right: 4px;
      border-radius: 2px;
      cursor: pointer;
      padding: 0;
      text-align: center;
      vertical-align: top;
      border: 1px solid #ddd;
    }
    .el-icon-check {
      color: #fff;
      font-size: 16px;
      line-height: 20px;
    }
    .el-icon-check2 {
      color: #000;
    }
  }
}
</style>
