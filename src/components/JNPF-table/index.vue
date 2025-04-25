<template>
    <div class="tableContainer" v-if="!refreshTable">
        <el-table :data="data" ref="JNPFTable" class="JNPF-common-table" :height="height"
                  :element-loading-text="$t('common.loadingText')" v-bind="$attrs"

                  v-on="$listeners"
                  :border="border"
                  :header-cell-style="headerCellStyle" @header-dragend="handleHeaderDragEnd">
            <el-table-column prop="selection" type="selection" width="45" key="selection" :fixed="fixedSelect"
                             v-if="_hasC"
                             align="center" :selectable="checkSelectable"/>
            <el-table-column align="center" label="拖动" width="60" v-if="hasMove">
                <template>
                    <i class="drag-handler icon-ym icon-ym-darg" style="cursor: move;font-size:20px" disabled
                       title='点击拖动'/>
                </template>
            </el-table-column>
            <el-table-column prop="index" type="index" key="index" width="60" label="序号" v-if="hasNO" :fixed="fixedNO"
                             align="center"/>
            <jnpf-table-column :columns="columns" :columnList="columnList" v-if="customColumn"/>
            <template v-else>
                <slot/>
            </template>
            <!--      <el-table-column align="center" fixed="right" width="1" v-if="customColumn">-->
            <!--        <template slot="header">-->
            <!--          <el-tooltip content="表头设置" placement="top">-->
            <!--            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="showDrawer" />-->
            <!--          </el-tooltip>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
            <template slot="empty">
                <el-empty description="暂无数据" :image-size="120"></el-empty>
            </template>
        </el-table>
        <ColumnSettings v-if="drawerVisible" ref="columnSettings" :defaultColumns="defaultColumns"
                        :columnList="columnList" :setColumnDisplayList="setColumnDisplayList"
                        @setColumn="setColumn"/>
    </div>
</template>

<script>
import JnpfTableColumn from './Column';
import ColumnSettings from './ColumnSettings';
import Sortable from 'sortablejs';
import {deepClone, getPromise} from '@/utils';
import { saveWebCache } from '@/api/system/system'

