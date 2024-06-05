<template>
  <el-dialog title="选择设备" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="60%" append-to-body>

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-left">
        <div class="JNPF-common-title">
          <h2>设备分类</h2>
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
          <el-tree ref="treeBox" :data="DeviceTreeData" :props="defaultProps" :default-expand-all="expands"
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
                <el-input v-model="DeviceListRequestObj.code" placeholder="请输入设备编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="DeviceListRequestObj.name" placeholder="请输入设备名称" clearable />
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
            @selection-change="handleSelectionChangeAllPruduct">
            <el-table-column prop="code" label="设备编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="设备名称" />
     
          
          </JNPF-table>
          <pagination :total="allProductTotal" :page.sync="DeviceListRequestObj.pageNum"
            :limit.sync="DeviceListRequestObj.pageSize" @pagination="init" />
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
import {getcategoryTree} from '@/api/basicData/materialSettings'
import { getGroupList, editEquEquipmentAll, getEquEquipmentList,stateEquEquipment } from '@/api/basicData/index' // 设备 工具 接口
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
      allProVisible: false,
      // 设备方法数据
      DeviceMethodArr: [
        { label: "设备", classAttribute: "equipment", method: getcategoryTree, requeseObj: {  classAttribute: 'equipment' } },
        // { label: "工具", classAttribute: "tool", method: getcategoryTree, requeseObj: { classAttribute: "tool",} },
        // { label: "检验工具", classAttribute: "inspect", method: getEquEquipmentList, requeseObj: { classAttribute: "inspect", } },
      ],
      DeviceTreeData: [],
      DeviceListRequestObj: {
        classAttribute: "equipment",
        drawingNo: "",
     
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
        state:''
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
      if (this.DeviceListRequestObj.productCategoryId === data.id) return
      this.DeviceListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      console.log(this.DeviceListRequestObj.productCategoryId, data.id);
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.DeviceListRequestObj.classAttribute = data.classAttribute
      console.log(this.DeviceListRequestObj.classAttribute);
      this.searchAllProduct()
    },
    // 选完设备数据后 渲染在列表上
    submitCustomerProduct() {
      this.productVisible = false
    },

    // 获取所有设备列表数据
    init(type) {
      // 设备树形
      this.btnLoading = false
      let arr = [];
      this.allproductData = []
      let successTotal = 0;
      let tempTreeData = [...this.DeviceMethodArr]
      this.DeviceMethodArr.forEach((item, index) => {
        item.method(item.requeseObj).then(res => {
          console.log(res,1111);
          if (Array.isArray(res.data)) {
            tempTreeData[index] = {
              id: item.id,
              name: item.name,
              classAttribute: item.classAttribute,
              childrenList: res.data
            }
          } else {
            tempTreeData[index] = {
              id: item.id,
              name: item.name,
              classAttribute: item.classAttribute,
              childrenList: res.data.records
            }
            console.log( this.DeviceTreeData,'设备树形');
          
          }
          if ((++successTotal) === this.DeviceMethodArr.length) {
            this.DeviceTreeData = tempTreeData
            console.log( this.DeviceTreeData,'设备树形');
            // this.init()
          }
        })
      });
      this.allProVisible = true
      this.listLoading = true
      stateEquEquipment(this.DeviceListRequestObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        console.log(this.allproductData,'设备列表');
        console.log("listRes", listRes);
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      Object.keys(this.DeviceListRequestObj).forEach(key => {
        let item = this.DeviceListRequestObj[key]
        this.DeviceListRequestObj[key] = typeof item === 'string' ? item.trim() : item
      })
      this.DeviceListRequestObj.pageNum = 1
      this.init()
    },

    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.DeviceListRequestObj = {
        classAttribute: "equipment",
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
        state:''
      },
        this.searchAllProduct()
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      console.log("所有产品多选", val);
      this.selectArr = val
    },

    submitAllProduct() {
      this.$emit('dataFormSubmit',this.selectArr)
       this.btnLoading = true
      this.allProVisible = false
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
::v-deep .el-table__body-wrapper.is-scrolling-none {
}
</style>
