<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <el-page-header @back="goBack" :content="title" />
              <div class="options">
                <el-button @click="goBack">
                  {{ $t('common.cancelButton') }}
                </el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                  <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType" />
                </el-collapse-item>
                <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
                  <TableForm-product @input="contentChanges" :value="linesList" :hasToolbar="false" ref="tableForm"
                    :tableItems="linesListItems" :btnType="btnType" :hasActionbar="false" :tableProps="{
                      is: 'JNPF-table',
                      fixedNO: true,
                      hasC: activeType,
                      height: linesTableHeight,
                      rowKey: 'id',
                      defaultExpandAll: true,
                      customColumn: true,
                    }">
                  </TableForm-product>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { deepClone } from "@/utils";
import { getBasicFormSchema } from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getOrganization } from "@/api/permission/user";
import { getOrganizeInfo } from "@/api/permission/organize";
import { getEnquiryDetailById } from '@/api/enquiryManagement/enquiryLedger'
export default {
  name: "Form",
  components: { TableFormProduct },
  data() {
    return {
      title: '询价',
      btnType: '',
      loading: false,
      btnLoading: false,
      showDialog: false,
      departments: [],
      salesList: [],
      globalPackagingMethod: '',
      globalBrand: '',
      originalFormData: {},
      dataForm: {
        orderNo: '',
        orderType: '',
        departments: [],
        cooperativePartnerId: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        departmentId: '',
        salesId: '',
        orderDate: '',
        deliveryDate: '',
        remark: '',
        remark1: '',
      },
      fileList: [],
      basicFormSchema: [],
      linesList: [],
      linesListItems: [
        {
          prop: 'cooperativePartnerId',
          label: '供应商',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'productsCode',
          label: '产品型号',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'productsName',
          label: '产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'drawingNo',
          label: '客户型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'sampleNumStr',
          label: '样品数',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'sampleAmounts',
          label: '样品报价',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'procurementAmounts',
          label: '采购价',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'moldAmounts',
          label: '模具费',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'minNumStr',
          label: '起订量',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'deliveryDate',
          label: '交期',
          type: 'view',
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
      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      actions: {
        look: async (id) => {
          await this.getDetail(id);
        },
      },
      cooperativePartnerName: '',
      cooperativePartnerOption: [],
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  created() {
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type) {
      this.btnType = type
      this.title = this.getTitle(type)
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } 
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },

    async fetchDepartment() {
      const res = await getOrganizeInfo(this.dataForm.departmentId);
      this.dataForm.departments = [...res.data.organizeIdTree, this.dataForm.departmentId]
      await this.$nextTick()
      this.$refs.tableForm.setDefaultValue()
    },

    async fetchOrganization() {
      try {
        const params = {
          keyword: "",
          organizeId: this.dataForm.departmentId
        };
        const res = await getOrganization(params);
        this.salesList = res.data?.length
          ? res.data.map(item => ({
            ...item,
            label: item.fullName?.split('/')[0] || '',
            value: item.id
          }))
          : [];
      } finally {
        this.loading = false
      }
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

    createdObj() {
      return this.linesListItems.reduce((acc, item) => {
        acc[item.prop] = '';
        return acc;
      }, {});
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    getTitle(type) {
      switch (type) {
        case 'edit':
          return '询价'
        case 'look':
          return `查看${this.title}`
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getEnquiryDetailById(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = Object.assign(this.dataForm, data.purchaseInquiryVo)
          this.originalFormData = deepClone(this.dataForm)
          this.linesList = data.inquiryLineList
          await this.fetchDepartment()
          await this.fetchOrganization()
        }
      } catch (err) {
        this.loading = false
      }
    },

    goBack() {
      this.$emit('close', this.activeType);
    }
  }
}
</script>
<style lang="scss" scoped>
.cooperative-style {
  width: 30%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .lable-style {
    width: 100px;
    text-align: left;
  }
}
</style>
