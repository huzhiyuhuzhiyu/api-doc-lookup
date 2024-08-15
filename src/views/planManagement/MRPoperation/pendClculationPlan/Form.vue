<template>
  <el-dialog :visible.sync="visible" fullscreen lock-scroll class="JNPF-full-dialog" :show-close="false" :modal="false">
    <div class="JNPF-full-dialog-header">
      <div class="header-title">

        <!-- <img src="@/assets/images/jnpf2.png" class="header-logo" /> -->
        <p class="header-txt"> MRP计算</p>
      </div>
      <el-steps :active="activeStep" finish-status="success" simple style="width: 580px;" v-if="!loading">
        <el-step title="计算公式及需求范围" @click.native="stepChick(0)" />
        <el-step title="执行计算并查看结果" @click.native="stepChick(1)" />
      </el-steps>
      <div class="options" style="width:400px">
        <el-button type="primary" size="mini" @click="next" :disabled="activeStep == 1 || loading"
          v-if="activeStep == 0">执行计算 </el-button>
        <el-button size="mini" @click="prev" :disabled="activeStep <= 0" v-if="activeStep > 0">{{ $t('common.prev')
          }}</el-button>
        <el-button size="mini" type="primary" @click="dataFormSubmit()" :disabled="activeStep != maxStep"
          :loading="btnLoading">{{ $t('common.confirmButton') }}</el-button>
        <el-button size="mini" @click="closeDialog()">{{ $t('common.cancelButton') }}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <el-collapse v-model="activeNames" v-if="!activeStep" style="height: 100%;background-color: #fff;">
        <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
          <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" label-position="left">
            <el-row style="height: 100%;">
              <el-col :span="24">
                <el-form-item label="设计计算公式">
                  <el-select v-model="dataForm.gogshi" placeholder="计算公式">
                    <el-option :key="item.id" :label="item.label" :value="item.value" v-for="item in gogshiList" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="公式">
                  <el-checkbox-group v-model="dataForm.type" style="line-height: 33px;height: 33px">
                    <el-checkbox label="考虑安全库存" name="type"></el-checkbox>
                    <el-checkbox label="考虑可用库存" name="type"></el-checkbox> 
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="计算BOM级别">
                  <el-select v-model="dataForm.bomjibie" placeholder="计算BOM级别">
                    <el-option :key="item.id" :label="item.label" :value="item.value" v-for="item in BOMList" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="保存方案">
                  <el-input v-model="dataForm.fanganName"  placeholder="方案名称" style="width: auto;"
                  clearable />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="设计计算公式">
                  <el-select v-model="dataForm.gogshi" placeholder="计算公式">
                    <el-option :key="item.id" :label="item.fullName" :value="item.id" v-for="item in gogshiList" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="产品信息" name="productInfo">
        </el-collapse-item>
      </el-collapse>

      <!-- <template v-if="activeStep==1">
        <Generator ref="generator" :conf="formData" :modelType="dataForm.type"
          :webType="dataForm.webType" :dbType="dbType" />
      </template>
<template v-if="activeStep==2">
        <columnDesign ref="columnDesign" :columnData="columnData" :appColumnData="appColumnData"
          :modelType="dataForm.type" :webType="dataForm.webType" />
      </template>
<template v-if="activeStep==3">
        <Process ref="process" :conf="flowTemplateJson" :flowType="1" />
      </template> -->
    </div>
    <!-- <TableForm :visible.sync="formVisible" ref="tableForm" @closeForm="closeForm"
      :dbLinkId="dataForm.dbLinkId" /> -->
  </el-dialog>
</template>

<script>
import Generator from '@/components/Generator/index/Home'
import ColumnDesign from '@/components/ColumnDesign'
import Process from "@/components/Process"
import TableForm from '@/views/generator/TableForm'
import mixin from '@/mixins/generator/form'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: { Generator, ColumnDesign, Process, TableForm },
  data() {
    return {
      dataForm: {
        gogshi: "",
        type:[],
        bomjibie:"calcFirstBom",
        fanganName:"上一次运算方案",
      },
      gogshiList: [
        { label: "公式一", value: "1" },
        { label: "公式二", value: "2" },
        { label: "公式三", value: "3" },
      ],
      BOMList:[
        {label:"不计算BOM",value:"notCalcBom",},
        {label:"只计算1级BOM",value:"calcFirstBom",},
        {label:"计算所有子级BOM",value:"calcAllBom",},
      ],
      activeNames: ["productInfo", "basicInfo"],
      visible: false,
      loading: false,
      activeStep: 0,
      dataRule: {
        fullName: [
          { required: true, message: '功能名称不能为空', trigger: 'blur' },
        ],
        enCode: [
          { required: true, message: '功能编码不能为空', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
        ],
        category: [
          { required: true, message: '功能分类不能为空', trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    closeDialog() {

    },
    stepChick(val) {

    },
    init(data) {
      this.visible = true
    },
    next() {

    },
  }
}
</script>
<style scoped>
::v-deep .el-steps--simple {
  padding: 13px 0;
  background-color: #fff
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}


.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important
}


.drawingNo {
  color: rgb(63, 185, 248);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  margin-top: 7px
}
</style>
