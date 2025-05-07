<template>
  <el-dialog :close-on-click-modal="false" append-to-body :visible.sync="visible" title="请选择班组列表"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="50%">
    <el-row class="JNPF-common-search-box" :gutter="16" style="margin-top:10px">
      <el-form @submit.native.prevent>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="listQuery.code" placeholder="请输入班组编码" clearable maxlength="20"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="listQuery.name" placeholder="请输入班组名称" clearable maxlength="20"> </el-input>
          </el-form-item>
        </el-col>


        <el-col :span="6">
          <el-form-item>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
          </el-form-item>

        </el-col>

      </el-form>
    </el-row>

    <JNPF-table @selection-change="handleSelectionChange" ref="multipleTable" :data="tableData" hasC tooltip-effect="dark"
      style="width: 100%;height:600px" v-loading="listLoading" title="班组列表" customKey="JNPFTableKey_371305">
      <!-- <el-table-column type="selection" width="55"> -->
      <!-- </el-table-column> -->
      <el-table-column prop="code" label="班组编码">
      </el-table-column>
      <el-table-column prop="name" label="班组名称">
      </el-table-column>
    </JNPF-table>
    <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="init"
      class="pagination" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="personnelSubmit()" :loading="btnLoading"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import { getBimProcessList } from '@/api/bimProcess/index'
// import { getUserList } from '@/api/basicData/index'
import { getGroupList, editEquEquipmentAll, getEquEquipmentList } from '@/api/basicData/index'
export default {
  components: {},
  props: [],
  data() {
    return {

      visible: false,
      listLoading: false,
      btnLoading: false,
      dataForm: {
        id: null,
      },
      total: 0,
      tableData: [],
      rules: {},
      choseeData: [],
      listQuery: {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        state: 'enable'
      },
      currentPage: 1,
      pageSize: 20
    }
  },
  // created(){
  //   this.getClassName()
  // },
  methods: {
    selectData(row) {
      this.$emit('dataFormSubmit', row)
      this.visible = false
    },
    init(type) {
      this.visible = true
      this.getList()
    },
    reset() {
      this.listQuery = {
        code: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        state: 'enable'
      },
        this.search()
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getGroupList(this.listQuery)
        .then((res) => {
          console.log(res, '11111');
          // this.tableData = res.data.records.filter(item=>item.state==='enable')
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          console.log(this.tableData)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 选中数据后 将数据传到source页
    handleSelectionChange(value) {
      this.choseeData = value
    },
    personnelSubmit() {
      this.$emit('dataFormSubmit', this.choseeData)
      this.visible = false
    },
    // getClassName() {
    //   // 获取目标元素
    //   const targetElement = document.querySelector(".el-table__body-wrapper.is-scrolling-none");

    //   // 添加"workgroup"类名
    //   targetElement.classList.add("workgroup");

    //   // 清除min-height属性
    //   targetElement.style.minHeight = "";
    // },
    // 表单提交
    // dataFormSubmit() {
    //   this.$emit('dataFormSubmit', this.choseeData)
    //   this.visible = false
    // },
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.JNPF-common-search-box {
  margin-left: -8px !important;
  margin-top: -16px;
}

.pagination-container {
  background-color: #f5f7fa;
}

.JNPF-dialog.JNPF-dialog_center /deep/ .el-dialog .el-dialog__body {
  max-height: none !important;
}

::v-deep .el-dialog__body {
  padding: 0px 5px 0px !important;
}

::v-deep .el-dialog__footer {
  padding: 10px 20px 10px !important;
}

::v-deep .el-table__body-wrapper.is-scrolling-none {
  min-height: 558px !important;
}
</style>