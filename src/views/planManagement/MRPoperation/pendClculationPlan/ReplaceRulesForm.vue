<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button> -->
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            {{ $t('common.submitButton') }}
          </el-button>
          <el-button v-if="btnType !== 'look'" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main">
              <el-tabs v-model="activeName" v-if="!approvalFlag">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-form :model="dataForm" :ref="`dataForm`" :rules="dataFormRules">
                    <el-row :gutter="20">
                      <el-col :span="6">
                        <el-form-item label="计划单号">
                          <el-input :value="dataForm.planNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="替换申请单号">
                          <el-input :value="dataForm.orderNo" :disabled="btnType === 'look' || codeConfig.codeWay === 'auto' && !codeConfig.modifyFlag" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="型号">
                          <el-input :value="dataForm.productDrawingNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入备注"
                            :disabled="btnType === 'look'" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div style="height: calc(100% - 73px); position: relative;">
                    <el-col :span="24">
                      <TableForm-product :hasActionbar="false" :hasToolbar="false" :value="dataForm.left" :ref="`linesForm_left`"
                        :tableItems="linesFormItems_left" :btnType="btnType"
                        @addth="(data) => { addth(data, null, '') }"
                        @deleteth="(scope) => { deleteth(scope, null, '') }"
                        @input="(dataOrIndex, prop, value) => { linesChange(dataOrIndex, prop, value, null, '') }"
                        />
                    </el-col>

                  </div>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                   <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                </el-tab-pane>
                <el-tab-pane v-if="btnType === 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
                   <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
              </el-tabs>
              <div v-else>
                   <el-form :model="dataForm" :ref="`dataForm`" :rules="dataFormRules">
                                <el-row :gutter="20">
                                    <el-col :span="6">
                                        <el-form-item label="计划单号">
                                            <el-input :value="dataForm.planNo" disabled />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="型号">
                                            <el-input :value="dataForm.productDrawingNo" disabled />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="备注" prop="remark">
                                            <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入备注"
                                                      :disabled="btnType === 'look'" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                   <div style="height: calc(100% - 73px); position: relative;">
                                <el-col :span="24">
                                    <TableForm-product :hasActionbar="false" :hasToolbar="false" :value="dataForm.left" :ref="`linesForm_left`"
                                                       :tableItems="linesFormItems_left" :btnType="btnType"
                                                       @addth="(data) => { addth(data, null, '') }"
                                                       @deleteth="(scope) => { deleteth(scope, null, '') }"
                                                       @input="(dataOrIndex, prop, value) => { linesChange(dataOrIndex, prop, value, null, '') }"
                                                       />
                                </el-col>
                            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue' // 附带产品多选的表格表单组件
