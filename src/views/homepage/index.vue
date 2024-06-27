<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-25 17:32:00
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-26 13:28:24
 * @FilePath: \os-web-zgt4.0\src\views\homepage\index.vue
 * @Description: 企业首页
-->
<template>
  <div class="JNPF-common-layout">
    <div class="home-main">
      <div class="vux-flexbox xr-header vux-flex-row">
        <div class="xr-header__label">企业首页</div>
        <div data-v-157c22fc="" class="xr-header__ft" style="top: 0px;"></div>
      </div>
      <div class="body">
        <div class="vux-flexbox  vux-flex-row" style="align-items: stretch;">
          <div class="vux-flexbox-item" style="margin-left: 8px;">
            <!-- 第一块 -->
            <div class="section section-top-border">
              <div class="section-title">
                企业平台信息
                <i class="el-icon-question wk-help-tips"></i>
              </div>
              <div class="section-content progress-items">
                <div class="progress-item">
                  <el-progress :show-text="false" type="circle" :percentage="100">
                  </el-progress>
                  <div class="progress-item-content">
                    <div title="剩余天数" class="text-two-line">剩余天数</div>
                    <div>-3天</div>
                  </div>
                  <div class="progress-item-info">
                    <p title="租户起止时间" style="color: rgb(107, 119, 140);">租户起止时间</p>
                    <p>2024-06-07-2024-06-22</p>
                  </div>
                </div>
                <div class="progress-item">
                  <el-progress :show-text="false" type="circle" :percentage="100">
                  </el-progress>
                  <div class="progress-item-content">
                    <div title="剩余可用" class="text-two-line">剩余可用</div>
                    <div>不限人数</div>
                  </div>
                  <div class="progress-item-info">
                    <p title="账号使用情况" style="color: rgb(107, 119, 140);">账号使用情况</p>
                    <p>不限人数</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 快捷入口 -->
            <div class="section section-top-border">
              <div class="section-title">
                快捷入口
                <i class="el-icon-question wk-help-tips"></i>
              </div>
              <div class="section-content">
                <div class="vux-flexbox quick-item vux-flex-row" v-for="item in quickList" :key="item.title">
                  <div class="quick-item-icon">
                    <i :class="item.icon"></i>
                  </div>
                  <div class="quick-item-title">
                    <div>{{ item.title }}</div>
                    <div>{{ item.describe }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="vux-flexbox-item" style="margin-left: 8px;">
            <!-- 企业域名 -->
            <div class="section section-top-border">
              <div class="section-title">
                企业域名设置
                <i class="el-icon-question wk-help-tips"></i>
              </div>
              <el-radio-group v-model="domain">
                <el-radio label="secondDomain">二级域名</el-radio>
                <el-radio label="newDomain">新域名</el-radio>
              </el-radio-group>
              <div class="section-content is-base-top">
                <el-form>
                  <el-form-item class="is-success">
                    <el-input placeholder="您的站点名称" v-model="domainCon">
                      <template slot="suffix">.com</template>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-button type="primary" size="small" @click="submit">保存</el-button>
              </div>
            </div>
            <div class="section section-top-border">
              <div class="section-title">
                最新发布
                <i class="el-icon-question wk-help-tips"></i>
              </div>
              <div class="section-content is-message">
                <div class="message-content">
                  {{ newMessage }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateInstructions } from '@/api/system/system'
export default {
  name: 'homePage',
  data() {
    return {
      domain: 'secondDomain',
      domainCon: '',
      quickList: [
        {
          icon: 'icon-ym icon-ym-onlineUser',
          title: '客户管理',
          describe: '维护字段和布局',
        },
        {
          icon: 'icon-ym icon-ym-role',
          title: '审批流程管理',
          describe: '配置审批节点及流程',
        },
        {
          icon: 'icon-ym icon-ym-user',
          title: '员工与部门管理',
          describe: '配置公司员工与部门的组织架构',
        },
        {
          icon: 'icon-ym icon-ym-role',
          title: '角色权限管理-客户管理角色',
          describe: '配置不同角色不同员工的客户管理应用中权限',
        },
      ],
      newMessage: '暂无发布信息'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    submit() { },
    initData() {
      let query = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
      updateInstructions(query).then(res => {
        this.newMessage = res.data.records.length ? res.data.records[0].updateContent : '暂无发布信息'
      })
    },
  },
}
</script>


<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  .body {
    width: 1200px;
    overflow-x: auto;

    .vux-flexbox-item {
      box-sizing: border-box;
    }
  }
}

.vux-flexbox {
  display: flex;
  width: 100%;
  text-align: left;

  .vux-flexbox-item {
    flex: 1;

    &:first-child {
      margin-top: 0 !important;
      margin-left: 0 !important;
    }

    .section-top-border {
      padding: 24px;
      position: relative;
      border: 1px solid #dfe1e6;
      border-radius: 3px;

      &:before {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 4px;
        content: " ";
        background-color: #2684ff;
        border-radius: 2px;
      }
    }
  }
}

.section+.section {
  margin-top: 16px;
}

.is-base-top {
  margin-top: 8px;
}

.section-content .el-input {
  width: 300px;
}

.quick-item {
  padding: 16px;
  color: #42526e;
  cursor: pointer;
  border-radius: 3px;
  -webkit-box-shadow: rgba(9, 30, 66, .25) 0 1px 1px, rgba(9, 30, 66, .31) 0 0 1px;
  box-shadow: 0 1px 1px rgba(9, 30, 66, .25), 0 0 1px rgba(9, 30, 66, .31);

  .quick-item-title {
    font-size: 16px;
    color: #172b4d;
  }
}

.quick-item+.quick-item {
  margin-top: 16px;
}

.quick-item-icon {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  line-height: 40px;
  text-align: center;
  background-color: #0052cc;
  border-radius: 3px;

  i {
    font-size: 24px;
    color: #fff;
  }
}

.section-title {
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 700;

  .wk-help-tips {
    margin-left: 4px;
    color: #42526e;
    cursor: pointer;
    font-size: 14px;
  }
}

.is-message {
  line-height: 1.5;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.progress-items {
  display: flex;

  .progress-item {
    position: relative;
    width: 50%;
    text-align: center;
  }

  .progress-item-content {
    position: absolute;
    top: 50px;
    left: calc(50% - 40px);
    display: flex;
    flex-direction: column;
    width: 80px;

    .text-two-line {
      display: -ms-flexbox;
      display: flex;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .progress-item-info {
    font-size: 14px;
    line-height: 20px;
  }
}

.vux-flex-row {
  flex-direction: row;
}

.JNPF-common-layout {
  background-color: #fff;

  .home-main {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 24px 40px;
    align-items: stretch;
    flex-direction: column;
    text-align: left;
    overflow-x: auto;

    .xr-header {
      line-height: 32px;
      position: relative;

      .xr-header__label {
        font-size: 24px;
        font-weight: 500;
        color: #172b4d;
      }

      .xr-header__ft {
        position: absolute;
        right: 0;
      }
    }

    .body {
      position: relative;
      padding-bottom: 16px;
      margin-top: 16px;
      flex: 1;
    }
  }
}</style>