<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1500px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-row :gutter="15">
                            <el-col :span="24">
                                <el-form-item label="类型名称" prop="name">
                                    <el-input v-model="dataForm.name" placeholder="请输入" clearable
                                        :style='{"width":"100%"}'>

                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="物件类型" prop="typeS">
                                    <el-select v-model="dataForm.typeS" placeholder="请选择" clearable
                                        :style='{"width":"100%"}'>
                                        <el-option v-for="(item, index) in typeSOptions" :key="index" :label="item.name"
                                            :value="item.F_Id" :disabled="item.disabled"></el-option>

                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="备注" prop="note">
                                    <el-input v-model="dataForm.note" placeholder="请输入" :style='{"width":"100%"}' true
                                        type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="附件" prop="file">
                                    <JNPF-UploadFz v-model="dataForm.file" :fileSize="10" sizeUnit="MB" :limit="9"
                                        buttonText="点击上传">

                                    </JNPF-UploadFz>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-divider content-position="center">
                                </el-divider>
                            </el-col>
                         

                            <el-col :span="24">
                                <el-tabs v-model="activeigmahc" tab-position="top" class="mb-20">
                                   

                                    <el-tab-pane label="数值">
                                        <el-col :span="24">
                                            <el-form-item label-width="0">
                                                <div class="JNPF-common-title">
                                                    <h2></h2>
                                                </div>
                                                <el-table :data="dataForm.equipment_maintain_type_itemList1" size='mini'>
                                                    <el-table-column type="index" width="60" label="序号"
                                                        align="center" />
                                                    <el-table-column prop="name" label="内容名称">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>内容名称
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.name" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    
                                                    <el-table-column prop="requirement" label="要求">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>要求
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.requirement" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <!-- <el-table-column prop="method" label="方法">
                                                        <template slot-scope="scope">
                                                            <el-select v-model="scope.row.method" placeholder="请选择"
                                                                clearable :style='{"width":"100%"}'>
                                                                <el-option
                                                                    v-for="(item, index) in equipment_maintain_type_itemmethodOptions"
                                                                    :key="index" :label="item.fullName"
                                                                    :value="item.enCode" :disabled="item.disabled">
                                                                </el-option>
                                                            </el-select>
                                                        </template>
                                                    </el-table-column> -->
                                                    <el-table-column prop="isMust" label="是否必须">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>是否必须
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-switch v-model="scope.row.isMust" :active-value="1"
                                                                :inactive-value="0">
                                                            </el-switch>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="standard" label="标准">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>标准
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.standard" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                   
                                                   
                                                    <el-table-column prop="maxQty" label="最大值">
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.maxQty" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="minQty" label="最小值">
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.minQty" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>

                                                    <el-table-column prop="note" label="备注">
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.note" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                        
                                                    <el-table-column label="操作" width="60">
                                                        <template slot-scope="scope">
                                                            <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                                                @click="delequipment_maintain_type_itemList1(scope.$index)">
                                                                删除
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div class="table-actions"
                                                    @click="addequipment_maintain_type_itemList1()">
                                                    <el-button type="text" icon="el-icon-plus">添加</el-button>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </el-tab-pane>
                                    <el-tab-pane label="是否">
                                        <el-col :span="24">
                                            <el-form-item label-width="0">
                                                <div class="JNPF-common-title">
                                                    <h2></h2>
                                                </div>
                                                <el-table :data="dataForm.equipment_maintain_type_itemList2" size='mini'>
                                                    <el-table-column type="index" width="60" label="序号"
                                                        align="center" />
                                                    <el-table-column prop="name" label="内容名称">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>内容名称
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.name" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <!-- <el-table-column prop="typeid" label="保养类型id">
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.typeid" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column> -->
                                                    <el-table-column prop="requirement" label="要求">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>要求
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.requirement" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <!-- <el-table-column prop="method" label="方法">
                                                        <template slot-scope="scope">
                                                            <el-select v-model="scope.row.method" placeholder="请选择"
                                                                clearable :style='{"width":"100%"}'>
                                                                <el-option
                                                                    v-for="(item, index) in equipment_maintain_type_itemmethodOptions"
                                                                    :key="index" :label="item.fullName"
                                                                    :value="item.enCode" :disabled="item.disabled">
                                                                </el-option>
                                                            </el-select>
                                                        </template>
                                                    </el-table-column> -->
                                                    <el-table-column prop="isMust" label="是否必须">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>是否必须
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-switch v-model="scope.row.isMust" :active-value="1"
                                                                :inactive-value="0">
                                                            </el-switch>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="standard" label="标准">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>标准
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.standard" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="note" label="备注">
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.note" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                   
                                                    <el-table-column label="操作" width="60">
                                                        <template slot-scope="scope">
                                                            <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                                                @click="delequipment_maintain_type_itemList2(scope.$index)">
                                                                删除
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div class="table-actions"
                                                    @click="addequipment_maintain_type_itemList2()">
                                                    <el-button type="text" icon="el-icon-plus">添加</el-button>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </el-tab-pane>

                                    <el-tab-pane label="文本">
                                        <el-col :span="24">
                                            <el-form-item label-width="0">
                                                <div class="JNPF-common-title">
                                                    <h2></h2>
                                                </div>
                                                <el-table :data="dataForm.equipment_maintain_type_itemList" size='mini'>
                                                    <el-table-column type="index" width="60" label="序号"
                                                        align="center" />
                                                    <el-table-column prop="name" label="内容名称">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>内容名称
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.name" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                   
                                                    <el-table-column prop="requirement" label="要求">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>要求
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.requirement" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                   
                                                    <el-table-column prop="isMust" label="是否必须">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>是否必须
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-switch v-model="scope.row.isMust" :active-value="1"
                                                                :inactive-value="0">
                                                            </el-switch>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="standard" label="标准">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>标准
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.standard" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="note" label="备注">
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.note" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>                                               
                                                    <el-table-column label="操作" width="60">
                                                        <template slot-scope="scope">
                                                            <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                                                @click="delequipment_maintain_type_itemList(scope.$index)">
                                                                删除
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div class="table-actions"
                                                    @click="addequipment_maintain_type_itemList()">
                                                    <el-button type="text" icon="el-icon-plus">添加</el-button>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </el-tab-pane>

                                    <el-tab-pane label="附件">
                                        <el-col :span="24">
                                            <el-form-item label-width="0">
                                                <div class="JNPF-common-title">
                                                    <h2></h2>
                                                </div>
                                                <el-table :data="dataForm.equipment_maintain_type_itemList3" size='mini'>
                                                    <el-table-column type="index" width="60" label="序号"
                                                        align="center" />
                                                    <el-table-column prop="name" label="内容名称">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>内容名称
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.name" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="requirement" label="要求">
                                                        <template slot="header">
                                                            <span class="required-sign">*</span>要求
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.requirement" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <!-- <el-table-column prop="method" label="方法">
                                                        <template slot-scope="scope">
                                                            <el-select v-model="scope.row.method" placeholder="请选择"
                                                                clearable :style='{"width":"100%"}'>
                                                                <el-option
                                                                    v-for="(item, index) in equipment_maintain_type_itemmethodOptions"
                                                                    :key="index" :label="item.fullName"
                                                                    :value="item.enCode" :disabled="item.disabled">
                                                                </el-option>
                                                            </el-select>
                                                        </template>
                                                    </el-table-column> -->
                                                    <el-table-column prop="isMust" label="是否必须">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>是否必须
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-switch v-model="scope.row.isMust" :active-value="1"
                                                                :inactive-value="0">
                                                            </el-switch>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="standard" label="标准">
                                                        <template slot="header">
                                                            <span class="required-sign"></span>标准
                                                        </template>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.standard" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="note" label="备注">
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.note" placeholder="请输入"
                                                                clearable :style='{"width":"100%"}'>
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="file" label="附件">
                                                        <template slot-scope="scope">
                                                            <JNPF-UploadImg v-model="scope.row.file" :fileSize="10"
                                                                sizeUnit="MB" :limit="9">
                                                            </JNPF-UploadImg>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="操作" width="60">
                                                        <template slot-scope="scope">
                                                            <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                                                @click="delequipment_maintain_type_itemList3(scope.$index)">
                                                                删除
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div class="table-actions"
                                                    @click="addequipment_maintain_type_itemList3()">
                                                    <el-button type="text" icon="el-icon-plus">添加</el-button>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-col>
                        </el-row>
                    </el-col>
                </template>
            </el-form>
            <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
                @select="addForSelect" @close="selectDialogVisible=false" />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false"> 取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import request from '@/utils/request'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'

