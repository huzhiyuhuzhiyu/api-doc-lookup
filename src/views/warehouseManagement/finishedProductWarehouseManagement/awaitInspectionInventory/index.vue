<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.productDrawingNo" placeholder="品名规格" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.processName" placeholder="工序名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.productCode" placeholder="产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.batchNumber" placeholder="批次号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="batchInspectFun()">批量检验</el-button>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm('tabForm')">导出</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
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
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableData" custom-column row-key="id" :fixedNO="true"
          @sort-change="sortChange" :setColumnDisplayList="columnList" hasC @selection-change="handeleselectFun">
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" sortable="custom" />

          <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" width="120" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
          <el-table-column prop="inventoryQuantity" label="库存数量" width="120" sortable="custom" />
          <el-table-column prop="safeInventory" label="安全库存" min-width="120" sortable="custom" />
          <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />
          <el-table-column prop="inspectionResults" label="检验结果" sortable="custom" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.inspectionResults == 'unInspect'">待检验</div>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseName" label="仓库名称" min-width="180" sortable="custom"> </el-table-column>
          <el-table-column prop="shelfSpaceName" label="库位名称" min-width="120" sortable="custom" />
          <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
          <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
          <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
          <el-table-column prop="oil" label="油脂" min-width="120" sortable="custom" />
          <el-table-column prop="clearance" label="游隙" min-width="120" :key="100" sortable="custom"></el-table-column>
          <el-table-column prop="packagingMethod" label="包装方式" min-width="120" :key="100"
            sortable="custom"></el-table-column>
          <el-table-column prop="specialRequire" label="特殊要求" min-width="120" :key="100"
            sortable="custom"></el-table-column>
          <el-table-column prop="standardValue" label="规值" min-width="120" :key="100"
            sortable="custom"></el-table-column>
          <el-table-column prop="aperture" label="孔径" min-width="120" :key="100" sortable="custom"></el-table-column>
          <el-table-column prop="colour" label="颜色" min-width="120" :key="100" sortable="custom"></el-table-column>
          <el-table-column prop="latestStorageTime" label="最新入库时间" min-width="180" sortable="custom" />
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize"
          @pagination="initData">
          <div class="text">
            <span>合计：</span>
            <span style="margin-left: 10px">库存数量：{{ totalInventory }}</span>
          </div>
        </pagination>
      </div>
    </div>
    <el-dialog title='设置库存' :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="inventoryVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-width="120px">
        <el-form-item label="检验结果" prop="inspectionResults">
          <el-select v-model="dataForm.inspectionResults" placeholder="请选择检验结果" style="width: 100%;">
            <el-option v-for="(item, index) in inspectionResultsList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inventoryVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交</el-button>
      </span>
    </el-dialog>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getbimProductAttributesList, getbimProductAttributes } from "@/api/masterDataManagement/index";
import { getWarehouseList, getInventoryLineReport } from '@/api/basicData/index' // 仓库 
import SuperQuery from '@/components/SuperQuery/index.vue'
import { inventoryWarehouseList, batchInspect } from '@/api/warehouseManagement/inventory'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'


