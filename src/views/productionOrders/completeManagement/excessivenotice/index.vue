<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="通知单列表" name="orderList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.orderNo" @keyup.enter.native="search()" placeholder="请输入超领料单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.personName" @keyup.enter.native="search()" placeholder="请输入超领料人" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="global.timePickerOptions" start-placeholder="领料开始日期" end-placeholder="领料结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                            $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')" />

                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="超领料单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                            scope.row.orderNo
                                        }}</el-link>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="productionOrderNo" label="生产订单号" width="180"> </el-table-column> -->
                <el-table-column prop="receiveType" label="领料类型" width="120" >
                  <template slot-scope="scope">
                    <div v-if="scope.row.receiveType == 'order'">订单物料
                    </div>
                    <div v-if="scope.row.receiveType == 'process'">工序物料
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="personName" label="超领料人" min-width="150" />
                <el-table-column prop="operationDate" label="领料日期" min-width="180" sortable="custom" />
                <el-table-column prop="reasonRejection" label="驳回理由" width="180"></el-table-column>
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" fixed="right" width="120" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag>
                    </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" fixed="right" width="120" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'">
                      <el-tag>审批中</el-tag>
                    </div>
                    <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'">
                      <el-tag type="success">审批通过</el-tag>
                    </div>
                    <div v-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'">
                      <el-tag type="danger">审批拒绝</el-tag>
                    </div>
                    <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag type="warning">审批撤回</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="updateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'" @click.native="addSupplier(scope.row.id, 'add')">
                          重新提交
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'" @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                          审批撤回
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.receiveType === 'process'" @click.native="handleUserRelation(scope.row.id, 'copy')">
                          复制通知单
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="detailList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入超领料单号" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.personName" placeholder="请输入超领料人" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-date-picker v-model="deliveryDatefahuo" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" clearable start-placeholder="领料开始日期" end-placeholder="领料结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                            $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true" style="height: 100%;" custom-column @sort-change="sortChange">
                <el-table-column prop="orderNo" label="超领料单号" width="200" sortable="custom" fixed="left">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.materialCollectId, 'look')">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="productionOrderNo" label="生产订单号" width="180"> </el-table-column> -->
                <el-table-column prop="receiveType" label="领料类型" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.receiveType == 'order'">订单物料
                    </div>
                    <div v-if="scope.row.receiveType == 'process'">工序物料
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="personName" label="超领料人" width="120" sortable="custom">
                </el-table-column>
                <el-table-column prop="operationDate" label="领料日期" width="180" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" width="200" fixed="left" />
                <el-table-column prop="productName" label="产品名称" width="200" sortable="custom" fixed="left" />
                <el-table-column prop="productDrawingNo" label="产品图号" width="200" sortable="custom" fixed="left" />
                <el-table-column prop="routingName" label="工艺路线名称" width="200" sortable="custom" fixed="left" />
                <el-table-column prop="processName" label="工序名称" width="200" sortable="custom" fixed="left" />
                <!-- <el-table-column prop="receivedQuantity" label="已领数量" width="140" /> -->
                <!-- <el-table-column prop="unReceiveQuantity" label="待领数量" width="140" /> -->
                <el-table-column prop="num" label="超领料数量" min-width="120" />
                <el-table-column prop="mainUnit" label="单位" min-width="120" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column label="操作" fixed="right" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="updateHandle(scope.row.materialCollectId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="handleDel(scope.row.materialCollectId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.materialCollectId, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.receiveType === 'process'" @click.native="handleUserRelation(scope.row.materialCollectId, 'copy')">
                          复制通知单
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 更多搜索 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20" v-if="activeName === 'orderList'">
        <el-form :model="dataForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="超领料单号">
              <el-input v-model="dataForm.orderNo" placeholder="请输入超领料单号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="dataForm.productionOrderNo" placeholder="请输入生产单号" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="超领料人">
              <el-input v-model="dataForm.personName" placeholder="请输入超领料人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超领料日期">
              <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="global.timePickerOptions" start-placeholder="超领料开始日期" end-placeholder="超领料结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料类型">
              <el-select v-model="dataForm.receiveType" placeholder="请选择领料类型" clearable>
                <el-option v-for="(item, index) in personorderList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料状态">
              <el-select v-model="dataForm.pickingStatus" placeholder="请选择领料状态" clearable>
                <el-option v-for="(item, index) in orderList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="dataForm.approvalStatus" placeholder="请选择审批状态" filterable clearable>
                <el-option v-for="(item, index) in approvalStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="dataForm.documentStatus" placeholder="请选择单据状态" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArrsta" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" :picker-options="global.timePickerOptions" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="超领料单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入超领料单号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="linesQuery.productionOrderNo" placeholder="请输入生产单号" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="领料类型">
              <el-select v-model="linesQuery.receiveType" placeholder="请选择领料类型" clearable>
                <el-option v-for="(item, index) in personorderList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超领料人">
              <el-input v-model="linesQuery.personName" placeholder="请输入超领料人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超领料日期">
              <el-date-picker v-model="deliveryDatefahuo" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" clearable start-placeholder="请选择超领料开始日期" end-placeholder="请选择超领料结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArrfahuo" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>
import { WithdrawalList, deleteWithdrawal, WithdrawalmxList } from '@/api/productOrdes/index'
import Form from './Form'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
export default {
  name: 'excessivenotice',
  components: { Form, },
  data() {
    return {
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      deliveryDatefahuo: [],
      activeName: "orderList",
      visible: false,
      createTimeArrsta: [],
      orderDateArr: [],
      tableData: [],
      listLoading: false,
      personorderList: [
        { label: "订单物料", value: "order" },
        { label: "工序物料", value: "process" },
      ],
      orderList: [
        { label: "未领料", value: "not_picked" },
        { label: "已领料", value: "picked" },
      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      dataForm: {},
      dataFormlist: {
        businessCode: 'complete',
        notifyType: 'over_picking',
        demandType: '',
        productionOrderNo: "",
        startTime: "",
        endTime: "",
        documentStatus: "",
        approvalStatus: "",
        pickingStatus: "",
        personName: "",
        orderNo: "",
        operationSd: "",
        operationEd: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      linesQuery: {},
      linesQuerylist: {
        businessCode: 'complete',
        notifyType: 'over_picking',
        demandType: '',
        orderNo: '',
        personName: '',
        startTime: '',
        endTime: '',
        operationSd: '',
        operationEd: '',
        productCode: '',
        productDrawingNo: '',
        productName: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
    this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
    this.search()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
    handleClick(e) {
      this.activeName = e.name
    },
    sortChange({ prop, order }) {
      let newProp;
      if (this.activeName == "orderList") {
        if (prop === 'saleOrderNo') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.dataForm.orderItems[0].asc = order === "ascending"
        this.dataForm.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'productName' || prop === 'productDrawingNo' || prop === 'routingName' || prop === 'processName' || prop === 'personName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.linesQuery.orderItems[0].asc = order !== "descending"
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.search()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName == "orderList") {
        WithdrawalList(this.dataForm).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
          this.visible = false
        })
      } else {
        WithdrawalmxList(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
          this.visible = false
        })
      }
    },
    search() {
      if (this.activeName == "orderList") {
        if (this.orderDateArr && this.orderDateArr.length > 0) {
          this.dataForm.operationSd = this.orderDateArr[0]
          this.dataForm.operationEd = this.orderDateArr[1]
        } else {
          this.dataForm.operationSd = ''
          this.dataForm.operationEd = ''
        }
        if (this.createTimeArrsta && this.createTimeArrsta.length > 0) {
          this.dataForm.startTime = this.createTimeArrsta[0].replace(/ 0(?!0)/g, " ")
          this.dataForm.endTime = this.createTimeArrsta[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.dataForm.startTime = ''
          this.dataForm.endTime = ''
        }
        Object.keys(this.dataForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.dataForm[key]
          this.dataForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.dataForm.pageNum = 1
      } else {
        if (this.deliveryDatefahuo && this.deliveryDatefahuo.length > 0) {
          this.linesQuery.operationSd = this.deliveryDatefahuo[0]
          this.linesQuery.operationEd = this.deliveryDatefahuo[1]
        } else {
          this.linesQuery.operationSd = ''
          this.linesQuery.operationEd = ''
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
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.orderDateArr = []
        this.createTimeArrsta = []
        this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
        this.createTimeArrfahuo = [],
          this.deliveryDatefahuo = []
      }
      this.search()
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    updateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype,)
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteWithdrawal(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
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
    