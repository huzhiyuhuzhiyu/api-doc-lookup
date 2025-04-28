<template>
  <el-dialog title="选择资产" :close-on-click-modal="false" :close-on-press-escape="false" 
    :visible.sync="productClassAttribute" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="50%"
    append-to-body>
    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

      <div class="JNPF-common-layout-center JNPF-flex-main productClass">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="searchProductClassAttribute()"  v-model="orderForm.name" placeholder="资产名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="searchProductClassAttribute()"  v-model="orderForm.code" placeholder="资产编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductClassAttribute()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductClassAttribute()">{{
                  $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="productList"  :fixedNO="true"  ref="form">
            <el-table-column prop="name" label="资产名称" />
            <el-table-column prop="code" label="资产编码"></el-table-column>
            <el-table-column prop="propertyCategoryName" label="分类"></el-table-column>
            <el-table-column prop="projectName" label="所属项目"></el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="selectHandle(scope.row)">选择</el-button>
            </template>
          </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="searchProductClassAttribute" />
        </div>
      </div>
    </div>
    
  </el-dialog>
</template>

<script>

import { bimPropertyList} from '@/api/bimPropertyCategory/index'  
import formValidate from "@/utils/formValidate"; 
export default {
data() {
  return {
    productClassAttribute:false,
    type: '',
    productList:[],
    total:0,
    visible: false,
    formLoading: false,
    btnLoading: false,
    isdisabled: false,
    orderForm: {
      name:"",
      code:"",
      pageNum:1,
      pageSize:20,
      state:"normal",
      orderItems: [
        {
          asc: false,
          column: 'create_time'
        }
      ]
    },
 
  
  }
},
created() {

},
methods: {
  getCateFun(){
    bimPropertyList(this.orderForm).then(res=>{
      this.productList=res.data.records
      this.total=res.data.total
    })
  },

  init() {
    this.productClassAttribute=true
    this.getCateFun() 
  },
  selectHandle(row){
    this.productClassAttribute=false
    this.$emit("selectAsset",row)
  },
  resetProductClassAttribute(){
      this.orderForm= {
      state:"normal",
      name:"",
      code:"",
      pageNum:1,
      pageSize:20,
      orderItems: [
        {
          asc: false,
          column: 'create_time'
        }
      ]
    }
    this.getCateFun()
  }
}
}
</script>

<style scoped>
::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body{
    padding: 10px !important;
}
</style>
