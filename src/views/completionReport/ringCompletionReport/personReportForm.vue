<template>
  <div>
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="'人员报工'" />
        <div class="options">

          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-collapse v-model="activeNames" style="margin-top: 10px;">

          <el-collapse-item title="工单信息" name="productInfo">


            <div>
              <div class="JNPF-common-head">
                <div></div>
                <div class="JNPF-common-head-right">

                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun()" />
                  </el-tooltip>

                </div>
              </div>
              <JNPF-table ref="dataTable" :partentOrChild="'orderInfo'" :data="workList" :fixedNO="true"
                @sort-change="sortChange" :setColumnDisplayList="columnList" custom-column class="groupBox">
                <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom"></el-table-column>
                <el-table-column prop="processCode" label="工序编码" min-width="160" sortable="custom"></el-table-column>
                <el-table-column prop="processingType" label="加工类型" min-width="120" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.processingType == "self_produced" ? '自制' : "外协" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="workGroupName" label="班组" min-width="120" sortable="custom" />
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom" />
                <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" min-width="80" />
                <el-table-column prop="productionQuantity" label="生产数量" min-width="120" sortable="custom" />
                <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" sortable="custom" />
                <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="140" sortable="custom" />
                <el-table-column prop="waitReportNum" label="可报工数量" min-width="140" sortable="custom" />
                <el-table-column prop="productionLineName" label="产线" min-width="120" sortable="custom" />
                <el-table-column prop="workstationName" label="工位" min-width="120" sortable="custom" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="reportFun(scope.row)">报工</el-button>
                    <el-button size="mini" type="text" @click="reportRecordsFun(scope.row)">查看报工记录</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>

              <!-- <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                        @pagination="initData"> -->

              <!-- </pagination> -->

            </div>




          </el-collapse-item>
        </el-collapse>

      </div>


    </div>
    <NormalForm v-if="normalFormVisible" ref="normalForm" @close="closeForm"></NormalForm>
    <VibrateForm v-if="vibrateFormVisible" ref="VibrateForm" @close="closeForm"></VibrateForm>
    <recordForm v-if="recordFormVisible" ref="recordForm"></recordForm>

  </div>
</template>

<script>

import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { detailProcess, } from '@/api/basicData/processSettingss.js'
import { detailordershengchan, getWorkList, addWorkReport } from '@/api/productOrdes/index.js'
import { log } from 'mathjs'
import NormalForm from './NormalForm.vue'
import VibrateForm from './VibrateForm.vue'
import recordForm from './recordForm.vue'

export default {

  components: {
    NormalForm, VibrateForm, recordForm
  },
  data() {
    return {
      recordFormVisible: false,
      columnList: ["processCode"],
      normalFormVisible: false,
      vibrateFormVisible: false,
      activeName: 'orderInfo',
      activeNames: ['productInfo'],
      orderTypeList: [
        { label: "正常订单", value: "normal", },
        { label: "返工订单", value: "rework", },
      ],
      dataForm: {
      },
      codeConfig: {},//单据规则配置
      workList: [],
      form: {
        personId: "",
        prodOrderStatus: 'normal',
        workReportFlag: true,
        processingType: "self_produced",
        "orderItems": [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "plan_start_date"
          }
        ],
        classAttribute: "semi_finished",
      },

      currentProcess: {},
      listLoading: false,
      currentProcessId: "",
      id: "",
      sort: "",//测震工序序号
      tableData: [],
      processData: {},
    }
  },

  mounted() {
  },

  methods: {
    init(row) {
      console.log("供需信息", row);
      this.processData = row
      this.form.personId = row.id
      this.getWorkListFun()
    },
    getWorkListFun() {
      getWorkList(this.form).then(res => {
        this.workList = res.data.records
        if (!res.data.records.length) return this.$message.warning("暂无可报工数据")
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 点击报工
    reportFun(row) {
      this.vibrateFormVisible = true
      this.$nextTick(() => {
        this.$refs.VibrateForm.init(row)

      })

    },
    reportRecordsFun(row) {
      this.recordFormVisible = true
      this.$nextTick(() => {
        this.$refs.recordForm.init(row.orderNo)
      })
    },
    goBack() {
      this.$emit('close', true)
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop === 'processName' || prop === 'workstationName' || prop === 'workGroupName' || prop == 'productionLineName') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order !== "descending"
      this.form.orderItems[0].column = order === null ? "" : newProp

      this.getWorkListFun()
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 10px
}



//.el-button--small {
// padding: 1;
//}</style>
::v-deep .el-tabs__content {
height: auto !important;
padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
padding: 9px 10px;
}
</style>
<style scoped lang="scss">
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding:  0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}


.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important
}

.options {
  display: inline-block;
  float: right;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

.setipImg {
  width: 60px;
  height: 60px;
}

.reportBox_left {
  /* padding-right: 10px; */
  /* margin-right: 15px; */
  background: #fff;
  /* margin-right: 5px; */
  padding-right: 10px;
  box-sizing: border-box;
  border-right: 5px solid #ebeef5;
  padding: 10px 0 10px 0;
  width: 220px;
  height: 640px;
  display: inline-block;
  overflow-y: auto;
}

.reportBox_left::-webkit-scrollbar {
  display: none;
  /* 对于 Chrome, Safari 和 Opera 的写法 */
}

.processInfoBox {
  width: 90%;
  height: 80px;
  border: 1px solid #ebeef5;
  margin: 0 auto;
  line-height: 80px;
  border-radius: 2px;
  font-size: 18px;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  text-overflow: ellipsis;
}

.processInfo {
  width: 90%;
  height: 80px;
  border: 1px solid #0b80e0;
  margin: 0 auto;
  line-height: 80px;
  border-radius: 2px;
  background-color: #0b80e0;
  color: #fff;
  font-size: 18px;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  text-overflow: ellipsis;
}

.info {
  width: calc(100% - 220px);
  display: inline-block;
  vertical-align: top;
  height: 640px;
  overflow-y: auto;
}

.info::-webkit-scrollbar {
  display: none;
  /* 对于 Chrome, Safari 和 Opera 的写法 */
}

box-card:nth-child(n+3) {
  margin-top: 10px
}

.groupBox ::v-deep .el-table__body-wrapper {
  height: auto !important;
}
</style>