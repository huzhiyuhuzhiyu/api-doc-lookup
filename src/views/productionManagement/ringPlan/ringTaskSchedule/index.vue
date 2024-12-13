<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />

                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>


            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main"  v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
            </div>

            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable"   :data="tableData"  v-if="showFlag"
            :fixedNO="true" @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="任务单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'all')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="processSchedule" label="工单进度条"   :width="maxWidth">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.processInfoList" :key="index"
                  style="width:100px;display: inline-block;">
                  <div style="position: relative;">
                    <div class="processSchedule_top"
                      :class="item.value == 0 ? 'noValue' : item.value == '100' ? 'sucess' : 'normal'">{{ item.value
                      }}%</div>
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                      <p class="ProcessName">{{ item.name }}</p>
                    </el-tooltip>
                    <img v-if="index != scope.row.processInfoList.length - 1"
                      style="width: 30px;height: 30px;position: absolute; top: 13px; right: 10px;"
                      src="../../../../assets/images/right.png" alt="">
                  </div>

                </div>
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常任务</div>
                <div v-if="scope.row.orderType == 'rework'">返工任务</div>
                <div v-if="scope.row.orderType == 'manually'">手动新建任务</div>

              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="orderStatus" label="任务状态" min-width="140" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderStatus == 'normal'"><el-tag >正常</el-tag> </div>
                <div v-if="scope.row.orderStatus == 'suspend'"><el-tag type="info">暂停</el-tag></div>
                <div v-if="scope.row.orderStatus == 'closed'"><el-tag type="danger">关闭</el-tag></div>
                <div v-if="scope.row.orderStatus == 'finish'"><el-tag type="success">已完成</el-tag></div>
              </template>
            </el-table-column>


          


            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="生产数量" min-width="140" sortable="custom" />
            <el-table-column prop="completedQuantity" label="已完成数量" min-width="140" sortable="custom" />

            <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />

            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />




            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">

              <template slot-scope="scope">
 
                <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'all')">任务详情</el-button>
                <el-button size="mini" type="text" @click="viewTaskSchedule(scope.row.id)">进度详情</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <TaskSchedule v-if="taskScheduleVisible" ref="taskScheduleForm" @refreshDataList="initData" @close="closeForm" />
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { ordershengchanList, addOrderNum } from '@/api/productOrdes/index.js'
import { prodOrderClose } from '@/api/productOrdes/finishedProductOrders.js'
import { UserListAll, } from '@/api/permission/user'
import Form from '../ringTaskManagement/taskFormCopy.vue' 

