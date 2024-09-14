<template>
  <el-dialog title="报工" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    @close="customerVisible = false" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px" append-to-body>
    <el-row :gutter="20">

      <el-form ref="reportRef" :model="form" :rules="dataRule" label-width="120px" label-position="top">
        <el-row :gutter="20">
          <el-col :sm="8" :xs="24">
            <el-form-item label="工单单号">
              <el-input v-model="form.workOrderNo" placeholder="工序编码" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="工单类型">
              <el-select v-model="form.orderType" placeholder="工单类型" style="width: 100%;" disabled>
                <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="8" :xs="24">
            <el-form-item label="品名规格">
              <el-input v-model="form.productDrawingNo" placeholder="品名规格" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="加工工序">
              <el-input v-model="form.processName" placeholder="加工工序" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="加工数量">
              <el-input v-model="form.productionQuantity" placeholder="加工数量" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="可报工数量">
              <el-input v-model="form.waitReportNum" placeholder="可报工数量" disabled />
            </el-form-item>
          </el-col>

          <el-col :sm="8" :xs="24">
            <el-form-item label="打字内容">
              <el-input v-model="form.sealingCoverTyping" placeholder="打字内容" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="精度等级">
              <el-input v-model="form.accuracyLevel" placeholder="精度等级" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="振动等级">
              <el-input v-model="form.vibrationLevel" placeholder="振动等级" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="油脂">
              <el-input v-model="form.oil" placeholder="油脂" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="油脂量">
              <el-input v-model="form.oilQuantity" placeholder="油脂量" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="游隙">
              <el-input v-model="form.clearance" placeholder="游隙" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="包装方式">
              <el-input v-model="form.packagingMethod" placeholder="包装方式" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="特殊要求">
              <el-input v-model="form.specialRequire" placeholder="特殊要求" disabled />
            </el-form-item>
          </el-col>

          <el-col :sm="8" :xs="24">
            <el-form-item label="合格数量" prop="qualifiedQuantity">
              <el-input v-model="form.qualifiedQuantity" placeholder="合格数量" />
            </el-form-item>
          </el-col>


          <el-col :sm="8" :xs="24">
            <el-form-item label="不合格数量">
              <el-input v-model="form.unqualifiedQuantity" placeholder="不合格数量" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="责废数量">
              <el-input v-model="form.responsibilityWasteQuantity" placeholder="责废数量"  @blur="handleBlur2"/>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="料废数量">
              <el-input v-model="form.materialWasteQuantity" placeholder="料废数量"   @blur="handleBlur3" />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="返工数量">
              <el-input v-model="form.reworkQuantity" placeholder="返工数量" />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="报工时间" prop="reportingTime">
              <el-date-picker v-model="form.reportingTime" :default-value="new Date()" type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择报工时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="生产人" prop="producerName" v-if="form.taskMethod == 'appoint'">
              <el-select v-model="form.producerName" placeholder="生产人" style="width: 100%;">
                <el-option v-for="(item, index) in personList" :key="index" :label="item.label"
                  :value="item.id"></el-option>
              </el-select>

              <!-- producerId -->
            </el-form-item>
            <el-form-item label="生产人" prop="producerId" v-if="form.taskMethod == 'not_appoint'">
              <user-select v-model="form.producerId" placeholder="生产人" clearable style="width: 100%;"
                @change="hangleSelectSales">
              </user-select>

            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="设备">
              <el-select v-model="form.equipmentName" placeholder="设备" style="width: 100%;">
                <el-option v-for="(item, index) in equipmentList" :key="index" :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
              <!-- equipmentId -->
            </el-form-item>
          </el-col>
          <el-col :sm="16" :xs="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2" />
            </el-form-item>
          </el-col>



        </el-row>
      </el-form>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitReportFun()">
        提交</el-button>
    </span>
  </el-dialog>

</template>
<script>
import { detailordershengchan, getWorkList, addWorkReport, detailWorkData } from '@/api/productOrdes/index.js'
import { producePersonList } from "@/api/warehouseManagement/packingList.js"

