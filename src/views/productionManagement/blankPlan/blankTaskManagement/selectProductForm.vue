<template>

  <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProduct" width="70%" append-to-body
    @close=" cancelFun">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.productCode" placeholder="产品编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.productDrawingNo" placeholder="型号" clearable />
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
          <JNPF-table v-loading="listLoading" :data="tableDataList"  customKey="JNPFTableKey_306142"   ref="dataTable"    @row-dblclick="selectFun"   @sort-change="sortChange">
            <el-table-column prop="code" label="产品编码" sortable="custom" />
            <el-table-column prop="name" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drawingNo" label="型号" sortable="custom" min-width="150"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
            <el-table-column prop="routingName" label="工艺路线名称" min-width="150" sortable="custom" />
            <!-- <el-table-column prop="routingCode" label="工艺路线编码" min-width="150" sortable="custom" /> -->
            <el-table-column label="操作" width="100" >
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
      form:{},
      formList: {
        classAttributeList:[],
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
    cancelFun(){
        this.customerVisible = false
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

    },
     sortChange({ prop, order }) {
      let newProp;
      if (prop === 'code' ||prop=='name'|| prop == 'drawingNo' || prop == 'projectName' || prop == 'routingName'   ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order !== "descending"
      this.form.orderItems[0].column = order === null ? "" : newProp
      this.getbatchNumList(this.id)
    },
    init(id) {
    this.form=JSON.parse(JSON.stringify(this.formList))
        this.customerVisible = true
      console.log(777,this.form);
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
      this.form.classAttributeList=this.isXBN?["raw_material",'raw_material']:['raw_material']
      getProducts(this.form).then(res => {

        this.tableDataList=res.data.records
        this.total=res.data.total
        this.listLoading = false
        console.log("工艺路线", res);
      }).catch(() => {
        this.listLoading = false
      })
    },

    search() {
      this.getbatchNumList(this.id)
    },
    reset() {
    this.form=JSON.parse(JSON.stringify(this.formList))
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

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
