<template>
  <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
            <el-col :span="24">
               <el-form-item label="能耗类型" prop="energyType">
                 <el-select v-model="dataForm.energyType" placeholder="请选择" clearable :style='{"width":"100%"}' @change="energyTypeChange">
                   <el-option v-for="(item, index) in energyTypeOptions" :key="index" :label="item.fullName"
                     :value="item.enCode" :disabled="item.disabled"></el-option>

                 </el-select>
               </el-form-item>
             </el-col>
            <el-col :span="24">
               <el-form-item label="点位分类" prop="typeS">
                 <JNPFTreeSelect v-model="dataForm.categoryId" placeholder="请选择"
                     clearable :options="categoryIdOptions" :props="categoryIdProps">

                 </JNPFTreeSelect>
               </el-form-item>
             </el-col>
          <el-col :span="24">
            <el-form-item label="点位名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
              <el-form-item label="点位位置" prop="mrpWorkshopId">
                  <JNPFTreeSelect v-model="dataForm.mrpWorkshopId" placeholder="请选择" clearable
                      :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps">

                  </JNPFTreeSelect>
              </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="点位编号" prop="code">
              <el-input v-model="dataForm.code" placeholder="请输入" clearable :style='{"width":"100%"}'>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="盒子ID" prop="uuid">
               <el-input v-model="dataForm.uuid" placeholder="请输入" clearable :style='{"width":"100%"}'>

               </el-input>
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
        addTableConf: {},
        tableRows: {},
        currVmodel: "",
        dataForm: {
          name: '',
          code: '',
          mrpWorkshopId:'',
          energyType: "ELECTRICITY",
          typeS: "NH",
          categoryId: ""
        },
        rules: {
          name: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, ],
          code: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, ],
          energyType: [{
            required: true,
            message: '请至少选择一个',
            trigger: 'change'
          }, ],
          categoryId: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }, ],
        },

        categoryIdOptions: [],
        categoryIdProps: {
            'label': 'name',
            'value': 'id',
            'children': 'children'
        },
        mrpWorkshopIdOptions: [],
        mrpWorkshopIdProps: {
            "label": "name",
            "value": "id",
            "children": "children"
        },


        energyTypeOptions: [],
        typeSOptions: [],

      }
    },
    computed: {},
    watch: {},
    created() {
      this.getenergyTypeOptions();
      this.gettypeSOptions();
      this.getcategoryIdOptions('电');
       this.getmrpWorkshopIdOptions();
    },
    mounted() {},
    methods: {
      getenergyTypeOptions() {
        getDictionaryDataSelector('351649524592159941').then(res => {
          this.energyTypeOptions = res.data.list
        })
      },
      gettypeSOptions() {
        getDictionaryDataSelector('350188256479946181').then(res => {
          this.typeSOptions = res.data.list
        })
      },
      getmrpWorkshopIdOptions() {
          getDataInterfaceRes('342715607101211205').then(res => {
              let data = res.data
              this.mrpWorkshopIdOptions = data
          })
      },

      getcategoryIdOptions(value) {
          let _query = {
              paramList: [{
                  field: "parentId",
                  fieldName: "父ID",
                  dataType: "int",
                  required: 0,
                  defaultValue: -1
              }, {
                  field: "type",
                  fieldName: "类型",
                  dataType: "varchar",
                  required: 0,
                  defaultValue: value
              }],
              tenantId: "",
              origin: "preview"
          }
          getDataInterfaceRes('339308611257762501', _query).then(res => {
              let data = res.data
              this.categoryIdOptions = data
              console.log(this.categoryIdOptions);
          })
      },

      //能耗类型下拉框改变事件
      energyTypeChange(e){
            if(e == 'WATER'){
                this.getcategoryIdOptions('水');
            }else if(e == 'ELECTRICITY'){
                this.getcategoryIdOptions('电')
            }else if(e == 'GAS'){
                this.getcategoryIdOptions('气')
            }
      },


      clearData() {
        this.dataForm.name = '';
        this.dataForm.code = '';
        this.dataForm.mrpWorkshopId = '',
        this.dataForm.energyType = "ELECTRICITY";
        this.dataForm.typeS = "NH";
        this.dataForm.categoryId = "";
      },
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['elForm'].resetFields();
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/equipment/Equipment/' + this.dataForm.id,
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
            this.request()
          }
        })
      },
      request() {
        this.btnLoading = true
        let _data = this.dataList()
        if (!this.dataForm.id) {
          request({
            url: '/api/equipment/Equipment',
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
            url: '/api/equipment/Equipment/' + this.dataForm.id,
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
        return _data;
      },
      dataInfo(dataAll) {
        let _dataAll = dataAll
        this.dataForm = _dataAll
      },
    },
  }
</script>
