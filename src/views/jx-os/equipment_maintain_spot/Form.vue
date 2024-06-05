<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
        <el-row :gutter="17" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <!-- <el-col :span="24">
                        <el-form-item label="记录名称" prop="name">
                            <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="设备" prop="equipmentId">
                            <popupSelect v-model="dataForm.equipmentId" placeholder="请选择" clearable field="equipmentId"
                                interfaceId="337912333508542533" :columnOptions="equipmentIdcolumnOptions"
                                propsValue="F_Id" relationField="name" popupType="dialog" popupTitle="选择数据"
                                popupWidth="800px" hasPage :pageSize="20">

                            </popupSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="任务类型" prop="maintenanceLevel">
                            <el-select v-model="dataForm.maintenanceLevel" placeholder="请选择" clearable
                                :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in maintenanceLevelOptions" :key="index"
                                    :label="item.fullName" :value="item.id" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="24">
                        <el-form-item label="操作类型" prop="type">
                            <el-select v-model="dataForm.type" placeholder="请选择" clearable :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName"
                                    :value="item.id" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="点检类型" prop="equimentMaintainTypeId">
                            <el-select v-model="dataForm.equimentMaintainTypeId" placeholder="请选择" clearable
                                :style='{"width":"100%"}' @change="getListItem(dataForm.equimentMaintainTypeId)">
                                <el-option v-for="(item, index) in equimentMaintainTypeIdOptions" :key="index"
                                    :label="item.name" :value="item.F_Id" :disabled="item.disabled"></el-option>

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
                    
                    <el-col :span="24" v-if="show">
                        <div class="">
                            <JNPF-table v-loading="listLoadingitem" :data="listitem" @sort-change='sortChangeitem'
                                :span-method="arraySpanMethoditem">
                                <el-table-column prop="name_name" label="内容名称" align="left" />
                                <el-table-column prop="method_name" label="方法" align="left" width="350" />
                                <el-table-column prop="requirement_name" label="要求" align="left" />
                                <!-- <el-table-column label="是否必须" prop="isMust" algin="left">
                                    <template slot-scope="scope">
                                        {{ scope.row.isMust | dynamicText(isMustOptions) }}
                                    </template>
                                </el-table-column> -->
                                <el-table-column prop="standard_name" label="标准" align="left" />
                                <!-- <el-table-column prop="note_name" label="备注" align="left" /> -->
                            </JNPF-table>
                            <pagination :total="totalitem" :page.sync="listQueryitem.currentPage"
                                :limit.sync="listQueryitem.pageSize" @pagination="initDataitem" />
                        </div>
                    </el-col>
                </template>
            </el-form>
            <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
                @select="addForSelect" @close="selectDialogVisible=false" />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visibles()"> 取 消</el-button>
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
            show:false,
            visible: false,
            loading: false,
            btnLoading: false,
            selectDialogVisible: false,
            currTableConf: {},
            addTableConf: {
            },
            tableRows: {
            },
            currVmodel: "",
            dataForm: {
                name: '',
                equipmentId: "",
                maintenanceLevel: "",
                type: "2",
                equimentMaintainTypeId: "",
                typeS: "1",
                userId: "",
                startDate: '',
                endDate: '',
                note: '',
                state: "1",
                active: 1,
            },
            rules:
            {
                // name: [
                //     {
                //         required: true,
                //         message: '请输入',
                //         trigger: 'blur'
                //     },
                // ],
                equipmentId: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],
                maintenanceLevel: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],
                type: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],
                equimentMaintainTypeId: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
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
            equipmentIdcolumnOptions: [{ "label": "名称", "value": "name" }, { "label": "编码", "value": "code" },],
            maintenanceLevelOptions: [{ "fullName": "预防", "id": "预防" }, { "fullName": "日常", "id": "日常" }, { "fullName": "计划", "id": "计划" }],
            typeOptions: [{ "fullName": "保养", "id": "1" }, { "fullName": "点检", "id": "2" }],
            equimentMaintainTypeIdOptions: [],
            typeSOptions: [{ "fullName": "量具", "id": "量具" }, { "fullName": "工装", "id": "工装" }, { "fullName": "设备", "id": "设备" }],
            userIdcolumnOptions: [{ "label": "名称", "value": "name" }, { "label": "编码", "value": "code" },],
            stateOptions: [{ "fullName": "待点检", "id": "1" }, { "fullName": "已点检", "id": "2" }],

            //子表
            listLoadingitem: false,
            mergeList: [],
            listQueryitem: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            },
            listitem: [],
            totalitem: 0,
            queryitem: {
                typeid: undefined,
                name: undefined,
                type: "2",
                active: 1
            },
            typeSOptionsitem: [],
            expandObjitem: {},
            columnOptionsitem: [],
            mergeListitem: [],
            isMustOptions: [{ "fullName": "是", "id": "1" }, { "fullName": "否", "id": "0" }]
        }
    },
    computed: {},
    watch: {},
    created() {
        this.getequimentMaintainTypeIdOptions();
    },
    mounted() { },
    methods: {
        getequimentMaintainTypeIdOptions() {
            let list = [{
                field:'type',
                defaultValue:'1'
            }]
            let test = {
                paramList:list,
                tenantId:'',
                origin:'preview'
            }
            getDataInterfaceRes('340089684799522501',test).then(res => {
                let data = res.data
                this.equimentMaintainTypeIdOptions = data
            })
        },
        clearData() {
            this.dataForm.name = '';
            this.dataForm.equipmentId = "";
            this.dataForm.maintenanceLevel = "";
            this.dataForm.type = "2";
            this.dataForm.equimentMaintainTypeId = "";
            this.dataForm.typeS = "1";
            this.dataForm.userId = "";
            this.dataForm.startDate = '';
            this.dataForm.endDate = '';
            this.dataForm.note = '';
            this.dataForm.state = "1";
            this.dataForm.active = 1;
        },
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['elForm'].resetFields();
                if (this.dataForm.id) {
                    this.loading = true
                    request({
                        url: '/api/equipmentMaintain/Equipment_maintain/' + this.dataForm.id,
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

        visibles(){
            this.visible = false;
            this.show = false;
        },

        // 表单提交
        dataFormSubmit() {
            this.$refs['elForm'].validate((valid) => {
                if (valid) {
                    this.request();
                    this.show = false
                }
            })
        },
        request() {
            this.btnLoading = true
            let _data = this.dataList()
            if (!this.dataForm.id) {
                // if (this.dataForm.userId != null || this.dataForm.userId != '') {
                //     this.dataForm.state = '处理中'
                // }
                // if (this.dataForm.endDate != null || this.dataForm.endDate != '') {
                //     this.dataForm.state = '已完成'
                // }
                request({
                    url: '/api/equipmentMaintain/Equipment_maintain',
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
                    url: '/api/equipmentMaintain/Equipment_maintain/' + this.dataForm.id,
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
            return _data;
        },
        dataInfo(dataAll) {
            let _dataAll = dataAll
            this.dataForm = _dataAll
        },


         //子表
         getListItem(id) {
            console.log(id);
            this.listitem = [];
            this.queryitem.typeid = id;
            this.show = true;
            this.initDataitem();

        },
        initDataitem() {
            this.listLoadingitem = true;
            let _query = {
                ...this.listQueryitem,
                ...this.queryitem,
                keyword: this.keyword,
                dataType: 0,
                menuId: this.menuId
            };

            request({
                url: `/api/maintionTypeItem/Equipment_maintain_type_item/getList`,
                method: 'post',
                data: _query
            }).then(res => {
               
                var _list = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i];
                    _list.push(_data)
                }
                this.listitem = _list.map(o => ({
                    ...o,
                    ...this.expandObjitem
                }))
                this.totalitem = res.data.pagination.total
                this.listLoadingitem = false
            })
        },
        gettypeidOptions() {
            getDataInterfaceRes('340089684799522501').then(res => {
                let data = res.data
                this.typeidOptionsitem = data;
            })
        },
        sortChangeitem({ column, prop, order }) {
            this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
            this.listQuery.sidx = !order ? '' : prop
            this.initDataitem()
        },
        arraySpanMethoditem({ column }) {
            for (let i = 0; i < this.mergeList.length; i++) {
                if (column.property == this.mergeList[i].prop) {
                    return [this.mergeList[i].rowspan, this.mergeList[i].colspan]
                }
            }
        },
    },
}

</script>
