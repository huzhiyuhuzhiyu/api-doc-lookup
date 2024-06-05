<template>
  <el-dialog
    title="演示系统详情"
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
                readonly
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
                readonly
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属分类" prop="demoSysCategoryId">
              <el-select
                v-model="dataForm.demoSysCategoryId"
                placeholder="请选择"
                disabled
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
                disabled
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
                readonly
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
                readonly
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
                readonly
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
                readonly
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
                readonly
              >
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from "@/utils/request"
import PrintBrowse from "@/components/PrintBrowse"

export default {
  components: { PrintBrowse },
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      printBrowseVisible: false,
      printId: "",
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
    dataInfo(dataAll) {
      let _dataAll = dataAll
      _dataAll.sysPic = _dataAll.sysPic ? JSON.parse(_dataAll.sysPic) : []
      this.dataForm = _dataAll
    },

    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.loading = true
          request({
            url: "/api/crm/bim/demo/sys/detail/" + this.dataForm.id,
            method: "get"
          }).then((res) => {
            this.dataInfo(res.data)

            this.loading = false
          })
        }
      })
    }
  }
}
</script>
