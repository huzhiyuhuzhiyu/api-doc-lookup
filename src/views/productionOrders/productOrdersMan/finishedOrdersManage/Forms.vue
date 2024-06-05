<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main org-form">
            <div class="JNPF-common-page-header">
                <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
                <el-page-header @back="goBack" content="生产订单派工" />
                <div class="options">

                    <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
                        确定</el-button>
                    <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>
            <div class="main">

                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="订单派工" name="orderWork">
                        <el-row :gutter="20">
                            <el-form ref="dispatchDetailsForm" :model="dispatchDetailsForm" label-width="120px"
                                label-position="top">
                                <el-col :span="12">
                                    <el-form-item label="产品编码">
                                        <el-input v-model="dispatchDetailsForm.productCode" placeholder="请输入产品编码"
                                            disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="产品名称">
                                        <el-input v-model="dispatchDetailsForm.productName" placeholder="请输入产品名称"
                                            disabled />
                                    </el-form-item>

                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="产品图号">
                                        <el-input v-model="dispatchDetailsForm.productDrawingNo" placeholder="请输入产品图号"
                                            disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="单位">
                                        <el-input v-model="dispatchDetailsForm.mainUnit" placeholder="请输入单位" disabled />
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="订单计划开始日期">
                                        <el-date-picker v-model="stDate" type="date" :clearable="false"
                                            value-format="yyyy-MM-dd" style="width: 100%;" placeholder="计划开始日期" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="订单计划结束日期">

                                        <el-date-picker v-model="etDate" type="date" :clearable="false"
                                            value-format="yyyy-MM-dd" style="width: 100%;" placeholder="计划结束日期" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="生产数量">
                                        <el-input v-model="dispatchDetailsForm.productionQuantity" placeholder="请输入生产数量"
                                            disabled />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="已完成数量">
                                        <el-input v-model="dispatchDetailsForm.completedQuantity" placeholder="请输入已完成数量"
                                            disabled />
                                    </el-form-item>
                                </el-col>


                                <el-col :span="12">
                                    <el-form-item label="派工开始日期">
                                        <el-date-picker v-model="dispatchDetailsForm.planStartDate" type="date"
                                            :clearable="false" value-format="yyyy-MM-dd" style="width: 100%;"
                                            :picker-options="pickerOptions" placeholder="派工开始日期" @change="changeStartData">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="派工结束日期">

                                        <el-date-picker v-model="dispatchDetailsForm.planEndDate" type="date"
                                            :clearable="false" value-format="yyyy-MM-dd" style="width: 100%;"
                                            placeholder="派工结束日期" @change="changeEndData" :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="派工数量">
                                        <el-input v-model="dispatchDetailsForm.dispatchQuantity" placeholder="请输入派工数量"
                                            clearable @blur="dispatchQuantityFun" />
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="派工明细" name="dispatchDetails">
                        <el-row :gutter="20">
                            <el-table ref="workerDialog" v-loading="listLoading" :data="workerList" border>
                                <el-table-column prop="processCode" label="工序编码" width="160"> </el-table-column>
                                <el-table-column prop="processName" label="工序名称" width="120" />
                                <el-table-column prop="planStartDate" label="计划开始时间" min-width="200">
                                    <template slot="header"><span class="required">*</span>计划开始时间</template>
                                    <template slot-scope="scope">
                                        <el-date-picker v-model="scope.row.planStartDate" :clearable="false" type="date"
                                            value-format="yyyy-MM-dd" style="width: 100%;" placeholder="计划开始时间"
                                            :picker-options="pickerOptions" @focus="detailFun(scope, 'end')"
                                            @change="changDetailDate(scope, 'start')">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="planEndDate" label="计划结束时间" min-width="200">
                                    <template slot="header"><span class="required">*</span>计划结束时间</template>
                                    <template slot-scope="scope">
                                        <el-date-picker v-model="scope.row.planEndDate" type="date" :clearable="false"
                                            value-format="yyyy-MM-dd" style="width: 100%;" placeholder="计划结束时间"
                                            :picker-options="pickerOptions" @focus="detailFun(scope, 'end')"
                                            @change="changDetailDate(scope, 'end')">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="workOrderQuantity" label="订单生产数量" width="150"></el-table-column>
                                <el-table-column prop="dispatchedQuantity" label="已派工数量" width="120"></el-table-column>
                                <el-table-column prop="dispatchQuantity" label="派工数量" width="170">
                                    <template slot="header"><span class="required">*</span>派工数量</template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.dispatchQuantity" placeholder="请输入派工数量" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="workGroupId" label="班组" width="160">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.workGroupId" placeholder="请选择班组" clearable
                                            @clear="clearGroup(scope)">
                                            <el-option v-for="(item, index) in scope.row.routingProResMap.work_group"
                                                :key="index" :label="item.resourceName"
                                                :value="item.resourceId"></el-option>
                                        </el-select>
                                        <!-- <el-input v-model="scope.row.productCode" placeholder="请输入班组"  /> -->
                                    </template>
                                </el-table-column>
                                <el-table-column prop="equipmentId" label="设备" width="160">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.equipmentId" placeholder="请选择设备" clearable >
                                            <el-option v-for="(item, index) in scope.row.routingProResMap.device"
                                                :key="index" :label="item.resourceName+'('+item.resourceCode+')'"
                                                :value="item.resourceId"></el-option>
                                        </el-select>
                                        <!-- <el-input v-model="scope.row.productCode" placeholder="请选择设备"  /> -->
                                    </template>
                                </el-table-column>
                                <el-table-column prop="personId" label="人员" width="160">
                                    <template slot-scope="scope">
                                        <!-- <el-input v-model="scope.row.productCode" placeholder="请选择人员"  /> -->
                                        <el-select v-model="scope.row.personId" placeholder="请选择人员" clearable  >
                                            <el-option v-for="(item, index) in scope.row.routingProResMap.personnel"
                                                :key="index" :label="item.resourceName"
                                                :value="item.resourceId"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="productionLineId" label="产线" width="160">
                                    <template slot-scope="scope">
                                        <!-- <el-input v-model="scope.row.productCode" placeholder="请选择产线"  /> -->
                                        <el-select v-model="scope.row.productionLineId" placeholder="请选择产线" clearable>
                                            <el-option v-for="(item, index) in lineList" :key="index" :label="item.name"
                                                :value="item.id"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="workstationId" label="工位" width="160">
                                    <template slot-scope="scope">
                                        <!-- <el-input v-model="scope.row.productCode" placeholder="请选择工位" /> -->
                                        <el-select v-model="scope.row.workstationId" placeholder="请选择工位"
                                            :disabled="!scope.row.productionLineId" clearable
                                            @focus="selectworkstation(scope.row)">
                                            <el-option v-for="(item, index) in workstationList" :key="index"
                                                :label="item.workstationIdName" :value="item.workstationId"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark" label="备注" width="160">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.remark" placeholder="请输入备注" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="120" fixed="right">
                                    <template slot-scope="scope">

                                        <el-button size="mini" type="text" :disabled="scope.$index == 0"
                                            @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </transition>
