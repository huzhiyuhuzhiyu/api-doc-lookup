<template>
  <div class="content">
    <div class="section">
      <div class="section__hd">
        <div class="el-divider el-divider--horizontal">
          <div class="el-divider__text is-left">客户汇总</div>
        </div>
      </div>
      <div class="section__bd">
        <div class="vux-flexbox vux-flex-row">
          <div class="section-item-wrap" v-for="item in Customerlist" :key="item.id">
            <div class="section-item">
              <div class="title">
                {{item.name}}
              </div>
              <div class="value">
                1<span class="value-unit">{{item.unit}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section__hd">
        <div class="el-divider el-divider--horizontal">
          <div class="el-divider__text is-left">商机汇总</div>
        </div>
      </div>
      <div class="section__bd">
        <div class="vux-flexbox vux-flex-row">
          <div class="section-item-wrap" v-for="item in nichelist" :key="item.id">
            <div class="section-item">
              <div class="title">
                {{item.name}}
              </div>
              <div class="value" :class="{'font-value':item.name=='商机总金额'}">
                1<span class="value-unit">{{item.unit}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section__hd">
        <div class="el-divider el-divider--horizontal">
          <div class="el-divider__text is-left">合同汇总</div>
        </div>
      </div>
      <div class="section__bd">
        <div class="vux-flexbox vux-flex-row">
          <div class="section-item-wrap" v-for="item in contractlist" :key="item.id">
            <div class="section-item">
              <div class="title">
                {{item.name}}
                <span v-if="item.name=='即将到期'||item.name=='已到期'" class="el-tag" :class="{'el-tag--warning':item.name=='即将到期','el-tag--danger':item.name=='已到期'}">{{item.name=='即将到期'?'警告':'已到期'}}</span>
              </div>
              <div class="value" :class="{'font-value':item.name=='合同金额'}">
                1<span class="value-unit">{{item.unit}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="vux-flexbox vux-flex-row">
        <div class="section two-columns" v-for="(item,index) in CollectionSummarylist" :key="index">
          <div class="section__hd">
            <div class="el-divider el-divider--horizontal">
              <div class="el-divider__text is-left">{{item.title}}</div>
            </div>
          </div>
          <div class="section__bd">
            <div class="vux-flexbox vux-flex-row">
              <div class="section-item-wrap" v-for="o in item.arr" :key="o.id">
                <div class="section-item">
                  <div class="title">
                    {{o.name}}
                  </div>
                  <div class="value" :class="{'font-value':o.name=='回款'||o.name=='预计回款'}">
                    1<span class="value-unit">{{o.unit}}</span>
                  </div>
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
export default {
  data() {
    return {
      CollectionSummarylist: [
        {
          title: '跟进汇总', arr: [
            { name: '跟进客户数', id: '77', unit: '个' },
            { name: '新增未跟进客户数', id: '88', unit: '个' },
          ]
        },
        {
          title: '回款金额', arr: [
            { name: '回款', id: '99', unit: '元' },
            { name: '预计回款', id: '66', unit: '元' },
          ]
        }
      ],
      Customerlist: [
        { name: '新增客户', id: '1', unit: '个' },
        { name: '转成交客户', id: '2', unit: '个' },
        { name: '放入公海客户', id: '3', unit: '个' },
        { name: '公海池领取', id: '4', unit: '个' },
      ],
      nichelist: [
        { name: '新增商机', id: '11', unit: '个' },
        { name: '赢单商机', id: '22', unit: '个' },
        { name: '输单商机', id: '33', unit: '个' },
        { name: '商机总金额', id: '44', unit: '元' },
      ],
      contractlist: [
        { name: '签约合同', id: '111', unit: '个' },
        { name: '即将到期', id: '222', unit: '个' },
        { name: '已到期', id: '333', unit: '个' },
        { name: '合同金额', id: '444', unit: '元' },
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .section__hd {
    overflow: hidden;
    .el-divider--horizontal {
      height: 2px;
      margin: 12px 0;
      display: block;
      width: 100%;
      .el-divider__text.is-left {
        left: 0;
        padding-right: 8px;
        padding-left: 0;
        font-size: 16px !important;
      }
    }
  }
  .section__bd {
    margin-top: 12px;
  }
  .el-divider__text.is-left {
    transform: translateY(-50%);
  }
  .el-divider {
    background-color: #dfe1e6;
    position: relative;
  }
  .el-divider__text {
    position: absolute;
    background-color: #fff;
    padding: 0 20px;
    font-weight: 500;
    color: #172b4d;
  }
  .vux-flexbox {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    text-align: left;
  }
  .vux-flex-row {
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
  }
  .section-item-wrap {
    -webkit-box-flex: 0;
    flex: 0 0 25%;
    width: 0;
    .section-item {
      flex-shrink: 0;
      padding: 16px;
      margin-bottom: 16px;
      cursor: pointer;
      background-color: #ebecf0;
      border-radius: 3px;
      & > .title {
        overflow: hidden;
        line-height: 20px;
        color: #5e6c84;
        white-space: nowrap;
        .el-tag {
          vertical-align: bottom;
          margin-left: 4px;
          height: 20px;
          padding: 0 4px;
          line-height: 18px;
          font-size: 12px;
          border-width: 1px;
          border-style: solid;
          box-sizing: border-box;
          white-space: nowrap;
        }
        .el-tag.el-tag--warning {
          background-color: #fff0b3;
          color: #172b4d;
        }
        .el-tag.el-tag--danger {
          background-color: #ffbdad;
          color: #bf2600;
        }
      }
      & > .value {
        min-height: 20px;
        margin-top: 8px;
        overflow: hidden;
        font-size: 20px;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
        .value-unit {
          font-size: 14px;
        }
      }
      .font-value {
        font-size: calc(100vw * 16 / 1920);
      }
    }
  }
  .section-item-wrap + .section-item-wrap {
    padding-left: 16px;
  }
  .two-columns {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    .section-item-wrap {
      -webkit-box-flex: 0;
      flex: 0 0 50%;
    }
  }
  .two-columns + .two-columns {
    padding-left: 16px;
  }
  ::v-deep .el-tag,
  .el-tag--dark,
  .el-tag--plain {
    border-color: transparent;
  }
  ::v-deep .el-tag,
  .el-tag .el-tag__close {
    border-radius: 3px;
    display: inline-block;
  }
}
</style>