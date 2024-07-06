<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left" :style="leftFlag ? 'width:15px;background:#fff' : ''" style="position: relative;" @cick="leftFlag?changeLeft:''">
      <div class="JNPF-common-title" style="display: block;padding:0">
        <div class="title_box">
          <h2 v-if="!leftFlag">业务分类</h2>
          <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
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
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">

            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute" >
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>  
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute" >
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>  
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent :rules="rules">
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="form.businessCode" placeholder="请输入业务编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="form.businessName" placeholder="请输入业务名称" clearable />
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
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
         
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" highlight-current-row :data="tableData" row-key="id"  custom-column :hasNO="false">
          <!-- <el-table-column prop="code" label="分类名称"> </el-table-column> -->
          <el-table-column align="center" label="拖动" width="60">
            <template>
              <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" disabled title='点击拖动' />
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column prop="attributeName" label="属性名称" width="130px">
          </el-table-column>
          
          <el-table-column prop="businessCode" label="业务代码" width="100px" /> 
          <el-table-column prop="businessName" label="业务名称" width="100px" />
          <el-table-column prop="defaultDisplayName" label="默认显示名称" width="120"/>
          <el-table-column prop="customDisplayName" label="自定义显示名称" width="160">
            <template slot-scope="scope">
              <div @click="changeEnddate(scope.$index, 'customDisplayName', scope.row)"
                >
                <span v-show="!scope.row.editFlag">{{ scope.row.customDisplayName?scope.row.customDisplayName:'-' }}</span>
                <el-input :ref='"enddateinput" + "customDisplayName" + "&" + scope.$index'
                  @blur="switchShow(scope.$index, 'customDisplayName')" clearable
                  @keyup.enter.native="$event.target.blur" v-show="scope.row.editFlag" size="mini"
                  v-model="scope.row.customDisplayName"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="displayState" label="显示状态" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949"
                @change="changeState(scope.row)" style="margin-left: 10px">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="createByName" label="创建人" />
          <!-- <el-table-column label="操作" width="180" >
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" @edit="addOrUpdateHandle(scope.row.id, 'edit')">
              
              </tableOpts>
            </template>
          </el-table-column> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script>
