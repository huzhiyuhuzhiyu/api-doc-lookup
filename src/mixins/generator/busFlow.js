/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-08-22 09:34:37
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-09-07 10:36:51
 * @FilePath: \os-web-zgt4.0\src\mixins\generator\busFlow.js
 * @Description: 业务审批需要 公用, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { updateQcUnqualifiedData } from '@/api/inspectionManagement/index' // 产品检验项目列表
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
    dataFormSubmit(eventType, flowUrgent, inspectionType, data,businessFlow) {
      this.eventType = eventType
      console.log(this.$refs);
      if (!inspectionType) {
        if (typeof this.$refs['dataForm'].validate === 'function') {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.$emit('eventReceiver', this.dataForm, eventType)
            }
          })
        }else{
          this.$refs['dataForm'].$children[0].validate((valid) => {
            if (valid) {
              this.$emit('eventReceiver', this.dataForm, eventType)
            }
          })
        }
      } else {
        if (['b003','b004','b008','b006','b007','b005','b022'].includes(businessFlow)){
          this.$refs['dataForm'].$children[0].validate((valid) => {
            if (valid) {
              // 是不良品且是技术部人员时处理结果 
              let dataObj = {
                attachmentList: data.datafilelist,
                unqualified: data.dataForm,
                flowData: data.flowData
              }
              updateQcUnqualifiedData(dataObj).then(res => {
                if (res && res.msg == 'Success') {
                  this.$emit('eventReceiver', this.dataForm, eventType)
                }
              }).catch(() => { })
            }
          })
        }else{
          this.$refs['dataForm'].$children[0].validate((valid) => {
            if (valid) {
              this.$emit('eventReceiver', this.dataForm, eventType)
            }
          })
        }
      }
    },
  }
}