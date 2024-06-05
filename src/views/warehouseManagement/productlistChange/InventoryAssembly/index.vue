<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单据列表" name="orderList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="form.transferNo" placeholder="请输入组装单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="form.transferByName" placeholder="请输入组装人" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="quotationTime" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="请选择组装开始日期" end-placeholder="请选择组装结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                      $t('common.reset') }}
                    </el-button>

                  </el-form-item>

                </el-col>
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <!-- <el-dropdown> -->
                <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('add')" size="mini">
                  新建
                </el-button>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="transferNo" label="组装单号" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.transferNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="transferByName" label="组装人" width="120" sortable="custom" />
                <el-table-column prop="transferDate" label="组装日期" width="130" sortable="custom" />
                <el-table-column prop="warehouseName" label="仓库" width="200" />
                <el-table-column prop="shelfSpaceName" label="库位" width="200" />
                <el-table-column prop="batchNumber" label="批次号" width="200" />
                <el-table-column prop="productCode" label="产品编码" width="200" />
                <el-table-column prop="productName" label="产品名称" width="200" />
                <el-table-column prop="num" label="数量" width="160" />
                <el-table-column prop="mainUnit" label="单位(主)" width="160" />

                <el-table-column prop="reasonRejection" label="驳回理由" width="300" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom" />
                <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" fixed="right"
                  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" fixed="right"
                  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批中</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                        type="success">审批通过</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                        type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="remark" label="备注" width="300" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                      @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="detailList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.transferNo" placeholder="请输入组装单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.transferByName" placeholder="请输入组装人" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="deliveryDatefahuo" type="daterange" value-format="yyyy-MM-dd" clearable
                      :picker-options="global.timePickerOptions" style="width: 100%;" start-placeholder="请选择组装开始日期"
                      end-placeholder="请选择组装结束日期">
                    </el-date-picker>
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
                  @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                custom-column @sort-change="sortChange" :partentOrChild="'child'">
                <el-table-column prop="transferNo" label="组装单号" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.transferId, 'look')">
                      {{ scope.row.transferNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="transferByName" label="组装人" width="120">
                </el-table-column>
                <el-table-column prop="transferDate" label="组装日期" width="180" sortable="custom" />
                <el-table-column prop="masterWarehouseName" label="目标仓库" width="200" />
                <el-table-column prop="masterShelfSpaceName" label="目标库位" width="200" />
                <el-table-column prop="masterBatchNumber" label="目标批次号" width="200" sortable="custom" />
                <el-table-column prop="masterProductCode" label="目标产品编码" width="200" sortable="custom" />
                <el-table-column prop="masterProductName" label="目标产品名称" width="200" sortable="custom" />
                <el-table-column prop="masterProductDrawingNo" label="目标产品图号" min-width="400" />
                <el-table-column prop="masterProductSpec" label="目标产品规格型号" width="200" />
                <el-table-column prop="masterNum" label="目标数量" width="140" />
                <el-table-column prop="masterMainUnit" label="目标单位" width="120" />
                <el-table-column prop="productCode" label="原产品编码" width="200" sortable="custom" />
                <el-table-column prop="productName" label="原产品名称" width="200" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="原产品图号" min-width="400" />
                <el-table-column prop="productSpec" label="原产品规格型号" width="200" />
                <el-table-column prop="warehouseName" label="原仓库" width="200" />
                <el-table-column prop="shelfSpaceName" label="原库位" min-width="200" />
                <el-table-column prop="batchNumber" label="原批次号" width="200" sortable="custom" />
                <el-table-column prop="num" label="原数量" width="140" />
                <el-table-column prop="mainUnit" label="原单位" width="120" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="addOrUpdateHandlemx(scope.row, 'edit')" size="mini"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                      @click="handleDel(scope.row.transferId,)" class="JNPF-table-delBtn">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.transferId, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20" v-if="activeName === 'orderList'">

        <el-form ref="diaForm" :model="form" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="组装单号">
              <el-input v-model="form.transferNo" placeholder="请输入组装单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组装人">
              <el-input v-model="form.transferByName" placeholder="请输入组装人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组装日期">
              <el-date-picker v-model="quotationTime" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="请选择组装开始日期" end-placeholder="请选择组装结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次号">
              <el-input v-model="form.batchNumber" placeholder="请输入批次号" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="form.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="form.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="form.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in approvalStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="form.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" style="width: 100%;"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="组装单号">
              <el-input v-model="linesQuery.transferNo" placeholder="请输入组装单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组装人">
              <el-input v-model="linesQuery.transferByName" placeholder="请输入组装人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组装日期">
              <el-date-picker v-model="deliveryDatefahuo" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                :picker-options="global.timePickerOptions" clearable start-placeholder="请选择组装开始日期"
                end-placeholder="请选择组装结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标产品编码">
              <el-input v-model="linesQuery.masterProductCode" placeholder="请输入目标产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标产品名称">
              <el-input v-model="linesQuery.masterProductName" placeholder="请输入目标产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标批次号">
              <el-input v-model="linesQuery.masterBatchNumber" placeholder="请输入原批次号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入原产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入原产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原批次号">
              <el-input v-model="linesQuery.batchNumber" placeholder="请输入目标批次号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArrfahuo" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { InventoryDisassemblylist, InventoryDisassemblydele, InventoryDisassemblymxlist } from '@/api/warehouseManagement/productlistChange'
import Form from './Form'
export default {
  name: 'InventoryAssembly',
  components: { Form, },
  data() {
    return {
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      deliveryDatefahuo: [],
      activeName: 'orderList',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      approvalStatusList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      documentStatusList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      form: {},
      formlist: {
        transferType: 'merge',
        documentStatus: '',
        approvalStatus: '',
        transferNo: '',
        transferByName: '',
        batchNumber: '',
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
        startTime: "",
        endTime: '',
        transferSd: '',
        transferEd: "",
      },
      linesQuery: {},
      linesQuerylist: {
        transferType: 'merge',
        transferNo: '',
        startTime: '',
        endTime: '',
        transferByName: '',
        masterProductCode: '',
        masterProductName: '',
        masterBatchNumber: '',
        batchNumber: '',
        productCode: '',
        productName: '',
        transferEd: '',
        transferSd: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      quotationTime: [],
      submitDate: [],
      listLoading: false,
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.formlist))
    this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
    this.search()
  },
  watch:{
    activeName(){
      this.reset()
    }
  },
  methods: {
    handleClick(e) {
      this.activeName = e.name
      // this.reset()
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp;
      if (this.activeName == "orderList") {
        if (prop === 'transferByName') {
          let prop = 'transferBy'
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        } else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.form.orderItems[0].asc = order !== 'descending'
        this.form.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'masterBatchNumber' || prop === 'masterProductCode' || prop === 'masterProductName' || prop === 'productCode' || prop === 'productName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.linesQuery.orderItems[0].asc = order !== "descending"
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.search()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName == "orderList") {
        InventoryDisassemblylist(this.form).then(res => {
          this.tableDataList = res.data.records
          this.listLoading = false
          this.total = res.data.total
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        InventoryDisassemblymxlist(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    search() {
      if (this.activeName == "orderList") {
        if (this.submitDate && this.submitDate.length > 0) {
          this.form.startTime = this.submitDate[0].replace(/ 0(?!0)/g, " ")
          this.form.endTime = this.submitDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.form.startTime = ''
          this.form.endTime = ''
        }
        if (this.quotationTime && this.quotationTime.length > 0) {
          this.form.transferSd = this.quotationTime[0]
          this.form.transferEd = this.quotationTime[1]
        } else {
          this.form.transferSd = ''
          this.form.transferEd = ''
        }
        Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
          let item = this.form[key]
          this.form[key] = typeof item === 'string' ? item.trim() : item
        })
        // 重置页码
        this.form.pageNum = 1
      } else {
        if (this.deliveryDatefahuo && this.deliveryDatefahuo.length > 0) {
          this.linesQuery.transferSd = this.deliveryDatefahuo[0]
          this.linesQuery.transferEd = this.deliveryDatefahuo[1]
        } else {
          this.linesQuery.transferSd = ''
          this.linesQuery.transferEd = ''
        }
        if (this.createTimeArrfahuo && this.createTimeArrfahuo.length > 0) {
          this.linesQuery.startTime = this.createTimeArrfahuo[0].replace(/ 0(?!0)/g, " ")
          this.linesQuery.endTime = this.createTimeArrfahuo[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.linesQuery.startTime = ''
          this.linesQuery.endTime = ''
        }
        Object.keys(this.linesQuery).forEach(key => { // 清除搜索条件两端空格
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1 // 重置页码
      }
      this.initData()
    },
    reset() {
      if (this.activeName == "orderList") {
        this.$refs['tableForm'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.submitDate = []
        this.quotationTime = []
        this.form = JSON.parse(JSON.stringify(this.formlist))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
        this.createTimeArrfahuo = [],
          this.deliveryDatefahuo = []
      }
      this.search()
    },
    addSupplier(type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init("", type)
      })
    },
    addOrUpdateHandlemx(res, type) {
      this.depFormVisible = true
      let type1
      if (res.generateFlag) {
        type1 = 'bjkh'
      } else {
        type1 = type
      }
      let id = res.transferId
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type1)
        })
        // }, 600);
      }
    },
    addOrUpdateHandle(res, type) {
      this.depFormVisible = true
      let type1
      if (res.generateFlag) {
        type1 = 'bjkh'
      } else {
        type1 = type
      }
      let id = res.id
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type1)
        })
        // }, 600);
      }
    },
    handleUsercustom(id, type) {
      this.depFormVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        InventoryDisassemblydele(id).then(res => {
          this.$message.success("删除成功")
          this.search()
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />