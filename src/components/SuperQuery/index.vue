<!-- --- SuperQuery高级查询 使用说明 ---
================================================================
  -- 组件属性/事件/方法 --
  --------------------------------------------------------------
  * 属性
  - show 是否显示
  - columnOptions 查询条件列表
  - partentOrChild 副表需要传字符串child
  - tableRef 指定表格ref，自动生成高级查询条件（如果columnOptions中某项prop与表格列prop相同，则使用此项作为列查询条件）
  * 方法
  - superQuery 提交时触发
  - close 关闭时触发
================================================================
 -->
 <template>
  <el-dialog v-if="visible" title="高级查询" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center superQuery-dialog" lock-scroll width="1000px">
    <div class="superQuery-main" v-loading="loading">
      <template v-if="conditionList.length">
        <div class="matchLogic">
          <span>匹配逻辑：</span>
          <el-select v-model="matchLogic" placeholder="请选择">
            <el-option label="AND(所有条件都要求匹配)" value="AND"></el-option>
            <el-option label="OR(条件中的任意一个匹配)" value="OR"></el-option>
          </el-select>
        </div>
        <div>
          <el-row v-for="(item, index) in conditionList" :key="index" class="condition-list" :gutter="20">
            <el-col :span="6">
              <el-select v-model="item.prop" placeholder="请选择查询字段" @change="onFieldChange($event, item, index)"
                clearable>
                <el-option v-for="item in fieldOptions" :key="item.prop" :label="item.label" :value="item.prop">
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="4">
              <el-select v-model="item.symbol" :placeholder="'请选择' + item.label">
                <el-option v-for="item in item.symbolOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="10">
              <!-- 输入框 -->
              <template v-if="item.type === 'input'">
                <el-input v-model="item.value"
                  v-bind="{ placeholder: `请输入${item.label || ''}`, maxlength: 50, clearable: true }" />
              </template>
              <!-- 下拉选择器 -->
              <template v-else-if="item.type === 'select'">
                <el-select v-model="item.value" v-bind="{ placeholder: `请选择${item.label}`, clearable: true }">
                  <el-option v-for="(o, i) in item.options" :key="i" v-bind="o"></el-option>
                </el-select>
              </template>
              <!-- 日期时间选择器 -->
              <template
                v-else-if="['year', 'month', 'date', 'dates', 'months', 'years', 'week', 'datetime'].includes(item.type)">
                <el-date-picker v-model="item.value" v-bind="{
                  placeholder: `请选择${item.label}`, style: 'width:100%', clearable: true,
                  ...fieldCache[item.prop]
                }">
                </el-date-picker>
              </template>
              <!-- 日期时间选择器（区间） -->
              <template v-else-if="['datetimerange', 'daterange', 'monthrange'].includes(item.type)">
                <el-date-picker v-model="item.value" v-bind="{
                  placeholder: `请选择${item.label}`, style: 'width:100%', clearable: true,
                  defaultTime: ['00:00:00', '23:59:59'],
                  ...fieldCache[item.prop]
                }">
                </el-date-picker>
              </template>
              <!-- 自定义组件 -->
              <template v-else-if="item.type === 'custom'">
                <component :is="item.component" v-model="item.value" style="width:100%"
                  v-on="fieldCache[item.prop].events" v-bind="{
                    placeholder: `请选择${item.label}`, ...fieldCache[item.prop].props,
                    paramsObj: fieldCache[item.prop].props && fieldCache[item.prop].props.paramsObj ?
                      { ...fieldCache[item.prop].props.paramsObj, superQueryConditionIndex: index } : { superQueryConditionIndex: index }
                  }" />
              </template>
              <!-- 默认显示输入框 -->
              <template v-else>
                <el-input v-model="item.value" placeholder="请输入" clearable />
              </template>
            </el-col>
            <el-col :span="4">
              <el-button size="mini" @click="addCondition" icon="el-icon-plus"></el-button>
              <el-button size="mini" @click="delCondition(index)" icon="el-icon-minus"></el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <div class="query-noData" v-else>
        <img src="@/assets/images/query-noData.png" alt="" class="noData-img">
        <div class="noData-txt">
          <span>没有任何查询条件</span>
          <el-divider direction="vertical"></el-divider>
          <el-link type="primary" :underline="false" @click="addCondition">点击新增</el-link>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <div class="footer-options">
        <el-button @click="addPlan" class="add-btn">保存方案</el-button>
        <el-popover width="240" trigger="click" popper-class="plan-popper" ref="planPopper">
          <el-button slot="reference">方案选择<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <div class="plan-list" v-if="planList.length">
            <div class="plan-list-item" v-for="(item, i) in planList" :key="i" @click="selectPlan(item)">
              <el-link :underline="false" class="plan-list-name">{{ item.fullName }}
              </el-link>
              <i class="el-icon-close" @click.stop="delPlan(item.id, i)"></i>
            </div>
          </div>
          <div class="noData-txt" v-else>暂无数据</div>
        </el-popover>
      </div>
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="query()">查 询</el-button>
    </span>
    <el-dialog title="保存方案" :visible.sync="addPlanVisible" width="600px" append-to-body lock-scroll
      class="JNPF-dialog JNPF-dialog_center">
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" label-position="top">
        <el-form-item label="方案名称" prop="fullName">
          <el-input v-model="dataForm.fullName" placeholder="请输入保存的方案名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPlanVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="saveBtnLoading" @click="savePlan()">
          {{ $t('common.confirmButton') }}</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>

