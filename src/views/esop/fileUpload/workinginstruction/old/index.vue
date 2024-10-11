<template>
    <div  class="JNPF-full-dialog" style="height: 100%">
        <div class="JNPF-full-dialog-header" style="height: 60px;background-color: #fff">
            <div class="header-title" style="width: 320px">

<!--                <img src="@/assets/images/jnpf.png" :class="headClass" class="header-logo" v-else />-->
                <p class="header-txt">{{title}}</p>
            </div>
            <el-steps  style="width: calc(100% - 692px);min-width: 592px" :active="activeStep" finish-status="success" simple class="steps steps2" v-if="!loading">
                <el-step title="产品分类" @click.native="stepChick(0)" />
                <el-step title="选择产品" @click.native="stepChick(1)" />
                <el-step title="选择工序" @click.native="stepChick(2)" />
                <el-step title="上传文件" @click.native="stepChick(3)" />
            </el-steps>
            <div class="options" style="min-width: 250px">
                <el-button size="mini" @click="prev" :disabled="activeStep <= 0 || activeStep === 4">{{ $t('common.prev') }}</el-button>
                <el-button size="mini" @click="next" :disabled="nextDisabled" :loading="nextBtnLoading">
                    {{ $t('common.next') }}
                </el-button>
                <el-button v-if="btnType !== 'look'" size="mini" type="primary" @click="dataFormSubmit()" :disabled="activeStep != 3"
                           :loading="btnLoading">{{ $t('common.confirmButton') }}</el-button>
            </div>
        </div>
        <div class="main" style="height: calc(100% - 60px);padding: 10px 0 0 0;" v-loading="loading">
            <el-row type="flex" justify="center" align="middle" class="basic-box" v-if="activeStep === 0">
                <el-col :span="24" class="basicForm">
                    <ChooseCategory :choose-row.sync="chooseRowObj.category" v-model="chooseIdObj.chooseCategoryId" />
                </el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="basic-box" >
                <el-col :span="24" class="basicForm" style="padding: 0" >
                    <ChooseProduct  :choose-row.sync="chooseRowObj.product"
                                    :productCategoryId="chooseIdObj.chooseCategoryId"
                                    v-model="chooseIdObj.chooseProductId"
                                    v-if="activeStep === 1"/>
                    <ChooseProcess
                        :choose-row.sync="chooseRowObj.process"
                        v-model="chooseIdObj.chooseProcessId"
                        v-if="activeStep === 2"/>
                    <SubmitFile :type="type" @close="submitFileClose" ref="submitFile" :choose-obj="chooseRowObj" v-if="activeStep === 3" />
                    <FinishSubmit @recreate="recreateHandler" v-if="activeStep === 4" />
                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
import { checkSystemCode, checkSystemValidSql, updateSystemData, addSystemAbnoramlData, detailSystemAbnoram } from '@/api/abnormalManagement/index.js'
import { mapState } from 'vuex'
import vcrontab from "vcrontab"
import AbnormalProcess from '@/components/AbnormalProcess'
import ChooseCategory from "@/views/esop/fileUpload/workinginstruction/old/chooseCategory.vue";
import ChooseProduct from "@/views/esop/fileUpload/workinginstruction/old/chooseProduct.vue";
import ChooseProcess from "@/views/esop/fileUpload/workinginstruction/old/chooseProcess.vue";
import SubmitFile from "@/views/esop/fileUpload/workinginstruction/old/submitFile.vue";
import FinishSubmit from "@/views/esop/fileUpload/workinginstruction/old/finishSubmit.vue";
export default {
    name:'WorkingInstruction',
    components: {FinishSubmit, SubmitFile, ChooseProcess, ChooseProduct, ChooseCategory, vcrontab, AbnormalProcess },
    data() {
        return {
            chooseIdObj:{
                chooseCategoryId: '',
                chooseProductId:'',
                chooseProcessId:'',
            },
            chooseRowObj:{
                category:null,
                product:null,
                process:null
            },
            showCron: false,
            showCrontab: true,
            visible: true,
            loading: false,
            nextBtnLoading: false,
            activeStep: 0,
            dataForm: {
                code: "",
                cron: "",
                executionSql: "",
                id: '',
                name: "",
                remark: "",
                status: ""
            },
            dataFormItems: [],
            btnType: "",
            btnLoading: false,
            flowTemplateJson: {},
            codeConfig: {},
            orderConfig: {},
            flowEngine:{}
        }
    },
    computed: {
        ...mapState({
            headClass: state => state.settings.headClass,
        }),
        sysConfig() {
            return this.$store.state.settings.sysConfig
        },
        systemVO() {
            return this.$store.state.settings.systemVO
        },
        nextDisabled(){
            let flag = false
            switch (this.activeStep) {
                case 0:
                    flag = !this.chooseIdObj.chooseCategoryId
                    break
                case 1:
                    flag = !this.chooseIdObj.chooseProductId
                    break

            }
            return this.activeStep >= 3 || this.loading || flag
        }
    },
    props:{
        title:{
            type: String,
            default: '作业指导书上传'
        },
        type:{
            type:String,
            default: 'work'
        }
    },
    methods: {
        recreateHandler(){
            Object.keys(this.chooseIdObj).forEach(key=>this.chooseIdObj[key] = '')
            Object.keys(this.chooseRowObj).forEach(key=>this.chooseRowObj[key] = {})
            this.activeStep = 0
        },
        submitFileClose(){
            console.log("完成")
            this.activeStep++
        },
        dataFormSubmit(){
            this.$refs.submitFile.dataFormSubmit()
        },
        next() {
            console.log(this.activeStep)
            switch (this.activeStep) {
                case 0:
                    if(!this.chooseIdObj.chooseCategoryId){
                        return this.$message.info('请选择产品分类')
                    }
                    break
                case 1:
                    if(!this.chooseIdObj.chooseProductId){
                        return this.$message.info('请选择产品')
                    }
                    break
                case 2:
                    break
                case 3:

                    break
            }
            if (this.activeStep < 4) {
                this.activeStep += 1
                this.nextBtnLoading = false
            }
        },

        prev() {
            this.activeStep -= 1
        },
        stepChick(key) {
            if(this.activeStep === 4) return this.$message.info("您已完成上传，如需修改，请前往文件管理")
            if (this.activeStep <= key) return
            this.activeStep = key
        },
    }
}
</script>
<style lang="scss" scoped>
::v-deep .pop_btn {
    display: none;
}
</style>
