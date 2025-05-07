<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="dateArr" type="daterange" value-format="yyyy-MM-dd" :clearable="false"
                start-placeholder="请选择查询开始日期" end-placeholder="请选择查询结束日期" :picker-options="global.timePickerOptions"
                @change="dateArrChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.partnerGrade" placeholder="请选择客户等级" clearable>
                <el-option v-for="(item, index) in gradeList" :key="index" :label="item.fullName"
                  :value="item.enCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <el-button type="primary" size="mini" icon="icon-ym icon-ym-btn-export" @click="exportForm">导出</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" highlight-current-row fixedNO ref="tableForm" :data="tableData"
          @sort-change="sortChange" show-summary :summary-method="getSummaries" customKey="JNPFTableKey_677172">

          <el-table-column prop="partnerName" label="客户名称" min-width="300" showOverflowTooltip />

          <el-table-column v-for="(item, index) in columnList" :label="item.label" align="center">

            <el-table-column :prop="'assemblyNum' + index" label="总成数量" min-width="120">
              <template slot-scope="scope">
                {{ tableData[scope.$index].columnList[index].assemblyNum }}
              </template>
            </el-table-column>

            <el-table-column :prop="'assemblyAmount' + index" label="总成金额(万元)" min-width="160">
              <template slot-scope="scope">
                {{ tableData[scope.$index].columnList[index].assemblyAmount }}
              </template>
            </el-table-column>
            <el-table-column :prop="'domesticMarketNum' + index" label="内销数量" min-width="120">
              <template slot-scope="scope">
                {{ tableData[scope.$index].columnList[index].domesticMarketNum }}
              </template>
            </el-table-column>
            <el-table-column :prop="'domesticMarketAmount' + index" label="内销金额(万元)" min-width="160">
              <template slot-scope="scope">
                {{ tableData[scope.$index].columnList[index].domesticMarketAmount }}
              </template>
            </el-table-column>
            <el-table-column :prop="'foreignTradeNum' + index" label="外贸数量" min-width="120">
              <template slot-scope="scope">
                {{ tableData[scope.$index].columnList[index].foreignTradeNum }}
              </template>
            </el-table-column>
            <el-table-column :prop="'foreignTradeAmount' + index" label="外贸金额(万元)" min-width="160">
              <template slot-scope="scope">
                {{ tableData[scope.$index].columnList[index].foreignTradeAmount }}
              </template>
            </el-table-column>
            <el-table-column :prop="'totalAmount' + index" label="总金额(万元)" min-width="160">
              <template slot-scope="scope">
                {{ tableData[scope.$index].columnList[index].totalAmount }}
              </template>
            </el-table-column>
          </el-table-column>

        </JNPF-table>

        <!-- <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" /> -->
      </div>
    </div>
    <!-- <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-position="top">
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import { getSaleReceiveList, exportSaleReceiveData } from '@/api/reportAnalysis/saleReport.js'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
export default {
  data() {
    return {
      formVisible: false,
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        "startTime": "",
        "endTime": "",
        "startDate": "",
        "endDate": "",
        "endUpdateTime": "",
        "startUpdateTime": "",
        "partnerGrade": "",
        "partnerName": "",
        pageNum: 1,
        pageSize: 20,
      },
      dateArr: [],
      total: 0,
      exportListQuery: {}, // 导出时的请求参数
      columnList: [],
      gradeList: [],
    }
  },
  async created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    this.dateArr = this.getThreeMonth() // 获取近三个月
    this.initData()

    // 获取客户等级
    getDictionaryType().then(res => {
      let data = res.data.list
      data.forEach(item => {
        if (item.enCode == "partnerArchives") {
          let children = item.children
          children.forEach(resp => {
            if (resp.enCode == "grade") {
              let id = resp.id;
              let obj = {
                keyword: '',
                isTree: 0
              }
              getDictionaryDataList(id, obj).then(response => {
                this.gradeList = response.data.list
              })
            }
          });
        }
      });
    })
  },
  methods: {
    initData() {
      this.listLoading = true

      this.jnpf.searchTimeFormat(this.listQuery, this.dateArr, 'startDate', 'endDate')
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getSaleReceiveList(this.listQuery).then(res => {
        this.exportListQuery = JSON.parse(JSON.stringify(this.listQuery));
        // 处理合并列
        this.columnList = []
        res.data.forEach(row => {
          if (!(this.columnList.some(item => item.label === row.month))) {
            this.columnList.push({ label: row.month })
          }
        })
        // 处理二级数据
        let newData = res.data.reduce((result, obj) => {
          let existingObj = result.find(item => item.partnerName === obj.partnerName); // 查找处理结果中客户名称相同的项
          if (existingObj) {
            existingObj.columnList.push(obj)
          } else {
            result.push({
              partnerName: obj.partnerName,
              columnList: [obj]
            });
          }
          return result;
        }, []);
        // console.log(this.columnList);
        // console.log(newData);

        this.tableData = newData
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
      this.dateArr = this.getThreeMonth() // 获取近三个月
      this.initData()
    },
    sortChange({ prop, order }) {
      let newProp
      if ([].includes(prop)) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    getSummaries(param) {
      let list = []
      let relationshipList = []
      for (let i = 0; i < this.columnList.length; i++) {
        let iData = param.data.map(item => item.columnList[i]) // 第i组的列数据
        let iResData = {} // 合并后的第i组列数据
        iData.forEach(pIData => { // 每个客户的第i组数据
          let iDataProps = Object.keys(pIData) // 取出prop
          iDataProps.forEach(prop => {
            if (isNaN(pIData[prop])) return
            if (iResData.hasOwnProperty(prop)) {
              iResData[prop] = this.jnpf.math('add', [iResData[prop], pIData[prop]])
            } else {
              iResData[prop] = pIData[prop]
            }
          })
        })
        // 复制对象并修改每个键的值
        const copiedObject = {};
        for (let key in iResData) {
          let newKey = key + i;
          copiedObject[newKey] = iResData[key];
        }
        for (const key in copiedObject) {
          relationshipList.push({ prop: key, value: copiedObject[key] })
        }
      }
      param.columns.forEach(o => {
        let option = relationshipList.find(item => item.prop === o.property)
        if (option) { list.push(option.value) }
        else { list.push('') }
      })
      list[0] = "合计"
      return list
    },
    getThreeMonth() {
      // 获取当前日期
      var today = new Date();

      // 计算三个月前的日期
      var threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 2);
      threeMonthsAgo.setDate(1); // 设置为当月的1日

      // 如果最早日期超过了今年，将其设为当年的1月1日
      if (threeMonthsAgo.getFullYear() < today.getFullYear()) {
        threeMonthsAgo = new Date(today.getFullYear(), 0, 1); // 当年的1月1日
      }

      // 格式化日期为 'yyyy-MM-dd' 的形式
      function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
      }

      // 创建日期数组
      var dateArray = [];

      // 添加最早日期和今天的日期到数组中
      dateArray.push(formatDate(threeMonthsAgo));
      dateArray.push(formatDate(today));

      // 输出日期数组
      return dateArray
    },
    exportForm() {
      if (!this.tableData.length) return this.$message.error('没有可导出的数据')
      exportSaleReceiveData(this.exportListQuery).then(res => {
        this.jnpf.downloadFile(res.data.url)
      })
    },
    dateArrChange(val) {
      function isSameYear(date1, date2) {
        return date1.getFullYear() === date2.getFullYear();
      }
      const date1 = new Date(val[0]);
      const date2 = new Date(val[1]);
      if (!isSameYear(date1, date2)) {
        this.$message.error('日期筛选区间需要在同一年份')
        this.dateArr = [this.listQuery.startDate, this.listQuery.endDate]
      }
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />