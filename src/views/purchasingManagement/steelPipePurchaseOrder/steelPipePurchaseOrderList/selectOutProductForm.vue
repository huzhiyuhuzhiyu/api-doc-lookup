<template>
  <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

       <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-left">
    <div class="JNPF-common-title">
      <h2>产品分类</h2>
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
      <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct" class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
        <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
          <i :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
          <span class="text" :title="data.name">{{ data.name }}</span>
        </span>
      </el-tree>
    </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main">
    <el-row class="JNPF-common-search-box" :gutter="16">
      <el-form @submit.native.prevent>
        <el-col :span="6" v-if="abProjectSwitchVisible">
          <el-form-item>
            <el-select v-model="outProductObj.projectId" placeholder="请选择所属项目" style="width: 100%;" filterable
       >
        <el-option v-for="item in projectIdData" :key="item.id" :label="item.name"
          :value="item.id"></el-option>
      </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input @keyup.native.enter="searchAllProduct()"  v-model="outProductObj.productCode" placeholder="请输入产品编码" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-input @keyup.native.enter="searchAllProduct()"  v-model="outProductObj.productDrawingNo" placeholder="请输入型号" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
              {{ $t('common.search') }}</el-button>
            <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{
              $t('common.reset')
            }}
            </el-button>
          </el-form-item>
        </el-col>

      </el-form>
    </el-row>
    <div class="JNPF-common-layout-main JNPF-flex-main">
      <JNPF-table v-loading="listLoading" :data="allproductData"  ref="dataTable" @row-click="handleRowClick" customKey="JNPFTableKey_9031478680">
        <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="产品名称" width="160"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="drawingNo" label="型号" />
        <el-table-column prop="productCategoryName" label="所属分类" />
        <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="abProjectSwitchVisible" />
        <el-table-column prop="mainUnit" label="单位" />
        <el-table-column prop="inventoryQuantity" label="库存数量">
          <template slot-scope="scope">
            <el-link type="primary" @click.native="viewFun(scope.row, 'inventoryFlag')">
              {{ scope.row.inventoryQuantity }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" >
              <template slot-scope="scope" >
                <el-button type="text" @click="selectFun(scope.row)">选择</el-button>
              </template>
            </el-table-column>
      </JNPF-table>
      <pagination :total="allProductTotal" :page.sync="outProductObj.pageNum" :limit.sync="outProductObj.pageSize" @pagination="initData2" />
    </div>
      </div>
      </div>

    </el-dialog>
</template>

<script>
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表
export default {
  data() {
    return {
     listLoading:false,
      treeLoading:false,
      allProductTotal:0,
      allproductData:[],
        ProductTreeData: [],
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      allProVisible:false,
      outProductObj: {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        saleFlag: true,
        projectId:"",
        productStatus: 'enable',
        productCode: "",
        productName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
    outproductMethodArr: [
        {
          label: "产品分类", classAttribute: "", method: productTree, requeseObj: {
            classAttribute: "", type: "material",
          }
        },
      ],
    }
  },
  methods: {
    init(){
      this.addProduct()
    },
       // 查看库存明细
    viewFun(row) {
      this.productVisible = true
      this.$set(row,'productsId',row.id)
      this.$nextTick(() => {
        this.$refs.Form.init(row, 'inventoryFlag', "", row.projectId)
      })
    },
    selectFun(row) {
      this.allProVisible = false
      this.$emit('selectFun',row)
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
       // 点击选择产品
    addProduct() {
         console.log(555);
      this.allProVisible = true
      let arr = [];
      this.outProductObj = {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        queryType: 2,
        productStatus: 'enable',
        saleFlag: true,
        projectId:'',
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      if (this.abProjectSwitchVisible) {
        console.log(this.userInfo,'ss')
        this.outProductObj.projectId = this.userInfo.userProjectId
      }
      this.allproductData = []
      let successTotal = 0;
      let tempTreeData = [...this.outproductMethodArr]
      this.outproductMethodArr.forEach((item, index) => {
        item.method(item.requeseObj).then(res => {
          if (Array.isArray(res.data)) {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data
            }
          } else {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data.records
            }
          }
          if ((++successTotal) === this.outproductMethodArr.length) {
            this.ProductTreeData = tempTreeData
            this.initData2()
          }
        })
      });

    },
    // 获取所有产品列表数据
    initData2() {
      this.listLoading = true

      getProducts(this.outProductObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.outProductObj.pageNum = 1
      this.initData2()
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.outProductObj = {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        saleFlag: true,
        projectId:"",
        productCode: "",
        productName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      if (this.abProjectSwitchVisible) {
        console.log(this.userInfo,'ss')
        this.outProductObj.projectId = this.userInfo.userProjectId
      }
        this.searchAllProduct()
    },
    handleNodeAllProduct(data, node) {
      if (this.outProductObj.productCategoryId === data.id) return
      this.outProductObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.outProductObj.classAttribute = data.classAttribute
      this.searchAllProduct()
    },
    getNodePathProduct(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
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

  },

}
</script>
