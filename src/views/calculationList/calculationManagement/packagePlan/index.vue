<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.templateCode" placeholder="请选择计划模板" style="width: 100%;">
                <el-option v-for="(item, index) in templateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
              <el-form-item>
                  <el-input v-model="listQuery.orderNo" placeholder="请输入计划单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间"
                :default-time="['00:00:00', '23:59:59']">
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
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
            @click="visible = true">更多查询</el-button> -->
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

        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column
          fixedNO>
          <!-- <el-table-column prop="partnerCode" label="客户编码" min-width="140" />
          <el-table-column prop="partnerName" label="客户名称" min-width="180" sortable="custom" />
          <el-table-column prop="ordersNo" label="销售订单号" min-width="180" />
          <el-table-column prop="workOrderNo" label="工作令号" min-width="160" sortable="custom" />
          <el-table-column prop="ordersRemark" label="销售订单备注" min-width="160" /> -->
          <el-table-column prop="orderNo" label="包装计划单号" min-width="180"  />
          <el-table-column prop="templateCode" label="计划模版" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.templateCode === 't001'">通用模板</div>
              <div v-if="scope.row.templateCode === 't002'">科尼模板</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column prop="updateTime" label="修改时间" min-width="180" sortable="custom" />
          <el-table-column prop="updateByName" label="修改人" min-width="180" />

          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
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
                  <el-dropdown-item @click.native="downloadPlan(scope.row.id)">
                    下载包装计划
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="printPlan(scope.row.id, scope.row.templateCode)">
                    打印
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <PrintForm ref="PrintForm" :tableList="tableList" :value="printData" />
    <knPrintForm ref="knPrintForm" :value="printData" :dataValue="knDataForm" />
    <!-- <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售订单号">
              <el-input v-model="listQuery.ordersNo" placeholder="请输入销售订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="listQuery.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同号">
              <el-input v-model="listQuery.contractNo" placeholder="请输入合同号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划模版">
              <el-select v-model="listQuery.templateCode" placeholder="请选择计划模板" style="width: 100%;">
                <el-option v-for="(item, index) in templateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间"
                :default-time="['00:00:00', '23:59:59']">
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
    </el-dialog> -->
  </div>
</template>

<script>
import { getPackplanList, delPackplan, packPlabExport, packPlabDetail } from '@/api/calculationList/packagePlan'
import Form from './Form'
import PrintForm from './printForm'
import knPrintForm from './knPrint'
export default {
  name: 'carrierProfile',
  components: { Form, PrintForm, knPrintForm },
  data() {
    return {
      title: '更多查询',
      tableData: [],
      listLoading: false,
      printFormVisible: false,
      knPrintVisible: false,
      visible: false,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        contractNo: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        ordersNo: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerCode: "",
        partnerName: "",
        startTime: "",
        startUpdateTime: "",
        templateCode: "",
        totalRowFlag: false,
        workOrderNo: "",
        createTimeArr: [],
      },
      total: 0,
      formVisible: false,
      templateList: [
        { label: '通用模板', value: 't001' },
        { label: '科尼模板', value: 't002' },
      ],
      tableList: [
        { prop: 'productDrawingNo', label: '产品图号', minWidth: '220px' },
        { prop: 'workOrderNo', label: '工作令号', minWidth: '120px' },
        { prop: 'itemNumber', label: '项次', minWidth: '60px' },
        { prop: 'customerProductNo', label: '客户物料号', minWidth: '150px' },
        { prop: 'num', label: '数量', minWidth: '100px' },
        { prop: 'pressure', label: '压力', minWidth: '150px' },
        { prop: 'ask', label: '要求', minWidth: '150px' },
        { prop: 'ordersLineRemark2', label: '备注2', minWidth: '150px' },
        { prop: 'ordersRemark', label: '订单主表备注', minWidth: '155px' },
      ],
      printData: [],
      knprintData: [],
      knDataForm: {},
      styleShow: false,
      styleShow2: false,
    }
  },

  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      newProp = newProp === 'partner_name' ? 'partnerName' : newProp
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
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
      this.visible = false
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      getPackplanList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },

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
        delPackplan(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    downloadPlan(id) {
      packPlabExport(id).then(res => {
        console.log(res, '下载');
        if (res.data) {
          this.$message.success(`下载成功`)
          this.jnpf.downloadFile(res.data.url, res.data.name)
        }
      })
    },
    // 打印
    printPlan(id, templateCode) {
      packPlabDetail(id).then(res => {
        this.printData = res.data.packLineList.filter(item => item.torrNo)
        // 在每一组后面添加空行
        let newData = [];
        let prevTorrNo = null;
        if (this.printData.length) {
          this.printData.forEach(item => {
            if (prevTorrNo !== null && item.torrNo !== prevTorrNo) {
              newData.push({
                isShow: true,
                torrNo: '',
                productDrawingNo: '',
                workOrderNo: '',
                itemNumber: '',
                customerProductNo: '',
                mainUnit: '',
                num: '',
                pressure: '',
                contractNo: '',
                ask: '',
                op2: '',
                vehicleGroup: '',
                ordersLineRemark2: '',
                disabled: true
              });
            }
            newData.push(item);
            prevTorrNo = item.torrNo;
          });
          this.printData = [...new Set(newData)]
        }
        // 复制数据测试 打印分页
        // for (var i = 0; i < 2; i++) {
        //   this.printData = this.printData.concat(this.printData); 
        // }
        // console.log(this.printData);
        // 通用打印
        if (templateCode == 't001') {
          this.$nextTick(() => {
            console.log(this.$refs.PrintForm);
            console.log(this.$refs.PrintForm.$el);
            let oldStr = window.document.body.innerHTML;
            let newStr = this.$refs.PrintForm.$el.innerHTML;

            const iframe = document.createElement('iframe');
            iframe.setAttribute('style', 'position: absolute; width: 0;height: 0;');
            document.body.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            // 4. 写入内容// 
            doc.write('<style media="print"> @page {size: landscape;}</style>');
            doc.write(`<link href="./printForm.scss" media="print" rel="stylesheet" />`);
            doc.write(newStr);
            const link = doc.getElementsByTagName('link')[0];
            link.onload = () => { // 样式文件加载完毕后打印// 5.执行打印
              iframe.contentWindow.print();
              // 6.重置工作
              document.body.removeChild(iframe);
              this.$refs.PrintForm.$el.removeAttribute('style');
            }
          });
        }
        // 科尼打印
        if (templateCode == 't002') {
          this.knDataForm = res.data.packPlan
          this.$nextTick(() => {
            let oldStr = window.document.body.innerHTML;
            let newStr = this.$refs.knPrintForm.$el.innerHTML;

            const iframe = document.createElement('iframe');
            ; iframe.setAttribute('style', 'position: absolute; width: 0;height: 0;');
            document.body.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            // 4. 写入内容// 
            doc.write('<style media="print"> @page {size: portrait;}</style>');
            doc.write(`<link href="./printForm.scss" media="print" rel="stylesheet" />`);
            doc.write(newStr);
            const link = doc.getElementsByTagName('link')[0];
            link.onload = () => { // 样式文件加载完毕后打印// 5.执行打印
              iframe.contentWindow.print();
              // 6.重置工作
              document.body.removeChild(iframe);
              this.$refs.knPrintForm.$el.removeAttribute('style');
            }
          });
        }

      })
    },

  }
}
</script>
<style  scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}

::v-deep.el-range-editor--small.el-input__inner {
  height: 34px;
}

::v-deep.el-table__body-wrapper {
  height: auto !important;
}
</style>

