<template>
  <el-dialog :title="'新建人员管理设备'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">


      <el-form-item label="设备人员" prop="id" ref="euqPeople">
        <user-select v-model="dataForm.id" placeholder="请选择设备人员" @change="changePerple" clearable style="width: 100%;">
        </user-select>
      </el-form-item>

      <el-form-item label="设备" prop="equEquipmentPerson" ref="equEquipmentPerson">

        <ComSelectInspection v-model="dataForm.equEquipmentPerson" ref="comList" clearable multiple
          :placeholder="placeholder" auth @change="onOrganizeChangeTwo" :title="'选择设备'" :method="stateEquEquipment"
          :requestObj="requestObj" :paramsObj="{ dataForm }" :dataFormatting="dataFormatting" />

      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addequEquipmentPerson, updateequEquipmentPerson, checkProductionLineCode, editEquEquipmentAll, stateEquEquipment } from "@/api/basicData/index";
import ComSelectInspection from "./ComSelectInspection"
export default {
  components: {
    ComSelectInspection
  },
  data() {
    return {
      visible: false,
      stateEquEquipment,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      // stateList: [{
      //   label: "启用",
      //   value: "enable"
      // }, {
      //   label: "停用",
      //   value: "disabled "
      // }],
      onlyRead: false,
      dataForm: {
        show: true,
        remark: '',
        code: "",
        name: [],
        equName: '',
        state: "",
        classAttribute: "equipment",
        id: '',
        equEquipmentPerson: [],
        personId: '',
        createBy: '',
      },
      equNameArr: [],
      dataFormTwo: {
      },
      equEquipmentPerson: [],
      requestObj: {
        classAttribute: "equipment",
        pageSize: -1,
      },
      placeholder: '请选择设备',
      editEquEquipmentAll,
      btntype: false,
      dataRule: {
        equEquipmentPerson: [
          { required: true, message: '请选择设备', trigger: 'change' },
          // { validator: this.maxLength(), trigger: ['change'] }
        ],
        id: [
          { required: true, message: '请选择人员', trigger: 'blur' },
        ],
        // equNameArr:[{ required: true, message: '请选择设备名称', trigger: 'change' }],
        // state:[
        //   {required:true,message:"请选择状态",trigger:"change"}
        // ]
      },
    }
  },
  created() {
  },

  methods: {
    dataFormatting(res) {
      const newData = res.data.records.map(line => {
        return { ...line, name: `${line.code} - ${line.name}` }
      })
      return newData
    },
    //   maxLength() {
    //   return (rule, value, callback) => {
    //     let msg = `请选择设备名称`
    //     if (!value || value.length == 0) {
    //       this.$message.error(msg)
    //        callback(new Error(msg)) 
    //       }
    //     // else {
    //     //   if (value * 1 > this.dataFormTwo.data[index].purchaseQuantity) {
    //     //     // callbackMethod(msg)
    //     //     this.$message.error(msg)
    //     //     callback(new Error(msg));
    //     //   }
    //     // }
    //   };
    // },
    changePerple(id, data) {
      // console.log(data);
      if (!data) return
      this.$refs['dataForm'].validateField('id')
      if (data) {

      } else {
        this.$refs['dataForm'].fields[0].resetField()
        this.dataForm.id = data.id
      }

    },
    // 选择设备名称的弹框
    onOrganizeChangeTwo(val, data, param) {
      if (!data) return
      this.$nextTick(() => this.$refs['dataForm'].validateField('equEquipmentPerson'))
      console.log(data, '传data');
      // return
      if (data.length === 0) {
        this.placeholder = "请选择设备"
        console.log(this.$refs['dataForm']);
        // this.$refs['dataForm'].validateField('equEquipmentPerson')
        this.dataForm.equEquipmentPerson = []
      } else {
        // this.$refs['dataForm'].$children[1].resetField('equEquipmentPerson')
        this.placeholder = ''
        this.dataForm.equEquipmentPerson = data.map((item) => {
          return {
            ...item,
            equipmentId: item.id
          }
        })
        console.log(this.dataForm.equEquipmentPerson, '88888');

        // console.log(this.equEquipmentPerson,'88888');
      }

    },



    init() {
      this.placeholder = "请选择设备"
      this.visible = true
      this.dataForm.equEquipmentPerson = []
      this.dataFormTwo = {}
      this.dataForm.id = ''
      this.dataForm.name = []
      this.$nextTick(() => {
        // console.log(this.$refs['comList']);
        this.$refs['comList'].setDefault()
      })
    },
    dataFormSubmit() {
      this.dataFormTwo = {
        equEquipmentPerson: this.dataForm.equEquipmentPerson,
        personId: this.dataForm.id
      }

      console.log(this.dataFormTwo, '11111');
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.btnLoading = true;
          let formMethod = addequEquipmentPerson;

          formMethod(this.dataFormTwo).then(res => {
            console.log(666, res);
            let msg = ""
            if (formMethod == addequEquipmentPerson) {
              msg = '新增成功'
              // this.init()
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped>
::v-deep .el-input__inner {
  height: 40px;
}

::v-deep .el-select .el-tag {
  margin: 5px 0 2px 6px;
}

::v-deep .el-select__tags {

  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
}
</style>