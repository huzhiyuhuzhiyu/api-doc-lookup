<template>
  <div class="JNPF-common-layout crmDashboard">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="crm-workbench__hd">
        <div class="el-dropdown" @click="aaaa">
          CRM仪表盘
        </div>
      </div>
      <div class="crm-head">
        <div class="vux-flexbox head__body vux-flex-row">
          <div>
            <selectdate @change="datechange" @inputcontent="inputcontent"></selectdate>
          </div>
          <div style="margin-left: 8px;">
            <selectdepartment @change="departmentchange" @inputcontent="depinputcontent"></selectdepartment>
          </div>
          <el-button style="margin-left: auto;" size="mini" icon="el-icon-more" @click="dialogVisible=true"></el-button>
        </div>
      </div>
      <div style="padding-top:16px;">
        <flexbox :Requestparameters="dataForm"></flexbox>
      </div>
      <div class="vux-flex-row section vux-flexbox1">
        <div class="left">
          <draggable v-model="list" @start="drag=true" @end="drag=false" group="arr">
            <chartlist v-for="item in list" :key="item.id" :type="item.typeChart" :Requestparameters="dataForm"></chartlist>
          </draggable>
        </div>
        <div class="right">
          <draggable v-model="list1" @start="drag=true" @end="drag=false" group="arr">
            <chartlist v-for="item in list1" :key="item.id" :type="item.typeChart" :Requestparameters="dataForm"></chartlist>
          </draggable>
        </div>
      </div>
    </div>
    <el-dialog title="仪表盘模块设置" :visible.sync="dialogVisible" width="30%" custom-class="no-padding-dialog" :close-on-click-modal="false">
      <div class="handle-box">
        <div class="reminder-wrapper">
          <div class="vux-flexbox reminder-body vux-flex-row">
            <i style="margin-right: 8px;font-size: 16px;color: #ff8b00;" class="el-icon-warning"></i>
            <div style="font-size:14px">点击开启/关闭按钮可设置模块是否在仪表盘显示，点击保存按钮即可生效</div>
          </div>
        </div>
        <div class="vux-flexbox section vux-flex-row">
          <div class="left">
            <div class="vux-flexbox sort-item vux-flex-row" v-for="(item,index) in crmlist.left" :key="index">
              <div style="flex:1;">{{item.name}}</div>
              <div>
                <el-switch v-model="item.value"></el-switch>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="vux-flexbox sort-item vux-flex-row" v-for="(item,index) in crmlist.right" :key="index">
              <div style="flex:1;">{{item.name}}</div>
              <div>
                <el-switch v-model="item.value"></el-switch>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import selectdate from "@/views/CRMmanagement/reportAnalysis/components/selectdate";
import selectdepartment from "@/views/CRMmanagement/reportAnalysis/components/selectdepartment";
import { mapGetters } from 'vuex'
import chartlist from "./chartlist/index.vue";
import draggable from 'vuedraggable';
import flexbox from "./flexbox/index.vue";
export default {
  components: {
    flexbox,
    draggable,
    chartlist,
    selectdepartment,
    selectdate
  },
  data() {
    return {
      crmlist: {
        left: [
          { name: '合同/回款金额目标及完成情况', value: false },
          { name: '排行榜', value: false },
          { name: '销售漏斗', value: false }
        ],
        right: [
          { name: '数据汇总', value: false },
          { name: '业绩指标完成率', value: false },
          { name: '遗忘提醒', value: false }
        ]
      },
      dialogVisible: false,
      dataForm: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: [],
        daterangecontent: '',
        personnelcontent: ''
      },
      list: [
        { name: '合同金额目标及完成情况', id: '1', typeChart: 'contractamount' },
        { name: '排行榜', id: '2', typeChart: 'rankinglist' },
        { name: '销售漏斗', id: '3', typeChart: 'salesfunnel' }
      ],
      list1: [
        { name: '数据汇总', id: '11', typeChart: 'datasummary' },
        { name: '目标完成率', id: '22', typeChart: 'targetcompletionrate' },
        { name: '客户遗忘提醒', id: '33', typeChart: 'forgettingreminder' }
      ]
    }
  },
  created() {
    this.dataForm.userIds = [this.userInfo.userId]
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    aaaa() {
      console.log(this.list, this.list1, '11111111+++');
    },
    depinputcontent(value) {
      this.dataForm.personnelcontent = value
    },
    inputcontent(value) {
      this.dataForm.daterangecontent = value
    },
    departmentchange(data) {
      this.dataForm.userIds = data
    },
    datechange(data) {
      this.dataForm.startTime = data.dateStart
      this.dataForm.endTime = data.dateEnd
      this.dataForm.type = data.value
    },
  }
}
</script>

<style lang="scss" scoped>
.crmDashboard {
  ::v-deep .no-padding-dialog .el-dialog__body {
    padding: 0;
  }
  .handle-box {
    padding: 16px;
    .reminder-wrapper {
      overflow: hidden;
      .reminder-body {
        width: auto;
        padding: 4px 16px 4px 8px;
        line-height: 1.5;
        background-color: #fffae6;
        border-radius: 3px;
      }
    }
    .section {
      margin-top: 12px;
      user-select: none;
      overflow: auto;
      .sort-item {
        padding: 16px;
        background-color: #ebecf0;
        border-radius: 3px;
      }
      .sort-item + .sort-item {
        margin-top: 16px;
      }
      .left {
        width: calc(50% - 6px);
        margin-right: 16px;
      }
      .right {
        width: calc(50% - 6px);
      }
    }
  }
}
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
    padding-bottom: 0;
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