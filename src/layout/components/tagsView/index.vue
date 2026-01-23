<template>
  <div id="tags-view-container" class="tags-view-container">
    <el-link icon="icon-ym icon-ym-nav-prev" class="el-tabs__nav-prev el-tabs__btn"
      :underline="false" @click="prevBtn" />
    <el-link icon="icon-ym icon-ym-nav-next" class="el-tabs__nav-next el-tabs__btn"
      :underline="false" @click="nextBtn" />
    <el-link icon="icon-ym icon-ym-report-icon-arrow-down" class="el-tabs__nav-arrow el-tabs__btn"
      :underline="false" @click="handleArrowClick"/>
    <el-link :icon="fullScreen ? 'icon-ym icon-ym-compress-screen' : 'icon-ym icon-ym-full-screen1'" class="el-tabs__nav-screen el-tabs__btn"
      :underline="false" @click="handleFullScreen"/>
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span"
        class="tags-view-item" @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        <template v-if="tag.path==='/home'">
          <i :class="tag.meta.icon" class="tag-icon" v-if="tag.meta && tag.meta.icon"></i>
        </template>
        <template v-else>
          <i :class="tag.meta.icon" class="tag-icon"
            v-if="(tag.meta && tag.meta.icon )&& tagsIcon"></i><span>{{ generateTitle(tag.meta.title,tag.meta.zhTitle) }}</span>
        </template>
        <span v-if="!isAffix(tag)" class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <i class="el-icon-refresh-right"></i>
        <span class="menu-text">{{ $t('tagsView.refresh') }}</span>
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <i class="el-icon-close"></i>
        <span class="menu-text">{{ $t('tagsView.close') }}</span>
      </li>
      <li @click="closeOthersTags">
        <i class="el-icon-remove-outline"></i>
        <span class="menu-text">{{ $t('tagsView.closeOthers') }}</span>
      </li>
      <li @click="closeAllTags(selectedTag)">
        <i class="el-icon-circle-close"></i>
        <span class="menu-text">{{ $t('tagsView.closeAll') }}</span>
      </li>
      <li @click="openInNewWindow(selectedTag)">
        <i class="el-icon-document-add"></i>
        <span class="menu-text">{{ $t('tagsView.openInNewWindow') }}</span>
      </li>
    </ul>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import ScrollPane from './ScrollPane'
import { generateTitle } from '@/utils/i18n'
import path from 'path'
import { login, logout, getInfo, unlock } from '@/api/user'
import {windowOpen} from "echarts/lib/util/format";

export default {
  components: { ScrollPane },
  data() {
    return {
      fullScreen: false,
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    ...mapState({
      tagsIcon: state => state.settings.tagsIcon,
    }),
    visitedViews() {
      this.$store.state.tagsView.visitedViews = this.$store.state.tagsView.visitedViews.filter(item => item.path !== '/')
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    fullScreen(value) {
      if (value) {
        document.body.classList.add('full-screen-mode');
      } else {
        document.body.classList.remove('full-screen-mode');
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    openInNewWindow(view){
      if (!view || !view.fullPath) return
      const baseUrl = window.location.origin
      const fullUrl = `${ baseUrl }${ view.fullPath }`
      windowOpen(fullUrl, '_blank')
    },

    handleFullScreen() {
      this.fullScreen = !this.fullScreen
    },

    handleArrowClick(e) {
      if (this.visible) return this.closeMenu()
      e.stopPropagation();
      if (this.visitedViews.length === 0) return;

      const activeTag = this.visitedViews.find(tag => this.isActive(tag)) ||
        this.visitedViews[this.visitedViews.length - 1];

      const arrowBtn = document.querySelector('.el-tabs__nav-arrow');

      const rect = arrowBtn.getBoundingClientRect();
      const containerRect = this.$el.getBoundingClientRect();
      this.left = rect.left - containerRect.left - 130 + rect.width;
      this.top = rect.bottom + 5;

      this.visible = true;
      this.selectedTag = activeTag;
    },

    prevBtn() {
      const tags = this.$refs.tag;
      this.$refs.scrollPane.moveToTarget(tags[0]);
    },
    nextBtn() {
      const tags = this.$refs.tag;
      const lenght = tags.length;
      this.$refs.scrollPane.moveToTarget(tags[lenght - 1]);
    },
    generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      // return route.path === this.$route.path
      return route.fullPath === this.$route.fullPath
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        let { fullPath } = view
        // 对外链刷新的处理，：需要转义
        if (fullPath.indexOf(':') > -1) {
          fullPath = fullPath.replace('/', '')
          fullPath = '/' + encodeURIComponent(fullPath)
        }
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      const hasUnsaved = this.$unsavedGuard.get(view.fullPath);
      if (hasUnsaved) {
        const result = confirm('当前页面有未保存的内容，确定要关闭吗？');
        if (!result) return;
      }
      this.selectedTag = view
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
          this.$unsavedGuard.clear(view.fullPath);
        }
      })
    },
    closeOthersTags() {
      if (this.selectedTag.path !== this.$route.path) this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
        this.$unsavedGuard.clearAll();
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          getInfo("").then(response=>{

          // this.$router.push('/' + response.data.systemVO.homeAdress)
          location.href = location.origin + '/' + response.data.systemVO.homeAdress
              })
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 39px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #e8eaec;
  .el-tabs__btn {
    display: inline-block;
    width: 40px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    z-index: 10;
    position: absolute;

    &:hover {
      background-color: #f5f5f5;
    }

    &.el-tabs__nav-prev {
      left: 0;
      border-right: 1px solid #e8eaec;
    }

    &.el-tabs__nav-next {
      right: 80px;
      border-left: 1px solid #e8eaec;
    }

    &.el-tabs__nav-arrow {
      right: 40px;
      border-left: 1px solid #e8eaec;
    }

    &.el-tabs__nav-screen {
      right: 0;
      border-left: 1px solid #e8eaec;
    }

    >>> .icon-ym {
      font-size: 16px;
      color: #606266;
    }
  }
  .tags-view-wrapper {
    box-sizing: border-box;
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 38px;
      line-height: 38px;
      border-right: 1px solid #e8eaec;
      color: #606266;
      background-color: #fff;
      padding: 0 18px;
      font-size: 14px;
      .tag-icon {
        vertical-align: middle;
        font-size: 16px;
      }
      .tag-icon + span {
        line-height: 38px;
        vertical-align: middle;
        margin-left: 4px;
      }
      &:first-of-type {
        margin-left: 40px;
      }
      &:last-of-type {
        margin-right: 120px;
      }
      &:hover {
        color: #409eff;
      }
      &.active {
        background-color: #ebeef5;
        color: #409efe;
        height: 40px;
        &::after {
          position: absolute;
          left: 0;
          bottom: -1px;
          height: 1px;
          width: 100%;
          display: block;
          content: '';
          background: #ebeef5;
          z-index: 100;
        }
      }
      .el-icon-close {
        border-radius: 50%;
        text-align: center;
        position: relative;
        cursor: pointer;
        font-size: 12px;
        height: 16px;
        width: 16px;
        line-height: 16px;
        vertical-align: middle;
        top: 0px;
        right: -2px;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 6px 0;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 400;
    color: #606266;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid #e6e6e6;
    min-width: 160px;
    max-width: 280px;

    li {
      margin: 0;
      padding: 8px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.3s;

      &:hover {
        background: #f5f7fa;
        color: #409eff;
      }

      i {
        margin-right: 8px;
        font-size: 14px;
        flex-shrink: 0;
      }

      .menu-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
      }
    }

    li:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }
    li:nth-child(2),
    li:nth-child(3),
    li:nth-child(4) {
      &:hover {
        color: #f56c6c;
        background: #fef0f0;
      }
    }
  }
}
</style>

