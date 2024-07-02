<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listquery.tableName" placeholder="请输入表名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">

            <el-form-item label="启用状态">
              <el-select v-model="listquery.state" placeholder="请选择启用状态" clearable>
                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t("common.search") }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
              </el-button>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 10px">
          <topOpts @add="addSupplier()" :isJudgePer="true" :addPerCode="'btn_add'" />

          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" highlight-current-row :data="tableData" row-key="id">

          <el-table-column prop="tableName" label="表名" >
            <template slot-scope="scope">
              <div @dblclick="changeEnddate(scope.$index, 'tableName', scope.row)"
                style="height: 40px;line-height: 40px;">
                <span v-show="!scope.row.editFlag">{{ scope.row.tableName }}</span>
                <el-input :ref='"enddateinput" + "tableName" + "&" + scope.$index'
                  @blur="switchShow(scope.$index, 'tableName')" clearable
                  @keyup.enter.native="$event.target.blur" v-show="scope.row.editFlag" size="mini"
                  v-model="scope.row.tableName"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="启用状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.states" active-color="#13ce66" inactive-color="#ff4949"
                @change="changeState(scope.row)" style="margin-left: 10px">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="createByName" label="创建人" />
              <el-table-column label="操作" width="100" >
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" @del="handleDel(scope.row.id)">
              
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listquery.pageNum" :background="background"
          :limit.sync="listquery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script>
import {
getbimDataCustomTableList,addbimDataCustomTableList,editbimDataCustomTableList,deletebimDataCustomTableList,detailbimDataCustomTableList
} from "@/api/masterDataManagement/index";
import Form from "./Form";
import moment from "moment";
import Sortable from 'sortablejs'

export default {
  name: "supplierProfile",
  components: { Form },
  data() {
    return {
      title: "更多查询",
      background: true, //分页器背景颜色 
      visible: false,
      listquery: {},
      initQuery: {
        state: "enable",
        pageNum: 1,
        pageSize: 20,
        tableName: '',
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: true,
            column: "create_time",
          },
        ],
      },
      stateList: [
        {
          label: "启用",
          value: "enable"
        }, {
          label: "禁用",
          value: "disabled"
        },
      ],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      total: 0,
      formVisible: false,
    };
  },

  created() {
    this.listquery = JSON.parse(JSON.stringify(this.initQuery))

    this.initData()
  },
  mounted() {
  },
  methods: {
    
    // 切换input框的显示状态
    switchShow(index, tag, tmp_this = this) {
      // 因为涉及到调用不同名称的变量, 不清楚怎么写, 只能先用switch case解决
      console.log(tag);
      switch (tag) {
        case "tableName":
          this.tableData[index].editFlag = false
          // tmp_this.tableData[index].editFlag = !tmp_this.tableData[index].editFlag;
          break;

        // ...
      }
      tmp_this.tableData = [...tmp_this.tableData];//因为我table绑定的表格数据是后接过来赋值的，所以需要这步操作，如果没有1、2步骤这个可以不加。后面也一样
      let obj = {
        state: this.tableData[index].state,
        tableName: this.tableData[index].tableName,
        id: this.tableData[index].id,
      }
      editbimDataCustomTableList(obj).then(response => {
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

    // 显示input框, 使光标焦点当前input框
    changeEnddate(index, tag, rowdata) {
      console.log(12342134, index, tag, rowdata);
      this.tableData[index].editFlag = true
      // this.switchShow(index, tag, this);
      // console.log('enddateinput' + index, typeof 'enddateinput' + index);
      // console.log(rowdata, typeof rowdata);
      // setTimeout( ()=> {  //定时器是为了避免没有获取到dom的情况报错，所以象征性的给1毫秒让他缓冲
      //   this.$refs['enddateinput' + tag + '&' + index].focus()
      //   //el-input的autofocus失效，所以用这个方法。对应在template里的refs绑定值
      // }, 1)
    },






    // 修改显示状态
    changeState(e) {
      console.log(e);
      let obj = {
        state: e.states == true ? 'enable' : 'disabled',
        id: e.id,
        tableName: e.tableName,
      }
      editbimDataCustomTableList(obj).then(res => {
        this.initData();
        this.$message.success("修改显示状态成功")
      })
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false;
      if (isRefresh) {
        this.keyword = "";
        this.initData();
      }
    },



    initData() {
      this.listLoading = true;
      getbimDataCustomTableList(this.listquery)
        .then((res) => {
          res.data.records.forEach(item => {
            item.editFlag = false
            if (item.state == "enable") {
              item.states = true
            } else {
              item.states = false
            }
          });
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
          this.visible = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    search() {

      this.listquery.pageNum = 1;
      this.initData();
    },
    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮

      this.listquery = JSON.parse(JSON.stringify(this.initQuery))
      this.search()
    },


    addSupplier() {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init('', 'add');
      });
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true;
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, type);
        });
        // }, 600);
      }
    },

    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          deletebimDataCustomTableList(id).then((res) => {
            this.initData();
            this.$message({
              type: "success",
              message: "删除成功",
              duration: 1500,
            });
          });
        })
        .catch(() => { });
    },
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, btnType);
      });
    },
  },
};
</script>
<style scoped>
.JNPF-common-layout-left {
  /* margin-right: 0; */
  /* border-right: 1px solid #cacaca; */
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 40px !important;
  line-height: 40px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>