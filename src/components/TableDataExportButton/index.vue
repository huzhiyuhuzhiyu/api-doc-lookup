<template>
  <div class="export-button">
    <el-button :loading="loading" size="mini" type="primary" icon="el-icon-download" @click="exportForm()">导出</el-button>
    <ExportForm v-if="exportFormVisible" ref="exportForm" :exportHidden="exportHidden" @download="download" />
  </div>
</template>
<script>
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  components: { ExportForm },
  props: {
    tableRef: {
      type: String,
      required: true
    },
    listQuery: {
      required: true
    },
    exportType: {
      required: true,
    },
    exportName: {
      required: true,
    },
    exportMethod: {
      type: Function,
      required: false,
    },
    exportHidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      exportFormVisible: false,
      exportTableRef: null,
    }
  },
  methods: {
    // 导出
    exportForm() {
      let getFunction = (e, property) => {
        if (property in e.$refs) return e.$refs[property]
        else if (e.$parent) return getFunction(e.$parent, property)
        else return null
      }
      this.exportTableRef = this.exportTableRef || getFunction(this, this.tableRef)
      if (!this.exportTableRef.data.length) return this.$message.error('暂无数据导出！')
      this.exportFormVisible = true
      let columnList = this.exportTableRef.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
   async download(data) {
      if (data) {
        try {
          this.loading = true;
          this.exportFormVisible = false;

          const includeFieldMap = data.selectKey.reduce((acc, key, index) => {
            acc[key] = data.selectVal[index];
            return acc;
          }, {});

          const params = {
            ...this.listQuery,
            exportType: this.exportType,
            exportName: this.exportName,
            includeFieldMap,
            pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          };

          const exportFn = typeof this.exportMethod === 'function'
            ? this.exportMethod
            : excelExport;

          const result = await exportFn(params);

          const downloadUrl = result?.data?.url;
          if (downloadUrl) {
            this.jnpf.downloadFile(downloadUrl);
          } else {
            console.warn('未获取到下载链接');
          }
        } catch (error) {
          console.error('导出失败:', error);
        } finally {
          this.loading = false;
          this.exportFormVisible = false;
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.export-button {
  display: inline-block;
}
</style>
