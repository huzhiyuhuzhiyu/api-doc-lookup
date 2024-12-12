<template>
  <el-drawer :title="!dataForm.id ? '新建单据' : '编辑单据'" :visible.sync="drawer" :wrapperClosable="false" ref="drawer" append-to-body
    size="420px" class="JNPF-common-drawer columnSettings-drawer">
    <div class="JNPF-flex-main">
      <el-scrollbar class="column-list" v-loading="loading">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="formLoading" label-width="100px">
          <el-form-item label="业务名称" prop="fullName">
            <el-input v-model="dataForm.fullName" placeholder="输入名称" />
          </el-form-item>
          <el-form-item label="业务编码" prop="enCode">
            <el-input v-model="dataForm.enCode" placeholder="业务编码" />
          </el-form-item>
          <el-form-item label="业务分类" prop="category">
            <el-select v-model="dataForm.category" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in categoryList" :label="item.fullName" :value="item.id" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="生成方式" prop="codeWay">
            <el-select v-model="dataForm.codeWay" placeholder="请选择">
              <el-option label="自动生成" value="auto" />
              <el-option label="手动输入" value="input" />
            </el-select>
          </el-form-item>
          <el-form-item label="允许修改" prop="modifyFlag" v-if="dataForm.codeWay == 'auto'">
            <el-switch v-model="dataForm.modifyFlag" :active-value="true" :inactive-value="false" />
          </el-form-item>
          <el-form-item label="流水前辍" prop="prefix" v-if="dataForm.codeWay == 'auto'">
            <el-input v-model="dataForm.prefix" placeholder="输入前缀" @keyup.native="handleChange" />
          </el-form-item>
          <el-form-item label="流水日期" prop="dateFormat" v-if="dataForm.codeWay == 'auto'">
            <el-select v-model="dataForm.dateFormat" placeholder="请选择" clearable @change="handleChange">
              <el-option label="yyyymmdd" value="yyyyMMdd" />
              <el-option label="yyyymm" value="yyyyMM" />
              <el-option label="yyyy" value="yyyy" />
              <el-option label="no" value="no" />
            </el-select>
          </el-form-item>
          <el-form-item label="流水位数" prop="digit" v-if="dataForm.codeWay == 'auto'">
            <el-input v-model.number="dataForm.digit" maxlength="1" placeholder="流水位数" @keyup.native="handleChange" />
          </el-form-item>
          <el-form-item label="流水起始" prop="startNumber" v-if="dataForm.codeWay == 'auto'">
            <el-input v-model="dataForm.startNumber" placeholder="不允许输入0或特殊字符" @keyup.native="handleChange" />
          </el-form-item>
          <el-form-item label="流水范例" prop="example" v-if="dataForm.codeWay == 'auto'">
            <el-input v-model="dataForm.example" disabled />
          </el-form-item>
          <!-- <el-form-item label="排序" prop="sortCode">
        <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode"
          controls-position="right" />
      </el-form-item> -->
          <el-form-item label="状态" prop="enabledMark">
            <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input v-model="dataForm.description" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="footer">
        <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          {{ $t('common.confirmButton') }}</el-button>
      </div>
      
    </div>
  </el-drawer>
</template>
<script>
import {
  getBillRuleInfo,
  createBillRule,
  updateBillRule
} from '@/api/system/billRule'
import dayjs from 'dayjs'

