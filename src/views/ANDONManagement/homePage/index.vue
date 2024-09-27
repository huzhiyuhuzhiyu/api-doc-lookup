<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="card-list">
        <template v-for="item in cardList">
          <el-card class="card-item" :key="item.value" @click.native="goDeal(item)">
            <div class="item-head">
              {{ item.value.toUpperCase() }} ABNORMAL
            </div>
            <div class="card-body">
              <div class="body-left">
                <i class="iconfont" :class="item.icon"></i>
              </div>
              <div class="body-right">
                <div class="right-top">{{ item.label }}</div>
                <div class="right-bottom text">当前状态：{{ Number(item.count) ? item.count + '条异常' : '无异常' }}</div>
              </div>
            </div>
          </el-card>
        </template>


      </div>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <!-- <div class="JNPF-common-head">
          <topOpts :icon="'el-icon-remove-outline'" @add="handleCancel" :addText="'批量取消'"></topOpts>
          <div></div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div> -->
        <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" class="dataTable" border
          ref="listTable" custom-column>
          <el-table-column prop="orderNo" label="申请单号" min-width="200" sortable="custom" />
          <el-table-column prop="type" label="申请类型" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 'custom'">自定义异常</div>
              <div v-else>系统异常</div>
            </template>
          </el-table-column>
          <el-table-column prop="abnormalType" label="异常类型" min-width="120" sortable="custom" />
          <el-table-column prop="abnormalContent" label="异常内容" min-width="120" sortable="custom" />
          <el-table-column prop="equipmentName" label="关联设备" min-width="120" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="关联产品" min-width="160" sortable="custom" />
          <el-table-column prop="createByName" label="发起人" min-width="120" sortable="custom" />
          <el-table-column prop="createTime" label="发起时间" min-width="180" sortable="custom" />
          <!-- <el-table-column prop="personId" label="响应人" min-width="160" sortable="custom" />
          <el-table-column prop="processDate" label="响应时间" min-width="160" sortable="custom" /> -->
          <!-- <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id)">处理</el-button>
              <el-button size="mini" type="text" @click="handleCancel(scope.row.flowTaskOperatorId)">取消</el-button>
            </template>
          </el-table-column> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
  </div>
</template>
<script>
import { getAbnoramlData, getAbnoramlModule } from '@/api/abnormalManagement/index.js'
export default {
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
      cardList: [
        { label: '质量异常', value: 'quality', count: '', icon: 'icon-icon-qc' },
        { label: '物料异常', value: 'material', count: '', icon: 'icon-material' },
        { label: '生产异常', value: 'produce', count: '', icon: 'icon-produce' },
        { label: '设备异常', value: 'facility', count: '', icon: 'icon-device' },
        { label: '系统异常', value: 'system', count: '', icon: 'icon-systemAB' },
      ],
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
        type: ""
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
      batchId: ''
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
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
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getAbnoramlModule().then(res => {
        if (res.data) {
          this.cardList.forEach(item => {
            if (res.data[item.value] !== undefined) {
              item.count = res.data[item.value]; // 更新 count
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
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id)
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
    goDeal(item){
      console.log(item)
      this.$router.push({
        path:'/ANDONManagement/processProcessing',
        query:{module:item.value}
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.card-list {
  display: flex;
  height: 170px;
  padding: 10px;
  background-color: #fff;

  .card-item {
    // margin-right: 10px;

    &:not(:first-child) {
      margin-left: 10px;
    }

    width: 20%;
    background-color: #3fb9f8;
    color: #fff;
    cursor: pointer;

    .item-head {
      font-style: italic;
      /* 设置斜体 */
      font-family: 'Times New Roman', Times, serif;
      /* 使用另一种字体 */
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 1vw;
    }
  }

  .card-body {
    display: flex;

    .body-left {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      i {
        width: 100%;
        height: 100%;
        font-size: 3vw;
      }
    }

    .body-right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 50%;
      .right-top {
        font-size: 1vw;
      }
    }
  }
}</style>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />