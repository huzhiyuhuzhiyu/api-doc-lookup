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
  // 布尔值选项
  booleanOptions: [
    { label: "是", value: true },
    { label: "否", value: false },
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
  timePickerOptionsArr: { // 日期/时间区间选择器通用选项）
    
    shortcuts: [{ // 调用时使用 global.timePickerOptions.shortcuts 不设置日期/时间选择限制
      text: '近3天',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '近7天',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },  {
      text: '近30天',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, ]
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
        const start = moment().subtract(6, 'days').startOf('day');
        const end = moment().endOf('day');
        picker.$emit('pick', [start.toDate(), end.toDate()]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const start = moment().subtract(30, 'days').startOf('day');
        const end = moment().endOf('day');
        picker.$emit('pick', [start.toDate(), end.toDate()]);
      }
    }, {
      text: '上个月',
      onClick(picker) {
        const start = moment().subtract(1, 'months').startOf('month');
        const end = moment().subtract(1, 'months').endOf('month');
        picker.$emit('pick', [start.toDate(), end.toDate()]);
      }
    }]
  },
}

export default global