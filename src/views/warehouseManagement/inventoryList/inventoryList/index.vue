<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.orderNo" @keyup.enter.native="search()" placeholder="单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.originType" placeholder="业务类型"  
                style="width: 100%;">
                <el-option v-for="(item, index) in list" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.partnerName" @keyup.enter.native="search()" placeholder="合作伙伴"
                clearable />
            </el-form-item>
          </el-col>
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
          <topOpts  :isJudgePer="true" :addPerCode="'btn_add'" @add="addSupplier( )">
              <!-- <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button>
              <el-button v-has="'btn_import'" size="mini" type="primary" icon="el-icon-plus" @click="importFun">导入</el-button> -->
              <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
                icon="el-icon-download" @click="exportForm">导出</el-button>
            </topOpts>

          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table hasC @selection-change="handeleInfoData" ref="dataTable" v-loading="listLoading" :data="tableData" border :setColumnDisplayList="columnList"
          :fixedNO="true" @sort-change="sortChange" custom-column>
          <el-table-column prop="orderNo" label="出入库单号" sortable="custom" min-width="160">
          
          </el-table-column>
          <el-table-column prop="sourceType" label="业务类型" sortable="custom" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.sourceType == 'send_return'">发退货单</div>
              <div v-if="scope.row.sourceType == 'picking_return'">领退料单</div>
              <div v-if="scope.row.sourceType == 'purchase_delivery_return'">采购收退货单</div>
              <div v-if="scope.row.sourceType == 'outside_delivery_return'">外协收退货单</div>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="合作伙伴名称" sortable="custom" min-width="160" >
            <template slot-scope="scope">
                <el-link type="primary" @click.native="viewFun(scope.row.id,  'look')">{{
                  scope.row.partnerName
                  }}</el-link>
              </template>
          </el-table-column>
          <el-table-column prop="partnerCode" label="合作伙伴编码" sortable="custom" min-width="160" />
          <el-table-column prop="documentStatus" label="单据状态" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
              <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
            </template>
          
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180" />
          <el-table-column prop="createByName" label="创建人" width="120" />
          <el-table-column label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
                <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'" :delDisabled="scope.row.documentStatus=='submit'"  :editDisabled="scope.row.documentStatus=='submit'" @edit="editFun(scope.row.id,'edit')"
                @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown"> 
                    <el-dropdown-item @click.native="viewFun(scope.row.id, 'look')">查看详情</el-dropdown-item>

                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>

              </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData">
        </pagination>
      </div>
    </div>


    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
 <!-- 高级查询 -->
 <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getInventoryDetailList,getInventorySummaryData } from '@/api/warehouseManagement/inventory'
import { getWarehouseList } from '@/api/warehouseManagement/inboundAndOutbound'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from './Form'
export default {
  name: 'myCustomer',
  components: { Form ,ExportForm,SuperQuery},
  data() {
    return {   
      columnList:["partnerCode","createByName",],
      exportFormVisible: false,
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      list: [
        { label: "发退货单", value: "send_return" },
        { label: "领退料单", value: "picking_return" },
        { label: "采购收退货单", value: "purchase_delivery_return" },
        { label: "外协收退货单", value: "outside_delivery_return" },
      ],
      superQueryVisible: false,

      initListQuery: { 
        sourceType: "",
        orderNo: "",
        pageNum: 1,
        partnerName:"",
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
      selectData: [],
      totalList:[],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "单号",
          type: 'input'
        },
        {
          prop: 'sourceType',
          label: "业务类型",
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: "合作伙伴名称",
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: "合作伙伴编码",
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'input'
        },
       
       
      ],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    
    this.getInventorySummaryDataFun()
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    viewFun(id,type){
      this.formVisible=true
      this.$nextTick(() => {
        this.$refs.Form.init(id, true)
      })
    },
    editFun(id,type){
      this.formVisible=true
      this.$nextTick(() => {
        this.$refs.Form.init(id, false)
      })
    },
    addSupplier(){
      this.formVisible=true
      this.$nextTick(() => {
        this.$refs.Form.init("", false)
      })
    },
     // 合计处理
   
    getInventorySummaryDataFun(){
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      }) 
      this.listQuery.pageNum = 1
      getWarehouseList(this.listQuery).then(res => {

        this.tableData = res.data.records ? res.data.records : []
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableData, 'dataTable')


    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let query = this.initListQuery
        let _data = {
          ...query,
          exportType: '1012',
          exportName: '出入库列表',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.initListQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
      // 下载模板
      downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/出入库导入模板.xlsx')
      a.click()
    },



    importFun() {

      this.$refs.UploadProduct.$el.querySelector('input').click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      formData.append("customerSea", "high_seas")
      //调用上传文件接口
      uploadProduct(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.initData()
          this.formLoading = false
          this.loadingText = ''
        } else {
          this.handleMessage(res.data)
        }

      }).catch(err => {
        this.$message.error(`文件上传失败`)
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在出入库数据错误！'),
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







    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    handeleInfoData(val) {
      this.selectData = val
    },
    initData() {
      this.getInventorySummaryDataFun()
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
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
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },

    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    releaseFun() {
      if (this.selectData.length) {
        let idList = this.selectData.map(item => item.id)
        releasePartner(idList).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "释放成功",
            duration: 1500,
          })
        }).catch(() => { })
      } else {
        this.$message.warning('请选择您要释放的客户数据！')
      }
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
