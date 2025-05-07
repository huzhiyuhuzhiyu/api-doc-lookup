<template>
  <div class="JNPF-common-layout">
    <div v-if="!formVisible" class="JNPF-common-layout-center">
      <div class="card-list">
        <template v-for="item in cardList">
          <el-card class="card-item" :key="item.value" @click.native="goDeal(item)">
            <div class="item-head">
              <span> {{ (item.enLabel && item.enLabel.toUpperCase()) || '' }} ABNORMAL</span>
            </div>
            <div class="card-body">
              <div class="body-left">
                <i :class="item.icon"></i>
              </div>
              <div class="body-right">
                <div class="right-top" style="font-size:18px">{{ item.label }}</div>
                <div class="right-bottom"><span :style="{color:Number(item.num) ? 'red' : '#fff',fontSize:'18px',marginRight:'3px'}">{{ Number(item.num) && Number(item.num) || '' }}</span>{{ Number(item.num) ? '条异常' : '无异常' }}</div>
              </div>
              <div style="flex: 1;"></div>
            </div>
          </el-card>
        </template>


      </div>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" class="dataTable" border
          ref="listTable" custom-column customKey="JNPFTableKey_964836">
          <el-table-column prop="orderNo" label="申请单号" min-width="200" sortable="custom" />
          <el-table-column prop="type" label="申请类型" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-tag type='warning' v-if="scope.row.type === 'custom'">自定义异常</el-tag>
              <el-tag type='danger' v-else>系统异常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="abnormalType" label="异常类型" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.abnormalType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="abnormalContent" label="异常内容" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.abnormalContent }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="equipmentName" label="关联设备" min-width="120" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="关联产品" min-width="160" sortable="custom" />
          <el-table-column prop="createByName" label="发起人" min-width="120" sortable="custom" />
          <el-table-column prop="createTime" label="发起时间" min-width="180" sortable="custom" />
          <el-table-column prop="planPersonName" label="处理人" min-width="160" sortable="custom" />
          <el-table-column prop="extensionTime" label="处理时间" min-width="200">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.extensionFlag">{{ scope.row.extensionTime }}</el-tag>
              <el-tag type="" v-else>{{ scope.row.waitTime }}</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="personId" label="响应人" min-width="160" sortable="custom" />
          <el-table-column prop="processDate" label="响应时间" min-width="160" sortable="custom" /> -->
          <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" v-if="scope.row.type === 'system'" @click="lookRecardData(scope.row.id)">查看异常数据</el-button>
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id,scope.row.type)">处理</el-button>
              <el-button size="mini" type="text" @click="handleCancel(scope.row.flowTaskOperatorId)">取消</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @close="refresh" />
    <ExceptForm v-if="sourceDialog" ref="ExceptForm" @close="refresh" :sourceListData="exceptionData" :tableItems="tableItems" />
    <el-dialog title="取消" :close-on-click-modal="false" :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center"
      lock-scroll append-to-body width='600px'>
      <el-form ref="dealForm" :model="dealForm" label-width="120px" label-position="top">
        <el-form-item label="取消描述：" prop="processDescription">
          <el-input v-model="dealForm.processDescription" placeholder="请输入取消描述" type="textarea" :rows="4" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="handleApproval()" :loading="approvalBtnLoading">
          {{ $t('common.confirmButton') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAbnoramlData, getAbnoramlModule ,getRecordData} from '@/api/abnormalManagement/index.js'
import JNPFForm from '../processProcessing/Form'
import ExceptForm from '../processProcessing/ExceptForm.vue'
import { batchReject } from '@/api/workFlow/FlowBefore'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { JNPFForm ,ExceptForm},
  mixins:[getProjectList],
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '申请单号',
          type: 'input'
        },
        {
          prop: 'type',
          label: '申请类型',
          type: 'select',
          options: [
            { label: '自定义异常', value: 'custom' },
            { label: '系统异常', value: 'system' }
          ]
        },
        {
          prop: 'abnormalType',
          label: '异常类型',
          type: 'input'
        },
        {
          prop: 'abnormalContent',
          label: '异常内容',
          type: 'input'
        },
        {
          prop: 'equipmentName',
          label: '关联设备',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '关联产品',
          type: 'input'
        },
        {
          prop: 'createByName',
          label: '发起人',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '发起时间',
          type: 'datetime',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
        },
      ],
      cardList: [],
      visible: false,
      approvalBtnLoading: false,
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        abnormalContent: "",
        abnormalContentId: '',
        abnormalType: "",
        abnormalTypeId: '',
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        equipmentName: "",
        keyword: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        processEndTime: "",
        processStartTime: "",
        processStatus: "processing",
        productionOrderNo: "",
        startTime: "",
        startUpdateTime: "",
        superQuery: {},
        totalRowFlag: false,
        type: "",
        projectId:''
      },
      typeList: [
        { label: '自定义异常', value: 'custom' },
        { label: '系统异常', value: 'system' }
      ],
      formVisible: false,
      basicQuery: {},
      superQuery: {},
      searchList: [
        { fieldValue: '', field: 'orderNo', label: '申请单号', prop: 'orderNo', symbol: 'like', searchType: 1 },
        { fieldValue: '', field: 'type', label: '申请类型', prop: 'type', symbol: 'like', searchType: 4, options: [{ label: '自定义异常', value: 'custom' }, { label: '系统异常', value: 'system' }] },
        { fieldValue: '', field: 'abnormalType', label: '异常类型', prop: 'abnormalType', symbol: 'like', searchType: 1 },
        { fieldValue: '', field: 'abnormalContent', label: '异常内容', prop: 'abnormalContent', symbol: 'like', searchType: 1 },
      ],
      selectAb: [],
      dealForm: {
        processDescription: '',
      },
      batchId: '',
      sourceDialog:false,
      exceptionData:[],
      tableItems: [],
      isProjectSwitch:''
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp = ''
      if (['equipmentName', 'productDrawingNo', 'createByName'].includes(prop)) {
        newProp = prop === 'createByName' ? 'create_by' : prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      this.listQuery.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getAbnoramlModule(this.listQuery.projectId).then(res => {
        if (res.data) {
          this.cardList = res.data.map(item=>{
            return {
              ...item,
              enLabel:item.label === '系统异常' ? 'system' : item.enLabel,
              icon:item.label === '系统异常' ? 'ym-custom ym-custom-alert-octagon' : item.icon
            }
          })
        }
      })
      getAbnoramlData(this.listQuery).then((res) => {
        this.list = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => this.listLoading = false)
    },
    // 新增数据
    addOrUpdateHandle(id,type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id,type)
      })
    },
    search(type) {
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList.filter(item => item.fieldValue).map(item => {
            return {
              ...item,
              fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
            }
          })
        }
        this.listQuery.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.listQuery.superQuery = this.superQuery
      }
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      this.sourceDialog = false
      if (isrRefresh) this.reset()
    },
    reset() {
      this.$refs['listTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.searchList.forEach(item => { item.fieldValue = '' })
      this.search()
    },
    handleSelectAb(val) {
      this.selectAb = val
    },
    handleCancel(id) {
      if (!id) {
        if (!this.selectAb.length) return this.$message.error("请选择您要取消的数据!")
        this.batchFlag = ''
      } else {
        this.batchId = id
      }
      this.visible = true
      this.$nextTick(() => { this.$refs.dealForm.resetFields() })
    },
    handleApproval() {
      this.approvalBtnLoading = true

      let flowModel = {
        ids: !this.batchId ? this.selectAb.map(item => item.flowTaskOperatorId) : [this.batchId],
        handleOpinion: this.dealForm.processDescription
      }
      batchReject(flowModel).then(res => {
        this.$message({ type: 'success', message: '处理成功', duration: 1000 })
        this.approvalBtnLoading = false
        this.visible = false
        this.initData()
      }).catch(() => { this.approvalBtnLoading = false })
    },
    goDeal(item) {
      this.$router.push({
        path: '/ANDONManagement/processProcessing',
        query: { abnormalType: item.label }
      })
    },
    lookRecardData(id){
      getRecordData(id).then(res=>{
        if (res.data.exceptionData){
          this.exceptionData = JSON.parse(res.data.exceptionData)
          this.tableItems = Object.keys(this.exceptionData[0])
          this.sourceDialog = true
          this.$nextTick(() => {
            this.$refs.ExceptForm.init()
          })
        }
        
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  padding: 5px;
  grid-gap: 2px;
  overflow-x: auto;
  background-color: #fff;

  .card-item {
    margin: 2px;
    // flex: 1;
    height: 160px;
    background-color: #3fb9f8;
    color: #fff;
    cursor: pointer;

    ::v-deep .el-card__body {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 260px;
      box-sizing: border-box;
      .item-head {
        font-style: italic;
        /* 设置斜体 */
        font-family: 'Times New Roman', Times, serif;
        /* 使用另一种字体 */
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 22px;
        white-space: nowrap;
        overflow: hidden;
        /* 确保超出容器的文本被隐藏 */
        white-space: nowrap;
        /* 防止文本换行 */
        text-overflow: ellipsis;
        /* 超出部分显示省略号 */
      }

      .card-body {
        display: flex;

        .body-left {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          flex: 1;
          i {
            display: block;
            width: 100%;
            height: 100%;
            font-size: 64px;
            line-height: 110px;
            text-align: center;
          }
        }

        .body-right {
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;

        }
      }

      .item-left {
        flex: 4;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 3vw;
          line-height: 110px;
          text-align: center;
        }
      }

      .item-right {
        flex: 6;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        font-size: 1vw;

        .item-head {
          // font-style: italic;
          /* 设置斜体 */
          font-family: 'Times New Roman', Times, serif;
          /* 使用另一种字体 */
          text-align: center;
          height: 40px;
          line-height: 40px;
          // font-size: 18px;
          white-space: nowrap;
          overflow: hidden;
          /* 确保超出容器的文本被隐藏 */
          white-space: nowrap;
          /* 防止文本换行 */
          text-overflow: ellipsis;
          /* 超出部分显示省略号 */
        }

        .item-bottom {
          font-size: 0.8vw;
        }
      }
    }
  }
}</style>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />