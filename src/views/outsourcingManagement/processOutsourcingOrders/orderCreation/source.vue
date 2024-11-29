<template>
  <div>
    <el-drawer title="发料清单" :visible.sync="drawer" :direction="direction" :wrapperClosable="false" append-to-body
      :before-close="handleClose" size="45%" columnSettings-drawer class="JNPF-common-drawer">
      <div ref="main">
        <el-scrollbar style="height: 100%;">
          <!-- 人员配置 -->
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <JNPF-table hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" size="mini" id="table"
              :style="{ height: height + 'px' }" ref="sourceTable">
              <!-- <el-table-column type="index" width="60" label="序号" align="center" fixed="left" /> -->
              <el-table-column prop="projectName" label="所属项目" width="120"
                v-if="isProjectSwitch === '1'"></el-table-column>
              <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">

                    <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                      v-model="scope.row.drawingNo" ref="ComSelect-page" @change="productChange"
                      :tableItems="ProductTableItems" :placeholder="'请选择产品'" title="选择产品" treeTitle="产品分类"
                      :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                      :paramsObj="{ scope }" :searchList="ProductTableSearchList"
                      :listDataFormatting="listDataFormatting" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="productCode" label="产品编码" width="130" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.productCode" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'" :rules="productRule.productCode">

                    <div class="viewData">
                      <span>{{ scope.row.productCode }}</span>
                    </div>

                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="processName" label="工序名称" width="135" show-overflow-tooltip>

                <template slot-scope="scope">
                  <el-form-item>
                    <!-- 工序选择弹窗  -->
                    <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeProcessClick"
                      v-model="scope.row.processName" ref="ComSelect-page" @change="onOrganizeChangeTwo"
                      :tableItems="ProcessTableItems" :placeholder="'工序名称'" title="选择工序" treeTitle="工序分类"
                      :methodArr="ProcessMethodArr" :listMethod="getBimProcessList"
                      :listRequestObj="ProcessListRequestObj" :paramsObj="{ scope }"
                      :searchList="ProcessTableSearchList" />
                  </el-form-item>
                </template>
              </el-table-column>



              <el-table-column prop="mainUnit" label="单位" width="60" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.mainUnit" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                    <!-- <el-input v-model="scope.row.mainUnit" :disabled="type === 'look'" maxlength="20" placeholder="请输入基本数量">
                    </el-input> -->
                    <div class="viewData">
                      <span>{{ scope.row.mainUnit }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="qty" label="发料数量" width="120">
                <template slot="header">
                  <span class="required">*</span>
                  发料数量
                </template>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.demandQuantity1" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'qty'" :rules="productRule.demandQuantity1">
                    <el-input v-model="scope.row.qty" :disabled="type === 'look'" maxlength="20"
                      placeholder="发料数量"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" width="110">
                <template slot-scope="scope">
                  <el-button type="text" v-if="type != 'look'" :disabled="type === 'look'" style="color:#606266"
                    @click="handlerAdd(scope.$index, 'personnel')">
                    添加
                  </el-button>
                  <el-button type="text" v-if="type != 'look'" :disabled="type === 'look'"
                    style="color:rgb(245,108,108)" @click="handlerDelete(scope.$index, 'personnel')">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </JNPF-table>
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
  </div>
</template>

<script>
import formValidate from '@/utils/formValidate'
import { getBimProcessList } from '@/api/bimProcess/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: {},
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      height: 700,
      classAttributeList: [],
      types: '',
      drawer: false,
      direction: 'rtl',
      type: '',
      activeName: 'personnel',
      // 产品
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: '产品分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '', type: 'material' } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: '',
        classAttributeList: ['raw_material', 'semi_finished', 'finish_product', 'accessories'],
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
        // productSource: 'out',
        pageNum: 1,
        pageSize: 20
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'code', label: '产品编码' },
        // { prop: 'name', label: '产品名称', fixed: 'left' },

        // { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeName', label: '类别属性' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' },
        // { prop: "name", label: "产品名称", type: 'input', },

      ], // 产品选择弹出框搜索条件
      // 工序
      getBimProcessList,
      getcategoryTree,
      //  供应商 树请求
      ProcessMethodArr: { method: getcategoryTree, requestObj: { type: 'process' } },
      // 供应商 列表
      ProcessTableItems: [
        { prop: 'name', label: '工序名称' },
        { prop: 'code', label: '工序编码' },

        // { prop: 'nameEn', label: '英文名称' },
        // { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      ProcessTableSearchList: [
        { prop: 'name', label: '工序名称', type: 'input' },
        { prop: 'code', label: '工序编码', type: 'input' },
      ],
      // 供应商请求参数
      ProcessListRequestObj: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20
      },
      dataFormTwo: {
        data: []
      },
      productRule: {
        processName: [
          { required: true, trigger: ['blur'] },
        ],
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
        ]
      }
    }
  },
  mounted() {
    this.switchStyle()
    this.getclassAttributeList()

  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    this.tableDataFlag = true
    console.log(this.isProjectSwitch)
    if (this.isProjectSwitch === '1') {
      this.ProductTableItems = [
        { prop: 'projectName', label: '所属项目' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'code', label: '产品编码' },
        // { prop: 'name', label: '产品名称', fixed: 'left' },

        // { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeName', label: '类别属性' }
      ]
    } else {
      this.ProductTableItems = [
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'code', label: '产品编码' },
        // { prop: 'name', label: '产品名称', fixed: 'left' },

        // { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeName', label: '类别属性' }
      ]
    }

  },
  methods: {
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      console.log(this.$refs.main, 'this.$refs.main')
      let allHeight = this.$refs.main.clientHeight
      console.log(allHeight, 'allHeight')
      // let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      // let Heightradio = this.$refs.radio.clientHeight
      this.height = (allHeight - 700) < 700 ? 700 : (allHeight - 425)
      console.log(this.height, 'this.height')
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        item.classAttributeName = this.$getLabel(this.classAttributeList, item.classAttribute, 'value', 'label')
      })

      return res.data.records
    },
    getclassAttributeList() {
      let obj = {
        pageNum: 1,
        pageSize: 20
      }
      getclassAttributeList(obj).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.code
          }
          arr.push(obj)
        })
        this.classAttributeList = arr
      })
    },
    handlerAdd() {
      this.dataFormTwo.data.push({
        drawingNo: '', processName: '', demandQuantity1: this.purchaseQuantity
      })
      console.log(this.dataFormTwo.data, 'this.dataFormTwo.data')
    },
    handlerDelete(index) {
      this.dataFormTwo.data.splice(index, 1)
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
    init(data, type, parentId, purchaseQuantity) {
      console.log(data, '资源')
      this.parentId = parentId
      this.purchaseQuantity = purchaseQuantity
      if (data.length !== 0) {

      } else {
        data = [{
          drawingNo: '', demandQuantity1: this.purchaseQuantity
        }]
      }
      // this.dataForm = data
      this.type = type
      console.log(this.type)
      console.log(data, 'data')
      this.dataFormTwo.data = JSON.parse(JSON.stringify(data))
      console.log(this.dataFormTwo.data, 'this.dataFormTwo.data')
      if (this.dataFormTwo.data.length) {
        this.dataFormTwo.data.forEach((item, index) => {
          console.log(item, 'p')
          this.$set(this.dataFormTwo.data[index], 'demandQuantity1', item.demandQuantity1)
        })
      }
      console.log(this.dataFormTwo.data, '0003333333333333333')
      this.drawer = true
    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      // listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 弹窗节点的点击
    treeNodeProcessClick(data, node, listQuery) {
      if (listQuery.productCategoryId === data.id) return listQuery
      listQuery.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      return listQuery
    },
    // 选择产品名称的弹框
    productChange(val, data, paramsObj) {
      let index = paramsObj.scope.$index
      if (!data || !data.length) return
      console.log(data)
      console.log(paramsObj, '1111')
      if (data[0].all.id == this.parentId) {
        this.dataFormTwo.data[index].drawingNo = ''
        return this.$message.error('不能选择与产品信息相同的产品')
      }

      console.log(index, '索引')
      if (data.length) {
        this.dataFormTwo.data[index].projectName = data[0].all.projectName
        this.dataFormTwo.data[index].drawingNo = data[0].all.drawingNo
        this.dataFormTwo.data[index].productCode = data[0].all.code
        this.dataFormTwo.data[index].productsId = data[0].all.id
        this.dataFormTwo.data[index].mainUnit = data[0].all.mainUnit
      }

      console.log(this.dataFormTwo, 'this.dataFormTwo')
    },
    // 选择工序的弹框
    onOrganizeChangeTwo(val, data, paramsObj) {
      if (!data || !data.length) return
      console.log(data)
      console.log(paramsObj, '1111')
      let index = paramsObj.scope.$index
      console.log(index, '索引')
      if (data.length) {
        this.dataFormTwo.data[index].processName = data[0].name
        this.dataFormTwo.data[index].processId = data[0].id
      }

      console.log(this.dataFormTwo, 'this.dataFormTwo')
    },

    handleClose(done) {
      this.drawer = false
    },
    async submitForm() {
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          let sourceData = []
          this.dataFormTwo.data.forEach((item) => {
            console.log(item, '=')
            sourceData.push({
              drawingNo: item.drawingNo,
              productCode: item.productCode,
              outShipmentListId: item.id,
              id: item.id,
              processId: item.processId,
              processName: item.processName,
              calculationDirection: item.calculationDirection,
              demandQuantity: item.qty,
              demandQuantity1: item.demandQuantity1,
              deputyUnit: item.deputyUnit,
              mainUnit: item.mainUnit,
              productsId: item.productsId,
              qty: item.qty,
              ratio: item.ratio,
              routingLineId: item.routingLineId,
              shipmentType: 'out_orders'
            })
          })
          console.log('sourceData', sourceData)
          this.$emit('confirm', sourceData)
          this.$message.success('配置成功')
          this.drawer = false
        }
      })
    }
  },
  updated() {
    this.$refs['sourceTable'].doLayout()
  },
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
.submit {
  position: absolute;
  bottom: 20px;
  left: 50%;
}

.columnSettings-drawer {
  font-size: 16px;
}

.footer {
  margin: 20px 20px 20px;
  display: flex;
  justify-content: flex-end;
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
