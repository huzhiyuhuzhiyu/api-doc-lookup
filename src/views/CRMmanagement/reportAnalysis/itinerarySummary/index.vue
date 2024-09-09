<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">行程信息汇总分析</div>
        </div>
        <div class="xr-radio-menu-wrap" style="width: 250px;">
          <selectdate @change="datechange"></selectdate>
        </div>
        <div class="xr-radio-menu-wrap">
          <selectdepartment @change="departmentchange"></selectdepartment>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search()">
          {{ $t('common.search') }}</el-button>
      </div>
      <div class="content-table-main">
        <div class="axis-content" v-loading="chartLoading">
          <div id="CustomerAnaly" :option="option" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="table-content" v-loading="listLoading">
          <div class="handle-bar">
            <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download" @click="exportForm" :disabled="!tableList.length">导出</el-button>
          </div>
          <div style="height: 400px;">
            <JNPF-table ref="tabForm" :data="tableList" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;">
              <el-table-column prop="realName" label="员工姓名" min-width="120" />
              <el-table-column prop="travelNum" label="行程数量" min-width="120" />
              <el-table-column prop="mileage" label="里程数" min-width="120" />
            </JNPF-table>
          </div>
        </div>
      </div>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" :exportHidden="true" />
  </div>
</template>

<script>
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { mapGetters } from 'vuex'
import { gettravelInformationInfo, gettravelInformation } from "@/api/CRMmanagement/instrumentPanel/index";
import selectdate from "../components/selectdate";
import selectdepartment from "../components/selectdepartment";
export default {
  components: {
    ExportForm,
    selectdate,
    selectdepartment
  },
  data() {
    return {
      exportFormVisible: false,
      chartLoading: false,
      listLoading: false,
      dataForm: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: []
      },
      tableList: [],
      chartInstance: null,
      option: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.dataForm.userIds = [this.userInfo.userId]
    this.initData()
  },
  mounted() {
    this.chartInstance = this.$echarts.init(document.getElementById('CustomerAnaly'));
    this.chartInstance.setOption(this.option);
    window.onresize = () => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.chartInstance.resize()
      }, 100);
    }
  },
  beforeDestroy() {
    window.onresize = null
  },
  watch: {
    option: {
      handler(newOption) {
        if (this.chartInstance) {
          this.chartInstance.setOption(newOption);
        }
      },
      deep: true
    }
  },
  methods: {
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tabForm.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.dataForm,
          exportType: '1216',
          exportName: '行程信息汇总分析',
          includeFieldMap,
          pageSize: -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    search() {
      this.initData()
    },
    datechange(data) {
      this.dataForm.startTime = data.dateStart
      this.dataForm.endTime = data.dateEnd
      this.dataForm.type = data.value
    },
    departmentchange(data) {
      this.dataForm.userIds = data
    },
    initData() {
      this.chartLoading = true
      this.listLoading = true
      gettravelInformationInfo(this.dataForm).then(res1 => {
        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          grid: {
            top: '10%',
            left: '1%',
            right: '3%',
            bottom: '15%',
            containLabel: true
          },
          color: ['#0052cc', '#42526e'],
          legend: {
            data: ['里程数', '行程数量'],
            bottom: 10
          },
          xAxis: [
            {
              type: 'category',
              data: res1.data.map(item => item.realName),
              axisTick: {
                alignWithLabel: true,
                show: false
              }
            }
          ],
          yAxis: [
            {
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              type: 'value',
              name: '里程数',
              axisLabel: {
                formatter: '{value} km'
              },
              minInterval: 1
            },
            {
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              type: 'value',
              name: '行程数量',
              axisLabel: {
                formatter: '{value} 个'
              },
              minInterval: 1
            }
          ],
          series: [
            {
              barWidth: '20%',
              name: '里程数',
              type: 'bar',
              data: res1.data.map(item => item.mileage)
            },
            {
              barWidth: '20%',
              name: '行程数量',
              yAxisIndex: 1,
              type: 'bar',
              data: res1.data.map(item => item.travelNum)
            }
          ]
        }
        this.tableList = res1.data
        this.listLoading = false
        this.chartLoading = false
      }).catch(() => {
        this.listLoading = false
        this.chartLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.JNPF-flex-main {
  padding: 14px 0 0 14px;
}
.JNPF-common-layout {
  background-color: #fff;
}
.filtrate-content {
  ::v-deep .el-button--small {
    padding: 8px 15px;
  }
  .title-box {
    width: auto;
    max-width: 250px;
    margin-right: 24px;
    .icon-box {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      margin-right: 10px;
      line-height: 34px;
      color: #0052cc;
      text-align: center;
      background-color: #dfe8ff;
      border-radius: 50%;
    }
    .text-one-line {
      font-size: 20px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .xr-radio-menu-wrap {
    margin-right: 16px;
  }
}
.content-table-main {
  height: calc(100% - 54px);
  padding-bottom: 24px;
  margin-top: 24px;
  overflow-y: auto;
  .axis-content {
    margin-right: 40px;
    margin-bottom: 24px;
  }
  .table-content {
    padding-right: 40px;
    .handle-bar {
      margin-bottom: 8px;
      text-align: right;
    }
  }
}
</style>