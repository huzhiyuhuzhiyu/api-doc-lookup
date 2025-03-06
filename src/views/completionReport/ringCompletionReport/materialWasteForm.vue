<template>

  <el-dialog title="设置料废金额" :close-on-click-modal="false" :close-on-press-escape="false" @close="customerVisible = false"
    :visible.sync="customerVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="40%"
    append-to-body>

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

      <div class="JNPF-common-layout-center JNPF-flex-main" style="background-color: #fff;overflow-y:auto ;">

        <div class="JNPF-common-layout-main JNPF-flex-main" style="padding-top: 0;">
          <div>
            <el-button type="text" icon="el-icon-plus" @click="addLinFun"
              style="width: 100px;text-align: left;padding-top: 0;">新增一行</el-button>
            <span style="font-weight:500;margin-right:10px">料废总数量：{{ num }}</span>
          </div>
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true">
            <el-table-column prop="name" label="料废类型" min-width="180" sortable="custom">
              <template slot="header">
                <span class="required">*</span>料废类型
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.scrapId" placeholder="料废类型" style="width: 100%;" class="ipt"
                  @change="(value) => handleSelectionChange(value, scope)">
                  <el-option v-for="(item, index) in materialWasteList" :key="index" :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="料废数量" min-width="180" sortable="custom">
              <template slot="header">
                <span class="required">*</span>料废数量
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.num" placeholder="料废数量" @blur="countFun(scope)"></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="price" label="单价" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="amount" label="金额" min-width="180" sortable="custom"></el-table-column> -->
          </JNPF-table>
          <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
            <span style="font-weight:500;margin-right:10px">料废数量合计：{{ totalNum }}</span>
            <!-- <span style="font-weight:500;margin-right:10px">料废金额合计：{{ totalAmount }}</span> -->
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submitCodeFun()">
        确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getScrapCategoryList } from "@/api/basicData/index.js"
export default {
  data() {
    return {

      customerVisible: false,

      form: {
        name: "",
        pageNum: -1,
        pageSize: -1,
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        },],

      },
      listLoading: false,
      total: 0,
      materialWasteList: [],
      isProductNameSwitch: "",
      tableDataList: [],
      createdData: {
        name: "",
        price: "",
        num: "",
        amount: "",
        scrapId: "",
      },
      num: "",

    }
  },
  computed: {
    totalAmount: function () {
      var totalAmounts = 0;
      for (var i = 0; i < this.tableDataList.length; i++) {
        totalAmounts = this.jnpf.math('add', [totalAmounts, this.tableDataList[i].amount])
      }
      return totalAmounts
    },
    totalNum: function () {
      var totalNums = 0;
      for (var i = 0; i < this.tableDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.tableDataList[i].num])
      }
      return totalNums
    },

  },
  methods: {
    countFun(row) {
      let index = row.$index
      this.tableDataList[index].amount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.row.num, row.row.price]), 6)
    },
    addLinFun() {
      this.tableDataList.push(JSON.parse(JSON.stringify(this.createdData)))
    },
    cancel() {
      this.customerVisible = false
      console.log(this.tableDataList);
    },
    handleSelectionChange(value, row) {
      console.log(row);
      // 通过 value (即选中的 item.id) 找出对应的 item  
      const selectedItem = this.materialWasteList.find(item => item.id === value);
      this.tableDataList[row.$index].price = selectedItem.price
      this.tableDataList[row.$index].name = selectedItem.name
      this.tableDataList[row.$index].scrapId = selectedItem.id
      this.tableDataList[index].amount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.row.num, row.row.price]), 6)
      console.log('选中的选项:', selectedItem); // 这里会打印出完整的 item 对象  
      // 你可以进一步处理 selectedItem，比如更新状态或发送请求  
    },

    init(data, num) {
      console.log(data, num);
      this.num = num
      this.tableDataList = []
      this.customerVisible = true
      if (!data.length) this.tableDataList.push(JSON.parse(JSON.stringify(this.createdData)))
      this.tableDataList = data
      this.getrecordsList()
    },
    // 选择批次
    selectFun(row) {
      this.$emit("selectRouting", row,)
      this.customerVisible = false
    },
    getrecordsList() {
      this.listLoading = true
      getScrapCategoryList(this.form).then(res => {
        console.log("料废类型", res);
        // res.data.records.forEach(item => {
        //   item.selectFlag = false
        // })
        this.materialWasteList = res.data.records
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    submitCodeFun() {
      console.log(444444);
      console.log(this.tableDataList);

      if(Number(this.totalNum)!=Number(this.num)) return this.$message.error("料废数量之和只能等于料废总数量")
      if(!this.tableDataList.length) return this.$message.error("料废金额数据不能为空")
      let flag=null;
      for (let index = 0; index < this.tableDataList.length; index++) {
        const item = this.tableDataList[index];
        if(!item.scrapId){
          this.$message({
          message: "请选择第" + (index + 1) + "行的料废类型",
          type: 'error',
          duration: 1500,
        })          
        flag=false
        break
        }
        if(!item.num){
          this.$message({
          message: "请输入第" + (index + 1) + "行数量",
          type: 'error',
          duration: 1500,
        })          
        flag=false
        break
        }
      }
       
      if(flag===false)return
      this.customerVisible=false
      this.$emit('change', this.tableDataList)
    }


  }
}
</script>
<style scoped>
.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 10px !important;
}

.selectProcess.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body {
  padding: 0 !important;
}

::v-deep .el-table__body-wrapper {
  height: 100%;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>
