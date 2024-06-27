<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div style="overflow-x:auto;width:100%;height:100%">
          <div class="body">
            <div class="card-wrapper" v-loading="loading">
              <div class="box-card" v-for="item in list" :key="item.id">
                <el-card  :class="item.enableStatus === 'enable' ? 'enableColor' : ''" shadow="always">
                  <div slot="header" class="clearfix">
                    <span style="font-size:22px;">{{ item.name }}</span>
                    <el-tooltip effect="dark" content="展开" placement="top" style="float:right; padding: 3px 6px">
                      <el-link v-show="!item.showCon" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                        :underline="false" @click="toggleExpand(item)" />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="折叠" placement="top" style="float:right; padding: 3px 6px">
                      <el-link v-show="item.showCon" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                        :underline="false" @click="toggleExpand(item)" />
                    </el-tooltip>
                    <el-button :disabled="item.enableStatus === 'enable' ? true : false"
                      style="float: right; padding: 3px 0" type="text" @click="changeSet(item)">切换</el-button>
                  </div>
                  <el-collapse-transition>
                    <div class="list-item" v-show="!item.showCon"  style="padding: 10px">
                      <div>
                        <el-image :src="define.comUrl + item.picPath"></el-image>
                      </div>
                      <div class="remark">
                        <span>{{ item.description }}</span>
                      </div>
                    </div>
                  </el-collapse-transition>
                </el-card>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProdMethodList, changeProdMethod } from "@/api/productionMethodSet/index.js";
export default {
  name: 'productionMethodSet',
  data() {
    return {
      list: [],
      loading: false,
      expands: true
    }
  },
  created() {
    this.initData()
  },
  methods: {
    toggleExpand(item) {
      item.showCon = !item.showCon
    },
    initData() {
      this.loading = true;
      getProdMethodList().then(res => {
        this.list = res.data.map(item => {
          return {
            ...item,
            showCon: false
          }
        })
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    changeSet(row) {
      changeProdMethod(row.id).then(res => {
        if (res.msg === "Success") {
          this.$message.success('切换成功')
          this.initData()
        }
      }).catch(() => { })
    },
  },

}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  .body {
    width: 1200px;
  }
}

.body {
  position: relative;
  padding-bottom: 16px;
  margin-top: 16px;
  flex: 1;
}

.card-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 12px));
  /*  行间距和列间距  */
  grid-gap: 10px;
  padding: 10px;

  .box-card {
    // height: 400px;
    flex: 1;

    .list-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-image {
        width: 100%;
        height: 270px;
        object-fit: fill;
      }

      .remark {
        padding: 14px;
      }
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }
  }
}

.enableColor {
  box-shadow: 0 2px 12px 0 #67C23A !important;
}

  ::v-deep .el-card__body {
    padding: 0 !important;
  }

</style>