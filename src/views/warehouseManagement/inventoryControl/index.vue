<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2>产品分类</h2>
          <span class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div>
          <el-input placeholder="输入关键字" v-model="filterText" suffix-icon="el-icon-search" clearable
            style="width:200px;margin:10px auto;display:block" />
        </div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode" v-model="selectedKeys">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
  
        
          <template v-for="item in searchList">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="search('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>


          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">{{ $t('common.search')
                }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main"  v-loading="listLoading" >
        <div class="JNPF-common-head" style="padding:6px 10px">
          <el-button icon="el-icon-s-tools" type="primary" size="mini" @click="setStock">设置库存</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table :data="tableData" custom-column fixedNO @sort-change="sortChange" v-if="isProjectSwitchFlag"
          @selection-change="handleSelectionChange" hasC ref="dataTable" :setColumnDisplayList="columnList">
          <el-table-column prop="drawingNo" label="品名规格" min-width="160" sortable="custom" />
          <!-- 这里的 width 会被转成 min-width -->
          <el-table-column prop="code" label="产品编码" min-width="120" sortable="custom">
          </el-table-column>
          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
          v-if="isProjectSwitch == 1" />
          <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位" width=" 80" />
          <el-table-column prop="safeInventory" label="安全库存" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-input v-model="scope.row.safeInventory" @focus="safeInventoryFocusFun(scope.row)"
                @blur="safeInventoryBlurFun(scope.row, scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="maxInventory" label="最高库存" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-input v-model="scope.row.maxInventory" @focus="maxInventoryFocusFun(scope.row)"
                @blur="maxInventoryBlurFun(scope.row, scope.$index)"></el-input>
            </template>
          </el-table-column>

         
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <el-dialog title='设置库存' :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="inventoryVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-width="120px">
        <el-form-item label="安全库存" prop="safeInventory">
          <el-input v-model.trim="dataForm.safeInventory" placeholder="请输入安全库存" maxlength="20" />
        </el-form-item>
        <el-form-item label="最高库存" prop="maxInventory">
          <el-input v-model.trim="dataForm.maxInventory" placeholder="请输入最高库存" maxlength="20" />
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inventoryVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交</el-button>
      </span>
    </el-dialog>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>
