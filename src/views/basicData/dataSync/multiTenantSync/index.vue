<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier()">
            一键同步
          </el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column >
          <el-table-column prop="orderNo" label="同步单号" />
          <el-table-column prop="syncState" label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.syncState === 'syncing'">同步中</div>
              <div v-if="scope.row.syncState === 'synced'">已同步</div>
            </template>
          </el-table-column>
          <el-table-column prop="syncFinishDate" label="同步完成时间"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"   />
          <el-table-column prop="createByName" label="创建人" width="180" />

        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
  </div>
</template>
  
<script>
import { dataSync, dataSyncList } from '@/api/basicData/index'

export default {
  name: 'dataSync',
  data() {
    return {
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],

      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createByName: "",
        endTime: "",
        keyword: "",
        startTime: ""
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
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = newProp
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
      dataSyncList(this.listQuery).then(res => {
        console.log(res, '产线');
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        code: "",
        name: "",
        state: ""
      },
        this.search()
    },
    addSupplier() {
      dataSync().then(res=>{
        console.log(res);
        if (res.msg === 'Success') {
          this.initData()
        }
      })
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
  