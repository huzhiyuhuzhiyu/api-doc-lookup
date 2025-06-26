<template>
  <!-- 资产报废 -->
  <div class="JNPF-common-layout">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;background-color: #fff;">
        <el-tab-pane label="供应商页面" name="supplierPage" style="margin-bottom: 5px;height: 100%;">
          <div class="JNPF-common-layout"> -->
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent :rules="rules">
          <template v-for="(item, index) in searchList">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="search('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
 
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <topOpts @add="addSupplier()" />

          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" row-key="id" highlight-current-row :data="tableData"
          custom-column :setColumnDisplayList="columnList" @sort-change="sortChange"  >
          <el-table-column prop="orderNo" label="出售单号" width="200" sortable="custom" />
          <el-table-column prop="propertyName" label="资产名称" width="160" sortable="custom" />
          <el-table-column prop="propertyCode" label="资产编码" width="160" sortable="custom" />
          <el-table-column prop="propertySpec" label="资产规格" width="160" sortable="custom" />
          <el-table-column prop="cooperativePartnerName" label="客户名称" width="250" sortable="custom" />
          <el-table-column prop="tax" label="税率" width="100" sortable="custom" />
          <el-table-column prop="totalAmount" label="金额(含税)" width="140" sortable="custom" />
          <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" sortable="custom" />
          <el-table-column prop="propertyCategoryName" label="分类" width="120" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom" />
          <el-table-column prop="createByName" label="申请人" width="120" sortable="custom" />
        
          <el-table-column prop="orderStatus" label="状态" min-width="150" sortable="custom" >
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.orderStatus == 'sold'">已售出</el-tag>
              <el-tag type="danger" disable-transitions v-if="row.orderStatus == 'rejected'">已拒绝</el-tag>
              <el-tag disable-transitions v-if="row.orderStatus == 'toBeAgreed'">待确认</el-tag>
              <el-tag disable-transitions v-if="row.orderStatus == 'toBeSold'">待确认</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="billStatus" label="对账状态" min-width="120" >
            <template  slot-scope="scope">
                <div v-if="scope.row.billStatus == 'no_billing'"><el-tag>未对账</el-tag> </div>
              <div v-if="scope.row.billStatus == 'billed'"><el-tag type="success">已对账</el-tag></div>
              <div v-if="scope.row.billStatus == 'in_bill' && scope.row.documentStatus == 'submit'"><el-tag type="warning">对账中</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="ownerName" label="资产管理员" width="140" sortable="custom" />
          <el-table-column prop="userTime" label="投入使用日期" width="160" sortable="custom" />
          <el-table-column prop="position" label="常用位置" width="160" sortable="custom" />
          <el-table-column prop="approvalUserName" label="确认人" width="120" sortable="custom" />
          <el-table-column prop="approvalInstructions" label="确认说明" width="160" sortable="custom" />
          <el-table-column prop="saleInstructions" label="售出说明" width="160" sortable="custom" />
          
          <el-table-column prop="remark" label="备注" width="250" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="updateTime" label="更新时间" width="180" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="!userInfo.roleCode.split(',').includes('property_sale_approve')&&userInfo.userId!=='admin'"  @click="addOrUpdateHandle(scope.row.id, 'approve')" v-if="scope.row.orderStatus=='toBeAgreed'">确认</el-button>
              <el-button size="mini" type="text" :disabled="userInfo.userId!==scope.row.ownerId&&userInfo.userId!=='admin'"  @click="addOrUpdateHandle(scope.row.id, 'sale')" v-if="scope.row.orderStatus=='toBeSold'">确认售出</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script> 
