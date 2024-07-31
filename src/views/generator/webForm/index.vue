<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2 >业务分类</h2>
          <span class="options" >
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                <!-- <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>  -->
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div > <el-input placeholder="输入关键字进行过滤" v-model="filterText"
            style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
          </el-input></div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">

            <span class="text" :title="data.fullName">{{ data.fullName }}</span>
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
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="所属分类">
              <el-select v-model="category" placeholder="请选择所属分类" clearable>
                <el-option v-for="item in categoryList" :key="item.id" :label="item.fullName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" size="mini" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="openAddBox()" addText="新建模板" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" custom-column ref="tabForm"  :setColumnDisplayList="columnList">
          <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="200" />
          <el-table-column prop="enCode" label="编码" width="200" />
          <el-table-column prop="category" label="分类" width="150" />
          <el-table-column prop="webType" label="模式" width="70" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.webType == 1">表单</span>
              <span v-if="scope.row.webType == 2">列表</span>
              <span v-if="scope.row.webType == 3">流程</span>
            </template>
          </el-table-column>
          <el-table-column prop="creatorUser" label="创建人" width="160" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat"
            width="160" />
          <el-table-column prop="lastModifyTime" label="最后修改时间" :formatter="jnpf.tableDateFormat"
            width="160" />
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="toggleWebType(scope.row)">更改模式
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="copy(scope.row.id)">复制模板</el-dropdown-item>
                    <el-dropdown-item @click.native="download(scope.row)">下载代码</el-dropdown-item>
                    <el-dropdown-item @click.native="preview(scope.row)">预览代码</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <AddBox :visible.sync="addVisible" :webType="currWebType" @add="handleAdd" />
    <Preview v-if="previewVisible" ref="preview" @close="previewVisible=false" />
    <DownloadForm v-if="downloadFormVisible" ref="downloadForm"
      @close="downloadFormVisible=false" />
  </div>
</template>

<script>
import Form from './Form'
import AddBox from '@/views/generator/AddBox'
import DownloadForm from '../DownloadForm'
import Preview from '../Preview'
import mixin from '@/mixins/generator/index'
import { getVisualDevList, Delete, Copy, exportData } from '@/api/onlineDev/visualDev'
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
  getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'generator-webForm',
  mixins: [mixin],
  components: { Form, AddBox, DownloadForm, Preview },
  data() {
    return {
      listQuery: { 
        type: 4,
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category:"",
        keyword:"",
      },
      previewVisible: false,
      downloadFormVisible: false,
      sort: 'webForm',
      leftFlag: false,
      treeLoading:false,
      expands: true,
      refreshTree: true,
      treeData: [],
      displayFlag:false,
      columnList:["startNumber","outputNumber","creatorUser","creatorTime","lastModifyTime","webType","category"],
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      filterText:"",
    }
  },
  mounted () {
    
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {
    this.getcategoryTree()
   
  },
  methods: {
    changeLeft() {
      this.leftFlag = !this.leftFlag
     
    },
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.listQuery.category = node.data.id
      this.search();
    },
    initData() {
      this.listLoading = true
     
      getVisualDevList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    search() {
      this.listQuery =  { 
        type: 4,
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        category:this.listQuery.category,
        keyword:"",
      },
      this.initData()
    },
    reset() {
    
      this.search()
    },
    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getbimProductAttributes('4173579c31e74a2b8749e65a23e5c957').then(res => {
        this.treeData = res.data.list.length?res.data.list:[]
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          this.listQuery.category = this.treeData[0].id
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
    download(row) {
      this.downloadFormVisible = true
      this.$nextTick(() => {
        this.$refs.downloadForm.init(row.tables, row.id)
      })
    },
    preview(row) {
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.preview.init(row.tables, row.id)
      })
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
.JNPF-common-head{
  padding:8px 10px
}
</style>
