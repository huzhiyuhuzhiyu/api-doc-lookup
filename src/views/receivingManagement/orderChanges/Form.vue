<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header" v-if="!approvalFlag">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType === 'add' ? '新建订单变更' : btnType === 'edit' ? '编辑订单变更' : btnType === 'look' ? '查看订单变更' : ''" />
        <div class="options">
          <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="mains">

        <el-tabs v-model="activeName" v-if="!approvalFlag">
          <el-tab-pane label="订单信息" name="orderInfo" ref="orderInfos">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="采购订单" prop="purchaseOrderNo">
                        <ComSelect-page :before-submit="purchaseBeforeSubmit"  ref="purchaseProduct" v-model="dataForm.purchaseOrderNo" @change="addLinesItem" :tableItems="purchaseTableItems"
                                         dialogTitle="选择采购订单" :listMethod="purchaseOrderList" :listRequestObj="purchaseListRequestObjs"
                                         :searchList="purchaseTableSearchList"
                                         :renderTree="false" :isdisabled="btnType === 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                        <!-- 供应商选择弹窗  -->
                        <ComSelect-page clearable :isdisabled="true" :clearable="false" :treeNodeClick="treeNodeClick"
                          v-model="dataForm.cooperativePartnerName" ref="ComSelect-page"
                          @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'供应商名称'"
                          title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                          :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                          :paramsObj="{ oldData }" :searchList="PartnerTableSearchList"/>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="新供应商名称" prop="newCooperativePartnerName" ref="newCooperativePartnerName">
                        <!-- 供应商选择弹窗  -->
                        <ComSelect-page clearable :isdisabled="btnType === 'look'" :clearable="!btnType === 'look'" :treeNodeClick="treeNodeClick"
                          v-model="dataForm.newCooperativePartnerName" ref="ComSelect-page"
                          @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'"
                          title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                          :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                          :paramsObj="{ oldData }" :searchList="PartnerTableSearchList"/>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="申请理由" prop="applyReason">
                        <el-input v-model="dataForm.applyReason" placeholder="请输入申请理由" :disabled="btnType === 'look'" maxlength="200" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" disabled maxlength="200"  />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="新备注" prop="newRemark">
                        <el-input v-model="dataForm.newRemark" placeholder="请输入新备注" :disabled="btnType === 'look'" maxlength="200" type="textarea" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="cpInfo">
                <div v-if="btnType !== 'look'&&orderDetailData.length>1">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-delete" @click="batchDelete()">批量删除</el-button>

                </div>
                <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" v-if="orderDetailData.length > 1" :hasC="btnType !== 'look'&&orderDetailData.length >1" :openMode="btnType === 'look' ? '只读' : btnType === 'add' ? '新建' : '编辑'" @select="handeleProductInfoData" @deleteth="deleteData" />
                <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" :openMode="btnType === 'look' ? '只读' : btnType === 'add' ? '新建' : '编辑'" v-else />
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
          </el-tab-pane>
          <el-tab-pane v-if="btnType === 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
            <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
          </el-tab-pane>
        </el-tabs>
        <el-collapse v-model="activeNames" v-else>
          <el-collapse-item title="基本信息" name="basicInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="采购订单" prop="purchaseOrderNo">
                    <ComSelect-page :before-submit="purchaseBeforeSubmit"  ref="purchaseProduct" v-model="dataForm.purchaseOrderNo" @change="addLinesItem" :tableItems="purchaseTableItems"
                                     dialogTitle="选择采购订单" :listMethod="purchaseOrderList" :listRequestObj="purchaseListRequestObjs"
                                     :searchList="purchaseTableSearchList" :multiple="false"
                                     :renderTree="false" :isdisabled="btnType === 'look'" />
                  </el-form-item>

                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="申请理由" prop="applyReason">
                    <el-input v-model="dataForm.applyReason" placeholder="请输入申请理由" :disabled="btnType === 'look'" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType === 'look'" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                  <el-form-item label="新备注" prop="newRemark">
                    <el-input v-model="dataForm.newRemark" placeholder="请输入新备注" :disabled="btnType === 'look'" maxlength="200" type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="cpInfo">
            <div v-if="btnType !== 'look'&&orderDetailData.length>1">
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-delete" @click="batchDelete()">批量删除</el-button>
            </div>
            <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" v-if="orderDetailData.length > 1" :hasC="btnType !== 'look'&&orderDetailData.length >1" :openMode="btnType === 'look' ? '只读' : btnType === 'add' ? '新建' : '编辑'" @select="handeleProductInfoData" @deleteth="deleteData" />
            <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" :openMode="btnType === 'look' ? '只读' : btnType === 'add' ? '新建' : '编辑'" v-else />
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </transition>
</template>

