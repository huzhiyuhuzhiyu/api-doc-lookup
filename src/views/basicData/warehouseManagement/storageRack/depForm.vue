<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main org-form">
            <div class="JNPF-common-page-header">
                <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
                <el-page-header @back="goBack" :content="!dataForm.id ? '新建货架/货位' : btntype ? '查看货架/货位' : '编辑货架/货位'" />
                <div class="options" v-if="!btntype">
                    <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
                        提交</el-button>
                    <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>
            <div class="main" v-loading="formLoading">

                <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
                    label-position="top" label-width="120px">
                    <el-row :gutter="30" class="custom-row">
                        <el-col :sm="8" :xs="24">
                            <el-form-item label="上级仓库" prop="partnerCategoryId">

                                <ComSelect-list :isdisabled="isdisabled" v-model="dataForm.partnerCategoryIdText"
                                    placeholder="请选择上级仓库" auth @change="onOrganizeChange" :title="'选择仓库'"
                                    :method="getWarehouseList" :requestObj="requestObj2" :paramsObj="{}" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24">

                            <el-form-item label="类型" prop="locationType">
                                <el-select v-model="dataForm.locationType" placeholder="请选择类型" clearable
                                    style="width: 100%;" @change="handleType"
                                    :disabled="btntype || (dataForm.locationType == 'goods_allocation' && dataForm.parentId != '-1' && type == 'edit') ? true : false">
                                    <el-option v-for="(item, index) in locationTypeList" :key="index" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24">
                            <el-form-item :label="dataForm.locationType == 'goods_shelves' ? '货架编码' : '货位编码'" prop="code">
                                <el-input v-model="dataForm.code"
                                    :placeholder="dataForm.locationType == 'goods_shelves' ? '输入货架编码' : '输入货位编码'"
                                    maxlength="17" :disabled="btntype ? true : false" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24">
                            <el-form-item :label="dataForm.locationType == 'goods_shelves' ? '货架名称' : '货位名称'" prop="name">
                                <el-input v-model="dataForm.name" :disabled="btntype ? true : false"
                                    :placeholder="dataForm.locationType == 'goods_shelves' ? '输入货架名称' : '输入货位名称'"
                                    maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24">
                            <el-form-item label="货架行" prop="goodsFrameRow"
                                v-show="dataForm.locationType == 'goods_shelves'">
                                <el-select v-model="dataForm.goodsFrameRow" placeholder="请选择货架行" style="width: 100%;"
                                    @change="handleRow" :disabled="btntype ? true : false">
                                    <el-option v-for="(item, index) in goodsFrameRowList" :key="index" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24">
                            <el-form-item label="货架列" prop="goodsFrameCol"
                                v-show="dataForm.locationType == 'goods_shelves'">
                                <el-select v-model="dataForm.goodsFrameCol" placeholder="请选择货架列" style="width: 100%;"
                                    @change="handleCol" :disabled="btntype ? true : false">
                                    <el-option v-for="(item, index) in goodsFrameRowList" :key="index" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24" v-if="dataForm.locationType == 'goods_allocation' && businessType === 'BOX'">
                            <el-form-item label="长(cm)" prop="extent">
                                <el-input v-model="dataForm.extent" @input="watchnums(dataForm)" maxlength="11"
                                    placeholder="请输入长" :disabled="btntype ? true : false" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24" v-if="dataForm.locationType == 'goods_allocation' && businessType === 'BOX'">
                            <el-form-item label="宽(cm)" prop="width">
                                <el-input v-model="dataForm.width" @input="watchnums(dataForm)" maxlength="11"
                                    placeholder="请输入宽" :disabled="btntype ? true : false" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24" v-if="dataForm.locationType == 'goods_allocation' && businessType === 'BOX'">
                            <el-form-item label="高(cm)" prop="height">
                                <el-input v-model="dataForm.height" @input="watchnums(dataForm)" maxlength="11"
                                    placeholder="请输入高" :disabled="btntype ? true : false" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24" v-if="dataForm.locationType == 'goods_allocation' && businessType === 'BOX'">
                            <el-form-item label="体积(cm³)" prop="unitVolume">
                                <el-input v-model="dataForm.unitVolume" placeholder="请输入体积" :disabled="true" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="24" :xs="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200"
                                    :disabled="btntype ? true : false" placeholder="输入备注" />
                            </el-form-item>
                        </el-col>
                        <el-col :sm="24" :xs="24">

                            <JNPF-table highlight-current-row :data="dataForm.allocations" v-show="tableflag" height="624"
                                v-if="dataForm.locationType == 'goods_shelves'">
                                <el-table-column prop="code" label="货位编码" key="code">
                                    <template slot="header">
                                        <span class="required">*</span>货位编码
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.code" maxlength="20" :disabled="btntype ? true : false"
                                            placeholder="输入货位编码">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" label="货位名称" key="name">
                                    <template slot="header">
                                        <span class="required">*</span>货位名称
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.name" maxlength="20" :disabled="btntype ? true : false"
                                            placeholder="输入货位名称">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="extent" label="长(cm)" v-if="businessType === 'BOX'" key="extent">
                                    <template slot="header">
                                        <span class="required">*</span>长(cm)
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.extent" maxlength="11"
                                            :disabled="btntype ? true : false" placeholder="输入长"
                                            @input="watchnums(scope.row)">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="width" label="宽(cm)" v-if="businessType === 'BOX'" key="width">
                                    <template slot="header">
                                        <span class="required">*</span>宽(cm)
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.width" maxlength="11"
                                            :disabled="btntype ? true : false" placeholder="输入宽"
                                            @input="watchnums(scope.row)">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="height" label="高(cm)" v-if="businessType === 'BOX'" key="height">
                                    <template slot="header">
                                        <span class="required">*</span>高(cm)
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.height" maxlength="11"
                                            :disabled="btntype ? true : false" placeholder="输入高"
                                            @input="watchnums(scope.row)">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="unitVolume" label="体积(cm³)" v-if="businessType === 'BOX'" key="unitVolume">
                                    <template slot="header">
                                        <span class="required">*</span>体积(cm³)
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.unitVolume" maxlength="11" :disabled="true"
                                            placeholder="输入体积">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark" label="备注" key="remark">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.remark" maxlength="200"
                                            :disabled="btntype ? true : false" placeholder="输入备注">

                                        </el-input>
                                    </template>
                                </el-table-column>
                            </JNPF-table>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </transition>