import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import TaskSchedule from './taskSchedule.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  mixins: [getProjectList],

  name: 'assemblyTaskManagement',
  components: { SuperQuery, Form,TaskSchedule },
  data() {
    return {
      taskScheduleVisible:false,
      maxWidth: "180",
      showFlag:true,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: ["orderType", "productionPlanNo", 'createByName'],
      form: {
        appendQuantity: "",
        productionQuantity: "",
        orderNo: ""
      },
      reworkVisible: false,
      addOrderVisible: false,
      orderNoS: "",
      productDrawingNoS: "",
      productionPlanNoS: "",
      superQueryVisible: false,
      btnLoading: false,
      title: "更多查询",
      tableData: [],
      listLoading: true, 
      detailFlag: false,
      orderForm: {},
      orderFormlist: {
        productDrawingNo: "",
        productionPlanNo: "",
        orderNo: "",
        orderStatus: "normal",
        classAttribute: "semi_finished",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      total: 0,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "生产任务单号",
          type: 'input'
        },
        {
          prop: 'orderType',
          label: "任务类型",
          type: 'select',
          options: [
            { label: "正常任务", value: "normal" },
            { label: "返工任务", value: "rework" },
            { label: "手动新建任务", value: "manually" },

          ]
        },
  
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'productionQuantity',
          label: "总生产数量",
          type: 'input'
        },
        {
          prop: 'completedQuantity',
          label: "已完成数量",
          type: 'input'
        },
        {
          prop: 'routingName',
          label: "工艺路线名称",
          type: 'input'
        },
        {
          prop: 'routingCode',
          label: "工艺路线编码",
          type: 'input'
        },

        {
          prop: 'sealingCoverTyping',
          label: "打字内容",
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'select',
          options: []
        },

        {
          prop: 'oil',
          label: "油脂",
          type: 'select',
          options: []
        },
        {
          prop: 'oilQuantity',
          label: "油脂量",
          type: 'select',
          options: []
        },
        {
          prop: 'clearance',
          label: "游隙",
          type: 'select',
          options: []
        },
        {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'select',
          options: []
        },
        {
          prop: 'specialRequire',
          label: "特殊要求",
          type: 'select',
          options: []
        },
        {
          prop: 'productionPlanNo',
          label: "生产计划单号",
          type: 'input'
        },

        {
          prop: 'urgentFlag',
          label: "是否紧急",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
      ],
      requestArr: [
        {
          prop: "sealingCoverTyping",
          typeCode: "pa007"
        }, {
          prop: "accuracyLevel",
          typeCode: "pa006"
        },
        {
          prop: "vibrationLevel",
          typeCode: "pa005"
        },
        {
          prop: "oil",
          typeCode: "pa002"
        }, {
          prop: "oilQuantity",
          typeCode: "pa003"
        }, {
          prop: "clearance",
          typeCode: "pa001"
        }, {
          prop: "packagingMethod",
          typeCode: "pa015"
        }, {
          prop: "specialRequire",
          typeCode: "pa016"
        }
      ],
      dataRule: {
        appendQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["追加数量不能为空", (errMsg, index) => { this.$message.error(`追加数量：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '请输入大于0的正整数',), trigger: 'blur' }
        ],
      },
      isProjectSwitch: '',
      isProductNameSwitch:"",

    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    await this.getProjectSwitch('system', 'project')
    this.superForm= this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  }, 
  mounted() {
    this.getProductClassFun()
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type) 
      } catch (error) { }
    },
    viewTaskSchedule(id) {
      this.taskScheduleVisible = true
      this.$nextTick(() => {
        this.$refs.taskScheduleForm.init(id)
      })
    },
 
    addition1(data) {
      this.form = data
      this.addOrderVisible = true



    },
    reassignmentFun2() {
      console.log(this.selectArr);
      if (!this.selectArr.length) return this.$message.error("请选择您要改派的数据!")
      if (this.selectArr.length > 1) return this.$message.error("改派只支持单条数据操作")
      this.reassignmentVisible = true
      this.$nextTick(() => {
        this.$refs.reassignmentForm.init(this.selectArr[0].id)
      })
    },
    reassignmentFun1(data) {

      this.reassignmentVisible = true
      this.$nextTick(() => {
        this.$refs.reassignmentForm.init(id)
      })
    },
    // 追加生产数量 提交
    submitFun() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.btnLoading = true
          addOrderNum(this.form).then(res => {
            this.addOrderVisible = false
            this.btnLoading = false
            this.$message.success("追加生产数量成功")
            this.search('basic')
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })

    },
    // 多选
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.orderStatus !== 'normal' || row.orderStatus == 'suspend' || row.documentStatus == 'draft') {
        console.log(222);
        return false
      } else {
        console.log(333);
        return true

      }
    },

    // 关单
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请选择您要关单的任务")
      this.$confirm('您确认关闭选中的任务吗？', this.$t('common.tipTitle'), {
        type: 'warning',
        customClass: 'custom-confirm',
      }).then(() => {

        let arr = this.selectArr.map(item => {
          return item.id
        })
        console.log(arr)
        prodOrderClose(arr).then(res => {
          console.log(555);
          this.$message.success("关单成功")
          this.search('basic')
        }).catch(() => {
        })
      }).catch(() => { })
    },
    // 获取打字内容等
    getProductClassFun() {
      this.requestArr.forEach((item, index) => {
        let obj1 = {
          pageNum: -1,
          pageSize: 20,
          typeCode: item.typeCode,
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
        getbimProductAttributesList(obj1).then(res => {

          let arr = []
          res.data.records.forEach(items => {
            let obj = {
              label: items.name,
              value: items.name,
            }
            arr.push(obj)
          });
          let oilObj = this.superQueryJson.find(rs => rs.prop === item.prop);
          if (oilObj) {
            // 将options赋值为5  
            oilObj.options = JSON.parse(JSON.stringify(arr));
          }
        })
      })




    },

    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode'||prop=='productName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName'||prop=='productDrawingNo' ||prop=='routingName') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp

      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.taskScheduleVisible = false
      this.reworkVisible = false
      this.search('basic')
    },
    initData() {
      this.listLoading = true
      this.showFlag = false

   
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      ordershengchanList(this.orderForm).then(res => {
        this.showFlag = true
        res.data.records.forEach(item => {
          // 初始化 processInfoList 为一个空数组  
          item.processInfoList = [];

          // 检查 processSchedule 字段是否有值  
          if (item.processSchedule) {
            // 判断是否包含逗号  
            if (item.processSchedule.includes(',')) {
              // 以逗号分割为数组  
              const processes = item.processSchedule.split(',');

              // 遍历每一项并处理  
              processes.forEach(process => {
                const [name, value] = process.split(':');
                item.processInfoList.push({ name, value: parseInt(value, 10) });
              });
            } else {
              // 直接以冒号分割  
              const [name, value] = item.processSchedule.split(':');
              item.processInfoList.push({ name, value: parseInt(value, 10) });
            }
          }
        });
        console.log("表格数据", res);
        let longestProcessInfo = res.data.records.reduce((longest, current) => {
          return current.processInfoList.length > longest.processInfoList.length ? current : longest;
        }, res.data.records[0]);
        this.maxWidth = longestProcessInfo.processInfoList.length * 100 + 50
        setTimeout(() => {
          this.listLoading = false
        }, 500);
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.showFlag = true
      })

    },

    search(type) {

      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

    this.superForm=  this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
 
  
      this.$refs.SuperQuery.conditionList = []
     
      this.searchList= [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.search('basic')
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteQuotationsendlist(id).then(res => {
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
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}

.processSchedule_top {
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  border-radius: 50%;
  line-height: 50px;
  text-align: center;
}

.noValue {
  border-color: #ccc;

}

.normal {
  border-color: #409eff
}

.sucess {
  border-color: #67c23A
}

.ProcessName {
  margin-top: 10px;
  width: 70%;

  overflow: hidden;
  /*超出的部分隐藏起来。*/
  white-space: nowrap;
  /*不显示的地方用省略号...代替*/
  text-overflow: ellipsis;
  /* 支持 IE */
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
