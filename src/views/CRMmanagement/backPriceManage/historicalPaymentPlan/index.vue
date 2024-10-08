<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="treeBox_bot gjsearch" ref="fangan">
          <div style="width: 200px;">
            <el-input v-model="listQuery.customerName" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
          </div>
          <div style="min-width: 190px;margin-left: 10px;">
            <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
              {{$t('common.search')}}</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{$t('common.reset')}}
            </el-button>
          </div>
          <!-- <div style="min-width: 260px;">
            <el-button class="btnBox" size="mini" @click="btnsearch2()">近3天</el-button>
            <el-button class="btnBox" size="mini" @click="btnsearch3()">近7天</el-button>
            <el-button class="btnBox" size="mini" @click="btnsearch4()">近30天</el-button>
          </div> -->
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
        </div>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head" style="display:block;line-height:34px">
            <topOpts :isJudgePer="true" :addPerCode="false" @add="addOrUpdateHandle('','add')">
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" custom-column>
            <el-table-column prop="customerName" label="客户名称" min-width="180" />
            <el-table-column prop="contractNo" label="合同编号" min-width="180" />
            <el-table-column prop="num" label="期数" min-width="100" />
            <el-table-column prop="planReceivablesMoney" label="计划回款金额(元)" min-width="160" />
            <el-table-column prop="planReceivablesData" label="计划回款日期" min-width="160" />
            <!-- <el-table-column prop="remindInAdvance" label="提前几天提醒" min-width="130" /> -->
            <el-table-column prop="receivablesType" label="回款方式" min-width="140">
              <template slot-scope="scope">
                {{returnTypeVisitForm(scope.row.receivablesType)}}
              </template>
            </el-table-column>
            <el-table-column prop="ownerUserName" label="负责人" min-width="120" />
            <el-table-column prop="practiceMoney" label="实际回款金额(元)" min-width="160" />
            <el-table-column prop="practiceTime" label="实际回款时间" min-width="180" />
            <el-table-column prop="unreceivedMoney" label="未回款金额" min-width="140" />
            <el-table-column prop="receivablesStatus" label="回款状态" min-width="120">
              <template slot-scope="scope">
                <div><el-tag :type="receivedStatusForm(scope.row.receivablesStatus)=='回款完成'?'success':'danger'">{{receivedStatusForm(scope.row.receivablesStatus)}}</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="200" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column label="操作" width="90" fixed="right">
              <template slot-scope="scope">
                <tableOpts :hasEdit="false" @del="handleDel(scope.row.id)">
                  <!-- <el-button type="text" @click.native="addOrUpdateHandle(scope.row.id, 'look')">查看详情</el-button> -->
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData">
            计划回款总金额：<span :style="{color:totalplanReceivablesMoney*1<0?'#e2231a':'#2b9939',marginRight:'5px'}">{{totalplanReceivablesMoney}}</span>元 / 实际回款总金额：<span :style="{color:totalpracticeMoney*1<0?'#e2231a':'#2b9939',marginRight:'5px'}">{{totalpracticeMoney}}</span>元 / 未回款总金额：<span :style="{color:totalunreceivedMoney*1<0?'#e2231a':'#2b9939',marginRight:'5px'}">{{totalunreceivedMoney}}</span>元
          </pagination>
        </div>
      </div>
    </div>
    <!-- <Form v-if="formVisible" ref="Form" @close="closeForm" /> -->
    <!-- 高级查询 -->
    <programme :programmefrom="programmefrom" @superQuery="superQuerySearch"></programme>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" @saveproject="getAdvancedQuery" />
  </div>
</template>

