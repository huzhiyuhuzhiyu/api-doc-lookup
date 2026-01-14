<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="'任务进度'" />
          <div class="options">
            <!-- <el-button type="primary" size="mini" @click="associationTaskFun">查看关联任务</el-button> -->
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading" ref="main">
          <el-collapse v-model="activeNames1" class="orderInfo">
            <el-collapse-item title="任务信息" name="basicInfo">
              <div class="stoclInfo" ref="stoclInfo">
                <el-descriptions :column="1" class="orderNo">
                  <el-descriptions-item label="任务单号">{{ dataForm.orderNo
                    }}<img v-if="dataForm.urgentFlag" src="@/assets/images/emergency1.png" alt=""
                      style="width: 30px;vertical-align: top;margin-left:5px"></el-descriptions-item>

                </el-descriptions>
                <el-descriptions :column="1" class="box">

                  <el-descriptions-item label="型号" class="drawingNo">{{ dataForm.productDrawingNo
                    }} </el-descriptions-item>
                </el-descriptions>
                <el-descriptions class="margin-top" :column="4">
                  <el-descriptions-item label="任务类型" class="orderNo" v-if="dataForm.orderType == 'normal'">
                    <el-tag style="vertical-align: super;" effect="dark">正常任务</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="任务类型" class="orderNo" v-if="dataForm.orderType == 'rework'">
                    <el-tag style="vertical-align: super;" type="warning" effect="dark">返工任务</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="任务类型" class="orderNo" v-if="dataForm.orderType == 'manually'">
                    <el-tag style="vertical-align: super;"   effect="dark">手动创建任务</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="产品编码">{{ dataForm.productCode }}</el-descriptions-item>
                  <el-descriptions-item label="所属项目" v-if="isProjectSwitch == 1">{{ dataForm.projectName
                    }}</el-descriptions-item>
                  <el-descriptions-item label="总生产数量">{{ dataForm.productionQuantity }}{{ dataForm.mainUnit
                    }}</el-descriptions-item>
                  <el-descriptions-item label="已完成数量">{{ dataForm.completedQuantity }}{{ dataForm.mainUnit
                    }}</el-descriptions-item>
                  <el-descriptions-item label="工艺路线名称">{{ dataForm.routingName }}</el-descriptions-item>
                  <el-descriptions-item :label="$store.getters.sealingCoverTyping" >{{ dataForm.sealingCoverTyping }}</el-descriptions-item>
                  <el-descriptions-item :label="$store.getters.accuracyLevel" >{{ dataForm.accuracyLevel }}</el-descriptions-item>
                  <el-descriptions-item label="振动等级">{{ dataForm.vibrationLevel }}</el-descriptions-item>
                  <el-descriptions-item label="油脂">{{ dataForm.oil }}</el-descriptions-item>
                  <el-descriptions-item label="油脂量">{{ dataForm.oilQuantity }}</el-descriptions-item>
                  <el-descriptions-item label="游隙">{{ dataForm.clearance }}</el-descriptions-item>
                  <el-descriptions-item label="包装方式">{{ dataForm.packagingMethod }}</el-descriptions-item>
                  <el-descriptions-item :label="$store.getters.specialRequire" >{{ dataForm.specialRequire }}</el-descriptions-item>
                  <el-descriptions-item label="计划单号">{{ dataForm.productionPlanNo }}</el-descriptions-item>
                  <!-- <el-descriptions-item label="状态" v-if="dataForm.orderStatus == 'normal'">进行中</el-descriptions-item>
                  <el-descriptions-item label="状态" v-if="dataForm.orderStatus == 'closed'">关闭</el-descriptions-item>
                  <el-descriptions-item label="状态" v-if="dataForm.orderStatus == 'finish'">已完成</el-descriptions-item> -->
                  <el-descriptions-item label="计划日期">{{ dataForm.planStartDate }}至{{ dataForm.planEndDate
                    }}</el-descriptions-item>
                </el-descriptions>
                <!-- <img class="JJImg" v-if="dataForm.urgentFlag" src="@/assets/images/emergency.png" alt="" style="bottom: 0;"> -->
                <img class="JJ" v-if="dataForm.orderStatus == 'closed'" src="@/assets/images/close.png" alt="">
                <img class="JJ" v-if="dataForm.orderStatus == 'normal'" src="@/assets/images/progressing.png" alt="">
                <img class="JJ" v-if="dataForm.orderStatus == 'finish'" src="@/assets/images/successing.png" alt="">
              </div>
            </el-collapse-item>
            <el-collapse-item title="生产进度" name="info">
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
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      height: 0,
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
        { label: "正常任务", value: "normal", },
        { label: "返工任务", value: "rework", },
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
      selectedRow: null,
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
          { id: 1, text: 'PPDH202410080004', person: '管理员', progress: 0.1, type: 'task', start_date: new Date('2022-10-01'), end_date: new Date('2023-10-12'), open: true },
          { id: 11, parent: 1, text: '初始化项目', person: '李四', type: 'task', progress: 0.1, color: '#ff0000', start_date: new Date('2023-10-02'), end_date: new Date('2023-10-05'), open: true },
          { id: 12, parent: 1, text: '前后端开发', type: 'task', progress: 0.1, color: '#00ff00', start_date: new Date('2023-10-05'), end_date: new Date('2023-10-08'), open: true },
          { id: 13, parent: 1, text: '测试', type: 'task', progress: 0.1, color: '#0000ff', start_date: new Date('2023-10-08'), end_date: new Date('2023-10-10') },
          { id: 14, parent: 1, text: '上线', type: 'task', progress: 0.1, color: '#00ffff', start_date: new Date('2023-10-10'), end_date: new Date('2023-10-12') },

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
        { align: 'left', name: 'text', label: '', tree: true, width: "*", min_width: 180, },
        // { align: 'center', name: 'person', label: '负责人', width: '120' },
        // { align: 'right', name: 'time', label: '时间节点', width: '80' },
        { align: 'center', name: 'progress', label: '进度', width: '120', template: (task) => task.progress * 100 + '%' },
      ]
    }

  },
  async created() {

    await this.getProjectSwitch('system', 'project')
  },

  mounted() {
    this.switchStyle()
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
    // 显示到任务上的文本
    gantt.templates.task_text = function (start, end, task) {

      return "" + task.text + "<span style='margin-left:20px;'></span>" + task
        .qualifiedQuantity + "/" + task.productionQuantity;


    };
    // // 鼠标悬浮工具提示文本配置
    // gantt.templates.tooltip_text = function (start, end, task) {
    //   if (!task.parent) {
    //     return `
    //         <div style='display:flex;flex-wrap:wrap;align-items: center;width:300px;'>
    //           <div style='width: 60%;line-height: 18px;'>任务单号：${task.text}</div>
    //           <div style='width: 60%;line-height: 18px;'>数量：${task.qualifiedQuantity}/${task.productionQuantity}</div>
    //           <div style='width: 60%;line-height: 18px;'>计划时间：${task.start_date} ~ ${task.end_date}</div>
    //         </div>
    //         `;
    //   } else {
    //     return `
    //         <div style='display:flex;flex-wrap:wrap;align-items: center;width:300px;'>
    //           <div style='width: 60%;line-height: 18px;'>工单编号：${task.orderNo}</div>
    //           <div style='width: 40%;line-height: 18px;'>工序名称：${task.text}</div>
    //           <div style='width: 60%;line-height: 18px;'>数量：${task.qualifiedQuantity}/${task.productionQuantity}</div>
    //           <div style='width: 60%;line-height: 18px;'>计划时间：${task.start_date} ~ ${task.end_date}</div>
    //         </div>
    //         `;
    //   }
    // };
    gantt.plugins({
      tooltip: false, // 启用tooltip悬浮框
      marker: false, // 时间标记
      // drag_timeline: true, // 拖动图
    });
    gantt.config.autofit = false;
    gantt.config.column_width = 50;
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
      { unit: 'month', step: 1, format: this.monthScaleTemplate },
      { unit: 'day', step: 1, format: this.formatWeekday },
    ];
    // gantt.getMarker(markerId);
    // 初始化甘特图

    gantt.templates.task_class = (start, end, task) => {
      console.log(task.progress);
      if (task.progress == 0) return 'Noproduc'
      if (task.progress < 0.5) {
        return "low-progress"; //进度低于50%
      } else if (task.progress < 1.0) {
        return "mid-progress"; //进度在50%-99%之间
      } else {
        return "high-progress"; // 完成 }
      };
    }
    const style = document.createElement('style');
    style.innerHTML = `
    .Noproduc{
    background-color:"#FFbc00!important"
    }
      .low-progress {
      background-color:#FFbc00; /*低进度颜色 */
      }
      .mid-progress {
      background-color: #FFbc00; /* 中等进度颜色 */
      }
      .high-progress {
      background-color: green!important; /* 高进度颜色 */
      }
      `;
    document.head.appendChild(style);

  },
  methods: {
    monthScaleTemplate(date) {
      const dateToStrss = gantt.date.date_to_str("%Y年");
      const dateToStrs = gantt.date.date_to_str("%M");
      // return dateToStrss(date)+dateToStrs(date)+dateToStr(date)+'日';
      return dateToStrss(date) + dateToStrs(date);
    },
    formatWeekday(date) { //1号 周一
      const dateToStr = gantt.date.date_to_str("%d");
      const dateToStrss = gantt.date.date_to_str("%Y年");
      const dateToStrs = gantt.date.date_to_str("%M");
      // return dateToStrss(date)+dateToStrs(date)+dateToStr(date)+'日';
      return dateToStrs(date) + dateToStr(date) + '日';
    },





    handleRowClick(row) {
      console.log(row);
      this.selectedRow = row; // 点击行时更新选中行
      console.log(123, row == this.selectedRow);
    },
    // 这里处理行的样式类
    rowClassName({ row, rowIndex }) {
      const classes = [];
      if (rowIndex === 0 && this.selectedRow != this.workOrderData[0]) {
        console.log(666666);
        classes.push('highlight-first-row'); // 只有在没有选中其他行时才添加第一行的背景色
      }
      this.$nextTick(() => {
        if (this.selectedRow == row) {
          classes.push('highlight-selected-row'); // 选中行添加背景色类
        }
      })
      return classes.join(' '); // 返回类名
    },
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      let allHeight = this.$refs.main.clientHeight
      let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      console.log("allHeight", allHeight);
      console.log("HeightstoclInfo", HeightstoclInfo);
      this.height = (allHeight - HeightstoclInfo - 160) + 'px'
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },


    selectRelatedTasksFun(val) {
      this.init(val.id)
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
    init(id) {
      this.prodOrderId = id
      detailordershengchan(id).then(res => {
        console.log("生产任务详情", res);
        this.dataForm = res.data.prodOrder
        this.feedData = res.data.materialList
        this.workOrderData = res.data.workOrderList
        let arr = []



        // 2. 拆分成单个项目
        const list = this.dataForm.processSchedule.split(',');

        // 3. 将每个项目转换为对象格式
        const result = list.map(item => {
          const [name, progress] = item.split(':');
          return { name: name, progress: progress };
        });

        console.log(123, result);

        this.workOrderData.forEach((itemss, index) => {
          if (!itemss.actualStartDate || !itemss.actualEndDate) {
            itemss.actualStartDate = itemss.planStartDate
            itemss.actualEndDate = itemss.planEndDate
          } else {
            itemss.actualStartDate = itemss.actualStartDate ? itemss.actualStartDate.substring(0, 10) : ""
            itemss.actualEndDate = itemss.actualEndDate ? itemss.actualEndDate.substring(0, 10) : ""
          }
          let bjss = {
            id: itemss.id,
            text: result[index].name,
            progress: result[index].progress / 100,
            type: 'task',
            start_date: new Date(itemss.actualStartDate == itemss.actualEndDate ? itemss.actualStartDate + ' 00:00:00' : itemss.actualStartDate + ' 00:00:00'),
            end_date: new Date(itemss.actualStartDate == itemss.actualEndDate ? itemss.actualEndDate + ' 23:59:59' : itemss.actualEndDate + ' 23:59:59'),
            qualifiedQuantity: itemss.qualifiedQuantity,
            productionQuantity: itemss.productionQuantity,
            duration: 20,
            // color: "green",
          }
          arr.push(bjss)
        })


        console.log("arr", arr);
        this.gantttt.data = arr
        gantt.init(this.$refs.ganttRef);
        gantt.parse(this.gantttt)
      })
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

/* 设置行背景色 */
.row-background {
  background-color: #f0f9eb;
  /* 浅绿色背景 */
}

.processTitle {
  background: #fafafa;
  font-size: 16px;
  font-weight: 600;
  padding-left: 5px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dcdfe6;
}

::v-deep .highlight-first-row {
  background-color: #e0f7fa;
  /* 设置第一行的背景色 */
}

::v-deep .highlight-first-rows {
  background-color: red;
  /* 设置第一行的背景色 */
}

::v-deep .highlight-selected-row {
  background-color: #f2f2f2;
  /* 设置选中行的背景色 */
}

::v-deep .gantt_cell_tree {
  border-right: 0.5px solid #e0e0e0;
}
</style>
