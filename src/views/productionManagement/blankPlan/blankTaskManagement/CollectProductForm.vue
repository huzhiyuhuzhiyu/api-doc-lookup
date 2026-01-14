<template>


  <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-left">
        <div class="JNPF-common-title">
          <h2>产品分类</h2>
          <span class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openSeleceProductDialog()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>

        <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
          <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands"
            highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct"
            class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
            <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
              <i
                :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
              <span class="text" :title="data.name">{{ data.name }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.code" placeholder="请输入产品编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isProductNameSwitch==1">
              <el-form-item>
                <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.name" placeholder="请输入产品名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入型号" clearable />
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
          <JNPF-table v-loading="listLoading" :data="allproductData" hasC
            @selection-change="handleSelectionChangeAllPruduct" ref="dataTable" @row-click="handleRowClick" customKey="JNPFTableKey_968410">
            <el-table-column prop="code" label="产品编码"></el-table-column>
            <el-table-column prop="name" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drawingNo" label="型号" />
            <el-table-column prop="productCategoryName" label="产品分类" />
            <el-table-column prop="projectName" label="所属项目" min-width="120"   v-if="isProjectSwitch == 1" />

          </JNPF-table>
          <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
            :limit.sync="ProductListRequestObj.pageSize" @pagination="initData2" />
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="allProVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
        确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { detailProcess, getProcessList } from '@/api/basicData/processSettingss.js'
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  data() {
    return {

      allProVisible: false,
      ProductMethodArr: [
        { label: "产品分类", classAttribute: "", method: productTree, requeseObj: { classAttribute: "" } },
      ],
      allproductData: [],
      allProductTotal: 0,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      ProductTreeData: [],
      expands: true,
      refreshTree: true,
      ProductListRequestObj: {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        productStatus: 'enable',
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
      },
      isProjectSwitch: "",
      isProductNameSwitch:"",
      id:"",
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')

  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
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

      })
    },
    init(id) {
      this.allProVisible = true
      this.id=id
      this.openSeleceProductDialog()
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {

      let arr = [];
      this.ProductListRequestObj = {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        queryType: 2,
        productStatus: 'enable',
        projectId:this.id || '',
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
      this.allproductData = []
      let successTotal = 0;
      let tempTreeData = [...this.ProductMethodArr]
      this.ProductMethodArr.forEach((item, index) => {
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
          if ((++successTotal) === this.ProductMethodArr.length) {
            this.ProductTreeData = tempTreeData
            this.initData2()
          }
        })
      });


    },
    // 获取所有产品列表数据
    initData2() {
      this.listLoading = true

      getProducts(this.ProductListRequestObj).then(listRes => {
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
      this.ProductListRequestObj.pageNum = 1
      this.initData2()
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.ProductListRequestObj = {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,

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
      },
        this.searchAllProduct()
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val


    },
    handleRowClick(row){
        this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    submitAllProduct() {
      this.allProVisible = false
      this.selectArr.forEach(item => {
        item.productName = item.name
        item.productCode = item.code
        item.productsId = item.id
      });
      this.$emit('selectCollectProduct', this.selectArr)

      // this.productData=[...this.productData,...this.selectArr]
    },
  }
}
</script>
<style scoped>
.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 10px !important;
}

.selectProcess.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body {
  padding: 0 !important;
}
</style>
