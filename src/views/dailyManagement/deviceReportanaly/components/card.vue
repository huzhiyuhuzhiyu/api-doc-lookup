<template>
  <div>
    <el-card class="box-card-tj" shadow="hover" :body-style="{padding:'10px',height:bodyheight,'overflow-y':'auto'}">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <el-empty v-if="!datalist" :image-size="58" description="暂无数据"></el-empty>
      <div v-else>
        <div style="display: flex;justify-content: space-between;" class="line sum">
          <div class="left">计数</div>
          <div class="right">{{datalist.allNum||0}}</div>
        </div>
        <div v-for="(item,index) in datalist.list" :key="index" class="show-raw-data number line">
          <div class="left">{{item.totalName}}</div>
          <div class="right">{{item.totalNum}}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    bodyheight: {
      type: String,
      default: '200px'
    },
    title: {
      type: String,
      default: '未命名'
    },
    datalist: {
      type: String
    },
  },
  data() {
    return {
      num: 36
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card-tj {
  ::v-deep .el-card__header {
    padding: 10px 10px 0 10px;
    border-bottom: none;
  }
  .clearfix {
    line-height: 40px;
  }
  .line {
    min-width: 300px;
    display: flex;
    height: 45px;
    justify-content: space-between;
    line-height: 45px;
    align-items: center;
    &.number {
      border-bottom: 1px solid #ebecee;
      .right {
        background-color: #eaf2fd;
        color: #2f7deb;
      }
    }
    &.sum {
      border-bottom: 1px solid #b5b8be;
      .right {
        background: #f5c24d;
        color: #fff;
      }
      .left {
        color: #2f7deb;
      }
    }
    .left {
      flex: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .right {
      -webkit-box-flex: 0;
      border-radius: 100px;
      flex: none;
      height: 36px;
      line-height: 36px;
      margin-left: 20px;
      max-width: 90%;
      overflow: hidden;
      padding: 0 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .show-raw-data {
    cursor: pointer;
  }
}
</style>