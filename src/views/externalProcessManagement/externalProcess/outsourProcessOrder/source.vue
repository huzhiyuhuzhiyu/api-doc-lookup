<template>
  <div>
    <el-drawer :title="types === 'look' ? '查看发料清单' : '配置发料清单'" :visible.sync="drawer" :direction="direction"
      :wrapperClosable="false" :before-close="handleClose" size="45%" class="JNPF-common-drawer columnSettings-drawer"
      append-to-body>
      <div class="JNPF-flex-main">

        <el-scrollbar class="column-list">
          <div v-if="types !== 'look'">
            <el-button type="text" class="topButton" icon="el-icon-plus"
              @click="openProductDialog('product')">选择产品</el-button>|
            <el-button type="text" class="topButton" icon="el-icon-plus"
              @click="openProductDialog('process')">选择工序产品</el-button>|
            <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
          </div>

          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" v-loading="formLoading">
            <el-table hasNO fixedNO v-bind="dataFormTwo.data" @selection-change="handeleProductInfoData" hasC
              :data="dataFormTwo.data" id="table" style="width: 100%">
              <el-table-column type="selection" width="60" fixed="left" align="center" v-if="types != 'look'" />
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
              <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">

                    <div class="viewData">
                      <span>{{ scope.row.productCode }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                    <div class="viewData">
                      <span>{{ scope.row.productName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="routingName" label="工艺路线名称" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'routingName'">
                    <div class="viewData">
                      <span>{{ scope.row.routingName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="processName" label="工序名称" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'processName'">
                    <div class="viewData">
                      <span>{{ scope.row.processName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="mainUnit" label="单位(主)" min-width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                    <div class="viewData">
                      <span>{{ scope.row.mainUnit }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="demandQuantity" label="发料数量" min-width="140">
                <template slot="header">
                  <span class="required">*</span>发料数量
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'demandQuantity'"
                    :rules='productRule.demandQuantity'>
                    <el-input v-model="scope.row.demandQuantity" :disabled="types === 'look'" maxlength="20"
                      placeholder="请输入发料数量">
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90" fixed="right" v-if="types !== 'look'">
                <template slot-scope="scope">
                  <el-button type="text" class="JNPF-table-delBtn" :disabled="types === 'look'"
                    @click="deleteth(scope.$index)">
                    {{ $t(`common.delBtn`) }}
                  </el-button>
                </template>
              </el-table-column>
              <div class="noDataTip" v-if="dataFormTwo.data.length === 0">暂无数据</div>
            </el-table>
          </el-form>
        </el-scrollbar>


        <div class="footer">
          <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="submitForm('dataForm')" v-if="types != 'look' ? true : false">
            {{ $t('common.confirmButton') }}
          </el-button>
        </div>
      </div>
    </el-drawer>
    <ComSelect-page ref="ComSelect-page" @change="addth"
      :tableItems="type === 'product' ? ProductTableItems : ProductTableItems2" title="选择产品" treeTitle="产品分类"
      :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
      :searchList="ProductTableSearchList" :elementShow="false" multiple />
    <ComSelect-page ref="ComSelect-page2" @change="addth2" :tableItems="ProductTableItems2" title="选择工序产品"
      :renderTree="false" :listMethod="getWorkList" :listRequestObj="processMaterialListRequestObj"
      :searchList="ProductTableSearchList2" :elementShow="false" multiple />
  </div>
</template>

<script>

import formValidate from "@/utils/formValidate";
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getWorkList } from '@/api/productOrdes/index'
export default {
  components: {

  },
  data() {
    return {
      getWorkList,
      types: '',
      getProductList,
      drawer: false,
      direction: 'rtl',
      type: '',
      dataFormTwo: {
        data: [],
      },
      productRule: {
        demandQuantity: [
          { required: true, validator: this.checktaxDemandQuantity(), trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('发料数量：' + errMsg) }] }), trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('发料数量：不能为0') }), trigger: 'blur' }

          // { validator: this.checktaxDemandQuantity1() , trigger: ['blur']},
        ],
      },
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      ProductListRequestObj: {
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        routingId: '',
        queryType: 3,
        hideStockZero: '',
        productStatus: 'enable',
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号' },
        { prop: 'spec', label: '规格型号' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: "mainUnit", label: "主单位" }
      ], // 产品选择弹出框表单展示字段
      ProductTableItems2: [
        { prop: 'productCode', label: '产品编码', fixed: 'left' },
        { prop: 'productName', label: '产品名称', fixed: 'left' },
        { prop: 'productDrawingNo', label: '产品图号' },
        // { prop: 'spec', label: '规格型号' },
        { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        { prop: 'processName', label: '工序名称' },
        // { prop: 'classAttributeText', label: '产品分类' },
        { prop: "mainUnit", label: "主单位" }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      ProductTableSearchList2: [
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "productDrawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      productArr: [],
      routingId: '',
      processArr: [],
      productListArr: [],
      processMaterialListRequestObj: {
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionOrderNo: "",
        pickingProductFlag: 1,
      },
      formLoading:false,
    }
  },

  methods: {
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.productArr.length === 0) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.productArr.length; i++) {
        const row = this.productArr[i];
        const index = this.dataFormTwo.data.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.productArr = []  // 清空选中的行的数据
    },
    // 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },
    openProductDialog(type) {
      this.type = type
      if (type === 'product') {
        this.ProductListRequestObj.routingId = ''
        this.ProductListRequestObj.queryType = ''
        this.$refs['ComSelect-page'].openDialog()
      } else {
        if (this.productionOrderNo) {
          this.processMaterialListRequestObj.productionOrderNo = this.productionOrderNo
          this.$refs['ComSelect-page2'].openDialog()
        }
      }

    },
    addth(id, data) {
      console.log(data);
      let selectArr = []
      if (this.type === 'product') {

        if (data.length) {

          let list = data.map(item => item.all)
          list.forEach((item, index) => {
            selectArr.push({
              productName: item.name,
              productsId: item.id,                 // 产品id
              productCode: item.code,
              routingName: item.routingName,
              routingId: item.routingId,
              processName: item.processName,
              processId: item.processId,
              mainUnit: item.mainUnit,
              demandQuantity: '',
              calculationDirection: item.calculationDirection,
              ratio: item.ratio,
              routingLineId: item.routingLineId,

            })
          })

        }
      } else {
        if (data.length) {
          let list = data.map(item => item.all)
          list.forEach((item, index) => {
            selectArr.push({
              productName: item.name,
              productsId: item.id,                 // 产品id
              productCode: item.code,
              routingName: item.routingName,
              routingId: item.routingId,
              processName: item.processName,
              processId: item.processId,
              mainUnit: item.mainUnit,
              demandQuantity: '',
              calculationDirection: item.calculationDirection,
              ratio: item.ratio,
              routingLineId: item.routingLineId,
            })
          })

        }
      }
      console.log(selectArr, '选中');
      console.log(this.dataFormTwo.data, '列表');
      if (this.dataFormTwo.data.length) {
        const deletedArray = [];
        const deletedArray2 = [];
        selectArr = selectArr.filter(item1 => {

          if (!item1.processId) {
            const index = this.dataFormTwo.data.findIndex(item2 => (item2.productsId === item1.productsId && item1.processId === item2.processId));
            if (index !== -1) {
              deletedArray.push(item1.productName);
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false;
            }
            return true;
          } else {
            const index = this.dataFormTwo.data.findIndex(item2 => item2.processId === item1.processId);
            if (index !== -1) {
              deletedArray2.push(item1.processName);
              if (deletedArray2.length) {
                this.$message.error(`已经添加过的工序产品：${deletedArray2.join('、')}`)
              }
              return false;
            }
            return true;
          }
        });
        console.log(data, '删除后的数据');
        console.log(deletedArray, '被删掉的数据');
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
      this.calcHeight()
    },
    addth2(id, data) {
      let selectArr = []
      if (data.length) {
        let list = data.map(item => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productName: item.productName,
            productsId: item.productId,                 // 产品id
            productCode: item.productCode,
            routingName: item.routingName,
            routingId: item.routingId,
            processName: item.processName,
            processId: item.processId,
            mainUnit: item.mainUnit,
            demandQuantity: '',
            calculationDirection: item.calculationDirection,
            ratio: item.ratio,
            routingLineId: item.routingLineId,
          })
        })

      }
      if (this.dataFormTwo.data.length) {
        const deletedArray2 = [];
        selectArr = selectArr.filter(item1 => {
          const index = this.dataFormTwo.data.findIndex(item2 => item2.processId === item1.processId && item2.routingLineId === item1.routingLineId && item2.productsId === item1.productsId);
          if (index !== -1) {
            deletedArray2.push(item1.processName);
            if (deletedArray2.length) {
              this.$message.error(`已经添加过的工序产品：${deletedArray2.join('、')}`)
            }
            return false;
          }
          return true;
        });
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
    },
    deleteth(index) {
      this.dataFormTwo.data.splice(index, 1)
      this.calcHeight()
    },

    // 校验发料数量
    checktaxDemandQuantity() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：发料数量不能为空`
        if (!value) {
          this.$message.error(msg)
          callback(new Error(msg))
        }
        else {
          callback();
        }
      };
    },
    async init(data, type, productionOrderNo, previousCode,purchaseQuantity) {
      console.log(data, '资源')
      // this.dataForm = data
      this.drawer = true
      this.formLoading = true
      this.types = type
      let _data = []
      if (previousCode) {
        let query = {
          pageNum: 1,
          pageSize: 20,
          productCode: "",
          productDrawingNo: "",
          productName: "",
          productionOrderNo: productionOrderNo,
          pickingProductFlag: 1,
          processCode:previousCode,
        }
        const res = await getWorkList(query)
        if (res.data.records){
          _data = res.data.records.map(item => {
            return {
              productName: item.productName,
              productsId: item.productId || item.productsId,                 // 产品id
              productCode: item.productCode,
              routingName: item.routingName,
              routingId: item.routingId,
              processName: item.processName,
              processId: item.processId,
              mainUnit: item.mainUnit,
              demandQuantity: purchaseQuantity,
              calculationDirection: item.calculationDirection,
              ratio: item.ratio,
              routingLineId: item.routingLineId,
            }
          })
        }
      }
      this.formLoading = false
      this.productionOrderNo = productionOrderNo
      console.log(this.type);
      this.dataFormTwo.data = [...data,..._data]
      // this.dataFormTwo.data.forEach((item, index) => {
      //   this.$set(this.dataFormTwo.data[index], 'demandQuantity1', '')
      // })
      console.log(this.dataFormTwo.data);
   

    },
    handleClose(done) {
      this.drawer = false
    },
    async submitForm() {
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          // let sourceData = []
          // this.dataFormTwo.data.forEach(item => {
          //   sourceData.push({
          //     sourceShipmentListId: item.id,
          //     calculationDirection: item.calculationDirection,
          //     demandQuantity: item.demandQuantity1,
          //     deputyUnit: item.deputyUnit,
          //     mainUnit: item.mainUnit,
          //     productsId: item.productsId,
          //     qty: item.qty,
          //     ratio: item.ratio,
          //     routingLineId: item.routingLineId,
          //     shipmentType: 'out_orders',
          //   })
          // })
          this.$emit('confirm', this.dataFormTwo.data)
          this.$message.success('配置成功')
          this.drawer = false
        }
      })
    },
    calcHeight() {
      this.$nextTick(() => {
        let tBody = document.querySelectorAll('.el-table')[1]
        tBody.style.height = 'auto'
        tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.columnSettings-drawer {
  font-size: 16px;

  .JNPF-flex-main {
    overflow: hidden;
  }

  .columnSetting-head {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 14px;
    color: #303133;
  }

  .column-list {
    height: 100%;
    padding: 8px 10px 0;

    .column-item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      font-size: 12px;
      color: #303133;
      cursor: pointer;
      border-bottom: 1px solid #e3e6eb;

      &:hover {
        background: rgba(25, 144, 250, 0.1);
      }

      .column-item-icon {
        margin: auto 8px auto 10px;
        color: #909399;
        cursor: move;
        font-size: 14px;
      }

      .el-switch {
        transform: scale(0.8);
      }

      .column-item-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        display: flex;
        align-items: center;
      }

      .check-box {
        margin-right: 16px;
      }
    }
  }

  .footer {
    margin: 4px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

  .topButton {
    margin-right: 8px;
    margin-left: 8px;
    font-size: 14px !important;
  }

  .noDataTip {
    text-align: 'center';
    padding: '10%';
    color: #aaa;
  }

  .viewData {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }

}
</style>

<style scoped>
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}</style>