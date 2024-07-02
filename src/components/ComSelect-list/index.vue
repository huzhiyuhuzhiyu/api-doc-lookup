<!-- --- ComSelect-list 使用说明 ---
================================================================
  -- 组件属性/事件/方法 --
  --------------------------------------------------------------
  * 属性
  - value 绑定的值（dom显示内容）
  - title 弹出窗口标题（即将弃用，建议使用dialogTitle）
  - method 数据请求方法
  - requestObj 数据请求体
  - dataFormatting 数据格式化方法
  - placeholder dom占位符
  - paramsObj 其他参数(会跟随@change一起返回，传什么就回什么)
  - multiple 是否开启多选（默认false；为true时需要传递ids参数，作为value对应的id）
  - collapseTags 多选情况下在页面中的显示模式（默认false；true显示一项其他收起 / false全部显示）
  - isdisabled 是否禁用页面上的此表单元素（默认false；true禁用 / false不禁用）
  - tagMultipleLine 多选模式下，选择的标签是否多行显示（默认false；true多行 / false单行）
  - clearable 是否带有删除按钮（默认false；true带有删除按钮 / false不带有删除按钮）
  * 事件
  - beforeOpen 打开之前的回调方法
  - beforeSubmit 提交之前的回调方法
  * 方法
  - input 提交时触发（自动回显数据时不触发）
  - change 提交时触发
================================================================
  change事件推荐写法
  单选：(val, data, paramsObj) => {
    this.$nextTick(() => { this.$refs['dataForm'].validateField('name') }) // 校验操作的元素(name是组件绑定的value)
    if (!val && data.length) return // 忽略处理自动回显的数据
    if (data && data.length) { // 数据有效，进行更新
      this.dataForm.id = data[0].id // 或者this.dataForm['id'] = data[0].all.id
      this.dataForm.name = data[0].name // 或者this.dataForm['name'] = data[0].all.name
    } else { // 不选择任何内容，置空绑定的值
      this.dataForm.id = ""
      this.dataForm.name = ""
    }
  }
  多选：this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('names') })
    if (!data || !data.length) {
      this.dataForm['ids'] = []
      this.dataForm['names'] = []
    } else {
      this.dataForm['ids'] = data.map(o => o.id)
      this.dataForm['names'] = data.map(o => o.name)
    }
