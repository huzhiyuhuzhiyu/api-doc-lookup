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
              <el-input v-model="listQuery.drawingNo" placeholder="请输入产品图号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <!-- <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addSupplier()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div> -->
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable" >
          <el-table-column prop="code" label="产品编码" min-width="200">
            <!-- <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, true)">
                {{ scope.row.code }}
              </el-link>
            </template> -->
          </el-table-column>
          <el-table-column prop="name" label="产品名称" width="200" sortable="custom"/>
          <el-table-column prop="drawingNo" label="产品图号" width="200" sortable="custom" />
          <el-table-column prop="spec" label="规格型号" width="200"/>
          <el-table-column prop="productCategoryIdText" label="产品分类" width="150" />
          <el-table-column prop="mainUnit" label="主单位" width="120" />
          <el-table-column prop="deputyUnit" label="副单位" width="120" />
          <el-table-column prop="ratio" label="转换系数" width="120" />
          <el-table-column prop="calculationDirection" label="计算方向" width="120">
            <template slot-scope="{row}">
              <template v-if="row.calculationDirection == 'multiplication'">乘</template>
              <template v-else-if="row.calculationDirection == 'division'">除</template>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"/>
          <!-- <el-table-column prop="productStatus" label="产品状态" width="120"/> -->
          <!-- <el-table-column prop="productStatus" label="产品状态" width="120" sortable="custom" disable-transitions v-if="row.productStatus == 'enable'">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.productStatus == 'enable'">启用</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.productStatus == 'disabled'">禁用</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="minInventory" label="最低库存" width="120"/>
          <el-table-column prop="maxInventory" label="最高库存" width="120"/>
          <el-table-column prop="safeInventory" label="安全库存" width="120"/>
         
         
          
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color:#ff3a3a" @click="addOrUpdateHandle(scope.row.id)" size="mini">设置库存</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
  </div>
</template>

<script>

import { getProductkcList, getDynamicConditions } from '@/api/basicData/materialFiles'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from './Form'
export default {
  name: 'finishProduct',
  components:{Form},
  data() {
    return {
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      depFormVisible:false,
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
      customerQueryFields: [], //保存作为查询条件的自定义属性，防止reset时被清掉
      attributeLines: []
    }
  },
  created() {
    this.getcategoryTree()
    // this.getDynamicConditions()
  },
  methods: {
    // 获取动态搜索条件
    // getDynamicConditions() {
    //   getDynamicConditions({
    //     classAttribute: "raw_material",
    //     pageNum: 1,
    //     pageSize: -1,
    //     type: 1
    //   }).then(res => {
    //     this.attributeLines = res.data
    //     res.data.forEach((item) => {
    //       let options = []
    //       if (item.attributeItemName) {
    //         let nameList = item.attributeItemName.split(',')
    //         let valList = item.attributeItemVal.split(',')
    //         nameList.forEach((item2, index2) => { options.push({ label: nameList[index2], value: valList[index2] }) })
    //       }
    //       // 添加动态搜索元素（过滤重复attributeColumn的项）
    //       let propExists = this.searchList.some(item2 => item2.prop === item.attributeColumn);
    //       if (!propExists) { this.searchList.push({ prop: item.attributeColumn, label: item.name, type: item.type, value: "", options }) }
    //       // 向列表请求参数添加自定义搜索条件
    //       this.customerQueryFields.push({ attributeColumn: item.attributeColumn, attributeValue: "", })
    //     })
    //     this.listQuery.customerQueryFields = JSON.parse(JSON.stringify(this.customerQueryFields))
    //   })
    // },
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
      this.listLoading = true
      this.treeLoading = true
      function getQueryString(name) {
        const url_string = location.href;
        const url = new URL(url_string);
        return url.searchParams.get(name) || void(0);
      }
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
      getProductkcList(listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1 // 重置页码
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
    addOrUpdateHandle(id) {
      this.addOrUpdateDep(id)
    },
    addOrUpdateDep(id) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id)
      })
    },
    closeDepForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    // handleUserRelation(id, btnType) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.Form.init(id, btnType)
    //   })
    // },
  }
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}
::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__header{
  margin-bottom: 20px;
}
::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body{
  padding: 0px 50px 2px 10px;
}
.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
