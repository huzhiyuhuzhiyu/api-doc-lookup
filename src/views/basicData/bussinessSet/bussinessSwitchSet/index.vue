<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="tableQuery.businessCode" placeholder="请输入业务编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="tableQuery.businessName" placeholder="请输入业务名称" clearable />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="4" v-if="tableQuery.openStateFlag == 'switch'">
                        <el-form-item>
                            <el-select v-model="tableQuery.openStateFlag" placeholder="请选择开启状态" style="width: 100%;">
                                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="tableQuery.mode" placeholder="请选择模式" style="width: 100%;">
                                <el-option v-for="(item, index) in modeList" :key="index" :label="item.label"
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
                <!-- <div class="JNPF-common-head">
                    <div></div>
                    <div class="JNPF-common-head-right" style="float: right;">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div> -->
                <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange"
                    custom-column>
                    <el-table-column prop="businessCode" label="业务编码" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="businessName" label="业务名称" sortable="custom" />
                    <el-table-column prop="currentValue" label="当前值" >
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.currentValue" placeholder="请选择状态" style="width: 100%;"
                                @change="hangSelect(scope.row)">
                                <el-option v-for="(item, index) in scope.row.selectList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </template>

                    </el-table-column>
                    <!-- <el-table-column prop="openStateFlag" label="状态" sortable="custom">

                    </el-table-column> -->
                    <!-- <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addOrUpdateHandle(scope.row.id,)">编辑</el-button>
                        </template>
                    </el-table-column> -->
                </JNPF-table>
                <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
                    :limit.sync="tableQuery.pageSize" @pagination="initData" />
            </div>
        </div>


        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    </div>
</template>
  
<script>
import { editSwitch, getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
export default {
    name: 'quality',
    components: { DepForm, },
    data() {
        return {
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [
            ],
            stateList: [{
                label: "是",
                value: 1
            }, {
                label: "否",
                value: 0
            }],
            modeList: [{
                label: "开关",
                value: 'switch'
            }, {
                label: "选择",
                value: 'select'
            }],
            listLoading: false,
            tableQuery: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: true,
                    column: ""
                }],
                businessCode: "",
                businessName: "",
                openStateFlag: "",
                mode: "",

            },
            selectedValue: [],
            selectedValue: [],
            total: 0,
            formVisible: false,
        }
    },
    created() {
        this.initData()
        // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    methods: {
        hangSelect(data) {
            console.log(data);
            let form = {
                id: data.id,
                currentValue: data.currentValue
            }
            let obj = {
                businessConfig: form
            }
            editBimBusinessData(obj).then(res => {
                this.$message({
                    type: 'success',
                    message: "修改成功",
                    duration: 1000,
                })
                this.initData()
            })
        },
        handleCh(e) {
            console.log(e);
            editSwitch(e).then(res => {
                this.initData()
            })
        },
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.tableQuery.orderItems[0].asc = order !== 'descending'
            this.tableQuery.orderItems[0].column = newProp
            this.initData()
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        initData() {

            getBimBusinessSwitchConfigList(this.tableQuery).then(res => {
                // 
                console.log("object", res);
                if (res.data.records.length > 0) {
                    res.data.records.forEach((item, index) => {
                        console.log(item);
                        item.selectList = []
                        if (item.selectedValue) {
                            let valueList = item.selectedValue.split(',')
                            let labelList = item.selectedText.split(',')
                            console.log(valueList, labelList);
                            valueList.forEach((it, ids) => {
                                let objSelect = {
                                    label: "",
                                    value: "",
                                }
                                objSelect.label = labelList[ids]
                                objSelect.value = valueList[ids]
                                res.data.records[index].selectList.push(objSelect)
                            });
                        }

                    })
                }
                console.log('pppp', res.data.records);
                this.tableDataList = res.data.records
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search() {
            this.initData()
        },
        reset() {
            this.$refs['tableForm'].$refs.JNPFTable.clearSort()
            this.tableQuery = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: true,
                    column: ""
                }],
                businessCode: "",
                businessName: "",
                openStateFlag: ""
            },
                this.search()
        },
        addSupplier(type) {

            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init("", type)
            })
        },
        addOrUpdateHandle(id,) {
            this.depFormVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id,)
                })
                // }, 600);
            }


        },
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
  