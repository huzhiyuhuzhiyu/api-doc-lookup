<template>
  <el-dialog
    title="打字内容编辑"
    :visible.sync="dialogVisible"
    width="70%"
    lock-scroll
    append-to-body
    :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center"
    @close="$emit('update:visible', false)"
  >
    <div class="typing-edit-dialog" ref="main">
      <div class="template-display" ref='dataFormRegion'>
        <div class="template-left">
          <div v-for="template in templates" :key="template.value">
            <div
              class="template-item"
              :class="{ 'active-template': selectedTemplate === template.value }"
              @click="selectTemplate(template.value)"
            >
              {{ template.prefix }}+{{ template.model }}+{{ template.batch }}
            </div>
          </div>
        </div>

        <div class="template-center">
          <div class="content-box">
            <div class="content-title">内容</div>
            <div class="content-grid">
              <!-- 原逻辑：上方四格仅展示固定模板。
              <div class="grid-item">DHK</div>
              <div class="grid-item">{{ selectedTemplate === 'customer' ? '客户型号' : '型号' }}</div>
              <div class="grid-item">批次</div>
              <div class="grid-item"></div>
              -->
              <div class="grid-item">
                <el-input v-model="templateContent.content1" size="small" @input="syncTemplateContentToLines('content1')" />
              </div>
              <div class="grid-item">
                <el-input
                  v-model="templateContent.content2"
                  size="small"
                  :placeholder="selectedTemplate === 'customer' ? '默认带入客户型号' : '默认带入型号'"
                  @input="syncTemplateContentToLines('content2')"
                />
              </div>
              <div class="grid-item">
                <el-input v-model="templateContent.content3" size="small" @input="syncTemplateContentToLines('content3')" />
              </div>
              <div class="grid-item">
                <el-input v-model="templateContent.sealingCoverTyping" size="small" @input="syncTemplateContentToLines('sealingCoverTyping')" />
              </div>
            </div>
          </div>
        </div>

        <div class="template-right">
          <div class="keywords-box">
            <div class="keywords-title">关键词</div>
            <div class="keyword-item">型号</div>
            <div class="keyword-item">客户型号</div>
          </div>
        </div>
      </div>

      <!-- 表格编辑区域 -->
      <TableForm-product
        @input="contentChanges"
        :value="linesList"
        :hasToolbar="false"
        ref="tableForm"
        :tableItems="linesListItems"
        :tableProps="{
              is: 'JNPF-table',
              fixedNO: true,
              height: linesTableHeight,
              rowKey: 'id',
              defaultExpandAll: true,
              customColumn: true,
              customKey: 'typingEditTable'
        }"
      >
        <template slot="actions">
          <el-table-column label="操作" width="100" fixed="right" key="actions">
            <template slot-scope="{row}">
              <el-button size="mini" type="text" @click="toggleTyping(row)">
                {{ row.noTyping ? '恢复打字' : '不打字' }}
              </el-button>
            </template>
          </el-table-column>

        </template>
      </TableForm-product>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" class="cancel-btn">取消</el-button>
      <el-button type="primary" @click="handleConfirm" class="confirm-btn">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";