import { getAdvancedQueryList, Delete, Create, Update } from "@/api/system/advancedQuery";
import { deepClone } from '@/utils'
import { getWarehouseList } from '@/api/basicData/index' // 仓库

export default {
  props: {
    columnOptions: {
      type: Array,
      default: () => [],
      /* 传参示例
      [
        { // 输入框
          prop: 'name',
          label: '名称',
          type: 'input',
        },
        { // 下拉选
          prop: 'type',
          label: '类型',
          type: 'select',
          options: [{ label: '类型1', value: '1' }, { label: '类型2', value: '2' }]
        },
        { // 日期选择器
          prop: 'date',
          label: '日期',
          type: 'date',
          valueFormat: "yyyy-MM-dd",
          pickerOptions: this.global.timePicker
        },
        { // 日期时间选择器
          prop: 'datetime',
          label: '日期时间',
          type: 'datetime',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          pickerOptions: this.global.timePicker
        },
        { // 日期选择器（区间）
          prop: 'daterange',
          label: '日期区间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        { // 日期时间选择器（区间）
          prop: 'datetimerange',
          label: '日期时间区间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        { // 自定义选择器（选择仓库为例）
          prop: 'warehouseName',
          label: '仓库',
          type: 'custom',
          component: 'ComSelect-list',
          method: getWarehouseList,
          events: { // 监听事件
            change: (val, data, paramsObj) => {
              let conditionItem = this.$refs.SuperQuery.conditionList[paramsObj.superQueryConditionIndex]
              conditionItem.value = data[0].name
              conditionItem.shiftConditionItem = { warehouseId: data[0].id } // 搜索发起时，转换为此搜索条件
            }
          },
          props: { // 继承到自定义组件上的属性
            dialogTitle: '选择仓库',
            method: getWarehouseList,
            requestObj: { chooseUserFlag: true, type: 'normal' },
          },
        }
      ] */
    },
    partentOrChild: { // 副表需要传child
      type: String,
      default: 'partent'
    },
    show: {
      type: Boolean,
      default: false
    },
    tableRef: {
      type: String
    },
  },
  data() {
    return {
      addPlanVisible: false,
      loading: false,
      btnLoading: false,
      saveBtnLoading: false,
      matchLogic: 'AND',
      conditionList: [],
      planList: [],
      fieldOptions: [],
      symbolOptions: [{
        label: '等于',
        value: "==",
        effectType: ['input', 'select', 'date', 'datetime', 'custom']
      }, {
        label: '大于等于',
        value: ">=",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '大于',
        value: ">",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '小于等于',
        value: "<=",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '小于',
        value: "<",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '不等于',
        value: "<>",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '包含',
        value: "like",
        effectType: ['input', 'select', 'custom']
      }, {
        label: '不包含',
        value: "notLike",
        effectType: ['input', 'select', 'custom']
      }, {
        label: '介于',
        value: "between",
        effectType: ['daterange', 'datetimerange']
      }],
      dataForm: {
        fullName: ''
      },
      dataRule: {
        fullName: [
          { required: true, message: '请输入保存的方案名称', trigger: 'blur' }
        ]
      },
      fieldCache: {}, // 属性缓存 用于解决方法无法转为json后存储问题
    }
  },
  computed: {
    currMenuId() {
      return (this.$route.meta.modelId || '') + this.partentOrChild
    },
    visible: {
      get: function () {
        if (this.show) this.init()
        return this.show
      },
      set: function (val) {
        if (val === false) this.$emit('close')
      }
    }
  },
  methods: {
    async init() {
      this.loading = true
      let columnOptions = this.columnOptions

      if (this.tableRef) { // 读取表格ref列，自动生成高级查询条件
        columnOptions = this.$parent.$refs[this.tableRef].columnList.map(column => {
          let props = { type: 'input' }
          if (this.columnOptions.some(item => item.prop === column.prop)) {
            props = this.columnOptions.find(item => item.prop === column.prop)
          } else if (column.label.endsWith('日期')) {
            props = {
              type: 'daterange',
              valueFormat: "yyyy-MM-dd",
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              pickerOptions: this.global.timePickerOptions
            }
          } else if (column.label.endsWith('时间')) {
            props = {
              type: 'datetimerange',
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间',
              pickerOptions: this.global.timePickerOptions
            }
          }
          return {
            ...column,
            ...props,
          }
        })
      }

      if (!this.conditionList.length) {
        this.conditionList = [{
          prop: '',
          value: '',
          symbol: '==',
          type: 'input',
          symbolOptions: this.symbolOptions.filter(symbolOption => symbolOption.effectType.includes('input'))
        }]
      }
      let componentList = deepClone(columnOptions)
      let demoFieldOptions = [
        // { // 下拉选
        //   prop: 'type',
        //   label: '示例：类型',
        //   type: 'select',
        //   options: [{ label: '类型1', value: '1' }, { label: '类型2', value: '2' }]
        // },
        // { // 日期选择器
        //   prop: 'date',
        //   label: '示例：日期',
        //   type: 'date',
        //   valueFormat: "yyyy-MM-dd",
        //   pickerOptions: this.global.timePicker
        // },
        // { // 日期时间选择器
        //   prop: 'datetime',
        //   label: '示例：日期时间',
        //   type: 'datetime',
        //   valueFormat: "yyyy-MM-dd HH:mm:ss",
        //   pickerOptions: this.global.timePicker
        // },
        // { // 日期选择器（区间）
        //   prop: 'daterange',
        //   label: '示例：日期区间',
        //   type: 'daterange',
        //   valueFormat: "yyyy-MM-dd",
        //   startPlaceholder: '开始日期',
        //   endPlaceholder: '结束日期',
        //   pickerOptions: this.global.timePickerOptions
        // },
        // { // 日期时间选择器（区间）
        //   prop: 'datetimerange',
        //   label: '示例：日期时间区间',
        //   type: 'datetimerange',
        //   valueFormat: "yyyy-MM-dd HH:mm:ss",
        //   startPlaceholder: '开始时间',
        //   endPlaceholder: '结束时间',
        //   pickerOptions: this.global.timePickerOptions
        // },
        // { // 自定义选择器（选择仓库为例）
        //   prop: 'warehouseName',
        //   label: '示例：选择自定义数据-仓库',
        //   type: 'custom',
        //   component: 'ComSelect-list',
        //   method: getWarehouseList,
        //   events: { // 监听事件
        //     change: (val, data, paramsObj) => {
        //       let conditionItem = this.conditionList[paramsObj.superQueryConditionIndex]
        //       conditionItem.value = data[0].name
        //       conditionItem.shiftConditionItem = { warehouseId: data[0].id } // 搜索发起时，转换为此搜索条件
        //     }
        //   },
        //   props: { // 继承到自定义组件上的属性
        //     dialogTitle: '选择仓库',
        //     method: getWarehouseList,
        //     requestObj: { chooseUserFlag: true, type: 'normal' },
        //   },
        // }
      ]
      this.fieldOptions = componentList.concat(demoFieldOptions)
      // 寄存属性
      this.fieldCache = this.fieldOptions.reduce((result, item) => {
        result[item.prop] = item
        return result
      }, {})
      let res = await getAdvancedQueryList(this.currMenuId).catch(err => false)
      if (res) this.planList = res.data.list
      this.loading = false
    },
    getAdvancedQueryList() {
      if (!this.currMenuId) return
      getAdvancedQueryList(this.currMenuId).then(res => {
        this.planList = res.data.list
      })
    },
    onFieldChange(val, item, i) {
      if (!val) {
        item.value = ''
        item.type = 'input'
        item.symbol = '=='
        item.label = ''
        item.symbolOptions = this.symbolOptions.filter(symbolOption => symbolOption.effectType.includes('input'))
        return
      }
      let _item = this.fieldOptions.find(item2 => item2.prop === item.prop)
      item.type = _item.type
      item.symbolOptions = this.symbolOptions.filter(symbolOption => symbolOption.effectType.includes(item.type))
      item.symbol = item.symbolOptions[0].value
      item.value = null
      this.$set(this.conditionList, i, { ...item, ..._item })
    },
    addCondition() {
      let item = {
        prop: '',
        value: '',
        symbol: '==',
        type: 'input',
        symbolOptions: this.symbolOptions.filter(symbolOption => symbolOption.effectType.includes('input'))
      }
      this.conditionList.push(item)
    },
    delCondition(index) {
      this.conditionList.splice(index, 1)
    },
    delPlan(id, i) {
      Delete(id).then(res => {
        this.$message({
          type: 'success',
          message: res.msg,
          duration: 1500,
          onClose: () => {
            this.planList.splice(i, 1)
            this.$emit('saveproject')
          }
        })
      })
    },
    selectPlan(item) {
      this.matchLogic = item.matchLogic
      let tempConditionList = item.conditionJson ? JSON.parse(item.conditionJson) : []
      tempConditionList.forEach(condition => {
        condition.symbolOptions = this.symbolOptions.filter(symbolOption => symbolOption.effectType.includes(condition.type))
      })
      // 这里需要有解析方法名称的解决方案
      this.conditionList = tempConditionList
      console.log(tempConditionList);
      this.$refs.planPopper.doClose()
    },
    addPlan() {
      if (!this.exist()) return
      this.addPlanVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    savePlan() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let boo = this.planList.some(o => o.fullName === this.dataForm.fullName)
          if (!boo) return this.submit()
          let list = this.planList.filter(o => o.fullName === this.dataForm.fullName)
          this.$confirm(`${list[0].fullName}已存在, 是否覆盖方案?`, '', {
            type: 'warning'
          }).then(() => {
            this.submit(list[0].id)
          }).catch(() => { });
        }
      })
    },
    submit(id) {
      let saveConditionList = this.conditionList.map(item => {
        let obj = {
          prop: item.prop,
          value: item.value,
          symbol: item.symbol,
          type: item.type,
          options: item.options
        }
        // 这里需要有保存方法名称的解决方案
        if (item.type === 'custom') obj = { ...obj, ...item }
        return obj
      })
      this.saveBtnLoading = true
      let query = {
        id: id || '',
        ...this.dataForm,
        matchLogic: this.matchLogic,
        moduleId: this.currMenuId,
        conditionJson: JSON.stringify(saveConditionList)
      }
      const formMethod = query.id ? Update : Create
      formMethod(query).then(res => {
        this.getAdvancedQueryList()
        this.addPlanVisible = false
        this.saveBtnLoading = false
        this.$emit('saveproject')
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500
        })
      }).catch(() => {
        this.saveBtnLoading = false
      })
    },
    exist() {
      let isOk = true
      for (let i = 0; i < this.conditionList.length; i++) {
        const e = this.conditionList[i];
        if (!e.prop) {
          this.$message.error(`请选择查询字段`);
          isOk = false
          break
        }
      }
      return isOk
    },
    query() {
      if (!this.exist()) return
      let query = {
        matchLogic: this.matchLogic,
        condition: this.conditionList.reduce((result, item) => {
          let field = item.prop
          let fieldValue = item.value
          if (Array.isArray(fieldValue)) fieldValue = fieldValue.join(',')
          if (item.shiftConditionItem) { // 如果此搜索条件有映射的字段
            field = Object.keys(item.shiftConditionItem)[0]
            fieldValue = item.shiftConditionItem[Object.keys(item.shiftConditionItem)[0]]
          }
          if (typeof fieldValue === 'object' && false) { // 解析区间字段
            if (item.symbol === '>=') { // 大于等于

            } else if (item.symbol === '>') { // 大于

            } else if (item.symbol === '==' || item.symbol === 'between') { // 等于
              result.push({
                field,
                fieldValue: fieldValue[0],
                symbol: '>='
              })
              result.push({
                field,
                fieldValue: fieldValue[1],
                symbol: '<='
              })
            } else if (item.symbol === '<=') { // 小于等于

            } else if (item.symbol === '<') { // 小于

            } else if (item.symbol === '<>') { // 不等于

            } else if (item.symbol === 'like') { // 包含

            } else if (item.symbol === 'notLike') { // 不包含

            }
          } else {
            result.push({
              field,
              fieldValue,
              symbol: item.symbol
            })
          }
          return result
          return {
            field,
            fieldValue,
            symbol: item.symbol
          }
        }, [])
      }
      this.$emit('superQuery', query)
      this.visible = false
    },
    // 重置筛选条件
    reset() {
      this.conditionList = []
    }
  }
}
</script>
<style lang="scss" scoped>
.superQuery-dialog {
  .el-dialog {
    .el-dialog__body {
      padding: 20px 20px 10px 24px;
    }

    .footer-options {
      float: left;

      .add-btn {
        margin-right: 10px;
      }
    }
  }

  .superQuery-main {
    padding: 13px 0 0 0;
    .query-noData {
      text-align: center;
      padding: 20px 0;

      .noData-img {
        width: 160px;
        margin-bottom: 10px;
      }

      .noData-txt {
        color: #909399;
      }
    }

    .matchLogic {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      line-height: 32px;

      .el-select {
        width: 240px;
      }
    }

    .condition-list {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="scss">
.plan-popper {
  padding: 0 !important;

  .plan-list {
    padding: 6px 0;
    max-height: 182px;
    overflow: auto;

    &-item {
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #606266;
      font-size: 14px;
      cursor: pointer;
      padding: 0 20px;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    .plan-list-name {
      .el-link--inner {
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-icon-close:hover {
      color: #f56c6c;
    }
  }

  .noData-txt {
    height: 34px;
    color: #999;
    font-size: 14px;
    line-height: 34px;
    text-align: center;
  }
}
</style>
