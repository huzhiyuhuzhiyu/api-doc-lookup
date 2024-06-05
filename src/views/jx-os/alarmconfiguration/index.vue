<template>
    <div class="JNPF-common-layout">

        <el-dialog :title="titles" :visible.sync="dialogVisible" width="60%" center>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="报警类型" style="margin-bottom: 1vw;">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="设备名称" style="margin-bottom: 1vw;">
                    <el-input v-model="form.region"></el-input>
                </el-form-item>
                <el-form-item label="所属区域" style="margin-bottom: 1vw;">
                    <el-select style="width: 100%;" v-model="form.date1" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据类型" style="margin-bottom: 1vw;">
                    <el-input v-model="form.date2"></el-input>
                </el-form-item>
                <el-form-item label="启用" style="margin-bottom: 1vw;">
                    <el-input v-model="form.date2"></el-input>
                </el-form-item>
                <el-form-item label="添加时间" style="margin-bottom: 1vw;">
                    <el-input v-model="form.date2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <div style="">
            <el-row class="JNPF-common-search-box" :gutter="16" justify="space-between">
                <el-form @submit.native.prevent>

                    <el-col :span="6">
                        <el-form-item label="设备分类">
                            <el-cascader style="width: 70%;" v-model="value" :options="options" placeholder="请选择分类"
                                :show-all-levels="false" size="mini" :clearable=true></el-cascader>

                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="报警类型">
                            <el-cascader style="width: 70%;" v-model="value" :options="options" placeholder="请选择类型"
                                :show-all-levels="false" size="mini" :clearable=true></el-cascader>
                        </el-form-item>
                    </el-col>

                    <el-col :span="5">
                        <el-form-item label="">
                            <el-button type="primary" size="mini">搜索</el-button>

                        </el-form-item>
                    </el-col>


                </el-form>
            </el-row>
        </div>

        <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>

        <div class="tabs">
            <!-- <div style="">
                <el-button type="primary" icon="el-icon-plus" @click="handle">新增</el-button>
            </div> -->

                <JNPF-table v-loading="listLoading" :data="tableData" @sort-change='sortChange'
                    :span-method="arraySpanMethod">
                    <el-table-column prop="date" label="报警类型" align="left" />
                    <el-table-column prop="name" label="设备名称" align="left" />
                    <el-table-column prop="address" label="所属区域" align="left" /><!-- 运行时间 -->
                    <el-table-column prop="hobby" label="数据类型" align="left" />
                    <!-- <el-table-column label="操作" fixed="right" width="150">
                        <template slot-scope="scope">
                            <el-button type="text" @click="goDetail(scope.row)">详情
                            </el-button>
                        </template>
                    </el-table-column> -->
                </JNPF-table>
                <pagination :total="total" :page.sync="currentPage" :limit.sync="pageSize" @pagination="initData" />
        </div>


    </div>
</template>

