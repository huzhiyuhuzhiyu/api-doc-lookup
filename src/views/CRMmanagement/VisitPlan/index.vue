<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="treeBox_bot gjsearch" ref="fangan">
          <div style="width: 200px;">
            <el-input v-model="listQuery.visitName" placeholder="请输入拜访计划名称" clearable @keyup.enter.native="search()" />
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
          <div class="JNPF-common-head" style="display:block;line-height:34px">
            <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="addOrUpdateHandle('','add')">
            </topOpts>
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column>
            <el-table-column prop="visitName" label="拜访计划名称" min-width="160" />
            <el-table-column prop="visitTime" label="预计拜访时间" min-width="180" />
            <el-table-column prop="customerName" label="客户名称" min-width="180" />
            <el-table-column prop="contactsName" label="联系人" min-width="180" />
            <el-table-column prop="businessName" label="商机名称" min-width="180" />
            <el-table-column prop="visitAim" label="拜访目的" min-width="180">
              <template slot-scope="scope">
                {{visitGoalfaction(scope.row.visitAim)}}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="180" />
            <el-table-column prop="delayReason" label="延期原因" min-width="180" />
            <el-table-column prop="delayRemark" label="延期备注" min-width="180" />
            <el-table-column prop="cancelReason" label="取消原因" min-width="180" />
            <el-table-column prop="cancelRemark" label="取消备注" min-width="180" />
            <el-table-column prop="activityName" label="跟进记录内容" min-width="180" />
            <el-table-column prop="ownerUserName" label="负责人" min-width="180" />
            <el-table-column prop="status" label="状态" min-width="180">
              <template slot-scope="scope">
                {{visitStatusfaction(scope.row.status)}}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)" :editDisabled="!!scope.row.activityName">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="completetheplan(scope.row.id)" v-if="!scope.row.activityName">
                        完成计划
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="delayplan(scope.row.id)" v-if="!scope.row.activityName">
                        延迟计划
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="cancelplan(scope.row.id)" v-if="!scope.row.activityName">
                        取消计划
                      </el-dropdown-item>
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
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <complete v-if="completeVisible" ref="complete" @close="closeForm" />
    <delay v-if="delayVisible" ref="delay" @close="closeForm" />
    <cancel v-if="cancelVisible" ref="cancel" @close="closeForm" />
    <!-- 高级查询 -->
    <programme :programmefrom="programmefrom" @superQuery="superQuerySearch"></programme>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" @saveproject="getAdvancedQuery" />
  </div>
</template>

<script>
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { deletecrmVisit, getcrmVisitlist } from '@/api/CRMmanagement/index'
import complete from './complete'
import delay from './delay'
import cancel from './cancel'
import Form from './Form'
import programme from "@/views/CRMmanagement/components/programme.vue";
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getAdvancedQueryList } from "@/api/system/advancedQuery";
export default {
  name: 'myContacts',
  components: {
    SuperQuery,
    programme,
    Form,
    complete,
    delay,
    cancel
  },
  data() {
    return {
      visitStatusList: [
        { label: '已完成', value: 'complete' },
        { label: '未完成', value: 'uncomplete' },
        { label: '已取消', value: 'cancel' },
      ],
      delayVisible: false,
      cancelVisible: false,
      completeVisible: false,
      visitGoalList: [],
      datalist: [],
      superQueryJson: [
        {
          prop: 'visitName',
          label: "拜访计划名称",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'visitTime',
          label: '预计拜访时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '回访开始时间',
          endPlaceholder: '回访结束时间',
          pickerOptions: {}
        },
        {
          prop: 'customerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'contactsName',
          label: "联系人",
          type: 'input'
        },
        {
          prop: 'businessName',
          label: "商机名称",
          type: 'input'
        },
        { // 下拉选
          prop: 'visitAim',
          label: '拜访目的',
          type: 'select',
          options: []
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        {
          prop: 'delayReason',
          label: "延期原因",
          type: 'input'
        },
        {
          prop: 'delayRemark',
          label: "延期备注",
          type: 'input'
        },
        {
          prop: 'cancelReason',
          label: "取消原因",
          type: 'input'
        },
        {
          prop: 'cancelRemark',
          label: "取消备注",
          type: 'input'
        },
        {
          prop: 'activityName',
          label: "跟进记录内容",
          type: 'input'
        },
        {
          prop: 'ownerUserName',
          label: "负责人",
          type: 'input'
        },
        { // 下拉选
          prop: 'visitStatus',
          label: '状态',
          type: 'select',
          options: [
            { label: '已完成', value: 'complete' },
            { label: '未完成', value: 'uncomplete' },
            { label: '已取消', value: 'cancel' },
          ]
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
        returnVisitNo: '',
        pageNum: 1,
        pageSize: 20,
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
    this.getDictionaryType()
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
    visitStatusfaction(val) {
      let _data = this.visitStatusList.filter(item => item.value == val)[0]
      return _data ? _data.label : val
    },
    getAdvancedQuery() {
      getAdvancedQueryList(this.currMenuId).then(row => {
        this.datalist = row.data.list
        this.switchStyle()
      })
    },
    visitGoalfaction(val) {
      let _data = this.visitGoalList.filter(item => item.enCode == val)[0]
      return _data ? _data.fullName : val
    },
    // 获取客户满意度、回访形式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "Purposeofvisit") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.visitGoalList = response.data.list
                  this.superQueryJson.forEach(item => {
                    if (item.prop == 'visitAim') {
                      item.options = response.data.list.map(o => {
                        return { label: o.fullName, value: o.enCode }
                      })
                    }
                  })
                })
              }
            })
          }
        })
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletecrmVisit(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    delayplan(id) {
      this.delayVisible = true
      this.$nextTick(() => {
        this.$refs.delay.init(id)
      })
    },
    cancelplan(id) {
      this.cancelVisible = true
      this.$nextTick(() => {
        this.$refs.cancel.init(id)
      })
    },
    completetheplan(id) {
      this.completeVisible = true
      this.$nextTick(() => {
        this.$refs.complete.init(id)
      })
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
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
      getcrmVisitlist(this.listQuery).then(res => {
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
      this.completeVisible = false
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
      this.programmetitle = ''
      this.initData()
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