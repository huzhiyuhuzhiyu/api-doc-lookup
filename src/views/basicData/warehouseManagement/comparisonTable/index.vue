<template>
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.wname" placeholder="请输入仓库名称" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.sname" placeholder="请输入货架名称" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.gname" placeholder="请输入库位名称" clearable
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
            <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
              icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
  
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <!-- <el-dropdown> -->
            <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('add')" size="mini">
              新建
            </el-button>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
  
          <JNPF-table ref="tableForm" v-loading="listLoading" :data="tableDataList" :fixedNO="true"
                  @sort-change="sortChange" custom-column customKey="JNPFTableKey_271159">
            <el-table-column prop="wcode" label="仓库编码" width="200" />
            <el-table-column prop="wname" label="仓库名称" width="200" sortable="custom" />
            <el-table-column prop="scode" label="货架编码" width="200" />
            <el-table-column prop="sname" label="货架名称" width="200" sortable="custom"/>
            <el-table-column prop="gcode" label="库位编码" width="200" />
            <el-table-column prop="gname" label="库位名称" width="200" sortable="custom" />
            <el-table-column prop="comparisonType" label="对照类型" width="140" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.comparisonType === 'product'">产品</div>
                <div v-else-if="scope.row.comparisonType === 'product_category'">产品分类</div>
                <div v-else-if="scope.row.comparisonType === 'customer'">客户</div>
                <div v-else-if="scope.row.comparisonType === 'supplier'">供应商</div>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="对象编码" width="200" />
            <el-table-column prop="name" label="对象名称" width="200" sortable="custom"/>
            <el-table-column prop="drawingNo" label="产品图号" width="200" sortable="custom"/>
            <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
            <el-table-column prop="createByName" label="创建人" width="120"/>
            <el-table-column prop="remark" label="备注" width="300"></el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button> -->
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
                      <el-button size="mini" type="text" @click.native="handleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                      <!-- <el-dropdown hide-on-click>
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
      <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="仓库编码">
              <el-input v-model="listQuery.wcode" placeholder="请输入仓库编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称">
              <el-input v-model="listQuery.wname" placeholder="请输入仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货架编码">
              <el-input v-model="listQuery.scode" placeholder="请输入货架编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货架名称">
              <el-input v-model="listQuery.sname" placeholder="请输入货架名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位编码">
              <el-input v-model="listQuery.gcode" placeholder="请输入库位编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位名称">
              <el-input v-model="listQuery.gname" placeholder="请输入库位编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对照类型">
              <el-select v-model="listQuery.comparisonType" placeholder="请选择对照类型" style="width: 100%;">
                <el-option v-for="(item, index) in comparisonTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对象编码">
              <el-input v-model="listQuery.code" placeholder="请输入库位编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对象名称">
              <el-input v-model="listQuery.name" placeholder="请输入库位编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入库位编码" clearable />
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
    </div>
  </template>
    
  <script>
  import { getTablecomparisonTableList, deletecomparisonTable } from '@/api/basicData/comparisonTable'
  import DepForm from './depForm'
  
  export default {
    name: 'stationSetting',
    components: { DepForm, },
    data() {
      return {
        comparisonTypeList: [
          { label: '产品', value: 'product' },
          { label: '产品分类', value: 'product_category' },
          { label: '供应商', value: 'supplier' },
          { label: '客户', value: 'customer' },
        ],
        depFormVisible: false,
        background: true,//分页器背景颜色
        visible: false,
        tableDataList: [
        ],
  
        listLoading: false,
        listQuery: {
          wcode: "",
          startTime: "",
          endTime: "",
          gname: "",
          sname: "",
          gcode: "",
          scode: "",
          comparisonType: "",
          wname: "",
          drawingNo:'',
          code: "",
          name: "",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "createTime"
          }],
          pageNum: 1,
          pageSize: 20,
        },
        total: 0,
        createTimeArrfahuo:[]
      }
    },
    created() {
      this.initData()
    },
    methods: {
      sortChange({ prop, order }) {
        let newProp;
        if (prop === 'drawingNo') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
        this.initData()
      },
      // 关闭新建、编辑页面
      closeForm(isRefresh) {
        this.depFormVisible = false
        if (isRefresh) {
          this.initData()
        }
      },
      moreQueries() {
        this.visible = true
      },
      initData() {
        // this.listLoading = true
        getTablecomparisonTableList(this.listQuery).then(res => {
          console.log(res, '对照列表');
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      search() {
        if (this.createTimeArrfahuo && this.createTimeArrfahuo.length > 0) {
          this.listQuery.startTime = this.createTimeArrfahuo[0].replace(/ 0(?!0)/g, " ")
          this.listQuery.endTime = this.createTimeArrfahuo[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
        this.initData()
      },
      reset() {
        this.$refs['tableForm'].$refs.JNPFTable.clearSort()
        this.createTimeArrfahuo=[]
        this.listQuery = {
          wcode: "",
          startTime: "",
          endTime: "",
          gname: "",
          sname: "",
          gcode: "",
          scode: "",
          comparisonType: "",
          wname: "",
          drawingNo:'',
          code: "",
          name: "",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "createTime"
          }],
          pageNum: 1,
          pageSize: 20,
        }
        this.search()
      },
      addSupplier(type) {
        this.depFormVisible = true
        this.$nextTick(() => {
          this.$refs.depForm.init("", type)
        })
      },
      addOrUpdateHandle(id, type) {
        this.depFormVisible = true
        if (id) {
          this.$nextTick(() => {
            this.$refs.depForm.init(id, type)
          })
        }
      },
      handleDel(id) {
        this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
          type: 'warning'
        }).then(() => {
            deletecomparisonTable(id).then(res => {
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
        this.depFormVisible = true
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
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
    