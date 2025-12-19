<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <JNPF-tableQuery :listQuery="tableQuery" :systemSearchView="systemSearchView" tableRef="tableForm" />
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
                <div class="JNPF-common-head" style="padding: 8px">
                    <div>
                        <topOpts @add="addSupplier">
                            <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
                                icon="el-icon-download" @click="exportForm">
                                导出
                            </el-button>
                        </topOpts>
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.tableForm.showSortDrawer()" />
              </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-if="tableDataFlag" ref="tableForm" :data="tableDataList"
                    custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_221547" :listQuery="tableQuery" @queryChange="initData" :queryJson="superQueryJson">
                    <el-table-column prop="code" label="班组编码" min-width="160">
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">
                                {{ scope.row.code }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="班组名称" min-width="160" />
                    <el-table-column prop="projectName" label="所属项目" width="120"
                        v-if="isProjectSwitch === '1'"></el-table-column>
                    <el-table-column prop="workType" label="做工类型" min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.workType == 'same'">同道工序</div>
                            <div v-else-if="scope.row.workType == 'different'">不同工序</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportingType" label="报工类型" width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.reportingType == 'by_process'">按工序和人报工</div>
                            <div v-else-if="scope.row.reportingType == 'by_total'">按工序总数报工</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" minWidth="100">
                        <template slot-scope="scope">
                            <el-tag type="danger" disable-transitions v-if="scope.row.state === 'disabled'">停用</el-tag>
                            <el-tag type="success" disable-transitions v-else>启用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="100" />
                    <el-table-column prop="createTime" label="创建时间" width="180" />
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                                @del="handleDel(scope.row.id, scope.row.parentId)">
                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData()" />
            </div>
        </div>

        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    </div>
</template>

<script>
import { getGroupList, deleteGroupData } from '@/api/basicData/index'
import DepForm from './depForm'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
    name: 'quality',
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
            prop: 'state',
            symbol: '==',
            fixed: true,
            value: 'enable'
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


      superQueryVisible: false,
      superQueryJson: [{
        prop: 'workType',
        label: '做工类型',
        type: 'select',
        options: [{
          label: '同道工序',
          value: 'same'
        }, {
          label: '不同工序',
          value: 'different'
        }]
      }, {
        prop: 'reportingType',
        label: '报工类型',
        type: 'select',
        options: [{
          label: '按工序和人报工',
          value: 'by_process'
        }, {
          label: '按工序总数报工',
          value: 'by_total'
        }]
      }, {
        prop: 'state',
        label: '状态',
        type: 'select',
        options: [{
          label: '启用',
          value: 'enable'
        }, {
          label: '停用',
          value: 'disabled'
        }]
      }],
      exportFormVisible: false,
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      listLoading: false,
      tableQuery: {},
      total: 0,
      formVisible: false,
      columnList: ['remark', 'createByName', 'createTime'],
    }
  },
    async created() {
        await this.getProjectSwitch('system', 'project')
        this.tableDataFlag = true
    },
    methods: {
      // 关闭新建、编辑页面
      closeForm(isRefresh) {
        this.formVisible = false
        if (isRefresh) {
          this.initData()
        }
      },
      initData(listQuery) {
        if (listQuery) this.tableQuery = listQuery;
        if (!this.tableQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
        const listLoadKey = this.listLoadKey = +new Date();
        if (listLoadKey !== this.listLoadKey) return; // 请求过期

        if (this.isProjectSwitch === '1') {
          this.tableQuery.projectId = this.userInfo.projectId
        }
        this.listLoading = true
        getGroupList(this.tableQuery)
          .then((res) => {
            //
            this.tableDataList = res.data.records
            this.listLoading = false
            this.total = res.data.total
          })
          .catch(() => {
            this.listLoading = false
          })
      },


        addSupplier() {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init('', 'add')
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
                    deleteGroupData(id).then((res) => {
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
        handleUserRelation(id, parentId, btnType) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, parentId, btnType)
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
            console.log(columnList, 'columnList')
            this.$nextTick(() => {
                this.$refs.exportForm.init(columnList)
            })
        },
        download(data) {
            console.log(data, 'data')
            if (data) {
                this.exportFormVisible = false
                let includeFieldMap = {}
                for (let i = 0; i < data.selectKey.length; i++) {
                    includeFieldMap[data.selectKey[i]] = data.selectVal[i]
                }
                let _data = {
                    ...this.tableQuery,
                    exportType: '1037',
                    exportName: '班组设置信息',
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
