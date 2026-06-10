<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>物料分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
            <span class="text" :title="data.name">{{ `${data.fullCode} - ${data.name}` }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.drawingNo" placeholder="请输入型号" clearable @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.productStatus" placeholder="请选择产品状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in productStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addSupplier()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable"  customKey="JNPFTableKey_981718">
          <el-table-column prop="code" label="产品编码" min-width="140" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, true)">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="产品名称" min-width="140" fixed="left" sortable="custom" />
          <el-table-column prop="drawingNo" label="型号" min-width="600" sortable="custom" />
          <el-table-column prop="spec" label="规格型号" width="120" sortable="custom" />
          <el-table-column prop="inspectionMethod" label="检验方式" width="120">
            <template slot-scope="{row}">
              <template v-if="row.inspectionMethod == 'exempt'">免检</template>
              <template v-else-if="row.inspectionMethod == 'spot_check'">抽检</template>
              <template v-else-if="row.inspectionMethod == 'all'">全检</template>
            </template>
          </el-table-column>
          <el-table-column prop="spotCheckRatio" label="抽检比例(%)" width="120" />
          <el-table-column prop="productCategoryIdText" label="物料分类" width="120" sortable="custom" />
          <el-table-column prop="mainUnit" label="主单位" width="120" />
          <el-table-column prop="deputyUnit" label="副单位" width="120" />
          <el-table-column prop="ratio" label="转换系数" width="120" />
          <el-table-column prop="calculationDirection" label="计算方向" width="120">
            <template slot-scope="{row}">
              <template v-if="row.calculationDirection == 'multiplication'">乘</template>
              <template v-else-if="row.calculationDirection == 'division'">除</template>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="defaultWarehouseIdText" label="默认仓库" width="120" sortable="custom" /> -->
          <el-table-column prop="materialQualityText" label="材质" width="180" sortable="custom" />
          <el-table-column prop="barCode" label="条形码" width="180" sortable="custom" />
          <el-table-column prop="productSource" label="产品来源" width="120" sortable="custom">
            <template slot-scope="{row}">
              <template v-if="row.productSource == 'produce'">自制</template>
              <template v-else-if="row.productSource == 'purchase'">采购</template>
              <template v-else-if="row.productSource == 'out'">外协</template>
            </template>
          </el-table-column>
          <el-table-column prop="extent" label="长(cm)" width="120" />
          <el-table-column prop="width" label="宽(cm)" width="120" />
          <el-table-column prop="height" label="高(cm)" width="120" />
          <el-table-column prop="netWeight" label="净重" width="120" />
          <el-table-column prop="grossWeight" label="毛重" width="120" />
          <el-table-column prop="unitVolume" label="单位体积" width="120" />
          <el-table-column prop="safeInventory" label="安全库存" width="120" sortable="custom" />
          <el-table-column prop="minInventory" label="最小库存" width="120" sortable="custom" />
          <el-table-column prop="maxInventory" label="最大库存" width="120" sortable="custom" />
          <el-table-column prop="shoulderLength" label="夹肩长" width="120" />
          <!-- <el-table-column prop="purchasePrice" label="销售牌价" width="120" /> -->
          <!-- 列表中显示的自定义属性 -->
          <el-table-column v-for="item in customList" :key="item.prop" :prop="item.prop" :label="item.label"
            min-width="180" :formatter="filterateLabel" />
          <el-table-column prop="createTime" label="录入日期" width="180" sortable="custom" />
          <el-table-column prop="updateTime" label="修改日期" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="录入人" min-width="120" />
          <el-table-column prop="updateByName" label="修改人" min-width="120" />
          <el-table-column prop="productStatus" label="产品状态" width="120" sortable="custom" fixed="right" align="center">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.productStatus == 'enable'">启用</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.productStatus == 'disabled'">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId)"
                @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, true)">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleLookBom(scope.row.id)">
                      查看BOM引用
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入日期">
              <el-date-picker v-model="listQuery.startAndEndTime" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择录入开始日期" end-placeholder="请选择录入结束日期"
                :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品来源">
              <el-select v-model="listQuery.productSource" placeholder="请选择产品来源" clearable style="width: 100%;">
                <el-option v-for="item in productSourceList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品状态">
              <el-select v-model="listQuery.productStatus" placeholder="请选择产品状态" clearable style="width: 100%;">
                <el-option v-for="item in productStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-for="(item, index) in searchList" :key="item.prop">
            <el-form-item :label="item.label">
              <el-input v-if="item.type === 'text'" v-model="listQuery.customerQueryFields[index]['attributeValue']"
                :placeholder="'请输入' + item.label" clearable />

              <el-select v-else-if="item.type === 'select'"
                v-model="listQuery.customerQueryFields[index]['attributeValue']" :placeholder="'请选择' + item.label"
                style="width: 100%;" clearable>
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

              <el-select v-else-if="item.type === 'multiple'"
                v-model="listQuery.customerQueryFields[index]['attributeValue']" :placeholder="'请选择' + item.label"
                clearable style="width: 100%;" multiple>
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>
    <!-- 查看BOM引用 -->
    <el-dialog title="查看BOM引用" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="bomVisibled"
      lock-scroll class="JNPF-dialog JNPF-dialog_center bomDialog" width="1000px">
        <JNPF-table ref="bomTableData" v-loading="bomListLoading" :data="bomTableData" border height="600" customKey="JNPFTableKey_743140">
          <el-table-column prop="productCode" label="产品编码" /> 
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column prop="drawNo" label="产品图号" min-width="180" />
          <el-table-column label="操作" width="90" fixed="right">
            <template slot-scope="scope">
              <tableOpts editText="查看BOM" @edit="lookBomLine(scope.row.productId)" :hasDel="false">
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="bomTotal" :page.sync="bomListQuery.pageNum" :background="background"
          :limit.sync="bomListQuery.pageSize" @pagination="bomData" />
    </el-dialog>
    <ProductionBom v-if="bomFormVisibled" ref="ProductionBom" @close="bomFormClose" />
  </div>
