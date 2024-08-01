<template>
  <div class="columnDesign-container">
    <div class="main-board">
      <div class="search-box">
        <h4 class="cap">查询字段</h4>
        <el-table :data="columnData.searchList" class="JNPF-common-table" ref="dragTableSearch"
          @current-change="handleSeachChange" highlight-current-row :row-key="row => row.prop">
          <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="列名" />
          <el-table-column prop="prop" label="字段" />
          <el-table-column prop="searchType" label="类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.searchType" placeholder="请选择">
                <el-option label="等于查询" :value="1"></el-option>
                <el-option label="模糊查询" :value="2"></el-option>
                <el-option label="范围查询" :value="3"></el-option>
                <el-option label="枚举查询" :value="4"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <div class="column-box">
        <h4 class="cap">列表字段</h4>
        <el-table :data="columnData.columnList" class="JNPF-common-table" ref="dragTable"
          @current-change="handleCurrentChange" highlight-current-row :row-key="row => row.prop">
          <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="列名" />
          <el-table-column prop="prop" label="字段" />
          <el-table-column prop="sortable" label="排序" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.sortable" />
            </template>
          </el-table-column>
          <el-table-column prop="align" label="对齐">
            <template slot-scope="scope">
              <el-select v-model="scope.row.align" placeholder="请选择">
                <el-option v-for="item in alignOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="宽度">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.width" placeholder="宽度" :min="0" :precision="0"
                controls-position="right" style="width:100%" />
            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>
        <h4 class="cap" v-if="columnData.type == 5 || columnData.type == 6">子表字段</h4>
        <el-table :data="columnData.columnLineList" class="JNPF-common-table" ref="dragTable" :row-key="row => row.prop"
          @current-change="handleCurrentChange" highlight-current-row v-if="columnData.type == 5 || columnData.type == 6">
          <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="列名" />
          <el-table-column prop="prop" label="字段" />
          <el-table-column prop="sortable" label="排序" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.sortable" />
            </template>
          </el-table-column>
          <el-table-column prop="align" label="对齐">
            <template slot-scope="scope">
              <el-select v-model="scope.row.align" placeholder="请选择">
                <el-option v-for="item in alignOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="宽度">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.width" placeholder="宽度" :min="0" :precision="0"
                controls-position="right" style="width:100%" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right-board">
      <el-tabs v-model="currentTab" class="top-tabs">
        <el-tab-pane label="列表属性" name="column" />
        <el-tab-pane label="列表字段" name="field" />
        <el-tab-pane label="列属性" name="culumnSet" />
        <el-tab-pane label="查询字段" name="search" />
        <el-tab-pane label="查询设置" name="searchSet" />
      </el-tabs>
      <div class="field-box">
        <div class="searchList" v-show="currentTab === 'search'">
          <el-table :data="searchOptions" class="JNPF-common-table" height="100%"
            @selection-change="searchSelectionChange" ref="searchTable" border>
            <el-table-column prop="label" label="查询字段" />
            <el-table-column type="selection" width="55" align="center" />
          </el-table>
        </div>
        <div class="columnList" v-show="currentTab === 'field'">
          <el-tabs tab-position="bottom" type="border-card" v-model="currentFieldTab" style="height: calc(100% - 63px);">
            <el-tab-pane label="主表字段" name="indexField">
              <el-divider v-if="currentFieldTab === 'indexField'">主表字段</el-divider>
              <el-table v-if="currentFieldTab === 'indexField'" :data="columnOptions" class="JNPF-common-table"
                @selection-change="columnSelectionChange" ref="columnTable" height="100%">
                <el-table-column prop="label" label="列表字段" />
                <el-table-column type="selection" width="55" align="center" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="子表字段" name="lineField" v-if="columnData.type == 5 || columnData.type == 6">
              <el-divider v-if="currentFieldTab === 'lineField'">子表字段</el-divider>
              <el-table v-if="currentFieldTab === 'lineField'" :data="columnLineOptions" class="JNPF-common-table"
                @selection-change="columnLIneSelectionChange" ref="columnLineTable">
                <el-table-column prop="label" label="列表字段" />
                <el-table-column type="selection" width="55" align="center" />
              </el-table>
            </el-tab-pane>
          </el-tabs>


        </div>
        <el-scrollbar class="right-scrollbar" v-show="currentTab === 'culumnSet'">
          <div class="setting-box">
            <template v-if="currentRow">
              <el-form :model="currentRow" label-width="80px" label-position="left">
                <el-form-item label="字段">
                  <el-input v-model="currentRow.prop" disabled />
                </el-form-item>
                <el-form-item label="列名">
                  <el-input v-model="currentRow.label" placeholder="请输入列名" />
                </el-form-item>
                <el-form-item label="列表宽度">
                  <el-input-number v-model="currentRow.width" placeholder="请输入列表宽度" :min="0" :precision="0"
                    controls-position="right" style="width:100%" />
                </el-form-item>
                <el-form-item label="排序">
                  <el-switch v-model="currentRow.sortable" />
                </el-form-item>
                <el-form-item label="对齐方式">
                  <el-select v-model="currentRow.align" placeholder="请选择对齐方式">
                    <el-option v-for="item in alignOptions" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-divider>脚本事件</el-divider>
                <el-form-item label="格式化">
                  <el-button style="width: 100%;" @click="addFunc(currentRow)">脚本编写
                  </el-button>
                </el-form-item>
              </el-form>
            </template>
          </div>
        </el-scrollbar>
        <el-scrollbar class="right-scrollbar" v-show="currentTab === 'searchSet'">
          <div class="setting-box">
            <template v-if="currentSearchRow">
              <el-form :model="currentSearchRow" label-width="80px" label-position="left">
                <el-form-item label="字段">
                  <el-input v-model="currentSearchRow.prop" disabled />
                </el-form-item>
                <el-form-item label="字段名">
                  <el-input v-model="currentSearchRow.label" placeholder="请输入字段名" />
                </el-form-item>
                <el-divider>数据选项</el-divider>
                <el-form-item label="" label-width="40px">
                  <el-radio-group v-model="currentSearchRow.dataType" size="small" style="text-align:center"
                    v-if="currentSearchRow.searchType === 4">
                    <el-radio-button label="static">静态数据</el-radio-button>
                    <el-radio-button label="dictionary">数据字典</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <template v-if="currentSearchRow.dataType === 'static'">
                  <draggable :list="currentSearchRow.options" :animation="340" group="selectItem" handle=".option-drag">
                    <div v-for="(item, index) in currentSearchRow.options" :key="index" class="select-item">
                      <div class="select-line-icon option-drag">
                        <i class="icon-ym icon-ym-darg" />
                      </div>
                      <el-input v-model="item.label" placeholder="选项名" size="small" />
                      <el-input v-model="item.value" placeholder="选项值" size="small" />
                      <div class="close-btn select-line-icon" @click="currentSearchRow.options.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                      </div>
                    </div>
                  </draggable>
                  <div style="margin-left: 29px;" v-if="currentSearchRow.searchType === 4">
                    <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                      @click="addSelectItem">
                      添加选项
                    </el-button>
                  </div>
                </template>
                <template v-if="currentSearchRow.dataType === 'dictionary'">
                  <el-form-item label="数据字典">
                    <JNPF-TreeSelect :options="dicOptions" v-model="currentSearchRow.dictionaryType" placeholder="请选择数据字典"
                      lastLevel clearable>
                    </JNPF-TreeSelect>
                  </el-form-item>
                </template>
                <template v-if="currentSearchRow.searchType === 3">
                  <el-form-item label="时间类型">
                    <el-select v-model="currentSearchRow.dateType" placeholder="请选择时间控件类型">
                      <el-option v-for="item in columnData.dateTypeOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-form>
            </template>
          </div>
        </el-scrollbar>

        <el-scrollbar class="right-scrollbar" v-show="currentTab === 'column'">
          <div class="setting-box">
            <el-form :model="columnData" label-position="left">
              <div class="typeList">
                <div class="item" v-for="(item, index) in typeList" :key="index" @click="columnData.type = item.value">
                  <div class="item-img" :class="{ 'checked': columnData.type == item.value }">
                    <img :src="item.url" alt="">
                    <div class="icon-checked" v-if="columnData.type == item.value">
                      <i class="el-icon-check"></i>
                    </div>
                  </div>
                  <p class="item-name">{{ item.name }}</p>
                </div>
              </div>
              <template v-if="columnData.type == 2">
                <el-divider>左侧配置</el-divider>
                <el-form-item label="左侧标题">
                  <el-input v-model="columnData.treeTitle" placeholder="树形标题"></el-input>
                </el-form-item>
                <el-form-item label="分类类型">
                  <el-select v-model="columnData.selectClassifyType" placeholder="请选择分类类型">
                    <el-option v-for="item in columnData.selectTypeClassifyOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="数据来源">
                  <el-select v-model="columnData.treeDataSource" placeholder="请选择数据来源" @change="dataTypeChange">
                    <el-option label="数据字典" value="dictionary"></el-option>
                    <el-option label="远端数据" value="api"></el-option>
                    <el-option label="组织数据" value="organize"></el-option>
                    <el-option label="部门数据" value="department"></el-option>
                  </el-select>
                </el-form-item>
                <template v-if="columnData.treeDataSource === 'dictionary'">
                  <el-form-item label="数据字典">
                    <DicSelect v-model="columnData.treeDictionary" placeholder="请选择数据字典" />
                  </el-form-item>
                  <el-form-item label="主键字段">
                    <el-select v-model="columnData.treePropsValue" placeholder="请选择主键字段">
                      <el-option label="id" value="id"></el-option>
                      <el-option label="enCode" value="enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="columnData.treeDataSource === 'api'">
                  <el-form-item label="数据接口">
                    <JNPF-TreeSelect :options="dataInterfaceSelector" v-model="columnData.treePropsUrl"
                      placeholder="请选择数据接口" lastLevel lastLevelKey='categoryId' lastLevelValue='1' clearable />
                  </el-form-item>
                  <el-form-item label="主键字段">
                    <el-input v-model="columnData.treePropsValue" placeholder="主键字段" />
                  </el-form-item>
                  <el-form-item label="显示字段">
                    <el-input v-model="columnData.treePropsLabel" placeholder="显示字段" />
                  </el-form-item>
                  <el-form-item label="子级字段">
                    <el-input v-model="columnData.treePropsChildren" placeholder="子级字段" />
                  </el-form-item>
                </template>
                <el-form-item label="关联字段">
                  <el-select v-model="columnData.treeRelation" placeholder="请选择关联字段">
                    <el-option :label="item.__config__.label" :value="item.__vModel__" v-for="(item, index) in list"
                      :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <!-- <el-divider>主列SQL</el-divider>
              <el-form-item>
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="columnData.master.column">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="getSql">执行</el-button>
              </el-form-item> -->
              <el-divider>主列自定义字段</el-divider>
              <draggable :list="customField" :animation="340" group="selectItem" handle=".option-drag">
                <div v-for="(item, index) in customField" :key="index" class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <el-input v-model="item.label" placeholder="列名" size="small" />
                  <el-input v-model="item.prop" placeholder="列字段" size="small" />
                  <div class="close-btn select-line-icon" @click="customField.splice(index, 1)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 29px;">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addFieldItem">
                  添加选项
                </el-button>
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                  @click="saveFieldItem">
                  保存选项
                </el-button>
              </div>
              <el-divider>主数据SQL</el-divider>
              <el-form-item style="margin-left:0px" class="noLabel">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="columnData.master.data">
                </el-input>
              </el-form-item>

              <el-divider v-if="columnData.type == 5 || columnData.type == 6">子列自定义字段</el-divider>
              <draggable :list="customFieldLine" :animation="340" group="selectItem" handle=".option-drag" v-if="columnData.type == 5 || columnData.type == 6">
                <div v-for="(item, index) in customFieldLine" :key="index" class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <el-input v-model="item.label" placeholder="列名" size="small" />
                  <el-input v-model="item.prop" placeholder="列字段" size="small" />
                  <div class="close-btn select-line-icon" @click="customFieldLine.splice(index, 1)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 29px;" v-if="columnData.type == 5 || columnData.type == 6">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addFieldItem">
                  添加选项
                </el-button>
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                  @click="saveFieldItemLine">
                  保存选项
                </el-button>
              </div>
              <el-divider v-if="columnData.type == 5 || columnData.type == 6">子数据SQL</el-divider>
              <el-form-item v-if="columnData.type == 5 || columnData.type == 6">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="columnData.slave.data">
                </el-input>
              </el-form-item>
              <el-divider>表格配置</el-divider>
              <template v-if="columnData.type == 3">
                <el-form-item label="分组字段">
                  <el-select v-model="columnData.groupField" placeholder="请选择分组字段">
                    <el-option :label="item.__config__.label" :value="item.__vModel__"
                      v-for="(item, i) in groupFieldOptions" :key="i"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item label="高级查询">
                <el-switch v-model="columnData.hasSuperQuery"></el-switch>
              </el-form-item>
              <el-form-item label="排序类型">
                <el-select v-model="columnData.sort" placeholder="请选择排序类型">
                  <el-option label="升序" value="asc"></el-option>
                  <el-option label="降序" value="desc"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="排序字段">
                <el-select v-model="columnData.defaultSidx" placeholder="请选择排序字段" clearable>
                  <el-option :label="item.__config__.label" :value="item.__vModel__"
                    v-for="(item, i) in groupFieldOptions" :key="i"></el-option>
                </el-select>
              </el-form-item> -->
              <template v-if="columnData.type !== 3">
                <el-form-item label="分页设置">
                  <el-switch v-model="columnData.hasPage"></el-switch>
                </el-form-item>
                <el-form-item label="分页条数" v-if="columnData.hasPage">
                  <el-radio-group v-model="columnData.pageSize" size="mini" style="display:flex">
                    <el-radio-button :label="20">20条</el-radio-button>
                    <el-radio-button :label="50">50条</el-radio-button>
                    <el-radio-button :label="100">100条</el-radio-button>
                    <el-radio-button :label="500">500条</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <form-script :visible.sync="formScriptVisible" :value="currentRow.formatter" :type="currentRow.type"
      @updateScript="updateScript" />
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import draggable from 'vuedraggable'
import FormScript from './FormScript'
import { getDrawingList } from '@/components/Generator/utils/db'
import { noColumnShowList, noSearchList, useInputList, useDateList } from '@/components/Generator/generator/comConfig'
import { getDataInterfaceSelector, getSqlData } from '@/api/systemData/dataInterface'
import { getDictionaryTypeSelector } from "@/api/systemData/dictionary"
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
const getSearchType = item => {
  const jnpfKey = item.__config__.jnpfKey
  // 等于-1  模糊-2  范围-3
  const fuzzyList = [...useInputList]
  const RangeList = [...useDateList, 'time', 'date', 'numInput', 'calculate']
  if (RangeList.includes(jnpfKey)) return 3
  if (fuzzyList.includes(jnpfKey)) return 2
  return 1
}

