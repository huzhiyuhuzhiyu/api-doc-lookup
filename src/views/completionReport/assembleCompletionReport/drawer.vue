<template>
  <!-- <el-drawer @closed="cancelFun" title="报工" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="customerVisible" lock-scroll class="JNPF-common-drawer" size="70%" :wrapperClosable="false">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template> -->

  <!-- </el-drawer> -->
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    @close="customerVisible = false" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1400px" append-to-body>
    <div style="padding:10px">
      <el-col :span="11" class="fixedInfo" :style="{ height: targetHeight + 'px!important' }"
        style="width: 48%!important;">
        <el-row>
          <el-col :sm="24" :xs="24">

            <div class="info">
              <span class="left-title">工单单号：</span>
              <el-tooltip class="item" effect="dark" :content="form.workOrderNo" placement="top-start">
                <span class="left-title ts">
                  {{ form.workOrderNo }}
                </span>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :sm="24" :xs="24">
            <div class="info">
              <span class="left-title">工单类型：</span>
              <span class="left-title" v-if="form.orderType == 'normal'">正常工单</span>
              <span class="left-title" v-if="form.orderType == 'rework'">返工工单</span>
            </div>
          </el-col>

          <el-col :sm="24" :xs="24">
            <div class="info">
              <span class="left-title">品名规格：</span>
              <el-tooltip class="item" effect="dark" :content="form.productDrawingNo" placement="top-start">
                <span class="left-title ts">
                  {{ form.productDrawingNo }}
                </span>
              </el-tooltip>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24">
            <div class="info">
              <span class="left-title">加工工序：</span>
              <span class="left-title">{{ form.processName }}</span>
            </div>

          </el-col>


          <el-col :sm="24" :xs="24" v-if="sealingCoverTypingFlag === '1'">
            <div class="info">
              <span class="left-title">打字内容：</span>
              <span class="left-title">{{ form.sealingCoverTyping }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="accuracyLevelFlag === '1'">
            <div class="info">
              <span class="left-title">精度等级：</span>
              <span class="left-title">{{ form.accuracyLevel }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="vibrationLevelFlag === '1'">
            <div class="info">
              <span class="left-title">振动等级：</span>
              <span class="left-title">{{ form.vibrationLevel }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="oilFlag === '1'">
            <div class="info">
              <span class="left-title">油脂：</span>
              <span class="left-title">{{ form.oil }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="oilQuantityFlag === '1'">
            <div class="info">
              <span class="left-title">油脂量：</span>
              <span class="left-title">{{ form.oilQuantity }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="clearanceFlag === '1'">
            <div class="info">
              <span class="left-title">游隙：</span>
              <span class="left-title">{{ form.clearance }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="packagingMethodFlag === '1'">
            <div class="info">
              <span class="left-title">包装方式：</span>
              <span class="left-title">{{ form.packagingMethod}}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="specialRequireFlag === '1'">
            <div class="info">
              <span class="left-title">特殊要求：</span>
              <span class="left-title">{{ form.specialRequire }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="materialFlag === '1'">
            <div class="info">
              <span class="left-title">保持架材质：</span>
              <span class="left-title">{{ form.material }}</span>
            </div>
          </el-col>
          <el-col :sm="24" :xs="24" v-if="colourFlag === '1'">
            <div class="info">
              <span class="left-title">颜色：</span>
              <span class="left-title">{{ form.colour }}</span>
            </div>
          </el-col>

        </el-row>
      </el-col>
      <el-col :span="12" class="rightInfo" ref="mycol">
        <el-form ref="reportRef" :model="form" :rules="dataRule" label-width="160px" label-position="left">
          <el-row>
            <div style="margin-bottom: 10px; background: #f2f2f2; padding: 20px 16px;">
              <span style="font-size: 18px;font-weight: bold">加工数量：</span><span
                style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{
                  form.productionQuantity }}]</span>
              <span style="font-size: 18px;font-weight: bold;margin-left: 10px;">可报工数量：</span><span
                style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{ form.waitReportNum }}]</span>
              <span style="font-size: 18px;font-weight: bold;margin-left: 10px;">报工数量：</span><span
                style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{ form.reportingQuantity }}]</span>
              <span
                style="font-size: 18px;font-weight: bold;margin-left: 10px;display: inline-block;">不合格数量：</span><span
                style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{ form.unqualifiedQuantity }}]</span>
            </div>
            <div style="padding: 0 20px;">

              <!-- <el-col :sm="24" :xs="24">
              <el-form-item label="加工数量">
                <el-input v-model="form.productionQuantity" placeholder="加工数量" disabled />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :xs="24">
              <el-form-item label="可报工数量">
                <el-input v-model="form.waitReportNum" placeholder="可报工数量" disabled />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :xs="24">
              <el-form-item label="报工数量">
                <el-input v-model="form.reportingQuantity" placeholder="报工数量" disabled />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :xs="24">
              <el-form-item label="不合格数量">
                <el-input v-model="form.unqualifiedQuantity" placeholder="不合格数量" disabled />
              </el-form-item>
            </el-col> -->
              <el-col :sm="24" :xs="24" v-for="(item, index) in vibrationLevelList" :key="index">
                <el-form-item :label="item.name + '(合格数量)'" :prop="item.name" class="iptLabel">
                  <el-input v-model="form.item[item.name]" placeholder="合格数量" @input="forceUpdata"
                    @blur="handleBlur(item, form.item[item.name])" class="ipt" />
                </el-form-item>
              </el-col>

              <el-col :sm="24" :xs="24">
                <el-form-item label="责废数量" class="iptLabel">
                  <el-input v-model="form.responsibilityWasteQuantity" placeholder="责废数量" @blur="handleBlur2"
                    class="ipt" />
                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24">
                <el-form-item label="料废数量" class="iptLabel">
                  <el-input v-model="form.materialWasteQuantity" placeholder="料废数量" @blur="handleBlur3" class="ipt" />
                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24">
                <el-form-item label="返工数量" class="iptLabel">
                  <el-input v-model="form.reworkQuantity" placeholder="返工数量" class="ipt" />
                </el-form-item>
              </el-col>
              <!-- <el-col :sm="24" :xs="24">
              <el-form-item label="报工时间" prop="reportingTime" class="iptLabel">
                <el-date-picker v-model="form.reportingTime" :default-value="new Date()" type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择报工时间" class="ipt">
                </el-date-picker>
              </el-form-item>
            </el-col> -->
              <el-col :sm="24" :xs="24" class="iptLabel">
                <el-form-item label="生产人" prop="producerName" v-if="form.taskMethod != 'not_appoint'">
                  <el-select v-model="form.producerName" placeholder="生产人" style="width: 100%;" class="ipt">
                    <el-option v-for="(item, index) in personList" :key="index" :label="item.label"
                      :value="item.id"></el-option>
                  </el-select>

                  <!-- producerId -->
                </el-form-item>
                <el-form-item label="生产人" prop="producerId" v-if="form.taskMethod == 'not_appoint'" class="iptLabel">
                  <user-select v-model="form.producerId" placeholder="生产人" clearable style="width: 100%;" class="ipt"
                    @change="hangleSelectSales">
                  </user-select>

                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24">
                <el-form-item label="设备" class="iptLabel">
                  <el-select v-model="form.equipmentName" placeholder="设备" style="width: 100%;" class="ipt">
                    <el-option v-for="(item, index) in equipmentList" :key="index" :label="item.name"
                      :value="item.value"></el-option>
                  </el-select>
                  <!-- equipmentId -->
                </el-form-item>
              </el-col>
              <!-- <el-col :sm="24" :xs="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2" />
              </el-form-item>
            </el-col> -->
            </div>


          </el-row>
        </el-form>
      </el-col>
    </div>

    <!-- <span class="button-bottom">
        <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitReportFun()">
          提交
        </el-button>
      </span> -->

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
import { getOrderFiledMap } from '@/api/basicData/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  data() {
    return {
      targetHeight: "",
      title: "",
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

        reportingQuantity: 0,
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
        item: {},
      },
      selectArr: [],
      listLoading: false,
      total: 0,
      tableDataList: [],
      id: "",
      processData: [],
      codeConfig: {},
      vibrationLevelList: [],
      totalReportNum: 0,
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag:'',
      colourFlag:'',
    }
  },
  mounted() {

  },
  methods: {
    //生产人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.form.validateField('producerId')
      })
      this.form.producerId = e
    },
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
   async init(workData, type) {
      console.log("workData", workData);
      await this.getOrderFiledMap()
      if (type == 'process') {
        this.title = "工序报工"
      }
      this.customerVisible = true

      this.getDetailWorkDataFun(workData.id)

    },
    handleBlur2() {
      this.form.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.materialWasteQuantity, this.form.responsibilityWasteQuantity]), 6)

    },
    handleBlur3() {
      this.form.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.materialWasteQuantity, this.form.responsibilityWasteQuantity]), 6)

    },
    getOrderFiledMap() {
      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },
    // 获取振动等级数据
    getvibrationLevelFun() {

      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
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
        this.vibrationLevelList = res.data.records
        res.data.records.forEach(item => {
          this.form.item[item.name] = ""
        });
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          console.log('el-col的高度是：', height);
          this.targetHeight = height;
        });
        console.log(666666, this.form);
      })
    },
    setDivHeight() {
      console.log(this.$refs.rightInfo.offsetHeight);
      // 获取源 div 的动态高度并设置目标 div 的高度  
      const sourceDivHeight = this.$refs.rightInfo.offsetHeight;
    },
    // 获取工单详情
    getDetailWorkDataFun(id) {
      detailWorkData(id).then(res => {
        console.log("工单详情", res);
        res.data.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [res.data.materialWasteQuantity, res.data.responsibilityWasteQuantity]), 6)
        res.data.reportingQuantity = 0
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
          let totalNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.unqualifiedQuantity, this.form.qualifiedQuantity]), 6)
          if (this.totalReportNum > Number(this.form.waitReportNum)) {
            this.submitFlag = false
            this.$message.error("合格数量加上不合格数量不能超过可报工数量")
            return
          }
          if (submitFlag === false) return
          let arr = []
          if (this.vibrationLevelList.length) {
            this.vibrationLevelList.forEach((item, index) => {
              let obj = {}
              if (index == 0) {
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
                obj.qualifiedQuantity = this.form.item[item.name]
                obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.item[item.name], this.form.unqualifiedQuantity, this.form.reworkQuantity]), 6)
                obj.reportingType = "normal"
                obj.unqualifiedQuantity = this.form.unqualifiedQuantity
                obj.vibrationLevel = item.name
                obj.workOrderId = this.form.id
                arr.push(obj)
              } else {
                obj.classAttribute = this.form.classAttribute
                obj.orderType = this.form.orderType
                obj.productDrawingNo = this.form.productDrawingNo
                obj.processName = this.form.processName
                obj.productionQuantity = this.form.productionQuantity
                obj.equipmentId = this.form.equipmentId
                obj.remark = this.form.remark
                obj.reportingTime = this.form.reportingTime
                obj.reworkQuantity = 0
                obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
                obj.materialWasteQuantity = this.form.materialWasteQuantity
                obj.pricingType = this.form.pricingType
                obj.processId = this.form.processId
                obj.producerId = this.form.producerId
                obj.productionOrderId = this.form.productionOrderId
                obj.qualifiedQuantity = this.form.item[item.name]
                obj.reportingQuantity = this.form.item[item.name]
                obj.reportingType = "normal"
                obj.unqualifiedQuantity = 0
                obj.vibrationLevel = item.name
                obj.workOrderId = this.form.id
                arr.push(obj)
              }
            });
          }
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

.button-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

.left-title {
  font-size: 18px;
  font-weight: 600;
}

.info {
  margin-top: 20px;
}

.fixedInfo {
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);
  padding: 20px;
  color: #fff;
  border-radius: 4px;
  padding: 20px;
  color: #fff;
  border-radius: 4px;
  box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.20);
  padding-top: 0;
}

.rightInfo {
  /* border: 1px solid; */
  border-radius: 4px;
  margin-left: 20px;
  box-shadow: beige;
  box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.20);
}

.ipt ::v-deep.el-input__inner {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
}

.iptLabel ::v-deep.el-form-item__label {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
}

.JNPF-common-drawer ::v-deep.el-drawer__body {
  overflow-y: auto;
}

.ts {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.JNPF-dialog.JNPF-dialog_center ::v-deep.el-dialog .el-dialog__body {
  padding: 10px !important;
}
</style>
