<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px" @close="onClose">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="业务名称" prop="tempValue" ref="tempValue">
              <el-input :value="'产品'" placeholder="请输入业务名称" clearable :style='{ "width": "100%" }' maxlength="20"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="classAttribute" ref="classAttribute">
              <el-select v-model="dataForm.classAttribute" placeholder="请选择类型">
                <el-option v-for="item in businessOptions" :key="item.enCode" :label="item.fullName"
                  :value="item.enCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分类" prop="businessCategoryText" ref="businessCategoryText">
              <ComSelect-list v-model="dataForm.businessCategoryText" placeholder="请选择所属分类" auth
                @change="onOrganizeChange" :title="'选择所属分类'" :method="getcategoryTree"
                :requestObj="{ classAttribute: dataForm.classAttribute }" />
              <el-select value="" v-show="!dataForm.classAttribute"
                :style='{ "width": "100%", "opacity": 0, "position": "absolute", "top": 0, "left": 0 }'
                @visible-change="visibleChange('businessCategoryText')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编排编码" prop="code" ref="code">
              <el-input v-model="dataForm.code" placeholder="请输入编排编码" clearable :style='{ "width": "100%" }'
                maxlength="20" @focus="visibleChange('code')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编排名称" prop="name" ref="name">
              <el-input v-model="dataForm.name" placeholder="请输入编排名称" clearable :style='{ "width": "100%" }'
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-table :data="dataFormTwo" size='mini' height="200" id="table" :cell-style="{ 'textAlign': 'center' }">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column prop="name" min-width="130">
                  <template slot="header"> <span class="required">*</span>属性</template>
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="name" ref="name">
                        <!-- ComSelect-list 用法 title弹出窗口标题 method数据请求方法 requestObj请求对象 param其他参数(会跟随@change一起返回) -->
                        <ComSelect-list v-model="row.name" placeholder="请选择属性" auth @change="onOrganizeChangeTwo"
                          :title="'选择属性'" :method="getattribute" :requestObj="requestObj"
                          :paramsObj="{ row, oldVal: { code: row.code || '', name: row.name || '' } }" />
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="requiredFlag" label="必填" width="63" align="center">
                  <template slot-scope="{row}">
                    <el-form :model="row">
                      <el-form-item prop="requiredFlag">
                        <el-checkbox v-model="row.requiredFlag"></el-checkbox>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="selectFlag" label="查询条件" width="95" align="center">
                  <template slot-scope="{row}">
                    <el-form :model="row">
                      <el-form-item prop="selectFlag">
                        <el-checkbox v-model="row.selectFlag"></el-checkbox>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="listFlag" label="列表中显示" width="111" align="center">
                  <template slot-scope="{row}">
                    <el-form :model="row">
                      <el-form-item prop="listFlag">
                        <el-checkbox v-model="row.listFlag"></el-checkbox>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="orderFlag" label="订单中显示" width="111" align="center">
                  <template slot-scope="{row}">
                    <el-form :model="row">
                      <el-form-item prop="orderFlag">
                        <el-checkbox v-model="row.orderFlag"></el-checkbox>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      @click="delequipment_process_relList(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-actions" @click="addequipment_process_relList()">
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose"> 取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="dataFormSubmit()"> 提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateArrange, addArrange, detailArrange, checkArrange } from '@/api/basicData/materialSettings'
import { getattribute, getcategoryTree } from '@/api/basicData/materialSettings'

