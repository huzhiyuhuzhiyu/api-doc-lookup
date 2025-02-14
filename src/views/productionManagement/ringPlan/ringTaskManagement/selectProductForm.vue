<template>

  <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProduct" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.productDrawingNo" placeholder="品名规格" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.productCode" placeholder="产品编码" clearable />
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
          <JNPF-table v-loading="listLoading" :data="tableDataList" >
            <el-table-column prop="code" label="产品编码" sortable="custom" />
            <el-table-column prop="name" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drawingNo" label="品名规格" sortable="custom" ></el-table-column>
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
            <el-table-column prop="routingName" label="工艺路线名称" min-width="150" sortable="custom" />
            <el-table-column prop="routingCode" label="工艺路线编码" min-width="150" sortable="custom" />
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
import { getProducts} from '@/api/masterDataManagement/index.js' // 产品列表 
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  mixins: [getProjectList],
  data() {
    return {
      
      customerVisible: false,
     
      form: {
        classAttribute: "semi_finished",
        productDrawingNo:"",
        productCode:"",
        pageNum: 1,
        pageSize: 20, 
        productStatus:"enable",
        orderItems: [{
          asc: false,
          column: ""
        },],
        
      }, 
      listLoading: false,
      total: 0,
      tableDataList: [],
      isProjectSwitch: '',
      id:'',
      isProductNameSwitch:"",

    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
  }, 
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
 
      } catch (error) { }
    },
    init(id) {
      console.log(777);
      this.id=id
      this.getbatchNumList(id)
    },
    // 选择批次
    selectFun(row) {
      // if(!row.routingId)return this.$message.error("请配置产品工艺路线")
      this.$emit("selectProduct", row,)
      this.customerVisible = false
    },
    getbatchNumList(id) {
      this.listLoading = true
      this.form.projectId = id
      getProducts(this.form).then(res => {
      this.customerVisible = true
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
        productDrawingNo:"",
        productCode:"",
        pageNum: 1,
        pageSize: 20, 
        productStatus:"enable",
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
   .selectProduct.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body{
    padding: 0!important;
  }
</style>