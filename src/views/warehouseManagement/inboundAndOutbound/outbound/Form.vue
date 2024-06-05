<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', readOnly ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="!readOnly">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading"
              :element-loading-text="loadingText">
              <div class="subtitle">
                <h5>基本信息</h5>
              </div>
              <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
              <div class="subtitle">
                <h5>产品信息</h5>
              </div>
              <TableForm-product :value="linesList" @input="linesChange" ref="linesForm" :tableItems="linesListItems"
                :openMode="openMode" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem" @openSide="openSide"
                @changeLoading="onChangeLoading" />
            </div>
          </div>
        </div>
      </div>

      <WareSide v-if="wareVisibled" ref="wareSide" @confirm="sideConfirm" :openMode="openMode"
        @markAllocated="markAllocated" />
    </div>
  </transition>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getProductionLotList } from "@/api/basicData/index"
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
import TableFormProduct from "./TableForm-product.vue"
import WareSide from './WareSide.vue'
export default {
  components: { TableFormProduct, WareSide },
  props: {
    originTypeList: {}
  },
  data() {
    return {
      title: "",
      visible: true,
      readOnly: false,
      wareVisibled: false,
      btnLoading: false,
      formLoading: true,
      documentStatus: "",
      dataForm: {},
      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],

      linesList: [], // 表格表单数据
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */], // 表格表单展示列字段
      spaceLines: [],
      validateFlag: true,
      // 发货方式
      deliveryList: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" }
      ],
      loadingText: '',
    }
  },
  created() { },
  computed: {
    openMode() {
      this.$nextTick(() => { this.refeshLinesListItems() });
      return this.title.includes('新建') ? '新建' : this.title.includes('编辑') ? '编辑' : '只读'
    },
  },
  methods: {
    refeshDataFormItems() {
      let checkRender = (effectList) => {
        return effectList.includes(this.dataForm.sourceType)
      }
      let partnerName = this.sourceType === "outbound_purchase" || this.sourceType === "outbound_external" ? '供应商名称' : '客户名称'
      this.dataForm.sourceType = this.dataForm.sourceType ? this.dataForm.sourceType : 'io_other'
      let sm = !(['io_other', 'outbound_scrap'].includes(this.dataForm.sourceType)) ? 8 : 12
      let tempLabel = this.dataForm.sourceType === "outbound_stock_up" ? '备货' : '出库'
      this.dataFormItems = [
        { prop: "sourceType", label: "来源类型", value: "io_other", type: "select", options: this.originTypeList, itemRules: [{ required: true, trigger: "blur" }], itemDisabled: true, sm },
        { prop: "sourceNo", label: "来源单号", value: "", type: "select", itemDisabled: true, render: !(['io_other', 'outbound_scrap'].includes(this.dataForm.sourceType)), sm },
        { prop: "warehouseName", label: '出库仓库', value: "", type: "select", itemDisabled: true, render: this.dataForm.sourceType === 'outbound_transfer', sm },
        { prop: "partnerName", label: partnerName, value: "", type: "select", itemDisabled: true, render: !(['io_other', 'outbound_transfer', 'outbound_scrap'].includes(this.dataForm.sourceType)), sm },
        { prop: "submitDate", label: tempLabel + "时间", value: "", type: "dateTime", itemDisabled: true, render: !(['io_other', 'outbound_scrap'].includes(this.dataForm.sourceType)), sm },
        { prop: "createByName", label: tempLabel + "人", value: "", type: "input", itemDisabled: true, render: !(['io_other', 'outbound_scrap'].includes(this.dataForm.sourceType)), sm },
        { prop: "delivery", label: "发货方式", value: "", type: "select", options: this.deliveryList, itemDisabled: true, render: checkRender(['outbound_external_send', 'outbound_sale_send']), sm },
        { prop: "address", label: "收件地址", value: "", type: "textarea", itemDisabled: true, render: checkRender(['outbound_external_send', 'outbound_sale_send']) },
        { prop: "remark", label: "备注", value: "", type: "textarea" }
      ]
    },
    refeshLinesListItems() {
      this.linesListItems = [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 140 },
        { prop: "drawingNo", label: "产品图号", value: "", type: 'view', minWidth: 300 },
        { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
        {
          prop: "num", label: "数量(主)", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' },
            { validator: this.calcValidate(this.linesList, 'num', 'availableQuantity', '<=', "不能超过对应可用数量", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' }
          ], minWidth: 180,
          input: (val, scope) => {
            if (scope.row.calculationDirection === 'multiplication') { scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
            else { scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
          },
          change: (val, scope) => {
            scope.row.allocated = false
            this.linesList.splice(scope.$index, 1, this.linesList[scope.$index])
            this.spaceLines = this.spaceLines.filter(line =>
              line.productsId !== scope.row.productsId || !this.jnpf.isSame(line.routingLineId, scope.row.routingLineId))
          },
        },
        { prop: "availableQuantity", label: "可用数量(主)", value: "", type: 'view', minWidth: 120, render: this.openMode !== '只读' },
        { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 },
        {
          prop: "deputyNum", label: "数量(副)", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(副)：${errMsg}`) }), trigger: 'blur' },
            { validator: this.calcValidate(this.linesList, 'deputyNum', 'deputyAvailableQuantity', '<=', "不能超过对应可用数量", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }), trigger: 'blur' }
          ], minWidth: 180,
          input: (val, scope) => {
            if (scope.row.calculationDirection === 'division') { scope.row.num = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
            else { scope.row.num = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
          },
          change: (val, scope) => {
            scope.row.allocated = false
            this.linesList.splice(scope.$index, 1, this.linesList[scope.$index])
            this.spaceLines = this.spaceLines.filter(line =>
              line.productsId !== scope.row.productsId || !this.jnpf.isSame(line.routingLineId, scope.row.routingLineId))
          },
        },
        { prop: "deputyAvailableQuantity", label: "可用数量(副)", value: "", type: 'view', minWidth: 120, render: this.openMode !== '只读' },
        { prop: "routingName", label: "工艺路线名称", value: "", type: "view", minWidth: 140 },
        { prop: "processName", label: "工序名称", value: "", type: "view", minWidth: 140 },
        { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, minWidth: 160 },
      ]
      this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    },
    init(id, readOnly, type) {
      this.visible = true
      this.formLoading = true
      this.readOnly = readOnly
      let title = '出库单'
      if (type === '报废') {
        title = '报废出库单'
        this.dataForm = { sourceType: 'outbound_scrap' }
        this.$refs.linesForm.ProductListRequestObj.warehouseType = 'scrap'
        this.$refs.linesForm.$refs['ComSelect-page'].loadingTotal = 0
        this.$refs.linesForm.$refs['ComSelect-page'].getData()
      }
      this.refeshDataFormItems()
      if (id) {
        this.title = readOnly ? `查看${title}` : `编辑${title}`
        // 获取详情
        detailWarehouseData(id).then(res => {
          this.documentStatus = res.data.stockMove.documentStatus
          this.dataForm = { ...res.data.stockMove, warehouseName: res.data.spaceLines[0].warehouseName }

          let tempLinesList = res.data.lines
          tempLinesList.forEach(item => { item.allocated = true })
          this.linesList = res.data.lines

          // 合并同产品、同库位、同批次的库位数据
          this.spaceLines = res.data.spaceLines.reduce((result, obj) => {
            let existingObj = result.find(item =>
              item.productsId === obj.productsId &&
              this.jnpf.isSame(item.routingLineId, obj.routingLineId) &&
              item.shelfSpaceId === obj.shelfSpaceId &&
              item.batchNumber === obj.batchNumber);
            if (existingObj) {
              existingObj.availableQuantity = this.jnpf.math('add', [existingObj.availableQuantity, obj.availableQuantity]);
              existingObj.occupyAvailableQuantity = this.jnpf.math('add', [existingObj.occupyAvailableQuantity, obj.occupyAvailableQuantity]);
              existingObj.documentObjId = existingObj.documentObjId || obj.documentObjId;
            } else {
              result.push(obj);
            }
            return result;
          }, []);
          this.spaceLines.forEach(item => {
            item.boxList = item.boxVoList
            delete item.boxVoList
            item.barCodeIds = item.boxList.map(box => box.id)
            item.barCodeList = item.boxList.map(box => box.barCode)
            item.boxList.forEach(box => {
              box.name = box.barCode
            })
          });

          this.refeshDataFormItems()
          this.formLoading = false
        }).catch(() => { this.formLoading = false })
      } else {
        this.title = `新建${title}`
        this.formLoading = false
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      // 校验表单
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['linesForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 判断出库单是否有效
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少选择一个产品')
      }
      if (this.linesList.length && submitFlag) {
        this.linesList.some((item, index) => {
          let num = 0
          let tempList = this.spaceLines.filter(line => line.productsId === item.productsId && this.jnpf.isSame(line.routingLineId, item.routingLineId))
          tempList.forEach(line => {
            num += line.num ? Number(line.num) : 0
          })
          if (item.num != num) {
            submitFlag = false
            this.$message.error(`产品信息第${index + 1}行：请先完善出库产品货位设置`)
            return true
          }
          return false
        })
      }

      // 同一条码箱是否在同一货位上
      if (submitFlag) {
        let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
        let result = []
        for (let i = 0; i < allBoxList.length; i++) {
          let barCode = allBoxList[i].barCode;
          let shelfSpaceId = allBoxList[i].shelfSpaceId;
          let isDifferent = false; // 标记是否存在不相同的项
          for (let j = 0; j < allBoxList.length; j++) {
            if (allBoxList[j].barCode === barCode && allBoxList[j].shelfSpaceId !== shelfSpaceId) {
              isDifferent = true;
              break;
            }
          }
          if (isDifferent) {
            result.push(barCode);
          }
        }
        result = [...new Set(result)]
        if (result.length) {
          submitFlag = false
          this.$message.error(`${result.join('、')}条码箱，不允许存放在多个库位上`)
        }
      }

      // 条码箱物品是否全部配置入库完成
      // if (submitFlag) {
      //   let allBarCode = [...new Set(this.spaceLines.map(line => [...line.boxList]).flat().map(line => line.barCode))]
      //   let res = allBarCode.length ? await detailByBarCodes({ barCodes: allBarCode }).catch(err => false) : { data: [] }
      //   if (!res) return this.btnLoading = false

      //   let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
      //   res.data.some(item => {
      //     return item.barcodeLineVOs.some(o => { // 依次对比barcodeLineVOs中是否每个产品都已经配置货位
      //       let hasBox = allBoxList.find(o1 => o1.productsId === o.productsId && o1.routingLineId == o.routingLineId && o1.barCode === item.barCode)
      //       if (!hasBox) {
      //         this.$message.error(`条码箱产品未全部设置货位 —— 条码箱：${o.barCode} ${item.standardBoxName} - 产品名称：${o.productsName} - 数量：${o.realityTotalNum}`)
      //         submitFlag = false
      //         return true
      //       }
      //       return false
      //     })
      //   })
      // }

      // 自动聚焦未使用则提交
      if (submitFlag) {
        this.dataForm.documentStatus = submitModel
        // this.dataForm.originNo = "io_other"
        this.dataForm.documentType = "outbound"
        this.linesList.forEach(item => item.id = "")
        const formMethod = this.dataForm.id ? updateWarehouseData : addWarehouseData

        let dataObj = {
          stockMove: this.dataForm,
          lines: this.linesList,
          spaceLines: this.spaceLines
        }

        // 提交确认
        if (submitModel === 'submit') {
          let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
          if (!flag) {
            console.log(dataObj)
            return this.btnLoading = false
          }
        }

        if (location.hostname === 'localhost' || location.href.indexOf('mode=dev') !== -1) { // 调试
          let flag = confirm('确定提交吗？')
          if (!flag) {
            console.log(dataObj)
            return this.btnLoading = false
          }
        }

        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
          this.$emit('close', true)
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }

    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data, type) {
      let paramType = Array.isArray(data) ? 'Array' : 'Object'
      if (paramType === 'Object') {
        this.linesList.splice(data.$index, 1)
        this.spaceLines = this.spaceLines.filter(item => item.productsId === data.row.productsId ? item.routingLineId !== data.row.routingLineId : true)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        // 新数据替代旧数据
        if (type === 'cover') {
          data = data[0]
          tempList = data.lines.map(line => ({
            ...line,
            allocated: true, // 是否不使用自动分配
          }))
          console.log(JSON.parse(JSON.stringify(this.spaceLines)));
          this.spaceLines = data.spaceLines.map(spaceLine => {
            spaceLine.boxList = spaceLine.boxVoList.map(box => ({
              ...box,
              name: box.barCode
            }))
            spaceLine.boxPackingNum = spaceLine.boxList.reduce((result, obj) => {
              return result = this.jnpf.math('add', [result, obj.boxPackingNum])
            }, 0)
            delete spaceLine.boxVoList
            return spaceLine
          })
        }
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.remark = ""
          item.productCode = item.code
          item.productsId = item.id
          const hasFlag = this.linesList.find(i => item.productId === i.productsId)
          if (hasFlag) { hasItemList.push(item.productName) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() });
      }
    },
    goBack() {
      this.$emit('close')
    },
    linesChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    // 打开抽屉
    openSide(scope) {
      this.wareVisibled = true
      this.$nextTick(() => {
        let rowDetailList = JSON.parse(JSON.stringify(this.spaceLines.filter(line => line.productsId === scope.row.productsId &&
          this.jnpf.isSame(line.routingLineId, scope.row.routingLineId))))
        this.$refs['wareSide'].init(scope, rowDetailList, this.readOnly)
      })
    },
    // 抽屉提交
    sideConfirm(data, scope) {
      let tempList = this.spaceLines.filter(line => line.productsId === scope.row.productsId ? line.routingLineId != scope.row.routingLineId : true)
      tempList.push(...data)
      this.spaceLines = tempList
      this.$refs['wareSide'].drawerVisible = false
      this.$refs['wareSide'].btnLoading = false
      this.$message.success("配置成功")
    },
    // 标记已分配库存的行
    markAllocated(scope) {
      this.linesList[scope.$index].allocated = true
      this.linesList.splice(scope.$index, 1, this.linesList[scope.$index])
    },
    // list 中 a 不能 operator b 的校验规则
    calcValidate(list, a, b, operator, msg, callbackMethod) {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        msg = msg || `${a} 不能 ${operator} ${b}`
        if (!value || value == 0) { callback() }
        else {
          let flag = false
          list = this.linesList
          let num_1 = Number(list[index][a])
          let num_2 = Number(list[index][b])
          switch (operator) {
            case '<=':
              if (!(num_1 <= num_2)) { flag = true }
              break;
            default:
              break;
          }
          if (flag) {
            if (callbackMethod) { callbackMethod(msg, rowIndex) }
            callback(new Error(msg));
          } else { callback() }
        }
      };
    },
    associaValidate(associaProp) {
      return (rule, value, callback) => {
        if (this.validateFlag) {
          let index = Number(rule.field.match(/\d+/)[0])
          let TableForm = this.$refs['linesForm'].$children[0]
          TableForm.validateField(`data.${index}.${[associaProp]}`)
          this.validateFlag = false
        } else this.validateFlag = true
        callback()
      };
    },
    onChangeLoading(val) {
      this.loadingText = val ? '正在导入数据' : ''
      this.formLoading = val
    }
  },
}
</script>

<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 30px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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
</style>