-->
<template>
  <div class="popupSelect-container">
    <div class="el-select" @click.stop="openDialog" @keyup.enter="openDialog">
      <div :class="['el-select__tags', tagMultipleLine ? '' : 'singleLine']" v-if="multiple" ref="tags"
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
            <!-- <el-input placeholder="请输入关键词查询" v-model="keyword" @keyup.enter.native="search" clearable class="search-input"
              maxlength="20">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input> -->
            <Search-input placeholder="请输入关键词查询" v-model="keyword" @keyup.enter.native="search" clearable
              class="search-input" maxlength="20" @buttonClick="search" />
          </div>
          <div class="transfer-pane__body" v-loading="loading">
            <el-tree :data="treeData" :props="props" check-on-click-node :expand-on-click-node="false" default-expand-all
              @node-click="handleNodeClick" class="JNPF-common-el-tree" node-key="id" ref="tree"
              :filter-node-method="filterNode">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span :class="['text', data.disabled ? 'nodeDisabled' : '']">{{ node.label }}</span>
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
import SearchInput from '@/components/no_mount/Search-input/index.vue'
export default {
  components: { SearchInput },
  name: 'ComSelect-list',
  props: {
    value: {
      /* 页面元素显示的内容 */
    },
    ids: {
      type: Array | Function
    },
    title: {
      default: '选择'
    },
    dialogTitle: {
      default: ''
    },
    tagMultipleLine: {
      type: Boolean,
      default: false
    },
    method: {
      required: true
    },
    requestObj: {
      required: true
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
    beforeOpen: {
      /* async (paramsObj) => {
          if (!this.dataForm.transferOutWarehouseName) return true // 如果判断条件真，直接提交，不弹出提示
          let flag = await this.$confirm('提示内容', '提示标题', { type: 'warning' }).catch(err => false)
          return flag
        } */
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
    value: {
      handler: function (val) {
        this.setDefault()
        if (Array.isArray(val)) {
          this.tagsList = JSON.parse(JSON.stringify(val));
        } else this.tagsList = []
      }, deep: false
    },
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
  },
  methods: {
    async openDialog() {
      if (this.isdisabled) return
      let openFlag = true
      if (this.beforeOpen) openFlag = await this.beforeOpen(this.paramsObj)
      if (!openFlag) return

      this.keyword = ''
      this.treeData = []
      this.getData()
      this.setDefault()
      this.visible = true
    },
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
          method(obj).then(res => {
            if (this.dataFormatting) { this.treeData = this.dataFormatting(res) }
            else if (Array.isArray(res.data)) { this.treeData = res.data }
            else { this.treeData = res.data.records }
            this.loading = false
          }).catch(err => { this.loading = false })
        }
      })
    },
    setDefault() {
      if (!this.value || !this.value.length) {
        this.innerValue = ''
        this.selectedIds = []
        this.selectedData = []
        this.rSelectData = []
        this.tagsList = []
      } else if (this.multiple) {
        if (!this.rSelectData.length || JSON.parse(JSON.stringify(this.selectedData)) !== JSON.parse(JSON.stringify(this.tagsList))) {
          this.selectedIds = typeof this.ids === 'function' ? this.ids() : [...this.ids]
          this.selectedData = [...this.value]
          this.rSelectData = this.value.map((item, index) => { return { id: this.selectedIds[index], name: this.selectedData[index], all: undefined } })
          // this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        }
        this.innerValue = ''
      } else {
        if (!this.rSelectData.length || this.selectedData[0] !== this.value) {
          this.selectedIds = []
          this.selectedData = [this.value]
          this.rSelectData = [{ name: this.value }]
        }
        this.innerValue = this.value
      }
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
    },
    removeData(index) {
      this.selectedIds.splice(index, 1)
      this.selectedData.splice(index, 1)
      this.rSelectData.splice(index, 1)
    },
    removeAll() {
      this.selectedIds = []
      this.selectedData = []
      this.rSelectData = []
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

      if (selectedData.length === 0) {
        let submitFlag = true
        if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(undefined, [], this.paramsObj) }
        if (!submitFlag) return
        // this.innerValue = ''
        // this.tagsList = ""
        this.$emit('input', '')
        this.$emit('change', undefined, [], this.paramsObj)
      } else if (this.multiple) {
        let submitFlag = true
        if (this.beforeSubmit) { submitFlag = await this.beforeSubmit( this.selectedIds, selectedData, this.paramsObj) }
        if (!submitFlag) return this.btnLoading = false
        // this.innerValue = ''
        // this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        this.selectedIds.length ? this.$emit('input', this.selectedIds) : ''
        this.$emit('change', this.selectedIds, selectedData, this.paramsObj)
      } else {
        let submitFlag = true
        if (this.beforeSubmit) { submitFlag = await this.beforeSubmit(this.selectedIds[0], selectedData, this.paramsObj) }
        if (!submitFlag) return this.btnLoading = false
        // this.innerValue = this.selectedData[0]
        this.selectedIds[0] ? this.$emit('input', this.selectedIds[0]) : ''
        this.$emit('change', this.selectedIds[0], selectedData, this.paramsObj) // 注意：回显数据并不是完整数据，需要通过首个参数判断change的传值是否有效
      }
      this.visible = false
    },
    search() {
      this.$refs.tree && this.$refs.tree.filter(this.keyword)
    },
    filterNode(value, data) {
      console.log(value,data,this.props);
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
    deleteTag(event, index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
      this.rSelectData.splice(index, 1)

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

<style lang="scss" scoped>
.singleLine {
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.nodeDisabled {
  pointer-events: none;
  color: #999;
}
</style>