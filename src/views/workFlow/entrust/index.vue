<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" style="height:auto">
        <el-tab-pane label="系统流程" name="system" />
        <el-tab-pane label="自定义流程" name="custom" />
      </el-tabs>
      <div class="JNPF-common-layout-center">
        <div class="tag-group JNPF-common-search-box treeBox_bot"
          style="display:flex;align-items:center;padding:5px 0 5px 10px;margin-bottom:0px">
          <el-radio-group v-model="listQuery.flowCategory" style="background-color:#fff;">
            <el-radio-button label="" style="margin:3px 0">全部</el-radio-button>
            <el-radio-button style="margin:2px 0;border-left:1px solid #DCDFE6" v-for="item in categoryList" :key="item.enCode" :label="item.enCode">{{ item.fullName }}</el-radio-button>
          </el-radio-group>
        </div>
        <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16" style="margin-top:5px">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle()" addText="新建委托"></topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
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
          <JNPF-table v-loading="listLoading" :data="list" custom-column ref="dataTable" customKey="JNPFTableKey_781936">
            <el-table-column prop="toUserName" label="被委托人" min-width="100" />
            <el-table-column prop="flowName" label="委托流程" min-width="140" />
            <el-table-column prop="flowCategory" label="流程分类" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.flowCategory | getCategoryText(categoryList) }}
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" min-width="120" :formatter="jnpf.tableDateFormatDayTime" />
            <el-table-column prop="endTime" label="结束时间" min-width="120" :formatter="jnpf.tableDateFormatDayTime" />
            <!-- <el-table-column prop="status" label="状态" width="100" align="center">
              <template slot-scope="scope">
                <el-tag type="info" v-if='scope.row.status == 1'>未开始</el-tag>
                <el-tag type="danger" v-else-if='scope.row.status == 2'>已失效</el-tag>
                <el-tag type="primary" v-else>委托中</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column prop="description" label="委托说明" min-width="160"/>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.$index, scope.row.id)">
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <Form :businessFlag="listQuery.businessFlag" v-if="formVisible" ref="Form" @refreshDataList="reset" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { FlowDelegateList, Delete, getFlowDelegateList } from '@/api/workFlow/FlowDelegate'
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getChildrenList } from '@/api/systemData/dictionary'
export default {
  name: 'workFlow-entrust',
  components: { Form,SuperQuery },
  data() {
    return {
      keyword: '',
      list: [],
      total: 0,
      listLoading: true,
      activeName: 'system',
      initListQuery: {
        businessFlag: true,    // 1 是 3  0 是 1和2
        flowCategory: '',
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false
      },
      listQuery: {},
      formVisible: false,
      categoryList: [],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'flowName',
          label: "委托流程",
          type: 'input'
        },
        {
          prop: 'creatorTime',
          label: "创建时间",
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
        },
        // {
        //   prop: 'status',
        //   label: "状态",
        //   type: 'select',
        //   options: [{ label: '未开始', value: 1 }, { label: '已失效', value: 2 }]
        // },
      ],
      flowType:'businessType'
    }
  },
  filters: {
    getCategoryText(id, categoryList) {
      let item = categoryList.filter(o => o.enCode == id)[0]
      return item && item.fullName ? item.fullName : ''
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.getDictionaryData(this.flowType)
    // this.initData()
  },
  watch: {
    activeName() {
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.categoryIndex = -1
      this.initData()
      this.getDictionaryData(this.flowType)
    },
    'listQuery.flowCategory':function(newVal){
      this.initData()
    },
  },
  methods: {
    getDictionaryData(type) {
      if (type === 'businessType'){
        getChildrenList('600602988351917829').then(res=>{
          this.categoryList = res.data
        })
      }else{
        this.$store.dispatch('base/getDictionaryData', { sort: type }).then((res) => {
          this.categoryList = res
        })
      }
    },
    changeCategory(item, index) {
      this.listQuery.flowCategory = item.enCode
      this.categoryIndex = index
      this.initData()
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    search() {
      this.initData()
    },
    reset() {
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
    initData() {
      this.listLoading = true
      this.listQuery.businessFlag = this.activeName === 'system' ? true : false
      this.flowType = this.listQuery.businessFlag ? 'businessType' : 'WorkFlowCategory'
      getFlowDelegateList(this.listQuery).then(res => {
        this.list = res.data.records
        let currTime = this.jnpf.toDate(new Date())
        for (let i = 0; i < this.list.length; i++) {
          let e = this.list[i];
          let startTime = this.jnpf.toDate(e.startTime);
          let endTime = this.jnpf.toDate(e.endTime);
          // e.startTime = startTime
          // e.endTime = endTime
          // 0-委托中 1-未开始 2-已失效
          let status = 0
          if (startTime > currTime) {
            status = 1
          } else if (endTime < currTime) {
            status = 2
          } else {
            status = 0
          }
          e.status = status
        }
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => this.listLoading = false)
    },
    handleDel(index, id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        this.asyncDel(index, id);
      }).catch(() => { });
    },
    asyncDel(index, id) {
      Delete(id).then(res => {
        this.list.splice(index, 1);
        this.$message({
          type: 'success',
          message: res.msg
        });
      })
    },
    formatter(row, column) {
      return this.jnpf.dateFormat(row, column)
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />