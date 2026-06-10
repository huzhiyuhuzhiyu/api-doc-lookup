<template>
    <el-drawer :title="!dataForm.id ? '新建' : '编辑'" :visible.sync="visible" :wrapperClosable="false" size="500px"
        append-to-body class="JNPF-common-drawer">
        <div class="JNPF-flex-main">
            <div class="dynamicForm ">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                    label-position="right">
                    <template v-if="!loading">
                        <el-col :span="6" style="border-right:1px solid silver;height:calc(100vh - 140px);">

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
                            <el-col :span="24">
                                <el-form-item label="排序码" prop="categoryId">
                                    <el-input v-model="dataForm.sortCode" placeholder="请输入" clearable
                                        :style='{"width":"100%"}'>

                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="24">
                                <el-form-item label="表单ID" prop="categoryId">
                                    <el-input v-model="dataForm.categoryId" placeholder="请输入" clearable
                                        :style='{"width":"100%"}'>

                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="字段JSON" prop="content">
                                    <el-input v-model="dataForm.content" placeholder="请输入" :style='{"width":"100%"}' true
                                        type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

                                    </el-input>
                                </el-form-item>
                            </el-col> -->
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
                dataForm: {
                    categoryId: '',
                    content: '',
                    creatoruserid: "",
                    creatortime: "",
                    lastmodifyuserid: "",
                    lastmodifytime: "",
                    sortCode:"",
                },
                rules: {},

                treeActiveId:-1,
                propTreeData: [],
                treeProps: {
                    children: 'children',
                    label: 'name',
                    value: 'F_Id'
                },

                dataTemplate: {},
                data: [],

            }
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        methods: {
            handleNodeClick(data, node) {
                this.treeActiveId = data.F_Id
                // this.dataTemplate={}
                if (data.content) {
                    this.data = JSON.parse(data.content.replace("\\", ""))
                } else {
                    this.data = []
                }

                this.clearData();
            },
            clearData() {
                // this.dataForm.categoryId = '';
                this.dataForm.content = '';
                this.dataForm.creatoruserid = "";
                this.dataForm.creatortime = "";
                this.dataForm.lastmodifyuserid = "";
                this.dataForm.lastmodifytime = "";
            },
            init(id,abc,treeActiveId) {
                this.propTreeData = abc
                this.dataForm.categoryId = treeActiveId
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/com.jx/Bean_attribute/' + this.dataForm.id,
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
                var dataJson = {}
                dataJson = JSON.parse(JSON.stringify(this.dataTemplate))
                dataJson['jnpfKey'] = this.treeActiveId
                dataJson['__config__'] = {}
                dataJson.__config__.jnpfKey = this.treeActiveId
                dataJson.__config__.label = this.dataTemplate.label
                dataJson.__config__.required = this.dataTemplate['config.required']
                delete dataJson["config.required"];

                dataJson.__config__.span = this.dataTemplate['config.span']
                delete dataJson["config.span"];

                dataJson['__vModel__'] = this.dataTemplate['prop']
                this.dataForm.content = JSON.stringify(dataJson)


                this.$refs['elForm'].validate((valid) => {
                    if (valid) {
                        this.request()
                    }
                })

            },
            request() {
                this.btnLoading = true
                let _data = this.dataList()
                // console.log(_data);
                // return
                if (!this.dataForm.id) {
                    request({
                        url: '/api/com.jx/Bean_attribute',
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
                        url: '/api/com.jx/Bean_attribute/' + this.dataForm.id,
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
                return _data;
            },
            dataInfo(dataAll) {
                let _dataAll = dataAll
                this.dataForm = _dataAll
            },
        },
    }
</script>
