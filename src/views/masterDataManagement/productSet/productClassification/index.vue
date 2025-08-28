<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
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
          custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_250656" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
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
          <el-table-column prop="code" label="分类编码" min-width="200" />
          <el-table-column prop="typingPosition" label="打字位置" min-width="200" />
          <el-table-column prop="parentName" label="上级分类" min-width="100" />
          <!-- <el-table-column prop="integger" label="分类编码" min-width="120" /> -->
          <el-table-column prop="classAttribute" label="类别属性" min-width="120">
            <template slot-scope="scope">
              {{ $getLabel(categoryPropertList, scope.row.classAttribute, 'value', 'label') }}
            </template>
          </el-table-column>

          <el-table-column prop="classType" label="类型" min-width="100">
            <template slot-scope="scope">
              {{ $getLabel(classTypelist, scope.row.classType, 'value', 'label') }}
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="100" align="center">
            <template slot-scope="scope">
              <el-input @change="switchShow(scope.row, 'sort')" @blur="sortCodeBlur(scope.row)"
                v-model="scope.row.sort" maxlength="10"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="100" fixed="right">
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
  </div>
</template>

<script>
import { getcategoryTree, deleteCategory, updateCategory, productPlmSync } from '@/api/basicData/materialSettings'
import DepForm from './depForm'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
export default {
  components: { DepForm, SuperQuery },

  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            { prop: 'name', symbol: 'like', fixed: true },
            { prop: 'classAttribute', symbol: '==', fixed: true },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      listQuery: {
        type: 'material',
      },
      classTypelist: [
        { label: '包装物', value: 'packaging' },
        { label: '内圈毛坯', value: 'inner_ring_blank' },
        { label: '外圈毛坯', value: 'outer_ring_blank' },
        { label: '内圈', value: 'inner_ring' },
        { label: '外圈', value: 'outer_ring' },
        { label: '磨料', value: 'abrasive' },
        { label: '油料', value: 'oil' },
        { label: '配件', value: 'accessory' },
        { label: '周转箱', value: 'turnover_box' },
        { label: '保持架', value: 'holder' },
        { label: '密封盖', value: 'sealing_cap' },
      ],
      treeList: [],
      treeDataAll: [],
      expands: true,
      refreshTable: true,
      listLoading: true,
      depFormVisible: false,
      categoryPropertList: [],
      columnList: [],
      superQueryVisible: false,
      superQueryJson: [{
        prop: 'classAttribute',
        label: '类别属性',
        type: 'select',
        options: [{
          label: '原材料',
          value: 'raw_material'
        }, {
          label: '半成品',
          value: 'semi_finished'
        }, {
          label: '成品',
          value: 'finish_product'
        }, {
          label: '辅料',
          value: 'accessories'
        }]
      }, {
        prop: 'classType',
        label: '类型',
        type: 'select',
        options: [{
          label: '包装物',
          value: 'packaging'
        }, {
          label: '内圈毛坯',
          value: 'inner_ring_blank'
        }, {
          label: '外圈毛坯',
          value: 'outer_ring_blank'
        }, {
          label: '内圈',
          value: 'inner_ring'
        }, {
          label: '外圈',
          value: 'outer_ring'
        }, {
          label: '磨料',
          value: 'abrasive'
        }, {
          label: '油料',
          value: 'oil'
        }, {
          label: '配件',
          value: 'accessory'
        }, {
          label: '周转箱',
          value: 'turnover_box'
        }, {
          label: '保持架',
          value: 'holder'
        }, {
          label: '密封盖',
          value: 'sealing_cap'
        }]
      }]
    }
  },
  mounted() {
    this.getclassAttributeList()
    this.getProductClassFun()
  },
  created() {

  },
  methods: {
    getclassAttributeList() {
      let obj = {

        pageSize: -1
      }
      getclassAttributeList(obj).then((res) => {
        this.categoryPropertList = res.data.records.map((item) => {
          return {
            label: item.name,
            value: item.code
          }
        })
      })
    },

    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj1 = {

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
      })
    },
    switchShow(row) {
      if (!row.sort) return this.$message.error('请修改排序值')
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
        })
    },
    sortCodeBlur(row) {
      if (!row.sort) this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期
      this.listLoading = true
      getcategoryTree(this.listQuery)
        .then((res) => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.treeList = res.data
          if (this.treeList.length > 0) this.setTableIndex(this.treeList)
          this.listLoading = false
        })
        .catch(() => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.listLoading = false
        })
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
