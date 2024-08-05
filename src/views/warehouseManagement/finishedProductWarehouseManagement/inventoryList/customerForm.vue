<template>

  <el-dialog title="选择客户" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    v-if="customerType == 'customer'" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
    append-to-body @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-left treeBox">
        <div class="JNPF-common-title">
          <h2>客户分类</h2>
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
            <!-- <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i
                    :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                  <span class="text" :title="data.name">{{ data.name }}</span>
                </span> -->
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="suform.code" placeholder="请输入编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="suform.name" placeholder="请输入名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="suform.mobilePhone" placeholder="请输入手机号" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
            <el-table-column prop="code" label="客户编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="客户名称" />
            <el-table-column prop="taxId" label="税号" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="seleceCustomer(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
            @pagination="getCustomerFun" />
        </div>
      </div>
    </div>

  </el-dialog>
  <el-dialog title="选择供应商" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    v-else lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-left treeBox">
        <div class="JNPF-common-title">
          <h2>供应商分类</h2>
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
            <!-- <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i
                    :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                  <span class="text" :title="data.name">{{ data.name }}</span>
                </span> -->
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.code" placeholder="请输入客户编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
            <el-table-column prop="code" label="客户编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="客户名称" />
            <el-table-column prop="taxId" label="税号" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="seleceCustomer(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
            @pagination="getCustomerFun" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { getcategoryTrees, } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeData, deleteCooperative, getcategoryTree } from '@/api/basicData/index'
export default {
  data() {
    return {
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      customerVisible: false,
      treeLoading: false,
      treeData: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "",
      },
      suform: {
        code: '',
        name: '',

        mobilePhone: '',

        type: 'supplier',
        partnerCategoryId: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ]
      },
      refreshTree: true,
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      expands: true,
    }
  },
  methods: {
    init(customerType, businessType) {
      console.log("customerType", customerType);
      console.log("businessType", businessType);
      this.customerVisible = true
      this.form.type = customerType
      this.customerType = customerType
      this.businessType = businessType
      this.getcategoryTree()
    },
    // 选择客户
    seleceCustomer(row) {
      this.$emit("selectCustomer", row)
      console.log("vrow", row);
      this.customerVisible = false
    },
    // 获取客户数据
    getCustomerFun() {
      this.listLoading = true
      let obj = {}
      if (this.customerType == 'customer') {
        obj = this.form

      } else {
        obj = this.suform
      }
      getCooperativeData(obj).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取客户左侧树形数据
    getcategoryTree() {
      this.treeLoading = true
      if (this.customerType == 'customer') {
        let listQuery = {
          keyword: '',
          type: "customer"
        };
        getcategoryTrees(listQuery).then(res => {
          this.treeData = res.data
          this.$nextTick(() => {
            this.getCustomerFun()
            this.treeLoading = false
          })
        }).catch(() => {
          this.treeLoading = false
        })
      } else {
        if (this.businessType == 'outbound_purchase' || this.businessType == 'inbound_purchase') {
          this.treeLoading = true
          let listQuery = {
            keyword: '',
            type: 'supplier'
          }
          getcategoryTree(listQuery)
            .then((res) => {
              console.log(99, res)
              this.treeData = res.data
              this.$nextTick(() => {
                this.treeLoading = false
                this.initData()
              })
            })
            .catch(() => {
              this.treeLoading = false
            })
        }
      }

    },
    initData() {
      console.log(this.form)
      this.listLoading = true

      getCooperativeData(this.form).then((res) => {
        console.log('res++', res)
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id

      this.search()
    },
    search() {
      this.getCustomerFun()
    },
    reset() {
      this.form = {
        code: "",
        taxId: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.getcategoryTree()
    },
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  margin-bottom: 5px
}
</style>