<template>
  <el-dialog
    :title="!dataForm.id ? '新建演示系统分类' : '编辑演示系统分类'"
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
            <el-form-item label="分类编码" prop="code">
              <el-input
                v-model="dataForm.code"
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
        code: "",
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
        code: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
      parentIdOptions: [],
      parentIdProps: {
        label: "fullName",
        value: "id",
        children: "children"
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getparentIdOptions()
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

    getparentIdOptions() {
      let query = {
        paramList: [
          {
            field: "type",
            fieldName: "",
            dataType: "varchar",
            required: 1,
            defaultValue: "topic"
          }
        ],
        tenantId: "",
        origin: "preview"
      }

      getDataInterfaceRes("405285958137677701", query).then((res) => {
        let data = res.data
        this.parentIdOptions = data
      })
    },
    clearData() {
      this.dataForm.name = ""
      this.dataForm.code = ""
      this.dataForm.remark = ""
    },
    init(id) {
      this.dataForm.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs["elForm"].resetFields()
        if (this.dataForm.id) {
          this.loading = true
          request({
            url: "/api/crm/bim/demo/sys/category/detail/" + this.dataForm.id,
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
          url: "/api/crm/bim/demo/sys/category/add",
          method: "post",
          data: _data
        })
          .then((res) => {
            if (res.code == "200")
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
          url: "/api/crm/bim/demo/sys/category/modify",
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
      return _data
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      this.dataForm = _dataAll
    }
  }
}
</script>
