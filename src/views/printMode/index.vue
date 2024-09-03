<template>
  <div class="JNPF-common-layout">
    <div class="tab-head">
      <div>
        <div class="module-list">
          <div class="module-item text" :class="index == 0 ? 'module-selected' : ''" v-for="(item, index) in tabList"
            :key="index">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-body">
      <div class="business-list">
        <div class="business-list__header">
          <div class="business-list__col-type business-list__header-item">
            单据类型
          </div>
          <div class="business-list__col-template business-list__header-item">
            模板
          </div>

        </div>

        <div class="business-list__body">
          <!-- 渲染数据 -->
          <div class="business-list__body__item">
            <div class="business-list__col-type">

            </div>
            <div class="business-list__col-type-right">
              <!-- 单据 -->
              <div>
                <div class="business-list__col-template template-list">
                  <div class="template-item template-item__item">
                    单据
                  </div>
                  <!-- 需要渲染 -->
                  <div class="template-item template-item__item is-default">
                    <div title="湛江市牧泰邦科技有限公司(默认)" class="template-item__name">
                      <span>湛江市牧泰邦科技有限公司(默认)</span>
                    </div>
                  </div>
                  <div class="template-item template-item__add-btn">
                    <span class="el-icon-plus template-item__add-btn__text"></span>
                  </div>
                </div>
              </div>
              <!-- 小票 -->
              <div></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'printMode',
  data() {
    return {
      tabList: [
        {
          label: '销货',
          value: '1'
        },
        {
          label: '销货',
          value: '2'
        },
        {
          label: '销货',
          value: '3'
        },
      ],
      categoryList:[]
    }
  },
  created() {
    this.getDictionaryData()
  },
  methods: {
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'PrintingBusiness' }).then((res) => {
        this.categoryList = res
        console.log(this.categoryList);
        
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.JNPF-common-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
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
    margin-top: 16px;
    overflow-y: auto;

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
            width: 210px;
            padding: 0 70px;
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
              }

              &.is-default {
                background-color: #eaf4ff;
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