const defaultFunc = '({ data, index, request, toast, refresh }) => {\r\n   \r\n}'
const defaultFuncs = '({ data, attributes, events, methods, tableRef, request }) => {\r\n   \r\n}'
const defaultFormatter = '(row, column, cellValue, index)=>{\r\n   \r\n}'
const defaultColumnData = {
  searchList: [], // 查询字段
  hasSuperQuery: true, // 高级查询
  customField: [],
  customFieldLine:[],
  searchOptions: [],
  // 增加master 和 slave 
  master: {
    column: '',
    data: '',
    condList: []
  },
  slave: {
    column: '',
    data: '',
    condList: []
  },
  columnList: [], // 字段列表
  searchList: [], // 字段列表
  columnLineList: [], // 明细 字段列表
  columnOptions: [], // 字段列表
  columnLineOptions: [], // 子表sql字段列表
  defaultColumnList: [], // 所有可选择字段列表
  type: 1, //列表类型
  defaultSidx: '', // 默认排序字段
  sort: 'desc',   // 排序类型
  hasPage: true,  // 列表分页
  pageSize: 20,  // 分页条数
  treeTitle: '左侧标题', // 树形标题
  treeDataSource: 'dictionary',  // 树形数据来源
  treeDictionary: '',//数据字典
  treeRelation: '',  // 关联字段
  treePropsUrl: '',  // 数据选择
  treePropsValue: 'id',  // 主键字段
  treePropsChildren: 'children',  // 子级字段
  treePropsLabel: 'fullName',  // 显示字段
  selectClassifyType: '',      // 分类类型
  selectTypeClassifyOptions: [
    {
      value: 'customer',
      label: '客户分类'
    },
    {
      value: 'supplier',
      label: '供应商分类'
    },
    {
      value: 'product',
      label: '产品分类'
    },
  ],
  dateTypeOptions: [
    {
      value: 'daterange',
      label: '日期选择'
    },
    {
      value: 'datetimerange',
      label: '时间选择'
    },
  ],
  groupField: '',  // 分组字段
  useColumnPermission: false,
  useFormPermission: false,
  useBtnPermission: false,
  useDataPermission: false,
  customBtnsList: [],
  btnsList: [
    { value: 'add', icon: 'el-icon-plus', label: '新增' }
  ],  // 按钮
  columnBtnsList: [
    { value: 'edit', icon: 'el-icon-edit', label: '编辑' },
    { value: 'remove', icon: 'el-icon-delete', label: '删除' }
  ], // 列按钮
  funcs: {
    afterOnload: {
      func: "",
      name: "脚本事件"
    }
  },
}
export default {
  name: 'columnDesign',
  props: {
    conf: {
      type: Object,
      default: () => { }
    },
    webType: '',
    modelType: ''
  },
  components: { draggable, FormScript },
  computed: {
    dicOptions() {
      return this.dictionaryOptions
    },
  },
  watch: {
    'currentSearchRow.dictionaryType': function (val) {
      if (!val) {
        currentSearchRow.options = []
        return
      }
      getDictionaryDataSelector(val).then(res => {
        currentSearchRow.options = res.data.list
      })
    }
  },
  data() {
    return {
      currentTab: 'column',
      currentFieldTab: 'indexField',
      alignOptions: ['left', 'center', 'right'],
      list: [],
      searchList: [],
      columnList: [],
      columnLineList: [],
      columnData: JSON.parse(JSON.stringify(defaultColumnData)),
      btnsOption: [
        { value: 'add', icon: 'el-icon-plus', label: '新增' },
        { value: 'download', icon: 'el-icon-download', label: '导出' },
        { value: 'batchRemove', icon: 'el-icon-delete', label: '批量删除' },
      ],
      columnBtnsOption: [
        { value: 'edit', icon: 'el-icon-edit', label: '编辑' },
        { value: 'remove', icon: 'el-icon-delete', label: '删除' },
        { value: 'detail', icon: 'el-icon-tickets', label: '详情' }
      ],
      columnOptions: [],
      searchOptions: [],
      columnLineOptions: [],
      groupFieldOptions: [],
      btnsList: [],
      columnBtnsList: [],
      typeList: [
        { url: require('@/assets/images/generator/columnType1.png'), value: 1, name: '普通表格' },
        { url: require('@/assets/images/generator/columnType2.png'), value: 2, name: '左侧树形+普通表格' },
        // { url: require('@/assets/images/generator/columnType3.png'), value: 3, name: '分组表格' },
        // { url: require('@/assets/images/generator/columnType4.png'), value: 4, name: '编辑表格' },
        { url: require('@/assets/images/generator/columnType2.png'), value: 5, name: '左右表格' },
        { url: require('@/assets/images/generator/columnType5.png'), value: 6, name: '上下表格' },
      ],
      dataInterfaceSelector: [],
      formScriptVisible: false,
      activeItem: {},
      currentRow: {},
      currentSearchRow: {},
      customField: [],
      customFieldLine:[],
      rowSelectFlag:false  // 禁止开关
    }
  },
  filters: {
    btnText(key) {
      let text = ''
      switch (key) {
        case 'download':
          text = '导出'
          break;
        case 'batchRemove':
          text = '批量删除'
          break;
        case 'edit':
          text = '编辑'
          break;
        case 'remove':
          text = '删除'
          break;
        case 'detail':
          text = '详情'
          break;
        default:
          text = '新增'
          break;
      }
      return text
    }
  },
  watch: {
    btnsList(val) {
      let list = []
      outer: for (let i = 0; i < this.btnsOption.length; i++) {
        inter: for (let ii = 0; ii < val.length; ii++) {
          if (val[ii] === this.btnsOption[i].value) {
            list.push(this.btnsOption[i])
            break inter;
          }
        }
      }
      this.columnData.btnsList = list
    },
    columnBtnsList(val) {
      let list = []
      outer: for (let i = 0; i < this.columnBtnsOption.length; i++) {
        inter: for (let ii = 0; ii < val.length; ii++) {
          if (val[ii] === this.columnBtnsOption[i].value) {
            list.push(this.columnBtnsOption[i])
            break inter;
          }
        }
      }
      this.columnData.columnBtnsList = list
    },
  },
  created() {
    this.getDictionaryType()
    this.getDataInterfaceSelector()
    // let list = []
    // const loop = (data, parent) => {
    //   if (!data) return
    //   if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
    //     loop(data.__config__.children, data)
    //   }
    //   if (Array.isArray(data)) data.forEach(d => loop(d, parent))
    //   if (data.__config__ && data.__config__.jnpfKey) {
    //     const visibility = !data.__config__.visibility || (Array.isArray(data.__config__.visibility) && data.__config__.visibility.includes('pc'))
    //     if (data.__config__.layout === "colFormItem" && data.__vModel__ && visibility) {
    //       const isTableChild = parent && parent.__config__ && parent.__config__.jnpfKey === 'table'
    //       const id = isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__
    //       const label = isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label
    //       data.__vModel__ = id
    //       data.__config__.label = label
    //       list.push(data)
    //     }
    //   }
    // }
    // loop(getDrawingList())
    // this.list = list
    // console.log(this.list);
    // this.groupFieldOptions = list.filter(o => o.__vModel__.indexOf('-') < 0)
    if (typeof this.conf === 'object' && this.conf !== null) {
      this.columnData = Object.assign({}, defaultColumnData, this.conf)
    }
    console.log(this.columnData, 'column');
    // 列字段和查询字段 不从表单数据取 
    this.customField = this.columnData.customField
    this.columnOptions = this.columnData.columnOptions
    this.searchOptions = this.columnData.searchOptions
    this.columnLineOptions = this.columnData.columnLineOptions
    this.setBtnValue(this.columnData.btnsList, this.btnsOption)
    this.setBtnValue(this.columnData.columnBtnsList, this.columnBtnsOption)
    this.btnsList = this.columnData.btnsList.map(o => o.value)
    this.columnBtnsList = this.columnData.columnBtnsList.map(o => o.value)


  },
  mounted() {
    this.setSort()
    this.$nextTick(() => {
      console.log(this.searchList);
        let searchList =  JSON.parse(JSON.stringify(this.columnData.searchList))
        let columnList =  JSON.parse(JSON.stringify(this.columnData.columnList))
        let columnLineList =  JSON.parse(JSON.stringify(this.columnData.columnLineList))
        this.columnOptions.forEach(item => this.$refs['columnTable'].toggleRowSelection(item, columnList.some(item2=>item.prop === item2.prop)))
        this.searchOptions.forEach(item =>this.$refs['searchTable'].toggleRowSelection(item, searchList.some(item2=>item.prop === item2.prop)))
        this.columnLineOptions.forEach(item =>this.$refs['columnLineTable'].toggleRowSelection(item, columnLineList.some(item2=>item.prop === item2.prop)))
     
    })
  },
  methods: {
    // 主列
    addFieldItem() {
      this.customField.push({
        label: '',
        prop: '',
        align: 'left',
        jnpfKey: '',
        sortable: false,
        width: null,
        formatter: '',
      })
    },
    saveFieldItem() {
      this.columnOptions = this.customField
      this.searchOptions = this.customField.map(item => {
        return {
          ...item,
          searchType: 1,
        }
      })
    },
    // 子列
    addFieldItemLine() {
      this.customFieldLine.push({
        label: '',
        prop: '',
        align: 'left',
        jnpfKey: '',
        sortable: false,
        width: null,
        formatter: '',
      })
    },
    saveFieldItemLine() {
      this.columnLineOptions = this.customFieldLine
    },
    addSelectItem() {
      this.currentSearchRow.options.push({
        label: '',
        value: ''
      })
    },
    getDictionaryType() {
      getDictionaryTypeSelector().then(res => {
        this.dictionaryOptions = res.data.list
      })
    },
    // 主表 获取sql请求数据
    // getSql() {
    //   let data = {
    //     dataSource: 's_sql',
    //     sourceConfig: this.columnData.master.column,
    //     enableTenant: 0
    //   }
    //   getSqlData(data).then(res => {
    //     console.log(res);
    //     if (res.data) {
    //       this.searchOptions = res.data.map(o => {
    //         return {
    //           label: o.COLUMN_COMMENT,
    //           prop: o.COLUMN_NAME,
    //           jnpfKey: '',
    //           value: '',
    //           searchType: 1,
    //           dataType: 'static',
    //           options: [],
    //           ...o
    //         }
    //       })
    //       this.columnOptions = res.data.map(item => {
    //         return {
    //           ...item,
    //           label: item.COLUMN_COMMENT,
    //           prop: item.COLUMN_NAME,
    //           align: 'left',
    //           jnpfKey: '',
    //           sortable: false,
    //           width: null,
    //           formatter: '',
    //         }
    //       })
    //     }
    //   }).catch(() => { })
    // },
    // 子表获取sql数据
    // getLineSql() {
    //   let data = {
    //     dataSource: 's_sql',
    //     sourceConfig: this.columnData.slave.column,
    //     enableTenant: 0
    //   }
    //   getSqlData(data).then(res => {
    //     console.log(res);
    //     if (res.data) {
    //       this.columnLineOptions = res.data.map(item => {
    //         return {
    //           ...item,
    //           label: item.COLUMN_COMMENT,
    //           prop: item.COLUMN_NAME,
    //           align: 'left',
    //           jnpfKey: '',
    //           sortable: false,
    //           width: null,
    //           formatter: '',
    //         }
    //       })
    //     }
    //   }).catch(() => { })
    // },
    // 列属性 内容选择事件
    handleCurrentChange(val) {
      if (!val) return
      this.currentRow = val
      this.currentTab = 'culumnSet'
      this.$refs['dragTable'].toggleRowSelection(val, true)
    },
    // 查询属性 内容选择事件
    handleSeachChange(val) {
      console.log(111);
      if (!val) return
      this.currentSearchRow = val
      console.log(this.currentSearchRow, ' this.currentSearchRow');

      this.currentTab = 'searchSet'
      this.$refs['dragTableSearch'].toggleRowSelection(val, true)
    },
    setBtnValue(replacedData, data, key) {
      key = key ? key : 'value'
      outer: for (let i = 0; i < replacedData.length; i++) {
        inter: for (let ii = 0; ii < data.length; ii++) {
          if (replacedData[i][key] === data[ii][key]) {
            data[ii] = replacedData[i]
            break inter
          }
        }
      }
    },
    setListValue(replacedData, data, type) {
      const key = type === 'column' ? 'prop' : '__vModel__'
      let res = []
      outer: for (let i = 0; i < replacedData.length; i++) {
        inter: for (let ii = 0; ii < data.length; ii++) {
          if (replacedData[i][key] === data[ii][key]) {
            if (type === 'column') {
              data[ii].align = replacedData[i].align
              data[ii].width = replacedData[i].width
              data[ii].sortable = replacedData[i].sortable
            }
            if (type === 'search') {
              data[ii].searchType = replacedData[i].searchType
            }
            res.push(data[ii])
            break inter
          }
        }
      }
      res.forEach(row => {
        this.$refs[type + 'Table'].toggleRowSelection(row, true)
      })
    },
    /**
      * 供父组件使用 获取列表JSON
    */
    getData() {
      if (!this.columnData.columnList.length) return this.$message.warning('列表字段不允许为空')
      if (this.columnData.type == 2) {
        if (this.columnData.treeDataSource === 'dictionary' && !this.columnData.treeDictionary) return this.$message.warning('请选择数据字典')
        if (this.columnData.treeDataSource === 'api') {
          if (!this.columnData.treePropsValue) return this.$message.warning('请输入主键字段')
          if (!this.columnData.treePropsLabel) return this.$message.warning('请输入显示字段')
          if (!this.columnData.treePropsChildren) return this.$message.warning('请输入子级字段')
        }
        if (!this.columnData.treeRelation) return this.$message.warning('请选择关联字段')
      }
      if (this.columnData.type == 3) {
        if (!this.columnData.groupField) return this.$message.warning('请选择分组字段')
      }
      this.$set(this.columnData, 'customField', this.customField)
      this.$set(this.columnData, 'columnOptions', this.columnOptions)
      this.$set(this.columnData, 'searchOptions', this.searchOptions)
      this.$set(this.columnData, 'columnLineOptions', this.columnLineOptions)
      this.columnData.defaultColumnList = this.columnOptions.map(o => ({
        ...o,
        checked: this.columnData.columnList.some(i => i.prop === o.prop)
      }))
      return this.columnData
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.columnData.columnList.splice(evt.oldIndex, 1)[0]
          this.columnData.columnList.splice(evt.newIndex, 0, targetRow)
        },
        handle: '.drag-handler',
      })
      const el2 = this.$refs.dragTableSearch.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      Sortable.create(el2, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.columnData.searchList.splice(evt.oldIndex, 1)[0]
          this.columnData.searchList.splice(evt.newIndex, 0, targetRow)
        },
        handle: '.drag-handler',
      })
    },
    searchSelectionChange(val) {
      this.$set(this.columnData, 'searchList', val)
    },
    columnSelectionChange(val) {
      this.$set(this.columnData, 'columnList', val)
    },
    columnLIneSelectionChange(val) {
      this.$set(this.columnData, 'columnLineList', val)
    },
    getDataInterfaceSelector() {
      getDataInterfaceSelector().then(res => {
        this.dataInterfaceSelector = res.data
      })
    },
    dataTypeChange() {
      this.columnData.treePropsValue = 'id'
      this.columnData.treePropsChildren = 'children'
      this.columnData.treePropsLabel = 'fullName'
    },
    addCustomBtn() {
      const id = this.jnpf.idGenerator()
      this.columnData.customBtnsList.push({
        value: 'btn_' + id,
        label: '按钮' + id,
        func: ''
      })
    },
    editFunc(item, type) {
      if (!item.formatter) item.formatter = defaultFormatter
      this.currentRow = item
      this.$nextTick(() => {
        this.formScriptVisible = true
      })
    },
    updateScript(func) {
      this.currentRow.formatter = func
    },

    addFunc(item, type) {
      if (!item.formatter) item.formatter = defaultFormatter
      this.currentRow = item
      this.$nextTick(() => {
        this.formScriptVisible = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>