<script>
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import {addPurchaseChange, editPurchaseChange, getPurchaseChangeDetail} from '@/api/salesManagement/orderChanges';
import { mapGetters, mapState } from 'vuex'
import {purchaseOrderList} from '@/api/orderFollow';
import {partnerProductPrice, purPurchaseOrderdetail} from '@/api/purchasingAndOutsourcingOrders';
import {getcategoryTree, getCooperativeData} from "@/api/basicData";
export default {
  mixins: [busFlow, flowMixin],
  components: { Process, recordList },
  props:{
    classAttribute:{
      type:String,
      default:'other'
    }
  },
  data() {
    return {
      getCooperativeData,
      getcategoryTree,
      oldData:[],
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码', fixed: 'left' },
        { prop: 'name', label: '供应商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      purchaseTableItems:[
        { prop: 'orderNo', label: '采购订单号' },
        { prop: 'cooperativePartnerName', label: '供应商名称' },
        { prop: 'deliveryDate', label: '交货日期' },
        { prop: 'remark', label: '备注' },
        { prop: 'createByName', label: '创建人' },
        { prop: 'createTime', label: '创建时间' },
      ],
      purchaseListRequestObjs:{
        approvalStatus: '', //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '', //供应商编码
        cooperativePartnerName: '', // 	供应商名称
        createByName: '',
        delivery: '', //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: '', //交货结束日期
        deliveryStartDate: '',
        deliveryDate: '',
        endTime: '',
        orderNo: '', //订单号
        classAttribute: this.classAttribute,
        orderType: 'procure', //	订单类型 采购 procure、外协 external
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        receivingStatus: '',
      },
      purchaseTableSearchList:[
        { prop: 'orderNo', label: '订单号', type: 'input' },
        { prop: 'cooperativePartnerName', label: '供应商名称', type: 'input' },
        { prop: 'drawingNo', label: '型号', type: 'input'},
      ],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      activeNames: ["basicInfo", "cpInfo"],
      selectRows: [],
      sleeveItems: [

        { prop: "productDrawingNo", label: '型号', value: "", type: 'view', width: "140",},
        { prop: "productCode", label: "产品编码", value: "", type: 'view', width: "140", },
        { prop: "productName", label: "产品名称", value: "", type: 'view', width: "120", },
        { prop: "mainUnit", label: "单位", value: "", type: 'view', width: "180", },
        { prop: "num", label: "原数量", value: "", type: 'view', width: "100", },
        { prop: "price", label: "原单价", value: "", type: 'view', width: "120" },
        { prop: "excludingTaxAmount", label: "原金额", value: "", type: 'view', width: "120" },
        { prop: "deliveryDate", label: "原交货日期", value: "", type: 'view', width: "180" },
        { prop: "newNum", label: "新数量", value: "", type: 'input', width: "180", maxlength: 20, itemRules: [{ required: true, trigger: "blur" },{ validator: this.formValidate({ type: 'noEmtry', params: ["新数量不能为空", (errMsg,index) => { this.$message.error(`第${index}新数量：`  + errMsg) }] }), trigger: 'blur' }, { validator: this.formValidate({ type: 'decimal', params: [10, 4, false, errMsg => { this.$message.error(`新数量(主)：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "newPrice", label: "新单价", value: "", width: "180", change: this.changePrice, type: 'input', itemRules: [{ required: true, trigger: "blur" },{ validator: this.formValidate({ type: 'noEmtry', params: ["新单价不能为空", (errMsg,index) => { this.$message.error(`第${index}新单价：` + errMsg) }] }), trigger: 'blur' }, { validator: this.formValidate({ type: 'decimal', params: [20, 4, false, errMsg => { this.$message.error(`新单价：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "newTotalAmount", label: "新金额", value: "", type: 'view', width: "180" },
        { prop: "newDeliveryDate", label: "新交货日期", value: "", type: 'date', width: "180", itemRules: [{ required: true, trigger: "change" },] },
        { prop: "taxRate", label: "原税率", value: "",disabled: true, type: 'select', width: "120",options:[] },
        { prop: "newTaxRate", label: "新税率", value: "", type: 'select', width: "120",options:[],itemRules: [{ validator: this.formValidate({ type: 'noEmtry', params: ["新税率不能为空", (errMsg,index) => { this.$message.error(`第${index}新税率：` + errMsg) }] }), trigger: 'change' },{ required: true, trigger: "change" },],clearable:false },
        { prop: "remark", label: "备注", value: "", type: 'view', maxlength: 200, width: "200" },
        { prop: "newRemark", label: "新备注", value: "", type: 'input', maxlength: 200, width: "200" },
      ],
      listLoading: false,
      total: 0,
      orderDetailData: [],
      orderData: [],
      dataForm: {
        cooperativePartnerId: '', //  供应商id
        cooperativePartnerName: '', //  供应商名称
        cooperativePartnerCode: '',
        newCooperativePartnerId: '', //  新供应商id
        newCooperativePartnerName: '', //  新供应商名称
        newCooperativePartnerCode: '',
        orderNo: "",
        applyReason: "",
        remark: "",
        newRemark: "",
        documentStatus: "",
        ordersId: "",
        purchaseOrderNo: "",
        approvalFlag: false,
        classAttribute:'',
      },
      btnType: undefined,
      activeName: "orderInfo",
      nodeId: -1,
      btnLoading: false,
      formLoading: false,
      parentId: '',
      dataRule: {
        purchaseOrderNo: [
          { required: true, message: '销售订单不能为空', trigger: 'change' }
        ],
        applyReason: [{ required: true, message: "请输入申请理由", trigger: 'blur' }],
      },
      customStyleData: 0,
    }
  },
  watch: {
    orderDetailData(val) {
      val.forEach(item => {
        if (this.btnType != 'look') {
          if (item.calculationDirection == "division") {
            if (item.newNum) {
              item.newAssistantNum = this.jnpf.math('divide', [item.newNum, item.ratio], 4)
            }
          } else {
            if (item.newNum) {
              item.newAssistantNum = this.jnpf.math('multiply', [item.newNum, item.ratio], 4)
            } else {
              item.newAssistantNum = ""
            }

          }
          if (item.newNum && item.newPrice) {
            item.newTotalAmount = this.jnpf.math('multiply', [item.newNum, item.newPrice], 2)
          } else {
            item.newTotalAmount = ""
          }
          if ((item.newPrice && item.newTaxRate) || (item.newPrice && item.newTaxRate === 0)) {
            item.newExcludingTaxPrice = this.jnpf.numberFormat(item.newPrice / (1 + (item.newTaxRate * 1) / 100))
          } else {
            item.newExcludingTaxPrice = ''
          }
          if (item.newNum && item.newExcludingTaxPrice && item.newTaxRate) {
            item.newExcludingTaxAmount = this.jnpf.math('multiply', [item.newNum, this.jnpf.numberFormat((item.newExcludingTaxPrice / (1 + (Number(item.newTaxRate)) / 100)), 4)], 2)
          } else {
            item.newExcludingTaxAmount = ""
          }
          if (item.newPrice && item.newNum && item.newExcludingTaxAmount) {
            item.newTaxAmount = this.jnpf.numberFormat(item.newPrice * item.newNum - item.newExcludingTaxAmount)
          } else {
            item.newTaxAmount = ''
          }
          this.$forceUpdate()
        }

      })
    }
  },
  mounted() {
    this.switchStyleheight()
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.sleeveForm) return
      this.$nextTick(() => { this.$refs.sleeveForm.doLayout() })
    }
    window.addEventListener('resize', this.clientResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.clientResize)
  },
  methods: {
    purchaseOrderList,
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    supplierdata(id, data) {
      if (data.length === 0) {
        this.dataForm.newCooperativePartnerName = ''
        this.dataForm.newCooperativePartnerCode = ''
        this.dataForm.newCooperativePartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.newCooperativePartnerName = data[0].all.name
        this.dataForm.newCooperativePartnerCode = data[0].all.code
        this.dataForm.newCooperativePartnerId = data[0].all.id
        // let productIdList = []
        // this.orderDetailData.forEach((item) => {
        //   productIdList.push(item.productsId)
        // })
        // let _data = {
        //   cooperativePartnerId: this.dataForm.cooperativePartnerId,
        //   productIdList
        // }
        // partnerProductPrice(_data).then((res) => {
        //   if (res.data.length === 0) {
        //     this.orderDetailData.forEach((item) => {
        //       item.price = item.purchasePrice
        //       item.fixedPrice = item.purchasePrice
        //       this.$set(item, 'taxRate', Number(item.purchaseTaxRate))
        //     })
        //   } else {
        //     res.data.forEach((item) => {
        //       const targetList = this.orderDetailData.filter((line) => line.productsId === item.productId)
        //       targetList.forEach((line) => {
        //         this.$set(line, 'fixedPrice', item.price)
        //         this.$set(line, 'price', item.price)
        //         this.$set(line, 'excludingTaxPrice', item.excludingTaxPrice)
        //         this.$set(line, 'taxRate', Number(item.taxRate))
        //       })
        //     })
        //     const targetList = this.orderDetailData.filter((line) => line.price === '')
        //     targetList.forEach((line) => {
        //       this.$set(line, 'price', '')
        //     })
        //   }
        // })
      }
    },
    switchStyleheight() {
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      const mainRegion1 = this.$refs.mains // 表单页面区域
      const mainHeight = mainRegion.clientHeight;
      const mainHeight1 = mainRegion1.clientHeight;
      console.log("mainRegion1", mainRegion1);
      console.log("mainHeight1", mainHeight1);
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach(item => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 350
      this.customStyleData = maxHeight
      console.log("customStyleData", this.customStyleData);
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100);
      };
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      console.log("val", val);
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
        return
      }
      if (this.selectRows.length == this.orderDetailData.length) return this.$message.error("请至少保留一条产品数据")
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.orderDetailData.indexOf(row);
        if (index > -1) {
          this.orderDetailData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    deleteData(val) {
      this.orderDetailData.splice(val.$index, 1)
    },
    // 监听价格改变
    changePrice(val, scope) {
      let index = scope.$index;
      if (this.orderDetailData[index].newTaxRate) {
        this.orderDetailData[index].newExcludingTaxPrice = this.jnpf.numberFormat((this.orderDetailData[index].newPrice / (1 + (Number(this.orderDetailData[index].newTaxRate)) / 100)), 4)
      } else {
        this.orderDetailData[index].newExcludingTaxPrice = this.orderDetailData[index].newPrice
      }
    },

    async purchaseBeforeSubmit(data){
      if (!this.dataForm.purchaseOrderNo) return true
      return await this.$confirm('此操作将更换产品数据, 是否继续?', '提示内容', { type: 'warning' }).catch(err => false)
    },
    // 弹框中选择订单
    addLinesItem(id,data) {
      console.log(data,'采购订单');
      if (!data) return;
      let row = data[0].all
      this.dataForm.cooperativePartnerName = row.cooperativePartnerName
      this.dataForm.cooperativePartnerCode = row.cooperativePartnerCode
      this.dataForm.cooperativePartnerId = row.cooperativePartnerId
      this.dataForm.purchaseOrderNo = row.orderNo
      this.dataForm.sourceOrderNo = row.sourceOrderNo
      this.dataForm.remark = row.remark
      this.dataForm.ordersId = row.id
      this.dataForm.classAttribute = row.classAttribute
      this.orderDetailData = []
      purPurchaseOrderdetail(row.id).then(res => {
        this.orderDetailData =  res.data.purchaseOrderLineVOList.map(item=>{
          return {
            ...item,
            num:item.purchaseQuantity,
            productDrawingNo: item.drawingNo ? item.drawingNo : "",
            excludingTaxAmount: item.totalAmount ? item.totalAmount : "",
            newTotalAmount: item.totalAmount ? item.totalAmount : "",
            newDeliveryDate: item.deliveryDate ? item.deliveryDate : "",
            ordersLineId: item.id ? item.id : "",
            orderId: row.id ? row.id : "",
            newNum: item.purchaseQuantity,
            newPrice: item.price || '0',
            newTaxRate: item.taxRate || '13',
            id:'',
          }
        })
      })
    },

    async init(id, btnType, approvalFlag) {
      const tax = await this.$store.dispatch('base/getDictionaryData', { sort: 'taxrate' })
      this.sleeveItems.find(item=>item.prop === 'newTaxRate').options = tax.map(item=>{
        return {
          ...item,
          label:item.fullName,
          value:item.enCode
        }
      })
      this.sleeveItems.find(item=>item.prop === 'taxRate').options = tax.map(item=>{
        return {
          ...item,
          label:item.fullName,
          value:item.enCode
        }
      })
      this.approvalFlag = approvalFlag
      this.dataForm.id = id || ''
      this.btnType = btnType
      console.log(this.btnType,'asdas');
      if (this.btnType === 'add' || this.btnType === 'edit') {
        this.getBusInfo('b079')
      }
      if (this.dataForm.id && this.btnType !== 'add') {
        getPurchaseChangeDetail(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.change
            this.orderDetailData = res.data.changeLineList
            if (this.btnType === 'look') {
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          })
        })
      }
      if (this.dataForm.id && this.btnType === 'add') {
        getPurchaseChangeDetail(this.dataForm.id).then(res => {
          this.dataForm = res.data.change
          this.orderDetailData = res.data.changeLineList
          this.orderDetailData.forEach(item => { item.id = '' })
          this.dataForm.approvalStatus = ''
          this.dataForm.submitDate = ''
          this.dataForm.approvalCompletionDate = ''
          this.dataForm.id = ''
          this.dataForm.documentStatus = ''
        })
      }
    },
    goBack() {
      this.$emit('close')
    },
    async handleConfirm(value) {
      this.btnLoading = true
      let focusFlag = true // 自动聚焦是否可用
      // 校验表单
      let form_1 = this.$refs['dataForm']
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && focusFlag) {
        // 校验失败，聚焦第一失败项，继续校验后续项
        if (focusFlag) {
          // 聚焦第一个失败的表单元素
          let formItems = form_1.$children[0].$children
          for (let j = 0; j < formItems.length; j++) {
            let formItem = formItems[j].$children[0]
            if (formItem.validateState === 'error') {
              focusFlag = false
              // this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              break
            }
          }
        }
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['sleeveForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            // this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      if (focusFlag) {
        this.btnLoading = true
        let formMethod = null;
        if (this.btnType === 'edit') {
          formMethod = editPurchaseChange
        } else if (this.btnType === 'add') {
          formMethod = addPurchaseChange
        }
        this.dataForm.documentStatus = value
        let obj = {
          changeLineList: this.orderDetailData,
          change: this.dataForm,
          flowData: this.flowData
        }
        formMethod(obj).then(res => {
          let msg = "";
          if (value == 'draft') {
            msg = "保存成功"
          } else {
            msg = "提交成功"

          }

          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
.required {
  color: red;
  margin-right: 4px;
}
::v-deep .data-form {
  margin-bottom: 18px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
