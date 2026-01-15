<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')"
          :content="btnType == 'add' || btnType == 'copy' ? '新建询价' : btnType == 'edit' ? '编辑询价' : '查看询价管理'" />
        <div class="options">
          <el-button size="mini" type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            v-if="btnType !== 'look'">
            保存草稿</el-button>
          <el-button size="mini" type="primary" v-if="btnType !== 'look'" :loading="btnLoading"
            @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button size="mini" @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="main" :element-loading-text="loadingText">
        <el-collapse v-model="activeNames" @change="refreshTableHeight">
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
            <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType" />
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
            <TableForm-product v-loading="productLoading" @input="contentChanges" :value="dataFormTwoList"
              :hasToolbar="false" ref="tableForm" :tableItems="linesListItems" :btnType="btnType" :hasActionbar="false"
              :tableProps="{
                is: 'JNPF-table',
                fixedNO: true,
                hasC: activeType,
                height: linesTableHeight,
                rowKey: 'id',
                defaultExpandAll: true,
                customColumn: true,
              }">
              <template #actions>
                <el-table-column label="操作" width="120" :fixed="'right'" v-if="activeType" key="actionBar">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="copy(scope.row)">
                      复制
                    </el-button>
                    <el-button type="text" @click="deltable(scope)" class="JNPF-table-delBtn">删除</el-button>
                  </template>
                </el-table-column>
              </template>
            </TableForm-product>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-dialog title="请选择待询价单" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="inquiryNoListDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body>
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table :data="inquiryNoData" ref="dataTable" custom-column customKey="JNPFTableKey_861730">
                <el-table-column prop="quotationNo" label="询价单号" />
                <el-table-column prop="cooperativePartnerId" label="客户编号" />
                <el-table-column prop="quotationTime" label="询价日期"></el-table-column>
                <el-table-column prop="createByName" label="制单人" />
                <el-table-column prop="bidder" label="业务员" />
                <el-table-column prop="" label="采购负责人" />
                <el-table-column prop="quotationStatus" label="状态" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.quotationStatus == 'feedback_received'">
                      <el-tag>已反馈</el-tag>
                    </div>
                    <div v-else-if="scope.row.quotationStatus == 'finished'">
                      <el-tag type="success">完成</el-tag>
                    </div>
                    <div v-else-if="scope.row.quotationStatus == 'not_submit'">
                      <el-tag type="danger">未提交</el-tag>
                    </div>
                    <div v-else-if="scope.row.quotationStatus == 'pending_feedback'">
                      <el-tag type="warning">待反馈</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add' || btnType == 'edit'">
                  <template slot-scope="scope">
                    <el-button type="text" @click="selectWaitEnquiry(scope)">选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="inquiryNoTotal" :page.sync="inquiryNoRequestObj.pageNum"
                :limit.sync="inquiryNoRequestObj.pageSize" @pagination="getHistoryPriceFun" />
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import busFlow from '@/mixins/generator/busFlow';
import flowMixin from '@/mixins/generator/flowMixin'
import getProjectList from '@/mixins/generator/getProjectList'
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表
import { getCooperativeData } from '@/api/basicData/index'
import { getQuotationInfo, getQuotationLists } from "@/api/salesManagement/index";
import { addEnquiryManagement, getEnquiryManagementInfo, editEnquiryManagement } from '@/api/enquiryManagement/index'
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { deepClone } from "@/utils";

