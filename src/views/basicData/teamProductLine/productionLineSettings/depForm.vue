<template>
  <el-dialog :title="!dataForm.id ? '新建产线' : '编辑产线'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">
      <el-form-item label="产线编码" prop="code">
        <el-input v-model.trim="dataForm.code" placeholder="请输入产线编码" maxlength="20"
          :disabled="btntype ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false" />
      </el-form-item>
      <el-form-item label="产线名称" prop="name">
        <el-input v-model.trim="dataForm.name" placeholder="请输入产线名称" maxlength="20"
          :disabled="btntype ? true : false" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="dataForm.state" placeholder="请选择状态" style="width: 100%;" :disabled="btntype ? true : false">
          <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" :disabled="btntype ? true : false"
          placeholder="请输入备注" />
      </el-form-item>
      <!-- 关联工位 -->
      <el-col :span="24">
        <el-form-item label-width="0">
          <el-table :data="dataFormTwo" size="mini" height="200" id="table">
            <el-table-column type="index" width="60" label="序号" align="center" />
            <el-table-column prop="workstationIdCode" label="工位编码">
              <template slot-scope="{ row }">
                <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                  <el-form-item prop="workstationIdCode" :style="row.cssObj" ref="workstationIdCode">
                    <el-input disabled v-model="row.workstationIdCode" placeholder="工位编码" clearable
                      maxlength="20"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="workstationIdName" label="工位名称">
              <template slot="header">
                <span class="required">*</span>
                工位名称
              </template>
              <template slot-scope="{ row }">
                <el-form :ref="`tableForm_${row.index}`" :model="row" :rules="rulesTwo">
                  <el-form-item prop="workstationIdName" :style="row.cssObj" ref="targetName">
                    <!-- <ComSelect3 v-model="dataForm.targetName" :isdisabled="btntype" placeholder="请选择项目名称" auth
                        @change="onOrganizeChange" :currOrgId="dataForm.id" :type="dataForm.type"
                        :classAttribute="dataForm.classAttribute" /> -->

                    <!-- ComSelect-list 用法 title弹出窗口标题 method数据请求方法 requestObj请求对象 param其他参数(会跟随@change一起返回) -->
                    <ComSelectInspection v-model="row.workstationIdName" placeholder="请选择工位名称" auth
                      @change="onOrganizeChangeTwo" :title="'选择工位名称'" :method="bimWorkstationList"
                      :requestObj="requestObj"
                      :paramsObj="{ row, oldVal: { name: row.workstationIdName || '', id: row.workstationId || '' } }" />
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="deltable(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-actions" @click="addtable()">
            <el-button type="text" icon="el-icon-plus">添加</el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addProductionLineData,
  editProductionLineData,
  getProductionLineInfo,
  checkProductionLineCode,
  bimWorkstationList,
  checkBimWorkstationCode
} from '@/api/basicData/index'
import ComSelectInspection from './ComSelectInspection'
export default {
  components: {
    ComSelectInspection
  },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      stateList: [
        {
          label: '启用',
          value: 'enable'
        },
        {
          label: '停用',
          value: 'disabled'
        }
      ],
      dataForm: {
        remark: '',
        code: '',
        name: '',
        state: '',
        id: '',
        productionLine: {
          remark: '',
          code: '',
          name: '',
          state: '',
          id: ''
        },
        relationList: [
          {
            productionLineId: '',
            workstationId: ''
          }
        ]
      },
      bimWorkstationList,
      dataFormTwo: [],
      requestObj: {
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: -1,
        type: '',
        state: 'enable'
      },
      rulesTwo: {
        code: [
          {
            required: true,
            message: '请输入工位编码',
            trigger: ['blur']
          },
          {
            validator: (rule, value, callback) => {
              checkBimWorkstationCode(value, this.dataForm.id)
                .then((res) => {
                  if (res.data) {
                    callback(new Error('工位编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        targetName: [
          {
            required: true,
            message: '请选择工位名称',
            trigger: ['change']
          }
        ],
        workstationIdName: [
          {
            required: true,
            message: '请选择工位名称',
            trigger: ['change']
          }
        ]
      },
      btntype: false,
      codeConfig: {},
      dataRule: {
        code: [
          { required: true, message: '请输入产线编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              checkProductionLineCode(value, this.dataForm.id)
                .then((res) => {
                  if (res.data) {
                    callback(new Error('产线编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        name: [{ required: true, message: '请输入产线名称', trigger: 'blur' }],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  created() { },
  methods: {
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
      } catch (error) { }
    },
    // 选择工位弹框
    onOrganizeChangeTwo(val, data, param) {
      if (!data) return

      if (data.length == 0) {
        this.$refs['tableForm_' + param.row.index].validateField('workstationIdName')

        this.dataFormTwo[param.row.index].workstationIdName = ''
        this.dataFormTwo[param.row.index].workstationId = ''
        this.dataFormTwo[param.row.index].workstationIdCode = ''
      } else {
        this.$refs['tableForm_' + param.row.index].resetFields()
        this.dataFormTwo[param.row.index].workstationIdName = data[0].name
        this.dataFormTwo[param.row.index].workstationId = data[0].id
        this.dataFormTwo[param.row.index].workstationIdCode = data[0].all.code

        // 重新校验指定选择框，其他内容不做操作
        this.$nextTick(() => {
          // 重新校验指定选择框，其他内容不做操作

          const codeOneItems = this.dataFormTwo.filter((item) => item.workstationIdName === data[0].name)
          const hasCodeOneMoreThanOnce = codeOneItems.length >= 2
          if (hasCodeOneMoreThanOnce) {
            this.$message.error('当前选择的工位已经存在了')
            this.dataFormTwo[param.row.index].workstationIdName = param.oldVal.id
            this.dataFormTwo[param.row.index].workstationId = param.oldVal.name
            this.dataFormTwo[param.row.index].workstationIdCode = ''
          }
        })
      }
    },
    // 添加和删除
    addtable() {
      let ind = this.dataFormTwo.length
      let item = {
        index: ind,
        name: '',
        workstationId: this.dataForm.workstationId,
        workstationIdCode: '',
        workstationIdName: '',
        targetUnitCode: '',
        cssObj: {}
      }
      this.dataFormTwo.push(item)
    },
    deltable(index) {
      this.dataFormTwo.splice(index, 1)
    },
    init(id, type) {
      this.visible = true
      this.dataForm.id = id || ''
      if (type == 'edit' || type == 'add') {
        this.btntype = false
      } else if (type == 'look') {
        this.btntype = true
      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.fetchData('bm_sc_cx', false)
          getProductionLineInfo(this.dataForm.id).then((res) => {
            this.dataForm = res.data.productionLine
            // this.formLoading = false
            this.dataFormTwo = res.data.returnList

            this.formLoading = false
            let ind = 0
            this.dataFormTwo.forEach((item) => {
              item.index = ind++
            })
            this.loading = false
          })
        } else {
          this.fetchData('bm_sc_cx', true)
          this.formLoading = false
          this.dataFormTwo = []
        }
      })
    },
    dataFormSubmit() {
      let queryData = {
        productionLine: {
          code: this.dataForm.code,
          name: this.dataForm.name,
          state: this.dataForm.state,
          id: this.dataForm.id
        },
        relationList: this.dataFormTwo
      }
      let msg = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataFormTwo.length === 0) {
            this.$message({
              type: 'error',
              message: `请至少选择一个工位`,
              duration: 1500
            })
          } else {
            this.dataFormTwo.forEach((item, index) => {
              if (item.workstationIdName === '') {
                msg = false
                this.$message({
                  type: 'error',
                  message: `工位:第${index + 1}条工位不能为空`,
                  duration: 1500
                })
              }
            })
            if (msg) {
              this.btnLoading = true
              let formMethod = this.dataForm.id ? editProductionLineData : addProductionLineData

              formMethod(queryData)
                .then((res) => {
                  let msg = ''
                  if (formMethod == editProductionLineData) {
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
                })
                .catch(() => {
                  this.btnLoading = false
                })
            }
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
