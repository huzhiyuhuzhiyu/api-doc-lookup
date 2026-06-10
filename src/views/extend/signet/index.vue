<template>
  <div class="tem-container app-container">
    <el-button @click="print" class="signs print">打印</el-button>
    <el-button @click="showlip" v-if="showBtn" class="signs">盖章</el-button>
    <div ref="print">
      <div class="tem_list">
        <div class="tem_main">
          <h1>{{sysConfig.companyName}}</h1>
          <h2>报 价 单</h2>
          <h4>TO：</h4>
          <p class="title"> 感谢惠顾，现将贵公司所需配件报价如下：</p>
          <p class="lip">一、产品价格</p>
          <div style="padding: 0 1px 0 0">
            <el-table :data="tableData" border>
              <el-table-column prop="order" label="序号" width="60"></el-table-column>
              <el-table-column prop="name" label="品名" width="120"></el-table-column>
              <el-table-column prop="standards" label="规格" width="110"></el-table-column>
              <el-table-column prop="num" label="数量" width="60"></el-table-column>
              <el-table-column prop="unit" label="单位" width="60"></el-table-column>
              <el-table-column prop="unitprice" label="单价"></el-table-column>
              <el-table-column prop="total" label="金额"></el-table-column>
              <el-table-column prop="remarks" label="备注"></el-table-column>
            </el-table>
          </div>
          <p class="lip">二、通讯联络</p>
          <div class="content1">
            <div class="item">
              <span>需方联系人员：</span>
              <span>丰梦琪</span>
            </div>
            <div class="item">
              <span>供方联系人员：</span>
              <span>应白梦</span>
            </div>
            <div class="item">
              <span>需方联系电话：</span>
              <span>13802141322</span>
            </div>
            <div class="item">
              <span>供方联系电话：</span>
              <span>13802141322</span>
            </div>
            <div class="item">
              <span>需方传真号码：</span>
              <span>010-88888888</span>
            </div>
            <div class="item">
              <span>供方传真号码：</span>
              <span>021-88888888</span>
            </div>
            <div class="item">
              <span>供方地址：</span>
              <span>北京市海淀区西直门北大街42号</span>
            </div>
            <div class="item">
              <span>供方地址：</span>
              <span>上海市青浦区</span>
            </div>
            <div class="item">
              <span>供方邮编：</span>
              <span>100000</span>
            </div>
            <div class="item">
              <span>供方邮编：</span>
              <span>201799</span>
            </div>
          </div>
          <div class="temdate">日 期：2017-11-29</div>
          <div class="seal">盖章：</div>
        </div>
        <VueDragResize :isDraggable="showBtn" :w="150" :h="150" :isResizable='false' v-if="showsin" >
          <img
            src="data:image/png;base64,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"
            alt="">
          <div class="signBtn">
            <el-button @click="signclick" v-if="showBtn">确认</el-button>
            <el-button @click="cancelSign" v-if="showBtn">取消</el-button>
          </div>
        </VueDragResize>
      </div>
    </div>
  </div>
</template>
<script>
import VueDragResize from 'vue-drag-resize'
import printStyle from '../printData/printStyle'

export default {
  name: 'extend-signet',
  data() {
    return {
      showSign: true,
      showBtn: true,
      showsin: false,
      key: '',
      labelPosition: 'right',
      connect: {
        user: '丰梦琪',
        supply: '应白梦',
        userPhone: '13802141322',
        supplyPhone: '13004363886',
        useremail: '010-88888888',
        supplyemail: '021-88888888',
        useraddress: '北京市海淀区西直门北大街42号',
        supplyaddress: '上海市青浦区',
        userPostcode: '100000',
        suPostcode: '201799'
      },
      tableData: [{
        order: '1',
        name: '服务器硬件',
        standards: '联想',
        num: '5',
        unit: '台',
        unitprice: '20000.00',
        total: '100000.00',
        remarks: ''
      }, {
        order: '2',
        name: '数据库正版',
        standards: 'SQLServer',
        num: '5',
        unit: '套',
        unitprice: '9998.00',
        total: '49990.00',
        remarks: ''
      }, {
        order: '3',
        name: 'OA内部管理系统',
        standards: '定制',
        num: '5',
        unit: '套',
        unitprice: '	390000.00',
        total: '	390000.00',
        remarks: ''
      }, {
        order: '4',
        name: '进销存管理系统',
        standards: '定制',
        num: '5',
        unit: '套',
        unitprice: '260000.00',
        total: '260000.00',
        remarks: ''
      }, {
        order: '5',
        name: '	服务费',
        standards: '',
        num: '5',
        unit: '年',
        unitprice: '80000.00',
        total: '80000.00',
        remarks: ''
      }, {
        order: '6',
        name: '差旅费用',
        standards: '',
        num: '5',
        unit: '年',
        unitprice: '60000.00',
        total: '80000.00',
        remarks: ''
      }]
    }
  },
  components: { VueDragResize },
  computed:{
      sysConfig() {
          return this.$store.state.settings.sysConfig
      }
  },
  methods: {
    print() {
      let print = this.$refs.print.innerHTML
      let printPart = print + printStyle;
      let newTab = window.open('_blank');
      newTab.document.body.innerHTML = printPart;
      newTab.print();
      newTab.close();
    },
    showlip() {
      this.showsin = true
    },
    signclick() {
      this.showSign = false
      this.showBtn = false
    },
    cancelSign() {
      this.showsin = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tem-container {
  background: #ebeef5 !important;
  overflow: auto;
  position: relative;
  padding: 0;
  .signs {
    position: absolute;
    right: 10px;
    top: 70px;
    &.print {
      top: 20px;
    }
  }
  .signBtn {
    display: flex;
    justify-content: space-between;
  }
  .tem_list {
    width: 800px;
    margin: 0 auto;
    background: #fff;
    // box-shadow: rgb(189, 189, 189) 0px 0px 10px;
    color: #606266;
    position: relative;
    .tem_main {
      width: 90%;
      margin: 0 auto;
      font-size: 12px;
      padding-bottom: 15px;
      h1 {
        padding-top: 36px;
      }
      h1,
      h2 {
        text-align: center;
        color: #475059;
      }
      .title {
        border-bottom: 2px dashed #000;
        padding-left: 30px;
        line-height: 30px;
        font-size: 12px;
      }
      .lip {
        padding: 20px 0;
      }

      .demo-form-inline {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        border-bottom: 1px solid #ebeef5;
        width: 48%;
        margin: 0;
        >>> .el-input__inner {
          border: 0 !important;
          padding: 0;
          width: 220px;
          font-size: 12px;
        }
        >>> .el-form-item__label {
          font-size: 12px;
        }
      }
      .temdate {
        text-align: right;
        margin: 20px 60px;
      }
      .seal {
        text-align: right;
        margin: 10px 120px;
        padding-bottom: 40px;
      }
    }
  }
  .vdr.active:before {
    outline: 0;
  }
  .vdr.active {
    img {
      width: 100%;
      height: 100%;
    }
  }
  >>> .el-table thead tr th {
    background: #fff !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    background: #fff !important;
  }
  .content1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .item {
      width: 345px;
      padding: 8px 0;
      border-bottom: 1px solid #ebeef5;
      span {
        font-size: 12px;
        padding: 10px 0;
        color: #606266;
      }
    }
  }
}
</style>
