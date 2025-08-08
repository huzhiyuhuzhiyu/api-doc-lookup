<script>
import {deepClone} from "@/utils";
import {getBasicFormSchema} from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {addPackagingPlanBox} from "@/api/PackagingPlanBox";
import * as _ from "highcharts";
import {getBimPackagingMaterialsPage} from "@/api/packagingMaterials";

export default {
  name: "Form",
  components: {TableFormProduct},
  data() {
    return {
      title: '单物料包裹',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        drawingNo: '',
        productName: '',
        num: '',
        packagingMaterialId: '',
        packagingMethod: '',
        singleBoxNum: '',
        singleWeight: '',
      },
      basicFormSchema: getBasicFormSchema(this.$refs.dataForm, this),
      linesList: [],
      linesListItems: [
        {
          prop: 'productsDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'productsName',
          label: '产品名称',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'batchNumber',
          label: '批次',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'num',
          label: '数量',
          type: 'input',
          value: '',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate('noZero', '数量不能为0', (errMsg, rowIndex) => {
                this.$message.error(`装箱信息第${ rowIndex + 1 }行：${ errMsg }`)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['数量不能为空', (errMsg, rowIndex) => {
                  this.$message.error(`装箱信息第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`装箱信息第${ rowIndex + 1 }行：数量${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {required: true, message: '数量不能为空', trigger: ['blur', 'change'],},
          ]
        },
        {
          prop: 'netWeight',
          label: '净重（KG）',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'grossWeight',
          label: '毛重（KG）',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: "full",
          label: "装满",
          value: "",
          type: 'switch',
          appearance: 'checkbox',
        },
      ],
      linesTableHeight: 0,

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],

      packagingMaterialList: []
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    computedLinesList() {
      return this.linesList.map(item => {
        const singleWeight = parseFloat(this.dataForm.singleWeight) || 0;
        const packagingMaterialId = this.dataForm.packagingMaterialId;
        let packagingWeight = 0;
        const selectedMaterial = this.packagingMaterialList.find(item => item.id === packagingMaterialId);
        packagingWeight = parseFloat(selectedMaterial.netWeight) || 0;

        const num = parseFloat(item.num) || 0;

        return {
          ...item,
          netWeight: this.jnpf.numberFormat(num * singleWeight, 2),
          grossWeight: this.jnpf.numberFormat(num * singleWeight + packagingWeight, 2)
        };
      });
    },
    subTableTotalNum() {
      return this.linesList.reduce((sum, item) => sum + (parseFloat(item.num) || 0), 0);
    },
  },
  watch: {
    subTableTotalNum() {
      this.checkQuantityExceed();
    }
  },
  created() {
  },
  methods: {
    async init(type, row) {
      this.btnType = type
      this.title = this.getTitle(type)
      await this.getPackagingMaterial()
      this.dataForm = _.merge(this.dataForm, row)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },

    checkQuantityExceed() {
      if (this.subTableTotalNum > parseFloat(this.dataForm.num)) {
        this.$message.error('装箱信息数量总和已超过本次计划总数量，请调整后再提交');
        return true;
      }
      return false;
    },

    async calculateBoxes() {
      const totalNum = parseFloat(this.dataForm.num);
      const singleBoxNum = parseFloat(this.dataForm.singleBoxNum);

      if (isNaN(totalNum) || isNaN(singleBoxNum) || singleBoxNum <= 0) {
        this.$message.error('请先填写有效的总数量和每箱数量');
        return;
      }
      const boxCount = Math.ceil(totalNum / singleBoxNum);
      const lines = [];

      for (let i = 0; i < boxCount; i++) {
        const boxNum = i === boxCount - 1 ?
          (totalNum - (i * singleBoxNum)) :
          singleBoxNum;

        const isFull = i !== boxCount - 1 || boxNum === singleBoxNum;

        lines.push({
          ...this.createdObj,
          productsDrawingNo: this.dataForm.productDrawingNo,
          productsName: this.dataForm.productName,
          batchNumber: this.dataForm.batchNumber,
          mainUnit: this.dataForm.mainUnit,
          num: boxNum,
          full: isFull
        });
      }

      this.linesList = lines;
      this.$message.success(`运算完成，共需要${ boxCount }个箱子`);
    },

    addNewLine() {
      const newLine = {
        ...this.createdObj,
        productsDrawingNo: this.dataForm.drawingNo,
        productsName: this.dataForm.productName,
        batchNumber: this.dataForm.batchNumber,
        mainUnit: this.dataForm.mainUnit,
        num: 0,
        netWeight: '',
        grossWeight: '',
        full: false
      };
      this.linesList.push(newLine);
    },

    async getPackagingMaterial() {
      const params = {
        packagingType: 'packing_manage',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 9999
      }
      const res = await getBimPackagingMaterialsPage(params)
      const {records} = res.data
      this.packagingMaterialList = records.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        }
      })
    },

    createdObj() {
      return this.linesListItems.reduce((acc, item) => {
        acc[item.prop] = '';
        return acc;
      }, {});
    },

    linesDelete(row) {
      this.linesList.splice(row.$index, 1)
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
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    getTitle(type) {
      switch (type) {
        case 'add':
          return `创建${ this.title }`
        case 'edit':
          return `编辑${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },

    async handleSubmit() {
      if (!this.linesList.length) return this.$message.error('无装箱信息，请添加！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      if (this.checkQuantityExceed()) return this.btnLoading = false;
      const deepParams = deepClone(this.dataForm)
      deepParams.documentId = deepParams.id
      const stockPlanPackageLineList = this.computedLinesList.map(item => ({
        ...item,
        productsId: deepParams.productsId,
        documentId: deepParams.id,
      }))
      const params = {
        stockPlanPackage: deepParams,
        stockPlanPackageLineList: stockPlanPackageLineList
      }
      let MSG = '提交成功'
      try {
        const res = await addPackagingPlanBox(params)
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
      this.$emit('close');
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
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
                <el-button @click="$emit('close',false)">{{
                    $t('common.cancelButton')
                  }}
                </el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                    <el-collapse-item title="本次计划" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                      <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                        :btnType="btnType"/>
                    </el-collapse-item>
                    <el-collapse-item class="productInfo"
                      title="装箱信息"
                      name="productInfo">
                      <div class="TableForm_title">
                      </div>
                      <TableForm-product
                        @input="contentChanges"
                        :value="computedLinesList"
                        :hasToolbar="false"
                        ref="tableForm" :tableItems="linesListItems"
                        :btnType="btnType"
                        :hasActionbar="false"
                        :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: activeType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                    }">
                        <template slot="top">
                          <div class="tableTopContainer">
                            <div v-if="activeType" class="left">
                              <template>
                                <el-button type="text" @click="calculateBoxes">运算</el-button>
                                <span>|</span>
                                <el-button type="text" icon="el-icon-plus" @click="addNewLine">新增</el-button>
                                <span>|</span>
                              </template>
                              <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除</el-button>
                            </div>
                            <div class="right">
                              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                  @click="$refs.tableForm.$refs.tableRef.showDrawer()"/>
                              </el-tooltip>
                            </div>
                          </div>
                        </template>
                        <template slot="actions">
                          <el-table-column label="操作" width="100" fixed="right">
                            <template slot-scope="scope">
                              <el-button type="text" class="JNPF-table-delBtn"
                                @click="linesDelete(scope)">
                                {{ $t(`common.delBtn`) }}
                              </el-button>
                            </template>
                          </el-table-column>
                        </template>
                      </TableForm-product>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
