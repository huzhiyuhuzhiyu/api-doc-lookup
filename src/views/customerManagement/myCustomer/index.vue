<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.code" @keyup.enter.native="search()" placeholder="请输入客户编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.name" @keyup.enter.native="search()" placeholder="请输入客户名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.phone" @keyup.enter.native="search()" placeholder="请输入手机" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
              @click="visible = true">更多查询</el-button>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle('', 'add')">
              <el-button type="primary" icon="el-icon-bangzhu" @click="releaseFun">释放</el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table hasC @selection-change="handeleInfoData" ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
            custom-column>
            <el-table-column prop="code" label="客户编码" sortable="custom" />
            <el-table-column prop="name" label="客户名称" sortable="custom" />
            <el-table-column prop="lxr" label="联系人" sortable="custom" />
            <el-table-column prop="tel" label="电话" sortable="custom" />
            <el-table-column prop="phone" label="手机" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180"/>
            <el-table-column prop="createByName" label="创建人" />
            <el-table-column label="操作" min-width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id,'edit')">转为正式</el-button>
                <el-button size="mini" type="text" @click="handleRecord(scope.row)">写记录</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData">
          </pagination>
        </div>
      </div>
    </div>

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="listQuery.code" placeholder="请输入客户编码" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.name" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="listQuery.contacts" placeholder="请输入联系人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="listQuery.phone" placeholder="请输入电话" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="listQuery.mobilePhone" placeholder="请输入手机" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" format="yyyy-MM-dd hh:mm:ss"
                value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;" start-placeholder="开始时间" end-placeholder="结束时间"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索</el-button>
      </span>
    </el-dialog>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <RecordForm v-if="recordFormVisible" ref="RecordForm" @close="closeForm" />

  </div>
</template>

<script>
import { getPartnerList , releasePartner } from '@/api/customerManagement/index'
import Form from './Form'
import RecordForm from './RecordForm'
export default {
  name: 'myCustomer',
  components: { Form , RecordForm },
  data() {
    return {
      recordFormVisible:false,
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      initListQuery: {
        code: "",
        contacts: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        mobilePhone: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        phone: "",
        customerStatus: 'private_sea',
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        createTimeArr: [],
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      selectData:[],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    handeleInfoData(val){
      this.selectData = val
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getPartnerList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.recordFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },

    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    // 写记录
    handleRecord(row) {
      this.recordFormVisible = true
      this.$nextTick(()=>{
        this.$refs.RecordForm.init(row.id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    releaseFun(){
      if (this.selectData.length){
        let idList = this.selectData.map(item=>item.id)
        releasePartner(idList).then(res=>{
          this.initData()
          this.$message({
            type:'success',
            message: "释放成功",
            duration: 1500,
          })
        }).catch(()=>{})
      }else{
        this.$message.warning('请选择您要释放的客户数据！')
      }     
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