</template>
  
<script>
import { updateDepartment } from '@/api/permission/department'
import { addstockGoodsShelves, getStockGoodsShelvesInfo, editStockGoodsShelves, checStockGoodsCode, getBimBusinessInfo } from "@/api/basicData/index";
import { getWarehouseList } from '@/api/basicData/index'

export default {
    data() {
        return {
            requestObj2: {
                name: "",
                code: ""
            },
            getWarehouseList,
            type: "",
            oldCode: "",
            locationTypeList: [
                {
                    label: "货架",
                    value: "goods_shelves"
                },
                {
                    label: "货位",
                    value: "goods_allocation"
                },
            ],
            goodsFrameRowList: [],
            visible: false,
            formLoading: false,
            btnLoading: false,
            isdisabled: false,
            dataForm: {
                width: '',
                unitVolume: '',
                extent: '',
                height: '',
                name: '',
                remark: '',
                code: "",
                locationType: 'goods_shelves',
                goodsFrameRow: "1",
                goodsFrameCol: "1",
                allocations: [],
                id: "",
                warehouseId: "",
                partnerCategoryIdText: ""
            },
            btntype: false,
            organizeIdTree: [],
            tableflag: true,
            dataRule: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                extent: [
                    { required: true, message: '请输入长', trigger: 'blur' },
                    { validator: this.formValidate('positiveNumber'), trigger: 'blur' }
                ],
                width: [
                    { required: true, message: '请输入宽', trigger: 'blur' },
                    { validator: this.formValidate('positiveNumber'), trigger: 'blur' }
                ],
                height: [
                    { required: true, message: '请输入高', trigger: 'blur' },
                    { validator: this.formValidate('positiveNumber'), trigger: 'blur' }
                ],
                unitVolume: [
                    { required: true, message: '请输入体积', trigger: 'change' },
                ],
                code: [
                    { required: true, message: '请输入编码', trigger: 'blur' },
                    { validator: this.formValidate('enCode'), trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            checStockGoodsCode(value, this.dataForm.id).then(res => {
                                if (res.data) { callback(new Error("编码重复")); }
                                else {
                                    console.log(this.oldCode);
                                    callback();
                                    if (value !== this.oldCode) {
                                        console.log(1, value, 2, this.oldCode);
                                        this.oldCode = value;
                                        this.handleCode()
                                    }
                                }
                            }).catch(error => { })
                        }, trigger: 'blur'
                    },
                ],
                locationType: [
                    { required: true, message: '类型不能为空', trigger: 'change' },
                ],
            },
            businessType: '',
        }
    },
    created() {
        for (let index = 1; index <= 10; index++) {
            this.goodsFrameRowList.push(
                {
                    label: "" + index,
                    value: index
                }
            )

        }

        this.dataForm.allocations.push(
            {
                width: '',
                unitVolume: '',
                extent: '',
                height: '',
                code: "",
                name: "",
                remark: ""
            }
        )
        getBimBusinessInfo('1987378867711250980').then(res => {
            console.log(res, '业务开关详情');
            this.businessType = res.data.currentValue
        })
    },
    methods: {
        // 监听长宽高输入
        watchnums(row, index) {
            row.extent = row.extent.replace(/[^\d.]/g, '');
            if (row.extent.length == 1 && row.extent == '.') {
                // 如果第一位是小数点，则清空输入框
                row.extent = '';
            } else if (row.extent.length == 2 && row.extent[0] == '0' && row.extent[1] != '.') {
                // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
                row.extent = row.extent.slice(0, 1) + '.' + row.extent.slice(1);
            } else if (row.extent.length > 2 && row.extent[0] == '0' && row.extent[1] != '.') {
                row.extent = row.extent.substring(1, row.extent.length)
            }
            if (row.extent.includes('.')) {
                let dotCount = 0; // 小数点的数量
                let result = ''; // 处理后的结果
                for (let i = 0; i < row.extent.length; i++) {
                    const char = row.extent[i];
                    if (char === '.') {
                        if (dotCount === 0) {
                            // 第一个小数点保留
                            result += char;
                            dotCount++;
                        }
                    } else {
                        result += char;
                    }
                }
                row.extent = result;
                let arr = row.extent.split('.')
                if (arr[0].length > 8) {
                    arr[0] = arr[0].substring(0, 8)
                }
                if (arr[1].length > 2) {
                    arr[1] = arr[1].substring(0, 2)
                }
                row.extent = arr[0] + '.' + arr[1]
            } else {
                if (row.extent.length > 8) {
                    row.extent = row.extent.substring(0, 8);
                }
            }

            row.width = row.width.replace(/[^\d.]/g, '');
            if (row.width.length == 1 && row.width == '.') {
                // 如果第一位是小数点，则清空输入框
                row.width = '';
            } else if (row.width.length == 2 && row.width[0] == '0' && row.width[1] != '.') {
                // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
                row.width = row.width.slice(0, 1) + '.' + row.width.slice(1);
            } else if (row.width.length > 2 && row.width[0] == '0' && row.width[1] != '.') {
                row.width = row.width.substring(1, row.width.length)
            }
            if (row.width.includes('.')) {
                let dotCount = 0; // 小数点的数量
                let result = ''; // 处理后的结果
                for (let i = 0; i < row.width.length; i++) {
                    const char = row.width[i];
                    if (char === '.') {
                        if (dotCount === 0) {
                            // 第一个小数点保留
                            result += char;
                            dotCount++;
                        }
                    } else {
                        result += char;
                    }
                }
                row.width = result;
                let arr = row.width.split('.')
                if (arr[0].length > 8) {
                    arr[0] = arr[0].substring(0, 8)
                }
                if (arr[1].length > 2) {
                    arr[1] = arr[1].substring(0, 2)
                }
                row.width = arr[0] + '.' + arr[1]
            } else {
                if (row.width.length > 8) {
                    row.width = row.width.substring(0, 8);
                }
            }

            row.height = row.height.replace(/[^\d.]/g, '');
            if (row.height.length == 1 && row.height == '.') {
                // 如果第一位是小数点，则清空输入框
                row.height = '';
            } else if (row.height.length == 2 && row.height[0] == '0' && row.height[1] != '.') {
                // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
                row.height = row.height.slice(0, 1) + '.' + row.height.slice(1);
            } else if (row.height.length > 2 && row.height[0] == '0' && row.height[1] != '.') {
                row.height = row.height.substring(1, row.height.length)
            }
            if (row.height.includes('.')) {
                let dotCount = 0; // 小数点的数量
                let result = ''; // 处理后的结果
                for (let i = 0; i < row.height.length; i++) {
                    const char = row.height[i];
                    if (char === '.') {
                        if (dotCount === 0) {
                            // 第一个小数点保留
                            result += char;
                            dotCount++;
                        }
                    } else {
                        result += char;
                    }
                }
                row.height = result;
                let arr = row.height.split('.')
                if (arr[0].length > 8) {
                    arr[0] = arr[0].substring(0, 8)
                }
                if (arr[1].length > 2) {
                    arr[1] = arr[1].substring(0, 2)
                }
                row.height = arr[0] + '.' + arr[1]
            } else {
                if (row.height.length > 8) {
                    row.height = row.height.substring(0, 8);
                }
            }
            if (!row.extent || !row.width || !row.height) {
                row.unitVolume = ''
            } else {
                let a = (row.width * row.extent * row.height).toFixed(2)
                row.unitVolume = Object.is(a, NaN) ? '' : a
            }
        },
        onOrganizeChange(val, data) {
            if (!val && data.length) return
            this.dataForm.warehouseId = data ? data[0].id : ''
            this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
            this.typeFlag = true
        },
        goBack() {
            this.$emit('close')
        },
        handleType(e) {
            console.log(33333, e);
            this.locationType = e
            if (e == 'goods_shelves') {
                this.dataForm.goodsFrameCol = 1
                this.dataForm.goodsFrameRow = 1
                this.dataForm.allocations = []
                this.tableflag = true
                let num;
                // if (!this.dataForm.code) return
                num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
                for (let index = 1; index <= num; index++) {
                    let obj = {
                        code: this.dataForm.code + '0' + index,
                        name: "",
                        remark: ""
                    }
                    this.dataForm.allocations.push(obj)
                }
            } else {
                this.tableflag = false

            }
        },
        // handleClose() {
        //     this.dataForm.allocations =
        //         [{
        //             code: "",
        //             name: "",
        //             remark: ""
        //         }]

        //     this.tableflag = true
        //     this.dataForm.goodsFrameRow = 1
        //     this.dataForm.goodsFrameCol = 1
        //     this.dataForm.locationType = 'goods_shelves'
        // },
        // 监听编码的改变   动态生成表格
        handleCode() {
            console.log(1);
            this.dataForm.allocations = []
            if (!this.dataForm.code) return
            let num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
            for (let index = 1; index <= num; index++) {
                let obj = {
                    code: this.dataForm.code + '0' + index,
                    name: "",
                    remark: "",
                    width: '',
                    unitVolume: '',
                    extent: '',
                    height: ''
                }
                this.dataForm.allocations.push(obj)
            }
        },
        // 监听货架行值的改变   动态生成表格
        handleCol() {
            console.log(2);
            let _data = []
            console.log("货架行", this.dataForm.goodsFrameCol);
            let num;
            num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
            this.changeRowCol(num)
        },
        changeRowCol(num){
            if (num >= this.dataForm.allocations.length){
                console.log('条数大于表格数');
                const limitTotal = num - this.dataForm.allocations.length
                for (let index = 0; index < limitTotal; index++) {
                    let obj = {
                        code: this.dataForm.code ? this.dataForm.code + '0' + (this.dataForm.allocations.length * 1+1) : "",
                        name: "",
                        remark: "",
                        width: '',
                        unitVolume: '',
                        extent: '',
                        height: ''
                    }
                    this.dataForm.allocations.push(obj)
                }
            }else{
                if (num < this.dataForm.allocations.length){
                    this.dataForm.allocations = this.dataForm.allocations.splice(0,num)
                }
            }
        },
        // 监听货架行值的改变   动态生成表格
        handleRow() {
            console.log("货架列", this.dataForm.goodsFrameRow);
            let _data = []
            this.tableflag = false
            console.log("货架行", this.dataForm.goodsFrameCol);
            let num;
            num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
            this.changeRowCol(num)
            this.tableflag = true
        },
        init(id, warehouseId, type, name) {
            console.log(111, id, warehouseId, type)
            this.visible = true
            this.dataForm.id = id || ''
            this.dataForm.warehouseId = warehouseId || ''
            this.dataForm.partnerCategoryIdText = name

            // if (parentId == '-1') {
            //   this.isdisabled = true
            // } else {
            //   this.isdisabled = false
            // }
            this.type = type
            if (type == "edit" || type == 'add') {
                this.btntype = false
            } else if (type == "look") {
                this.btntype = true
                this.isdisabled = true
            }
            this.organizeIdTree = []
            this.formLoading = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    getStockGoodsShelvesInfo(this.dataForm.id).then(res => {
                        console.log(res);
                        this.dataForm = res.data
                        this.oldCode = res.data.code
                        this.dataForm.partnerCategoryIdText = res.data.warehouseName
                        this.organizeIdTree = res.data
                        this.formLoading = false
                        console.log("this.dataForm", this.dataForm);
                        if (res.data.locationType != 'goods_shelves') {
                            this.tableflag = false
                        } else {
                            this.tableflag = true
                        }
                    })
                } else {
                    this.formLoading = false
                }
            })
        },
        dataFormSubmit() {
            console.log(this.dataForm);
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let flag = null
                    this.btnLoading = true;
                    let formMethod = this.dataForm.id ? editStockGoodsShelves : addstockGoodsShelves;
                    console.log("formMethod", formMethod);
                    if (this.dataForm.locationType == 'goods_shelves' && this.businessType === 'BOX') {
                        this.dataForm.allocations.forEach((item, index) => {
                            if (!item.name) {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "请填写第" + (index + 1) + "行货位名称",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (!item.code) {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "请填写第" + (index + 1) + "行货位编码",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (!item.extent) {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "请填写第" + (index + 1) + "行长",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (!item.width) {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "请填写第" + (index + 1) + "行宽",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (!item.height) {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "请填写第" + (index + 1) + "行高",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (item.extent == '0') {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "第" + (index + 1) + "行长不能为'0'",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (item.width == '0') {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "第" + (index + 1) + "行宽不能为'0'",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (item.height == '0') {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "第" + (index + 1) + "行高不能为'0'",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                        });
                    } else if (this.dataForm.locationType == 'goods_shelves' && this.businessType !== 'BOX'){
                        this.dataForm.allocations.forEach((item, index) => {
                            if (!item.name) {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "请填写第" + (index + 1) + "行货位名称",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }
                            if (!item.code) {
                                flag = false
                                this.btnLoading = false;
                                return this.$message({
                                    message: "请填写第" + (index + 1) + "行货位编码",
                                    type: 'error',
                                    duration: 1500,
                                })
                            }        
                        });
                    } else {
                        this.dataForm.allocations = []
                    }

                    if (flag === false) return
                    if (this.dataForm.locationType == 'goods_allocation') {
                        this.dataForm.goodsFrameCol = 0
                        this.dataForm.goodsFrameRow = 0
                    }
                    formMethod(this.dataForm).then(res => {
                        let msg = ""
                        if (formMethod == editStockGoodsShelves) {
                            msg = '修改成功'
                        } else {
                            msg = '新建成功'
                        }
                        this.$message({
                            message: msg,
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.btnLoading = false
                                this.$emit('close', true)
                            }
                        })
                    }).catch(() => {
                        this.btnLoading = false
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.required {
    color: red;
    margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
    padding: 5px 10px;
}
</style>