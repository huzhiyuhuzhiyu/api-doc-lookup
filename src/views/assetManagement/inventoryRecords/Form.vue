<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">




      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" >
        <el-page-header @back="goBack" content="查看盘点记录" />
        <div class="options">
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
           
              <el-collapse v-model="activeNames" >
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-form ref="dataForm" :model="dataForm"  label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="no">
                          <el-input v-model="dataForm.no" placeholder="请输入单号" disabled maxlength="300" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="盘点完成日期" prop="stocktakingTime">
                          <el-date-picker v-model="dataForm.stocktakingTime" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="盘点完成日期" disabled>
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="盘点人" prop="stocktakingUserName">
                          <el-input v-model="dataForm.stocktakingUserName"  type="text"  disabled
                            maxlength="200" />
                        </el-form-item>
                      </el-col>
                  

                      <el-col :sm="12" :xs="24">
                        <el-form-item label="是否完全盘点" prop="state">
                          <el-select v-model="dataForm.state" placeholder="请选择" style="width: 100%;" disabled>
                              <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" 
                                :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                      </el-col>
                    
                    </el-row>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="资产信息" name="productInfo">
             

                  <JNPF-table ref="dataTable" v-loading="listLoading" row-key="id" highlight-current-row :data="tableData" :fixedNO="true" >
                    <el-table-column prop="propertyCategoryName" label="资产分类"  />
                    <el-table-column prop="propertyCode" label="资产编码"   />
                    <el-table-column prop="propertyName" label="资产名称"   />
                    <el-table-column prop="propertySpec" label="资产规格"   />
                    <el-table-column prop="ownerName" label="资产管理员"   />
              
                  </JNPF-table>

                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
 

    </div>
  </transition>
</template>

<script>
import { propertyStocktakingDeatil} from '@/api/bimPropertyCategory/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
export default {
  components: { Process, recordList },
  mixins: [flowMixin, busFlow,getProjectList],
  
  data() {
    return {
      activeNames: ["productInfo", "basicInfo"],
      stateList:[
        {label:"完全盘点",value:"finished"},
        {label:"未完全盘点",value:"not_finish"},
      ],
      tableData:[],
      dataForm:{
        no:"",
        stocktakingTime:"",
        stocktakingUserName:"",
        state:"",
      }
    }
  },


  async created() {


  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {

  },
  methods: {
    goBack() {
      this.$emit('close', true)
    },

    init(id) {
      console.log(id);
      propertyStocktakingDeatil(id).then(res=>{
        console.log("盘点单详情");
        this.dataForm=res.data
        this.tableData=res.data.stocktakingLineVOS
      })

    },
  


  },
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 10px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}

::v-deep.JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 !important;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}


.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.JNPF-common-search-box {
  margin-bottom: 5px;
}

// .orderInfo ::v-deep .el-collapse-item__wrap {
//   border-bottom: none !important
// }
.JNPF-common-table {
  border: 1px solid #ebeef5 !important;
}



.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

.JNPF-common-layout-main.JNPF-flex-main {
  padding-top: 5px;
}



.scand ::v-deep.el-input__inner {
  height: 60px;
  line-height: 60px;
  font-size: 20px !important;
  font-weight: 600;
  border-color: #3fb9f8;
}

.scand .box {
  padding: 40px 20px;

}

.scand .tip {
  margin-top: 10px;
  font-size: 18px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px !important;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding: 0;
}
</style>
