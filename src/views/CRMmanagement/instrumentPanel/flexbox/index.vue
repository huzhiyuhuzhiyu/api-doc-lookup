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
              <div class="title text">{{item.name}}</div>
              <div class="number">1
                <span style="margin-left: 4px;font-size:14px">{{item.unit}}</span>
              </div>
              <div class="des">
                <span class="text">较上月</span>
                <span style="flex-shrink: 0;margin-left: 8px;font-size: 14px;color: #ff5630;">100%<span style="margin-left:2px;font-size:14px"><i class="el-icon-top"></i></span>
                </span>
              </div>
            </div>
          </div>
          <div class="brief-item__others">
            <div ref="echartsline" style="width: 100%;height:80px;margin-top:20px">
              <chart :id="item.id" :option="chartption"></chart>
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
  data() {
    return {
      datalist: [
        {name:'新增客户',unit:'个',id:'xzkh'},
        {name:'新增联系人',unit:'个',id:'xzlxr'},
        {name:'新增商机',unit:'个',id:'xzsj'},
        {name:'新增合同',unit:'个',id:'xzht'},
        {name:'合同金额',unit:'元',id:'htje'},
        {name:'商机金额',unit:'元',id:'sjje'},
        {name:'回款金额',unit:'元',id:'hkje'},
        {name:'新增跟进记录',unit:'条',id:'gjjl'},
      ],
      chartption: {
        xAxis: {
          type: 'category',
          show: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            data: [0, 0, 0, 0, 0, 0, 820],
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#0052cc',
              width: 2
            },
          }
        ]
      }
    }
  },
  created() {
    getsaleskitList({userIds:['admin']}).then(res => {
      console.log(res,'6666666+');
    })
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
            color: #5e6c84;
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