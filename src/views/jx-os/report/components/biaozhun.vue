<template>
    <div class="biaozhun" style="z-index: 1000;">
        <el-dialog title="标准值设置" :close-on-click-modal="false" :visible.sync="visible"
                   class="JNPF-dialog JNPF-dialog_center " :fullscreen="fullscreen" lock-scroll width="800px"
                   @closed="dialogClose" :modal-append-to-body="false"
        >
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" :inline="true" label-position="right">
                <template v-for="(data,index) in dataForm.list">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="4">
                            <el-form-item label="" prop="object">
                                <el-select v-model="data.object" placeholder="请选择标准对象" :style='{"width":"100%"}'
                                           @change=""
                                >
                                    <el-option v-for="(item, index1) in objectOptions" :key="index1" :label="item.label"
                                               :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="" prop="operator">
                                <el-select v-model="data.operator" placeholder="运算符" :style='{"width":"100%"}'
                                           @change=""
                                >
                                    <el-option v-for="(item, index1) in operatorOptions" :key="index1"
                                               :label="item.label" :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-row v-if="data.operator != 'in'">
                                <el-form-item label="" prop="value" style="width:calc( 100% - 10px )">
                                    <el-input v-model="data.value" placeholder="请输入" clearable>
                                    </el-input>
                                </el-form-item>
                            </el-row>

                            <el-row v-else>
                                <el-form-item label="" prop="value">
                                    <el-col :span="11">
                                        <el-input v-model="data.value" placeholder="请输入" clearable>
                                        </el-input>
                                    </el-col>
                                    <el-col class="line" :span="2" style="text-align: center;">~</el-col>
                                    <el-col :span="11">
                                        <el-input v-model="data.value2" placeholder="请输入" clearable>
                                        </el-input>
                                    </el-col>
                                </el-form-item>
                            </el-row>
                        </el-col>


                        <el-col :span="1" style="text-align: center;">
                            <el-form-item label="" prop="color">
                                <el-color-picker v-model="data.color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" style="text-align: right;">
                            <el-button icon="el-icon-plus" size="mini" @click="addDataFormList()"></el-button>
                            <el-button icon="el-icon-minus" size="mini" @click="delDataFormList(index)"></el-button>
                        </el-col>


                    </el-row>
                </template>
            </el-form>
            <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
                          @select="addForSelect" @close="selectDialogVisible=false"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false"> 取 消</el-button>
<!--                <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 确 定</el-button>-->
                 <el-button type="primary" @click="saveLoval()" :loading="btnLoading"> 保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String
        },
        objectOptions: {
            type: Array
        },
        fullscreen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: false,
            loading: false,
            btnLoading: false,
            selectDialogVisible: false,
            currTableConf: {},
            dataForm: {
                list: []
            },
            activeabmqqm: '0',
            rules: {},

            operatorOptions: [
                {
                    label: '范围内',
                    value: 'in'
                },
                {
                    label: '大于等于',
                    value: '>='
                },
                {
                    label: '小于等于',
                    value: '<='
                },
                {
                    label: '大于',
                    value: '>'
                },
                {
                    label: '小于',
                    value: '<'
                },
                {
                    label: '等于',
                    value: '=='
                }
            ]
        }
    },
    computed: {},
    watch: {},
    created() {
        //this.getcategoryIdOptions();
        //this.gettypeSOptions();
        //this.getmrpWorkshopIdOptions();
    },
    mounted() {
    },
    methods: {

        addDataFormList() {
            let item = {
                object: '',
                operator: '',
                value: '',
                color: '#409EFF'
            }
            this.dataForm.list.push(item)
        },

        /**
         * 删除list该下标数据
         * @param {Object} index
         */
        delDataFormList(index) {
            this.dataForm.list.splice(index, 1)
        },

        clearData() {
            this.dataForm.list = [{
                object: '',
                operator: '<=',
                value: '',
                color: '#409EFF'
            }]
        },

        /**
         * 初始化参数
         * @param {Object} id
         */
        init(normList) {
            this.visible = true
            this.$nextTick(() => {
                this.$refs['elForm'].resetFields()
                if (normList && normList.length > 0) {
                    this.dataForm.list = JSON.parse(JSON.stringify(normList))
                } else {
                    this.clearData()
                }
            })
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
            this.visible = false
            this.btnLoading = false
            this.$emit('setNormList', this.dataForm.list)

        },

        saveLoval(){
            this.$refs['elForm'].validate((valid) => {
                if (valid) {
                    let str = JSON.stringify(this.dataForm.list);
                    localStorage.setItem(`${this.name}NormList`,str);
                    this.request();
                }
            })
        },

        dialogClose() {
            this.activeabmqqm = '0'
        }
    }
}
</script>
<style lang="scss" scoped>
.biaozhun {
    > > > .el-dialog {
        .el-dialog__body {
            padding: 20px 20px 10px 24px;
        }

        .el-form-item__content {
            width: 100%;
        }

        .el-row {
            height: 51px;
        }
    }
}
</style>
