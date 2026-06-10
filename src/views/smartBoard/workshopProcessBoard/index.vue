<script>
import { addComma, getLineIfEmpty, getZeroIfEmpty } from '@/utils'
import BoardWrapper from '@/views/smartBoard/component/BoardWrapper.vue'
import store from '@/store'
import { getReportWipOrderPrdScheduleByTenant } from '@/api/smartReport'
import AutoScrollMixin from '@/views/smartBoard/util/AutoScrollMixin'

const Color = {
  blue: '#002246',
  orange: '#d99000',
  green: '#00a78c',
  red: '#f5706d'
}

export default {
  name: 'WorkshopProcessBoard',
  mixins: [AutoScrollMixin],
  components: {  BoardWrapper },
  methods: {
    getZeroIfEmpty,
    getLineIfEmpty,
    addComma,
    async getData(noLoop) {

      try {


        if (this.totalPages <= this.pageNum) {
          if (noLoop) {
            // 加载完毕
            return
          }
          this.list = []
          this.pageNum = 1
        } else {
          this.pageNum += 1
        }
        const res = await getReportWipOrderPrdScheduleByTenant({
          orderNo: '',
          productName: '',
          productDrawingNo: '',
          orderItems: [
            {
              asc: false,
              column: 'order_status'
            }
          ],
          'pageNum': this.pageNum,
          'pageSize': this.pageSize,
          classAttribute:this.classAttribute,
          tenantId: this.tenantId
        })

        this.total = res.data.total
        this.totalPages = res.data.pages
        if(this.isPage){
          this.list =  res.data.records
        }else{
          this.list = this.pageNum === 1 ? res.data.records : this.list.concat(res.data.records)
        }
        if (this.total === 0) {
          this.$message.info('暂无数据')
          return
        }
        this.endAutoScroll()
        await this.$nextTick()
        this.startAutoScroll()
      } catch (e) {
        console.error(e)
        this.endAutoScroll()
        this.$message.error('数据获取失败')
        this.list = []

        setTimeout(() => {
          // 15秒后重新请求数据
          this.reset()
        }, 15 * 1000);
      }
    },
    async reset() {
      this.tableVisible =false
      this.pageNum = 1
      this.list = []
      this.total = 0
      this.totalPages = 0
      this.endAutoScroll()
      await this.$nextTick()
      this.tableVisible = true
      await this.$nextTick()
      this.contentDom = this.$refs.table.$refs.bodyWrapper
      this.getData()
    },
    changePage() {
      console.log('触发数据加载')
      this.getData()
    }
  },
  computed:{
    isFinish(){
      return this.$route.fullPath.includes('finish')
    },
    classAttribute(){
      return this.isFinish ? 'finish_product' : 'semi_finished'
    },
    boardTitle(){
      if (this.isXQ) {
        return '生产车间看板'
      }
      return  this.isFinish ? '装配车间看板' :  `${this.isJROrXY ? '钢球' : '套圈'}车间看板`
    }
  },
  data() {
    return {
      tableHeight: '100px',
      list: [],
      total: 0,
      totalPages: 0,
      pageNum: 1, // 初始化的时候需要是0，因为滚动组件会+1 再初始化
      pageSize: 20,
      status: {
        'init': 'info',
        'apply': 'warning',
        'finish': 'success',
        '0': 'info',
        '1': 'warning',
        '2': 'success'
      },
      statusColor: {
        'init': Color.blue,
        'apply': Color.orange,
        'finish': Color.green,
        'stop': Color.red,
        'normal': Color.orange,
        'closed': Color.red,
        'force_abort': Color.red,
        'outsourced': Color.blue,
        'procurement': Color.blue,
        'back': Color.blue,
        '0': Color.blue,
        '1': Color.orange,
        '2': Color.green,
        '3': Color.red,
      },
      status2Chinese:{
        finish:"已完成",
        normal:"进行中",
        suspend:"已暂停",
        closed:"已关单",
        force_abort:"强制中止",
        outsourced:"外协中",
        procurement:"采购中",
        back:"撤回",
      },
      tableVisible:true,
    }
  },
  mounted() {
    this.contentDom = this.$refs.table.$refs.bodyWrapper
    this.getData()
  }
}
</script>

