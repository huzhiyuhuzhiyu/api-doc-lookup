<template>
    <el-drawer :title="!dataForm.id ? '新建' : '编辑'" :visible.sync="visible" :wrapperClosable="false" size="600px"
        append-to-body class="JNPF-common-drawer">
        <div class="JNPF-flex-main">
            <div class="dynamicForm ">
                <el-form ref="elForm" :model="dataTemplate" :rules="rules" size="small" label-width="100px"
                    label-position="right">
                    <template v-if="!loading">
                        <el-col :span="6" style="border-right:2px solid gray;height:calc(100vh - 140px);">
                            <!--  -->
                            <!-- <el-form-item label="创建时间" prop="creatortime"> -->
                            <!-- <el-select v-model="dataForm.creatortime" placeholder="请选择" clearable
                                   :style='{"width":"100%"}'>
                                   <el-option v-for="(item, index) in treeData" :key="index"
                                       :label="item.name" :value="item.F_Id" :disabled="item.disabled">
                                   </el-option>

                               </el-select> -->

                            <!-- :default-checked-keys="['comInput']" -->
                            <el-tree :data="propTreeData" :props="treeProps" default-expand-all highlight-current
                                ref="treeBox" :expand-on-click-node="false" @node-click="handleNodeClick"
                                class="JNPF-common-el-tree" node-key="F_id">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <i :class="data.icon"></i>
                                    <span class="text">{{node.label}}</span>
                                </span>
                            </el-tree>
                            <!-- </el-form-item> -->
                        </el-col>

                        <el-col :span="18">
                            <el-row :gutter="15">

                                <el-col v-for="(item,index) in data" :key="index" :span="24">
                                    <!-- {{item}} -->
                                    <el-form-item :label="item.__config__.label" prop="__vModel__">
                                        <el-input v-if="item.__config__.jnpfKey=='comInput'"
                                            v-model="dataTemplate[item.__vModel__]" :placeholder="item.placeholder"
                                            :clearable="item.clearable" :style='{"width":item.style.width}'></el-input>

                                        <el-slider v-if="item.__config__.jnpfKey=='slider'" style="width:90%;"
                                            v-model="dataTemplate[item.__vModel__]" :max="item.max" :step="item.step"
                                            :min="item.min" :show-stops="item['show-stops']"></el-slider>

                                        <el-input-number v-if="item.__config__.jnpfKey=='numInput'"
                                            v-model="dataTemplate[item.__vModel__]" :placeholder="item.placeholder"
                                            :step="item.step" :controls-position='item["controls-position"]'>
                                        </el-input-number>

                                        <el-select v-if="item.__config__.jnpfKey=='select'"
                                            v-model="dataTemplate[item.__vModel__]" :placeholder="item.placeholder"
                                            :clearable="item.clearable" :style='{"width":item.style.width}'>
                                            <el-option v-for="(item1, index1) in item.__slot__.options" :key="index1"
                                                :label="item1.fullName" :value="item1.id" :disabled="item1.disabled">
                                            </el-option>

                                        </el-select>

                                        <el-switch v-if="item.__config__.jnpfKey=='switch'"
                                            v-model="dataTemplate[item.__vModel__]" :active-value="item['active-value']"
                                            :inactive-value="item['inactive-value']">

                                        </el-switch>

                                        <el-input v-if="item.__config__.jnpfKey=='textarea'"
                                            v-model="dataTemplate[item.__vModel__]" :placeholder="item.placeholder"
                                            type="textarea" :autosize='item.autosize'
                                            :style='{"width":item.style.width}'></el-input>

                                    </el-form-item>
                                </el-col>

                            </el-row>
                        </el-col>
                    </template>
                </el-form>
                <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
                    @select="addForSelect" @close="selectDialogVisible=false" />

            </div>
            <div class="drawer-footer">
                <el-button @click="visible = false"> 取 消</el-button>
                <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 确 定</el-button>
            </div>

        </div>
    </el-drawer>
</template>
<script>
    import request from '@/utils/request'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'

    export default {
        components: {},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                btnLoading: false,
                selectDialogVisible: false,
                currTableConf: {},
                addTableConf: {},
                tableRows: {},
                currVmodel: "",
                propForm: [],
                treeActiveId: "",
                dataTemplate: {},
                data: [],

                dataForm: {
                    name: '',
                    description: '',
                    content: '',
                    sortcode: 24,
                    active: 0,
                },
                rules: {},
                propTreeData: [],
                treeProps: {
                    children: 'children',
                    label: 'name',
                    value: 'F_Id'
                },
                descriptionOptions: [{
                    "fullName": "选项一",
                    "id": "1"
                }, {
                    "fullName": "选项二",
                    "id": "2"
                }],

            }
        },
        computed: {},
        watch: {},
        created() {

        },
        mounted() {

        },
        methods: {

            handleNodeClick(data, node) {
                this.treeActiveId = data.F_Id
                // this.data = JSON.parse(JSON.stringify(this.dataTemplate));
                // this.data = data.content;


                if (data.content) {
                    this.data = JSON.parse(data.content.replace("\\", ""))
                } else {
                    this.data = []
                }
                console.log(this.data)
                // for (let
                //         key in this.query) {
                //     this.query[key] = undefined
                // }
                // this.query.name = data.F_Id
                // this.listQuery = {
                //     currentPage: 1,
                //     pageSize: 20,
                //     sort: "desc",
                //     sidx: "",
                // }
                // this.initData()
            },


            // getcreatortimeOptions() {
            //     getDataInterfaceRes('403572620777228165').then(res => {
            //         let data = res.data
            //         this.creatortimeOptions = data
            //     })
            // },
            clearData() {
                this.dataForm.creatortime = "comInput";
                this.dataForm.name = '';
                this.dataForm.description = '';
                this.dataForm.content = '';
                this.dataForm.sortcode = 24;
                this.dataForm.active = 0;
            },
            init(id, abc) {
                this.propTreeData = abc
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {

                    // this.$refs['elForm'].resetFields();

                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/system/Bean_attribute_category/' + this.dataForm.id,
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
                console.log(this.dataTemplate)
                // this.$refs['elForm'].validate((valid) => {
                //     if (valid) {
                //         this.request()
                //     }
                // })
            },
            request() {
                this.btnLoading = true
                let _data = this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/system/Bean_attribute_category',
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
                    }).catch(() => {
                        this.btnLoading = false
                    })
                } else {
                    request({
                        url: '/api/system/Bean_attribute_category/' + this.dataForm.id,
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
                    }).catch(() => {
                        this.btnLoading = false
                    })
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
                    let item = {
                        ...this.tableRows[this.currVmodel],
                        ...data[i]
                    }
                    this.dataForm[this.currVmodel].push(item)
                }
            },
            dataList() {
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                _data.sortcode = parseInt(_data.sortcode)
                _data.active = parseInt(_data.active)
                return _data;
            },
            dataInfo(dataAll) {
                let _dataAll = dataAll
                _dataAll.sortcode = parseInt(_dataAll.sortcode)
                _dataAll.active = parseInt(_dataAll.active)
                this.dataForm = _dataAll
            },
        },
    }
</script>
