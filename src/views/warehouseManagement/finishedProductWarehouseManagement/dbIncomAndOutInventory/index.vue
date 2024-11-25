<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!visibleForm">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:0px 0 0px 0">
        <el-radio-group v-model="categoryType" style="background-color:#fff;">

          <el-badge :value="item.num != null || item.num != undefined ? item.num : item.todoNum" :max="99"
            v-for="item in treeData" :key="item.id">
            <el-radio-button style="margin:2px 0;" :key="item.businessType" :label="item.businessType">{{ item.fullName
              }}</el-radio-button>
          </el-badge>
        </el-radio-group>
      </div>
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16" style="margin-top: 5px;"
        v-if="categoryType != 'inbound_mock_production'">
        <!-- 销售待发/退货查询条件 通知单 -->
        <el-form @submit.native.prevent
          v-if="(categoryType == 'outbound_sale_send' && !saleFlag) || categoryType == 'inbound_sale_return'">
          <template v-for="item in searchList1">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>


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
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 销售发货  订单 -->
        <el-form @submit.native.prevent v-if="categoryType == 'outbound_sale_send' && saleFlag">


          <template v-for="item in searchList9">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="saleOrderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="交货开始日期" end-placeholder="交货结束日期'" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 采购 收退货查询条件 -->
        <el-form @submit.native.prevent
          v-if="categoryType == 'outbound_purchase' || (categoryType == 'inbound_purchase' && !purchaseFlag)">

          <template v-for="item in searchList2">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
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
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 采购收货  订单 -->
        <el-form @submit.native.prevent v-if="categoryType == 'inbound_purchase' && purchaseFlag">
          <template v-for="item in searchList10">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="purchaserOrderDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="收货开始日期" end-placeholder="收货结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>

        <!-- 外协收货查询条件 -->
        <el-form @submit.native.prevent v-if="categoryType == 'inbound_external' && !externalFlag">

          <template v-for="item in searchList4">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="wxshDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="收货开始日期" end-placeholder="收货结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 外协收货 订单 -->
        <el-form @submit.native.prevent v-if="categoryType == 'inbound_external' && externalFlag">

          <template v-for="item in searchList11">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="externalDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="交货日期开始" end-placeholder="交货日期结束" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 外协发料查询条件 -->
        <el-form @submit.native.prevent v-if="categoryType == 'outbound_external_send' && !externalFlag">
          <template v-for="item in searchList3">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>


          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="wxflDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="发料开始日期" end-placeholder="发料结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 外协发料 订单查询条件 -->
        <el-form @submit.native.prevent v-if="categoryType == 'outbound_external_send' && externalFlag">

          <template v-for="item in searchList12">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 生产领料 查询 -->
        <el-form @submit.native.prevent v-if="categoryType == 'outbound_pick_out'">

          <template v-for="item in searchList5">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="4">
            <el-form-item>
              <el-select v-model="pickForm.receiveType" placeholder="领料类型" style="width: 100%;">
                <el-option v-for="(item, index) in receiveTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>

              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 生产退料 查询 -->
        <el-form @submit.native.prevent v-if="categoryType == 'inbound_return_materials'">




          <template v-for="item in searchList6">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="returnMaterForm.receiveType" placeholder="退料类型" style="width: 100%;">
                <el-option v-for="(item, index) in receiveTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 设备领用 查询 -->
        <el-form @submit.native.prevent v-if="categoryType == 'outbound_use'">
          <template v-for="item in searchList13">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="useDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="领用开始日期" end-placeholder="领用结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 设备归还 查询 -->
        <el-form @submit.native.prevent v-if="categoryType == 'inbound_return'">
          <template v-for="item in searchList14">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="getTabdataList('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="repayDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="归还开始日期" end-placeholder="归还结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTabdataList('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="resetFun()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading"
        v-if="categoryType != 'inbound_mock_production'">
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-left: 8px;"
              v-show="categoryType == 'outbound_sale_send' && saleFlag" @click="batchOutbound">批量出库</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus"
              v-show="categoryType == 'inbound_external' && externalFlag" @click="externalBatchInbound">批量入库</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus"
              v-show="categoryType == 'outbound_external_send' && externalFlag"
              @click="externalMaterBatchOutbound">批量出库</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus"
              v-show="categoryType == 'inbound_purchase' && purchaseFlag" @click="purchaseBatchInbound">批量入库</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="advancedQueryFun" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_sale_send' && !saleFlag" @click="columnSetFun('fhtabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_sale_send' && saleFlag" @click="columnSetFun('salestabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_sale_return'" @click="columnSetFun('thtabForm')" />

              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_purchase'" @click="columnSetFun('cgthtabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_purchase' && !purchaseFlag" @click="columnSetFun('cgshtabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_purchase' && purchaseFlag" @click="columnSetFun('purchasetabForm')" />



              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_external' && !externalFlag" @click="columnSetFun('wxshtabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_external' && externalFlag" @click="columnSetFun('externaltabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_external_send'" @click="columnSetFun('wxfltabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_pick_out'" @click="columnSetFun('picktabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_return_materials'" @click="columnSetFun('returnMatertabForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'outbound_use'" @click="columnSetFun('outboundUseForm')" />
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                v-if="categoryType == 'inbound_return'" @click="columnSetFun('inboundReturnForm')" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="getTabdataList()" />
            </el-tooltip>
          </div>
        </div>
        <!-- 销售发货通知单列表 -->
        <JNPF-table :partentOrChild="'fhtabForm'" v-loading="listLoading" :data="fhTableList" @sort-change="sortChange"
          v-show="categoryType == 'outbound_sale_send' && !saleFlag" custom-column ref="fhtabForm" :fixedNO="true"
          :setColumnDisplayList="fhcolumnList">
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
        <!-- 销售发货 订单列表 -->
        <JNPF-table :key='1' :data="saleList" @sort-change="sortChange" v-if="tableDataFlag"
          v-show="categoryType == 'outbound_sale_send' && saleFlag" custom-column ref="salestabForm" :fixedNO="true"
          :setColumnDisplayList="salecolumnList" hasC @selection-change="handeleselectSale">
          <el-table-column prop="orderNo" label="订单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.ordersId, 'look', 'saleREFForm', saleFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="160" sortable="custom" />
          <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="160" sortable="custom" />
          <el-table-column prop="departmentName" label="所属部门" min-width="160" sortable="custom"></el-table-column>
          <el-table-column prop="salesName" label="所属销售" min-width="160" sortable="custom" />
          <el-table-column prop="customerProductNo" label="客户料号" min-width="160" sortable="custom" />
          <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
            sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" min-width="120"  
          v-if="isProjectSwitch == 1" />
          <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
          <el-table-column prop="num" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="160">
          </el-table-column>
          <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column prop="waitDeliverNum" label="待发货数量" min-width="160" sortable="custom" />
          <el-table-column prop="deliveryDate" label="交货日期" min-width="160" sortable="custom" />
          <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="160" sortable="custom" />
          <el-table-column prop="accuracyLevel" label="精度等级" min-width="160" sortable="custom" />
          <el-table-column prop="vibrationLevel" label="振动等级" min-width="160" sortable="custom" />
          <el-table-column prop="oil" label="油脂" min-width="160" sortable="custom" />
          <el-table-column prop="oilQuantity" label="油脂量" min-width="160" sortable="custom" />
          <el-table-column prop="clearance" label="游隙" min-width="160" sortable="custom" />
          <el-table-column prop="packagingMethod" label="包装方式" min-width="160" sortable="custom" />
          <el-table-column prop="specialRequire" label="特殊要求" min-width="160" sortable="custom" />
          <el-table-column prop="remark" label="备注" min-width="160" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />

          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_sale_send')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.ordersId, 'look', 'saleREFForm', saleFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 销售退货货通知单列表 -->
        <JNPF-table :partentOrChild="'thtabForm'" v-loading="listLoading" :data="thTableList" @sort-change="sortChange"
          v-show="categoryType == 'inbound_sale_return'" custom-column ref="thtabForm" :fixedNo="true"
          :setColumnDisplayList="thcolumnList">
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


        <!-- 采购 退货 通知单-->
        <JNPF-table :partentOrChild="'cgthtabForm'" v-loading="listLoading" @sort-change="sortChange"
          :data="cgTableList" v-show="categoryType == 'outbound_purchase'" custom-column ref="cgthtabForm"
          :fixedNo="true" :setColumnDisplayList="cgthcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'CGTHREFForm', cgthFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>

            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="供应商名称" min-width="140" sortable="custom" />
          <el-table-column prop="partnerCode" label="供应商编码" width="200" sortable="custom" />
          <el-table-column prop="salesman" label="操作员" min-width="140" sortable="custom" />
          <el-table-column prop="deliverDate" label="退货日期" min-width="140" sortable="custom"></el-table-column>

          <el-table-column prop="remark" label="备注" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" v-if="categoryType == 'outbound_purchase'"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_purchase')">出库</el-button>

              <el-button size="mini" type="text" v-if="categoryType == 'outbound_purchase'"
                @click="viewFun(scope.row.id, 'look', 'CGTHREFForm', cgthFormVisible = true)">查看详情</el-button>

            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 采购收货通知单 -->
        <JNPF-table :partentOrChild="'cgshtabForm'" v-loading="listLoading" @sort-change="sortChange"
          :data="cgTableList" v-show="categoryType == 'inbound_purchase' && !purchaseFlag" custom-column
          ref="cgshtabForm" :fixedNo="true" :setColumnDisplayList="cgthcolumnList">
          <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
            <template slot-scope="scope">

              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'CGSHREFForm', cgshFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="供应商名称" min-width="140" sortable="custom" />
          <el-table-column prop="partnerCode" label="供应商编码" width="200" sortable="custom" />
          <el-table-column prop="salesman" label="操作员" min-width="140" sortable="custom" />
          <el-table-column prop="deliverDate" label="收货日期" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="remark" label="备注" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">

              <el-button size="mini" type="text" v-if="categoryType == 'inbound_purchase'"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'inbound_purchase')">入库</el-button>

              <el-button size="mini" type="text" v-if="categoryType == 'inbound_purchase'"
                @click="viewFun(scope.row.id, 'look', 'CGSHREFForm', cgshFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 采购收货 订单 -->
        <JNPF-table :partentOrChild="'purchasetabForm'" v-loading="listLoading" @sort-change="sortChange"  v-if="tableDataFlag"
          :data="purchaseList" v-show="categoryType == 'inbound_purchase' && purchaseFlag" custom-column
          ref="purchasetabForm" :fixedNo="true" hasC @selection-change="handeleselectPurchase"
          :setColumnDisplayList="purchasecolumnList">
          <el-table-column prop="orderNo" label="订单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.purchaseOrderId, 'look', 'purchaseREFForm', purchaseFormVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="160" sortable="custom" />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="160" sortable="custom" />
          <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
            sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
          v-if="isProjectSwitch == 1" />
          <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
          <el-table-column prop="num" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="120">
          </el-table-column>
          <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column prop="waitReceiptNum" label="待收货数量" min-width="160" sortable="custom" />
          <el-table-column prop="deliveryDate" label="交货日期" min-width="160" sortable="custom" />
          <el-table-column prop="standardValue" label="规值" min-width="160" sortable="custom" />

          <el-table-column prop="colour" label="颜色" min-width="160" sortable="custom" />
          <el-table-column prop="processName" label="工序" min-width="160" sortable="custom" />
          <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="160" sortable="custom" />
          <el-table-column prop="accuracyLevel" label="精度等级" min-width="160" sortable="custom" />
          <el-table-column prop="vibrationLevel" label="振动等级" min-width="160" sortable="custom" />
          <el-table-column prop="oil" label="油脂" min-width="160" sortable="custom" />
          <el-table-column prop="oilQuantity" label="油脂量" min-width="160" sortable="custom" />
          <el-table-column prop="clearance" label="游隙" min-width="160" sortable="custom" />
          <el-table-column prop="packagingMethod" label="包装方式" min-width="160" sortable="custom" />
          <el-table-column prop="specialRequire" label="特殊要求" min-width="160" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />

          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_sale_send')">入库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.purchaseOrderId, 'look', 'purchaseREFForm', purchaseFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 外协收货 -->
        <JNPF-table :partentOrChild="'wxshtabForm'" v-loading="listLoading" @sort-change="sortChange"
          :data="wxshTableList" v-show="categoryType == 'inbound_external' && !externalFlag" custom-column
          ref="wxshtabForm" :fixedNo="true" :setColumnDisplayList="wxshthcolumnList">
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
        <!-- 外协收货 订单 -->
        <JNPF-table :partentOrChild="'externaltabForm'" v-loading="listLoading" @sort-change="sortChange"  v-if="tableDataFlag"
          :data="externalList" v-show="categoryType == 'inbound_external' && externalFlag" hasC custom-column
          ref="externaltabForm" fixedNO :setColumnDisplayList="externalcolumnList"
          @selection-change="handeleselectExternal">
          <el-table-column prop="orderNo" label="订单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.purchaseOrderId, 'look', 'productExternalREFForm', productExternalVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="160" sortable="custom" />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="160" sortable="custom" />
          <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
            sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
          <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom" />

          <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
          <el-table-column prop="purchaseQuantity" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="120">
          </el-table-column>
          <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column prop="waitReceiptNum" label="待收货数量" min-width="160" sortable="custom" />
          <el-table-column prop="deliveryDate" label="交货日期" min-width="160" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_sale_send')">入库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.purchaseOrderId, 'look', 'productExternalREFForm', productExternalVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 外协发料 -->
        <JNPF-table :partentOrChild="'wxfltabForm'" v-loading="listLoading" @sort-change="sortChange" :key="3"
          :data="wxflTableList" v-show="categoryType == 'outbound_external_send' && !externalFlag" custom-column
          ref="wxfltabForm" :fixedNo="true" :setColumnDisplayList="wxflcolumnList">
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

        <!-- 外协发料 订单-->
        <JNPF-table :partentOrChild="'wxfltabForm'" v-loading="listLoading" @sort-change="sortChange" :key="3"  v-if="isProjectSwitchFlag"
          :data="exterMaterList" v-show="categoryType == 'outbound_external_send' && externalFlag" custom-column
          ref="wxfltabForm" hasC @selection-change="handeleselectExternalMter" fixedNO
          :setColumnDisplayList="wxflcolumnList">
          <el-table-column prop="orderNo" label="订单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.purchaseOrderId, 'look', 'productExternalREFForm', productExternalVisible = true)">{{
                  scope.row.orderNo
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="140" sortable="custom" />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" width="200" sortable="custom" />
          <el-table-column prop="deliveryDate" label="交货日期" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
          <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
            sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
          <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="processName" label="工序名称" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
          <el-table-column prop="purchaseQuantity" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="120">
          </el-table-column>
          <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_external_send')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.purchaseOrderId, 'look', 'productExternalREFForm', productExternalVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 装配/套圈领料 outbound_pick_out -->
        <JNPF-table :partentOrChild="'picktabForm'" v-loading="listLoading" @sort-change="sortChange"
          :data="pickingTableList" v-show="categoryType == 'outbound_pick_out'" custom-column ref="picktabForm"
          :fixedNo="true" :setColumnDisplayList="pickcolumnList">
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
                @click="incomAndOutInventFun(scope.row, 'add', 'Form', 'outbound_pick_out')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewFun(scope.row.id, 'look', 'PickREFForm', pickFormVisible = true)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>


        <!-- 装配/套圈退料 outbound_pick_out -->
        <JNPF-table :partentOrChild="'returnMatertabForm'" v-loading="listLoading" @sort-change="sortChange"
          :data="returnMaterTableList" v-show="categoryType == 'inbound_return_materials'" custom-column
          ref="returnMatertabForm" :fixedNo="true" :setColumnDisplayList="returnMatercolumnList">
          <el-table-column prop="orderNo" label="退料单号" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.id, 'look', 'ReturnMaterREFForm', returnMaterFormVisible = true, scope.row)">{{
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
                @click="viewFun(scope.row.id, 'look', 'ReturnMaterREFForm', returnMaterFormVisible = true, scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 设备领用 outbound_use -->
        <JNPF-table :partentOrChild="'outboundUseForm'" v-loading="listLoading" @sort-change="sortChange"
          :data="outboundUseTableList" v-show="categoryType == 'outbound_use'" custom-column ref="outboundUseForm"
          :fixedNo="true" :setColumnDisplayList="equipmentOutboundList">
          <el-table-column prop="orderNo" label="领用单号" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewEquipmentFun(scope.row.id, 'look', scope.row)">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="useApplication" label="领用目的" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.useApplication == 'equipmentmaintain'">设备保养</div>
              <div v-if="scope.row.useApplication == 'equipmentrepair'">设备维修</div>
              <div v-if="scope.row.useApplication == 'toolmaintain'">工具保养</div>
              <div v-if="scope.row.useApplication == 'toolrepair'">工具维修</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime" label="领用日期" min-width="160" sortable="custom" />
          <el-table-column prop="maintainerIdText" label="领用人" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="incomAndOutInventFun(scope.row, 'add', 'Form')">出库</el-button>
              <el-button size="mini" type="text"
                @click="viewEquipmentFun(scope.row.id, 'look', scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- 设备归还 inbound_return -->
        <JNPF-table :partentOrChild="'inboundReturnForm'" v-loading="listLoading" @sort-change="sortChange"
          :data="inboundReturnData" v-show="categoryType == 'inbound_return'" custom-column ref="inboundReturnForm"
          :fixedNo="true" :setColumnDisplayList="inboundReturnList">
          <el-table-column prop="orderNo" label="归还单号" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewRepayFun(scope.row.id, 'look', scope.row)">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>

          <el-table-column prop="collectionTime" label="归还日期" min-width="160" sortable="custom" />
          <el-table-column prop="maintainerIdText" label="归还人" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="incomAndOutInventFun(scope.row, 'add', 'Form')">入库</el-button>
              <el-button size="mini" type="text" @click="viewRepayFun(scope.row.id, 'look', scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="fhTotal" :page.sync="fhForm.pageNum" :limit.sync="fhForm.pageSize"
          @pagination="getTabdataList"
          v-if="(categoryType == 'outbound_sale_send' && !saleFlag) || categoryType == 'inbound_sale_return'">
        </pagination>
        <pagination :total="saleTotal" :page.sync="saleOrderForm.pageNum" :limit.sync="saleOrderForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_sale_send' && saleFlag">
        </pagination>
        <pagination :total="cgTotal" :page.sync="cgForm.pageNum" :limit.sync="cgForm.pageSize"
          @pagination="getTabdataList"
          v-if="categoryType == 'outbound_purchase' || (categoryType == 'inbound_purchase' && !purchaseFlag)">
        </pagination>
        <pagination :total="purchaseTotal" :page.sync="purchaseForm.pageNum" :limit.sync="purchaseForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'inbound_purchase' && purchaseFlag">
        </pagination>
        <pagination :total="wxshTotal" :page.sync="wxshForm.pageNum" :limit.sync="wxshForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'inbound_external' && !externalFlag">
        </pagination>
        <pagination :total="wxflTotal" :page.sync="wxflForm.pageNum" :limit.sync="wxflForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_external_send' && !externalFlag">
        </pagination>
        <pagination :total="exterMaterTotal" :page.sync="exterMaterForm.pageNum" :limit.sync="exterMaterForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_external_send' && externalFlag">
        </pagination>
        <pagination :total="pickTotal" :page.sync="pickForm.pageNum" :limit.sync="pickForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'outbound_pick_out'">
        </pagination>
        <pagination :total="returnMaterTotal" :page.sync="returnMaterForm.pageNum"
          :limit.sync="returnMaterForm.pageSize" @pagination="getTabdataList"
          v-if="categoryType == 'inbound_return_materials'">
        </pagination>
        <pagination :total="externalTotal" :page.sync="externalForm.pageNum" :limit.sync="externalForm.pageSize"
          @pagination="getTabdataList" v-if="categoryType == 'inbound_external' && externalFlag">
        </pagination>
        <pagination :total="outboundUseTotal" :page.sync="outboundUseForm.pageNum"
          :limit.sync="outboundUseForm.pageSize" @pagination="getTabdataList" v-if="categoryType == 'outbound_use'">
        </pagination>
        <pagination :total="inboundReturnTotal" :page.sync="inboundReturnForm.pageNum"
          :limit.sync="inboundReturnForm.pageSize" @pagination="getTabdataList" v-if="categoryType == 'inbound_return'">
        </pagination>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick" v-show="categoryType == 'inbound_mock_production'"
        class="produce">
        <el-tab-pane label="生产产品入库" name="product">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
              <el-form @submit.native.prevent>


                <template v-for="item in searchList7">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="getTabdataList('basic')" />

                      <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                        clearable>
                        <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                          :value="item2.value"></el-option>
                      </el-select>
                      <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                        :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                        :type="item.dateType"
                        :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="productForm.orderType" placeholder="任务类型" style="width: 100%;">
                      <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductData('basic')">
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
              <JNPF-table :partentOrChild="'dataTableProductRef'" ref="dataTableProductRef" v-loading="listLoading"  v-if="isProjectSwitchFlag"
                :data="productData" :fixedNO="true" custom-column :setColumnDisplayList="productColumns"
                v-show="categoryType == 'inbound_mock_production'">
                <el-table-column prop="orderNo" label="任务单号" width="180" />
                <el-table-column prop="orderType" label="任务类型" width="120">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderTypeList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" />
                <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
                  sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
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
                <template v-for="item in searchList8">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="getTabdataList('basic')" />

                      <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                        clearable>
                        <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                          :value="item2.value"></el-option>
                      </el-select>
                      <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                        :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                        :type="item.dateType"
                        :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchWorkDta('basic')">
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
                      @click="columnSetFun('dataTableWorkRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="searchWorkDta()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table :partentOrChild="'dataTableWorkRef'" ref="dataTableWorkRef" v-loading="listLoading"  v-if="isProjectSwitchFlag"
                :data="workData" :fixedNO="true" @sort-change="sortChange" custom-column
                :setColumnDisplayList="workColumns">
                <el-table-column prop="productionOrderNo" label="任务单号" min-width="180" />
                <el-table-column prop="orderNo" label="工单号" width="200" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" />
                <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
                  sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" />
                <el-table-column prop="processName" label="工序名称" min-width="160" />
                <el-table-column prop="mainUnit" label="单位" min-width="80" />
                <el-table-column prop="productionQuantity" label="生产数量" min-width="120" />
                <el-table-column prop="qualifiedQuantity" label="已完成数量" min-width="120" />
                <el-table-column prop="waitReceivedQuantity" label="待入库数量" min-width="120" />

                <el-table-column prop="createTime" label="创建时间" min-width="180" />
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
    <SaleForm v-if="saleFormVisible" ref="saleREFForm" @close="closeForm"></SaleForm>
    <PurchaseForm v-if="purchaseFormVisible" ref="purchaseREFForm" @close="closeForm"></PurchaseForm>
    <ProductExternalForm v-if="productExternalVisible" ref="productExternalREFForm" @close="closeForm">
    </ProductExternalForm>
    <EquipmentForm v-if="equipmentVisible" ref="quipmentREFForm" @close="closeForm"></EquipmentForm>
    <SparePartsForm v-if="sparePartsVisible" ref="sparePartsREFForm" @close="closeForm"></SparePartsForm>
    <ToolForm v-if="toolVisible" ref="toolREFForm" @close="closeForm"></ToolForm>
    <EquipmentFormS v-if="equipmentSVisible" ref="quipmentSREFForm" @close="closeForm"></EquipmentFormS>
    <SparePartsFormS v-if="sparePartsSVisible" ref="sparePartsSREFForm" @close="closeForm"></SparePartsFormS>
    <ToolFormS v-if="toolSVisible" ref="toolSREFForm" @close="closeForm"></ToolFormS>



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
    <InboundReturnMaterialsForm v-if="inboundReturnMaterialsFormVisible" ref="inboundReturnMaterialsREFForm"
      @close="closeForm">
    </InboundReturnMaterialsForm>
    <SaleOutboundForm v-if="saleOutboundFormVisible" ref="saleOutboundREFForm" @close="closeForm">
    </SaleOutboundForm>
    <PurchaseOrderInboundForm v-if="purchaseOrderInboundFormVisible" ref="purchaseOrderInboundREFForm"
      @close="closeForm">
    </PurchaseOrderInboundForm>
    <ExternalInboundForm v-if="externalInboundFormVisible" ref="externalInboundREFForm" @close="closeForm">
    </ExternalInboundForm>
    <ExternalMaterOutboundForm v-if="externalMaterOutboundFormVisible" ref="externalMaterOutboundREFForm"
      @close="closeForm">
    </ExternalMaterOutboundForm>

    <EquipmentOutboundForm v-if="equipmentOutboundVisible" ref="equipmentOutboundREFForm" @close="closeForm">
    </EquipmentOutboundForm>
    <EquipmentInboundForm v-if="equipmentInboundVisible" ref="equipmentInboundREFForm" @close="closeForm">
    </EquipmentInboundForm>

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

  </div>
</template>

<script>
import { getQuotationdatasendlist, getStockMovelist } from '@/api/salesManagement/index'
import { purPurchaseReceiptReturnGoodsList, detailpurchaseOrderList } from "@/api/purchasingAndOutsourcingOrders/index"
import { ordershengchanList, detailordershengchan, getWorkPage } from '@/api/productOrdes/index.js'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal, getOrderLineReport } from '@/api/salesManagement/assemblyOrders'
import Form from './Form'
import mixin from '@/mixins/generator/index'
import { Release } from '@/api/onlineDev/visualDev'
import { getVisualDevList, Delete, Copy, exportData } from '@/api/onlineDev/visualDev'
import SuperQuery from '@/components/SuperQuery/index.vue'
import FHForm from "../../../salesManagement/shippingnotice/saleMetalworking/Form.vue"
import THForm from "../../../salesManagement/shippingnotice/returnSalesmemo/Form.vue"
import CGTHREFForm from "../../../purchasingManagement/returnManagement/purchaseReturnNote/Form.vue"
import CGSHREFForm from "../../../receivingManagement/procurementReceiving/receivingAdvice/Form.vue"
import WXSHREFForm from '../../../receivingManagement/receiveGoodsByOutsourcing/receivingAdvice/Form.vue'
import WXFLREFForm from "../../../outsourcingManagement/externalMaterialIssuance/materialsIssueNotice/Form.vue"
import PickForm from "@/views/productionManagement/assemblyPick/assemblyPickManagement/Form.vue"
import ReturnMaterREFForm from "../../../productionManagement/assemblyPick/assemblyReturnMaterManagement/Form.vue"
import PurchaseForm from '@/views/purchasingManagement/purchaseOrders/purchaseOrder/Form.vue'
import ProductExternalForm from '@/views/outsourcingManagement/processOutsourcingOrders/orderList/Form.vue'
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
import SaleForm from '@/views/salesManagement/orderManagement/orderList/Form.vue'
import SaleOutboundForm from './saleOutboundForm.vue'
import ExternalInboundForm from './externalInboundForm.vue'
import PurchaseOrderInboundForm from './purchaseOrderInboundForm.vue'
import ExternalMaterOutboundForm from './externalMaterialsForm.vue'
import { WithdrawalList } from '@/api/productOrdes/index.js'
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'
import ToolForm from '@/views/dailyManagement/borrowingReturn/circulate/Form.vue'
import SparePartsForm from '@/views/dailyManagement/sparepartsmanagement/sparepartsrequisition/Form.vue'
import EquipmentForm from '@/views/dailyManagement/equipmentrequisitionreturn/equipmentrequisition/Form.vue'
import { CollectionandreturnList } from '@/api/dailyManagement/Maintenance'
import EquipmentOutboundForm from './equipmentOutboundForm.vue'
import EquipmentInboundForm from './equipmentInboundForm.vue'
import ToolFormS from '@/views/dailyManagement/borrowingReturn/toolreturn/Form.vue'
import EquipmentFormS from '@/views/dailyManagement/equipmentrequisitionreturn/equipmentreturn/Form.vue'
import SparePartsFormS from '@/views/dailyManagement/sparepartsmanagement/sparepartsReturn/Form.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index"
export default {
  name: 'dbIncomAndOutInventory',
  mixins: [mixin, getProjectList],
  components: {
    Form, SuperQuery, THForm, FHForm,
    CGSHREFForm, CGTHREFForm, WXSHREFForm,
    WXFLREFForm, PickForm, ReturnMaterREFForm,
    ProductInboundForm, WorkInboundForm, OutboundSaleSendForm,
    InboundSaleReturnForm, InboundPurchaseForm, OutboundPurchaseForm,
    OutboundExternalSendForm, InboundExternalForm, OutboundPickOutForm, InboundReturnMaterialsForm,
    SaleForm, SaleOutboundForm, PurchaseOrderInboundForm, PurchaseForm, ProductExternalForm, ExternalInboundForm,
    ExternalMaterOutboundForm, ToolForm, SparePartsForm, EquipmentForm, EquipmentOutboundForm, ToolFormS, EquipmentFormS, SparePartsFormS, EquipmentInboundForm
  },
  props: {
    warehouseCode: "",
  },
  data() {
    return {
      isProjectSwitchFlag: false,
      isProjectSwitch: "",
      equipmentInboundVisible: false,
      repayDateArr: [],
      toolSVisible: false,
      sparePartsSVisible: false,
      equipmentSVisible: false,
      inboundReturnVisible: false,
      inboundReturnList: ["createByName"],
      inboundReturnData: [],
      inboundReturnTotal: 0,
      inboundReturnForm: {
        documentStatus: "submit",
        classAttributeList: [],
        stockFlag: true,
        equipmentType: "",
        maintainerIdText: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        collStartTime: "",
        collEndTime: "",
        requisitionType: "back",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "create_time"
        }],
      },

      visibleForm: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList1: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList2: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList3: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList4: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList5: [
        { field: 'orderNo', fieldValue: '', label: '领料单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '领料人', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList6: [
        { field: 'orderNo', fieldValue: '', label: '退料单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '退料人', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList7: [
        { field: 'orderNo', fieldValue: '', label: '任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList8: [
        { field: 'productionOrderNo', fieldValue: '', label: '任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '工单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList9: [
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList10: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },

      ],
      searchList11: [
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ],
      searchList12: [
        { field: 'orderNo', fieldValue: '', label: '订单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],

      searchList13: [
        { field: 'orderNo', fieldValue: '', label: '领用单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'maintainerIdText', fieldValue: '', label: '领用人', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList14: [
        { field: 'orderNo', fieldValue: '', label: '归还单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'maintainerIdText', fieldValue: '', label: '归还人', symbol: 'like', searchType: 1, width: 120 },
      ],
      externalMaterOutboundFormVisible: false,
      exterMaterList: [],
      exterMaterTotal: 0,
      exterMaterForm: {
        orderNo: "",
        cooperativePartnerName: "",
        productDrawingNo: "",
        pageNum: 1,
        pageSize: 20,
        shipmentStatus: "not_finish",
        externalFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "delivery_date"
        }],
      },
      useDateArr: [],
      equipmentOutboundVisible: false,
      outboundUseTableList: [],
      outboundUseTotal: 0,
      outboundUseList: ["createByName"],
      outboundUseForm: {
        classAttributeList: [],
        documentStatus: "submit",
        stockFlag: true,
        equipmentType: "",
        maintainerIdText: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        collStartTime: "",
        collEndTime: "",
        requisitionType: "requisition",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "create_time"
        }],
      },


      externalInboundFormVisible: false,
      productExternalVisible: false,
      externalDate: [],
      externalTotal: 0,
      externalcolumnList: ["cooperativePartnerCode", "createByName",],
      externalForm: {
        documentStatus: "submit",
        receiptQueryFlag: true,
        productDrawingNo: "",
        cooperativePartnerName: "",
        deliveryEndDate: "",
        deliveryStartDate: "",
        pageNum: 1,
        pageSize: 20,
        externalFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "delivery_date"
        }],
      },
      externalList: [],


      orderTypeList: [
        { label: "正常订单", value: "normal", },
        { label: "返工订单", value: "rework", },
      ],
      saleOutboundFormVisible: false,
      saleOrderDateArr: [],
      saleTotal: 0,
      saleList: [],
      saleFormVisible: false,
      salecolumnList: ["cooperativePartnerCode",],
      saleOrderForm: {
        documentStatus: "submit",
        deliverQueryFlag: true,
        deliveryStartTime: "",
        deliveryEndTime: "",
        cooperativePartnerName: "",
        customerProductNo: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "delivery_date"
        }],
        pageNum: 1,
        pageSize: 20,
      },

      purchaseFormVisible: false,
      purchaseOrderInboundFormVisible: false,
      purchaseTotal: 0,
      purchaseList: [],
      purchaserOrderDateArr: [],
      purchasecolumnList: ["cooperativePartnerCode", 'createByName'],
      purchaseForm: {
        documentStatus: "submit",
        cooperativePartnerName: "",
        productDrawingNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "delivery_date"
        }],
        pageNum: 1,
        pageSize: 20,
      },




      productInboundFormVisible: false,
      workInboundFormVisible: false,
      outboundSaleSendFormVisible: false,
      inboundSaleReturnFormVisible: false,
      inboundPurchaseFormVisible: false,
      outboundPurchaseFormVisible: false,
      outboundExternalSendFormVisible: false,
      inboundExternalFormVisible: false,
      outboundPickOutFormVisible: false,
      inboundReturnMaterialsFormVisible: false,
      productColumns: ["productCode", 'createByName'],
      productTotal: 0,
      productData: [],
      productForm: {
        orderNo: "",
        orderType: "",
        productDrawingNo: "",
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },

      workColumns: ['productCode',],
      workTotal: 0,
      workData: [],
      workForm: {
        documentStatus: "submit",
        productionOrderNo: "",
        orderNo: "",
        processName: "",
        productDrawingNo: "",
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
        pageNum: 1,
        pageSize: 20,
      },
      fhTableList: [],//发货列表数据
      fhTotal: 0,//发货 列表总条数
      // 发货列表请求条件
      fhForm: {
        classAttributeList: "",
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
        documentStatus: "sibmit",
        rdeDate: "",
        rdsDate: "",
        notifyType: "external",
        deliveryStatus: "not_finished",
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
        documentStatus: "submit",
        pageNum: 1,
        pageSize: 20,
        productClassAttributeList: "",
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
        documentStatus: "submit",
        receiveType: "",
        orderNo: "",
        personName: "",
        productClassAttributeList: "",
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
      classAttributeList: [],
      saleFlag: false,
      purchaseFlag: false,
      externalFlag: false,
      selectSaleList: [],
      selectPurchaseList: [],
      selectExternalList: [],
      selectExternalMaterList: [],
      toolVisible: false,
      equipmentVisible: false,
      sparePartsVisible: false,
      productNameFlag: null,
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
        }
        , {
          prop: "specialRequire",
          typeCode: "pa016"
        }, {
          prop: "colour",
          typeCode: "pa010"
        }, {
          prop: "standardValue",
          typeCode: "pa008"
        }

      ],
      mainUnitFlag: null,
      tableDataFlag: false,
    }
  },
  watch: {
    'categoryType': function (newVal) {
      this.fhDateArr = []
      this.fhForm.partnerName = ""
      this.fhForm.orderNo = ''

      this.cgDateArr = []
      this.cgForm.orderNo = ''
      this.cgForm.partnerName = ''

      this.wxflDateArr = []
      this.wxflForm.orderNo = ''
      this.wxflForm.partnerName = ''

      this.wxshDateArr = []
      this.wxshForm.orderNo = ''
      this.wxshForm.partnerName = ''





      this.externalDate = []
      this.externalForm.cooperativePartnerName = ''
      this.externalForm.productDrawingNo = ''

      this.purchaserOrderDateArr = []
      this.purchaseForm.orderNo = ''
      this.purchaseForm.partnerName = ''

      this.saleOrderDateArr = []
      this.saleOrderForm.cooperativePartnerName = ''
      this.saleOrderForm.customerProductNo = ''

      this.exterMaterForm.orderNo = ''
      this.exterMaterForm.partnerName = ''
      this.exterMaterForm.productDrawingNo = ''



      this.getTabdataList()

    },
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag = true
    this.getPickingConfig()
    this.getMainUnitFun('deputyUnit', 'warehouseDeputyUnit')
  }, 
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getMainUnitFun(code, type) {
      this.listLoading = true
      try {
        this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        this.tableDataFlag = true
        this.listLoading = false


      } catch (error) {
      }
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
          let oilObj = this.superQueryJson.find(rs => rs.prop === item.prop);
          if (oilObj) {
            // 将options赋值为5  
            oilObj.options = JSON.parse(JSON.stringify(arr));
          }
        })
      })




    },
    handeleselectExternalMter(val) {
      this.selectExternalMaterList = val
    },
    externalMaterBatchOutbound() {
      if (!this.selectExternalMaterList.length) return this.$message.error("请选择您要出库的数据")
      let flag = this.hasDifferentProduct(this.selectExternalMaterList)
      if (flag) return this.$message.error("只能选择相同产品的数据")
      this.externalMaterOutboundFormVisible = true
      this.$nextTick(() => {
        this.$refs.externalMaterOutboundREFForm.init(this.selectExternalMaterList, 'add', this.categoryType, this.classAttributeList, this.warehouseCode)
      })
    },
    hasDifferentProduct(arr) {
      const codes = new Set();

      for (const item of arr) {
        codes.add(item.productsId);
      }

      return codes.size > 1; // 如果有多个不同的代码，则返回 true  
    },
    // 外协发料 订单
    getexterMaterFUN(type) {
      this.exterMaterForm.classAttributeList = this.classAttributeList
      this.exterMaterForm.approvalStatus = 'ok'
      this.superForm = this.exterMaterForm
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList12
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.exterMaterForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''

      detailpurchaseOrderList(this.exterMaterForm).then(res => {
        if (this.mainUnitFlag == 1) {
        res.data.records.forEach(item => {
            if (item.calculationDirection == 'multiplication') {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
            } else {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
            }
          });
        }
        this.exterMaterTotal = res.data.total
        this.exterMaterList = res.data.records
      })
    },
    // 外协收货 订单批量入库
    externalBatchInbound() {
      if (!this.selectExternalList.length) return this.$message.error("请选择您要出库的数据")
      let flag = this.hasDifferentCooperativePartnerCode(this.selectExternalList)
      if (flag) return this.$message.error("只能选择相同客户的数据")
      this.externalInboundFormVisible = true
      this.$nextTick(() => {
        this.$refs.externalInboundREFForm.init(this.selectExternalList, 'add', this.categoryType, this.classAttributeList, this.warehouseCode)
      })
    },
    // 外协收货  订单 列表数据
    getExternalFun(type) {
      if (this.externalDate.length) {
        this.externalForm.deliveryStartDate = this.externalDate[0]
        this.externalForm.deliveryEndDate = this.externalDate[1]

      } else {
        this.externalForm.deliveryStartDate = ''
        this.externalForm.deliveryEndDate = ''
      }
      this.externalForm.classAttributeList = this.classAttributeList
      this.externalForm.approvalStatus = 'ok'
      this.superForm = this.externalForm
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList11
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.externalForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      detailpurchaseOrderList(this.externalForm).then(res => {
        if (this.mainUnitFlag == 1) {
        res.data.records.forEach(item => {
            if (item.calculationDirection == 'multiplication') {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
            } else {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
            }
          });
        }
        this.externalList = res.data.records
        this.externalTotal = res.data.total
        console.log("外协订单列表", res);
      })
    },
    // 外协收货  订单  多选
    handeleselectExternal(val) {
      this.selectExternalList = val
    },
    // 采购收货 订单批量入库
    purchaseBatchInbound() {
      if (!this.selectPurchaseList.length) return this.$message.error("请选择您要出库的数据")
      let flag = this.hasDifferentCooperativePartnerCode(this.selectPurchaseList)
      if (flag) return this.$message.error("只能选择相同供应商的数据")
      this.purchaseOrderInboundFormVisible = true
      this.$nextTick(() => {
        this.$refs.purchaseOrderInboundREFForm.init(this.selectPurchaseList, 'add', this.categoryType, this.classAttributeList, this.warehouseCode)
      })
    },
    // 采购收货  按订单  勾选数据
    handeleselectPurchase(val) {
      this.selectPurchaseList = val

    },
    // 销售发货  按订单  勾选数据
    handeleselectSale(val) {
      this.selectSaleList = val
    },
    // 批量出库
    batchOutbound() {
      if (!this.selectSaleList.length) return this.$message.error("请选择您要出库的数据")
      let flag = this.hasDifferentCooperativePartnerCode(this.selectSaleList)
      if (flag) return this.$message.error("只能选择相同客户的数据")
      this.saleOutboundFormVisible = true
      this.$nextTick(() => {
        this.$refs.saleOutboundREFForm.init(this.selectSaleList, 'add', this.categoryType, this.classAttributeList, this.warehouseCode)
      })
    },
    hasDifferentCooperativePartnerCode(arr) {
      const codes = new Set();

      for (const item of arr) {
        codes.add(item.cooperativePartnerId);
      }

      return codes.size > 1; // 如果有多个不同的代码，则返回 true  
    },
    // 获取是按销售通知单还是发货通知单
    getPickingConfig() {
      let obj = { "pageSize": -1, "businessCode": "warehouse" }
      getBimBusinessSwitchConfigList(obj).then(res => {
        this.saleFlag = res.data.warehouse[2].configValue1 == '1' ? true : false
        this.purchaseFlag = res.data.warehouse[0].configValue1 == '1' ? true : false
        this.externalFlag = res.data.warehouse[1].configValue1 == '1' ? true : false
        if (this.saleFlag) {
          console.log(555, this.$refs.salestabForm);
          this.salecolumnList = ["cooperativePartnerCode",]
        }
        this.getclassAttributeList()
      })
      let objs = { "pageSize": -1, "businessCode": "product" }
      getBimBusinessSwitchConfigList(objs).then(res => {
        this.productNameFlag = res.data.product[1].configValue1


      })
    },
    getclassAttributeList() {
      getclassAttributelistByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
        this.getStockMovelistFun()
      })
    },

    getStockMovelistFun() {
      let obj={
        classAttributeList:this.classAttributeList,
        projectId: this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : '',
      }
      getStockMovelist(obj.classAttributeList,obj.projectId).then(res => {
        console.log("左侧分类数据", res);
        if (res.data.length) {
          res.data.forEach(item => {
            if (item.businessType == 'outbound_sale_send') {
              if (this.saleFlag) item.num = item.orderTodoNum
              console.log("item====>", item);
              this.$set(item, 'fullName', '销售发货')
            }
            if (item.businessType == 'inbound_sale_return') {
              item.fullName = '销售退货'
            }
            if (item.businessType == 'inbound_purchase') {
              if (this.purchaseFlag) item.num = item.orderTodoNum
              item.fullName = '采购收货'
            }
            if (item.businessType == 'outbound_purchase') {
              item.fullName = '采购退货'
            }

            if (item.businessType == 'outbound_external_send') {
              if (this.externalFlag) item.num = item.orderTodoNum
              item.fullName = '外协发料'
            }
            if (item.businessType == 'inbound_external') {
              if (this.externalFlag) item.num = item.orderTodoNum
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
            if (item.businessType == 'outbound_use') {
              item.fullName = '资产领用'

            }
            if (item.businessType == 'inbound_return') {
              item.fullName = '资产归还'

            }

          });
        }
        this.$nextTick(() => {
          this.treeData = res.data
          this.getTabdataList('basic')
        })

      })
    },
    // 点击出库/入库按钮
    incomAndOutInventFun(data, btnType, ref) {
      if (this.categoryType) {
        this.visibleForm = true
        if (this.categoryType == 'outbound_sale_send') {
          if (this.saleFlag) {
            // 销售发货订单
            let arr = []
            arr.push(data)
            this.saleOutboundFormVisible = true
            this.$nextTick(() => {
              this.$refs.saleOutboundREFForm.init(arr, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          } else {
            // 销售发货  通知单
            this.outboundSaleSendFormVisible = true
            this.$nextTick(() => {
              this.$refs.outboundSaleSendREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          }
        } else if (this.categoryType == 'inbound_sale_return') {
          this.inboundSaleReturnFormVisible = true
          this.$nextTick(() => {
            this.$refs.inboundSaleReturnREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
          })
        } else if (this.categoryType == 'inbound_purchase') {
          if (this.purchaseFlag) {
            let arr = []
            arr.push(data)
            this.purchaseOrderInboundFormVisible = true
            this.$nextTick(() => {
              this.$refs.purchaseOrderInboundREFForm.init(arr, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          } else {
            this.inboundPurchaseFormVisible = true
            this.$nextTick(() => {
              this.$refs.inboundPurchaseREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          }




        } else if (this.categoryType == 'outbound_purchase') {
          this.outboundPurchaseFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundPurchaseREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
          })
        } else if (this.categoryType == 'outbound_external_send') {
          if (!this.externalFlag) {

            this.outboundExternalSendFormVisible = true
            this.$nextTick(() => {
              this.$refs.outboundExternalSendREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          } else {
            let arr = []
            arr.push(data)
            this.externalMaterOutboundFormVisible = true
            this.$nextTick(() => {
              this.$refs.externalMaterOutboundREFForm.init(arr, 'add', this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          }
        } else if (this.categoryType == 'inbound_external') {
          if (this.externalFlag) {
            let arr = []
            arr.push(data)
            this.externalInboundFormVisible = true
            this.$nextTick(() => {
              this.$refs.externalInboundREFForm.init(arr, 'add', this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          } else {

            this.inboundExternalFormVisible = true
            this.$nextTick(() => {
              this.$refs.inboundExternalREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
            })
          }
        } else if (this.categoryType == 'outbound_pick_out') {
          this.outboundPickOutFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundPickOutREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
          })
        } else if (this.categoryType == 'inbound_return_materials') {
          this.inboundReturnMaterialsFormVisible = true
          this.$nextTick(() => {
            this.$refs.inboundReturnMaterialsREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
          })
        } else if (this.categoryType == 'outbound_use') {
          this.equipmentOutboundVisible = true
          this.$nextTick(() => {

            this.$refs.equipmentOutboundREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
          })
        } else if (this.categoryType == 'inbound_return') {
          console.log(555);
          this.equipmentInboundVisible = true
          this.$nextTick(() => {

            this.$refs.equipmentInboundREFForm.init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs[ref].init(data, btnType, this.categoryType, this.classAttributeList, this.warehouseCode)
          })
        }


      }
    },
    sortChange({ prop, order }) {
      // 销售发货 排序
      if (this.categoryType == 'outbound_sale_send') {
        let newProp
        if (this.saleFlag) {
          console.log("销售发货订单");
          if (prop == 'customerProductNo' || prop == 'deliveryDate' || prop == 'sealingCoverTyping' || prop == 'sealingCoverTyping' || prop == 'vibrationLevel' || prop == 'oilQuantity' || prop == 'packagingMethod' || prop == 'accuracyLevel' || prop == 'specialRequire') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.saleOrderForm.orderItems[0].asc = order === 'ascending'
          this.saleOrderForm.orderItems[0].column = newProp
        } else {
          console.log("销售发货通知单");
          if (prop == 'orderNo' || prop == 'deliverDate' || prop == 'recipient' || prop == 'phone' || prop == 'exchangeGoodsFlag' || prop == 'createTime') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.fhForm.orderItems[0].asc = order === 'ascending'
          this.fhForm.orderItems[0].column = newProp
        }

      }
      // 销售退货 排序
      if (this.categoryType == 'inbound_sale_return') {
        let newProp

        if (prop == 'orderNo' || prop == 'deliverDate' || prop == 'exchangeGoodsFlag' || prop == 'createTime') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        else newProp = prop
        this.fhForm.orderItems[0].asc = order === 'ascending'
        this.fhForm.orderItems[0].column = newProp
      }
      // 采购收货 排序
      if (this.categoryType == 'inbound_purchase') {
        let newProp
        if (this.purchaseFlag) {
          console.log("采购收货订单");


          if (prop == 'orderNo' || prop == 'cooperativePartnerName' || prop == 'cooperativePartnerCode' || prop == 'drawingNo' || prop == 'productCode' || prop == 'num' || prop == 'waitReceiptNum'
            || prop == 'deliveryDate' || prop == 'standardValue' || prop == 'colour' || prop == 'processName' || prop == 'sealingCoverTyping' || prop == 'accuracyLevel' || prop == 'vibrationLevel' || prop == 'oil'
            || prop == 'oilQuantity' || prop == 'clearance' || prop == 'packagingMethod' || prop == 'specialRequire' || prop == 'createTime' || prop == 'createByName') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.purchaseForm.orderItems[0].asc = order === 'ascending'
          this.purchaseForm.orderItems[0].column = newProp
        } else {

          console.log("采购收货通知单");
          if (prop == 'orderNo' || prop == 'salesman' || prop == 'deliverDate' || prop == 'createTime') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.cgForm.orderItems[0].asc = order === 'ascending'
          this.cgForm.orderItems[0].column = newProp
        }

      }
      // 采购退货 排序
      if (this.categoryType == 'outbound_purchase') {
        let newProp

        if (prop == 'orderNo' || prop == 'salesman' || prop == 'deliverDate' || prop == 'createTime') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        else newProp = prop
        this.cgForm.orderItems[0].asc = order === 'ascending'
        this.cgForm.orderItems[0].column = newProp
      }
      // 外协发料 排序
      if (this.categoryType == 'outbound_external_send') {

        let newProp
        if (!this.externalFlag) {
          console.log("外协发料通知单");
          if (prop == 'orderNo' || prop == 'partnerName' || prop == 'partnerCode' || prop == 'deliverDate' || prop == 'recipient'
            || prop == 'phone' || prop == 'delivery' || prop == 'countryName' || prop == 'provinceName' || prop == 'cityName' || prop == 'areaName' || prop == 'address'
            || prop == 'createTime' || prop == 'createByName') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.wxflForm.orderItems[0].asc = order === 'ascending'
          this.wxflForm.orderItems[0].column = newProp
        } else {
          console.log("外协发料订单");
          if (prop == 'orderNo' || prop == 'deliveryDate' || prop == 'drawingNo' || prop == 'mainUnit' || prop == 'purchaseQuantity') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.exterMaterForm.orderItems[0].asc = order === 'ascending'
          this.exterMaterForm.orderItems[0].column = newProp
        }
      }
      // 外协收货 排序
      if (this.categoryType == 'inbound_external') {

        let newProp
        if (!this.externalFlag) {
          console.log("外协收货通知单");
          if (prop == 'orderNo' || prop == 'partnerName' || prop == 'partnerCode' || prop == 'deliverDate' || prop == 'recipient'
            || prop == 'phone' || prop == 'delivery' || prop == 'countryName' || prop == 'provinceName' || prop == 'cityName' || prop == 'areaName' || prop == 'address'
            || prop == 'createTime' || prop == 'createByName') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.wxflForm.orderItems[0].asc = order === 'ascending'
          this.wxflForm.orderItems[0].column = newProp
        } else {

          console.log("外协收货订单");
          if (prop == 'orderNo' || prop == 'drawingNo' || prop == 'mainUnit' || prop == 'purchaseQuantity' || prop == 'deliveryDate') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          else newProp = prop
          this.externalForm.orderItems[0].asc = order === 'ascending'
          this.externalForm.orderItems[0].column = newProp
        }
      }
      // 生产领料 排序
      if (this.categoryType == 'outbound_pick_out') {
        let newProp
        if (prop == 'orderNo' || prop == 'receiveType' || prop == 'createTime') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        else newProp = prop
        this.pickForm.orderItems[0].asc = order === 'ascending'
        this.pickForm.orderItems[0].column = newProp
      }
      // 生产退料 排序
      if (this.categoryType == 'outbound_pick_out') {
        let newProp
        if (prop == 'orderNo' || prop == 'receiveType' || prop == 'createTime') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        else newProp = prop
        this.returnMaterForm.orderItems[0].asc = order === 'ascending'
        this.returnMaterForm.orderItems[0].column = newProp
      }
      // 资产领用 排序
      if (this.categoryType == 'outbound_use') {
        let newProp
        if (prop == 'orderNo' || prop == 'useApplication' || prop == 'collectionTime' || prop == 'maintainerIdText' || prop == 'createTime' || prop == 'createByName') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        else newProp = prop
        this.outboundUseForm.orderItems[0].asc = order === 'ascending'
        this.outboundUseForm.orderItems[0].column = newProp
      }
      // 资产归还 排序
      if (this.categoryType == 'inbound_return') {
        let newProp
        if (prop == 'orderNo' || prop == 'collectionTime' || prop == 'maintainerIdText' || prop == 'createTime' || prop == 'createByName') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        else newProp = prop
        this.outboundUseForm.orderItems[0].asc = order === 'ascending'
        this.outboundUseForm.orderItems[0].column = newProp
      }


      this.getTabdataList()
    },
    // 根据左侧分类  点击不同的分类  请求不同的数据
    getTabdataList(type) {
      // 销售发货
      console.log(this.categoryType);
      if (this.categoryType == 'outbound_sale_send') {
        if (this.saleFlag) {
          if (this.saleOrderDateArr.length) {
            this.saleOrderForm.deliveryStartTime = this.saleOrderDateArr[0]
            this.saleOrderForm.deliveryEndTime = this.saleOrderDateArr[1]
          } else {
            this.saleOrderForm.deliveryStartTime = ""
            this.saleOrderForm.deliveryEndTime = ""
          }
          this.saleOrderForm.classAttributeList = this.classAttributeList
          this.saleOrderForm.approvalStatus = 'ok'
          this.superForm = this.saleOrderForm
          if (type === 'basic') {
            this.basicQuery = {
              matchLogic: 'AND',
              condition: this.searchList9
                .filter((item) => item.fieldValue)
                .map((item) => {
                  return {
                    ...item,
                    fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                  }
                })
            }
            this.superForm.superQuery = this.basicQuery
          }
          if (type === 'super') {
            this.superForm.superQuery = this.superQuery
          }
          this.listLoading = true
      this.saleOrderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getsaleOrderDetailList(this.saleOrderForm).then(res => {
            this.listLoading = false
            console.log("销售明细", res);
            if (this.mainUnitFlag == 1) {
            res.data.records.forEach(item => {
                if (item.calculationDirection == 'multiplication') {
                  this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
                } else {
                  this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
                }
              });
            }
            this.saleList = res.data.records
            this.saleTotal = res.data.total
          }).catch(error => {
            this.listLoading = false
          })
        } else {
          this.listLoading = true
          this.fhForm.returnDeliveryType = 'delivery'
          if (this.fhDateArr.length) {
            this.fhForm.rdsDate = this.fhDateArr[0]
            this.fhForm.rdeDate = this.fhDateArr[1]
          } else {
            this.fhForm.rdsDate = ""
            this.fhForm.rdeDate = ""
          }
          this.fhForm.classAttributeList = this.classAttributeList
          this.fhForm.approvalStatus = 'ok'
          this.superForm = this.fhForm
          if (type === 'basic') {
            this.basicQuery = {
              matchLogic: 'AND',
              condition: this.searchList1
                .filter((item) => item.fieldValue)
                .map((item) => {
                  return {
                    ...item,
                    fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                  }
                })
            }
            this.superForm.superQuery = this.basicQuery
          }
          if (type === 'super') {
            this.superForm.superQuery = this.superQuery
          }
      this.fhForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getQuotationdatasendlist(this.fhForm).then(res => {
            this.fhTableList = res.data.records
            this.fhTotal = res.data.total
            this.listLoading = false
          }).catch(error => {
            this.listLoading = false
          })
        }

      }
      // 销售退货通知单列表数据
      if (this.categoryType == 'inbound_sale_return') {
        this.listLoading = true
        this.fhForm.returnDeliveryType = 'back'
        this.$set(this.fhForm, 'inspectionStatus', 'inspected')
        if (this.fhDateArr.length) {
          this.fhForm.rdsDate = this.fhDateArr[0]
          this.fhForm.rdeDate = this.fhDateArr[1]
        } else {
          this.fhForm.rdsDate = ""
          this.fhForm.rdeDate = ""
        }
        this.fhForm.classAttributeList = this.classAttributeList
        this.fhForm.approvalStatus = 'ok'
        this.superForm = this.fhForm
        if (type === 'basic') {
          this.basicQuery = {
            matchLogic: 'AND',
            condition: this.searchList1
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          }
          this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }

      this.fhForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
        if (this.purchaseFlag) {
          this.purchaseForm.receiptQueryFlag = true
          this.purchaseForm.classAttributeList = this.classAttributeList
          this.purchaseForm.orderType = 'procure'
          if (this.purchaserOrderDateArr.length) {
            this.purchaseForm.deliveryStartTime = this.purchaserOrderDateArr[0]
            this.purchaseForm.deliveryEndTime = this.purchaserOrderDateArr[1]
          } else {
            this.purchaseForm.deliveryStartTime = ""
            this.purchaseForm.deliveryEndTime = ""
          }
          this.purchaseForm.approvalStatus = 'ok'
          this.superForm = this.purchaseForm
          if (type === 'basic') {
            this.basicQuery = {
              matchLogic: 'AND',
              condition: this.searchList10
                .filter((item) => item.fieldValue)
                .map((item) => {
                  return {
                    ...item,
                    fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                  }
                })
            }
            this.superForm.superQuery = this.basicQuery
          }
          if (type === 'super') {
            this.superForm.superQuery = this.superQuery
          }
      this.purchaseForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      detailpurchaseOrderList(this.purchaseForm).then(res => {
            console.log("采购明细", res);
            if (this.mainUnitFlag == 1) {
              res.data.records.forEach(item => {
                
                if (item.calculationDirection == 'multiplication') {
                  this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
                } else {
                  this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
                }
              });
            }
            this.purchaseTotal = res.data.total
            this.purchaseList = res.data.records
          })
        } else {
          this.cgForm.receiptReturnType = 'receipt'
          // this.$set(this.cgForm,'receiptInboundFlag',1)
          this.cgForm.classAttributeList = this.classAttributeList
          this.cgForm.receiptInboundFlag = true
          if (this.cgDateArr.length) {
            this.cgForm.deliverDateStart = this.cgDateArr[0]
            this.cgForm.deliverDateEnd = this.cgDateArr[1]
          } else {
            this.cgForm.deliverDateStart = ""
            this.cgForm.deliverDateEnd = ""
          }
          this.cgForm.approvalStatus = 'ok'

          this.superForm = this.cgForm
          if (type === 'basic') {
            this.basicQuery = {
              matchLogic: 'AND',
              condition: this.searchList2
                .filter((item) => item.fieldValue)
                .map((item) => {
                  return {
                    ...item,
                    fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                  }
                })
            }
            this.superForm.superQuery = this.basicQuery
          }
          if (type === 'super') {
            this.superForm.superQuery = this.superQuery
          }
          this.listLoading = true

      this.cgForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      purPurchaseReceiptReturnGoodsList(this.cgForm).then(res => {
            this.cgTableList = res.data.records
            this.cgTotal = res.data.total
            this.listLoading = false
          }).catch(error => {
            this.listLoading = false
          })
        }
      }
      // 采购退货
      if (this.categoryType == 'outbound_purchase') {
        this.listLoading = true
        this.cgForm.receiptReturnType = 'back'
        this.cgForm.receiptInboundFlag = null
        this.cgForm.stockFlag = true
        this.cgForm.classAttributeList = this.classAttributeList
        if (this.cgDateArr.length) {
          this.cgForm.deliverDateStart = this.cgDateArr[0]
          this.cgForm.deliverDateEnd = this.cgDateArr[1]
        } else {
          this.cgForm.deliverDateStart = ""
          this.cgForm.deliverDateEnd = ""
        }
        this.cgForm.approvalStatus = 'ok'
        this.superForm = this.cgForm
        if (type === 'basic') {
          this.basicQuery = {
            matchLogic: 'AND',
            condition: this.searchList2
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          }
          this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }

      this.cgForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
        if (this.externalFlag) {
          this.getexterMaterFUN(type)
        } else {
          if (this.wxflDateArr.length) {
            this.wxflForm.rdeDate = this.wxflDateArr[0]
            this.wxflForm.rdsDate = this.wxflDateArr[1]
          } else {
            this.wxflForm.rdeDate = ""
            this.wxflForm.rdsDate = ""
          }
          this.wxflForm.classAttributeList = this.classAttributeList
          this.wxflForm.approvalStatus = 'ok'
          this.superForm = this.wxflForm
          if (type === 'basic') {
            this.basicQuery = {
              matchLogic: 'AND',
              condition: this.searchList3
                .filter((item) => item.fieldValue)
                .map((item) => {
                  return {
                    ...item,
                    fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                  }
                })
            }
            this.superForm.superQuery = this.basicQuery
          }
          if (type === 'super') {
            this.superForm.superQuery = this.superQuery
          }
          this.listLoading = true
      this.wxflForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getQuotationdatasendlist(this.wxflForm).then(res => {
        if (this.mainUnitFlag == 1) {
            res.data.records.forEach(item => {
                if (item.calculationDirection == 'multiplication') {
                  this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
                } else {
                  this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
                }
              });
            }
            this.wxflTableList = res.data.records
            this.wxflTotal = res.data.total
            this.listLoading = false
          }).catch(error => {
            this.listLoading = false
          })
        }
      }
      // 外协收货
      if (this.categoryType == 'inbound_external') {
        if (this.externalFlag) {
          this.getExternalFun(type)
        } else {

          this.listLoading = true
          this.$set(this.wxshForm, 'receiptInboundFlag', 1)
          if (this.wxshDateArr.length) {
            this.wxshForm.deliverDateStart = this.wxshDateArr[0]
            this.wxshForm.deliverDateEnd = this.wxshDateArr[1]
          } else {
            this.wxshForm.deliverDateStart = ""
            this.wxshForm.deliverDateEnd = ""
          }
          this.wxshForm.approvalStatus = 'ok'
          this.superForm = this.wxshForm
          if (type === 'basic') {
            this.basicQuery = {
              matchLogic: 'AND',
              condition: this.searchList4
                .filter((item) => item.fieldValue)
                .map((item) => {
                  return {
                    ...item,
                    fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                  }
                })
            }
            this.superForm.superQuery = this.basicQuery
          }
          if (type === 'super') {
            this.superForm.superQuery = this.superQuery
          }
          this.wxshForm.classAttributeList = this.classAttributeList
      this.wxshForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      purPurchaseReceiptReturnGoodsList(this.wxshForm).then(res => {
            this.wxshTableList = res.data.records
            this.wxshTotal = res.data.total
            this.listLoading = false
          }).catch(error => {
            this.listLoading = false
          })
        }
      }
      // 生产领料
      if (this.categoryType == 'outbound_pick_out') {
        this.listLoading = true
        console.log(555);
        this.pickForm.productClassAttributeList = this.classAttributeList
        this.pickForm.approvalStatus = 'ok'

        this.superForm = this.pickForm
        if (type === 'basic') {
          this.basicQuery = {
            matchLogic: 'AND',
            condition: this.searchList5
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          }
          this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }
      this.pickForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
        this.returnMaterForm.productClassAttributeList = this.classAttributeList
        this.returnMaterForm.approvalStatus = 'ok'

        this.superForm = this.returnMaterForm
        if (type === 'basic') {
          this.basicQuery = {
            matchLogic: 'AND',
            condition: this.searchList6
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          }
          this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }
      this.returnMaterForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
          this.searchProductData(type)
        } else {
          this.searchWorkDta(type)
        }
      }
      // 资产领用 
      if (this.categoryType == 'outbound_use') {
        if (this.useDateArr.length) {
          this.outboundUseForm.collStartTime = this.useDateArr[0]
          this.outboundUseForm.collStartTime = this.useDateArr[1]
        } else {
          this.outboundUseFormcollStartTime = ""
          this.outboundUseForm.collEndTime = ""
        }
        this.listLoading = true
        this.outboundUseForm.classAttributeList = this.classAttributeList
        this.outboundUseForm.approvalStatus = 'ok'

        this.superForm = this.outboundUseForm
        if (type === 'basic') {
          this.basicQuery = {
            matchLogic: 'AND',
            condition: this.searchList13
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          }
          this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }
      this.outboundUseForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      CollectionandreturnList(this.outboundUseForm).then(res => {
          console.log("退料", res);
          this.outboundUseTableList = res.data.records
          this.outboundUseTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
      // 资产归还
      if (this.categoryType == 'inbound_return') {
        if (this.repayDateArr.length) {
          this.inboundReturnForm.collStartTime = this.repayDateArr[0]
          this.inboundReturnForm.collEndTime = this.repayDateArr[1]
        } else {
          this.inboundReturnForm.collStartTime = ""
          this.inboundReturnForm.collEndTime = ""
        }
        this.listLoading = true
        this.inboundReturnForm.classAttributeList = this.classAttributeList
        // this.inboundReturnForm.approvalStatus = 'ok'

        this.superForm = this.inboundReturnForm
        if (type === 'basic') {
          this.basicQuery = {
            matchLogic: 'AND',
            condition: this.searchList14
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          }
          this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }
      this.inboundReturnForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      CollectionandreturnList(this.inboundReturnForm).then(res => {
          console.log("归还", res);
          this.inboundReturnData = res.data.records
          this.inboundReturnTotal = res.data.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
    },
    // 生产产品数据
    searchProductData(type) {
      this.listLoading = true
      this.productForm.classAttributeList = this.classAttributeList
      this.productForm.approvalStatus = 'ok'
      this.superForm = this.productForm
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList7
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.productForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
    searchWorkDta(type) {
      this.listLoading = true
      this.workForm.classAttributeList = this.classAttributeList
      this.workForm.approvalStatus = 'ok'
      this.superForm = this.workForm
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList8
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.workForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
        this.$refs.productInboundREFForm.init(arr, 'add', this.classAttributeList, this.warehouseCode)
      })
    },
    // 生产工单单条入库
    workInbound(row) {
      let arr = []
      arr.push(row)
      this.workInboundFormVisible = true
      this.$nextTick(() => {
        this.$refs.workInboundREFForm.init(arr, 'add', this.classAttributeList, this.warehouseCode)
      })
    },



    // 高级查询
    advancedQueryFun() {
      // 销售发货通知单
      if (this.categoryType == 'outbound_sale_send' && !this.saleFlag) {
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
            prop: 'countryName',
            label: "国家",
            type: 'input'
          },
          {
            prop: 'provinceName',
            label: "省",
            type: 'input'
          },
          {
            prop: 'cityName',
            label: "市",
            type: 'input'
          },
          {
            prop: 'areaName',
            label: "区",
            type: 'input'
          },
          {
            prop: 'address',
            label: "地址",
            type: 'input'
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
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          }



        ]
      }
      // 销售发货订单
      if (this.categoryType == 'outbound_sale_send' && this.saleFlag) {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'cooperativePartnerCode',
            label: "客户编码",
            type: 'input'
          },


          {
            prop: 'cooperativePartnerName',
            label: "客户名称",
            type: 'input'
          },
          {
            prop: 'departmentName',
            label: "所属部门",
            type: 'input'
          },
          {
            prop: 'salesName',
            label: "所属销售",
            type: 'input'
          },
          {
            prop: 'customerProductNo',
            label: "客户料号",
            type: 'input'
          },
          {
            prop: 'drawingNo',
            label: "品名规格",
            type: 'input'
          },
          {
            prop: 'productCode',
            label: "产品编码",
            type: 'input'
          },
          {
            prop: 'mainUnit',
            label: "单位",
            type: 'input'
          },
          {
            prop: 'drawingNo',
            label: "品名规格",
            type: 'input'
          },
          {
            prop: 'deliveryDate',
            label: '交货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
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
            prop: 'oilQuantity',
            label: "油脂量",
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
            prop: 'remark',
            label: "备注",
            type: 'input'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },




        ]
        this.getProductClassFun()
      }
      // 销售退货通知单
      if (this.categoryType == 'inbound_sale_return') {
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
              { label: "正常发货", value: false },
              { label: "换货发货", value: true }
            ]

          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },



        ]
      }
      // 采购 退货 通知单
      if (this.categoryType == 'outbound_purchase') {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'partnerName',
            label: "供应商名称",
            type: 'input'
          },
          {
            prop: 'partnerCode',
            label: "供应商编码",
            type: 'input'
          },
          {
            prop: 'salesman',
            label: "操作员",
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
            prop: 'remark',
            label: "备注",
            type: 'input'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },



        ]
      }
      // 采购收货通知单
      if (this.categoryType == 'inbound_purchase' && !this.purchaseFlag) {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'partnerName',
            label: "供应商名称",
            type: 'input'
          },
          {
            prop: 'partnerCode',
            label: "供应商编码",
            type: 'input'
          },
          {
            prop: 'salesman',
            label: "操作员",
            type: 'input'
          },
          {
            prop: 'deliverDate',
            label: '收货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'remark',
            label: "备注",
            type: 'input'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },



        ]
      }
      // 采购收货订单
      if (this.categoryType == 'inbound_purchase' && this.purchaseFlag) {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'cooperativePartnerName',
            label: "供应商名称",
            type: 'input'
          },
          {
            prop: 'cooperativePartnerCode',
            label: "供应商编码",
            type: 'input'
          },
          {
            prop: 'drawingNo',
            label: "品名规格",
            type: 'input'
          },

          {
            prop: 'productCode',
            label: "产品编码",
            type: 'input'
          }, {
            prop: 'mainUnit',
            label: "单位",
            type: 'input'
          },
          {
            prop: 'salesman',
            label: "操作员",
            type: 'input'
          },
          {
            prop: 'deliveryDate',
            label: '交货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'standardValue',
            label: "规值",
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
            prop: 'processName',
            label: "工序",
            type: 'input',
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
            prop: 'oilQuantity',
            label: "油脂量",
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
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },



        ]
        this.getProductClassFun()
      }
      // 外协收货通知单
      if (this.categoryType == 'inbound_purchase' && !this.externalFlag) {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'partnerCode',
            label: "供应商编码",
            type: 'input'
          },
          {
            prop: 'partnerName',
            label: "供应商名称",
            type: 'input'
          },
          {
            prop: 'salesman',
            label: "操作员",
            type: 'input'
          },

          {
            prop: 'deliverDate',
            label: '收货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'remark',
            label: "备注",
            type: 'input'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },



        ]
      }
      // 外协收货订单
      if (this.categoryType == 'inbound_external' && this.externalFlag) {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'cooperativePartnerName',
            label: "供应商名称",
            type: 'input'
          },
          {
            prop: 'cooperativePartnerCode',
            label: "供应商编码",
            type: 'input'
          },

          {
            prop: 'drawingNo',
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
            prop: 'deliveryDate',
            label: '交货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },

          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },



        ]
      }
      // 外协发料通知单    
      if (this.categoryType == 'outbound_external_send' && !this.externalFlag) {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'partnerName',
            label: "供应商名称",
            type: 'input'
          },
          {
            prop: 'partnerCode',
            label: "供应商编码",
            type: 'input'
          },
          {
            prop: 'deliverDate',
            label: '发料日期',
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
            label: "发料方式",
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
            prop: 'countryName',
            label: "国家",
            type: 'input'
          },
          {
            prop: 'provinceName',
            label: "省",
            type: 'input'
          },
          {
            prop: 'cityName',
            label: "市",
            type: 'input'
          },
          {
            prop: 'areaName',
            label: "区",
            type: 'input'
          },
          {
            prop: 'address',
            label: "地址",
            type: 'input'
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
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          }


        ]
      }

      // 外协发料订单   
      if (this.categoryType == 'outbound_external_send' && this.externalFlag) {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "单号",
            type: 'input'
          },
          {
            prop: 'cooperativePartnerName',
            label: "供应商名称",
            type: 'input'
          },
          {
            prop: 'cooperativePartnerCode',
            label: "供应商编码",
            type: 'input'
          },
          {
            prop: 'deliveryDate',
            label: '交货日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'drawingNo',
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


        ]
      }
      // 生产领料   
      if (this.categoryType == 'outbound_pick_out') {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "领料单号",
            type: 'input'
          },
          {
            prop: 'receiveType',
            label: "领料类型",
            type: 'select',
            options: [
              { label: "订单物料", value: "order", },
              { label: "工序物料", value: "process", }
            ]
          },
          {
            prop: 'productionOrderNo',
            label: "任务单号",
            type: 'input'
          },
          {
            prop: 'personName',
            label: "领料人",
            type: 'input'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },




        ]
      }
      // 生产退料   
      if (this.categoryType == 'inbound_return_materials') {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "退料单号",
            type: 'input'
          },
          {
            prop: 'receiveType',
            label: "退料类型",
            type: 'select',
            options: [
              { label: "订单物料", value: "order", },
              { label: "工序物料", value: "process", }
            ]
          },
          {
            prop: 'productionOrderNo',
            label: "任务单号",
            type: 'input'
          },
          {
            prop: 'personName',
            label: "退料人",
            type: 'input'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },




        ]
      }
      // 资产领用   
      if (this.categoryType == 'outbound_use') {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "领用单号",
            type: 'input'
          },
          {
            prop: 'useApplication',
            label: "领用目的",
            type: 'select',
            options: [
              { label: "设备保养", value: "equipmentmaintain", },
              { label: "设备维修", value: "equipmentrepair", },
              { label: "工具保养", value: "toolmaintain", },
              { label: "工具维修", value: "toolrepair", },
            ]
          },

          {
            prop: 'collectionTime',
            label: '领用日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'maintainerIdText',
            label: "领用人",
            type: 'input'
          },

          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },




        ]
      }
      // 资产归还  
      if (this.categoryType == 'inbound_return') {
        this.superQueryJson = [
          {
            prop: 'orderNo',
            label: "归还单号",
            type: 'input'
          },


          {
            prop: 'collectionTime',
            label: '归还日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'maintainerIdText',
            label: "归还人",
            type: 'input'
          },

          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: "创建人",
            type: 'input'
          },




        ]
      }

      // 生产入库  
      if (this.categoryType == 'inbound_mock_production') {
        if (this.activeName == 'product') {
          this.superQueryJson = [
            {
              prop: 'orderNo',
              label: "任务单号",
              type: 'input'
            },
            {
              prop: 'orderType',
              label: "任务类型",
              type: 'select',
              options: [
                {
                  label: "正常订单", value: "normal",
                },
                {
                  label: "返工订单", value: "rework",
                }
              ]
            },
            {
              prop: 'productDrawingNo',
              label: "品名规格",
              type: 'input'
            },
            {
              prop: 'mainUnit',
              label: "单位",
              type: 'input'
            },
            {
              prop: 'productionPlanNo',
              label: "计划单号",
              type: 'input'
            },
            {
              prop: 'aperture',
              label: "孔径",
              type: 'select',
              options: []
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
              prop: 'oilQuantity',
              label: "油脂量",
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
              prop: 'createTime',
              label: '创建时间',
              type: 'daterange',
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              pickerOptions: this.global.timePickerOptions
            },
            {
              prop: 'createByName',
              label: "创建人",
              type: 'input'
            },




          ]
          this.getProductClassFun()
        } else {
          this.superQueryJson = [
            {
              prop: 'productionOrderNo',
              label: "任务单号",
              type: 'input'
            },
            {
              prop: 'orderNo',
              label: "工单号",
              type: 'input'
            },
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
              prop: 'createTime',
              label: '创建时间',
              type: 'daterange',
              valueFormat: "yyyy-MM-dd HH:mm:ss",
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              pickerOptions: this.global.timePickerOptions
            },





          ]
        }

      }




      this.superQueryVisible = true
    },
    superQuerySearch(query) {
      this.superQueryVisible = false
      this.superQuery = query

      this.getTabdataList('super')
    },
    resetFun(type) {
      if (this.categoryType == 'outbound_sale_send' || this.categoryType == 'inbound_sale_return') {
        if (this.categoryType == 'outbound_sale_send' && this.saleFlag) {
          this.saleOrderDateArr = []
          this.superForm = this.saleOrderForm = {
            deliverQueryFlag: true,
            deliveryStartTime: "",
            deliveryEndTime: "",
            cooperativePartnerName: "",
            customerProductNo: "",
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: true,
              column: "delivery_date"
            }],
            superQuery: {},
            pageNum: 1,
            pageSize: 20,
          }
          this.$refs.SuperQuery.conditionList = []
          this.searchList9 = [
            { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
            { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
          ]
        } else {
          this.fhDateArr = []
          this.superForm = this.fhForm = {
            orderNo: "",
            classAttributeList: this.classAttributeList,
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
          }
          this.$refs.SuperQuery.conditionList = []
          this.searchList1 = [
            { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
          ]
        }
        this.getTabdataList('basic')
      }
      if (this.categoryType == 'inbound_purchase' || this.categoryType == 'outbound_purchase') {

        if ((this.categoryType == 'inbound_purchase' && !this.purchaseFlag) || this.categoryType == 'outbound_purchase') {
          this.cgDateArr = []
          this.superForm = this.cgForm = {
            documentStatus: "sibmit",
            classAttributeList: this.classAttributeList,
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
          }
          this.$refs.SuperQuery.conditionList = []
          this.searchList2 = [
            { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
          ]
        } else if (this.categoryType == 'inbound_purchase' && this.purchaseFlag) {
          this.purchaserOrderDateArr = []
          this.superForm = this.purchaseForm = {
            cooperativePartnerName: "",
            productDrawingNo: "",
            deliveryStartDate: "",
            deliveryEndDate: "",
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: true,
              column: "delivery_date"
            }],
            superQuery: {},
            pageNum: 1,
            pageSize: 20,
          }
          this.$refs.SuperQuery.conditionList = []
          this.searchList10 = [
            { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },

          ]
        }

        this.getTabdataList()
      }

      if (this.categoryType == 'outbound_external_send') {
        if (!this.externalFlag) {
          this.wxflDateArr = []
          this.superForm = this.wxflForm = {
            documentStatus: "sibmit",
            classAttributeList: this.classAttributeList,

            rdeDate: "",
            rdsDate: "",
            notifyType: "external",
            deliveryStatus: "not_finished",
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
          }
          this.$refs.SuperQuery.conditionList = []
          this.searchList3 = [
            { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
          ]
        } else {
          this.superForm = this.exterMaterForm = {
            orderNo: "",
            cooperativePartnerName: "",
            productDrawingNo: "",
            pageNum: 1,
            pageSize: 20,
            shipmentStatus: "not_finish",
            externalFlag: true,
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: true,
              column: "delivery_date"
            }],
          }

          this.$refs.SuperQuery.conditionList = []
          this.searchList12 = [
            { field: 'orderNo', fieldValue: '', label: '订单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
            { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
          ]
        }
        this.getTabdataList()
      }
      if (this.categoryType == 'inbound_external') {
        if (this.externalFlag) {
          this.externalDate = []
          this.superForm = this.externalForm = {
            receiptQueryFlag: true,
            productDrawingNo: "",
            cooperativePartnerName: "",
            deliveryEndDate: "",
            deliveryStartDate: "",
            pageNum: 1,
            pageSize: 20,
            externalFlag: true,
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: true,
              column: "delivery_date"
            }],
          }
          this.$refs.SuperQuery.conditionList = []
          this.searchList11 = [
            { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
            { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

          ]
        } else {
          this.wxshDateArr = []
          this.superForm = this.wxshForm = {
            orderNo: "",
            classAttributeList: this.classAttributeList,
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
          }
          this.$refs.SuperQuery.conditionList = []
          this.searchList4 = [
            { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
          ]
        }
        this.getTabdataList()
      }
      if (this.categoryType == 'outbound_pick_out') {
        this.superForm = this.pickForm = {
          pageNum: 1,
          pageSize: 20,
          productClassAttributeList: this.classAttributeList,
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
          this.$refs.SuperQuery.conditionList = []
        this.searchList5 = [
          { field: 'orderNo', fieldValue: '', label: '领料单号', symbol: 'like', searchType: 1, width: 120 },
          { field: 'partnerName', fieldValue: '', label: '领料人', symbol: 'like', searchType: 1, width: 120 },
        ]
        this.getTabdataList()
      }
      if (this.categoryType == 'inbound_return_materials') {
        this.superForm = this.returnMaterForm = {
          receiveType: "",
          orderNo: "",
          personName: "",
          productClassAttributeList: this.classAttributeList,
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
        this.$refs.SuperQuery.conditionList = []
        this.searchList6 = [
          { field: 'orderNo', fieldValue: '', label: '领料单号', symbol: 'like', searchType: 1, width: 120 },
          { field: 'partnerName', fieldValue: '', label: '领料人', symbol: 'like', searchType: 1, width: 120 },
        ]
        this.getTabdataList()
      }
      if (this.categoryType == 'inbound_mock_production') {
        if (type == 'product') {
          this.superForm = this.productForm = {
            orderNo: "",
            orderType: "",
            productDrawingNo: "",
            classAttributeList: this.classAttributeList,
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
          this.$refs.SuperQuery.conditionList = []
          this.searchList7 = [
            { field: 'orderNo', fieldValue: '', label: '任务单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
          ]

          this.searchProductData()
        } else {
          this.superForm = this.workForm = {
            productionOrderNo: "",
            orderNo: "",
            processName: "",
            productDrawingNo: "",
            classAttributeList: this.classAttributeList,
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
          this.$refs.SuperQuery.conditionList = []
          this.searchList8 = [
            { field: 'productionOrderNo', fieldValue: '', label: '任务单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'orderNo', fieldValue: '', label: '工单号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
            { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
          ]
          this.searchWorkDta()
        }
      }
      if (this.categoryType == 'outbound_use') {
        this.useDateArr = []
        this.superForm = this.outboundUseForm = {
          stockFlag: true,
          classAttributeList: this.classAttributeList,
          equipmentType: "",
          maintainerIdText: "",
          orderNo: "",
          pageNum: 1,
          pageSize: 20,
          requisitionType: "requisition",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: true,
            column: "create_time"
          }],
          superQuery: {},
        }
        this.$refs.SuperQuery.conditionList = []
        this.searchList13 = [
          { field: 'orderNo', fieldValue: '', label: '领用单号', symbol: 'like', searchType: 1, width: 120 },
          { field: 'maintainerIdText', fieldValue: '', label: '领用人', symbol: 'like', searchType: 1, width: 120 },
        ]
        this.getTabdataList()
      }
      if (this.categoryType == 'inbound_return') {
        this.repayDateArr = []
        this.superForm = this.inboundReturnForm = {
          stockFlag: true,
          classAttributeList: this.classAttributeList,
          equipmentType: "",
          maintainerIdText: "",
          orderNo: "",
          pageNum: 1,
          pageSize: 20,
          requisitionType: "back",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: true,
            column: "create_time"
          }],
          superQuery: {},
        }
        this.$refs.SuperQuery.conditionList = []
        this.searchList14 = [
          { field: 'orderNo', fieldValue: '', label: '归还单号', symbol: 'like', searchType: 1, width: 120 },
          { field: 'maintainerIdText', fieldValue: '', label: '归还人', symbol: 'like', searchType: 1, width: 120 },
        ]
        this.getTabdataList()
      }
    },

    // 领用查看详情
    viewEquipmentFun(id, type, data) {
      if (data.equipmentType == 'accessory') {
        // 配件
        this.sparePartsVisible = true
        this.$nextTick(() => {
          this.$refs.sparePartsREFForm.init(id, type)
        })
      }
      if (data.equipmentType == 'equipment') {
        // 设备
        this.equipmentVisible = true
        this.$nextTick(() => {
          this.$refs.quipmentREFForm.init(id, type)
        })
      }
      if (data.equipmentType == 'tool') {
        // 工具
        this.toolVisible = true
        this.$nextTick(() => {
          this.$refs.toolREFForm.init(id, type)
        })
      }
    },
    // 归还查看详情
    viewRepayFun(id, type, data) {
      if (data.equipmentType == 'accessory') {
        // 配件
        this.sparePartsSVisible = true
        this.$nextTick(() => {
          this.$refs.sparePartsSREFForm.init(id, type)
        })
      }
      if (data.equipmentType == 'equipment') {
        // 设备
        this.equipmentSVisible = true
        this.$nextTick(() => {
          this.$refs.quipmentSREFForm.init(id, type)
        })
      }
      if (data.equipmentType == 'tool') {
        // 工具
        this.toolSVisible = true
        this.$nextTick(() => {
          this.$refs.toolSREFForm.init(id, type)
        })
      }
    },
    // 查看详情
    viewFun(id, btnType, ref, visible) {
      console.log(id, btnType, ref, visible);
      this.$nextTick(() => {
        if (ref == 'PickREFForm') {
          console.log(666);
          this.$refs[ref].init(id, btnType, false, 'pick')
        } else if (ref == 'OutbounduseREFForm') {
          // 设备领用查看详情

        } else {
          this.$refs[ref].init(id, btnType, false)

        }
      })
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.visibleForm = false
      this.toolVisible = false
      this.equipmentVisible = false
      this.sparePartsVisible = false
      this.fhFormVisible = false
      this.thFormVisible = false
      this.formVisible = false
      this.cgshFormVisible = false
      this.cgthFormVisible = false
      this.wxflFormVisible = false
      this.wxshFormVisible = false
      this.pickFormVisible = false
      this.saleFormVisible = false
      this.returnMaterFormVisible = false
      this.productInboundFormVisible = false
      this.workInboundFormVisible = false
      this.outboundSaleSendFormVisible = false
      this.inboundSaleReturnFormVisible = false
      this.inboundPurchaseFormVisible = false
      this.outboundPurchaseFormVisible = false
      this.outboundExternalSendFormVisible = false
      this.inboundExternalFormVisible = false
      this.outboundPickOutFormVisible = false
      this.inboundReturnMaterialsFormVisible = false
      this.saleOutboundFormVisible = false
      this.purchaseOrderInboundFormVisible = false
      this.purchaseFormVisible = false
      this.productExternalVisible = false
      this.externalInboundFormVisible = false
      this.externalMaterOutboundFormVisible = false
      this.equipmentOutboundVisible = false
      this.equipmentInboundVisible = false
      this.toolSVisible = false
      this.sparePartsSVisible = false
      this.equipmentSVisible = false
      if (isRefresh) {
        // this.getStockMovelistFun()
        this.getPickingConfig()
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
  /* margin-bottom: 0; */
}

::v-deep .el-badge__content.is-fixed {
  top: 3px;
  right: 24px;
  z-index: 99;
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
  margin-bottom: 5px
}

::v-deep .el-tabs__item {
  padding: 0 10px;
}

.JNPF-common-head {
  padding: 8px;
  padding-left: 0px
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}

.tag-group {
  padding-bottom: 5px !important;
  padding-top: 5px !important;
}

::v-deep.el-tabs__header {
  margin-bottom: 5px !important
}
</style>
