<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>工具分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getCategoryTrees(true)">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item> -->
              <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入工具编码" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.name" placeholder="请输入工具名称" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-select v-model="form.productCategoryId" placeholder="请选择工具类型" clearable>
                <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="form.state" placeholder="请选择工具状态" clearable>
                <el-option v-for="(item, index) in equipmentStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <topOpts @add="addOrUpdateHandle('', false, 'add')">
              <el-button size="mini" type="primary" v-has="'tool_addBtn'" icon="el-icon-plus" @click="propertyAddFun('', false, 'add','propertyAdd')">从资产新建</el-button>
             <el-button size="mini" type="primary" icon="el-icon-printer" @click="batchFun">设置归还</el-button>
              <el-button size="mini" type="primary" icon="el-icon-printer" @click="printView('p038')">打印工具二维码</el-button>
              <!-- <el-button size="mini" type="primary" icon="el-icon-printer" @click="setrepairUserId">批量设置维修人</el-button> -->
              <!-- <el-button size="mini" v-has="'btn_import'" type="primary" icon="el-icon-plus"
                @click="importProductFun">导入</el-button>
              <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download" @click="exportForm"
                :disabled="!tableData.length">导出</el-button> -->
            </topOpts>
          </div>
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
        <JNPF-table v-if="istable" :data="tableData" ref="dataTable" @sort-change="sortChange" custom-column hasC
          @selection-change="handleSelectionChange" :fixedNO="true">
          <el-table-column prop="name" label="工具名称" min-width="200" sortable="custom" />
          <el-table-column prop="code" label="工具编码" min-width="200" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch === '1'"
            key="projectName" />
          <el-table-column prop="categoryName" label="所属分类" min-width="200" sortable="custom" />
          <el-table-column prop="inspectionUserName" label="点检人" min-width="200" sortable="custom" />
          <el-table-column prop="maintenanceUserName" label="保养人" min-width="200" sortable="custom" />
          <el-table-column prop="requisitionFlag" label="工具领用状态" min-width="200" sortable="custom" >
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.requisitionFlag">已领用</el-tag>
              <el-tag disable-transitions v-if="!row.requisitionFlag">未领用</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="state" label="工具状态" width="140" align="center" sortable="custom" fixed="right">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.state == 'normal'">正常</el-tag>
              <el-tag type="warning" disable-transitions v-if="row.state == 'repair'">维修</el-tag>
              <el-tag type="danger" disable-transitions v-if="row.state == 'discard'">报废</el-tag>
              <el-tag type="danger" disable-transitions v-if="row.state == 'sale'">售出</el-tag>
              <el-tag disable-transitions v-if="row.state == 'out'">调出</el-tag>
            </template>
          </el-table-column>
  
          
          <el-table-column prop="position" label="常用位置" min-width="200" sortable="custom" />
             <el-table-column prop="accessoryReturnFlag" label="是否归还" min-width="140"  sortable="custom" >
              <template slot-scope="scope">
                <div v-if="scope.row.accessoryReturnFlag"><el-tag type="success">是</el-tag></div>
                <div v-if="!scope.row.accessoryReturnFlag"><el-tag type="danger">否</el-tag></div>
              </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, false, 'edit')" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true, 'look','propertyAdd')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" drag :auto-upload="false"
        :file-list="fileList" :limit="1" :on-exceed="handleFileexceed" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
            icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <share v-if="shareVisible" ref="share" @close="closeForm"></share>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
      <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" :params="workOrderForm"
      :fullName="fullName" ref="printForm" />
          <el-dialog title="批量设置为归还" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="batchVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="requestForm"  label-width="120px" label-position="left">
          
          <el-col :span="24">
            <el-form-item label="是否设置为归还" prop="accessoryFlag">
               <el-select v-model="requestForm.flag" placeholder="请选择" >
                  <el-option v-for="(item, index) in accessoryFlagList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
         
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitFun()">
          提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {batchAccessoryReturnState} from '@/api/bimPropertyCategory/index'
