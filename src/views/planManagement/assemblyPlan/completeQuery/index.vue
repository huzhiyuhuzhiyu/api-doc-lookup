<template>
  <!-- 齐套查询 -->
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="listQuery.drawingNo" placeholder="请输入品名规格" clearable
                @keyup.enter.native="search()" />
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
        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable" :data="tableDataList"
          @sort-change="sortChange" custom-column>
          <el-table-column prop="productDrawingNo" key="productDrawingNo" label="品名规格" min-width="350" />
          <el-table-column prop="productName" key="productName" label="产品名称" min-width="140" />
          <el-table-column prop="productCode" key="productCode" label="产品编码" min-width="120" />
          <el-table-column prop="productSource" key="productSource" label="产品来源" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.productSource == 'produce' ? "生产" : scope.row.productSource == 'out' ? "外协" : '采购' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" key="mainUnit" label="单位" width="80" />
          <el-table-column prop="kitQuantity" key="kitQuantity" label="齐套数量" min-width="100" />
          <el-table-column prop="inventoryQuantity" key="inventoryQuantity" label="库存数量" />
          <el-table-column prop="availableQuantity" key="availableQuantity" label="库存可用数量" min-width="160" />
          <el-table-column prop="actualInTransitQuantity" key="actualInTransitQuantity" label="在途\在制数量"  min-width="180"/>
        </JNPF-table>
        <!-- <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" /> -->
      </div>
    </div>

  </div>
</template>
  
<script>
import { kitListByDrawNo } from '@/api/calculationList/MRPOperation'
export default {
  name: 'completeQuery',
  data() {
    return {
      background: true,//分页器背景颜色  
      tableDataList: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        drawingNo:'',
      },
      total: 0,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
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
      if (this.listQuery.drawingNo){
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listLoading = true
        kitListByDrawNo(this.listQuery.drawingNo).then(res => {
          this.tableDataList = res.data.lineList
          // this.total = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }else{
        this.tableDataList = []
      }

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
  