<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:5px 0 5px 0">
        <el-radio-group v-model="listQuery.progressStatusType" style="background-color:#fff;">
          <!-- <el-radio-button label="" style="margin:3px 0">全部</el-radio-button> -->
          <el-radio-button style="margin:2px 0;border-left:1px solid #DCDFE6" v-for="item in treeData"
            :key="item.enCode" :label="item.enCode">{{ item.fullName }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle()" :addText="'保存'">
              <!-- <upload-btn url="/api/system/BillRule/Action/Import" @on-success="initData" /> -->
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableList" custom-column row-key="id"
            :setColumnDisplayList="columnList" :fixedNO="true">
            <el-table-column prop="name" label="名称" min-width="200">
              <template v-slot:default="{ row }">
                <el-input v-model="row.name" placeholder="请输入名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="编码" min-width="200" />

            <el-table-column prop="progressPercentage" label="进度占比" width="120">
              <template v-slot:default="{ row }">
                <el-input v-model="row.progressPercentage" placeholder="请输入名称"></el-input>
              </template>
            </el-table-column>
          </JNPF-table>
          <!-- <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
            @pagination="initData" /> -->
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  getProgressStatusList,
  saveProgressStatus,
  updateSortBatch
} from '@/api/system/orderScheduleSetting'
import {
  getDictionaryType,
  getDictionaryDataList,
  delDictionaryData,
  updateDictionaryState,
  batchUpdataSort
} from '@/api/systemData/dictionary'


export default {
  name: 'orderScheduleSetting',
  components: {

  },
  data() {
    return {
      tableList: [],
      total: 0,
      btnLoading: false,
      listLoading: true,
      categoryId: '',
      listQuery: {
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        progressStatusType: "sale_order",
      },
      formVisible: false,
      categoryList: [],
      filterText: "",
      leftFlag: false,
      treeLoading: false,
      expands: true,
      refreshTree: true,
      treeData: [],
      displayFlag: false,
      columnList: [],
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      drawer: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
    'listQuery.progressStatusType': function (newVal) {
      this.initData()
    },
  },
  created() {
    this.getcategoryTree()

  },
  // mounted() {
  //   this.rowDrop(); //声明表格拖动排序方法

  // },

  methods: {

    rowDrop() {
      const el = this.$refs.tabForm.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableList.splice(evt.oldIndex, 1)[0];
          this.tableList.splice(evt.newIndex, 0, targetRow);
          console.log(this.tableList);
          let att = []
          this.tableList.forEach((item, index) => {
            let obj = {
              id: item.id,
              sortCode: index,
            }
            att.push(obj)
          });
          console.log(att);
          updateSortBatch(att).then(res => {
            this.$message.success("批量修改排序成功")
            this.initData()

          })
        }
      });
    },
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },

    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      let obj = {
        keyword: '',
        isTree: 0
      }
      getDictionaryDataList('619202825582419589', obj).then(res => {
        this.treeData = res.data.list.length ? res.data.list : []
        this.listLoading = false
        this.$nextTick(() => {
          // this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          // this.listQuery.categoryId = this.treeData[0].id
          this.treeLoading = false
          this.listLoading = false
          this.initData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },

    initData() {
      this.drawer = false
      this.listLoading = true
      let query = {
        ...this.listQuery,

      }
      getProgressStatusList(query).then(res => {
        this.tableList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    addOrUpdateHandle() {
      console.log(555)
      this.tableList.map(ele => {
        let count = 0
        count += Number(ele.progressPercentage)
        if (count > 100) {
          console.log(888)
        }
      })
      // this.$confirm(`您确定要保存当前数据吗, 是否继续?`, '提示', {
      //   type: 'warning'
      // }).then(() => {
      //   saveProgressStatus(this.tableList).then(res => {
      //     this.$message({
      //       type: 'success',
      //       message: res.msg,
      //       duration: 1000,
      //       onClose: () => {
      //         row.enabledMark = row.enabledMark ? 0 : 1
      //       }
      //     })
      //   })
      // }).catch(() => { })
    },





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
