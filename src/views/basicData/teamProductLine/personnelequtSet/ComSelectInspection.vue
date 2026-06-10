<!-- --- ComSelect-list 使用说明 --- -->

<!-- title 弹出窗口标题 -->
<!-- method 数据请求方法 -->
<!-- requestObj 请求对象 -->
<!-- param 其他参数(会跟随@change一起返回) -->
<!-- dataFormatting 相应数据格式化方法 -->
<!-- multiple 是否开启多选 -->
<!-- clearable 是否添加一键清除 -->
<!-- disabled 禁用的列表项（暂未完善） -->
<!-- isdisabled 是否禁用 -->
<!-- collapseTags 多选情况下在页面中的显示模式（false全部显示 / true显示一项其他收起） -->

<!-- 使用示例见@/views/basicData/materialFiles/raw_material -->

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
          <el-tag v-for="(item, i) in tagsList" :key="item.id" :size="collapseTagSize" :closable="!selectDisabled"
            type="info" @close="deleteTag($event, i)" disable-transitions>
            <span class="el-select__tags-text">{{ item.name }}</span>
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
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible"
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
    title: {
      required: true,
      default: '默认标题'
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
      rSelectData: [],
      loadingTotal:0
    }
  },
  computed: {
    showClose() {
      let hasValue = Array.isArray(this.value) && this.value.length > 0
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
  },
  created() {
    this.getData()
    // this.tagsList = []
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
    // this.selectedIds = [],
    // this.selectedData = [],
    // this.tagsList = [],
    // this.rSelectData = []
  },
  watch: {
    // value: {
    //   handler:function (val){
    //     console.log(val,'监听');
    //     this.innerValue = val
    //     this.setDefault()
    //   },
    //   deep: true
    // },
    value(val) {
      // this.innerValue = val
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
      if (++this.loadingTotal <= 1) return
      this.$nextTick(() => {
        const method = this.method
        if (((String(method).substring(String(method).length - 2)) === '{}') || !method) {
          this.treeData = []
          console.warn('<ComSelect-list/> [' + this.title + '] 请求方法无效');
        } else {
          let obj = this.requestObj
          method(obj).then(res => { 
            if (this.dataFormatting) { this.treeData = this.dataFormatting(res) }
            else if (Array.isArray(res.data)) { this.treeData = res.data }
            else { this.treeData = res.data.records }
            this.allList = [...this.treeData]
          })
        }
      })

    },
    onClose() { },
    clear() {
      if (this.selectDisabled) return
      this.innerValue = ''
      this.selectedData = []
      this.selectedIds = []
      this.selectedAll = []
      this.rSelectData = []
      this.tagsList = []
      this.$emit('input', [])
      this.$emit('change', [], [], this.paramsObj)
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
      console.log(data);
      if (data.disabled) return
      let currId = data.id
      let currData = data.name
      if (this.multiple) {
        const boo = this.selectedIds.some(o => o.id === currId)
        if (boo) return
        this.selectedIds.push({
          id:currId,
          name:currData
        })
        this.selectedData.push(currData)
      } else {
        this.selectedIds = [currId]
        this.selectedData = [currData]
      }
      // let selectedData = []
      console.log("选中", this.selectedData );
      console.log("选中", this.selectedIds );
      // for (let i = 0; i < this.selectedIds.length; i++) {
      //   if (this.selectedData[i].name) {
      //     selectedData.push({
      //       id: this.selectedIds[i],
      //       name: this.selectedData[i].name,
      //       all: data
      //     })
      //   } else{
      //     selectedData.push({
      //       id: this.selectedIds[i],
      //       name: this.selectedData[i],
      //       all: data
      //     })
      //   }
      // }
      // this.rSelectData = selectedData
      // console.log("选中", this.rSelectData );
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
      console.log(this.selectedIds,'this.selectedIds');
      // console.log(this.selectedData,'this.selectedData');
      for (let i = 0; i < this.selectedIds.length; i++) {
        let item = []
        let selectedNames = this.selectedData[i]
        // for (let j = 0; j < i; j++) {
          // item.push(selectedNames)
        // }
        selectedData.push({
          id:this.selectedIds[i].id,
          name:selectedNames
        })
      }
      if (selectedData.length === 0) {
        this.innerValue = ''
        this.tagsList = ""
        this.$emit('input', "")
        this.$emit('change', [], [], this.paramsObj)
      } else if (this.multiple) {
        this.innerValue = ''
        this.tagsList = JSON.parse(JSON.stringify(selectedData))
        console.log(this.tagsList,'11111111');
        this.$emit('input', this.selectedIds)
        this.$emit('change', this.selectedIds, selectedData, this.paramsObj)
      } else {
        this.innerValue = this.selectedData[0]
        this.$emit('input', this.selectedIds[0])
        this.$emit('change', this.selectedIds[0], selectedData[0], this.paramsObj)
      }
      this.visible = false
      // console.log("选中22", this.selectedData );
      // console.log("选中22", this.selectedIds );
    },
    findIdByName(data, id) {
      // 遍历数据数组
      for (let item of data) {
        // 如果当前项的name匹配目标name，则返回当前项的id
        if (item.id === id) {
          return  {
            name:item.name,
            id:item.id
          } 
        }
        // 如果当前项有子项，则递归查找子项中的name
        if (item.childrenList && item.childrenList.length > 0) {
          let result = this.findIdByName(item.childrenList, id);
          // 如果找到了对应的id，则返回该结果
          if (result) {
            return result;
          }
        }
      }
      // 如果没有找到对应的id，则返回null或其他特定的值
      return null;
    },
    setDefault() {
  
      if (!this.value || !this.value.length) {
        console.log(1111);
        this.innerValue = ''
        this.selectedIds = []
        this.selectedData = []
        this.rSelectData = []    
        this.tagsList = []
        return
      }
      let textList = []
      let selectedIds = this.multiple ? this.value : [this.value]
      console.log(selectedIds,'selectedIds');
      // this.selectedIds = selectedIds.filter(item=>item.id)

      this.selectedIds = JSON.parse(JSON.stringify(selectedIds))
      console.log(this.allList,'this.allList');
      for (let i = 0; i < selectedIds.length; i++) {
        const item = selectedIds[i].id;
        let textItem = JSON.parse(JSON.stringify(item))
        console.log(textItem,'textItem');
        
        textList.push(this.findIdByName(this.allList,item)) 

        // for (let j = 0; j < item.length; j++) {
        //   inner: for (let ii = 0; ii < this.allList.length; ii++) {
        //     if (item[j] === this.allList[ii].id) {
        //       textItem[j] = this.allList[ii].name
        //       break inner
        //     }
        //   }
        // }
        // textList.push(textItem)
      }
      console.log(textList,'textList');
      this.selectedData = textList.map(o => o.name)
      if (this.multiple) {
        this.innerValue = ''
        // this.tagsList = JSON.parse(JSON.stringify(this.selectedData))
        this.$nextTick(() => {
          this.resetInputHeight();
        })
      } else {
        this.innerValue = this.selectedData.join(',')
      }
      console.log(this.tagsList,'tagsList');
      console.log( this.selectedData,' this.selectedData');
    },
    deleteTag(event, index) {
      this.selectedData.splice(index, 1)
      this.selectedIds.splice(index, 1)
      this.rSelectData.splice(index, 1)
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