<template>
  <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="60%" append-to-body>

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
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.name" placeholder="请输入产品名称" clearable />
              </el-form-item>
            </el-col>



            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{ $t('common.reset')
                }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="allproductData" hasC
            @selection-change="handleSelectionChangeAllPruduct" customKey="JNPFTableKey_410217">
            <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="productSource" label="产品来源">
              <template slot-scope="scope">
                <div v-if="scope.row.productSource == 'purchase'">采购</div>
              </template>
            </el-table-column>
   

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
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      allProductTotal: 0,
      expands: true,
      btnLoading:false,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      // 产品参数
      productForm: {
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
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
      allProVisible: false,
      ProductMethodArr: [
      
      { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      ProductTreeData: [],
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "accessories", "semi_finished", "finish_product"],
        drawingNo: "",
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
        productSource:'purchase'
      },
      refreshTree: true,
      allproductData:[],
      treeLoading: false,
      listLoading: false,
    }
  },
  methods: {
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
    filterNodeAllProduct(value, data) {
      console.log(333, value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
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
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      console.log(this.ProductListRequestObj.productCategoryId, data.id);
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
      console.log(this.ProductListRequestObj.classAttribute);
      this.searchAllProduct()
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct() {
      this.productVisible = false
    },

    // 获取所有产品列表数据
    initData2() {
      // 产品树形
      let arr = [];
      this.allproductData = []
      let successTotal = 0;
      this.btnLoading = false
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
 
            // this.initData2()
          }
        })
      });
      this.allProVisible = true
      this.listLoading = true
      getProductList(this.ProductListRequestObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        
        // this.allproductData = this.allproductData.filter(item => item.productSource === 'purchase');
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
        classAttribute: "",
        drawingNo: "",
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
        productSource:'purchase'
      },
        this.searchAllProduct()
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = []
      console.log("所有产品多选", val);
      val.forEach((item, index) => {
        this.selectArr.push({
          productSource: item.productSource,  // 产品来源 采购
          productsId: item.id,                 // 产品id
          productName: item.name,              // 产品名称
          ratio:item.ratio,                     // 转换系数
          calculationDirection:item.calculationDirection,  // 计算方向
          mainUnit:item.mainUnit,                   // 主单位
          deputyUnit:item.deputyUnit,               // 副单位
          planQuantity:'',                          //计划数量主
          planQuantity2:'',                         //计划数量副
          remark:item.remark,
          deliveryDate:'',                          // 交期
        })
      })
    },

    submitAllProduct() {
      this.btnLoading = true
      this.allProVisible = false
      this.$emit('productsSubmit',this.selectArr)

    },
  },

}
</script>

<style scoped>
::v-deep .el-dialog__body{
  padding: 0px 20px 2px 0px !important;
}
.pagination-container {
  background-color: #f5f7fa;
}
</style>
