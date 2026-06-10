<template>
  <el-dialog
    title="历史确认图纸"
    :visible.sync="dialogVisible"
    width="50%"
    lock-scroll
    append-to-body
    :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center"
    @close="handleClose"
  >
    <div class="dialog-content">
      <JNPF-table
        customKey="historicalDrawings"
        v-loading="loading"
        :data="tableData"
        :row-key="'id'"
        fixedNO
        :setColumnDisplayList="columnList"
        ref="dataTable"
        custom-column
      >
        <template v-for="column in columnsConfig">
          <el-table-column
            v-if="typeof column.show === 'function' ? column.show() : (column.show !== undefined ? column.show : true)"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth"
            :sortable="column.sortable"
            :fixed="column.fixed"
            :align="getAlign(column.align)"
          >
            <template v-slot="{ row }" v-if="column.prop === 'attachmentList'">
              <div v-if="row.attachmentList && row.attachmentList.length > 0">
                <el-link
                  v-for="(file, index) in row.attachmentList"
                  :key="index"
                  class="attachment-item"
                  @click="downloadFile(file)"
                >
                  {{ file.document.fullName || '未知文件' }}
                </el-link>
              </div>
              <span v-else>无附件</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" @click="handleQuoteClick(row)">
              引用
            </el-button>
          </template>
        </el-table-column>
      </JNPF-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>

import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";
import { getHistoricalDrawings } from "@/api/drawConf";

export default {
  components: { TableFormProduct },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      tableData: [],
      columnList: [],
      columnsConfig: [
        {
          prop: "cooperativePartnerCode",
          label: "工厂号",
          minWidth: 220,
        },
        {
          prop: "attachmentList",
          label: "附件",
          minWidth: 260,
        },
        {
          prop: "confirmDate",
          label: "确认日期",
          minWidth: 120,
        },
      ]
    }
  },
  watch: {
    async visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        await this.getDrawingsView()
      }
    }
  },
  methods: {
    async getDrawingsView() {
      this.loading = true
      try {
        const res = await getHistoricalDrawings(this.formData.productsId)
        const { msg, data } = res
        if (msg === 'Success') {
          this.tableData = data
          this.loading = false
        }
      } catch ( err ) {
        this.loading = false
      }
    },
    downloadFile(file) {
      this.jnpf.downloadFile(file.url, file.document.fullName)
    },
    handleQuoteClick(row) {
      this.$emit('quoteClick', row)
      this.handleClose()
    },
    getAlign(align) {
      return align || 'left'
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
  }
}
</script>

<style scoped>
.attachment-item {
  line-height: 1.6;
  word-break: break-all;
}
</style>
