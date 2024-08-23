<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btntype ? 'noButtons' : '']">
        <el-page-header @back="handleClose" :content="!dataForm.id ? '新建检验项目' : btntype ? '查看检验项目' : '编辑检验项目'" />
        <div class="options" v-if="!btntype">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            保存并提交</el-button>
          <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div style="height: 28vh;padding: 10px;">
        <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
          label-width="120px">
          <el-row :gutter="30">
            <el-col :span="12">

              <el-form-item label="所属分类" prop="categoryIdText">
                <ComSelectInspection :isdisabled="btntype ? true : false" v-model="dataForm.categoryIdText"
                  placeholder="请选择所属分类" auth @change="onOrganizeChangeTwo" :title="'选择所属分类'" :method="getCategoryTrees"
                  :requestObj="requestObj" :paramsObj="{}" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检验项目名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入检验项目名称" maxlength="50"
                  :disabled="btntype ? true : false" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编码" prop="code">
                <el-input v-model="dataForm.code" placeholder="请输入项目编码" maxlength="20"
                  :disabled="btntype ? true : false" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检验方式" prop="inspectionMethod">
                <el-select v-model="dataForm.inspectionMethod" placeholder="请选择检验方式" style="width: 100%;"
                  :disabled="btntype ? true : false" @change="hangleWay">
                  <el-option v-for="(item, index) in wayList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检验工具" prop="equipmentId">
                <!-- <el-select v-model="dataForm.inspectionTools" placeholder="请选择检验方式" style="width: 100%;"
              :disabled="btntype ? true : false" @change="hangleWay">
              <el-option v-for="(item, index) in allEqu" :key="index" :label="item.name" :value="item.name"></el-option>
            </el-select> -->
                <!-- <ComSelect-list :isdisabled="btntype ? true : false" v-model="dataForm.inspectionTools" placeholder="请选择检验工具"
              auth @change="onOrganizeChange" :title="'选择检验工具'" :method="getCategoryTrees" :requestObj="requestObjTwo"
              :paramsObj="{}" /> -->
                <ComSelectInspection :isdisabled="btntype ? true : false" v-model="dataForm.equipmentName"
                  placeholder="请选择检验工具" auth @change="onOrganizeChange" :title="'选择检验工具'" :method="getEquEquipmentList"
                  :requestObj="requestObjTwo" :paramsObj="{}" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="dataForm.inspectionMethod == 'other'">
              <el-form-item label="检验要求" prop="inspectionBasis">
                <el-input v-model="dataForm.inspectionBasis" placeholder="请输入检验要求" maxlength="200"
                  :disabled="btntype ? true : false" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="dataForm.inspectionMethod == 'measure'">
              <el-form-item label="正常值" prop="normalValue">
                <!-- /^[^\u4e00-\u9fa5\uF900-\uFA2D\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\.?[0-9]*$/ -->
                <el-input v-model="dataForm.normalValue"
                  oninput="value = value.replace(/[^\w\s.]|[\u4E00-\u9FA5]/g, '')" maxlength="20" placeholder="请输入正常值"
                  :disabled="btntype ? true : false" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="dataForm.inspectionMethod == 'measure'">
              <el-form-item label="最低值" prop="minimum">
                <el-input v-model="dataForm.minimum" maxlength="20"
                  oninput="value = value.replace(/[^\w\s.]|[\u4E00-\u9FA5]/g, '')" placeholder="请输入最低值"
                  :disabled="btntype ? true : false" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="dataForm.inspectionMethod == 'measure'">
              <el-form-item label="最高值" prop="maximum">
                <el-input v-model="dataForm.maximum" maxlength="20"
                  oninput="value = value.replace(/[^\w\s.]|[\u4E00-\u9FA5]/g, '')" placeholder="请输入最高值"
                  :disabled="btntype ? true : false" />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </div>
    </div>
  </transition>
</template>

<script>
import { getBimInspectionItemsInfo, editBimInspectionItemsData, addBimInspectionItemsData, getCategoryTrees, getEquEquipmentList, checkBimInspectionItemsCode } from "@/api/basicData/index";
import formValidate from "@/utils/formValidate";
import ComSelectInspection from "./ComSelectInspection"
export default {
  components: {
    ComSelectInspection
  },
  data() {
    return {
      getEquEquipmentList,
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      parentId: '',
      wayList: [{
        label: "测量",
        value: "measure"
      }, {
        label: "其他",
        value: "other"
      }],
      requestObj: {
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: -1,
        classAttribute: 'inspection_items',
      },
      requestObjTwo: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 999,
        classAttribute: 'inspect',
      },
      dataForm: {
        code: "",
        name: "",
        normalValue: "",
        minimum: "",
        maximum: "",
        inspectionBasis: "",
        productCategoryId: "",
        categoryIdText: "",
        id: '',
        inspectionMethod: '',
        equipmentName: '',
        equipmentId: ''
      },
      categoryIdProps: {
        'label': 'name',
        'value': 'id',
        'children': 'childrenList'
      },
      allEqu: [],
      categoryIdOptions: [],
      getCategoryTrees,
      btntype: false,
      isdisabled: false,
      dataRule: {
        name: [
          { required: true, message: '请输入检验项目名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入项目编码', trigger: 'blur' },
          { validator: formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkBimInspectionItemsCode(value, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("项目编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        inspectionMethod: [
          { required: true, message: '检验方式不能为空', trigger: 'change' },
        ],
        // unitVolume: [{ validator: this.formValidate({ type: 'decimal', params: [10, 2, '请输入正确的体积(最多保留2位小数)'] }), trigger: 'blur' }],

        // minimum: [{
        //   required: true, message: '请输入最低值', trigger: 'blur'
        // }, { validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        // maximum: [{
        //   required: true, message: '请输入最高值', trigger: 'blur'
        // }, { validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        // normalValue: [{
        //   required: true, message: '请输入正常值', trigger: 'blur'
        // }, { validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
      },
    }
  },
  created() {
  },
  methods: {
    hangleWay(e) {
      console.log(e);
      // this.dataForm.inspectionMethod = e
      if (e == "measure") {
        this.dataForm.according = ""
        this.dataForm.inspectionBasis = ''

      } else {
        this.dataForm.normalVal = ""
        this.dataForm.minVal = ""
        this.dataForm.maxVal = ""
      }
    },
    onOrganizeChange(val, data, param) {
      if (!data) return
      console.log(data);
      if (data.length == 0) {
        this.dataForm.equipmentName = ''
        this.dataForm.equipmentId = ''
      } else {
        this.dataForm.equipmentName = data[0].name
        this.dataForm.equipmentId = data[0].id
      }
    },
    onOrganizeChangeTwo(val, data, param) {
      if (!data) return
      console.log(data, '数据数据');
      if (data.length == 0) {
        this.dataForm.productCategoryId = ''
        this.dataForm.categoryIdText = ''
        this.dataForm.productCategoryIdText = ''
      } else {
        this.dataForm.productCategoryId = data[0].id
        this.dataForm.categoryIdText = data[0].name
      }
    },

    handleClose() {
      this.$emit('close')
    },
    init(id, type) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.normalValue = ''
      this.dataForm.minimum = ''
      this.dataForm.maximum = ''
      this.dataForm.productCategoryId = ''
      this.dataForm.inspectionMethod = ''
      this.dataForm.inspectionBasis = ''
      this.dataForm.categoryIdText = ''
      if (type == "edit" || type == 'add') {
        this.btntype = false
        if (type == "edit") {
          getBimInspectionItemsInfo(this.dataForm.id).then(res => {
            this.$nextTick(() => {
              this.dataForm.inspectionMethod = res.data.inspectionMethod
              this.dataForm = res.data
              if (res.data.productCategoryIdText) {
                this.dataForm.categoryIdText = res.data.productCategoryIdText
              }
              if (this.dataForm.inspectionMethod === 'other') {
                this.dataForm.normalValue = ''
                this.dataForm.minimum = ''
                this.dataForm.maximum = ''
              } else {
                this.dataForm.inspectionBasis = ''
              }
            })
          })
        }
        this.isdisabled = false
      } else if (type == "look") {
        getBimInspectionItemsInfo(this.dataForm.id).then(res => {
          console.log(res);
          this.$nextTick(() => {
            this.dataForm.inspectionMethod = res.data.inspectionMethod
            this.dataForm = res.data
            if (res.data.productCategoryIdText) {
              this.dataForm.categoryIdText = res.data.productCategoryIdText
            }
            if (this.dataForm.inspectionMethod === 'other') {
              this.dataForm.normalValue = ''
              this.dataForm.minimum = ''
              this.dataForm.maximum = ''
            } else {
              this.dataForm.inspectionBasis = ''
            }
          })
        })
        this.btntype = true
        this.isdisabled = true
      }
      this.organizeIdTree = []
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {

        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.productCategoryIdText = ''
          this.btnLoading = true;
          if (this.dataForm.inspectionMethod === 'other') {
            this.dataForm.normalValue = ''
            this.dataForm.minimum = ''
            this.dataForm.maximum = ''
          }
          let formMethod = this.dataForm.id ? editBimInspectionItemsData : addBimInspectionItemsData;

          formMethod(this.dataForm).then(res => {
            console.log(666, res);

            let msg = ""
            if (formMethod == editBimInspectionItemsData) {
              msg = '修改成功'
            } else {
              msg = '新建成功'
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped></style>
