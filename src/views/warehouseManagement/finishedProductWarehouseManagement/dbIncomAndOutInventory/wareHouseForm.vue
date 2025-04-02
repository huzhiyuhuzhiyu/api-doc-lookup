<template>

  <el-dialog title="选择库位" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="locationVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="50%" append-to-body
    @close="locationVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="tableQuery.code" placeholder="请输入库位编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="tableQuery.name" placeholder="请输入库位名称" clearable />
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

          <JNPF-table :partentOrChild="'thtabForm'"  ref="tabForm" v-loading="listLoading" :data="tableDataList" row-key="id" :fixedNO="true"  custom-column>
            <el-table-column prop="name" label="库位名称" min-width="120">
            </el-table-column>
            <el-table-column prop="code" label="库位编码" min-width="120" >
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" min-width="120" />
            <el-table-column prop="remark" label="备注" min-width="120" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="seleceWareHouseFun(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize"
            @pagination="getbatchNumList" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { getLocationList } from '@/api/warehouseManagement/inventory'
export default {
  data() {
    return {
      tableDataList: [],
      locationVisible: false,
      listLoading: false,
      tableQuery: {
        code: '',
        name:"",
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseId: '',
        pageNum: 1,
        pageSize: 20,
      },
      total:0,
      expands: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      cpId: "",
      type:"",
      index:"",
    }
  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = newProp
      this.initData()
    },
    initData(id,type,index) {
      console.log(id,type);
      this.listLoading = true
      this.type=type
      this.index=index
      this.tableQuery.warehouseId = id
      this.cpId = JSON.parse(JSON.stringify(id))
      this.locationVisible = true
      getLocationList(this.tableQuery).then(res => {
        this.tableDataList = res.data.records
        



        this.total = res.data.total
        this.listLoading = false
      }).catch(error => [
        this.listLoading = false
      ])

    },

    // 选择客户
    seleceWareHouseFun(row) {
      this.$emit("selectWareHouseFun", row,this.type,this.index)
      this.locationVisible = false
    },




    search() {
      this.initData(this.cpId)
    },
    reset() {
      this.tableQuery = {
        code: '',
        name:"",
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseId: ''
      },
        this.initData(this.cpId)
    },
  }
}
</script>