<template>
  <div class="JNPF-common-layout">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;background-color: #fff;">
        <el-tab-pane label="供应商页面" name="supplierPage" style="margin-bottom: 5px;height: 100%;">
          <div class="JNPF-common-layout"> -->
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent :rules="rules">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="类别名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.code" placeholder="类别编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-date-picker v-model="createTimeArr" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                style="width: 100%" start-placeholder="创建开始时间" end-placeholder="创建结束时间" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <topOpts @add="addSupplier()" />

          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" highlight-current-row :data="tableData" custom-column
          :setColumnDisplayList="columnList" @sort-change="sortChange">
          <el-table-column prop="name" label="类别名称" sortable="custom" />
          <el-table-column prop="code" label="类别编码" sortable="custom" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <!-- <el-button type="text" size="mini" @click.native="copyHandle(scope.row.id, true)">
                复制
              </el-button> -->
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delClassAttribute,
  addBimProductAttributes,
  getclassAttributeList
} from '@/api/masterDataManagement/index'
import Form from './Form'
import moment from 'moment'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  name: 'supplierProfile',
  components: { Form, SuperQuery },
  data() {
    return {
      superQueryVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      activeName: 'supplierPage',
      visible: false,
      treeData: [],
      leftFlag: false,
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      form: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,

        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      },

      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'fullName'
      },
      rules: {
        code: [{}]
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      columnList: ['remark', 'createByName'],
      createTimeArr: [],

      superQueryJson: [
        {
          prop: 'name',
          label: '类别名称',
          type: 'input'
        },
        {
          prop: 'code',
          label: '类别编码',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  // mounted() {
  //   this.getProductClassFun()
  // },
  created() {
    this.initData()
    // this.getbimProductAttributesFun()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    superQuerySearch(query) {
      this.form.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.form.orderItems[0].asc = order !== 'descending'
      this.form.orderItems[0].column = newProp
      this.initData()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 获取左侧属性分类
    getbimProductAttributesFun() {
      getbimProductAttributes('575966014227880773').then((res) => {
        this.treeData = res.data.list
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.treeData[0].enCode) // 默认选中节点第一个

          this.initData()
        })
      })
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },

    filterNode(value, data) {
      if (!value) return true
      return data.fullName.indexOf(value) !== -1
    },

    initData() {
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.form.startTime = this.createTimeArr[0] + ' 00:00:00'
        this.form.endTime = this.createTimeArr[1] + ' 23:59:59'
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
      this.listLoading = true
      getclassAttributeList(this.form)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      Object.keys(this.form).forEach((key) => {
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.form = {
        code: '',
        name: '',

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      this.$refs.SuperQuery.conditionList = []

      this.search()
    },
    handleNodeClick(data, node) {
      this.form.typeCode = node.data.enCode
      this.search()
    },

    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init('', 'add')
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, 'edit')
        })
        // }, 600);
      }
    },
    copyHandle(id) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, 'copy')
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          delClassAttribute(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, btnType)
      })
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa007',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj1).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa006',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj2).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'accuracyLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa005',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj3).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'vibrationLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa002',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj4).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oil')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa003',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj5).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oilQuantity')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa001',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj6).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'clearance')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa015',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj7).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'packagingMethod')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
      })
    }
  }
}
</script>
<style scoped>
::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 40px !important;
  line-height: 40px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
<style scoped>
.title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
