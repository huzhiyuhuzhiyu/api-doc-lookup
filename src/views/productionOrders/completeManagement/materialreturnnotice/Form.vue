<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建退料通知单' : btnType == 'edit' ? '编辑退料通知单' : btnType == 'copy' ? '新建退料通知单' : '查看退料通知单'" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="通知单信息" name="orderInfo">
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="通知单号" prop="orderNo">
                    <el-input readonly placeholder="请输入通知单号" :disabled="btnType == 'look' ? true : false" v-model="dataForm.orderNo"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="8" :xs="24" v-if="btnType !== 'look'">
                  <el-form-item label="生产订单号" prop="productionOrderId">
                    <el-input readonly placeholder="请选择生产订单号" :disabled="btnType == 'look' ? true : false" v-model="dataForm.productionOrderNo" @focus="openSeleceproduction"></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="退料类型" prop="receiveType">
                    <el-select v-model="dataForm.receiveType" placeholder="请选择退料类型" style="width: 100%;" @change="receiveTypeaction" :disabled="btnType == 'look'">
                      <el-option v-for="(item, index) in personorderList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="退料人" prop="llr">
                    <el-input readonly placeholder="请选择退料人" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.llr"></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="退料日期" prop="operationDate">
                    <el-date-picker v-model="dataForm.operationDate" :default-value="new Date()" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择退料日期" :disabled="btnType == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="退料人" prop="personId">
                    <user-select v-model="dataForm.personId" placeholder="请选择退料人" clearable style="width: 100%;" :disabled="btnType == 'look'" @change="hangleSelectSales">
                    </user-select>

                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" type="textarea" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>退料订单</h5>
            </div>
            <div v-if="btnType != 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceMaterDialog('order')">选择生产订单</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="product" class="data-form">
              <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="orderNo" label="订单号" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="workOrderNo" label="工作令号" width="auto" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="deliveryDate" label="交货日期" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productionQuantity" label="生产数量" width="170" :key="60"></el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add' || btnType == 'copy'" :key="24">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>退料清单</h5>
            </div>
            <div v-if="btnType != 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceMater()" v-if="dataForm.receiveType=='order'">选择用料清单</el-button>
              <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceMaterDialog('procss')" v-if="dataForm.receiveType=='process'">选择工序物料</el-button>
            </div>
            <el-form :model="dataFormlist" v-bind="dataFormlist" ref="productForm" class="data-form">
              <el-table ref="productlist" :data="dataFormlist.productlist" v-loading="tableloading">
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="routingCode" label="工艺路线编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="routingName" label="工艺路线名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="processCode" label="工序编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="processName" label="工序名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="num" label="退料数量" width="150" show-overflow-tooltip v-if="dataForm.receiveType=='order'" key="151"></el-table-column> -->
                <el-table-column prop="num" label="退料数量" width="170" key="112">
                  <template slot="header">
                    <span class="required">*</span>退料数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productlist.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                      <el-input v-model="scope.row.num" placeholder="请输入退料数量" :disabled="btnType == 'look'" maxlength="20" @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add' || btnType == 'copy'" :key="130">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDelyongliao(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-pages multiple ref="ComSelect-page1" @change="submitCustomerProduct" :datetype="datetype" title="选择生产订单" :renderTree="false" :listMethod="ordershengchanList" :listRequestObj="processMaterialListRequestObj" :searchList="ProductTableSearchList1" :elementShow="false" />
      <ComSelect-pages multiple ref="ComSelect-page2" @change="submitCustomerProduct2" :datetype="datetype1" title="选择工序物料" :renderTree="false" :tableItems="tableItemslist" :listMethod="ordercollectlList" :listRequestObj="processMaterialListRequestObj2" :searchList="ProductTableSearchList2" :elementShow="false" :picktype="false" />
      <ComSelect-pages multiple ref="ComSelect-page3" @change="submitCustomerProduct3" :datetype="datetype1" title="选择用料清单" :renderTree="false" :tableItems="tableItemslist3" :listMethod="ordermaterialList" :listRequestObj="processMaterialListRequestObj3" :searchList="[]" :elementShow="false" :picktype="false" />
    </div>
  </transition>
