<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0">
        <div class="title_box">
          <h2 v-if="!leftFlag">线索</h2>
          <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div v-if="!leftFlag"> <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
          </el-input></div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="data" :props="defaultProps" :default-expand-all="expands" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">

            <span class="text" :title="data.fullName">{{ data.fullName }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="10">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.clueName" placeholder="请输入线索名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col style="width: 180px;">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="programmelist.length">
            <span class="text">方案：</span>
            <el-button :class="[programmetitle==item.fullName?'is-reverse':'']" size="mini" v-for="item in programmelist" :key="item.id" @click="()=>{programmetitle=item.fullName,isopen=false}">{{item.fullName}}</el-button>
            <el-popover placement="bottom-end" trigger="click" v-if="programmelist1.length" style="margin-left: 10px;">
              <el-button slot="reference" icon="el-icon-arrow-down" size="mini"></el-button>
              <div class="plan-list-item" v-for="(o, i) in programmelist1" :key="i">
                <el-link :class="['plan-list-name',programmetitle==o.fullName?'is-reverse':'']" :underline="false" class="" @click="()=>{programmetitle=o.fullName,isopen=false}">{{ o.fullName }}
                </el-link>
              </div>
            </el-popover>
          </el-col>
          <el-button style="float: right;margin-right: 20px;border:none" size="mini" icon="icon-ym icon-ym-filter" @click="superQueryVisible = true">高级查询</el-button>
          <el-button v-if="!!programmetitle&&programmelist.length" :class="['search-button',isopen?'is-reverse':'']" size="mini" @click="isopen=!isopen">{{isopen?'收起筛选':'展开筛选'}} <i class="el-icon-arrow-up" v-if="isopen"></i><i class="el-icon-arrow-down" v-else></i></el-button>
        </el-form>
      </el-row>
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16" v-if="isopen">
        <programme :columnOptions="superQueryJson" :programmetitle="programmetitle" @close="isopen = false" @superQuery="superQuerySearch"></programme>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="display: block;">
          <topOpts @add="addOrUpdateHandle('','add')" v-if="categoryId=='clue'">
            <el-button size="mini" type="success" @click="DemandPoolaction">放入需求池</el-button>
            <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
          </topOpts>
          <div class="JNPF-common-head-right" style="float: right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableList" @selection-change="handleSelectionChange" :hasC="categoryId=='clue'" custom-column :hasNO="false" row-key="id">
          <!-- <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" title='点击拖动' />
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column prop="clueName" label="线索名称" width="160" />
          <el-table-column prop="nextTime" label="下次联系时间" width="180" />
          <el-table-column prop="source" label="线索来源" width="150">
            <template slot-scope="scope">
              {{sourcefunction(scope.row.source)}}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机" width="140" />
          <el-table-column prop="telephone" label="电话" width="120" />
          <el-table-column prop="email" label="邮箱" width="160" />
          <el-table-column prop="provinceText" label="省" width="120" />
          <el-table-column prop="cityText" label="市" width="140" />
          <el-table-column prop="areaText" label="区" width="140" />
          <el-table-column prop="address" label="地址" width="200" />
          <el-table-column prop="industry" label="客户行业" width="140">
            <template slot-scope="scope">
              {{industryfunction(scope.row.industry)}}
            </template>
          </el-table-column>
          <el-table-column prop="level" label="客户级别" width="130">
            <template slot-scope="scope">
              {{levelfunction(scope.row.level)}}
            </template>
          </el-table-column>
          <el-table-column prop="ownerUser" label="负责人" width="120" />
          <el-table-column prop="createByName" label="创建人" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id,'edit')" @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id,'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @close="refreshDataList" />
    <depForm v-if="clueVisible" ref="depForm" @close="cluerefreshDataList" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getCluemanagementlist, deleteCluemanagement } from "@/api/basicData/index";
