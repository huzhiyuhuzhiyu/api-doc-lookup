<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="tableQuery" :systemSearchView="systemSearchView" tableRef="tableForm" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding: 8px">
          <div>
            <topOpts @add="addSupplier('add')">
            </topOpts>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.tableForm.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-if="tableDataFlag" ref="tableForm" :data="tableDataList" custom-column
          :setColumnDisplayList="columnList" customKey="JNPFTableKey_939659" :listQuery="tableQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="code" label="产线编码">
          </el-table-column>
          <el-table-column prop="name" label="产线名称" />
          <el-table-column prop="type" label="所属类型" >
            <template slot-scope="scope">
              <div v-if="scope.row.type=='produce'">套圈  </div>
              <div v-if="scope.row.type=='assemble'">装配  </div>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="workshopName" label="加工车间"></el-table-column>
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
          :limit.sync="tableQuery.pageSize" @pagination="initData()" />
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->

  </div>
</template>

<script>
import { deleteProductionLineData, getProductionLineList, getDepartmentList } from '@/api/basicData/index'
import DepForm from './depForm'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'productionLineSettings',
  components: { DepForm, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [{
            prop: 'code',
            symbol: 'like',
            fixed: true
          }, {
            prop: 'name',
            symbol: 'like',
            fixed: true
          }, {
            prop: 'workshopName',
            symbol: '==',
            fixed: true
          }],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      isProjectSwitch: '',
      tableDataFlag: false,
      superQueryJson: [],
      exportFormVisible: false,
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      listLoading: false,
      detailLoading: false,
      tableQuery: {},
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
  },
  methods: {
    getDepartmentList() {
      getDepartmentList('CJ').then(res => {
        this.workshopIdOptions = res.data
      })
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

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData(listQuery) {
      if (listQuery) this.tableQuery = listQuery;
      if (!this.tableQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.tableQuery.projectId = this.userInfo.projectId
      }
      getProductionLineList(this.tableQuery)
        .then((res) => {
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
    addSupplier(type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', type)
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
        this.$refs.depForm.init('', type)
      })
    },
  }
}
</script>
