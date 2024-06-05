<template>
  <el-dialog :title="!dataForm.id ? '新建货架/货位' : btntype ? '查看货架/货位' : '编辑货架/货位'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
    width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
      label-position="top" label-width="120px">
      <el-form-item label="类型" prop="locationType">
        <el-select v-model="dataForm.locationType" placeholder="请选择类型" clearable style="width: 100%;" @change="handleType"
          :disabled="btntype||(dataForm.locationType=='goods_allocation'&&dataForm.parentId!='-1') ? true : false">
          <el-option v-for="(item, index) in locationTypeList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="dataForm.locationType == 'goods_shelves' ? '货架编码' : '货位编码'" prop="code">
        <el-input v-model="dataForm.code" :placeholder="dataForm.locationType == 'goods_shelves' ? '输入货架编码' : '输入货位编码'"
          maxlength="20" @blur="handleCode()" :disabled="btntype ? true : false" />
      </el-form-item>
      <!-- {
          label:"货架",
          value:"goods_shelves"
        },
        {
          label:"货位",
          value:"goods_allocation"
        }, -->
      <el-form-item :label="dataForm.locationType == 'goods_shelves' ? '货架名称' : '货位名称'" prop="name">
        <el-input v-model="dataForm.name" :disabled="btntype ? true : false"
          :placeholder="dataForm.locationType == 'goods_shelves' ? '输入货架名称' : '输入货位名称'" maxlength="20" />
      </el-form-item>
      <el-form-item label="货架行" prop="goodsFrameRow" v-show="dataForm.locationType == 'goods_shelves'">
        <el-select v-model="dataForm.goodsFrameRow" placeholder="请选择货架行" style="width: 100%;" @change="handleRow"
          :disabled="btntype ? true : false">
          <el-option v-for="(item, index) in goodsFrameRowList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货架列" prop="goodsFrameCol" v-show="dataForm.locationType == 'goods_shelves'">
        <el-select v-model="dataForm.goodsFrameCol" placeholder="请选择货架列" style="width: 100%;" @change="handleCol"
          :disabled="btntype ? true : false">
          <el-option v-for="(item, index) in goodsFrameRowList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200"
          :disabled="btntype ? true : false" />
      </el-form-item>
      <JNPF-table highlight-current-row :data="dataForm.allocations" v-show="tableflag" height="324"
        v-if="dataForm.locationType == 'goods_shelves'">
        <el-table-column prop="code" label="货位编码">
          <template slot="header">
            <span class="required">*</span>货位名称
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.code" maxlength="20" :disabled="btntype ? true : false">

            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="货位名称">
          <template slot="header">
            <span class="required">*</span>货位名称
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" maxlength="20" :disabled="btntype ? true : false">

            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" maxlength="200" :disabled="btntype ? true : false">

            </el-input>
          </template>
        </el-table-column>
      </JNPF-table>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateDepartment } from '@/api/permission/department'
import { addstockGoodsShelves, getStockGoodsShelvesInfo, editStockGoodsShelves } from "@/api/basicData/index";

