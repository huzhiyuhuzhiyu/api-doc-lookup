<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import {getHsProductsList, removeHsProducts} from "@/api/shipmentNote/hsCodes";
import {buttonList} from "@/views/salesManagement/shipmentNote/hsCodes/data";
import Form from './Form.vue'
import {getcategoryTree} from "@/api/basicData/materialSettings";
import {getProductList, setHSProducts} from "@/api/masterDataManagement/productManage";

export default {
  name: "index",
  components: {
    SuperQuery,
    Form
  },
  data() {
    return {
      loading: false,
      visible: false,
      tableData: [],
      total: 0,
      superQueryVisible: false,
      superQueryJson: [],
      initListQuery: {
        keyword: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      columnsConfig: [
        {prop: 'code', label: 'HS编码', minWidth: 120, sortable: 'custom', slot: true},
        {prop: 'name', label: '商品名称', minWidth: 200, sortable: 'custom'},
        {prop: 'tradeName', label: '贸易名称', minWidth: 120, sortable: 'custom'},
        {prop: 'drawingNo', label: '规格型号', minWidth: 120, sortable: 'custom'},
        {prop: 'purpose', label: '用途', minWidth: 120, sortable: 'custom'},
        {prop: 'type', label: '类型', minWidth: 120, sortable: 'custom'},
        {prop: 'remark', label: '备注', minWidth: 120, sortable: 'custom'},
      ],
      HSCodeData: [],
      addProductProps: {
        title: '海关产品绑定',
        activeType: '',
        renderTree: true,
        multiple: true,
        treeTitle: '产品分类',
        methodArr: {
          method: getcategoryTree,
          requestObj: {
            classAttribute: ''
          },
        },
        listMethod: getProductList,
        tableItems: [
          {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'code', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'mainUnit', label: '单位', sortable: 'custom'},
          {prop: 'hsProductsCode', label: 'HS编码', minWidth: '220px', sortable: 'custom'},
          {prop: 'createTime', label: '创建时间', sortable: 'custom'}
        ],
        listRequestObj: {
          hsProductsId: "",
          productCode: "",
          productName: "",
          drawingNo: "",
          productStatus: 'enable',
          partnerType: "customer",
          pageNum: 1,
          pageSize: 20,
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'create_time'
            }
          ]
        },
        beforeSubmit: (data, paramsObj) => {
          if (!data || !data.length) {
            this.$message.error(`请进行海关产品绑定！`)
            return false
          }
          return true
        },
        searchList: [
          {prop: 'productName', label: '产品名称', type: 'input'},
          {prop: 'productCode', label: '产品编码', type: 'input'},
          {prop: 'drawingNo', label: '型号', type: 'input'},
        ]
      },
      addHSCodeProps: {
        title: '选择海关编码',
        renderTree: false,
        multiple: false,
        listMethod: getHsProductsList,
        tableItems: [
          {prop: 'code', label: 'HS编码', minWidth: '220px', sortable: 'custom'},
          {prop: 'name', label: '商品名称', sortable: 'custom'},
          {prop: 'type', label: '类型', sortable: 'custom'},
        ],
        listRequestObj: {
          pageNum: 1,
          pageSize: 20,
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'create_time'
            }
          ]
        },
        searchList: [
          {prop: 'code', label: 'HS编码', type: 'input'},
        ],
      },
      HSCodeComSelectRow: null,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const res = await getHsProductsList(this.listQuery);
        const {total, records} = res.data
        this.tableData = records;
        this.HSCodeData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    onBindingOrViewHS(id, type) {
      this.addProductProps.activeType = type
      this.addProductProps.listRequestObj.hsProductsId = id
      this.$refs.ComSelectProductRef.openDialog()
    },

    openHSCodeComSelect(row) {
      this.HSCodeComSelectRow = row
      this.$refs.ComSelectHSCodeRef.openDialog()
    },

    async submitAllProduct(id, data) {
      const newData = data.map(({all: {hsProductsId = '', id = ''}}) => ({
        hsProductsId,
        productsId: id
      }))
      const res = await setHSProducts(newData)
      if (res.msg === 'Success') {
        this.$message.success('绑定成功')
      }
    },

    submitAllHSCode(id, data) {
      this.$set(this.HSCodeComSelectRow, 'hsProductsCode', data[0].all.code);
      this.$set(this.HSCodeComSelectRow, 'hsProductsId', data[0].all.id);
      this.$refs.ComSelectProductRef.$refs.dataTable.$refs.JNPFTable.toggleRowSelection(this.HSCodeComSelectRow)
    },

    handleButtonClick(type) {
      switch (type) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add')
          })
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      switch (type) {
        case 'look':
        case 'edit':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type)
          })
          break;
        case 'delete':
          this.handleRemove(row.id)
          break;
        default:
      }
    },

    handleRemove(id) {
      this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await removeHsProducts(id);
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success('删除成功')
          this.initData()
        }
      }).catch(() => {
      })
    },

    close(isInitData = true) {
      this.visible = false
      if (!isInitData) return
      this.initData()
    },

    sortChange({prop, order}) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="listQuery.keyword"
                placeholder="请输入商品名称"
                clearable @keyup.enter.native="search()"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                @click="search()">查询
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
            <!--            <TableDataExportButton :disabled="tableData.length <= 0" tableRef="dataTable"-->
            <!--              :listQuery="listQuery" exportType="1018"-->
            <!--              exportName="生产巡检待检工单" :hasMarginLeft="false"/>-->
            <el-button size="mini" type="primary" @click="onBindingOrViewHS('','')">产品对照</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table customKey="hsCodes"
          v-loading="loading"
          :data="tableData" :row-key="'id'" fixedNO
          :setColumnDisplayList="columnList"
          @sort-change="sortChange"
          ref="dataTable"
          custom-column>
          <template v-for="column in columnsConfig">
            <el-table-column
              v-if="typeof column.show === 'function' ? column.show() : true"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
              :sortable="column.sortable"
              :fixed="column.fixed"
              :align="column.align"
            >
              <template v-if="column.slot" v-slot="scope">
                <template v-if="column.prop === 'code'">
                  <el-link type="primary" @click.native="onBindingOrViewHS(scope.row.id,'look')">
                    {{ scope.row.code }}
                  </el-link>
                </template>
                <template v-if="column.dictType">
                   <span>
                <el-tag
                  :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                    global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                  }}</el-tag>
                   </span>
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'edit')">
                编辑
              </el-button>
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'look')">
                详情
              </el-button>
              <el-button style="color: rgb(245, 108, 108)" size="mini" type="text"
                @click="handleColumnClick(row, 'delete')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="TransitionApplicationRecordQuery" :show="superQueryVisible" ref="SuperQuery"
      table-ref="dataTable"
      :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
    <Form ref="Form" v-if="visible" @close="close"/>
    <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false" @change="submitAllProduct">
      <template #hsProductsCode="row">
        <el-input
          v-model="row.row.hsProductsCode"
          placeholder="请选择HS编码"
          clearable
          @click.native.stop="openHSCodeComSelect(row.row)"
          readonly
        />
      </template>
    </ComSelect-page>
    <ComSelect-page v-bind="addHSCodeProps" ref="ComSelectHSCodeRef" :element-show="false" @change="submitAllHSCode"/>
  </div>
</template>
