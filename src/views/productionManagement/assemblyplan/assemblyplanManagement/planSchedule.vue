<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="'计划进度'" />
          <div class="options">
            <!-- <el-button type="primary" size="mini" @click="associationTaskFun">查看关联任务</el-button> -->
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-collapse v-model="activeNames1" class="orderInfo">
            <el-collapse-item title="计划信息" name="basicInfo">
              <div class="stoclInfo">
                <el-descriptions :column="1" class="orderNo">
                  <el-descriptions-item label="计划单号">{{ dataForm.productionPlanNo
                    }}</el-descriptions-item>

                </el-descriptions>
                <el-descriptions :column="1" class="box">
                  <el-descriptions-item label="品名规格" class="drawingNo">{{ dataForm.productsDrawingNo
                    }} <img v-if="dataForm.urgentFlag" src="@/assets/images/emergency1.png" alt=""
                      style="width: 30px;vertical-align: top;"> </el-descriptions-item>
                </el-descriptions>

                <!-- <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="productsDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="productsCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="planProductionQuantity" label="计划生产数量" min-width="160" sortable="custom" />
            <el-table-column prop="availableArrangeQuantity" label="可编排数量" min-width="160" sortable="custom" />
            <el-table-column prop="arrangeOrderNum" label="已编排单数/数量" min-width="180" sortable="custom" />
            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom"
              :cell-class-name="cellClassName">
              <template slot-scope="scope">
                <div :style="scope.row.urgentFlag ? 'color:red' : ''">{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
</el-table-column>
<el-table-column prop="planStartDate" label="计划开始日期" min-width="160" sortable="custom"></el-table-column>
<el-table-column prop="planEndDate" label="计划结束日期" min-width="160" sortable="custom"></el-table-column>
<el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
<el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
<el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
<el-table-column prop="oil" label="油脂" min-width="100" sortable="custom" />
<el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom" />
<el-table-column prop="clearance" label="游隙" min-width="100" sortable="custom" />
<el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
<el-table-column prop="specialRequire" label="特殊要求" min-width="160" sortable="custom" />
<el-table-column prop="arithmeticNo" label="运算单号" min-width="160" sortable="custom" />
<el-table-column prop="remark" label="备注" min-width="180" sortable="custom"></el-table-column>
<el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
<el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" /> -->

                <el-descriptions class="margin-top" :column="4">
                  <el-descriptions-item label="产品编码">{{ dataForm.productsCode }}</el-descriptions-item>
                  <el-descriptions-item label="计划生产数量">{{ dataForm.planProductionQuantity }}{{ dataForm.mainUnit
                    }}</el-descriptions-item>
                  <el-descriptions-item label="已完成数量">{{ dataForm.completedQuantity ? dataForm.completedQuantity : '0'
                    }}{{
                      dataForm.mainUnit
                    }}</el-descriptions-item>
                  <el-descriptions-item label="打字内容">{{ dataForm.sealingCoverTyping }}</el-descriptions-item>
                  <el-descriptions-item label="精度等级">{{ dataForm.accuracyLevel }}</el-descriptions-item>
                  <el-descriptions-item label="振动等级">{{ dataForm.vibrationLevel }}</el-descriptions-item>
                  <el-descriptions-item label="油脂">{{ dataForm.oil }}</el-descriptions-item>
                  <el-descriptions-item label="油脂量">{{ dataForm.oilQuantity }}</el-descriptions-item>
                  <el-descriptions-item label="游隙">{{ dataForm.clearance }}</el-descriptions-item>
                  <el-descriptions-item label="包装方式">{{ dataForm.packagingMethod }}</el-descriptions-item>
                  <el-descriptions-item label="特殊要求">{{ dataForm.specialRequire }}</el-descriptions-item>
                  <el-descriptions-item label="计划日期">{{ dataForm.planStartDate }}至{{ dataForm.planEndDate
                    }}</el-descriptions-item>
                </el-descriptions>

              </div>
            </el-collapse-item>
            <el-collapse-item title="甘特图信息" name="info">

              <div ref='ganttRef'></div>
              <section style='display: flex;justify-content: start;'>
           
              </section>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>


    </transition>

  </div>
</template>
<script>
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getWorkReportList } from "@/api/productOrdes/index.js"
import { gantt } from 'dhtmlx-gantt' // 引入dhtmlx-gantt
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
export default {
  data() {
    return {
      relatedTaskVisible: false,
      categoryTypeList: [
        { code: "workOrder", fullName: "工单", },
        { code: "feed", fullName: "投料", },
        { code: "report", fullName: "报工", },
        { code: "test", fullName: "检验", },
        { code: "guidebook", fullName: "作业指导书", },
        { code: "inspectionManual", fullName: "检验指导书", },
        { code: "tool", fullName: "工装模具", },
      ],
      categoryType: "workOrder",
      orderTypeList: [
        { label: "正常订单", value: "normal", },
        { label: "返工订单", value: "rework", },
      ],
      orderStatusList: [

        { label: "进行中", value: "normal", },

        { label: "暂停", value: "suspend", },

        { label: "关闭", value: "closed", },

        { label: "已完成", value: "finish", },

      ],

      urgentFlagList: [

        { label: "是", value: true, },

        { label: "否", value: false, },

      ],

      recoredsData: [],

      activeNames1: ["basicInfo", 'info'],

      activeNames2: ["workOrderInfoForm"],

      activeNames3: ["feedInfoForm"],

      activeNames4: ['record'],

      activeName: 'orderInfo',

      feedData: [],

      workOrderData: [],

      dataForm: {},

      formLoading: false,

      btnType: "",

      title: "",

      prodOrderId: "",
      gantttt: {
        data: [

          /**
           *
           id：任务标识，可用来标识父子关系、连接links等
           start_date,end_date：项目开始截至时间 Date|string //（‘14-07-2022’）
           text：文本，任务的显示文字
           progress：项目的进度，用颜色深浅显示
           parent：父子关系(id标识)；子任务的parent为父任务的id
           type：任务类型，有三种，object，task，milestone；
                 object：没有时间限制，长度为包含所有子任务的长度
                 task：普通任务
                 milestone：菱形块，可表示中转关系
           * */
          { id: 1, text: 'PPDH202410080004', person: '管理员', progress:0.1, type: 'task', start_date: new Date('2023-10-01'), end_date: new Date('2023-10-12'), open: true },
          { id: 11, parent: 1, text: '初始化项目', person: '李四', type: 'task', progress: 0.9, color: '#ff0000', start_date: new Date('2023-10-02'), end_date: new Date('2023-10-05'), open: true },
          { id: 12, parent: 1, text: '前后端开发', type: 'task', progress: 0, color: '#00ff00', start_date: new Date('2023-10-05'), end_date: new Date('2023-10-08') },
          { id: 13, parent: 1, text: '测试', type: 'task', progress: 0, color: '#0000ff', start_date: new Date('2023-10-08'), end_date: new Date('2023-10-10') },
          { id: 14, parent: 1, text: '上线', type: 'task', progress: 0, color: '#00ffff', start_date: new Date('2023-10-10'), end_date: new Date('2023-10-12') },

          { id: 111, parent: 11, text: '创建git仓库', type: 'task', progress: 1, color: '#880000', start_date: new Date('2023-10-02'), end_date: new Date('2023-10-03') },
          { id: 112, parent: 11, text: '搭建脚手架', type: 'task', progress: 0.5, color: '#550000', start_date: new Date('2023-10-03'), end_date: new Date('2023-10-04') },
          { id: 113, parent: 11, text: '完成初始化', type: 'task', progress: 0.1, color: '#330000', start_date: new Date('2023-10-04'), end_date: new Date('2023-10-05') },


          { id: 121, parent: 12, text: '前端开发', person: '甲', type: 'task', progress: 0, color: '#00aa00', start_date: new Date('2023-10-05'), end_date: new Date('2023-10-07') },
          { id: 122, parent: 12, text: '后端开发', person: '已', type: 'task', progress: 0, color: '#007700', start_date: new Date('2023-10-05'), end_date: new Date('2023-10-07') },
          { id: 123, parent: 12, text: '前后端对接', person: '甲、已', type: 'task', progress: 0, color: '#003300', start_date: new Date('2023-10-07'), end_date: new Date('2023-10-08') },


          // { id: 3, text: 'Team', type: 'milestone', start_date: '14-07-2023' },
          // { id: 1, text: '1222', start_date: '25-04-2023', end_date: '01-07-2023', open: true },
          // {
          //   id: 12323544,
          //   text: '44444',
          //   start_date: '27-04-2023',
          //   end_date: '01-06-2023',
          //   duration: 5,
          //   progress: 0.5,
          //   person: 'Julia Garner',
          //   parent: 1,
          //   open: true
          // },
          // {
          //   id: 1232354422,
          //   text: '5555555555555555555555555555555555555555555555555555555555555555',
          //   start_date: new Date('2023-04-27'),
          //   end_date: new Date('2023-05-01'),
          //   duration: 2,
          //   progress: 0.2,
          //   color: '#2F80ED',
          //   person: 'Julia Garner',
          //   parent: 12323544
          // },
          // {
          //   id: 1232354421,
          //   text: '22222',
          //   start_date: new Date('2023-05-02'),
          //   end_date: new Date('2023-05-21'),
          //   duration: 2,
          //   progress: 0.3,
          //   color: '#2F80ED',
          //   parent: 12323544
          // },
          // {
          //   id: 12323545,
          //   text: '333333333333333',
          //   start_date: new Date('2023-05-15'),
          //   end_date: new Date('2023-06-30'),
          //   time: '02/01-02/20',
          //   duration: 2,
          //   progress: 0.7,
          //   parent: 1,
          //   open: true
          // },
          // {
          //   id: 12345453,
          //   text: '222222',
          //   start_date: new Date('2023-04-27'),
          //   end_date: new Date('2023-05-18'),
          //   time: '02/01-02/20',
          //   duration: 3,
          //   progress: 0.9,
          //   color: '#ED263D',
          //   parent: 12323545
          // }
        ],
        links: [
          { id: 1, source: 11, target: 12, type: '0' },
          { id: 2, source: 12, target: 13, type: '0' },
          { id: 3, source: 13, target: 14, type: '0' },

          { id: 4, source: 111, target: 112, type: '0' },
          { id: 5, source: 112, target: 113, type: '0' },

          { id: 6, source: 121, target: 123, type: '0' },
          { id: 7, source: 122, target: 123, type: '0' },

          // { id: 1, source: 1, target: 3, type: '0' },
          // { id: 2, source: 1232354422, target: 1232354421, type: '0' },
          // { id: 3, source: 12345453, target: 12345437, type: '0' }
        ]
      },
      ganttColumns: [
        // { align: 'right', name: 'color', label: '', width: '150',
        //   template:function(task){
        //     if(task.color){
        //       console.log(task.color)
        //       return  "<div style='width: 10px;height: 10px;' style='background:"+ task.color+ "'>"+"</div>"}
        //   }
        // },
        { align: 'left', name: 'text', label: '', tree: true, width: "*", min_width: 180,},
        { align: 'center', name: 'person', label: '负责人', width: '120' },
        // { align: 'right', name: 'time', label: '时间节点', width: '80' },
        { align: 'center', name: 'progress', label: '进度', width: '120', template: (task) => task.progress * 100 + '%' },
      ]
    }

  },

  watch: {

    'categoryType': function (newVal) {
      this.getTabdataList()
    },
  },
  mounted() {
    // 清空之前的配置
    gantt.clearAll();
    // 默认配置
    gantt.plugins({
      marker: true,
    });
    // const markerId = gantt.addMarker({
    //   start_date: new Date(2023, 4, 26),
    //   css: 'marker',
    //   text: 'makerId aaaa',
    // });
    //任务的点击方法
    gantt.attachEvent("onTaskClick", function (id, e) {
      if (e.target.className === 'gantt_task_content') { //点击内容
        console.log(id, e.target)
      }
      return true;
    });
    gantt.config.work_time = true;
    gantt.i18n.setLocale('cn'); // 设置中文
    gantt.config.readonly = true; // 设置为只读
    gantt.config.bar_height = 32; //task高度
    //自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
    gantt.config.autosize = true;
    //激活列表展开、折叠功能
    gantt.config.open_split_tasks = true;
    //用户可以通过拖拽调整行高
    gantt.config.resize_rows = true;
    //图标项目栏可以任意拖拽
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    //设置甘特图表头高度
    gantt.config.scale_height = 32;
    //点击表头可排序
    gantt.config.sort = false;
    // 显示列配置，限制最大最小时间
    // gantt.config.start_date = new Date(2023, 3, 25);
    // gantt.config.end_date = new Date(2023, 5, 26);
    gantt.config.columns = this.ganttColumns;
    gantt.config.scales = [
      // { unit: 'month', step: 1, format: '%Y年%F' },
      { unit: 'day', step: 1, format: this.formatWeekday },
    ];
    // gantt.getMarker(markerId);
    // 初始化甘特图
    gantt.init(this.$refs.ganttRef);
    gantt.parse(this.gantttt)
  },
  methods: {
    weekScaleTemplate(date) {
      let dateToStr = gantt.date.date_to_str("%d");
      let endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
      const weekNum = gantt.date.date_to_str('%Y年%M 第%D日 ');
      // return weekNum(date) + dateToStr(date) + "-" + dateToStr(endDate) + '日';
      return weekNum(date)
    },
    formatWeekday(date) { //1号 周一
      const dateToStr = gantt.date.date_to_str("%d");
      return dateToStr(date) ;
    },
    setScaleConfig(level) {
      switch (level) {
        case "day":
          gantt.config.scales = [
            { unit: "day", step: 1, format: "%d %M" }
          ];
          gantt.config.scale_height = 27;
          break;
        case "week":
          var weekScaleTemplate = function (date) {
            var dateToStr = gantt.date.date_to_str("%d %M");
            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
          };
          gantt.config.scales = [
            { unit: "week", step: 1, format: weekScaleTemplate },
          ];
          gantt.config.scale_height = 27;
          break;
        case "month":
          gantt.config.scales = [
            { unit: "month", step: 1, format: "%F, %Y" },
          ];
          gantt.config.scale_height = 27;
          break;
        case "year":
          gantt.config.scales = [
            { unit: "year", step: 1, format: "%Y" },
          ];
          gantt.config.scale_height = 27;
          break;
      }

    },




    selectRelatedTasksFun(val) {
      this.init(val.id)
    },
    getTabdataList() {

      // 工单数据

      if (this.categoryType == 'workOrder') {



      } else if (this.categoryType == 'feed') {

        // 投料

      } else if (this.categoryType == 'report') {

        // 报工

        let obj = {

          productionOrderNo: this.prodOrderId,
          classAttribute: "finish_product",
          processId: "",
          "orderItems": [
            {
              "asc": false,
              "column": ""
            },
            {
              "asc": false,
              "column": "create_time"
            }
          ],
          pageNum: -1,
          pageSize: 20,
        }
        getWorkReportList(obj).then(res => {
          this.recoredsData = res.data.records
        })

      } else if (this.categoryType == 'test') {
        // 检验
      } else if (this.categoryType == 'guidebook') {
        // 作业指导书
      } else if (this.categoryType == 'inspectionManual') {
        // 检验指导书
      } else if (this.categoryType == 'tool') {
        // 工装模具
      }
    },
    goBack() {
      this.$emit('close')
    },

    associationTaskFun() {
      this.relatedTaskVisible = true
      console.log(666);
      this.$nextTick(() => {
        this.$refs.relatedTaskForms.init(this.dataForm.productionPlanNo)
      })
    },
    init(row) {
      console.log(row);
      this.dataForm = row

    },





  }

}

