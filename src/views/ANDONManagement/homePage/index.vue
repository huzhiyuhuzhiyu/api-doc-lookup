<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="card-list">
        <template v-for="item in cardList">
          <el-card class="card-item" :key="item.value" @click.native="goDeal(item)">
            <div class="item-left">
              <i class="iconfont" :class="item.icon"></i>
            </div>
            <div class="item-right">
              <div class="item-head">
                当前：<span :style="{ color: Number(item.value) ? 'red' : '#fff', fontSize: '1vw' }">{{ Number(item.value) ? item.value : '' }}</span>
                {{ Number(item.value) ? '条异常' : '无异常' }}
              </div>
              <div class="item-bottom">{{ item.label }}</div>
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
          <!-- <el-table-column prop="personId" label="响应人" min-width="160" sortable="custom" />
          <el-table-column prop="processDate" label="响应时间" min-width="160" sortable="custom" /> -->
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id)">处理</el-button>
              <el-button size="mini" type="text" @click="handleCancel(scope.row.flowTaskOperatorId)">取消</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @close="refresh" />
    <el-dialog title="取消" :close-on-click-modal="false" :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center"
      lock-scroll append-to-body width='600px'>
      <el-form ref="dealForm" :model="dealForm" label-width="120px">
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
import { getAbnoramlData, getAbnoramlModule } from '@/api/abnormalManagement/index.js'
import JNPFForm from '../processProcessing/Form'
import { batchReject } from '@/api/workFlow/FlowBefore'
export default {
  components: { JNPFForm },
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
          this.cardList = []
          let keys = Object.keys(res.data)
          let values = Object.values(res.data)
          keys.forEach((item, index) => {
            this.cardList.push({
              label: item,
              value: values[index],
              icon: 'icon-material' // 假设 icon 都为 icon-icon-qc
            })
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
    goDeal(item) {
      console.log(item)
      this.$router.push({
        path: '/ANDONManagement/processProcessing',
        query: { abnormalType: item.label }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #fff;

  .card-item {
    margin: 5px;
    width: 18%;
    height: 160px;
    background-color: #3fb9f8;
    color: #fff;
    cursor: pointer;

    ::v-deep .el-card__body {
      display: flex;
      height: 100%;

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
        .item-bottom{
          font-size: 0.8vw;
        }
      }
    }
  }
}
</style>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />