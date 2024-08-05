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
          :expand-on-click-node="false" node-key="businessType" @node-click="handleNodeClick"
          class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">
            <span class="text" :title="data.fullName">{{ data.fullName }} ({{ data.todoNum }})</span>

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
        <!-- 销售待发/退货查询条件 -->
        <el-form @submit.native.prevent
          v-if="categoryType == 'outbound_sale_send' || categoryType == 'inbound_sale_return'">
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
                :start-placeholder="categoryType == 'outbound_sale_send' ? '发货开始日期' : '退货开始日期'"
                :end-placeholder="categoryType == 'outbound_sale_send' ? '发货结束日期' : '退货结束日期'" clearable>
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
                v-if="categoryType == 'outbound_sale_send'" @click="columnSetFun('fhtabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_sale_return'" @click="columnSetFun('thtabForm')" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="getTabdataList()" />
            </el-tooltip>
          </div>
        </div>
        <!-- 发货通知单列表 --> 
        <JNPF-table v-loading="listLoading" :key="Math.random()" :data="fhTableList" v-if="categoryType == 'outbound_sale_send'"
          custom-column ref="fhtabForm" :fixedNo="true" :setColumnDisplayList="fhcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom" />
          <el-table-column prop="partnerName" label="客户名称" width="200" sortable="custom" />
          <el-table-column prop="deliverDate" label="发货日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="recipient" label="收件人" width="140" sortable="custom" />
          <el-table-column prop="phone" label="收件人电话" width="160" sortable="custom" />

          <el-table-column prop="outbound_sale_send" label="发货方式" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.outbound_sale_send == 'deliver_goods'">
                <span>送货</span>
              </div>
              <div v-else-if="scope.row.outbound_sale_send == 'self_pickup'">
                <span>自提</span>
              </div>
              <div v-else-if="scope.row.outbound_sale_send == 'express_delivery'">
                <span>快递</span>
              </div>
              <div v-else-if="scope.row.outbound_sale_send == 'freight_transport'">
                <span>货运</span>
              </div>
              <div v-else-if="scope.row.outbound_sale_send == 'collect_payment'">
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
              <el-button size="mini" type="text" @click="incomAndOutInventFun(scope.row, 'add', 'Form','outbound_sale_send')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 退货货通知单列表 -->
        <JNPF-table v-loading="listLoading" :key="Math.random()" :data="thTableList" v-if="categoryType == 'inbound_sale_return'"
          custom-column ref="thtabForm" :fixedNo="true" :setColumnDisplayList="thcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="客户名称" width="200" sortable="custom" />
          <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom" />
          <el-table-column prop="deliverDate" label="退货日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="exchangeGoodsFlag" label="退货标识" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.exchangeGoodsFlag">
                换货
              </div>
              <div v-else>
                发货
              </div>
            </template>
          </el-table-column>


          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="incomAndOutInventFun(scope.row, 'add', 'Form','inbound_sale_return')">入库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="fhTotal" :page.sync="fhForm.pageNum" :limit.sync="fhForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_sale_send'||categoryType=='inbound_sale_return'">
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
import { getQuotationdatasendlist, getStockMovelist } from '@/api/salesManagement/index'
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
      fhcolumnList: ['partnerCode', "provinceName", "cityName", "areaName", "address", "countryName", "createByName"],
      thcolumnList: ["partnerCode","createByName"],
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
        returnDeliveryType: '',
        deliveryStatus: "not_finished",
        documentStatus: "sibmit",
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
      formVisible: false,
      thTableList: [],




      defaultProps: {
        children: "",
        label: "fullName",
      },
      listQuery: {

      },
      total: 0,
      sort: 'webDesign',

      filterText: "",


      treeData: [],
      appTreeData: [],
      refreshTree: true,
      leftFlag: false,
      expands: true,
      treeLoading: false,
      categoryType: "outbound_sale_send",
      // 销售发通通知单查询条件

    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  mounted() {
    // 进入页面  默认查询销售发货通知单数据

    this.getStockMovelistFun()
  },
  methods: {
    getStockMovelistFun() {
      getStockMovelist('finish_product').then(res => {
        console.log("左侧分类数据", res);
        if (res.data.length) {
          res.data.forEach(item => {
            if (item.businessType == 'outbound_sale_send') {
              this.$set(item, 'fullName', '销售待发货')
            }
            if (item.businessType == 'inbound_sale_return') {
              item.fullName = '销售待退货'
            }
            if (item.businessType == 'inbound_purchase') {
              item.fullName = '采购待收货'
            }
            if (item.businessType == 'outbound_purchase') {
              item.fullName = '采购待退货'
            }

          });
        }
        this.$nextTick(() => {
          this.treeData = res.data
          console.log("this", this.treeData);
          this.$refs.treeBox.setCurrentKey(this.treeData[0].businessType) // 默认选中节点第一个
          this.categoryType = this.treeData[0].businessType
          this.getTabdataList()
        })

      })
    },
    // 点击出库/入库按钮
    incomAndOutInventFun(data, btnType, ref) {
      if (this.categoryType) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs[ref].init(data, btnType, this.categoryType)
        })

      }
    },
    // 根据左侧分类  点击不同的分类  请求不同的数据
    getTabdataList() {
      // 发货通知单
      if (this.categoryType == 'outbound_sale_send') {
        this.listLoading = true
        this.fhForm.returnDeliveryType = 'delivery'
        getQuotationdatasendlist(this.fhForm).then(res => {
          this.fhTableList = res.data.records
          this.fhTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 退货通知单列表数据
      if (this.categoryType == 'inbound_sale_return') {
        this.listLoading = true
        this.fhForm.returnDeliveryType = 'back'
        getQuotationdatasendlist(this.fhForm).then(res => {
          this.thTableList = res.data.records
          this.fhTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
    },
    advancedQueryFun() {
      if (this.categoryType == 'outbound_sale_send') {
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
            prop: 'outbound_sale_send',
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
      if (this.categoryType == "inbound_sale_return") {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'partnerName',
            label: "客户名称",
            type: 'input'
          },
          {
            prop: 'partnerCode',
            label: "客户编码",
            type: 'input'
          },

          {
            prop: 'deliverDate',
            label: '退货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },


          {
            prop: 'exchangeGoodsFlag',
            label: "退货标识",
            type: 'select',

            options: [
              { label: "退货", value: false },
              { label: "换货", value: true }
            ]

          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'datetimerange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '创建开始时间',
            endPlaceholder: '创建结束时间',
            pickerOptions: this.global.timePickerOptions
          }, {
            prop: 'createByName',
            label: "创建人",
            type: 'input',
          },



        ]
      }
    },
    superQuerySearch(query) {
      this.superQueryVisible = false
      if (this.categoryType == 'outbound_sale_send') {
        this.fhForm.superQuery = query

      }
      this.getTabdataList()
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
      this.formVisible = false
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
      this.categoryType = node.data.businessType
      this.$nextTick(()=>{
        this.getTabdataList()
      })

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
  padding: 15px 10px;
}
</style>
