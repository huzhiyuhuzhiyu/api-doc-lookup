<template>
  <div class="TableForm_main">
    <div v-if="openMode !== '只读'" class="TableForm_title">
      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">选择产品</el-button>
      <span>|</span>

      <el-button type="text" class="topButton" icon="el-icon-plus" @click="importProduct">导入产品</el-button>
      <span>|</span>

      <!-- <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button>
      <span>|</span> -->

      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
      <span>|</span>
    </div>

    <el-form :model="JNPFColTableData" ref="main" class="tableContainer">
      <el-table v-if="tableVisible" ref="table" class="TableForm table" :data="JNPFColTableData.data"
        v-bind="customStyleData" hasNO fixedNO hasC @selection-change="handleSelectionChange" border
        :summary-method="getSummaries" show-summary>
        <el-table-column type="selection" width="60" :fixed="hasFixed ? 'left' : false" align="center"
          v-if="openMode != '只读'" key="1" />
        <el-table-column type="index" width="60" label="序号" align="center" :fixed="hasFixed ? 'left' : false" />

        <template v-for="item in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
            :show-overflow-tooltip="item.type === 'view'">
            <template slot="header" v-if="isRequire(item)">
              <span class="required">*</span>{{ item.label }}
            </template>
            <template slot-scope="scope">
              <FormItem :item="item" :lineItem="JNPFColTableData.data[scope.$index]"
                :value="JNPFColTableData.data[scope.$index][scope.column.property]"
                @input="handleInput($event, scope.column.property, scope.$index)" :ref="scope.column.property"
                :openMode="openMode" :scope="scope" :paramsObj="{ scope }" />
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" width="140" :fixed="hasFixed ? 'right' : false">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="openMode === '只读'"
              @click="deleteth(scope)">删除</el-button>
            <el-button size="mini" type="text" @click="handlerOpenSource(scope)">货位设置</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="40" v-if="customStyle">
          <template slot="header">
            <el-tooltip content="切换展示模式" placement="top">
              <el-link icon="el-icon-sort" :underline="false" @click="switchStyle" />
            </el-tooltip>
          </template>
        </el-table-column>

        <div class="noDataTip" v-if="JNPFColTableData.data.length === 0">暂无数据</div>
      </el-table>
    </el-form>

    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
      :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
      :searchList="ProductTableSearchList" :elementShow="false" multiple />


    <!-- 导入产品 -->
    <!-- <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" /> -->

    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib"   lock-scroll
      class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" :drag="dragFlag" :on-remove="handleRemove"  :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
            icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormItem from "@/components/JNPF-col-table/item"
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { mapState } from 'vuex'
import { getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
import { warehouseUploadLine } from '@/api/warehouseManagement/inventory'
export default {
  components: { FormItem },
  name: 'TableForm-product',
  data() {
    return {
      uploadVisib: false,
      selectedList: [],
      JNPFColTableData: {
        data: this.value
      },
      dragFlag:true,
      customStyleData: {},
      tableVisible: true,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: [],
        productCategoryId: "",
        productCategoryCode:"",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeText', label: '产品分类' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      file:{},
    }
  },
  props: {
    sourceTypeInfo: {},
    value: {
      type: Array,
      required: true
    },
    tableItems: {
      type: Array,
      required: true
    },
    openMode: {
      type: String,
      default: '新建'
    },
    warehouseId: {},
    sourceType: {},
    customerInfo: {},
    customStyle: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler: function (newValue) {
        this.JNPFColTableData.data = newValue;
      },
      // deep: true
    }
  },
  computed: {
    hasFixed() {
      return true
      return this.tableItems.some(item => item.hasOwnProperty('fixed'))
    },
    addMethod() {
      return Boolean(this.$listeners.addth)
    },
    delMethod() {
      return Boolean(this.$listeners.deleteth)
    },
    ...mapState('user', ['token']),
    formLoading: {
      get() {
        return false
      },
      set(val) {
        this.$emit('changeLoading', val)
      }
    }
  },
  mounted() {
    this.setDefaultValue();
    this.switchStyle('onresize')
    console.log(this.customerInfo);
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    handleFileChange(file) {
      console.log("所选文件:", file);
      this.file=file.raw
    },
    submit(){
      console.log(this.fileList);
      this.UploadProduct(this.file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) return sums[index] = '合计'
        else if (!['num',
          'deputyNum',
          'deliveryQuantity',
          'deputyDeliveryQuantity',
          'workOrderQuantity',
          'completedQuantity',
          'totalAmount',
          'receivedQuantity'].includes(column.property)) return sums[index] = ' '
        // else if (!column.property || !(/num|.*quantity.*/i.test(column.property))) return sums[index] = ' '
        const values = data.map(item => Number(item[column.property]));
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return this.jnpf.math('add', [prev, curr])
          } else {
            return prev;
          }
        }, 0);
      })
      // 防止合计行不显示的解决方案
      clearTimeout(this.timeoutDoLayout)
      this.timeoutDoLayout = setTimeout(() => {
        this.$refs.table && this.$refs.table.doLayout()
      }, 100);
      return sums;
    },
    handleInput(val, key, index) {
      this.$emit('input', index, key, val);
    },
    setDefaultValue() {
      const formDataList = [...this.value]
      formDataList.forEach((item, index) => {
        this.tableItems.forEach((item2, index2) => {
          const { prop, value } = item2;
          if ((item[prop] === undefined || item[prop] === "" || item[prop] === null) && value != undefined) {
            item[prop] = value;
          }
        })
      })
      this.$emit('input', [...formDataList]);
    },
    handlerOpenSource(scope) {
      if (!this.warehouseId) {
        this.$message.warning("请先选择入库仓库")
      } else if (!scope.row.num || scope.row.num == '0') {
        this.$message.error("当前行数量(主)不能为0")
      } else if (!scope.row.deputyNum || scope.row.deputyNum == '0') {
        this.$message.error("当前行数量(副)不能为0")
      } else this.$emit('openSide', scope)
    },
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    isRequire(data) {
      return data.hasOwnProperty('itemRules') && data.itemRules.some(item => item.required === true)
    },
    addth(selectedIds, selectedList) {
      selectedList.forEach(item => {
        item.all.productId = item.id
        item.all.productName = item.name
      })
      let list = selectedList.map(item => item.all)
      this.$emit('addth', list)
    },
    deleteth(scope) {
      this.$emit('deleteth', scope)
    },
    batchDelete() {
      if (!this.selectedList.length) {
        this.$message.error("请选择你要删除的数据")
        return
      }
      let tempData = [...this.value]
      for (let i = 0; i < this.selectedList.length; i++) {
        const row = this.selectedList[i];
        const index = tempData.indexOf(row);
        if (index > -1) {
          tempData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectedList = []  // 清空选中的行的数据
      this.$emit('input', [...tempData]);
    },
    handleSelectionChange(data) {
      this.selectedList = data
    },
    async switchStyle(type) {
      await this.$nextTick();
      const mainRegion = this.$parent.$refs.main // 可用区域
      if (JSON.stringify(this.customStyleData) === "{}" || type === 'onresize') {
        if (type !== 'onresize') this.$message.success('适配模式')
        // 获取可用区域的高度
        const mainHeight = mainRegion.clientHeight;
        // 其他同级组件占用高度
        let bortherHeight = 0
        const bortherItems = mainRegion.querySelectorAll('.JNPF-common-layout-main > *')
        bortherItems.forEach(item => {
          if (item.className !== 'TableForm_main TableForm') bortherHeight += item.clientHeight
        })
        // 获取TableForm头部操作栏
        const TableFormTitle = mainRegion.querySelector('.TableForm_title')
        const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
        // 设置表单容器的高度
        mainRegion.querySelector('.tableContainer').style.height = TableFormTitle ? 'calc(100% - 36px)' : '100%'

        // 表格高度 = 区域总高度 - 同级元素高度 - TableForm标题栏高度 - 安全高度
        let maxHeight = mainHeight - bortherHeight - TableFormTitleHeight - 30

        // 计算高度最低500
        maxHeight = maxHeight > 500 ? maxHeight : 500

        this.customStyleData = {
          height: 10000,
          maxHeight
        }

        // 附带防抖的监听适配模式屏幕缩放
        window.onresize = () => {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.switchStyle('onresize')
          }, 100);
        };
      } else {
        this.$message.success('全展模式')
        window.onresize = null
        this.customStyleData = {}
        mainRegion.querySelector('.tableContainer').style.height = '100%' // 设置表单容器的高度
        // 重新加载表格
        this.tableVisible = false
        this.$nextTick(() => { this.tableVisible = true })
      }
    },
    calcHeight() {
      this.$nextTick(() => {
        let tBodyList = document.querySelectorAll('.TableForm.table')
        tBodyList.forEach(item => {
          item.style.height = 'auto'
          item.style.maxHeight = '100000px'
          item.querySelector('.el-table__body-wrapper').style.height = 'auto'
          // item.querySelector('.el-table__fixed-right').style.right = '0'
        })
      });
    },
    cancelFun(){
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    // 导入产品
    async importProduct() {
      let flag = true
      this.file={}
      if (this.JNPFColTableData.data.length) {
        flag = await this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).catch(err => false)
      }
      if (flag) {
        this.uploadVisib = true

      }
    },
    // 上传产品
    UploadProduct(data) {
      // this.loadingText = '正在导入数据'
      console.log("data",data);
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data )
      // 调用上传文件接口
      warehouseUploadLine(formData).then(res => {
        console.log(res);
        if (!res.data.url&&res.data.list.length) {
          this.$message.success(`导入成功`)
          this.formLoading = false
          this.loadingText = ''
        this.uploadVisib = false
        this.$emit('addth', res.data.list, 'import')
      } else {
        if(res.data.list){
        this.$emit('addth', [res.data.list], 'import')
        }
          this.handleMessage(res.data)
        this.uploadVisib = false
        this.$refs['uploadRef'].clearFiles();
        } 


        this.formLoading = false
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
       // 提示
       handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: "error",
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，导入的产品信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: "mini",
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: "none",
                textAlign: "center",
                // width:"20%",
                margin: "0 5px 0 5px ",
              },
            }, '下载导入错误数据')
          ]
        ),
      })
      return
    },
     // 导入产品  下载导入错误数据
     downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    // 下载产品导入模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/出入库导入模板.xlsx')
      a.click()
    },
  }
}
</script>
<style scoped>
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

.topButton {
  margin-right: 8px;
  margin-left: 8px;
  font-size: 14px !important;
}

.noDataTip {
  text-align: 'center';
  padding: '10%';
  color: #aaa;
}
</style>