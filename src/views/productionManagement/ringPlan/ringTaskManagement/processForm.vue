<template>

  <el-dialog title="选择工序" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.code" placeholder="工序编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.name" placeholder="工序名称" clearable />
              </el-form-item>
            </el-col>


            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true" @selection-change="selectProcess" v-if="showFlag"
            :checkSelectable="dispurchaseData" @row-click="handleRowClick" hasC ref="processRef">
            <el-table-column prop="processName" label="工序名称"></el-table-column>
            <el-table-column prop="processCode" label="工序编码" />
            <el-table-column prop="processType" label="工序类型">
              <template slot-scope="scope">
                <div v-if="scope.row.processType == 'normal'">正常工序</div>
                <div v-if="scope.row.processType == 'wait_assemble'">待装配工序</div>
                <div v-if="scope.row.processType == 'vibrate'">测震工序</div>
              </template>
            </el-table-column>


            <el-table-column prop="processingType" label="加工类型" width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.processingType == 'self_produced'">自制</div>
                <div v-if="scope.row.processingType == 'external_production'">外协</div>
              </template>
            </el-table-column>
            <el-table-column prop="technicalRequirement" label="技术要求" width="180" show-overflow-tooltip
              v-if="isTechnicalSwitch === '1'">

            </el-table-column>
            <el-table-column prop="inspectionInformation" label="检验信息" width="180" show-overflow-tooltip
              v-if="isCheckingSwitch === '1'">

            </el-table-column>
            <el-table-column prop="workOrderFlag" label="是否生成工单" width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.workOrderFlag == true">是</div>
                <div v-if="scope.row.workOrderFlag == false">否</div>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
            @pagination="getbatchNumList" />
        </div>

      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="submitFun()">
        提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange, detailResourceProcess } from '@/api/basicData/processSettingss.js'
