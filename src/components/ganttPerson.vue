<template>
	<div>
		<div ref="gantt" :style="'height:' + (tabheight - 80) + 'px'" />
	</div>
</template>
 
<script>
import gantt from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
// import { getAction, putAction } from '@/api/manage'
export default {
    name: 'ganttPerson',
    props: ['ganttData', 'dateType'],
    watch: {
        ganttData: {
            handler(val) {
                this.tasks = {
                    data: val
                }
                this.init();
            },
            deep: true
        }
    },
    mounted() {
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.tabheight = h - 170;
        if (this.height) {
			this.tabheight = this.height;
		}
    },
	// mixins: [JeecgListMixin],
	data() {
		return {
            // 注册事件拦截
            onTaskDblClick: null,
			// 甘特图配置
			tasks: {
				data: [
                    //  把父节点的开始结束设置为同一天，就可以实现隐藏父节点的bar
                    // # 字段解释
                    //  id:   数据id  必须是唯一值，父子也不能重复
                    //  text: 会显示在bar上的字段，如不显示就设为 ''
                    //  progress: 完成度， 0 - 1
                    //  start_date: 开始的日期，格式在js里设置，
                    //  end_date: 结束的日期  要时分秒！ 只给日期会视为日期的 00:00:00  要特殊处理一下!!
                    //  open: 如果是父节点，是否默认展开
                    //  parent:  子节点必须有，设置为父节点的id，会自动处理，数据顺序无所谓
                    // #=================================================================
				]
				// #字段解释
				// 格式 id:数据id
				//     source:开始链接的项目id  ----为tasks.data中数据的id
				//     target:要链接项目的id  ----为tasks.data中数据的id
				//     type: 0--进行-开始  `尾部链接头部`
				//           1--开始-开始  `头部链接头部`
				//           2--进行-进行  `尾部链接尾部`
				//           3--开始-进行  `头部链接尾部`
				// 任务之间连接线，目前注释掉了，需要的话打开
				// links: [
				// 	{ id: '10', source: '11', target: '12', type: '1' },
				// 	{ id: '11', source: '11', target: '13', type: '1' },
				// 	{ id: '12', source: '11', target: '14', type: '1' },
				// 	{ id: '13', source: '11', target: '15', type: '1' },
				// 	{ id: '14', source: '23', target: '16', type: '0' },
				// 	{ id: '15', source: '13', target: '17', type: '1' },
				// 	{ id: '16', source: '17', target: '18', type: '0' },
				// 	{ id: '17', source: '18', target: '19', type: '0' },
				// 	{ id: '18', source: '19', target: '20', type: '0' },
				// 	{ id: '19', source: '15', target: '21', type: '2' },
				// 	{ id: '20', source: '15', target: '22', type: '2' },
				// 	{ id: '21', source: '15', target: '23', type: '0' }
				// ]
			},
 
			url: {
				// list: "/projectManage/projectPlan/queryProjectPlanGTT",
				// delete: "/projectManage/projectModule/delete",
				// deleteBatch: "/projectManage/projectModule/deleteBatch",
				// exportXlsUrl: "/projectManage/projectModule/exportXls",
				// importExcelUrl: "/projectManage/projectModule/importExcel",
				// budgetExportXlsUrl: "/projectManage/projectModule/budgetExportXls",
				// budgetImportUrl: "/projectManage/projectModule/budgetImportExcel",
			},
            tabheight: 0
		};
	},
	methods: {
		// 初始化
		init() {
			gantt.i18n.setLocale('cn'); // 汉化 - 默认是英文
			// 格式化日期
			gantt.locale.date = {
				month_full: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				month_short: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				day_full: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
				day_short: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
			};
 
			gantt.locale.labels = {
				dhx_cal_today_button: '今天',
				day_tab: '日',
				week_tab: '周',
				month_tab: '月',
				new_event: '新建日程',
				icon_save: '保存',
				icon_cancel: '关闭',
				icon_details: '详细',
				icon_edit: '编辑',
				icon_delete: '删除',
				confirm_closing: '请确认是否撤销修改!', //Your changes will be lost, are your sure?
				confirm_deleting: '是否删除计划?',
				section_description: '描述:',
				section_time: '时间范围:',
				section_type: '类型:',
				section_text: '计划名称:',
				section_test: '测试:',
				section_projectClass: '项目类型:',
				taskProjectType_0: '项目任务',
				taskProjectType_1: '普通任务',
				section_head: '负责人:',
				section_priority: '优先级:',
				taskProgress: '任务状态',
				taskProgress_0: '未开始',
				taskProgress_1: '进行中',
				taskProgress_2: '已完成',
				taskProgress_3: '已延期',
				taskProgress_4: '搁置中',
				section_template: 'Details',
				/* grid columns */
				column_text: '计划名称',
				column_start_date: '开始时间',
				column_duration: '持续时间',
				column_add: '',
				column_priority: '难度',
				/* link confirmation */
				link: '关联',
				confirm_link_deleting: '将被删除',
				message_ok: '确定',
				message_cancel: '取消',
				link_start: ' (开始)',
				link_end: ' (结束)',
 
				type_task: '任务',
				type_project: '项目',
				type_milestone: '里程碑',
				minutes: '分钟',
				hours: '小时',
				days: '天',
				weeks: '周',
				months: '月',
				years: '年'
			};
 
			//自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
			gantt.config.autosize = false;
			//只读模式
			gantt.config.readonly = true;
			//是否显示左侧树表格
			gantt.config.show_grid = true;
			// 设置表头高度
			gantt.config.scale_height = 50;
            // 设置bar的高度
            gantt.config.bar_height = 26;
            // 设置行的高度
            gantt.config.row_height = 32;
            // 设置时间识别格式
            gantt.config.xml_date = "%Y-%m-%d %H:%i"
			// //表格列设置
			gantt.config.columns = [
				{ name: 'text', label: '项目名称', tree: true, width: '200', align: 'left', template: (task)=>{
                    if(task.parent) {
                        return task.text
                    } else {
                        return `<div style="font-weight: 700">${task.text}</div>`
                    }
                }},
                { name: 'person', label: '项目成员', width: '100', align: 'center' },
                // { name: 'post', label: '岗位名称', width: '100', align: 'center' },
                // { name: 'department', label: '部门名称', width: '100', align: 'center' },
                { name: 'task', label: '项目任务', width: '100', align: 'center' },
				// { name: 'number', label: '工单号', tree: false, width: '120', align: 'center', },
				// {
				// 	name: 'duration',
				// 	label: '工期',
				// 	align: 'center',
				// 	template: function(obj) {
				// 		return obj.duration + '天';
				// 	}
				// }
				// {name:"start_date", label:"开始时间", align: "center" },
				// {name:"end_date",   label:"结束时间",   align: "center" },
			];
            // 为每个bar增加class
			gantt.templates.task_class = function(start, end, item) {
				switch (item.status) {
					case '400': // 已完成
						return 'gantt_success';
					case '100': // 未开始
						return 'gantt_begined';
					case '200': // 进行中
						return 'gantt_primary';
					case '300': // 暂停
						return 'gantt_warning';
					default: // 已终止 500
						return 'gantt_info';
				}
			};
			// 自动延长时间刻度
			gantt.config.fit_tasks = true;
			// 允许拖放
			gantt.config.drag_project = true;
			// 定义时间格式
            if(this.dateType === 'year') {
                // 年 格式
                gantt.config.scales = [{ unit: 'year', step: 1, date: ' %Y 年' }];
            } else if(this.dateType === 'month') {
                // 月 格式
			   gantt.config.scales = [{ unit: 'year', step: 1, date: ' %Y 年' }, { unit: 'month', step: 1, date: '%F' }];
            } else {
                 // 日 格式
                gantt.config.scales = [{ unit: 'month', step: 1, date: ' %Y 年  %F' }, { unit: 'day', step: 1, date: '%d' }];
            }
			// //当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
			gantt.config.fit_tasks = true;
 
			// 添加弹窗属性
			gantt.config.lightbox.sections = [
				{
					name: 'description',
					height: 70,
					map_to: 'text',
					type: 'textarea',
					focus: true
				},
				{ name: 'type', type: 'typeselect', map_to: 'type' },
				{ name: 'time', type: 'duration', map_to: 'auto' }
			];
                
            // 给每行增加双击事件 ，亲测事件会重复注册，用这个方法拦截一下
            if (this.onTaskDblClick) gantt.detachEvent(this.onTaskDblClick);
             // 双击bar任务事件（单击会有问题，点击展开时也会触发）
            this.onTaskDblClick = gantt.attachEvent("onTaskDblClick", (id, e) => {
                this.$emit('rowDbClick',id)
                return true;
            }, { id: 'onTaskDblClick' })
            
            // 清空旧数据
			gantt.clearAll(); 
            // 销毁gantt实例   按需开启
            // gantt.destructor()
			// 初始化
			gantt.init(this.$refs.gantt);
			// 数据解析
			gantt.parse(this.tasks);
		},
	}
};
</script>
 
