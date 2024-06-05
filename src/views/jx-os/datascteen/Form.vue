<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="800px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="80px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-row :gutter="15">
                            <el-col :span="20">
                                <el-row :gutter="15">
                                    <el-col :span="24">
                                        <el-form-item label="系统看板" prop="datascreenId">
                                            <popupSelect v-model="dataForm.datascreenId" placeholder="请选择" clearable
                                                field="datascreenId" interfaceId="353849691835730309"
                                                :columnOptions="datascreenIdcolumnOptions" propsValue="id"
                                                relationField="title" popupType="dialog" popupTitle="选择数据"
                                                popupWidth="800px">

                                            </popupSelect>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24" v-show="false" >
                                        <el-form-item label="pic">
                                            <popupAttr :isReturn="true" @ReturnData="returnPic" relationField="datascreenId"
                                                showField="backgroundUrl">

                                            </popupAttr>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24"v-show="false" >
                                        <el-form-item label="url">
                                            <popupAttr :isReturn="true" @ReturnData="returnUrl" relationField="datascreenId" showField="id">

                                            </popupAttr>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24" v-show="false" >
                                        <el-form-item label="title">
                                            <popupAttr :isReturn="true" @ReturnData="returnTitle" relationField="datascreenId" showField="title">

                                            </popupAttr>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="dataForm.name" placeholder="请输入" clearable
                                                :style='{"width":"100%"}'>

                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="链接" prop="url">
                                            <el-input v-model="dataForm.url" placeholder="请输入" clearable
                                                :style='{"width":"100%"}'>

                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="24">
                                        <el-form-item label="分类" prop="datascreenCategoryId">
                                            <JNPFTreeSelect v-model="dataForm.datascreenCategoryId" placeholder="请选择"
                                                clearable :options="datascreenCategoryIdOptions"
                                                :props="datascreenCategoryIdProps">

                                            </JNPFTreeSelect>
                                        </el-form-item>
                                    </el-col> -->
                                </el-row>
                            </el-col>

                           <!-- <div class="img_box">
                              <single-img v-model="baseForm.appIcon" tip="APP图标" />
                              <div class="img_box_text">1:1</div>
                            </div> -->


                            <el-col :span="4">
                                <el-form-item class="pic" prop="pic">
                                    <div class="img_box">
                                      <single-img v-model="dataForm.pic" :imageUrl="dataForm.pic" />
    <!-- <img :src="dataForm.pic" width="50"/> -->
    <!-- <el-image src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" style="width: 100px; height: 100px" > </el-image> -->
                                    </div>
                                    <!-- <single-img v-model="dataForm.pic" tip="APP图标" /> -->
                                    <!-- <JNPF-UploadImg v-model="dataForm.pic" :fileSize="10" sizeUnit="MB"
                                        :limit="1">

                                    </JNPF-UploadImg> -->
                                </el-form-item>
                                <!-- http://localhost:30000/api/file/VisusalImg/screenShot/56d0999ec3b3431e8c2afe076320e40d.jpg -->
                                  <!-- <img :src="dataForm.pic" width="100"/> -->

                                  <!-- <el-image v-model="dataForm.pic" :src="dataForm.pic" style="width: 200px; height: 113px" > </el-image> -->

                                <!-- <single-img v-model="dataForm.pic" :imageUrl="dataForm.pic" tip="导航图标" /> -->
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
    import singleImg from '@/components/Upload/JXSingleImg'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'

    export default {
        components: {singleImg},
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
                    datascreenId: "352420839934660357",
                    name: '',
                    url: '',
                    datascreenCategoryId: "",
                    pic: '',
                    creatoruserid: "",
                    creatortime: "",
                    lastmodifyuserid: "",
                    lastmodifytime: "",
                },
                rules: {



                },
                datascreenIdcolumnOptions: [{
                    "label": "名称",
                    "value": "title",
                    "type":"text"
                // }, {
                //     "label": "地址",
                //     "value": "id"
                }, {
                    "label": "预览",
                    "value": "backgroundUrl",
                    "type":"img"
                }, ],
                datascreenCategoryIdOptions: [],
                datascreenCategoryIdProps: {
                    "label": "name",
                    "value": "F_Id",
                    "children": "children"
                },

            }
        },

        // watch: {
        //     'dataForm': {
        //         handler(new11, old) {
        //             // if (this.$refs.backgroundUrl != undefined && this.$refs.backgroundUrl.value) {
        //                 // console.log(new11,this.$refs.backgroundUrl.value);
        //             // }
        //         },
        //         deep: true //为true，表示深度监听，这时候就能监测到a值变化
        //     }
        // },

        created() {
            this.getdatascreenCategoryIdOptions();
        },
        methods: {
            returnTitle(value){
                this.dataForm.name = value
            },
            returnPic(value){
                this.dataForm.pic = value
            },
            returnUrl(value){
                 this.dataForm.url = value
            },
            getdatascreenCategoryIdOptions() {
                getDataInterfaceRes('353910117080501189').then(res => {
                    let data = res.data
                    this.datascreenCategoryIdOptions = data
                })
            },
            clearData() {
                this.dataForm.datascreenId = "352420839934660357";
                this.dataForm.name = '';
                this.dataForm.url = '';
                this.dataForm.datascreenCategoryId = "";
                this.dataForm.pic = '';
                this.dataForm.creatoruserid = "";
                this.dataForm.creatortime = "";
                this.dataForm.lastmodifyuserid = "";
                this.dataForm.lastmodifytime = "";
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/base_datascteen/Base_datascteen/' + this.dataForm.id,
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
                        this.request()
                    }
                })
            },
            request() {
                this.btnLoading = true
                let _data = this.dataList()
                if (!this.dataForm.id) {
                    request({ url: '/api/base_datascteen/Base_datascteen', method: 'post', data: _data }).then((res) => {
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
                else {
                    request({
                        url: '/api/base_datascteen/Base_datascteen/' + this.dataForm.id,
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
                // _data.pic = Array.isArray(_data.pic) ? JSON.stringify(_data.pic) : '[]'
                // _data.pic = dataAll.pic
                return _data;
            },
            dataInfo(dataAll) {console.log(dataAll);
                let _dataAll = dataAll
                // _dataAll.pic = _dataAll.pic ? JSON.parse(_dataAll.pic) : []
                _dataAll.pic = dataAll.pic
                this.dataForm = _dataAll
            }

        },
    }
</script>
<style  scoped>
    /deep/ .pic .el-form-item__content{margin-left:23px !important;}
</style>