export default {
  name: 'awaitInspectionInventory',
  components: { SuperQuery, ExportForm },
  props: {
    warehouseCode: "",
  },
  data() {
    return {
      btnLoading:false,

      inventoryVisible: false,
      dataRule: {
        inspectionResults: [

          { required: true, message: '检验结果不能为空', trigger: 'change' },
        ],
      },
      dataForm: {
        inspectionResults: "",
        idList: [],
      },
      inspectionResultsList: [
        { label: "合格", value: "qualified", },
        { label: "不合格", value: "unqualified", },
        { label: "让步接收", value: "concessive_acceptance", },
        { label: "返修", value: "repair", },
      ],

      exportFormVisible: false,
      superQueryVisible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],

      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      leftFlag: false,
      tableQuery: {

        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        processName: "",
        productDrawingNo: "",
        productCode: "",
        superQuery: {},
        classAttributeList: "",
        batchNumber: "",
        inspectionResults: "unInspect",
      },
      selectedNodeKey: "",
      totalInventory: 0,
      superQueryJson: [
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },


        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },

        {
          prop: 'batchNumber',
          label: "批次号",
          type: 'input'
        },


        {
          prop: 'warehouseName',
          label: "仓库名称",
          type: 'input'

        },
        {
          prop: 'shelfSpaceName',
          label: "库位名称",
          type: 'input'

        },
        {
          prop: 'sealingCoverTyping',
          label: "打字内容",
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'select',
          options: []
        },

        {
          prop: 'oil',
          label: "油脂",
          type: 'select',
          options: []
        },

        {
          prop: 'clearance',
          label: "游隙",
          type: 'select',
          options: []
        },

        {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'select',
          options: []
        },
        {
          prop: 'specialRequire',
          label: "特殊要求",
          type: 'select',
          options: []
        },
        {
          prop: 'standardValue',
          label: "规值",
          type: 'select',
          options: []
        },
        {
          prop: 'aperture',
          label: "孔径",
          type: 'select',
          options: []
        },
        {
          prop: 'colour',
          label: "颜色",
          type: 'select',
          options: []
        },
        {
          prop: 'latestStorageTime',
          label: '最新入库时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },


      ],
      classAttributeList: [],
      selectList: [],
      requestArr: [
        {
          prop: "sealingCoverTyping",
          typeCode: "pa007"
        }, {
          prop: "accuracyLevel",
          typeCode: "pa006"
        },
        {
          prop: "vibrationLevel",
          typeCode: "pa005"
        },
        {
          prop: "oil",
          typeCode: "pa002"
        }, {
          prop: "oilQuantity",
          typeCode: "pa003"
        }, {
          prop: "clearance",
          typeCode: "pa001"
        }, {
          prop: "packagingMethod",
          typeCode: "pa015"
        }, {
          prop: "specialRequire",
          typeCode: "pa016"
        }, {
          prop: "standardValue",
          typeCode: "pa008",
        }, {
          prop: "aperture",
          typeCode: "pa009",
        }, {
          prop: "colour",
          typeCode: "pa010",
        }

      ]

    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getclassAttributeList()
    this.getProductClassFun()

  },
  methods: {
    // 提交批量设置
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.dataForm);
          this.btnLoading = true
          batchInspect(this.dataForm).then(res => {
            this.$message.success("批量检验成功")
            this.btnLoading = false
            this.inventoryVisible=false
            this.initData()
          })
        }
      })
    },
    // 获取打字内容等
    getProductClassFun() {
      this.requestArr.forEach((item, index) => {
        let obj1 = {
          pageNum: -1,
          pageSize: 20,
          typeCode: item.typeCode,
          orderItems: [
            {
              asc: false,
              column: "",
            },
            {
              asc: false,
              column: "code",
            },
          ],
        };
        getbimProductAttributesList(obj1).then(res => {

          let arr = []
          res.data.records.forEach(items => {
            let obj = {
              label: items.name,
              value: items.name,
            }
            arr.push(obj)
          });
          console.log(this.superQueryJson);
          let oilObj = this.superQueryJson.find(rs => rs.prop === item.prop);
          if (oilObj) {
            // 将options赋值为5  
            oilObj.options = JSON.parse(JSON.stringify(arr));
          }
        })
      })




    },
    getclassAttributeList() {
      getclassAttributelistByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
        this.initData()
      })
    },
    handeleselectFun(val) {
      this.selectList = val
    },
    batchInspectFun() {
      if (!this.selectList.length) return this.$message.error("请选择您要检验的数据")
      this.inventoryVisible = true
      this.selectList.forEach(item => {
        this.dataForm.idList.push(item.id)
      });
    },
    // 导出
    exportForm(exportTableRef) {
      console.log("object,", exportTableRef);
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      console.log(this.$refs[exportTableRef]);
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      console.log("columnList", columnList);
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.tableQuery
      let _data = {
        ...targetListQuery,
        exportType: '1211',
        exportName: "待检验库存",
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    superQuerySearch(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 查看产品明细
    viewFun(id, type, warehouseId) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, warehouseId)
      })
    },


    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },



    initData() {
      this.tableQuery.classAttributeList = this.classAttributeList
      getInventoryLineReport(this.tableQuery).then((res) => {
        console.log(res);
        if (res.data.page.records.length) {
          this.tableData = res.data.page.records || []
          this.totalInventory = res.data.total.inventoryQuantity || 0
          this.total = res.data.page.total || 0
        } else {
          this.tableData = []
          this.totalData = 0
        }

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.initData()
    },
    reset() {
      if (this.treeData.length > 1) {
        this.selectedNodeKey = this.tableQuery.warehouseId
        this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      }
      this.tableQuery = {
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseName: "",
        pageNum: 1,
        pageSize: 20,


        warehouseId: '',
        productDrawingNo: "",
        productCode: "",
        superQuery: {},
        classAttributeList: this.classAttributeList,
      }
      this.initData()
    },




    sortChange({ prop, order }) {
      let newProp;
      if (prop == 'productCode' || prop == 'productDrawingNo' || prop == 'warehouseName' || prop == 'processName' || prop == 'shelfSpaceName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())

      }
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = newProp
      this.initData()
    },


  }
}
</script>
<style scoped>
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

.JNPF-common-head {
  padding: 8px
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}
.JNPF-dialog.JNPF-dialog_center  ::v-deep.el-dialog .el-dialog__body{
  padding-top: 43px!important;
}
</style>
