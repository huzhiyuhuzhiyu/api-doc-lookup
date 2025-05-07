<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.orderNo" placeholder="请输入领用单号" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.maintainerIdText" placeholder="请输入领用人" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="orderForm.requisitionType" placeholder="请选择类型" clearable style="width: 100%;">
                <el-option v-for="(item, index) in collectionList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div></div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO custom-column style="padding-bottom: 50px;" customKey="JNPFTableKey_860811">
          <el-table-column prop="orderNo" label="领用单号" width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.orderNo
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="requisitionType" label="类型" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.requisitionType == 'requisition'"><el-tag type="success">领用</el-tag></div>
              <div v-else-if="scope.row.requisitionType == 'back'"><el-tag>归还</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="maintainerIdText" label="领用人" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.requisitionType=='requisition'?scope.row.maintainerIdText:''}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime" label="领用日期" width="180" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.requisitionType=='requisition'?scope.row.collectionTime:''}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="maintainerIdText1" label="归还人" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.requisitionType=='back'?scope.row.maintainerIdText:''}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime1" label="归还日期" width="180">
            <template slot-scope="scope">
              <div>{{scope.row.requisitionType=='back'?scope.row.collectionTime:''}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUserRelation(scope.row,'look')" size="mini">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <Form1 v-if="formVisible1" ref="Form1" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { CollectionandreturnList } from '@/api/dailyManagement/Maintenance'
import Form from '../equipmentrequisition/Form.vue'
import Form1 from '../equipmentreturn/Form.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
export default {
  mixins: [getProjectList],
  name: 'equipmentrequisitionreturnrecords',
  components: { Form, SuperQuery, Form1 },
  data() {
    return {
      isProjectSwitch: '',
      formVisible1: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "领用单号",
          type: 'input'
        },
        {
          prop: 'requisitionType',
          label: "类型",
          type: 'select',
          options: [
            { label: "领用", value: "requisition" },
            { label: "归还", value: "back" }
          ]
        },
        {
          prop: 'maintainerIdText',
          label: "领用人",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'collectionTime',
          label: '领用日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'maintainerIdText',
          label: "归还人",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'returnTime',
          label: '归还日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryVisible: false,
      btnLoading: false,
      orderFormreturn: {
        returnTime: '',
        id: ''
      },
      form: {
        returnTime: ''
      },
      tableData: [],
      listLoading: false,
      collectionList: [
        { label: "领用", value: 'requisition' },
        { label: "归还", value: 'back' }
      ],
      orderForm: {
        projectId: '',
        equipmentType: 'equipment',
        orderNo: '',
        maintainerIdText: '',
        requisitionType: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      total: 0,
      formVisible: false,
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.initData()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.dataFormSubmit()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    dataFormSubmit() {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.formVisible1 = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      CollectionandreturnList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false

      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.orderForm = {
        equipmentType: 'equipment',
        orderNo: '',
        auditStatus: '',
        documentStatus: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      }
      this.dataFormSubmit()
    },
    handleUserRelation(val, btnType) {
      if (val.requisitionType=='requisition') {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(val.id, btnType)
        })
      } else {
        this.formVisible1 = true
        this.$nextTick(() => {
          this.$refs.Form1.init(val.id, btnType)
        })
      }
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />