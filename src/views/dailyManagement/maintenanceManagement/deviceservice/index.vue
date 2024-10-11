<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.maintenanceNo" placeholder="请输入维修单号" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
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
          <el-button style="float: right;margin-right: 10px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier('', 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO custom-column style="padding-bottom: 50px;">
          <el-table-column prop="maintenanceNo" label="维修单号" width="200" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.maintenanceNo
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="equipmentIdCode" label="设备编码" width="200" fixed="left" sortable="custom" />
          <el-table-column prop="equipmentIdName" label="设备名称" width="200" fixed="left" sortable="custom"></el-table-column>
          <el-table-column prop="factoryFloor" label="使用车间" width="120" />
          <el-table-column prop="mountedPlaces" label="安装地点" width="120" />
          <el-table-column prop="frontPicList" label="故障情况照片" width="120" />
          <el-table-column prop="faultStartTime" label="故障开始时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="degree" label="紧急程度" width="120" />
          <el-table-column prop="maintenancePersonnelName" label="维修负责人" width="120"></el-table-column>
          <el-table-column prop="departmentIdName" label="故障响应时长(小时)" width="120" />
          <el-table-column prop="departmentIdName" label="是否进行维修" width="120" />
          <el-table-column prop="departmentIdName" label="作废原因" width="120" />
          <el-table-column prop="departmentIdName" label="是否更换备件" width="120" />
          <el-table-column prop="reason" label="故障原因" width="120" />
          <el-table-column prop="solutionMeasures" label="解决措施" min-width="200"></el-table-column>
          <el-table-column prop="afterPicList" label="维修完成拍照" min-width="200"></el-table-column>
          <el-table-column prop="startMaintenanceTime" label="开始维修时间" width="180"></el-table-column>
          <el-table-column prop="repairCompletionTime" label="维修完成时间" width="180"></el-table-column>
          <el-table-column prop="maintenanceDuration" label="维修时长" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="solutionMeasures" label="是否修复" min-width="200"></el-table-column>
          <el-table-column prop="equipmentState" label="设备状态" min-width="200"></el-table-column>
          <el-table-column prop="departmentIdName" label="申请部门" width="120" />
          <el-table-column prop="applicantIdName" label="申请人" width="120"></el-table-column>
          <el-table-column prop="applicationDate" label="申请日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 'toBeMaintain'"><el-tag type="danger">待维修</el-tag></div>
              <div v-else-if="scope.row.state == 'maintaining'"><el-tag type="warning">正在维修</el-tag></div>
              <div v-else-if="scope.row.state == 'maintained'"><el-tag type="success">已维修</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="scope.row.state != 'toBeMaintain'" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.state === 'maintaining'" @click="handleDel(scope.row.id)">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'start')" :disabled="scope.row.state != 'toBeMaintain'">
                    审核派工
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'end')" :disabled="scope.row.state != 'maintaining'">
                    维修
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import { RepairRequestList, deleteRepairRequest } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
export default {
  name: 'deviceservice',
  components: { Form, },
  data() {
    return {
      visible: false,
      faultStartTime: [],
      submitDate: [],
      tableData: [],
      orderDateArr: [],
      listLoading: false,
      stateList: [
        { label: "待维修", value: "toBeMaintain" },
        { label: "正在维修", value: "maintaining" },
        { label: "已维修", value: "maintained" }
      ],
      orderForm: {
        classAttribute: "equipment",
        maintenanceNo: '',
        equipmentIdCode: '',
        equipmentIdName: '',
        applicantIdName: '',
        applicationStartDate: '',
        applicationEndDate: '',
        faultStartTimeStart: '',
        faultStartTimeEnd: '',
        maintenancePersonnel: '',
        state: '',
        startTime: '',
        endTime: '',
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
  created() {
    this.initData()
  },
  methods: {
    //更多查询
    moreQueries() {
      this.visible = true
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
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.orderForm.applicationStartDate = this.orderDateArr[0]
        this.orderForm.applicationEndDate = this.orderDateArr[1]
      } else {
        this.orderForm.applicationStartDate = ''
        this.orderForm.applicationEndDate = ''
      }
      if (this.submitDate && this.submitDate.length > 0) {
        this.orderForm.startTime = this.submitDate[0].replace(/ 0(?!0)/g, " ")
        this.orderForm.endTime = this.submitDate[1].replace(/ 0(?!0)/g, " ")
      } else {
        this.orderForm.startTime = ''
        this.orderForm.endTime = ''
      }
      if (this.faultStartTime && this.faultStartTime.length > 0) {
        this.orderForm.faultStartTimeStart = this.faultStartTime[0].replace(/ 0(?!0)/g, " ")
        this.orderForm.faultStartTimeEnd = this.faultStartTime[1].replace(/ 0(?!0)/g, " ")
      } else {
        this.orderForm.faultStartTimeStart = ''
        this.orderForm.faultStartTimeEnd = ''
      }
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
    getTimes(time) {
      // 转换为式分秒
      let d = parseInt(time / 60 / 60 / 24)
      let h = parseInt(time / 60 / 60 % 24)
      let m = parseInt(time / 60 % 60)
      let s = parseInt(time % 60)
      // s = s < 10 ? '0' + s : s
      // 作为返回值返回
      // return `${h}时${m}分${s}秒`
      return d != '0' ? `${d} 天 ${h} 时 ${m} 分 ${s} 秒` : h != '0' ? `${h} 时 ${m} 分 ${s} 秒` : m != '0' ? `${m} 分 ${s} 秒` : `${s} 秒`
    },
    // console.log(`输入的秒数是${second}：，转换后是${res[0]}时${res[1]}分${res[2]}秒`)
    initData() {
      this.listLoading = true
      RepairRequestList(this.orderForm).then(res => {
        console.log("res++", res);
        this.tableData = res.data.records
        this.tableData.map((item) => {
          item.maintenanceDuration = this.getTimes(item.maintenanceDuration)
        })
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.submitDate = []
      this.faultStartTime = []
      this.orderDateArr = []
      this.orderForm = {
        maintenanceNo: '',
        equipmentIdCode: '',
        equipmentIdName: '',
        applicantIdName: '',
        applicationStartDate: '',
        applicationEndDate: '',
        faultStartTimeStart: '',
        faultStartTimeEnd: '',
        maintenancePersonnel: '',
        state: '',
        startTime: '',
        endTime: '',
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

    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype,)
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteRepairRequest(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  