export default {

  data() {
    var validateZero = (rule, value, callback) => {
      let str = value.replace(/0/g, '')
      if (!str) callback(new Error(`流水起始不能为${value}`));
      callback()
    };
    return {

      drawer: false,

      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        fullName: '',
        enCode: '',
        prefix: '',
        dateFormat: '',
        digit: '',
        startNumber: '',
        example: '',
        sortCode: 0,
        enabledMark: 1,
        description: '',
        category: '',
        codeWay: "auto",
        modifyFlag: true
      },
      categoryList: [],
      dataRule: {
        fullName: [
          { required: true, message: '请输入业务名称', trigger: 'blur' },
          { max: 50, message: '业务名称最多为50个字符！', trigger: 'blur' }
        ],
        enCode: [
          { required: true, message: '请输入业务编码', trigger: 'blur' },
          { max: 50, message: '业务编码最多为50个字符！', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择业务分类', trigger: 'change' },
        ],
        codeWay: [
          { required: true, message: '请选择生成方式', trigger: 'change' },
        ],
        modifyFlag: [
          { required: true, message: '请选择是否允许修改', trigger: 'change' },
        ],
        prefix: [
          { required: true, message: '请输入流水前缀', trigger: 'blur' }
        ],
        dateFormat: [
          { required: true, message: '请输入选择流水日期格式', trigger: 'change' }
        ],
        digit: [
          { required: true, message: '请输入流水位数', trigger: 'blur' },
          { type: 'number', message: '仅能输入正整数' },
          { pattern: /^[1-9]\d*$/, message: '仅能输入正整数' }
        ],
        startNumber: [
          { required: true, message: '只能输入数字', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' },
          { validator: validateZero }
        ]
      }


    }
  },
  methods: {

    // , this.treeData,this.listQuery.categoryId,this.tableList
    init(id, categoryList, categoryId, tableList) {
      this.drawer = true
      this.dataForm.id = id || ''
      this.dataForm.category = categoryId || ''
      this.categoryList = categoryList
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getBillRuleInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data

          })
        } else {
          this.dataForm = {
            fullName: '',
            enCode: '',
            prefix: '',
            dateFormat: '',
            digit: '',
            startNumber: '',
            example: '',
            sortCode: 0,
            enabledMark: 1,
            id: id || '',
            description: '',
            category: categoryId || '',
            codeWay: "auto",
            modifyFlag: false
          },
            this.formLoading = false
          this.dataForm.sortCode = tableList.length
        }
      })
      this.formLoading = false
    },
    handleChange() {
      // 流水前缀
      const prefix = this.dataForm.prefix

      // 流水日期格式
      const dateFormat = this.dataForm.dateFormat
      let dateVal = ''
      if (dateFormat && dateFormat !== 'no') {
        dateVal = dayjs().format(dateFormat.toUpperCase())
      }
      // 流水位数
      let digitVal = this.dataForm.digit
      if (digitVal != "") digitVal = Array(digitVal > 0 ? (digitVal - ('' + 0).length + 1) : 0).join('0') + 0

      // 流水起始
      const startNumber = this.dataForm.startNumber
      let startNumberVal = ''
      if (startNumber != "") {
        startNumberVal = (digitVal + startNumber)
        digitVal = startNumberVal.substring(startNumberVal.length - digitVal.length, startNumberVal.length)
        this.dataForm.startNumber = digitVal
      }
      // 流水范例
      this.dataForm.example = prefix + dateVal + digitVal
    },
    dataFormSubmit() {
      if (this.dataForm.codeWay === 'input') {
        this.dataForm.modifyFlag = true
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateBillRule : createBillRule
          if (this.codeWaySwitch == 1) {
            this.codeWay = 'auto_modify'
          }
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
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
<style scoped>
.JNPF-common-drawer ::v-deep .el-drawer__header {
  font-size: 18px
}

.JNPF-flex-main {
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.JNPF-common-drawer .JNPF-flex-main {
  height: calc(100vh - 60px);
}

.dialog-footer {
  padding-left: 20px;
  text-align: right
}

.JNPF-common-drawer ::v-deep .el-drawer__body {
  overflow: auto !important;
}
</style>
<style lang="scss" scoped>
$lighterBlue: #1890ff;

.columnSettings-drawer {
  .JNPF-flex-main {
    overflow: hidden;
  }

  .columnSetting-head {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 24px 0;
    font-size: 14px;
    color: #303133;
  }

  .column-list {
    height: 100%;
    padding: 8px 10px 0;

    .column-item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      font-size: 12px;
      color: #303133;
      cursor: pointer;
      border-bottom: 1px solid #e3e6eb;

      &:hover {
        background: rgba(25, 144, 250, 0.1);
      }


      .column-item-left,
      .column-item-right {
        display: flex;

        &.active {
          color: $lighterBlue;
        }

        .line {
          position: relative;
          top: -.06em;
          display: inline-block;
          height: 1.6em;
          margin: 0 8px;
          vertical-align: middle;
          border-top: 0;
          border-left: 1px solid rgba(0, 0, 0, .06);
        }
      }

      .column-item-icon {
        margin: auto 8px auto 10px;
        color: #909399;
        cursor: move;
        font-size: 14px;
      }

      .el-switch {
        transform: scale(0.8);
      }

      .column-item-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        display: flex;
        align-items: center;
      }

      .check-box {
        margin-right: 16px;
      }
    }
  }

  .footer {
    margin: 4px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

  .system-icon {
    &.active {
      color: $lighterBlue;
    }

    &:hover {
      color: $lighterBlue;
    }
  }

}
</style>