</template>
  
<script>

import { prodOrderInfo, prodOrderDispatch } from '@/api/productOrdes/finishedProductOrders'
import { getProductionLineList, getProductionLineInfo } from '@/api/basicData/index'
export default {
    data() {
        return {
            workerList: [],
            prodOrderForm: {},
            stDate: "",
            etDate: "",
            id: "",
            dispatchDetailsForm: {},
            workerDialog: false,
            lineList: [],
            btnLoading: false,
            activeName: "orderWork",
            listLoading: false,
            pickerOptions: {
                disabledDate: (time) => {
                    return time.getTime() < Date.now() - 86400000; // 86400000为一天的毫秒数
                }
            },
            workstationList: [],
            initstartDate: "",
            initendDate: "",
        }
    },
    watch: {
    },
    created() {
    },
    mounted() {

    },
    methods: {
        clearGroup(data) {
            console.log("班组",data);
        },
        clearPerson(data) {
            console.log("人员",data);
        },
        detailFun(scope, type) {
            console.log("焦点", scope, type);
            if (type == "start") {
                this.initstartDate = scope.row.planEndDate

            } else {
                this.initendDate = scope.row.planEndDate
            }
        },
        changDetailDate(scope, type) {
            console.log("scope", scope);
            if (type == 'start') {
                if (scope.row.planEndDate) {
                    const date1 = new Date(scope.row.planStartDate);
                    const date2 = new Date(scope.row.planEndDate);
                    let flag = null;
                    if (date1.getTime() > date2.getTime()) {
                        flag = false
                        this.$message({
                            message: "结束日期不能在开始日期之前",
                            type: "error"
                        })
                        this.workerList[scope.$index].planStartDate = initstartDate
                        this.$forceUpdate()
                        return
                    }
                }
            } else {
                console.log(5656);
                if (scope.row.planStartDate) {

                    const date1 = new Date(scope.row.planStartDate);
                    const date2 = new Date(scope.row.planEndDate);
                    let flag = null;
                    if (date1.getTime() > date2.getTime()) {
                        flag = false
                        this.$message({
                            message: "结束日期不能在开始日期之前",
                            type: "error"
                        })
                        scope.row.planEndDate = this.initendDate

                    }
                }
            }
        },
        selectworkstation(row) {
            console.log(row);
            this.workstationList = []
            getProductionLineInfo(row.productionLineId).then(res => {
                console.log("工位", res);
                this.workstationList = res.data.returnList
                console.log(this.workstationList);


                this.$forceUpdate()
            })
        },
        changeStartData(e) {
            console.log(e);

            if (this.dispatchDetailsForm.planEndDate) {
                const date1 = new Date(this.dispatchDetailsForm.planStartDate);
                const date2 = new Date(this.dispatchDetailsForm.planEndDate);
                let flag = null;
                if (date1.getTime() > date2.getTime()) {
                    flag = false
                    this.$message({
                        message: "结束日期不能在开始日期之前",
                        type: "error"
                    })
                    this.dispatchDetailsForm.planStartDate = this.stDate
                    this.dispatchDetailsForm.planEndDate = this.etDate
                    console.log("stDate", this.stDate);
                    console.log("etDate", this.etDate);
                } else {
                    this.dispatchDetailsForm.planStartDate = e
                    if (this.workerList.length) {
                        this.workerList.forEach(item => {
                            item.planStartDate = e
                        });
                    }
                }
            }
        },
        changeEndData(e) {
            if (this.dispatchDetailsForm.planStartDate) {
                const date1 = new Date(this.dispatchDetailsForm.planStartDate);
                const date2 = new Date(this.dispatchDetailsForm.planEndDate);
                let flag = null;
                if (date1.getTime() > date2.getTime()) {
                    flag = false
                    this.$message({
                        message: "结束日期不能在开始日期之前",
                        type: "error"
                    })
                    this.dispatchDetailsForm.planStartDate = this.stDate
                    this.dispatchDetailsForm.planEndDate = this.etDate
                } else {
                    this.dispatchDetailsForm.planStartDate = e
                    if (this.workerList.length) {
                        this.workerList.forEach(item => {
                            item.planEndDate = e
                        });
                    }
                }
            }

        },
        dispatchQuantityFun() {
            console.log("this.dispatchDetailsForm.dispatchQuantity", this.dispatchDetailsForm.dispatchQuantity);

            if ((Number(this.dispatchDetailsForm.productionQuantity) - Number(this.dispatchDetailsForm.completedQuantity)) < this.dispatchDetailsForm.dispatchQuantity) {
                this.$message.error("派工数量不得超过未派工数量")
            } else {
                if (this.workerList.length > 0) {
                    this.workerList.forEach(item => {
                        item.dispatchQuantity = this.dispatchDetailsForm.dispatchQuantity
                    });
                }
            }
        },
        // 删除数据
        handleDel(row) {
            console.log(row);
            if (row.$index != this.workerList.length - 1) {
                this.$confirm('删除当前工序时，会一起把后面的工序一起删除，您是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.workerList.splice(row.$index);
                }).catch(() => {

                })
            } else {
                this.workerList.splice(row.$index);
            }

        },
        handleConfirm() {
            console.log(this.workerList);
            let flag = null;
            let dataFormObj = {
                dispatchList: [],
                productionOrderId: this.prodOrderForm.id
            }
            for (let index = 0; index < this.workerList.length; index++) {
                const item = this.workerList[index];
                if (!item.planStartDate) {
                    flag = false
                    this.$message({
                        message: "派工信息第" + (index + 1) + "行计划开始日期不能为空",
                        type: "error"
                    })
                    break
                }
                if (!item.planEndDate) {
                    flag = false
                    this.$message({
                        message: "派工信息第" + (index + 1) + "行计划结束日期不能为空",
                        type: "error"
                    })
                    break
                }
                if (!Number(item.dispatchQuantity)) {
                    flag = false
                    this.$message({
                        message: "派工信息第" + (index + 1) + "行派工数量不能为0或为空",
                        type: "error"
                    })
                    break
                }
                if (Number(item.dispatchQuantity) + Number(item.dispatchedQuantity ? item.dispatchedQuantity : 0) > Number(item.workOrderQuantity)) {
                    flag = false
                    this.$message({
                        message: "第" + (index + 1) + "行总派工数量不能超过生产订单数量！",
                        type: "error"
                    })
                    break
                }
                if (index > 0) {
                    if (
                        Number(item.dispatchQuantity) + Number(item.dispatchedQuantity) >
                        (Number(this.workerList[index - 1].dispatchQuantity) + Number(this.workerList[index - 1].dispatchedQuantity))) {
                        console.log(666666);
                        flag = false
                        this.$message({
                            message: "第" + (index + 1) + "行总派工数量不能超过第" + index + "道工序的总派工数量",
                            type: "error"
                        })
                        break
                    }
                }
                if (!item.workGroupId && !item.equipmentId && !item.personId) {
                    flag = false
                    this.$message({
                        message: "派工信息第" + (index + 1) + "行班组、设备、人员需要必填一项",
                        type: "error"
                    })
                    break
                }
                let obj = {
                    dispatchQuantity: item.dispatchQuantity,
                    equipmentId: item.equipmentId,
                    orderNo: item.orderNo,
                    personId: item.personId,
                    planStartDate: item.planStartDate,
                    planEndDate: item.planEndDate,
                    processId: item.processId,
                    productionLineId: item.productionLineId,
                    productionOrderId: item.productionOrderId,
                    remark: item.remark,
                    workGroupId: item.workGroupId,
                    workOrderId: item.id,
                    workOrderStatus: "normal",
                    workOrderType: "normal",
                    workstationId: item.workstationId,
                    dispatchType: "work_order",
                }
                dataFormObj.dispatchList.push(obj)
            }
            console.log(123, dataFormObj);
            if (flag === false) return
            this.btnLoading = true
            prodOrderDispatch(dataFormObj).then(res => {
                this.btnLoading = false
                this.workerDialog = false
                this.$message({
                    message: "派工成功",
                    type: "success"
                })
                this.$emit("close", true);
                this.initData()
            }).catch(error => {
                this.btnLoading = false

            })
        },
        handleClick() {

        },
        goBack() {
            this.$emit('close')
        },
        init(id) {
            this.id = id || ''
            if (this.id) {
                let obj = {
                    id: id,
                    dispatch: "1"
                }
                prodOrderInfo(obj).then(res => {
                    res.data.workOrderList.forEach(item => {
                        item.dispatchQuantity = Number(item.workOrderQuantity) - Number(item.dispatchedQuantity)
                    });
                    res.data.workOrderList.forEach(item => {
                        if (item.routingProResMap.work_group && item.routingProResMap.work_group.length == 1) {
                            item.workGroupId = item.routingProResMap.work_group[0].resourceId
                        }
                        if (item.routingProResMap.device && item.routingProResMap.device.length == 1) {
                            item.equipmentId = item.routingProResMap.device[0].resourceId

                        }
                        if (item.routingProResMap.personnel && item.routingProResMap.personnel.length == 1) {
                            item.personId = item.routingProResMap.personnel[0].resourceId

                        }
                    });
                    this.prodOrderForm = res.data.prodOrder
                    this.stDate = JSON.parse(JSON.stringify(this.prodOrderForm.planStartDate))
                    this.etDate = JSON.parse(JSON.stringify(this.prodOrderForm.planEndDate))
                    this.dispatchDetailsForm = res.data.prodOrder
                    var dateToCheck = new Date(this.dispatchDetailsForm.planStartDate); // 以'yyyy-mm-dd'格式传入日期
                    var currentDate = new Date(); // 当前日期
                    var sss = new Date(this.dispatchDetailsForm.planEndDate);
                    if (dateToCheck < currentDate) {
                        dateToCheck = currentDate; // 如果传入日期小于当前日期，则将当前日期赋值给它
                        var formattedDate = dateToCheck.toISOString().slice(0, 10);
                        this.dispatchDetailsForm.planStartDate = formattedDate
                    }
                    if (sss < currentDate) {
                        sss = ""
                        this.dispatchDetailsForm.planEndDate = ""
                    }
                    // 转换日期格式为yyyy-mm-dd

                    // this.dispatchDetailsForm.dispatchQuantity = this.dispatchDetailsForm.productionQuantity - this.dispatchDetailsForm.completedQuantity
                    this.workerList = res.data.workOrderList

                    console.log("详情>", res);
                    this.workerList.forEach(item => {
                        item.planStartDate = this.dispatchDetailsForm.planStartDate
                        item.planEndDate = this.dispatchDetailsForm.planEndDate
                    });
                    this.workerDialog = true
                    let objs = {
                        "code": "",
                        "createByName": "",
                        "endTime": "",
                        "keyword": "",
                        "name": "",
                        "orderItems": [
                            {
                                "asc": true,
                                "column": ""
                            }
                        ],
                        "pageNum": 1,
                        "pageSize": -1,
                        "startTime": "",
                        "state": ""
                    }
                    // 获取产线
                    getProductionLineList(objs).then(res => {
                        this.lineList = res.data.records
                    })
                })
            }
        },
        goBack() {
            this.$emit('close')
        },

    }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
    padding: 0 !important;
}

::v-deep .el-tabs__header {
    padding-left: 0 !important;
}

.el-button--small {
    // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
    height: auto !important;
    padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
    padding: 5px 10px !important;
}
</style>
<style scoped>
.required {
    color: red;
    margin-right: 4px;
}

.el-dialog .el-dialog__body {
    padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
    padding: 0 5px 0 10px !important;
}

.el-button span {
    font-size: 14px !important;
}

.pagination-container {
    background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
    background-color: #48a2ff;
    color: #fff;

}

::v-deep .el-table__body-wrapper {
    height: auto !important;
}
</style>