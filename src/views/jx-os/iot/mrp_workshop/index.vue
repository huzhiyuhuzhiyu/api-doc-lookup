<template>

  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="6">
            <el-form-item label="上级车间">
              <JNPFTreeSelect v-model="query.parentId" placeholder="请选择" :options="parentIdOptions"
                :props="parentIdProps" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车间名称">
              <el-input v-model="query.name" placeholder="请输入" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="openSuperQuery()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" row-key="id"
          :tree-props="{children: 'children', hasChildren: ''}" default-expand-all>
          <el-table-column prop="name" label="车间名称" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.top">{{scope.row.name}}</span>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="left" />
          <el-table-column prop="employeeName" label="负责人" align="left" />
          <el-table-column prop="creatortime" label="创建时间" align="left" />
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <template v-if="!scope.row.top">
                <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                </el-button>
              </template>

            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false" />
    <SuperQuery v-if="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuery" />
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {
    getDictionaryDataSelector
  } from '@/api/systemData/dictionary'
  import JNPFForm from './Form'
  import ExportBox from './ExportBox'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  import Detail from './Detail'
  import columnList from './columnList'
  import SuperQuery from '@/components/SuperQuery'
  import superQueryJson from './superQueryJson'

  export default {
    components: {
      JNPFForm,
      ExportBox,
      Detail,
      SuperQuery
    },
    data() {
      return {
        expandObj: {},
        columnOptions: [],
        mergeList: [],
        columnList,

        superQueryVisible: false,
        superQueryJson,
        detailVisible: false,
        query: {
          parentId: -1,
          name: undefined,
        },
        treeProps: {
          children: 'children',
          label: 'fullName',
          value: 'id'
        },
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          superQueryJson: '',
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        formVisible: false,
        exportBoxVisible: false,
        parentIdOptions: [],
        parentIdProps: {
          "label": "name",
          "value": "id",
          "children": "children"
        },
      }
    },
    computed: {
      menuId() {
        return this.$route.meta.modelId || ''
      }
    },
    created() {
      this.getColumnList(),
        this.initData()
      this.getparentIdOptions();
    },
    methods: {
      getColumnList() {
        // 没有开启权限
        this.columnOptions = this.transformColumnList(this.columnList)
      },
      transformColumnList(columnList) {
        let list = []
        for (let i = 0; i < columnList.length; i++) {
          const e = columnList[i];
          if (!e.prop.includes('-')) {
            list.push(e)
          } else {
            let prop = e.prop.split('-')[0]
            let label = e.label.split('-')[0]
            let vModel = e.prop.split('-')[1]
            let newItem = {
              align: "center",
              jnpfKey: "table",
              prop,
              label,
              children: []
            }
            e.vModel = vModel
            if (!this.expandObj.hasOwnProperty(`${prop}Expand`)) this.$set(this.expandObj, `${prop}Expand`, false)
            if (!list.some(o => o.prop === prop)) list.push(newItem)
            for (let i = 0; i < list.length; i++) {
              if (list[i].prop === prop) {
                list[i].children.push(e)
                break
              }
            }
          }
        }
        this.getMergeList(list)
        return list
      },
      arraySpanMethod({
        column
      }) {
        for (let i = 0; i < this.mergeList.length; i++) {
          if (column.property == this.mergeList[i].prop) {
            return [this.mergeList[i].rowspan, this.mergeList[i].colspan]
          }
        }
      },
      getMergeList(list) {
        let newList = JSON.parse(JSON.stringify(list))
        newList.forEach(item => {
          if (item.children && item.children.length) {
            let child = {
              prop: item.prop + '-child-first'
            }
            item.children.unshift(child)
          }
        })
        newList.forEach(item => {
          if (item.children && item.children.length) {
            item.children.forEach((child, index) => {
              if (index == 0) {
                this.mergeList.push({
                  prop: child.prop,
                  rowspan: 1,
                  colspan: item.children.length
                })
              } else {
                this.mergeList.push({
                  prop: child.prop,
                  rowspan: 0,
                  colspan: 0
                })
              }
            })
          } else {
            this.mergeList.push({
              prop: item.prop,
              rowspan: 1,
              colspan: 1
            })
          }
        })
      },
      getparentIdOptions() {
        getDataInterfaceRes('342715607101211205').then(res => {
          let data = res.data
          this.parentIdOptions = data
        })
      },
      goDetail(id) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.Detail.init(id)
        })
      },
      sortChange({
        column,
        prop,
        order
      }) {
        this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
        this.listQuery.sidx = !order ? '' : prop
        this.initData()
      },
      initData() {
        this.listLoading = true;
        let _query = {
          ...this.listQuery,
          ...this.query,
          keyword: this.keyword,
          dataType: 0,
          menuId: this.menuId
        };
        request({
          url: `/api/mrp_workshop/Mrp_workshop/getList`,
          method: 'post',
          data: _query
        }).then(res => {
          var _list = [];
          console.log(res.data);
          for (let i = 0; i < res.data.length; i++) {
            let _data = res.data[i];
            _list.push(_data)
          }
          this.list = _list.map(o => ({
            top: o.children.length>0?true:false,
            ...o
          }))



          this.listLoading = false
        })
      },
      handleDel(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          request({
            url: `/api/mrp_workshop/Mrp_workshop/${id}`,
            method: 'DELETE'
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.msg,
              onClose: () => {
                this.initData()
              }
            });
          })
        }).catch(() => {});
      },
      openSuperQuery() {
        this.superQueryVisible = true
        this.$nextTick(() => {
          this.$refs.SuperQuery.init()
        })
      },
      superQuery(queryJson) {
        this.listQuery.superQueryJson = queryJson
        this.listQuery.currentPage = 1
        this.initData()
      },
      addOrUpdateHandle(id, isDetail) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, isDetail)
        })
      },
      exportData() {
        this.exportBoxVisible = true
        this.$nextTick(() => {
          this.$refs.ExportBox.init(this.columnList)
        })
      },
      download(data) {
        let query = {
          ...data,
          ...this.listQuery,
          ...this.query,
          menuId: this.menuId
        }
        request({
          url: `/api/mrp_workshop/Mrp_workshop/Actions/Export`,
          method: 'post',
          data: query
        }).then(res => {
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
          this.$refs.ExportBox.visible = false
          this.exportBoxVisible = false
        })
      },
      search() {
        this.listQuery.currentPage = 1
        this.listQuery.pageSize = 20
        this.listQuery.sort = "desc"
        this.listQuery.sidx = ""
        this.initData()
      },
      refresh(isrRefresh) {
        this.formVisible = false
        if (isrRefresh) this.reset()
      },
      reset() {
        for (let key in this.query) {
          this.query[key] = undefined
        }
        this.query.parentId = -1;
        this.search()
      }
    }
  }
</script>
