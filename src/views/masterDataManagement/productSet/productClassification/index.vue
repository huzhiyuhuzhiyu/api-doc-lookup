<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <!-- <el-col :span="6">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword" :placeholder="$t('common.enterKeyword')" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="">
              <el-input v-model="listQuery.name" placeholder="分类名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.classAttribute" placeholder="产品来源" clearable style="width: 100%;">
                <el-option v-for="(item, index) in classAttributeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()" class="commonBox">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()" class="commonBox">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <topOpts @add="addOrUpdateHandle('', '', 'add')" :isJudgePer="true" :addPerCode="'btn_add'" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
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
        <JNPF-table v-loading="listLoading" :data="treeList" :row-key="'id'" v-if="refreshTable" fixedNO
          :default-expand-all="expands" :tree-props="{ children: 'childrenList', hasChildren: '' }" ref="dataTable"
          custom-column :setColumnDisplayList="columnList">
          <el-table-column prop="name" label="分类名称" min-width="200">
            <template slot-scope="scope">
              <i :class="[
                scope.row.childrenList.length >= 1
                  ? 'icon-ym icon-ym-tree-organization3'
                  : 'icon-ym icon-ym-systemForm'
              ]"></i>
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="分类编码" min-width="120" />
          <el-table-column prop="parentName" label="上级分类" min-width="120" />
          <!-- <el-table-column prop="integger" label="分类编码" min-width="120" /> -->
          <el-table-column prop="classAttribute" label="类别属性" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.classAttribute == 'raw_material'">原材料</div>
              <div v-if="scope.row.classAttribute == 'semi_finished'">半成品</div>
              <div v-if="scope.row.classAttribute == 'finish_product'">成品</div>
              <div v-if="scope.row.classAttribute == 'accessories'">辅料</div>
            </template>
          </el-table-column>

          <el-table-column prop="classType" label="类型" min-width="130">
            <template slot-scope="scope">
              <div v-if="scope.row.classType == 'packaging'">包装物</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="sort" label="排序" width="100" align="center">
            <template slot-scope="scope">
              <el-input @blur="switchShow(scope.row, 'sort')" clearable v-model="scope.row.sort"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" />

          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)">
                <!-- <el-button type="text" size="mini" @click.native="addOrUpdateHandle(scope.row.id,scope.row.parentId, 'copy')">
                  复制
                </el-button> -->
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getcategoryTree, deleteCategory, updateCategory, productPlmSync } from '@/api/basicData/materialSettings'
import DepForm from './depForm'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  components: { DepForm, SuperQuery },

  data() {
    return {
      listQuery: {
        classAttribute: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
      treeList: [],
      treeDataAll: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      depFormVisible: false,
      classAttributeList: [
        { label: '原材料', value: 'raw_material' },
        { label: '半成品', value: 'semi_finished' },
        { label: '成品', value: 'finish_product' },
        { label: '辅料', value: 'accessories' }
      ],
      columnList: ['classAttribute', 'classType', 'createTime', 'createByName','remark'],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'name',
          label: '分类名称',
          type: 'input'
        },
        {
          prop: 'code',
          label: '分类编码',
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: '上级分类',
          type: 'input'
        },

        {
          prop: 'classAttribute',
          label: '类别属性',
          type: 'select',
          options: [
            { label: '原材料', value: 'raw_material' },
            { label: '半成品', value: 'semi_finished' },
            { label: '成品', value: 'finish_product' },
            { label: '辅料', value: 'accessories' }
          ]
        },
        {
          prop: 'accuracyLevel',
          label: '类型',
          type: 'select',
          options: [{ label: '包装物', value: 'packaging' }]
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
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ]
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  created() {
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
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
    },
    switchShow(row) {
      let obj = row
      updateCategory(obj)
        .then((response) => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.loading = true
      getcategoryTree(this.listQuery)
        .then((res) => {
          this.treeList = res.data
          if (this.treeList.length > 0) this.setTableIndex(this.treeList)
          this.listLoading = false
          this.btnLoading = false
        })
        .catch(() => {
          this.listLoading = false
          this.btnLoading = false
        })
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1
        if (index) {
          item.index = index + 1
        }
        if (item.childrenList.length > 0) {
          item.hasChildren = true
          this.setTableIndex(item.childrenList, item.index)
        }
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        classAttribute: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20
      }
      this.$refs.SuperQuery.conditionList = []

      this.initData()
    },
    addOrUpdateHandle(id, parentId, type) {
      this.addOrUpdateDep(id, parentId, type)
    },
    addOrUpdateDep(id, parentId, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId, type)
      })
    },
    closeDepForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    toggleExpand() {
      this.refreshTable = false
      this.expands = !this.expands
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    PLMchange(id) {
      this.listLoading = true
      productPlmSync(id)
        .then((res) => {
          if (res.msg === 'Success') {
            this.$message.success('同步成功')
            this.initData()
          }
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteCategory(id).then((res) => {
            if (res.msg === 'Success') {
              this.initData()
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1500
              })
            }
          })
        })
        .catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.table-icon {
  vertical-align: bottom;
  font-size: 16px;
  margin-right: 6px;
  line-height: 23px;
}
</style>
