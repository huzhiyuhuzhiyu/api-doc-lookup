<template>
  <div style="height: 100%;display: none; ">
    <div class="tableList" id="printContent" style="page-break-after: always;  font-family: simsun, 宋体, sans-serif; " v-for="(item, index) in list" :key="index">
      <template>
        <div class="orderHeader" style="width: 100%;display: flex;height: 80px;">
          <div class="headerItem" style="flex:1;display: flex;
          flex-direction: column;
          justify-content: center;align-items:center">
            <img src="@/assets/images/eslog.png" style="transform: scale(0.7);" />
          </div>
          <div class="headerItem" style="flex:3;display: flex;
          flex-direction: column;
          justify-content: space-around;">
            <div class="hTitle" style=" font-size: 30px;
            letter-spacing: 2px;
            color: #191f25;
            text-align: center;
            line-height: 1.5vw;">宁波怡盛液压技术有限公司</div>
            <div class="hTitle hTitle2" style=" font-size: 18px;letter-spacing: 0;color: #191f25;
            text-align: center;
            line-height: 1.5vw;font-family:Microsoft YaHei">Ningbo YiSheng Hydraulic Technical Co.,Ltd.</div>
          </div>
          <div class="headerItem" style="flex:1;display: flex;
          flex-direction: column;
          justify-content: space-around;">
            <div class="hTitle" style="font-size:26px;
            color: #191f25;
            text-align: center;
            line-height: 1.5vw;font-weight: normal;">发 货 清 单</div>
            <div class="hTitle hTitle2" style=" font-size: 18px;letter-spacing: 0;color: #191f25;
            text-align: center;
            line-height: 1.5vw;font-family:Microsoft YaHei">{{ dataValue.orderNo }}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px">
          <div style="font-size:14px;text-indent: 0.5em;flex:2"></div>
          <div style="font-size:14px;flex:2"></div>
          <div style="font-size:14px;flex:1;font-family:Microsoft YaHei">page：{{ index + 1 }} of {{ pages }}</div>
        </div>
        <div class="parter" style=" width: 100.6%;
        display: flex;
        border: 1px solid #191f25;
        margin-bottom:10px;
        ">
          <div class="parterLeft" style="width:45%; padding:0;
          border-right: 1px solid #191f25;flex-direction:column;display: flex;">
            <span style=" text-indent: 0.5em;margin-bottom:10px;font-size: 14px">发往：{{ dataValue.partnerCode }}</span>
            <span style=" text-indent: 0.5em;font-size: 14px">{{ dataValue.partnerName }}</span>
            <span style=" text-indent: 0.5em;font-size: 14px">{{ dataValue.partnerAddress }}</span>
            <span style=" text-indent: 0.5em;font-size: 14px">电话：{{ dataValue.partnerPhone }}</span>
            <span style=" text-indent: 0.5em;font-size: 14px">传真：{{ dataValue.partnerFax }}</span>
            <span style=" text-indent: 0.5em;font-size: 14px">联系：{{ dataValue.partnerContacts }}</span>
          </div>
          <div class="parterright" style="width:55%;  display: flex;
          padding:0;
          justify-content: space-between;">
            <div class="parterright-item" style="flex-direction:column;display: flex;width:70%;border-right: 1px solid #191f25;padding-bottom: 15px;">
              <span style=" text-indent: 0.5em; font-size: 14px">发自：</span>
              <span style=" text-indent: 0.5em; font-size: 14px">宁波怡盛液压技术有限公司</span>
              <span style=" text-indent: 0.5em; font-size: 14px">宁波镇海区蛟川街道金达路259号</span>
              <span style=" text-indent: 0.5em; font-size: 14px">开户行:宁波银行北仑支行</span>
              <span style=" text-indent: 0.5em; font-size: 14px">账号:51010122000296010</span>
              <span style=" text-indent: 0.5em; font-size: 14px">电话:(0574)56190760</span>
              <span style=" text-indent: 0.5em; font-size: 14px">传真:(0574)56190762</span>
              <span style=" text-indent: 0.5em; font-size: 14px">联系:庄海燕</span>
            </div>
            <div class="parterright-item" style="width: 28%;text-align:right;margin-right: 2px;">
              <span style=" font-size: 14px;">{{ dataValue.completeDate }}</span>
            </div>
          </div>
        </div>

        <table border="1" cellspacing="0" cellpadding="0" width="100%" class="tyTable">
          <thead>
            <tr style="box-sizing: border-box;font-size:16px;">
              <th colspan="1" style="min-width:50px;padding:5px;font-weight:500">NO</th>
              <th colspan="4" style="min-width:160px;padding:5px;text-align:center;font-weight:500">客户料号</th>
              <th colspan="1" style="min-width:100px;padding:5px;text-align:center;font-weight:500">名称</th>
              <th colspan="1" style="min-width:65px;padding:5px;text-align:center;font-weight:500">数量</th>
              <th colspan="1" style="min-width:65px;padding:5px;text-align:center;font-weight:500">单位</th>
              <th colspan="1" style="min-width:65px;padding:5px;text-align:center;font-weight:500" v-if="!dataValue.type">箱数</th>
              <th colspan="1" style="min-width:70px;padding:5px;text-align:center;font-weight:500">合同号</th>
              <th colspan="1" style="min-width:65px;padding:5px;text-align:center;font-weight:500">工作令号</th>
              <th colspan="1" style="min-width:100px;padding:5px;text-align:center;font-weight:500">备注1</th>
              <th colspan="1" style="min-width:110px;padding:5px;text-align:center;font-weight:500" v-if="dataValue.type">备注2</th>
            </tr>
          </thead>
          <tbody style="">
            <tr v-for="(item1, index1) in item.pagedata" :key="index1" style="box-sizing: border-box; font-size:14px;">
              <td style="padding:5px;text-align:center">{{ item1.id }}</td>
              <td colspan="4" style="padding:5px;text-align:center;min-width:160px;">{{ item1.customerProductNo }}</td>
              <td style="padding:5px;text-align:center">{{ item1.productName }}</td>
              <td style="padding:5px;text-align:center">{{ item1.num }}</td>
              <td style="padding:5px;text-align:center">{{ item1.mainUnit }}</td>
              <td style="padding:5px;text-align:center" v-if="!dataValue.type">{{ item1.boxNum }}</td>
              <td style="padding:5px;text-align:center">{{ item1.contractNo }}</td>
              <td style="padding:5px;text-align:center">{{ item1.workOrderNo }}</td>
              <td style="padding:5px;text-align:center">{{ item1.remark }}</td>
              <td style="padding:5px;text-align:center" v-if="dataValue.type">{{ item1.remark2 }}</td>

            </tr>
            <tr v-if="index + 1 == pages">
              <td colspan="1"></td>
              <td colspan="5" style="padding:3px;text-align:right;font-size:18px">合计：</td>
              <td colspan="6" style="padding:3px;text-align:left;font-size:18px">{{dataValue.totalNum}}</td>
            </tr>
          </tbody>
        </table>

        <template v-if="index + 1 == pages">
        <div class="describe"
          style="width:100%;height:80px;font-size:18px;display: flex;justify-content: space-around;align-items:center;">
          <div style="text-align:left">制 单：{{ dataValue.createByName }}</div>
          <div>发 货：</div>
          <div>签 收：</div>
        </div>

        <div class="bottomCon" style=" width: 100%;font-size:19.5px">
          <p>数量规格若有异议，请在到货后十日内与我公司联系，逾期我公司将无法核查负责。贵公司如对我公司的产品及服务有任何意见或要求，请您毫无保留的告诉我们，我们一定会认真对待，并非常感谢。</p>
        </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'printTable',
  data() {
    return {
      list: this.value,
      listLoading: false,
      // dataForm: this.dataValue,
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    dataValue: {
      type: Object,
      required: true
    },
    isShow: {
      type: Boolean,
      required: false
    },
    pages: {
      type: Number,
      required: true
    },
  },
  watch: {
    value(newValue) {
      this.list = newValue;
    },
    // dataValue(newValue) {
    //   this.dataForm = newValue;
    // },
  },
}