export default {
  data() {
    return {
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      dataForm: {
        id: "", // 编排属性ID
        businessCategoryId: "", // 产品所属分类ID
        businessCategoryText: "", // 产品所属分类名称
        businessCode: "product", // 业务编码
        classAttribute: "", // 类型
        code: "", // 编排编码
        name: "", // 编排名称
        delAttributeIndex: "" // 编辑时删除的lines
      },
      dataFormTwo: [],
      rules: {
        classAttribute: [{
          required: true,
          message: '请选择类型',
          trigger: 'change'
        }],
        businessCategoryText: [{
          required: true,
          message: '请选择所属分类',
          trigger: 'change'
        }],
        code: [{
          required: true,
          message: '请输入编排编码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            // 没有value不进行此校验
            if (!value) { callback() }
            else if (this.dataForm.code === this.autoCode) { callback() }
            else {
              checkArrange({ code: this.dataForm.code, id: this.dataForm.id, classAttribute: this.dataForm.classAttribute }).then((res) => {
                if (!res.data) { callback() }
                else { callback(new Error('当前类型已存在此编排编码')) }
              })
            }
          },
          trigger: 'blur'
        }, {
          validator: this.formValidate('enCode'),
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入编排名称',
          trigger: 'blur'
        }]
      },
      rulesTwo: {
        name: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }],
      },
      // 校验与聚焦 的dom
      formItems: [
        { ref: 'classAttribute', message: '请选择所属分类' },
        { ref: 'code', message: '请输入编排编码' },
        { ref: 'name', message: '请输入编排名称' },
      ],
      // 所属分类
      businessOptions: [],
      // 属性类型列表
      typeOptions: [{
        name: '文本',
        type: 'text'
      }, {
        name: '下拉选',
        type: 'select'
      }, {
        name: '复选项',
        type: 'multiple'
      }],
      isdisabled: false,
      // 所属分类改变后置空类型
      replaceBCT: () => { },
      // 保存点击编辑时已有的编码
      autoCode: undefined,
      getattribute,
      getcategoryTree,
      requestObj: {
        businessCode: 'product',
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,
        pageSize: -1,
        type: ''
      },
    }
  },
  created() {

  },
  watch: {
    // 所属分类发生变化后重置类型选择框
    'dataForm.classAttribute': {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.replaceBCT()
          this.isdisabled = false
        }
      },
      deep: true
    }
  },
  methods: {
    // 类型选择辅助方法
    onOrganizeChange(val, data) {
      if (!val && data.length) return
      if (!data) return
      this.dataForm.businessCategoryId = data[0].id
      this.dataForm.businessCategoryText = data[0].name
      // 重新校验类型选择框，其他内容不做操作
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('businessCategoryText')
      })
    },
    onOrganizeChangeTwo(val, data, param) {
      if (!val && data.length) return
      if (!data) return
      this.dataFormTwo[param.row.index].code = data[0].all.code
      this.dataFormTwo[param.row.index].name = data[0].name
      this.$nextTick(() => {
        // 重新校验指定选择框，其他内容不做操作
        this.$refs['tableForm_' + param.row.index].validateField('name')

        const codeOneItems = this.dataFormTwo.filter(item => item.code === data[0].all.code);
        const hasCodeOneMoreThanOnce = codeOneItems.length >= 2;
        if (hasCodeOneMoreThanOnce) {
          this.$message.error('当前编排属性已经存在此属性了')
          this.dataFormTwo[param.row.index].code = param.oldVal.code
          this.dataFormTwo[param.row.index].name = param.oldVal.name
        }
      })

    },
    onClose() {
      this.visible = false
      this.replaceBCT = () => { }
      setTimeout(() => {
        this.clearData()
      }, 200);
    },
    clearData() {
      this.dataForm = {
        id: "", // 编排属性ID
        businessCategoryId: "", // 类型ID,
        businessCategoryText: "", // 类型名称
        businessCode: "product", // 业务编码
        classAttribute: "", // 分类属性
        code: "", // 编排编码
        name: "", // 编排名称
        delAttributeIndex: "" // 编辑时删除的lines
      }
      this.dataFormTwo = [];
    },
    // 初始化内容
    init(id, businessOptions) {
      this.autoCode = undefined
      this.dataForm.id = id ? id : ""
      this.businessOptions = businessOptions
      this.dialogTitle = id ? '编辑编排属性' : '新建编排属性'
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dialogTitle === "新建编排属性") {
          this.clearData()
          this.isdisabled = true
          // 所属分类发生改变时清除类型框
          this.$nextTick(() => {
            this.replaceBCT = () => {
              this.dataForm.businessCategoryText = ""
            }
          })
        }
        else {
          this.loading = true
          // 获取当前项详情
          detailArrange(id).then(res => {
            this.dataForm = res.data.bimArrangeAttribute
            this.dataFormTwo = res.data.lines
            this.dataFormTwo.forEach((item, index) => { item.index = index })
            this.autoCode = res.data.bimArrangeAttribute.code
            this.loading = false
            // 所属分类发生改变时清除类型框
            this.$nextTick(() => {
              this.replaceBCT = () => {
                this.dataForm.businessCategoryText = ""
              }
            })
          })
        }
      });
      // this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    // 表单提交
    async dataFormSubmit() {
      let submitFlag = true
      this.btnLoading = true

      // 校验dataForm
      let form_1 = this.$refs.elForm
      let valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        let formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      // 校验tableForm
      let refTotal = this.dataFormTwo.length
      for (let i = 0; i < refTotal; i++) {
        let refList = [this.$refs['tableForm_' + i]]
        for (let j = 0; j < refList.length; j++) {
          let item = refList[j]
          let valid = await item.validate().catch(err => false)
          if (!valid && submitFlag) {
            let formItems = item.fields
            formItems.some(formItem => {
              if (formItem.validateState === 'error') {
                submitFlag = false
                this.jnpf.focusItem(formItem.$children[1].$el)
                this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
                return true
              }
            });
          }
        }
      }

      if (!submitFlag) {
        this.btnLoading = false
      } else {
        if (this.dataFormTwo.length === 0) {
          this.$message.error('至少拥有一项属性')
          this.btnLoading = false
        } else {
          if (this.dialogTitle === "编辑编排属性") {
            this.btnLoading = false
            this.$confirm('修改编排属性会导致原有的内容被清除，是否继续？', '确认信息', {
              distinguishCancelAndClose: true,
              type: 'warning',
              confirmButtonText: '确 定',
              cancelButtonText: '取 消'
            }).then(() => { this.request() })
          } else {
            this.request()
          }
        }
      }
    },
    // 发送请求
    request() {
      this.btnLoading = true
      let queryData = {
        bimArrangeAttribute: this.dataForm,
        lines: this.dataFormTwo
      }
      let requestMethod = this.dialogTitle === "新建编排属性" ? addArrange : updateArrange
      let successTip = this.dialogTitle === "新建编排属性" ? "新增" : "修改"
      requestMethod(queryData).then(res => {
        this.$message({
          message: successTip + '成功',
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
    },
    // 添加项
    addequipment_process_relList() {
      let ind = this.dataFormTwo.length
      let item = {
        arrangeAttributeId: this.dataForm.id, // 所属编排id
        // attributeItemName: "", // 属性可选项
        // attributeItemVal: "", // 属性可选值
        index: ind, // 用于ref遍历
        sort: ind, // 排序，作用于请求参数
        code: "", // 属性编码
        // type: "", // 属性类型
        name: "", // 属性名称
        selectFlag: false,
        listFlag: false,
        orderFlag: false,
        requiredFlag: false,
        attributeColumn: ""
      }
      this.dataFormTwo.push(item)
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataForm.delAttributeIndex += this.dataFormTwo[index].attributeColumn + ',' || ""
      this.dataFormTwo.splice(index, 1);
      this.dataFormTwo.forEach((item, index) => {
        item.index = index;
        item.sort = index;
      })
    },
    visibleChange(val) {
      if (!val && data.length) return
      else if (!this.dataForm.classAttribute) {
        this.$message.warning('请先选择类型')
        // this.$refs.elForm.validateField('classAttribute')
      }
    },
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>