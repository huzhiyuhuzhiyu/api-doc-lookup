<template>
  <el-dialog :title="!dataForm.id ? '新建胶管内径标号区间' : '编辑胶管内径标号区间'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
      <el-form-item label="胶管层数" prop="layerCount">
        <el-select placeholder="请选择胶管层数" v-model="dataForm.layerCount" clearable>
          <el-option class="select_item" v-for="(item, index) in productTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <div class="interval">胶管内径区间</div>
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item prop="hoseNoStart">
            <el-input v-model="dataForm.hoseNoStart" placeholder="请输入起始值" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="startSymbol">
            <el-select placeholder="请选择起始比较符号" v-model="dataForm.startSymbol" clearable>
              <el-option v-for="(item, index) in startSymbolList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item class="fuhao">
            <el-input value="？" placeholder="" maxlength="20" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="endSymbol">
            <el-select placeholder="请选择终止比较符号" v-model="dataForm.endSymbol" clearable>
              <el-option v-for="(item, index) in endSymbolList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="hoseNoEnd">
            <el-input v-model="dataForm.hoseNoEnd" placeholder="请输入终止值" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2" />
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
import { addIntervalmanagement } from '@/api/financialManagement/index'
import formValidate from "@/utils/formValidate";
export default {
  data () {
    return {
      productTypeList: [
        {
          label: "1-2层",
          value: "1-2",
        },
        {
          label: "3-4层",
          value: "3-4",
        },
        {
          label: "6层",
          value: "6",
        },
        {
          label: "水管",
          value: "water_pipes",
        },
        {
          label: "铁佛龙管",
          value: "iron_buddha_dragon",
        },
        {
          label: "测压表线",
          value: "pressure_gauge",
        },
        {
          label: "黄油管",
          value: "butter_tube",
        },
        {
          label: "其他",
          value: "other",
        }
      ],
      startSymbolList: [
        {
          label: "小于",
          value: "<",
        },
        {
          label: "小于等于",
          value: "<=",
        }
      ],
      endSymbolList: [
        {
          label: "小于",
          value: "<",
        },
        {
          label: "小于等于",
          value: "<=",
        }
      ],
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm1: {
        endSymbol: "<=",
        hoseNoEnd: "",
        hoseNoStart: "",
        layerCount: "",
        startSymbol: "<=",
        remark: '',
        id: ''
      },
      dataForm: {},
      btntype: false,
      dataRule: {
        layerCount: [
          { required: true, message: '请选择胶管层数', trigger: 'change' },
        ],
        startSymbol: [
          { required: true, message: '请选择起始比较符号', trigger: 'change' },
        ],
        endSymbol: [
          { required: true, message: '请选择终止比较符号', trigger: 'change' },
        ],
        hoseNoStart: [
          { required: true, message: '请输入起始值', trigger: 'blur' },
          { validator: this.formValidate('nonnegative', '输入不小于0的值',), trigger: 'blur' }
        ],
        hoseNoEnd: [
          { required: true, message: '请输入终止值', trigger: 'blur' },
          { validator: this.formValidate('nonnegative', '输入不小于0的值',), trigger: 'blur' }
        ],

      },
    }
  },
  created () {
  },
  methods: {
    handleClose () {
    },
    init (id, type) {
      this.visible = true
      this.dataForm = JSON.parse(JSON.stringify(this.dataForm1))
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (Number(this.dataForm.hoseNoEnd) < Number(this.dataForm.hoseNoStart)) {
            this.$message.error("终止值不能小于起始值")
          } else {
            this.btnLoading = true;
            addIntervalmanagement(this.dataForm).then(res => {
              let msg = "新建成功"
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

        }
      })
    }
  }
}
</script>
<style scoped>
::v-deep .fuhao .el-form-item__label {
  color: #fff;
}

.interval {
  line-height: 32px;
  font-weight: 700;
  color: #606266;
  font-size: 16px;
}
.select_item{
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}
</style>
