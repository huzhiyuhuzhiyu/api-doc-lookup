// 全局常量配置
import moment from 'moment'

const global = {
  // 单据状态
  documentStatusList: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }],
  // 审批状态
  approvalStateList: [
    { label: "审批中", value: "ing" },
    { label: "审批通过", value: "ok" },
    { label: "审批拒绝", value: "rebut" },
  ],
  timePicker: { // 日期/时间选择器通用选项（禁用未发生的时间）
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    // shortcuts: [{
    //   text: '今天',
    //   onClick(picker) {
    //     picker.$emit('pick', new Date());
    //   }
    // }, {
    //   text: '昨天',
    //   onClick(picker) {
    //     const date = new Date();
    //     date.setTime(date.getTime() - 3600 * 1000 * 24);
    //     picker.$emit('pick', date);
    //   }
    // }, {
    //   text: '一周前',
    //   onClick(picker) {
    //     const date = new Date();
    //     date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
    //     picker.$emit('pick', date);
    //   }
    // }]
  },
  timePickerOptions: { // 日期/时间区间选择器通用选项（禁用未发生的日期）
    disabledDate(time) {
      const currentDate = new Date();
      const selectedDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      return selectedDate.getTime() > currentDate.getTime()
    },
    shortcuts: [{ // 调用时使用 global.timePickerOptions.shortcuts 不设置日期/时间选择限制
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '上个月',
      onClick(picker) {
        const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
        const start = new Date()
        end.setTime(end.getTime() - 3600 * 1000 * 24)
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }]
  }
}

export default global