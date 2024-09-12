<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:5px 0 5px 0">
        <el-radio-group v-model="listQuery.category" style="background-color:#fff;">
          <el-radio-button style="margin:2px 0;" v-for="item in categoryList" :key="item.enCode" :label="item.enCode">{{
            item.fullName }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="JNPF-common-layout-center">
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="tab-body">
            <div class="business-list">
              <div class="business-list__header">
                <div class="business-list__col-type business-list__header-item" style="justify-content:center">
                  单据类型
                </div>
                <div class="business-list__col-template business-list__header-item">
                  模板
                </div>
              </div>
              <div class="business-list__body">
                <!-- 渲染数据 -->
                <div class="business-list__body__item" v-for="item in currentData" :key="item.id">
                  <div class="business-list__col-type">
                    {{ item.fullName }}
                  </div>
                  <div class="business-list__col-type-right">

                    <!-- 单据 -->
                    <div>
                      <div class="business-list__col-template template-list">
                        <div class="template-item template-item__item">
                          单据
                        </div>
                        <template v-if="item.hasOwnProperty('list') && item.list.length">
                          <template v-for="line in item.list">
                            <!-- 1为单据 2 为小票 -->
                            <template v-if="line.type === 1">
                              <!-- 需要渲染 -->
                              <div class="template-item template-item__item" :class="line.enabledMark ? 'is-default' : ''"
                                :key="line.id">
                                <div :title="line.fullName" class="template-item__name"
                                  @click="addOrUpdateHandle(line.id)">
                                  <span>{{ line.fullName }}</span>
                                </div>
                                <div class="template-item__delete-btn" @click="handleDel(line.id)">
                                  <div class="icon-delete"></div>
                                </div>
                              </div>
                            </template>
                          </template>
                        </template>
                        <div class="template-item template-item__add-btn" @click="addOrUpdateHandle('',item.enCode,listQuery.category,1)">
                          <span class="el-icon-plus template-item__add-btn__text"></span>
                        </div>
                      </div>
                    </div>
                    <!-- 小票 -->
                    <div>
                      <div class="business-list__col-template template-list">
                        <div class="template-item template-item__item">
                          小票
                        </div>
                        <template v-if="item.hasOwnProperty('list') && item.list.length">
                          <template v-for="line in item.list">
                            <!-- 1为单据 2 为小票 -->
                            <template v-if="line.type === 2">
                              <!-- 需要渲染 -->
                              <div class="template-item template-item__item" :class="line.enabledMark ? 'is-default' : ''"
                                :key="line.id">
                                <div :title="line.fullName" class="template-item__name"
                                  @click="addOrUpdateHandle(line.id)">
                                  <span>{{ line.fullName }}</span>
                                </div>
                                <div class="template-item__delete-btn" @click="handleDel(line.id)">
                                  <div class="icon-delete"></div>
                                </div>
                              </div>
                            </template>
                          </template>
                        </template>
                        <div class="template-item template-item__add-btn" @click="addOrUpdateHandle('',item.enCode,listQuery.category,2)">
                          <span class="el-icon-plus template-item__add-btn__text"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <Preview :visible.sync="previewVisible" :id="activeId" />
  </div>
</template>

<script>
import { getPrintDevList, Delete, Copy, exportTpl, getPrintList } from '@/api/system/printDev'
import Form from './Form'
import Preview from './Preview'
import { getChildrenList } from '@/api/systemData/dictionary'
export default {
  name: 'system-printDev',
  components: { Form, Preview },
  data() {
    return {
      categoryList: [],
      currentData: [],
      dictionaryType: 'Salesmanagement',
      listQuery: {
        category: 'Salesmanagement',
      },
      listLoading: true,
      formVisible: false,
      previewVisible: false,
    }
  },
  created() {
    this.getChildrenListData()
    this.getDictionaryData(this.dictionaryType)
    this.initData()
  },
  watch: {
    'listQuery.category'(val) {
      this.getDictionaryData(val)
    }
  },
  methods: {

    mapPrintData(data, obj) {
      // 创建新数组
      var newData = data.map(item => {
        if (obj[item.enCode]) {
          return {
            ...item,
            list: obj[item.enCode]
          };
        }
        return item;
      });
      return newData
    },
    initData() {
      getPrintList(this.listQuery).then(res => {
        this.currentData = this.mapPrintData(this.currentData, res.data)
      }).catch(() => { })
    },
    getChildrenListData() {
      getChildrenList('600639172939682437').then(res => {
        this.categoryList = res.data
      })
    },
    getDictionaryData(type) {
      this.$store.dispatch('base/getDictionaryData', { sort: type }).then((res) => {
        this.currentData = res
        this.initData()
      })
    },

    addOrUpdateHandle(id,enCode,category,type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.categoryList, id,enCode,category,type)
      })
    },
    copy(id) {
      this.$confirm('您确定要复制该打印模板, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        Copy(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    exportTpl(id) {
      this.$confirm('您确定要导出该打印模板, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTpl(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    preview(id) {
      if (!id) return
      this.activeId = id
      this.previewVisible = true
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style lang="scss" scoped>
.JNPF-common-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .module-list {
    display: flex;

    .module-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 32px;
      font-size: 14px;
      color: #666;
      border: 1px solid #D9D9D9;
      cursor: pointer;
      transition: all .3s linear;
    }

    .module-selected {
      z-index: 1;
      color: #fff;
      background-color: #2F95FF;
      border-radius: 4px 4px 0 0;
      border: none;
    }
  }

  .tab-body {
    flex: 1;
    // margin-top: 16px;
    overflow-y: auto;
    padding: 0 10px;
    .business-list {
      border: 1px solid #E4E4E4;
      border-bottom: none;
      border-radius: 1px;

      .business-list__header {
        display: flex;
        flex-direction: row;
        background: #F8F8FA;
        border-bottom: 1px solid #E4E4E4;
        height: 40px;

        .business-list__header-item {
          font-size: 14px;
          color: #212121;
          font-weight: bold;
        }

        .business-list__col-type {
          display: flex;
          align-items: center;
          width: 210px;
          padding: 0 70px;
          // border-left: 1px solid #e4e4e4;
        }

        .business-list__col-template {
          align-items: center;
          padding: 0 24px;
          flex: 1;
          display: flex;
          border-left: 1px solid #E4E4E4;
        }
      }

      .business-list__body {
        font-size: 14px;
        color: #212121;

        .business-list__body__item {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #E4E4E4;

          .business-list__col-type {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 210px;
            // padding: 0 60px;
            // border-left: 1px solid #e4e4e4;
          }

          .business-list__col-type-right {
            flex: 1;

            .business-list__col-template {
              flex: 1;
              display: flex;
              border-left: 1px solid #E4E4E4;

              .template-item {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                margin: 8px 12px 8px 0;
                border-radius: 4px;
                cursor: pointer;
              }

              .template-item__item {
                position: relative;
                min-width: 110px;
                max-width: 178px;
                background-color: #F6F7F7;

                .template-item__name {
                  width: 100%;
                  height: 100%;
                  text-align: center;
                  padding: 0 12px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                &.is-default {
                  background-color: #eaf4ff !important;
                }

                .template-item__delete-btn {
                  display: none;
                  position: absolute;
                  top: -10px;
                  right: -10px;
                  width: 20px;
                  height: 20px;
                  padding: 2px;
                  transition: display .3s linear;

                  .icon-delete {
                    width: 16px;
                    height: 16px;
                    background: url(~@/assets/images/delete.png) center center no-repeat no-repeat;
                    background-size: cover;
                  }
                }

                &:hover {
                  .template-item__delete-btn {
                    display: block;
                  }
                }
              }


              .template-item__add-btn {
                width: 110px;
                background-color: #fff;
                border: 1px solid #E4E4E4;
                border-radius: 2px;
                color: #999;
                transition: all .3s linear;

                .template-item__add-btn__text {
                  font-size: 16px;
                }
              }

            }

            .template-list {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              padding: 0 24px;
            }
          }
        }
      }
    }

  }

}
</style>