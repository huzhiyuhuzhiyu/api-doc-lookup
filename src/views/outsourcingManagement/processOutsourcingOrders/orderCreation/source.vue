<template>
  <div>
    <el-drawer title="发料清单" :visible.sync="drawer" :direction="direction" :wrapperClosable="false" append-to-body
      :before-close="handleClose" size="45%" columnSettings-drawer class="JNPF-common-drawer">
      <div ref="main">
        <el-scrollbar style="height: 100%;">
          <div v-if="!transferOutFlag">
            <el-button type="text" class="topButton" icon="el-icon-plus" @click="openProductDialog('product')">
              选择产品
            </el-button>
            |
            <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
            |
          </div>
          <!-- 人员配置 -->
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <JNPF-table hasNO fixedNO :hasC="!transferOutFlag" v-bind="dataFormTwo.data" :data="dataFormTwo.data" size="mini" id="table"
              :style="{ height: height + 'px' }" ref="sourceTable" @selection-change="handeleProductInfoData">
              <!-- <el-table-column type="index" width="60" label="序号" align="center" fixed="left" /> -->
              <el-table-column prop="projectName" label="所属项目" width="120"
                v-if="isProjectSwitch === '1'"></el-table-column>
              <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                    <div class="viewData">
                      <span>{{ scope.row.drawingNo }}</span>
                    </div>
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
                    <ComSelect-page clearable :isdisabled="type === 'look' || transferOutFlag" :treeNodeClick="treeNodeProcessClick"
                      v-model="scope.row.processName" @change="onOrganizeChangeTwo" :tableItems="ProcessTableItems"
                      :placeholder="'工序名称'" title="选择工序" treeTitle="工序分类" :methodArr="ProcessMethodArr"
                      :listMethod="getBimProcessList" :listRequestObj="ProcessListRequestObj" :paramsObj="{ scope }"
                      :searchList="ProcessTableSearchList" />
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="mainUnit" label="单位" width="60" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                    <div class="viewData">
                      <span>{{ scope.row.mainUnit }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="demandQuantity" label="发料数量" width="120">
                <template slot="header">
                  <span class="required">*</span>
                  发料数量
                </template>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.demandQuantity1" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'demandQuantity'" :rules="productRule.demandQuantity1">
                    <el-input v-model="scope.row.demandQuantity" :disabled="type === 'look' || transferOutFlag" maxlength="20"
                      placeholder="发料数量"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" width="60" fixed="right" v-if="!transferOutFlag">
                <template slot-scope="scope">
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
          <el-button type="primary" @click="submitForm('dataForm')" v-if="type != 'look' ? !transferOutFlag : false">
            {{ $t('common.confirmButton') }}
          </el-button>
        </div>
      </div>
    </el-drawer>
    <ComSelect-page v-if="sourceComSelectPageFlag" :treeNodeClick="treeNodeClick" ref="sourceComSelectPage" @change="addth" :tableItems="ProductTableItems"
      :placeholder="'请选择产品'" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
      :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList"
      :listDataFormatting="listDataFormatting" multiple />
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
   props:{
      transferOutFlag:{
          type: Boolean,
          default: false
      }
  },
  data() {
    return {
      sourceComSelectPageFlag: false,
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
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: { classAttribute: '', type: 'material' }
        }
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
        { prop: 'code', label: '产品编码' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'classAttributeName', label: '类别属性' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' }

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
        { prop: 'code', label: '工序编码' }

        // { prop: 'nameEn', label: '英文名称' },
        // { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      ProcessTableSearchList: [
        { prop: 'name', label: '工序名称', type: 'input' },
        { prop: 'code', label: '工序编码', type: 'input' }
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
        processName: [{ required: true, trigger: ['blur'] }],
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
      let codeIndex = this.ProductTableItems.findIndex(obj => obj.prop === 'code');
      this.ProductTableItems.splice(codeIndex + 1, 0, { prop: 'projectName', label: '所属项目' })
    } else {

    }
    if (this.isProjectSwitch === '1') {
      let drawingNoIndex = this.ProductTableItems.findIndex(obj => obj.prop === 'drawingNo');
      this.ProductTableItems.splice(drawingNoIndex + 1, 0, { prop: 'name', label: '产品名称' })
    } else {

    }
  },
  methods: {
    //自适应窗口
    async switchStyle() {
      await this.$nextTick()
      console.log(this.$refs.main, 'this.$refs.main')
      let allHeight = this.$refs.main.clientHeight
      console.log(allHeight, 'allHeight')
      // let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      // let Heightradio = this.$refs.radio.clientHeight
      this.height = allHeight - 700 < 700 ? 700 : allHeight - 425
      console.log(this.height, 'this.height')
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100)
      }
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
        drawingNo: '',
        processName: '',
        demandQuantity1: this.purchaseQuantity
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
    openProductDialog() {
      this.ProductListRequestObj.routingId = ''
      this.ProductListRequestObj.queryType = ''
      this.sourceComSelectPageFlag = true
      this.$refs['sourceComSelectPage'].openDialog()
    },
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
    addth(id, data) {
      console.log(data)
      let selectArr = []

      if (data.length) {
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productName: item.name,
            productsId: item.id, // 产品id
            productCode: item.code,
            projectName: item.projectName,
            drawingNo: item.drawingNo,
            routingName: item.routingName,
            routingId: item.routingId,
            processName: item.processName,
            processId: item.processId,
            mainUnit: item.mainUnit,
            demandQuantity: '',
            calculationDirection: item.calculationDirection,
            ratio: item.ratio,
            routingLineId: item.routingLineId
          })
        })
      }

      console.log(selectArr, '选中')
      console.log(this.dataFormTwo.data, '列表')
      if (this.dataFormTwo.data.length) {
        const deletedArray = []
        const deletedArray2 = []
        selectArr = selectArr.filter((item1) => {
          if (!item1.processId) {
            const index = this.dataFormTwo.data.findIndex(
              (item2) => item2.productsId === item1.productsId && item1.processId === item2.processId
            )
            if (index !== -1) {
              deletedArray.push(item1.productName)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          } else {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.processId === item1.processId)
            if (index !== -1) {
              deletedArray2.push(item1.processName)
              if (deletedArray2.length) {
                this.$message.error(`已经添加过的工序产品：${deletedArray2.join('、')}`)
              }
              return false
            }
            return true
          }
        })
        console.log(data, '删除后的数据')
        console.log(deletedArray, '被删掉的数据')
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
      this.calcHeight()
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
              demandQuantity: item.demandQuantity,
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
          this.sourceComSelectPageFlag = false
          this.$emit('confirm', sourceData)
          this.$message.success('配置成功')
          this.drawer = false
        }
      })
    }
  },
  updated() {
    this.$refs['sourceTable'].doLayout()
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
    text-align: center;
    padding: 10%;
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
