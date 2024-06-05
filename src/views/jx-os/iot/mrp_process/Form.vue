<template>
  <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="工序名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序类别" prop="type">
              <el-select v-model="dataForm.type" placeholder="请选择" clearable :style='{"width":"100%"}'>
                <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName" :value="item.enCode"
                  :disabled="item.disabled"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计件单价" prop="unitPrice">
              <el-input v-model="dataForm.unitPrice" placeholder="请输入" clearable :style='{"width":"100%"}'>
                <template slot="append">元</template>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价系数" prop="coefficientPrice">
              <el-input v-model="dataForm.coefficientPrice" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计时单价" prop="timePrice">
              <el-input v-model="dataForm.timePrice" placeholder="请输入" clearable :style='{"width":"100%"}'>
                <template slot="append">元</template>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="note">
              <el-input v-model="dataForm.note" placeholder="请输入" :style='{"width":"100%"}' true type="textarea"
                :autosize='{"minRows":4,"maxRows":4}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <div class="JNPF-common-title">
                <h2>关联设备</h2>
              </div>
              <el-table :data="dataForm.equipment_process_relList" size='mini'>
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column prop="equipmentId" label="设备名称">
                  <template slot="header">
                    <span class="required-sign">*</span>设备名称
                  </template>
                  <template slot-scope="scope">
                    <popupSelect v-model="scope.row.equipmentId" placeholder="请选择" clearable
                      :field="'equipmentId'+scope.$index" interfaceId="344105290322416453"
                      :columnOptions="equipment_process_relequipmentIdcolumnOptions" propsValue="F_Id"
                      relationField="name" popupType="dialog" popupTitle="选择数据" popupWidth="800px">

                 </popupSelect>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="设备编码">
                  <template slot-scope="scope">
                    <popupAttr :relationField="'equipmentId'+scope.$index" showField="code">
                    </popupAttr>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      @click="delequipment_process_relList(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-actions" @click="addequipment_process_relList()">
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
      <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
        @select="addForSelect" @close="selectDialogVisible=false" />
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  import {
    getDictionaryDataSelector
  } from '@/api/systemData/dictionary'

  export default {
    components: {},
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        btnLoading: false,
        selectDialogVisible: false,
        currTableConf: {},
        addTableConf: {
          equipment_process_relList: {
            "popupType": "dialog",
            "hasPage": true,
            "popupTitle": "选择数据",
            "pageSize": 20,
            "columnOptions": [],
            "interfaceId": "",
            "interfaceName": "",
            "relationOptions": [],
            "templateJson": [],
            "popupWidth": "800px"
          },
        },
        tableRows: {
          equipment_process_relList: {
            equipmentId: '',
            enabledmark: undefined
          },
        },
        currVmodel: "",
        dataForm: {
          name: '',
          type: "",
          unitPrice: '',
          coefficientPrice: '',
          timePrice: '',
          note: '',
          creatoruserid: "",
          creatortime: "",
          lastmodifyuserid: "",
          lastmodifytime: "",
          equipment_process_relList: [],
        },
        rules: {
          name: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, ],
          unitPrice: [],
          coefficientPrice: [],
          timePrice: [],



        },
        typeOptions: [],

        equipment_process_relequipmentIdcolumnOptions: [{
          "label": "设备名称",
          "value": "name"
        }, {
          "label": "设备编码",
          "value": "code"
        }, ],
      }
    },
    computed: {},
    watch: {},
    created() {
      this.gettypeOptions();
    },
    mounted() {},
    methods: {
      equipment_process_relExist() {
        let isOk = true;
        for (let i = 0; i < this.dataForm.equipment_process_relList.length; i++) {
          const e = this.dataForm.equipment_process_relList[i];
          if (!e.equipmentId) {
            this.$message({
              message: '设备名称不能为空',
              type: 'error',
              duration: 1000
            });
            isOk = false
            break
          }
        }
        return isOk;
      },
      gettypeOptions() {
        getDictionaryDataSelector('344094387661181637').then(res => {
          this.typeOptions = res.data.list
        })
      },
      clearData() {
        this.dataForm.name = '';
        this.dataForm.type = "";
        this.dataForm.unitPrice = '';
        this.dataForm.coefficientPrice = '';
        this.dataForm.timePrice = '';
        this.dataForm.note = '';
        this.dataForm.creatoruserid = "";
        this.dataForm.creatortime = "";
        this.dataForm.lastmodifyuserid = "";
        this.dataForm.lastmodifytime = "";
        this.dataForm.equipment_process_relList = [];
      },
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/mrp_process/Mrp_process/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data)
              this.loading = false
            });
          } else {
            this.clearData()
          }
        });
        this.$store.commit('generator/UPDATE_RELATION_DATA', {})
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (!this.equipment_process_relExist()) return
            this.request()
          }
        })
      },
      request() {
        this.btnLoading = true
        let _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/mrp_process/Mrp_process',
            method: 'post',
            data: _data
          }).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refresh', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          request({
            url: '/api/mrp_process/Mrp_process/' + this.dataForm.id,
            method: 'PUT',
            data: _data
          }).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refresh', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      },
      addequipment_process_relList() {
        let item = {
          equipmentId: '',
        }
        this.dataForm.equipment_process_relList.push(item)
      },
      delequipment_process_relList(index) {
        this.dataForm.equipment_process_relList.splice(index, 1);
      },
      openSelectDialog(key) {
        this.currTableConf = this.addTableConf[key]
        this.currVmodel = key
        this.selectDialogVisible = true
        this.$nextTick(() => {
          this.$refs.selectDialog.init()
        })
      },
      addForSelect(data) {
        for (let i = 0; i < data.length; i++) {
          let item = {
            ...this.tableRows[this.currVmodel],
            ...data[i]
          }
          this.dataForm[this.currVmodel].push(item)
        }
      },
      dataList() {
        var _data = JSON.parse(JSON.stringify(this.dataForm));
        for (let i = 0; i < _data.equipment_process_relList.length; i++) {
          var _list = _data.equipment_process_relList[i];
        }
        return _data;
      },
      dataInfo(dataAll) {
        let _dataAll = dataAll
        for (let i = 0; i < _dataAll.equipment_process_relList.length; i++) {
          var _list = _dataAll.equipment_process_relList[i];
        }
        this.dataForm = _dataAll
      },
    },
  }
</script>
