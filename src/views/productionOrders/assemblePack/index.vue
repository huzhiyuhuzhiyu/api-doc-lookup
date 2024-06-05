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
                    <el-input v-model="listQuery.orderNo" placeholder="请输入装箱单号" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.sourceOrderNo" placeholder="请输入来源单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col> -->
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="listQuery.packingType" placeholder="请选择装箱类型" clearable style="width: 100%;"
                      :disabled="false">
                      <el-option v-for="(item, index) in packingTypeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
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
              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="装箱单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <!-- <el-table-column prop="sourceOrderNo" label="来源单号" width="200" sortable="custom" /> -->
                <el-table-column prop="cooperativePartnerName" label="客户名称" width="160" />
                <el-table-column prop="packingType" label="装箱类型" min-width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.packingType === 'single'">单装</div>
                    <div v-if="scope.row.packingType === 'mixed'">混装</div>
                  </template>
                </el-table-column>
                <el-table-column prop="standardBoxName" label="标准箱" min-width="160" />
                <el-table-column prop="oddBoxName" label="零头箱" min-width="160" />
                <el-table-column prop="num" label="总箱数" width="160" />
                <el-table-column prop="remark" label="备注" width="160" />
                <el-table-column prop="createByName" label="创建人" width="160" />
                <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom" />
                <el-table-column prop="submitDate" label="提交时间" width="200" sortable="custom" />
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" min-width="120" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'submit' ? true : false"
                      @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'submit' ? true : false"
                      class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="printWithLodopitem(scope.row.id,scope.row.packingType)">
                          打印条码
                        </el-dropdown-item>
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
        </el-tab-pane>

        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入装箱单号" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="linesQuery.packingType" placeholder="请选择装箱类型" clearable style="width: 100%;"
                      :disabled="false">
                      <el-option v-for="(item, index) in packingTypeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" @keyup.enter.native="search()"
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
              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="装箱单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.packingListId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <!-- <el-table-column prop="sourceOrderNo" label="来源单号" width="200" sortable="custom" /> -->
                <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="160" />
                <el-table-column prop="packingType" label="装箱类型" min-width="140">
                  <template slot-scope="scope">
                    <div v-if="scope.row.packingType === 'single'">单装</div>
                    <div v-if="scope.row.packingType === 'mixed'">混装</div>
                  </template>
                </el-table-column>
                <el-table-column prop="standardBoxName" label="标准箱" min-width="180">
                  <template slot-scope="scope">
                    <div v-if="scope.row.packingType === 'single'">{{ scope.row.standardBoxName }}</div>
                    <div v-if="scope.row.packingType === 'mixed'">{{ scope.row.mainStandardBoxName }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="oddBoxName"  label="零头箱" min-width="180">
                  <template slot-scope="scope">
                    <div v-if="scope.row.packingType === 'single'">{{ scope.row.oddBoxName }}</div>
                    <div v-if="scope.row.packingType === 'mixed'">{{ scope.row.mainOddBoxName }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="mainNum" label="总箱数" min-width="120" />
                <el-table-column prop="productsCode" label="产品编码" min-width="160" />
                <el-table-column prop="productsName" label="产品名称" min-width="160" sortable="custom" />
                <el-table-column prop="num" label="箱数" min-width="120" />

                <el-table-column prop="remark" label="备注" width="160" />
                <el-table-column prop="createByName" label="创建人" width="160" />
                <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom" />
                <el-table-column prop="submitDate" label="提交时间" width="200" sortable="custom" />
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" min-width="120" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'submit' ? true : false"
                      @click="addOrUpdateHandle(scope.row.packingListId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'submit' ? true : false"
                      class="JNPF-table-delBtn" @click="handleDel(scope.row.packingListId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="printWithLodopitem(scope.row.packingListId,scope.row.packingType)">
                          打印条码
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.packingListId, 'look')">
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

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20" v-if="activeName === 'dataTable'">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="装箱单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入装箱单号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="listQuery.sourceOrderNo" placeholder="请输入来源单号" clearable />
            </el-form-item>

          </el-col> -->
          <el-col :span="12">
            <el-form-item label="装箱类型">
              <el-select v-model="listQuery.packingType" placeholder="请选择装箱类型" clearable style="width: 100%;"
                :disabled="false">
                <el-option v-for="(item, index) in packingTypeList" :key="index" :label="item.label"
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
            <el-form-item label="提交时间">
              <el-date-picker v-model="listQuery.submitDateArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="提交开始时间" end-placeholder="提交结束时间"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
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
      <el-row :gutter="20" v-else>
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="装箱单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入装箱单号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="linesQuery.sourceOrderNo" placeholder="请输入来源单号" clearable />
            </el-form-item>

          </el-col> -->
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
            <el-form-item label="单据状态">
              <el-select v-model="linesQuery.documentStatus" placeholder="请选择单据状态" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="提交时间">
              <el-date-picker v-model="linesQuery.submitDateArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="提交开始时间" end-placeholder="提交结束时间"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
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
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { salePackingList, deteleSalePackingList, lineSalePackingList,detailSalePackingList } from '@/api/warehouseManagement/packingList'
import barCodePrint from '@/views/warehouseManagement/containerControl/barcodeManagement/barCodePrint.js';
import Form from './Form'
export default {
  name: 'purchaseReBoxes',
  components: { Form },
  data() {
    return {
      activeName: 'dataTable',
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      packingTypeList: [
        { label: "单装", value: "single" },
        { label: "混装", value: "mixed" },
      ],
      listQuery: {},
      initListQuery: {
        documentStatus: '',
        createByName: "",
        documentNo: 0,
        documentType: "inbound_production",
        endTime: "",
        keyword: "",
        orderNo: "",
        packingType: "",
        startTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr: [],
        businessCode:'assemble'
      },
      linesTableData: [],
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
        createByName: "",
        documentStatus: "",
        documentType: "inbound_production",
        endTime: "",
        keyword: "",
        orderNo: "",
        packingType: "",
        pageNum: 1,
        pageSize: 20,
        processName: "",
        productCode: "",
        productName: "",
        routingName: "",
        sourceOrderNo: "",
        startTime: "",
        submitEndDate: "",
        submitStartDate: "",
        createTimeArr: [],
        submitDateArr: [],
        businessCode:'assemble'
      },
      standardBoxName: '',
      oddBoxName: '',
      total: 0,
      formVisible: false,
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

    }
  },
  watch: { activeName() { this.initData() } },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    printWithLodopitem(id,type){
      detailSalePackingList(id).then(res=>{
        let boxList = res.data.barcodes.map(box => {
          let result = {
            ...box,
            createTime: res.data.createTime,
            sourceOrderNo: res.data.sourceOrderNo,
            partnerCode: res.data.cooperativePartnerCode,
            packingType: res.data.packingType,
            documentType: res.data.documentType,
            sourceNoDeliverDate: res.data.sourceNoDeliverDate,
          }
          if (res.data.packingType === 'single') {
            result = {
              ...result,
              ...box.barcodeLines[0],
              productsNum: box.barcodeLines[0].totalNum,
              spec: box.barcodeLines[0].productSpec,
            }
          }
          return result
        })
        this.printWithLodop(boxList, type)
      })
    },
    //打印条码
    printWithLodop(row,type) {
      const callBack = () => {
        return this.$message.success('打印成功')
      }
      barCodePrint(row, callBack, type)
    },
    sortChange({ prop, order }) {
      console.log("prop", prop);
      let newProp;
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop === 'productsName' || prop === 'routingName' || prop === 'processName' || prop === 'submitDate') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }
      if (prop === 'createByName') {
        newProp = "create_by"
      }
      if (this.activeName === 'dataTable') {
        if (prop === 'submitDate') {
          newProp = "submit_date"
        }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (newProp === 'create_time') {
          newProp = "createTime"
        }
        if (prop === 'documentStatus') {
          newProp = prop
        }
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },

    moreQueries() {
      this.visible = true
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
        this.jnpf.searchTimeFormat(this.listQuery, 'submitDateArr', 'submitStartDate', 'submitEndDate')
        salePackingList(this.listQuery).then(res => {
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
        this.jnpf.searchTimeFormat(this.linesQuery, 'submitDateArr', 'submitStartDate', 'submitEndDate')
        lineSalePackingList(this.linesQuery).then(res => {
          console.log("res++", res);
          this.linesTableData = res.data.records
          // this.linesTableData.forEach(item => {
          //   if (item.packingType === 'single') {
          //     this.standardBoxName = "standardBoxName"
          //     this.oddBoxName = "oddBoxName"
          //   } else {
          //     this.standardBoxName = "mainStandardBoxName"
          //     this.oddBoxName = "mainOddBoxName"
          //   }
          // })
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
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
      }
      this.initData()
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
        deteleSalePackingList(id).then(res => {
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

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />

