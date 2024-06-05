<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', 'noButtons']">
          <el-page-header @back="goBack" :content="pageTitle" />
           
        </div>
        <div class="main">
        
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>主产品信息</h5>
              </div>
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm"  size="small" label-width="100px"
                  label-position="top">

                  <el-col :span="12">
                    <el-form-item label="计划单号" prop="planNo"  >
                      <el-input v-model="dataForm.planNo" placeholder="请输入计划单号" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="产品编码" prop="productCode" >
                      <el-input v-model="dataForm.productCode" placeholder="产品编码" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="产品名称" prop="productName" >
                      <el-input v-model="dataForm.productName" placeholder="产品名称" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="产品图号" prop="productDrawingNo" >
                      <el-input v-model="dataForm.productDrawingNo" placeholder="产品图号" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="工作令号" prop="workOrderNo" >
                      <el-input v-model="dataForm.workOrderNo" placeholder="工作令号" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="单位" prop="mainUnit" >
                      <el-input v-model="dataForm.mainUnit" placeholder="单位" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="需生产数量" prop="outputQuantity" >
                      <el-input v-model="dataForm.outputQuantity" placeholder="需生产数量" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="齐套数量" prop="kitQuantity" >
                      <el-input v-model="dataForm.kitQuantity" placeholder="齐套数量" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="未齐套数量" prop="noKitQuantity" >
                      <el-input v-model="dataForm.noKitQuantity" placeholder="未齐套数量" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  


                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
      

                <el-table style="border: 1px solid #e3e7ee;"  hasC hasNO fixedNO :data="popupList" id="table">
                  <el-table-column type="index" key="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="productCode" key="productCode" label="产品编码" min-width="120"  show-overflow-tooltip> </el-table-column>
                  <el-table-column prop="productName" key="productName" label="产品名称" min-width="140"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" key="productDrawingNo" label="产品图号" min-width="350" show-overflow-tooltip>  </el-table-column>
                  <el-table-column prop="productSource" key="productSource" label="产品来源" min-width="100">
                    <template slot-scope="scope">
                      <div>{{scope.row.productSource=='produce'?"生产":scope.row.productSource=='out'?"外协":'采购'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mainUnit" key="mainUnit" label="单位" width="80"></el-table-column>
                  <el-table-column prop="kitDemandQuantity" key="kitDemandQuantity" label="需求数量" min-width="100"></el-table-column>
                  <el-table-column prop="availablePickQuantity" key="availablePickQuantity" label="可领料数量" min-width="120"></el-table-column>
                  <el-table-column prop="kitQuantity" key="kitQuantity" label="齐套数量" min-width="100"></el-table-column>
                  <el-table-column prop="noKitQuantity" key="noKitQuantity" label="未齐套数量" min-width="140"></el-table-column>
                  <el-table-column prop="lackQuantity" key="lackQuantity" label="缺料数量" min-width="100"></el-table-column>
                  <el-table-column prop="inventoryQuantity" key="inventoryQuantity" label="库存数量" min-width="100"></el-table-column>
                  <el-table-column prop="occupancyQuantity" key="occupancyQuantity" label="库存占用数量" min-width="140"></el-table-column>
                  <el-table-column prop="actualInTransitQuantity" key="actualInTransitQuantity" label="实际在途\在制数量" min-width="160"></el-table-column>
                </el-table>
          
             
        </div>
      </div>
    </transition>
     
  </div>
</template>
<script> 
import {

getDemandList
} from "@/api/calculationList/MRPOperation";
export default {
  
  data() {
    return {
      listLoading:false,
      pageTitle:"",
        dataForm:{},
      popupList:[],

    
     
      
      
    }
  },
  created() {
  }, 
  methods: {  
    goBack() {
            this.$emit('close')
        }, 
    init(id,type) {
            if(type=="produce"){
        this.pageTitle="生产需求——齐套查询"
      }

      if(type=='out'){
        this.pageTitle="外协需求——齐套查询"
      } 
      this.listLoading=true
      getDemandList(id).then(res=>{
        this.dataForm=res.data.demand
        console.log("res===>",res);
        this.popupList=res.data.lineList
      this.listLoading=false
      }).catch(error=>{
      this.listLoading=false

      })
        },
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs {
  height: 100%!important;
}
::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow:auto!important;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .workNode {
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}
</style>