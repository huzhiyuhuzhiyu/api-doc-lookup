<template>
  <transition name="el-zoom-in-center">

      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header noButtons">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack"
            content="工资明细" />
        
        </div>
        <div class="main" v-loading="formLoading" >
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="5">
                  <el-form-item>
                    <el-date-picker v-model="reportDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                        start-placeholder="报工开始日期" end-placeholder="报工结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.productDrawingNo" @keyup.enter.native="search()"
                      placeholder="请输入产品图号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.processName" @keyup.enter.native="search()"
                      placeholder="请输入工序名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="listQuery.reportWagesFlag" placeholder="请选择工资" >
                      <el-option v-for="(item, index) in reportWagesFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> 

                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right;margin-right: 10px;" size="mini" type="primary"
                        icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              
              <JNPF-table :partentOrChild="'child'" ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="producerJobNumber" label="生产人工号" min-width="180" ></el-table-column>
                <el-table-column prop="producerName" label="生产人名称" min-width="120"/>
                <el-table-column prop="productCode" label="产品编码" min-width="160"/>
                <el-table-column prop="productName" label="产品名称" min-width="160"/>
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="250"/>
                <el-table-column prop="processCode" label="工序编码" min-width="160"/>
                <el-table-column prop="processName" label="工序名称" min-width="160"/>
                <el-table-column prop="pricingType" label="计价类型" min-width="110">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in pricingTypeList" :key="index">
                      <span v-if="item.value == scope.row.pricingType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
               
                <el-table-column prop="timePrice" label="单价(元)" min-width="140">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.pricingType=='by_time'" v-model="scope.row.timePrice" @input="watchNum(scope.row, scope.$index)" @blur="blurFun(scope.row, scope.$index)" maxlength="22" pattern="\d{1,18}(\.\d{0,2})?"></el-input>
                    <el-input v-if="scope.row.pricingType=='by_piece'" v-model="scope.row.unitPrice" @input="watchNum(scope.row, scope.$index)" @blur="blurFun(scope.row, scope.$index)" maxlength="22" pattern="\d{1,18}(\.\d{0,2})?"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="reportingQuantity" label="报工数量" min-width="140"/>
                <el-table-column prop="reportingWages" label="计件工资" min-width="140"/>
                <el-table-column prop="reportingDate" label="报工时间" min-width="140"/>
                
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="initData">
                <div style="background: #f5f7fa;" class="text">
                
                <span style="font-weight:500;margin-right:10px">报工总数量：{{ dispatchQuantity }}</span>
                <span style="font-weight:500;margin-right:10px">报工总金额：{{  reportingWages }}</span>
              </div>
              </pagination>
              
            </div>
          </div>
          </div>
          <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" :modal-append-to-body="false"
            lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
            <el-row :gutter="20">
                <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
                    <el-col :span="12">
                        <el-form-item label="报工时间">
                          <el-date-picker v-model="reportDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                            start-placeholder="报工开始日期" end-placeholder="报工结束日期" clearable>
                    </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品编码">
                            <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称">
                            <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品图号">
                            <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工序编码">
                            <el-input v-model="listQuery.processCode" placeholder="请输入工序编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工序名称">
                            <el-input v-model="listQuery.processName" placeholder="请输入工序名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工资">
                          <el-select v-model="listQuery.reportWagesFlag" placeholder="请选择工资" >
                            <el-option v-for="(item, index) in reportWagesFlagList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="search()">
                    搜索</el-button>
            </span>
        </el-dialog>
      <!-- <productForm v-if="productFormVisible" ref="productForm" @refresh="refresh" /> -->
    </div>
  </transition>
</template>

<script>

import { getSalaryDetailList,editPrice} from '@/api/salaryManagement'

export default {
  props: {
    customList: {
      require: true,
      type: Array
    }
  },
   
  data() {
    return {
      visible: false,
      dispatchQuantity:"",
      reportingWages:"",
      formLoading:false,
      listLoading:false,
      total:0,
      tableData:[],
      initListQuery:{
        productName:"",
        productCode:"",
        productDrawingNo:"",
        reportStartDate:"",
        reportEndDate:"",
        processCode:"", 
        processName:"",
        reportWagesFlag:"",
        producerId:"",
        pageNum:1,
        pageSize:20,
        month:"",
      },
      reportDateArr:[],
      reportWagesFlagList:[
          {value:"",label:"所有"},
          {value:0,label:"金额大于0"},
          {value:1,label:"金额等于0"},
      ],
      pricingTypeList:[
        { value:"by_time",label:"计时", },
        { value:"by_piece",label:"计件", }
      ],
      listQuery:{},
      month:"",
  producerId:"",

    }
  },
  computed: {

    

  },

  
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
  },
  mounted() {
    
  },
  methods: {
    watchNum(row,index){
      let data;
      if(row.pricingType=='by_time'){
      data=row.timePrice = row.timePrice.replace(/[^\d.]/g, ''); 
      
      }
      if(row.pricingType=='by_piece'){
        data=row.unitPrice = row.unitPrice.replace(/[^\d.]/g, ''); 

      } 
      if (data.length == 1 && data == '.') {
        // 如果第一位是小数点，则清空输入框
        data = '';
        row.assistanttimePrice = '';
      } else if (data.length == 2 && data[0] == '0' && data[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        data = data.slice(0, 1) + '.' + data.slice(1);
      } else if (data.length > 2 && data[0] == '0' && data[1] != '.') {
        data = data.substring(1, data.length)
      }


      if (data.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < data.length; i++) {
          const char = data[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }

        data = result;
        let arr = data.split('.')
        if (arr[0].length > 15) {
          arr[0] = arr[0].substring(0, 15)
        }
        if (arr[1].length >4) {
          arr[1] = arr[1].substring(0, 4)
        }
        data = arr[0] + '.' + arr[1]
      } else {
        if (data.length > 15) {
          data = data.substring(0, 15);
        }
      }
    },
    blurFun(row,index){
      console.log("row",row);
      let obj={
        id:row.id,
        price:row.pricingType=='by_time'?row.timePrice:row.unitPrice,

      }
      editPrice(obj).then(res=>{
        console.log(res);
        this.$message.success("更新单价成功")
        this.getSalaryDetailFun()
      })
    },
    sortChange(){

    },
    init(id,month){
      console.log("id",month);
      this.listQuery.producerId=id
      this.producerId=id
      this.listQuery.month=month
      this.month=month
      this.getSalaryDetailFun()
    },
    search(){
      this.listQuery.pageNum = 1
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      if (this.reportDateArr && this.reportDateArr.length > 0) {
        this.listQuery.reportStartDate = this.reportDateArr[0]
        this.listQuery.reportEndDate = this.reportDateArr[1]
      } else {
        this.listQuery.reportStartDate = ""
        this.listQuery.reportEndDate = ""
      }
      this.getSalaryDetailFun()
    },
    getSalaryDetailFun(){
      this.listQuery.producerId=this.producerId
      this.listQuery.month=this.month

      this.listLoading=true
      
      getSalaryDetailList(this.listQuery).then(res=>{
        console.log("明细",res);
        this.tableData=res.data.page.records
        this.total=res.data.page.total
        this.dispatchQuantity=res.data.total?res.data.total.dispatchQuantity:0
        this.reportingWages=res.data.total?res.data.total.reportingWages:0
      this.listLoading=false
      this.visible=false
      }).catch(error=>{
      this.listLoading=false
      this.visible=false
      })
    },
    reset(){
      this.reportDateArr=[]
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
    initData(){
      this.listLoading=true
      this.getSalaryDetailFun()
    },
    goBack() {
      this.$emit('close')
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

//.el-button--small {
// padding: 1;
//}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
</style>
<style scoped lang="scss">
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
}
</style>