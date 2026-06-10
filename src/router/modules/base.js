// 基础路由
const baseRouter = [
    {
	path: '/',
	component: (resolve) => require(['@/views/commonPage'], resolve),
	name: 'home',
	meta: {
		title: 'home',
		icon: 'icon-ym icon-ym-nav-home',
		affix: false,
		zhTitle: '首页'
	}
},
    
// {
// 	path: '/dashboard',
// 	component: (resolve) => require(['@/views/basic/dashboard'], resolve),
// 	name: 'dashboard',
// 	meta: {
// 		title: 'dashboard',
// 		icon: 'icon-ym icon-ym-generator-kanban',
// 		affix: true,
// 		zhTitle: '门户展示'
// 	}
// },
{
	path: '/messageRecord',
	component: (resolve) => require(['@/views/basic/messageRecord'], resolve),
	name: 'messageRecord',
	meta: {
		title: 'messageRecord',
		affix: false,
		zhTitle: '消息中心',
		icon: 'icon-ym icon-ym-sysNotice',
	}
},
{
	path: '/previewModel',
	component: (resolve) => require(['@/views/basic/dynamicModel'], resolve),
	name: 'previewModel',
	meta: {
		title: 'previewModel',
		affix: false,
		zhTitle: '功能预览',
		icon: 'icon-ym icon-ym-btn-preview',
	}
},
{
	path: '/profile',
	component: (resolve) => require(['@/views/basic/profile'], resolve),
	name: 'profile',
	meta: {
		title: 'profile',
		affix: false,
		zhTitle: '个人信息',
		icon: 'icon-ym icon-ym-user',
	}
},
{
	path: '/emailDetail',
	component: (resolve) => require(['@/views/extend/email/DetailPage'], resolve),
	name: 'emailDetail',
	meta: {
		title: 'emailDetail',
		affix: false,
		zhTitle: '查看邮件',
		icon: 'icon-ym icon-ym-emailExample',
	}
},
{
	path: '/workFlowDetail',
	component: (resolve) => require(['@/views/workFlow/workFlowDetail'], resolve),
	name: 'workFlowDetail',
	meta: {
		title: 'workFlowDetail',
		affix: false,
		zhTitle: '流程详情',
		icon: 'icon-ym icon-ym-workFlow',
	}
},
{
	path: '/AbmessageDetail',
	component: (resolve) => require(['@/views/ANDONManagement/processProcessing/AbmessageDetail'], resolve),
	name: 'AbmessageDetail',
	meta: {
		title: 'AbmessageDetail',
		affix: false,
		zhTitle: '异常流程详情',
		icon: 'icon-ym icon-ym-workFlow',
	}
},
{
	path: '/externalLink',
	component: (resolve) => require(['@/views/basic/externalLink'], resolve),
	name: 'externalLink',
	meta: {
		title: 'externalLink',
		affix: false,
		zhTitle: '链接',
		icon: 'icon-ym icon-ym-generator-link',
	}
},
{
	path:'/processSettingss/add',
	component: (resolve) => require(['@/views/basicData/processSettings/processSettingss/Form'], resolve),
	name: 'processSettingssAdd',
	meta: {
		title: 'processSettingssAdd',
		affix: false,
		zhTitle: '工艺',
		icon: 'icon-ym icon-ym-generator-process',
	}
}

]
export default baseRouter
