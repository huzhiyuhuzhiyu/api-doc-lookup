<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="tableQuery.code" @keyup.enter.native="search()" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="tableQuery.name" @keyup.enter.native="search()" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="tableQuery.ncode" @keyup.enter.native="search()" placeholder="请输入替代产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>

            </el-form-item>

          </el-col>


        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts  @add="addSupplier()"></topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column customKey="JNPFTableKey_703298">

          <el-table-column prop="code" label="产品编码" min-width="150"  sortable="custom"></el-table-column>
          <el-table-column prop="name" label="产品名称" min-width="150"  sortable="custom"></el-table-column>
          <el-table-column prop="drawingNo" label="型号" min-width="150" sortable="custom"></el-table-column>
          <el-table-column prop="ncode" label="替代产品编码" min-width="150" sortable="custom"></el-table-column>
          <el-table-column prop="nname" label="替代产品名称" min-width="150" sortable="custom" />
          <el-table-column prop="ndrawingNo" label="替代产品图号" min-width="150" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" width="180"  sortable="custom" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
             
              <tableOpts :hasEdit="false" @del="handleDel(scope.row.id,scope.row.parentId)"/>
              <!-- <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
          :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
    </div>


    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>
  
<script>
import { deleteBimProduct, getBimProductData } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
export default {
  name: 'quality',
  components: { DepForm, },
  data() {
    return {
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],

      listLoading: false,
      tableQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        ncode:'',
        nname:'',
        drawingNo:'',
        ndrawingNo:'',
      },
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      console.log(newProp);
      if (newProp === 'ndrawing_no') {
        newProp = 'bp2.drawing_no'
      }
      if (newProp === 'drawing_no') {
        newProp = 'bp1.drawing_no'
      }
      this.tableQuery.orderItems[0].asc = order !== 'descending'
      this.tableQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getBimProductData(this.tableQuery).then(res => {
        // 
        console.log(res);
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.tableQuery).forEach(key => {
        let item = this.tableQuery[key]
        this.tableQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.tableQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.tableQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        state: "enable"
      },
        this.search()
    },
    addSupplier() {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init()
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteBimProduct(id).then(res => {
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style scoped>
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
  