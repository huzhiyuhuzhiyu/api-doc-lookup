<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">异常汇总表</div>
        </div>
        <div class="xr-radio-menu-wrap" style="width: 250px;">
          <selectdate @change="datechange"></selectdate>
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
            <el-button type="primary" v-has="'btn_export'" size="mini" icon="el-icon-download" @click="exportForm" :disabled="!tableList.length">导出</el-button>
          </div>
          <div style="height: 400px;">
            <JNPF-table v-if="tableList.length > 0" ref="tabForm" :data="tableList" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;" customKey="JNPFTableKey_879476">
              <el-table-column prop="日期" label="日期" min-width="120" />
              <el-table-column v-for="item in tableColumns" :prop="item" :key="item" :label="item" width="135"></el-table-column>
            </JNPF-table>
          </div>
        </div>
      </div>
    </div>
    <ExportForm v-if="exportFormVisible" style="display: none" ref="exportForm" @download="download" :exportHidden="true" />
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import selectdate from "@/views/CRMmanagement/reportAnalysis/components/selectdate";
import {analysisByType, exportAnalysisByContent, exportAnalysisByType} from "@/api/abnormalManagement";
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  mixins:[getProjectList],
  components: {
    ExportForm,
    selectdate,
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
        userIds: [],
        projectId:''
      },
      tableList: [],
      chartInstance: null,
      option: {},
      tableColumns:[],
      isProjectSwitch:''
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.dataForm.userIds = []
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 导出
    exportForm() {

      this.exportFormVisible = true
      let columnList = this.$refs.tabForm.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => {
          this.$refs.exportForm.init(columnList)
          this.$refs.exportForm.downLoad()
      })
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
          exportType: '1217',
          exportName: '异常分析-按类型',
          includeFieldMap,
          pageSize: -1
        }
        exportAnalysisByType(_data).then(res => {
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
    async initData() {
      const dataField = '日期'
      this.chartLoading = true
      this.listLoading = true
        try {
            this.dataForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
            const res1 =  await  analysisByType(this.dataForm)
            const legendData =  Object.keys(res1.data[0]).filter(item=>item !== dataField)
            this.tableColumns =legendData
            this.tableList = res1.data
            const barWidth= Math.floor(100 / legendData.length) +'%'
            const series = legendData.map(item => {
                return {
                    name: item,
                    type: 'bar',
                    data: res1.data.map(i => i[item]),
                    barWidth
                }
            })
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
                    right: '1%',
                    bottom: '15%',
                    containLabel: true
                },
                // color: ['#42526e', '#0052cc'],
                legend: {
                    data: legendData,
                    bottom: 10
                },
                xAxis: [
                    {
                        type: 'category',
                        data: res1.data.map(item => item[dataField]),
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
                        name: '个',
                        type: 'value'
                    }
                ],
                series
            }
            this.chartLoading = false
            this.listLoading = false
        }catch (e) {
            this.chartLoading = false
            this.listLoading = false
        }
    },
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
