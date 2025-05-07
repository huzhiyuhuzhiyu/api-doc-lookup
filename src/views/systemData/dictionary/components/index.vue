<template>
  <el-drawer title="字典分类管理" :visible.sync="drawer" :wrapperClosable="false" ref="drawer" size="820px"
    :before-close="handleDrawerClose" class="JNPF-common-drawer">
    <div class="JNPF-flex-main">
      <div class="JNPF-common-head">
        <topOpts @refresh="getDictionaryTypeList()" @add="addOrUpdateHandle()">
          <upload-btn url="/api/system/DictionaryData/Action/Import" @on-success="getDictionaryTypeList" />
        </topOpts>
        <div class="JNPF-common-head-right">
          <el-tooltip effect="dark" content="展开" placement="top">
            <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
              :underline="false" @click="toggleExpand()" />
          </el-tooltip>
          <el-tooltip effect="dark" content="折叠" placement="top">
            <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
              :underline="false" @click="toggleExpand()" />
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
            <el-link icon="icon-ym icon-ym-Refresh
              JNPF-common-head-icon" :underline="false" @click="reset()" />
          </el-tooltip>
        </div>
      </div>
      <JNPF-table v-loading="listLoading" :data="tableData" row-key="id" :default-expand-all="expands"
        v-if="refreshTable" :tree-props="{ children: 'children', hasChildren: '' }" customKey="JNPFTableKey_219044">

        <el-table-column prop="fullName" label="名称" />
        <el-table-column prop="enCode" label="编码" width="160" />
        <el-table-column prop="sortCode" label="排序" width="100" align="center">
          <template slot-scope="scope">
            <el-input @blur="switchShow(scope.row,'sortCode')" clearable 
              v-model="scope.row.sortCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="isTree" label="是否树" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isTree === 1" type="success" size="mini">是</el-tag>
            <el-tag v-else type="danger" size="mini">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
              <el-button size="mini" type="text" @click="exportData(scope.row.id)">导出
              </el-button>
            </tableOpts>
          </template>
        </el-table-column>
      </JNPF-table>
      <TypeForm v-if="typeFormVisible" ref="TypeForm" @refreshDataList="getDictionaryTypeList" />
    </div>
  </el-drawer>
</template>
<script>
import {
  getDictionaryType,
  delDictionaryType,
  exportData,
  updateDictionaryType,
  getChildrenList
} from '@/api/systemData/dictionary'
import TypeForm from './Form'

export default {
  components: {
    TypeForm
  },
  data() {
    return {
      indexFlag: false,
      drawer: false,
      listLoading: false,
      btnLoading: false,
      typeFormVisible: false,
      tableData: [],
      expands: true,
      refreshTable: true,
    }
  },
  methods: {
    // 切换input框的显示状态
    switchShow(row) {

      let obj = {
        enCode: row.enCode,
        sortCode: row.sortCode,
        id: row.id,
        parentId: row.parentId,
        fullName:row.fullName,
        isTree:row.isTree,
      }
      updateDictionaryType(obj).then(response => {
        this.$message({
          message: "修改成功",
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
    toggleExpand() {
      this.refreshTable = false;
      this.expands = !this.expands;
      this.$nextTick(() => {
        this.refreshTable = true;
      });

    },
    init() {
      this.drawer = true
      this.$nextTick(() => {
        this.getDictionaryTypeList()
      })
    },
    getDictionaryTypeList() {
      this.listLoading = true
      getDictionaryType().then(res => {
        res.data.list.forEach(item => {
          item.editFlag = false
        });
        this.tableData = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    addOrUpdateHandle(id) {
      this.typeFormVisible = true
      this.$nextTick(() => {
        this.$refs.TypeForm.init(id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delDictionaryType(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.$store.commit('base/SET_DICTIONARY_LIST', [])
              this.getDictionaryTypeList()
            }
          })
        })
      }).catch(() => { })
    },
    reset() {
      this.getDictionaryTypeList()
    },
    handleDrawerClose(done) {
      done();
      this.$emit('refreshDataList')
    },
    exportData(id) {
      this.$confirm('您确定要导出该字典分类, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportData(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    }
  }
}
</script>
<style scoped>
.JNPF-common-drawer ::v-deep .el-drawer__header {
  font-size: 18px
}
</style>
