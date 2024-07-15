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
    <el-dialog title="选择分类" :close-on-click-modal="false" :visible.sync="visible"
      class="JNPF-dialog JNPF-dialog_center transfer-dialog" lock-scroll append-to-body width="800px"
      :modal-append-to-body="false" @close="onClose">
      <div class="transfer__body">
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <el-input placeholder="请输入关键词查询" v-model="keyword" @keyup.enter.native="search" clearable
              class="search-input">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
          <div class="transfer-pane__body">
            <el-tree :data="treeData" :props="props" check-on-click-node :expand-on-click-node="false" default-expand-all
              @node-click="handleNodeClick" class="JNPF-common-el-tree" node-key="id" v-loading="loading" ref="tree"
              :filter-node-method="filterNode">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span class="text">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <span>已选</span>
            <el-button @click="removeAll" type="text" class="removeAllBtn">清空列表</el-button>
          </div>
          <div class="transfer-pane__body shadow right-pane">
            <template>
              <div v-for="(item, index) in selectedData" :key="index" class="selected-item">
                <span :title="item">{{ item }}</span>
                <i class="el-icon-delete" v-if="item" @click="removeData(index)"></i>
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
import { getcategoryTree } from '@/api/basicData/index'

export default {
  name: 'comSelect2',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      default: () => []
    },
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
    auth: {
      type: Boolean,
      default: false
    },
    isOnlyOrg: {
      type: Boolean,
      default: false
    },
    size: String,
    currOrgId: {
      default: '0'
    },
    parentId: {
      default: ''
    },
    selectClassifyType: {
      default: ''
    },
    isdisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [],
      allList: [],
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
      inputHovering: false,
      inputWidth: 0,
      initialInputHeight: 0,
      rSelectData: []
    }
  },
  computed: {
    showClose() {
      let hasValue = Array.isArray(this.value) && this.value.length > 0
      let criteria = this.clearable &&
        !this.selectDisabled &&
        this.inputHovering &&
        hasValue;
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
  },
  created() {
    this.getData()
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
    allList: {
      handler: function (val) {
        this.setDefault()
      },
      deep: true
    }
  },
  methods: {
    async getData() {

      const topItem = {
        fullName: "顶级节点",
        hasChildren: true,
        id: "-1",
        icon: "icon-ym icon-ym-tree-organization3",
        organize: '顶级节点',
        organizeIds: ['-1']
      }
      if (this.selectClassifyType){
        const method = getcategoryTree
        let obj = {
          type: this.selectClassifyType,
          keyword: "",
          id: ""
        }
        method(obj).then(res => {
          this.treeData = res.data
          this.allList = this.treeData
        })
      }
    },
    onClose() { },
    clear() {
      if (this.selectDisabled) return
      this.innerValue = ''
      this.selectedData = []
      this.selectedIds = []
      this.rSelectData = []
      this.tagsList = []
      this.$emit('input', [])
      this.$emit('change', [], [])
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
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
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
    confirm() {
      let selectedData = []
      for (let i = 0; i < this.selectedIds.length; i++) {
        let item = []
        let selectedNames = this.selectedData[i]
        for (let j = 0; j < this.selectedIds.length; j++) {
          item.push({
            id: this.selectedIds[i],
            name: selectedNames,
          })
        }
        selectedData.push(item)
      }
      if (this.multiple) {
        this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        this.$emit('input', this.selectedIds)
        this.$emit('change', this.selectedIds, selectedData)
      } else {
        this.innerValue = this.selectedData
        this.$emit('input', this.selectedIds[0])
        this.$emit('change', this.selectedIds[0], selectedData[0])
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
      }
      // else if (this.multiple) {
      //   if (!this.rSelectData.length || JSON.parse(JSON.stringify(this.selectedData)) !== JSON.parse(JSON.stringify(this.tagsList))) {
      //     this.selectedIds = typeof this.ids === 'function' ? this.ids() : [...this.ids]
      //     this.selectedData = [...this.value]
      //     this.rSelectData = this.value.map((item, index) => { return { id: this.selectedIds[index], name: this.selectedData[index], all: undefined } })
      //     // this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
      //   }
      //   this.innerValue = ''
      // } else {
      //   if (!this.rSelectData.length || this.selectedData[0] !== this.value) {
      //     this.selectedIds = []
      //     this.selectedData = [this.value]
      //     this.rSelectData = [{ name: this.value }]
      //   }
      //   this.innerValue = this.value
      // }
      // return 
      let selectedIds = this.multiple ? this.value : [[this.value]]
      this.selectedIds = JSON.parse(JSON.stringify(selectedIds))
      let textList = []
      for (let i = 0; i < selectedIds.length; i++) {
        const item = selectedIds[i];
        let textItem = JSON.parse(JSON.stringify(item))
        for (let j = 0; j < item.length; j++) {
          inner: for (let ii = 0; ii < this.allList.length; ii++) {
            if (item[j] === this.allList[ii].id) {
              textItem[j] = this.allList[ii].name
              break inner
            }
          }
        }
        textList.push(textItem)
      }
      this.selectedData = textList.map(o => o.join(','))
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