<script>
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { deletecrmReceivablesPlan, getcrmReceivablesPlanlist } from '@/api/CRMmanagement/index'
// import Form from './Form'
import programme from "@/views/CRMmanagement/components/programme.vue";
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getAdvancedQueryList } from "@/api/system/advancedQuery";
export default {
  name: 'myContacts',
  components: {
    SuperQuery,
    programme,
    // Form
  },
  data() {
    return {
      deliveryDateArr: [],
      receivedStatusList: [
        { fullName: '已关闭', enCode: 'close' },
        { fullName: '回款完成', enCode: 'payment' }
      ],
      datalist: [],
      payList: [],
      superQueryJson: [
        {
          prop: 'customerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'contractNo',
          label: "合同编号",
          type: 'input'
        },
        {
          prop: 'num',
          label: "期数",
          type: 'input'
        },
        {
          prop: 'planReceivablesMoney',
          label: "计划回款金额（元）",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'planReceivablesData',
          label: '计划回款日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '回款开始日期',
          endPlaceholder: '回款结束日期',
          pickerOptions: {}
        },
        {
          prop: 'remindInAdvance',
          label: "提前几天提醒",
          type: 'input'
        },
        { // 下拉选
          prop: 'receivablesType',
          label: '回款方式',
          type: 'select',
          options: []
        },
        {
          prop: 'ownerUserName',
          label: "负责人",
          type: 'input'
        },
        {
          prop: 'practiceMoney',
          label: "实际回款金额（元）",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'practiceTime',
          label: '实际回款时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '回款开始时间',
          endPlaceholder: '回款结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'unreceivedMoney',
          label: "未回款金额",
          type: 'input'
        },
        { // 下拉选
          prop: 'receivablesStatus',
          label: '回款状态',
          type: 'select',
          options: [
            { label: '已关闭', value: 'close' },
            { label: '回款完成', value: 'payment' }
          ]
        },
        {
          prop: 'remark',
          label: "备注",
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
        receivablesStatus: 'payment',
        planReceivablesDataEndTime: '',
        planReceivablesDataStartTime: '',
        customerName: '',
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
      totalplanReceivablesMoney: 'xxx',
      totalpracticeMoney: 'xxx',
      totalunreceivedMoney: 'xxx'
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
    // // 为近3天  
    // btnsearch2() {
    //   const end = new Date();
    //   const start = "";
    //   end.setDate(end.getDate() + 3);
    //   this.deliveryDateArr = ["", end];
    //   this.listQuery.planReceivablesDataStartTime = ""
    //   this.listQuery.planReceivablesDataEndTime = this.dateFun(this.deliveryDateArr[1])
    //   this.search()
    // },
    // // 为近7天  
    // btnsearch3() {
    //   let end = new Date()
    //   let start = ""
    //   end.setDate(end.getDate() + 7);
    //   this.deliveryDateArr = ["", end];
    //   this.listQuery.planReceivablesDataStartTime = ""
    //   this.listQuery.planReceivablesDataEndTime = this.dateFun(this.deliveryDateArr[1])
    //   this.search()
    // },
    // // 为近30天  
    // btnsearch4() {
    //   let end = new Date()
    //   let start = ""
    //   end.setDate(end.getDate() + 30);
    //   this.deliveryDateArr = ["", end];
    //   this.listQuery.planReceivablesDataStartTime = ""
    //   this.listQuery.planReceivablesDataEndTime = this.dateFun(this.deliveryDateArr[1])
    //   this.search()
    // },
    dateFun(dateStr) {
      const date = new Date(dateStr);
      // 获取年份、月份和日期  
      const year = date.getFullYear(); // 获取年份  
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份 (注意：月份从0开始，因此加1，并补齐两位数)  
      const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐两位数  
      // 拼接成年月日格式  
      const formattedDate = `${year}-${month}-${day}`;
      console.log("forma", formattedDate);
      return formattedDate
    },
    getAdvancedQuery() {
      getAdvancedQueryList(this.currMenuId).then(row => {
        this.datalist = row.data.list
        this.switchStyle()
      })
    },
    receivedStatusForm(val) {
      let _data = this.receivedStatusList.filter(item => item.enCode == val)[0]
      return _data ? _data.fullName : val
    },
    returnTypeVisitForm(val) {
      let _data = this.payList.filter(item => item.enCode == val)[0]
      return _data ? _data.fullName : val
    },
    // 获取付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "paymentMethod") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.payList = response.data.list
                  this.superQueryJson.forEach(item => {
                    if (item.prop == 'receivablesType') {
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
        deletecrmReceivablesPlan(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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
      getcrmReceivablesPlanlist(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
      let listQueryall = JSON.parse(JSON.stringify(this.initListQuery))
      listQueryall.pageSize = -1
      getcrmReceivablesPlanlist(listQueryall).then(res => {
        this.totalplanReceivablesMoney = 0
        this.totalpracticeMoney = 0
        this.totalunreceivedMoney = 0
        for (let i = 0; i < res.data.records.length; i++) {
          this.totalplanReceivablesMoney = this.jnpf.math('add', [this.totalplanReceivablesMoney, res.data.records[i].planReceivablesMoney * 1])
          this.totalpracticeMoney = this.jnpf.math('add', [this.totalpracticeMoney, res.data.records[i].practiceMoney * 1])
          this.totalunreceivedMoney = this.jnpf.math('add', [this.totalunreceivedMoney, res.data.records[i].unreceivedMoney * 1])
        }
      })
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
      this.$refs.SuperQuery.conditionList = []
      this.programmefrom = {}
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