import { getAdvancedQueryList } from "@/api/system/advancedQuery";
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import programme from "./programme.vue";
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  exportTpl,
  updateSortBatch
} from '@/api/system/billRule'
import Form from './Form'
import depForm from './depForm'
import Sortable from 'sortablejs'
// import TypeList from './components/index'
export default {
  name: 'cluemanagement',
  components: {
    Form,
    depForm,
    ExportForm,
    // TypeList
    SuperQuery,
    programme
  },
  data() {
    return {
      exportFormVisible:false,
      data: [{ fullName: '线索', id: 'clue' }, { fullName: '线索池', id: 'pool' }],
      clueVisible: false,
      programmetitle: '',
      superQueryJson: [
        {
          prop: 'clueName',
          label: "线索名称",
          type: 'input'
        },
        { // 日期选择器
          prop: 'nextTime',
          label: '下次联系时间',
          type: 'datetime',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          pickerOptions: {}
        },
        { // 下拉选
          prop: 'level',
          label: '客户级别',
          type: 'select',
          options: [
            { label: 'A（重点客户）', value: '1' },
            { label: 'B（普通客户）', value: '2' },
            { label: 'C（非优先客户）', value: '3' }
          ] // 注意，此options从接口异步获取，改变值时注意内存地址
        },
        { // 下拉选
          prop: 'source',
          label: '线索来源',
          type: 'select',
          options: [
            { label: '促销', value: '1' },
            { label: '搜索引擎', value: '2' },
            { label: '广告', value: '3' },
            { label: '转介绍', value: '4' },
            { label: '线上注册', value: '5' },
            { label: '线上询价', value: '6' },
            { label: '预约上门', value: '7' },
            { label: '陌拜', value: '8' },
            { label: '电话咨询', value: '9' },
            { label: '邮件咨询', value: '10' }
          ] // 注意，此options从接口异步获取，改变值时注意内存地址
        },
        {
          prop: 'mobile',
          label: "手机",
          type: 'input'
        },
        {
          prop: 'telephone',
          label: "电话",
          type: 'input'
        },
        {
          prop: 'email',
          label: "邮箱",
          type: 'input'
        },
        {
          prop: 'address',
          label: "地址",
          type: 'input'
        },
        { // 下拉选
          prop: 'industry',
          label: '客户行业',
          type: 'select',
          options: [
            { label: 'IT', value: '1' },
            { label: '金融业', value: '2' },
            { label: '房地产', value: '3' },
            { label: '商业服务', value: '4' },
            { label: '运输/物流', value: '5' },
            { label: '生产', value: '6' },
            { label: '政府', value: '7' },
            { label: '文化传媒', value: '8' }
          ] // 注意，此options从接口异步获取，改变值时注意内存地址
        },
        {
          prop: 'ownerUser',
          label: '负责人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        // { // 下拉选
        //   prop: 'grade',
        //   label: '等级',
        //   type: 'select',
        //   options: this.gradeList // 注意，此options从接口异步获取，改变值时注意内存地址
        // },
        // { // 日期选择器（区间）
        //   prop: 'customerRecognitionTime',
        //   label: '认定日期',
        //   type: 'daterange',
        //   valueFormat: "yyyy-MM-dd",
        //   startPlaceholder: '开始日期',
        //   endPlaceholder: '结束日期',
        //   pickerOptions: this.global.timePickerOptions
        // },
      ],
      programmelist1: [],
      programmelist: [],
      partentOrChild: 'partent',
      superQueryVisible: false,
      isopen: false,
      tableList: [],
      total: 0,
      btnLoading: false,
      listLoading: true,
      categoryId: '',
      listQuery: {},
      listQuery1: {
        status: '',
        clueName: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {}
      },

      formVisible: false,
      categoryList: [],
      filterText: "",
      leftFlag: false,
      expands: true,
      refreshTree: true,
      treeData: [],
      displayFlag: false,
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      sourcelist: [
        { label: '促销', value: '1' },
        { label: '搜索引擎', value: '2' },
        { label: '广告', value: '3' },
        { label: '转介绍', value: '4' },
        { label: '线上注册', value: '5' },
        { label: '线上询价', value: '6' },
        { label: '预约上门', value: '7' },
        { label: '陌拜', value: '8' },
        { label: '电话咨询', value: '9' },
        { label: '邮件咨询', value: '10' }
      ],
      industrylist: [
        { label: 'IT', value: '1' },
        { label: '金融业', value: '2' },
        { label: '房地产', value: '3' },
        { label: '商业服务', value: '4' },
        { label: '运输/物流', value: '5' },
        { label: '生产', value: '6' },
        { label: '政府', value: '7' },
        { label: '文化传媒', value: '8' }
      ],
      levellist: [
        { label: 'A（重点客户）', value: '1' },
        { label: 'B（普通客户）', value: '2' },
        { label: 'C（非优先客户）', value: '3' }
      ],
      selectArr: []
    }
  },
  computed: {
    currMenuId() {
      return (this.$route.meta.modelId || '') + this.partentOrChild
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
    this.getcategoryTree()

  },
  mounted() {
    // this.rowDrop(); //声明表格拖动排序方法
  },

  methods: {
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tabForm.columnList.filter(item => !!item.label && !!item.prop)
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
          exportType: '1203',
          exportName: '线索',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    DemandPoolaction() {
      if (!this.selectArr.length) return this.$message.error('请选择数据')
      let idlist = this.selectArr.map(item => item.id)
      this.clueVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(idlist)
      })
    },
    sourcefunction(val) {
      let _data = this.sourcelist.filter(item => item.value == val)[0]
      return _data ? _data.label : val
    },
    industryfunction(val) {
      let _data = this.industrylist.filter(item => item.value == val)[0]
      return _data ? _data.label : val
    },
    levelfunction(val) {
      let _data = this.levellist.filter(item => item.value == val)[0]
      return _data ? _data.label : val
    },
    refreshDataList(val) {
      this.formVisible = false
      if (val) this.initData()
    },
    cluerefreshDataList(val) {
      this.clueVisible = false
      if (val) this.initData()
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    handleSelectionChange(val) {
      this.selectArr = val
    },
    rowDrop() {
      const el = this.$refs.tabForm.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableList.splice(evt.oldIndex, 1)[0];
          this.tableList.splice(evt.newIndex, 0, targetRow);
          console.log(this.tableList);
          let att = []
          this.tableList.forEach((item, index) => {
            let obj = {
              id: item.id,
              sortCode: index,
            }
            att.push(obj)
          });
          console.log(att);
          updateSortBatch(att).then(res => {
            this.$message.success("批量修改排序成功")
            this.initData()
          })
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      this.categoryId = node.data.id
      this.listQuery.status = node.data.id
      this.search();
    },
    getcategoryTree() {
      this.$nextTick(() => {
        this.$refs.treeBox.setCurrentKey('clue') // 默认选中节点第一个
        this.categoryId = 'clue'
        this.listQuery.status = 'clue'
        this.initData()
      })
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    // // 设置默认展开
    // setexpand(expands) {
    //   console.log("expands", expands);
    //   this.refreshTree = false
    //   this.expands = expands
    //   this.$nextTick(() => {
    //     this.refreshTree = true
    //     localStorage.setItem("customExpandsFlag", expands)

    //   })
    // },
    // // 展开或折叠全部
    // toggleExpand(expands) {
    //   this.refreshTree = false
    //   this.expands = expands
    //   this.$nextTick(() => {
    //     this.refreshTree = true
    //   })
    // },

    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
      }
      if (this.categoryId == 'pool') {

      }
      getCluemanagementlist(query).then(res => {
        this.tableList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
      getAdvancedQueryList(this.currMenuId).then(row => {
        this.programmelist = row.data.list.splice(0, 1)
        this.programmelist1 = row.data.list
      })
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteCluemanagement(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    exportTpl(id) {
      this.$confirm('您确定要导出该单据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportTpl(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tabForm'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.listQuery.status = this.categoryId
      this.search()
    }
  }
}
</script>
<style scoped lang="scss">
.plan-list-item {
  height: 34px;
  align-items: center;
  line-height: 34px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: #f5f7fa;
  }
  .plan-list-name {
    .el-link--inner {
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
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
