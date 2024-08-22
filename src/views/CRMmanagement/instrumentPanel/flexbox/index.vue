<template>
  <div class="crm-workbench">
    <div class="crm-main">
      <div class="brief-title">
        <span class="icon"><i class="el-icon-s-claim"></i></span>
        <span class="titletext">销售简报</span>
      </div>
      <div class="brief-box">
        <div class="brief-item" v-for="item in datalist" :key="item.id">
          <div class="brief-item__body">
            <div class="info">
              <div class="title">{{item.name}}</div>
              <div class="number">{{item.num}}
                <span style="margin-left: 4px;font-size:14px">{{item.unit}}</span>
              </div>
              <div class="des" v-if="percentagetitle()">
                <span class="">{{percentagetitle()}}</span>
                <span style="flex-shrink: 0;margin-left: 8px;font-weight: bold;display: flex;" :class="[item.float=='up'?'upname':'downname']">
                  {{item.percentage}}%
                  <span style="margin-left:2px;font-size:14px;width: 15px;">
                    <img v-if="item.float=='up'" src="@/assets/images/shangsheng.png" alt="" style="width: 100%;height: 100%;">
                    <img v-else src="@/assets/images/xiajiang.png" alt="" style="width: 100%;height: 100%;">
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div class="brief-item__others">
            <div ref="echartsline" style="width: 100%;height:80px;margin-top:20px">
              <chart :id="item.id" :option="chartoption(item.id)"></chart>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getsaleskitList } from "@/api/CRMmanagement/instrumentPanel/index";
import chart from '../chart.vue'
export default {
  components: {
    chart
  },
  props: {
    Requestparameters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      datalist: [
        { name: '新增客户', unit: '个', id: 'customerCount' },
        { name: '新增联系人', unit: '个', id: 'contactsCount' },
        { name: '新增商机', unit: '个', id: 'businessCount' },
        { name: '新增合同', unit: '个', id: 'contractCount' },
        { name: '合同金额', unit: '元', id: 'contractMoney' },
        { name: '商机金额', unit: '元', id: 'businessMoney' },
        { name: '回款金额', unit: '元', id: 'receivablesMoney' },
        { name: '新增跟进记录', unit: '条', id: 'recordCount' }
      ],
      datas: []
    }
  },
  watch: {
    Requestparameters: {
      handler(newOption) {
        this.saleskit()
      },
      deep: true
    }
  },
  created() {
    this.saleskit()
  },
  methods: {
    percentagetitle() {
      let titletype = this.Requestparameters.type
      let title = ''
      switch (titletype) {
        case 'today':
          title = '较昨天'
          break;
        case 'yesterday':
          title = '较前天'
          break;
        case 'week':
          title = '较上周'
          break;
        case 'lastWeek':
          title = '较前周'
          break;
        case 'month':
          title = '较上月'
          break;
        case 'lastMonth':
          title = '较前月'
          break;
        case 'quarter':
          title = '较上季度'
          break;
        case 'lastQuarter':
          title = '较上上季度'
          break;
        case 'year':
          title = '较去年'
          break;
        case 'lastYear':
          title = '较前年'
          break;
      }
      return title
    },
    saleskit() {
      getsaleskitList(this.Requestparameters).then(res => {
        this.datas = res.data.data.slice().reverse()
        let obj1 = res.data.data[0]
        let obj2 = res.data.data[1]
        // 为对象分配百分比值
        for (let key in obj1) {
          if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            if (key !== 'type') {
              obj1[key + 'Percent'] = this.calculatePercentage(obj1, obj2, key);
              if (obj1[key] > obj2[key]) {
                obj1[key + 'Buoyancy'] = 'up'
              } else {
                obj1[key + 'Buoyancy'] = 'down'
              }
            }
          }
        }
        this.datalist.forEach(item => {
          item.num = obj1[item.id]
          item.percentage = obj1[item.id + 'Percent']
          item.float = obj1[item.id + 'Buoyancy']
        })
      })
    },
    chartoption(code) {
      let option = {
        xAxis: {
          type: 'category',
          show: false,
          data: this.datas.map(item => item.type)
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            data: this.datas.map(item => item[code]),
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#0052cc',
              width: 2
            }
          }
        ]
      }
      return option
    },
    calculatePercentage(obj1, obj2, key) {
      const value1 = obj1[key];
      const value2 = obj2[key];
      let percentage1 = 0
      if (value1 == 0 || value2 == 0) {
        percentage1 = 100
      } else {
        percentage1 = this.jnpf.numberFormat((value1 * 1 - value2 * 1) / value2 * 100, 4)
      }
      return percentage1
    }
  }
}
</script>

<style lang="scss" scoped>
.crm-workbench {
  position: relative;
  border-radius: 3px;
  border: 1px solid #dfe1e6;
  background-color: #fff;
  width: 100%;
  .crm-main::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    content: ' ';
    background-color: #0052cc;
    border-radius: 3px 3px 0 0;
  }
  .brief-title {
    padding: 16px 16px 0;
    .icon {
      padding: 3px;
      margin-right: 8px;
      font-size: 12px;
      color: #fff;
      background-color: #0052cc;
      border-radius: 3px;
    }
    .titletext {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .brief-box {
    display: flex;
    flex-wrap: wrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
    width: 100%;
    padding: 8px 8px 16px 8px;
    .brief-item {
      display: flex;
      // background-color: #0052cc;
      width: calc(25% - 16px);
      height: 112px;
      margin: 8px;
      cursor: pointer;
      border-radius: 3px;
      box-shadow: 0 1px 1px rgb(9 30 66 / 25%), 0 0 1px rgb(9 30 66 / 31%);
      .brief-item__body {
        -webkit-box-flex: 5;
        -ms-flex: 5;
        flex: 5;
        height: 100%;
        padding: 16px;
        overflow: hidden;
        .info {
          overflow: hidden;
          .title {
            color: #5e6c84;
            font-size: 14px;
          }
          .number {
            margin-top: 14px;
            margin-right: 5px;
            overflow: hidden;
            font-size: 24px;
            line-height: 1;
            white-space: nowrap;
          }
          .des {
            display: flex;
            margin-top: 14px;
            font-size: 14px;
            color: #5e6c84;
            .upname {
              color: #ff5630;
            }
            .downname {
              color: #36b37e;
            }
          }
        }
      }
      .brief-item__others {
        position: relative;
        -webkit-box-flex: 4;
        -ms-flex: 4;
        flex: 4;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        overflow: hidden;
      }
    }
  }
}
</style>