export default {
  components: { TableFormProduct },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    linesFormList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectedTemplate: 'model',
      templateContent: {
        content1: 'DHK',
        content2: '',
        content3: '批次',
        sealingCoverTyping: ''
      },
      templates: [
        {
          prefix: 'DHK',
          model: '型号',
          batch: '批次',
          value: 'model'
        },
        {
          prefix: 'DHK',
          model: '客户型号',
          batch: '批次',
          value: 'customer'
        }
      ],
      linesList: [],
      linesListItems: [
        {
          prop: 'drawingNo',
          label: '型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'content1',
          label: '内容1',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'content2',
          label: '内容2',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'content3',
          label: '内容3',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'sealingCoverTyping',
          label: '内容4',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'content',
          label: '打字内容',
          type: 'view',
          minWidth: 360,
          formatter: (row) => {
            return row.noTyping ? '不打字' : row.sealingCoverTyping;
          },
        },
      ],
      linesTableHeight: 0
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.resetTemplateContent()
        this.updateLinesList('init')
      }
      this.$nextTick(() => {
        this.refreshTableHeight()
      })
    }
  },
  methods: {
    extractBatchNumber(fullString) {
      const template = this.templates.find(t => t.value === this.selectedTemplate);

      const defaults = {
        content1: template?.prefix || '',
        // 原逻辑：内容2默认是“型号/客户型号”文案。
        // content2: template?.model || '',
        content2: this.templateContent.content2 || template?.model || '',
        content3: template?.batch || '',
        sealingCoverTyping: ''
      };

      if (!fullString) {
        return defaults;
      }

      const quotedMatch = fullString.match(/"([^"]+)"/);
      if (!quotedMatch) {
        return defaults;
      }

      const parts = quotedMatch[1].split(' ');

      return {
        content1: parts[0] ?? defaults.content1,
        content2: parts[1] ?? defaults.content2,
        content3: parts[2] ?? defaults.content3,
        sealingCoverTyping: parts[3] ?? defaults.sealingCoverTyping
      };
    },
    updateLinesList(type) {
      this.linesList = (type === 'init' ? this.linesFormList : this.linesList).map(item => {
        const { content1, content2, content3, sealingCoverTyping } = this.extractBatchNumber(item.sealingCoverTyping)
        const rowContent1 = type === 'init' ? content1 : this.templateContent.content1
        // 新逻辑：内容2上方未填写时，默认带入每行序号后面的型号值。
        const rowContent2 = type === 'init' ? (this.templateContent.content2 || this.getRowModelValue(item) || content2 || '') : (this.templateContent.content2 || this.getRowModelValue(item) || '')
        const rowContent3 = type === 'init' ? content3 : this.templateContent.content3
        const rowSealingCoverTyping = type === 'init' ? sealingCoverTyping : this.templateContent.sealingCoverTyping
        // 原逻辑：初始化时强制 noTyping 为 false，外部表格里的“不打字”再次打开会丢失状态。
        // const isNoTyping = item.noTyping
        const isNoTyping = item.noTyping || this.isNoTypingContent(item.sealingCoverTyping) || this.isNoTypingContent(item.content)
        const content = isNoTyping
          ? '不打字'
          : `"${ rowContent1 } ${ rowContent2 } ${ rowContent3 } ${ rowSealingCoverTyping }"${ rowSealingCoverTyping ? '四等分' : '三等分' }`;
        return {
          ...item,
          content1: rowContent1,
          content2: rowContent2,
          content3: rowContent3,
          noTyping: isNoTyping,
          sealingCoverTyping: isNoTyping ? '' : rowSealingCoverTyping,
          content
        };
      });
    },

    resetTemplateContent() {
      const template = this.templates.find(t => t.value === this.selectedTemplate)
      this.templateContent = {
        content1: template?.prefix || '',
        // 内容2保持为空，下面表格默认带入每行序号后面的型号值。
        content2: '',
        content3: template?.batch || '',
        sealingCoverTyping: ''
      }
    },

    getRowModelValue(row) {
      return this.selectedTemplate === 'customer'
        ? row.customerProductDrawingNo
        : row.drawingNo
    },

    isNoTypingContent(value) {
      return String(value || '').trim() === '不打字'
    },

    syncTemplateContentToLines(prop) {
      this.linesList.forEach(row => {
        if (prop === 'content2' && !this.templateContent.content2) {
          row.content2 = this.getRowModelValue(row)
        } else {
          row[prop] = this.templateContent[prop]
        }

        if (prop === 'sealingCoverTyping' && this.templateContent.sealingCoverTyping.trim() !== '') {
          row.noTyping = false
        }
        this.updateRowContent(row);
      })
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
        if (prop === 'sealingCoverTyping' && value.trim() !== '') {
          this.linesList[dataOrIndex].noTyping = false
        }
        this.updateRowContent(this.linesList[dataOrIndex]);
      }
    },

    updateRowContent(row) {
      if (row.noTyping) {
        row.content = '不打字'
        return
      }
      row.content = `"${ row.content1 } ${ row.content2 } ${ row.content3 } ${ row.sealingCoverTyping }"${ row.sealingCoverTyping ? '四等分' : '三等分' }`;
    },

    toggleTyping(row) {
      row.noTyping = !row.noTyping;
      if (row.noTyping) {
        row.content = '不打字';
        row.sealingCoverTyping = ''
      } else {
        this.updateRowContent(row);
      }
    },
    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    selectTemplate(template) {
      this.selectedTemplate = template;
      // 切换模板后，内容2继续默认取每行型号/客户型号。
      this.templateContent.content2 = ''
      this.updateLinesList()
    },

    handleConfirm() {
      const confirmedList = this.linesList.map(item => ({
        ...item,
        // 原逻辑：不打字行确认后回传空字符串，外部表格显示为空。
        // sealingCoverTyping: item.noTyping ? '' : item.content
        sealingCoverTyping: item.noTyping ? '不打字' : item.content
      }));

      this.$emit('update:visible', false);
      this.$emit('confirm', confirmedList);
    },
  }
}
</script>

<style lang="scss">
.typing-edit-dialog {
  .template-display {
    display: flex;
    margin-bottom: 20px;
    background-color: white;
    border-radius: 4px;
    padding: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .template-left {
      width: 30%;
      padding-right: 20px;

      .template-item {
        padding: 12px 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        background-color: white;
        border: 1px solid #dcdfe6;
        color: #606266;

        &.active-template {
          background-color: #bae7ff;
          border-color: #69c0ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

      }
    }

    .template-center {
      width: 40%;
      padding: 0 10px;

      .content-box {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        height: 100%;

        .content-title {
          padding: 8px 15px;
          font-weight: bold;
          border-bottom: 1px solid #dcdfe6;
          background-color: #f5f7fa;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          height: calc(100% - 38px);

          .grid-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border-right: 1px solid #dcdfe6;
            font-size: 14px;
            color: #606266;

            &:last-child {
              border-right: none;
            }
          }
        }
      }
    }

    .template-right {
      width: 30%;
      padding-left: 20px;

      .keywords-box {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        height: 100%;
        padding: 10px;

        .keywords-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #303133;
        }

        .keyword-item {
          padding: 8px 15px;
          margin-bottom: 8px;
          background-color: #f5f7fa;
          border-radius: 4px;
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  .content-table {
    margin-bottom: 20px;

    .no-typing {
      color: #999;
      font-style: italic;
    }
  }
}

.dialog-footer {
  .cancel-btn {
    background-color: #f56c6c;
    border-color: #f56c6c;
    color: white;

    &:hover {
      background-color: #f78989;
      border-color: #f78989;
    }
  }

  .confirm-btn {
    background-color: #409eff;
    border-color: #409eff;

    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }
}
</style>
