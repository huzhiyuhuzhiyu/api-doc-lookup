<template>
  <el-popover v-model="visible" placement="bottom-start" trigger="click" width="350" :visible-arrow="false" popper-class="no-padding-popover">
    <div class="type-popper">
      <div class="vux-flexbox type-popper-common vux-flex-row">
        <div class="vux-flexbox type-sort vux-flex-row">
          <div class="type-sort-item">天</div>
          <div class="type-sort-item">周</div>
          <div class="type-sort-item">月</div>
          <div class="type-sort-item">季度</div>
          <div class="type-sort-item">年度</div>
        </div>
        <div class="vux-flexbox type-content vux-flex-row">
          <div class="vux-flexbox type-content-box vux-flex-row" v-for="(item,index) in datalist" :key="index">
            <div class="type-content-item text-one-line" :class="{'selected':o.name==dataForm.name}" v-for="o in item.date" :key="o.value" @click="itemdate(o)">
              {{o.name}}
            </div>
          </div>
        </div>
      </div>
      <div class="custom-date">
        <div class="custom">自定义</div>
        <div class="vux-flexbox type-content-custom vux-flex-row">
          <el-date-picker v-model="dataForm.valuedate" @change="()=>{dataForm.name='',dataForm.value='',beginDate=''}" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="confirm">
          <div></div>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </div>
    </div>
    <el-input v-model="innerValue" readonly placeholder="请选择" slot="reference">
      <template slot="suffix">
        <i :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-down']"></i>
      </template>
    </el-input>
  </el-popover>
</template>
<script>
export default {
  data() {
    return {
      beginDate: '',
      //时间限制
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.beginDate = minDate && minDate.getTime();
          if (maxDate) {
            this.dataForm.valuedate[1] = "";
          }
        },
        disabledDate: (time) => {
          const minTime = new Date(this.beginDate).setMonth(
            new Date(this.beginDate).getMonth() - 3
          );
          const maxTime = new Date(this.beginDate).setMonth(
            new Date(this.beginDate).getMonth() + 3
          );
          return this.beginDate
            ? time.getTime() < minTime || time.getTime() > maxTime
            : false;
        }
      },
      visible: false,
      dataForm: {
        name: '本年度',
        value: 'year',
        dateStart: '',
        dateEnd: '',
        valuedate: []
      },
      innerValue: '本年度',
      datalist: [
        {
          date: [
            { name: '今天', value: 'today' },
            { name: '昨天', value: 'yesterday' },
            { name: '明天', value: 'tomorrow' }
          ]
        },
        {
          date: [
            { name: '本周', value: 'week' },
            { name: '上周', value: 'lastWeek' },
            { name: '下周', value: 'nextWeek' }
          ]
        },
        {
          date: [
            { name: '本月', value: 'month' },
            { name: '上月', value: 'lastMonth' },
            { name: '下月', value: 'nextMonth' }
          ]
        },
        {
          date: [
            { name: '本季度', value: 'quarter' },
            { name: '上一季度', value: 'lastQuarter' },
            { name: '下一季度', value: 'nextQuarter' }

          ]
        },
        {
          date: [
            { name: '本年度', value: 'year' },
            { name: '上一年度', value: 'lastYear' },
            { name: '下一年度', value: 'nextYear' }
          ]
        }
      ]
    }
  },
  methods: {
    itemdate(val) {
      this.dataForm.name = val.name
      this.dataForm.value = val.value
      this.dataForm.valuedate = []
    },
    confirm() {
      this.jnpf.searchTimeFormat(this.dataForm, 'valuedate', 'dateStart', 'dateEnd')
      if (this.dataForm.valuedate.length) {
        this.innerValue = `${this.dataForm.dateStart} 至 ${this.dataForm.dateEnd}`
      } else {
        this.innerValue = this.dataForm.name
      }
      this.$emit('change', this.dataForm)
      this.$emit('inputcontent', this.innerValue)
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.no-padding-popover {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.type-popper {
  .confirm {
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 8px 16px;
    line-height: 32px;
    border-top: 2px solid #dfe1e6;
  }
}
.type-popper-common {
  .selected {
    font-weight: 700;
    color: #fff !important;
    background: #344563 !important;
  }
  padding-bottom: 8px;
  border-bottom: 2px solid #dfe1e6;
  .type-sort {
    flex-shrink: 0;
    width: 80px;
    height: 200px;
    font-size: 12px;
    color: #5e6c84;
    justify-content: space-around;
    flex-direction: column;
    .type-sort-item {
      height: 34px;
      padding: 0 10px;
      line-height: 34px;
    }
  }
  .type-content {
    width: 300px;
    height: 200px;
    padding: 0 8px;
    color: #172b4d;
    justify-content: space-around;
    flex-direction: column;
    .type-content-box {
      justify-content: space-around;
      height: 34px;
      flex-wrap: wrap;
      .type-content-item {
        position: relative;
        width: 30%;
        height: 34px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
        border-radius: 3px;
      }
      .type-content-item:hover {
        background-color: #f5f7fa;
      }
    }
  }
  .text-one-line {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.custom-date {
  .custom {
    width: 80px;
    height: 32px;
    font-size: 12px;
    line-height: 32px;
    color: #5e6c84;
    text-align: center;
  }
  .type-content-custom {
    padding: 5px 20px 10px;
    overflow: hidden;
  }
}
</style>