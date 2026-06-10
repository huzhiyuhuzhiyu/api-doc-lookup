<template>
  <!-- 选择模版 -->
  <el-dialog title="选择打印模版" :close-on-click-modal="false" :close-on-press-escape="false" @close="$emit('closePrint')" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center pintDevLog" width="600px" append-to-body>
    <el-row :gutter="20">
      <el-form ref="printListForm" :model="printDataForm" :rules="dataRule" label-width="120px" label-position="left">
        <el-col :span="16">
          <el-form-item label="打印模版：" prop="enCode">
            <el-select v-model="printDataForm.enCode" placeholder="选择打印模版">
              <el-option :key="item.id" :label="item.fullName" :value="item.id" v-for="item in printList" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('closePrint')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="printSubmit()">
        确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPrintList } from '@/api/system/printDev'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    printQuery: {
      type: Object,
      default: () => ({})
    },
    enCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      printVisible: false,
      printDataForm: {
        enCode: ''
      },
      printList: [],
      dataRule: {
        enCode: [
          { required: true, message: '请选择打印模版', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    init(code,name) {
      console.log('code',code,name);
      this.printDataForm.enCode=""
      this.printList=[]
      getPrintList(this.printQuery).then(res => {
        if (res.data) {
          if (res.data.hasOwnProperty(this.enCode)) {
            this.printList = res.data[this.enCode]
            if(this.printList){
              if(name){
                // 如果有传客户名称过来 则走这里 根据客户名称去匹配模板 然后自动选中
                    // 步骤1：筛选带括号的数据
                    const withParentheses = this.printList.filter(item => /\(.*?\)/.test(item.fullName));
                    console.log('带括号的数据:', withParentheses);

                    // 步骤2：提取括号里的内容，存到对象中
                    const extracted = withParentheses.map(item => {
                      const match = item.fullName.match(/\((.*?)\)/);
                      const name = match ? match[1] : '';
                      return {...item, name};
                    });
                    console.log('提取括号内容:', extracted);
                  
                    // 步骤3：判断titlename是否包含name的前两位字符
                    const matchedData = extracted.filter(item => {
                      const prefix = item.name.substring(0,2); // 前两字符
                      return name.includes(prefix);
                    });
                    console.log(111,matchedData);
                    if(matchedData.length){
                      this.printDataForm.enCode = matchedData[0].id
                      console.log("555555555");
                    }else{
                      console.log("666666666666");
                       this.printList.forEach(item=>{
                        if (item.enabledMark){
                          this.printDataForm.enCode = item.id
                        }
                      })
                    }
              }else{
                 this.printList.forEach(item=>{
                  if (item.enabledMark){
                    this.printDataForm.enCode = item.id
                  }
                })
              }

            }
            
          }
        }
      }).catch(() => { })
    },
   
    printSubmit() {
      this.btnLoading = true
      this.$refs.printListForm.validate((valid) => {
        if (valid) {
          this.btnLoading = false
          this.$emit('printSubmit', this.printDataForm.enCode)
        } else {
          this.btnLoading = false
        }
      })
    },
  }
}
</script> 