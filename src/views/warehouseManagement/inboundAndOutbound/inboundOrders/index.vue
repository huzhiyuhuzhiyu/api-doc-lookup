<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="loading">
        <div class="card-wrapper">

          <el-card class="box-card first-card" shadow="hover" @click.native="handleLinkClick('其他')" v-if="cardList">
            <div class="view">
              <el-link type="primary">
                <span class="text">直接入库</span>
              </el-link>
            </div>
          </el-card>

          <el-card class="box-card" shadow="hover" v-for="item in cardList" :key="item.sourceType"
            @click.native="handleCardClick(item.sourceType)">

            <div slot="header" class="clearfix card-header">
              <span class="card-title">{{ item.sourceName }}</span>
              <span :class="['card-button', item.pendingCount != '0' ? 'hasPending' : '']" type="text">
                {{ item.pendingCount }}
              </span>
            </div>

            <template v-if="item.sourceType !== 'inbound_production'">
              <div v-for="o in item.lines" :key="o.docNo" class="text item">
                <el-link type="primary" @click.stop="handleLinkClick(o.docId, false, item.sourceType)">
                  <span class="text"> {{ o.docNo }} </span>
                </el-link>
              </div>
            </template>

            <div v-else ref="tabBox">
              <el-tabs tab-position="left" style="margin:-10px 0 0 -20px;height:140px;" @click.native.stop="tabClick"
                v-model="productionCard">
                <el-tab-pane label="生产订单" style="margin-top:10px;" name="order">
                  <div v-for="o in item.spaceLines[1]" :key="o.docNo" class="text item">
                    <!-- <el-link type="primary" @click.stop="handleLinkClick(o.docId, false, item.sourceType)"> -->
                    <el-link type="primary" @click.stop="productionClick(o.docId, 'order')">
                      <span class="text"> {{ o.docNo }} </span>
                    </el-link>
                  </div>
                  <span v-if="item.spaceLines[1].length === 0" class="text">暂无待办入库</span>
                </el-tab-pane>
                <el-tab-pane label="生产工单" style="margin-top:10px;" name="work">
                  <div v-for="o in item.spaceLines[0]" :key="o.docNo" class="text item">
                    <!-- <el-link type="primary" @click.stop="handleLinkClick(o.docId, false, item.sourceType)"> -->
                    <el-link type="primary" @click.stop="productionClick(o.docId, 'work')">
                      <span class="text"> {{ o.docNo }} </span>
                    </el-link>
                  </div>
                  <span v-if="item.spaceLines[0].length === 0" class="text">暂无待办入库</span>
                </el-tab-pane>
              </el-tabs>
            </div>

            <span v-if="item.lines.length === 0" class="text">暂无待办入库</span>
          </el-card>
        </div>
      </div>
    </div>

    <DirectForm v-if="directFormVisible" ref="DirectForm" @close="closeForm" :originTypeList="originTypeList" />
    <Form v-if="formVisible" ref="Form" @close="closeForm" :originTypeList="originTypeList" />
    <component :is="listPageComponent" v-if="listPageVisible" ref="ListPage" @close="closeForm"
      :originTypeList="originTypeList" />
  </div>
</template>
<script>
import { getStockOrdersCard } from '@/api/warehouseManagement/inboundAndOutbound'
import originTypeList from "../originTypeList.js"
import Form from './Form.vue'
import DirectForm from "../inbound/Form.vue"
import InboundTransfer from './listPage/InboundTransfer.vue' // 调拨入库
import InboundSaleReturn from './listPage/InboundSaleReturn.vue' // 销售退货入库
import InboundPurchase from './listPage/InboundPurchase.vue' // 采购收货入库
import InboundExternalReturn from './listPage/InboundExternalReturn.vue' // 外协退料入库
import InboundExternal from './listPage/InboundExternal.vue' // 外协收货入库
import InboundProduction from './listPage/InboundProduction.vue' // 生产入库
import InboundReturnMaterials from './listPage/InboundReturnMaterials.vue' // 生产退料入库
import InboundScrap from './listPage/InboundScrap.vue' // 报废入库

