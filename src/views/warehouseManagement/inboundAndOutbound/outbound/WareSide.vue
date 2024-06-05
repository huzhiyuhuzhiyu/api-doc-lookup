<template>
  <el-drawer title="货位设置" :visible.sync="drawerVisible" :wrapperClosable="false" size="50%" append-to-body
    class="JNPF-common-drawer columnSettings-drawer">
    <div class="JNPF-flex-main">
      <el-scrollbar class="column-list" v-loading="loading">

        <TableForm-ware :value="linesList" @input="contentChanges" ref="linesForm" :tableItems="linesListItems"
          :openMode="openMode" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem"
          :num="scope.row ? scope.row.num ? scope.row.num : 0 : 0" :nowNum="nowNum" @autoDistribute="autoDistribute"
          :dialogRequestObj="dialogRequestObj" />

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
import { autoDistribute, transferAutoDistribute } from "@/api/warehouseManagement/inboundAndOutbound"
import { lineStockBoxBarcode } from '@/api/warehouseManagement/packingList' // 根据产品id获取装箱条码

export default {
  components: { TableFormWare },
  props: {
    openMode: {
      type: String,
      default: '新建'
    },
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
      boxStatus: "received",
      productId: '',
      routingLineId: ''
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
        { prop: "warehouseName", label: "仓库名称", value: "", type: 'view', minWidth: 120 },
        { prop: "shelfSpaceName", label: "货位名称", value: "", type: 'view', minWidth: 120 },
        { prop: "batchNumber", label: "批次号", value: "", type: "view", minWidth: 180 },
        {
          prop: "barCodeList", label: "装箱条码", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "blur" }], minWidth: 230,
          multiple: true, tagMultipleLine: true, ids: this.getBarCodeIds, collapseTags: false, renderTree: false, dialogTitle: '选择装箱条码', searchList: [{ prop: 'barCode', label: '条码', type: "input" }],
          tableItems: [
            { prop: 'barCode', label: '装箱条码', minWidth: 200 },
            { prop: 'standardBoxName', label: '标准箱' },
            { prop: 'realityTotalNum', label: '包含产品数量', minWidth: 120 },
            { prop: 'standardBoxVolume', label: '单位体积(m³)', minWidth: 150 },
            { prop: 'createByName', label: '创建人' },
            { prop: 'createTime', label: '创建时间', width: 180 },
          ],
          listRequestObj: (rowIndex) => { return { ...this.barCodeListRequestObj, shelfSpaceId: this.linesList[rowIndex].shelfSpaceId } },
          change: this.barCodeListChange,
          listDataFormatting: (res) => {
            if (!res.data.records.length) this.$message.warning('该库位上未找到对应产品！')
            return res.data.records.map(item => {
              return { ...item, name: item.barCode }
            })
          },
          listMethod: lineStockBoxBarcode, render: this.$parent.dataForm.sourceType !== 'outbound_scrap'
        },
        // { prop: "num", label: "库存数量", value: 0, type: "view", minWidth: 120, render: this.$parent.dataForm.sourceType !== 'outbound_scrap' },
        { prop: "boxPackingNum", label: "装箱数量", value: 0, type: "view", minWidth: 120, render: this.openMode !== '只读' && this.$parent.dataForm.sourceType !== 'outbound_scrap' },
        { prop: "availableQuantity", label: "总可用数量", value: "", type: 'view', minWidth: 120, render: this.openMode !== '只读' },
        {
          prop: "num", label: "出库数量", value: 0, type: "input",
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex, value) => {
                    if (this.$parent.dataForm.sourceType === 'outbound_scrap') return true
                    return Number(value) <= Number(this.linesList[rowIndex].boxPackingNum)
                  },
                  "出库不能超过对应装箱数量",
                  (errMsg, index) => { this.$message.error(`库位信息第${index + 1}行：${errMsg}`) }]
              }), trigger: 'blur'
            }
          ], minWidth: 120, itemDisabled: this.openMode === '只读' || this.$parent.dataForm.sourceType !== 'io_other'
        },
        { prop: "mainUnit", label: "单位", value: "", type: 'view', minWidth: 80 },
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
    },
    dialogRequestObj() {
      let productsId = this.scope.row ? this.scope.row.productsId : ""
      let routingLineId = this.scope.row ? this.scope.row.routingLineId : ""
      return { productsId, routingLineId, warehouseType: 'normal' }
    }
  },
  methods: {
    barCodeListChange(val, data, paramsObj) {
      console.log('选择的数据：', val, data, paramsObj);
      const index = paramsObj.scope.$index
      if (!data || !data.length) {
        this.linesList[index].barCodeIds = []
        this.linesList[index].barCodeList = []
        this.linesList[index].boxPackingNum = 0
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
            o.all.boxPackingNum = o.all.realityTotalNum
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
            totalNum = this.jnpf.math('add', [totalNum, temp.boxPackingNum || temp.realityTotalNum || 0])
          }
        })
        this.linesList[index].boxPackingNum = totalNum

        // 智能设置出库数量
        if (this.$parent.dataForm.sourceType !== 'io_other') this.linesList[index].num = totalNum
        else {
          this.linesList[index].num = 0
          this.$nextTick(() => {
            if (this.nowNum == '0') { }
            else if (this.linesList[index].boxPackingNum > this.nowNum) this.linesList[index].num = this.nowNum
            else this.linesList[index].num = totalNum
          });
        }

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
    getBarCodeIds(paramsObj) {
      return paramsObj.scope.row.barCodeIds || []
    },
    autoDistribute() {
      this.loading = true
      if (this.scope.row.num != 0) {
        let scrapFlag = this.$parent.dataForm.sourceType === 'outbound_scrap'
        let autoDistributeMethod = scrapFlag ? transferAutoDistribute : autoDistribute
        let requestObj = {
          num: this.scope.row.num,
          productsId: this.scope.row.productsId,
          routingLineId: this.scope.row.routingLineId
        }
        if (scrapFlag) requestObj = { model: requestObj, warehouseType: 'scrap' }
        autoDistributeMethod(requestObj).then(res => {
          this.linesList = []
          this.addOrDelLinesItem(res.data.lines, 'auto')
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    init(scope, spaceLines, btnType) {
      this.loading = true
      this.drawerVisible = true
      this.scope = scope
      this.barCodeListRequestObj.productId = scope.row.productsId;
      this.barCodeListRequestObj.routingLineId = scope.row.routingLineId || -1;
      this.linesList = spaceLines
      this.linesList.forEach(line => {
        if (line.boxList) { // 按箱出库时
          line.barCodeIds = line.boxList.map(box => box.name)
          line.barCodeList = line.boxList.map(box => box.name)
        }
      })
      if (!scope.row.allocated && !btnType) {
        // 首次打开自动分配出库货位
        this.autoDistribute()
      } else {
        this.loading = false
      }
      this.refreshStyle()
    },
    async saveSettings() {
      this.btnLoading = true
      let submitFlag = true

      if (this.nowNum != 0 && submitFlag) {
        this.$message.error('库存分配数量与总数量不匹配')
        submitFlag = false
      }

      // 表单校验
      if (submitFlag) {
        let form_2 = this.$refs.linesForm.$refs.main
        let valid_2 = await form_2.validate().catch(err => false)
        if (!valid_2 && submitFlag) {
          submitFlag = false
          let formItems = form_2.fields
          formItems.some(formItem => {
            if (formItem.validateState === 'error') {
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              return true
            }
          });
        }
      }

      // if (submitFlag) {
      //   let targetIndex = this.linesList.findIndex(line => this.jnpf.math('add', [line.occupyAvailableQuantity, line.availableQuantity]) < Number(line.num))
      //   if (targetIndex !== -1) {
      //     this.$message.error(`库位信息第${targetIndex + 1}行：出库数量不能超过其占用数量+总可用数量`)
      //     submitFlag = false
      //   }
      // }

      if (submitFlag) {
        let effective = this.linesList.filter(line => line.num != 0)
        let invalidList = []
        // 箱子与数量处理
        effective.forEach(line => {
          // 从line.boxList中取出足够line.num的值
          let realNum = line.num
          line.boxList.forEach(box => {
            if (realNum) {
              box.effectFlag = true // 标记箱子被使用了
              if (Number(box.realityTotalNum) >= realNum) {
                box.realityTotalNum = realNum
                realNum = 0
              } else {
                realNum = this.jnpf.math('subtract', [realNum, box.realityTotalNum])
              }
            }
          })
          // 过滤库位没有使用到的条码箱，放到一个数组
          let targetList = line.boxList.filter(box => !box.effectFlag)
          if (targetList.length) {
            invalidList.push({
              shelfSpaceName: line.shelfSpaceName,
              batchNumber: line.batchNumber,
              invalidBoxList: targetList
            })
          }
        })
        let flag = true
        if (invalidList.length) {
          const h = this.$createElement;
          let tempList = [h('h3', { fontSize: '16px' }, `以下条码箱内产品未被使用，保存后条码箱将被过滤：`), h('br', null, '')]
          invalidList.forEach(line => {
            tempList.push(h('h3', { fontSize: '16px' }, `库位：${line.shelfSpaceName} - 批次：${line.batchNumber}`))
            line.invalidBoxList.forEach(box => {
              tempList.push(h('i', { fontSize: '16px' }, `${box.barCode}`))
              tempList.push(h('br', null, ''))
            })
          })
          flag = await this.$msgbox({
            title: '提示',
            message: h('div', null, tempList),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).catch(err => this.btnLoading = false)
        }
        if (flag) {
          // 过滤effective中没有使用到的箱子
          effective.forEach(line => {
            line.boxList = line.boxList.filter(box => box.effectFlag)
            line.barCodeIds = line.boxList.map(box => box.id)
            line.barCodeList = line.boxList.map(box => box.barCode)
            line.boxPackingNum = 0
            line.boxList.forEach(box => {
              line.boxPackingNum = this.jnpf.math('add', [line.boxPackingNum, box.boxPackingNum])
            })
          })

          // 非报废入库，过滤空箱
          if (this.$parent.dataForm.sourceType !== 'outbound_scrap') effective = effective.filter(line => line.boxList.length)

          this.$emit('markAllocated', this.scope); // 标记此行库位明细点击过保存，不再默认自动分配
          this.$emit('confirm', effective, this.scope)
        }
      } else {
        this.btnLoading = false
      }
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data, addType) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') { this.linesList.splice(data.$index, 1) }
      else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        // 设置参数（这里区分手动选择和自动分配两种情况）
        if (addType === 'auto') { tempList = data ? data.map(item => { return { ...item, num: this.$parent.dataForm.sourceType === 'outbound_scrap' ? item.num : 0, boxList: [] } }) : data }
        else {
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            item.num = ""
            item.boxList = []
            const hasFlag = this.linesList.find(i => !i.documentObjId && (item.shelfSpaceId === i.shelfSpaceId && item.batchNumber === i.batchNumber))
            if (hasFlag) { hasItemList.push(item.shelfSpaceName) }
            else { tempList.push(item) }
          }
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