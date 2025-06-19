<template>
  <!-- 齐套查询 -->
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item>
              <el-autocomplete  v-model="form.drawingNo" :fetch-suggestions="querySearchAsync" placeholder="请输入品名规格" @select="handleSelect($event)" ></el-autocomplete>
              <!-- <el-input v-model="listQuery.drawingNo" placeholder="请输入品名规格" clearable
                @keyup.enter.native="search()" /> -->
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>

            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
          <JNPF-table v-loading="listLoading"  highlight-current-row  :data="tableDataList" :row-key="'id'" v-if="refreshTable" fixedNO  :setColumnDisplayList="columnList"
          :default-expand-all="expands" :tree-props="{ children: 'childrenList', hasChildren: '' }" ref="dataTable" show-overflow-tooltip custom-column
          >
          <el-table-column prop="productCode" key="productCode" label="产品编码" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="productName" label="产品名称"   width="160" v-if="isProductNameSwitch === '1'"
          show-overflow-tooltip></el-table-column>
          <el-table-column prop="drawNo" label="品名规格"width="360" show-overflow-tooltip>
            <template slot-scope="scope">
              <i :class="[
                scope.row.childrenList.length >= 1
                  ? 'icon-ym icon-ym-tree-organization3'
                  : 'icon-ym icon-ym-systemForm'
              ]"></i>
              {{ scope.row.drawNo }}
            </template>
          </el-table-column>
        <el-table-column prop="productCategoryName" label="产品分类" width="160"   />
        <!-- <el-table-column prop="productName" key="productName" label="产品名称" min-width="140" /> -->
          <el-table-column prop="productSource" key="productSource" label="产品来源" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.productSource == 'produce' ? "生产" : scope.row.productSource == 'out' ? "外协" : '采购' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" key="mainUnit" label="单位" width="80" />
          <el-table-column prop="qty" key="qty" label="基本数量" width="80" />
  
        </JNPF-table>
        <!-- <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" /> -->
      </div>
    </div>

  </div>
</template>

<script> 
import { getProducts,bomTopTree  } from '@/api/masterDataManagement/index.js' // 产品列表
export default {
  name: 'completeQuery',
  props:{
      drawingNo:{
          type:String,
          default:''
      },
  },
  data() {
    return {
      columnList:[],
      expands: true,
      refreshTable: true,
      background: true,//分页器背景颜色
      tableDataList: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        drawingNo:this.drawingNo,
      },
      form:{
        drawingNo:"",
        pageNum:-1,
        pageSize:-1,
      },
      total: 0,
      isProductNameSwitch: '',
      productsId:"",
    }
  },
  async created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
    await this.getProductNameSwitch('product', 'enable_productName')

  },
  methods: {
     querySearchAsync(queryString, cb) { 
       if (queryString && queryString.length >= 3) {
        queryString=queryString.trim()
        let ProductListRequestObj = {
          classAttributeList: [],
          classAttribute: "",
          productDrawingNo: queryString,
          productCategoryId: "",
          queryType: 2,
          productStatus: 'enable',
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
          saleFlag: true,
        }
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          getProducts(ProductListRequestObj).then(res => {
            let datas = res.data.records
            if (datas !== []) {
              var restaurants = datas
              var arr = []
              restaurants.forEach((item, index) => {
                arr.push({
                  value: item.drawingNo,
                  data: item,
                })
              })
              cb(arr)
            } else {
              let air = []
              this.$message.error("您输入的品名规格暂未匹配到对应的产品数据，请重新输入!")
              queryString = ""
              cb(air)
            }
          })
            .catch(res => {
              this.$message({
                type: 'error',
                message: '获取数据失败'
              })
            })
        }, 500)
      } else {
        let air = []
        cb(air)
      }
        
      },
      handleSelect(item) {
      console.log(666, item);
      this.productsId=item.data.id
        bomTopTree({productsId:this.productsId}).then(res=>{
          console.log("bomg0",res);
          if(res.data){
            this.tableDataList=res.data
          }else{
            this.tableDataList=[]
          }
        }).catch(error=>{
            this.tableDataList=[]

        })
    },




    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    toggleExpand() {
      this.refreshTable = false
      this.expands = !this.expands
      this.$nextTick(() => {
        this.refreshTable = true
        this.$forceUpdate()
      })
    },

    initData() {
      if(this.productsId){
        this.listLoading = true
        bomTopTree({productsId:this.productsId}).then(res => {
          console.log(res);
          this.tableDataList = res.data
          // this.total = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.tableDataList=[]
          this.listLoading = false
        })

      }else{
        this.tableDataList=[]
      }


    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.productsId=""
      this.form.drawingNo=""
      this.initData()
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
