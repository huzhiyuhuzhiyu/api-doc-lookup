<template>
  <el-dialog
    :title="!dataForm.id ? '新建演示系统' : '编辑演示系统'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center"
    lock-scroll
    width="600px"
  >
    <el-row :gutter="15" class="">
      <el-form
        ref="elForm"
        :model="dataForm"
        :rules="rules"
        size=""
        label-width="100px"
        label-position="right"
      >
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="分类名称" prop="name">
              <el-input
                v-model="dataForm.name"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统版本">
              <el-input
                v-model="dataForm.sysVersion"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属分类" prop="demoSysCategoryId">
              <el-select
                v-model="dataForm.demoSysCategoryId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in demoSysCategoryIdOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统图片" prop="sysPic">
              <JNPF-UploadImg
                v-model="dataForm.sysPic"
                :fileSize="10"
                sizeUnit="MB"
                :limit="1"
                :detailed="dataForm.sysPic.length !== 0"
              >
              </JNPF-UploadImg>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统介绍" prop="sysIntroduce">
              <el-input
                v-model="dataForm.sysIntroduce"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统地址" prop="sysUrl">
              <el-input
                v-model="dataForm.sysUrl"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="账号" prop="accountCode">
              <el-input
                v-model="dataForm.accountCode"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码" prop="accountPwd">
              <el-input
                v-model="dataForm.accountPwd"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="dataForm.remark"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
      <SelectDialog
        v-if="selectDialogVisible"
        :config="currTableConf"
        :formData="dataForm"
        ref="selectDialog"
        @select="addForSelect"
        @close="selectDialogVisible = false"
      />
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
        确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import request from "@/utils/request"
import { getDataInterfaceRes } from "@/api/systemData/dataInterface"

export default {
  components: {},
  props: [],
  data() {
    const validateLogo = (rule, value, callback) => {
      if (this.dataForm.sysPic.length == 0) {
        callback(new Error("请上传图片"))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      btnLoading: false,
      selectDialogVisible: false,
      currTableConf: {},
      addTableConf: {},
      tableRows: {},
      currVmodel: "",
      dataForm: {
        name: "",
        sysVersion: "",
        demoSysCategoryId: "",
        sysPic: [],
        sysIntroduce: "",
        sysUrl: "",
        accountCode: "",
        accountPwd: "",
        remark: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        demoSysCategoryId: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        sysPic: [
          {
            required: true,
            validator: validateLogo,
            trigger: "change"
          }
        ],
        sysIntroduce: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        sysUrl: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
      demoSysCategoryIdOptions: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDemoSysCategoryIdOptions()
  },
  mounted() {},
  methods: {
    isParentId() {
      if (this.dataForm.id) {
        if (this.dataForm.parentId == this.dataForm.id) {
          this.$message({
            message: "上级分类不能选择自己",
            type: "warning"
          })

          return false
        }
      }
      return true
    },

    getDemoSysCategoryIdOptions() {
      let query = {
        currentPage: 1,
        pageSize: 9999
      }

      request({
        url: `/api/crm/bim/demo/sys/category/list`,
        method: "post",
        data: query
      }).then((res) => {
        let data = res.data.records
        this.demoSysCategoryIdOptions = data
      })
    },
    clearData() {
      this.dataForm.name = ""
      this.dataForm.sysVersion = ""
      this.dataForm.demoSysCategoryId = ""
      this.dataForm.sysPic = []
      this.dataForm.sysIntroduce = ""
      this.dataForm.sysUrl = ""
      this.dataForm.accountCode = ""
      this.dataForm.accountPwd = ""
      this.dataForm.remark = ""
    },
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs["elForm"].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          request({
            url: "/api/crm/bim/demo/sys/detail/" + this.dataForm.id,
            method: "get"
          }).then((res) => {
            this.dataInfo(res.data)
            this.loading = false
          })
        } else {
          this.clearData()
        }
      })
      this.$store.commit("generator/UPDATE_RELATION_DATA", {})
    },
    // 表单提交
    dataFormSubmit() {
      this.dataForm.name = this.dataForm.name.trim()
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          if (!this.isParentId()) return

          this.request()
        }
      })
    },
    request() {
      this.btnLoading = true
      let _data = this.dataList()

      if (!this.dataForm.id) {
        request({
          url: "/api/crm/bim/demo/sys/add",
          method: "post",
          data: _data
        })
          .then((res) => {
            this.$message({
              message: "创建成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit("refresh", true)
              }
            })
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        request({
          url: "/api/crm/bim/demo/sys/modify",
          method: "PUT",
          data: _data
        })
          .then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit("refresh", true)
              }
            })
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    openSelectDialog(key) {
      this.currTableConf = this.addTableConf[key]
      this.currVmodel = key
      this.selectDialogVisible = true
      this.$nextTick(() => {
        this.$refs.selectDialog.init()
      })
    },
    addForSelect(data) {
      for (let i = 0; i < data.length; i++) {
        let item = { ...this.tableRows[this.currVmodel], ...data[i] }
        this.dataForm[this.currVmodel].push(item)
      }
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm))
      _data.sysPic = Array.isArray(_data.sysPic)
        ? JSON.stringify(_data.sysPic)
        : "[]"
      return _data
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      _dataAll.sysPic = _dataAll.sysPic ? JSON.parse(_dataAll.sysPic) : []
      this.dataForm = _dataAll
    }
  }
}
</script>
