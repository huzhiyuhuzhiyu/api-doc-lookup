<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.equipmentIdCode" placeholder="请输入设备编码" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.equipmentIdName" placeholder="请输入设备名称" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
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
        <JNPF-table v-if="istable" ref="dataTable" :data="tableData" @sort-change="sortChange" custom-column customKey="JNPFTableKey_766379">
          <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" sortable="custom" />
          <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName"/>
          <el-table-column prop="faultTypeName" label="故障类型名称" min-width="160" />
          <el-table-column prop="faultLocationName" label="故障部位名称" min-width="160" />
          <el-table-column prop="frontPicList" label="故障情况照片" min-width="140">
            <template slot-scope="scope">
              <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.frontPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="faultDescription" label="故障描述" min-width="160" />
          <el-table-column prop="solutionMeasures" label="解决措施" min-width="200"></el-table-column>
          <el-table-column prop="afterPicList" label="维修完成拍照" min-width="160">
            <template slot-scope="scope">
              <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.afterPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id,'edit')" @del="handleDel(scope.row.id)">
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
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { equEquipmentRepairKnowledgeList, deleteequEquipmentRepairKnowledge } from '@/api/dailyManagement/Maintenance'
import Form from './Form.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
export default {
  mixins: [getProjectList],
  name: 'maintenanceknowledgeBase',
  components: { SuperQuery, Form },
  data() {
    return {
      istable: false,
      isProjectSwitch: '',
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'equipmentIdCode',
          label: "设备编码",
          type: 'input'
        },
        {
          prop: 'equipmentIdName',
          label: "设备名称",
          type: 'input'
        },
        {
          prop: 'faultTypeName',
          label: "故障类型名称",
          type: 'input'
        },
        {
          prop: 'faultLocationName',
          label: "故障部位名称",
          type: 'input'
        },
        {
          prop: 'faultDescription',
          label: "故障描述",
          type: 'input'
        },
        {
          prop: 'solutionMeasures',
          label: "解决措施",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ],
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      tableData: [],
      listLoading: false,
      orderForm: {
        projectId: '',
        classAttribute: "equipment",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      total: 0,
      formVisible: false,
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.istable = true
    this.initData()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.dataFormSubmit()
    },
    bigimg(url) {
      this.srcList[0] = url
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'equipmentIdCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    dataFormSubmit() {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      equEquipmentRepairKnowledgeList(this.orderForm).then(res => {
        this.tableData = res.data.records.map(item => {
          if (item.frontPic) {
            item.frontPicList = item.frontPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          if (item.afterPic) {
            item.afterPicList = item.afterPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          return item
        })
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.orderForm = {
        classAttribute: "equipment",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      }
      this.dataFormSubmit()
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype,)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteequEquipmentRepairKnowledge(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  