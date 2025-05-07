<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.ncode" placeholder="请输入客户编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.nname" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.vehicleModel" placeholder="请输入车型名称" clearable
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
          <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('add')">
            新建
          </el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column customKey="JNPFTableKey_762650">
          <el-table-column prop="ncode" label="客户编码" width="120" sortable="custom" fixed="left" />
          <el-table-column prop="nname" label="客户名称" width="120" sortable="custom" fixed="left" />

          <el-table-column prop="vehicleModel" label="车型" sortable="custom" width="120" />
          <el-table-column prop="station" label="工位" sortable="custom" width="120" />

          <el-table-column prop="code" label="产品编码" width="120" sortable="custom" />
          <el-table-column prop="name" label="产品名称" width="120" sortable="custom" />

          <el-table-column prop="drawingNo" label="产品图号" width="120" />
          <el-table-column prop="customerDrawingNo" label="客户产品图号" width="150" />
          <el-table-column prop="dosage" label="客户图号用量" width="150" />

          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column prop="updateByName" label="修改人" />
          <el-table-column prop="updateTime" label="修改时间" sortable="custom" width="180" />
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
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
                style=" color: #ff3a3a">删除</el-button>
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


    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="listQuery.ncode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.nname" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型">
              <el-input v-model="listQuery.vehicleModel" placeholder="请输入车型" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工位">
              <el-input v-model="listQuery.station" placeholder="请输入工位" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户产品图号">
              <el-input v-model="listQuery.dosage" placeholder="请输入客户产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <!-- <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" format="yyyy-MM-dd hh:mm:ss"
                value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;" start-placeholder="开始时间" end-placeholder="结束时间"
                clearable :picker-options="global.timePickerOptions">
              </el-date-picker> -->
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
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
          搜索
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import { getBimVehicleTypeData, deleteBimVehicleType } from '@/api/basicData/index'
import DepForm from './depForm'

export default {
  name: 'stationSetting',
  components: { DepForm, },
  data() {
    return {
      title: "更多查询",
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],

      listLoading: false,
      listQuery: {
        createByName: "",
        endTime: "",
        keyword: "",
        ncode: "",
        nname: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        startTime: "",
        vehicleModel: "",
        pageNum: 1,
        pageSize: 20,
        startAndEndTime: [],
      },
    
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
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
    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.listQuery.pageNum = 1
      if (this.customerRecognitionTime && this.customerRecognitionTime.length > 0) {
        this.listQuery.createStartTime = this.customerRecognitionTime[0] + " 00:00:00"
        this.listQuery.createEndTime = this.customerRecognitionTime[1] + " 23:59:59"
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + " 00:00:00"
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      getBimVehicleTypeData(this.listQuery).then(res => {
        console.log(res, '车型列表');
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
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
      },
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
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteBimVehicleType(id).then(res => {
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
  