export default {
    components: {},
    props: [],
    data() {
        return {
            show1: true,
            show2: false,
            show3: false,
            show4: false,
            visible: false,
            loading: false,
            btnLoading: false,
            selectDialogVisible: false,
            currTableConf: {},
            addTableConf: {
                equipment_maintain_type_itemList: { "popupType": "dialog", "hasPage": true, "popupTitle": "选择数据", "pageSize": 20, "columnOptions": [], "interfaceId": "", "interfaceName": "", "relationOptions": [], "templateJson": [], "popupWidth": "1000px" },
                equipment_maintain_type_itemList1: { "popupType": "dialog", "hasPage": true, "popupTitle": "选择数据", "pageSize": 20, "columnOptions": [], "interfaceId": "", "interfaceName": "", "relationOptions": [], "templateJson": [], "popupWidth": "1000px" },
                equipment_maintain_type_itemList2: { "popupType": "dialog", "hasPage": true, "popupTitle": "选择数据", "pageSize": 20, "columnOptions": [], "interfaceId": "", "interfaceName": "", "relationOptions": [], "templateJson": [], "popupWidth": "1000px" },
                equipment_maintain_type_itemList3: { "popupType": "dialog", "hasPage": true, "popupTitle": "选择数据", "pageSize": 20, "columnOptions": [], "interfaceId": "", "interfaceName": "", "relationOptions": [], "templateJson": [], "popupWidth": "1000px" },
            },
            tableRows: {
                equipment_maintain_type_itemList: {
                    name: '',
                    typeid: '',
                    requirement: '',
                    isMust: [],
                    standard: '',
                    note: '',
                    type: '',
                    active: '',
                    maxQty: '',
                    minQty: '',
                    file: [],
                    enabledmark: undefined
                },
                equipment_maintain_type_itemList1: {
                    name: '',
                    typeid: '',
                    requirement: '',
                    isMust: [],
                    standard: '',
                    note: '',
                    type: '',
                    active: '',
                    maxQty: '',
                    minQty: '',
                    file: [],
                    enabledmark: undefined
                },
                equipment_maintain_type_itemList2: {
                    name: '',
                    typeid: '',
                    requirement: '',
                    isMust: [],
                    standard: '',
                    note: '',
                    type: '',
                    active: '',
                    maxQty: '',
                    minQty: '',
                    file: [],
                    enabledmark: undefined
                },
                equipment_maintain_type_itemList3: {
                    name: '',
                    typeid: '',
                    requirement: '',
                    isMust: [],
                    standard: '',
                    note: '',
                    type: '',
                    active: '',
                    maxQty: '',
                    minQty: '',
                    file: [],
                    enabledmark: undefined
                },
            },
            currVmodel: "",
            dataForm: {
                name: '',
                typeS: "",
                note: '',
                file: [],
                active: 1,
                type: 1,
                equipment_maintain_type_itemList: [],
                equipment_maintain_type_itemList1: [],
                equipment_maintain_type_itemList2: [],
                equipment_maintain_type_itemList3: [],
            },
            rules:
            {
                name: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    },
                ],
                typeS: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],



            },
            typeSOptions: [],
            equipment_maintain_type_itemmethodOptions: [],
            isMustOptions: [{ 'id': '是', 'fullName': '是' }, { 'id': '否', 'fullName': '否' }]


        }
    },
    computed: {},
    watch: {},
    created() {
        this.gettypeSOptions();
        this.getequipment_maintain_type_itemmethodOptions();
    },
    mounted() { },
    methods: {
        equipment_maintain_type_itemExist() {
            let isOk = true;
            for (let i = 0; i < this.dataForm.equipment_maintain_type_itemList.length; i++) {
                const e = this.dataForm.equipment_maintain_type_itemList[i];
                if (!e.name) {
                    this.$message({
                        message: '内容名称不能为空',
                        type: 'error',
                        duration: 1000
                    });
                    isOk = false
                    break
                }
            }
            for (let i = 0; i < this.dataForm.equipment_maintain_type_itemList3.length; i++) {
                const e = this.dataForm.equipment_maintain_type_itemList[i];
                if (!e.name) {
                    this.$message({
                        message: '内容名称不能为空',
                        type: 'error',
                        duration: 1000
                    });
                    isOk = false
                    break
                }
            }
            for (let i = 0; i < this.dataForm.equipment_maintain_type_itemList1.length; i++) {
                const e = this.dataForm.equipment_maintain_type_itemList[i];
                if (!e.name) {
                    this.$message({
                        message: '内容名称不能为空',
                        type: 'error',
                        duration: 1000
                    });
                    isOk = false
                    break
                }
            }
            for (let i = 0; i < this.dataForm.equipment_maintain_type_itemList2.length; i++) {
                const e = this.dataForm.equipment_maintain_type_itemList[i];
                if (!e.name) {
                    this.$message({
                        message: '内容名称不能为空',
                        type: 'error',
                        duration: 1000
                    });
                    isOk = false
                    break
                }
            }
            return isOk;
        },

        gettypeSOptions() {
            getDataInterfaceRes('337916290050031685').then(res => {
                let data = res.data
                this.typeSOptions = data
            })
        },
        getequipment_maintain_type_itemmethodOptions() {
            getDictionaryDataSelector('339677275932852933').then(res => {
                this.equipment_maintain_type_itemmethodOptions = res.data.list
            })
        },
        clearData() {
            this.dataForm.name = '';
            this.dataForm.typeS = "";
            this.dataForm.note = '';
            this.dataForm.file = [];
            this.dataForm.active = 1;
            this.dataForm.type = "1";
            this.dataForm.equipment_maintain_type_itemList = [];
            this.dataForm.equipment_maintain_type_itemList1 = [];
            this.dataForm.equipment_maintain_type_itemList2 = [];
            this.dataForm.equipment_maintain_type_itemList3 = [];
            this.dataForm.equipment_maintain_type_itemList.type = "1";
            this.dataForm.equipment_maintain_type_itemList.active = 1;
            this.dataForm.equipment_maintain_type_itemList1.type = "1";
            this.dataForm.equipment_maintain_type_itemList1.active = 1;
            this.dataForm.equipment_maintain_type_itemList2.type = "1";
            this.dataForm.equipment_maintain_type_itemList2.active = 1;
            this.dataForm.equipment_maintain_type_itemList3.type = "1";
            this.dataForm.equipment_maintain_type_itemList3.active = 1;


        },
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['elForm'].resetFields();
                if (this.dataForm.id) {
                    this.loading = true
                    request({
                        url: '/api/maintionType/Equipment_maintain_type/' + this.dataForm.id,
                        method: 'get'
                    }).then(res => {
                        this.dataInfo(res.data)
                        this.loading = false
                    });
                } else {
                    this.clearData()
                }
            });
            this.$store.commit('generator/UPDATE_RELATION_DATA', {})
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['elForm'].validate((valid) => {
                if (valid) {
                    if (!this.equipment_maintain_type_itemExist()) return
                    this.request()
                }
            })
        },
        request() {
            this.btnLoading = true
            let _data = this.dataList()
            if (!this.dataForm.id) {
                console.log(_data);
                request({
                    url: '/api/maintionType/Equipment_maintain_type',
                    method: 'post',
                    data: _data
                }).then((res) => {
                    this.$message({
                        message: res.msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.visible = false
                            this.btnLoading = false
                            this.$emit('refresh', true)
                        }
                    })
                }).catch(() => { this.btnLoading = false })
            } else {
                request({
                    url: '/api/maintionType/Equipment_maintain_type/' + this.dataForm.id,
                    method: 'PUT',
                    data: _data
                }).then((res) => {
                    this.$message({
                        message: res.msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.visible = false
                            this.btnLoading = false
                            this.$emit('refresh', true)
                        }
                    })
                }).catch(() => { this.btnLoading = false })
            }
        },
        addequipment_maintain_type_itemList() {
            let item = {
                name: undefined,
                typeid: undefined,
                method: 'text',
                requirement: undefined,
                isMust: undefined,
                standard: undefined,
                note: undefined,
                type: 1,
                active: 1,
            }
            this.dataForm.equipment_maintain_type_itemList.push(item)
        },
        delequipment_maintain_type_itemList(index) {
            this.dataForm.equipment_maintain_type_itemList.splice(index, 1);
        },
        addequipment_maintain_type_itemList1() {
            let item = {
                name: undefined,
                typeid: undefined,
                method: 'number',
                requirement: undefined,
                isMust: undefined,
                standard: undefined,
                note: undefined,
                type: 1,
                active: 1,
            }
            this.dataForm.equipment_maintain_type_itemList1.push(item)
        },
        delequipment_maintain_type_itemList1(index) {
            this.dataForm.equipment_maintain_type_itemList1.splice(index, 1);
        },
        addequipment_maintain_type_itemList2() {
            let item = {
                name: undefined,
                typeid: undefined,
                method: 'boolean',
                requirement: undefined,
                isMust: undefined,
                standard: undefined,
                note: undefined,
                type: 1,
                active: 1,
            }
            this.dataForm.equipment_maintain_type_itemList2.push(item)
        },
        delequipment_maintain_type_itemList2(index) {
            this.dataForm.equipment_maintain_type_itemList2.splice(index, 1);
        },
        addequipment_maintain_type_itemList3() {
            let item = {
                name: undefined,
                typeid: undefined,
                method: 'file',
                requirement: undefined,
                isMust: undefined,
                standard: undefined,
                note: undefined,
                type: 1,
                active: 1,
            }
            this.dataForm.equipment_maintain_type_itemList3.push(item)
        },
        delequipment_maintain_type_itemList3(index) {
            this.dataForm.equipment_maintain_type_itemList3.splice(index, 1);
        },
        openSelectDialog(key) {
            this.currTableConf = this.addTableConf[key]
            this.currVmodel = key
            this.selectDialogVisible = true
            this.$nextTick(() => {
                this.$refs.selectDialog.init()
            })
        },
        addForSelect(data) {
            for (let i = 0; i < data.length; i++) {
                let item = { ...this.tableRows[this.currVmodel], ...data[i] }
                this.dataForm[this.currVmodel].push(item)
            }
        },
        dataList() {
            var _data = JSON.parse(JSON.stringify(this.dataForm));
            _data.file = Array.isArray(_data.file) ? JSON.stringify(_data.file) : '[]'
            for (let i = 0; i < _data.equipment_maintain_type_itemList.length; i++) {
                var _list = _data.equipment_maintain_type_itemList[i];
                _list.isMust = parseInt(_list.isMust)
            }
            return _data;
        },
        dataInfo(dataAll) {
            let _dataAll = dataAll
            console.log(_dataAll);
            _dataAll.file = _dataAll.file ? JSON.parse(_dataAll.file) : []
            for (let i = 0; i < _dataAll.equipment_maintain_type_itemList.length; i++) {
                var _list = _dataAll.equipment_maintain_type_itemList[i];
                _list.isMust = parseInt(_list.isMust)
            }
            this.dataForm = _dataAll
        },
        sel(item) {
            console.log(item);
            if (item == 'boolean') {
                this.show1 = false;
                this.show2 = false;
                this.show3 = false;
                this.show4 = true
            } else if (item == 'number') {
                this.show3 = false;
                this.show4 = false;
                this.show2 = true
            } else if (item == 'text') {
                this.show3 = false;
                this.show4 = false;
                this.show2 = false;
                this.show1 = true
            } else if (item == 'file') {
                this.show2 = false;
                this.show4 = false;
                this.show3 = true;
            }
        }
    }
}

</script>
