<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <template v-for="item in searchList">
            <el-col :span="item.searchType === 3 ? 6 : 4" :key="item.prop">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="search('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="4">
            <el-form-item>
              <el-select clearable v-model="tableQuery.workshopName" placeholder="加工车间" style="width: 100%;" @change="workshopIdChange">
                <el-option v-for="(item, index) in workshopIdOptions" :key="index" :label="item.fullName"
                  :value="item.fullName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding: 8px">
          <div>
            <topOpts @add="addSupplier('add')">
            </topOpts>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-if="tableDataFlag" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :setColumnDisplayList="columnList">
          <el-table-column prop="code" label="产线编码" sortable="custom">
          </el-table-column>
          <el-table-column prop="name" label="产线名称" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="workshopName" label="加工车间" sortable="custom"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>

          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)">
                <!-- <el-button type="text" size="mini" @click="handleUserRelation(scope.row.id, 'look')">查看详情</el-button> -->
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
                        <el-dropdown-item @click.native="copyFun(scope.row.id, 'copy')">
                            复制
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>

              <!--     <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button> -->
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

        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
          :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { deleteProductionLineData, getProductionLineList, getDepartmentList } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'productionLineSettings',
  components: { DepForm, ExportForm, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      searchList: [
        { field: 'code', fieldValue: '', label: '产线编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '产线名称', symbol: 'like', searchType: 1, width: 120 },

      ],
      basicQuery: {},
      superQuery: {},
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '产线编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '产线名称',
          type: 'input'
        },

        {
          prop: 'state',
          label: '状态',
          type: 'select',
          options: [
            {
              label: '启用',
              value: 'enable'
            },
            {
              label: '停用',
              value: 'disabled'
            }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      exportFormVisible: false,
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      stateList: [
        {
          label: '启用',
          value: 'enable'
        },
        {
          label: '停用',
          value: 'disabled'
        }
      ],
      listLoading: false,
      detailLoading: false,
      tableQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        code: '',
        name: '',
        state: ''
      },

      total: 0,
      columnList: ['remark', 'createByName', 'createTime'],
      workshopIdOptions: [],
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.tableDataFlag = true
    await this.getProjectList()

    this.getDepartmentList()
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    workshopIdChange(){
      this.initData()
    },
    getDepartmentList() {
      getDepartmentList('CJ').then(res => {
        this.workshopIdOptions = res.data
      })
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
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
      console.log(columnList, 'columnList')
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.tableQuery,
          exportType: '1038',
          exportName: '产线设置信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.tableQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'workshopName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      console.log('ppkkof')
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      if (this.isProjectSwitch === '1') {
        this.tableQuery.projectId = this.userInfo.projectId
      }
      getProductionLineList(this.tableQuery)
        .then((res) => {
          console.log(res, '产线')
          this.tableDataList = res.data.records
          this.tableDataList.forEach((item) => {
            if (item.state === 'enable') {
              item.state = '启用'
            }
            if (item.state === 'disabled') {
              item.state = '停用'
            }
          })
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      this.tableQuery.pageNum = 1
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.tableQuery.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.tableQuery.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.tableQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        code: '',
        name: '',
        state: ''
      }
      this.searchList = [
        { field: 'code', fieldValue: '', label: '工序编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },

      ]
      this.$refs.SuperQuery.conditionList = []
      this.search('basic')
    },
    addSupplier(type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', type)
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
      })
        .then(() => {
          deleteProductionLineData(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    copyFun(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
  }
}
</script>
