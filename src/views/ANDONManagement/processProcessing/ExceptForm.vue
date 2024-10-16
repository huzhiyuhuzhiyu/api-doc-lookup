<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', 'noButtons']">
          <el-page-header @back="$emit('close',true)" content="查看异常数据" />
          <div class="options">
            <el-button @click="$emit('close',true)">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-collapse v-model="activeNames" class="orderInfo">
            <el-collapse-item title="异常数据明细" name="basicInfo" class="workOrderInfoForm">
              <JNPF-table ref="work" :data="sourceListData" fixedNo>
                <el-table-column min-width="160" v-for="item in tableItems" :prop="item" :label="item"
                  :key="item"></el-table-column>
              </JNPF-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

    </transition>

  </div>

  <!-- 订单来源明细 -->
  <!-- <el-dialog title="异常数据明细" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="sourceDialog"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px" append-to-body>
    <el-row :gutter="20" style="margin :10px 0">
      <el-table ref="exDialog" v-loading="listLoading" :data="sourceListData" border height="400">
        <el-table-column min-width="160" v-for="item in tableItems" :prop="item" :label="item" :key="item"></el-table-column>
      </el-table>
    </el-row>
  </el-dialog> -->
</template>
<script>
export default {
  props: ['sourceListData', 'tableItems'],
  data() {
    return {
      listLoading: false,
      sourceDialog: false,
      activeNames: ["basicInfo"],
    }
  },
  methods: {
    init() {
      this.listLoading = false
      this.sourceDialog = true
    },
  },
}
</script>
<style lang="scss" scoped>
.workOrderInfoForm ::v-deep.el-collapse-item__wrap {
  padding: 0 !important;
  border-top: 1px solid #dcdfe6;
  border-right: 0 !important;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  margin-bottom: 0;
  padding: 0 10px 0px;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}
</style>