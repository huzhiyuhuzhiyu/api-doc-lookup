<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="workRecoordForm.orderNo" @keyup.enter.native="search()"
                  placeholder="请输入报工单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="workRecoordForm.workNo" @keyup.enter.native="search()" placeholder="请输入工单号"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="workRecoordForm.dispatchNo" @keyup.enter.native="search()" placeholder="请输入派工单号"
                  clearable />
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
              @click="moreQueries()">更多查询</el-button>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="workRecoordList" :fixedNO="true"
            @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="报工单号" width="200" fixed="left"></el-table-column>
            <el-table-column prop="productionOrderNo" label="生产订单号" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" width="150" fixed="left" sortable="custom"></el-table-column>
            <el-table-column prop="productName" label="产品名称" fixed="left" width="160" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" width="160" />
            <el-table-column prop="workNo" label="工单号" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="dispatchNo" label="派工单号" min-width="180"></el-table-column>
            <el-table-column prop="processName" label="工序名称" width="160" sortable="custom"></el-table-column>
            <el-table-column prop="workGroupName" label="班组名称" min-width="160" />
            <el-table-column prop="dispatchQuantity" label="派工生产数量" width="120"></el-table-column>
            <el-table-column prop="reportingQuantity" label="报工数量" width="120" />
            <el-table-column prop="industrialWasteQuantity" label="工废数量" width="120"> </el-table-column>
            <el-table-column prop="materialWasteQuantity" label="料废数量" width="100"> </el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" width="150" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" width="150" sortable="custom"></el-table-column>
            <el-table-column prop="workingTimeText" label="上工时长" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="reportingTime" label="报工时间" min-width="200" sortable="custom"> </el-table-column>
            <el-table-column prop="reporterName" label="报工人" width="120" sortable="custom" />
            
            <el-table-column prop="producerName" label="生产人" width="120" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="160" />

          </JNPF-table>
          <pagination :total="total" :page.sync="workRecoordForm.pageNum" :limit.sync="workRecoordForm.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <!-- 更多查询 -->
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="workRecoordForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="报工单号">
              <el-input v-model="workRecoordForm.orderNo" placeholder="请输入报工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="workRecoordForm.productionOrderNo" placeholder="请输入生产订单号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="workRecoordForm.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="workRecoordForm.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="workRecoordForm.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工单号">
              <el-input v-model="workRecoordForm.workNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="workRecoordForm.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="派工单号">
              <el-input v-model="workRecoordForm.dispatchNo" placeholder="请输入派工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报工人">
              <el-input v-model="workRecoordForm.reporterName" placeholder="请输入报工人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产人">
              <el-input v-model="workRecoordForm.producerName" placeholder="请输入生产人" clearable />
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
import { getWorkReportList } from "@/api/productOrdes/index"

import moment from 'moment'
export default {
  name: 'carrierProfile',
  data() {
    return {
      workRecoordList: [],
      workRecoordForm: {
        demandType: "",
        productionOrderNo: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        workNo: "",
        processName: "",
        dispatchNo: "",
        reporterName: "",
        producerName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "reporting_time"
        }],
        businessCode:"assemble",
      },
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,


      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      total: 0,
    }
  },
  created() {
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {


    sortChange({ prop, order }) {
      console.log("prop", prop);
      let newProp= prop;
      if(prop==="reportingTime"||prop==="workingTime"){
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      // if (prop === 'productCode' || prop === 'productName' || prop === 'productDrawingNo'||prop==="productionOrderNo"||prop==="workNo") {
      //   newProp = prop
      // } else {
      //   newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      // }\

      this.workRecoordForm.orderItems[0].asc = order === "ascending"
      this.workRecoordForm.orderItems[0].column = order === null ? "" : newProp

      this.initData()

    },

    moreQueries() {
      this.visible = true
    },

    getTimes(time) {
		// 转换为式分秒
		let d = parseInt(time / 60 / 60 / 24)
		let h = parseInt(time / 60 / 60 % 24)
		let m = parseInt(time / 60 % 60)
		let s = parseInt(time % 60)
		// s = s < 10 ? '0' + s : s
		// 作为返回值返回
		// return `${h}时${m}分${s}秒`
		return d != '0' ? `${d} 天 ${h} 时 ${m} 分 ${s} 秒` : h != '0' ? `${h} 时 ${m} 分 ${s} 秒` : m != '0' ?
			`${m} 分 ${s} 秒` : `${s} 秒`
	},
    initData() {
      this.listLoading = true

      getWorkReportList(this.workRecoordForm).then(res => {
        res.data.records.forEach(item => {
          item.workingTimeText=this.getTimes(item.workingTime)
        });
        console.log("res++", res, this.workRecoordForm);
        this.workRecoordList=res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },


    search() {
      Object.keys(this.workRecoordForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.workRecoordForm[key]
        this.workRecoordForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.workRecoordForm.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.workRecoordForm = {
        demandType: "",
        productionOrderNo: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        workNo: "",
        processName: "",
        dispatchNo: "",
        reporterName: "",
        producerName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "reporting_time"
        }],

        businessCode:"assemble",
      }

      this.search()
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

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-dialog .el-dialog__body {
  padding: 30px 20px !important;
}
</style>