import { excelExport, equEquipmentupload } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getPositionList, deleteEquEquipment } from '@/api/permission/position'
import { getCategoryTrees, getEquEquipmentList, plmsync } from '@/api/basicData/index'
import Form from './Form'
import share from './share'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
import PrintDialog from '@/components/no_mount/printDialog'
export default {
  mixins: [getProjectList],
  name: 'toolBasicInformation',
  components: { Form, PrintBrowse, share, SuperQuery, ExportForm,PrintDialog },
  data() {
    return {
           accessoryFlagList:[
        {label:"是",value:true},
        {label:"否",value:false},
      ],
      batchVisible:false,
      formId:"",
      printVisible:false,
      fileList: [],
      loadingText: '',
      file: {},
      uploadVisib: false,
      columnList: [],
      exportFormVisible: false,
      istable: false,
      isProjectSwitch: '',
      superQueryJson: [
        {
          prop: 'code',
          label: "工具编码",
          type: 'input'
        }, {
          prop: 'name',
          label: "工具名称",
          type: 'input'
        },
        { // 下拉选
          prop: 'deviceType',
          label: '工具类型',
          type: 'select',
          options: [
            { label: '正常工具', value: 'normal' },
            { label: '虚拟工具', value: 'virtually' }
          ]
        },
        
        
         
       
      
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        { // 下拉选
          prop: 'state',
          label: '工具状态',
          type: 'select',
          options: [
            { label: '正常', value: 'normal' },
            { label: '维修', value: 'repair' },
            { label: '报废', value: 'discard' },
            {
              value: "spare",
              label: "备用"
            },
            {
              value: "stop",
              label: "停用"
            },
            {
              value: "abnormal",
              label: "异常"
            }
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
      superQueryVisible: false,
      shareVisible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      organizeIdTree: [],
      listQuery: {
        projectId: '',
        name: "", // 工具名称
        code: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        classAttribute: "tool"
      },
      form: {
        productCategoryId: "",
        state: "",
      },
      typeList: [],
      equipmentStateList: [
        {
          value: "normal",
          label: "正常"
        },
        {
          value: "repair",
          label: "维修"
        },
        {
          value: "discard",
          label: "报废"
        },
        {
          value: "spare",
          label: "备用"
        },
        {
          value: "stop",
          label: "停用"
        },
        {
          value: "abnormal",
          label: "异常"
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      selectList: [],
      printBrowseVisible: false,
        requestForm:{
        idList:[],
        flag:true,
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.istable = true
    if (localStorage.getItem("deviceProfilesetFlag")) {
      let roleFlag = JSON.parse(localStorage.getItem('deviceProfilesetFlag'))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
    this.getCategoryTrees(true)
    // this.getDictionaryType()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    
    batchFun(){
      if(!this.selectList.length)return this.$message.error("请先选择您要归还的工具数据")
     this.requestForm.idList=this.selectList.map(item => item.id);
      this.batchVisible=true
    },
    submitFun(){
      let msg=this.requestForm.flag?'已归还':'不归还'
           this.$confirm(this.$t('确定将所选的数据设置为'+msg+'吗？'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          batchAccessoryReturnState(this.requestForm).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '批量标记成功',
              duration: 1500
            })
            this.batchVisible=false
            this.initData()
          })
        })
        .catch(() => { })
    },
    submit() {
      this.UploadProduct(this.file)
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    handleFileChange(file, fileList) {
      // 当文件状态变为成功时，表示上传成功，可以替换文件
      this.file = file.raw
    },
    handleFileexceed(files) {
      this.$refs['uploadRef'].clearFiles()
      this.$nextTick(() => {
        this.$refs['uploadRef'].handleStart(files[0])
      })
    },
    // 导入产品
    importProductFun() {
      this.uploadVisib = true
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/工具导入模板.xlsx')
      a.click()
    },
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.listLoading = true
      var formData = new FormData()
      formData.append("file", data)
      //调用上传文件接口
      equEquipmentupload(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.listLoading = false
          this.loadingText = ''
        } else {
          this.handleMessage(res.data)
        }
        this.uploadVisib = false
        this.initData()
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.uploadVisib = false
        this.listLoading = false
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
    //导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
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
          exportType: '1011',
          exportName: '工具档案',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url, res.data.name)
        }).catch(() => { })
      }
    },
    //设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("deviceProfilesetFlag", expands)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 获取数据字典——等级
    getDictionaryType() {
      getDictionaryType().then(res => {
        console.log("rescc", res)
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "grade") {
                let id = resp.id
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  console.log("response", response)
                  this.gradeList = response.data.list
                })
              }
            })

          }
        })
      })
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'factoryFloor' || prop === 'mountedPlaces' || prop === 'partnerName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (newProp === 'create_by_name') { newProp = 'create_by' }
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.shareVisible = false
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getCategoryTrees(isInit) {
      this.treeLoading = true
      let listQuery = {
        page: 1,
        limit: 999,
        keyword: '',
        classAttribute: 'tool'
      }
      getCategoryTrees(listQuery).then(res => {
        console.log(99, res)
        this.treeData = res.data
        // this.getTypeList(res.data)
        this.$nextTick(() => {
          this.treeLoading = false
          if (isInit) this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    // 获取工具类型
    // getTypeList(data) {
    //   let arr = []
    //   let fn = (data) => {
    //     data.forEach(item => {
    //       arr.push(item)
    //       if (item.childrenList && item.childrenList.length) {
    //         fn(item.childrenList)
    //       }
    //     })
    //   }
    //   fn(data)
    //   this.typeList = arr
    // },
    initData() {
      this.listLoading = true
      this.listQuery = {
        ...this.listQuery,
        ...this.form
      }
      this.listQuery.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getEquEquipmentList(this.listQuery).then(res => {
        this.tableData = res.data.records
        // this.tableData.forEach(item=>{
        //   if (item.state === 'normal'){
        //     item.state = '正常'
        //   }
        //   if (item.state === 'repair'){
        //     item.state = '维修'
        //   }
        //   if (item.state === 'maintain'){
        //     item.state = '保养'
        //   }
        //   if (item.state === 'discard'){
        //     item.state = '报废'
        //   }
        // })
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        classAttribute: "tool"
      }
      this.form = {
        state: '',
        productCategoryId: ''
      }

      this.getCategoryTrees(true)
      this.search()

    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node)
      if (this.form.productCategoryId === data.id) return
      this.form.productCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.search()
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },

    addOrUpdateHandle(id, type, types,key) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, types,key)
      })

    },
    propertyAddFun(id, type, types,key){
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, types,key)
      })

    },


    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteEquEquipment(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    setrepairUserId() {
      if (!this.selectList.length) return this.$message.error("请选择工具!")
      let idList = this.selectList.map(item => item.id);
      this.shareVisible = true
      this.$nextTick(() => {
        this.$refs.share.init(idList)
      })
    },
 
    printWarehouse(enCode) {
      if (!this.selectList.length) return this.$message.error("请选择您要打印的数据!")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectList.map(item => item.id).join(',')
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    closePrint() {
      this.printVisible = false
    },
    // 选择模版弹窗
    printView(enCode) {
      if (!this.selectList.length) return this.$message.error("请选择您要打印的数据!")
      this.enCode = enCode
      this.fullName = '工具二维码'
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },
    handleSelectionChange(val) {
      this.selectList = val
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<!-- <style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

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
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}</style> -->
