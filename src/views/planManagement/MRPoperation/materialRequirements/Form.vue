<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="'替代产品'" />
        <div class="options">
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="handleConfirm()"
          >
            提交</el-button
          >
          <el-button @click="goBack">{{ $t("common.cancelButton") }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="替代件信息" name="orderInfo">
            <!-- <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div> -->
            <el-form
              ref="dataForm"
              :model="dataForm"
              :rules="dataRule"
              label-width="160px"
              label-position="top"
            >
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="原产品名称" prop="productName">
                    <el-input
                      v-model="dataForm.productName"
                      placeholder="请输入原产品名称"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="新产品名称" prop="replaceProductsId">
                    <el-select
                      v-model="dataForm.replaceProductsId"
                      placeholder="请选择新产品"
                      style="width: 100%"
                      :disabled="btnType == 'look' ? true : false"
                      @change="selectProduct"
                    >
                      <el-option
                        v-for="(item, index) in replaceProductsNameList"
                        :key="index"
                        :label="item.nname"
                        :value="item.alternativeProductId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="更换理由" prop="reasonReplace">
                    <el-input
                      v-model="dataForm.reasonReplace"
                      placeholder="请输入更换理由"
                      :disabled="btnType == 'look' ? true : false"
                      maxlength="20"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="需求数量" prop="demandQuantity">
                    <el-input
                      v-model="dataForm.demandQuantity"
                      placeholder="请输入需求数量"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="安全库存" prop="safeInventory">
                    <el-input
                      v-model="dataForm.safeInventory"
                      placeholder="请输入安全库存"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="库存数量" prop="inventoryQuantity">
                    <el-input
                      v-model="dataForm.inventoryQuantity"
                      placeholder="请输入库存数量"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="总在制数量" prop="totalInProcessQuantity">
                    <el-input v-model="dataForm.totalInProcessQuantity" placeholder="请输入总在制数量" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="在制数量" prop="inProcessQuantity">
                    <el-input v-model="dataForm.inProcessQuantity" placeholder="请输入在制数量" disabled />
                  </el-form-item>
                </el-col> -->
                <el-col :sm="6" :xs="24">
                  <el-form-item label="可用库存数量" prop="availableQuantity">
                    <el-input
                      v-model="dataForm.availableQuantity"
                      placeholder="请输入可用库存数量"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="采购数量" prop="outputQuantity">
                    <el-input v-model="dataForm.outputQuantity" placeholder="请输入在制数量"
                      :disabled="btnType == 'look' ? true : false" maxlength="20" />
                  </el-form-item>
                </el-col> -->
                <el-col :sm="6" :xs="24">
                  <el-form-item
                    label="夹肩长"
                    prop="shoulderLength"
                    v-if="
                      dataForm.productType == 'pt004' ||
                      dataForm.productType == 'pt006'
                    "
                  >
                    <el-input
                      v-model="dataForm.shoulderLength"
                      placeholder="请输入夹肩长"
                      :disabled="btnType == 'look' ? true : false"
                      maxlength="20"
                      @blur="
                        handleChangeshoulderLength(dataForm.shoulderLength)
                      "
                      @input="handleInput1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item
                    label="扣压量"
                    prop="withhold"
                    v-if="
                      dataForm.productType == 'pt004' ||
                      dataForm.productType == 'pt006'
                    "
                  >
                    <el-input
                      v-model="dataForm.withhold"
                      placeholder="请输入扣压量"
                      :disabled="btnType == 'look' ? true : false"
                      maxlength="20"
                      @blur="handleChangewithhold(dataForm.withhold)"
                      @input="handleInput2"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :sm="6"
                  :xs="24"
                  v-if="
                    dataForm.productType == 'pt004' ||
                    dataForm.productType == 'pt006'
                  "
                >
                  <el-form-item label="扣压伸长量" prop="compressionElongation">
                    <el-input
                      v-model="dataForm.compressionElongation"
                      placeholder="请输入扣压伸长量"
                      :disabled="btnType == 'look' ? true : false"
                      maxlength="20"
                      @blur="
                        handleChangecompressionElongation(
                          dataForm.compressionElongation
                        )
                      "
                      @input="handleInput3"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :sm="6"
                  :xs="24"
                  v-if="
                    dataForm.productType == 'pt004' ||
                    dataForm.productType == 'pt006'
                  "
                  r
                >
                  <el-form-item label="软管净长" prop="hoseLength">
                    <el-input
                      v-model="dataForm.hoseLength"
                      placeholder="请输入软管净长"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex"> </el-tab-pane>
          <el-tab-pane label="审批流" name="approval"> </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  getMRPInfo,
  demandReplace,
  gethoseLength,
} from "@/api/calculationList/MRPOperation";
import { getBimProductData } from "@/api/basicData";
export default {
  props: {
    customList: {
      require: true,
      type: Array,
    },
  },
  data() {
    return {
      replaceProductsNameList: [],
      refreshTree: true,
      allProVisible: false,
      totalNum: 0,
      totalAmount: 0,

      organizeIdTrees: [],

      ProductTableItems: [
        { prop: "code", label: "产品编码", fixed: "left" },
        { prop: "name", label: "产品名称", fixed: "left" },
        { prop: "drawingNo", label: "图号", minWidth: 0 },
        { prop: "spec", label: "规格型号", minWidth: 0 },
        { prop: "classAttributeText", label: "产品分类", minWidth: 0 },
      ],
      attributeLines: [],
      productData: [],

      validateNumber: (rule, value, callback) => {
        const regex = /^\d{0,10}(\.\d{0,2})?$/; // 正则表达式，限制整数最多6位，小数最多4位
        if (!value || regex.test(value)) {
          callback(); // 验证通过
        } else {
          callback(new Error("请输入最多6位整数和最多4位小数")); // 验证失败
        }
      },

      listLoading: false,
      total: 0,
      treeData: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },
      defaultProps: {
        children: "childrenList",
        label: "name",
      },
      index: null,
      expands: true,
      customerVisible: false,
      paymentMethodList: [],
      paymentCycleList: [],
      activeNameDetail: "productInfo",
      coverNum: "", //用于计算
      btnType: undefined,
      bimVehicle: [],
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      contactsList: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: "",
      },
      activeName: "orderInfo",
      nodeId: -1,
      visible: false,
      btnLoading: false,
      formLoading: false,
      replaceProductsName: "",
      dataForm: {
        productName: "",
        productsId: "",
        replaceProductsId: "",
        reasonReplace: "",
        demandQuantity: "",
        safeInventory: "",
        inventoryQuantity: "",
        totalInProcessQuantity: "",
        inProcessQuantity: "",
        availableQuantity: "",
        outputQuantity: "",
        shoulderLength: "",
        withhold: "",
        compressionElongation: "",
        hoseLength: "",
        id: "",
        productType: "",
      },
      defaultAddress: "",
      parentId: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      dataRule: {
        replaceProductsId: [
          { required: true, message: "新产品不能为空", trigger: "blur" },
        ],
        reasonReplace: [
          { required: true, message: "请输入更换理由", trigger: "blur" },
        ],
        shoulderLength: [
          { required: true, message: "请输入夹肩长", trigger: "blur" },
          {
            validator: this.formValidate({
              type: "decimal",
              params: [
                10,
                2,
                false,
                (errMsg) => {
                  this.$message.error(`夹肩长${errMsg}`);
                },
              ],
            }),
            trigger: "blur",
          },
        ],
        compressionElongation: [
          { required: true, message: "请输入扣压伸长量", trigger: "blur" },
          {
            validator: this.formValidate({
              type: "decimal",
              params: [
                10,
                2,
                false,
                (errMsg) => {
                  this.$message.error(`扣压伸长量${errMsg}`);
                },
              ],
            }),
            trigger: "blur",
          },
        ],
        withhold: [
          { required: true, message: "请输入扣压量", trigger: "blur" },
          {
            validator: this.formValidate({
              type: "decimal",
              params: [
                10,
                2,
                false,
                (errMsg) => {
                  this.$message.error(`扣压量${errMsg}`);
                },
              ],
            }),
            trigger: "blur",
          },
        ],
      },
      treeLoading: false,
      productArr: [],
      ProductListRequestObj: {
        classAttributeList: [
          "raw_material",
          "semi_finished",
          "finish_product",
          "accessories",
        ],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        queryType: 1,
        code: "",
        name: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      },
      requserForm: {
        compressionElongation: "",
        materialDemandId: "",
        orderNo: "",
        productsId: "",
        replaceProductsId: "",
        withhold: "",
        joint1ProductsId: "",
        shoulderLength1: "",
        joint2ProductsId: "",
        shoulderLength2: "",
      },
      jointList:[],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 修改夹肩长
    handleChangeshoulderLength(e) {
      console.log("夹肩长", e);
      this.dataForm.shoulderLength = e;
      this.jointList[0].shoulderLength = e;
      this.gethoseLength()
    },
    handleInput1() {
      this.dataForm.shoulderLength = this.dataForm.shoulderLength.replace(/[^0-9.]/g, "" );
    },
    // 修改扣压量
    handleChangewithhold(e) {
      console.log("扣压量 ", e);
      this.dataForm.withhold = e;
      this.gethoseLength()
    },
    handleInput2() {
      this.dataForm.withhold = this.dataForm.withhold.replace(/[^0-9.]/g, "");
    },
    // 修改扣押伸长量
    handleChangecompressionElongation(e) {
      console.log("扣押伸长量", e);
      this.dataForm.compressionElongation = e;
      this.gethoseLength()


    },
    handleInput3() {
      this.dataForm.compressionElongation =
        this.dataForm.compressionElongation.replace(/[^0-9.]/g, "");
    },
    selectProduct(val) {
      console.log(val);
      this.dataForm.replaceProductsId = val;
      console.log(this.replaceProductsName);
    },
    goBack() {
      this.$emit("close");
    },
    search() {
      this.form.pageNum = 1;
      this.initData();
    },
    gethoseLength() {
      let obj = {
        compressionElongation: this.dataForm.compressionElongation,
        materialDemandId: this.dataForm.id,
        orderNo: this.dataForm.planNo,
        productsId: this.dataForm.productsId,
        replaceProductsId: this.dataForm.replaceProductsId
          ? this.dataForm.replaceProductsId
          : "",
        withhold: this.dataForm.withhold,
        joint1ProductsId: this.jointList[0] ? this.jointList[0].productsId : "",
        shoulderLength1: this.jointList[0]
          ? this.jointList[0].shoulderLength
          : "",
        joint2ProductsId: this.jointList[1] ? this.jointList[1].productsId : "",
        shoulderLength2: this.jointList[1]
          ? this.jointList[1].shoulderLength
          : "",
      };
      console.log("obj", obj);
      gethoseLength(obj).then((response) => {
        console.log("response", response);
        this.dataForm.hoseLength = response.data;
      });
    },

    reset() {
      this.form = {
        code: "",
        taxId: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      };
      this.getcategoryTree();
    },
    // 切换table
    handleClick(tab, event) {},

    init(id, btnType) {
      console.log(id, btnType);
      this.dataForm.id = id || "";
      this.btnType = btnType;

      if (this.dataForm.id) {
        getMRPInfo(this.dataForm.id).then((res) => {
          console.log("详情", res);

          this.$nextTick(() => {
            this.dataForm = res.data.demand
            console.log("143",res.data);
            this.jointList = res.data.jointList;
           
              this.dataForm.availableQuantity = this.dataForm.availableQuantity? this.dataForm.availableQuantity: 0
            
              this.dataForm.inventoryQuantity = this.dataForm.inventoryQuantity
                ? this.dataForm.inventoryQuantity
                : 0,
              this.dataForm.safeInventory = this.dataForm.safeInventory
                ? this.dataForm.safeInventory
                : 0,
              this.dataForm.demandQuantity = this.dataForm.demandQuantity
                ? this.dataForm.demandQuantity
                : 0,
              this.dataForm.compressionElongation =
                res.data.hose.compressionElongation;
            this.dataForm.withhold = res.data.sleeve.withhold;
            getBimProductData({ code: this.dataForm.productCode }).then(
              (res) => {
                console.log(res);
                this.replaceProductsNameList = res.data.records;
              }
            );
            if (
              res.data.demand.productType == "pt004" ||
              res.data.demand.productType == "pt006"
            ) {
             this.gethoseLength()
            }
          });
        });
      }
    },
    goBack() {
      this.$emit("close");
      console.log("cccc");
    },

    handleConfirm(value) {
      console.log(this.dataForm);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // this.btnLoading = true
          let obj = {
            compressionElongation: this.dataForm.compressionElongation,
            hoseLength: this.dataForm.hoseLength,
            productsId: this.dataForm.productsId,
            reasonReplace: this.dataForm.reasonReplace,
            replaceProductsId: this.dataForm.replaceProductsId,
            withhold: this.dataForm.withhold,
            materialDemandId: this.dataForm.id,
          };

          demandReplace(obj)
            .then((res) => {
              this.$message({
                message: "提交成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.btnLoading = false;
                  this.$emit("close", true);
                },
              });
            })
            .catch(() => {
              this.btnLoading = false;
            });
        }
      });
    },
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return "";
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },
  },
};
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

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
::v-deep.el-tabs__header {
  padding-left: 0 !important;
}
</style>