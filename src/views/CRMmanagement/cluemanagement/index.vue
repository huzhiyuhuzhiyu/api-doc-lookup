<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0">
        <div class="title_box">
          <h2 v-if="!leftFlag">线索</h2>
          <!-- <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span> -->
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
      <div class="treeBox_bot gjsearch" ref="fangan">
        <div style="width: 200px;">
          <el-input v-model="listQuery.clueName" placeholder="请输入线索名称" clearable @keyup.enter.native="search()" />
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
        <div class="JNPF-common-head" style="display: block;line-height:34px">
          <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="addOrUpdateHandle('','add')" v-if="categoryId=='clue'">
            <el-button size="mini" type="success" @click="DemandPoolaction">放入线索池</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button> -->
            <el-button size="mini" v-has="'btn_import'" type="primary" icon="el-icon-plus" @click="importProductFun">导入</el-button>
            <el-button type="primary" v-has="'btn_export'" icon="el-icon-download" @click="exportForm" :disabled="!tableList.length">导出</el-button>
          </topOpts>
          <el-button v-if="categoryId=='pool'" size="mini" type="success" @click="Demandaction">分配线索</el-button>
          <div class="JNPF-common-head-right" style="float: right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableList" @selection-change="handleSelectionChange" hasC custom-column fixedNO row-key="id" :setColumnDisplayList="columnList">
          <!-- <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" title='点击拖动' />
            </template>
          </el-table-column> -->
          <!-- <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column> -->
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
          <!-- <el-table-column prop="provinceText" label="省" width="120" />
          <el-table-column prop="cityText" label="市" width="140" />
          <el-table-column prop="areaText" label="区" width="140" /> -->
          <el-table-column prop="areaText" label="地址" width="160" />
          <el-table-column prop="address" label="详细地址" width="200" />
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
          <el-table-column prop="ownerUser" label="负责人" width="120" key="123" />
          <el-table-column prop="createByName" label="创建人" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'" @edit="addOrUpdateHandle(scope.row.id,'edit')" @del="handleDel(scope.row.id)">
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
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" drag :auto-upload="false" :limit="1" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
    <!-- 高级查询 -->
    <programme :programmefrom="programmefrom" @superQuery="superQuerySearch"></programme>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" @saveproject="initData" />
    <Form v-if="formVisible" ref="Form" @close="refreshDataList" />
    <depForm v-if="clueVisible" ref="depForm" @close="cluerefreshDataList" @goto="gotopool" />
    <fpForm v-if="clueVisiblefp" ref="fpForm" @close="cluerefreshDataList" @gotoclue="gotoclue" />
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct" :http-request="UploadProduct" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { getCluemanagementlist, deleteCluemanagement, saleCluemanagementpoolModel } from "@/api/basicData/index";
import { getAdvancedQueryList } from "@/api/system/advancedQuery";
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import programme from "../components/programme.vue";
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from './Form'
import depForm from './depForm'
import fpForm from './fpForm'
import Sortable from 'sortablejs'
export default {
  name: 'cluemanagement',
  components: {
    Form,
    depForm,
    fpForm,
    ExportForm,
    SuperQuery,
    programme
  },
  data() {
    return {
      file:{},
      uploadVisib: false,
      columnList: ["createByName", "createTime"],
      exportFormVisible: false,
      data: [{ fullName: '线索', id: 'clue' }, { fullName: '线索池', id: 'pool' }],
      clueVisible: false,
      clueVisiblefp: false,
      programmetitle: '',
      programmefrom: {},
      superQueryJson: [
        {
          prop: 'clueName',
          label: "线索名称",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'nextTime',
          label: '下次联系时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: {}
        },
        { // 下拉选
          prop: 'level',
          label: '客户级别',
          type: 'select',
          options: [
            { label: 'A(重点客户)', value: '1' },
            { label: 'B(普通客户)', value: '2' },
            { label: 'C(非优先客户)', value: '3' }
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
          label: "详细地址",
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
          prop: 'createByName',
          label: '创建人',
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
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
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
      sourcelist: [],
      industrylist: [],
      levellist: [],
      selectArr: [],
      fanganheight: 0,
      datalist: []
    }
  },
  computed: {
    currMenuId() {
      return (this.$route.meta.modelId || '') + this.partentOrChild
    },
    ...mapState('user', ['token']),
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
    getbimProductAttributes('585429807173478149').then(res => {
      this.sourcelist = res.data.list.length ? res.data.list : []
    })
    getbimProductAttributes('585430224678692613').then(res => {
      this.levellist = res.data.list.length ? res.data.list : []
    })
    getbimProductAttributes('585430056520656645').then(res => {
      this.industrylist = res.data.list.length ? res.data.list : []
    })
    this.getcategoryTree()
  },
  mounted() {
    // this.rowDrop(); //声明表格拖动排序方法
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    submit() {
      this.UploadProduct(this.file)
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 导入产品
    importProductFun() {
      this.uploadVisib = true
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/线索导入模板.xlsx')
      a.click()
    },
    // importFun() {
    //   this.$refs.UploadProduct.$el.querySelector('input').click()
    // },
    // 上传
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      //调用上传文件接口
      saleCluemanagementpoolModel(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.formLoading = false
          this.loadingText = ''
        } else {
          this.handleMessage(res.data)
        }
        this.uploadVisib = false
        this.initData()
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.uploadVisib = false
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: "error",
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: "mini",
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: "none",
                textAlign: "center",
                // width:"20%",
                margin: "0 5px 0 5px ",
              },
            }, '下载导入错误数据')
          ]
        ),
      })
      return
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    //去线索池
    gotopool() {
      this.clueVisible = false
      this.$nextTick(() => {
        this.$refs.treeBox.setCurrentKey('pool')
        this.categoryId = 'pool'
        this.listQuery.status = 'pool'
        this.search();
      })
    },
    gotoclue() {
      this.clueVisiblefp = false
      this.$nextTick(() => {
        this.$refs.treeBox.setCurrentKey('clue')
        this.categoryId = 'clue'
        this.listQuery.status = 'clue'
        this.search();
      })
    },
    async switchStyle() {
      await this.$nextTick();
      const programmes = this.$refs.programmes.offsetWidth
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
    actionreverse(item) {
      this.programmefrom = item
      this.programmetitle = item.fullName
      this.isopen = false
    },
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
    Demandaction() {
      if (!this.selectArr.length) return this.$message.error('请选择数据')
      let idlist = this.selectArr.map(item => item.id)
      this.clueVisiblefp = true
      this.$nextTick(() => {
        this.$refs.fpForm.init(idlist)
      })
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
      let _data = this.sourcelist.filter(item => item.enCode == val)[0]
      return _data ? _data.fullName : val
    },
    industryfunction(val) {
      let _data = this.industrylist.filter(item => item.enCode == val)[0]
      return _data ? _data.fullName : val
    },
    levelfunction(val) {
      let _data = this.levellist.filter(item => item.enCode == val)[0]
      return _data ? _data.fullName : val
    },
    refreshDataList(val) {
      this.formVisible = false
      if (val) this.initData()
    },
    cluerefreshDataList(val) {
      this.clueVisible = false
      this.clueVisiblefp = false
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
    // rowDrop() {
    //   const el = this.$refs.tabForm.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    //   this.sortable = Sortable.create(el, {
    //     ghostClass: 'sortable-ghost',
    //     setData: function (dataTransfer) {
    //       dataTransfer.setData('Text', '')
    //     },
    //     onEnd: evt => {
    //       const targetRow = this.tableList.splice(evt.oldIndex, 1)[0];
    //       this.tableList.splice(evt.newIndex, 0, targetRow);
    //       console.log(this.tableList);
    //       let att = []
    //       this.tableList.forEach((item, index) => {
    //         let obj = {
    //           id: item.id,
    //           sortCode: index,
    //         }
    //         att.push(obj)
    //       });
    //       console.log(att);
    //       updateSortBatch(att).then(res => {
    //         this.$message.success("批量修改排序成功")
    //         this.initData()
    //       })
    //     }
    //   });
    // },
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
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.jnpf.searchTimeFormat(this.listQuery, 'createTimerange', 'startTime', 'endTime')
      let query = {
        ...this.listQuery,
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
        this.datalist = row.data.list
        this.switchStyle()
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
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tabForm'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.programmetitle = ''
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery1))
      this.listQuery.status = this.categoryId
      this.search()
    }
  }
}
</script>
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
  padding: 8px 10px;
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
