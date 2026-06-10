<template>
  <div>
    <div v-if="searchList.length">
      <el-row :class="['JNPF-common-search-box']" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col v-for="(item, index) in searchList" :span="4" :key="item.prop" :style="{ paddingLeft: 0 }">
            <el-form-item>
              <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                clearable @keyup.enter.native="search()" />
              <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" clearable>
                <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>
              <!-- <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery[item.prop]"
                  :start-placeholder="'请选择' + item.label + '开始日期'" :end-placeholder="'请选择' + item.label + '结束日期'"
                  clearable type="daterange" value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-date-picker v-else-if="item.type === 'dateTime'" v-model="listQuery[item.prop]"
                  :start-placeholder="'请选择' + item.label + '开始时间'" :end-placeholder="'请选择' + item.label + '结束时间'"
                  clearable type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker> -->
              <span v-else>搜索条件缺少type</span>
            </el-form-item>
          </el-col>

          <el-col :span="4" v-if="searchList.length" :class="searchList.length === 0 ? 'killPadding' : ''">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button v-if="searchList.length > maxShowSearchField || (moreSearchList && moreSearchList.length)"
            style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueriesVisible = true">更多查询</el-button> -->
        </el-form>
      </el-row>
    </div>
    <el-table v-bind="{ ...$attrs, searchList: null, data: actualRenderList }" v-on="$listeners"
      v-loading="listLoading">
      <slot />
    </el-table>
    <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData"
      :style="{ marginTop: 0 }" />
  </div>
</template>

<script>
export default {
  name: 'Pagination-table',
  props: {
    data: {
      type: Array,
      required: true
    },
    paginationFlag: {
      type: Boolean,
      default: true,
    },
    searchList: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      listQuery: {},
      initListQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      /**实际渲染的数据列表 */
      actualRenderList: [],
      total: 0,
      listLoading: false,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
  },
  watch: {
    data(val) {
      console.log('data更新', val.length);
      this.initData()
    }
  },
  methods: {
    async initData() {
      this.listLoading = true
      await new Promise(resolve => { setTimeout(() => resolve(), 100) })
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      let tempList = this.data
      this.searchList.forEach(item => {
        if (this.listQuery[item.prop] !== undefined && this.listQuery[item.prop] !== '') {
          if (item.type === 'input') {
            tempList = tempList.filter(row => !['', undefined, null].includes(row[item.prop]) ? row[item.prop].indexOf(this.listQuery[item.prop]) !== -1 : !this.listQuery[item.prop])
          } else if (item.type === 'select') {
            tempList = tempList.filter(row => this.isSame(row[item.prop], this.listQuery[item.prop]))
          }
        }
      });

      this.total = tempList.length

      const startIndex = this.listQuery.pageSize * (this.listQuery.pageNum - 1)
      const endIndex = startIndex + this.listQuery.pageSize
      tempList = tempList.slice(startIndex, endIndex)
      this.actualRenderList = tempList

      this.listLoading = false
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
    getRealScopeIndex(index) {
      this.actualRenderList[index].__flag__ = true
      const realScopeIndex = this.data.findIndex(item => item.__flag__)
      delete this.actualRenderList[index].__flag__
      return realScopeIndex
    },
    /**判断同概念 */
    isSame(a, b) {
      a === null || a === undefined ? a = '' : ''
      b === null || b === undefined ? b = '' : ''
      return a == b
    },
  }
}
</script>
<style lang="scss" scoped></style>