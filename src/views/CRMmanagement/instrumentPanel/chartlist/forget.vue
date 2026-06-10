<template>
  <div class="content">
    <div style="align-items: stretch;flex-wrap: wrap;justify-content: space-around;" class="vux-flexbox vux-flex-row">
      <div class="brief-wrap" v-for="item in forgetlist" :key="item.id">
        <div class="brief">
          <div class="title">
            {{item.name}}
            <span v-if="item.name=='超过3个月未联系'||item.name=='超过6个月未联系'||item.name=='逾期未联系'" class="el-tag" :class="{'el-tag--warning':item.name=='超过3个月未联系'||item.name=='超过6个月未联系','el-tag--danger':item.name=='逾期未联系'}">{{item.name=='逾期未联系'?'已逾期':'警告'}}</span>
          </div>
          <div class="value">{{item.value}}
            <span class="value-unit">{{item.unit}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      forgetlist: [
        { name: '超过7天未联系', id: 'sevenDays', unit: '个', value: '0' },
        { name: '超过15天未联系', id: 'fifteenDays', unit: '个', value: '0' },
        { name: '超过30天未联系', id: 'oneMonth', unit: '个', value: '0' },
        { name: '超过3个月未联系', id: 'threeMonth', unit: '个', value: '0' },
        { name: '超过6个月未联系', id: 'sixMonth', unit: '个', value: '0' },
        { name: '逾期未联系', id: 'unContactCustomerCount', unit: '个', value: '0' },
      ]
    }
  },
  watch: {
    data: {
      handler(newOption) {
        this.forgetlist.forEach(item => {
          item.value = newOption[item.id]
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
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
.content {
  .brief-wrap {
    -webkit-box-flex: 0;
    flex: 0 0 33%;
    width: 0;
    .brief {
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
        & > .value-unit {
          font-size: 14px;
        }
      }
    }
    &:nth-child(4) {
      padding-left: 0 !important;
    }
  }
  .brief-wrap + .brief-wrap {
    padding-left: 16px;
  }
}
</style>