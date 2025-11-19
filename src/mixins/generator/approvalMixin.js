import { withdrawn } from "@/api/basicData/approvalAdministrator";
import { getQueryConfirm } from "@/utils";

export const approvalMixin = {
  data() {
    return {
      isApprovalEnabled: false, // 审批功能是否启用
    }
  },
  async created() {
    await this.loadApprovalConfig();
  },
  methods: {
    /**
     * 加载审批配置
     * @param {string} businessCode - 业务编码，默认为 ''
     */
    async loadApprovalConfig(businessCode = '') {
      try {
        const res = await this.jnpf.getBusInfo(businessCode);
        this.isApprovalEnabled = res?.enabledMark || false;
      } catch ( error ) {
        this.isApprovalEnabled = false;
      }
    },

    /**
     * 判断编辑权限
     * @param {Object} row - 行数据
     * @returns {boolean}
     */
    canEdit(row) {
      return row.documentStatus === 'draft';
    },

    /**
     * 审批相关按钮显示条件
     * @param {Object} row - 行数据
     * @param {string} buttonType - 按钮类型: 'resubmit' | 'withdraw'
     * @returns {boolean}
     */
    canShowApprovalButton(row, buttonType) {
      if (!this.isApprovalEnabled) return false;

      const conditions = {
        resubmit: ['rebut', 'withdrawn'].includes(row.approvalStatus), // 重新提交
        withdraw: row.approvalStatus === 'ing' // 审批撤回
      };

      return conditions[buttonType] || false;
    },

    /**
     * 审批撤回
     * @param {string} formId - 表单ID
     * @param {Function} callback - 撤回成功后的回调函数
     */
    async handleWithdraw(formId, callback = null) {
      try {
        await getQueryConfirm(this,'此操作将撤回审批单，是否继续？')

        await withdrawn({ formId });
        this.$message.success('撤回成功');

        if (callback && typeof callback === 'function') {
          await callback();
        } else if (this.initData) {
          await this.initData();
        }
      } catch ( error ) {
        if (error !== 'cancel') {
          console.error('撤回失败:', error);
          this.$message.error('撤回失败');
        }
      }
    },

    /**
     * 重新提交处理
     * @param {Object} row - 行数据
     * @param {Function} submitCallback - 提交回调函数
     */
    handleResubmit(row, submitCallback = null) {
      if (submitCallback && typeof submitCallback === 'function') {
        submitCallback(row);
      } else {
        // 默认重新提交逻辑
        this.visible = true;
        this.$nextTick(() => {
          this.$refs.Form?.init(row.id, 'resubmit');
        });
      }
    }
  }
};
