<script>
import { addComma } from '@/utils'
import BoardWrapper from '@/views/smartBoard/component/BoardWrapper.vue'
import { ordershengchanListByTenant } from '@/api/productOrdes'
import QRCode from 'qrcodejs2'
import AutoScrollMixin from '@/views/smartBoard/util/AutoScrollMixin'

export default {
  name: 'ProductionProgressBoard',
  mixins: [AutoScrollMixin],
  components: {  BoardWrapper },
  methods: {
    addComma,
    async getData(noLoop) {

      try {
        console.log('开始getData')
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
        const res = await ordershengchanListByTenant({
          'progressFlag': true,
          'productDrawingNo': '',
          'productionPlanNo': '',
          'orderStatus': 'normal',
          'purchaseOrderId': '',
          'productsId': '',
          'pageNum': this.pageNum,
          'pageSize': this.pageSize,
          'superQuery': {
            'matchLogic': 'AND',
            'condition': []
          },
          'orderItems': [
            {
              'asc': false,
              'column': ''
            },
            {
              'asc': false,
              'column': 'create_time'
            }
          ],
          'classAttribute': 'semi_finished',
          'projectId': '',
          tenantId: this.tenantId
        })
        this.total = res.data.total
        res.data.records.forEach(item => {
          // 初始化 processInfoList 为一个空数组
          item.processInfoList = [];

          // 检查 processSchedule 字段是否有值
          if (item.processSchedule) {
            // 判断是否包含逗号
            if (item.processSchedule.includes(',')) {
              // 以逗号分割为数组
              const processes = item.processSchedule.split(',');

              // 遍历每一项并处理
              processes.forEach(process => {
                const [name, value] = process.split(':');
                item.processInfoList.push({ name, value: parseInt(value, 10) });
              });
            } else {
              // 直接以冒号分割
              const [name, value] = item.processSchedule.split(':');
              item.processInfoList.push({ name, value: parseInt(value, 10) });
            }
          }
        });
        this.totalPages = res.data.pages
        if(this.isPage){
          this.list =  res.data.records
        }else{
          this.list = this.pageNum === 1 ? res.data.records : this.list.concat(res.data.records)
        }
        await this.$nextTick()
        console.log(this.pageNum, this.totalPages, this.list.length, this.total)
        if (this.total === 0) {
          this.$message.info('暂无数据')
          return
        }
        // 等待DOM完全更新
        await this.$nextTick()
        this.renderQr()
        console.log('二维码渲染完成')
        await this.$nextTick()
        this.endAutoScroll()
        await this.$nextTick()
        this.startAutoScroll()
      } catch (e) {
        console.error(e)
        this.endAutoScroll()
        this.$message.error(e.message)
        this.list = []

        setTimeout(() => {
          // 15秒后重新请求数据
          this.reset()
        }, 15 * 1000);
      }
    },
    renderQr() {
      console.log()
      let height = null
      for (const item of this.$refs.qr) {
        if (item.getAttribute('data-has-qr')) {
          continue
        }
        if (!height) {
          height = parseInt(getComputedStyle(item).getPropertyValue('height')) * 0.9
        }
        const orderNo = item.getAttribute('data-order-no')

        const params = {
          width: height,
          height: height,
          text: `RWJD_${orderNo}`, // 二维码内容
          correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
        }
        new QRCode(item, params)
        item.setAttribute('data-has-qr', true)
      }
    },

    reset() {
      this.endAutoScroll()
      this.pageNum = 1
      this.list = []
      this.total = 0
      this.totalPages = 0
      this.getData()
    }

  },
  data() {
    return {
      list: [],
      total: 0,
      pageNum: 0, // 初始化的时候需要是0，因为滚动组件会+1 再初始化
      pageSize: 10,
      totalPages: 0,
      isLoading:false,
    }
  },
  async mounted() {
    this.contentDom = this.$refs.content
    this.getData()
  },
}
</script>

