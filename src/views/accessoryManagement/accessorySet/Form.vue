<template>

  <el-dialog title="查看所属设备" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
             <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.equipmentIdName" placeholder="设备名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.equipmentIdCode" placeholder="设备编码" clearable />
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
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true">
            <el-table-column prop="equipmentIdName" label="设备名称" sortable="custom" />
            <el-table-column prop="equipmentIdCode" label="设备编码" sortable="custom" ></el-table-column>
            <el-table-column prop="categoryName" label="所属分类" sortable="custom" ></el-table-column>
            <el-table-column prop="projectName" label="所属项目" sortable="custom" ></el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
            @pagination="getbatchNumList(id)" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { accessoryEquipmentRelation} from '@/api/bimPropertyCategory/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  data() {
    return {
     
      customerVisible: false,
     
      form: {
        equipmentIdCode:"",
        equipmentIdName:"",
        pageNum: 1,
        pageSize: 20,
        id:"",
        orderItems: [{
          asc: false,
          column: ""
        },],
         
      }, 
      listLoading: false,
      total: 0,
      tableDataList: [],
      isProjectSwitch:"",
      id:"",

    }
  },
  async created() { 
   
  },
  methods: {
    init(id) {
      this.id=id
      this.customerVisible = true
      this.getbatchNumList(id)
    },
    // 选择批次
    selectFun(row) {
      this.$emit("selectRouting", row,)
      this.customerVisible = false
    },
    getbatchNumList(id) {
      this.listLoading = true
      this.form.id=id
      accessoryEquipmentRelation(this.form).then(res => {
        console.log("工艺路线", res);
        this.tableDataList=res.data.records
        this.total=res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    search() {
      this.getbatchNumList(this.id)
    },
    reset() {
      this.form = {
        equipmentIdCode:"",
        equipmentIdName:"",
        pageNum: 1,
        id:"",
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],
      }
      this.search()
    },
  }
}
</script>
<style scoped>
  .JNPF-common-layout-center .JNPF-common-layout-main{
    padding: 10px!important;
  }
   .selectProcess.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body{
    padding: 0!important;
  }
</style>