import { propertySaleOrderList,delPropertySaleOrder} from '@/api/bimPropertyCategory/index'
import Form from './Form'
import moment from 'moment'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { updateSortBatch } from '@/api/masterDataManagement/index'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'saleManagement',
  components: { Form, SuperQuery },
  mixins: [AbProjectMixin],
  data() {  

    return {
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '出售', symbol: 'like', searchType: 1, width: 120 },
        { field: 'propertyName', fieldValue: '', label: '资产名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderStatus', fieldValue: '', label: '状态', symbol: 'like', searchType: 4, width: 120,
          options:[
            {label:"待确认",value:"toBeAgreed",},
            {label:"待售出",value:"toBeSold",},
            {label:"已售出",value:"sold",},
            {label:"已拒绝",value:"rejected",},
          ] 
        },
      ],
 
      superQueryVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      activeName: 'supplierPage',
      visible: false,
      warehouseFormVisible: true,
      treeData: [],
      leftFlag: false,
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      superForm:{},
      form: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        orderNo:"",
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },

      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'fullName'
      },
      rules: {
        code: [{}]
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      columnList: [],
      createTimeArr: [],

      superQueryJson: [
        {
          prop: 'orderNo',
          label: '出售单号',
          type: 'input'
        },
        {
          prop: 'propertyName',
          label: '资产名称',
          type: 'input'
        },
        {
          prop: 'propertyCode',
          label: '资产编码',
          type: 'input'
        },
        {
          prop: 'propertySpec',
          label: '资产规格',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '客户名称',
          type: 'input'
        },
        {
          prop: 'propertyCategoryName',
          label: '分类',
          type: 'input'
        }, 
        {
          prop: 'projectName',
          label: '所属项目',
          type: 'input'
        }, 
        {
          prop: 'createByName',
          label: '申请人',
          type: 'input'
        }, 
        {
          prop: 'orderStatus',
          label: "出售单状态",
          type: 'select',
          options: [
          {label:"待确认",value:"toBeAgreed",},
            {label:"待售出",value:"toBeSold",},
            {label:"已售出",value:"sold",},
            {label:"已拒绝",value:"rejected",},
          ]
        },
        {
          prop: 'billStatus',
          label: "对账状态",
          type: 'select',
          options: [
          {label:"未对账",value:"no_billing",},
            {label:"已对账",value:"billed",},
            {label:"对账中",value:"in_bill",},
          ]
        },
        {
          prop: 'ownerName',
          label: '资产管理员',
          type: 'input'
        },  
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  computed: {
    ...mapState('user', ['token']),
    ...mapGetters(['userInfo'])
  },
  async created() {
    this.superForm = this.form
    await this.awaitAbProject()
      console.log("this.abProjectSwitchVisible",this.abProjectSwitchVisible);
    await this.initData()
  },

 
  methods: {
 
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.superForm.orderItems[0].asc = order !== 'descending'
      this.superForm.orderItems[0].column = newProp
      this.initData()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },


    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },

 
    async initData() {
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.superForm.startTime = this.createTimeArr[0] + ' 00:00:00'
        this.superForm.endTime = this.createTimeArr[1] + ' 23:59:59'
      } else {
        this.superForm.startTime = ''
        this.superForm.endTime = ''
      }
      this.listLoading = true
      console.log("this.abProjectSwitchVisible",this.abProjectSwitchVisible);
      if(this.abProjectSwitchVisible) this.superForm.projectId=this.userInfo.projectId


      await propertySaleOrderList(this.superForm).then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      Object.keys(this.form).forEach((key) => {
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.form = {
        code: '',
        name: '',
        orderNo:"",

        pageNum: 1,
        pageSize: 20,
        orderItems: [
        
          {
            asc: false,
            column: 'create_time'

          }
        ]
      }
      this.searchList = [
      { field: 'orderNo', fieldValue: '', label: '报废单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'propertyName', fieldValue: '', label: '资产名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderStatus', fieldValue: '', label: '状态', symbol: 'like', searchType: 4, width: 120,
          options:[
          {label:"待确认",value:"toBeAgreed",},
            {label:"待售出",value:"toBeSold",},
            {label:"已售出",value:"sold",},
            {label:"已拒绝",value:"rejected",},
          ] 
        },
      ]
      this.$refs.SuperQuery.conditionList = []

      this.search('basic')
    },
 
    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init('', 'add')
      })
    },
    addOrUpdateHandle(id,type) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, type)
        })
        // }, 600);
      }
    },
 
   
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          delPropertySaleOrder(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
            location.reload()
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, btnType)
      })
    },

  }
}
</script>
<style scoped>
::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 40px !important;
  line-height: 40px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
<style scoped>
.title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
