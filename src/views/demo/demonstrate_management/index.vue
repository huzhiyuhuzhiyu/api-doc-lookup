<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="系统名称">
              <el-input v-model="query.name" placeholder="请输入" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统版本">
              <el-input
                v-model="query.sysVersion"
                placeholder="请输入"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()"
                >查询
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addOrUpdateHandle()"
              >新增
            </el-button>
          </div>
          <!-- <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link
                                icon="icon-ym icon-ym-filter JNPF-common-head-icon"
                                :underline="false"
                                @click="openSuperQuery()"
                            />
                        </el-tooltip>
                        <el-tooltip
                            effect="dark"
                            :content="$t('common.refresh')"
                            placement="top"
                        >
                            <el-link
                                icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                                :underline="false"
                                @click="initData()"
                            />
                        </el-tooltip>
                    </div> -->
        </div>
        <JNPF-table
          v-loading="listLoading"
          :data="list"
          @sort-change="sortChange"
          :span-method="arraySpanMethod"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: '' }"
          default-expand-all
          custom-column
        >
          <el-table-column
            prop="name"
            label="系统名称"
            align="left"
            min-width="120"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="sysVersion"
            label="系统版本"
            align="left"
            width="120"
            sortable
          />
          <el-table-column
            prop="categoryName"
            label="所属分类"
            align="left"
            width="120"
          />
          <el-table-column
            prop="sysPic"
            label="系统图片"
            align="left"
            width="120"
          >
            <template slot-scope="scope">
              <el-image
                :src="define.comUrl + scope.row.sysPic"
                :preview-src-list="[define.comUrl + scope.row.sysPic]"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="sysIntroduce"
            label="系统介绍"
            align="left"
            width="120"
          />
          <el-table-column
            prop="sysUrl"
            label="系统地址"
            align="left"
            width="120"
          />
          <el-table-column
            prop="accountCode"
            label="账号"
            align="left"
            width="120"
          />
          <el-table-column
            prop="remark"
            label="备注"
            align="left"
            width="120"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="left"
            width="170"
            sortable
          />
          <el-table-column
            prop="createByName"
            label="创建人"
            align="left"
            width="120"
          />
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)"
                >编辑
              </el-button>
              <el-button
                type="text"
                class="JNPF-table-delBtn"
                @click="handleDel(scope.row.id)"
                >删除
              </el-button>
              <el-button type="text" @click="goDetail(scope.row.id)"
                >详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <Detail
      v-if="detailVisible"
      ref="Detail"
      @refresh="detailVisible = false"
    />
    <SuperQuery
      v-if="superQueryVisible"
      ref="SuperQuery"
      :columnOptions="superQueryJson"
      @superQuery="superQuery"
    />
  </div>
</template>

<script>
import request from "@/utils/request"
import JNPFForm from "./Form"
import ExportBox from "./ExportBox"
import Detail from "./Detail"
import columnList from "./columnList"
import SuperQuery from "@/components/SuperQuery"
import superQueryJson from "./superQueryJson"

