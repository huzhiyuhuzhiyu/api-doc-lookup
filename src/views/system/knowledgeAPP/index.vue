<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()"></topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" max-height="100%">
          <el-table-column prop="name" label="版本名称" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" />

          <el-table-column prop="type" label="类型" />
          <el-table-column prop="version" label="版本号" />
          <el-table-column prop="remark" label="备注" />
          <!-- <el-table-column prop="enabledMark" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark==1?'success':'warning'" disable-transitions>
                {{ scope.row.enabledMark==1?'已发送':'存草稿' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)"
                :editDisabled="scope.row.enabledMark != 0">
                <el-dropdown>
                  <el-button type="text" size="mini">
                    {{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleView(scope.row.id)">
                      详情</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.enabledMark == 0"
                      @click.native="handlePublish(scope.row.id)">发布
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="formVisible = false" @refreshDataList="initData" />
    <ViewNotice v-if="viewVisible" ref="View" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getAppList, delNotice, releaseNotice } from '@/api/system/knowledgeApp'
import Form from './Form'
import ViewNotice from './View'

export default {
  name: 'system-notice',
  components: { Form, ViewNotice },
  data() {
    return {
      list: [],
      total: 0,
      btnLoading: false,
      listLoading: true,
      listQuery: {
        keyword: '',
        pageNum: 1,
        pageSize: 20
      },
      formVisible: false,
      viewVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      getAppList(this.listQuery).then(res => {
        console.log(res, 'res');
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    handleView(id) {
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.View.init(id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delNotice(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    handlePublish(id) {
      this.$confirm('您确定要发布当前公告, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        releaseNotice(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    search() {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 20
      this.listQuery.sort = 'desc'
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    }
  }
}
</script>