import {
  getColumnList, editColumnList, addColumnList, checkAttributeexist, detailColumnList, batchAttributeSort, editAttributState
} from "@/api/masterDataManagement/index";
import {
  checkBusinessListCategoryCode, detailBusinessListCategoryAPI, delBusinessListCategoryAPI, editBusinessListCategoryAPI, addBusinessListCategoryAPI, getBusinessListCategoryAPI
} from "@/api/masterDataManagement/index.js";
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
      activeName: "supplierPage",
      visible: false,
      treeData: [],
      initListQuery: {
        code: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: -1,
        pageSize: -1,
      },
      listQuery: {},
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      form: {
        listCategoryId: "",
        businessCode: "",
        businessName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: true,
            column: "sort",
          },
        ],
      },

      gradeList: [],
      defaultProps: {
        children: "childrenList",
        label: "name",
      },
      rules: {
        code: [
          {}
        ]
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: "",
      leftFlag: false,
      btnTitle: "向左收起"
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    if (localStorage.getItem("expandsFlag")) {
      let expandsFlag = JSON.parse(localStorage.getItem('expandsFlag'))
      this.expands = expandsFlag
      console.log("expandsFlag", expandsFlag);
      this.toggleExpand(expandsFlag)

    }
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    this.getcategoryTree()
  },
  mounted() {
    this.rowDrop(); //声明表格拖动排序方法

  },
  methods: {
    columnSetFun(){ 
      console.log("this.$refs.dataTable",this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
     
    },
    // 设置默认展开
    setexpand(expands) {
      console.log("expands", expands);
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("expandsFlag", expands)

      })
    },
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
      })
    },
    findLastId(arr) {
      let currentItem = arr[0];

      while (currentItem.childrenList.length > 0) {
        currentItem = currentItem.childrenList[0];
      }

      return currentItem.id;
    },
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      getBusinessListCategoryAPI(this.listQuery).then(res => {
        console.log("res=>", res);
        this.treeData = res.data.length ? res.data : []
        this.$nextTick(() => {
          let id = this.findLastId(this.treeData)
          console.log("id", id);
          this.$refs.treeBox.setCurrentKey(id) // 默认选中节点第一个
          this.form.listCategoryId = id
          this.treeLoading = false
          this.initData()
        })

      }).catch(() => {
        this.treeLoading = false
        this.listLoading = false
      })
    },

    // 切换input框的显示状态
    switchShow(index, tag, tmp_this = this) {
      // 因为涉及到调用不同名称的变量, 不清楚怎么写, 只能先用switch case解决
      console.log(tag);
      switch (tag) {
        case "customDisplayName":
          this.tableData[index].editFlag = false
          // tmp_this.tableData[index].editFlag = !tmp_this.tableData[index].editFlag;
          break;

        // ...
      }
      tmp_this.tableData = [...tmp_this.tableData];//因为我table绑定的表格数据是后接过来赋值的，所以需要这步操作，如果没有1、2步骤这个可以不加。后面也一样
      let obj = {
        attributeName: this.tableData[index].attributeName,
        customDisplayName: this.tableData[index].customDisplayName,
        defaultDisplayName: this.tableData[index].defaultDisplayName,
        displayState: this.tableData[index].displayState,
        id: this.tableData[index].id,
        listCategoryId: this.tableData[index].listCategoryId,
        sort: this.tableData[index].sort,
      }
      editColumnList(obj).then(response => {
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
      console.log(1111);
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

    rowDrop() {
      const el = this.$refs.dataTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
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
              sort: index,
              attributeName: item.attributeName
            }
            att.push(obj)
          });
          console.log(att);
          batchAttributeSort(att).then(res => {
            this.$message.success("批量修改排序成功")
            this.initData()

          })
        }
      });
    },
    // 修改显示状态
    changeState(e) {
      console.log(e);
      let obj = {
        attributeName: e.attributeName,
        customDisplayName: e.customDisplayName,
        displayState: e.state == true ? 'show' : 'hidden',
        id: e.id,
        listCategoryId: e.listCategoryId,
        sort: e.sort,
      }
      editAttributState(obj).then(res => {
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

    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },


    initData() {
      console.log(this.form);
      this.listLoading = true;
      getColumnList(this.form)
        .then((res) => {
          console.log("res++", res);
          res.data.records.forEach(item => {
            item.editFlag = false
            if (item.displayState == "show") {
              item.state = true
            } else {
              item.state = false
            }
          });
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
          this.visible = false;
          console.log(this.tableData);
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    search() {

      this.form.pageNum = 1;
      this.initData();
    },
    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮

      this.form = {
        code: '',
        name: "",
        typeCode: this.treeData[0].code,
        pageNum: 1,
        pageSize: 20,
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

      this.search()
      this.getcategoryTree()
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.form.listCategoryId = node.data.id
      this.search();
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
          delBimProductAttributes(id).then((res) => {
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

.JNPF-common-layout-left {
  margin-right: 5px;

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
.retract{
  position: absolute;
    right: -7px;
    top: 95px;
    /* font-size: 20px; */
    z-index: 999;
    width:20px;
    height:20px
}

.JNPF-common-layout-left:hover .retract ::v-deep .el-button--text{
  color: #999!important;
  border: 1px solid #999!important;

}
.JNPF-common-layout-left .retract ::v-deep .el-button--text:hover{
  border: 1px solid #3fb9f8!important;

}
.JNPF-common-layout-left:hover .retract ::v-deep .el-button--text  .el-icon-arrow-left{
  font-size: 15px!important;
  color: #999!important;
}
.JNPF-common-layout-left .retract ::v-deep .el-button--text{
  border-radius: 50%;
    border: 1px solid transparent;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    padding: 0;
    padding-top: 2px;
}
.JNPF-common-layout-left .retract ::v-deep .el-button--text .el-icon-arrow-left:hover {
  font-size: 15px!important;

  color:#3fb9f8!important;
  /* background:#3fb9f8!important; */
  border-radius: 50%
}

.retract ::v-deep .el-button--text .el-icon-arrow-left{
  font-size: 15px!important;
  color: transparent!important
  /* color: #999!important */
}


.expand{
  position: absolute;
    left: 0px;
    top: 95px;
    /* font-size: 20px; */
    z-index: 999;
    width:20px;
    height:20px
}
.JNPF-common-layout-left:hover .expand ::v-deep .el-button--text{
  color: #999!important;
  border: 1px solid #999!important;

}
.JNPF-common-layout-left .expand ::v-deep .el-button--text:hover{
  border: 1px solid #3fb9f8!important;

}
.JNPF-common-layout-left:hover .expand ::v-deep .el-button--text  .el-icon-arrow-right{
  font-size: 15px!important;
  color: #999!important;
}
.JNPF-common-layout-left .expand ::v-deep .el-button--text{
  border-radius: 50%;
    border: 1px solid transparent;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    padding: 0;
    padding-top: 2px;
}
.JNPF-common-layout-left .expand ::v-deep .el-button--text .el-icon-arrow-right:hover {
  font-size: 15px!important;

  color:#3fb9f8!important;
  /* background:#3fb9f8!important; */
  border-radius: 50%
}

.expand ::v-deep .el-button--text .el-icon-arrow-right{
  font-size: 15px!important;
  color: transparent!important
  /* color: #999!important */
}
/* .el-table .cell */
</style>