<script>
import { getcategoryTree, batchUpdataProductIncentory } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  updateUserState,
  unlockUser,
  delUser,
  getUserListPost
} from '@/api/permission/user'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'permission-user',
  components: {
    SuperQuery
  },
  mixins: [getProjectList],
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'code', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryVisible: false,
      formLoading: false,
      btnLoading: false,
      linesQuery: {},
      dataForm: {
        maxInventory: "",
        safeInventory: ""
      },
      selectedKeys: [],
      ProductTreeData: [],
      ProductMethodArr: [
        { label: "产品分类", classAttribute: "", method: getcategoryTree, requeseObj: { classAttribute: "" } },
      ],
      columnList: ["name"],
      filterText: "",
      tableData: [],
      treeLoading: false,
      listLoading: true,
      total: 0,
      type: '',
      visible: false,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expands: true,
      filteredTree: [],
      selectArr: [],
      leftFlag: false,
      dataRule: {
        maxInventory: [
          { required: true, message: '最高库存不能为空', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, '请输入正确的库存(最多保留2位小数,整数8位)'] }), trigger: 'blur' }
        ],
        safeInventory: [
          { required: true, message: '安全库存不能为空', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, '请输入正确的库存(最多保留2位小数,整数8位)'] }), trigger: 'blur' }
        ],
      }
      ,
      treeData: [],
      initListQuery: {
        productDrawingNo: '',
        productCode: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        }
      },

      superQueryJson: [
        {
          prop: 'drawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'code',
          label: "产品编码",
          type: 'input'
        },

        {
          prop: 'productCategoryName',
          label: "产品分类",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'safeInventory',
          label: "安全库存",
          type: 'input'
        },
        {
          prop: 'maxInventory',
          label: "最高库存",
          type: 'input'
        },

      



      ],
      listQuery: {},
      inventoryVisible: false,
      safeInventory: "",
      maxInventory:"",
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }

  },

   
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag = true
    this.getcategoryTree()
    this.superForm=this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
  }, 
  methods: {
    safeInventoryFocusFun(row) {
      this.safeInventory = JSON.parse(JSON.stringify(row.safeInventory))
    },
    safeInventoryBlurFun(row, index) {
      let arr = []
      if(this.safeInventory==row.safeInventory) return
      if (row.safeInventory) {
        arr.push(row)
        batchUpdataProductIncentory(arr).then(res => {
          this.$message.success("安全库存设置成功")
          this.initData()

        })
      } else {
        this.$message.error("安全库存不能为空")
        this.tableData[index].safeInventory = this.safeInventory
      }
    },
    maxInventoryBlurFun(row, index) {
      let arr = []
      if(this.maxInventory==row.maxInventory) return
      if (row.maxInventory) {
        arr.push(row)
        batchUpdataProductIncentory(arr).then(res => {
          this.$message.success("最高库存设置成功")
          this.initData()

        })
      } else {
        this.$message.error("最高库存不能为空")
        this.tableData[index].maxInventory = this.maxInventory
      }
    },
    maxInventoryFocusFun(row) {
      this.maxInventory = JSON.parse(JSON.stringify(row.maxInventory))

    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    // 获取指定树状列表
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.initListQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({ classAttribute: '',type:"material" })
        .then((res) => {
          this.treeData = res.data.length ? res.data : []
          this.$nextTick(() => {
            this.treeLoading = false
            this.search('basic')
          })
        })
        .catch(() => {
          this.treeLoading = false
          this.listLoading = false
        })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.selectArr.forEach(item => {
            item.safeInventory = this.dataForm.safeInventory
            item.maxInventory = this.dataForm.maxInventory
          });
          this.btnLoading = true
          this.formLoading = true
          batchUpdataProductIncentory(this.selectArr).then(res => {
            this.$message.success("设置成功")
            this.inventoryVisible = false
            this.btnLoading = false
            this.formLoading = false
            this.dataForm = {
              safeInventory: "",
              maxInventory: "",
            }
            this.initData()
          })

        }
      })
    },

    setStock() {
      if (!this.selectArr.length) return this.$message.error("请选择产品")
      this.inventoryVisible = true
    },

    // 获取所有产品列表数据
    initData() {
      this.listLoading = true
      getProducts(this.listQuery).then(res => {
        this.tableData = res.data.records.length ? res.data.records : []
        this.total = res.data.total ? res.data.total : 0
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      }).catch(error=>{
        this.treeLoading = false
        this.listLoading = false
      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    getOrganizeList() {
      this.reset()
    },
    // // 设置默认展开
    setexpand(expands) {
      console.log("expands", expands);
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("inventoryControllag", expands)

      })
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    search(type) {
      this.visible = false
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.filterText=""
      this.$refs.SuperQuery.conditionList = []
      this.superForm=this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.selectedKeys = [];
      this.searchList=[
      { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      { field: 'code', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
      ],
      this.initData()
    },

    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          // this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    filterNode(value, data) {
      return !value || data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    filterNodes(node) {
      let matched = this.filterNode(this.filterText, node);
      if (!matched && node.children) {
        node.children = node.children.filter(childNode => {
          const matchedChild = this.filterNodes(childNode);
          return matchedChild;
        });
        matched = node.children.length > 0;
      }
      return matched;
    },
    filterTree() {
      if (!this.filterText) {
        // 如果搜索框内容为空，展示全部树形结构数据
        this.filteredTree = this.treeData;
        return;
      }
      const filteredTreeData = JSON.parse(JSON.stringify(this.treeData));
      this.filteredTree = filteredTreeData.filter(node => {
        return this.filterNodes(node);
      });
    },


    handleNodeClick(data, node) {
      console.log("data", data, node);
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code

      this.search()
    },





    handleResetPwd(id, account) {
      this.resetFormVisible = true
      this.$nextTick(() => {
        this.$refs.ResetPwdForm.init(id, account, 'single')
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop == 'safeInventory' || prop == 'maxInventory' || prop == 'drawingNo') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      else newProp =  prop
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
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

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.JNPF-common-head {
  padding: 8px !important
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

::v-deep .el-tabs__item {
  padding: 0 10px;
}

.title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
