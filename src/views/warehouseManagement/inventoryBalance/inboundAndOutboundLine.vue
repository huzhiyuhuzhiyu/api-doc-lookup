<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <template v-for="item in searchList">
                        <el-col :span="4" :key="item.prop">
                            <el-form-item>
                                <el-input v-if="item.searchType === 1" v-model="item.fieldValue"
                                          :placeholder="'请输入' + item.label"
                                          clearable @keyup.enter.native="search('basic')"
                                />
                                <el-date-picker v-else-if="item.searchType === 2" v-model="item.fieldValue" type="date"
                                                value-format="yyyy-MM-dd" style="width: 100%;" :clearable="false"
                                                popper-class="date_form"
                                                @change="search('basic')"
                                />
                                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue"
                                           :placeholder="'请选择' + item.label"
                                           clearable
                                >
                                    <el-option v-for="(item2, index2) in item.options" :key="index2"
                                               :label="item2.label"
                                               :value="item2.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                    $t('common.reset')
                                }}
                            </el-button>
                            <el-button :disabled="tableData.length > 0 ? false : true" size="mini"
                                       icon="el-icon-download"
                                       @click="exportForm"
                            >导出
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <el-page-header @back="$emit('close', true)"
                                    :content="listQuery.documentType === 'inbound' ? '入库数量明细' : '出库数量明细'"
                    />
                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                     @click="superQueryVisible = true"
                            />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                     @click="columnSetFun()"
                            />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                     @click="initData()"
                            />
                        </el-tooltip>
                    </div>
                </div>

                <JNPF-table :partentOrChild="'child'" ref="dataTables" v-loading="listLoading" :data="tableData" fixedNO
                            custom-column
                >
                    <!-- <template v-for="item in tableItems"> -->
                    <el-table-column v-for="item in tableItems" :key="item.prop" :prop="item.prop" :label="item.label"
                                     :fixed="item.fixed || false" :min-width="item.minWidth || 120"
                    />
                    <!-- </template> -->
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>
        <!-- <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
          lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" append-to-body>
          <el-row :gutter="20">
            <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

              <el-col :span="12" v-for="item in searchListMore" :key="item.prop">
                <el-form-item :label="item.label">
                  <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                    clearable />

                  <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                    :placeholder="'请选择' + item.label" style="width: 100%;">
                    <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>

                  <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery.reconciliationDateArr" type="daterange"
                    value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="创建开始日期" end-placeholder="创建结束日期">
                  </el-date-picker>

                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="moreQueriesVisible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" @click="search()">搜 索</el-button>
          </span>
        </el-dialog> -->
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
        <!-- 高级查询 -->
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false"
        />
    </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'

export default {
    name: 'inboundAndOutboundLine',
    components: { SuperQuery, ExportForm },
    props: {
        documentType: {
            type: String,
            required: true
        },
        tableItems: {
            type: Array,
            default: () => []
            /* [
                {prop:'code',label:'编码'},
                {prop:'name',label:'名称'}
              ] */
        },
        searchList: {
            type: Array,
            default: () => []
            /* [
                {prop:'code',label:'编码'},
                {prop:'name',label:'名称'}
              ] */
        },
        searchListMore: {
            type: Array,
            default: () => []
            /* [
                {prop:'code',label:'编码'},
                {prop:'name',label:'名称'}
              ] */
        },
        /* 列表数据请求方法 */
        listMethod: {
            required: true
        },
        /* 列表数据请求体 */
        listRequestObj: {
            type: Object | Function,
            required: true
            /*
              对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
              函数写法：(rowIndex) => {
                let id = this.linesList[rowIndex].id
                return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
              }
            */
        }
    },
    data() {
        return {
            title: '更多查询',
            tableData: [],
            listLoading: false,
            visible: false,
            listQuery: {},
            total: 0,
            exportFormVisible: false,
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: 'accountPeriod',
                    label: '账期',
                    type: 'month',
                    valueFormat: 'yyyy-MM'
                },
                {
                    prop: 'balanceState',
                    label: '结存状态',
                    type: 'select',
                    options: [
                        { label: '未结存', value: 'not_finished' },
                        { label: '已结存', value: 'finished' }
                    ]
                },
                {
                    prop: 'productsDrawingNo',
                    label: this.$store.getters.productDrawingNo,
                    type: 'input'
                },
                {
                    prop: 'productsName',
                    label: '产品名称',
                    type: 'input'
                },
                {
                    prop: 'productsCode',
                    label: '产品编码',
                    type: 'input'
                },
                {
                    prop: 'warehouseName',
                    label: '仓库名称',
                    type: 'input'
                },
                {
                    prop: 'warehouseCode',
                    label: '仓库编码',
                    type: 'input'
                },
                {
                    prop: 'mainUnit',
                    label: '单位',
                    type: 'input'
                }
            ],
            basicQuery: {},
            superQuery: {}
        }
    },

    created() {
        this.getData()
    },
    methods: {
        superQuerySearch(query) {
            this.superQuery = query
            this.superQueryVisible = false
            this.search('super')
        },
        columnSetFun() {
            this.$refs.dataTables.showDrawer()
        },
        getData() {
            this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
            this.initData()
        },

        initData() {
            this.visible = false
            this.listLoading = true
            Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
            this.listMethod(this.listQuery).then(res => {
                this.tableData = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search(type) {
            // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
            if (type === 'basic') {
                this.basicQuery = {
                    matchLogic: 'AND',
                    condition: this.searchList.filter(item => item.fieldValue).map(item => {
                        return {
                            ...item,
                            fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                        }
                    })
                }
                this.listQuery.superQuery = this.basicQuery
            }
            if (type === 'super') {
                this.listQuery.superQuery = this.superQuery
            }
            this.initData()
        },
        reset() {
            this.getData()
        },
        // 导出
        exportForm() {
            this.exportFormVisible = true
            let columnList = this.$refs.dataTables.columnList.filter(item => !!item.label && !!item.prop)
            console.log(this.$refs.dataTables, '111')
            columnList = columnList.map(item => {
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
                console.log(includeFieldMap)
                let _data = {
                    ...this.listQuery,
                    exportType: '1117',
                    exportName: '仓库存货结存明细',
                    includeFieldMap,
                    pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
                    totalRowFlag: true
                }
                excelExport(_data).then(res => {
                    this.exportFormVisible = false
                    if (!res.data.url) return
                    this.jnpf.downloadFile(res.data.url)
                }).catch(() => {
                })
            }
        }

    }
}
</script>
<style scoped>
.el-tab-pane {
    height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
    height: calc(100% - 40px);
}

.el-tabs {
    height: 100%;
}

.el-tabs__nav-scroll {
    padding-left: 10px;
}

.JNPF-common-head {
    padding: 10px;
}

.JNPF-common-search-box {
    padding-top: 5px;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
}

.pagination-container {
    background-color: #ebeef5;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.main {
    padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
    padding: 0 !important;
    padding-bottom: 10px !important;
    margin-bottom: 0;
    padding-left: 10px !important;
    background: #fff;
}

.el-button--small {
    padding: 1;
}

::v-deep .JNPF-common-page-header {
    padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding-bottom: 0;
}

::v-deep.el-range-editor--small.el-input__inner {
    height: 34px;
}

::v-deep.el-table__body-wrapper {
    height: auto !important;
}
</style>

