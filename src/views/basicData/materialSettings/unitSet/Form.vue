<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px" @close="$emit('refresh')">
    <el-row :gutter="15" class="" v-loading="loading">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
        <template>
          <el-col :span="12">
            <el-form-item label="单位编码" prop="unitCode" ref="unitCode">
              <el-input v-model="dataForm.unitCode" placeholder="请输入单位编码" clearable :style='{ "width": "100%" }'
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="name" ref="name">
              <el-input v-model="dataForm.name" placeholder="请输入单位名称" clearable :style='{ "width": "100%" }'
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入备注" :style='{ "width": "100%" }'
                maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">

              <JNPF-col-table v-model="dataFormTwo" ref="tableForm" :tableItems="tableFormItem" :openMode="openMode"
                @addth="addequipment_process_relList" @deleteth="delequipment_process_relList" />

            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('refresh')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">{{ $t('common.submitButton')
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addUnitData, updateUnitData, detailUnitData, getEffectUnitList, checkUnitCodeExist } from '@/api/basicData/materialSettings'

export default {
  components: {},
  props: [],
  data() {
    return {
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      autoUnitCode: undefined,
      dataForm: {
        id: 0,
        unitCode: "",
        name: "",
        remark: "",
      },
      dataFormTwo: [],
      tableFormItem: [
        {
          prop: "ratio", label: "转换系数", value: "", type: "input",
          itemRules: [
            { required: true, trigger: "blur" }, 
            { validator: this.formValidate({ type: 'decimal', params: [10, 6, false, (errMsg) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' }
          ]
        },
        { prop: "targetName", label: "转换后单位名称", value: "", type: "select", options: [], itemRules: [{ required: true, trigger: "change" }] },
      ],
      tableFormQuery: {
        pageSize: -1,
        pageNum: 1,
      },
      rules: {
        name: [{
          required: true,
          message: '请输入单位名称',
          trigger: ['blur']
        }],
        unitCode: [{
          required: true,
          message: '请输入单位编码',
          trigger: ['blur']
        }, {
          validator: this.formValidate('enCode'),
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (!value) { callback() }
            else if (this.dataForm.unitCode === this.autoUnitCode) { callback() }
            else {
              checkUnitCodeExist(this.dataForm.unitCode).then((res) => {
                if (!res.data) { callback() }
                else { callback(new Error('此单位编码已存在')) }
              })
            }
          },
          trigger: 'blur'
        }]
      },
      unitList: []
    }
  },
  computed: {
    openMode() {
      return this.dialogTitle === '新建常用单位' ? '新建' : this.dialogTitle === '编辑常用单位' ? '编辑' : '只读'
    }
  },
  created() {
    this.getUnitList()
    this.tableFormItem.forEach(async item => {
      if (item.prop === 'targetName') {
        let tempOptions = (await getEffectUnitList()).data
        tempOptions.forEach(o => { o.label = o.name; o.value = o.unitCode })
        item.options = tempOptions
      }
    })
  },
  methods: {
    async getUnitList() {
      let tempOptions = (await getEffectUnitList()).data
      tempOptions.forEach(o => { o.label = o.name; o.value = o.unitCode })
      this.unitList = tempOptions
    },
    clearData() {
      this.dataForm.id = "";
      this.dataForm.name = '';
      this.dataForm.remark = '';
      this.dataForm.unitCode = '';

      this.dataFormTwo = [];
    },
    init(rowData) {
      rowData = JSON.parse(rowData);
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = Object.keys(rowData).length ? rowData.id : 0;
      this.visible = true;
      this.dialogTitle = !this.dataForm.id ? '新建常用单位' : `编辑常用单位`
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          this.dataForm = rowData
          this.autoUnitCode = rowData.unitCode
          // 获取当前项对应关系
          detailUnitData({ id: rowData.id, ...this.tableFormQuery }).then(res => {
            this.dataFormTwo = res.data.records
            let ind = 0
            this.dataFormTwo.forEach(item => {
              item.index = ind++
            })
            this.loading = false
          })
        }
      });
    },
    // 表单提交
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否已经使用过

      // 校验基本信息
      const form_1 = this.$refs['elForm']
      const valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        // 聚焦第一个失败的表单元素
        let formItems = form_1.fields
        for (let j = 0; j < formItems.length; j++) {
          let formItem = formItems[j]
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            break
          }
        }
      }
      // 校验表格表单
      const form_2 = this.$refs['tableForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        let formItems = form_2.fields
        for (let j = 0; j < formItems.length; j++) {
          let formItem = formItems[j]
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            break
          }
        }
      }
      if (submitFlag) {
        let _data = {
          bimUnit: JSON.parse(JSON.stringify(this.dataForm)),
          bimUnitRelList: JSON.parse(JSON.stringify(this.dataFormTwo))
        }
        _data.bimUnitRelList.forEach(item => {
          item.sourceUnitCode = _data.bimUnit.unitCode
          item.sourceName = _data.bimUnit.name
          item.targetUnitCode = item.targetName
        })
        // console.log(_data)
        // this.btnLoading = false
        // return
        let queryMehtod = this.dataForm.id ? updateUnitData : addUnitData
        queryMehtod(_data).then(res => {
          this.$emit('refresh', true)
          this.$message.success(this.dataForm.id ? '修改成功' : '新建成功')
        }).catch(err => {
          this.btnLoading = false
        })
      } else { this.btnLoading = false }
    },
    // 添加项
    addequipment_process_relList() {
      let ind = this.dataFormTwo.length
      let item = {
        index: ind,
        ratio: "",
        targetUnitCode: "",
        targetName: ""
      }
      this.dataFormTwo.push(item)
    },
    // 删除项
    delequipment_process_relList(scope) {
      let index = scope.$index
      this.dataFormTwo.splice(index, 1);
    }
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>