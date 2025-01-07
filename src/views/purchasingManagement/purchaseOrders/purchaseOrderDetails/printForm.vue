<template>
  <div style="height: 100%;display: none; ">
    <div class="tableList" id="printContent" style="page-break-after: always;font-family: simsun, 宋体, sans-serif; " v-for="(item, index) in list" :key="index">
      <template >
        <div class="orderHeader" style="width: 100%;display: flex;height: 80px;">
          <div class="headerItem" style="flex:1;display: flex;
          flex-direction: column;margin-left: -50px;
          justify-content: center;align-items:center">
            <img src="@/assets/images/jxLogo.png" style="transform: scale(0.7);height: 150px;width: 300px;" />
          </div>
          <div class="headerItem" style="flex:3;display: flex;
          flex-direction: column;margin-left: -70px;
          justify-content: space-around;">
            <div class="hTitle" style=" font-size: 30px;
            letter-spacing: 2px;
            color: #191f25;
            text-align: center;
            line-height: 1.5vw;">宁波聚轩信息科技有限公司</div>
            <div class="hTitle hTitle2" style=" font-size: 18px;letter-spacing: 0;color: #191f25;
            text-align: center;
            line-height: 1.5vw;font-family:Microsoft YaHei">Ningbo JUXUAN Technology Co.,Ltd.</div>
          </div>
          <div class="headerItem" style="flex:1;display: flex;
          flex-direction: column;
          justify-content: space-around;">
            <div class="hTitle" style="font-size:26px;
            color: #191f25;
            text-align: center;
            line-height: 1.5vw;">订 货 单</div>
            <div class="hTitle hTitle2" style=" font-size: 18px;letter-spacing: 0;color: #191f25;
            text-align: center;
            line-height: 1.5vw;font-family:Microsoft YaHei">{{ dataValue.orderNo }}</div>
          </div>
        </div>
        <div style="float:right;margin-right:160px;font-family:Microsoft YaHei">page：{{ index + 1 }} of {{ pages }}</div>
        <div class="parter" style=" width: 100.6%;
        display: flex;
        border: 1px solid #191f25;
        ">
          <div class="parterLeft" style="flex:1; padding:0;
          border-right: 1px solid #191f25;flex-direction:column;display: flex;">
            <span style=" text-indent: 0.5em;margin-bottom:10px;font-size: 16px">供应商：{{ dataValue.cooperativePartnerName }}</span>
            <span style=" text-indent: 0.5em;font-size: 16px">电话：{{ dataValue.partnerPhone }}</span>
            <span style=" text-indent: 0.5em;font-size: 16px">传真：{{ dataValue.partnerFax }}</span>
            <span style=" text-indent: 0.5em;font-size: 16px">联系：{{ dataValue.partnerContacts }}</span>
            <span style=" text-indent: 0.5em;font-size: 16px">地址：{{  dataValue.partnerAddress }}</span>
          </div>
          <div class="parterright" style="flex:1;  display: flex;
          padding:0;
          justify-content: space-between;">
            <div class="parterright-item" style="flex-direction:column;display: flex;">
              <span style=" text-indent: 0.5em; font-size: 16px">发货地址：</span>
              <span style=" text-indent: 0.5em; font-size: 16px"></span>
              <span style=" text-indent: 0.5em; font-size: 16px"></span>
              <span style=" text-indent: 0.5em; font-size: 16px">开户行:</span>
              <span style=" text-indent: 0.5em; font-size: 16px">电话:</span>
              <span style=" text-indent: 0.5em; font-size: 16px">传真:</span>
              <span style=" text-indent: 0.5em; font-size: 16px">联系:</span>
            </div>
            <div class="parterright-item" style="width: 28%;">
              <span style=" font-size: 16px">{{ dataValue.submitDate.split(' ')[0] }}</span>
            </div>
          </div>
        </div>
  
        <div class="lineTable" style="margin-top: 1px;">
          <div class="tableTitle" style=" display: flex;
          flex-direction: row;">
            <div style="font-size:16px;flex:3">下单日期：{{ dataValue.createTime.split(' ')[0] }}</div>
            <div style="font-size:16px;flex:3">交货日期：{{ dataValue.deliveryDate }}</div>
            <div style="font-size:16px;flex:2">说明：</div>
          </div>
  
        </div>
  
        <table border="1" cellspacing="0" cellpadding="0" width="100%" class="tyTable">
          <thead>
            <tr style="box-sizing: border-box;font-size:16px;">
              <th style="min-width:40px;padding:3px;font-weight:500">NO</th>
              <th style="min-width:120px;padding:3px;text-align:center;font-weight:500">规格型号</th>
              <th style="min-width:120px;padding:3px;text-align:center;font-weight:500">产品描述</th>
              <th style="min-width:50px;padding:3px;text-align:center;font-weight:500">单位</th>
              <th style="min-width:50px;padding:3px;text-align:center;font-weight:500">数量</th>
              <th style="min-width:60px;padding:3px;text-align:center;font-weight:500">单价</th>
              <th style="min-width:60px;padding:3px;text-align:center;font-weight:500">税率%</th>
              <th style="min-width:80px;padding:3px;text-align:center;font-weight:500">金额</th>
              <th style="min-width:100px;padding:3px;text-align:center;font-weight:500">交货期</th>
              <th style="min-width:110px;padding:3px;text-align:center;font-weight:500">交货回复</th>
            </tr>
          </thead>
          <tbody style="">
            <tr v-for="(item1, index1) in item.pagedata" :key="index1" style="box-sizing: border-box; font-size:16px;">
              <td style="padding:3px;text-align:center">{{ index1 + 1 }}</td>
              <td style="padding:3px;text-align:center">{{ item1.spec }}</td>
              <td style="padding:3px;text-align:center">{{ item1.spec }}</td>
              <td style="padding:3px;text-align:center">{{ item1.mainUnit }}</td>
              <td style="padding:3px;text-align:center">{{ item1.purchaseQuantity }}</td>
              <td style="padding:3px;text-align:center">{{ item1.price }}</td>
              <td style="padding:3px;text-align:center">{{ item1.taxRate }}</td>
              <td style="padding:3px;text-align:center">{{ item1.totalAmount }}</td>
              <td style="text-align:center">{{ item1.deliveryDate }}</td>
              <td style="padding:3px;text-align:center">{{ item1.updateByName }}</td>
            </tr>
          </tbody>
        </table>
          <div class="total" style="width: 100.5%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;border-left:2px solid #191f258a;border-right:2px solid #191f25;">
            <div style="font-size:16px;text-indent: 0.5em;">页小计：{{ item.UpperMoney }}</div>
            <div style="font-size:16px;margin-right:2px;">{{ item.total}}</div>
          </div>
        <!-- <template v-if="index + 1 == pages"> -->
          <div class="describe" style="width:100.6%;border:1px solid #191f25;font-size:16px;display: flex;flex-direction:column;">
            <span style="display:block;margin-top:5px">一、订单收到货后，确认交期，在24小时内盖章回传。</span>
            <span>二、货物包装要求:产品都用纸箱包装，规格型号数量要清晰，并且满足运输安全要求。</span>
            <span>三、风险承担:货物运输过程中发生的灭失、毁损等一切风险均由供方承担。</span>
            <span>四、质量及验收标准:企业标准（技术及检验标准参照技术附件或者样品，质保期为3年）；</span>
            <span style="text-indent: 2em;">镀锌要求:全部为三价铬白锌，盐雾试验时间72小时无白色锈蚀，120小时无红色锈蚀。</span>
            <span>
              五、货物验收:货物送达后，需方按验收标准对货物进行检测验收，如有问题或数量短缺问题，供方应在得到需方通知后，2天内派人到需方处理相关事宜，根据问题的严重程度，需方可以采取拒绝接受或限期补货，货款折扣等方式进行处理，供方经告不来处理的，合同自动解除，需方有权向供方追索相应损失。
            </span>
            <span>六、违约责任:产品经需方验收合格，数量无误，办理入库手续，双方按约定的付款方式进行贷款结算。</span>
            <span style="text-indent: 2em;">违约责任:供方不能按期交货，每违约一日，应承担货款总额2%违约金，依次类推，需方可以在货款中直接扣除违约金部分；</span>
            <span style="text-indent: 2em;"> 因供方产品质量问题而使需方造成损失的，供方应承担赔偿由此引起的损失责任。</span>
            <span>七、争议解决方式:因执行本合同发生争议，由双方协商解决；协调不成的，起诉方直接向需方所在人民法院起诉。</span>
            <span style="display:block;margin-bottom:5px">八、合同生效；本合同一式两份，双方各执一份，各份具有同等效力，签订合同盖章回传之日起开始生效，传真件同等效力。</span>
          </div>
          <div class="bottomCon" style=" width: 100.8%;
        display: flex;
        border-left: 1px solid #191f25;
        border-bottom: 1px solid #191f25;
        border-right: 2px solid #191f258a;
        box-sizing: border-box;font-size:20px">
            <div style="flex:1;border-right: 1px solid #191f25;padding: 2px; flex-direction: column;">
              <p>需方：宁波聚轩信息科技有限公司</p>
              <p>盖章：</p>
              <p>日期：{{ jnpf.getToday() }}</p>
            </div>
            <div style="flex:1;padding: 2px; flex-direction: column;">
              <p>供方：</p>
              <p>盖章：</p>
              <p>日期：{{ jnpf.getToday() }}</p>
            </div>
          </div>
  
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
      let imgBox= document.getElementsByName("imgBox");
      this.compressImage(imgBox, 0.7, 800)
    },
    // dataValue(newValue) {
    //   this.dataForm = newValue;
    // },
  },
  methods:{
    compressImage(img, quality, maxWidth) {
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        img.src = dataUrl
      }
    }
  }
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

}</style>
