<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="query.customerMaterialCode" placeholder="请输入客户图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="query.dataType" placeholder="请选择数据类型" style="width: 100%;" clearable>
                <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="query.productDrawingNo" placeholder="请输入产品图号" clearable />
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
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier('edit')">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click.native="selectFile">
              数据导入
            </el-button>
            <el-button type="text" icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column >
          <el-table-column prop="customerMaterialCode" label="客户图号" sortable="custom" />
          <el-table-column prop="customerName" label="客户名称" sortable="custom" />
          <el-table-column prop="dataType" label="数据类型" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.dataType == 'hose'">胶管</div>
              <div v-else-if="scope.row.dataType == 'joint'">接头</div>
              <div v-else>角度</div>
            </template>
          </el-table-column>
          <el-table-column prop="productDrawingNo" label="产品图号" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.productDrawingNo
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="180" />
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id,)" />

              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                            <el-button type="text" @click="handleDel(scope.row.id,)" style=" color: #ff3a3a">删除</el-button> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="query.pageNum" :background="background" :limit.sync="query.pageSize" @pagination="initData" />
      </div>
    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="query" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="客户图号">
              <el-input v-model="query.customerMaterialCode" placeholder="请输入客户图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="query.customerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型">
              <el-select v-model="query.dataType" placeholder="请选择数据类型" clearable style="width: 100%;">
                <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="query.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArrfahuo" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索</el-button>
      </span>
    </el-dialog>
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <!-- 数据导入 -->
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadFile" :http-request="UploadFile" />
  </div>
</template>
  
<script>
import { getBasicDataList, deleteBasicData, uploadQuotationBasicData } from '@/api/basicData/index'
import DepForm from './depForm'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'quality',
  components: { DepForm, },
  data () {
    return {
      createTimeArrfahuo: [],
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      dataTypeList: [
        {
          label: "接头",
          value: 'joint'
        },
        {
          label: "胶管",
          value: "hose"
        },
        {
          label: "角度",
          value: "angle"
        }
      ],
      query: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        customerMaterialCode: "",
        productDrawingNo: "",
        dataType: '',
        startTime: '',
        endTime: '',
        customerName: ''
      },
      listLoading: false,
      total: 0,
      formVisible: false,
    }
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState('user', ['token']),
  },
  methods: {
    moreQueries () {
      this.visible = true
    },
    sortChange ({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.query.orderItems[0].asc = order === "ascending"
      this.query.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm (isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData () {
      getBasicDataList(this.query).then(res => {
        console.log("表格", res);
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
        this.visible = false
      }).catch(() => {
        this.listLoading = false
        this.visible = false
      })
    },
    search () {
      if (this.createTimeArrfahuo && this.createTimeArrfahuo.length > 0) {
        this.query.startTime = this.createTimeArrfahuo[0].replace(/ 0(?!0)/g, " ")
        this.query.endTime = this.createTimeArrfahuo[1].replace(/ 0(?!0)/g, " ")
      } else {
        this.query.startTime = ''
        this.query.endTime = ''
      }
      this.query.pageNum = 1
      this.initData()
    },
    reset () {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.query = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        customerMaterialCode: "",
        productDrawingNo: "",
        dataType: '',
        startTime: '',
        endTime: '',
        customerName: ''
      }
      this.createTimeArrfahuo = []
      this.search()
    },
    addSupplier (btnType) {

      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', btnType)
      })
    },
    addOrUpdateHandle (id, btnType) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, btnType)
        })
        // }, 600);
      }


    },
    handleDel (id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteBasicData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation (id, btnType) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, btnType)
      })
    },
    // 下载模板
    downLoadTemplate () {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/销售报价基础数据模板.xlsx')
      a.click()
    },
    selectFile () {
      this.$refs.UploadFile.$el.querySelector('input').click()
    },
    // 上传
    UploadFile (data) {
      var formData = new FormData()
      formData.append("file", data.file)
      //调用上传文件接口
      uploadQuotationBasicData(formData).then(res => {
        this.$message.success(`数据导入成功`)
        this.search()
      }).catch(err => {
        this.$message.error(`文件上传失败`)
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
  