<template>
  <el-dialog
    title="询价记录"
    :visible.sync="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
  >
    <div class="enquiry-record-wrapper" v-loading="loading">
      <!-- 左侧：供应商列表 -->
      <div class="left-panel">
        <div class="panel-title">供应商</div>
        <ul class="supplier-list">
          <li
            v-for="item in supplierList"
            :key="item.supplierCode"
            :class="['supplier-item', { active: activeSupplierCode === item.supplierCode }]"
            @click="handleSupplierClick(item)"
          >
            <span class="supplier-name" :title="item.supplierName">{{ item.supplierName }}</span>
          </li>
        </ul>
        <div v-if="supplierList.length === 0 && !loading" class="empty-tip">暂无供应商</div>
      </div>
      <!-- 右侧 -->
      <div class="right-panel">
        <!-- 右侧上方：基本信息 -->
        <div class="basic-info-section">
          <div class="section-title">基本信息</div>
          <el-descriptions :column="2" border size="small" label-class-name="desc-label" content-class-name="desc-content">
            <el-descriptions-item label="收件人">{{ detailData.recipient || '-' }}</el-descriptions-item>
            <el-descriptions-item label="发件人">{{ detailData.sender || '-' }}</el-descriptions-item>
            <el-descriptions-item label="公司">{{ detailData.company || '-' }}</el-descriptions-item>
            <el-descriptions-item label="日期">{{ detailData.quotationDate || '-' }}</el-descriptions-item>
            <el-descriptions-item label="传真">{{ detailData.fax || '-' }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ detailData.phone || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 右侧下方：产品信息 -->
        <div class="product-info-section">
          <div class="section-title">产品信息</div>
          <el-table :data="lineList" border size="small" max-height="400">
            <el-table-column prop="productsCode" label="产品型号" min-width="120" />
            <el-table-column prop="productsName" label="产品名称" min-width="140" />
            <el-table-column prop="drawingNo" label="客户型号" min-width="120" />
            <el-table-column prop="mainUnit" label="单位" min-width="70" />
            <el-table-column prop="sampleNumStr" label="样品数" min-width="80" />
            <el-table-column prop="sampleAmounts" label="样品报价" min-width="100" />
            <el-table-column prop="procurementAmounts" label="采购价" min-width="100" />
            <el-table-column prop="moldAmounts" label="模具费" min-width="100" />
            <el-table-column prop="minNumStr" label="起订量" min-width="80" />
            <el-table-column prop="deliveryDate" label="交期" min-width="100" />
            <el-table-column prop="remark" label="备注" min-width="120" />
          </el-table>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getEnquiryManagementList, getEnquiryManagementInfo } from '@/api/enquiryManagement/index'

export default {
  name: 'EnquiryRecordDialog',
  data() {
    return {
      dialogVisible: false,
      loading: false,
      // 左侧供应商列表
      supplierList: [],
      activeSupplierCode: '',
      // 供应商对应的完整bimInquiry记录（用于点击时取id查详情）
      supplierRecordMap: {},
      // 右侧数据
      detailData: {},
      lineList: [],
    }
  },
  methods: {
    async open(row) {
      this.dialogVisible = true
      this.loading = true
      try {
        // 用当前行的询价单号，去询价管理查询所有供应商
        const res = await getEnquiryManagementList({
          quotationNo: row.inquiryNo,
          pageNum: 1,
          pageSize: 999,
        })
        if (res.data && res.data.records) {
          // 收集所有供应商（去重）
          const map = {}
          res.data.records.forEach(item => {
            if (item.supplierCode && !map[item.supplierCode]) {
              map[item.supplierCode] = {
                supplierCode: item.supplierCode,
                supplierName: item.supplierName,
                id: item.id,
              }
            }
          })
          this.supplierList = Object.values(map)
          // 建立 supplierCode → 记录 的映射
          this.supplierRecordMap = {}
          res.data.records.forEach(item => {
            if (item.supplierCode) {
              this.supplierRecordMap[item.supplierCode] = item
            }
          })
          // 默认选中第一个供应商并加载详情
          if (this.supplierList.length > 0) {
            await this.handleSupplierClick(this.supplierList[0])
          }
        }
      } catch (err) {
        console.error('获取询价记录失败', err)
      } finally {
        this.loading = false
      }
    },

    async handleSupplierClick(item) {
      this.activeSupplierCode = item.supplierCode
      const record = this.supplierRecordMap[item.supplierCode]
      if (!record || !record.id) return
      // 调用询价管理详情接口
      try {
        const res = await getEnquiryManagementInfo(record.id)
        if (res.data) {
          const { inquiry = {}, inquiryLineList = [] } = res.data
          this.detailData = {
            ...inquiry,
            // 基本信息字段映射
            recipient: inquiry.recipient || inquiry.bidder || '',
            sender: inquiry.sender || inquiry.createByName || '',
            company: inquiry.supplierName || inquiry.company || '',
            quotationDate: inquiry.quotationDate || '',
            fax: inquiry.fax || '',
            phone: inquiry.phone || inquiry.tel || '',
          }
          this.lineList = inquiryLineList
        }
      } catch (err) {
        console.error('获取供应商询价详情失败', err)
      }
    },

    handleClose() {
      this.dialogVisible = false
      this.supplierList = []
      this.activeSupplierCode = ''
      this.supplierRecordMap = {}
      this.detailData = {}
      this.lineList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.enquiry-record-wrapper {
  display: flex;
  gap: 16px;
  min-height: 400px;

  .left-panel {
    width: 200px;
    flex-shrink: 0;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .panel-title {
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 700;
      color: #303133;
      border-bottom: 1px solid #ebeef5;
      background: #fafafa;
    }

    .supplier-list {
      list-style: none;
      margin: 0;
      padding: 0;
      overflow-y: auto;
      flex: 1;

      .supplier-item {
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background 0.2s;

        &:hover {
          background: #ecf5ff;
        }

        &.active {
          background: #409eff;
          color: #fff;

          .supplier-name {
            color: #fff;
          }
        }

        .supplier-name {
          font-size: 13px;
          color: #606266;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
      }
    }

    .empty-tip {
      padding: 20px 0;
      text-align: center;
      color: #c0c4cc;
      font-size: 13px;
    }
  }

  .right-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .basic-info-section,
    .product-info-section {
      .section-title {
        font-size: 15px;
        font-weight: 700;
        color: #303133;
        margin-bottom: 10px;
        padding-left: 8px;
        border-left: 3px solid #409eff;
      }
    }

    .product-info-section {
      flex: 1;
    }
  }
}

::v-deep .desc-label {
  width: 100px;
  min-width: 100px;
  background: #fafafa;
}

::v-deep .desc-content {
  width: calc(50% - 100px);
  min-width: 200px;
  word-break: break-all;
}
</style>
