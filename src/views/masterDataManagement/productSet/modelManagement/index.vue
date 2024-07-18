<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入型号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-date-picker v-model="createTimeArr" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                style="width: 100%" start-placeholder="创建开始时间" end-placeholder="创建结束时间" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t("common.search") }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 10px;display: -webkit-box">
          <!-- <topOpts @add="addOrUpdateHandle('', 'add')" :isJudgePer="true" :addPerCode="'btn_add'"> -->
          <!-- <el-dropdown>
           
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addOrUpdateHandle('', 'add')">单个新建
              </el-dropdown-item>
              <el-dropdown-item @click.native="batchAdd()">批量新建</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="batchAdd()">
              批量新建
            </el-button>
          <el-button type="primary" size="mini" icon="iconfont  icon-piliang-copy" style="margin-left: 10px"
            @click="batchEditFun">批量修改</el-button>
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button>
          <el-button v-has="'btn_import'" size="mini" type="primary" icon="el-icon-plus"
            @click="importFun">导入</el-button>
          <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
            icon="el-icon-download" @click="exportForm">导出</el-button>
          <!-- </topOpts> -->
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          hasC @selection-change="handleSelectionChange" ref="dataTable">
          <el-table-column prop="model" label="型号" sortable="custom" />
          <el-table-column prop="innerCircle" label="内圈" sortable="custom" width="120" />
          <el-table-column prop="outerCircle" label="外圈" sortable="custom" />
          <el-table-column prop="steelBall" label="钢球型号" sortable="custom" width="120" />
          <el-table-column prop="steelBallNum" label="钢球用量" sortable="custom" width="120" />
          <el-table-column prop="oilNum" label="油脂用量" sortable="custom" width="120" />
          <el-table-column prop="holderNum" label="保持架用量" sortable="custom" width="140" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" sortable="custom" width="120" />

          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)"></tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <Table-Form v-if="tableFormVisible" ref="TableForm" @refresh="refresh"></Table-Form>
    <!-- <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" /> -->
  </div>
</template>

<script>
import {
  updataBimProductsModelCheck,
  getbimProductsModelInfo,
  updataBimProductsModel,
  delBimProductsModel,
  getbimProductsModelList,
  addBimProductsModel,
  uploadDimProductsModel
} from "@/api/masterDataManagement/index";
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import JNPFForm from "./Form";
import TableForm from "./tabForm";
import { mapGetters, mapState } from 'vuex'
export default {
  components: { JNPFForm, ExportForm, TableForm },
  data() {
    return {
      tableFormVisible: false,
      exportFormVisible: false,
      createTimeArr: [],
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {
        startTime: "",
        endTime: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
        model: "",
      },

      total: 0,
      formVisible: false,
      selectList: [],
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
  created() {
    this.initData();
  },
  methods: {
    // 批量新建
    batchAdd() {
      this.tableFormVisible = true;
      this.$nextTick(() => {
        this.$refs.TableForm.init(this.selectList, 'add');
      });
    },
    handleSelectionChange(val) {
      this.selectList = val
    },
    batchEditFun() {
      if (!this.selectList.length) return this.$message.error("请先选择您要修改的数据!")
      this.tableFormVisible = true;
      this.$nextTick(() => {
        this.$refs.TableForm.init(this.selectList, 'edit');
      });
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableData, 'dataTable')


    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1202',
          exportName: '型号管理',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },

    distributionFun() {
      if (!this.selectArr.length) return this.$message.error("请先选择要分配的数据")
      this.customerVisi = true
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/型号导入模板.xlsx')
      a.click()
    },
    importFun() {

      this.$refs.UploadProduct.$el.querySelector('input').click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      //调用上传文件接口
      uploadDimProductsModel(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.initData()
          this.formLoading = false
          this.loadingText = ''
        } else {
          this.handleMessage(res.data)
        }

      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: "error",
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在型号相关信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: "mini",
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: "none",
                textAlign: "center",
                // width:"20%",
                margin: "0 5px 0 5px ",
              },
            }, '下载导入错误数据')
          ]
        ),
      })
      return
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp = ""
      if (prop == 'steelBall' || prop == "outerCircle" || prop == "innerCircle" || prop == "createByName") {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());

      }
      this.listQuery.orderItems[0].asc = order === "ascending";
      this.listQuery.orderItems[0].column = order === null ? "" : newProp;
      this.initData();
    },
    initData() {
      this.listLoading = true;
      getbimProductsModelList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records;

          this.total = res.data.total;
          this.listLoading = false;
          // this.visible = false
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    search() {
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.listQuery.startTime = this.createTimeArr[0] + " 00:00:00"
        this.listQuery.endTime = this.createTimeArr[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ""
        this.listQuery.endTime = ""
      }
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key];
        this.listQuery[key] = typeof item === "string" ? item.trim() : item;
      });
      this.listQuery.pageNum = 1;
      this.initData();
    },
    refresh(isrRefresh) {
      this.formVisible = false;
      this.tableFormVisible=false
      if (isrRefresh) this.reset();
    },
    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮
      this.listQuery = {
        startTime: "",
        endTime: "",
        model: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      };
      this.initData();
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type);
      });
    },
    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          delBimProductsModel(id).then((res) => {
            if (res.msg === "Success") {
              this.initData();
              this.$message({
                type: "success",
                message: "删除成功",
                duration: 1500,
              });
            }
          });
        })
        .catch(() => { });
    },
  },
};
</script>
<style scoped>
/* .JNPF-common-layout-left {
    margin-right: 0;
    border-right: 1px solid #cacaca;
  }
  
  ::v-deep .el-tabs__content {
    height: calc(100vh - 163px);
  } */

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

::v-deep .icon-piliang-copy {
  margin-right: 8px
}
</style>