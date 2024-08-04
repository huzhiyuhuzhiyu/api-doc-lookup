<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" v-if="!leftFlag" style="display: block;padding:0">
        <div class="title_box">
          <h2>业务分类</h2>
          <span class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div> <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:200px;margin:10px auto;display:block"
            suffix-icon="el-icon-search" clearable>
          </el-input></div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="type" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">
            <span class="text" :title="data.fullName">{{ data.fullName }} ({{ data.number }})</span>

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
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
        <!-- 销售待发货查询条件 -->
        <el-form @submit.native.prevent v-if="categoryType == 'delivery'">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="fhForm.orderNo" placeholder="请输入单号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="fhForm.partnerName" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="fhDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="发货开始日期" end-placeholder="发货结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="getTabdataList()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div></div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="advancedQueryFun" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun('fhtabForm')" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="getTabdataList()" />
            </el-tooltip>
          </div>
        </div>
        <!-- 发货通知单列表 -->
        <JNPF-table v-loading="listLoading" hasC @selection-change="FHhandleSelectionChange" :data="fhTableList"
          custom-column ref="fhtabForm" :fixedNo="true" :setColumnDisplayList="fhcolumnList"
          v-if="categoryType == 'delivery'">
          <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">{{
                scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom" />
          <el-table-column prop="partnerName" label="客户名称" width="200" sortable="custom" />
          <el-table-column prop="deliverDate" label="发货日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="recipient" label="收件人" width="140" sortable="custom" />
          <el-table-column prop="phone" label="收件人电话" width="160" sortable="custom" />

          <el-table-column prop="delivery" label="发货方式" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.delivery == 'deliver_goods'">
                <span>送货</span>
              </div>
              <div v-else-if="scope.row.delivery == 'self_pickup'">
                <span>自提</span>
              </div>
              <div v-else-if="scope.row.delivery == 'express_delivery'">
                <span>快递</span>
              </div>
              <div v-else-if="scope.row.delivery == 'freight_transport'">
                <span>货运</span>
              </div>
              <div v-else-if="scope.row.delivery == 'collect_payment'">
                <span>到付</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="countryName" label="国家" width="160" />
          <el-table-column prop="provinceName" label="省" width="160" />
          <el-table-column prop="cityName" label="市" width="160" />
          <el-table-column prop="areaName" label="区" width="160" />
          <el-table-column prop="address" label="地址" min-width="300" />
          <el-table-column prop="exchangeGoodsFlag" label="发货标识" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.exchangeGoodsFlag">
                换货发货
              </div>
              <div v-else>
                正常发货
              </div>
            </template>
          </el-table-column>


          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="incomAndOutInventFun(scope.row,'add')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="fhTotal" :page.sync="fhForm.pageNum" :limit.sync="fhForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'delivery'">
        </pagination>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <FHForm v-if="fhFormVisible" ref="FHREFForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

  </div>
</template>

<script>
import { getQuotationdatasendlist,getStockMovelist } from '@/api/salesManagement/index'
import Form from './Form'
import mixin from '@/mixins/generator/index'
import { Release } from '@/api/onlineDev/visualDev'
import { getVisualDevList, Delete, Copy, exportData } from '@/api/onlineDev/visualDev'
import SuperQuery from '@/components/SuperQuery/index.vue'
import FHForm from "../../../salesManagement/shippingnotice/saleMetalworking/Form.vue"

