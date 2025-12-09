<script>
import {getBasicFormSchema, getBasicPickFormSchema} from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {getQuotationsendlist} from "@/api/salesManagement";
import {addProdPlanArrange, detailProcess, getWorkListMap} from "@/api/basicData/processSettingss";
import * as _ from "highcharts";
import {BOMLineList} from "@/api/calculationList/MRPOperation";
import {getProductionLineInfo, getProductionLineList} from "@/api/basicData";
import moment from "moment";
import {getcategoryTree} from "@/api/basicData/materialSettings";
import {getProducts} from "@/api/masterDataManagement";
import {addProdOrder} from "@/api/productOrdes/finishedProductOrders";
import {deepClone, standardizeFields} from "@/utils";

export default {
  name: "packingForm",
  components: {TableFormProduct},
  data() {
    return {
      title: '包装计划',
      btnType: '',
      loading: false,
      btnLoading: false,
      resIdList: [],
      productionLineList: [],
      dataForm: {
        taskMethod: 'not_appoint',
        source: 'package_plan',
        orderNo: '',
        productCode: '',
        drawingNo: '',
        productsDrawingNo: '',
        productsName: '',
        productsCode: '',
        mainUnit: '',
        planProductionQuantity: '',
        availableArrangeQuantity: '',
        productionQuantity: '',
        productionLineId: '',
        planDate: [],
        routingName: '',
        routingId: '',
        routingCode: '',
        bomId: '',
        reportRulesFlag: '',
        remark: '',
      },
      pickForm: {
        orderNo: '',
        personId: '',
        operationDate: moment(new Date()).format('YYYY-MM-DD'),
      },
      basicFormSchema: [],
      basicPickFormSchema: [],
      linesList: [],
      linesListItems: [
        {
          prop: 'processCode',
          label: '工序编码',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'processName',
          label: '工序名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'processingType',
          label: '加工类型',
          type: 'view',
          minWidth: 160,
          slot: true,
          dictType: 'processingType',
        },
        {
          prop: "personName",
          label: "人员",
          value: "",
          type: "custom",
          minWidth: 180,
          customComponent: "ComSelect-page",
          itemRules: [{required: true, trigger: "change"}],
          title: '选择人员',
          renderTree: false,
          multiple: false,
          clearable: false,
          listMethod: getWorkListMap,
          tableItems: [
            {prop: 'code', label: '人员名称'},
            {prop: 'name', label: '人员工号'},
          ],
          listRequestObj: () => ({
            resType: "personnel",
            resIdList: this.resIdList,
          }),
          listDataFormatting: (res) => {
            return this.listDataFormatting(res.data)
          },
          beforeOpen: ({scope}) => {
            const {row} = scope
            if (!row.routingProResMap || !row.routingProResMap.personnel) {
              this.$message.error("当前工序没有配置人员资源");
              return false
            }
            this.resIdList = row.routingProResMap?.personnel?.map(item => item.resourceId) || []
            return true
          },
          change: (id, data, {scope}) => {
            const {row} = scope
            row.personId = data[0].all.id;
            row.personName = data[0].all.name;
          },
        },
        {
          prop: "workGroupName",
          label: "班组",
          value: "",
          type: "custom",
          minWidth: 180,
          customComponent: "ComSelect-page",
          itemRules: [{required: true, trigger: "change"}],
          title: '选择班组',
          renderTree: false,
          multiple: false,
          clearable: false,
          listMethod: getWorkListMap,
          tableItems: [
            {prop: 'name', label: '班组名称'},
            {prop: 'code', label: '班组编码'},
          ],
          listRequestObj: () => ({
            resType: "work_group",
            resIdList: this.resIdList,
          }),
          listDataFormatting: (res) => {
            return this.listDataFormatting(res.data)
          },
          beforeOpen: ({scope}) => {
            const {row} = scope
            if (!row.routingProResMap || !row.routingProResMap.work_group) {
              this.$message.error("当前工序没有配置班组资源");
              return false
            }
            this.resIdList = row.routingProResMap?.work_group?.map(item => item.resourceId) || []
            return true
          },
          change: (id, data, {scope}) => {
            const {row} = scope
            row.workGroupId = data[0].all.id;
            row.workGroupName = data[0].all.name;
          },
        },
        {
          prop: "equipmentName",
          label: "设备",
          value: "",
          type: "custom",
          minWidth: 180,
          customComponent: "ComSelect-page",
          itemRules: [{required: true, trigger: "change"}],
          title: '选择设备',
          renderTree: false,
          multiple: false,
          clearable: false,
          listMethod: getWorkListMap,
          tableItems: [
            {prop: 'name', label: '设备名称'},
            {prop: 'code', label: '设备编码'},
          ],
          listRequestObj: () => ({
            resType: "device",
            resIdList: this.resIdList,
          }),
          listDataFormatting: (res) => {
            return this.listDataFormatting(res.data)
          },
          beforeOpen: ({scope}) => {
            const {row} = scope
            if (!row.routingProResMap || !row.routingProResMap.device) {
              this.$message.error("当前工序没有配置设备资源");
              return false
            }
            this.resIdList = row.routingProResMap?.device?.map(item => item.resourceId) || []
            return true
          },
          change: (id, data, {scope}) => {
            const {row} = scope
            row.equipmentId = data[0].all.id;
            row.equipmentName = data[0].all.name;
          },
        },
        {
          prop: 'pickingFlag',
          label: '是否领料',
          type: 'view',
          minWidth: 120,
          slot: true,
          dictType: 'booleanOptions',
        },
        {
          prop: 'firstInspection',
          label: '是否首检',
          type: 'view',
          minWidth: 120,
          slot: true,
          dictType: 'booleanOptions',
        },
        {
          prop: 'checkFlag',
          label: '是否检验',
          type: 'view',
          minWidth: 120,
          slot: true,
          dictType: 'booleanOptions',
        },
        {
          prop: 'reportFlag',
          label: '是否报工',
          type: 'view',
          minWidth: 120,
          slot: true,
          dictType: 'booleanOptions',
        },
        {
          prop: 'stockFlag',
          label: '是否入库',
          type: 'view',
          minWidth: 120,
          slot: true,
          dictType: 'booleanOptions',
        },
        {
          prop: 'workOrderFlag',
          label: '是否生成工单',
          type: 'view',
          minWidth: 120,
          slot: true,
          dictType: 'booleanOptions',
        },
      ],
      materialList: [],
      materialListItems: [
        {
          prop: 'drawingNo',
          label: '产品型号',
          type: 'view',
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'materialsUsedQuantity',
          label: '投料数量',
          type: 'view',
          minWidth: 120,
        },
      ],
      basicFormSchemaProps: new Set([
        'productionPlanNo', 'productCode',
        'planProductionQuantity', 'availableArrangeQuantity',
        'productionLineId',
      ]),
      notAppointProps: new Set(['personName', 'workGroupName', 'equipmentName']),
      linesTableHeight: 0,

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      pickActiveNames: ['pickInfo', 'materialInfo'],
      actions: {
        add: async () => {
          await this.getOrderNoConfig('PROD', 'dataForm');
          await this.getOrderNoConfig('PODH', 'pickForm');
        },
        edit: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async (prefillData, pageSource) => {
          this.defaultInit(prefillData, pageSource);
          await this.getOrderNoConfig('PROD', 'dataForm');
          await this.getOrderNoConfig('PODH', 'pickForm');
        },
      },
      apiMethodActions: {
        arrange: addProdPlanArrange,
        add: addProdOrder
      },

      productFieldMap: {
        productsName: ['productsName', 'productName'],
        productsCode: ['productsCode', 'productCode'],
        drawingNo: ['productsDrawingNo', 'productDrawingNo', 'drawingNo'],
        productsId: ['productsId', 'productId']
      },
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    formQuantityLabel() {
      return this.btnType === 'arrange' ? '编排数量' : '生产数量';
    },
    isShowMaterialList() {
      return this.dataForm.productSource === 'assemble' && this.dataForm.orderType === 'packaging'
    }
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
    this.basicPickFormSchema = getBasicPickFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, prefillData = {}, pageSource = '') {
      this.loading = true
      this.btnType = type
      this.title = this.getTitle(type, pageSource)

      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(prefillData, pageSource);
      }
      this.updateBasicFormSchema()
      this.updateLinesListItems()
      await this.fetchProductionLineList()
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
        this.loading = false
      })
    },

    async defaultInit(prefillData, pageSource) {
      const unifiedData = standardizeFields(prefillData, this.productFieldMap);
      this.dataForm = _.merge({}, this.dataForm, unifiedData)
      if (unifiedData.planStartDate && unifiedData.planEndDate) {
        this.dataForm.planDate[0] = unifiedData.planStartDate
        this.dataForm.planDate[1] = unifiedData.planEndDate
      }
      this.dataForm.productionQuantity = unifiedData.availableArrangeQuantity
      this.dataForm.productionPlanId = unifiedData.id
      this.dataForm.taskMethod = 'not_appoint'
      this.dataForm.orderType = pageSource

      if (unifiedData.routingId) await this.getRoutingDetail(unifiedData.routingId)
      if (unifiedData.productionLineId) await this.selectLine(unifiedData.productionLineId)

      await this.getBOMLineList()
    },

    updateBasicFormSchema() {
      this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this).map(item => {
        if (this.btnType === 'add') {
          if (item.prop === 'drawingNo' && this.dataForm.orderType !== 'flipping') {
            return this.getDrawingNoFieldConfig(item);
          }

          return this.getCommonFieldConfig(item);
        }

        return item;
      });
    },

    getDrawingNoFieldConfig(item) {
      return {
        ...item,
        label: '产品型号',
        type: "custom",
        customComponent: "ComSelect-page",
        itemRules: [{required: true, trigger: "change"}],
        title: '选择产品',
        activeType: '',
        renderTree: false,
        multiple: false,
        treeTitle: '产品分类',
        methodArr: {
          method: getcategoryTree,
          requestObj: {
            classAttribute: 'finished_product',
          },
        },
        listMethod: getProducts,
        tableItems: [
          {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'code', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'mainUnit', label: '单位', sortable: 'custom'},
          {prop: 'createTime', label: '创建时间', minWidth: '220px', sortable: 'custom'}
        ],
        listRequestObj: {
          productCode: "",
          productName: "",
          productStatus: 'enable',
          classAttribute: 'finish_product',
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
          {prop: 'productName', label: '产品名称', type: 'input'},
          {prop: 'productCode', label: '产品编码', type: 'input'},
        ],
        change: async (id, data) => {
          this.$nextTick(() => {
            this.$refs.dataForm.$refs.main.validateField('drawingNo');
          });
          const _data = data[0].all;
          this.dataForm.bomId = _data.bomId;
          this.dataForm.orderType = 'manually';
          this.dataForm.productSource = _data.productSource;
          this.dataForm.drawingNo = _data.drawingNo;
          this.dataForm.productsDrawingNo = _data.drawingNo;
          this.dataForm.productsId = _data.id;
          this.dataForm.productsName = _data.name;
          this.dataForm.productsCode = _data.code;
          this.dataForm.mainUnit = _data.mainUnit;
          await this.getBOMLineList();
        }
      };
    },

    getCommonFieldConfig(item) {
      return {
        ...item,
        render: !this.basicFormSchemaProps.has(item.prop)
      };
    },

    updateLinesListItems() {
      this.linesListItems = this.linesListItems.map(item => {
        if (this.notAppointProps.has(item.prop)) {
          return {
            ...item,
            render: this.dataForm.taskMethod === 'appoint'
          }
        }
        return item
      })
    },

    async getBOMLineList() {
      if (!this.isShowMaterialList) return
      if (!this.dataForm.bomId) return this.$message.error('该产品没有BOM，请配置BOM后再试！')
      const res = await BOMLineList(this.dataForm.bomId)
      this.materialList = res.data.map(item => {
        return this.calculateMaterialItem(item);
      }) || []
    },

    calculateMaterialItem(item) {
      const materialsUsedQuantity = this.calMaterialsQuantity(
        item.qty,
        this.dataForm.productionQuantity,
        item.lossRate,
        item.fixedLoss
      );

      return {
        ...item,
        materialsUsedQuantity,
        drawingNo: item.productDrawingNo,
        productsId: item.productId,
      };
    },

    watchProductionQuantity() {
      if (!this.isShowMaterialList) return

      this.materialList = this.materialList.map(item => {
        return this.calculateMaterialItem(item);
      });
    },

    calMaterialsQuantity(a, b, c, d) {
      const _a = !a ? 1 : a;
      const _c = !c ? 1 : c;
      const result = +_a * +b * (1 + (+_c / 100)) + +d;
      if (isNaN(result)) return;
      return Math.floor(this.jnpf.numberFormat(result, 4));
    },

    async getRoutingDetail(id) {
      const res = await detailProcess(id)
      const {routing, routingLineList} = res.data
      this.dataForm.reportRulesFlag = routing.reportRulesFlag
      this.linesList = routingLineList.map(item => ({
        ...item,
        personId: item.routingProResMap?.personnel?.[0]?.resourceId ?? '',
        personName: item.routingProResMap?.personnel?.[0]?.resourceName ?? '',
        workGroupId: item.routingProResMap?.work_group?.[0]?.resourceId ?? '',
        workGroupName: item.routingProResMap?.work_group?.[0]?.resourceName ?? '',
        equipmentId: item.routingProResMap?.device?.[0]?.resourceId ?? '',
        equipmentName: item.routingProResMap?.device?.[0]?.resourceName ?? '',
      })).sort((a, b) => a.sort - b.sort)
    },

    async selectLine(id) {
      if (!id) return;

      try {
        const res = await getProductionLineInfo(id);
        const workstationList = res.data?.workstationList || [];
        const updateResource = (item, resourceType, idKey, nameKey) => {
          const resource = item.routingProResMap?.[resourceType]?.[0];
          return resource
            ? {...item, [idKey]: resource.resourceId, [nameKey]: resource.resourceName}
            : item;
        };

        this.linesList = this.linesList.map(item => {
          if (item.processingType !== "self_produced") return item;

          const match = workstationList.find(el => el.processId === item.processId);
          if (!match) return item;

          const updatedItem = {
            ...item,
            routingProResList: match.workstationResList,
            routingProResMap: match.workstationResMap,
          };

          return [
            updateResource(updatedItem, 'personnel', 'personId', 'personName'),
            updateResource(updatedItem, 'work_group', 'workGroupId', 'workGroupName'),
            updateResource(updatedItem, 'device', 'equipmentId', 'equipmentName'),
          ].reduce((acc, curr) => ({...acc, ...curr}), updatedItem);
        });

      } catch (error) {
      }
    },

    async fetchProductionLineList() {
      const params = {
        orderItems: [
          {
            asc: true,
            column: "",
          },
        ],
        pageNum: 1,
        pageSize: -1,
      };
      const res = await getProductionLineList(params)
      this.productionLineList = res.data.records.map(item => ({
        label: item.name,
        value: item.id,
      }))
    },

    async getOrderNoConfig(code, formName = 'dataForm') {
      const {number} = await this.$store.dispatch('base/getOrderNoConfig', code)
      this[formName].orderNo = `${ number }`
    },

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const formRegionRef = this.activeName === 'jcInfo'
        ? this.$refs.dataFormRegion
        : this.$refs.pickFormRegion

      let maxHeight = mainRef.clientHeight - formRegionRef.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    getTitle(type, pageSource) {
      this.title = pageSource === 'flipping' ? '重检单' : '包装计划'
      switch (type) {
        case 'arrange':
          return `${ this.title }编排`
        case 'add':
          return `新建${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getQuotationsendlist(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data.notice
          this.linesList = data.noticeLineList
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    contentChanges(dataOrIndex, prop, value) {
      const listName = this.activeName === 'jcInfo' ? 'linesList' : 'materialList';

      if (Array.isArray(dataOrIndex)) {
        this[listName] = JSON.parse(JSON.stringify(dataOrIndex));
      } else if (prop) {
        this[listName][dataOrIndex][prop] = value;
      }
    },

    listDataFormatting(res) {
      return Object.keys(res).map(key => {
        const parts = key.split('_');
        return {
          id: parts[0] || '',
          name: parts[1] || '',
          code: parts[2] || ''
        };
      })
    },

    async handleSubmit() {
      if (!this.dataForm.bomId && this.dataForm.productSource === 'assemble') {
        return this.$message.error('该产品没有BOM，请配置BOM后再试！')
      }
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      const deepDataForm = deepClone(this.dataForm)
      deepDataForm.source = 'package_plan'
      deepDataForm.planStartDate = deepDataForm.planDate[0]
      deepDataForm.planEndDate = deepDataForm.planDate[1]
      const newLinesList = this.linesList.map(item => ({
        ...item,
        workOrderResList: item.routingProResList
      }))
      const params = {
        prodOrder: deepDataForm,
        workOrderList: newLinesList,
        collect: this.isShowMaterialList ? this.pickForm : null,
        materialList: this.isShowMaterialList ? this.materialList : null,
      }
      let MSG = '提交成功'
      try {
        const res = await this.apiMethodActions[this.btnType](params)
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch (error) {
        this.btnLoading = false
      }
    },

    goBack() {
      this.$emit('close', this.activeType);
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header @back="$emit('close',false)" :content="title"/>
            <div class="options">
              <template v-if="activeType">
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                  保存并提交
                </el-button>
              </template>
              <el-button @click="$emit('close',false)">{{ $t('common.cancelButton') }}</el-button>
            </div>
          </div>
          <div class="main" v-loading="loading" ref="main">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基础信息" name="jcInfo">
                <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                    <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                      :btnType="btnType"/>
                  </el-collapse-item>
                  <el-collapse-item class="productInfo"
                    title="工序信息"
                    name="productInfo">
                    <TableForm-product
                      @input="contentChanges"
                      :value="linesList"
                      :hasToolbar="false"
                      ref="tableForm"
                      :btnType="btnType"
                      :tableItems="linesListItems"
                      :hasActionbar="false"
                      :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }"/>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="领料清单" name="annex" v-if="isShowMaterialList">
                <el-collapse v-model="pickActiveNames" style="margin-top: 5px;" @change="refreshTableHeight">
                  <el-collapse-item title="领料信息" name="pickInfo" class="orderInfo" ref="pickFormRegion">
                    <JNPF-col v-model="pickForm" :tabContent="basicPickFormSchema" ref="pickForm"
                      :btnType="btnType"/>
                  </el-collapse-item>
                  <el-collapse-item class="productInfo"
                    title="领料清单"
                    name="materialInfo">
                    <TableForm-product
                      @input="contentChanges"
                      :value="materialList"
                      :hasToolbar="false"
                      ref="tableForm"
                      :btnType="btnType"
                      :tableItems="materialListItems"
                      :hasActionbar="false"
                      :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }"/>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
