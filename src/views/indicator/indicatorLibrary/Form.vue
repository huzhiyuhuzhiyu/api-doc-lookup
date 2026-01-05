<script>
import { getBasicFormSchema } from "./data";
import { addIndicatorLibrary, getIndicatorLibraryDetail, updateIndicatorLibrary } from "@/api/indicator";

export default {
  name: "Form",
  data() {
    return {
      loading: false,
      btnLoading: false,
      isOrderNoEditable: false,
      dataForm: {
        orderNo: '',
        name: '',
        enName: '',
        calculationFormula: '',
      },
      basicFormSchema: [],
      drawerVisible: false,
      drawerTitle: '',
      drawerSize: '40%',
      currentType: '',

      actions: {
        edit: async (id) => {
          await this.getDetail(id);
          await this.getOrderNoConfig()
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async () => {
          await this.getOrderNoConfig()
        },
      },
      apiMethodActions: {
        add: addIndicatorLibrary,
        edit: updateIndicatorLibrary,
      }
    }
  },
  computed: {
    isViewMode() {
      return this.currentType === 'look'
    }
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type = 'look') {
      this.currentType = type
      this.drawerTitle = this.getTitle(type)
      this.drawerVisible = true

      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }

      this.$nextTick(() => {
        this.$refs.dataForm?.$refs?.main?.clearValidate();
      })
    },

    async getOrderNoConfig() {
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', 'ZB')
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (this.currentType === 'add') {
        this.dataForm.orderNo = `${ number }`
      }
    },

    getTitle(type) {
      const titles = {
        'add': '新增指标库',
        'edit': '编辑指标库',
        'look': '查看指标库'
      }
      return titles[type] || '指标库'
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getIndicatorLibraryDetail(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = data
        }
      } catch ( err ) {
        this.$message.error('获取详情失败')
      } finally {
        this.loading = false
      }
    },

    async handleSubmit() {
      this.btnLoading = true
      try {
        await this.$refs.dataForm.$refs.main.validate()

        const MSG = '提交成功'
        const apiMethod = this.apiMethodActions[this.currentType]

        const res = await apiMethod(this.dataForm)
        const { msg } = res

        if (msg === 'Success') {
          this.$message.success(MSG)
          this.closeDrawer(true)
        }

      } catch ( error ) {
        if (error.message && !error.errors) {
          this.$message.error(error.message)
        }
      } finally {
        this.btnLoading = false
      }
    },

    closeDrawer(shouldRefresh = false) {
      this.drawerVisible = false
      this.$emit('close', shouldRefresh);
    },
  }
}
</script>

<template>
  <el-drawer
    :title="drawerTitle"
    :visible.sync="drawerVisible"
    :size="drawerSize"
    :wrapper-closable="false"
    :destroy-on-close="true"
    custom-class="form-drawer"
  >
    <div class="drawer-content" v-loading="loading">
      <div class="form-container" ref="main">
        <JNPF-col
          v-model="dataForm"
          :tabContent="basicFormSchema"
          ref="dataForm"
          :btnType="currentType"
        />
      </div>

      <div class="drawer-footer">
        <el-button
          @click="closeDrawer(false)"
          size="small"
        >
          取消
        </el-button>
        <el-button
          v-if="!isViewMode"
          type="primary"
          :loading="btnLoading"
          @click="handleSubmit"
          size="small"
        >
          提交
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
}

.drawer-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
}

/* 自定义drawer样式 */
::v-deep .form-drawer .el-drawer__header {
  margin-bottom: 0;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

::v-deep .form-drawer .el-drawer__header span {
  font-size: 16px;
  font-weight: 600;
}
</style>