<style lang="less" scoped>
::v-deep  .gantt_row.gantt_row_project:hover {
	background: #e4e4e4 !important;
}
 
::v-deep  .gantt_row.gantt_row_task:hover {
	background: #e4e4e4 !important;
}
::v-deep  .gantt_selected {
	background: #ececec !important;
}
::v-deep  .gantt_task_row.gantt_selected .gantt_task_cell {
	background: #ececec !important;
	border-right-color: #ebebeb !important;
}
 
::v-deep  .gantt_grid_head_cell {
	background-color: #f7f7f7;
	font-weight: 700;
	font-size: 13px;
	color: #000000;
}
::v-deep  .gantt_scale_cell {
	background-color: #f7f7f7;
	font-weight: 700;
	color: #000000 !important;
	border-bottom: 1px solid #ebebeb;
}
::v-deep  .gantt_task_line {
    border: none !important;
    box-shadow: none !important;
}
::v-deep  .gantt_task_progress_wrapper {
    border: none !important;
    background-color: #E1E1E1;
    border-radius: 8px;
}
::v-deep  .gantt_task_content {
 
}
::v-deep  .gantt_task_line {
    border: none;
    border-radius: 8px;
    background-color: transparent;
}
::v-deep  .gantt_success .gantt_task_progress {
	background: #13C400 !important;
    border: none !important;
}
::v-deep  .gantt_primary .gantt_task_progress {
	background:  #3A84FF!important;
    border: none !important;
}
::v-deep  .gantt_begined .gantt_task_progress {
	background: #9a9a9a !important;
    border: none !important;
}
::v-deep  .gantt_info .gantt_task_progress {
	background: #FE0000 !important;
    border: none !important;
}
::v-deep  .gantt_warning .gantt_task_progress {
	background: #FF7700 !important;
    border: none !important;
}
</style>