<script>
import { getBasicFormSchema } from "./data";
import { addIndicatorRules, getIndicatorRulesDetail, updateIndicatorRules } from "@/api/indicator";

export default {
  name: "Form",
  data() {
    return {
      loading: false,
      btnLoading: false,
      isOrderNoEditable: false,
      dataForm: {
        libraryName: '',
        libraryEnName: '',
        calculationFormula: '',
        indicatorLibraryId: '',
        orderNo: '',
        name: '',
        enName: '',
        productionLineId: '',
        meetTargetColor: '',
        notMeetTargetColor: '',
        targetComparator: '',
        targetValue: '',
      },
      basicFormSchema: [],
      drawerVisible: false,
      drawerTitle: '指标目标',
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
        default: async (indicatorLibrary) => {
          this.dataForm.libraryName = indicatorLibrary.name
          this.dataForm.libraryEnName = indicatorLibrary.enName
          this.dataForm.calculationFormula = indicatorLibrary.calculationFormula
          this.dataForm.indicatorLibraryId = indicatorLibrary.id
          await this.getOrderNoConfig()
        },
      },
      apiMethodActions: {
        add: addIndicatorRules,
        edit: updateIndicatorRules,
      }
    }
  },
  computed: {
    isViewMode() {
      return this.currentType === 'look'
    },
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, indicatorLibrary) {
      this.drawerVisible = true
      this.currentType = type
      this.drawerTitle = this.getTitle(type)
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(indicatorLibrary);
      }
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
      })
    },

    async getOrderNoConfig() {
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', 'ZBMB')
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (this.currentType === 'add') {
        this.dataForm.orderNo = `${ number }`
      }
    },

    getTitle(type) {
      switch ( type ) {
        case 'add':
        case 'copy':
          return `创建${ this.drawerTitle }`
        case 'edit':
          return `编辑${ this.drawerTitle }`
        case 'look':
          return `查看${ this.drawerTitle }`
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getIndicatorRulesDetail(id)
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
        await this.$refs['dataForm'].$refs.main.validate()
        let MSG = '提交成功'
        const apiMethod = this.apiMethodActions[this.currentType]
        const res = await apiMethod(this.dataForm)
        const { msg } = res

        if (msg === 'Success') {
          this.$message.success(MSG)
          this.closeDrawer(true)
        }

      } catch ( error ) {
        if (error.message) {
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
          @click="handleSubmit"
          size="small"
          type="primary"
          :loading="btnLoading"
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
  padding: 20px;
  text-align: right;
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
