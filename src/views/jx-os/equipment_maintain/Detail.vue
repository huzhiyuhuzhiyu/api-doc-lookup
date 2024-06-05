<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main">
            <div class="JNPF-common-page-header">
                <el-page-header @back="goBack" content="详情" />
                <div class="options">
                    <el-button @click="goBack">取 消</el-button>
                    <el-button type="primary" v-if="this.id == undefined?true:false " @click="submitWC">完 成</el-button>
                </div>
            </div>

            <div style="padding: 0 30px ;">
            <el-form ref="elForm" :model="item" size="small" label-width="100px" label-position="right"
                style="padding-top: 20px;">

                <el-col :span="24">
                    <el-row :gutter="15">
                        <el-col :span="8">
                            <el-form-item label="设备名称" prop="name">
                                <el-input v-model="item.equipmentId_name" placeholder="请输入" :style='{"width":"100%"}'
                                readonly>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="保养类型" prop="equimentMaintainTypeId_name">
                                <el-input v-model="item.equimentMaintainTypeId_name" placeholder="请输入"
                                    :style='{"width":"100%"}' readonly>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="负责人" prop="userId_name">
                                <el-input v-model="item.userId_name" placeholder="请输入" :style='{"width":"100%"}'
                                readonly>
                                </el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-col>

                <el-col :span="24">
                    <el-row :gutter="15">
                        <el-col :span="8">
                            <el-form-item label="开始时间" prop="startDate_name">
                                <el-input v-model="item.startDate_name" placeholder="请输入" :style='{"width":"100%"}'
                                readonly>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="结束时间" prop="endDate_name">
                                <el-input v-model="item.endDate_name" placeholder="请输入" :style='{"width":"100%"}'
                                readonly>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态" prop="endDate_name">
                                <el-input v-model="state" placeholder="请输入" :style='{"width":"100%"}' readonly>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="note">
                        <el-input v-model="item.note_name" placeholder="" :style='{"width":"100%"}' true type="textarea"
                            :autosize='{"minRows":4,"maxRows":4}' readonly>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>

            <el-row :gutter="15" class=" main" :style="{margin: '0 auto',width: '100%'}">
                <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
                    <el-table-column prop="equimentMaintainTypeItemId_name" label="保养内容" align="left" />
                    <el-table-column prop="method_name" label="保养方法" align="left" />
                    <el-table-column prop="requirement" label="保养要求" align="left" />
                    <el-table-column prop="standard" label="保养标准" align="left" />
                    <el-table-column prop="normal" label="正常/异常" align="left">
                        <template slot="header">
                            <span class="required-sign">*</span>正常/异常
                        </template>
                        <template slot-scope="scope">
                            <template v-if="scope.row.rowEdit">
                                <el-select v-model="scope.row.normal" placeholder="请选择" :multiple=false
                                    :clearable="false">
                                    <el-option v-for="(item, index) in normalOptions" :key="index"
                                        :label="item.fullName" :value="item.id" :disabled="item.disabled"></el-option>
                                </el-select>
                            </template>
                            <template v-else>
                                {{ scope.row.normal | dynamicText(normalOptions) }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="measuredValue" label="实测值" align="left">
                        <template slot="header">
                            <span class="required-sign">*</span>实测值
                        </template>
                        <template slot-scope="scope">
                            <template v-if="scope.row.rowEdit">
                                <el-input v-model="scope.row.measuredValue" placeholder="请输入" clearable
                                    :style='{"width":"100%"}' :filterable="false">
                                </el-input>
                            </template>
                            <template v-else>
                                {{scope.row.measuredValue_name}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注" align="left">
                        <template slot-scope="scope">
                            <template v-if="scope.row.rowEdit">
                                <el-input v-model="scope.row.note" placeholder="请输入" :clearable="false"
                                    :style='{"width":"100%"}' true :filterable="false">
                                </el-input>
                            </template>
                            <template v-else>
                                {{scope.row.note_name}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="file" label="附件">
                        <template slot-scope="scope">
                            <template v-if="scope.row.rowEdit">
                                <!-- <JNPF-UploadImg v-model="scope.row.file" :fileSize="10" sizeUnit="MB" :limit="9">
                                </JNPF-UploadImg> -->
                                <JNPF-UploadFz v-model="scope.row.file" :fileSize="10" sizeUnit="MB" :limit="9"
                                        buttonText="点击上传">
                                    </JNPF-UploadFz>
                            </template>
                            <template v-else>
                                <JNPF-UploadFz v-model="scope.row.file" :fileSize="10" sizeUnit="MB" :limit="9"
                                        buttonText="" disabled>
                                    </JNPF-UploadFz>
                            </template>
                        </template>
                    </el-table-column>

                    <!-- <el-table-column v-if="this.id == undefined?true:false " label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
                            <template v-if="scope.row.rowEdit">
                                <el-button size="mini" type="text" @click="saveForRowEdit(scope.row)">保存</el-button>
                                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                    @click="cancelRowEdit(scope.row,scope.$index)">取消</el-button>
                            </template>
                            <template v-else>
                                <el-button type="text" @click="scope.row.rowEdit=true">编辑</el-button>
                            </template>
                        </template>
                    </el-table-column> -->
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="init" />
            </el-row>

            <From v-if="formVisible" ref="Form" @refresh="refresh" />
        </div>
    </transition>
</template>
<script>
import request from '@/utils/request'
import PrintBrowse from '@/components/PrintBrowse'
import jnpf from '@/utils/jnpf'
import columnList from './columnList'
import SuperQuery from '@/components/SuperQuery'
import superQueryJson from './superQueryJson'
import From from '../equipment_maintain_line/Form.vue'
export default {
    components: { PrintBrowse, From },
    props: [],
    data() {
        return {
            visible: false,
            loading: false,
            btnLoading: false,
            selectDialogVisible: false,
            id: '',
            currTableConf: {},
            addTableConf: {
            },
            tableRows: {
            },
            currVmodel: "",
            dataForm: {
                equipmentMaintainId: '',
                equimentMaintainTypeItemId: '',
                normal: '',
                measuredValue: '',
                note: '',
                file: [],
            },
            rules:
            {



            },
            normalOptions: [{ "fullName": "正常", "id": "正常" }, { "fullName": "异常", "id": "异常" }],

            expandObj: {},
            columnOptions: [],
            mergeList: [],
            columnList,

            superQueryVisible: false,
            superQueryJson,
            detailVisible: false,
            query: {
                equipmentMaintainId: undefined,
            },
            treeProps: {
                children: 'children',
                label: 'fullName',
                value: 'id'
            },
            list: [],
            listLoading: true,
            total: 0,
            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            },
            formVisible: false,
            exportBoxVisible: false,
            normalOptions: [{ "fullName": "正常", "id": "正常" }, { "fullName": "异常", "id": "异常" }],
            normalProps: { "label": "fullName", "value": "id" },
            item: {},
            id: '',
            fleg: true

        }
    },
    computed: {},
    watch: {},
    created() {
        this.getColumnList();
    },
    mounted() { },
    methods: {
        getColumnList() {
            // 没有开启权限
            this.columnOptions = this.transformColumnList(this.columnList)
        },
        transformColumnList(columnList) {
            let list = []
            for (let i = 0; i < columnList.length; i++) {
                const e = columnList[i];
                if (!e.prop.includes('-')) {
                    list.push(e)
                } else {
                    let prop = e.prop.split('-')[0]
                    let label = e.label.split('-')[0]
                    let vModel = e.prop.split('-')[1]
                    let newItem = {
                        align: "center",
                        jnpfKey: "table",
                        prop,
                        label,
                        children: []
                    }
                    e.vModel = vModel
                    if (!this.expandObj.hasOwnProperty(`${prop}Expand`)) this.$set(this.expandObj, `${prop}Expand`, false)
                    if (!list.some(o => o.prop === prop)) list.push(newItem)
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].prop === prop) {
                            list[i].children.push(e)
                            break
                        }
                    }
                }
            }
            this.getMergeList(list)
            return list
        },
        getMergeList(list) {
            let newList = JSON.parse(JSON.stringify(list))
            newList.forEach(item => {
                if (item.children && item.children.length) {
                    let child = {
                        prop: item.prop + '-child-first'
                    }
                    item.children.unshift(child)
                }
            })
            newList.forEach(item => {
                if (item.children && item.children.length) {
                    item.children.forEach((child, index) => {
                        if (index == 0) {
                            this.mergeList.push({
                                prop: child.prop,
                                rowspan: 1,
                                colspan: item.children.length
                            })
                        } else {
                            this.mergeList.push({
                                prop: child.prop,
                                rowspan: 0,
                                colspan: 0
                            })
                        }
                    })
                } else {
                    this.mergeList.push({
                        prop: item.prop,
                        rowspan: 1,
                        colspan: 1
                    })
                }
            })
        },

        //取消
        goBack() {
            this.id = '';
            this.$emit('refresh')
        },

        //完成
        submitWC() {
            for (let i = 0; i < this.list.length; i++) {
                const el = this.list[i];
                if (el.normal == null || el.normal == '' || el.measuredValue == null || el.measuredValue == '') {
                    this.$message({
                        message: '请先填写数据再提交',
                        type: 'warning'
                    });
                    return;
                }
                this.saveForRowEdit(el)
            }
            if (this.fleg == false) {
                this.$message.error("更新失败");
                // this.$router.go(0);
                return;
            }
            let data = {
                userId: this.$store.state.user.userInfo.userId,
                id: this.item.id,
                generationId: this.item.generationId,
            }
            console.log(data);
            request({
                url: `/api/equipmentMaintain/Equipment_maintain/update`,
                method: 'get',
                data: data
            }).then(res => {
                if (res.code == 200) {
                    this.$message({
                        message: res.msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.id = '';
                            this.$emit('refresh', true)
                        }
                    })
                }
            })
        },

        init(item, id) {
            this.id = id;
            console.log(item);
            if (item == null || item == '') {
                this.item = this.item
            } else {
                this.item = item;
            }
            this.visible = true;
            this.query.equipmentMaintainId = this.item.id;
            this.listLoading = true;
            let _query = {
                ...this.listQuery,
                ...this.query,
                keyword: this.keyword,
                dataType: 0,
                menuId: this.menuId
            };
            request({
                url: `/api/equipmentMaintainLine/Equipment_maintain_line/getList`,
                method: 'post',
                data: _query
            }).then(res => {
                var _list = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = this.dataInfo(res.data.list[i]);
                    _list.push(_data)
                }
                let list = _list.map(o => ({
                    ...o,
                    rowEdit: true
                }))
                if (this.id != undefined) {
                    list.forEach(el => {
                        el.rowEdit = false
                    })
                }

                this.list = list
                this.cacheList = JSON.parse(JSON.stringify(this.list))
                this.total = res.data.pagination.total

                this.state = this.item.state == '1' ? '待保养' : '已保养';
                this.listLoading = false
            })

        },




        sortChange({ column, prop, order }) {
            this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
            this.listQuery.sidx = !order ? '' : prop
            this.init()
        },

        arraySpanMethod({ column }) {
            for (let i = 0; i < this.mergeList.length; i++) {
                if (column.property == this.mergeList[i].prop) {
                    return [this.mergeList[i].rowspan, this.mergeList[i].colspan]
                }
            }
        },
        search() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = "desc"
            this.listQuery.sidx = ""
            this.init()
        },
        refresh(isrRefresh) {
            this.formVisible = false;
            if (isrRefresh) this.reset()
        },
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.query.active = 1;
            this.query.type = 1;
            this.search()
        },
        openSuperQuery() {
            this.superQueryVisible = true
            this.$nextTick(() => {
                this.$refs.SuperQuery.init()
            })
        },
        superQuery(queryJson) {
            this.listQuery.superQueryJson = queryJson
            this.listQuery.currentPage = 1
            this.init()
        },
        dataList(fromData) {
            var _data = JSON.parse(JSON.stringify(fromData));
            _data.file = Array.isArray(_data.file) ? JSON.stringify(_data.file) : '[]'
            return _data;
        },
        dataInfo(dataAll) {
            let _dataAll = dataAll
            _dataAll.file = _dataAll.file ? JSON.parse(_dataAll.file) : []
            return _dataAll
        },
        cancelRowEdit(row, index) {
            if (!row.id) return this.list.splice(index, 1)
            row.rowEdit = false
            let item = JSON.parse(JSON.stringify(this.cacheList[index]))
            this.$set(this.list, index, item)
        },
        saveForRowEdit(rowEdit) {
            var row = this.dataList(rowEdit)
            if (!row.id) {
                request({
                    url: '/api/equipmentMaintainLine/Equipment_maintain_line',
                    method: 'post',
                    data: row
                }).then((res) => {
                    this.$message({
                        message: res.msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.init()
                        }
                    })
                })
            } else {
                request({
                    url: '/api/equipmentMaintainLine/Equipment_maintain_line/' + row.id,
                    method: 'PUT',
                    data: row
                }).then((res) => {
                    if (res.code != 200) {
                        this.fleg = false;
                    }
                })
            }
        },
        exportData() {
            this.exportBoxVisible = true
            this.$nextTick(() => {
                this.$refs.ExportBox.init(this.columnList)
            })
        },
        download(data) {
            let query = { ...data, ...this.listQuery, ...this.query, menuId: this.menuId }
            request({
                url: `/api/equipmentMaintainLine/Equipment_maintain_line/Actions/Export`,
                method: 'post',
                data: query
            }).then(res => {
                if (!res.data.url) return
                this.jnpf.downloadFile(res.data.url)
                this.$refs.ExportBox.visible = false
                this.exportBoxVisible = false
            })
        },
    },
}

</script>
    