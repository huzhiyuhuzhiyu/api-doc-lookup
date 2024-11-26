<template>

  <el-dialog title="选择工艺路线" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.code" placeholder="工艺路线编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.name" placeholder="工艺路线名称" clearable />
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
        <div class="JNPF-common-layout-main JNPF-flex-main" > 
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true" @sort-change="sortChange">
            <el-table-column prop="code" label="工艺路线编码" sortable="custom" ></el-table-column>
            <el-table-column prop="name" label="工艺路线名称" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" sortable="custom" v-if="isProjectSwitch == 1" />
           
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope" >
                <el-button type="text" @click="selectFun(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
            @pagination="getbatchNumList(id)" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { detailProcess,getProcessList } from '@/api/basicData/processSettingss.js'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  data() {
    return {
     
      customerVisible: false,
     
      form: {
        code:"",
        name:"",
        pageNum: 1,
        pageSize: 20,
        documentStatus:"submit",
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
    await this.getProjectSwitch('system', 'project')

  },
  methods: {
    
    sortChange({ prop, order }) {
      console.log(prop);
      let newProp;
      if (prop === 'name' || prop === 'code' ) {
        newProp = prop
      }   else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
     
      this.form.orderItems[0].asc = order === "ascending"
      this.form.orderItems[0].column = order === null ? "" : newProp
      this.getbatchNumList()
    },
    init(id) {
      this.customerVisible = true
      this.id = id
      this.getbatchNumList(id)
    },
    // 选择批次
    selectFun(row) {
      this.$emit("selectRouting", row,)
      this.customerVisible = false
    },
    getbatchNumList(id) {
      this.listLoading = true
      this.form.projectId = id
      getProcessList(this.form).then(res => {
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
        code:"",
        name:"",
        documentStatus:"submit",
        pageNum: 1,
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