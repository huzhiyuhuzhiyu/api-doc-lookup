<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" placeholder="请输入定点定价单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
                      @keyup.enter.native="search()" />
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
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>

              </el-form>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable"
                :data="tableDataList" @sort-change="sortChange" custom-column customKey="JNPFTableKey_528682">
                <el-table-column prop="orderNo" label="定点定价单号" min-width="180">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="150" sortable="custom" />
                <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="150" sortable="custom" />



                <el-table-column prop="reasonRejection" label="驳回理由" align="left" min-width="180" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" align="left" min-width="180"
                  sortable="custom" />

                <el-table-column prop="listPriceFlag" label="是否设置牌价" align="left" min-width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.listPriceFlag == 0"><el-tag type="warning">否</el-tag> </div>
                    <div v-if="scope.row.listPriceFlag == 1"><el-tag type="success">是</el-tag></div>
                  </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                <el-table-column prop="createByName" label="创建人" />
                <el-table-column prop="documentStatus" label="单据状态" align="center" sortable="custom" min-width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>

                <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" min-width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批撤回</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus !== 'draft'" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus !== 'draft'" @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                          @click.native="addOrUpdateHandle(scope.row.id, 'add')">
                          重新提交
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                          @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                          审批撤回
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入定点定价单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
                      @keyup.enter.native="search()" />
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
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="linesTableData"
                :data="linesTableData" @sort-change="sortChange" :partentOrChild="'child'" custom-column>
                <el-table-column prop="orderNo" label="定点定价单号" min-width="180" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.fixedPointPricingId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="cooperativePartnerCode" label="供应商编码" show-overflow-tooltip fixed="left"
                  min-width="150" sortable="custom" />
                <el-table-column prop="cooperativePartnerName" label="供应商名称" show-overflow-tooltip fixed="left"
                  min-width="150" sortable="custom" />
                <el-table-column prop="productsCode" label="产品编码" min-width="140" show-overflow-tooltip />
                <el-table-column prop="productsName" label="产品名称" min-width="140" show-overflow-tooltip
                  sortable="custom" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="140" show-overflow-tooltip sortable="custom" />
                <el-table-column prop="bargaining" label="协议价" min-width="140" />
                <el-table-column prop="taxRate" label="税率%" min-width="140" />
                <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="140" />
                <el-table-column prop="targetPrice" label="目标价" min-width="140" />
                <el-table-column prop="historicalPrice" label="历史价格" min-width="140" />
                <el-table-column prop="effectiveTimeStart" label="有效起始时间" min-width="160" />
                <el-table-column prop="effectiveTimeEnd" label="有效结束时间" min-width="160" />
                <el-table-column prop="contrastProductsName" label="对比物料" show-overflow-tooltip min-width="140" />
                <el-table-column prop="contrastProductsPrice" label="对比物料价格" min-width="140" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                <el-table-column prop="createByName" label="创建人" min-width="160" />
                <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" min-width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批撤回</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus !== 'draft'"
                      @click="addOrUpdateHandle(scope.row.fixedPointPricingId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus !== 'draft'"
                      @click="handleDel(scope.row.fixedPointPricingId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.fixedPointPricingId, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :background="background"
                :limit.sync="linesQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>

    </div>


    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20" v-if="activeName === 'dataTable'">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="定点定价单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入定点定价单号" min-width="150" clearable maxlength="50">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商编码">
              <el-input v-model="listQuery.cooperativePartnerCode" placeholder="请输入供应商编码" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="单据状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="审批状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>


        </el-form>
      </el-row>

      <el-row :gutter="20" v-else>
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="定点定价单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入定点定价单号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应商编码">
              <el-input v-model="linesQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="linesQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productsCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productsName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productsDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
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
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>


  </div>
</template>
  
<script>
import { getbuyFixedPointPricingList, deletebuyFixedPointPricing, linesbuyFixedPointPricing } from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from './Form'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import moment from 'moment'
export default {
  name: 'fixedPointPricing',
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      activeName: 'dataTable',
      background: true,//分页器背景颜色
      detailVisible: false,
      visible: false,
      tableDataList: [
      ],
      linesTableData: [],
      formVisible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        approvalStatus: "",    // 审批状态 审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: "",  //	供应商编码
        cooperativePartnerId: '',      // 供应商id
        cooperativePartnerName: "",   // 	供应商名称

        documentStatus: "",           // 单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        startAndEndTime: '',
        listPriceFlag: '',             // 是否设置牌价:0否1是
        orderNo: "",                  // 单号
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        submitEndTime: "",            //提交时间-结束
        submitStartTime: "",
        // startAndEndTime: [],
      },
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        cooperativePartnerCode: "",  //	供应商编码
        cooperativePartnerId: '',      // 供应商id
        cooperativePartnerName: "",   // 	供应商名称
        productsCode: "",
        drawingNo: "",
        productsName: "",
        bargaining: '',
        taxRate: '',
        excludingTaxPrice: '',
        targetPrice: '',
        historicalPrice: '',
        effectiveTimeStart: '',
        effectiveTimeEnd: '',
        contrastProductsName: '',
        contrastProductsPrice: '',
        startAndEndTime: '',
        orderNo: "",                  // 单号
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        submitEndTime: "",            //提交时间-结束
        submitStartTime: "",

      },

      documentStatusList: [{
        label: "草稿",
        value: "draft"
      }, {
        label: "提交",
        value: "submit"
      },],
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      },
      { label: "审批撤回", value: "withdrawn" },
      ],
      // 明细列表
      total: 0,
      formVisible: false,
    }
  },
  watch: { activeName() { this.initData() } },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      console.log(prop);
      let newProp;
      if (prop === 'cooperativePartnerCode' || prop === 'cooperativePartnerName' || prop === 'shipperName' || prop === 'createByName' || prop === 'productsName' || prop === 'drawingNo' || prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }

      if (this.activeName === 'dataTable') {
        if (newProp === 'createTime') {
          newProp = 'create_time'
        }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {

        if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
          this.listQuery.startTime = this.listQuery.startAndEndTime[0]
          this.listQuery.endTime = this.listQuery.startAndEndTime[1]
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        getbuyFixedPointPricingList(this.listQuery).then(res => {
          console.log(res, '询价单列表');
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'startAndEndTime', 'startTime', 'endTime')
        linesbuyFixedPointPricing(this.linesQuery).then(res => {
          console.log(res, '询价单列表');
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
      if (this.activeName === 'dataTable') {
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
        Object.keys(this.linesQuery).forEach(key => {
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },
    reset() {
      if (this.activeName === 'dataTable') {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.listQuery.startAndEndTime = []
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()

        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
        this.linesQuery.startAndEndTime = []

      }
      this.initData()
    },

    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletebuyFixedPointPricing(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
  