</template>

<script>
import { ordershengchanList, detailordershengchan, addWithdrawal, updateWithdrawal, detailWithdrawal, getWorkList, getMaterialList, ordercollectlList, ordermaterialList } from '@/api/productOrdes/index'
import ComSelectPages from './ComSelect-pages/index.vue'
export default {
  components: { ComSelectPages },
  data() {
    return {
      tableloading: false,
      dataFormlist: {
        productlist: []
      },
      datetype1: {
        start: 'startTime',
        end: 'endTime'
      },
      datetype: {
        start: 'deliveryStartDate',
        end: 'deliveryEndDate'
      },
      getMaterialList,
      ordercollectlList,
      ordermaterialList,
      //搜素条件列表
      ProductTableSearchList: [
        { prop: "orderNo", label: "生产单号", type: 'input' },
        { prop: "orderType", label: "订单类型", type: 'select', options: [{ label: '正常订单', value: 'normal' }, { label: '返工订单', value: 'rework' }] }
      ],
      ProductTableSearchList1: [
        { prop: "workOrderNo", label: "工作令号", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "data", label: "交货日期", type: 'date' },
        { prop: "orderNo", label: "订单号", type: 'input' },
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "blankProductsName", label: "下料产品", type: 'input' },
        { prop: "productDrawingNo", label: "产品图号", type: 'input' },
        { prop: "routingCode", label: "工艺路线编码", type: 'input' },
        { prop: "routingName", label: "工艺路线名称", type: 'input' },
        // { prop: "pickingStatus", label: "领料状态", type: 'select', options: [{ label: '已领料', value: 'picked' }, { label: '未领料', value: 'not_picked' }, { label: '领料中', value: 'picking' }] }
      ],
      ProductTableSearchList2: [
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "productDrawingNo", label: "产品图号", type: 'input' },
        { prop: "routingCode", label: "工艺路线编码", type: 'input' },
        { prop: "routingName", label: "工艺路线名称", type: 'input' },
        { prop: "processCode", label: "工序编码", type: 'input' },
        { prop: "processName", label: "工序名称", type: 'input' }
      ],
      tableItemslist3: [
        { prop: "productCode", label: "产品编码" },
        { prop: "productName", label: "产品名称" },
        { prop: "productDrawingNo", label: "产品图号" },
        { prop: "routingName", label: "工艺路线名称" },
        { prop: "processCode", label: "工序编码" },
        { prop: "processName", label: "工序名称" }
      ],
      tableItemslist: [
        { prop: "productCode", label: "产品编码" },
        { prop: "productName", label: "产品名称" },
        { prop: "productDrawingNo", label: "产品图号" },
        { prop: "routingCode", label: "工艺路线编码" },
        { prop: "routingName", label: "工艺路线名称" },
        { prop: "processCode", label: "工序编码" },
        { prop: "processName", label: "工序名称" },
        { prop: "mainUnit", label: "单位" },
        { prop: "inventoryQuantity", label: "库存数量" },
        { prop: "availableQuantity", label: "可用库存数量" }
      ],
      dataFormTwo: { productData: [] },
      personorderList: [
        { label: "订单物料", value: "order" },
        { label: "工序物料", value: "process" },
      ],
      ordershengchanList,
      orderVisible: false,
      listLoading: false,
      total: 0,
      dataForm: {
        businessCode: 'complete',
        receiveType: 'order',
        pickingStatus: 'not_back',
        demandType: '',
        notifyType: 'back',
        processId: '',
        productionOrderId: '',
        productionOrderNo: '',
        personId: '',
        operationDate: '',
        id: '',
        remark: ''
      },

      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      iszhi: false,
      productRules: {
        num: [{ required: true, trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
      },
      dataRule: {
        receiveType: [
          { required: true, message: '退料类型不能为空', trigger: 'change' }
        ],
        // personId: [
        //   { required: true, message: '退料人不能为空', trigger: 'change' }
        // ],
        operationDate: [
          { required: true, message: '退料时间不能为空', trigger: 'change' }
        ],
      },
      selectRows: [],
      materialType: "",
      title: "",
      processDialog: false,
      materialList: [],
      materialProductList: [],
      selectProcessArr: [],
      MaterialListRequestObj: {
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionOrderId: "",
      },
      processMaterialListRequestObj3: {},
      processMaterialListRequestObj2: {},
      processMaterialListRequestObj: {
        businessCode: 'complete',
        workOrderNo: '',
        orderNo: '',
        productCode: '',
        routingName: '',
        productDrawingNo: '',
        routingCode: '',
        productName: '',
        blankProductsName: '',
        orderStatus: 'normal',
        pickingStatus: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        pageNum: 1,
        pageSize: 20,
        orderItems:[
          {
              "asc": false,
              "column": ""
          },
          {
              "asc": false,
              "column": "create_time"
          }
        ]
      },
      orderTotal: 0,
      processTotal: 0,
    }
  },
  // created() {
  //   this.dataForm.orderDate = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  // },
  methods: {
    //退料类型切换
    receiveTypeaction() {
      this.dataFormTwo.productData = []
      this.dataFormlist.productlist = []
    },
    disproduceData(row) {
      return row.selectFlag
    },
    handleRowClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return
      const isSelected = this.$refs.workOrder.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    handleDBRowClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return
      const isSelected =
        this.$refs.workOrder.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    selectProcessFun(val) {
      val.forEach(row => {
        if (!row.selectFlag) {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      });
      this.selectProcessArr = val;
    },
    // 关闭
    closePro() {
      this.processDialog = false;
    },
    initData(type) {
      this.materialProductList = []
      if (type == 'order') {
        this.processMaterialListRequestObj = {
          businessCode: 'complete',
          workOrderNo: '',
          orderNo: '',
          productCode: '',
          routingName: '',
          pickingStatus: '',
          productDrawingNo: '',
          routingCode: '',
          productName: '',
          blankProductsName: '',
          orderStatus: 'normal',
          deliveryEndDate: '',
          deliveryStartDate: '',
          pageNum: 1,
          pageSize: 20,
          orderItems:[
            {
                "asc": false,
                "column": ""
            },
            {
                "asc": false,
                "column": "create_time"
            }
          ]
        }
        this.$refs['ComSelect-page1'].openDialog()
      } else {
        if (!this.dataFormTwo.productData.length) return this.$message.error("请选择生产订单")
        let a = this.dataFormTwo.productData.map(i => {
          return i.id
        })
        this.processMaterialListRequestObj2 = {
          processName: '',
          processCode: '',
          routingName: '',
          routingCode: '',
          productDrawingNo: '',
          productName: '',
          productCode: '',
          poIdList: a,
          pageNum: 1,
          pageSize: 20
        }
        this.$refs['ComSelect-page2'].openDialog()
      }
    },
    // 选择用料清单弹框
    openSeleceMater() {
      if (!this.dataFormTwo.productData.length) return this.$message.error("请选择生产订单")
      let a = this.dataFormTwo.productData.map(i => {
        return i.id
      })
      this.processMaterialListRequestObj3 = {
        poIdList: a,
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        endTime: ''
      }
      this.$refs['ComSelect-page3'].openDialog()
    },
    // 选择订单物料弹框
    openSeleceMaterDialog(type) {
      this.materialType = type
      this.materialProductList = []
      this.title = type == 'order' ? "选择订单物料" : "选择工序物料"
      // if (!this.dataForm.productionOrderId) return this.$message.error('请先选择生产订单')
      this.processDialog = true
      this.initData(type)
    },
    //数量单价不能为0
    calcValidate() {
      return (rule, value, callback) => {
        // let index = Number(rule.field.match(/\d+/)[0])
        // let list = this.dataFormTwo.productData
        let msg = `退料数量不能为'0'`
        if (value == 0) { callback(new Error(msg)), this.$message.error(msg) }
        // else if (Number(list[index].receivedQuantity) < Number(list[index].num)) {
        //   this.$message.error(`第${index+1}行退料数量不能大于已领数量`)
        //   callback(new Error(`第${index+1}行退料数量不能大于已领数量`));
        // } 
        else {
          callback()
        }
      };
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500,
        })
        return
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.productData.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
      this.dataFormlist.productlist = []
      // if (!this.dataFormTwo.productData.length) return
      // if (this.dataForm.receiveType == 'order') {
      //   let a = this.dataFormTwo.productData.map(i => {
      //     return i.id
      //   })
      //   let _data = {
      //     poIdList: a,
      //     pageNum: 1,
      //     pageSize: -1
      //   }
      //   this.tableloading = true
      //   ordermaterialList(_data).then(res => {
      //     this.tableloading = false
      //     res.data.records.forEach(item => {
      //       item.num = item.totalUsedQuantity
      //     })
      //     this.dataFormlist.productlist = res.data.records
      //   }).catch(() => {
      //     this.tableloading = false
      //   })
      // }
    },
    // 单个删除
    handleDel(data) {
      this.dataFormTwo.productData.splice(data.$index, 1)
      this.dataFormlist.productlist = []
    },
    handleDelyongliao(data){
      this.dataFormlist.productlist.splice(data.$index,1)
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    openSeleceproduction() {
      this.$refs['ComSelect-page'].openDialog()
    },
    handleClick() { },
    //工序物料
    submitCustomerProduct2(selectedIds, selectedList) {
      selectedList.map(i=>{
        if(!i.all.processId){
            i.all.routingCode = ''
            i.all.routingName = ''
            i.all.processCode = ''
            i.all.processName = ''
          }
      })
      if (this.dataFormlist.productlist.length) {
        let hasItemList = []
        selectedList.map(i => {
          const hasFlag = this.dataFormlist.productlist.some(item => {
            let flag = false
            if (i.all.id === item.id) { flag = true }
            return flag
          })
          if (hasFlag) { hasItemList.push(i.all.processName) }
          else { this.dataFormlist.productlist.push(i.all) }
          if (hasItemList.length) this.$message.error(`已经存在的工序：${hasItemList.join('、')}`)
        })
      }else{
        selectedList.map(item => {
          this.dataFormlist.productlist.push(item.all)
        })
      }
      this.$refs['ComSelect-page2'].isvisible()
    },
    //用料清单
    submitCustomerProduct3(selectedIds, selectedList) {
      let hasItemList = []
      selectedList.map(i => {
        const hasFlag = this.dataFormlist.productlist.some(item => {
          let flag = false
          if (i.all.id === item.id) { flag = true }
          return flag
        })
        if (hasFlag) { hasItemList.push(i.all.productName) }
        else { this.dataFormlist.productlist.push(i.all) }
        if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
      })
      this.$refs['ComSelect-page3'].isvisible()
    },
    //生产订单
    submitCustomerProduct(selectedIds, selectedList) {
      if(!selectedList.length) return this.$message.error(`请选择生产订单`)
      let hasItemList = []
      selectedList.map(i => {
        const hasFlag = this.dataFormTwo.productData.some(item => {
          let flag = false
          if (i.all.id === item.id) { flag = true }
          return flag
        })
        if (hasFlag) { hasItemList.push(i.all.orderNo) }
        else { this.dataFormTwo.productData.push(i.all) }
        if (hasItemList.length) this.$message.error(`已经存在的订单：${hasItemList.join('、')}`)
      })
      this.dataFormlist.productlist = []
      this.$refs['ComSelect-page1'].isvisible()
    },
    //退料数量
    watchnums(row, index) {
      console.log("主数量", row, index);
      if (!row.num) {
        return
      }
      row.num = row.num.replace(/[^0-9.]/g, '');

      if (row.num.length == 1 && row.num == '.') {
        // 如果第一位是小数点，则清空输入框
        row.num = '';
      } else if (row.num.length == 2 && row.num[0] == '0' && row.num[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + '.' + row.num.slice(1);
      } else if (row.num.length > 4 && row.num[0] == '0' && row.num[1] != '.') {
        row.num = row.num.substring(1, row.num.length)
      }
      if (row.num.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.num.length; i++) {
          const char = row.num[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }
        row.num = result;
        let arr = row.num.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.num = arr[0] + '.' + arr[1]
        console.log(999666, arr);
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
    },
    //退料人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('personId')
      })
      this.dataForm.personId = e
    },
    goBack() {
      this.$emit('close')
    },
    dateFormat(dateData) {
      // 转换为年月日
      // var date = new Date(dateData)
      // var y = date.getFullYear()
      // var m = date.getMonth() + 1
      // m = m < 10 ? ('0' + m) : m
      // var d = date.getDate()
      // d = d < 10 ? ('0' + d) : d
      // const time = y + '-' + m + '-' + d
      // return time
      // 转换为年月日时分秒
      var date = new Date(dateData);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var hours = date.getHours().toString().padStart(2, "0");
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        // end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.operationDate = this.dateFormat(end)
      }
      if (this.dataForm.id) {
        this.formLoading = true
        detailWithdrawal(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.dataForm = res.data.collect
            if (this.btnType == 'copy') {
              this.dataForm.id = ''
              this.formLoading = false
              this.dataFormlist.productlist = res.data.collectLineList
              this.dataFormTwo.productData = res.data.prodOrderList
              this.dataFormlist.productlist.forEach(item => {
                item.num = ''
                if(!item.processId){
                item.routingCode = ''
                item.routingName = ''
                item.processCode = ''
                item.processName = ''
              }
              })
              const end = new Date();//获取当前的日期
              // end.setTime(end.getTime())
              this.dataForm.operationDate = this.dateFormat(end)
            } else {
              this.formLoading = false
              this.dataFormlist.productlist = res.data.collectLineList.map(item=>{
                if(!item.processId){
                  item.routingCode = ''
                  item.routingName = ''
                  item.processCode = ''
                  item.processName = ''
                }
                return item
              })
              this.dataFormTwo.productData = res.data.prodOrderList
            }
          })
        }).catch(() => {
          this.formLoading = false
        })
      }
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.dataFormlist.productlist.length) {
          this.$message({
            message: '退料清单不能为空',
            type: 'error',
            duration: 1500,
          })
          return
        }
        if (this.btnType == 'copy') {
          delete this.dataForm.inspectionStatus;
        }
        this.dataFormlist.productlist.forEach((item, index) => {
          if (!item.num) {
            this.iszhi = true
            this.$message({
              message: `第${index + 1}行退料数量不能为空`,
              type: 'error',
              duration: 1500,
            })
          }
        })
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            this.dataForm.documentStatus = value
            let _a = this.dataFormTwo.productData.map(item => {
              return { productionOrderId: item.id }
            })
            let obj = {
              collect: this.dataForm,
              materialProdOrderList: _a,
              collectLineList: []
            }
            this.dataFormlist.productlist.map((item1) => {
              let dep = { ...item1 }
              dep.productsId = item1.productsId ? item1.productsId : item1.productId
              dep.id = ''
              dep.outboundQuantity = 0
              obj.collectLineList.push(dep)
            })
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = updateWithdrawal
            } else if (this.btnType == 'add' || this.btnType == 'copy') {
              obj.collect.pickingStatus = 'not_back'
              formMethod = addWithdrawal
            }
            formMethod(obj).then(res => {
              console.log(res);
              let msg = "";
              if (formMethod == addWithdrawal) {
                msg = "新建成功"
              } else if (value == 'draft') {
                msg = "保存成功"
              } else if (value == 'submit') {
                msg = '提交成功'
              }
              this.$message({
                message: msg,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.btnLoading = false
                  this.$emit('close', true)
                }
              })
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>