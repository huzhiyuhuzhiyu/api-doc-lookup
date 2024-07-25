import { getVisualDevList, Delete, Copy, exportData } from '@/api/onlineDev/visualDev'
import { getbimProductAttributes } from "@/api/masterDataManagement/index";
import { debounce } from "@/utils";
export default {
  data() {
    return {
      list: [],
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      listLoading: false,
      formVisible: false,
      addVisible: false,
      currWebType: '',
      currId: '',
      categoryList: []
    }
  },
  created() {
    this.getDictionaryData()
    this.initData()
  },
  // watch: {
  //   filterText(val) {
  //     this.$refs.treeBox.filter(val);
  //   },
  // },
  mounted() {
    this.getcategoryTree()
  },
  methods: {
    // 注意：此处不能使用箭头函数，否则this指向会有问题
    handleInput: debounce(function () {
      this.$refs.treeBox.filter(this.filterText);
    }, 500),
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category: this.category
      }
      this.initData()
    },
    reset() {
      this.query.keyword = ''
      this.category = ''
      this.search()
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: this.sort }).then((res) => {
        this.categoryList = res
      })
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        ...this.query,
        category: this.category
      }
      getVisualDevList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    copy(id) {
      this.$confirm('您确定要复制该功能模板, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        Copy(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    exportModel(id) {
      this.$confirm('您确定要导出该功能模板, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportData(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },
    toggleWebType(row) {
      const { id, webType } = row
      if (!webType) return
      this.openAddBox(id, webType)
    },
    // openAddBox(id, webType) {
    //   this.addVisible = true
    //   this.currId = id || ''
    //   this.currWebType = webType || ''
    // },
    handleAdd(id, webType, isToggle) {
      this.addOrUpdateHandle(id, webType, isToggle)
    },
    addOrUpdateHandle(id, webType, isToggle, editType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.categoryList, id, this.query.type, webType, isToggle, editType)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      this.category = node.data.id
      this.search();
    },
    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getbimProductAttributes('765929a127f44a5b80e773d65d58f96c').then(res => {
        this.treeData = res.data.list.length ? res.data.list : []
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          this.category = this.treeData[0].id
          this.treeLoading = false
          this.listLoading = false
          this.initData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },

    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
  }
}