export default {
  name: 'dbIncomAndOutInventory',
  mixins: [mixin],
  components: { Form, SuperQuery, FHForm },
  data() {
    return {
      fhFormVisible: false,
      fhcolumnList: ["partnerName", "provinceName", "cityName", "areaName", "address", "countryName", "createByName"],
      fhDateArr: [],//发货通知单 查询条件 发货日期
      fhSelectList: [],//发货多选数据
      fhTableList: [],//发货列表数据
      fhTotal: 0,//发货 列表总条数
      // 发货列表请求条件
      fhForm: {
        orderNo: "",
        partnerName: "",
        pageNum: 1,
        pageSize: 20,
        returnDeliveryType: 'delivery',
        rdeDate: "",
        rdsDate: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
      },


      listLoading: false,
      superQueryVisible: false,
      superQueryJson: [],






      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      listQuery: {

      },
      total: 0,
      sort: 'webDesign',

      filterText: "",


      treeData: [
        {
          childrenList: [],
          fullName: "销售待发货",
          type: "delivery",
          number: 0,
        },

        {
          childrenList: [],
          fullName: "销售待退货",
          type: "back",
          number: 0,
        },
        {
          childrenList: [],
          fullName: "采购待收货",
          type: "111",
          number: 0,
        },
        {
          childrenList: [],
          fullName: "采购待退货",
          type: "222",
          number: 0,
        },
        {
          childrenList: [],
          fullName: "外协待发料",
          type: "333",
          number: 0,
        },

        {
          childrenList: [],
          fullName: "外协待退料",
          type: "444",
          number: 0,
        }, {
          childrenList: [],
          fullName: "外协待收货",
          type: "555",
          number: 0,
        },
        {
          childrenList: [],
          fullName: "外协待退货",
          type: "666",
          number: 0,
        },
        {
          childrenList: [],
          fullName: "生产待入库",
          type: "777",
          number: 0,
        },
      ],
      appTreeData: [],
      refreshTree: true,
      leftFlag: false,
      expands: true,
      treeLoading: false,
      categoryType: "delivery",
      // 销售发通通知单查询条件

    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  mounted() {
    this.initData()
    this.$refs.treeBox.setCurrentKey(this.treeData[0].type) // 默认选中节点第一个
    // 进入页面  默认查询销售发货通知单数据

    // this.getTabdataList()
    this.getStockMovelistFun()
  },
  methods: {
    getStockMovelistFun(){
      getStockMovelist().then(res=>{
        console.log("左侧分类数据",res);
      })
    },
    // 点击出库/入库按钮
    incomAndOutInventFun(data,btnType) {
      if (this.categoryType == 'delivery') {
        this.formVisible = true
        this.$refs[ref].init(id, btnType,'delivery')

      }
    },
    // 根据左侧分类  点击不同的分类  请求不同的数据
    getTabdataList() {
      // 发货通知单
      if (this.categoryType == 'delivery') {
        this.listLoading = true
        getQuotationdatasendlist(this.fhForm).then(res => {
          this.fhTableList = res.data.records
          this.fhTotal = res.data.total
          this.treeData[0].number = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
    },
    advancedQueryFun() {
      if (this.categoryType == 'delivery') {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'partnerCode',
            label: "客户编码",
            type: 'input'
          },
          {
            prop: 'partnerName',
            label: "客户名称",
            type: 'input'
          },
          {
            prop: 'deliverDate',
            label: '发货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'recipient',
            label: "收件人",
            type: 'input'
          },
          {
            prop: 'phone',
            label: "收件人电话",
            type: 'input'
          },
          {
            prop: 'delivery',
            label: "发货方式",
            type: 'select',

            options: [
              { label: "送货", value: "deliver_goods" },
              { label: "自提", value: "self_pickup" },
              { label: "快递", value: "express_delivery" },
              { label: "货运", value: "freight_transport" },
              { label: "到付", value: "collect_payment" },
            ]

          },
          {
            prop: 'exchangeGoodsFlag',
            label: "发货标识",
            type: 'select',

            options: [
              { label: "正常发货", value: false },
              { label: "换货发货", value: true }
            ]

          },

          {
            prop: 'documentStatus',
            label: "单据状态",
            type: 'select',
            options: [
              { label: "草稿", value: "draft" },
              { label: "提交", value: "submit" },
            ]
          },



        ]
      }
    },
    superQuerySearch(query) {
      this.superQueryVisible = false
      if (this.categoryType == 'delivery') {
        this.fhForm.superQuery = query

      }
      this.getTabdataList()
    },

    // 发货列表多选
    FHhandleSelectionChange(val) {
      this.fhSelectList = val
    },


    // 查看详情
    viewFun(id, btnType, ref, visible) {
      console.log(id, btnType, ref, visible);
      this.$nextTick(() => {
        this.$refs[ref].init(id, btnType)
      })
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.fhFormVisible = false
      if (isRefresh) {
        this.getTabdataList()
      }
    },





    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.categoryType = node.data.type
      this.search();
    },



    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    columnSetFun(refForm) {
      this.$refs[refForm].showDrawer()
    },




  }
}
</script>
<style lang="scss" scoped>
.release-dialog {
  >>>.el-dialog {
    .el-dialog__body {
      padding: 12px 55px;
    }
  }

  .dialog-form-main {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    >>>.el-form-item {
      width: 215px;
    }
  }

  .dialog-main {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .item {
      position: relative;
      width: 215px;
      height: 127px;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      text-align: center;
      padding-top: 20px;
      color: #606266;

      &.active {
        border-color: #1890ff;
        color: #1890ff;
        box-shadow: 0 0 6px rgba(6, 58, 108, 0.1);

        .item-icon {
          border-color: #1890ff;
        }

        .icon-checked {
          display: block;
        }
      }

      .item-icon {
        display: inline-block;
        width: 44px;
        height: 44px;
        margin-bottom: 16px;
        border: 2px solid #606266;
        line-height: 40px;
        font-size: 24px;
        text-align: center;
        border-radius: 50%;
      }

      .item-title {
        font-size: 16px;
        font-weight: 400;
      }

      .icon-checked {
        display: none;
        width: 18px;
        height: 18px;
        border: 18px solid #1890ff;
        border-left: 18px solid transparent;
        border-top: 18px solid transparent;
        border-bottom-right-radius: 4px;
        position: absolute;
        right: 0px;
        bottom: 0px;

        i {
          font-size: 16px;
          position: absolute;
          top: 0;
          left: -2px;
          color: #fff;
        }
      }
    }
  }
}
</style>
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

::v-deep .el-scrollbar__view {
  height: calc(100% - 10px);
}

.JNPF-common-layout .JNPF-common-layout-left .JNPF-common-el-tree {
  height: 100%;
}
.JNPF-common-head {
  padding: 10px;
}
</style>