import {  detailBomData } from "@/api/basicData/index"
import { mapGetters } from "vuex"
import { addMrpReplaceApply, detailMrpReplaceApply } from '@/api/calculationList/calculationList'
import recordList from '@/views/workFlow/components/RecordList.vue'
import Process from '@/components/Process/Preview.vue'
import busFlow from '@/mixins/generator/busFlow';
import flowMixin from '@/mixins/generator/flowMixin'
export default {
  components: { Process, recordList, TableFormProduct },
  mixins: [busFlow, flowMixin],
  name:'ReplaceRulesForm',
  data() {
    return {
      title: "",
      activeName: 'jcInfo',
      btnType: '',
      btnLoading: false,
      formLoading: true,
      dataForm: {
        left: [],
        right: [],
      },
      linesFormItems_left:[],
      dataFormRules: {
        businessCode: [
          { validator: this.formValidate({ type: 'noEmtry', params: [" ", (errMsg) => { this.$message.error('请先选择主产品类型') }] }), trigger: 'change' },
          { required: true, message: '', trigger: 'change' },
        ],
        remark: [
          { validator: this.formValidate({ type: 'noEmtry', params: [" ", (errMsg) => { this.$message.error('请输入备注') }] }), trigger: 'blur' },
          { required: true, message: '', trigger: 'blur' },
        ],
      },
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: 0,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      codeConfig: {},
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() { },
  methods: {
    setLinesFormItems_left(){
      this.linesFormItems_left = [
        // { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
        // { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 30 },
        { prop: "productDrawingNo", label: "型号", value: "", type: 'view', minWidth: 150 },
        { prop: "qty", label: "数量", type: 'view', minWidth: 80 },
        { prop: "reduceType", label: "扣减料方式", type: 'select', disabled:true,
          options: [
            { label: '生成领料单', value: 'picking' },
            { label: '自动扣减料', value: 'auto' },
            { label: '都不是', value: 'none' }
          ], minWidth: 160 },
        { prop: "replaceProductDrawingNo", label: "替换子件规格", value: "", type: 'select', minWidth: 150,options:(scope)=>{
            console.log(scope,'scope')
            return  scope.row.replaceLines.map(item=>{
              return {
                ...item,
                label: item.drawingNo,
                value: item.drawingNo
              }
            })

          },change:(val,scope)=>{
            let currentRow = scope.row.replaceLines.find(item=>item.drawingNo === val)
            this.dataForm.left[scope.$index].replaceQty = currentRow.qty
            this.dataForm.left[scope.$index].replaceReduceType = currentRow.reduceType
          }
        },
        { prop: "replaceQty", label: "替换子件数量", value: "", type: 'view', minWidth: 80},
        { prop: "replaceReduceType", label: "替换扣减料方式", type: 'select', disabled:true,
          options: [
            { label: '生成领料单', value: 'picking' },
            { label: '自动扣减料', value: 'auto' },
            { label: '都不是', value: 'none' }
          ], minWidth: 160 },
      ]
    },
    async fetchData(code, flag) {
        try {
              const data = await this.jnpf.getBillRuleConfigFun(code);
              this.codeConfig = data
              if (flag) {
                  this.dataForm.orderNo = data.number
              }
        } catch (error) {
        }
    },
    init(idOrPlanData, btnType,approvalFlag) {
      this.btnType = btnType === 'anew' ? 'add' : btnType
      this.formLoading = true
      this.approvalFlag = approvalFlag
      console.log({ idOrPlanData, btnType });
      if (typeof idOrPlanData === 'object') {
        this.title = '发起替换申请'
        this.dataForm = {
          approvalFlag: 0,
          orderNo:'',
          routingId: idOrPlanData.routingId,
          workOrderNo: idOrPlanData.workOrderNo,
          planId: idOrPlanData.id,
          planNo: idOrPlanData.planNo,
          projectId: idOrPlanData.projectId,
          productsId: idOrPlanData.productsId,
          productDrawingNo: idOrPlanData.productDrawingNo,
          left: [],
          right: [],
        }
        this.fetchData("RADH", true)
        // 根据BOMid获取BOM
        detailBomData(idOrPlanData.bomId).then(res => {
          this.dataForm.left = res.data.lines.map(item => {
            return {
              ...item,
              bomId: item.bomId,
              bomLineId: item.id,
              productsId: item.productId,
              productDrawingNo: item.drawNo,
              reduceType: item.reduceType,
              qty: item.qty || '1',
              replaceProductDrawingNo:'',
              replaceQty:'',
              replaceReduceType:'',
            }
          })
          this.setLinesFormItems_left()
          this.formLoading = false
        })
        this.getBusInfo('b067')

      } else {
        this.title = btnType === 'edit' ? '编辑替换申请' : btnType === 'anew' ? '新建替换申请' : '查看替换申请'
        detailMrpReplaceApply(idOrPlanData).then(res => {
          this.dataForm = {
            id:res.data.apply.id,
            approvalFlag: res.data.apply.approvalFlag,
            planId: res.data.apply.planId,
            planNo: res.data.apply.planNo,
            orderNo: res.data.apply.orderNo,
            planLineId: res.data.apply.planLineId,
            remark: res.data.apply.remark,
            productsId: res.data.apply.productsId,
            workOrderNo: res.data.apply.workOrderNo,
            productDrawingNo: res.data.apply.productDrawingNo,
            routingName: btnType === 'anew' ? '' : res.data.apply.routingName,
            routingId: res.data.apply.routingId,
            projectId: res.data.apply.projectId,
            left: res.data.originBomList.map((item,index)=>{
              return {
                ...item,
                replaceProductDrawingNo:res.data.replaceBomList[index].productDrawingNo,
                replaceQty:res.data.replaceBomList[index].qty,
                replaceReduceType:res.data.replaceBomList[index].reduceType,
                replaceLines:res.data.replaceBomList.map(item=>{
                  return {
                    ...item,
                    drawingNo: item.productDrawingNo,
                  }
                })
              }
            }),
            right: res.data.replaceBomList,
          }
          this.formLoading = false
          if (this.btnType === 'edit') {
             this.fetchData("RADH", true)
             this.getBusInfo('b067')
          } else {
              // 流程信息和流转记录
             if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
          }
          this.setLinesFormItems_left()
        })
        if (btnType === 'anew') {
            this.fetchData("RADH", true)
            this.getBusInfo('b067')
        } else if (btnType === 'look') {
            // 流程信息和流转记录
            if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        }
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      // 校验表单
      let form_1 = this.$refs['dataForm']
      let valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.btnLoading = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      if (submitFlag && this.dataForm.left.length) {
        submitFlag = this.dataForm.left.some(item=>item.replaceProductDrawingNo)
        if (!submitFlag) {
          this.btnLoading = false
          return this.$message.error('请至少选择一条替换子件规格')
        }
      }

      // if (submitFlag) {
      //   const flag_1 = this.dataForm.left.length > 1
      //   const flag_2 = this.dataForm.right.length > 1
      //   if (flag_1 && flag_2) {
      //     this.$message.error(`替代规则不能多个替代多个！`)
      //     submitFlag = false
      //   }
      // }

      // if (submitFlag) {
      //   let errIndex = this.dataForm[formKeyList[0]].left.findIndex(lItem => this.dataForm[formKeyList[0]].right.some(rItem => rItem.productsId === lItem.productsId))
      //   if (errIndex !== -1) {
      //     this.$message.error(`原产品第${errIndex + 1}条：原产品不能与目标产品相同！`)
      //     submitFlag = false
      //   }
      // }

      // if (submitFlag && (this.dataForm.left.length > 10 || this.dataForm.right.length > 10)) {
      //   this.$message.error(`原产品和目标产品最多只能10个！`)
      //   submitFlag = false
      // }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['linesForm_left'].$refs.main
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.btnLoading = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 自动聚焦未使用则提交
      if (submitFlag) {
        const replaceBomList = []
        const replaceList = this.dataForm.left.filter(item=>item.replaceProductDrawingNo)
        const replaceLists = this.dataForm.left.filter(item=>!item.replaceProductDrawingNo)
        replaceList.forEach(item=>{
          let lines = item.replaceLines.find(line=>line.drawingNo === item.replaceProductDrawingNo)
          replaceBomList.push({...lines,productsId:lines.productId,bomId:item.bomId})
        })
        const _data = {
          apply: {
            // id: this.dataForm.id,
            approvalFlag: this.dataForm.approvalFlag,
            routingId: this.dataForm.routingId,
            projectId: this.dataForm.projectId,
            planId: this.dataForm.planId,
            productsId: this.dataForm.productsId,
            documentStatus: 'submit',
            remark: this.dataForm.remark,
            orderNo: this.dataForm.orderNo,
          },
          originBomList: this.dataForm.left,
          replaceBomList: [...replaceBomList,...replaceLists],
          flowData: this.flowData,
        }
        addMrpReplaceApply(_data).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.$emit('close', true)
            }
          })
        }).catch(err => {
          this.btnLoading = false
        })
        // const _dataForm = this.dataForm
        // let maxLength = _dataForm.left.length
        // let maxListKey = 'left'
        // if (maxLength < _dataForm.right.length) {
        //   maxListKey = 'right'
        //   maxLength = _dataForm.right.length
        // }
        // const _data = []
        // for (let index = 0; index < maxLength; index++) {
        //   const leftIndex = maxListKey === 'left' ? index : 0
        //   const rightIndex = maxListKey === 'right' ? index : 0
        //   _data.push({
        //     businessCode: _dataForm.businessCode,
        //     productsId: _dataForm.left[leftIndex].productsId,
        //     replaceProductsId: _dataForm.right[rightIndex].productsId,
        //     qty: _dataForm.right[rightIndex].qty,
        //   })
        // }
        // addMrpReplaceApply(_data).then(res => {
        //   this.$message.success('提交成功')
        //   this.$emit('close', true)
        // }).catch(err => {
        //   this.btnLoading = false
        // })
      } else {
        this.btnLoading = false
      }
    },
    goBack() {
      this.$emit('close')
    },
    addth(data, index, type) {
      let tempList = JSON.parse(JSON.stringify(this.dataForm[type]))
      // 新数据替代旧数据
      let hasItemList = []
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        item.productsId = item.productsId || item.id
        item.productCode = item.productCode || item.code
        item.productName = item.productName || item.name
        item.productDrawingNo = item.productDrawingNo || item.drawingNo
        const targetLeftLine = this.dataForm.left.find(item_2 => item_2.productsId === item.productsId)
        item.qty = targetLeftLine ? targetLeftLine.qty : 1
        const hasFlag = this.dataForm[type].find(i => item.productsId === i.productsId)
        if (hasFlag) { hasItemList.push(item.productDrawingNo) }
        else { tempList.push(item) }
        if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
      }
      this.dataForm[type] = tempList.map(item => {
        return {
          productsId: item.productsId,
          productCode: item.productCode,
          productName: item.productName,
          productDrawingNo: item.productDrawingNo,
          qty: item.qty,
          calculationDirection: item.calculationDirection,
          mainUnit: item.mainUnit,
          ratio: item.ratio,
          reduceType: 'picking',
        }
      })
    },
    deleteth(scope, index, type) {
      this.dataForm[type].splice(scope.$index, 1)
    },
    linesChange(dataOrIndex, prop, value, index, type) {
      console.log({ dataOrIndex, prop, value, index, type });
      if (Array.isArray(dataOrIndex)) {
        this.dataForm.left = JSON.parse(JSON.stringify(dataOrIndex))
        // this.$set(this.dataForm, type, JSON.parse(JSON.stringify(dataOrIndex)))
      } else if (prop) {
        this.dataForm.left[dataOrIndex][prop] = value
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 30px;
}

//::v-deep .JNPF-common-layout-main.JNPF-flex-main {
//  overflow: auto;
//}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
::v-deep .el-tabs__item {
    padding: 0 10px !important
}
::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 0px !important
}
.required {
  color: red;
  margin-right: 4px;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}

.replaceRule-item {
  margin-bottom: 20px;

  .el-form-item {
    margin-bottom: 5px;
  }
}

.center-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
