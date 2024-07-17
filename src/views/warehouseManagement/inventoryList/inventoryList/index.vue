<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
          <el-form @submit.native.prevent>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" @keyup.enter.native="search()" placeholder="出入库单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="dataForm.sourceType" placeholder="业务类型" :disabled="btnType === 'look' ? true : false"
                      style="width: 100%;">
                      <el-option v-for="(item, index) in list" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productDrawingNo" @keyup.enter.native="search()" placeholder="规格型号" clearable />
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
          <div class="JNPF-common-head">
            <topOpts :icon="'el-icon-download'" @add="addOrUpdateHandle('', 'add')" :addText="'导出'"></topOpts>
           
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun()" />
            </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table hasC @selection-change="handeleInfoData" ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
            custom-column>
            <el-table-column prop="orderNo" label="单号" sortable="custom" width="120" >
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id,'look')">{{
                  scope.row.name
                  }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="sourceType" label="业务类型" sortable="custom" width="120">
              <template slot-scope="scope">
                <div v-if="scope.sourceType=='send_return'">发退货单</div>
                <div v-if="scope.sourceType=='picking_return'">领退料单</div>
                <div v-if="scope.sourceType=='delivery_return'">收退货单</div>
              </template>
            </el-table-column> 
            <el-table-column prop="partnerName" label="合作伙伴名称" sortable="custom" width="100"/>
            <el-table-column prop="productCode" label="产品编码" sortable="custom" width="120"/>
            <el-table-column prop="productName" label="产品名称" sortable="custom" min-width="180"/>
            <el-table-column prop="drawingNo" label="规格型号" sortable="custom" min-width="180"/>
            <el-table-column prop="processName" label="工序名称" sortable="custom" min-width="180"/>
            <el-table-column prop="mainUnit" label="单位（主）" sortable="custom" min-width="180"/>
            <el-table-column prop="num" label="数量（主）" sortable="custom" min-width="180"/>
            <el-table-column prop="deputyUnit" label="单位（副）" sortable="custom" min-width="180"/>
            <el-table-column prop="deputyNum" label="数量（副）" sortable="custom" min-width="180"/>
            <el-table-column prop="costPrice" label="单价（含税）" sortable="custom" min-width="180"/>
            <el-table-column prop="taxRate" label="税率（%）" sortable="custom" min-width="180"/>
            <el-table-column prop="excludingTaxCostPrice" label="单价（不含税）" sortable="custom" min-width="180"/>
            <!-- <el-table-column prop="createTime" label="税额" sortable="custom" min-width="180"/> -->
            <!-- <el-table-column prop="createTime" label="总金额（含税）" sortable="custom" min-width="180"/> -->
            <el-table-column prop="documentStatus" label="单据状态" sortable="custom" min-width="180">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
              </template>
              
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180"/>
            <el-table-column prop="createByName" label="创建人" width="120"/>
            <el-table-column label="操作" min-width="200" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id,'edit')">转正式</el-button>
                <el-button size="mini" type="text" @click="handleRecord(scope.row)">写记录</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData">
          </pagination>
        </div>
      </div>
    </div>
 

    <Form v-if="formVisible" ref="Form" @close="closeForm" />

  </div>
</template>

<script>
import { getPartnerList , releasePartner } from '@/api/customerManagement/index'
import Form from './Form'
export default {
  name: 'myCustomer',
  components: { Form  },
  data() {
    return {
      columnList:["productName","taxRate","excludingTaxCostPrice","documentStatus","taxmount","createByName",],
      recordFormVisible:false,
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      list:[
        {label:"发退货单",value:"send_return"},
        {label:"领退料单",value:"picking_return"},
        {label:"收退货单",value:"delivery_return"},
      ],
      
      initListQuery: {
        code: "",
        contacts: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        mobilePhone: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        phone: "",
        customerStatus: 'private_sea',
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        createTimeArr: [],
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      selectData:[],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    columnSetFun(){ 
      console.log("this.$refs.dataTable",this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    handeleInfoData(val){
      this.selectData = val
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getPartnerList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.recordFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },

    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    // 写记录
    handleRecord(row) {
      this.recordFormVisible = true
      this.$nextTick(()=>{
        this.$refs.RecordForm.init(row.id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    releaseFun(){
      if (this.selectData.length){
        let idList = this.selectData.map(item=>item.id)
        releasePartner(idList).then(res=>{
          this.initData()
          this.$message({
            type:'success',
            message: "释放成功",
            duration: 1500,
          })
        }).catch(()=>{})
      }else{
        this.$message.warning('请选择您要释放的客户数据！')
      }     
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
