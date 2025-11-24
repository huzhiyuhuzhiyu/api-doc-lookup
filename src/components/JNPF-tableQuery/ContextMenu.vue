<template>
  <div>
    <!-- 右键菜单 -->
    <div v-show="visible" class="context-menu" :style="menuStyle" @click.stop>
      <div class="context-menu-item" @click="handleRename">
        <i class="el-icon-edit"></i>
        <span>重命名视图</span>
      </div>
      <div class="context-menu-item" @click="handleDelete">
        <i class="el-icon-delete"></i>
        <span>删除视图</span>
      </div>
    </div>

    <!-- 重命名对话框 - 使用HandleViewDialog -->
    <HandleViewDialog v-if="renameDialogVisible" :curr-menu-id="currMenuId" :list-query="listQuery" mode="rename"
                      :rename-item="selectedItem" @cancel="cancelRename" @confirm="handleRenameConfirm" />
  </div>
</template>

<script>
import { Delete } from '@/api/system/advancedQuery'
import HandleViewDialog from './HandleViewDialog.vue'

export default {
  name: 'ContextMenu',
  components: {
    HandleViewDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    menuStyle: {
      type: Object,
      default: () => ({})
    },
    selectedItem: {
      type: Object,
      default: null
    },
    selectedIndex: {
      type: Number,
      default: -1
    },
    currMenuId: {
      type: String,
      default: ''
    },
    listQuery: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      renameDialogVisible: false
    }
  },
  methods: {
    handleRename() {
      this.renameDialogVisible = true;
    },
    handleDelete() {
      this.$confirm('确定要删除这个视图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await Delete(this.selectedItem.id);
          if (res) {
            this.$emit('delete-success', {
              item: this.selectedItem,
              index: this.selectedIndex
            });

            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            });
          }
        } catch (error) {
          console.error('删除失败:', error);
          this.$message.error('删除失败，请重试');
        }
      }).catch(() => {
        // 用户取消删除
      });
    },
    cancelRename() {
      this.renameDialogVisible = false;
    },
    handleRenameConfirm(data) {
      this.renameDialogVisible = false;

      this.$emit('rename-success', {
        index: this.selectedIndex,
        newName: data.fullName
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 5px 0;
  z-index: 3000;
  min-width: 120px;
  font-size: 14px;

  .context-menu-item {
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    color: #606266;

    &:hover {
      background-color: #f5f7fa;
      color: #409eff;
    }

    i {
      margin-right: 8px;
      font-size: 14px;
    }

    span {
      flex: 1;
    }
  }
}
</style>
