<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="crm-workbench__hd">
        <div class="el-dropdown">
          CRM仪表盘
        </div>
      </div>
      <div class="crm-head">
        <div class="vux-flexbox head__body vux-flex-row">
          <div>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="margin-left: 8px;">
            <el-select v-model="value1" placeholder="请选择">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div style="padding-top:16px;">
        <flexbox></flexbox>
      </div>
      <div class="vux-flex-row section vux-flexbox1">
        <div class="left">
          <draggable v-model="list" @start="drag=true" @end="drag=false" group="arr">
            <chartlist v-for="item in list" :key="item.id" :type="item.typechart"></chartlist>
          </draggable>
        </div>
        <div class="right">
          <draggable v-model="list1" @start="drag=true" @end="drag=false" group="arr">
            <chartlist v-for="item in list1" :key="item.id" :type="item.typechart"></chartlist>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chartlist from "./chartlist/index.vue";
import draggable from 'vuedraggable';
import flexbox from "./flexbox/index.vue";
export default {
  components: {
    flexbox,
    draggable,
    chartlist
  },
  data() {
    return {
      value: '选项1',
      value1: '选项1',
      options: [
        {
          value: '选项1',
          label: '仅本人'
        },
        {
          value: '选项2',
          label: '本人及下属'
        }
      ],
      options1: [
        {
          value: '选项1',
          label: '本月'
        }
      ],
      list: [
        { name: '合同金额目标及完成情况', id: '1', typechart: 'contractamount' },
        { name: '排行榜', id: '2', typechart: 'rankinglist' },
        { name: '销售漏斗', id: '3', typechart: 'salesfunnel' },

      ],
      list1: [
        { name: '数据汇总', id: '11', typechart: 'datasummary' },
        { name: '目标完成率', id: '22', typechart: 'targetcompletionrate' },
        { name: '客户遗忘提醒', id: '33', typechart: 'forgettingreminder' },

      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.JNPF-common-layout-center {
  overflow: initial;
}
.crm-workbench__hd {
  padding-top: 10px;
  .el-dropdown {
    font-size: 24px;
    display: inline-block;
    position: relative;
  }
}
.crm-head {
  position: relative;
  margin-top: 15px;
}
.vux-flex-row {
  -webkit-box-direction: normal;
  -webkit-box-orient: horizontal;
  flex-direction: row;
  &.section {
    padding-bottom: 40px;
    margin-top: 18px;
    align-items: stretch;
    .wk-toggle-button__bd {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      width: max-content;
      max-width: 100%;
      padding: 4px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.3333;
      text-transform: uppercase;
      background-color: #ebecf0;
      border-radius: 3px;
      .wk-toggle-item {
        display: block;
        padding: 0 5px;
        line-height: 24px;
        cursor: pointer;
        background-color: #dfe1e6;
        border-radius: 3px;
        & + & {
          margin-left: 4px;
        }
        &.selected {
          background-color: #fff;
          border-radius: 3px;
          box-shadow: 0 3px 5px rgba(13, 20, 36, 0.18),
            0 0 1px rgba(13, 20, 36, 0.29) !important;
        }
      }
    }
    .left {
      width: calc(50% - 10px);
      margin-right: 20px;
      .left-content {
        height: 440px;
      }
      .left-content + .left-content {
        margin-top: 18px;
      }
      .sale-statistics {
        margin-top: 16px;
        width: 100%;
      }
    }
    .right {
      width: calc(50% - 10px);
      .right-content {
        height: 440px;
      }
      .right-content + .right-content {
        margin-top: 18px;
      }
    }
    .card {
      position: relative;
      padding: 16px;
      background-color: #fff;
      border-radius: 3px;
      box-shadow: 0 1px 1px rgb(9 30 66 / 25%), 0 0 1px 1px rgb(9 30 66 / 13%);
      &::before {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 4px;
        content: ' ';
        background-color: #0052cc;
        border-radius: 3px 3px 0 0;
      }
      .card-title {
        display: flex;
        .card-title-center {
          -webkit-box-flex: 1;
          flex: 1;
          font-size: 16px;
          font-weight: 700;
        }
        .card-title-right {
          flex-shrink: 0;
        }
      }
      .filter-bar {
        margin-top: 16px;
      }
      .filter-tag {
        display: inline-block;
        height: 32px;
        padding: 0 8px;
        line-height: 32px;
        color: #a5adba;
        background-color: #ebecf0;
        border-radius: 3px;
        margin-right: 8px;
      }
      .el-select {
      }
      &.statistics-card {
        // height: auto !important;
      }
    }
  }
  &.vux-flexbox {
    width: 100%;
    text-align: left;
    -webkit-box-align: center;
    display: flex;
    align-items: center;
  }
  &.vux-flexbox1 {
    width: 100%;
    text-align: left;
    -webkit-box-align: center;
    display: flex;
    align-items: flex-start;
  }
}
</style>