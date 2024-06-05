<!-- --- ComSelect-list 使用说明 --- -->

<!-- title 弹出窗口标题（即将弃用，建议使用dialogTitle） -->
<!-- value 绑定的值 -->
<!-- multiple 是否开启多选（未完善） -->
<!-- placeholder dom占位符 -->
<!-- paramsObj 其他参数(会跟随@change一起返回) -->
<!-- method 数据请求方法 -->
<!-- requestObj 请求对象 -->
<!-- disrequestobj 禁用请求对象 -->
<!-- dataFormatting 数据格式化方法 -->
<!-- isdisabled 是否禁用页面上的此表单元素 -->
<!-- collapseTags 多选情况下在页面中的显示模式（默认false；false全部显示 / true显示一项其他收起） -->
<!-- clearable 是否带有删除按钮 -->
<!-- beforeSubmit 提交之前的回调方法 -->

<template>
  <div class="popupSelect-container">
    <div class="el-select" @click.stop="openDialog">
      <div class="el-select__tags" v-if="multiple" ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%', cursor: 'pointer' }">
        <span v-if="collapseTags && tagsList.length">
          <el-tag :closable="!selectDisabled" :size="collapseTagSize" type="info" @close="deleteTag($event, 0)"
            disable-transitions>
            <span class="el-select__tags-text">{{ tagsList[0] }}</span>
          </el-tag>
          <el-tag v-if="tagsList.length > 1" :closable="false" type="info" disable-transitions>
            <span class="el-select__tags-text">+ {{ tagsList.length - 1 }}</span>
          </el-tag>
        </span>
        <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
          <el-tag v-for="(item, i) in tagsList" :key="item" :size="collapseTagSize" :closable="!selectDisabled"
            type="info" @close="deleteTag($event, i)" disable-transitions>
            <span class="el-select__tags-text">{{ item }}</span>
          </el-tag>
        </transition-group>
      </div>
      <el-input ref="reference" v-model="innerValue" type="text" :placeholder="currentPlaceholder" :disabled="isdisabled"
        readonly :validate-event="false" :tabindex="(multiple) ? '-1' : null" @mouseenter.native="inputHovering = true"
        @mouseleave.native="inputHovering = false">
        <template slot="suffix">
          <i v-show="!showClose" :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"></i>
          <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close" @click="handleClearClick"></i>
        </template>
      </el-input>
    </div>
    <el-dialog :title="computedDialogTitle" :close-on-click-modal="false" :visible.sync="visible"
      class="JNPF-dialog JNPF-dialog_center transfer-dialog" lock-scroll append-to-body width="800px"
      :modal-append-to-body="false" @close="onClose">
      <div class="transfer__body">
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <el-input placeholder="请输入关键词查询" v-model="keyword" @keyup.enter.native="search" clearable class="search-input"
              maxlength="20">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
          <div class="transfer-pane__body" v-loading="loading">
            <el-tree :data="treeData" :props="props" check-on-click-node :expand-on-click-node="false" default-expand-all
              @node-click="handleNodeClick" class="JNPF-common-el-tree" node-key="id" ref="tree"
              :filter-node-method="filterNode">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span class="text" :class="node.disabled ? 'textcolor' : ''">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <span>已选</span>
            <el-button @click="removeAll" type="text" class="removeAllBtn">清空列表</el-button>
          </div>
          <div class="transfer-pane__body shadow right-pane" v-loading="loading">
            <template>
              <div v-for="(item, index) in rSelectData" :key="index" class="selected-item">
                <span :title="item">{{ item.name }}</span>
                <i class="el-icon-delete" @click="removeData(index)"></i>
              </div>
            </template>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('common.confirmButton') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';

