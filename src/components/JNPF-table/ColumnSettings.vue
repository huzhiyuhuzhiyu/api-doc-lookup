<template>
  <el-drawer title="列表显示设置" :visible.sync="drawerVisible" :wrapperClosable="false" size="320px" append-to-body
    class="JNPF-common-drawer columnSettings-drawer">
    <div class="JNPF-flex-main" :class="classObj">
      <!-- <div class="columnSetting-head">
        <div></div>
        <div></div>
      </div> -->
      <el-scrollbar class="column-list" v-loading="loading">
        <template v-if="list.length">
          <draggable :list="list" :animation="340" handle=".column-item-icon">
            <div class="column-item" v-for="item in list" :key="item.prop"
              @click.self="item.columnVisible = !item.columnVisible">
              <div class="column-item-left">
                <i class="icon-ym icon-ym-darg column-item-icon"></i>
                <el-checkbox class="check-box" v-model="item.columnVisible" :disabled="item.className === 'LineRequired'" />
                <div class="column-item-label" @click="item.columnVisible = !item.columnVisible">
                  <span>{{ item.label }}</span>
                </div>
              </div>
              <div class="column-item-right">
                <el-tooltip content="固定到左侧" placement="top"
                  :class="['system-icon', item.fixed === '' || item.fixed === 'left' ? 'active' : '']"
                  :enterable="false">
                  <i class="ym-custom ym-custom-format-horizontal-align-left" @click="handleFixed(item, 'left')"></i>
                </el-tooltip>
                <span class="line"></span>
                <el-tooltip content="固定到右侧" placement="top"
                  :class="['system-icon', item.fixed === 'right' ? 'active' : '']" :enterable="false">
                  <i class="ym-custom ym-custom-format-horizontal-align-right" @click="handleFixed(item, 'right')"></i>
                </el-tooltip>
              </div>
            </div>
          </draggable>
        </template>
        <el-empty description="暂无数据" :image-size="120" v-else style="font-size: 16px;"></el-empty>
      </el-scrollbar>
      <div class="footer">
        <el-button type="primary" @click="reset">重 置</el-button>
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSettings">确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from "vuex";
export default {
  name: 'ColumnSettings',
  components: { draggable },
  props: {
    defaultColumns: {
      type: Array,
      default: () => []
    },
    columnList: {
      type: Array,
      default: () => []
    },
    setColumnDisplayList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      loading: false,
      drawerVisible: false,
      list: []
    }
  },
  computed: {
    menuId() {
      return this.$route.meta.modelId || ''
    },
    ...mapState({
      themeClass: state => state.settings.themeClass,
    }),
    classObj() {
      return {
        [this.themeClass]: true,
      };
    }
  },
  methods: {
    init() {
      this.drawerVisible = true
      // this.list = [...this.columnList]
      console.log(this.columnList,'this.columnList')
      this.list = JSON.parse(JSON.stringify(this.columnList))
    },
    reset() {
      console.log(123, this.defaultColumns, this.setColumnDisplayList);
      this.defaultColumns.forEach(item => {
        if (this.setColumnDisplayList.includes(item.prop)) {
          this.$set(item, 'columnVisible', false)
        } else {
          this.$set(item, 'columnVisible', true)
        }
      });
      this.list = this.defaultColumns

    },
    saveSettings() {
      let flag = this.list.some(item => !!item.columnVisible)
      if (!flag) {
        this.$message.error("请至少拥有一个展示字段")
      } else {
        this.$emit('setColumn', this.list)
        this.drawerVisible = false
      }
    },
    handleFixed(item, type) {
      const cancelFixedFlag = ((item.fixed === '' || item.fixed === 'left') && type === 'left') || (item.fixed === 'right' && type === 'right')
      if (cancelFixedFlag) {
        this.$set(item, 'fixed', undefined)
        this.$nextTick(() => {
          delete item.fixed
        })
      } else {
        this.$set(item, 'fixed', type)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$lighterBlue: #1890ff;

.columnSettings-drawer {
  .JNPF-flex-main {
    overflow: hidden;
  }

  .columnSetting-head {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 24px 0;
    font-size: 14px;
    color: #303133;
  }

  .column-list {
    height: 100%;
    padding: 8px 10px 0;

    .column-item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      font-size: 12px;
      color: #303133;
      cursor: pointer;
      border-bottom: 1px solid #e3e6eb;

      &:hover {
        background: rgba(25, 144, 250, 0.1);
      }


      .column-item-left,
      .column-item-right {
        display: flex;

        &.active {
          color: $lighterBlue;
        }

        .line {
          position: relative;
          top: -.06em;
          display: inline-block;
          height: 1.6em;
          margin: 0 8px;
          vertical-align: middle;
          border-top: 0;
          border-left: 1px solid rgba(0, 0, 0, .06);
        }
      }

      .column-item-icon {
        margin: auto 8px auto 10px;
        color: #909399;
        cursor: move;
        font-size: 14px;
      }

      .el-switch {
        transform: scale(0.8);
      }

      .column-item-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        display: flex;
        align-items: center;
        width: 160px;
        span{
          display: inline-block;
          width: 160px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .check-box {
        margin-right: 16px;
      }
    }
  }

  .footer {
    margin: 4px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

  .system-icon {
    &.active {
      color: $lighterBlue;
    }

    &:hover {
      color: $lighterBlue;
    }
  }

}
</style>
