<template>

    <el-dialog title="报工记录" :close-on-click-modal="false" :close-on-press-escape="false"
               :visible.sync="customerVisible"
               lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
               @close="customerVisible = false">

        <div class="JNPF-common-layout" style="height:600px;overflow: auto;">
            <div class="JNPF-common-layout-center JNPF-flex-main">
                <el-row class="JNPF-common-search-box" :gutter="16">
                    <el-form @submit.native.prevent>
                        <el-col :span="4">
                            <el-form-item>
                                <el-input v-model="form.producerName" placeholder="生产人姓名" clearable
                                          @keyup.enter.native="search()"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-date-picker v-model="reportDate" type="daterange" value-format="yyyy-MM-dd"
                                                :clearable="false" start-placeholder="报工开始日期"
                                                end-placeholder="报工结束日期" @change="changePicker"
                                                :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
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
                    <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableDataList" :fixedNO="true">
                        <el-table-column prop="orderNo" label="报工单号" min-width="180"
                                         sortable="custom"></el-table-column>
                        <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                                         v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="productDrawingNo" label="品名规格" min-width="300"
                                         sortable="custom"></el-table-column>
                        <el-table-column prop="processName" label="工序名称" width="160" sortable="custom"/>
                        <el-table-column prop="createTime" label="报工时间" min-width="160" sortable="custom"/>
                        <el-table-column prop="producerName" label="生产人" min-width="160" sortable="custom"/>
                        <el-table-column prop="mainUnit" label="单位" min-width="160"/>
                        <el-table-column prop="reportingQuantity" label="报工数量" min-width="160" sortable="custom"/>
                        <el-table-column prop="createTime" label="创建时间" min-width="180"
                                         sortable="custom"></el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
                                @pagination="getrecordsList"/>
                </div>
            </div>
        </div>

    </el-dialog>
</template>
<script>
import {getWorkReportList} from '@/api/productOrdes/index.js';
import {nearMonth} from '@/utils';

export default {
    name: 'ReportRecordForm',
    data() {
        return {
            customerVisible: false,
            reportDate: [],
            beginDate: '',
            pickerOptions: {
                onPick: ({maxDate, minDate}) => {
                    this.beginDate = minDate && minDate.getTime();
                    if (maxDate) {
                        this.reportDate[1] = '';
                    }
                },
                disabledDate: (time) => {
                    const minTime = new Date(this.beginDate).setMonth(
                        new Date(this.beginDate).getMonth() - 6,
                    );
                    const maxTime = new Date(this.beginDate).setMonth(
                        new Date(this.beginDate).getMonth() + 6,
                    );
                    return this.beginDate
                        ? time.getTime() < minTime || time.getTime() > maxTime
                        : false;
                },
            },
            form: {
                productDrawingNo: '',
                orderNo: '',
                workFinishId: '',
                pageNum: 1,
                pageSize: 20,
                reportStartDate: '',
                reportEndDate: '',
                documentStatus: 'submit',
                orderItems: [
                    {
                        asc: false,
                        column: '',
                    }],
                producerName: '',
            },
            listLoading: false,
            total: 0,
            tableDataList: [],
            isProductNameSwitch: '',
        };
    },
    async created() {
        await this.getProductNameSwitch('product', 'enable_productName');

    },
    methods: {
        changePicker() {
            this.beginDate = '';
        },
        async getProductNameSwitch(code, type) {
            try {
                this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type);
            } catch (error) {
            }
        },
        init(data) {
            this.form.workFinishId = data;
            this.customerVisible = true;
            this.getrecordsList();
        },
        getrecordsList() {
            this.listLoading = true;
            this.jnpf.searchTimeFormat(this.form, this.reportDate, 'reportStartDate', 'reportEndDate');
            getWorkReportList(this.form).then(res => {
                console.log('报工记录', res);
                // res.data.records.forEach(item => {
                //   item.selectFlag = false
                // })
                this.tableDataList = res.data.records;
                this.total = res.data.total;
                this.listLoading = false;
            }).catch(() => {
                this.listLoading = false;
            });
        },

        search() {
            this.getrecordsList();
        },
        reset() {
            this.$refs['dataTable'].clearSort();
            this.form = {
                productDrawingNo: '',
                orderNo: '',
                workNo: '',
                pageNum: 1,
                pageSize: 20,
                reportStartDate: '',
                reportEndDate: '',
                documentStatus: 'submit',
                orderItems: [
                    {
                        asc: false,
                        column: '',
                    }],
                producerName: '',
            };
            this.reportDate = nearMonth();
            this.getrecordsList();
        },
    },
};
</script>
<style scoped>
.JNPF-common-layout-center .JNPF-common-layout-main {
    padding: 10px !important;
}

.selectProcess.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body {
    padding: 0 !important;
}

::v-deep .el-table__body-wrapper {
    height: 100%;
}
</style>
