<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="treeBox_bot gjsearch" ref="fangan">
          <div style="width: 200px;">
            <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
          </div>
          <div style="min-width: 190px;margin-left: 10px;">
            <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
              {{$t('common.search')}}</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{$t('common.reset')}}
            </el-button>
          </div>
          <div ref="programmes" style="flex:1;overflow: auto;white-space: nowrap;">
            <div v-if="programmelist.length">
              <span class="text">方案：</span>
              <el-button :class="[programmetitle==item.fullName?'is-reverse':'']" size="mini" v-for="item in programmelist" :key="item.id" @click="actionreverse(item)">{{item.fullName}}</el-button>
              <el-popover placement="bottom-end" trigger="click" v-if="programmelist1.length" style="margin-left: 10px;">
                <el-button slot="reference" icon="el-icon-arrow-down" size="mini"></el-button>
                <div :class="['plan-list-item',programmetitle==o.fullName?'is-reverse':'']" v-for="(o, i) in programmelist1" :key="i" @click="actionreverse(o)">
                  <el-link class="plan-list-name" :underline="false">{{ o.fullName }}
                  </el-link>
                </div>
              </el-popover>
            </div>
          </div>
          <!-- <div style="width: 82px;">
            <el-button style="border:none;padding: 7px 8px;" size="mini" icon="icon-ym icon-ym-filter" @click="superQueryVisible = true">高级查询</el-button>
          </div> -->
        </div>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="addOrUpdateHandle('','add')">
              <el-button size="mini" type="primary" @click="Tagtype">标记跟进类型</el-button>
            </topOpts>
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
          <JNPF-table hasC @selection-change="handeleInfoData" ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" custom-column>
            <el-table-column prop="serviceDescription" label="跟进内容" sortable="custom" min-width="180" />
            <el-table-column prop="nextTime" label="下次联系时间" sortable="custom" min-width="180" />
            <el-table-column prop="visitForm" label="跟进方式" sortable="custom" min-width="180" />
            <el-table-column prop="visitPlanName" label="拜访计划" sortable="custom" min-width="180" />
            <el-table-column prop="name" label="相关客户" sortable="custom" min-width="180" />
            <el-table-column prop="contactsName" label="相关联系人" sortable="custom" min-width="180" />
            <el-table-column prop="businessName" label="相关商机" sortable="custom" min-width="180" />
            <el-table-column prop="contractNo" label="相关合同" sortable="custom" min-width="180" />
            <el-table-column prop="receivablesNo" label="相关回款" sortable="custom" min-width="180" />
            <!-- <el-table-column prop="name1" label="相关产品" sortable="custom" min-width="180" /> -->
            <el-table-column prop="recordsValid" label="跟进类型" sortable="custom" min-width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.recordsValid=='0'"><el-tag type="danger">无效跟进</el-tag></div>
                <div v-else-if="scope.row.recordsValid=='1'"><el-tag type="success">有效跟进</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" label="有效跟进人" sortable="custom" min-width="180" />
            <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180" />
            <el-table-column prop="createByName" label="创建人" min-width="100" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                        查看详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData">
          </pagination>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-radio-group v-model="recordsValid">
        <el-radio :label="1">有效跟进</el-radio>
        <el-radio :label="0">无效跟进</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="recordsValidactive">确 定</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <!-- 高级查询 -->
    <programme :programmefrom="programmefrom" @superQuery="superQuerySearch"></programme>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" @saveproject="getAdvancedQuery" />
  </div>
</template>

<script>

