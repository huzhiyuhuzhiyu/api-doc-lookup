<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
              <el-button :disabled="tableDataList.length > 0 ? false : true " size="mini" type="primary" icon="el-icon-download" @click="exportForm">导出</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
                    <!-- <el-dropdown> -->
        <div>
            <el-button
                :disabled="tableDataList.length > 0 ? false : true"
                size="mini"
                type="primary"
                icon="el-icon-download"
                @click="exportForm"
                >
                导出
            </el-button>   
            </div>
           
            <div class="JNPF-common-head-right">
                <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                        @click="initData()" />
                </el-tooltip>
            </div>
        </div>
        <JNPF-table v-loading="listLoading" highlight-current-row
          :fixedNO="true" ref="dataTable" :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
          <el-table-column prop="code" label="产品编码" min-width="140" sortable="custom"/>
          <el-table-column prop="name" label="产品名称" min-width="140" sortable="custom"/>
          <el-table-column prop="drawingNo" label="产品图号" min-width="160" sortable="custom"/>
          <el-table-column prop="spec" label="规格型号" min-width="140" sortable="custom" />
          <el-table-column prop="productType" label="物料分类" min-width="100" sortable="custom">
            <template slot-scope="scope">
              <div> {{ productType.getType(scope.row.productType) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" width="90" sortable="custom"/>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="add(scope.row)">
                新建
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />

  </div>
</template>
  
<script>
import { getProductWithOut } from '@/api/purchasingManagement/purchaseInquirySheet'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import productType from './productType.js'
export default {
  name: 'purOrderNoPriceQuery',
  components: { ExportForm },
  props:{
    // 查询类型 区分 无价格 无bom 无工艺
    searchType:{
      type: String,
      default:'price',
    }
  },
  data() {
    return {
      exportFormVisible: false,
      background: true,//分页器背景颜色  
      tableDataList: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        createByName: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        productDrawingNo: "",
        productName: "",
        productCode: "",
        startTime: "",
        endTime: "",
        productWithout:'price',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr:[],
      },
      total: 0,
      productType:productType,
      columnList: ['name','createByName']
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    // 查询类型 区分 无价格 无bom 无工艺
    this.listQuery.productWithout = this.searchType
    this.initData()
  },
  methods: {
    add(item) {
      console.log(item,'iiii')
      this.$router.push({
        name:"BOMCreate",
        params: { id: item.id ,name:item.name,drawNo:item.drawingNo} 
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) { 
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        } 
        let _data = {
          ...this.listQuery,
          exportType: '1125',
          exportName: this.listQuery.productWithout === 'price' ? '采购无价格查询' :this.listQuery.productWithout === 'bom' ? '待建BOM' : '产品无工艺查询',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    sortChange({ prop, order }) { 
      let newProp;
      if (prop === 'productName' || prop === 'productDrawingNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    initData() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      getProductWithOut(this.listQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false 
      }).catch(() => {
        this.listLoading = false
      })

    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  