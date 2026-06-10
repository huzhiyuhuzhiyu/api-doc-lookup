<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" :content="dialogTitle + `胶管计件价格表`" />
          <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                <h5>胶管信息</h5>
              </div>
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
                  <template>
                    <el-col :span="12">
                      <el-form-item label="胶管层数" prop="layerCount">
                        <el-select placeholder="选择胶管层数" v-model="dataForm.layerCount" @change="actiontypelist" style="width: 100%;">
                          <el-option class="select_item" v-for="(item, index) in productTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-form>
              </el-row>
              <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                <h5>工序信息</h5>
              </div>
              <div v-if="type !== 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openSeleceProcessDialog(orderlist.dataFormTwo.length, 'add')">选择工序</el-button>|
                <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>| -->
              </div>
              <el-form :model="orderlist" v-bind="orderlist" ref="productForm" class="data-form">
                <el-table style="border: 1px solid #e3e7ee;" ref="processRef" :data="orderlist.dataFormTwo" size='mini' id="table" :span-method="objectSpanMethod">
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="code" label="工序编码" min-width="160" show-overflow-tooltip />
                  <el-table-column prop="name" label="工序名称" min-width="160" show-overflow-tooltip />
                  <el-table-column prop="hoseLengthRange" label="区间" min-width="140" show-overflow-tooltip />
                  <el-table-column :prop="item.hoseDiameterRange" :label="item.name" width="200" v-for="(item) in hoselist" :key="item.id">
                    <template slot="header">
                      <span class="required">*</span>{{item.name}}
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'dataFormTwo.' + scope.$index + '.' + item.hoseDiameterRange" :rules="pricerules">
                        <el-input v-model="scope.row[item.hoseDiameterRange]" placeholder="请输入价格" maxlength="200" @change="change" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除当前工序</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <ComSelect-page ref="ComSelect-page" @change="submit" :tableItems="ProductTableItems" title="选择工序" treeTitle="工序分类" :methodArr="ProductMethodArr" :listMethod="getBimProcessList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple :listDataFormatting="listDataFormatting" />
  </div>