export default {
  components: {
    TableFormProduct
  },
  mixins: [busFlow, flowMixin, getProjectList,],
  data() {
    return {
      activeNames: ["productInfo", "basicInfo"],
      formDisabled: true,
      dataForm: {},
      formLoading: false,
      customStyleData: {},
      dataFormTwoList: [],
      inquiryNoListDialog: false,
      inquiryNoData: [],
      inquiryNoRequestObj: {},
      inquiryNoTotal: 0,
      allProVisible: false,
      btnType: '',
      flowData: {},
      btnLoading: false,
      submitmethodsTitle: '',
      linesListItems: [
        {
          prop: 'productCode',
          label: '产品型号',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'numStr',
          label: '数量',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'sampleNumStr',
          label: '样品数',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'sampleQuotationFlag',
          label: '是否样品报价',
          type: 'select',
          options: this.global.booleanOptions,
          minWidth: 160,
          // disable: true,
        },
        {
          prop: 'sampleAmounts',
          label: '样品报价',
          type: 'input',
          minWidth: 160,
          itemRules: [
            { required: false, trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', '样品报价必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
          ]
        },
        {
          prop: 'procurementAmounts',
          label: '报价',
          type: 'input',
          minWidth: 160,
          itemRules: [
          { required: false, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '报价必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }]
        },
        {
          prop: 'moldAmounts',
          label: '模具费',
          type: 'input',
          minWidth: 160,
          itemRules: [
            { required: false, trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', '模具费必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
          ]
        },
        {
          prop: 'minNumStr',
          label: '起订量',
          type: 'input',
          minWidth: 160,
          itemRules: [
            { required: false, trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', '起订量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
          ]
        },
        {
          prop: 'deliveryDate',
          label: '交期',
          type: 'input',
          minWidth: 160,
          itemRules: [
            { required: false, trigger: 'blur' },
          ]
        },
        {
          prop: 'remark1',
          label: '采购反馈',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'material',
          label: '材质',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'view',
          minWidth: 160,
        },
      ],
      linesTableHeight: 0,
      productLoading: false,
      basicFormSchema: [
        {
          prop: "inquiryNo",
          click: () => {
            this.showInquiryNoListDialog()
          },
          label: "待询价单",
          value: "",
          type: "input",
          readonly: true,
          itemRules: [{ required: true, trigger: "blur" }],
          placeholder: '请选择待询价单'
        },
        {
          prop: "cooperativePartnerId",
          label: "客户编号",
          value: "",
          type: "input",
          disabled: true,
        },
        {
          prop: "quotationDate",
          label: "报价日期",
          value: "",
          type: "date",
          itemDisabled: true,
        },
        {
          prop: "createOrder",
          label: "制单人",
          value: "",
          type: "input",
          disabled: true,
        },
        {
          prop: "bidder",
          label: "业务员",
          value: "",
          type: "input",
          disabled: true,
        },
        // {
        //   prop: "",
        //   label: "采购负责人",
        //   value: "",
        //   type: "input",
        // },
        {
          prop: "cooperativePartnerName",
          label: "供应商",
          value: "",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          title: '请选择供应商',
          renderTree: false,
          multiple: false,
          listMethod: getCooperativeData,
          tableItems: [
            { prop: 'code', label: '供应商编码', fixed: 'left' },
            { prop: 'name', label: '供应商名称', fixed: 'left' },
            { prop: 'nameEn', label: '英文名称' },
            { prop: 'taxId', label: '税号' },
          ],
          listRequestObj: {
            name: '',
            type: "supplier",
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              {
                asc: false,
                column: ''
              },
              {
                asc: false,
                column: 'create_time'
              }
            ]
          },
          searchList: [
            { prop: 'code', label: '供应商编码', type: 'input' },
            { prop: 'name', label: '供应商名称', type: 'input' }
          ],
          change: (id, data) => {
            if (this.changeNum !== 0 && this.dataForm.cooperativePartnerName && this.dataForm.cooperativePartnerName !== this.oldSupplierData.id) {
              this.$confirm('切换供应商，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.supplierdata(id, data, true);
              }).catch((err) => {
                this.setOldSupplierData();
                console.log(err);
              });
            } else {
              this.supplierdata(id, data, false);
            }
            this.changeNum++
          },
        },
      ],
      changeNum: 0,
      oldSupplierData: {}
    }
  },
  watch: {
  },
  props: {
  },
  beforeDestroy() {
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
    tableFormDisabled: function () {
      return this.btnType === 'look'
    }, // 表单禁用
    activeType() {
      return this.btnType !== 'look'
    },
  },
  mounted() {
  },
  async created() {
  },
  methods: {
    // 获取制单人和业务员信息
    async getUserInfo(quotationId) {
      try {
        getQuotationInfo(quotationId).then(res => {
          const { sale = {} } = res.data
          const { bidder, createByName } = sale
          this.$set(this.dataForm, 'bidder', bidder)
          this.$set(this.dataForm, 'createOrder', createByName)
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 供应商信息变更
    supplierdata(id, data, isChange) {
      if (isChange) return;
      this.oldSupplierData = JSON.parse(JSON.stringify(data));
      this.dataForm.cooperativePartnerId = id;
      this.dataForm.cooperativePartnerName = data.name;
      this.dataFormTwoList = []
      this.productLoading = true
      setTimeout(() => {
        this.productLoading = false
      }, 1000)
    },
    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.dataFormTwoList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.dataFormTwoList[dataOrIndex][prop] = value
      }
    },
    goBack() {
      this.$emit('close', true)
    },
    async switchStyle(type) {
      await this.$nextTick();
      const mainRegion = this.$refs.main // 可用区域
      if (JSON.stringify(this.customStyleData) === "{}" || type === 'onresize') {
        if (type !== 'onresize') this.$message.success('适配模式')
        // 获取可用区域的高度
        const mainHeight = mainRegion.clientHeight;
        // 其他同级组件占用高度
        let bortherHeight = 0
        const bortherItems = mainRegion.querySelectorAll('.orderInfo > *')
        bortherItems.forEach(item => {
          if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
        })
        // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
        let maxHeight = mainHeight - bortherHeight - 112
        // 计算高度最低500
        maxHeight = maxHeight > 500 ? maxHeight : 500
        this.customStyleData = {
          height: 10000,
          maxHeight
        }
        // 附带防抖的监听适配模式屏幕缩放
        window.onresize = () => {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.switchStyle('onresize')
          }, 100);
        };
      } else {
        this.$message.success('全展模式')
        window.onresize = null
        this.customStyleData = {}
        // 重新加载表格
        this.tableVisible = false
        this.$nextTick(() => this.$refs.product.doLayout())
      }
    },
    // 待询价工单查询子产品列表
    getProductsList(row) {
      getQuotationInfo(row.id).then(res => {
        const { lines = [] } = res.data
        this.dataFormTwoList
          = lines.map(item => {
            return {
              ...item,
              productName: item.productName || '',
              productCode: item.productCode || '',
              minNumStr: item.minNumStr || '',
              procurementAmounts: item.procurementAmounts || '',
              moldAmounts: item.moldAmounts || '',
              deliveryDate: item.deliveryDate || '',
              remark1: item.remark1 || '',
              quotationLineId: item.id,
              quotationId: item.salesQuotationId,
            }
          }),
          this.formLoading = false
      }).catch(err => {
        this.formLoading = false
      })
    },
    // 保存提交
    async handleConfirm(type) {
      // 校验主表
      const basicInfoFlag = this.$refs['dataForm'].$refs.main
      const basicInfoValid = await basicInfoFlag.validate().catch(err => false)
      if (!basicInfoValid) {
        this.$message.error('基本信息校验不通过，请检查')
        return false
      }
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_2) {
        this.$message.error('子表信息校验不通过，请检查')
        return false
      }

      const { quotationId, cooperativePartnerId, id } = this.dataForm
      const paramsObj = {
        bimInquiry: {
          quotationId,
          cooperativePartnerId,
          documentStatus: type,
          quotationId: id
        },
        bimInquiryLineList: this.dataFormTwoList,
        flowData: this.flowData
      }
      let formMethod = null;
      if (this.btnType === 'edit') {
        formMethod = editEnquiryManagement
        paramsObj.bimInquiry = {
          ...this.dataForm,
          documentStatus: type
        }
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        formMethod = addEnquiryManagement
      }
      this.btnLoading = true
      formMethod(paramsObj).then(res => {
        let MSG = '提交成功'
        if (type == "draft") {
          MSG = "保存成功"
        }
        if (res.msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 设置基本信息
    setBasicInfo(row) {
      this.dataForm = {
        ...this.dataForm,
        inquiryNo: row.quotationNo,
        ...row,
        quotationId: row.id,
        createOrder: row.createByName
      }
      this.inquiryNoListDialog = false
      this.$refs['dataForm'].$refs.main.clearValidate(['inquiryNo'])
      // 根据待询价工单查询产品信息
      this.getProductsList(row)
    },
    setOldSupplierData() {
      const data = deepClone(this.oldSupplierData)
      this.dataForm.cooperativePartnerName = data.name
      this.dataForm.cooperativePartnerCode = data.code
      this.dataForm.cooperativePartnerId = data.id
    },
    supplierdata(id, data) {
      // 如果传入的data为空数组
      if (data.length === 0) {
        // 将dataForm中的合作伙伴名称设为空字符串
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
      } else {
        this.oldSupplierData = deepClone(data[0].all)
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        // 清除供应商的验证爆红
        this.$refs['dataForm'].$refs.main.clearValidate(['cooperativePartnerName'])
      }
    },
    // 复制
    copy(row) {
      this.dataFormTwoList.push({ ...row })
    },
    // 删除当前行
    deltable(row, index) {
      if (this.dataFormTwoList.length === 1) return this.$message.error('至少需要保留一条产品数据')
      this.dataFormTwoList.splice(row.$index, 1)
    },
    // 初始化方法
    init(id, type) {
      // 表格表单适配模式
      this.$nextTick(() => { this.switchStyle('onresize') });
      this.btnType = type
      if (type === 'add') {
        const defaultData = this.linesListItems.reduce((acc, item) => {
          acc[item.prop] = '';
          return acc;
        }, {})
        this.dataFormTwoList.push(defaultData)
      }
      if (id) {
        this.getEnquiryDetails(id)
      } else {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        this.dataForm.quotationDate = this.jnpf.dateFormat(end, 'YYYY-MM-DD')
      }
      this.refreshTableHeight()
    },
    // 询价单详情
    getEnquiryDetails(id) {
      getEnquiryManagementInfo(id).then((res) => {
        const { inquiry = {}, inquiryLineList = [] } = res.data
        this.dataForm = {
          ...inquiry,
          inquiryNo: inquiry.quotationNo,
          cooperativePartnerName: inquiry.supplierName
        }
        this.getUserInfo(inquiry.quotationId)
        this.dataFormTwoList = inquiryLineList.map(item => {
          return {
            ...item,
            productCode: item.productsCode,
            productName: item.productsName
          }
        })
      })
    },
    // 选择待询价单弹窗
    showInquiryNoListDialog() {
      this.inquiryNoListDialog = true
      this.getWaitEnquiryOrdersListFun()
    },
    // 获取待询价列表
    getWaitEnquiryOrdersListFun() {
      getQuotationLists({
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        quotationStatus: 'pending_feedback',
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      }).then((res) => {
        const { records, total } = res.data
        this.inquiryNoData = records
        this.inquiryNoTotal = total
      })
    },
    // 选中一条数据
    async selectWaitEnquiry(scope) {
      // 判断是否已经有选择的待询价订单
      const inquiryNo = this.dataForm.inquiryNo
      if (inquiryNo) {
        const flag = await this.$confirm('切换待询价单将更新基础信息和产品数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        if (flag) {
          this.setBasicInfo(scope.row)
        }
      } else {
        this.setBasicInfo(scope.row)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
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
  padding-bottom: 0px
}

.required-head-style {
  color: red;
  margin-right: 4px;
}
</style>
