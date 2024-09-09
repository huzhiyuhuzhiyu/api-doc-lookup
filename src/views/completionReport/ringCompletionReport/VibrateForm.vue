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
            <el-form-item label="报工数量">
              <el-input v-model="form.reportingQuantity" placeholder="报工数量" disabled />
            </el-form-item>
          </el-col>

          <el-col :sm="8" :xs="24">
            <el-form-item label="孔径" :prop="aperture">
              <el-select v-model="form.aperture" placeholder="孔径" style="width: 100%;">
                <el-option v-for="(item, index) in apertureList" :key="index" :label="item.label"
                  :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="不合格数量">
              <el-input v-model="form.unqualifiedQuantity" placeholder="不合格数量" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="责废数量">
              <el-input v-model="form.responsibilityWasteQuantity" placeholder="责废数量" disabled />
            </el-form-item>
          </el-col>
          <el-col :sm="8" :xs="24">
            <el-form-item label="料废数量">
              <el-input v-model="form.materialWasteQuantity" placeholder="料废数量" disabled />
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
            <el-form-item label="生产人" prop="producerName">
              <el-select v-model="form.producerName" placeholder="生产人" style="width: 100%;">
                <el-option v-for="(item, index) in personList" :key="index" :label="item.label"
                  :value="item.id"></el-option>
              </el-select>
              <!-- producerId -->
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
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
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
        qualifiedQuantity: "",
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
        aperture: "",
      },
      apertureList: [],
      selectArr: [],
      listLoading: false,
      total: 0,
      tableDataList: [],
      id: "",
      processData: [],
      codeConfig: {},
      vibrationLevelList: [],
      totalReportNum: 0,
    }
  },
  methods: {
    forceUpdata() {
      this.$forceUpdate()
    },
    handleBlur(item, data) {
      console.log("item", item, data, this.form.item);
      let total = Object.values(this.form.item)
        .map(Number) // 将每个值转换为数字  
        .reduce((acc, curr) => acc + curr, 0); // 使用 reduce 方法计算总和
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [total, this.form.unqualifiedQuantity]), 6)
      this.$set(this.form, 'reportingQuantity', this.totalReportNum)
    },
    init(workData) {
      console.log("workData", workData);
      this.customerVisible = true

      this.getDetailWorkDataFun(workData.id)

    },

    // 获取振动等级数据
    getvibrationLevelFun() {

      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa009",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj3).then(res => {
        console.log("振动等级数据", res);
        this.apertureList = res.data.records

        console.log(666666, this.form);
      })
    },
    // 获取工单详情
    getDetailWorkDataFun(id) {
      detailWorkData(id).then(res => {
        console.log("工单详情", res);
        res.data.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [res.data.materialWasteQuantity, res.data.responsibilityWasteQuantity]), 6)
        this.form = res.data
        this.$set(this.form, 'workOrderNo', this.form.orderNo)
        this.$set(this.form, 'item', {})
        console.log("form", this.form);
        this.getvibrationLevelFun()
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
      console.log("this.form", this.form);
      this.$refs['reportRef'].validate((valid) => {
        if (valid) {
          let submitFlag = null
          if (this.totalReportNum > Number(this.form.waitReportNum)) {
            this.submitFlag = false
            this.$message.error("合格数量加上不合格数量不能超过可报工数量")
            return
          }
          if (submitFlag === false) return
          let arr = []
          let obj = {}
          obj.classAttribute = this.form.classAttribute
          obj.orderType = this.form.orderType
          obj.productDrawingNo = this.form.productDrawingNo
          obj.processName = this.form.processName
          obj.productionQuantity = this.form.productionQuantity
          obj.equipmentId = this.form.equipmentId
          obj.remark = this.form.remark
          obj.reportingTime = this.form.reportingTime
          obj.reworkQuantity = this.form.reworkQuantity
          obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
          obj.materialWasteQuantity = this.form.materialWasteQuantity
          obj.pricingType = this.form.pricingType
          obj.processId = this.form.processId
          obj.producerId = this.form.producerId
          obj.productionOrderId = this.form.productionOrderId
          obj.reportingType = "normal"
          obj.unqualifiedQuantity = this.form.unqualifiedQuantity
          obj.aperture = this.form.aperture
          obj.workOrderId = this.form.id
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
