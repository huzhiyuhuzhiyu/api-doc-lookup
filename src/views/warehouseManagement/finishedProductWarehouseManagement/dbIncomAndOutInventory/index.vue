<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:0px 0 0px 0">
        <el-radio-group v-model="categoryType" style="background-color:#fff;">

          <el-badge :value="item.todoNum" :max="99" v-for="item in treeData" :key="item.id">
            <el-radio-button style="margin:2px 0;" :key="item.businessType" :label="item.businessType">{{ item.fullName
              }}</el-radio-button>
          </el-badge>
        </el-radio-group>
      </div>
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16" style="margin-top: 5px;"
        v-if="categoryType != 'inbound_mock_production'">
        <!-- 销售待发/退货查询条件 -->
        <el-form @submit.native.prevent
          v-if="categoryType == 'outbound_sale_send' || categoryType == 'inbound_sale_return'">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="fhForm.orderNo" placeholder="单号" clearable @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="fhForm.partnerName" placeholder="客户名称" clearable
                @keyup.enter.native="getTabdataList()" />
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
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 采购退货查询条件 -->
        <el-form @submit.native.prevent
          v-if="categoryType == 'outbound_purchase' || categoryType == 'inbound_purchase'">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="cgForm.orderNo" placeholder="单号" clearable @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="cgForm.partnerName" placeholder="供应商名称" clearable
                @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="cgDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                :start-placeholder="categoryType == 'outbound_purchase' ? '退货开始日期' : '收货开始日期'"
                :end-placeholder="categoryType == 'outbound_purchase' ? '退货结束日期' : '收货结束日期'" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 外协收货查询条件 -->
        <el-form @submit.native.prevent v-if="categoryType == 'inbound_external'">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="wxshForm.orderNo" placeholder="单号" clearable @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="wxshForm.partnerName" placeholder="供应商名称" clearable
                @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="wxshDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="收货开始日期" end-placeholder="收货结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 外协发料查询条件 -->
        <el-form @submit.native.prevent v-if="categoryType == 'outbound_external_send'">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="wxflForm.orderNo" placeholder="单号" clearable @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="wxflForm.partnerName" placeholder="供应商名称" clearable
                @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="wxflDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="发料开始日期" end-placeholder="发料结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>

        <!-- 生产领料 查询 -->
        <el-form @submit.native.prevent v-if="categoryType == 'outbound_pick_out'">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="pickForm.orderNo" placeholder="领料单号" clearable
                @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="pickForm.receiveType" placeholder="领料类型" style="width: 100%;">
                <el-option v-for="(item, index) in receiveTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="pickForm.partnerName" placeholder="领料人" clearable
                @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 生产退料 查询 -->
        <el-form @submit.native.prevent v-if="categoryType == 'inbound_return_materials'">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="returnMaterForm.orderNo" placeholder="退料单号" clearable
                @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="returnMaterForm.receiveType" placeholder="退料类型" style="width: 100%;">
                <el-option v-for="(item, index) in receiveTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="returnMaterForm.partnerName" placeholder="退料人" clearable
                @keyup.enter.native="getTabdataList()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main" v-if="categoryType != 'inbound_mock_production'">
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
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_purchase' || categoryType == 'inbound_purchase'"
                @click="columnSetFun('cgthtabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_external'" @click="columnSetFun('wxshtabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_external_send'" @click="columnSetFun('wxfltabForm')" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="getTabdataList()" />
            </el-tooltip>
          </div>
        </div>
        <!-- 销售发货通知单列表 -->
        <JNPF-table v-loading="listLoading" :data="fhTableList" v-show="categoryType == 'outbound_sale_send'"
          custom-column ref="fhtabForm" :fixedNO="true" :setColumnDisplayList="fhcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom" />
          <el-table-column prop="partnerName" label="客户名称" min-width="140" sortable="custom" />
          <el-table-column prop="deliverDate" label="发货日期" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="recipient" label="收件人" min-width="120" sortable="custom" />
          <el-table-column prop="phone" label="收件人电话" min-width="140" sortable="custom" />

          <el-table-column prop="delivery" label="发货方式" min-width="140">
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
          <el-table-column prop="countryName" label="国家" min-width="140" />
          <el-table-column prop="provinceName" label="省" width="160" />
          <el-table-column prop="cityName" label="市" width="160" />
          <el-table-column prop="areaName" label="区" width="160" />
          <el-table-column prop="address" label="地址" min-width="300" />
          <el-table-column prop="exchangeGoodsFlag" label="发货标识" min-width="140" sortable="custom">
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
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_sale_send')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'FHREFForm', fhFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 销售退货货通知单列表 -->
        <JNPF-table v-loading="listLoading" :data="thTableList" v-show="categoryType == 'inbound_sale_return'"
          custom-column ref="thtabForm" :fixedNo="true" :setColumnDisplayList="thcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'THREFForm', thFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="客户名称" min-width="140" sortable="custom" />
          <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom" />
          <el-table-column prop="deliverDate" label="退货日期" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="exchangeGoodsFlag" label="退货标识" min-width="140" sortable="custom">
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
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'inbound_sale_return')">入库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'THREFForm', thFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- { label: "销售发货", value: "outbound_sale_send" },
        { label: "销售退货", value: "inbound_sale_return" },
        { label: "采购收货", value: "inbound_purchase" },
        { label: "采购退货", value: "outbound_purchase" },
        { label: "生产领料", value: "outbound_pick_out" },
        { label: "生产退料", value: "inbound_return_materials" },
        { label: "外协发料", value: "outbound_external_send" },
        { label: "外协退料", value: "inbound_external_return" },
        { label: "外协收货", value: "inbound_external" },
        { label: "外协退货", value: "outbound_external" }, -->

        <!-- 采购收/退货 -->
        <JNPF-table v-loading="listLoading" :data="cgTableList"
          v-show="categoryType == 'outbound_purchase' || categoryType == 'inbound_purchase'" custom-column
          ref="cgthtabForm" :fixedNo="true" :setColumnDisplayList="cgthcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" v-if="categoryType == 'outbound_purchase'"
                @click.native="viewFun(scope.row.id, 'look', 'CGTHREFForm', cgthFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
              <el-link type="primary" v-if="categoryType == 'inbound_purchase'"
                @click.native="viewFun(scope.row.id, 'look', 'CGSHREFForm', cgshFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="供应商名称" min-width="140" sortable="custom" />
          <el-table-column prop="partnerCode" label="供应商编码" width="200" sortable="custom" />
          <el-table-column prop="salesman" label="操作员" min-width="140" sortable="custom" />
          <el-table-column prop="deliverDate" label="退货日期" min-width="140" sortable="custom"
            v-if="categoryType == 'outbound_purchase'"></el-table-column>
          <el-table-column prop="deliverDate" label="收货日期" min-width="140" sortable="custom"
            v-if="categoryType == 'inbound_purchase'"></el-table-column>
          <el-table-column prop="remark" label="备注" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" v-if="categoryType == 'outbound_purchase'"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_purchase')">出库</el-button>
              <el-button size="mini" type="text" v-if="categoryType == 'inbound_purchase'"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'inbound_purchase')">入库</el-button>
              <el-button size="mini" type="text" v-if="categoryType == 'outbound_purchase'"
                @click="viewFun(scope.row.id, 'look', 'CGTHREFForm', cgthFormVisible = true)">查看详情</el-button>
              <el-button size="mini" type="text" v-if="categoryType == 'inbound_purchase'"
                @click="viewFun(scope.row.id, 'look', 'CGSHREFForm', cgshFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>

        <!-- 外协收货 -->
        <JNPF-table v-loading="listLoading" :data="wxshTableList" v-show="categoryType == 'inbound_external'"
          custom-column ref="wxshtabForm" :fixedNo="true" :setColumnDisplayList="wxshthcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <!-- <el-link type="primary" v-if="categoryType == 'outbound_purchase'"
                @click.native="viewFun(scope.row.id, 'look', 'CGTHREFForm', cgthFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link> -->
              <el-link type="primary" v-if="categoryType == 'inbound_external'"
                @click.native="viewFun(scope.row.id, 'look', 'WXSHREFForm', wxshFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerCode" label="供应商编码" width="200" sortable="custom" />
          <el-table-column prop="partnerName" label="供应商名称" min-width="140" sortable="custom" />
          <el-table-column prop="salesman" label="操作员" min-width="140" sortable="custom" />
          <el-table-column prop="deliverDate" label="收货日期" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="remark" label="备注" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" v-if="categoryType == 'outbound_purchase'"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_purchase')">出库</el-button> -->
              <el-button size="mini" type="text" v-if="categoryType == 'inbound_external'"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'inbound_external')">入库</el-button>
              <!-- <el-button size="mini" type="text" v-if="categoryType == 'outbound_purchase'"
                @click="viewFun(scope.row.id, 'look', 'CGTHREFForm', cgthFormVisible = true)">查看详情</el-button> -->
              <el-button size="mini" type="text" v-if="categoryType == 'inbound_external'"
                @click="viewFun(scope.row.id, 'look', 'WXSHREFForm', wxshFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 外协发料 -->
        <JNPF-table v-loading="listLoading" :key="3" :data="wxflTableList"
          v-show="categoryType == 'outbound_external_send'" custom-column ref="wxfltabForm" :fixedNo="true"
          :setColumnDisplayList="wxflcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'WXFLREFForm', wxflFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="供应商名称" min-width="140" sortable="custom" />
          <el-table-column prop="partnerCode" label="供应商编码" width="200" sortable="custom" />
          <el-table-column prop="deliverDate" label="发料日期" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="recipient" label="收件人" min-width="120" sortable="custom" />
          <el-table-column prop="phone" label="收件人电话" min-width="140" sortable="custom" />
          <el-table-column prop="delivery" label="发料方式" min-width="140" sortable="custom">
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
          <el-table-column prop="countryName" label="国家" width="160" sortable="custom" />
          <el-table-column prop="provinceName" label="省" width="160" sortable="custom" />
          <el-table-column prop="cityName" label="市" width="160" sortable="custom" />
          <el-table-column prop="areaName" label="区" width="160" sortable="custom" />
          <el-table-column prop="address" label="地址" min-width="300" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_external_send')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'WXFLREFForm', wxflFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>

        <!-- 装配/套圈领料 outbound_pick_out -->
        <JNPF-table v-loading="listLoading" :data="pickingTableList" v-show="categoryType == 'outbound_pick_out'"
          custom-column ref="picktabForm" :fixedNo="true" :setColumnDisplayList="pickcolumnList">
          <el-table-column prop="orderNo" label="领料单号" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'PickREFForm', pickFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="receiveType" label="领料类型" min-width="140" sortable="custom">
            <template slot-scope="scope">
              <div>{{ scope.row.receiveType == 'order' ? '订单物料' : "工序物料" }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="productionOrderNo" label="任务单号" min-width="160" sortable="custom" />
          <el-table-column prop="personName" label="领料人" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'picking')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'PickREFForm', pickFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>

        <!-- 装配/套圈退料 outbound_pick_out -->
        <JNPF-table v-loading="listLoading" :data="returnMaterTableList"
          v-show="categoryType == 'inbound_return_materials'" custom-column ref="returnMatertabForm" :fixedNo="true"
          :setColumnDisplayList="returnMatercolumnList">
          <el-table-column prop="orderNo" label="退料单号" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'ReturnMaterREFForm', returnMaterFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="receiveType" label="退料类型" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <div>{{ scope.row.receiveType == 'order' ? '订单物料' : "工序物料" }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="productionOrderNo" label="任务单号" min-width="160" sortable="custom" />
          <el-table-column prop="personName" label="退料人" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'returnMater')">入库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'ReturnMaterREFForm', returnMaterFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>


        <pagination :total="fhTotal" :page.sync="fhForm.pageNum" :limit.sync="fhForm.pageSize"
          @pagination="getTabdataList"
          v-if="categoryType == 'outbound_sale_send' || categoryType == 'inbound_sale_return'">
        </pagination>
        <pagination :total="cgTotal" :page.sync="cgForm.pageNum" :limit.sync="cgForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_purchase' || categoryType == 'inbound_purchase'">
        </pagination>
        <pagination :total="wxshTotal" :page.sync="wxshForm.pageNum" :limit.sync="wxshForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'inbound_external'">
        </pagination>
        <pagination :total="wxflTotal" :page.sync="wxflForm.pageNum" :limit.sync="wxflForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_external_send'">
        </pagination>
        <pagination :total="pickTotal" :page.sync="pickForm.pageNum" :limit.sync="pickForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_pick_out'">
        </pagination>
        <pagination :total="returnMaterTotal" :page.sync="returnMaterForm.pageNum"
          :limit.sync="returnMaterForm.pageSize" @pagination="getTabdataList"
          v-if="categoryType == 'inbound_return_materials'">
        </pagination>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick" v-show="categoryType == 'inbound_mock_production'"
        class="produce">
        <el-tab-pane label="生产产品入库" name="product">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.orderNo" @keyup.enter.native="searchProductData()" placeholder="任务单号"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="productForm.orderType" placeholder="任务类型" style="width: 100%;">
                      <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.productDrawingNo" @keyup.enter.native="searchProductData()"
                      placeholder="品名规格" clearable />

                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductData()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun('product')">{{
                      $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <div class="JNPF-common-head">
                <div>
                  <!-- <el-button  size="mini" type="primary"
                    icon="el-icon-plus" @click="batchInbound('product')">批量入库</el-button> -->
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="advancedQueryFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('dataTableProductRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="searchProductData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTableProductRef" v-loading="listLoading" :data="productData" :fixedNO="true"
                custom-column :setColumnDisplayList="productColumns" v-show="categoryType == 'inbound_mock_production'">
                <el-table-column prop="orderNo" label="任务单号" width="180" />
                <el-table-column prop="orderType" label="任务类型" width="120">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderTypeList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="productionQuantity" label="生产数量" width="120" />
                <el-table-column prop="completedQuantity" label="已完成数量" width="130" />
                <el-table-column prop="waitReceivedQuantity" label="待入库数量" width="160" />
                <el-table-column v-if="classAttribute == 'semi_finished'" prop="aperture" label="孔径" width="100" />
                <el-table-column v-if="classAttribute == 'semi_finished'" prop="productionPlanNo" label="计划单号"
                  width="160" />
                <el-table-column v-if="classAttribute == 'finish_product'" prop="sealingCoverTyping" label="打字内容"
                  width="100" />
                <el-table-column v-if="classAttribute == 'finish_product'" prop="accuracyLevel" label="精度等级"
                  width="100" />
                <el-table-column v-if="classAttribute == 'finish_product'" prop="vibrationLevel" label="振动等级"
                  width="100" />
                <el-table-column v-if="classAttribute == 'finish_product'" prop="oil" label="油脂" width="100" />
                <el-table-column v-if="classAttribute == 'finish_product'" prop="oilQuantity" label="油脂量" width="100" />
                <el-table-column v-if="classAttribute == 'finish_product'" prop="clearance" label="游隙" width="100" />
                <el-table-column v-if="classAttribute == 'finish_product'" prop="packagingMethod" label="包装方式"
                  width="100"></el-table-column>
                <el-table-column v-if="classAttribute == 'finish_product'" prop="specialRequire" label="特殊要求"
                  width="100"></el-table-column>
                <el-table-column v-if="classAttribute == 'finish_product'" prop="createTime" label="创建时间" width="180" />
                <el-table-column v-if="classAttribute == 'semi_finished'" prop="createByName" label="创建人" width="180" />

                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="productInbound(scope.row,)">入库</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="productTotal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize"
                @pagination="searchProductData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="生产工单入库" name="work">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workForm.productionOrderNo" placeholder="任务单号" clearable
                      @keyup.enter.native="searchWorkDta()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workForm.orderNo" placeholder="工单号" clearable
                      @keyup.enter.native="searchWorkDta()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workForm.productDrawingNo" placeholder="品名规格" clearable
                      @keyup.enter.native="searchWorkDta()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workForm.processName" placeholder="工序名称" clearable
                      @keyup.enter.native="searchWorkDta()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchWorkDta()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun('work')">{{
                      $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <!-- <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="batchInbound('work')">批量入库</el-button> -->
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="advancedQueryFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('dataTableProductRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="searchWorkDta()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTableWorkRef" v-loading="listLoading" :data="workData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="productionOrderNo" label="任务单号" width="180" />
                <el-table-column prop="orderNo" label="工单号" width="180" />
                <el-table-column prop="productDrawingNo" label="品名规格" width="160" />
                <el-table-column prop="productName" label="产品编码" width="160" />

                <el-table-column prop="processName" label="工序名称" width="160" />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="productionQuantity" label="生产数量" width="120" />
                <el-table-column prop="qualifiedQuantity" label="已完成数量" width="120" />
                <el-table-column prop="waitReceivedQuantity" label="待入库数量" width="120" />

                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="workInbound(scope.row)">入库</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="workTotal" :page.sync="workForm.pageNum" :limit.sync="workForm.pageSize"
                @pagination="searchWorkDta" />
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <!-- 查看详情 -->
    <FHForm v-if="fhFormVisible" ref="FHREFForm" @close="closeForm" />
    <THForm v-if="thFormVisible" ref="THREFForm" @close="closeForm" />
    <CGTHREFForm v-if="cgthFormVisible" ref="CGTHREFForm" @close="closeForm" />
    <CGSHREFForm v-if="cgshFormVisible" ref="CGSHREFForm" @close="closeForm" />
    <WXFLREFForm v-if="wxflFormVisible" ref="WXFLREFForm" @close="closeForm" />
    <WXSHREFForm v-if="wxshFormVisible" ref="WXSHREFForm" @close="closeForm" />
    <PickForm v-if="pickFormVisible" ref="PickREFForm" @close="closeForm" />
    <ReturnMaterREFForm v-if="returnMaterFormVisible" ref="ReturnMaterREFForm" @close="closeForm" />




    <!-- 出/入库 -->
    <ProductInboundForm v-if="productInboundFormVisible" ref="productInboundREFForm" @close="closeForm">
    </ProductInboundForm>
    <WorkInboundForm v-if="workInboundFormVisible" ref="workInboundREFForm" @close="closeForm">
    </WorkInboundForm>
    <OutboundSaleSendForm v-if="outboundSaleSendFormVisible" ref="outboundSaleSendREFForm" @close="closeForm">
    </OutboundSaleSendForm>
    <InboundSaleReturnForm v-if="inboundSaleReturnFormVisible" ref="inboundSaleReturnREFForm" @close="closeForm">
    </InboundSaleReturnForm>
    <InboundPurchaseForm v-if="inboundPurchaseFormVisible" ref="inboundPurchaseREFForm" @close="closeForm">
    </InboundPurchaseForm>
    <OutboundPurchaseForm v-if="outboundPurchaseFormVisible" ref="outboundPurchaseREFForm" @close="closeForm">
    </OutboundPurchaseForm>
    <OutboundExternalSendForm v-if="outboundExternalSendFormVisible" ref="outboundExternalSendREFForm"
      @close="closeForm">
    </OutboundExternalSendForm>
    <InboundExternalForm v-if="inboundExternalFormVisible" ref="inboundExternalREFForm" @close="closeForm">
    </InboundExternalForm>
    <OutboundPickOutForm v-if="outboundPickOutFormVisible" ref="outboundPickOutREFForm" @close="closeForm">
    </OutboundPickOutForm>
    <InboundReturnMaterialsForm v-if="inboundReturnMaterialsFormVisible" ref="inboundReturnMaterialsREFForm" @close="closeForm">
    </InboundReturnMaterialsForm>
    
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

  </div>
</template>

<script>
import { getQuotationdatasendlist, getStockMovelist } from '@/api/salesManagement/index'
import { purPurchaseReceiptReturnGoodsList } from "@/api/purchasingAndOutsourcingOrders/index"
import { ordershengchanList, detailordershengchan, getWorkPage } from '@/api/productOrdes/index.js'

import Form from './Form'
import mixin from '@/mixins/generator/index'
import { Release } from '@/api/onlineDev/visualDev'
import { getVisualDevList, Delete, Copy, exportData } from '@/api/onlineDev/visualDev'
import SuperQuery from '@/components/SuperQuery/index.vue'
import FHForm from "../../../salesManagement/shippingnotice/saleMetalworking/Form.vue"
import THForm from "../../../salesManagement/shippingnotice/returnSalesmemo/Form.vue"
import CGTHREFForm from "../../../purchasingManagement/returnManagement/purchaseReturnNote/Form.vue"
import CGSHREFForm from "../../../warehouseManagement/finishedProductWarehouseManagement/purchaseReceiveNote/Form.vue"
import WXSHREFForm from '../../../receivingManagement/receiveGoodsByOutsourcing/receivingAdvice/Form.vue'
import WXFLREFForm from "../../../outsourcingManagement/externalMaterialIssuance/materialsIssueNotice/Form.vue"
import PickForm from "@/views/productionManagement/assemblyPick/assemblyPickManagement/Form.vue"
import ReturnMaterREFForm from "../../../productionManagement/assemblyPick/assemblyReturnMaterManagement/Form.vue"
import ProductInboundForm from './productInboundForm.vue'
import OutboundSaleSendForm from './outboundSaleSendForm.vue'
import InboundSaleReturnForm from './inboundSaleReturnForm.vue'
import WorkInboundForm from './workInboundForm.vue'
import InboundPurchaseForm from './inboundPurchaseForm.vue'
import OutboundPurchaseForm from './outboundPurchaseForm.vue'
import OutboundExternalSendForm from './outboundExternalSendForm.vue'
import InboundExternalForm from './inboundExternalForm.vue'
import OutboundPickOutForm from './outboundPickOutForm.vue'
import InboundReturnMaterialsForm from './inboundReturnMaterialsForm.vue'
import { WithdrawalList } from '@/api/productOrdes/index.js'
export default {
  name: 'dbIncomAndOutInventory',
  mixins: [mixin],
  components: {
    Form, SuperQuery, THForm, FHForm,
    CGSHREFForm, CGTHREFForm, WXSHREFForm,
    WXFLREFForm, PickForm, ReturnMaterREFForm,
    ProductInboundForm, WorkInboundForm, OutboundSaleSendForm,
    InboundSaleReturnForm, InboundPurchaseForm, OutboundPurchaseForm,
    OutboundExternalSendForm, InboundExternalForm,OutboundPickOutForm,InboundReturnMaterialsForm
  },
  props: {
    classAttribute: "",
  },
  data() {
    return {
      orderTypeList: [
        { label: "正常订单", value: "normal", },
        { label: "返工订单", value: "rework", },
      ],
      productInboundFormVisible: false,
      workInboundFormVisible: false,
      outboundSaleSendFormVisible: false,
      inboundSaleReturnFormVisible: false,
      inboundPurchaseFormVisible: false,
      outboundPurchaseFormVisible: false,
      outboundExternalSendFormVisible: false,
      inboundExternalFormVisible: false,
      outboundPickOutFormVisible:false,
      inboundReturnMaterialsFormVisible:false,
      productColumns: ["productCode", 'createByName'],
      productTotal: 0,
      productData: [],
      productForm: {
        orderNo: "",
        orderType: "",
        productDrawingNo: "",
        classAttribute: "",
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
        pageNum: 1,
        pageSize: 20,
      },

      workColumns: [],
      workTotal: 0,
      workData: [],
      workForm: {
        productionOrderNo: "",
        orderNo: "",
        processName: "",
        productDrawingNo: "",
        classAttribute: "",
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
        pageNum: 1,
        pageSize: 20,
      },



      activeName: "product",
      returnMaterFormVisible: false,
      thFormVisible: false,
      fhFormVisible: false,
      cgthFormVisible: false,
      cgshFormVisible: false,
      fhcolumnList: ['partnerCode', "provinceName", "cityName", "areaName", "address", "countryName", "createByName"],
      thcolumnList: ["partnerCode", "createByName"],
      cgthcolumnList: ["partnerCode", "createByName", 'remark'],
      wxshthcolumnList: ["partnerCode", "remark", "createByName"],
      wxflcolumnList: ['partnerCode', "provinceName", "cityName", "areaName", "address", "countryName", "createByName"],
      fhDateArr: [],//发货通知单 查询条件 发货日期
      cgDateArr: [],
      cgTotal: 0,
      cgForm: {
        classAttribute: "",
        documentStatus: "sibmit",
        deliverDateStart: "",
        deliverDateEnd: "",
        notificationType: "procure",
        receivingStatus: "not_finished",
        receiptReturnType: "",
        orderNo: "",
        partnerName: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
        pageNum: 1,
        pageSize: 20,
      },
      fhTableList: [],//发货列表数据
      fhTotal: 0,//发货 列表总条数
      // 发货列表请求条件
      fhForm: {
        classAttribute: "",
        orderNo: "",
        partnerName: "",
        pageNum: 1,
        pageSize: 20,
        returnDeliveryType: '',
        deliveryStatus: "not_finished",
        documentStatus: "sibmit",
        notifyType: "sale",
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
      wxshFormVisible: false,
      wxshDateArr: [],
      wxshTotal: 0,
      wxshTableList: [],
      wxshForm: {
        pageNum: 1,
        pageSize: 20,
        classAttribute: "",
        documentStatus: "sibmit",
        deliverDateStart: "",
        deliverDateEnd: "",
        notificationType: "external",
        receivingStatus: "not_finished",
        receiptReturnType: "receipt",
        orderNo: "",
        partnerName: "",
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
      wxshTableList: [],



      wxflFormVisible: false,
      wxflDateArr: [],
      wxflTotal: 0,
      wxflTableList: [],
      wxflForm: {
        pageNum: 1,
        pageSize: 20,
        classAttribute: "",
        documentStatus: "sibmit",
        rdeDate: "",
        rdsDate: "",
        notifyType: "external",
        receivingStatus: "not_finished",
        returnDeliveryType: "delivery",
        orderNo: "",
        partnerName: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
      },

      pickcolumnList: ["createByName",],
      receiveTypeList: [
        { label: "订单物料", value: "order" },
        { label: "工序物料", value: "process" },
      ],
      pickTotal: 0,
      pickFormVisible: false,
      pickForm: {
        pageNum: 1,
        pageSize: 20,
        productClassAttribute: "",
        pickingFlag: 1,
        receiveType: "",
        orderNo: "",
        personName: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
      },
      pickingTableList: [],
      returnMatercolumnList: ["createByName",],

      returnMaterTotal: 0,
      returnMaterTableList: [],
      returnMaterForm: {
        receiveType: "",
        orderNo: "",
        personName: "",
        productClassAttribute: "",
        backFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
        pageNum: 1,
        pageSize: 20,
      },




      defaultProps: {
        children: "",
        label: "fullName",
        key: "businessType"
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
      cgTableList: [],
      selectProductList: [],
      selectWorkList: [],
    }
  },
  watch: {
    'categoryType': function (newVal) {
      this.getTabdataList()
    },
  },
  mounted() {
    // 进入页面  默认查询销售发货通知单数据

    this.getStockMovelistFun()
    console.log(this.classAttribute);
  },
  methods: {


    getStockMovelistFun() {
      getStockMovelist(this.classAttribute).then(res => {
        console.log("左侧分类数据", res);
        if (res.data.length) {
          res.data.forEach(item => {
            if (item.businessType == 'outbound_sale_send') {
              this.$set(item, 'fullName', '销售发货')
            }
            if (item.businessType == 'inbound_sale_return') {
              item.fullName = '销售退货'
            }
            if (item.businessType == 'inbound_purchase') {
              item.fullName = '采购收货'
            }
            if (item.businessType == 'outbound_purchase') {
              item.fullName = '采购退货'
            }

            if (item.businessType == 'outbound_external_send') {
              item.fullName = '外协发料'
            }
            if (item.businessType == 'inbound_external') {
              item.fullName = '外协收货'
            }
            if (item.businessType == 'outbound_pick_out') {
              item.fullName = '生产领料'

            }
            if (item.businessType == 'inbound_return_materials') {
              item.fullName = '生产退料'

            }
            if (item.businessType == 'inbound_mock_production') {
              item.fullName = '生产入库'

            }

          });
        }
        this.$nextTick(() => {
          this.treeData = res.data
          this.categoryType = this.treeData[0].businessType
          this.getTabdataList()
        })

      })
    },
    // 点击出库/入库按钮
    incomAndOutInventFun(data, btnType, ref) {
      if (this.categoryType) {
        if (this.categoryType == 'outbound_sale_send') {
          this.outboundSaleSendFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundSaleSendREFForm.init(data, btnType, this.categoryType, this.classAttribute)
          })
        } else
          if (this.categoryType == 'inbound_sale_return') {
            this.inboundSaleReturnFormVisible = true
            this.$nextTick(() => {
              this.$refs.inboundSaleReturnREFForm.init(data, btnType, this.categoryType, this.classAttribute)
            })
          } else if (this.categoryType == 'inbound_purchase') {
            this.inboundPurchaseFormVisible = true
            this.$nextTick(() => {
              this.$refs.inboundPurchaseREFForm.init(data, btnType, this.categoryType, this.classAttribute)
            })
          } else if (this.categoryType == 'outbound_purchase') {
            this.outboundPurchaseFormVisible = true
            this.$nextTick(() => {
              this.$refs.outboundPurchaseREFForm.init(data, btnType, this.categoryType, this.classAttribute)
            })
          } else if (this.categoryType == 'outbound_external_send') {
            this.outboundExternalSendFormVisible = true
            this.$nextTick(() => {
              this.$refs.outboundExternalSendREFForm.init(data, btnType, this.categoryType, this.classAttribute)
            })
          } else if (this.categoryType == 'inbound_external') {
            this.inboundExternalFormVisible = true
            this.$nextTick(() => {
              this.$refs.inboundExternalREFForm.init(data, btnType, this.categoryType, this.classAttribute)
            })
          } else if (this.categoryType == 'outbound_pick_out') {
            this.outboundPickOutFormVisible = true
            this.$nextTick(() => {
              this.$refs.outboundPickOutREFForm.init(data, btnType, this.categoryType, this.classAttribute)
            })
          }else if (this.categoryType == 'inbound_return_materials') {
            this.inboundReturnMaterialsFormVisible = true
            this.$nextTick(() => {
              this.$refs.inboundReturnMaterialsREFForm.init(data, btnType, this.categoryType, this.classAttribute)
            })
          } else {
            this.formVisible = true
            this.$nextTick(() => {
              this.$refs[ref].init(data, btnType, this.categoryType, this.classAttribute)
            })
          }
          

      }
    },
    // 根据左侧分类  点击不同的分类  请求不同的数据
    getTabdataList() {
      // 发货通知单
      this.$forceUpdate()
      console.log(this.categoryType);
      if (this.categoryType == 'outbound_sale_send') {
        this.listLoading = true
        this.fhForm.returnDeliveryType = 'delivery'
        this.fhForm.classAttribute = this.classAttribute
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
        this.$set(this.fhForm, 'inspectionStatus', 'inspected')
        this.fhForm.classAttribute = this.classAttribute
        getQuotationdatasendlist(this.fhForm).then(res => {
          this.thTableList = res.data.records
          this.fhTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 采购收货
      if (this.categoryType == 'inbound_purchase') {
        this.listLoading = true
        this.cgForm.receiptReturnType = 'receipt'
        // this.$set(this.cgForm,'receiptInboundFlag',1)
        this.cgForm.classAttribute = this.classAttribute
        purPurchaseReceiptReturnGoodsList(this.cgForm).then(res => {
          this.cgTableList = res.data.records
          this.cgTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 采购退货
      if (this.categoryType == 'outbound_purchase') {
        this.listLoading = true
        this.cgForm.receiptReturnType = 'back'
        this.cgForm.classAttribute = this.classAttribute
        purPurchaseReceiptReturnGoodsList(this.cgForm).then(res => {
          this.cgTableList = res.data.records
          this.cgTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 外协发料
      if (this.categoryType == 'outbound_external_send') {
        this.listLoading = true
        this.wxflForm.classAttribute = this.classAttribute
        getQuotationdatasendlist(this.wxflForm).then(res => {
          this.wxflTableList = res.data.records
          this.wxflTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 外协收货
      if (this.categoryType == 'inbound_external') {
        this.listLoading = true
        this.$set(this.wxshForm, 'receiptInboundFlag', 1)


        this.wxshForm.classAttribute = this.classAttribute
        purPurchaseReceiptReturnGoodsList(this.wxshForm).then(res => {
          this.wxshTableList = res.data.records
          this.wxshTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 生产领料
      if (this.categoryType == 'outbound_pick_out') {
        this.listLoading = true
        console.log(555);
        this.pickForm.productClassAttribute = this.classAttribute
        WithdrawalList(this.pickForm).then(res => {
          console.log("领料", res);
          this.pickingTableList = res.data.records
          this.pickTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 生产退料
      if (this.categoryType == 'inbound_return_materials') {
        this.listLoading = true
        this.returnMaterForm.productClassAttribute = this.classAttribute
        WithdrawalList(this.returnMaterForm).then(res => {
          console.log("退料", res);
          this.returnMaterTableList = res.data.records
          this.returnMaterTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 生产入库
      if (this.categoryType == 'inbound_mock_production') {
        if (this.activeName == 'product') {
          this.searchProductData()
        } else {
          this.searchWorkDta()
        }
      }
    },
    // 生产产品数据
    searchProductData() {
      this.listLoading = true
      this.productForm.classAttribute = this.classAttribute
      ordershengchanList(this.productForm).then(res => {
        console.log("生产产品", res);
        this.productData = res.data.records
        this.productTotal = res.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
      })
    },
    // 生产工单数据
    searchWorkDta() {
      this.listLoading = true
      this.workForm.classAttribute = this.classAttribute
      getWorkPage(this.workForm).then(res => {
        console.log("生产产品", res);
        this.workData = res.data.records
        this.workTotal = res.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
      })
    },
    // 生产入库 产品与工单切换
    handleClick() {
      if (this.activeName == 'product') {
        this.searchProductData()
      } else {
        this.searchWorkDta()
      }
    },
    // 生产产品多选
    handleSelectionProduct(val) {
      console.log(val);
      this.selectProductList = []
      this.selectProductList = val
    },
    // 工单多选
    handleSelectionWork(val) {
      this.selectWorkList = []
      this.selectWorkList = val
    },
    // 生产产品单条入库
    productInbound(row) {
      let arr = []
      arr.push(row)
      this.productInboundFormVisible = true
      this.$nextTick(() => {
        console.log(555);
        this.$refs.productInboundREFForm.init(arr, 'add', this.classAttribute)
      })
    },
    // 生产工单单条入库
    workInbound(row) {
      let arr = []
      arr.push(row)
      this.workInboundFormVisible = true
      this.$nextTick(() => {
        console.log(666, this.classAttribute);
        this.$refs.workInboundREFForm.init(arr, 'add', this.classAttribute)
      })
    },
    // // 生产批量入库
    // batchInbound(type) {
    //   if (type == 'product') {
    //     // 生产产品批量入库
    //     if (!this.selectProductList.length) return this.$message.error("请选择您要入库的数据")
    //     this.productInboundFormVisible = true
    //     this.$nextTick(() => {
    //       this.$refs.productInboundREFForm.init(this.selectProductList, 'add', this.classAttribute)
    //     })
    //   } else {
    //     // 生产工单批量入库
    //     if (!this.selectWorkList.length) return this.$message.error("请选择您要入库的数据")
    //     this.workInboundFormVisible = true
    //     this.$nextTick(() => {
    //       this.$refs.workInboundREFForm.init(this.selectWorkList, 'add', this.classAttribute)
    //     })
    //   }
    // },
    // 高级查询
    advancedQueryFun() {
      if (this.categoryType == 'outbound_sale_send' || this.categoryType == 'outbound_external_send') {
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
    resetFun(type) {
      if (this.categoryType == 'outbound_sale_send' || this.categoryType == 'inbound_sale_return') {
        this.fhForm = {
          orderNo: "",
          classAttribute: this.classAttribute,
          partnerName: "",
          pageNum: 1,
          pageSize: 20,
          returnDeliveryType: '',
          deliveryStatus: "not_finished",
          documentStatus: "sibmit",
          notifyType: "sale",
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
          this.getTabdataList()
      }
      if (this.categoryType == 'inbound_purchase' || this.categoryType == 'outbound_purchase') {
        this.cgForm = {
          documentStatus: "sibmit",
          classAttribute: this.classAttribute,
          deliverDateStart: "",
          deliverDateEnd: "",
          notificationType: "procure",
          receivingStatus: "not_finished",
          receiptReturnType: "",
          orderNo: "",
          partnerName: "",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
          superQuery: {},
        },
          this.getTabdataList()
      }
      if (this.categoryType == 'outbound_external_send') {
        this.wxflForm = {
          documentStatus: "sibmit",
          classAttribute: this.classAttribute,

          rdeDate: "",
          rdsDate: "",
          notifyType: "external",
          receivingStatus: "not_finished",
          receiptReturnType: "receipt",
          orderNo: "",
          partnerName: "",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
          superQuery: {},
        },
          this.getTabdataList()
      }
      if (this.categoryType == 'inbound_external') {
        this.wxshForm = {
          orderNo: "",
          classAttribute: this.classAttribute,
          partnerName: "",
          pageNum: 1,
          pageSize: 20,
          returnDeliveryType: 'delivery',
          deliveryStatus: "not_finished",
          documentStatus: "sibmit",
          notificationType: "external",
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
          this.getTabdataList()
      }
      if (this.categoryType == 'outbound_pick_out') {
        this.pickForm = {
          pageNum: 1,
          pageSize: 20,
          productClassAttribute: this.classAttribute,
          pickingFlag: 1,
          receiveType: "",
          orderNo: "",
          personName: "",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
          superQuery: {},
        },
          this.getTabdataList()
      }
      if (this.categoryType == 'inbound_return_materials') {
        this.returnMaterForm = {
          receiveType: "",
          orderNo: "",
          personName: "",
          productClassAttribute: "",
          backFlag: true,
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
          superQuery: {},
          pageNum: 1,
          pageSize: 20,
        }
        this.getTabdataList()
      }
      if (this.categoryType == 'inbound_mock_production') {
        if (type == 'product') {
          this.productForm = {
            orderNo: "",
            orderType: "",
            productDrawingNo: "",
            classAttribute: "",
            stockFlag: true,
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: false,
              column: "create_time"
            }],
            superQuery: {},
            pageNum: 1,
            pageSize: 20,
          }
          this.searchProductData()
        } else {
          this.workForm = {
            productionOrderNo: "",
            orderNo: "",
            processName: "",
            productDrawingNo: "",
            classAttribute: "",
            stockFlag: true,
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: false,
              column: "create_time"
            }],
            superQuery: {},
            pageNum: 1,
            pageSize: 20,
          }
          this.searchWorkDta()
        }
      }

    },



    // 查看详情
    viewFun(id, btnType, ref, visible) {
      console.log(id, btnType, ref, visible);
      this.$nextTick(() => {
        if (ref == 'PickREFForm') {
          console.log(666);
          this.$refs[ref].init(id, btnType, false, 'pick')
        } else {
          this.$refs[ref].init(id, btnType)

        }
      })
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.fhFormVisible = false
      this.thFormVisible = false
      this.formVisible = false
      this.cgshFormVisible = false
      this.cgthFormVisible = false
      this.wxflFormVisible = false
      this.wxshFormVisible = false
      this.pickFormVisible = false
      this.returnMaterFormVisible = false
      this.productInboundFormVisible = false
      this.workInboundFormVisible = false
      this.outboundSaleSendFormVisible = false
      this.inboundSaleReturnFormVisible = false
      this.inboundPurchaseFormVisible = false
      this.outboundPurchaseFormVisible = false
      this.outboundExternalSendFormVisible = false
      this.inboundExternalFormVisible = false
      this.outboundPickOutFormVisible=false
            this.inboundReturnMaterialsFormVisible = false
            if (isRefresh) {
        this.getStockMovelistFun()
      }
    },





    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
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
  padding: 11px 10px;
}

::v-deep .el-tabs__header {
  margin-bottom: 0;
}

::v-deep .el-badge__content.is-fixed {
  top: 5px;
  right: 24px;
}

.JNPF-common-search-box {
  margin-bottom: 5px;
  padding: 8px !important;
  padding-bottom: 0px !important;
}

::v-deep.el-tabs {
  height: 100%
}

::v-deep .el-tab-pane {
  height: 100%;
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.produce ::v-deep .el-tabs__header {
  padding: 0 8px;
  background-color: #fff;
  margin-top: 5px;
}

::v-deep .el-tabs__item {
  padding: 0 10px;
}

.JNPF-common-head {
  padding: 8px;
}
::v-deep .el-radio-button:first-child .el-radio-button__inner{
  border-radius: 0;
} .tag-group{
  padding-bottom: 5px!important;
  padding-top: 5px!important;
}
</style>
