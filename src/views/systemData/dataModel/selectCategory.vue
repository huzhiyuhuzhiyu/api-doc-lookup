<template>
  <el-dialog title="选择分类" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">

    <el-row :gutter="20">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-width="120px"
        label-position="top">

        <!-- <el-col :span="24">
          <el-form-item label="账户" prop="account">
            <el-input v-model="dataForm.account" placeholder="账户" disabled />
          </el-form-item>
        </el-col> -->
        <el-col :sm="24" :xs="24">
          <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="dataForm.categoryId" placeholder="请选择所属分类" clearable>
              <el-option v-for="item in categoryList" :key="item.id" :label="item.fullName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.confirmButton') }}</el-button>
    </span>
  </el-dialog>
</template>

<script> 
import md5 from 'js-md5'
import { 
  getbimProductAttributes,batchSetCategory
} from "@/api/masterDataManagement/index";
export default {
  data() {

    return {
      categoryList: [],
      btntype: '',
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm2: {
        idList: [],
      },
      dataForm: {
        categoryId: '',
      },
      list: [],
      dataRule: {

        categoryId: [
          { required: true, message: '所属分类不能为空', trigger: 'change' }
        ]
        // salespersonId: [
        //   { required: true, message: '所属销售不能为空', trigger: 'change' }
        // ],
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.formLoading = true
      this.list = data
      this.$nextTick(() => {

          getbimProductAttributes('306427078100678661').then(res => {
            this.categoryList = res.data.list.length ? res.data.list : []
            this.formLoading=false

          }).catch(() => {
            this.formLoading=false
          })
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let arr=[]
          this.list.forEach(item => {
            let obj={
              tableName:item.enName,
              categoryId:this.dataForm.categoryId
            }
            arr.push(obj)
          });
          console.log("arr",arr);
          this.btnLoading = false
          
          batchSetCategory(arr).then(res => {
            this.$message({
              message: '批量设置分类成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
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
