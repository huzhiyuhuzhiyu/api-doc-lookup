<!-- 车型工位对照表 -->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <!-- <el-input v-model="dataForm.templateCode" @keydown.enter.native="search()" placeholder="请输入计划模板" clearable /> -->
              <el-select v-model="dataForm.templateCode" placeholder="请选择计划模板" clearable style="width: 100%;">
                <el-option v-for="(item, index) in templateCodeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.vehicleModelNo" @keydown.enter.native="search()" placeholder="请输入车型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.customerProductNo" @keydown.enter.native="search()" placeholder="请输入客户物料号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
              <el-button type="text" icon="el-icon-upload2" @click="exportForm">导入</el-button>
              <el-button type="text" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading" :element-loading-text="loadingText">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle('', 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" :data="tableData" custom-column :fixedNO="true" @sort-change="sortChange">
          <el-table-column prop="templateCode" label="计划模板" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.templateCode=='t001'">
                通用模板
              </div>
              <div v-else-if="scope.row.templateCode=='t002'">
                科尼模板
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="vehicleModelNo" label="车型号" min-width="180" sortable="custom" />
          <el-table-column prop="customerProductNo" label="客户物料号" min-width="160" />
          <el-table-column prop="group" label="组别" min-width="160" sortable="custom" />
          <el-table-column prop="op2" label="OP*" min-width="160" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" min-width="140" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="140" />
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <!-- 更多搜索 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form :model="dataForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="计划模板">
              <!-- <el-input v-model="dataForm.templateCode" placeholder="请输入计划模板" clearable /> -->
              <el-select v-model="dataForm.templateCode" placeholder="请选择计划模板" clearable style="width: 100%;">
                <el-option v-for="(item, index) in templateCodeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型号">
              <el-input v-model="dataForm.vehicleModelNo" placeholder="请输入车型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户物料号">
              <el-input v-model="dataForm.customerProductNo" placeholder="请输入客户物料号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组别">
              <el-input v-model="dataForm.group" placeholder="请输入组别" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="OP*">
              <el-input v-model="dataForm.op2" placeholder="请输入OP*" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="分析状态">
              <el-select v-model="dataForm.calcState" placeholder="请选择分析状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in analyzestatusList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct" :http-request="UploadProduct" />
  </div>
</template>
  
<script>
import { getVehicleList, saleUploadVehicleModel,delVehicle } from '@/api/calculationList/packagePlan'
import DepForm from "./depForm.vue";
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'workstationtable',
  components: {
    DepForm
  },
  data() {
    return {
      dataForm:{},
      depFormVisible: false,
      visible: false,
      dataFormlist: {
        templateCode: '',
        vehicleModelNo: '',
        customerProductNo: '',
        op2: '',
        group: '',
        endTime: '',
        startTime: '',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      tableData: [],
      createTimeArr: [],
      total: 0,
      templateCodeList: [
        {label:'通用模板',value:'t001'},
        {label:'科尼模板',value:'t002'}
      ],
      loadingText: ''
    }
  },
  created() {
    this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
    this.initData()
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
  methods: {
    closeDepForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/车型工位导入模板.xlsx')
      a.click()
    },
    //导入
    exportForm() {
      this.$refs.UploadProduct.$el.querySelector('input').click()
    },
    // 导入数据
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.listLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      //调用导入接口
      saleUploadVehicleModel(formData).then(res => {
        // this.tableData = [...this.tableData, ...res.data]
        this.initData('up')
      }).catch(err => {
        this.$message.error(`数据上传失败`)
        this.listLoading = false
        this.loadingText = ''
      })
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'group') {
        newProp = "`group`"
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.dataForm.orderItems[0].asc = order !== "descending"
      this.dataForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    search() {
      this.dataForm.pageNum = 1
      this.initData()
    },
    initData(val) {
      this.jnpf.searchTimeFormat(this.dataForm, this.createTimeArr, 'startTime', 'endTime')
      Object.keys(this.dataForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.dataForm[key]
        this.dataForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      getVehicleList(this.dataForm).then(res => {
        if (val == 'up') {
          this.$message.success(`数据更新成功`)
          this.loadingText = ''
        }
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.loadingText = ''
        this.listLoading = false
        this.visible = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
      this.initData()
    },
    addOrUpdateHandle(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    handleDel(id){
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delVehicle(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
.JNPF-common-search-box {
  padding: 8px 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>