export default {
  data() {
    return {
      dataRule: {
        reportingTime: [
          { required: true, message: '报工时间不能为空', trigger: 'change' }
        ],
        producerName: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        producerId: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        qualifiedQuantity: [
          { required: true, message: '合格数量不能为空', trigger: 'blur' },
          { validator: this.formValidate({ type: "decimal", params: [20, 2, "请输入正确的数量(最多保留2位小数,整数8位)"], }), trigger: "blur", },
          { validator: this.formValidate('noZero', '合格数量不能为0', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' },
        ]
      },

      personList: [],
      equipmentList: [],
      orderTypeList: [
        { label: "正常工单", value: "normal", },
        { label: "返工工单", value: "rework", },
      ],
      customerVisible: false,

      form: {
        orderNo: "",
        orderType: "",
        productDrawingNo: "",
        processName: "",
        productionQuantity: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        specialRequire: "",
        qualifiedQuantity: 0,
        unqualifiedQuantity: "",
        responsibilityWasteQuantity: "",
        materialWasteQuantity: "",
        reworkQuantity: "0",
        reportingTime: "",
        producerName: "",
        producerId: "",
        equipmentName: "",
        equipmentId: "",
        remark: "",
        workOrderNo: "",
      },
      selectArr: [],
      listLoading: false,
      total: 0,
      tableDataList: [],
      id: "",
      processData: [],
      codeConfig: {},
      vibrationLevelList: []
    }
  },
  methods: {
    handleBlur2() {
      this.form.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.materialWasteQuantity, this.form.responsibilityWasteQuantity]), 6)
 
    },
    handleBlur3() {
      this.form.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.materialWasteQuantity, this.form.responsibilityWasteQuantity]), 6)
       
    },
    //生产人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.form.validateField('producerId')
      })
      this.form.producerId = e
    },
    init(workData) {
      console.log("workData", workData);
      this.customerVisible = true

      this.getDetailWorkDataFun(workData.id)
      this.fetchData("RRDH")
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.form.orderNo = data.number
      } catch (error) {
      }
    },
    // 获取工单详情
    getDetailWorkDataFun(id) {
      detailWorkData(id).then(res => {
        console.log("工单详情", res);
        res.data.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [res.data.materialWasteQuantity, res.data.responsibilityWasteQuantity]), 6)
        this.form = res.data
        this.$set(this.form, 'workOrderNo', this.form.orderNo)
        this.$set(this.form, 'qualifiedQuantity', 0)
        console.log("form", this.form);
        this.producePersonListFun(res.data.id)
        const end = new Date();//获取当前的日期
        this.form.reportingTime = this.dateFormat(end)
      })
    },
    // 获取生产人员数据
    producePersonListFun(id) {
      producePersonList(id).then(res => {

        console.log("生产人", res);
        if (res.data) {
          let result = Object.entries(res.data).map(([key, value]) => {
            return {
              id: key,
              label: value
            };
          });
          this.personList = result
          console.log(result);
          if (result.length > 0) {
            this.$set(this.form, 'producerId', result[0].id)
            this.$set(this.form, 'producerName', result[0].label)

            this.$nextTick(() => {
              this.$refs.reportRef.clearValidate('producerName')
            })
          }
        }
      })
    },
    // 提交报工
    submitReportFun() {

      this.$refs['reportRef'].validate((valid) => {
        if (valid) {
          let submitFlag = null
          let totalNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.unqualifiedQuantity, this.form.qualifiedQuantity]), 6)
          if (totalNum > Number(this.form.waitReportNum)) {
            this.submitFlag = false
            this.$message.error("合格数量加上不合格数量不能超过可报工数量")
            return
          }
          if (submitFlag === false) return
          let arr = []
          let obj = {
            "classAttribute": this.form.classAttribute,
            orderType: this.form.orderType,
            productDrawingNo: this.form.productDrawingNo,
            processName: this.form.processName,
            productionQuantity: this.form.productionQuantity,
            equipmentId: this.form.equipmentId,
            remark: this.form.remark,
            reportingTime: this.form.reportingTime,
            reworkQuantity: this.form.reworkQuantity,
            responsibilityWasteQuantity: this.form.responsibilityWasteQuantity,
            reworkQuantity: this.form.reworkQuantity,
            "materialWasteQuantity": this.form.materialWasteQuantity,
            "orderNo": this.form.orderNo,
            "pricingType": this.form.pricingType,
            "processId": this.form.processId,
            "producerId": this.form.producerId,
            "productionOrderId": this.form.productionOrderId,
            "qualifiedQuantity": this.form.qualifiedQuantity,
            "reportingQuantity": this.form.qualifiedQuantity,
            "reportingType": "normal ",
            "unqualifiedQuantity": this.form.unqualifiedQuantity,
            "vibrationLevel": this.form.vibrationLevel,
            "workOrderId": this.form.id,
          }
          arr.push(obj)
          addWorkReport(arr).then(res => {
            this.customerVisible = false
            this.$message.success("报工成功")
            this.$emit('close', true)
          })
        }
      })
    },





    dateFormat(dateData) {
      var date = new Date(dateData);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var hours = date.getHours().toString().padStart(2, "0");
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate
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
