<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">合同汇总表</div>
        </div>
        <div class="xr-radio-menu-wrap">
          <el-date-picker v-model="dataForm.year" type="year" value-format="yyyy" placeholder="选择年" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="xr-radio-menu-wrap">
          <selectdepartment @change="departmentchange"></selectdepartment>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search()">
          {{ $t('common.search') }}</el-button>
        <el-button type="primary" v-has="'btn_export'" icon="el-icon-download">导出</el-button>
      </div>
      <div class="content-table-main">
        <div class="axis-content">
          <div class="content-title">签约合同数：<span>{{totalcontractNum}}</span>个；签约合同金额：<span>{{totalcontractMoney}}</span>元；回款金额：<span>{{totalreceivablesMoney}}</span>元；未回款金额：<span>{{totalcontractMoney*1-totalreceivablesMoney*1}}</span>元</div>
        </div>
        <div class="table-content" v-loading="listLoading">
          <!-- <div class="handle-bar">
            <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download">导出</el-button>
          </div> -->
          <JNPF-table ref="tabForm" :data="tableList" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;">
            <el-table-column prop="type" label="日期" min-width="160" />
            <el-table-column prop="contractNum" label="签约合同数(个)" min-width="140" />
            <el-table-column prop="contractMoney" label="签约合同金额(元)" min-width="140" />
            <el-table-column prop="receivablesMoney" label="回款金额(元)" min-width="140" />
          </JNPF-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { gettotalContract } from "@/api/CRMmanagement/instrumentPanel/index";
import selectdate from "../components/selectdate";
import selectdepartment from "../components/selectdepartment";
export default {
  components: {
    selectdate,
    selectdepartment
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      listLoading: false,
      dataForm: {
        year: "",
        userIds: []
      },
      tableList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    totalcontractNum: function () {
      let totalNum = 0;
      for (var i = 0; i < this.tableList.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.tableList[i].contractNum * 1])
      }
      return totalNum
    },
    totalcontractMoney: function () {
      let totalNum = 0;
      for (var i = 0; i < this.tableList.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.tableList[i].contractMoney * 1])
      }
      return totalNum
    },
    totalreceivablesMoney: function () {
      let totalNum = 0;
      for (var i = 0; i < this.tableList.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.tableList[i].receivablesMoney * 1])
      }
      return totalNum
    },
  },
  created() {
    this.dataForm.userIds = [this.userInfo.userId]
    this.dataForm.year = this.jnpf.getToday('YYYY')
    this.initData()
  },
  methods: {
    search() {
      this.initData()
    },
    departmentchange(data) {
      this.dataForm.userIds = data
    },
    initData() {
      this.listLoading = true
      gettotalContract(this.dataForm).then(res => {
        this.tableList = res.data
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.JNPF-flex-main {
  padding: 14px 0 0 14px;
}
.JNPF-common-layout {
  background-color: #fff;
}
.filtrate-content {
  ::v-deep .el-button--small {
    padding: 8px 15px;
  }
  .title-box {
    width: auto;
    max-width: 250px;
    margin-right: 24px;
    .icon-box {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      margin-right: 10px;
      line-height: 34px;
      color: #0052cc;
      text-align: center;
      background-color: #dfe8ff;
      border-radius: 50%;
    }
    .text-one-line {
      font-size: 20px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .xr-radio-menu-wrap {
    margin-right: 16px;
  }
}
.content-table-main {
  height: calc(100% - 54px);
  padding-bottom: 24px;
  margin-top: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  .axis-content {
    margin-right: 40px;
    margin-bottom: 15px;
    .content-title {
      padding: 8px 40px;
      font-size: 16px;
      span {
        margin-right: 3px;
        font-weight: 700;
      }
    }
  }
  .table-content {
    flex: 1;
    min-height: 500px;
    padding-right: 14px;
    .handle-bar {
      margin-bottom: 8px;
      text-align: right;
    }
  }
}
</style>