</template>

<script>

import { getProductList, deleteProductData, getDynamicConditions ,bomProductData} from '@/api/basicData/materialFiles'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from './Form'
import ProductionBom from '@/views/basicData/bomSettings/productionBom/Form.vue'
export default {
  components: { Form ,ProductionBom},
  data() {
    return {
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      userRelationListVisible: false,
      listQuery: {
        code: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        drawingNo: "", // 图号
        productSource: "", // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: "", // 类型id
        productStatus: "", // 产品状态
        customerQueryFields: [],
        showExtra: true
      },
      productStatusList: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], // 产品状态
      productSourceList: [{ label: "自制", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }], // 产品来源
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      customList: [], // 列表中显示的自定义属性
      searchList: [], // 作为搜索条件的自定义属性
      customerQueryFields: [], // 保存作为查询条件的自定义属性，防止reset时被清掉
      attributeLines: [],
      bomVisibled:false, // bom 引用列表
      bomTableData:[], // bom 引用列表data
      bomTotal:0,
      bomListLoading:false,
      bomListQuery:{
        productsId:"",
        pageNum: 1,
        pageSize: 20,
      },
      bomFormVisibled:false,
    }
  },
  created() {
    this.getcategoryTree()
    this.getDynamicConditions()
  },
  methods: {
    // 获取动态搜索条件
    getDynamicConditions() {
      getDynamicConditions({
        classAttribute: "material",
        pageNum: 1,
        pageSize: -1,
        type: 1
      }).then(res => {
        this.attributeLines = res.data
        res.data.forEach((item) => {
          let options = []
          if (item.attributeItemName) {
            let nameList = item.attributeItemName.split(',')
            let valList = item.attributeItemVal.split(',')
            nameList.forEach((item2, index2) => { options.push({ label: nameList[index2], value: valList[index2] }) })
          }
          // 添加动态搜索元素（过滤重复attributeColumn的项）
          let propExists = this.searchList.some(item2 => item2.prop === item.attributeColumn);
          if (!propExists) { this.searchList.push({ prop: item.attributeColumn, label: item.name, type: item.type, value: "", options }) }
          // 向列表请求参数添加自定义搜索条件
          this.customerQueryFields.push({ attributeColumn: item.attributeColumn, attributeValue: "", })
        })
        this.listQuery.customerQueryFields = JSON.parse(JSON.stringify(this.customerQueryFields))
      })
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取指定树状列表
    getcategoryTree() {
      function getQueryString(name) {
        const url_string = location.href;
        const url = new URL(url_string);
        return url.searchParams.get(name) || void(0);
      }
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = "" // 重置数据类型id筛选
      this.listQuery.productCategoryCode =  getQueryString('productCategoryCode')
      getcategoryTree({ classAttribute: "material", code: getQueryString('productCategoryCode') }).then(res => {
        this.treeData = res.data.length ? res.data[0].childrenList : []
        this.$nextTick(() => {
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
        this.listLoading = false
      })
    },
    initData() {
      // 根据column获取type
      function getTypeByColumn(array, value) {
        for (let i = 0; i < array.length; i++) {
          let obj = array[i];
          if (obj.attributeColumn === value) { return obj.type; }
        }
        return null
      }
      // 根据column和值获取键
      function getKeyByValueAndColumn(array, value, prop) {
        const obj = array.find(item => item.prop === prop);
        if (obj) {
          const option = obj.options.find(po => po.value === value);
          return option ? option.label : null;
        }
        return null
      }
      // 自定义属性进行排序与排空
      function sortMethod(fields) {
        let newFields = fields.filter(item => (item.attributeValue !== "" && item.attributeValue !== "[]"))
        newFields.forEach(item => {
          const attributeValue = item.attributeValue;
          const keyValuePairs = attributeValue.split(',').map(item => item.split(':'));
          const sortedKeyValuePairs = keyValuePairs.sort((a, b) => a[1].charCodeAt() - b[1].charCodeAt());
          const sortedData = sortedKeyValuePairs.map(item => item.join(':')).join(',');
          item.attributeValue = sortedData;
        })
        return newFields
      }
      this.listLoading = true
      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + " 00:00:00"
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ""
        this.listQuery.endTime = ""
      }

      let listQuery = JSON.parse(JSON.stringify(this.listQuery))
      listQuery.customerQueryFields.forEach(item => {
        if (Array.isArray(item.attributeValue)) { item.attributeValue = JSON.stringify(item.attributeValue) }
        item.type = getTypeByColumn(this.attributeLines, item.attributeColumn) // 根据Column获取type

        if (item.type === 'select' && item.attributeValue) {
          let label = getKeyByValueAndColumn(this.searchList, item.attributeValue, item.attributeColumn);
          item.attributeValue = `${label}:${item.attributeValue}`
        } else if (item.type === 'multiple' && item.attributeValue) {
          let tempAttributeValue = ""
          let temp = JSON.parse(item.attributeValue)
          temp.forEach(valueItem => {
            let label = getKeyByValueAndColumn(this.searchList, valueItem, item.attributeColumn);
            if (!!tempAttributeValue) tempAttributeValue += ","
            tempAttributeValue += `${label}:${valueItem}`
          })
          item.attributeValue = tempAttributeValue
        }
      })
      listQuery.customerQueryFields = sortMethod(listQuery.customerQueryFields)
      getProductList(listQuery).then(res => {
        this.customList = []
        res.data.columnShowList.forEach(column => {
          // 列表中显示
          let propExists = this.customList.some(item2 => item2.prop === column.attributeColumn);
          if (!propExists) { this.customList.push({ prop: column.attributeColumn, label: column.name }) }
        })
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        code: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        drawingNo: "", // 图号
        productSource: "", // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: "", // 类型id
        productStatus: "", // 产品状态
        customerQueryFields: JSON.parse(JSON.stringify(this.customerQueryFields))
      }
      // this.search()
      this.getcategoryTree()
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code
      this.search()
    },
    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init()
      })
    },
    addOrUpdateHandle(id, parentId) {
      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.Form.init(id)
        })
      }
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteProductData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    // 只保留label
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },
    // bom引用
    handleLookBom(id){
      this.bomListQuery.productsId = id
      this.bomData()
    },
    bomData(){
      this.bomVisibled = true
      this.bomListLoading = true
      bomProductData(this.bomListQuery).then(res => {
        this.bomTableData = res.data.records
        this.bomTotal = res.data.total
        this.bomListLoading = false
      }).catch(() => {
        this.bomListLoading = false
      })
    },
    // 查看bom详情
    lookBomLine(id){
      this.bomFormVisibled = true
      this.bomVisibled = false
      this.$nextTick(()=>{
        this.$refs.ProductionBom.init(id,'look')
      })
    },
    bomFormClose(){
      this.bomFormVisibled = false
      this.bomData()
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
  ::v-deep .JNPF-dialog.bomDialog .el-dialog .el-dialog__body{
    padding: 10px 20px !important;
  }
</style>