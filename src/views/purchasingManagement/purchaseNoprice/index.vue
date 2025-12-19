<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding: 8px">
          <div>
            <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.dataTable.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-if="tableDataFlag" highlight-current-row :fixedNO="true" ref="dataTable" :data="tableDataList" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_772301" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="code" label="产品编码" min-width="140" />
          <el-table-column prop="name" label="产品名称" min-width="140" />
          <el-table-column prop="drawingNo" label="品名规格" min-width="160" />
          <el-table-column prop="productCategoryName" label="产品分类" width="160" />
          <el-table-column prop="classAttribute" label="类别属性" min-width="120">
            <template slot-scope="scope">
              {{ $getLabel(classAttributeList, scope.row.classAttribute, 'value', 'label') }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="createByName" label="创建人" width="100" />
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="addOrUpdateHandle(scope.row)">
                新建
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData()" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData()" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getProductWithOut } from '@/api/purchasingManagement/purchaseInquirySheet'
import ExportForm from '@/components/no_mount/ExportBox/index'
import Form from '../../basicData/bomSettings/productionBom/Form.vue'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {  getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
export default {
  name: 'purOrderNoPriceQuery',
  components: { Form, ExportForm, SuperQuery },
  mixins: [getProjectList],
  props: {
    // 查询类型 区分 无价格 无bom 无工艺
    searchType: {
      type: String,
      default: 'price'
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            // { prop: 'orderNo', symbol: 'like', fixed: true },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'classAttribute',
          label: '类别属性',
          type: 'select',
          options: []
        }
      ],
      classAttributeList: [],
      exportFormVisible: false,
      background: true, //分页器背景颜色
      tableDataList: [],
      listLoading: false,
      listQuery: {
        productWithout: this.searchType,
      },
      total: 0,
      // productType: productType,
      columnList: ['createByName', 'createTime']
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    this.tableDataFlag = true
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },

    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })

      let obj = {
        pageNum: 1,
        pageSize: 20
      }
      getclassAttributeList(obj).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.code
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'classAttribute')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
        this.classAttributeList = arr
      })
    },
    // add(item) {
    //   this.$router.push({
    //     name: 'BOMCreate',
    //     params: {
    //       id: item.id,
    //       content: '新建BOM',
    //       name: item.name,
    //       drawNo: item.drawingNo,
    //       classAttribute: item.classAttribute,
    //       productSource: item.productSource
    //     }
    //   })
    // },
    addOrUpdateHandle(row, btnType, approvalStatus) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(row, 'waitAdd', false, approvalStatus)
      })
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.listQuery,
          exportType: '1125',
          exportName:
            this.listQuery.productWithout === 'price'
              ? '采购无价格查询'
              : this.listQuery.productWithout === 'bom'
                ? '待建BOM'
                : '产品无工艺查询',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },


    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      this.listLoading = true
      getProductWithOut(this.listQuery)
        .then((res) => {
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
