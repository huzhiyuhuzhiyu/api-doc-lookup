<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="通知单列表" name="orderList">
                    <div class="JNPF-common-layout-center JNPF-flex-main">
                        <el-row class="JNPF-common-search-box" :gutter="16">
                            <el-form @submit.native.prevent>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model="form.quotationNo" placeholder="请输入报价单号" clearable
                                            @keyup.enter.native="search()" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model="form.bidder" placeholder="请输入报价人" clearable
                                            @keyup.enter.native="search()" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model="form.cooperativePartnerIdText" placeholder="请输入客户名称" clearable
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
                                    icon="icon-ym icon-ym-report-icon-search-setting"
                                    @click="moreQueries()">更多查询</el-button>
                            </el-form>
                        </el-row>
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <div class="JNPF-common-head">
                                <!-- <el-dropdown> -->
                                <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('','add')"
                                    size="mini">
                                    新建
                                </el-button>
                                <div class="JNPF-common-head-right">
                                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                                        <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                            @click="initData()" />
                                    </el-tooltip>
                                </div>
                            </div>
                            <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" :fixedNO="true"
                                @sort-change="sortChange" custom-column>
                                <el-table-column prop="quotationNo" label="报价单号" min-width="200" sortable="custom">
                                    <template slot-scope="scope">
                                        <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                            scope.row.quotationNo
                                        }}</el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="deliver" label="致" sortable="custom" width="120" />
                                <!-- <el-table-column prop="cooperativePartnerCode" label="客户编号" sortable="custom"
                        width="120" /> -->
                                <el-table-column prop="cooperativePartnerIdText" label="客户名称" sortable="custom"
                                    width="200" />
                                <el-table-column prop="bidder" label="报价人" sortable="custom" width="120" />
                                <el-table-column prop="quotationTime" label="报价时间" width="180" sortable="custom" />
                                <el-table-column prop="validEnd" label="有效时间止" width="180" sortable="custom" />
                                <el-table-column prop="address" label="地址" min-width="300" />
                                <el-table-column prop="phone" label="电话" width="160" />
                                <el-table-column prop="fax" label="传真" width="160" />
                                <el-table-column prop="totalAmount" label="总金额" width="140" />

                                <el-table-column prop="reasonRejection" label="驳回理由" min-width="230" />
                                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120"
                                    fixed="right" align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag>
                                        </div>
                                        <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag
                                                type="success">提交</el-tag></div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom"
                                    fixed="right" align="center">
                                    <template slot-scope="scope">
                                        <div
                                            v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'">
                                            <el-tag>审批中</el-tag>
                                        </div>
                                        <div
                                            v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'">
                                            <el-tag type="success">审批通过</el-tag>
                                        </div>
                                        <div
                                            v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'">
                                            <el-tag type="danger">审批拒绝</el-tag>
                                        </div>
                                        <div
                                            v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                                            <el-tag type="warning">审批撤回</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom" />
                                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                                <el-table-column prop="createByName" label="创建人" width="110" />
                                <el-table-column prop="remark" label="备注" min-width="280" />
                                <el-table-column label="操作" width="280" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini"
                                            :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                                        <el-button type="text"
                                            :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                                            @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn">删除</el-button>
                                        <el-button type="text"
                                            :disabled="scope.row.generateFlag || scope.row.approvalStatus !== 'ok'"
                                            size="mini"
                                            @click.native="handleUsercustom(scope.row.id, 'custom')">生成客户产品</el-button>
                                        <el-dropdown hide-on-click>
                                            <span class="el-dropdown-link">
                                                <el-button type="text" size="mini">
                                                    {{ $t('common.moreBtn') }}<i
                                                        class="el-icon-arrow-down el-icon--right"></i>
                                                </el-button>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                              <el-dropdown-item v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                                                    @click.native="addSupplier(scope.row.id, 'add')">
                                                    重新提交
                                                </el-dropdown-item>
                                              <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                                                    @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                                                    审批撤回
                                                </el-dropdown-item>
                                                <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                                                    查看详情
                                                </el-dropdown-item>
                                                <el-dropdown-item @click.native="download(scope.row.id)">
                                                    下载报价单
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                            </JNPF-table>
                            <pagination :total="total" :page.sync="form.pageNum" :background="background"
                                :limit.sync="form.pageSize" @pagination="initData" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="明细列表" name="detailList">
                    <div class="JNPF-common-layout-center JNPF-flex-main">
                        <el-row class="JNPF-common-search-box" :gutter="16">
                            <el-form @submit.native.prevent>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model="linesQuery.quotationNo" placeholder="请输入报价单号"
                                            @keyup.enter.native="search()" clearable />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model="linesQuery.bidder" placeholder="请输入报价人"
                                            @keyup.enter.native="search()" clearable />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-input v-model="linesQuery.cooperativePartnerIdText" placeholder="请输入客户名称"
                                            @keyup.enter.native="search()" clearable />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                                            {{ $t('common.search') }}</el-button>
                                        <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                            $t('common.reset') }}
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                                    icon="el-icon-search" @click="visible = true">更多查询</el-button>
                            </el-form>
                        </el-row>
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <div class="JNPF-common-head">
                                <topOpts @add="addSupplier('','add')" />
                                <div class="JNPF-common-head-right">
                                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                                        <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                            @click="initData()" />
                                    </el-tooltip>
                                </div>
                            </div>
                            <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                                style="height: 100%;" custom-column @sort-change="sortChange" :partentOrChild="'child'">
                                <el-table-column prop="quotationNo" label="报价单号" width="200" sortable="custom">
                                    <template slot-scope="scope">
                                        <el-link type="primary"
                                            @click.native="handleUserRelation(scope.row.salesQuotationId, 'look')">
                                            {{ scope.row.quotationNo }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="deliver" label="致" width="120" sortable="custom">
                                </el-table-column>
                                <el-table-column prop="cooperativePartnerIdText" label="客户名称" width="200"
                                    sortable="custom" />
                                <el-table-column prop="bidder" label="报价人" width="120" sortable="custom" />
                                <el-table-column prop="quotationTime" label="报价时间" width="180" sortable="custom" />
                                <el-table-column prop="validEnd" label="有效时间止" width="180" sortable="custom" />
                                <el-table-column prop="customerDrawingNumber" label="客户物料号" width="200" sortable="custom" />
                                <el-table-column prop="customerProductDrawingNo" label="客户图号" min-width="400"
                                    sortable="custom" />
                                <el-table-column prop="productDrawingNo" label="产品图号" min-width="400" />
                                <el-table-column prop="materialDescription" label="物料描述" min-width="200" />
                                <el-table-column prop="spec" label="规格型号" width="120" />
                                <el-table-column prop="num" label="数量" width="120" />
                                <el-table-column prop="listPrice" label="牌价(含税)" width="120" />
                                <el-table-column prop="unitPrice" label="单价(含税)" width="120" />
                                <el-table-column prop="excludingTaxUnitPrice" label="单价(不含税)" width="120" />
                                <el-table-column prop="discount" label="折扣率(%)" width="120" />
                                <el-table-column prop="amounts" label="金额(含税)" width="120" />
                                <el-table-column prop="excludingTaxAmounts" label="金额(不含税)" width="120" />
                                <el-table-column prop="totalTaxAmount" label="总税额" width="120" />
                                <el-table-column prop="mainUnit" label="单位" width="120" />
                                <el-table-column prop="taxRate" label="税率(%)" width="120" />
                                <el-table-column prop="remark" label="备注1" min-width="200" />
                                <el-table-column prop="remark2" label="备注2" min-width="200" />
                                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                                <el-table-column prop="createByName" label="创建人" width="120" />
                                <el-table-column label="操作" width="280" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini"
                                            :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                                        <el-button type="text"
                                            :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                                            @click="handleDel(scope.row.salesQuotationId,)"
                                            class="JNPF-table-delBtn">删除</el-button>
                                        <el-button type="text"
                                            :disabled="scope.row.generateFlag || scope.row.approvalStatus !== 'ok'"
                                            size="mini"
                                            @click.native="handleUsercustom(scope.row.salesQuotationId, 'custom')">生成客户产品</el-button>
                                        <el-dropdown hide-on-click>
                                            <span class="el-dropdown-link">
                                                <el-button type="text" size="mini">
                                                    {{ $t('common.moreBtn') }}<i
                                                        class="el-icon-arrow-down el-icon--right"></i>
                                                </el-button>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item
                                                    @click.native="handleUserRelation(scope.row.salesQuotationId, 'look')">
                                                    查看详情
                                                </el-dropdown-item>
                                                <el-dropdown-item @click.native="download(scope.row.salesQuotationId)">
                                                    下载报价单
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                            </JNPF-table>
                            <pagination :total="linesTotal" :page.sync="linesQuery.pageNum"
                                :limit.sync="linesQuery.pageSize" @pagination="initData" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
        <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
            lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
            <el-row :gutter="20" v-if="activeName === 'orderList'">

                <el-form ref="diaForm" :model="form" label-width="120px" label-position="top">
                    <el-col :span="12">
                        <el-form-item label="报价单号">
                            <el-input v-model="form.quotationNo" placeholder="请输入报价单号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="致">
                            <el-input v-model="form.deliver" placeholder="请输入致" clearable />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="客户编号">
                            <el-input v-model="form.cooperativePartnerCode" placeholder="客户编号" clearable />
                        </el-form-item>

                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="客户名称">
                            <el-input v-model="form.cooperativePartnerIdText" placeholder="请输入客户名称" clearable />
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报价人">
                            <el-input v-model="form.bidder" placeholder="请输入报价人" clearable />
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报价时间">
                            <el-date-picker v-model="quotationTime" type="daterange" value-format="yyyy-MM-dd"
                                style="width: 100%;" start-placeholder="报价开始日期" end-placeholder="报价结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审批状态">
                            <el-select v-model="form.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in approvalStatusList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单据状态">
                            <el-select v-model="form.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提交时间">
                            <el-date-picker v-model="submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" style="width: 100%;"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row :gutter="20" v-else>
                <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
                    <el-col :span="12">
                        <el-form-item label="报价单号">
                            <el-input v-model="linesQuery.quotationNo" placeholder="请输入报价单号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报价人">
                            <el-input v-model="linesQuery.bidder" placeholder="请输入报价人" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户名称">
                            <el-input v-model="linesQuery.cooperativePartnerIdText" placeholder="请输入客户名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报价时间">
                            <el-date-picker v-model="deliveryDatefahuo" type="daterange" value-format="yyyy-MM-dd"
                                style="width: 100%;" clearable start-placeholder="请选择报价开始日期" end-placeholder="请选择报价结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="有效期止">
                            <el-date-picker v-model="linesQuery.validEnd" placeholder="请选择有效时间" type="date"
                                value-format="yyyy-MM-dd" style="width: 100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户物料号">
                            <el-input v-model="linesQuery.customerDrawingNumber" placeholder="请输入客户物料号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户物料图号">
                            <el-input v-model="linesQuery.customerProductDrawingNo" placeholder="请输入客户物料图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="createTimeArrfahuo" type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" clearable
                                :picker-options="global.timePickerOptions">
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
    </div>
</template>
  
<script>
import { getQuotationLists, deleteQuotationData, getQuotationmxLists, exportSaleQuotation } from '@/api/salesManagement/index'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import DepForm from './depForm'
export default {
    name: 'salesQuotation',
    components: { DepForm, },
    data() {
        return {
            linesTotal: 0,
            linesTableData: [],
            deliveryDatefahuo: [],
            createTimeArrfahuo: [],
            activeName: 'orderList',
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            approvalStatusList: [
                { label: "审批中", value: "ing" },
                { label: "审批通过", value: "ok" },
                { label: "审批拒绝", value: "rebut" },
                { label: "审批撤回", value: "withdrawn" },
            ],
            documentStatusList: [
                { label: "草稿", value: "draft" },
                { label: "提交", value: "submit" },
            ],
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [],
            form: {},
            formlist: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: "create_time"
                }],
                quotationNo: "",
                cooperativePartnerIdText: "",
                deliver: "",
                bidder: "",
                quotationStartTime: "",
                quotationEndTime: '',
                approvalStatus: '',
                documentStatus: "",
                submitStartDate: '',
                submitEndDate: '',
                quotationType: 'latest'
            },
            linesQuery: {},
            linesQuerylist: {
                quotationNo: '',
                bidder: '',
                quotationTimeStart: '',
                quotationTimeEnd: '',
                endTime: '',
                startTime: '',
                cooperativePartnerIdText: '',
                customerDrawingNumber: '',
                validEndv: '',
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime" /* 使用倒序日期作为默认排序 */
                }],
                quotationType: 'latest',
            },
            quotationTime: [],
            submitDate: [],
            listLoading: false,
            total: 0,
            formVisible: false,
        }
    },
    created() {
        this.form = JSON.parse(JSON.stringify(this.formlist))
        this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
        this.search()
    },
    watch: {
        activeName() {
            this.reset()
        }
    },
    methods: {
        handleClick(e) {
            this.activeName = e.name
            // this.reset()
        },
        moreQueries() {
            this.visible = true
        },
        sortChange({ prop, order }) {
            let newProp
            if (this.activeName == "orderList") {
                if (prop == 'cooperativePartnerIdText') {
                    newProp = prop
                } else {
                    newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
                }
                this.form.orderItems[0].asc = order !== 'descending'
                this.form.orderItems[0].column = newProp
            } else {
                if (prop === 'createTime' || prop === "cooperativePartnerIdText") {
                    newProp = prop
                } else {
                    newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
                }
                this.linesQuery.orderItems[0].asc = order !== "descending"
                this.linesQuery.orderItems[0].column = order === null ? "" : newProp
            }
            this.search()
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.depFormVisible = false
            if (isRefresh) {
                this.search()
            }
        },
        initData() {
            this.listLoading = true
            if (this.activeName == "orderList") {
                getQuotationLists(this.form).then(res => {
                    this.tableDataList = res.data.records
                    this.listLoading = false
                    this.total = res.data.total
                    this.visible = false
                }).catch(() => {
                    this.listLoading = false
                })
            } else {
                getQuotationmxLists(this.linesQuery).then(res => {
                    this.linesTableData = res.data.records
                    this.linesTotal = res.data.total
                    this.listLoading = false
                    this.visible = false
                }).catch(() => {
                    this.listLoading = false
                })
            }
        },
        search() {
            if (this.activeName == "orderList") {
                if (this.submitDate && this.submitDate.length > 0) {
                    this.form.submitStartDate = this.submitDate[0].replace(/ 0(?!0)/g, " ")
                    this.form.submitEndDate = this.submitDate[1].replace(/ 0(?!0)/g, " ")
                } else {
                    this.form.submitStartDate = ''
                    this.form.submitEndDate = ''
                }
                if (this.quotationTime && this.quotationTime.length > 0) {
                    this.form.quotationStartTime = this.quotationTime[0]
                    this.form.quotationEndTime = this.quotationTime[1]
                } else {
                    this.form.quotationStartTime = ''
                    this.form.quotationEndTime = ''
                }
                Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
                    let item = this.form[key]
                    this.form[key] = typeof item === 'string' ? item.trim() : item
                })
                this.form.pageNum = 1 // 重置页码
            } else {
                if (this.deliveryDatefahuo && this.deliveryDatefahuo.length > 0) {
                    this.linesQuery.quotationTimeStart = this.deliveryDatefahuo[0]
                    this.linesQuery.quotationTimeEnd = this.deliveryDatefahuo[1]
                } else {
                    this.linesQuery.quotationTimeStart = ''
                    this.linesQuery.quotationTimeEnd = ''
                }
                if (this.createTimeArrfahuo && this.createTimeArrfahuo.length > 0) {
                    this.linesQuery.startTime = this.createTimeArrfahuo[0].replace(/ 0(?!0)/g, " ")
                    this.linesQuery.endTime = this.createTimeArrfahuo[1].replace(/ 0(?!0)/g, " ")
                } else {
                    this.linesQuery.startTime = ''
                    this.linesQuery.endTime = ''
                }
                Object.keys(this.linesQuery).forEach(key => { // 清除搜索条件两端空格
                    let item = this.linesQuery[key]
                    this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
                })
                this.linesQuery.pageNum = 1 // 重置页码
            }
            this.initData()
        },
        reset() {

            if (this.activeName == "orderList") {
                this.$refs['tableForm'].$refs.JNPFTable.clearSort()
                this.form = JSON.parse(JSON.stringify(this.formlist))
                this.quotationTime = [],
                    this.submitDate = []
            } else {
                this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
                this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
                this.deliveryDatefahuo = [],
                    this.createTimeArrfahuo = []
            }
            this.search()
        },
        addSupplier(id,type) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, type)
            })
        },
        addOrUpdateHandle(res, type) {
            this.depFormVisible = true
            let type1
            if (res.generateFlag) {
                type1 = 'bjkh'
            } else {
                type1 = type
            }
            let id = res.id
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, type1)
                })
                // }, 600);
            }
        },
        addOrUpdateHandlemx(res, type) {
            this.depFormVisible = true
            let type1
            if (res.generateFlag) {
                type1 = 'bjkh'
            } else {
                type1 = type
            }
            let id = res.salesQuotationId
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, type1)
                })
                // }, 600);
            }
        },
        handleUsercustom(id, type) {
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
                deleteQuotationData(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                        onClose: () => {
                            this.initData()
                        }
                    })
                })
            }).catch(() => { })
        },
        handleUserRelation(id, type) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, type)
            })
        },
        download(id) {
            exportSaleQuotation(id).then(res => {
                this.jnpf.downloadFile(res.data.url, res.data.name)
            })
        },
        withdrawnHandle(formId){
          let _data = {
            formId
          }
          this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
                    type: 'warning'
                }).then(() => {
                  withdrawn(_data).then(res => {
                        this.$message({
                            type: 'success',
                            message: "撤回成功",
                            duration: 1500,
                            onClose: () => {
                                this.initData()
                            }
                        })
                    })
                }).catch(() => { })
    },
    }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
  