export default {
  name: 'inboundOrders',
  components: { DirectForm, Form, InboundTransfer, InboundSaleReturn, InboundPurchase, InboundExternalReturn, InboundExternal, InboundProduction, InboundReturnMaterials, InboundScrap },
  data() {
    return {
      loading: true,
      formVisible: false,
      directFormVisible: false,
      listPageVisible: false,
      listPageComponent: "",
      originTypeList: originTypeList.inboundList,
      cardList: undefined,
      productionCard: 'order'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    tabClick(e) {
      if (e.target.innerHTML !== '生产订单' && e.target.innerHTML !== '生产工单') this.handleCardClick('inbound_production')
    },
    initData() {
      this.loading = true
      getStockOrdersCard("inbound").then(res => {
        let tempCardList = []
        this.originTypeList.forEach((item, index) => {
          let temp = res.data.find(card => card.sourceType === item.value && card.sourceType !== 'inbound_order_production')
          if (temp) {
            if (temp.sourceType === 'inbound_production') {
              let temp2 = res.data.find(card => card.sourceType === 'inbound_order_production')
              temp.pendingCount = Number(temp.pendingCount) + Number(temp2.pendingCount)
              temp.spaceLines = [temp.lines, temp2.lines]
              temp.lines = temp.spaceLines[0]
            }
            tempCardList.push({ ...temp, sourceName: item.label })
          }
        })
        this.cardList = tempCardList
        this.loading = false
        this.$nextTick(() => {
          this.$refs.tabBox[0].querySelectorAll('.el-tabs__item').forEach(item => {
            item.onmouseenter = (e) => {
              this.productionCard = e.target.innerHTML === '生产工单' ? 'work' : 'order'
            }
          })
        });
      })
    },
    handleCardClick(sourceType) {
      function transformStr(str) {
        var re = /_(\w)/g;
        return str.replace(re, function ($0, $1) {
          return $1.toUpperCase();
        });
      }
      this.listPageComponent = transformStr(sourceType)
      this.listPageVisible = true
    },
    handleLinkClick(id, readOnly, sourceType) {
      if (id === "其他") {
        this.directFormVisible = true
        this.$nextTick(() => { this.$refs.DirectForm.init() })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(id, readOnly, sourceType) })
      }
    },
    productionClick(docId, type) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(`${type}${docId}`, false, type === 'order' ? 'inbound_order_production' : `inbound_production`) })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.listPageVisible = false
      this.directFormVisible = false
      if (isRefresh) { this.initData() }
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep.JNPF-common-layout-main {
  padding: 10px;
  // overflow: auto;

  .card-wrapper {
    // grid 二维布局
    display: grid;
    /*  行高度  */
    // grid-template-rows: 300px;
    /*  列宽度  */
    grid-template-columns: repeat(4, calc(25% - 7.5px));
    /*  行间距和列间距  */
    grid-gap: 10px;

    .box-card {
      position: relative;
      cursor: pointer;

      .el-card__header {
        padding: 12px 20px;
        font-size: 16px;
      }

      .el-card__body {
        height: 150px;
      }

      .text {
        font-size: 14px;
      }

      .item {
        margin-bottom: 14px;
      }

      .view {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .clearfix:before,
      .clearfix:after {
        display: table;
        content: "";
      }

      .clearfix:after {
        clear: both
      }

      .card-header {
        position: relative;
      }

      .card-button {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        padding: 0px 8px;
        background-color: #F56C6C;
        color: #ffffff;
        font-size: 14px;
        border-radius: 9px;
        display: none;
      }

      .hasPending {
        display: block;
      }
    }

    .first-card {
      border: 1px solid #1890ff;
      box-sizing: border-box;

      .text {
        font-weight: bold;
      }
    }
  }
}
</style>