<template>
  <el-dialog :title="!dataForm.id ? '新建车型信息' : btntype ? '查看车型信息' : '编辑车型信息'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
    width="1000px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRules" label-position="top"
      label-width="120px">
      <el-row :gutter="30">

        <template>
          <el-col :span="12">
            <el-form-item label="客户编码" prop="ncode" ref="ncode">
              <ComSelect-list :isdisabled="abledShow ? false : true" v-model="dataForm.ncode" placeholder="请选择客户" auth
                @change="onOrganizeChangeThree" :title="'选择客户'" :method="getCooperativeData" :requestObj="requestObj2"
                :paramsObj="{}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="nname">
              <el-input placeholder="请输入客户名称" disabled v-model="dataForm.nname"></el-input>
            </el-form-item>
          </el-col>

        </template>


        <el-col :span="12">
          <el-form-item label="工位" prop="station">
            <el-input v-model="dataForm.station" placeholder="请输入工位" maxlength="20" :disabled="btntype ? true : false"
              oninput="value = value.replace(/[\p{P}\p{C}\p{S}\p{M}]/gu,'')" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车型" prop="vehicleModel">
            <el-input v-model="dataForm.vehicleModel" placeholder="请输入车型" maxlength="50"
              oninput="value = value.replace(/[\p{P}\p{C}\p{S}\p{M}]/gu,'')" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>


        <el-col :span="12">
          <el-form-item label="客户图号" prop="customerDrawingNo">
            <el-input v-model="dataForm.customerDrawingNo" placeholder="请输入客户图号" maxlength="50"
              oninput="value = value.replace(/[\p{P}\p{C}\p{S}\p{M}]/gu,'')" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户图号用量" prop="dosage">
            <el-input v-model="dataForm.dosage" placeholder="请输入客户图号用量" maxlength="9"
              oninput="value = value.replace(/\D/g, '')" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="abledShow ? false : true">
          <el-form-item label="产品编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="请输入产品编码" maxlength="20"
              oninput="value = value.replace(/\D/g, '')" :disabled="abledShow ? false : true" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="abledShow ? false : true">
          <el-form-item label="客户产品图号" prop="drawingNo">
            <el-input v-model="dataForm.drawingNo" placeholder="请输入客户产品图号" maxlength="20"
              oninput="value = value.replace(/\D/g, '')" :disabled="abledShow ? false : true" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="abledShow ? false : true">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请选择产品名称" maxlength="20"
              oninput="value = value.replace(/\D/g, '')" :disabled="abledShow ? false : true" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="dataForm.remark" placeholder="请输入备注" maxlength="200"
              :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>


        <el-col :span="24" v-if="abledShow ? true : false">
          <el-form-item label-width="0">
            <el-table :data="dataFormTwo" size='mini' height="200" id="table">
              <el-table-column type="index" width="60" label="序号" align="center" />
              <el-table-column prop="code" label="产品编码">
                <template slot-scope="{row}">
                  <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                    <el-form-item prop="code" :style="row.cssObj" ref="code">
                      <el-input disabled v-model="row.code" placeholder="产品编码" clearable maxlength="20"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="drawingNo" label="产品图号">
                <template slot-scope="{row}">
                  <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                    <el-form-item prop="drawingNo" :style="row.cssObj" ref="drawingNo">
                      <el-input disabled v-model="row.drawingNo" placeholder="产品图号" clearable
                        maxlength="20"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="产品名称">
                <template slot="header">
                  <span class="required">*</span>产品名称
                </template>
                <template slot-scope="{row}">
                  <el-form :ref="`tableForm_${row.index}`" :model="row" :rules="rulesTwo">
                    <el-form-item prop="productName" ref="targetName">
                      <ComSelect-page :isdisabled="abledShow ? false : true" v-model="row.name" placeholder="请选择产品名称" auth
                        @change="onOrganizeChangeTwo" :title="'选择产品'" :listMethod="getProductList" :searchList="ProductTableSearchList"
                        :requestObj="requestObj" :methodArr="ProductMethodArr" :listRequestObj="ProductListRequestObj"
                        :tableItems="ProductTableItems" treeTitle="产品分类"
                        :paramsObj="{ row, oldVal: { name: row.name || '', id: row.id || '', all: row.all || '' } }" />

                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="abledShow ? false : true"
                    @click="deltable(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="addtable()">
              <el-button v-if="abledShow" type="text" icon="el-icon-plus">添加</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getCooperativeData, addBimVehicleType, updateBimVehicleType, detailBimVehicleType, checkBimInspectionTypeCode, checkBimInspectionItemsCode, getBimInspectionItemsList } from "@/api/basicData/index";
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
export default {
  data() {
    return {
      type: '',
      getProductList,
      getCooperativeData,
      visible: false,
      formLoading: false,
      btnLoading: false,
      code: '',         //客户编码
      requestObj: {
        type: "customer",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,

      },
      requestObj2: {
        type: "customer",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,
        pageSize: -1,
      },
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "accessories", "semi_finished", "finish_product"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        productStatus: "enable",
      },
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号', minWidth: 0 },
        { prop: 'spec', label: '规格型号', minWidth: 0 }
      ],
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      abledShow: true,
      // 保存编辑时已有的项目编码
      autoCode: undefined,
      dataForm: {
        stationId: '',// 工位id
        station: '',   // 工位
        vehicleModel: '', //车型
        customerDrawingNo: '', //客户图号
        dosage: null,              //用量
        cooperativePartnerId: '', //客户id
        nname: '',          //客户名称
        productsId: '',           //产品id
        productName: '',          //产品名称
        ncode: '',                 //客户编码
        code: '',                  //产品编码
        remark: '',
        productIds: [],           //产品数组

      },
      productsIds: [],
      ProductMethodArr: [
      { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      dataFormTwo: [],
      rulesTwo: {
        targetName: [{
          required: true,
          message: '请选择产品名称',
          trigger: ['change']
        }],
        productsId: [{ required: true, message: '产品id不能为空', trigger: 'blur' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      btntype: false,
      dataRules: {
        vehicleModel: [{ required: true, message: '请输入车型', trigger: 'blur' }],
        ncode: [{ required: true, message: '请选择客户', trigger: 'blur' }],
        code: [{ required: true, message: '请选择产品', trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  methods: {
    handleClose() {
    },
    onOrganizeChangeThree(val, data) {
      this.$refs['dataForm'].validateField('ncode')
      if (!val && data.length) return
      if (!data || !data.length) return
      console.log(data, '客户客户');
      if (data[0].all) {
        this.dataForm.ncode = data[0].all.code
      }

      this.dataForm.cooperativePartnerId = data[0].id
      this.dataForm.nname = data[0].name
    },
    // 选择产品名称的弹框
    onOrganizeChangeTwo(val, data, paramsObj) {
      if (!data || !data.length) return
      console.log(data);
      let index = paramsObj.row.index
      this.dataFormTwo[index].productsId = data[0].id    //产品id
      this.dataFormTwo[index].code = data[0].all.code   // 物料编码
      this.dataFormTwo[index].drawingNo = data[0].all.drawingNo   //物料图号
      this.dataFormTwo[index].name = data[0].name              //产品名称
      // // 重新校验指定选择框，其他内容不做操作
      this.$nextTick(() => {
        // 重新校验指定选择框，其他内容不做操作
        this.$refs['tableForm_' + paramsObj.row.index].validateField('name')
        const codeOneItems = this.dataFormTwo.filter(item => item.name === data[0].name);
        const hasCodeOneMoreThanOnce = codeOneItems.length >= 2;
        if (hasCodeOneMoreThanOnce) {
          this.$message.error('当前选择的产品已经存在此产品了')
          this.dataFormTwo[index].productsId = ''    //产品id
          this.dataFormTwo[index].code = ''  // 物料编码
          this.dataFormTwo[index].drawingNo = ''   //物料图号
          this.dataFormTwo[index].name = ''
        }
      })
    },

    addtable() {
      let ind = this.dataFormTwo.length
      let item = {
        index: ind,
        name: "",

        targetUnitCode: "",
        cssObj: {}
      }
      this.dataFormTwo.push(item)

    },
    deltable(index) {
      this.dataFormTwo.splice(index, 1);
      this.abledShow = true
    },
    init(id, type) {
      console.log(id);
      this.type = type
      this.abledShow = true
      this.dataForm.cooperativePartnerId = ''
      this.dataForm.nname = ''
      this.dataForm.code = ''
      this.autoCode = undefined
      this.visible = true
      this.btntype = false
      this.dataForm.id = id || ''
      if (type == "edit") {
        this.btntype = false
        this.abledShow = false
      } else if (type == "look") {
        this.btntype = true
        this.abledShow = false
      }
      this.formLoading = true
      // this.$nextTick(() => {
      // this.$refs['dataForm'].resetFields()
      if (this.dataForm.id) {
        detailBimVehicleType(this.dataForm.id).then(res => {
          console.log("详情", res);
          this.dataForm = res.data
          this.dataFormTwo = [
            {
              name: res.data.name,
              productsId: res.data.productsId,
              code: res.data.code,
              drawingNo: res.data.drawingNo
            }
          ]
          this.dataForm.nname = res.data.nname
          this.dataForm.ncode = res.data.ncode

          this.formLoading = false
          let ind = 0
          this.dataFormTwo.forEach(item => {
            item.index = ind++
          })
          this.loading = false
        })
      } else {
        this.dataForm = {}
        this.formLoading = false
        this.dataFormTwo = []
      }
      // })
    },

    dataFormSubmit() {
      console.log(this.dataForm.cooperativePartnerId, '人员id');
      this.productsIds = []
      let queryData
      if (this.type == 'add') {
        this.dataFormTwo.forEach(item => {
        console.log(item,'55555');
        this.productsIds.push(item.productsId)
      })
        queryData = {
          bimVehicleTypeCorresponding: {
            cooperativePartnerId: this.dataForm.cooperativePartnerId,
            customerDrawingNo: this.dataForm.customerDrawingNo,
            dosage: this.dataForm.dosage,
            remark: this.dataForm.remark,
            station: this.dataForm.station,
            id: this.dataForm.id,
            vehicleModel: this.dataForm.vehicleModel,

          },
          productIds: [...new Set(this.productsIds)],
        }
      } else {
        queryData = {
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
            customerDrawingNo: this.dataForm.customerDrawingNo,
            dosage: this.dataForm.dosage,
            remark: this.dataForm.remark,
            station: this.dataForm.station,
            id: this.dataForm.id,
            vehicleModel: this.dataForm.vehicleModel,
            productsId: this.dataForm.productsId,
        }
      }
      console.log(queryData,'canshu');
      console.log(this.dataFormTwo, '222222');
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          console.log(queryData, '参数');
          if (this.dataFormTwo.length === 0) {
            this.$message.error('至少选择一项产品')
          }
          else {
            if (this.dataFormTwo[0].name === '') {
              this.$message.error('至少选择一项产品')
            } else {
              this.btnLoading = true;

              let formMethod = this.dataForm.id ? updateBimVehicleType : addBimVehicleType;
              // if (formMethod == updateBimVehicleType) {
              //   queryData = queryData.bimVehicleTypeCorresponding
              // }
              formMethod(queryData).then(res => {
                console.log(666, res);
                let msg = ""
                if (formMethod == updateBimVehicleType) {
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

          }

        }
      })

    }
  }
}
</script>
<style scoped>
::v-deep #table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>
