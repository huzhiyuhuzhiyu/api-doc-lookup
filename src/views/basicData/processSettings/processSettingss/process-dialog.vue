<template>
  <el-dialog :close-on-click-modal="false" append-to-body :visible.sync="visible" title="请选择工序列表"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="50%" >
    <el-row class="JNPF-common-search-box" :gutter="16" style="margin-top:10px">
      <el-form @submit.native.prevent>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="listQuery.code" placeholder="请输入工序编码"  @keyup.enter.native="search()" clearable maxlength="20"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="listQuery.name" placeholder="请输入工序名称"  @keyup.enter.native="search()" clearable maxlength="20"> </el-input>
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
    <JNPF-table  @selection-change="handleSelectionChange" ref="multipleTable" :data="tableData" hasC tooltip-effect="dark" style="width: 100%;height:600px"
      v-loading="listLoading" title="工序列表" customKey="JNPFTableKey_810461">
      <!-- <el-table-column type="selection" width="55"> -->
      <!-- </el-table-column> -->
      <el-table-column prop="code" label="工序编码">
      </el-table-column>
      <el-table-column prop="name" label="工序名称">
      </el-table-column> 
      
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="selectData(scope.row,)">选择</el-button>
        </template>
      </el-table-column> -->
    </JNPF-table>
    <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="init"
      class="pagination" />
    <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false"> 取 消</el-button>
            <el-button type="primary" @click="processSubmit()" :loading="btnLoading"> 确 定</el-button>
        </span>
  </el-dialog>
</template>
<script>
import { getBimProcessList } from '@/api/bimProcess/index'
export default {
  components: {},
  props: [],
  data() {
    return {
      dialogTitle: '',
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
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
    }
  },
  methods: {
    selectData(row) {
      this.$emit('dataFormSubmit', row)
      this.visible = false
    },
    init() {
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
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20
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
      getBimProcessList(this.listQuery)
        .then((res) => {
          console.log(res, '11111');
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          console.log(this.tableData)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 选中数据后 将数据传到form页
    handleSelectionChange(value) {console.log(value);
      // console.log(value,'选中数据');
      // value.forEach(item => {
      //   item.processId = item.id
        
        
      // });
      this.choseeData = value
    },
    processSubmit(){
      this.$emit('dataFormSubmit', this.choseeData)
      this.visible = false
    },
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
::v-deep .el-dialog__body{
  padding:0px 5px 0px !important;
}
::v-deep .el-dialog__footer{
  padding: 10px 20px 10px !important;
}
</style>