export default {
  data() {
    return {
      locationTypeList: [
        {
          label: "货架",
          value: "goods_shelves"
        },
        {
          label: "货位",
          value: "goods_allocation"
        },
      ],
      goodsFrameRowList: [],
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        name: '',
        remark: '',
        code: "",
        locationType: 'goods_shelves',
        goodsFrameRow: "1",
        goodsFrameCol: "1",
        allocations: [],
        id: "",
        warehouseId: ""
      },
      btntype: false,
      organizeIdTree: [],
      tableflag: true,
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
        ],
        locationType: [
          { required: true, message: '类型不能为空', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    for (let index = 1; index <= 10; index++) {
      this.goodsFrameRowList.push(
        {
          label: "" + index,
          value: index
        }
      )

    }

    this.dataForm.allocations.push(
      {
        code: "",
        name: "",
        remark: ""
      }
    )
  },
  methods: {
    handleType(e) {
      console.log(33333, e);
      this.locationType=e
      if (e == 'goods_shelves') {
        this.dataForm.goodsFrameCol = 1
        this.dataForm.goodsFrameRow = 1
        this.dataForm.allocations = []
        this.tableflag = true
        let num;
        if (!this.dataForm.code) return
        num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
        for (let index = 1; index <= num; index++) {
          let obj = {
            code: this.dataForm.code + '0' + index,
            name: "",
            remark: ""
          }
          this.dataForm.allocations.push(obj)
        }
      } else {
        this.tableflag = false

      }
    },
    handleClose() {
      this.dataForm.allocations =
        [{
          code: "",
          name: "",
          remark: ""
        }]

      this.tableflag = true
      this.dataForm.goodsFrameRow = 1
      this.dataForm.goodsFrameCol = 1
      this.dataForm.locationType = 'goods_shelves'
    },
    // 监听编码的改变   动态生成表格
    handleCode() {
      this.dataForm.allocations = []
      console.log("编码", this.dataForm.code);
      let num;
      if (!this.dataForm.code) return
      num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
      for (let index = 1; index <= num; index++) {
        let obj = {
          code: this.dataForm.code + '0' + index,
          name: "",
          remark: ""
        }
        this.dataForm.allocations.push(obj)
      }
    },
    // 监听货架行值的改变   动态生成表格
    handleCol() {
      this.dataForm.allocations = []
      console.log("货架行", this.dataForm.goodsFrameCol);
      let num;
      num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
      for (let index = 1; index <= num; index++) {
        let obj = {
          code: this.dataForm.code ? this.dataForm.code + '0' + index : "",
          name: "",
          remark: ""
        }
        this.dataForm.allocations.push(obj)
      }
    },
    // 监听货架行值的改变   动态生成表格
    handleRow() {
      console.log("货架列", this.dataForm.goodsFrameRow);
      this.dataForm.allocations = []
      this.tableflag = false
      console.log("货架行", this.dataForm.goodsFrameCol);
      let num;
      num = Number(this.dataForm.goodsFrameCol) * Number(this.dataForm.goodsFrameRow)
      for (let index = 1; index <= num; index++) {
        let obj = {
          code: this.dataForm.code ? this.dataForm.code + '0' + index : "",
          name: "",
          remark: ""
        }
        this.dataForm.allocations.push(obj)
      }
      this.tableflag = true
    },
    init(id, warehouseId, type) {
      console.log("type", type);
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.warehouseId = warehouseId || ''

      // if (parentId == '-1') {
      //   this.isdisabled = true
      // } else {
      //   this.isdisabled = false
      // }
      if (type == "edit" || type == 'add') {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true

      }
      this.organizeIdTree = []
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getStockGoodsShelvesInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.organizeIdTree = res.data
            this.formLoading = false
            if (res.data.locationType != 'goods_shelves') {
              this.tableflag = false
            } else {
              this.tableflag = true
            }
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      console.log(this.dataForm);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let flag = null
          this.btnLoading = true;
          let formMethod = this.dataForm.id ? editStockGoodsShelves : addstockGoodsShelves;
          console.log("formMethod", formMethod);
          if (this.dataForm.locationType == 'goods_shelves') {
            this.dataForm.allocations.forEach((item, index) => {
              if (!item.name) {
                flag = false
                this.btnLoading = false;
                return this.$message({
                  message: "请填写第" + (index + 1) + "行货位名称",
                  type: 'error',
                  duration: 1500,
                })
              }
            });
          } else {
            this.dataForm.allocations = []
          }

          if (flag === false) return
          if (this.dataForm.locationType == 'goods_allocation') {
            this.dataForm.goodsFrameCol = 0
            this.dataForm.goodsFrameRow = 0
          }
          formMethod(this.dataForm).then(res => {
            console.log(666, res);
            let msg = ""
            if (formMethod == editStockGoodsShelves) {
              msg = '修改成功'
            } else {
              msg = '新建成功'
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
.required {
  color: red;
  margin-right: 4px;
}
</style>