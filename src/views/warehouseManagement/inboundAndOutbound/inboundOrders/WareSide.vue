<template>
  <el-drawer title="货位设置" :visible.sync="drawerVisible" :wrapperClosable="false" size="40%" append-to-body
    class="JNPF-common-drawer columnSettings-drawer">
    <div class="JNPF-flex-main">
      <el-scrollbar class="column-list" v-loading="loading">

        <TableForm-ware :value="linesList" @input="contentChanges" ref="linesForm" :tableItems="linesListItems"
          :openMode="openMode" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem"
          :num="scope.row ? scope.row.num ? scope.row.num : 0 : 0" :nowNum="nowNum" :warehouseId="warehouseId"
          :scope="scope" />

      </el-scrollbar>
      <div class="footer">
        <el-button @click="drawerVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="btnLoading" type="primary" @click="saveSettings" v-if="openMode !== '只读'">
          {{ $t('common.confirmButton') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import TableFormWare from "./TableForm-ware.vue"
import { lineStockBoxBarcode } from '@/api/warehouseManagement/packingList' // 根据产品id获取装箱条码

export default {
  components: { TableFormWare },
  props: {
    openMode: {
      type: String,
      default: '新建'
    },
    warehouseId: {}
  },

  beforeCreate() {
    this.barCodeListRequestObj = {
      orderItems: [{
        asc: false,
        column: ""
      }, {
        asc: false,
        column: "createTime"
      }],
      barCode: "",
      pageNum: 1,
      pageSize: 20,
      processName: "",
      productCode: "",
      productName: "",
      routingName: "",
      sourceBarCode: "",
      boxStatus: "not_received",
      productId: '',
      routingLineId: '',
      sourceOrderNo: ''
    }
  },
  data() {
    return {
      loading: false,
      drawerVisible: false,
      btnLoading: false,
      list: [],
      scope: {},
      linesListItems: [
        // { prop: "warehouseName", label: "仓库名称", value: "", type: 'view', minWidth: 120, fixed: "" },
        // { prop: "goodsShelvesName", label: "货架名称", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "shelfSpaceName", label: "货位名称", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "residualVolume", label: "货位剩余容量(m³)", value: "", type: "view", minWidth: 160 },
        { // 装箱条码
          prop: "barCodeList", label: "装箱条码", value: "", type: 'custom', customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "blur" }], minWidth: 230,
          multiple: true, tagMultipleLine: true, ids: this.getBarCodeIds, collapseTags: false, renderTree: false, dialogTitle: '选择装箱条码',
          searchList: [{ prop: 'barCode', label: '条码', type: "input" }],
          tableItems: [
            { prop: 'barCode', label: '装箱条码', minWidth: 200 },
            { prop: 'standardBoxName', label: '标准箱' },
            { prop: 'realityTotalNum', label: '包含产品数量', minWidth: 120 },
            { prop: 'standardBoxVolume', label: '单位体积(m³)', minWidth: 150 },
            { prop: 'createByName', label: '创建人' },
            { prop: 'createTime', label: '创建时间', width: 180 },
          ],
          listRequestObj: this.barCodeListRequestObj,
          change: this.barCodeListChange,
          listDataFormatting: (res) => {
            // 判断是否初始搜索条件请求的数据
            let query_1 = JSON.parse(JSON.stringify(res.listQuery));
            let query_2 = JSON.parse(JSON.stringify(this.barCodeListRequestObj));
            delete query_1.pageSize
            delete query_2.pageSize
            const diffFlag = JSON.stringify(query_1) === JSON.stringify(query_2)
            if (!res.data.records.length && diffFlag) this.$message.warning('此产品还未装箱')
            return res.data.records.map(item => {
              return { ...item, name: item.barCode }
            })
          },
          listMethod: lineStockBoxBarcode, render: this.$parent.sourceType.indexOf('scrap') === -1
        },
        { prop: "num", label: "数量", value: "0", type: "view", minWidth: 160, render: this.$parent.sourceType.indexOf('scrap') === -1 },
        {
          prop: "num", label: "数量", value: "", type: "input",
          itemRules: [
            { required: true, trigger: "blur" },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' }
          ], minWidth: 160, render: this.$parent.sourceType.indexOf('scrap') !== -1
        }
      ],
      linesList: [],
    }
  },
  computed: {
    nowNum() {
      let tempNum = 0
      this.linesList.forEach(item => {
        tempNum = this.jnpf.math('add', [tempNum, item.num])
      })
      let newNumber = this.scope.row ? this.jnpf.math('subtract', [this.scope.row.num, tempNum]) : 0
      return this.jnpf.numberFormat(newNumber, 4)
    }
  },
  methods: {
    getBarCodeIds(paramsObj) {
      return paramsObj.scope.row.barCodeIds || []
    },
    init(scope, spaceLines, btnType) {
      this.drawerVisible = true
      this.scope = scope
      this.barCodeListRequestObj.productId = scope.row.productsId;
      this.barCodeListRequestObj.routingLineId = scope.row.routingLineId || -1;
      this.barCodeListRequestObj.sourceOrderNo = this.$parent.dataForm.sourceNo || scope.row.sourceNo

      this.linesList = spaceLines
      this.linesList.forEach(line => {
        line.barCodeIds = line.boxList ? line.boxList.map(box => box.name) : []
        line.barCodeList = line.boxList ? line.boxList.map(box => box.name) : []
      })
      this.refreshStyle()
    },
    barCodeListChange(val, data, paramsObj) {
      const index = paramsObj.scope.$index
      if (!data || !data.length) {
        this.linesList[index].barCodeIds = []
        this.linesList[index].barCodeList = []
        this.linesList[index].num = 0
      } else {
        // 过滤已存在的条码箱
        let repeatBarCode = []
        let tempData = data.reduce((acc, item) => {
          const existingItem = acc.find(i => { return i.name === item.name }); // 对比条码是否相同
          if (!existingItem) {
            acc.push(item);
          } else {
            repeatBarCode.push(item.name)
          }
          return acc;
        }, []);

        // arr1 接收到的数据
        // arr2 操作行外的其他行包含的条码箱
        // arr3 arr1与arr2重复的条码箱
        let arr1 = tempData
        let arr2 = []
        this.linesList.forEach((line, i) => {
          line.boxList.forEach(box => {
            if (i !== index) arr2.push(box)
          })
        })
        let arr3 = arr1.filter(item => arr2.find(o => o.name === item.name));
        arr3.forEach(item => { repeatBarCode.push(item.name) })
        tempData = tempData.filter(item => !(arr3.find(o => o.name === item.name)))

        // 条码箱重复提示
        if (repeatBarCode.length) this.$message.error(`已存在的条码箱：${repeatBarCode.join('、')}`)

        // 数据处理
        tempData.forEach(o => {
          if (o.all) {
            o.all.num = o.all.realityTotalNum
            o.all.unitVolume = o.all.standardBoxVolume
            o.all.shelfSpaceId = this.linesList[index].shelfSpaceId || this.linesList[index].id
          }
        })

        // 计算数量
        let totalNum = 0
        tempData.forEach(o => {
          if (o.all) {
            totalNum = this.jnpf.math('add', [totalNum, o.all.realityTotalNum || 0])
          } else {
            let temp = this.linesList[index].boxList.find(item => item.name === o.name || item.barCode === o.name)
            totalNum = this.jnpf.math('add', [totalNum, temp.num || temp.realityTotalNum || 0])
          }
        })
        this.linesList[index].num = totalNum

        // 组件依赖数据
        this.linesList[index].barCodeIds = tempData.map(o => o.name)
        this.linesList[index].barCodeList = tempData.map(o => o.name)

        // 处理新选择的条码箱
        let temp2 = tempData.map(o => o.all)
        temp2 = temp2.filter(o => o)

        // 合并新旧条码箱
        let tempNames = tempData.map(o => o.name)
        if (!this.linesList[index].boxList) this.linesList[index].boxList = []
        this.linesList[index].boxList = [...this.linesList[index].boxList, ...temp2].reduce((accumulator, currentItem) => {
          if (!accumulator.find(item => item.barCode === currentItem.barCode)) {
            accumulator.push(currentItem);
          }
          return accumulator;
        }, []);
        this.linesList[index].boxList = this.linesList[index].boxList.filter(o => tempNames.includes(o.name))
        this.refreshStyle()
      }
    },
    async saveSettings() {
      this.btnLoading = true
      if (this.nowNum != 0) {
        let errMsg = '库存分配数量与总数量不匹配'
        this.$message.error(errMsg)
        this.btnLoading = false
      } else {
        let submitFlag = true

        let form_1 = this.$refs.linesForm.$refs.main
        let valid_1 = await form_1.validate().catch(err => false)
        if (!valid_1 && submitFlag) {
          let formItems = form_1.fields
          formItems.some(formItem => {
            if (formItem.validateState === 'error') {
              submitFlag = false
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              return true
            }
          });
        }

        if (submitFlag) {
          let effective = this.linesList.filter(line => line.num != 0)
          let scopeRow = this.scope.row
          effective.forEach(line => {
            line.id = ""
            line.productsId = scopeRow.productsId
            line.classAttribute = scopeRow.classAttribute
            line.ratio = scopeRow.ratio
            line.calculationDirection = scopeRow.calculationDirection
            line.mainUnit = scopeRow.mainUnit
            line.deputyUnit = scopeRow.deputyUnit
            line.processName = scopeRow.processName
            line.routingLineId = scopeRow.routingLineId
            line.routingName = scopeRow.routingName
            line.sourceNo = scopeRow.sourceNo
          })
          this.$emit('confirm', effective, this.scope)
        } else {
          this.btnLoading = false
        }

      }
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') { this.linesList.splice(data.$index, 1) }
      else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.locationType === "goods_shelves") break
          // 货架
          item.goodsShelvesId = item.parentId
          item.goodsShelvesName = item.parentName
          // 货位
          item.shelfSpaceId = item.id
          item.shelfSpaceName = item.name
          // 货位剩余容量
          item.residualVolume = item.residualVolume
          item.boxList = []
          const hasFlag = this.linesList.find(i => item.shelfSpaceId === i.shelfSpaceId)
          if (hasFlag) { hasItemList.push(item.name) }
          else { tempList.push(item) }
        }
        if (hasItemList.length) this.$message.error(`已经存在的库位：${hasItemList.join('、')}`)
        this.linesList = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() });
      }
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    // 样式修复
    refreshStyle() {
      this.$nextTick(() => {
        let tempLinesList = JSON.parse(JSON.stringify(this.linesList));
        this.linesList = []
        this.$nextTick(() => {
          this.linesList = tempLinesList
          this.$refs.linesForm.calcHeight()
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.$refs.linesForm.$refs.main.$children[0].doLayout()
            });
          });
        });
      });
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
    margin: 4px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>