<template>
  <div>
    <el-drawer title="发料清单" :visible.sync="drawer" :direction="direction" :wrapperClosable="false"
      :before-close="handleClose" size="45%" class="JNPF-common-drawer columnSettings-drawer" append-to-body>
      <div class="JNPF-flex-main">
        <el-scrollbar class="column-list">
            <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
              icon="el-icon-plus" :disabled="dataFormTwo.data.length"
              @click="openSeleceProductDialog()">
              选择产品
            </el-button>
          
          <!-- 人员配置 -->
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-table hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" size="mini" id="table"
              style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
              <el-table-column prop="projectName" label="所属项目" width="120"
                v-if="isProjectSwitch === '1'"></el-table-column>
              <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.productCode" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'" :rules="productRule.productCode">
                    <div class="viewData">
                      <span>{{ scope.row.productCode }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="mainUnit" label="单位" min-width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.mainUnit" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                    <div class="viewData">
                      <span>{{ scope.row.mainUnit }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="qty" label="基本数量" min-width="90">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.qty" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'qty'" :rules="productRule.qty">
                    <div class="viewData">
                      <span>{{ scope.row.qty }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="demandQuantity" label="发料数量" min-width="120">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.demandQuantity" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'demandQuantity'"
                    :rules="productRule.demandQuantity">
                    <div class="viewData">
                      <span>{{ scope.row.demandQuantity }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="issuedQuantity" label="已出库数量" min-width="120">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.issuedQuantity" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'issuedQuantity'"
                    :rules="productRule.issuedQuantity">
                    <div class="viewData">
                      <span>{{ scope.row.issuedQuantity }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="120">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.undeliveredQuantity" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'undeliveredQuantity'"
                    :rules="productRule.undeliveredQuantity">
                    <div class="viewData">
                      <span>{{ scope.row.undeliveredQuantity }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" :width="$store.getters.configData.product.enable_symbol ? 220 : 180" fixed="right" :key="15">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-scrollbar>
        <div class="footer">
          <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="submitForm('dataForm')" v-if="type != 'look' ? true : false">
            {{ $t('common.confirmButton') }}
          </el-button>
        </div>
      </div>
    </el-drawer>
                <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品"
              treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
              :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" :multiple="false"
              :rowDblclick="true" />
  </div>
</template>

<script>
import formValidate from '@/utils/formValidate'
import getProjectList from '@/mixins/generator/getProjectList'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import tenantMinix from "@/mixins/generator/TenantMinix";

export default {
  components: {},
  mixins: [getProjectList,tenantMinix],

  data() {
    return {
      getProductList,
         ProductMethodArr: [
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: {
            classAttribute: '',
            type: 'material'
          }
        }
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: '',
        productCategoryId: '',
        code: '',
        name: '',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        productStatus: 'enable',
        productSource: '',
        pageNum: 1,
        pageSize: 20
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'projectName', label: '所属项目', sortable: 'custom',render:false },
        { prop: 'code', label: '产品编码', sortable: 'custom' },
        { prop: 'name', label: '产品名称', sortable: 'custom',render:false },
        { prop: 'drawingNo', label: '品名规格', sortable: 'custom' },
        { prop: 'productCategoryName', label: '产品分类', sortable: 'custom2' },
        { prop: 'mainUnit', label: '单位', width: 60 },
        { prop: 'createTime', label: '创建日期', sortable: 'custom', width: 180 }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },

      ], // 产品选择弹出框搜索条件
      isProjectSwitch: '',
      tableDataFlag: false,
      types: '',
      drawer: false,
      direction: 'rtl',
      row:{},
      type: '',
      activeName: 'personnel',
      dataFormTwo: {
        data: []
      },
      productRule: {
        demandQuantity1: [
          { required: true, validator: this.checktaxDemandQuantity1(), trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('发料数量：' + errMsg)
                }
              ]
            }),
            trigger: ['blur']
          }
          // { validator: this.checktaxDemandQuantity1() , trigger: ['blur']},
        ]
      }
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')

  },
  methods: {
    handleDel(data) {
      this.dataFormTwo.data.splice(data.$index, 1)
    },
        // 产品组件回调
    addth(id, data) {
      console.log(id,data);
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productCategoryName:item.productCategoryName,
            projectName: item.projectName, // 所属项目
            projectId: item.projectId, // 所属项目
            productSource: item.productSource, // 产品来源 采购
            classAttribute: item.classAttribute,
            productsId: item.id, // 产品id
            productName: item.name, // 产品名称
            productCode: item.code, // 产品编码
            productDrawingNo: item.drawingNo, // 品名规格
            ratio: item.ratio, // 转换系数
            calculationDirection: item.calculationDirection, // 计算方向
            mainUnit: item.mainUnit, // 主单位
            price: item.price, // 含税单价
            totalAmount: item.totalAmount, // 金额(含税)
            taxRate: 13, // 税率
            deputyUnit: item.deputyUnit, // 副单位
            remark: item.remark,
            issuedQuantity:0,
            undeliveredQuantity:0,
            qty:1,
            demandQuantity:this.row.purchaseQuantity*1
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productDrawingNo)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          })
        }
   
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]

        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
    },
        // 产品弹窗
    openSeleceProductDialog() {
      this.ProductTableSearchList = [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
      ]
      if (this.$store.getters.configData.product.enable_productName) {
      this.ProductTableItems.forEach(tc=>{
        if (tc.prop === 'name') {
          tc.render = true
        }
      })
      let index = this.ProductTableSearchList.findIndex((obj) => obj.prop === 'productCode')
      this.ProductTableSearchList.splice(index+1, 0, { prop: 'productName', label: '产品名称', type: 'input' })
      }
      if (this.abProjectSwitchVisible) {
        this.ProductTableItems.forEach(tc=>{
          if (tc.prop === 'projectName') {
            tc.render = true
          }
        })
        this.ProductTableSearchList.unshift({ prop: 'projectId', label: '所属项目', type: 'select',options:this.abProjectNoCommonList })
        this.ProductListRequestObj.projectId = this.abIsCommonUser ? '' : this.abProjectId
      }
      console.log("this.isXBN",this.isXBN);
      this.$refs['ComSelect-page'].openDialog()
      // this.productVisibled = true
      // this.$nextTick(() => {
      //   this.$refs.productRef.initData2()
      // })
    },
 
   
    // 校验发料数量
    checktaxDemandQuantity1() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：发料数量不能为空`
        if (!value) {
          this.$message.error(msg)
          callback(new Error(msg))
        } else {
          callback()
        }
      }
    },
    init(data, row) {
      console.log(data, '资源')
      // this.dataForm = data
      this.row = row

      console.log(this.row)
      this.dataFormTwo.data = JSON.parse(JSON.stringify(data))
    
      console.log(this.dataFormTwo.data)
      this.drawer = true
    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },

    handleClose(done) {
      this.drawer = false
    },
    async submitForm() {
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          let sourceData = []
          this.dataFormTwo.data.forEach((item) => {
            sourceData.push({
              outShipmentListId: item.id,
              calculationDirection: item.calculationDirection,
              demandQuantity: item.demandQuantity,
              deputyUnit: item.deputyUnit,
              mainUnit: item.mainUnit,
              productsId: item.productsId,
              productName: item.productName, // 产品名称
              productCode: item.productCode, // 产品编码
              productDrawingNo: item.productDrawingNo, // 品名规格
              qty: item.qty,
              ratio: item.ratio,
              routingLineId: item.routingLineId,
              shipmentType: 'out_orders',
              issuedQuantity:item.issuedQuantity,
              undeliveredQuantity:item.undeliveredQuantity,
              projectName:item.projectName,
              projectId:item.projectId,

            })
          })
          console.log('sourceData', sourceData)
          this.$emit('confirm', sourceData)
          this.$message.success('配置成功')
          this.drawer = false
        }
      })
    }
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
    /* margin: 20px 20px 20px;
  display: flex;
  justify-content: flex-end; */
    position: fixed;
    bottom: 10px;
    right: 10px;
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
.submit {
  position: absolute;
  bottom: 20px;
  left: 50%;
}

.columnSettings-drawer {
  font-size: 16px;
}



::v-deep .is-stretch {
  display: block !important;
}

.el-tabs__nav.is-stretch /deep/ {
  min-width: none !important;
  display: flex;
  justify-content: flex-start;
}

.custom-tab-pane .el-tab-pane__content {
  width: 500px;
}

.el-tabs__active-bar /deep/ {
  width: 60px !important;
}

.el-tabs__header {
  max-width: 316px !important;
}

::v-deep .el-tabs__content {
  padding: 0px 10px !important;
}

::v-deep .el-tab-pane {
  height: 83vh !important;
}

.required {
  color: red;
  margin-right: 4px;
}

/* ::v-deep .el-table__body-wrapper.is-scrolling-none {
  min-height: 685px !important;

} */
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
