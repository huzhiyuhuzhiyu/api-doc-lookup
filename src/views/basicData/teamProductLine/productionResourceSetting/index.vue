<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable
                @keyup.enter.native="search()" />
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
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="moreQueries()">更多查询</el-button>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" :element-loading-text="loadingText">
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <!-- <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('','add')">
            新建
          </el-button> -->
          <topOpts @add="addSupplier('', 'add')">
            <el-button type="primary" size="mini" icon="el-icon-upload2" @click="exportForm">导入</el-button>
            <el-button type="primary" size="mini" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
          border @sort-change="sortChange" custom-column >
          <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="200" />
          <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" sortable="custom" />
          <el-table-column prop="routingName" label="工艺路线名称" min-width="180" sortable="custom" />
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>

          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" width="120" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>

              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button> -->
              <!-- <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id, scope.row.parentId)" />
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model.trim="listQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model.trim="listQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model.trim="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工艺路线编码">
              <el-input v-model="listQuery.routingCode" placeholder="请输入工艺路线编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺路线名称">
              <el-input v-model="listQuery.routingName" placeholder="请输入工艺路线名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="customerRecognitionTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>

          </el-col>


        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()">
          搜索</el-button>
      </span>
    </el-dialog>
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct" :http-request="UploadProduct" />

  </div>
</template>
  
<script>
import { getProductionResource, deleteProductionResource, saleUploadroutingModel, errordatalist } from '@/api/basicData/productionResourceSetting'
import JNPFForm from './Form'
import { mapState } from 'vuex'
export default {
  name: 'ProductionResource',
  components: { JNPFForm },
  data() {
    return {
      customerRecognitionTime: [],
      title:"更多查询",
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        productCode: "",
        productName: "",
        productDrawingNo: "",
        routingCode: "",
        routingName: "",
        pageNum: 1,
        pageSize: 20,
        endTime: "",
        startTime: ""
      },
      total: 0,
      formVisible: false,
      loadingText:''
    }
  },
  computed: {
    ...mapState('user', ['token'])
  },
  created() {
    this.initData()
  },
  methods: {
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/产品工艺模板.xlsx')
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
      saleUploadroutingModel(formData).then(res => {
        if(res.data.length) errordatalist(res.data).then(row=>{
          this.jnpf.downloadFile(row.data.url, row.data.name)
        })
        this.initData()
      }).catch(err => {
        this.$message.error(`数据上传失败`)
        this.listLoading = false
        this.loadingText = ''
      })
    },
    dataFormSubmit() {
      this.listQuery.pageNum = 1
      if (this.customerRecognitionTime && this.customerRecognitionTime.length > 0) {
        this.listQuery.startTime = this.customerRecognitionTime[0]
        this.listQuery.endTime = this.customerRecognitionTime[1]
      } else {
        this.listQuery.startTime = ""
        this.listQuery.endTime = ""
      }
      this.initData()

    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/_([a-zA-Z])/g, (match, letter) => letter.toUpperCase());
      if (newProp === "createTime") {
        newProp = 'create_time'
      }
      console.log(newProp);
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },
    moreQueries() {
      this.visible = true
    },

    initData() {
      this.listLoading = true
      getProductionResource(this.listQuery).then(res => {
        console.log(res, '生产资源列表');
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        productCode: "",
        productName: "",
        productDrawingNo: "",
        routingCode: "",
        routingName: "",
        pageNum: 1,
        pageSize: 20,
        endTime: "",
        startTime: ""
      },
        this.customerRecognitionTime = []

      this.search()
    },
    addSupplier(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, type)
        })
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteProductionResource(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    }
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
  