<template>
  <el-dialog :visible.sync="visible" fullscreen lock-scroll class="JNPF-full-dialog"
    :show-close="false" :modal="false">
    <div class="JNPF-full-dialog-header">
      <div class="header-title">
        <el-image class="header-logo imagesClass"  :src="define.comUrl + systemVO.iconUrl" v-if="systemVO && systemVO.iconUrl">
          <template slot="error">
            <img class="header-logo" :class="headClass"  src="@/assets/images/jnpf.png"
              alt="">
          </template>
        </el-image>
        <img src="@/assets/images/jnpf.png" :class="headClass"  class="header-logo"
          v-else />
        <!-- <img src="@/assets/images/jnpf.png" class="header-logo" /> -->
        <p class="header-txt"> · 在线开发</p>
      </div>
      <el-steps :active="activeStep" finish-status="success" simple class="steps"
        :class="['steps'+(maxStep+1),editType ? 'stepsCenter' : '']"  v-if="!loading">
        <template v-if="!editType">
          <el-step title="基础设置" @click.native="stepChick(0)" />
          <el-step title="表单设计" @click.native="stepChick(1)" />
          <el-step title="列表设计" @click.native="stepChick(2)" v-if="maxStep>=2" />
          <el-step title="流程设计" @click.native="stepChick(3)" v-if="maxStep>=3" />
        </template>
        <template v-else>
          <el-step title="表单设计" @click.native="stepChick(1)" v-if="editType === 'form'" />
          <el-step title="列表设计" @click.native="stepChick(2)" v-if="editType === 'table'" />
          <el-step title="流程设计" @click.native="stepChick(3)" v-if="editType === 'flow'" />
        </template>
      </el-steps>
      <div class="options" style="width:400px">
        <el-button v-if="!editType" @click="prev" :disabled="activeStep<=0">{{$t('common.prev')}}</el-button>
        <el-button v-if="!editType" @click="next" :disabled="activeStep>=maxStep || loading">{{$t('common.next')}}
        </el-button>
        <el-button type="primary" @click="dataFormSubmit()" :disabled="activeStep!=maxStep"
          :loading="btnLoading">{{$t('common.confirmButton')}}</el-button>
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <el-row type="flex" justify="center" align="middle" v-if="!activeStep" class="basic-box">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="10" class="basicForm">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px"
            @submit.native.prevent label-position="right">
            <el-form-item label="功能名称" prop="fullName">
              <el-input v-model="dataForm.fullName" placeholder="功能名称" maxlength="100">
              </el-input>
            </el-form-item>
            <el-form-item label="功能编码" prop="enCode">
              <el-input v-model="dataForm.enCode" placeholder="功能编码" maxlength="50">
              </el-input>
            </el-form-item>
            <el-form-item label="功能分类" prop="category">
              <el-select v-model="dataForm.category" placeholder="选择分类">
                <el-option :key="item.id" :label="item.fullName" :value="item.id"
                  v-for="item in categoryList" />
              </el-select>
            </el-form-item>
            <el-form-item label="功能排序" prop="sortCode">
              <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
                controls-position="right" />
            </el-form-item>
            <el-form-item label="功能状态" prop="state">
              <el-switch v-model="dataForm.state" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="流程状态" prop="approvalFlag">
              <el-switch v-model="dataForm.approvalFlag" :active-value="true" :inactive-value="false" />
            </el-form-item>
            <el-form-item label="功能说明" prop="description">
              <el-input v-model="dataForm.description" placeholder="功能说明" type="textarea"
                :rows="3" />
            </el-form-item>
            <el-form-item label="数据连接">
              <el-select v-model="dataForm.dbLinkId" placeholder="请选择数据库" @change="onDbChange"
                clearable>
                <el-option-group v-for="group in dbOptions" :key="group.fullName"
                  :label="group.fullName">
                  <el-option v-for="item in group.children" :key="item.id" :label="item.fullName"
                    :value="item.id" />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-table :data="tables" class="JNPF-common-table"
              empty-text="点击“新增”可选择1条(单表)或2条以上(多表)，未选择数据表时系统将会自动创建数据表">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="typeId" label="类别" width="65">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.typeId=='1'">主表</el-tag>
                  <el-tag type="warning" v-else @click="changeTable(scope.row)"
                    style="cursor:pointer" title="点击设置成主表">子表</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="table" label="表名">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.tableName||scope.row.table" placement="top">
                    <span>{{scope.row.table}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="tableField" label="外键字段">
                <template slot-scope="scope" v-if="scope.row.typeId !=='1'">
                  <el-select v-model="scope.row.tableField" placeholder="请选择">
                    <el-option v-for="item in scope.row.fields" :key="item.field"
                      :label="item.field" :value="item.field">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="relationTable" label="关联主表" /> -->
              <el-table-column prop="relationField" label="关联主键">
                <template slot-scope="scope" v-if="scope.row.typeId !=='1'">
                  <el-select v-model="scope.row.relationField" placeholder="请选择">
                    <el-option v-for="item in mainTableFields" :key="item.field" :label="item.field"
                      :value="item.field">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="60">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" class="JNPF-table-delBtn"
                    @click="delItem(scope.row,scope.$index)">移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="openTableBox">
              <el-button type="text" icon="el-icon-plus">新增一行</el-button>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <template v-if="activeStep==1">
        <Generator v-if="!editType" ref="generator" :conf="formData" :modelType="dataForm.type"
          :webType="dataForm.webType" :dbType="dbType" />
        <Generator v-if="editType && formData" ref="generator" :conf="formData" :modelType="dataForm.type"
          :webType="dataForm.webType" :dbType="dbType" />
      </template>
      <template v-if="activeStep==2">
        <columnDesign v-if="!editType" ref="columnDesign" :columnData="columnData" :appColumnData="appColumnData"
          :modelType="dataForm.type" :webType="dataForm.webType" />
        <columnDesign v-if="editType && columnData" ref="columnDesign" :columnData="columnData" :appColumnData="appColumnData"
          :modelType="dataForm.type" :webType="dataForm.webType" />
      </template>
      <template v-if="activeStep==3">
        <Process v-if="!editType" ref="process" :conf="flowTemplateJson" :flowType="1" />
        <Process v-if="editType && flowTemplateJson" ref="process" :conf="flowTemplateJson" :flowType="1" />
      </template>
    </div>
    <TableForm :visible.sync="formVisible" ref="tableForm" @closeForm="closeForm"
      :dbLinkId="dataForm.dbLinkId" />
  </el-dialog>
</template>

<script>
import Generator from './components/Generator/index/Home'
import ColumnDesign from './components/ColumnDesign'
import Process from "@/components/Process"
import TableForm from '@/views/generator/TableForm'
import mixin from './mixins/generator/form'
import { mapState } from 'vuex'
import { checkCode , detailVisualDevInfo } from '@/api/system/system'
export default {
  mixins: [mixin],
  components: { Generator, ColumnDesign, Process, TableForm },
  data() {
    return {
      dataRule: {
        fullName: [
          { required: true, message: '功能名称不能为空', trigger: 'blur' },
        ],
        enCode: [
          { required: true, message: '功能编码不能为空', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
              checkCode(this.dataForm.enCode,this.dataForm.id).then(res => {
                if (res.data) {
                  callback(new Error("编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {})
            }, trigger: 'blur'
          },
        ],
        category: [
          { required: true, message: '功能分类不能为空', trigger: 'change' },
        ]
      }
    }
  },
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
    }),
    sysConfig() {
      return this.$store.state.settings.sysConfig
    },
    systemVO() {
      return this.$store.state.settings.systemVO
    },
  },
}
</script>
<style lang="scss" scoped>
  .stepsCenter{
    justify-content: center;
  }
</style>
