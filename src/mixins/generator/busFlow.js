/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-08-22 09:34:37
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-08-22 09:47:34
 * @FilePath: \os-web-zgt4.0\src\mixins\generator\busFlow.js
 * @Description: 业务审批需要 公用, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  data() {
    return {
      flowUrgentOptions: [{ value: 1, label: '普通' }, { value: 2, label: '重要' }, { value: 3, label: '紧急' }],
      fileList: [],
      setting: {},
      eventType: '',
      loading: false,
      tableRequiredData: {},
    }
  },
  methods: {
    dataFormSubmit(eventType, flowUrgent) {
      this.eventType = eventType
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('eventReceiver', this.dataForm, eventType)
        }
      })
    },
  }
}