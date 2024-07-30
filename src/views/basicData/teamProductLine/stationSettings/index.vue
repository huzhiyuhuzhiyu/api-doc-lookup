<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="tableQuery.code" placeholder="请输入工位编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="tableQuery.createByName" placeholder="请输入产线名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="tableQuery.name" placeholder="请输入产线名称" clearable />
                        </el-form-item>
                    </el-col> -->
          <!-- <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="tableQuery.state" placeholder="请选择状态" style="width: 100%;">
                                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>

            </el-form-item>

          </el-col>


        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addSupplier('add')">
            新建
          </el-button> -->
          <topOpts @add="addSupplier('add')">
            <el-button
              :disabled="tableDataList.length > 0 ? false : true"
              size="mini"
              type="primary"
              icon="el-icon-download"
              @click="exportForm"
              >
              导出
            </el-button>  
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
          <el-table-column prop="code" label="工位编码"  min-width="180" sortable="custom" />
          <el-table-column prop="name" label="工位名称" min-width="180" sortable="custom" />
          <el-table-column prop="state" label="状态" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 'enable'">启用</div>
              <div v-if="scope.row.state == 'disabled'">停用</div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="180" sortable="custom" />
          <el-table-column label="操作" width="180">
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
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
          :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
    </div>


    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
  
<script>
import { deleteBimWorkstation, bimWorkstationList } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'stationSetting',
  components: { DepForm,ExportForm },
  data() {
    return {
      depFormVisible: false,
      exportFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      stateList: [{
        label: "启用",
        value: "enable"
      }, {
        label: "停用",
        value: "disabled"
      }],
      listLoading: false,
      tableQuery: {
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
        state: "enable"
      },

      total: 0,
      formVisible: false,
      columnList: ['remark','createByName']
    }
  },
  created() {
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/Name$/, '');
      this.tableQuery.orderItems[0].asc = order !== 'descending' 
      this.tableQuery.orderItems[0].column =  order === null ? "" : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
     // 导出
     exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tableForm.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      console.log(columnList,'columnList')
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
        console.log(data,'data')
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.tableQuery,
          exportType: '1040',
          exportName: '工位设置信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.tableQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => {})
      }
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {

      bimWorkstationList(this.tableQuery).then(res => {
        console.log(res, '工位列表');
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.tableQuery).forEach(key => {
        let item = this.tableQuery[key]
        this.tableQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.tableQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.tableQuery = {
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
        state: "enable"
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
        deleteBimWorkstation(id).then(res => {
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
  