</script>

<style lang="scss" scoped>
// .main {

//   padding: 10px 30px 0;

// }

::v-deep .data-form {

  .el-form-item--small.el-form-item {

    margin-bottom: 0 !important;

  }

}



::v-deep .JNPF-common-page-header.noButtons {

  padding: 11px 10px;

}



.required {

  color: red;

  margin-right: 4px;

}



::v-deep .el-tabs__header {

  padding: 0 !important;

  padding-bottom: 0px !important;

  margin-bottom: 0;

}
</style>

<style scoped>
::v-deep .el-tabs__content {

  height: auto !important;

  padding: 0;

}



::v-deep .JNPF-common-page-header {

  padding: 5px 10px;

}
</style>

<style scoped>
.required {

  color: red;

  margin-right: 4px;

}



.el-dialog .el-dialog__body {

  padding: 20px 0px 2px !important;

}



::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {

  padding: 0 5px 0 10px !important;

}



.el-button span {

  font-size: 14px !important;

}



.pagination-container {

  background-color: #f5f7fa;

}



::v-deep .el-input-group__append {

  background-color: #48a2ff;

  color: #fff;

}
</style>

<style lang="scss" scoped>
$footerPadding: '10px';



::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {

  padding: 0;

}



::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {

  padding: 0 10px !important;

}