<script>
import Detailspages from "./detailspages";
export default {
    components: { Detailspages },
    data() {
        return {
            value: [],
            dialogVisible: false,
            // innerVisible: false,
            input: "",
            options: [
                {
                    value: "zhinan",
                    label: "指南",
                    children: [
                        {
                            value: "shejiyuanze",
                            label: "设计原则",
                            children: [
                                {
                                    value: "yizhi",
                                    label: "一致",
                                },
                                {
                                    value: "fankui",
                                    label: "反馈",
                                },
                                {
                                    value: "xiaolv",
                                    label: "效率",
                                },
                                {
                                    value: "kekong",
                                    label: "可控",
                                },
                            ],
                        },
                        {
                            value: "daohang",
                            label: "导航",
                            children: [
                                {
                                    value: "cexiangdaohang",
                                    label: "侧向导航",
                                },
                                {
                                    value: "dingbudaohang",
                                    label: "顶部导航",
                                },
                            ],
                        },
                    ],
                },
                {
                    value: "zujian",
                    label: "组件",
                    children: [
                        {
                            value: "basic",
                            label: "Basic",
                            children: [
                                {
                                    value: "layout",
                                    label: "Layout 布局",
                                },
                                {
                                    value: "color",
                                    label: "Color 色彩",
                                },
                                {
                                    value: "typography",
                                    label: "Typography 字体",
                                },
                                {
                                    value: "icon",
                                    label: "Icon 图标",
                                },
                                {
                                    value: "button",
                                    label: "Button 按钮",
                                },
                            ],
                        },
                        {
                            value: "form",
                            label: "Form",
                            children: [
                                {
                                    value: "radio",
                                    label: "Radio 单选框",
                                },
                                {
                                    value: "checkbox",
                                    label: "Checkbox 多选框",
                                },
                                {
                                    value: "input",
                                    label: "Input 输入框",
                                },
                                {
                                    value: "input-number",
                                    label: "InputNumber 计数器",
                                },
                                {
                                    value: "select",
                                    label: "Select 选择器",
                                },
                                {
                                    value: "cascader",
                                    label: "Cascader 级联选择器",
                                },
                                {
                                    value: "switch",
                                    label: "Switch 开关",
                                },
                                {
                                    value: "slider",
                                    label: "Slider 滑块",
                                },
                                {
                                    value: "time-picker",
                                    label: "TimePicker 时间选择器",
                                },
                                {
                                    value: "date-picker",
                                    label: "DatePicker 日期选择器",
                                },
                                {
                                    value: "datetime-picker",
                                    label: "DateTimePicker 日期时间选择器",
                                },
                                {
                                    value: "upload",
                                    label: "Upload 上传",
                                },
                                {
                                    value: "rate",
                                    label: "Rate 评分",
                                },
                                {
                                    value: "form",
                                    label: "Form 表单",
                                },
                            ],
                        },
                        {
                            value: "data",
                            label: "Data",
                            children: [
                                {
                                    value: "table",
                                    label: "Table 表格",
                                },
                                {
                                    value: "tag",
                                    label: "Tag 标签",
                                },
                                {
                                    value: "progress",
                                    label: "Progress 进度条",
                                },
                                {
                                    value: "tree",
                                    label: "Tree 树形控件",
                                },
                                {
                                    value: "pagination",
                                    label: "Pagination 分页",
                                },
                                {
                                    value: "badge",
                                    label: "Badge 标记",
                                },
                            ],
                        },
                        {
                            value: "notice",
                            label: "Notice",
                            children: [
                                {
                                    value: "alert",
                                    label: "Alert 警告",
                                },
                                {
                                    value: "loading",
                                    label: "Loading 加载",
                                },
                                {
                                    value: "message",
                                    label: "Message 消息提示",
                                },
                                {
                                    value: "message-box",
                                    label: "MessageBox 弹框",
                                },
                                {
                                    value: "notification",
                                    label: "Notification 通知",
                                },
                            ],
                        },
                        {
                            value: "navigation",
                            label: "Navigation",
                            children: [
                                {
                                    value: "menu",
                                    label: "NavMenu 导航菜单",
                                },
                                {
                                    value: "tabs",
                                    label: "Tabs 标签页",
                                },
                                {
                                    value: "breadcrumb",
                                    label: "Breadcrumb 面包屑",
                                },
                                {
                                    value: "dropdown",
                                    label: "Dropdown 下拉菜单",
                                },
                                {
                                    value: "steps",
                                    label: "Steps 步骤条",
                                },
                            ],
                        },
                        {
                            value: "others",
                            label: "Others",
                            children: [
                                {
                                    value: "dialog",
                                    label: "Dialog 对话框",
                                },
                                {
                                    value: "tooltip",
                                    label: "Tooltip 文字提示",
                                },
                                {
                                    value: "popover",
                                    label: "Popover 弹出框",
                                },
                                {
                                    value: "card",
                                    label: "Card 卡片",
                                },
                                {
                                    value: "carousel",
                                    label: "Carousel 走马灯",
                                },
                                {
                                    value: "collapse",
                                    label: "Collapse 折叠面板",
                                },
                            ],
                        },
                    ],
                },
                {
                    value: "ziyuan",
                    label: "资源",
                    children: [
                        {
                            value: "axure",
                            label: "Axure Components",
                        },
                        {
                            value: "sketch",
                            label: "Sketch Templates",
                        },
                        {
                            value: "jiaohu",
                            label: "组件交互文档",
                        },
                    ],
                },
            ],

            tableData: [
                {
                    name: "B1",
                    date: "粘钉一体机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B2",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B3",
                    date: "模切压痕机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "A1",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "C1",
                    date: "钉箱机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "C2",
                    date: "粘钉一体机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "D1",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "F1",
                    date: "模切压痕机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "D12",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B11",
                    date: "钉箱机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B21",
                    date: "粘钉一体机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "A15",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "C13",
                    date: "模切压痕机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B1",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B1",
                    date: "钉箱机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B21",
                    date: "粘钉一体机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "A15",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "C13",
                    date: "模切压痕机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B1",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B1",
                    date: "钉箱机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B21",
                    date: "粘钉一体机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "A15",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "C13",
                    date: "模切压痕机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B1",
                    date: "印刷机",
                    hobby: "996587",
                    address: "09时14分59秒",
                },
                {
                    name: "B1",
                    date: "钉箱机",
                    hobby: "996587",
                    address: "09时14分59秒",
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
            flag: true,
            value1: null,
            titles: "新建",

            listLoading: false,
            total: 0,
            currentPage: 1,
            pageSize: 20,





        };
    },
    mounted() {
        this.ths();
    },
    updated() {
        this.ths();
    },
    methods: {
        handle() {
            // this.titles = "新建";
            this.dialogVisible = true;
        },
        handless() {
            this.titles = "修改";
            this.flag = false;
        },
        handles() {
            this.flag = true;
        },
        ths() {
            let thss = document.querySelectorAll("th");
            thss.forEach((item, index) => {
                item.style.fontWeight = "bold";
            });
        },

        sortChange() { },

        initData() { },

        arraySpanMethod() { },





    },
};
</script>

<style scoped>
.app-center {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}


.JNPF-common-layout {
    flex-direction: column;
    background-color: #fff;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
}

.JNPF-common-search-box {
    background-color: transparent;
}


.tabs {
    /* border: 1px solid red; */
    height: calc(100vh - 250px);
    /* 这个属性会使分页器进入滚动区域 */
    /* overflow: auto; */
}

/* 表格列表出来 */
.tableContainer {
    flex: initial;
}





.biaotou {
    margin-left: 50px;
    color: white;
}

.ve-table-header-th {
    font-weight: bold !important;
}
</style>