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
              <div class="grid-item">DHK</div>
              <div class="grid-item">{{ selectedTemplate === 'customer' ? '客户型号' : '型号' }}</div>
              <div class="grid-item">批次</div>
              <div class="grid-item"></div>
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
              customKey: 'typingEditTable'}"
      >
        <template slot="actions">
          <el-table-column label="操作" width="100" fixed="right" key="actions"
          >
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
  components: {TableFormProduct},
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
          align: 'center',
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户型号',
          type: 'view',
          minWidth: 160,
          align: 'center',
        },
        {
          prop: 'content1',
          label: '内容1',
          type: 'view',
          minWidth: 160,
          align: 'center',
        },
        {
          prop: 'content2',
          label: '内容2',
          type: 'view',
          minWidth: 160,
          align: 'center',
        },
        {
          prop: 'content3',
          label: '内容3',
          type: 'view',
          minWidth: 160,
          align: 'center',
        },
        {
          prop: 'sealingCoverTyping',
          label: '内容4',
          type: 'input',
          minWidth: 160,
          align: 'center',
        },
        {
          prop: 'content',
          label: '',
          type: 'view',
          minWidth: 360,
          align: 'center',
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
      this.$nextTick(() => {
        this.refreshTableHeight()
        this.updateLinesList('init')
      })
    }
  },
  methods: {
    updateLinesList(type) {
      const template = this.templates.find(t => t.value === this.selectedTemplate);
      this.linesList = (type === 'init' ? this.linesFormList : this.linesList).map(item => {
        const content = item.noTyping
          ? '不打字'
          : `"${ template.prefix } ${ template.model } ${ template.batch } ${ item.sealingCoverTyping }"${ item.sealingCoverTyping ? '四等分' : '三等分' }`;
        return {
          ...item,
          content1: template.prefix,
          content2: template.model,
          content3: template.batch,
          noTyping: item.sealingCoverTyping === '',
          content: content
        };
      });
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
      const template = this.templates.find(t => t.value === this.selectedTemplate);
      row.content = `"${ template.prefix } ${ template.model } ${ template.batch } ${ row.sealingCoverTyping }"${ row.sealingCoverTyping ? '四等分' : '三等分' }`;
    },

    toggleTyping(row) {
      row.noTyping = !row.noTyping;
      if (row.noTyping) {
        row.content = '不打字';
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
      this.updateLinesList()
    },

    handleConfirm() {
      const confirmedList = this.linesList.map(item => {
        if (item.noTyping) {
          return {
            ...item,
            sealingCoverTyping: ''
          };
        }
        return item;
      });

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
