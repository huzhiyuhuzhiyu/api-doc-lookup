<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-left">
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <div v-for="item in treeDatas" :key="item.name" class="left-foundation" :class="item.typeCode == actionname ? 'active' : ''" @click="activefoundation(item.typeCode)">{{
                        item.name }}
        </div>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'faultType'" key="1">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier(actionname, 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTablefaultType" :data="tableDataList" v-bind="tableDataList" hasNO fixedNO v-loading="listLoading" @sort-change="sortChange" custom-column>
          <el-table-column prop="code" label="编码" min-width="200">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="200" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="110" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')" @del="handleDel(scope.row.id, scope.row.parentId)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background" :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
      <!-- 高级查询 -->
      <SuperQuery :partentOrChild="actionname" :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'faultLocation'" key="2">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                $t('common.reset') }}
              </el-button>

            </el-form-item>

          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier(actionname, 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible1 = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <!-- <JNPF-table v-loading="listLoading" :data="tableDataList" row-key="id" v-if="refreshTable" :fixedNO="true"
                    @sort-change="sortChange" custom-column> -->
        <JNPF-table ref="dataTablefaultLocation" :data="tableDataList" v-bind="tableDataList" hasNO fixedNO v-loading="listLoading" @sort-change="sortChange" custom-column>
          <el-table-column prop="code" label="编码" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="200" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="110" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')" @del="handleDel(scope.row.id, scope.row.parentId)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- <el-empty description="暂无数据" :image-size="120" v-else></el-empty> -->
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background" :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
      <!-- 高级查询 -->
      <SuperQuery :partentOrChild="actionname" :show="superQueryVisible1" ref="SuperQuery1" :columnOptions="superQueryJson1" @superQuery="superQuerySearch1" @close="superQueryVisible1 = false" />
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'maintenanceItem'" key="3">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                $t('common.reset') }}
              </el-button>

            </el-form-item>

          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier(actionname, 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible2 = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <!-- <JNPF-table v-loading="listLoading" :data="tableDataList" row-key="id" v-if="refreshTable" :fixedNO="true"
                    @sort-change="sortChange" custom-column> -->
        <JNPF-table ref="dataTablemaintenanceItem" :data="tableDataList" custom-column v-bind="tableDataList" hasNO fixedNO v-loading="listLoading" @sort-change="sortChange">
          <el-table-column prop="code" label="编码" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="200" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="itemRequirements" label="要求" min-width="280" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="110" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')" @del="handleDel(scope.row.id, scope.row.parentId)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background" :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
      <!-- 高级查询 -->
      <SuperQuery :partentOrChild="actionname" :show="superQueryVisible2" ref="SuperQuery2" :columnOptions="superQueryJson2" @superQuery="superQuerySearch2" @close="superQueryVisible2 = false" />
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="actionname == 'inspectionItem'" key="4">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="请输入名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                $t('common.reset') }}
              </el-button>

            </el-form-item>

          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier(actionname, 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible3 = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <!-- <JNPF-table v-loading="listLoading" :data="tableDataList" row-key="id" v-if="refreshTable" :fixedNO="true"
                    @sort-change="sortChange" custom-column> -->
        <JNPF-table ref="dataTableinspectionItem" :data="tableDataList" v-bind="tableDataList" hasNO fixedNO v-loading="listLoading" custom-column @sort-change="sortChange">
          <el-table-column prop="code" label="编码" min-width="200">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, actionname, 'look')">{{
                                scope.row.code
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="200" sortable="custom" />
          <el-table-column prop="itemRequirements" label="要求" min-width="280" />
          <el-table-column prop="inspectionMethod" label="点检方法" min-width="280" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="110" />
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, actionname, 'edit')" @del="handleDel(scope.row.id, scope.row.parentId)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, actionname, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background" :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
      <!-- 高级查询 -->
      <SuperQuery :partentOrChild="actionname" :show="superQueryVisible3" ref="SuperQuery3" :columnOptions="superQueryJson3" @superQuery="superQuerySearch3" @close="superQueryVisible3 = false" />
    </div>
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>
  
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { parametersShelveslist, deleteparametersShelves } from '@/api/basicData/index'
import DepForm from './depForm'
export default {
  name: 'BasicParameters',
  components: { DepForm, SuperQuery },
  data() {
    return {
      superQueryVisible: false,
      superQueryVisible1: false,
      superQueryVisible2: false,
      superQueryVisible3: false,
      superQueryJson: [
        {
          prop: 'code',
          label: "编码",
          type: 'input'
        },
        {
          prop: 'name',
          label: "名称",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryJson1: [
        {
          prop: 'code',
          label: "编码",
          type: 'input'
        },
        {
          prop: 'name',
          label: "名称",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryJson2: [
        {
          prop: 'code',
          label: "编码",
          type: 'input'
        },
        {
          prop: 'name',
          label: "名称",
          type: 'input'
        },
        {
          prop: 'itemRequirements',
          label: "要求",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryJson3: [
        {
          prop: 'code',
          label: "编码",
          type: 'input'
        },
        {
          prop: 'name',
          label: "名称",
          type: 'input'
        },
        {
          prop: 'itemRequirements',
          label: "要求",
          type: 'input'
        },
        {
          prop: 'inspectionMethod',
          label: "点检方法",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      depFormVisible: false,
      background: true,//分页器背景颜色
      // visible: false,
      treeDatas: [
        { name: '故障类型', typeCode: 'faultType' },
        { name: '故障部位', typeCode: 'faultLocation' },
        { name: '保养项目', typeCode: 'maintenanceItem' },
        { name: '点检项目', typeCode: 'inspectionItem' }
      ],
      actionname: 'faultType',
      tableDataList: [],
      treeLoading: false,
      listLoading: false,
      // userRelationListVisible: false,
      // organizeIdTree: [],
      treeQuery: {
        code: "",
        name: ""
      },
      tableQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        typeCode: 'faultType',
        superQuery: {}
      },
      // gradeList: [],
      total: 0,
      // diagramVisible: false,
      // formVisible: false,
      // expands: true,
      expandsTable: true,
      // refreshTree: true,
      refreshTable: true,
    }
  },
  created() {
    // this.getWarehouseList(true)
    this.initData()
  },
  methods: {
    columnSetFun() {
      this.$refs['dataTable' + this.actionname].showDrawer()
    },
    superQuerySearch3(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible3 = false
      this.search()
    },
    superQuerySearch2(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible2 = false
      this.search()
    },
    superQuerySearch1(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible1 = false
      this.search()
    },
    superQuerySearch(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    activefoundation(typeCode) {
      this.tableQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        typeCode: typeCode,
        superQuery: {}
      }
      this.actionname = typeCode
      this.tableQuery.typeCode = typeCode
      this.$nextTick(() => {
        this.initData()
      })
    },
    sortChange({ prop, order }) {

      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.tableQuery.orderItems[0].asc = order !== 'descending'
      this.tableQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        // this.getWarehouseList(true)
        this.initData()
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // getWarehouseList(isInit) {
    //     this.treeLoading = true
    //     getWarehouseList(this.treeQuery).then(res => {
    //         console.log("树形结构", res);
    //         this.treeData = res.data
    //         this.$nextTick(() => {
    //             this.treeLoading = false
    //             if (isInit) this.initData()
    //         })
    //     }).catch(() => {
    //         this.treeLoading = false
    //     })
    // },
    initData() {
      this.listLoading = true
      parametersShelveslist(this.tableQuery).then(res => {
        console.log("故障类型表格", res);
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (index) {
          item.index = index + 1;
        }
        if (item.childrenList.length > 0) {
          this.setTableIndex(item.childrenList, item.index);
        }
      });
    },
    search() {
      Object.keys(this.tableQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.tableQuery[key]
        this.tableQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.tableQuery.pageNum = 1 // 重置页码
      this.initData()
    },
    reset() {
      this.$refs['dataTable' + this.actionname].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.tableQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        typeCode: this.actionname
      }
      if (this.actionname == 'faultType') {
        this.$refs.SuperQuery.conditionList = []
      } else if (this.actionname == 'faultLocation') {
        this.$refs.SuperQuery1.conditionList = []
      } else if (this.actionname == 'maintenanceItem') {
        this.$refs.SuperQuery2.conditionList = []
      } else if (this.actionname == 'inspectionItem') {
        this.$refs.SuperQuery3.conditionList = []
      }
      // this.getWarehouseList(true)
      this.search()
    },

    addSupplier(actionname, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', actionname, type)
      })
    },
    addOrUpdateHandle(id, actionname, btntype) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, actionname, btntype)
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteparametersShelves(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, parentId, btnType) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId, btnType)
      })
    }
  }
}
</script>
<style scoped>
/* ::v-deep .el-table-title{
    background: red !important;
} */
.common-table-list {
  border: none !important;
  border-top: 1px solid #ebeef5 !important;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-el-tree-scrollbar {
  padding: 20px 0px;
}

.left-foundation {
  text-align: center;
  line-height: 40px;
  /* border-radius: 5px; */
  cursor: pointer;
  margin-bottom: 5px;
  font-size: 16px;
}

.left-foundation:hover {
  background-color: #1890ff;
  opacity: 0.9;
}

.JNPF-common-layout-left {
  width: 180px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.active {
  background-color: #1890ff;
  color: #fff;
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
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>