::v-deep .el-dialog__body {

  margin-bottom: 10px;

}



::v-deep .el-dialog__footer {

  padding: 0 20px 10px;

}



::v-deep .even-row,

::v-deep .odd-row {

  cursor: pointer;

}



.killPadding {

  padding: 0;

}



.killPaddingLeft {

  padding-left: 0 !important;

}



.pagination-container {

  background-color: #f5f7fa;

  margin-top: 0px;

  padding: 2px 10px 2px 0;

}



::v-deep .JNPF-common-search-box.noSearchList {

  padding: 3px 0;

}



::v-deep .has-gutter .el-table__cell.gutter {

  border-bottom: 1px solid #ebeef5;

  background-color: #f5f7fa;

}



.JNPF-common-search-box {

  padding: 8px 0px 0;

}

::v-deep .el-tabs__item {

  padding: 0 10px !important
}



::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {

  padding-left: 0px !important
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



}



::v-deep .el-collapse-item__content {

  padding-bottom: 0px
}





.import_t {

  font-size: 22px;

  color: rgb(103, 194, 58);

  vertical-align: top;

  margin-top: 40px;

  display: inline-block;

  margin-left: 20px;

}



.import_b {

  font-size: 18px;

  /* color: #67c23a; */

  vertical-align: top;

  margin-top: 43px;

  display: inline-block;

}