export default {
    name: 'JNPF-table',
    components: {JnpfTableColumn, ColumnSettings},
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        setColumnDisplayList: {
            type: Array,
            default: () => [],
        },
        // 序号 默认有
        hasNO: {
            type: Boolean,
            default: true,
        },
        // 是否有拖动 默认无
        hasMove: {
            type: Boolean,
            default: false,
        },
        // 序号 是否固定
        fixedNO: {
            type: Boolean,
            default: false,
        },
        fixedSelect: {
            type: Boolean,
            default: false,
        },
        // 多选框 默认无，传入数组时，会把数组每一项解析为v-has的值，包含任意一项就会显示复选框
        hasC: {
            type: Boolean | Array,
            default: false,
        },
        border: {
            type: Boolean,
            default: true,
        },
        customColumn: {
            type: Boolean,
            default: false,
        },
        // 超出内容自动显示省略号 默认是
        showOverflowTooltip: {
            type: Boolean,
            default: true,
        },
        height: {
            default: '100%',
        },
        checkSelectable: {
            type: Function,
            default: () => (row) => {
                if (row.top) return false;
                return true;
            },
        },
        partentOrChild: {
            type: String,
            default: 'partent',
        },
        customKey: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            columnList: [],
            hasSlotContent: false,
            columns: [],
            defaultColumns: [],
            drawerVisible: false,
            refreshTable: false,
            headerCellStyle: {
                backgroundColor: '#f5f7fa',
                fontWeight: 'bold',
            },
            tableRealRef: null,
            tableRealRefPromise: null,
            tableRealRefResolve: null,
            timeout: null,
        };
    },
    watch: {
        data: {
            handler(val) {
                if (!val) return;
                this.doLayout(false);
            },
            deep: true,
        },
        hasMove: {
            handler(val) {
                if (val) {
                    this.rowDrop(); //声明表格拖动排序方法
                } else {
                    this.sortable.destroy()
                }
            },
            deep: true,
        },
    },
    computed: {
        menuId() {
            return this.$route.meta.modelId || '';
        },
        selection() {
            return this.$refs.JNPFTable.selection;
        },
        _customKey() {
            return this.customKey || this.partentOrChild
        },
        _hasC() {
            if (this.hasC === '') return true
            if (Array.isArray(this.hasC)) {
                const menuPermissionList = this.$store.getters.permissionList.filter(o => o.modelId === this.$route.meta.modelId)
                return this.hasC.some(item => menuPermissionList.some(o => o.button.some(o2 => o2.enCode === item)))
            }
            return this.hasC
        },

    },
    created() {
        const {promise, resolve} = getPromise();
        this.tableRealRefPromise = promise;
        this.tableRealRefResolve = resolve;
    },
    mounted() {
        this.tableRealRefResolve(this.$refs.JNPFTable);
        this.getColumns();
        if (this.hasMove) {
            this.rowDrop(); //声明表格拖动排序方法
        }
    },
    beforeUpdate() {
        // this.getColumns()
        this.setShowOverflowTooltip();
    },
    updated() {
        if (this.refreshTable) this.refreshTable = false;
    },
    methods: {
        /**
         * 清除排序
         * @returns {Promise<void>}
         */
        async clearSort() {
            const tableRef = await this.getTableRef();
            tableRef.clearSort();
        },
        /**
         * 获取表格实例 在此promise后可以获取到表格实例
         * @returns {ElTable}
         */
        getTableRef() {
            return this.tableRealRefPromise;
        },

        /**
         * 以下为复选框增强方法
         * ------start-----
         */
        /**
         * 获取当前选择的行
         * @returns {[]|{}}
         */
        getCurrentSelection() {
            return deepClone(this.selection);
        },
        /**
         * 切换所有行的状态
         * @returns {*|void}
         */
        async toggleAllSelection() {
            const tableRef = await this.getTableRef();
            return tableRef.toggleAllSelection();
        },
        /**
         * 全选
         * @returns {Promise<void>}
         */
        async allRowCheck() {
            const tableRef = await this.getTableRef();
            tableRef.clearSelection();
            await this.$nextTick();
            this.toggleAllSelection();
        },
        /**
         * 取消全选
         */
        async allRowCancelCheck() {
            const tableRef = await this.getTableRef();
            tableRef.clearSelection();
        },
        /**
         * 当前是否有被选中的
         * @returns {boolean}
         */
        hasSelection() {
            return this.selection.length > 0;
        },
        /**
         * 切换选中行
         * @param rows
         * @param checked
         */
        async toggleSelection(rows, checked = true) {
            const tableRef = await this.getTableRef();
            if (rows) {
                rows.forEach(row => {
                    tableRef.toggleRowSelection(row, checked);
                });
            } else {
                tableRef.clearSelection();
            }
        },
        /**
         *
         * ------end-----
         */
        // 缓存存在 或不存在
        changeCacheWidth(cacheList,column,newWidth){
          // 更新列宽
          const index = cacheList.findIndex(item => item.prop === column.property);
          if (index !== -1) {
            cacheList[index].minWidth = newWidth
            cacheList[index].width = newWidth
            // 保存列宽到 localStorage
            this.columnList = cacheList;
            this.jnpf.storageSet({[this.menuId + this._customKey]: cacheList});
          }
        },
        // 当列宽拖动结束时调用
        async handleHeaderDragEnd(newWidth, oldWidth, column) {
            this.columns = this.$slots.default; // 代码传入的列
            let defaultColumns = this.columns.map(o => o.componentOptions && o.componentOptions.propsData).
                filter(item => item);
            this.defaultColumns = JSON.parse(JSON.stringify(defaultColumns.filter(o => o.prop))); //
            let list = JSON.parse(JSON.stringify(this.defaultColumns));
            list.forEach(item => {
                // item.width = item.width || item.minWidth;
                // item.minWidth = item.minWidth || item.width;
                ({ width: item.width = item.minWidth, minWidth: item.minWidth = item.width } = item);
                item.columnVisible = !this.setColumnDisplayList.includes(item.prop);
            });
            const cacheList = this.jnpf.storageGet(this.menuId + this._customKey);
            if (!cacheList) {
              this.changeCacheWidth(list,column,newWidth)
            }else{
              this.changeCacheWidth(cacheList,column,newWidth)
            }
            this.$nextTick(() => {
                this.doLayout(false);
                this.saveTableConfigToSever()
            });
        },
        setShowOverflowTooltip() {
            const children = this.$slots.default || [];
            const cacheList = this.jnpf.storageGet(this.menuId + this._customKey);
            if (children.length > 0) {
                children.forEach((child) => {
                    let childPropsData = child.componentOptions ? child.componentOptions.propsData : '';
                    if (childPropsData !== '' && childPropsData.label !== '操作') {
                        // 添加show-overflow-tooltip属性，并设置为接收的showOverflowTooltip
                        childPropsData.showOverflowTooltip = childPropsData.hasOwnProperty('showOverflowTooltip') ? childPropsData.showOverflowTooltip : this.showOverflowTooltip;
                        if (childPropsData.fixed === 'left' || childPropsData.fixed === '') {
                            // 防止左吸附列的内容没有在占满格子的情况下展示不全
                            child.componentOptions.propsData.minWidth = childPropsData.minWidth ||
                                childPropsData.width || 0;
                            delete child.componentOptions.propsData.width;
                        }
                        if (cacheList){
                            const target = cacheList.find(item => item.prop === childPropsData.prop)
                            if (target) {
                                childPropsData.minWidth = target.minWidth
                                childPropsData.width = target.width
                            }
                        }
                    }
                });
            }
        },
        showDrawer() {
            this.drawerVisible = true;
            this.$nextTick(() => {
                this.$refs.columnSettings.init(this.columnList, this.columns);
            });
        },
        checkForSlotContent() {
            let checkForContent = (hasContent, node) => {
                return hasContent || node.tag || (node.text && node.text.trim());
            };
            return this.$slots && this.$slots.default && this.$slots.default.reduce(checkForContent, false);
        },
        async getColumns() {
            if (!this.customColumn) return;
            this.hasSlotContent = this.checkForSlotContent();
            if (!this.hasSlotContent) return;
            await this.$nextTick();
            this.columns = this.$slots.default; // 代码传入的列
            let defaultColumns = this.columns.map(o => o.componentOptions && o.componentOptions.propsData).
                filter(item => item);
            this.defaultColumns = JSON.parse(JSON.stringify(defaultColumns.filter(o => o.prop))); //
            let list = JSON.parse(JSON.stringify(this.defaultColumns));

            let cacheList = this.jnpf.storageGet(this.menuId + this._customKey);
            if (!cacheList) {
                list.forEach(item => {
                    if (this.setColumnDisplayList.includes(item.prop)) {
                        item.columnVisible = false;
                    } else {
                        item.columnVisible = true;
                    }
                });
                this.columnList = list;
                // this.columnList = list.map(item => {
                //   return {
                //     ...item,
                //     columnVisible: true
                //   }
                // })
            } else {
                const copyCacheList = JSON.parse(JSON.stringify(cacheList))
                this.defaultColumns.forEach((item, index) => {
                    const newItemFlag = copyCacheList.some(cacheItem => cacheItem.prop === item.prop)
                    if (!newItemFlag) {
                        item.columnVisible = true // 新增加的列默认显示
                        const prevColumn = this.defaultColumns[index - 1] || null
                        if (prevColumn) {
                            // 找到prevColumn在cacheList中的索引，在cacheList中插入item
                            const prevColumnIndex = copyCacheList.findIndex(item => item.prop === prevColumn.prop)
                            copyCacheList.splice(prevColumnIndex + 1, 0, item)
                        } else {
                            copyCacheList.unshift(item)
                        }
                    }
                })
                cacheList = copyCacheList

                let columnList = cacheList.map(item => {
                    let isShow = false;
                    list.forEach(item2 => {
                        if (item.prop === item2.prop) {
                          isShow = true;
                          item2.width = item.width;
                          item2.minWidth = item.minWidth;
                        }
                    });
                    return isShow ? item : null;
                }).filter(item => item);
                this.columnList = this.mergeArray(columnList, list); // 实际展示的列
                this.setPropsMinWidth(this.columnList)
            }

        },
        mergeArray(arr1, arr2) {
            let arr = [...arr1];
            for (let i = 0; i < arr2.length; i++) {
                let flag = true;
                inner: for (let j = 0; j < arr1.length; j++) {
                    if (arr2[i].prop == arr1[j].prop) {
                        flag = false;
                        break inner;
                    }
                }
                if (flag) arr.push(arr2[i]);
            }
            return arr;
        },
        async doLayout(flag = true) {
            if (flag) {
                this.columns = [];
                await this.$nextTick();
                await this.getColumns();
            }
            const ref = await this.getTableRef();
            ref.doLayout();
        },
        setPropsMinWidth(list){
            // 如果list没有带有minWidth属性的项，则给所有的展示项的width都改为minWidth
            let showColumnList = list.filter(item => !!item.columnVisible);
            let hasMinWidthFlag = showColumnList.some(item => item.hasOwnProperty('minWidth'));
            if (!hasMinWidthFlag) {
                list.forEach((item, index) => {
                    if (item.columnVisible) {
                        this.$slots.default[index].componentOptions.propsData.minWidth = item.width;
                        this.$slots.default[index].componentOptions.propsData.initialWidth = item.width; // 标记此字段初始宽度，用于逆向此操作
                        delete this.$slots.default[index].componentOptions.propsData.width;
                    }
                });
            } else {
                // 逆向minWidth
                this.$slots.default.forEach(item => {
                    if (item.componentOptions && item.componentOptions.propsData.hasOwnProperty('initialWidth')) {
                        item.componentOptions.propsData.width = item.componentOptions.propsData.initialWidth;
                        delete item.componentOptions.propsData.minWidth;
                        delete item.componentOptions.propsData.initialWidth;
                    }
                });
            }
        },
        setColumn(list) {
            this.setPropsMinWidth(list)
            // 设置固定方向
            list.forEach((item, index) => {
                if (item.columnVisible && item.fixed === 'left' || item.fixed === '' || item.fixed === 'right') {
                    this.$set(this.$slots.default[index].componentOptions.propsData, 'fixed', item.fixed);
                }
            });
            // this.loading = true
            this.jnpf.storageSet({[this.menuId + this._customKey]: list});
            this.columnList = list;
            this.$forceUpdate();
            this.refreshTable = true;
            this.saveTableConfigToSever()
        },
        // 表格拖动方法
        rowDrop() {
            const el = this.$refs.JNPFTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost',
                setData: function(dataTransfer) {
                    dataTransfer.setData('Text', '');
                },
                onEnd: evt => {
                    const targetRow = this.data.splice(evt.oldIndex, 1)[0];
                    this.data.splice(evt.newIndex, 0, targetRow);
                    console.log(this.data);
                    let att = [];
                    this.data.forEach((item, index) => {
                        let obj = {
                            sortCode: index,
                            ...item,
                        };
                        att.push(obj);
                    });
                    this.$emit('changeMove', att);
                    // updateSortBatch(att).then(res => {
                    //   this.$message.success("批量修改排序成功")
                    //   this.initData()

                    // })
                },
            });
        },
        // 保存表格配置到后端
        saveTableConfigToSever() {
            if (!this.$store.getters.configData.system.web_cache_way) return
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                // 获取本地localStorage中JNPF-table的配置
                let tableColumn = {}
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i)
                    if (/^jnpf_(\d{18}|[0-9a-fA-F]{32})/.test(key)) {
                        tableColumn[key] = localStorage.getItem(key)
                    }
                }
                saveWebCache({ tableColumn: JSON.stringify(tableColumn) })
            }, 1000)
        }
    },
};
</script>
<style lang="scss" scoped>
.tableContainer {
    flex: 1 0 0;
    height: 100%;
    overflow: hidden;
}
</style>
<style scoped>
/* .JNPF-common-table {
  border: none !important;
  border-top: 1px solid #EBEEF5 !important;
} */
</style>
