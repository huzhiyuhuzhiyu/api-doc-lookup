<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item label="">
              <el-input v-model="listQuery.name" placeholder="分类名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-input v-model="listQuery.code" placeholder="分类编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <topOpts @add="addOrUpdateHandle()">
            <el-button :disabled="treeList.length > 0 ? false : true" size="mini" type="primary" icon="el-icon-download"
              @click="exportForm">
              导出
            </el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <!-- <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip> -->
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
        <JNPF-table v-loading="listLoading" :data="treeList" row-key="id" v-if="refreshTable" fixedNO
          :setColumnDisplayList="columnList" :default-expand-all="expands"
          :tree-props="{ children: 'childrenList', hasChildren: '' }" ref="dataTable" custom-column>
          <el-table-column prop="name" label="分类名称" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <i :class="[
                scope.row.childrenList.length >= 1
                  ? 'icon-ym icon-ym-tree-organization3'
                  : 'icon-ym icon-ym-systemForm'
              ]"></i>
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="分类编码" min-width="120" sortable="custom" />
          <!-- <el-table-column prop="parentName" label="上级分类" min-width="120" /> -->
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="180" />
          <el-table-column prop="remark" label="备注" min-width="200" />
          <!-- <el-table-column prop="plmSyncFlag" label="PLM同步状态" width="160" fixed="right" align="center">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="!scope.row.plmSyncFlag">同步失败</el-tag>
              <el-tag type="success" v-else>同步成功</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId)"
                @del="handleDel(scope.row.id, scope.row.parentId)">
                <!-- <el-button size="mini" type="text" :disabled="scope.row.plmSyncFlag" @click="PLMchange(scope.row.id)">
                  同步PLM
                </el-button> -->
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getcategoryTree, deleteCategory, productPlmSync } from '@/api/basicData/materialSettings'
import DepForm from './depForm'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  components: { DepForm, ExportForm, SuperQuery },
  data() {
    return {
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
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
      ],
      exportFormVisible: false,
      listQuery: {
        classAttribute: 'process',
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
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      depFormVisible: false,
      columnList: ['createByName']
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
        typeCode: "pa007",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj1).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'sealingCoverTyping');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };


      getbimProductAttributesList(obj2).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'accuracyLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj3).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'vibrationLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj4).then(res => {



        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oil');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa003",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj5).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oilQuantity');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa001",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj6).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'clearance');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj7).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'packagingMethod');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })


      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
      })

    },
    sortChange({ prop, order }) {
      let newProp = ""
      if (prop == 'steelBall' || prop == "outerCircle" || prop == "innerCircle" || prop == "createByName") {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());

      }
      this.listQuery.orderItems[0].asc = order === "ascending";
      this.listQuery.orderItems[0].column = order === null ? "" : newProp;
      this.initData();
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      console.log(columnList, 'columnList')
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.listQuery,
          exportType: '1028',
          exportName: '工序分类信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
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
          this.setTableIndex(item.childrenList, item.index)
        }
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        classAttribute: 'process',
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
    addOrUpdateHandle(id, parentId) {
      this.addOrUpdateDep(id, parentId)
    },
    addOrUpdateDep(id, parentId) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId)
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
.table-icon {
  vertical-align: bottom;
  font-size: 16px;
  margin-right: 6px;
  line-height: 23px;
}
</style>
