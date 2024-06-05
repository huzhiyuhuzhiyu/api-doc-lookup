<template>
  <div class="app-center">
    <div style="width: 100%;padding-right: 10px;padding-top: 10px;display: flex;justify-content: right;"><span
        @click="handla"
        class="guanbi"
      >X</span></div>
    <div style="width: 95%;box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center;margin-top: 20px;">
      <div style="width:99%;padding: 10px;">
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>产线名称</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>B1</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>所属区域</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>B区域</span>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>每小时产量</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>05时18分57秒</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>今日产量</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>9979</span>
            </div>
          </el-col>
        </el-row> -->
      </div>
    </div>
    <div style="width: 95%;margin-top: 30px;background-color: #FFFFFF;box-shadow:0px 0px 50px #E8E8E8;">
      <div style="width: 100%;display: flex;align-items: center;justify-content: right;margin-top: 10px;">
        <span>切换图表</span>：
        <el-select
        style="margin-right: 1vw;"
          v-model="value"
          placeholder="请选择"
          @change="hendless"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div
      style="width: 95%;min-height: 60vh;"
      id="main"
    >
    </div>
    </div>
    <div style="width: 95%;margin-top: 20px;box-shadow:0px 0px 50px #E8E8E8;padding-left: 50px;padding-top: 30px;">
      <ve-table
        :columns="columns"
        :table-data="tableData"
        :border-around=true
        :border-x=true
        :border-y="true"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "detailspages",
  data() {
    return {
      columns: [
        {
          field: "name",
          key: "a",
          title: "时间",
          width: 300,
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return <div style="text-align:left">{row.name}</div>;
          },
        },
        {
          field: "date",
          key: "b",
          title: "小时最高",
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return <div style="text-align:left">{row.date}</div>;
          },
        },
        {
          field: "hobby",
          key: "c",
          title: "小时最低",
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return <div style="text-align:left">{row.hobby}</div>;
          },
        },
        {
          field: "address",
          key: "d",
          title: "小时总产量",
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return <div style="text-align:left">{row.address}</div>;
          },
        },
      ],
      
      tableData: [
        {
          name: "00-00",
          date: "460",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
        
        {
          name: "00-00",
          date: "461",
          hobby: "120",
          address: "1578",
        },
      ],
      options: [
        {
          value: "折线图",
          label: "折线图",
        },
        {
          value: "柱状图",
          label: "柱状图",
        },
      ],
      value: "",
      types: "bar",
    };
  },
  mounted() {
    this.operation();
  },
  methods: {
    operation() {
      var chartDom = document.getElementById("main");
      var myChart = this.$echarts.init(chartDom);
      var option;
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      option = {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [
            "0时",
            "1时",
            "2时",
            "3时",
            "4时",
            "5时",
            "6时",
            "7时",
            "8时",
            "9时",
            "10时",
            "11时",
            "12时",
            "13时",
            "14时",
            "15时",
            "16时",
            "17时",
            "18时",
            "19时",
            "20时",
            "21时",
            "22时",
            "23时",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   type: "shadow",
          // },
        },
        series: [
          {
            name: "Direct",
            type: this.types,
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220],
            color: "#5470C6",
          },
        ],
      };
      option && myChart.setOption(option);
    },
    handla() {
      this.$emit("handle");
    },
    hendless() {
      // console.log(this.value);
      if (this.value == "折线图") {
        this.types = "line";
        this.operation();
      } else {
        this.types = "bar";
        this.operation();
      }
    },
  },
};
</script>

<style scoped>
.app-center {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: white;
  font-size: 0.8vw;
}
.el-row {
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.bg-purple-dark {
  background: #fafafa;
}
.bg-purple {
  background: #fafafa;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: #909399;
  border-right: 1px solid #ebeef5;
}
.bg-purple-light {
  background: #ffffff;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: #606266;
}
.grid-content {
  border-radius: 4px;
  min-height: 45px;
}
.guanbi:hover {
  cursor: pointer;
}
</style>