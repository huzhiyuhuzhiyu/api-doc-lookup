<template>
  <div>
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="'工序报工'" />
        <div class="options">

          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="pageForm">

        <el-tabs v-model="activeName">
          <el-collapse v-model="activeNames" style="margin-top: 5px;">

            <el-collapse-item title="工单信息" name="productInfo">


              <div>
                <div class="JNPF-common-head">
                  <div>
                    <el-row class="JNPF-common-search-box orderNosearch" :gutter="16">
                      <el-form @submit.native.prevent>
                        <el-col :span="6">
                          <el-form-item>
                            <el-input v-model="form.productionOrderNo" @keyup.enter.native="search()"
                              placeholder="生产任务单号" clearable />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item>
                            <el-input v-model="form.productDrawingNo" @keyup.enter.native="search()" placeholder="品名规格"
                              clearable />
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                              {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                              $t('common.reset') }}
                            </el-button>
                          </el-form-item>
                        </el-col>

                      </el-form>
                    </el-row>
                  </div>
                  <div class="JNPF-common-head-right">

                    <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                      <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                        @click="columnSetFun()" />
                    </el-tooltip>

                  </div>
                </div>
                <JNPF-table ref="dataTable" :partentOrChild="'orderInfo'" :data="workList" :fixedNO="true"
                  :setColumnDisplayList="columnList" custom-column :height="customStyleData2" @sort-change="sortChange">
                  <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom"></el-table-column>
                  <el-table-column prop="processCode" label="工序编码" min-width="160" sortable="custom"></el-table-column>
                  <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="160"
                    sortable="custom"></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="160"
                    sortable="custom"></el-table-column>
                  <el-table-column prop="processingType" label="加工类型" min-width="120" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.processingType == "self_produced" ? '自制' : "外协" }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processType" label="工单类型" min-width="120" sortable="custom">
                    <template slot-scope="scope">
                      <div v-if="scope.row.processType == 'normal'"> 正常工序</div>
                      <div v-if="scope.row.processType == 'vibrate'">测振工序</div>
                      <div v-if="scope.row.processType == 'heat_treatment'">热工工序</div>
                      <div v-if="scope.row.processType == 'packing'">包装工序</div>
                      <div v-if="scope.row.processType == 'pairs'">配对工序</div>
                      <div v-if="scope.row.processType == 'grinding'">磨孔工序</div>
                      <div v-if="scope.row.processType == 'accuracy'">精度工序</div>
                      <div v-if="scope.row.processType == 'fatInjection'">注脂工序</div>
                      <div v-if="scope.row.processType == 'typing'">打字工序</div>
                      <div v-if="scope.row.processType == 'boxing'">装盒工序</div>

                    </template>
                  </el-table-column>
                  <el-table-column prop="personName" label="人员" min-width="120" sortable="custom" />
                  <el-table-column prop="workGroupName" label="班组" min-width="120" sortable="custom" />
                  <el-table-column prop="equipmentName" label="设备" min-width="120" sortable="custom" />
                  <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom" />
                  <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom" />
                  <el-table-column prop="mainUnit" label="单位" min-width="80" />
                  <el-table-column prop="productionQuantity" label="生产数量" min-width="120" sortable="custom" />
                  <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" sortable="custom" />
                  <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="140" sortable="custom" />
                  <el-table-column prop="waitReportNum" label="可报工数量" min-width="140" sortable="custom" />
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

        </el-tabs>
      </div>


    </div>
    <NormalForm v-if="normalFormVisible" ref="normalForm" @close="closeForm"></NormalForm>
    <recordForm v-if="recordFormVisible" ref="recordForm"></recordForm>
    <Drawer v-if="vibrateFormVisible" ref="drawerForm" @close="closeForm"></Drawer>
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
import recordForm from './recordForm.vue'
import Drawer from './drawer.vue'
export default {

  components: {
    NormalForm, recordForm, Drawer
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
        { label: "正常任务", value: "normal", },
        { label: "返工任务", value: "rework", },
      ],
      dataForm: {
      },
      codeConfig: {},//单据规则配置
      workList: [],
      form: {
        productionOrderNo: "",
        productDrawingNo: "",
        processId: "",
        prodOrderStatus: 'normal',
        workReportFlag: true,
        processingType: "self_produced",
        classAttribute: "finish_product",
        processId: "",
        pageNum: -1,
        pageSize: -1,
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
      },

      currentProcess: {},
      listLoading: false,
      currentProcessId: "",
      id: "",
      sort: "",//测震工序序号
      tableData: [],
      processId: "",
      processData: {},
      customStyleData2: "",

    }
  },

  mounted() {
    this.switchStyleheight()
  },

  methods: {
    sortChange({ prop, order }) {
      let newProp;
      if (prop == 'productionOrderNo' || prop == 'productDrawingNo' || prop == 'processType' || prop == 'workGroupName' || prop == 'processName' || prop == 'waitReportNum' || prop == 'productCode' || prop == 'partnerCode' || prop == 'warehouseName' || prop == 'shelfSpaceName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order === 'ascending'
      this.form.orderItems[0].column = order === null ? "" : newProp
      this.getWorkListFun()
    },
    switchStyleheight() {
      const mainRegion1 = this.$refs.pageForm // 表单页面区域
      console.log("this.$refs", this.$refs);
      console.log(mainRegion1);
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight = mainHeight1 - 350
      this.customStyleData2 = maxHeight + 200
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    init(row) {
      console.log("供需信息", row);
      this.processData = row
      this.processId = this.form.processId = row.id
      this.getWorkListFun()
    },
    search() {
      this.getWorkListFun()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.form = {
        productionOrderNo: "",
        productDrawingNo: "",
        processId: this.processId,
        prodOrderStatus: 'normal',
        workReportFlag: true,
        processingType: "self_produced",
        classAttribute: "finish_product",
        pageNum: -1,
        pageSize: -1,
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
      },
        this.search()
    },
    getWorkListFun() {
      Object.keys(this.form).forEach(key => {
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      getWorkList(this.form).then(res => {

        this.workList = res.data.records
        if (!res.data.records.length) return this.$message.warning("暂无可报工数据")
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    closeForm(flag) {
      if (flag) this.getWorkListFun()
    },
    // 点击报工
    reportFun(row) {
      this.vibrateFormVisible = true
      this.$nextTick(() => {
        this.$refs.drawerForm.init(row)

      })

    },
    reportRecordsFun(row) {
      this.recordFormVisible = true
      this.$nextTick(() => {
        this.$refs.recordForm.init(row.orderNo)
      })
    },
    goBack() {
      this.$emit('close')
    },

  }
}
</script>
<style lang="scss" scoped>
.orderNosearch {
  padding-left: 0px;
}

// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 0px
}




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
  padding: 0px;
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
</style>