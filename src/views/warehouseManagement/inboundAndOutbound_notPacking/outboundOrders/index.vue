<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="loading">
        <div class="card-wrapper">

          <el-card class="box-card first-card" shadow="hover" @click.native="handleLinkClick('其他')" v-if="cardList">
            <div class="view">
              <el-link type="primary">
                <span class="text">直接出库</span>
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
            <div v-for="o in item.lines" :key="o.docNo" class="text item">
              <el-link type="primary" @click.stop="handleLinkClick(o.docId, false, item.sourceType)">
                <span class="text"> {{ o.docNo }} </span>
              </el-link>
            </div>
            <span v-if="item.lines.length === 0" class="text">暂无待办出库</span>
          </el-card>

          <!-- <el-card class="box-card first-card" shadow="hover" @click.native="handleLinkClick('报废')" v-if="cardList">
            <div class="view">
              <el-link type="primary">
                <span class="text">报废出库</span>
              </el-link>
            </div>
          </el-card> -->
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
import originTypeList from "../../inboundAndOutbound/originTypeList.js"
import Form from './Form.vue'
import DirectForm from "../outbound/Form.vue"
import OutboundTransfer from './listPage/OutboundTransfer.vue' // 调拨出库
import OutboundSaleSend from './listPage/OutboundSaleSend.vue' // 销售发货出库
import OutboundPurchase from './listPage/OutboundPurchase.vue' // 采购退货出库
import OutboundExternalSend from './listPage/OutboundExternalSend.vue' // 外协发料出库
import OutboundExternal from './listPage/OutboundExternal.vue' // 外协退货出库
import OutboundPickOut from './listPage/OutboundPickOut.vue' // 生产领料出库

export default {
  components: { DirectForm, Form, OutboundTransfer, OutboundSaleSend, OutboundPurchase, OutboundExternalSend, OutboundExternal, OutboundPickOut },
  data() {
    return {
      loading: true,
      formVisible: false,
      directFormVisible: false,
      listPageVisible: false,
      listPageComponent: OutboundTransfer,
      originTypeList: originTypeList.outboundList, // 出库来源类型
      cardList: undefined,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = true
      getStockOrdersCard("outbound").then(res => {
        let tempCardList = []
        this.originTypeList.forEach((item, index) => {
          let temp = res.data.find(card => card.sourceType === item.value)
          if (temp) tempCardList.push({ ...temp, sourceName: item.label })
        })
        this.cardList = tempCardList
        this.loading = false
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
      // this.$nextTick(() => { this.$refs.ListPage.initData() })
    },
    handleLinkClick(id, readOnly, sourceType) {
      if (id === "其他" || id === "报废") {
        this.directFormVisible = true
        this.$nextTick(() => { this.$refs.DirectForm.init(undefined, undefined, id) })
        return
      }
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(id, readOnly, sourceType) })
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