import programme from "@/views/CRMmanagement/components/programme.vue";
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getAdvancedQueryList } from "@/api/system/advancedQuery";
import { getServiceRecordList, deleteServiceRecord } from '@/api/customerManagement/index'
import { updaterecordsValid } from '@/api/CRMmanagement/index'
import Form from './Form'
export default {
  name: 'serviceRecords',
  components: { Form, programme, SuperQuery },
  data() {
    return {
      recordsValid: '',
      dialogVisible: false,
      selectData: [],
      datalist: [],
      superQueryJson: [
        {
          prop: 'serviceDescription',
          label: "跟进内容",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'nextTime',
          label: '下次联系时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '下次联系开始时间',
          endPlaceholder: '下次联系结束时间',
          pickerOptions: {}
        },
        { // 下拉选
          prop: 'visitForm',
          label: '跟进方式',
          type: 'select',
          options: []
        },
        {
          prop: 'visitPlanName',
          label: "拜访计划",
          type: 'input'
        },
        {
          prop: 'name',
          label: "相关客户",
          type: 'input'
        },
        {
          prop: 'contactsName',
          label: "相关联系人",
          type: 'input'
        },
        {
          prop: 'businessName',
          label: "相关商机",
          type: 'input'
        },
        {
          prop: 'contractNo',
          label: "相关合同",
          type: 'input'
        },
        {
          prop: 'receivablesNo',
          label: "相关回款",
          type: 'input'
        },
        { // 下拉选
          prop: 'recordsValid',
          label: '跟进类型',
          type: 'select',
          options: [
            { label: '有效跟进', value: 1 },
            { label: '无效跟进', value: 0 }
          ]
        },
        {
          prop: 'createUserName',
          label: "有效跟进人",
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
      programmefrom: {},
      superQueryVisible: false,
      programmetitle: '',
      programmelist1: [],
      programmelist: [],
      partentOrChild: 'partent',
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      initListQuery: {
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        serviceDescription: "",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        createTimeArr: [],
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      listQuery: {},
      total: 0,
      formVisible: false,
    }
  },
  computed: {
    currMenuId() {
      return (this.$route.meta.modelId || '') + this.partentOrChild
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  beforeDestroy() {
    window.onresize = null
  },
  mounted() {
    this.getAdvancedQuery()
  },
  methods: {
    recordsValidactive() {
      if (!this.recordsValid && this.recordsValid !== 0) return this.$message.error('请选择跟进类型')
      let a = {
        idList: this.selectData,
        recordsValid: this.recordsValid
      }
      updaterecordsValid(a).then(res => {
        this.$message.success('更新成功')
        this.dialogVisible = false
        this.closeForm(true)
      })
    },
    Tagtype() {
      if (!this.selectData.length) return this.$message.error('请先选择数据')
      this.dialogVisible = true
    },
    handeleInfoData(val) {
      this.selectData = val
    },
    getAdvancedQuery() {
      getAdvancedQueryList(this.currMenuId).then(row => {
        this.datalist = row.data.list
        this.switchStyle()
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    actionreverse(item) {
      this.programmefrom = item
      this.programmetitle = item.fullName
      this.isopen = false
    },
    async switchStyle() {
      await this.$nextTick();
      const programmes = this.$refs.programmes ? this.$refs.programmes.offsetWidth : 0
      if (programmes <= 100) {
        this.programmelist = []
        this.programmelist1 = this.datalist.slice(0)
        Math.floor(programmes / 100)
      } else {
        let num = Math.floor(programmes / 100)
        if (num - 1 > this.datalist.length) {
          num = this.datalist.length + 1
        }
        this.programmelist = this.datalist.slice(0, num - 1)
        this.programmelist1 = this.datalist.slice(num - 1)
      }
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getServiceRecordList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (['cooperativePartnerCode', 'cooperativePartnerName'].includes(prop)) { newProp = prop }
      else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
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
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.programmefrom = {}
      this.programmetitle = ''
      this.initData()
    },
    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteServiceRecord(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style scoped lang="scss">
.is-reverse {
  color: #fff !important;
  background-color: #3fb9f8;
}
.plan-list-item {
  & + & {
    margin-top: 5px;
  }
  height: 34px;
  align-items: center;
  line-height: 34px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  &:hover {
    background-color: #3fb9f8;
  }
  .plan-list-name {
    &:hover {
      color: #606266;
    }
    .el-link--inner {
      // width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.gjsearch {
  display: flex;
  background-color: #fff;
  padding: 8px;
  justify-content: space-between;
  align-items: center;
}
.treeBox_bot {
  .search-button {
    float: right;
    margin-right: 0;
    border: none;
    background-color: #fff;
    color: #606266;
  }
  .is-reverse {
    color: #fff;
    background-color: #3fb9f8;
  }
}
</style>