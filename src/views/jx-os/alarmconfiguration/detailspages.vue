<template>
  <div class="app-centers">
    <!-- <div style="width: 100%;padding-right: 10px;padding-top: 10px;display: flex;justify-content: right;"><span
        @click="handla"
        class="guanbi"
      >X</span></div>
    <div style="width: 95%;box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center;margin-top: 20px;">
      <div style="width:99%;padding: 10px;">
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>点位号</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>新军机械全自动粘钉一体机</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>点位名称</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>印刷机</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>起始度数</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>05时18分57秒</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>结束度数</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>9979</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div
      style="width: 95%;min-height: 60vh;box-shadow:0px 0px 50px #E8E8E8;margin-top: 30px;"
      id="main"
    >
    </div>
    <div style="width: 95%;margin-top: 20px;box-shadow:0px 0px 50px #E8E8E8;padding-left: 50px;padding-top: 30px;">
      <ve-table
        :columns="columns"
        :table-data="tableData"
        :border-around=true
        :border-x=true
        :border-y="true"
      />
    </div> -->
    <div style="width: 100%;display: flex;align-items: center;justify-content: space-between;padding-top: 1vw;padding-bottom: 1vw;">
      <el-page-header
      style="padding-left: 1vw;"
        @back="goBack"
        :content="titles"
      >
      </el-page-header>
      <div style="padding-right: 2vw;">
        <span>
          <el-button type="primary">保存</el-button>
          <el-button @click="handla">取消</el-button>
        </span>
      </div>
    </div>
    <div style="width: 100%;padding-bottom: 20vw;">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="报警类型" style="margin-bottom: 3vw;">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" style="margin-bottom: 3vw;">
          <el-input v-model="form.region"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" style="margin-bottom: 3vw;">
          <el-select
          style="width: 100%;"
              size="medium"
              v-model="form.date1"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="数据类型" style="margin-bottom: 3vw;">
          <el-input v-model="form.date2"></el-input>
        </el-form-item>
        <el-form-item label="启用" style="margin-bottom: 3vw;">
          <el-input v-model="form.date2"></el-input>
        </el-form-item>
        <el-form-item label="添加时间" style="margin-bottom: 3vw;">
          <el-input v-model="form.date2"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "detailspages",
  props:['titles'],
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
          title: "起始度数",
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return <div style="text-align:left">{row.date}</div>;
          },
        },
        {
          field: "hobby",
          key: "c",
          title: "结束度数",
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return <div style="text-align:left">{row.hobby}</div>;
          },
        },
        {
          field: "address",
          key: "d",
          title: "使用度数",
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return <div style="text-align:left">{row.address}</div>;
          },
        },
      ],
      tableData: [
        {
          name: "01-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "02-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "03-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "04-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "05-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "06-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "07-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "08-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "09-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "10-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "11-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "12-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "13-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
        {
          name: "14-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },

        {
          name: "15-00",
          date: "236",
          hobby: "263",
          address: "1578",
        },
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      options: [
        {
          label: "电",
          value: "电",
        },
        {
          label: "水",
          value: "水",
        },
        {
          label: "气",
          value: "气",
        }
      ],
    };
  },
  mounted() {
    // this.operation();
    // console.log(this.titles);
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
          axisPointer: {
            type: "shadow",
          },
        },
        series: [
          {
            name: "Direct",
            type: "bar",
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
    goBack() {
      this.handla();
    },
  },
};
</script>

<style scoped>
.app-centers {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* display: flex; */
  /* flex-wrap: wrap; */
  /* justify-content: center; */
  background-color: white;
}
.el-row {
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
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