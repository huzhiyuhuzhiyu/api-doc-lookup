<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0">
        <div class="title_box">
          <h2 v-if="!leftFlag">字典分类</h2>
          <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="initData()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleTreeExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleTreeExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="handleTypeManage">分类管理</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div v-if="!leftFlag"> <el-input placeholder="输入关键字进行过滤" v-model="filterText"
          style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
        </el-input></div>
      </div>
   
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expandsTree"
          highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
          class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node }">
            <i class="el-icon-notebook-2" />
            <span class="text">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract " style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand " style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
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
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="展开" placement="top"
              v-if="tableData.length && tableData.every((item) => { return item.hasChildren })">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top"
              v-if="tableData.length && tableData.every((item) => { return item.hasChildren })">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="getDictionaryList()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableData" row-key="id" :hasNO="false"
          :default-expand-all="expands" custom-column
          :tree-props="{ children: 'children', hasChildren: '' }">
          <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" disabled title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="fullName" label="名称">

          </el-table-column>
          <el-table-column prop="enCode" label="编码" />
          <!-- <el-table-column prop="sortCode" label="排序" width="70" align="center" /> -->
          <el-table-column prop="enabledMark" label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" style="border-right:none!important">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-button type="text" @click="copyFun(scope.row.id)"> 复制</el-button>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="getDictionaryList" />
    <copyForm v-if="copyFormVisible" ref="copyForm" @refreshDataList="getDictionaryList" />
    <TypeList v-if="drawer" ref="TypeList" @refreshDataList="initData" />
  </div>
</template>

<script>
import {
  getDictionaryType,
  getDictionaryDataList,
  delDictionaryData,
  updateDictionaryState,
  batchUpdataSort
} from '@/api/systemData/dictionary'
import Form from './Form'
import copyForm from './copyForm'
import TypeList from './components/index'
import Sortable from 'sortablejs'

export default {
  name: 'systemData-dictionary',
  components: {
    Form,
    TypeList,
    copyForm
  },
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      listQuery: {
        keyword: '',
        isTree: 0
      },
      typeId: '',
      drawer: false,
      formVisible: false,
      copyFormVisible: false,
      treeLoading: false,
      listLoading: false,
      treeData: [],
      tableData: [],
      expands: true,
      expandsTree: true,
      refreshTable: true,
      refreshTree: true,
      leftFlag: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {
    if (localStorage.getItem("dictionaryFlag")) {
      let dictionaryFlag = JSON.parse(localStorage.getItem('dictionaryFlag'))
      this.expandsTree = dictionaryFlag
      console.log("dictionaryFlag", dictionaryFlag);
      this.toggleExpand(dictionaryFlag)

    }
    this.initData(true)
  },
  mounted() {
    this.$nextTick(()=>{
      this.rowDrop(); //声明表格拖动排序方法
    })

  },
  methods: {
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    // 设置默认展开
    setexpand(expands) {
      console.log("expands", expands);
      this.refreshTree = false
      this.expandsTree = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("dictionaryFlag", expands)

      })
    },
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expandsTree = expands
      this.$nextTick(() => {
        this.refreshTree = true
      })
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    rowDrop() {
      console.log("this.$refs.tabForm",this.$refs.tabForm);
      const el = this.$refs.tabForm.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
          this.tableData.splice(evt.newIndex, 0, targetRow);
          console.log(this.tableData);
          let att = []
          this.tableData.forEach((item, index) => {
            let obj = {
              id: item.id,
              sortCode: index,
            }
            att.push(obj)
          });
          console.log(att);
          batchUpdataSort(att).then(res => {
            this.$message.success("批量修改排序成功")
            this.getDictionaryList()

          })
        }
      });
    },
    search() {
      this.getDictionaryList()
    },
    reset() {
      this.listQuery.keyword = ''
      this.getDictionaryList()
    },
    initData(isInit) {
      this.treeLoading = true
      getDictionaryType().then(res => {
        this.treeData = res.data.list
        this.$nextTick(() => {
          if (isInit) this.typeId = this.treeData[0].id
          this.listQuery.isTree = this.treeData[0].isTree
          this.$refs.treeBox.setCurrentKey(this.typeId)
          this.treeLoading = false
          if (isInit) this.typeId && this.getDictionaryList()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    toggleExpand() {
      this.refreshTable = false;
      this.expands = !this.expands;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    toggleTreeExpand(expands) {
      this.refreshTree = false
      this.expandsTree = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.typeId)
        })
      })
    },
    getDictionaryList() {
      this.listLoading = true
      getDictionaryDataList(this.typeId, this.listQuery).then(res => {
        this.tableData = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 分类管理
    handleTypeManage() {
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.TypeList.init()
      })
    },
    handleNodeClick(data) {
      if (this.typeId === data.id) return
      this.typeId = data.id
      this.listQuery.isTree = data.isTree
      this.reset()
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前数据吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateDictionaryState(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.$store.commit('base/SET_DICTIONARY_LIST', [])
              row.enabledMark = row.enabledMark ? 0 : 1
            }
          })
        })
      }).catch(() => { })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.typeId, this.listQuery.isTree, this.tableData)
      })
    },
    copyFun(id) {
      this.copyFormVisible = true
      this.$nextTick(() => {
        this.$refs.copyForm.init(id, this.typeId, this.listQuery.isTree, this.tableData)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delDictionaryData(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.$store.commit('base/SET_DICTIONARY_LIST', [])
              this.getDictionaryList()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
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