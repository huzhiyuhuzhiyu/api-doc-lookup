<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.code" placeholder="仓库编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="type">
              <el-select v-model="form.type" placeholder="仓库类型" style="width: 100%;">
                <el-option v-for="(item, index) in typeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <topOpts @add="addWarehouse('', '', 'add')">
              <el-button size="mini" type="primary" icon="el-icon-printer"
                @click="printView('p036')">打印仓库二维码</el-button>
            </topOpts>
          </div>
          <div class="JNPF-common-head-right">
            <!-- <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip> -->

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
        <JNPF-table ref="tabForm" :data="treeList" row-key="id" v-if="isProjectSwitchFlag" :fixedNO="true" custom-column
          :default-expand-all="expands" :tree-props="{ children: 'childrenList', hasChildren: '' }"
          :setColumnDisplayList="columnList" hasC @selection-change="handleSelectWork">
          <el-table-column prop="name" label="仓库名称" min-width="200" />
          <el-table-column prop="code" label="仓库编码" show-overflow-tooltip min-width="160">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, scope.row.warehouseId, 'look')">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
          <!-- <el-table-column prop="image" label="二维码" align="center" width="100" height="50">
            <template slot-scope="scope">
              <el-popover placement="top-start" trigger="click">
                <a :href="scope.row.image" target="_blank" title="查看最大化图片">
                  <vue-qr :ref="'ref' + scope.row.id" :size="80" :margin="0" :auto-color="true" :dot-scale="1"
                    :text="scope.row.code" />
                </a>
                <img slot="reference" :src="scope.row.image" style="width: 50px;height: 50px; cursor:pointer" />
              </el-popover>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="state" label="仓库启用状态" width="120">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949" active-value="enable"
                inactive-value="disabled" @change="stateChange(scope)"></el-switch>
            </template>
          </el-table-column> -->
          <el-table-column prop="locationStatus" label="库位启用状态" width="120">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.locationStatus" active-color="#13ce66" inactive-color="#ff4949"
                active-value="enable" inactive-value="disabled" @change="locationStatusChange(scope)"
                :disabled="scope.row.type === 'out'"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="workshop" label="车间" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.workshop == 'assemble'">装配车间</div>
              <div v-if="scope.row.workshop == 'ferrule'">套圈车间</div>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="位置" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="420" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)"
                :delDisabled="scope.row.warehouseManagementStatus == 'enable'">
                <!-- <el-popover placement="top-start" trigger="click" style="margin: 0 10px;">
        

                  <vue-qr class="qr-code" :ref="'ref' + scope.row.id" :size="80" :margin="0" :auto-color="true"
                    :dot-scale="1" :text="scope.row.code" />

                  <el-button type="text" size="mini" slot="reference">
                    查看二维码
                  </el-button>
                </el-popover> -->
                <el-button v-if="scope.row.warehouseManagementStatus == 'disabled'"
                  :disabled=" scope.row.type == 'scrap' || scope.row.type == 'virtually'"
                  type="text" size="mini" @click="enableWareFun(scope.row)">
                  开启仓库菜单
                </el-button>
                <el-button v-if="scope.row.warehouseManagementStatus == 'enable'"
                  :disabled=" scope.row.type == 'scrap' || scope.row.type == 'virtually'"
                  type="text" size="mini" @click="closeWareFun(scope.row)">
                  关闭仓库菜单
                </el-button>
                <el-button type="text" size="mini" @click="openQr(scope.row)">
                  查看二维码
                </el-button>
                <el-button type="text" size="mini"
                  @click="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'look')">
                  查看详情
                </el-button>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" :params="workOrderForm"
      :fullName="fullName" ref="printForm" />
    <el-dialog title="二维码" :visible.sync="dialogVisible" width="350px" :close-on-click-modal="false"
      :show-close="false">
      <div style="margin-left: 27px;">
        <vue-qr ref="qrCode" :size="250" :margin="0" :auto-color="true" :dot-scale="1" :text="dialogVisibleCode" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 选择产品类别属性 -->
    <el-dialog title="选择产品类别属性" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
      :visible.sync="productClassAttribute" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="50%"
      append-to-body>
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

        <div class="JNPF-common-layout-center JNPF-flex-main productClass">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="orderForm.name" placeholder="类别名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="orderForm.code" placeholder="类别编码" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductClassAttribute()">
                    {{ $t('common.search') }}</el-button>
                  <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductClassAttribute()">{{
                    $t('common.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <JNPF-table v-loading="listLoading" :data="productList" hasC :fixedNO="true"
              @selection-change="handleSelection" ref="form">
              <el-table-column prop="name" label="类别名称" />
              <el-table-column prop="code" label="类别编码"></el-table-column>
            </JNPF-table>
            <pagination :total="productTotal" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
              @pagination="searchProductClassAttribute" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" productClassAttribute = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
          确定</el-button>
      </span>
    </el-dialog>
    <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
  </div>
</template>

<script>
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { getWarehouseList, deleteWarehouse, editWarehouse, editWarehouseState } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes, enableWarehouseMenu, closeWarehouseMenu } from '@/api/masterDataManagement/index'
import Form from './Form'
import VueQr from 'vue-qr'
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'warehouseArchives',
  components: { Form, SuperQuery, VueQr, PrintBrowse, PrintDialog },
  mixins: [getProjectList],
  data() {
    return {
      fullName: '',
      productClassAttribute: false,
      dialogVisible: false,
      printVisible: false,
      superQueryVisible: false,
      productTotal: 0,
      orderForm: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,

        orderItems: [
          {
            asc: true,
            column: 'sort'
          }
        ]
      },
      printBrowseVisible: false,
      superQueryJson: [
        {
          prop: 'name',
          label: '仓库名称',
          type: 'input'
        },
        {
          prop: 'code',
          label: '仓库编码',
          type: 'input'
        },

        {
          prop: 'position',
          label: '位置',
          type: 'input'
        },

        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      columnList: ['position', 'remark'],
      listQuery: {
        keyword: '',
        type: ''
      },
      typeList: [
        { label: '正常仓库', value: 'normal' },
        { label: '中转仓库', value: 'temp' },
        { label: '不良品仓库', value: 'unqualified' },
        { label: '报废仓库', value: 'scrap' },
        { label: '虚拟仓库', value: 'virtually' },
        { label: '线边仓库', value: 'line_edge' }
      ],
      treeList: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      depFormVisible: false,

      form: {
        code: '',
        name: '',
        type: '',
        category: 'warehouse',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      selectWarehouse: [],
      printQuery: {
        category: 'Warehousemanage'
      },
      enCode: '',
      printList: [],
      currentWarehouseInfo: {},
      productList: [],
      selectData: [],
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
    }
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag = true
    this.initData()

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    closeWareFun(row) {
      this.$confirm("确定关闭该仓库菜单吗", "提示", {
        type: 'warning'
      }).then(() => {
        closeWarehouseMenu(row).then(res => {
          this.$message.success("关闭成功")
        })
        setTimeout(() => {
          location.reload()
        }, 500);
      }).catch(() => {

      })

    },
    // 开启仓库菜单
    enableWareFun(row) {

      this.currentWarehouseInfo = row
      this.productClassAttribute = true
      getclassAttributeList(this.orderForm).then(res => {
        console.log("类别属性");
        this.productList = res.data.records
        this.productTotal = res.data.total
      })
    },
    handleSelection(val) {
      this.selectData = val
    },
    submitAllProduct() {
      if (!this.selectData.length) return this.$message.error("至少选择一个类别属性")
      let obj = {
        warehouseClassAttributeList: [],
        stockWarehouse: this.currentWarehouseInfo,
        menuList: [],
        directory: [],
      }
      obj.directory = {
        category: 'Web',
        description: '',
        enCode: this.currentWarehouseInfo.code,
        enabledMark: 1,
        fullName: this.currentWarehouseInfo.name,
        icon: 'icon-ym icon-ym-documentPreviewExample left-icon',
        id: '',
        isButtonAuthorize: 0,
        isColumnAuthorize: 0,
        isDataAuthorize: 0,
        isFormAuthorize: 0,
        linkTarget: '_self',
        parentId: '568721982921638149',
        propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
        systemId: '309228585019769285',
        type: 1,
        urlAddress: ''
      }
      obj.menuList = [
        {
          category: 'Web',
          description: '',
          enCode: 'dbIncomAndOutInventory',
          enabledMark: 1,
          fullName: `待办出入库`,
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 10,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' +
            this.currentWarehouseInfo.code +
            '}/dbIncomAndOutInventory' +
            '?' +
            this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'directInandOutWarehouse',
          enabledMark: 1,
          fullName: `直接出入库`,
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 20,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' +
            this.currentWarehouseInfo.code +
            '}/directInandOutWarehouse' +
            '?' +
            this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'inventoryList',
          enabledMark: 1,
          fullName: '出入库列表',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 30,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' + this.currentWarehouseInfo.code + '}/inventoryList' + '?' + this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'inventoryDetaisList',
          enabledMark: 1,
          fullName: '出入库明细',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 40,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' +
            this.currentWarehouseInfo.code +
            '}/inventoryDetaisList' +
            '?' +
            this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'transferManagement',
          enabledMark: 1,
          fullName: '调拨管理',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 50,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' +
            this.currentWarehouseInfo.code +
            '}/transferManagement' +
            '?' +
            this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'directMaterialRequisition',
          enabledMark: 1,
          fullName: '直接领料管理',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 60,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' + this.currentWarehouseInfo.code + '}/directMaterialRequisition' + '?' + this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'awaitInspectionInventory',
          enabledMark: 1,
          fullName: '待检验库存',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 65,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' + this.currentWarehouseInfo.code + '}/awaitInspectionInventory' + '?' + this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'inventory',
          enabledMark: 1,
          fullName: '库存查询',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 70,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' + this.currentWarehouseInfo.code + '}/inventory' + '?' + this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'modalShift',
          enabledMark: 1,
          fullName: '形态转换',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 80,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' + this.currentWarehouseInfo.code + '}/modalShift' + '?' + this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'InventoryAssembly',
          enabledMark: 1,
          fullName: '存货组装',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 90,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' + this.currentWarehouseInfo.code + '}/InventoryAssembly' + '?' + this.currentWarehouseInfo.code
        },
        {
          category: 'Web',
          description: '',
          enCode: 'lnventoryDisassembly',
          enabledMark: 1,
          fullName: '存货拆卸',
          icon: 'icon-ym icon-ym-webForm',
          id: '',
          isButtonAuthorize: 1,
          isColumnAuthorize: 1,
          isDataAuthorize: 1,
          isFormAuthorize: 1,
          linkTarget: '_self',
          parentId: '',
          propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
          sortCode: 100,
          systemId: '309228585019769285',
          type: 2,
          urlAddress:
            'warehouseManagement/${' + this.currentWarehouseInfo.code + '}/lnventoryDisassembly' + '?' + this.currentWarehouseInfo.code
        }
      ]
      this.selectData.forEach(item => {
        let objs = {
          classAttribute: item.code,
          warehouseId: this.currentWarehouseInfo.id
        }
        obj.warehouseClassAttributeList.push(objs)
      });
      this.$confirm("确定开启该仓库菜单吗", "提示", {
        type: 'warning'
      }).then(() => {
        this.productClassAttribute = false
        enableWarehouseMenu(obj).then(res => {
          this.$message.success("开启成功")
          setTimeout(() => {
            location.reload()
          }, 500);
        })
      }).catch(() => {

      })

    },
    stateChange(scope) {
      let msg;
      if (scope.row.state == 'disabled') {
        msg = "禁用"
      } else {
        msg = "启用"

      }
      this.$confirm("确定" + msg + "该仓库吗", "提示", {
        type: 'warning'
      }).then(() => {
        editWarehouseState(scope.row).then((res) => {
          console.log(5555);

          this.initData()
          this.$message({
            type: 'success',
            message: scope.row.state == 'enable' ? '开启成功' : '禁用成功',
            duration: 1500
          })
        }).catch(error => {
          this.initData()

        })
      }).catch(() => {
        if (scope.row.state == 'disabled') {
          this.treeList[scope.$index].state = 'enable'

        } else {
          this.treeList[scope.$index].state = 'disabled'

        }
      })
    },
    locationStatusChange(scope) {
      let msg;
      if (scope.row.locationStatus == 'disabled') {
        msg = "禁用"
      } else {
        msg = "启用"

      }
      this.$confirm("确定" + msg + "该库位吗", "提示", {
        type: 'warning'
      }).then(() => {
        let obj = {
          stockWarehouse: scope.row
        }
        editWarehouse(obj).then((res) => {
          this.initData()
          this.$message({
            type: 'success',
            message: scope.row.locationStatus == 'enable' ? '开启成功' : '禁用成功',
            duration: 1500
          })
        })
      }).catch(() => {
        if (scope.row.locationStatus == 'disabled') {
          this.treeList[scope.$index].locationStatus = 'enable'

        } else {
          this.treeList[scope.$index].locationStatus = 'disabled'

        }
      })

    },
    superQuerySearch(query) {
      this.form.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    initData() {
      this.loading = true
      this.form.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getWarehouseList(this.form)
        .then((res) => {
          this.treeList = res.data
          if (this.treeList.length > 0) this.setTableIndex(this.treeList)
          this.listLoading = false
          this.btnLoading = false
        })
        .catch(() => {
          this.listLoading = false
          this.btnLoading = false
        })
    },
    search() {
      this.initData()
      // this.buildQRCode()
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1
        item.image = require('@/assets/images/scanCode.svg')
        if (index) {
          item.index = index + 1
        }
        if (item.childrenList.length > 0) {
          this.setTableIndex(item.childrenList, item.index)
        }
      })
    },
    reset() {
      this.listQuery.keyword = ''
      this.form.name = ''
      this.form.code = ''
      this.form.type = ''
      this.initData()
    },
    openQr(row) {

      this.dialogVisibleCode = row.code
      this.dialogVisible = true
    },
    addOrUpdateHandle(id, parentId, type) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, parentId, type)
        })
        // }, 600);
      }
    },
    onHandle(row, state) {
      row.state = state
      editWarehouseState(row).then((res) => {
        this.initData()
        this.$message({
          type: 'success',
          message: '开启成功',
          duration: 1500
        })
      })
    },
    offHandle(row, state) {
      row.state = state
      editWarehouseState(row).then((res) => {
        this.initData()
        this.$message({
          type: 'success',
          message: '禁用成功',
          duration: 1500
        })
      })
    },
    addWarehouse(id, parentId, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, type)
      })
    },
    handleUserRelation(id, parentId, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, type)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    toggleExpand() {
      this.refreshTable = false
      this.expands = !this.expands
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteWarehouse(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleSelectWork(val) {
      this.selectWarehouse = val
    },
    printWarehouse(enCode) {
      if (!this.selectWarehouse.length) return this.$message.error("请选择您要打印的数据!")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectWarehouse.map(item => item.id).join(',')
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
      if (!this.selectWarehouse.length) return this.$message.error("请选择您要打印的数据!")
      this.enCode = enCode
      this.fullName = '仓库二维码'
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.table-icon {
  vertical-align: bottom;
  font-size: 16px;
  margin-right: 6px;
  line-height: 23px;
}

.JNPF-common-head {
  padding: 8px !important;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0 !important;
  margin-left: 0 !important;
}

.selectPro ::v-deep .el-dialog .el-dialog__header {
  padding: 0 10px;
}

.selectPro ::v-deep .el-dialog .el-dialog__body {
  padding: 0 !important;
}

.productClass .JNPF-common-layout-main {
  padding: 10px 10px 0;
}
</style>
