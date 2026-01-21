<script>
import FrameLayout from '@/views/smartBoard/scaleBoardLayout/component/FrameLayout.vue'
import { getScreenTrackingData } from '@/api/smartBoard'
import Bus from '@/views/smartBoard/util/Bus.js'
import ScreenTable from "@/views/smartBoard/scaleBoardLayout/component/ScreenTable.vue";

export default {
  components: { ScreenTable, FrameLayout },
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    query: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      viewData: {
        records: []
      },
      statusMap: {},
      tableColumns: [],
      pageNum: 1,
    }
  },
  mounted() {
    this.getData(true)
    Bus.$on('refreshViewData', this.getData)
  },
  beforeDestroy() {
    Bus.$off('refreshViewData', this.getData)
  },
  methods: {
    async getData(loadingFlag = false) {
      if (this.pageNum < 1) {
        this.$message.error('已经是第一页了')
        this.pageNum = 1
        return
      }
      if (this.pageNum > Number(this.viewData.pages)) {
        this.$message.error('已经是最后一页了')
        this.pageNum = Number(this.viewData.pages)
        return
      }
      if (loadingFlag) Bus.$emit('addLoading')
      getScreenTrackingData({
        tenantId: 'zsk',
        _title: this.title,
        mattersGradeList: this.title === '及时跟踪' ? ["sim_1", "sim_2", "sim_3"] : ["sim_3"],
        pageSize: this.title === '及时跟踪' ? 6 : 3,
        pageNum: this.pageNum,
        ...this.query,
        // month: this.jnpf.getToday('YYYY-MM'),
      }).then(res => {
        this.viewData = res.data.page
        if (Number(this.viewData.pages) < 1) this.viewData.pages = 1
        this.statusMap = res.data.statusList.reduce((acc, cur) => {
          acc[cur.name] = cur.targetValue
          return acc
        }, {})
      }).finally(err => {
        if (loadingFlag) Bus.$emit('subLoading')
      })
    },
  }
}
</script>

<template>
  <FrameLayout :title="title" :subTitle="subTitle">
    <template slot="title-right">
      <div class="title-action">
        <div>共计：{{ viewData.total || 0 }}</div>
        <div class="text-danger">
          <span class="title">● 待处理</span>
          <span class="number">&nbsp;{{ statusMap.wait_processed || 0 }}</span>
        </div>
        <div class="text-success">
          <span class="title">● 进行中</span>
          <span class="number">&nbsp;{{ statusMap.in_progress || 0 }}</span>
        </div>
        <div class="text-warning">
          <span class="title">● 待确认</span>
          <span class="number">&nbsp;{{ statusMap.wait_confirmed || 0 }}</span>
        </div>
      </div>
    </template>
    <div :class="['card-container', 'rows_' + (title === '及时跟踪' ? '2' : '1')]">
      <div class="card" v-for="item in viewData.records" :key="item.id">
        <!-- 顶部标签区域 -->
        <div class="top-tags">
          <span class="tag">优先级：</span>
          <template>
            <el-tag v-if="item.priority === '3'" type="primary" size="mini">低</el-tag>
            <el-tag v-else-if="item.priority === '2'" type="warning" size="mini">中</el-tag>
            <el-tag v-else-if="item.priority === '1'" type="danger" size="mini">高</el-tag>
            <el-tag v-else size="mini">{{ item.priority }}</el-tag>
          </template>
          <span class="tag">状态：</span>
          <template>
            <span v-if="item.handleStatus === 'in_progress'" class="text-success">进行中</span>
            <span v-else-if="item.handleStatus === 'wait_processed'" class="text-danger">待处理</span>
            <span v-else-if="item.handleStatus === 'wait_confirmed'" class="text-warning">待确认</span>
            <span v-else>{{ item.handleStatus }}</span>
          </template>
          <el-tag type="info" size="mini">{{ item.mattersGrade }}</el-tag>
          <!--          <el-tag type="info" size="mini">工艺</el-tag>-->
        </div>

        <!-- 问题描述 -->
        <div class="problem">
          <strong>问题1：</strong>
          <span>{{ item.mattersRemark }}</span>
        </div>

        <!-- 对策 -->
        <div class="countermeasure">
          <strong>对策：</strong>
          <span>{{ item.counterMeasure }}</span>
        </div>

        <!-- 分割线 -->
<!--        <hr class="divider" />-->

        <!-- 底部信息 -->
        <div class="footer-info">
          <div class="row">
            <span>责任部门：</span>
            <span>{{ item.departmentLiable }}</span>
          </div>
          <div class="row">
            <span>责任人：</span>
            <span>{{ item.personLiable }}</span>
          </div>
          <div class="row">
            <span>提出日期：</span>
            <span>{{ item.introducerTime ? item.introducerTime.split(' ')[0] : '' }}</span>
          </div>
          <div class="row">
            <span>提出人：</span>
            <span>{{ item.introducer }}</span>
          </div>
          <div class="row">
            <span>一次承诺：</span>
            <span>{{ item.promiseDate }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-container">
      <div @click="pageNum--; getData(true)">◀ 上一页</div>
      <div @click="pageNum++; getData(true)">下一页 ▶</div>
    </div>
  </FrameLayout>
</template>

<style lang="scss" scoped>
.title-action {
  display: flex;
  gap: 16px;
  font-size: 14px;
  justify-content: flex-end;
  padding: 0 20px 0 0;

  & > .div {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.card-container {

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;

  &.rows_1 {
    grid-template-rows: 1fr;
  }

  &.rows_2 {
    grid-template-rows: 1fr 1fr;
  }

  .card {
    //background-color: #003366;
    color: #fff;
    width: 320px;
    height: 230px;
    //border-radius: 8px;
    //box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    //border: 1px solid #0077cc;
    padding: 12px;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.5;
    background-image: url("~@/assets/images/board/frame_middle_card.png");
    background-repeat: no-repeat;
    background-size: cover; /* 或者使用contain */
  }

  .top-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;

    .tag {
      font-size: 14px;
      margin: 0;
    }
  }

  .problem,
  .countermeasure {
    margin: 10px 0;

    strong {
      font-weight: bold;
      margin-right: 4px;
    }
  }

  .divider {
    margin: 10px 0;
    border-top: 1px solid #0077cc;
    opacity: 0.6;
  }

  .footer-info {
    margin-top: 50px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    font-size: 13px;

    .row {
      display: flex;
      gap: 4px;

      span:first-child {
        font-weight: normal;
        color: #ccc;
      }
    }
  }

}

.footer-container {
  color: #00FFF3;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  position: absolute;
  width: 100%;
  bottom: 12px;

  & > div {
    cursor: pointer;
  }
}
</style>
