<template>
    <div class="JNPF-common-layout">








        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16" v-if="searchList.length">
                <el-form @submit.native.prevent>
                    <template v-for="item in searchList">
                        <el-col :span="4" :key="item.prop">
                            <el-form-item>
                                <el-input v-if="item.searchType === 1" v-model="item.fieldValue"
                                          :placeholder="'请输入' + item.label"
                                          clearable @keyup.enter.native="search('basic')"
                                />
                                <el-date-picker v-else-if="item.searchType === 2" v-model="item.fieldValue" type="month"
                                                value-format="yyyy-MM" style="width: 100%;" :clearable="false"
                                                popper-class="date_form"
                                                @change="changeDateFun()"
                                />
                                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue"
                                           :placeholder="'请选择' + item.label" :disabled="item.disabled"
                                           :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
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
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding:10px">
                  <div >
                      <el-button type="primary" size="mini" icon="el-icon-plus"
                        @click="addOrUpdateHandle(listQuery.accountPeriod, 'normal')" :disabled=" listQuery.accountPeriod !== accountPeriod[0]"
                        >结存
                        </el-button>
                        <el-button type="primary" size="mini" icon="el-icon-refresh-left"
                                   @click="addOrUpdateHandle(listQuery.accountPeriod, 'reverse')" :disabled="!tableData.length
                || tableData[0].accountPeriod !== listQuery.accountPeriod
                || accountPeriod.includes(tableData[0].accountPeriod)
                || accountPeriod.length > 1
                || isInCurrentOrLastMonth(tableData[0].accountPeriod)"
                        >反结存
                        </el-button>

                  </div>

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
                <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" custom-column fixedNO
                            @sort-change="sortChange" :setColumnDisplayList="columnList"
                 customKey="JNPFTableKey_430759">
                    <el-table-column prop="accountPeriod" label="账期" min-width="160"/>
                    <el-table-column prop="balanceState" label="结存状态" min-width="160">
                        <template slot-scope="scope">
                            <el-tag type="warning" v-if="scope.row.balanceState === 'not_finished'">未结存</el-tag>
                            <el-tag type="success" v-else-if="scope.row.balanceState === 'finished'">已结存</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productsDrawingNo" label="型号" min-width="200"
                                     sortable="custom"
                    />
                    <el-table-column prop="productsName" label="产品名称" v-if="isProductNameSwitch === '1'" min-width="160" sortable="custom"/>
                    <el-table-column prop="productsCode" label="产品编码" min-width="160" sortable="custom"/>
                    <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom"/>
                    <AttributeColumns :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'warehouse'" />
                    <el-table-column prop="warehouseName" label="仓库名称" min-width="160" sortable="custom"/>
                    <el-table-column prop="warehouseCode" label="仓库编码" min-width="160" sortable="custom"/>
                    <el-table-column prop="mainUnit" label="单位" min-width="140"/>
                    <el-table-column prop="initInventoryQuantity" label="期初数量" min-width="140" sortable="custom"/>
<!--                    <el-table-column prop="initPrice" label="期初单价(含税)" min-width="160" sortable="custom"/>-->
<!--                    <el-table-column prop="initAmount" label="期初金额(含税)" min-width="160" sortable="custom">-->
<!--                    </el-table-column>-->
                    <el-table-column prop="inboundQuantity" label="入库数量" min-width="140" sortable="custom">
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="inboundAndOutboundLine('inbound', scope.row.id)">
                                {{ scope.row.inboundQuantity }}
                            </el-link>
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="inboundPrice" label="入库单价(含税)" min-width="160" sortable="custom"/>-->
<!--                    <el-table-column prop="inboundAmount" label="入库金额(含税)" min-width="160" sortable="custom">-->
<!--                    </el-table-column>-->
                    <el-table-column prop="outboundQuantity" label="出库数量" min-width="140" sortable="custom">
                        <template slot-scope="scope">
                            <el-link type="primary" @click.native="inboundAndOutboundLine('outbound', scope.row.id)">
                                {{ scope.row.outboundQuantity }}
                            </el-link>
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="outboundPrice" label="出库单价(含税)" min-width="160" sortable="custom"/>-->
<!--                    <el-table-column prop="outboundAmount" label="出库金额(含税)" min-width="160" sortable="custom">-->
<!--                    </el-table-column>-->
                    <el-table-column prop="endInventoryQuantity" label="期末数量" min-width="140" sortable="custom"/>
