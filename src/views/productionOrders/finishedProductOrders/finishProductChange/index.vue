<template>
  <div class="JNPF-common-layout">
   
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="请输入申请单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productName" placeholder="请输入产品名称" @keyup.enter.native="search()" clearable />
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
            <topOpts @add="addOrUpdateHandle('', 'add')" />
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
            custom-column>
            <el-table-column prop="orderNo" label="申请单号" min-width="200" sortable="custom" fixed="left">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="productionOrderNo" label="生产订单号" min-width="200" sortable="custom" />

            <el-table-column prop="productCode" label="产品编码" min-width="160"  fixed="left" />
            <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom" fixed="left" />
            <el-table-column prop="productDrawingNo" label="产品图号" min-width="160" sortable="custom" fixed="left"/>
            <el-table-column prop="applyReason" label="申请理由" min-width="160"  />
            <el-table-column prop="leftCoreLength" label="原左芯子长" min-width="160"  />
            <el-table-column prop="rightCoreLength" label="原右芯子长" min-width="160"  />
            <el-table-column prop="compressionElongation" label="原扣压伸长量" min-width="160"  />
            <el-table-column prop="hoseLength" label="原软管净长" min-width="160"  />
            <el-table-column prop="newLeftCoreLength" label="新左芯子长" min-width="160"  />
            <el-table-column prop="newRightCoreLength" label="新右芯子长" min-width="160"  />
            <el-table-column prop="newCompressionElongation" label="新扣压伸长量" min-width="160"  />
            <el-table-column prop="newHoseLength" label="新软管净长" min-width="160"  />


            <el-table-column prop="approvalCompletionDate" label="审批完成日期" min-width="200" />
            <el-table-column prop="reasonRejection" label="驳回理由" min-width="180" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" />
            <el-table-column prop="submitDate" label="提交时间" width="180" />
   
            <el-table-column prop="documentStatus" label="单据状态"  width="120" align="center"
              fixed="right">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.documentStatus === 'draft'" type="warning">草稿</el-tag>
                <el-tag v-else-if="scope.row.documentStatus === 'submit'" type="success">提交</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="approvalStatus" label="审批状态" width="120"  align="center"
              fixed="right">
              <template slot-scope="scope">
                <div v-if="scope.row.approvalStatus === 'ing' && scope.row.documentStatus === 'submit'"><el-tag
                    type="warning">审批中</el-tag></div>
                <div v-else-if="scope.row.approvalStatus === 'ok' && scope.row.documentStatus === 'submit'"><el-tag
                    type="success">审批通过</el-tag></div>
                <div v-else-if="scope.row.approvalStatus === 'rebut' && scope.row.documentStatus === 'submit'"><el-tag
                    type="danger">审批拒绝</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus === 'draft' ? false : true"
                  @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus === 'draft' ? false : true"
                  @click="handleDel(scope.row.id)">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
 
 

    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20" v-if="activeName === 'dataTable'">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="申请单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入申请单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" filterable clearable>
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
   
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']">
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

    <Form v-if="formVisible" ref="Form" @refresh="refresh" @close="closeForm" />
  </div>
</template>

<script>
import { finishChangeList, delFinishChange } from "@/api/productOrdes/index"
import Form from './form'
export default {
  name: 'finishChangeList',
  components: { Form },
  data() {
    return {
      activeName: 'dataTable',
      listLoading: false,
      visible: false,
      formVisible: false,

      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      }],

      tableData: [],
      total: 0,
      listQuery: {},
      initListQuery: {
        approvalStatus: "",
        createByName: "",
        demandType: "finish_product",
        documentStatus: "",
        endTime: "",
        keyword: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionOrderNo: "",
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },

      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        createByName: "",
        createEndTime: "",
        createTimeArr: "",
        createStartTime: "",
        documentStatus: "",       // 单据状态
        endTime: "",
        inspectionStatus: "",     // 检验状态
        orderNo: "",              //收货单号
        purchaseOrderNo: "",      //采购单号
        notificationType: 'procure',
        pageNum: 1,
        pageSize: 20,
        receivingStatus: "",      //收货状态
        receiptReturnType: 'receipt',
        salesman: "",             //业务员
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        createTimeArr: [],
        deliveryDate: [],
      },
    }
  },
  watch: { activeName() { this.initData() } },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    // this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      console.log("prop", prop);
      let newProp;
      if (prop === 'productName' || prop === 'productDrawingNo' || prop === 'createTime' || prop === 'orderNo' || prop === 'productionOrderNo' || prop === 'productCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (newProp === 'purchase_order_no') {
        newProp = 'purchaseOrderNo'
      }
      if (this.activeName === 'dataTable') {
        if (newProp === 'createTime') {
          newProp = 'create_time'
        }
        if (newProp === 'orderNo') {
          newProp = 'order_no'
        }

        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        if (this.listQuery.createTimeArr && this.listQuery.createTimeArr.length > 0) {
          this.listQuery.startTime = this.listQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.listQuery.endTime = this.listQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        finishChangeList(this.listQuery).then(res => {
          console.log("res++", res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.linesQuery, 'deliveryDate', 'deliverDateStart', 'deliverDateEnd')
        linesReceiptReturn(this.linesQuery).then(res => {
          console.log("res++", res);
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })

      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
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
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()

        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
        this.linesQuery.createTimeArr = []
        this.linesQuery.deliveryDate = []
      }
      this.initData()
    },

    // 点击切换明细
    // handleClick(e) {
    //   console.log(e);
    //   this.activeName = e.name
    //   this.initData()
    // },

    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delFinishChange(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },


  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
