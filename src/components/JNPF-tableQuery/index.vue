<template>
  <div>
    <el-row class="JNPF-common-search-box" :gutter="16" v-loading="loading">
      <el-form @submit.native.prevent>
        <el-col :span="4">
          <el-select v-model="selectValue" filterable remote reserve-keyword placeholder="选择视图"
            :remote-method="jnpf.throttle(remoteMethod, 500)" :loading="searchLoading" loading-text="正在查找..."
            no-data-text="未找到视图，请先添加" @change="selectChange" style="width: 100%;" default-first-option
            :clearable="false" @visible-change="handleVisibleChange" :key="selectKey" ref="SelectRef"
            popper-class="popper-500">
            <el-option-group label="视图">
              <el-option v-for="(item, index) in planList" :key="item.id" :label="item.fullName" :value="item.id"
                @contextmenu.prevent.native="showContextMenu($event, item, index)">
                <span style="float: left">{{ item.fullName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">个人</span>
              </el-option>
              <el-option v-for="item in showSystemSearchView" :key="item.fullName" :label="item.fullName"
                :value="item.fullName">
                <span style="float: left">{{ item.fullName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">系统</span>
              </el-option>
            </el-option-group>
            <el-option-group label="操作">
              <el-option label="更新当前视图" value="update"
                :disabled="!selectValue || planList.every(item => item.id !== selectValue) || updateLoading">
                <span v-if="updateLoading">
                  <i class="el-icon-loading"></i>
                  更新中...
                </span>
                <span v-else>更新当前视图</span>
              </el-option>
              <el-option label="保存为新视图" value="save" />
            </el-option-group>
            <el-option-group label="关键词配置">
              <el-option label="是否启用" value="keywordFlag" disabled>
                <span style="float: left">是否启用</span>
                <span style="float: right">
                  <el-switch v-model="keywordQuery.keywordFlag" active-text="" inactive-text="" />
                </span>
              </el-option>
              <el-option label="设置关联属性" value="setKeywordFieldList" :disabled="!keywordQuery.keywordFlag">
                <span style="float: left">设置关联属性</span>
                <span style="float: right">
                  <!-- <el-button slot="prepend" icon="el-icon-setting" @click="handleKeywordSetting"></el-button> -->
                  <i class="el-icon-setting"></i>
                </span>
              </el-option>
            </el-option-group>
            <template slot="prefix">
              <div
                style="display: flex; justify-content: space-between; align-items: center; height: 100%; font-size: 16px;">
                <i class="el-icon-collection-tag"></i>
              </div>
            </template>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="keywordQuery.keywordFlag">
          <el-input v-model="keywordQuery.keyword"
            :placeholder="keywordQuery.fieldList.length ? '关键词 包含' : '请先设置关键词关联属性'" clearable
            prefix-icon="el-icon-search" @keyup.enter.native="search" :readonly="!keywordQuery.fieldList.length"
            @focus="handleKeywordFocus()" ref="keywordInputRef">
          </el-input>
        </el-col>
<!--				<slot />-->
				<template v-for="(item, index) in effectSearchList">
					<el-col :span="4" :key="item.prop">
						<el-form-item>
							<el-tooltip effect="dark" :content="item.label" placement="top" :disabled="isEmpty(customSearchQuery[item.prop])">
							<el-input v-if="item.type === 'input'" v-model="customSearchQuery[item.prop]"
								:placeholder="'请输入' + item.label" :clearable="item.clearable !== false" @keyup.enter.native="search()" prefix-icon="el-icon-lock" />
							<el-select v-else-if="item.type === 'select'" v-model="customSearchQuery[item.prop]"
								:placeholder="'请选择' + item.label" :clearable="item.clearable !== false" @change="search()">
								<el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
									:value="item2.value"></el-option>
								<template slot="prefix">
									<div
										style="display: flex; justify-content: space-between; align-items: center; height: 100%; font-size: 16px;">
										<i class="el-icon-lock"></i>
									</div>
								</template>
							</el-select>
                <el-date-picker v-else-if="['year', 'month', 'date', 'dates', 'months', 'years', 'week', 'date', 'datetime', 'daterange', 'datetimerange'].includes(item.type)"
                  v-model="customSearchQuery[item.prop]" @change="search()" prefix-icon="el-icon-lock" v-bind="generateAttributes(item)" />
							<span v-else>搜索条件缺少type</span>
							</el-tooltip>
						</el-form-item>
					</el-col>
				</template>
        <template v-for="queryProps in fixedSearchList">
          <el-col v-if="queryProps.render !== false" :span="['datetimerange'].includes(queryProps.type) ? 8 : 4"
            :key="queryProps.field">
            <el-form-item @contextmenu.prevent.native="showSearchItemMenu()">
              <el-tooltip effect="dark" :content="`${queryProps.label} ${symbolToText(queryProps.symbol)}`" placement="top" :disabled="!checkValueEffect(queryProps)">
              <!-- 比较符empty时 -->
              <template v-if="queryProps.symbol === 'empty'">
                <el-select v-model="queryProps.tempFieldValue" v-bind="{ placeholder: `${queryProps.label} ${symbolToText(queryProps.symbol)}`, clearable: true }">
                  <el-option v-for="(o, i) in global.booleanOptions" :key="i" v-bind="o"></el-option>
                </el-select>
              </template>
              <!-- 输入框 -->
              <template v-if="queryProps.type === 'input'">
                <el-input v-model="queryProps.tempFieldValue" @keyup.enter.native="search"
                  v-bind="{ placeholder: `${queryProps.label} ${symbolToText(queryProps.symbol)}`, maxlength: 100, clearable: true, ...fieldCache[queryProps.field] }" />
              </template>
              <!-- 输入框-数值 -->
              <template v-else-if="queryProps.type === 'number'">
                <el-input v-model="queryProps.tempFieldValue" @keyup.enter.native="search"
                  v-bind="{ placeholder: `${queryProps.label} ${symbolToText(queryProps.symbol)}`, maxlength: 100, clearable: true, ...fieldCache[queryProps.field] }" />
              </template>
              <!-- 输入框-联想输入 -->
              <template v-else-if="queryProps.type === 'autocomplete'">
                <el-autocomplete v-model="queryProps.tempFieldValue" @select="search" style="width:100%"
                  v-bind="{ placeholder: `${queryProps.label} ${symbolToText(queryProps.symbol)}`, maxlength: 100, clearable: true, ...fieldCache[queryProps.field] }" />
              </template>
              <!-- 下拉选择器 -->
              <template v-else-if="queryProps.type === 'select'">
                <el-select v-model="queryProps.tempFieldValue" @change="search"
                  v-bind="{ placeholder: `${queryProps.label} ${symbolToText(queryProps.symbol)}`, clearable: true, multiple: ['in', 'notIn'].includes(queryProps.symbol),
                    collapseTags: true, ...fieldCache[queryProps.field]}">
                  <el-option v-for="(o, i) in queryProps.options" :key="i" v-bind="o"></el-option>
                </el-select>
              </template>
              <!-- 日期时间选择器 -->
              <template
                v-else-if="['year', 'month', 'date', 'dates', 'months', 'years', 'week', 'datetime'].includes(queryProps.type)">
                <el-date-picker-pro v-model="queryProps.tempFieldValue" @change="search" v-bind="{
                  placeholder: `${queryProps.label} ${symbolToText(queryProps.symbol)}`, style: 'width:100%', clearable: true,
                  ...fieldCache[queryProps.field],
                  ...(() => {
                    const result = { key: queryProps.symbol }
                    if (queryProps.symbol === 'between') {
                      result.defaultTime = ['00:00:00', '23:59:59']
                      if (typeof queryProps.tempFieldValue === 'string') queryProps.tempFieldValue = null
                      result.type = fieldCache[queryProps.field].type + 'range'
                      result.pickerOptions = fieldCache[queryProps.field].pickerOptionsRange
                    } else {
                      result.defaultTime = null
                      if (typeof queryProps.tempFieldValue !== 'string') queryProps.tempFieldValue = null
                    }
                    return result
                  })()
                }">
                  <template slot="sidebar">
                    <el-tooltip placement="top" v-if="fieldCache[queryProps.field].valueFormat.includes('yyyy-MM-dd')">
                      <el-switch v-model="queryProps.timeOffset" active-text="动态" inactive-text=""></el-switch>
                      <div slot="content" v-html="genTooltip(queryProps)"></div>
                    </el-tooltip>
                  </template>
                </el-date-picker-pro>
              </template>
              <!-- 自定义组件 -->
              <!-- <template v-else-if="queryProps.type === 'custom'">
                <component :is="queryProps.component" v-model="queryProps.tempFieldValue"
                  v-on="fieldCache[queryProps.field].events" v-bind="{
                    placeholder: `${queryProps.label} ${symbolToText(queryProps.symbol)}`, style: 'width:100%',
                    ...queryProps,
                    ...fieldCache[queryProps.field]
                  }" />
              </template> -->
              <!-- 默认显示输入框 -->
              <template v-else>
                <el-input :value="'未识别的类型：' + queryProps.type" disabled />
              </template>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
              {{ $t('common.search') }}
            </el-button>
            <el-button size="mini" icon="el-icon-refresh-right" @click="reset(true)">{{ $t('common.reset') }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <HandleViewDialog v-if="saveDialogVisible" @cancel="saveDialogVisible = false" @confirm="onSaveConfirm"
      :currMenuId="currMenuId" :listQuery="listQuery" />

    <!-- 右键菜单组件 -->
    <ContextMenu :visible="contextMenuVisible" :menu-style="contextMenuStyle" :selected-item="selectedItem"
      :selected-index="selectedIndex" :curr-menu-id="currMenuId" :list-query="listQuery"
      @delete-success="handleDeleteSuccess" @rename-success="handleRenameSuccess" />
    <HandleKeywordSetting v-if="keywordSettingVisible && parentTableRef.$refs" @cancel="keywordSettingVisible = false"
      @confirm="onKeywordSettingConfirm" :keywordQuery="keywordQuery" :columnList="parentTableRef.columnList"
      :queryJson="parentTableRef.queryJson" />
  </div>
</template>

<script>
/**
 * JNPF-tableQuery 表格查询组件
 * @description 表格查询组件，支持多条件筛选、视图保存/更新、关键词配置等功能
 * @property {Object} listQuery 当前查询参数对象
 * @property {Array} systemSearchView 系统预设的视图列表
 * @property {String} tableRef 父表格组件的 $refs 名称
 */
import { getAdvancedQueryList, Delete, Create, Update } from '@/api/system/advancedQuery'
import HandleViewDialog from './HandleViewDialog.vue'
import { getQueryProps, genTooltip, symbolToText } from '@/components/JNPF-table/data'
import ContextMenu from './ContextMenu.vue'
import ElDatePickerPro from '@/components/element-ui-pro/date-picker.js'
import HandleKeywordSetting from './HandleKeywordSetting.vue'
import dayjs from 'dayjs'
import { isEmpty } from '@/utils'
import global from "@/utils/global";
export default {
  components: { HandleViewDialog, ContextMenu, ElDatePickerPro, HandleKeywordSetting },
  provide() {
    return {
      planList: () => this.planList,
      systemSearchView: () => this.systemSearchView
    }
  },
  props: {
    listQuery: {
      type: Object,
      required: true
    },
    systemSearchView: {
      type: Array,
      required: true
    },
    tableRef: {
      type: String,
      required: true
    },
		// 如果某些搜索条件是必要的，但是接口无法返回对应prop，将这些条件放在此列表中
		searchList: {
			type: Array,
			default: () => []
		}
  },
  data() {
    return {
      genTooltip,
      symbolToText,
			isEmpty,
      initTimeouter: null,
      selectValue: null,
      lastSelectValue: null, // 最后一次选择的视图
      oldSelectValue: null, // 最后一次的上一次选择的视图
      lastListQuery: null, // 最后一次查询的参数
      searchLoading: false,
      updateLoading: false,
      planList: [],
      superQuery: {
        matchLogic: 'AND',
        condition: []
      },
      saveDialogVisible: false,
      parentTableRef: {},
      currMenuId: null,
      contextMenuVisible: false,
      contextMenuStyle: {},
      selectedItem: null,
      selectedIndex: -1,
      selectKey: 0,
      fieldCache: {}, // 属性缓存 用于解决方法无法转为json后存储问题
      loading: true,
      keywordQuery: {
        keywordFlag: false,
        keyword: '',
        fieldList: []
      },
      keywordSettingVisible: false,
      orderItems: [],
      pageSize: 0,
      showSystemSearchView: [],
      getParentTableRefTotal: 0,
			customSearchQuery: {} // 自定义searchList的查询参数
    }
  },
  computed: {
    fixedSearchList() {
      if (!this.parentTableRef.$refs || !this.listQuery?.superQuery?.condition) return []
      let result = this.listQuery.superQuery.condition.filter(item => item.fixed)
      result.forEach(item => {
        const columnIndex = this.parentTableRef.columnList.findIndex(column => column.prop === item.field)
        if (columnIndex !== -1) {
          const column = this.parentTableRef.columnList[columnIndex]
          const queryProps = getQueryProps(column, this.parentTableRef.queryJson)
          this.fieldCache[item.field] = queryProps
          if (isEmpty(item.tempFieldValue) && item.sort === undefined) this.$set(item, 'tempFieldValue', item.fieldValue)
          this.$set(item, 'label', column.label)
          this.$set(item, 'type', queryProps.type)
          this.$set(item, 'options', queryProps.options)
          item.sort = columnIndex
          item.render = Object.hasOwnProperty('render') ? item.render : true // 默认正常render
        } else {
          item.render = Object.hasOwnProperty('render') ? item.render : false // 如果表格上没有找到此列，那么自动给render设置false
        }
      })
      result = result.sort((a, b) => a.sort - b.sort)
      return result
    },
		effectSearchList() {
			return this.searchList.filter(item => item.render !== false)
		},
  },
  async mounted() {
    if (!this.systemSearchView.length) throw '请配置系统预设的视图'
    this.getParentTableRef()
  },
  beforeDestroy() {
    clearTimeout(this.initTimeouter)
    if (this.parentTableRef.$refs) {
      this.parentTableRef.$off('columnChange', this.getParentTableRef)
    }
  },
  watch: {
    selectValue(val) {
      this.jnpf.storageSet({ [this.currMenuId]: val })
    },
    listQuery: {
      handler(val) {
        // console.log('listQuery', val);
        // 在偏移开关或固定顶栏发生变化，提示是否更新/保存视图
        if (val.superQuery?.condition) {
          let updatedFlag = false
          if (this.oldSelectValue === this.selectValue) { // 第二次query开始判断
            // 判断condition是否存在fixed总数是否发生改变
            const oldFixedTotal = this.lastListQuery.superQuery.condition.filter(item => item.fixed).length
            const newFixedTotal = val.superQuery.condition.filter(item => item.fixed).length
            if (oldFixedTotal !== newFixedTotal) {
              if (!updatedFlag) this.confirmUpdate()
              updatedFlag = true
            }

            // timeOffset数发生变化也要提示是否保存
            const oldTimeOffsetTotal = this.lastListQuery.superQuery.condition.filter(item => item.timeOffset).length
            const newTimeOffsetTotal = val.superQuery.condition.filter(item => item.timeOffset).length
            if (oldTimeOffsetTotal !== newTimeOffsetTotal) {
              if (!updatedFlag) this.confirmUpdate()
              updatedFlag = true
            }
          }
          this.oldSelectValue = this.selectValue // 第一次记录oldSelectValue

          this.fixedSearchList.forEach(fixedItem => {
            const fieldValue = val.superQuery.condition.find(item => item.field === fixedItem.field)?.fieldValue
            fixedItem.tempFieldValue = fieldValue
          })
        }
        if (val.orderItems) {
          this.orderItems = val.orderItems
        }
        if (val.keywordQuery) {
          this.keywordQuery = val.keywordQuery
        }
        this.pageSize = val.pageSize
        this.lastListQuery = structuredClone(val)
      },
      deep: false
    }
  },
  methods: {
    getParentTableRef() {
      if (this.parentTableRef.$refs) {
        this.parentTableRef.$off('columnChange', this.getParentTableRef)
      }
      this.initTimeouter = setTimeout(async () => {
        this.parentTableRef = this.jnpf.deepGetParentValue(this, this.tableRef, '$refs') || {}
        if (this.parentTableRef.$refs) {
          this.parentTableRef.$on('columnChange', this.getParentTableRef) // 表格列改变时重新获取表格信息
          this.parentTableRef.doLayout()

          this.currMenuId = 'TQ_' + this.parentTableRef.menuId + this.parentTableRef._customKey
          if (!this.lastSelectValue) {
            await this.remoteMethod()
            const lastSelectValue = this.jnpf.storageGet(this.currMenuId)
            if (lastSelectValue) {
              this.selectValue = lastSelectValue
              this.selectChange(lastSelectValue)
            } else {
              this.reset()
            }
          }

        } else {
          if (++this.getParentTableRefTotal < 20) this.getParentTableRef()
          else this.$message.error('自定义查询：获取表格信息失败！')
        }
      }, 500)
    },
    async remoteMethod(query) {
      this.searchLoading = true
      let res = await getAdvancedQueryList(this.currMenuId).catch(err => false)
      if (res) {
        this.planList = res.data.list.filter(item => query ? item.fullName.indexOf(query) > -1 : true)
      }
      this.showSystemSearchView = this.systemSearchView.filter(item => query ? item.fullName.indexOf(query) > -1 : true)
      this.searchLoading = false
    },
    selectChange(val) {
      this.initCustomSearchQuery()
      this.$nextTick(() => this.$refs.SelectRef?.blur())
      if (val === 'update' || val === 'save') {
        this.selectValue = this.lastSelectValue;
        this.handleView(val);
        return;
      } else if (val === 'setKeywordFieldList') {
        this.selectValue = this.lastSelectValue;
        this.handleKeywordSetting()
        return
      }
      this.lastSelectValue = val;
      let target = this.planList.find(item => item.id === val)
      if (!target) target = this.systemSearchView.find(item => item.fullName === val)
      if (target) {
        this.selectPlan(target)
      } else {
        // 可能因为切换租户，或本人到其他浏览器删除了上次选择的视图，或是删除当前选择的视图
        this.jnpf.storageRemove(this.currMenuId)
        // 等待watch更改lastSelectValue后reset
        this.$nextTick(() => this.reset())
      }
    },
    selectPlan(item) {
      // console.log('selectPlan', item);
      if (typeof item.conditionJson === 'object') { // 系统视图

      } else { // 个人视图
        item.conditionJson = JSON.parse(item.conditionJson)
      }
      const { condition, orderItems, keywordQuery, pageSize } = structuredClone(item.conditionJson)
      /**
       * 获取对应 type 的格式化模板
       */
      function getDateFormat(type) {
        return type === 'date' ? 'YYYY-MM-DD' :
          type === 'month' ? 'YYYY-MM' :
            'YYYY-MM-DD HH:mm:ss';
      }

      /**
       * 偏移时间区间
       */
      function shiftTimeRange(range, diff, format) {
        const start = new Date(range[0]).getTime() + diff;
        const end = new Date(range[1]).getTime() + diff;
        return [
          dayjs(start).format(format),
          dayjs(end).format(format)
        ];
      }

      /**
       * 偏移单个时间值
       */
      function shiftSingleTime(value, diff, format) {
        const time = new Date(value).getTime() + diff;
        return dayjs(time).format(format);
      }

      /**
       * 对搜索条件中的动态时间值进行偏移处理（基于基础时间对齐到当前日期）
       * @param {Array} condition - 搜索条件列表，会被原地修改
       */
      condition.forEach(handleCondition);
      function handleCondition(condition) {
        const { timeOffset, timeOffsetBasic, timeOffsetCalculated, value, type } = condition;

        // 如果是动态时间条件且未计算过，则处理
        if (!timeOffset || !timeOffsetBasic || timeOffsetCalculated) {
          condition.tempFieldValue = value;
          return;
        }

        // 标记已处理，避免重复执行
        condition.timeOffsetCalculated = true;

        // 计算需要偏移的完整天数（毫秒）
        const now = Date.now();
        const diff = Math.floor((now - timeOffsetBasic) / 86400000) * 86400000;

        // 获取对应类型的格式化字符串
        const format = getDateFormat(type);

        // 处理值：区间或单值
        let newValue;
        if (Array.isArray(value) && value.length === 2) {
          newValue = shiftTimeRange(value, diff, format);
        } else if (value) {
          newValue = shiftSingleTime(value, diff, format);
        } else {
          newValue = value; // 空值保持不变
        }

        // console.log(`日期时间${Array.isArray(value) ? '区间' : '单值'}偏移`, value, ' -> ', newValue);
        condition.value = newValue;
        condition.tempFieldValue = newValue; // 同步临时值
      }
      // 这里需要有解析方法名称的解决方案
      this.superQuery.condition = condition || []
      this.orderItems = orderItems || []
      this.keywordQuery = keywordQuery || { keywordFlag: false, keyword: '', fieldList: [] }
      this.pageSize = pageSize
      // console.log('selectPlan', this.superQuery.condition);
      this.query()
    },
    query() {
      // if (!this.exist()) return
      let query = {
        matchLogic: this.superQuery.matchLogic,
        condition: this.superQuery.condition.reduce((result, item) => {
          let field = item.prop
          let fieldValue = item.tempFieldValue
          // if (Array.isArray(fieldValue)) fieldValue = fieldValue.join(',')
          if (item.shiftConditionItem) { // 如果此搜索条件有映射的字段
            field = Object.keys(item.shiftConditionItem)[0]
            fieldValue = item.shiftConditionItem[Object.keys(item.shiftConditionItem)[0]]
          }

          result.push({
            ...item,
            field,
            fieldValue
          })
          return result
        }, [])
      }
      this.queryChange({
        ...this.listQuery,
        superQuery: query
      })
    },
    search() {
      if (!this.lastSelectValue) return
      let listQuery = structuredClone(this.listQuery)
      listQuery.superQuery.condition.forEach(item => {
        if (item.fixed) {
          item.fieldValue = item.tempFieldValue
        }
      })
      listQuery.pageNum = 1
      this.queryChange(listQuery)
    },
    // 重置筛选条件
    reset(flag = false) {
			this.resetCustomSearchQueryFlag = flag
      const lastSelectValue = this.jnpf.storageGet(this.currMenuId)
      if (lastSelectValue) {
        this.selectValue = lastSelectValue
        this.selectChange(lastSelectValue)
      } else {
        this.selectValue = this.systemSearchView.find(item => item.fullName === '默认视图')?.fullName
        this.selectChange(this.selectValue)
      }
    },
    delPlan(id, i) {
      Delete(id).then(res => {
        this.planList.splice(i, 1)
        this.$message({
          type: 'success',
          message: res.msg,
          duration: 1500
        })
      })
    },
    handleView(type) {
      if (type === 'update') {
        this.updateCurrentView();
      } else if (type === 'save') {
        this.saveDialogVisible = true;
      }
    },
    async updateCurrentView() {
      // 检查是否有选中的视图
      if (!this.selectValue || !this.planList.some(item => item.id === this.selectValue)) {
        this.$message.warning('请先选择一个视图进行更新');
        return;
      }

      // 获取当前选中的视图
      const currentView = this.planList.find(item => item.id === this.selectValue);
      if (!currentView) {
        this.$message.error('未找到当前视图');
        return;
      }

      this.updateLoading = true;
      // 构建更新数据
      const saveConditionList = this.listQuery.superQuery.condition.map(item => {
        let obj = {
          ...item,
          prop: item.field,
          value: item.fixed ? item.tempFieldValue : item.fieldValue,
        }
        delete obj.timeOffsetCalculated
        delete obj.fieldValue
        delete obj.tempFieldValue
        if (obj.timeOffset) {
          obj.timeOffsetBasic = +new Date()
        } else {
          delete obj.timeOffset
          delete obj.timeOffsetBasic
        }
        // 处理自定义类型
        // if (item.type === 'custom') obj = { ...obj, ...item }
        return obj
      });

      const updateData = {
        id: currentView.id,
        fullName: currentView.fullName,
        matchLogic: this.listQuery.superQuery.matchLogic,
        moduleId: this.currMenuId,
        conditionJson: JSON.stringify({
          condition: saveConditionList,
          keywordQuery: this.keywordQuery,
          orderItems: this.orderItems,
          pageSize: this.pageSize
        })
      };

      // 调用更新API
      const res = await Update(updateData).catch(err => false)
      this.updateLoading = false;
      if (!res) return this.$message.error('更新视图失败，请重试')
      this.$message({
        type: 'success',
        message: '视图更新成功',
        duration: 1500
      });

      // 更新本地数据
      const index = this.planList.findIndex(item => item.id === currentView.id);
      if (index !== -1) {
        this.planList[index] = { ...currentView, ...updateData };
      }

    },
    async onSaveConfirm(formData) {
      this.saveDialogVisible = false
      // 保存成功后刷新视图列表
      await this.remoteMethod();

      // 更新选中状态
      const newView = this.planList.find(item => item.fullName === formData.fullName)
      if (newView) {
        this.selectValue = newView.id;
        this.lastSelectValue = newView.id;
      }
    },
    handleVisibleChange(visible) {
      if (visible) {
        if (!this.planList.length && !this.showSystemSearchView.length) this.remoteMethod()
      } else {
        this.contextMenuVisible = false;
      }
    },
    showContextMenu(event, item, index) {
      this.contextMenuVisible = true;

      // 计算菜单位置，确保不超出屏幕边界
      const menuWidth = 120;
      const menuHeight = 80;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let left = event.clientX;
      let top = event.clientY;

      // 如果菜单会超出右边界，则向左偏移
      if (left + menuWidth > windowWidth) {
        left = windowWidth - menuWidth - 10;
      }

      // 如果菜单会超出下边界，则向上偏移
      if (top + menuHeight > windowHeight) {
        top = windowHeight - menuHeight - 10;
      }

      this.contextMenuStyle = {
        left: left + 'px',
        top: top + 'px'
      };

      this.selectedItem = item;
      this.selectedIndex = index;

      // 添加点击外部关闭右键菜单
      // this.$nextTick(() => {
      //   document.addEventListener('click', this.hideContextMenu);
      // });
    },
    showSearchItemMenu() {
      console.log('功能开发中！')
    },
    // hideContextMenu() {
    //   this.contextMenuVisible = false;
    //   document.removeEventListener('click', this.hideContextMenu);
    // },
    handleDeleteSuccess({ item, index }) {
      // 从本地列表中移除
      this.planList.splice(index, 1);

      // 如果删除的是当前选中的视图，reset
      if (this.selectValue === item.id) {
        this.selectValue = null;
        this.selectChange(null)
        this.reset();
      }
    },
    handleRenameSuccess({ index, newName }) {
      // 更新本地数据
      this.planList[index].fullName = newName;
      this.selectKey++
    },
    queryChange(listQuery) {
      listQuery = {
        ...listQuery,
        pageNum: 1,
        orderItems: this.orderItems,
        pageSize: this.pageSize,
        superQuery: {
          tableQueryFlag: true, // 新版表格数据查询标记
          matchLogic: listQuery.superQuery.matchLogic,
          condition: listQuery.superQuery.condition.map(item => ({
            ...item,
            fieldValue: (() => {
              let fieldValue = item.fieldValue
              // if (Array.isArray(fieldValue)) fieldValue = fieldValue.join(',')
              // if (item.shiftConditionItem) { // 如果此搜索条件有映射的字段
              //   field = Object.keys(item.shiftConditionItem)[0]
              //   fieldValue = item.shiftConditionItem[Object.keys(item.shiftConditionItem)[0]]
              // }
              if (typeof fieldValue === 'string') fieldValue = fieldValue.trim()
              return fieldValue
            })(),
          }))
        },
        keywordQuery: {
          ...this.keywordQuery,
          keyword: this.keywordQuery.keyword?.trim()
        },
        customSearchQuery: this.formatCustomSearchQuery(this.customSearchQuery)
      }
      // this.$emit('queryChange', listQuery)
      this.parentTableRef.queryChange(listQuery)
      this.loading = false
    },
    handleKeywordSetting() {
      this.keywordSettingVisible = true
    },
    async onKeywordSettingConfirm(val) {
      this.keywordQuery.fieldList = val
      this.keywordSettingVisible = false
      this.confirmUpdate()
    },
    handleKeywordFocus() {
      if (!this.keywordQuery.fieldList.length) {
        this.handleKeywordSetting()
        this.$nextTick(() => {
          this.$refs.keywordInputRef.blur()
          this.$message.warning('请先设置关键词关联属性！')
        })
      }
    },
    checkValueEffect(queryProps) {
      // console.log('checkValueEffect', structuredClone(queryProps), !!queryProps.tempFieldValue)
      if (queryProps.symbol === 'empty') return true
      if (typeof queryProps.tempFieldValue === 'object' ? queryProps.tempFieldValue?.length : !!queryProps.tempFieldValue) return true
      if (queryProps.tempFieldValue === 0 || queryProps.tempFieldValue === false) return true
      return false
    },
    async confirmUpdate() {
      if (this.planList.find(item => item.id === this.selectValue)) {
        let flag = await this.$confirm('设置成功，是否更新当前视图', '提示', { type: 'success' }).catch(err => false)
        if (flag) this.updateCurrentView()
      } else {
        let flag = await this.$confirm('设置成功，是否保存当前视图', '提示', { type: 'success' }).catch(err => false)
        if (flag) this.saveDialogVisible = true
      }
    },
		initCustomSearchQuery(autoSearchFlag = false) {
			if (!this.effectSearchList) return
			const {
				superQuery,
				condition,
				keywordQuery,
				pageNum,
				pageSize,
				orderItems,
				customSearchQuery,
				...other
			} = structuredClone(this.listQuery)
			this.customSearchQuery = {
				...other,
				...this.customSearchQuery
			}
			if (this.resetCustomSearchQueryFlag) {
				this.resetCustomSearchQueryFlag = false
				this.customSearchQuery = other
			}
			// console.log(this.customSearchQuery)
      if (autoSearchFlag) this.search()
		},
    formatCustomSearchQuery(customSearchQuery) {
      if (!customSearchQuery) return {}
      return Object.keys(customSearchQuery).reduce((prev, key) => {
        this.effectSearchList.some(item => {
          if (item.prop === key) {
            prev[key] = customSearchQuery[key]
            if (item.type.includes('range')) {
              if (!item.start || !item.end) {
                console.warn(`searchList 中 ${item.prop} 需要开始字段(start)和结束字段(end)标记！`)
                return true
              }
              if (customSearchQuery[key]?.length) {
                prev[item.start] = customSearchQuery[key][0]
                prev[item.end] = customSearchQuery[key][1]
              } else {
                prev[item.start] = prev[item.end] = null
              }
              return true
            } else {
              return true
            }
          }
        })
        // if (this.effectSearchList.some(item => item.prop === key)) {
        //   prev[key] = customSearchQuery[key]
        // }
        return prev
      }, {})
    },
    generateAttributes(item) {
      return {
        placeholder: '请选择' + item.label,
        style: 'width:100%;',
        clearable: item.clearable !== false,
        ...(() => {
          if (['date', 'datetime', 'daterange', 'datetimerange'].includes(item.type)) {
            const result = {}
            result.pickerOptions = global.timePicker
            result.format = 'yyyy-MM-dd' + (item.type.includes('datetime') ? ' HH:mm:ss' : '')
            result.valueFormat = result.format
            if (item.type.includes('range')) {
              result.pickerOptions = global.timePickerOptions
              result.startPlaceholder = item.label + '开始'
              result.endPlaceholder = item.label + '结束'
              result.defaultTime = ['00:00:00', '23:59:59']
            }
            return result
          }
        })(),
        ...item,
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-date-editor--datetimerange {
  justify-content: space-between;
}
// ::v-deep .input-with-select .el-input-group__prepend {
// 	background-color: #fff;
// 	width: 80px;
// 	position: relative;

// 	.el-select__tags {
// 		display: none;
// 	}

// 	//&::after {
// 	//	content: '';
// 	//	width: 100%;
// 	//	height: 100%;
// 	//	background-color: #e50;
// 	//	position: absolute;
// 	//	top: 0;
// 	//	left: 0;
// 	//}
</style>