.orderInfo {

  margin-top: 5px;

}

::v-deep.routingProRes .el-dialog__body {

  height: 500px;

}



::v-deep .applySelect .el-icon-arrow-up:before {

  content: "";

}



.underline-button {

  text-decoration: underline;

}

.personBox p {
  text-align: center;
}

.personBox:nth-child(n + 6) {

  margin-top: 12px;

}



::v-deep .elbutton span {
  font-size: 14px !important;
}



.personBox {

  border: 1px solid #dcdfe6;

  background-color: #f5f7fa;

  /* background-color: #1890ff; */

  margin-left: 26px;

  height: 150px;

  border-radius: 5px;

}



.active {

  background-color: #5d9bd5;

  color: #fff;

}



.feedInfoForm ::v-deep.el-collapse-item__wrap,

.workOrderInfoForm ::v-deep.el-collapse-item__wrap {

  padding: 0 !important;

  border-top: 1px solid #dcdfe6;

  border-right: 0 !important;

}





::v-deep .el-table__body-wrapper {
  height: auto !important;
}





::v-deep .el-descriptions-item__label {
  font-size: 16px;
}

::v-deep .el-descriptions-item__content {
  font-size: 16px;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block !important;
}

.tableContainer {
  height: auto;
}

.stoclInfo {
  position: relative;
  padding: 10px;
  box-shadow: 0 3px 5px rgba(13, 20, 36, 0.18), 0 0 1px rgba(13, 20, 36, 0.29);
}

.JJ {
  position: absolute;
  right: 10px;
  top: 0;
  width: 120px;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-radio-button__inner {
  padding: 12px 15px;
  background-color: #fafafa;
  border: none;
  border-right: 1px solid #dcdfe6;
  font-size: 16px;
}

::v-deep .el-radio-button:last-child .el-radio-button__inner,
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}

.orderNo ::v-deep .el-descriptions-item__label,
.orderNo ::v-deep .el-descriptions-item__content {
  font-size: 20px;
  font-weight: bold;
}
</style>