export default {
  components: { JNPFForm, ExportBox, Detail, SuperQuery },
  data() {
    return {
      expandObj: {},
      columnOptions: [],
      mergeList: [],
      columnList: [],
      seq: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],

      superQueryVisible: false,
      superQueryJson,
      detailVisible: false,
      time: "",
      query: {
        name: undefined,
        sysVersion: undefined,
        startTime: undefined,
        endTime: undefined
      },
      treeProps: {
        children: "children",
        label: "fullName",
        value: "id"
      },
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        superQueryJson: "",
        pageNum: 1,
        pageSize: 20,
        sort: "desc",
        sidx: ""
      },
      formVisible: false,
      exportBoxVisible: false,
      parentIdOptions: [],
      parentIdProps: {
        label: "fullName",
        value: "id",
        children: "children"
      }
    }
  },
  computed: {
    menuId() {
      return this.$route.meta.modelId || ""
    }
  },
  created() {
    this.columnList = columnList.filter((o) => o.__vModel__ !== "parentId")
    this.getColumnList()
    this.initData()
  },
  methods: {
    getColumnList() {
      // 没有开启权限
      //  this.columnOptions = this.transformColumnList(this.columnList);
      this.columnOptions = this.transformColumnToTree(this.columnList)
    },
    transformColumnToTree(data) {
      // 处理数据逻辑
      var addChild = function(arr, rec) {
        for (var j = 0; j < arr.length; j++) {
          var ele = arr[j]

          if (ele.id == rec.parentId) {
            if (!ele.children) {
              ele.children = []
            }
            ele.children.push(rec)
            return true
          }
          if (ele.children) {
            if (addChild(ele.children, rec)) {
              return true
            }
          }
        }
      }
      //递归组合上下级数据
      for (var i = 0; i < data.length; i++) {
        var rec = data[i]
        var parentId = rec.id
        if (parentId !== "-1") {
          if (addChild(data, rec)) {
            data.splice(i, 1)
            i--
          }
        }
      }

      // 返回所需的数据
      return data
    },
    // transformColumnList(columnList) {
    //     let list = []
    //     for (let i = 0; i < columnList.length; i++) {
    //         const e = columnList[i]
    //         if (!e.prop.includes('-')) {
    //             list.push(e)
    //         } else {
    //             let prop = e.prop.split('-')[0]
    //             let label = e.label.split('-')[0]
    //             let vModel = e.prop.split('-')[1]
    //             let newItem = {
    //                 align: 'center',
    //                 jnpfKey: 'table',
    //                 prop,
    //                 label,
    //                 children: []
    //             }
    //             e.vModel = vModel
    //             if (!this.expandObj.hasOwnProperty(`${prop}Expand`)) {
    //                 this.$set(this.expandObj, `${prop}Expand`, false)
    //             }
    //             if (!list.some((o) => o.prop === prop)) list.push(newItem)
    //             for (let i = 0; i < list.length; i++) {
    //                 if (list[i].prop === prop) {
    //                     list[i].children.push(e)
    //                     break
    //                 }
    //             }
    //         }
    //     }
    //     this.getMergeList(list)
    //     return list
    // },
    arraySpanMethod({ column }) {
      for (let i = 0; i < this.mergeList.length; i++) {
        if (column.property == this.mergeList[i].prop) {
          return [this.mergeList[i].rowspan, this.mergeList[i].colspan]
        }
      }
    },
    getMergeList(list) {
      let newList = JSON.parse(JSON.stringify(list))
      newList.forEach((item) => {
        if (item.children && item.children.length) {
          let child = {
            prop: item.prop + "-child-first"
          }
          item.children.unshift(child)
        }
      })
      newList.forEach((item) => {
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
    goDetail(id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.Detail.init(id)
      })
    },
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == "ascending" ? "asc" : "desc"
      this.listQuery.sidx = !order ? "" : prop
      this.initData()
    },
    initData() {
      this.listLoading = true
      Object.keys(this.query).forEach((key) => {
        let item = this.query[key]
        this.query[key] = typeof item === "string" ? item.trim() : item
      })
      let _query = {
        ...this.listQuery,
        ...this.query
      }
      request({
        url: `/api/crm/bim/demo/sys/list`,
        method: "post",
        data: _query
      }).then((res) => {
        this.list = res.data.records
        this.list.forEach((item) => {
          item.sysPic = JSON.parse(item.sysPic).map((it) => {
            return it.url
          })
        })

        this.total = res.data.total
        this.listQuery.pageSize = res.data.size
        this.listLoading = false
      })
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        type: "warning"
      })
        .then(() => {
          request({
            url: `/api/crm/bim/demo/sys/remove/${id}`,
            method: "DELETE"
          }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功",
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => {})
    },
    openSuperQuery() {
      this.superQueryVisible = true
      this.$nextTick(() => {
        this.$refs.SuperQuery.init()
      })
    },
    superQuery(queryJson) {
      this.listQuery.superQueryJson = queryJson
      this.listQuery.pageNum = 1
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
        url: `/api/jx/KnowledgeCategory/Actions/Export`,
        method: "post",
        data: query
      }).then((res) => {
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url)
        this.$refs.ExportBox.visible = false
        this.exportBoxVisible = false
      })
    },
    search() {
      this.query.startTime = this.jnpf.toDate(
        this.time[0],
        "yyyy-MM-dd HH:mm:ss"
      )
      this.query.endTime = this.jnpf.toDate(this.time[1], "yyyy-MM-dd HH:mm:ss")
      if (!this.query.startTime) delete this.query.startTime
      if (!this.query.endTime) delete this.query.endTime

      this.listQuery.pageNum = 1
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
      this.time = []
      this.search()
    }
  }
}
</script>
