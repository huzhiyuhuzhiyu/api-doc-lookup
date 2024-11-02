<template>
  <div class="JNPF-common-layout">
    <div v-if="!formVisible" class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.maintainerIdText" placeholder="请输入归还人" clearable @keydown.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker v-model="createRequirementDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="归还开始日期" end-placeholder="归还结束日期" clearable :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-select v-model="orderForm.useApplication" placeholder="请选择归还目的" clearable style="width: 100%;">
                <el-option v-for="(item, index) in [{label:'设备保养',value:'maintain'},{label:'设备维修',value:'repair'}]" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="4">
            <el-form-item>
              <el-select v-model="orderForm.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
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
          <!-- <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="handleUserRelation('', 'add')" /> -->
          <div class="JNPF-common-head-right" style="float: right">
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
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column>
          <el-table-column prop="collectionTime" label="归还日期" min-width="180" sortable="custom"></el-table-column>
          <el-table-column prop="maintainerIdText" label="归还人" min-width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="200" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" min-width="120"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="handleUserRelation(scope.row.id, 'edit')" @del="handleDel(scope.row.id)" :editDisabled="scope.row.documentStatus === 'submit'" :delDisabled="scope.row.documentStatus === 'submit'">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { CollectionandreturnList, deleteCollectionandreturn } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
export default {
  name: 'sparepartsReturn',
  components: { Form, SuperQuery },
  data() {
    return {
      createRequirementDate: [],
      superQueryVisible: false,
      superQueryJson: [
        { // 日期选择器（区间）
          prop: 'collectionTime',
          label: '归还日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '申请开始日期',
          endPlaceholder: '申请结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'maintainerIdText',
          label: "归还人",
          type: 'input'
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
        }
      ],
      tableData: [],
      listLoading: false,
      orderFormone: {
        requisitionType: 'back',
        equipmentType: 'equipment',
        maintainerIdText: '',
        useApplication: '',
        collStartTime: '',
        collEndTime: '',
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
      superQuery: {}
    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormone))
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
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
    search() {
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
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      this.jnpf.searchTimeFormat(this.orderForm, this.createRequirementDate, 'collStartTime', 'collEndTime')
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
      this.createRequirementDate = []
      this.orderForm = JSON.parse(JSON.stringify(this.orderFormone))
      this.search()
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteCollectionandreturn(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />


