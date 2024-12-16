<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">

            <div class="JNPF-common-layout-center">

                <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16" style="margin-top:5px">
                    <el-form @submit.native.prevent>
                        <el-col :span="6">
                            <el-form-item>
                                <el-date-picker v-model="listQuery.pickerVal" type="daterange" start-placeholder="流程开始日期"
                                                end-placeholder="流程结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" clearable
                                                :editable="false">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                    {{ $t('common.search') }}</el-button>
                                <el-button size="mini" icon="el-icon-refresh-right" @click="refresh()">{{ $t('common.reset') }}
                                </el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="JNPF-common-head-right" style="display:flex;justify-content:flex-end;align-items:center;float: right;line-height: 34px;">
                            <el-tooltip content="高级查询" placement="top">
                                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" style="margin-left:12px"
                                         @click="superQueryVisible = true" />
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" style="margin-left:12px" :underline="false" @click="columnSetFun()" />
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" style="margin-left:12px" :underline="false" @click="initData()" />
                            </el-tooltip>
                        </el-col>
                    </el-form>
                </el-row>
                <div class="JNPF-common-layout-main JNPF-flex-main">

                    <JNPF-table v-loading="listLoading" :data="list" custom-column ref="dataTable">
                        <el-table-column prop="fullName" label="流程标题" show-overflow-tooltip min-width="150" />
                        <el-table-column prop="orderNo" label="上传单编码" sortable="custom" min-width="150" />
                        <el-table-column v-if="isCustomerProductPage" prop="cooperativePartnerName" label="客户名称" sortable="custom" min-width="150" />
                        <template v-if="!noProductCol">
                            <el-table-column prop="drawingNo" label="品名规格" min-width="150" />
                            <el-table-column prop="productsCode" label="产品编码" min-width="120" />
                        </template>
                        <template v-if="noProductCol || isImage ">
                            <el-table-column prop="categoryName" label="分类名称" min-width="120" />
                        </template>
                        <el-table-column prop="startTime" label="发起时间" min-width="150" :formatter="jnpf.tableDateFormat" />
                        <el-table-column prop="userName" label="发起人员" min-width="130" />
                        <el-table-column prop="flowUrgent" label="紧急程度" min-width="100" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.flowUrgent | urgentText() }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="流程状态" min-width="130" align="center">
                            <template slot-scope="{row:{status}}">
                                <el-tag :type="getStatusTagType(status)">{{ getStatusChinese(status) }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="creatorTime" label="接收时间" min-width="150">
                            <template slot-scope="scope">
                                {{ scope.row.creatorTime | toDate() }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="60" fixed="right">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="toDetail(scope.row)">审批</el-button>
                            </template>
                        </el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                                @pagination="initData" />
                </div>
            </div>
        </div>
        <FlowBox v-if="formVisible" ref="FlowBox" @close="closeForm" />
        <BatchList v-if="batchListVisible" :categoryList="categoryList" ref="BatchList" @close="batchListVisible = false" />
        <!-- 高级查询 -->
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
                    @close="superQueryVisible = false" />
    </div>
</template>

<script>
import { FlowBeforeList, getFlowBeforeList, getFlowBeforeCount } from '@/api/workFlow/FlowBefore'
import { FlowEngineListAll } from '@/api/workFlow/FlowEngine'
import FlowBox from '@/views/workFlow/components/FlowBox'
import BatchList from './BatchList'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {FlowCode, FlowId} from "@/views/esop/utils/constants";
import {getFileUploadByAuditId, getFileUploadByIds} from "@/api/esop/fileUpload/workinginstruction";
import {array2Map, trim} from "@/utils";
import {executeQueryTime, getStatusChinese, getStatusTagType} from "@/views/esop/utils/utils";
export default {
    name: 'workFlow-flowTodo',
    components: { FlowBox, BatchList, SuperQuery },
    data() {
        return {
            list: [],
            total: 0,
            listLoading: true,
            listQuery: {},
            initListQuery: {
                flowCategory: 'fileManage',
                businessFlag: true,    // 1 是 3  0 是 1和2
                createByName: "",
                creatorUserId: "",
                endTime: "",
                endUpdateTime: "",
                businessFlow: "",
                orderItems: [{
                    asc: false,
                    column: "F_CreatorTime"
                }],
                keyword: "",
                nodeCode: "",
                pageNum: 1,
                pageSize: 20,
                startTime: "",
                startUpdateTime: "",
                totalRowFlag: false,
                pickerVal: []
            },
            statusList: [{
                id: 1,
                fullName: '等待审核'
            }, {
                id: 2,
                fullName: '审核通过'
            }, {
                id: 3,
                fullName: '审核驳回'
            }, {
                id: 4,
                fullName: '流程撤回'
            }, {
                id: 5,
                fullName: '审核终止'
            }],
            urgentList: [
                {
                    id: 1,
                    fullName: '普通'
                }, {
                    id: 2,
                    fullName: '重要'
                }, {
                    id: 3,
                    fullName: '紧急'
                }
            ],
            formVisible: false,
            batchListVisible: false,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            categoryList: [],
            flowEngineList: [],
            categoryIndex: -1,
            activeName: 'system',
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: 'fullName',
                    label: "流程标题",
                    type: 'input'
                },
                {
                    prop: 'flowName',
                    label: "所属流程",
                    type: 'input'
                },
                {
                    prop: 'status',
                    label: "流程状态",
                    type: 'select',
                    options: [{
                        value: 1,
                        label: '等待审核'
                    }, {
                        value: 2,
                        label: '审核通过'
                    }, {
                        value: 3,
                        label: '审核驳回'
                    }, {
                        value: 4,
                        label: '流程撤回'
                    }, {
                        value: 5,
                        label: '审核终止'
                    }],
                },
                {
                    prop: 'creatorUserId',
                    label: "发起人员",
                    type: 'custom',
                    component: 'user-select',
                },
                {
                    prop: 'creatorTime',
                    label: "接收时间",
                    type: 'daterange',
                    valueFormat: "yyyy-MM-dd",
                },
            ],
            countItems: [],
            flowType:'businessType',
            allTotal:0
        }
    },
    filters: {
        getCategoryText(id, categoryList) {
            let item = categoryList.filter(o => o.enCode === id)[0]
            return item && item.fullName ? item.fullName : ''
        }
    },
    props:{
        flowCode:{
            type:String,
            default:FlowCode.WORK
        }
    },
    created() {
        this.initListQuery.businessFlow = this.flowCode
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        this.initData()
    },
    methods: {
        getStatusTagType,
        getStatusChinese,
        superQuerySearch(query) {
            this.listQuery.superQuery = query
            this.superQueryVisible = false
            this.search()
        },
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },
        search() {
            this.initData()
        },
       async initData() {
            this.listLoading = true
            this.listQuery.businessFlag = this.activeName === 'system'
            trim(executeQueryTime(this.listQuery,this.listQuery.pickerVal))
           try {
               const res =  await getFlowBeforeList(1, this.listQuery)
               const map = array2Map(res.data.records,'businessId')
               const fileUploadRes = await getFileUploadByIds(Array.from(map.keys()))
               this.total = res.data.total
               if(fileUploadRes.data){
                   this.list = fileUploadRes.data.map(item=> ({
                       ...map.get(item.id),
                       orderNo: item.orderNo,
                       drawingNo: item.drawingNo,
                       productsCode: item.productsCode,
                       categoryName: item.categoryName,
                       cooperativePartnerName: item.cooperativePartnerName
                   })).sort((a,b)=>b.creatorTime - a.creatorTime)
               }else{
                   this.list = []
               }

           }catch (e) {
                console.error(e)
           }finally {
               this.listLoading = false
           }
        },
        toDetail(item) {
            let data = {
                id: item.processId,
                enCode: item.flowCode,
                flowId: item.flowId,
                formType: item.formType,
                opType: 1,
                taskNodeId: item.thisStepId,
                taskId: item.id,
                businessId: item.businessId,
                businessFlow: item.businessFlow,
            }
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.FlowBox.init(data)
            })
        },
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) this.refresh()
        },
        refresh() {
            this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
            this.categoryIndex = -1
            this.initData()
        }
    },
    computed:{
        noProductCol(){
            return this.flowCode === FlowCode.OFFICE
        },
        isImage(){
            return this.flowCode === FlowCode.IMAGE
        },
        isCustomerProductPage(){
            return this.flowCode === FlowCode.CUSTOMER_PRODUCT
        }
    }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
::v-deep .el-badge__content.is-fixed {
    top: 3px !important;
    right: 27px;
}
::v-deep .el-badge__content {
    line-height: 16px !important;
}
::v-deep .el-radio-button__inner{
    border-radius:0px !important;
}
::v-deep .el-radio-button__inner{
    border-left: 1px solid #DCDFE6
}
</style>
