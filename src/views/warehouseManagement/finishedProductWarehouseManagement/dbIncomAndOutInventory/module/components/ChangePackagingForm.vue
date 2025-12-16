<script>
import { getChangePackagingFormSchema } from "../data";
import { addStockChangePackage, getRecommendedInventory } from "@/api/stockChangePackage";
import { standardizeFields } from "@/utils";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';

export default {
  name: "ChangePackagingForm",
  components: { TableFormProduct },
  data() {
    return {
      title: '换包装',
      btnType: '',
      loading: false,
      btnLoading: false,
      isOrderNoEditable: false,
      dataForm: {
        sourceId: '',
        changePackageType: 'change_package',
        documentStatus: 'submit',
      },
      basicFormSchema: [],
      linesList: [],
      recommendLinesList: [],
      linesListItems: [
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          minWidth: 170,
          options: this.getDictDataSync('packaging'),
        },
        {
          prop: 'num',
          label: `可换包装数量`,
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'remainingNum',
          label: '剩余可换包装数量',
          type: 'view',
          minWidth: 180,
        },
      ],
      recommendLinesListItems: [
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'view',
          minWidth: 170,
        },
        {
          prop: 'num',
          label: `数量`,
          type: 'view',
          minWidth: 180,
        }
      ],
      linesTableHeight: 0,
      recommendTableHeight: 300,

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'recommendInfo', 'productInfo'],

      // 记录当前操作的源产品信息
      currentSourceProduct: null,
      currentSourceIndex: -1,

      actions: {
        look: async (id) => {
        },
        default: async (prefillData, formData) => {
          this.defaultInit(prefillData, formData);
          await this.getOrderNoConfig();
        },
      },
      apiMethodActions: {
        add: addStockChangePackage
      },

      recommendProps: {
        title: '推荐库存',
        renderTree: false,
        multiple: true,
        listMethod: getRecommendedInventory,
        searchList: [
          { prop: 'packagingMethod', label: '包装方式', type: 'select', options: this.getDictDataSync('packaging') },
        ],
        tableItems: [
          { prop: 'orderDate', label: '入库日期', minWidth: '150px', sortable: 'custom' },
          { prop: 'productName', label: '产品名称', minWidth: '180px', sortable: 'custom' },
          { prop: 'productCode', label: '产品编码', minWidth: '180px', sortable: 'custom' },
          { prop: 'productDrawingNo', label: '型号', minWidth: '180px', sortable: 'custom' },
          { prop: 'mainUnit', label: '单位', minWidth: '80px', sortable: 'custom' },
          { prop: 'shelfSpaceName', label: '领料库位', minWidth: '120px', sortable: 'custom' },
          { prop: 'batchNumber', label: '批次号', minWidth: '160px', sortable: 'custom' },
          { prop: 'packagingMethod', label: '包装方式', minWidth: '120px', sortable: 'custom', slot: true, dictType: 'packaging' },
          { prop: 'inventoryQuantity', label: '库存数量', minWidth: '120px', sortable: 'custom' },
          { prop: 'outboundQuantity', label: '出库数量', minWidth: '120px', sortable: 'custom' },
        ],
        listRequestObj: {
          changePackageNum: '',
          packagingMethod: '',
          productsId: '',
        },
        beforeSubmit: (data, paramsObj) => {
          if (!data || !data.length) {
            this.$message.error(`请进行推荐库存选择！`)
            return false
          }
          const zeroOutboundItems = data.filter(item => {
            const outboundQty = item.all.outboundQuantity;

            if (outboundQty == null || outboundQty === '') {
              return true;
            }

            const num = parseFloat(outboundQty);
            return isNaN(num) || num === 0;
          });

          if (zeroOutboundItems.length > 0) {
            const productNames = zeroOutboundItems.map(item =>
              item.all.productName || item.all.productCode || `产品(型号:${item.all.productDrawingNo})`
            ).join('、');

            if (zeroOutboundItems.length === 1) {
              this.$message.error(`产品"${productNames}"的出库数量为0，请取消勾选或填写正确的出库数量！`);
            } else {
              this.$message.error(`${zeroOutboundItems.length}个产品的出库数量为0：${productNames}，请取消勾选或填写正确的出库数量！`);
            }

            return false;
          }
          return true
        },
      },

      recommendProductFieldMap: {
        productName: ['productName'],
        productCode: ['productCode'],
        productDrawingNo: ['productDrawingNo'],
        inventoryLineId: ['stockInventoryLineId'],
      },

      productFieldMap: {
        productsName: ['productsName', 'productName'],
        productsCode: ['productsCode', 'productCode'],
        drawingNo: ['productsDrawingNo', 'productDrawingNo', 'drawingNo'],
        productsId: ['productsId', 'productId'],
        num: ['unrecommendQuantity'],
        sourceLineId: ['id'],
        id: {
          value: ''
        }
      },
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  watch: {
    recommendLinesList: {
      handler() {
        this.updateSourceProductRemainingNum();
      },
      deep: true
    }
  },
  mounted() {
    this.basicFormSchema = getChangePackagingFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, prefillData = [], formData = {}) {
      this.loading = true
      this.btnType = type
      this.title = this.getTitle(type)
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(prefillData, formData);
      }

      this.$nextTick(() => {
        this.$refs.dataForm.setDefaultValue()
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
        this.loading = false
      })
    },
    async defaultInit(prefillData, formData) {
      this.dataForm = {
        ...this.dataForm,
        sourceId: formData.id,
        priority: formData.priority,
        orderDate: this.jnpf.getToday(),
      }
      this.linesList = standardizeFields(prefillData, this.productFieldMap).map(item => ({
        ...item,
        sourceId: formData.id,
        remainingNum: item.num || 0,
      }))
    },
    handleRecommend(row, index) {
      this.currentSourceProduct = { ...row };
      this.currentSourceIndex = index;

      this.recommendProps.listRequestObj.productsId = row.productsId || row.productId
      this.recommendProps.listRequestObj.packagingMethod = row.packagingMethod
      this.recommendProps.listRequestObj.changePackageNum = row.num
      this.$refs.ComSelectRecommendRef.openDialog()
    },
    async recommendSubmit(id, selectedData) {
      try {
        const sourceProduct = this.linesList[this.currentSourceIndex];
        if (!sourceProduct) {
          this.$message.error('源产品不存在');
          return;
        }

        const selectedProducts = selectedData
          .map(item => {
            return standardizeFields(item.all, this.recommendProductFieldMap);
          })
          .filter(item => item);

        const remainingNum = this.jnpf.numberFormat(sourceProduct.remainingNum || sourceProduct.num || 0, 4);

        const selectedNumbers = selectedProducts.map(item => item.outboundQuantity || 0);
        const selectedTotalNum = this.jnpf.math('+', selectedNumbers, 4);

        if (selectedTotalNum > remainingNum) {
          this.$message.error(`选择的产品库存数量 ${ selectedTotalNum } 超过源产品剩余可换包装数量 ${ remainingNum }`);
          return;
        }

        const newRecommendProducts = selectedProducts
          .map(item => {
            return {
              ...item,
              sourceProductId: sourceProduct.sourceLineId,
              sourceProductIndex: this.currentSourceIndex,
              num: item.outboundQuantity,
              sourceId: this.dataForm.sourceId,
              sourceLineId: sourceProduct.sourceLineId,
            };
          })
          .filter(item => item !== null);

        if (newRecommendProducts.length > 0) {
          this.recommendLinesList.push(...newRecommendProducts);

          this.updateSourceProductRemainingNum();

          this.$message.success(`成功添加 ${ newRecommendProducts.length } 个推荐产品`);
        } else {
          this.$message.warning('所有选择的产品已存在于推荐列表中');
        }
      } catch ( error ) {
        this.$message.error('处理推荐产品数据失败');
      }
    },
    // 更新所有源产品的剩余数量
    updateSourceProductRemainingNum() {
      this.linesList.forEach(item => {
        const originalNum = item.num || 0;
        this.$set(item, 'remainingNum', originalNum);
      });

      this.recommendLinesList.forEach(recommendItem => {
        const sourceProductIndex = this.linesList.findIndex(item => item.sourceLineId === recommendItem.sourceProductId);
        if (sourceProductIndex !== -1) {
          const recommendNum = recommendItem.num || 0;
          const currentRemaining = this.linesList[sourceProductIndex].remainingNum || 0;
          const newRemaining = this.jnpf.math('-', [currentRemaining, recommendNum]);
          this.$set(this.linesList[sourceProductIndex], 'remainingNum', Math.max(newRemaining, 0));
        }
      });
    },
    deleteRecommendLines(scope) {
      this.recommendLinesList.splice(scope.$index, 1);
      this.updateSourceProductRemainingNum();
    },
    async getOrderNoConfig() {
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', 'HBZDH')
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (this.btnType === 'add') {
        this.dataForm.orderNo = `${ number }`
      }
    },
    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const formRegionRef = this.$refs.dataFormRegion

      let maxHeight = mainRef.clientHeight - formRegionRef.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },
    getTitle(type) {
      switch ( type ) {
        case 'add':
          return `生成${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },
    async getDetail(id) {
      // this.loading = true
      // try {
      //   const res = await (id)
      //   const { msg, data } = res
      //   if (msg === 'Success') {
      //     this.dataForm = data.notice
      //     this.linesList = data.noticeLineList
      //     this.loading = false
      //   }
      // } catch ( err ) {
      //   this.loading = false
      // }
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex));
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value;
      }
    },
    recommendContentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.recommendLinesList = JSON.parse(JSON.stringify(dataOrIndex));
      } else if (prop) {
        this.recommendLinesList[dataOrIndex][prop] = value;
      }
    },
    mergeRecommendLinesSimple() {
      const mergedMap = {};

      this.recommendLinesList.forEach(item => {
        const key = `${ item.productsId }_${ item.packagingMethod }`;

        if (!mergedMap[key]) {
          mergedMap[key] = { ...item };
        } else {
          mergedMap[key].num = this.jnpf.math('+', [mergedMap[key].num, item.num], 4);
        }
      });
      return Object.values(mergedMap);
    },
    async handleSubmit() {
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)

      // 校验剩余数量不能为负数
      const hasNegativeRemaining = this.linesList.some(item => {
        const remaining = parseFloat(item.remainingNum) || 0;
        return remaining < 0;
      });

      if (hasNegativeRemaining) {
        this.$message.error('部分产品的剩余可换包装数量为负数，请检查推荐库存数量');
        this.btnLoading = false;
        return;
      }

      if (!valid_1 || !valid_2) {
        this.btnLoading = false;
        return;
      }

      const mergedList = this.mergeRecommendLinesSimple();

      const params = {
        stockChangePackage: this.dataForm,
        stockChangePackageLineList: mergedList,
        stockChangePackageWarehouseLineList: this.recommendLinesList
      }

      let MSG = '提交成功'
      try {
        const res = await this.apiMethodActions[this.btnType](params)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch ( error ) {
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
    <div class="JNPF-preview-main transitionForm">
      <div class="JNPF-common-page-header">
        <el-page-header @back="$emit('close',false)" :content="title"/>
        <div class="options">
          <template v-if="activeType">
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
              保存
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
                <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType"/>
              </el-collapse-item>
              <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
                <TableForm-product
                  @input="contentChanges"
                  :value="linesList"
                  :hasToolbar="false"
                  ref="tableForm"
                  :tableItems="linesListItems"
                  :btnType="btnType"
                  :tableProps="{
                    is: 'JNPF-table',
                    fixedNO: true,
                    hasC: false,
                    height: linesTableHeight,
                    rowKey: 'id',
                    defaultExpandAll: true,
                    customColumn: true,
                  }"
                >
                  <template slot="top">
                    <div class="tableTopContainer">
                      <div class="left"></div>
                      <div class="right">
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                          <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                   @click="$refs.tableForm.$refs.tableRef.showDrawer()"/>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                  <template slot="actions">
                    <el-table-column label="操作" width="120" v-if="activeType" fixed="right">
                      <template slot-scope="{row,$index}">
                        <el-button type="text" size="mini" @click="handleRecommend(row,$index)">
                          推荐库存
                        </el-button>
                      </template>
                    </el-table-column>
                  </template>
                </TableForm-product>
              </el-collapse-item>
              <el-collapse-item class="productInfo" title="推荐换包装产品信息" name="recommendInfo">
                <TableForm-product
                  @input="recommendContentChanges"
                  :value="recommendLinesList"
                  :hasToolbar="false"
                  ref="recommendTableForm"
                  :tableItems="recommendLinesListItems"
                  :btnType="'add'"
                  @deleteth="deleteRecommendLines"
                  :tableProps="{
                    is: 'JNPF-table',
                    fixedNO: true,
                    hasC: true,
                    height: recommendTableHeight,
                    rowKey: 'id',
                    defaultExpandAll: true,
                    customColumn: true,
                    selection: true,
                  }"
                >
                  <template slot="top">
                    <div class="tableTopContainer">
                      <div class="left">
                        <template v-if="activeType">
                          <el-button
                            :disabled="!recommendLinesList.length"
                            type="text"
                            icon="el-icon-delete"
                            class="JNPF-table-delBtn"
                            @click="$refs.recommendTableForm.batchDelete()"
                          >
                            批量删除
                          </el-button>
                        </template>
                      </div>
                      <div class="right">
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                          <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                   @click="$refs.recommendTableForm.$refs.tableRef.showDrawer()"/>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </TableForm-product>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page v-bind="recommendProps" ref="ComSelectRecommendRef" :element-show="false" @change="recommendSubmit">
        <template #outboundQuantity="row">
          <el-input
            v-model="row.row.outboundQuantity"
            placeholder="请输入出库数量"
            clearable
          />
        </template>
      </ComSelect-page>
    </div>
  </transition>
</template>