<template>
  <BoardWrapper
    board-title="生产进度看板"
    :is-play.sync="isPlay"
    @refresh="reset"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="加载中..."
    :legend-list="[
      {text: '已完成', color: '#0eac5c'},
      {text: '进行中', color: '#d99000'},
      {text: '未开始', color: '#8fa7c9'},
    ]"
  >
    <div class="content" ref="content">
      <div class="line" v-for="line in list" :key="line.orderNo">
        <div class="line-header">
          <div class="qr" :data-order-no="line.orderNo" ref="qr"></div>
          <div class="content">
            <div class="item">{{ line.orderNo }}</div>
            <div class="item">{{ line.productDrawingNo }}</div>
            <div class="item">生产数量：{{ addComma(line.productionQuantity) }}</div>
            <div class="item">
              <el-tag v-if="line.orderStatus === 'normal'" type="warning">进行中</el-tag>
              <el-tag v-if="line.orderStatus === 'suspend'" type="info">已暂停</el-tag>
              <el-tag v-if="line.orderStatus === 'closed'" type="danger">已关单</el-tag>
              <el-tag v-if="line.orderStatus === 'finish'" type="success">已完成</el-tag>
            </div>
          </div>
        </div>
        <div class="line-body">
          <div v-for="(item, index) in line.processInfoList" :key="index" class="item">
            <!--            <el-tooltip effect="light" placement="top">-->
            <!--              <div slot="content" class="custom-tooltip-content">-->
            <!--                <p class="tooltip-item">工单编码: <span class="tooltip-value">{{ item.orderNo || '' }}</span></p>-->
            <!--                <p class="tooltip-item">工序名称: <span class="tooltip-value">{{ item.processName || '' }}</span></p>-->
            <!--                <p class="tooltip-item">任务进度: <span class="tooltip-value">（{{ item.qualifiedQuantity || '' }} / {{ item.productionQuantity || '' }}）</span></p>-->
            <!--                <p class="tooltip-item">合格数量: <span class="tooltip-value qualified">{{ item.qualifiedQuantity || '' }}</span></p>-->
            <!--                <p class="tooltip-item">不合格数量: <span class="tooltip-value unqualified">{{ item.unqualifiedQuantity || '' }}</span></p>-->
            <!--                <p class="tooltip-item">最后报工时间: <span class="tooltip-value">{{ item.latestReportingTime || '' }}</span></p>-->
            <!--              </div>-->
            <!--            </el-tooltip>-->
            <el-progress type="circle" width="60" :percentage="item.value"
                         v-if="item.value < 100"
                         :color="item.value < 100 ?  '#d99000' :'#8fa7c9'"
                         :status="item.value == 100||item.value >100 ? 'success' : ''"></el-progress>
<!--            <el-progress v-if="jnpf.numberFormat(item.processSchedule, 2) < 100" type="circle" width="60" :percentage="jnpf.numberFormat(item.processSchedule, 2)"-->
<!--                         :status="item.workStatus === 'stop' ? '' : (jnpf.numberFormat(item.processSchedule, 2) >= 100 ? 'success' : '')"-->
<!--                         :color="item.workStatus === 'stop' ? '#8fa7c9' : '#d99000'"-->
<!--            />-->
            <div v-else class="finish-wrapper" ><i class="el-icon-check finish"/></div>

            <img v-if="index !== line.processInfoList.length - 1"
                 class="item-arrow"
                 src="@/assets/images/right.png" alt=""
            />

            <div class="item-text">{{ item.name || '' }}</div>
<!--            <div class="item-text">{{ item.qualifiedQuantity }}<span style="color: #8fa7c9">/{{ item.productionQuantity }}</span></div>-->
          </div>
        </div>
      </div>
    </div>
  </BoardWrapper>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util" as util;

.content {
  //scroll-behavior: smooth;
  //transition: all 30s ease-out;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.line {
  width: 100%;
  --line-height: calc(100% / 6.4);
  min-height: 102px;
  height: var(--line-height);
  display: flex;
  align-items: center;
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }

  --header-width: 360px;

  .line-header {
    width: var(--header-width);
    height: 100%;
    margin-left: 12px;
    display: flex;
    background: rgba(15, 40, 74, .8);

    .qr {
      padding: 0 10px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
    }

    .content {
      color: #fff;
      width: calc(100% - 125px);
      height: 100%;

      .item {
        //line-height: calc(100% / 4);
        padding: 0 10px;
        //padding: 3px 10px;
        height: calc(100% / 4);
        display: flex;
        align-items: center;
      }
    }
  }

  .line-body {
    width: calc(100% - var(--header-width));
    height: 100%;
    background-image: url("~@/assets/images/board/groupLine.png");
    background-repeat: no-repeat;
    background-size: 100% 1.5px;
    background-color: rgba(21, 55, 94, .7);
    //padding-bottom: 10px;
    display: flex;
    flex-wrap: wrap;

    .item {
      min-width: 93px;
      width: calc(100% / 15);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;

      .item-text {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
        text-align: center;
        font-size: 13px;
        margin-top: 5px;
      }

      //需要和进度条width 保持一致
      $circle: 60px;

      .finish-wrapper {
        width: $circle;
        height: $circle;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .finish {
        width: $circle - 5px;
        height: $circle - 5px;
        background: #0eac5c;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        font-weight: 900;
        color: #fff;
      }

      .item-arrow {
        $width: $circle / 2;
        width: $width;
        height: $width;
        position: absolute;
        top: 20%;
        right: $width / 2 * -1;
        filter: saturate(11%) brightness(153%);
      }
    }
  }

}

::v-deep {
  @include util.tag-each((
    (name: 'info', color: #002246),
    (name: 'warning', color: #d99000),
    (name: 'success', color: #00a78c),
    (name: 'danger', color: #fa0103),
  ), true);
  $stroke-width: 1px !important;

  .el-progress-circle__track {
    stroke-width: $stroke-width;
  }

  .el-progress-circle__path {
    stroke-width: $stroke-width;
  }
}

::v-deep .el-progress__text {
  font-size: 13px !important;
  color: #fff !important;
}

</style>