export default {
  name: 'ComSelect-list',
  props: {
    value: {
      /* 页面元素显示的内容 */
    },
    title: {
      default: '未设置标题'
    },
    dialogTitle: {
      default: ''
    },
    method: {
      required: true
    },
    requestObj: {
      required: true
    },
    disrequestobj: {
      required: false
    },
    // 参数对象
    paramsObj: {
      default: () => { }
    },
    // 数据格式化方法
    dataFormatting: {},
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    size: String,
    isdisabled: {
      type: Boolean,
      default: false
    },
    beforeSubmit: {
      /* async (data, paramsObj) => {
          if (!this.dataForm.transferOutWarehouseName) return true // 如果判断条件真，直接提交，不弹出提示
          let flag = await this.$confirm('提示内容', '提示标题', { type: 'warning' }).catch(err => false)
          return flag
        } */
    },
  },
  data() {
    return {
      treeData: [],
      // allList: [],
      keyword: '',
      innerValue: '',
      visible: false,
      loading: false,
      props: {
        children: 'childrenList',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      selectedData: [],
      selectedIds: [],
      tagsList: [],
      rSelectData: [],
      inputHovering: false,
      inputWidth: 0,
      initialInputHeight: 0,
      loadingTotal: 0
    }
  },
  computed: {
    showClose() {
      let hasValue = this.value !== "" && this.value !== undefined && this.value !== null
      let criteria = this.clearable && !this.selectDisabled && this.inputHovering && hasValue;
      return criteria;
    },
    currentPlaceholder() {
      if (this.multiple && Array.isArray(this.value) && this.value.length) {
        return ''
      } else {
        return this.placeholder
      }
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1
        ? 'mini'
        : 'small';
    },
    computedDialogTitle() {
      return this.dialogTitle ? this.dialogTitle : this.title
    }
  },
  created() {
    this.getData()
    this.tagsList = []
  },
  mounted() {
    addResizeListener(this.$el, this.handleResize);

    const reference = this.$refs.reference;
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      };
      const input = reference.$el.querySelector('input');
      this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize];
    }
    if (this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width;
      }
    });
    this.setDefault()
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
    this.selectedIds = []
    this.selectedData = []
    this.rSelectData = []
    this.tagsList = []
  },
  watch: {
    value(val) {
      this.setDefault()
    },
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    // allList: {
    //   handler: function (val) {
    //     this.setDefault()
    //   },
    //   deep: true
    // }
  },
  methods: {
    async getData() {
      if (++this.loadingTotal <= 1) return
      this.$nextTick(() => {
        const method = this.method
        if (((String(method).substring(String(method).length - 2)) === '{}') || !method) {
          this.treeData = []
          console.warn('<ComSelect-list/> [' + this.computedDialogTitle + '] 请求方法无效');
        } else {
          this.loading = true
          let obj = this.requestObj
          let obj1 = this.disrequestobj || {}
          // method(obj).then(res => {
          //   if (this.dataFormatting) { this.treeData = this.dataFormatting(res) }
          //   else if (Array.isArray(res.data)) { this.treeData = res.data }
          //   else { this.treeData = res.data.records }
          //   this.loading = false
          // }).catch(err => { this.loading = false }
          Promise.all([
            method(obj),
            method(obj1)
          ]).then((res) => {
            if (this.dataFormatting) { this.treeData = this.dataFormatting(res[0]) }
            else if (Array.isArray(res[0].data)) {
              if (this.disrequestobj) {
                res[0].data.map((item) => {
                  res[1].data.map((item1) => {
                    if (item.id == item1.id) {
                      item.disabled = true
                    }
                  })
                })
              }
              this.treeData = res[0].data
            } else {
              if (this.disrequestobj) {
                res[0].data.records.map((item) => {
                  res[0].data.records.map((item1) => {
                    if (item.id == item1.id) {
                      item.disabled = true
                    }
                  })
                })
              }
              this.treeData = res[0].data.records
            }
            this.loading = false
          }).catch((err) => { this.loading = false })
        }
      })
    },
    openDialog() {
      if (this.isdisabled) return
      this.keyword = ''
      this.treeData = []
      this.getData()
      this.setDefault()
      this.visible = true
    },
    search() {
      this.$refs.tree && this.$refs.tree.filter(this.keyword)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (data.disabled) return
      let currId = data.id
      let currData = data.name
      if (this.multiple) {
        const boo = this.selectedIds.some(o => o === currId)
        if (boo) return
        this.selectedIds.push(currId)
        this.selectedData.push(currData)
      } else {
        this.selectedIds = [currId]
        this.selectedData = [currData]
      }
      let selectedData = []
      for (let i = 0; i < this.selectedIds.length; i++) {
        selectedData.push({
          id: this.selectedIds[i],
          name: this.selectedData[i],
          all: data
        })
      }
      this.rSelectData = selectedData
      // console.log("选中", this.selectedIds, this.selectedData, selectedData);
    },
    removeAll() {
      this.selectedData = []
      this.selectedIds = []
      this.rSelectData = []
    },
    removeData(index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
      this.rSelectData.splice(index, 1)
    },
    async confirm() {
      let selectedData = []
      for (let i = 0; i < this.rSelectData.length; i++) {
        selectedData.push({
          id: this.selectedIds[i],
          name: this.selectedData[i],
          all: this.rSelectData[i].all
        })
      }

      let submitFlag = true
      if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(this.selectedData, this.paramsObj) }
      if (!submitFlag) {
        // this.btnLoading = false
        return
      }

      if (selectedData.length === 0) {
        // this.innerValue = ''
        // this.tagsList = ""
        // this.$emit('input', "")
        this.$emit('change', [], [], this.paramsObj)
      } else if (this.multiple) {
        // this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        // this.$emit('input', this.selectedIds)
        this.$emit('change', this.selectedIds, selectedData, this.paramsObj)
      } else {
        // this.innerValue = this.selectedData[0]
        // this.$emit('input', this.selectedIds[0])
        this.$emit('change', this.selectedIds[0], selectedData, this.paramsObj) // 注意：回显数据并不是完整数据，需要通过首个参数判断change的传值是否有效
      }
      this.visible = false
    },
    setDefault() {
      if (!this.value || !this.value.length) {
        this.innerValue = ''
        this.selectedIds = []
        this.selectedData = []
        this.rSelectData = []
        this.tagsList = []
        return
      }
      if (!this.rSelectData.length) {
        this.selectedData.push(this.value)
        this.rSelectData.push({ name: this.value })
      }
      this.innerValue = this.value
      return
      let selectedIds = this.multiple ? this.value : [this.value]
      this.selectedIds = JSON.parse(JSON.stringify(selectedIds))
      let textList = []
      for (let i = 0; i < selectedIds.length; i++) {
        const item = selectedIds[i];
        let textItem = JSON.parse(JSON.stringify(item))
        for (let j = 0; j < item.length; j++) {
          inner: for (let ii = 0; ii < this.allList.length; ii++) {
            if (item[j] === this.allList[ii].id) {
              textItem[j] = this.allList[ii].fullName
              break inner
            }
          }
        }
        textList.push(textItem)
      }
      this.selectedData = textList.map(o => o)
      if (this.multiple) {
        this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        this.$nextTick(() => {
          this.resetInputHeight();
        })
      } else {
        this.innerValue = this.selectedData.join(',')
      }
    },
    deleteTag(event, index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
      this.tagsList = []

      this.confirm()
      event.stopPropagation();
    },
    handleClearClick(event) {
      this.selectedData = []
      this.selectedIds = []
      this.rSelectData = []

      this.confirm()
      event.stopPropagation();
    },
    onClose() { },
    // clear() {
    //   if (this.selectDisabled) return
    //   this.innerValue = ''
    //   this.selectedData = []
    //   this.selectedIds = []
    //   this.selectedAll = []
    //   this.tagsList = []
    //   this.$emit('input', [])
    //   this.$emit('change', [], [], this.paramsObj)
    // },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },
    resetInputHeight() {
      if (this.collapseTags) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.childNodes;
        let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
        const tags = this.$refs.tags;
        const tagsHeight = tags ? Math.round(tags.getBoundingClientRect().height) : 0;
        const sizeInMap = this.initialInputHeight || 40;
        input.style.height = this.selectedData.length === 0
          ? sizeInMap + 'px'
          : Math.max(
            tags ? (tagsHeight + (tagsHeight > sizeInMap ? 6 : 0)) : 0,
            sizeInMap
          ) + 'px';
      });
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    }
  }
}
</script>
<style scoped>
.textcolor {
  color: #C0C4CC;
}
</style>