</script>
<style scoped lang="scss">
.tableList {
  flex: 1 0 0;
  height: 100%;
  // border: none !important;
  display: none !important;

  .orderHeader {
    width: 100%;
    display: flex;

    img {
      transform: scale(0.8);
    }

    .headerItem {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .hTitle {
        font-size: 30px;
        // font-weight: bold;
        letter-spacing: 2px;
        color: #191f25;
        text-align: center;
        line-height: 1.5vw;
      }

      .hTitle2 {
        font-size: 18px;
        letter-spacing: 0;
      }
    }
  }

  .parter {
    width: 100%;
    display: flex;
    border: 1px solid #191f25;
    box-sizing: border-box;

    .parterLeft {
      padding: 10px;
      border-right: 1px solid #191f25;

      p {
        font-size: 14px
      }
    }

    .parterright {
      display: flex;
      padding: 5px;
      justify-content: space-between;

      .parterright-item {
        p {
          font-size: 16px
        }

      }
    }
  }

  .lineTable {
    margin-top: 20px;

    .tableTitle {
      display: flex;
      flex-direction: row;
    }

    .tyTable {
      width: 100%;
      border: none !important;
      border-top: 1px solid #191f25 !important;
      // border-right: 1px solid #191f25 !important;
      color: #191f25 !important;
      font-size: 3mm !important;
      // zoom: 0.973;
      border-collapse: collapse !important;
      table-layout: auto;

      tr {
        border-bottom: 1px solid #191f25 !important;
        border-top: 1px solid #191f25 !important;
        border-right: 1px solid #191f25 !important;
      }
    }


    .total {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}



@media print {
  @page {
    // size: portrait !important; // 纵向
    size: auto; // 纵向
    margin: 3mm;
  }

  .tyTable {
    width: 100%;
    border: none !important;
    border-top: 1px solid #191f25 !important;
    // border-right: 1px solid #191f25 !important;
    color: #191f25 !important;
    font-size: 3mm !important;
    zoom: 0.973;
    border-collapse: collapse !important;
    table-layout: auto;
  }

  .tyTable tr {
    border-bottom: 1px solid #191f25 !important;
    border-top: 1px solid #191f25 !important;
    border-right: 1px solid #191f25 !important;
  }

}
</style>