<!--                    <el-table-column prop="endPrice" label="期末单价(含税)" min-width="160" sortable="custom"/>-->
<!--                    <el-table-column prop="endAmount" label="期末金额(含税)" min-width="160" sortable="custom">-->
<!--                    </el-table-column>-->
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>

        <Form v-if="formVisible" ref="Form" @close="closeForm"/>
        <inboundAndOutboundLine v-if="lineVisible" ref="lineForm" @close="closeForm" :listMethod="stockBalanceLineList"
                                :listRequestObj="inboundAndOutboundQuery" :tableItems="tableItems"
                                :searchList="searchLineList"
                                :documentType="inboundAndOutboundQuery.documentType"
        />

        <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
                   lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px"
        >
            <el-row :gutter="20">
                <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
                    <el-col :span="12">
                        <el-form-item label="账期">
                            <el-date-picker v-model="listQuery.accountPeriod" type="month" value-format="yyyy-MM"
                                            style="width: 100%;"
                                            :clearable="false" placeholder="请选择账期" popper-class="date_form"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品编码">
                            <el-input v-model.trim="listQuery.productsCode" placeholder="请输入产品编码" clearable
                                      @keyup.enter.native="search()"
                            />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="产品名称">
                            <el-input v-model.trim="listQuery.productsName" placeholder="请输入产品名称" clearable
                                      @keyup.enter.native="search()"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品图号">
                            <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入型号" width="180"
                                      clearable
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="仓库编码">
                            <el-input v-model="listQuery.warehouseCode" placeholder="请输入仓库编码" width="180"
                                      clearable maxlength="20"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="仓库名称">
                            <el-input v-model="listQuery.warehouseName" placeholder="请输入仓库名称" width="180"
                                      clearable maxlength="20"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>

                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.searchButton') }}
        </el-button>
      </span>
        </el-dialog>
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
        <!--    <actualCostIndex v-if="businessCode === 'metalworking'" ref="actualCostForm" @close="closeForm"-->
        <!--      :listMethod="actualCostList" :listRequestObj="actualCostQuery" :tableItems="costTableItems"-->
        <!--      :searchList="costSearchList" :businessCode='businessCode' />-->
        <!--    <actualCostIndex v-if="businessCode === 'complete'" ref="actualCostForm" @close="closeForm"-->
        <!--      :listMethod="actualCostList" :listRequestObj="actualCostQuery" :tableItems="completeTableItems"-->
        <!--      :businessCode='businessCode' />-->
        <!--    <actualCostIndex v-if="businessCode === 'assemble'" ref="actualCostForm" @close="closeForm"-->
        <!--      :listMethod="actualCostList" :listRequestObj="actualCostQuery" :tableItems="assembleTableItems"-->
        <!--      :businessCode='businessCode' />-->
        <!-- 高级查询 -->
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false"
        />
    </div>
</template>

<script>
import {
    stockBalanceList,
    canStockBalance,
    stockBalanceReport,
    stockBalanceLineList,
    actualCostList,
} from '@/api/balances/index'
import Form from './Form'
import inboundAndOutboundLine from './inboundAndOutboundLine.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import actualCostIndex from './actualCostIndex.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'