<template>
  <BoardWrapper
    @refresh="reset"
    :is-play.sync="isPlay"
    :board-title="boardTitle"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="加载中..."
    :legend-list="[
      {text:'已完成', color:statusColor.finish},
      {text:'进行中', color:statusColor.apply},
      {text:'未开始', color:statusColor.init},
      {text:'已暂停', color:statusColor.stop},
    ]"
  >
    <el-table v-if="tableVisible" empty-text=" " height="100%" :data="list" stripe ref="table">
      <el-table-column width="180" label="生产任务单号" prop="orderNo"/>
      <el-table-column width="100" label="任务状态" prop="productionQuantity">
        <template slot-scope="scope">
          <span>
              <div
                class="c-tag"
                :style="{ backgroundColor: statusColor[scope.row.orderStatus] }"
              >
            {{ status2Chinese[scope.row.orderStatus] || scope.row.orderStatus }}
          </div>
          </span>


        </template>
      </el-table-column>
      <el-table-column min-width="200" label="物料名称" prop="productName"/>
      <el-table-column min-width="200" label="型号" prop="productDrawingNo"/>
      <el-table-column width="100" label="生产数量" prop="productionQuantity">
        <template v-slot:default="{ row: column }">
          <span>{{ addComma(column.productionQuantity) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" label="最后报工工序/时间" prop="productionQuantity" v-if="isMS || isZY || isJR || isXY">
        <template v-slot:default="{ row }">
          <span>{{ getLineIfEmpty(row.processName)  }}</span> /
          <span>{{ getLineIfEmpty(row.latestReportingTime) }}</span>

        </template>
      </el-table-column>

      <el-table-column min-width="500" :label="isZP ?'工序 总数 (合格/不合格)':'工序'" prop="productionQuantity"  >
        <template v-slot:default="{ row: column}">
           <span v-if="column && column.processWipCirculationList" style="display: flex;align-items: center;flex-wrap: wrap;">
            <div v-for="(process, index) in column.processWipCirculationList" :key="index"
                  class="c-tag"
                 :style="{ backgroundColor: statusColor[process.status] }"
            >
<!--              <el-tag size="small" :type="status[process.status]">-->
                {{ process.processName }}&nbsp;&nbsp;{{ process.num }}
                <template v-if="isZP">
                 ({{getZeroIfEmpty(process.qualifiedQuantity)}}/{{getZeroIfEmpty(process.unqualifiedQuantity)}})
              </template>
<!--              </el-tag>-->
            </div>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;

.c-tag {
  color: #fff;
  padding: 0 12px;
  height: 50px;
  display: flex;
  align-items: center;
  //margin-bottom: 1px;
  border: 1px solid #fff;
}
::v-deep {
  --fSize: 16px;
  @include util.tag-each((
    (name: 'info', color: #002246),
    (name: 'warning', color: #d99000),
    (name: 'success', color: #00a78c),
    (name: 'danger', color:#f5706d)
  ));

  .el-table {
    border: none !important;
    color: #fff;
    background: transparent;
  }
  .el-table .el-table__body-wrapper .el-table__row .el-table__cell:last-child {
    padding: 0 !important
  }
  .el-table .el-table__body-wrapper .el-table__row .el-table__cell:last-child .cell{
    padding: 0 !important
  }
  .el-table .el-table__body-wrapper .el-table__row .el-table__cell:nth-child(2) {
    padding: 0 !important
  }
  .el-table .el-table__body-wrapper .el-table__row .el-table__cell:nth-child(2) .cell{
    padding: 0 !important
  }

  .el-table__append-wrapper {
    background: transparent;
  }

  .el-table th.el-table__cell {
    background-color: #194a73 !important;
  }

  .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid transparent;
  }

  .el-table td, .el-table th {
    border-right: 1px solid transparent;
  }

  .el-table thead tr, .el-table thead tr th {
    color: #29bfc6;
  }

  .el-table tr {
    background-color: #0f2d51;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
    background-color: #17476d;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: rgb(15, 216, 206, .5);
  }

  .el-table__body {
    width: 100% !important;
  }
}

</style>
