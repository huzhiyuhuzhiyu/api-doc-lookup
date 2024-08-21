<template>
  <el-dialog title="推进阶段" :visible.sync="visibleDialog" append-to-body :close-on-click-modal="false" class="JNPF-dialog JNPF-dialog_center" width="750px">
    <div class="relative-stage-records" v-loading="loadingBusiness">
      <div class="stage-state-main">
        <div class="vux-flexbox stage-state vux-flex-row">
          <a href="#" @click="stateaction('proving',1)">
            <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc>0}">
              <div class="stage-name text-one-ellipsis">验证客户</div>
              <div class="stage-value">20%</div>
              <div class="state-arrow arrow-left"></div>
              <div class="state-arrow arrow-right" :class="{'state-suc':statesuc>0}"></div>
            </div>
          </a>
          <a href="#" @click="stateaction('analysis',2)">
            <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc>1}">
              <div class="stage-name text-one-ellipsis">需求分析</div>
              <div class="stage-value">30%</div>
              <div class="state-arrow arrow-left"></div>
              <div class="state-arrow arrow-right" :class="{'state-suc':statesuc>1}"></div>
            </div>
          </a>
          <a href="#" @click="stateaction('quotation',3)">
            <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc>2}">
              <div class="stage-name text-one-ellipsis">方案/报价</div>
              <div class="stage-value">50%</div>
              <div class="state-arrow arrow-left"></div>
              <div class="state-arrow arrow-right" :class="{'state-suc':statesuc>2}"></div>
            </div>
          </a>
          <a href="#" @click="stateaction('examine',4)">
            <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc>3}">
              <div class="stage-name text-one-ellipsis">谈判审核</div>
              <div class="stage-value">80%</div>
              <div class="state-arrow arrow-left"></div>
              <div class="state-arrow arrow-right" :class="{'state-suc':statesuc>3}"></div>
            </div>
          </a>
          <el-popover placement="bottom" width="150" trigger="hover">
            <div style="font-size: 13px;">
              <div class="vux-flexbox vux-flex-row" style="padding: 8px 0;cursor: pointer;" @click="stateaction('win',5)">
                <i class="el-icon-success" style="margin-right: 8px;color: #00875a;flex-shrink: 0;"></i>
                <div style="flex:1;">赢单</div>
                <div>100%</div>
              </div>
              <div class="vux-flexbox vux-flex-row" style="padding: 8px 0;cursor: pointer;" @click="stateaction('loss',5)">
                <i class="el-icon-error" style="margin-right: 8px;color: #de350b;flex-shrink: 0;"></i>
                <div style="flex:1;">输单</div>
                <div>0%</div>
              </div>
              <div class="vux-flexbox vux-flex-row" style="padding: 8px 0;cursor: pointer;" @click="stateaction('invalid',5)">
                <i class="el-icon-remove" style="margin-right: 8px;flex-shrink: 0;"></i>
                <div style="flex:1;">无效</div>
                <div>0%</div>
              </div>
            </div>
            <a href="#" slot="reference">
              <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc>4}">
                <div class="stage-name text-one-ellipsis">{{stateend}}</div>
                <div class="stage-value">{{stateendbdb}}</div>
                <div class="state-arrow arrow-left"></div>
                <div class="state-arrow arrow-right" :class="{'state-suc':statesuc>4}"></div>
              </div>
            </a>
          </el-popover>

        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleDialog = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="confirm" :loading="btnLoading">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updatecrmBusiness, detailcrmBusiness } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      stateend: '结束',
      stateendbdb: '100%',
      loadingBusiness: false,
      statesuc: 0,
      visibleDialog: false,
      btnLoading: false,
      dataForm: {
        id: '',
      },
      dataFormTwo: {
        lines: []
      }
    }
  },
  methods: {
    init(id) {
      this.visibleDialog = true
      this.btnLoading = false
      this.loadingBusiness = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        detailcrmBusiness(this.dataForm.id).then(res => {
          this.dataForm = res.data.business
          this.dataFormTwo.lines = res.data.lines
          this.loadingBusiness = false
          switch (this.dataForm.setting) {
            case 'proving':
              this.stateend = '结束'
              this.stateendbdb = '100%'
              this.statesuc = 1
              break;
            case 'analysis':
              this.stateend = '结束'
              this.stateendbdb = '100%'
              this.statesuc = 2
              break;
            case 'quotation':
              this.stateend = '结束'
              this.stateendbdb = '100%'
              this.statesuc = 3
              break;
            case 'examine':
              this.stateend = '结束'
              this.stateendbdb = '100%'
              this.statesuc = 4
              break;
            case 'win':
              this.stateend = '赢单'
              this.stateendbdb = '100%'
              this.statesuc = 5
              break;
            case 'loss':
              this.stateend = '输单'
              this.stateendbdb = '0%'
              this.statesuc = 5
              break;
            case 'invalid':
              this.stateend = '无效'
              this.stateendbdb = '0%'
              this.statesuc = 5
              break;
          }
        })
      })
    },
    stateaction(val, num) {
      if (val == 'win') {
        this.stateend = '赢单'
        this.stateendbdb = '100%'
      } else if (val == 'loss') {
        this.stateend = '输单'
        this.stateendbdb = '0%'
      } else if (val == 'invalid') {
        this.stateend = '无效'
        this.stateendbdb = '0%'
      }
      this.statesuc = num
      this.dataForm.setting = val
    },
    confirm() {
      this.btnLoading = true
      updatecrmBusiness({
        business: this.dataForm,
        lines: this.dataFormTwo.lines
      }).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visibleDialog = false
            this.btnLoading = false
            this.$emit('close', true)
          }
        })
      }).catch(() => { this.btnLoading = false })
    },
  },
}
</script>
<style lang="scss" scoped>
.relative-stage-records {
  padding: 16px;
  margin-top: 16px;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  .stage-state-main {
    background-color: #fff;
    .stage-state {
      position: relative;
      z-index: 1;
      flex-wrap: wrap;
      padding-left: 5px;
      overflow-x: auto;
      a {
        flex-shrink: 0;
        background-color: transparent;
      }
      .stage-state-item {
        position: relative;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        min-width: 120px;
        height: 22px;
        padding: 0 8px;
        margin-right: 8px;
        line-height: 22px;
        .state-arrow {
          position: absolute;
          width: 22px;
          height: 22px;
          transform: scale(0.707) rotate(45deg);
        }
        .arrow-left {
          top: 0;
          left: -12px;
        }
        .arrow-right {
          top: 0;
          right: -11px;
          z-index: 1;
        }
        .stage-name {
          flex: 1;
        }
        .text-one-ellipsis {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stage-value {
          z-index: 2;
          flex-shrink: 0;
          padding-left: 4px;
        }
      }
      .stage-state-item.is-center {
        padding-left: 16px;
      }
      .state-suc {
        color: #fff !important;
        background-color: #0065ff !important;
      }
      .state-undo {
        background-color: #f4f5f7;
        .state-arrow {
          background-color: #fff;
        }
        .arrow-right {
          background-color: #f4f5f7;
        }
      }
    }
  }
}
</style>