export default {
    name: 'inventoryBalance',
    components: { SuperQuery, Form, inboundAndOutboundLine, ExportForm, actualCostIndex },
    mixins:[AbProjectMixin],
    data() {
        return {
            stockBalanceLineList,
            actualCostList,
            actualCostLineVisible: false,
            superQueryVisible: false,
            title: '更多查询',
            tableData: [],
            listLoading: false,
            exportFormVisible: false,
            visible: false,
            lineVisible: false,
            columnList: ['warehouseCode'],
            superQueryJson: [],
            basicQuery: {},
            superQuery: {},
            searchList: [],
            listQuery: {},
            initListQuery: {
                accountPeriod: this.jnpf.getToday('YYYY-MM'),
                balanceId: '',
                batchNumber: '',
                createByName: '',
                documentType: '',
                endTime: '',
                endUpdateTime: '',
                keyword: '',
                moveOrderNo: '',
                pageNum: 1,
                pageSize: 20,
                productsCode: '',
                productsDrawingNo: '',
                productsName: '',
                startTime: '',
                startUpdateTime: '',
                totalRowFlag: false,
                warehouseCode: '',
                warehouseName: '',
                orderItems: [{
                    asc: false,
                    column: ''
                }, {
                    asc: false,
                    column: 'productsDrawingNo',
                }],
                superQuery: {},
                projectId: '',
            },
            total: 0,
            formVisible: false,
            accountPeriod: [],
            // 出入库明细参数
            inboundAndOutboundQuery: {
                accountPeriod: '',
                balanceId: '',
                batchNumber: '',
                createByName: '',
                documentType: '',
                orderEndDate: '',
                endUpdateTime: '',
                keyword: '',
                orderNo: '',
                'orderItems': [
                    {
                        'asc': true,
                        'column': ''
                    }
                ],
                pageNum: 1,
                pageSize: 20,
                productCode: '',
                drawingNo: '',
                productName: '',
                orderStartDate: '',
                startUpdateTime: '',
                totalRowFlag: false,
                warehouseCode: '',
                warehouseName: '',
                moveOrderNo:"",
            },
            tableItems: [
                { prop: 'orderNo', label: '出入库单号', minWidth: '180' },
                { prop: 'drawingNo', label: '型号', minWidth: '300' },
                { prop: 'productName', label: '产品名称' },
                { prop: 'productCode', label: '产品编码', minWidth: '140' },
                { prop: 'batchNumber', label: '批次号', minWidth: '180' },
                { prop: 'businessTypeName', label: '业务类型', minWidth: '180', },
                { prop: 'mainUnit', label: '单位', minWidth: '80' ,custom:'custom'},
                { prop: 'num', label: '数量',custom:'custom' },
                { prop: 'beforeInventory', label: '变动前库存', custom:'custom'},
                { prop: 'afterInventory', label: '变动后库存',custom:'custom' },


                // { prop: 'costPrice', label: '单价(含税)' },
                // { prop: 'excludingTaxCostPrice', label: '单价(不含税)' },
                // { prop: 'taxRate', label: '税率' },
                // { prop: 'taxAmount', label: '税额' },
                // { prop: 'totalAmount', label: '金额(不含税)' },
                { prop: 'orderDate', label: '出入库日期', minWidth: '180',custom:'custom' }
            ],
            searchLineList: [
                {
                    fieldValue: '',
                    field: 'moveOrderNo',
                    label: '出入库单号',
                    prop: 'moveOrderNo',
                    symbol: 'like',
                    searchType: 1
                },
                {
                    fieldValue: '',
                    field: 'batchNumber',
                    label: '批次号',
                    prop: 'batchNumber',
                    symbol: 'like',
                    searchType: 1
                },
                {
                    fieldValue: '',
                    field: 'orderDate',
                    label: '出入库日期',
                    prop: 'orderDate',
                    symbol: 'like',
                    searchType: 2
                }
            ],
            // 金工
            actualCostQuery: {
                blankProductsDrawingNo: '',
                createByName: '',
                endTime: '',
                endUpdateTime: '',
                keyword: '',
                orderItems: [
                    {
                        'asc': false,
                        'column': ''
                    },
                    {
                        'asc': false,
                        'column': 'group_batch_number'
                    }
                ],
                pageNum: 1,
                pageSize: 20,
                productsId: '',
                startTime: '',
                startUpdateTime: '',
                totalRowFlag: false
            },
            costTableItems: [
                { prop: 'productsCode', label: '产品编码', minWidth: '140' },
                { prop: 'productsName', label: '产品名称' },
                { prop: 'productsDrawingNo', label: '产品图号', minWidth: '300' },
                { prop: 'inboundQuantity', label: '数量' },
                { prop: 'blankProductsName', label: '毛坯产品名称' },
                { prop: 'blankProductsDrawingNo', label: '毛坯产品图号', minWidth: '180' },
                { prop: 'blankProductsCode', label: '毛坯料号' },
                { prop: 'grossWeight', label: '毛坯重(kg)' },
                { prop: 'materialCost', label: '材料成本(元)' },
                { prop: 'productWeight', label: '成品重(kg)' },
                { prop: 'drillWorkingHours', label: '钻孔工时(s)' },
                { prop: 'totalWorkingHours', label: '总工时(s)' },
                { prop: 'totalLaborCost', label: '总人工费用(元)', minWidth: '160' },
                { prop: 'feeAmount', label: '总制造费用(元)', minWidth: '160' },
                { prop: 'totalCostAmount', label: '成本总金额(元)', fixed: 'right', minWidth: '160' },
                { prop: 'groupBatchNumber', label: '物料组批次号', minWidth: '160' }
            ],
            costSearchList: [
                { prop: 'blankProductsDrawingNo', label: '毛坯产品图号', type: 'input' }
            ],
            businessCode: '',
            // 组装
            assembleTableItems: [
                { prop: 'productsCode', label: '产品编码' },
                { prop: 'productsName', label: '产品名称' },
                { prop: 'productsDrawingNo', label: '产品图号', minWidth: '180' },
                { prop: 'inboundQuantity', label: '数量' },
                { prop: 'materialCost', label: '材料成本(元)' },
                { prop: 'totalLaborCost', label: '总人工费用(元)', minWidth: '160' },
                { prop: 'feeAmount', label: '总制造费用(元)', minWidth: '160' },
                { prop: 'totalCostAmount', label: '成本总金额(元)', fixed: 'right', minWidth: '160' },
                { prop: 'groupBatchNumber', label: '物料组批次号', minWidth: '160' }
            ],
            // 总成
            completeTableItems: [
                { prop: 'productsCode', label: '产品编码' },
                { prop: 'productsName', label: '产品名称' },
                { prop: 'productsDrawingNo', label: '产品图号', minWidth: '180' },
                { prop: 'hoseLength', label: '胶管长度' },
                { prop: 'inboundQuantity', label: '数量' },
                { prop: 'materialCost', label: '材料成本(元)' },
                { prop: 'totalLaborCost', label: '总人工费用(元)', minWidth: '160' },
                { prop: 'feeAmount', label: '总制造费用(元)', minWidth: '160' },
                { prop: 'totalCostAmount', label: '成本总金额(元)', fixed: 'right', minWidth: '160' },
                { prop: 'groupBatchNumber', label: '物料组批次号', minWidth: '160' }
            ],
            isProductNameSwitch:'',
            defaultProjectId:''
        }
    },

    async created() {
        await this.awaitAbProject()
        if(this.abProjectSwitchVisible){

          this.defaultProjectId = this.abProjectNoCommonList.find(item=>item.value === this.abProjectId) ? this.abProjectId : this.abProjectNoCommonList[0].id
          this.initListQuery.projectId = this.defaultProjectId
        }else{
          this.defaultProjectId='1'
        }
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        const res = await canStockBalance(this.defaultProjectId)
        this.accountPeriod = res.data
        this.listQuery.accountPeriod = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.listQuery.accountPeriod
        await this.getProductNameSwitch('product', 'enable_productName')
        this.setSuperQueryJson()
        this.setSearchList()
        this.initData()
    },
    methods: {

      async changeDateFun(){
            const res = await canStockBalance(this.defaultProjectId)
        this.accountPeriod = res.data
        this.listQuery.accountPeriod = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.listQuery.accountPeriod
        this.search('basic')
      },
        setSearchList(){
            this.searchList = [

                {
                    fieldValue: '',
                    field: 'accountPeriod',
                    label: '账期',
                    prop: 'accountPeriod',
                    symbol: 'like',
                    searchType: 2
                },
                {
                    fieldValue: '',
                    field: 'productsDrawingNo',
                    label: '型号',
                    prop: 'productsDrawingNo',
                    symbol: 'like',
                    searchType: 1
                },
                {
                    fieldValue: '',
                    field: 'warehouseName',
                    label: '仓库名称',
                    prop: 'warehouseName',
                    symbol: 'like',
                    searchType: 1
                }
            ]
            if(this.abProjectSwitchVisible){
              let arr=[
                    {
                    fieldValue: this.defaultProjectId,
                    field: 'projectId',
                    label: '所属项目',
                    prop: 'projectId',
                    disabled:this.abProjectId === '1' ? false : true,
                    symbol: 'like',
                    searchType: 4,
                    options:this.abProjectNoCommonList,
                    clearable:false,
                },
              ]
              this.searchList=[...arr,...this.searchList]
              this.searchList[1].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.listQuery.accountPeriod
            }else{
              this.searchList[0].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.listQuery.accountPeriod

            }
        },
        setSuperQueryJson(){
            this.superQueryJson = [
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
                    label: '型号',
                    type: 'input'
                },
                {
                    prop: 'productsName',
                    label: '产品名称',
                    type: 'input',
                    render:this.isProductNameSwitch === '1'
                },
                {
                    prop: 'productsCode',
                    label: '产品编码',
                    type: 'input'
                },
                {
                    prop: 'processName',
                    label: '工序名称',
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
            ]
        },
        async getProductNameSwitch(code, type) {
            try {
                this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
            } catch (error) { }
        },
        isInCurrentOrLastMonth(dateString) {
            // 获取当前日期
            const now = new Date()
            const currentYear = now.getFullYear()
            const currentMonth = now.getMonth() // 月份从0开始，0代表1月，11代表12月

            // 解析输入的日期字符串
            const [month, day] = dateString.split('-').map(Number)

            // 创建指定日期对象
            const targetDate = new Date(currentYear, month - 1, day) // month - 1 因为月份从0开始

            // 获取指定日期的月份
            const targetMonth = targetDate.getMonth()
            const targetYear = targetDate.getFullYear()

            // 检查是否在本月或上月
            if (targetYear === currentYear) {
                if (targetMonth === currentMonth || targetMonth === currentMonth - 1) {
                    return true
                }
            } else if (targetYear === currentYear - 1 && currentMonth === 0 && targetMonth === 11) {
                // 处理跨年情况：去年12月
                return true
            }

            return false
        },
        superQuerySearch(query) {
            this.superQuery = query
            this.superQueryVisible = false
            this.search('super')
        },
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },
        sortChange({ prop, order }) {
            let newProp = ''
            console.log(prop)
            if (['productsDrawingNo','productsCode','productsName','warehouseName'].includes(prop)) {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
            }
            this.listQuery.orderItems[0].asc = order === 'ascending'
            this.listQuery.orderItems[0].column = order === null ? '' : newProp
            this.initData()
        },
        // 关闭新建编辑页面
        closeForm(isRefresh) {
            this.formVisible = false
            this.lineVisible = false
            this.actualCostLineVisible = false
            this.businessCode = ''
            if (isRefresh) {
                this.keyword = ''
                this.initData()
            }
        },
        async initData() {
            this.visible = false
            this.listLoading = true
            Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })

            // this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
            stockBalanceReport(this.listQuery).then(res => {
                this.tableData = res.data.page ? res.data.page.records : []
                // 合计 以后用到放开即可
                // res.data.total ? this.totalList.push(res.data.total) : ''
                this.total = res.data.page ? res.data.page.total : 0
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
                        this.listQuery[item.field] = item.fieldValue
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
        async reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
            const res = await canStockBalance(this.defaultProjectId)
            this.accountPeriod = res.data
            this.setSearchList()
            this.listQuery.accountPeriod = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.listQuery.accountPeriod

            this.search()
        },

        addOrUpdateHandle(accountPeriod, type = 'normal') {
          console.log("this",this.listQuery);
          this.searchList.filter(item => item.fieldValue).map(item => {
                        this.listQuery[item.field] = item.fieldValue
                        return {
                            ...item,
                            fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                        }
                    })
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(accountPeriod, type,this.listQuery.projectId)
            })
        },

        // 导出
        exportForm() {
            this.exportFormVisible = true
            let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
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
                let _data = {
                    ...this.listQuery,
                    exportType: '1116',
                    exportName: '仓库库存结存',
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
        },
        // 明细列表
        inboundAndOutboundLine(type, id) {
            this.lineVisible = true
            this.inboundAndOutboundQuery.documentType = ""
            this.inboundAndOutboundQuery.balanceId = id
            this.$nextTick(() => {
                this.$refs.lineForm.getData()
            })
        },
        // 实际成本 列表
        actualCostLine(row) {
            this.actualCostLineVisible = true
            this.businessCode = row.businessCode
            this.actualCostQuery.productsId = row.productsId
            this.actualCostQuery.createTimeArr = [this.listQuery.accountPeriod + '-01 00:00:00', this.listQuery.accountPeriod + '-31 23:59:59']
            this.$nextTick(() => {
                this.$refs.actualCostForm.getData()
            })
        }
    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped/>