export default {
  data() {
    return {

      customerVisible: false,

      form: {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],

      },
      selectArr: [],
      listLoading: false,
      total: 0,
      tableDataList: [],
      id: "",
      processData: [],
      isTechnicalSwitch: "",
      isCheckingSwitch: "",
      showFlag:false,
    }
  },
  async created () {
    await this.getTechnicalSwitch('produce', 'technical_requirement')
    await this.getCheckingSwitch('produce', 'checking_information')
  },
  methods: {
    async getTechnicalSwitch(code, type) {
      try {
        this.isTechnicalSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getCheckingSwitch(code, type) {
      try {
        this.isCheckingSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.showFlag=true
      } catch (error) { }
    },
    init(id, processData) {
      console.log("init", id, processData);
      this.customerVisible = true
      this.id = id
      this.getProcessList(id)
      this.processData = processData
    },
    selectProcess(val) {
      this.selectArr = val
    },
    dispurchaseData(row) {
      return row.workOrderFlag;
    },
    submitFun() {
      if (!this.selectArr.length) return this.$message.error("请先选择工序")
      this.selectArr.sort(function (a, b) {
        return a.index - b.index;
      });

      if (this.processData.length > 0) {
        this.$confirm("此操作将更新工单表格数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.processDialog = false;
          this.selectArr.forEach((item, index) => {
            item.workOrderQuantity = this.reworkForm.productionQuantity;
            item.planEndDate = this.reworkForm.planEndDate;
            item.planStartDate = this.reworkForm.planStartDate;
            item.firstFlag = false;
            item.lastFlag = false;
            if (index == 0) {
              item.firstFlag = true;
              item.lastFlag = false;
              this.$set(this.selectArr[index], 'lastFlag', false)
              this.$set(this.selectArr[index], 'firstFlag', true)
            } else if (index == this.selectArr.length - 1) {

              this.$set(this.selectArr[index], 'firstFlag', false)
              this.$set(this.selectArr[index], 'lastFlag', true)
              this.$set(this.selectArr[index], 'stockFlag', true)
              if (this.selectArr[index].processingType !== "self_produced") {
                item.reportFlag = false;
              } else {
                item.reportFlag = true;
              }
            } else {
              item.firstFlag = false;
              item.lastFlag = false;
            }
            if (item.processingType !== "self_produced") {
              item.stockFlag = true
            }

            item.orderType = "rework";
            console.log("234", item.processingType);
            if (item.processingType !== "self_produced" && this.selectArr.length > 1) {
              console.log(333, this.selectArr, index);
              if (item.firstFlag) {
                this.selectArr[index].stockFlag = true;
              }
              console.log(666, index);
              this.selectArr[index - 1].stockFlag = true;
              this.selectArr[index - 1].reportFlag = true;

            }

          });
          if (this.selectArr.length == 1) {
            this.selectArr[0].firstFlag = true;
            this.selectArr[0].lastFlag = true;
            this.selectArr[0].stockFlag = true;
            console.log("345", this.selectArr[0]);
            if (this.selectArr[0].processingType !== "self_produced") {
              this.selectArr[0].reportFlag = false;
            } else {
              this.selectArr[0].reportFlag = true;

            }
          }
          setTimeout(() => {
            this.$emit('selectProcess', this.selectArr)
          }, 500);
        });
      } else {
        this.processDialog = false;
        this.selectArr.forEach((item, index) => {

          item.firstFlag = false;
          item.lastFlag = false;
          if (index == 0) {
            item.firstFlag = true;
            item.lastFlag = false;
          } else if (index == this.selectArr.length - 1) {
            item.firstFlag = false;
            item.lastFlag = true;
            item.stockFlag = true;
            if (this.selectArr[index].processingType !== "self_produced") {
              item.reportFlag = false;
            } else {
              item.reportFlag = true;
            }
          } else {
            item.firstFlag = false;
            item.lastFlag = false;
          }
          if (item.processingType !== "self_produced") {
            this.$set(item, 'stockFlag', true)
          }

          item.orderType = "rework";
          if (item.processingType !== "self_produced" && this.selectArr.length > 1) {
            if (item.firstFlag) {
              this.selectArr[index].stockFlag = true;
            } else {

              this.selectArr[index - 1].stockFlag = true;
              this.selectArr[index - 1].reportFlag = true;
            }
          }
        });
        if (this.selectArr.length == 1) {
          this.selectArr[0].firstFlag = true;
          this.selectArr[0].lastFlag = true;
          this.selectArr[0].stockFlag = true;
          if (this.selectArr[0].processingType !== "self_produced") {
            this.selectArr[0].reportFlag = false;
          } else {
            this.selectArr[0].reportFlag = true;

          }
        }

        console.log("selectArr", this.selectArr);
        setTimeout(() => {
          this.$emit('selectProcess', this.selectArr)
        }, 500);
      }
      this.$emit("selectProcess", this.selectArr)
      this.customerVisible = false
    },
    handleRowClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return
      const isSelected = this.$refs.processRef.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },

    getProcessList(id) {
      this.listLoading = true
      detailProcess(id).then(res => {
        this.listLoading = false
        console.log("工艺详情", res);
        let linesData = res.data.routingLineList
        console.log(linesData);
        linesData.forEach(item => {
          item.selectFlag = false
          item.personId = "";
          item.workGroupId = "";
          item.equipmentId = "";

          item.personName = "";
          item.workGroupName = "";
          item.equipmentName = "";
          item.equipmentCode = "";
          if (item.routingProResMap) {
            if (item.routingProResMap.personnel) {
              item.personId = item.routingProResMap.personnel[0].resourceId;
              item.personName = item.routingProResMap.personnel[0].resourceName;
            }
            if (item.routingProResMap.work_group) {
              item.workGroupId = item.routingProResMap.work_group[0].resourceId;
              item.workGroupName = item.routingProResMap.work_group[0].resourceName;
            }

          } else {
          }
        });
        this.tableDataList = linesData

      }).catch(() => {
        this.listLoading = false
      })

    },

    search() {
      this.getProcessList(this.id)
    },
    reset() {
      this.form = {
        code: "",
        name: "",
        documentStatus: "submit",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],
      }
      this.search()
    },
  }
}
</script>
<style scoped>
.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 10px !important;
}

.selectProcess.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body {
  padding: 0 !important;
}
</style>