</template>
<script>
import { getIntervalmanagementList, getRubberhoselengthList, addRubberhoseprice, getRubberhosepriceList } from '@/api/financialManagement/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getBimProcessList } from '@/api/bimProcess/index'
export default {
  props: [],
  data() {
    return {
      pricerules: [{ required: true, trigger: 'blur' }, { validator: this.formValidate({ type: 'decimal', params: [10, 4, "", (errMsg, index) => { this.$message.error(`价格第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' }, { validator: this.formValidate('positiveNumber', '', (errMsg, index) => { this.$message.error(`价格第${index + 1}行：${errMsg}`) }), trigger: 'blur' },],
      Rubberhoselist: [],
      hoselist: [],
      productTypeList: [
        {
          label: "1-2层",
          value: "1-2",
        },
        {
          label: "3-4层",
          value: "3-4",
        },
        {
          label: "6层",
          value: "6",
        },
        {
          label: "水管",
          value: "water_pipes",
        },
        {
          label: "铁佛龙管",
          value: "iron_buddha_dragon",
        },
        {
          label: "测压表线",
          value: "pressure_gauge",
        },
        {
          label: "黄油管",
          value: "butter_tube",
        },
        {
          label: "其他",
          value: "other",
        }
      ],
      getBimProcessList,
      ProductMethodArr: [
        { label: "工序分类", classAttribute: "process", method: getcategoryTree, requestObj: { classAttribute: "process" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        name: "",
        code: "",
        processingType: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        productCategoryId: '',
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '工序编码', fixed: 'left' },
        { prop: 'name', label: '工序名称', fixed: 'left' },
        { prop: 'processingTypeName', label: '加工类型', fixed: 'left' },
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "工序编码", type: 'input' },
        { prop: "name", label: "工序名称", type: 'input' }
      ], // 产品选择弹出框搜索条件
      activeName: 'jcInfo',
      dialogTitle: '',
      btnLoading: false,
      dataForm: {
        layerCount: ''
      },
      type: "",
      orderlist: {
        dataFormTwo: [],
      },
      rules: {
        layerCount: [{ required: true, message: "请选择胶管层数", trigger: "change" }]
      },
      tempList: [],
      tableQuery: {
        pageSize: -1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        layerCount: '',
        processCode: '',
        processName: '',
        hasProcess: 1
      },
      dataFormTwolist: []
    }
  },
  created() {
  },
  methods: {
    deltable(row) {
      let a = this.tempList.filter(item => item.id !== row.row.processId)
      this.tempList = a
      this.Rangets()
      this.calcHeight()
    },
    change() {
      this.$forceUpdate()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        if (rowIndex % Number(this.orderlist.dataFormTwo.length / this.Rubberhoselist.length) === 0) {
          return {
            rowspan: Number(this.orderlist.dataFormTwo.length) / Number(this.Rubberhoselist.length),
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    actiontypelist(e) {
      let tableQuery = {
        layerCount: e,
        pageSize: -1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
      getIntervalmanagementList(tableQuery).then(res => {
        this.hoselist = []
        if(!res.data.records.length) return this.$message.error('内径标号区间未设置 ，请先设置基础信息！')
        this.hoselist = res.data.records.map((item) => {
          return {
            id: item.id,
            hoseDiameterRange: item.hoseDiameterRange,
            name: item.hoseDiameterRange + '(件/元)'
          }
        })
        this.orderlist.dataFormTwo = []
        this.tempList = []
      })
    },
    listDataFormatting(res) {
      let treeData = res.data.records.map(item => {
        if (item.processingType == "self_produced") {
          item.processingTypeName = "自制"
        } else if (item.processingType == "self_produced") {
          item.processingTypeName = "外协"
        }
        return item;
      });
      return treeData
    },
    openSeleceProcessDialog(e, type) {
      if (!this.dataForm.layerCount) return this.$message.error(`请选择胶管层数`)
      if (!this.hoselist.length) return this.$message.error('内径标号区间未设置 ，请先设置基础信息！')
      this.$refs['ComSelect-page'].openDialog()
    },
    goBack() {
      this.$emit('close')
    },
    init(rowData, type) {
      // rowData = JSON.parse(rowData)
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = rowData || ''
      this.dialogTitle = !this.dataForm.id ? '新建' : `查看`
      this.type = type
      let tableQuery = {
        pageSize: -1,
        orderItems: [{
          asc: true,
          column: "hoseLengthRange"
        }, {
          asc: true,
          column: ""
        }],
      }
      getRubberhoselengthList(tableQuery).then(res => {
        this.Rubberhoselist = res.data.records.map(item => {
          return {
            id: item.id,
            hoseLengthRange: item.endVal ? item.startVal + '-' + item.endVal + '米' : item.startVal + '米' + item.startSymbol
          }
        })
      })
    },
    // 表单提交
    async dataFormSubmit(type) {
      const valid = await this.$refs['productForm'].validate().catch(err => false)
      if (!valid) return
      if (!this.orderlist.dataFormTwo.length) {
        this.$message.error('请选择工序')
        return
      }
      this.btnLoading = true
      let itemlist = []
      for (let a = 0; a < this.hoselist.length; a++) {
        for (let i = 0; i < this.orderlist.dataFormTwo.length; i++) {
          let obj = new Object()
          obj.hoseInnerDiameterRangeId = this.hoselist[a].id
          obj.price = this.orderlist.dataFormTwo[i][this.hoselist[a].hoseDiameterRange]
          obj.hoseLengthRangeId = this.orderlist.dataFormTwo[i].hoseLengthRangeId
          obj.layerCount = this.orderlist.dataFormTwo[i].layerCount
          obj.processId = this.orderlist.dataFormTwo[i].processId
          obj.name = this.orderlist.dataFormTwo[i].name
          obj.hoseLengthRange = this.orderlist.dataFormTwo[i].hoseLengthRange
          itemlist.push(obj)
        }
      }
      addRubberhoseprice(itemlist).then(res => {
        let msg = "新建成功"
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
    },
    submit(id, data) {
      let hasItemList = []
      data.map(i => {
        const hasFlag = this.orderlist.dataFormTwo.some(item => {
          let flag = false
          if (i.all.code === item.code) { flag = true }
          return flag
        })
        if (hasFlag) { hasItemList.push(i.name) }
        else { this.tempList.push(i.all) }
        if (hasItemList.length) this.$message.error(`已经存在的工序：${hasItemList.join('、')}`)
      })
      this.Rangets()
      this.calcHeight()
    },
    Rangets() {
      this.dataFormTwolist = []
      if (this.tempList.length) {
        this.Rubberhoselist.map(item => {
          this.tempList.map(item1 => {
            this.dataFormTwolist.push({
              hoseLengthRangeId: item.id,
              layerCount: this.dataForm.layerCount,
              processId: item1.id,
              name: item1.name,
              code: item1.code,
              hoseLengthRange: item.hoseLengthRange
            })
          })
        })
      }
      getRubberhosepriceList(this.tableQuery).then(res => {
        res.data.records.map((item) => {
          this.dataFormTwolist.forEach((item1) => {
            if (item.hoseLengthRangeId == item1.hoseLengthRangeId && item.processId == item1.processId && item.layerCount == item1.layerCount) {
              item1[item.hoseDiameterRange] = item.price
              // this.$set(item1, item.hoseDiameterRange, item.price)
            }
          })
        })
        // this.orderlist.dataFormTwo = this.dataFormTwolist
        this.orderlist.dataFormTwo = JSON.parse(JSON.stringify(this.dataFormTwolist));
      }).catch(() => {
      })
    },
    // 高度
    calcHeight() {
      this.$nextTick(() => {
        let tBody = document.querySelectorAll('.el-table')[1]
        tBody.style.height = 'auto'
        tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
      });
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      //在数据加载完，重新渲染表格
      this.$refs['processRef'].doLayout();
    });
  }
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .el-table__body-wrapper.is-scrolling-left {
  height: auto !important;
}

::v-deep .JNPF-preview-main .el-table--mini td {
  padding: 8px 0 !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.select_item{
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}

</style>