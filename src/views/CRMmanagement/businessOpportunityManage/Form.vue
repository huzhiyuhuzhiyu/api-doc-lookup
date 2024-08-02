<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑商机' : btntype == 'add' ? '新建商机' : '查看商机'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="商机名称" prop="businessName">
                        <el-input v-model="dataForm.businessName" placeholder="请输入商机名称" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="负责人" prop="ownerUserId">
                        <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="客户名称" prop="customerName">
                        <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.customerName" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getPartnerList" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="btntype === 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="商机金额" prop="money">
                        <el-input v-model="dataForm.money" placeholder="请输入商机金额" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="预计成交日期" prop="dealDate">
                        <el-date-picker v-model="dataForm.dealDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择预计成交日期" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="下次联系时间" prop="nextTime">
                        <el-date-picker v-model="dataForm.nextTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择下次联系时间" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="productInfo">
                <div v-if="btntype !== 'look'" key="11">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btntype == 'look' ? true : false" @click="openSeleceProductDialog()">选择产品</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btntype == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" ref="productForm" class="data-form" v-loading="productVisible">
                  <el-table class="TableForm table" ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btntype != 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="2" />
                    <el-table-column prop="productName" label="产品名称" width="180" show-overflow-tooltip />
                    <el-table-column prop="productUnit" label="单位(主)" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="purchasePrice" label="价格" width="160" show-overflow-tooltip />
                    <el-table-column prop="costPrice" label="成本价" width="160" show-overflow-tooltip />
                    <el-table-column prop="num" label="数量" width="160">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                          <el-input :title="scope.row.num" v-model="scope.row.num" placeholder="请输入数量" :disabled="btntype == 'look'" maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="price" label="售价" width="160">
                      <template slot="header">
                        <span class="required">*</span>售价
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'price'" :rules='productRules.price'>
                          <el-input v-model="scope.row.price" placeholder="请输入售价" :disabled="btntype == 'look'" maxlength="20" @input="watchPrice(scope.row, scope.$index)" style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="discount" label="折扣(%)" width="160">
                      <template slot="header">
                        <span class="required">*</span>折扣(%)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'discount'" :rules='productRules.discount'>
                          <el-input v-model="scope.row.discount" placeholder="请输入折扣" :disabled="btntype == 'look'" maxlength="20" @input="changeTaxRate(scope.row, scope.$index)" style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalcostPrice" label="成本价合计" width="160" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="costPriceSum" label="合计" width="160" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="230">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btntype == 'look' ? true : false" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btntype != 'look'" key="111">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
                <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;display:flex;justify-content: space-between;" class="text">
                  <div><label>整单折扣（%）：</label><el-input v-model="dataForm.orderdiscount" placeholder="请输入折扣" :disabled="btntype == 'look'" maxlength="20" @input="Wholeorderdiscount" style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input></div>
                  <div>
                    <span style="font-weight:500;margin-right:10px">总主数量：{{ totalNum }}</span>
                    <span style="font-weight:500;margin-right:10px">总金额：{{ totalAmount }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" dialogTitle="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProducts" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>

<script>
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表
import { getCategoryTrees } from '@/api/basicData/index'
import { getPartnerList } from '@/api/customerManagement/index'
import { addcrmBusiness, updatecrmBusiness, detailcrmBusiness } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      isattachmentswitch: '1',
      contactsIdList: [],
      getcategoryTrees,
      // 客户列表
      partnerRequestObj: {
        taxId: "",
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        customerStatus: 'private_sea',
        totalRowFlag: false,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      // 客户列表字段
      partnerTableItems: [
        { prop: 'code', label: '客户编码' },
        { prop: 'name', label: '客户名称' },
        { prop: 'taxId', label: '税号' },
      ],
      // 客户搜索条件
      partnerSearchList: [
        { prop: 'code', label: '客户编码', type: 'input' },
        { prop: 'name', label: '客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' }
      ],
      selectRows: [],
      taxRateList: [],
      productRules: {
        // 数量
        num: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '数量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 售价（含税）
        price: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["售价不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '售价必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [18, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：售价(含税)${errMsg}`) }] }), trigger: 'blur' }
        ],
        discount: [
          { required: true, trigger: 'change' },
        ]
      },
      productVisible: false,
      // totalAmount: 0,
      ProductMethodArr: { method: getCategoryTrees, requestObj: { classAttribute: "" } },
      ProductTableItems: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'mainUnit', label: '单位(主)' },
      ],
      ProductTableSearchList: [
        { prop: "code", label: "产品名称", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "productDrawingNo", label: "品名规格", type: 'input' },
      ],
      ProductListRequestObj: {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        productStatus: 'enable',
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      getProducts,
      getCategoryTrees,
      dataFormTwo: {
        lines: []
      },
      activeNames: ["basicInfo", "productInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getPartnerList,
      activeName: "jcInfo",
      formLoading: false,
      btnLoading: false,
      dataForm: {
        businessName: '',
        remark: '',
        ownerUserId: '',
        customerName: '',
        customerId: '',
        money: '',
        dealDate: '',
        nextTime: ''
      },
      btntype: false,
      dataRule: {
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请选择客户', trigger: 'blur' },
        ],
        businessName: [
          { required: true, message: '请输入商机名称', trigger: 'blur' },
        ]
      },
    }
  },
  computed: {
    totalNum: function () {
      var totalNum = 0;
      for (var i = 0; i < this.dataFormTwo.lines.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.lines[i].num*1])
      }
      return totalNum
    },
    totalAmount:function(){
      var totalPrice = 0;
      for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
        let item = this.dataFormTwo.lines[a]
        totalPrice = this.jnpf.math('add', [totalPrice, item.costPriceSum*1])
      }
      totalPrice = this.jnpf.numberFormat(totalPrice * (1 - (this.dataForm.orderdiscount * 1 / 100)), 4)
      this.dataForm.money = totalPrice
      return totalPrice
    }
  },
  methods: {
    // 客户分类节点点击
    PartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.id
      return listQuery
    },
    // 客户选框传值
    partnerChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('customerName') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.customerName = data[0].all.name
        this.dataForm.customerId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.customerId = ""
        this.dataForm.customerName = ""
      }
    },
    //批量删除
    batchDelete() {
      if (!this.selectRows.length) return this.$message.error('请选择要删除的产品')
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.lines.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.lines.splice(index, 1); // 从tableData中删除选中的行
        }
      }
    },
    handleDel(row) {
      this.dataFormTwo.lines.splice(row.$index, 1)
    },
    Wholeorderdiscount() {
      // let c = 0
      // for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
      //   let item = this.dataFormTwo.lines[a]
      //   c = this.jnpf.math('add', [c, item.costPriceSum])
      // }
      // this.totalAmount = this.jnpf.numberFormat(c * (1 - (this.dataForm.orderdiscount * 1 / 100)), 4)
      // this.dataForm.money = this.totalAmount
    },
    changeTaxRate(row, index) {
      let productArr = [...this.dataFormTwo.lines]
      productArr[index].excludingTaxUnitPrice = this.jnpf.numberFormat(row.price * (1 - (row.discount * 1 / 100)), 4)
      productArr[index].costPriceSum = this.jnpf.numberFormat((row.excludingTaxUnitPrice * row.num), 4)
      productArr[index].totalTaxAmount = this.jnpf.numberFormat((row.amounts * 1 - row.costPriceSum), 4)
      this.dataFormTwo.lines = productArr
      // var totalPrice = 0;
      // for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
      //   let item = this.dataFormTwo.lines[a]
      //   console.log("item", item.amounts);
      //   totalPrice = this.jnpf.math('add', [totalPrice, item.costPriceSum])
      // }
      // this.totalAmount = totalPrice
      // this.dataForm.money = this.totalAmount
    },
    // 监听售价(含税)输入
    watchPrice(row, index) {
      row.price = row.price ? row.price.replace(/[^\d.]/g, '') : ''
      // 售价处理
      if (row.price.length == 1 && row.price == '.') {
        // 如果第一位是小数点，则清空输入框
        row.price = '';
      } else if (row.price.length == 2 && row.price[0] == '0' && row.price[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.price = row.price.slice(0, 1) + '.' + row.price.slice(1);
      } else if (row.price.length > 2 && row.price[0] == '0' && row.price[1] != '.') {
        row.price = row.price.substring(1, row.price.length)
      }
      if (row.price.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.price.length; i++) {
          const char = row.price[i];
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
        row.price = result;
        let arr = row.price.split('.')
        if (arr[0].length > 12) {
          arr[0] = arr[0].substring(0, 12)
        }
        if (arr[1].length > 6) {
          arr[1] = arr[1].substring(0, 6)
        }
        row.price = arr[0] + '.' + arr[1]
      } else {
        if (row.price.length > 20) {
          row.price = row.price.substring(0, 20);
        }
      }
      if (row.price && row.price != '0') {
        let c = this.jnpf.numberFormat((100 - (row.purchasePrice / row.price)), 4)
        row.discount = row.purchasePrice && c ? c : 0
        let b = this.jnpf.numberFormat((row.price * (1 - row.discount / 100)), 4)
        row.excludingTaxUnitPrice = b ? b : 0
      } else {
        row.excludingTaxUnitPrice = ''
        row.discount = ''
      }

      if (!row.num || !row.price) {
        row.amounts = ''
        row.totalTaxAmount = ''
        this.dataForm.money = 0
      } else {
        let a = this.jnpf.numberFormat((row.price * row.num), 6)
        row.amounts = a ? a : '' // 含税金额
      }
      // if (this.dataFormTwo.lines.length == 1 && (!row.num || !row.price)) {
      //   this.totalAmount = 0
      // }
      if (row.excludingTaxUnitPrice && row.num) {
        let c = this.jnpf.numberFormat((row.excludingTaxUnitPrice * row.num), 6)
        row.costPriceSum = c ? c : ''
      } else {
        row.costPriceSum = ''
      }
      if (row.costPriceSum && row.amounts) { // 税额计算
        let d = this.jnpf.numberFormat((row.amounts * 1 - row.costPriceSum * 1), 6)
        row.totalTaxAmount = d ? d : 0
      }
      // var totalPrice = 0;
      // for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
      //   let item = this.dataFormTwo.lines[a]

      //   totalPrice = this.jnpf.math('add', [totalPrice, item.costPriceSum])
      // }
      // this.totalAmount = totalPrice
      // this.dataForm.money = this.totalAmount
    },
    // 监听主数量输入
    watchnums(row, index) {
      console.log("ROW", row, index);
      // 数量处理
      row.num = row.num ? row.num.replace(/[^\d.]/g, '') : ''
      if (row.num.length == 1 && row.num == '.') {
        // 如果第一位是小数点，则清空输入框
        row.num = '';
      } else if (row.num.length == 2 && row.num[0] == '0' && row.num[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + '.' + row.num.slice(1);
      } else if (row.num.length > 2 && row.num[0] == '0' && row.num[1] != '.') {
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
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
      if (row.price && row.price != '0') {
        let b = this.jnpf.numberFormat((row.price * (1 - row.discount / 100)), 4)
        row.excludingTaxUnitPrice = b ? b : 0
      } else {
        row.excludingTaxUnitPrice = ''
      }

      if (!row.num || !row.price) {
        row.amounts = ''
        row.totalTaxAmount = ''
        this.dataForm.money = 0
      } else {
        let a = this.jnpf.numberFormat((row.price * row.num), 6)
        row.amounts = a ? a : '' // 含税金额
      }
      if (row.excludingTaxUnitPrice && row.num) {
        let c = this.jnpf.numberFormat((row.excludingTaxUnitPrice * row.num), 6)
        row.costPriceSum = c ? c : ''
      } else {
        row.costPriceSum = ''
      }
      if (row.costPriceSum && row.amounts) { // 税额计算
        let d = this.jnpf.numberFormat((row.amounts * 1 - row.costPriceSum * 1), 6)
        row.totalTaxAmount = d ? d : 0
      }
      if (row.costPrice && row.num) {
        let c = this.jnpf.numberFormat((row.costPrice * row.num), 6)
        row.totalcostPrice = c ? c : ''
      } else {
        row.totalcostPrice = ''
      }
      // var totalPrice = 0;
      // for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
      //   let item = this.dataFormTwo.lines[a]
      //   totalPrice = this.jnpf.math('add', [totalPrice, item.costPriceSum])
      // }
      // this.totalAmount = totalPrice
      // this.dataForm.money = this.totalAmount
    },
    //选择产品
    submitCustomerProduct(val, data,) {
      this.productVisible = false
      data.map(i => {
        const item = i.all
        this.dataFormTwo.lines.push({
          productId: item.id,
          productName: item.name,
          productUnit: item.mainUnit,
          purchasePrice: item.purchasePrice,
          costPrice: item.costPrice,
          id: '',
          num: '',
          price: '',
          discount: '',
          totalcostPrice: '',
          costPriceSum: '',
          remark: '',
        })
      });
    },
    //打开产品弹框
    openSeleceProductDialog() {
      this.$refs["ComSelect-page"].openDialog()
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    //签约人
    hangleSelectSales1(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("ownerDeptId") });
    },
    //负责人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("ownerUserId") });
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.btntype = type
      this.dataForm.id = id || ''
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmBusiness(this.dataForm.id).then(res => {
            this.dataForm = res.data.business
            this.dataFormTwo.lines = res.data.lines
            this.Wholeorderdiscount()
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      // 校验子表
      Promise.all([this.$refs['dataForm'].validate(), this.$refs['productForm'].validate()]).then(() => {
        this.btnLoading = true;
        let obj = {
          business: this.dataForm,
          lines: this.dataFormTwo.lines
        }
        let formMethod = this.dataForm.id ? updatecrmBusiness(obj) : addcrmBusiness(obj);
        formMethod.then(res => {
          let msg = ""
          if (this.btntype == "edit") {
            msg = '修改成功'
          } else {
            msg = '新建成功'
          }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      }).catch((error) => {

      })
    }
  }
}
</script>
<style scoped lang="scss">
.required {
  color: red;
  margin-right: 4px;
}
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
