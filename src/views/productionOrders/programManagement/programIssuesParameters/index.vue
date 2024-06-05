<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
                <h2>设备分类</h2>
                <span class="options">
                    <el-dropdown>
                        <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
                            <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                            <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                            <!-- <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item> -->
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </div>

            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
                <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                    highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                    class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                    <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                        <i :class="[
                            data.childrenList.length > 0
                                ? 'icon-ym icon-ym-tree-organization3'
                                : 'icon-ym icon-ym-systemForm'
                        ]" />
                        <span class="text" :title="data.name">{{
                            data.name
                        }}</span>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="5">
                        <el-form-item>
                            <el-input v-model="listQuery.code" placeholder="请输入设备编码" @keyup.enter.native="search()"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-input v-model.trim="listQuery.name" placeholder="请输入设备名称" @keyup.enter.native="search()"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-input v-model.trim="listQuery.gatewayIp" placeholder="请输入网关ip"
                                @keyup.enter.native="search()" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-input v-model.trim="listQuery.gatewaySerialNo" placeholder="请输入网关序列号"
                                @keyup.enter.native="search()" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                {{ $t("common.search") }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <!-- <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle('', false, 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div> -->
                <JNPF-table v-loading="listLoading" :data="tableData" :customColumn="true" ref="dataTable"
                    @sort-change="sortChange" :fixedNO="true">
                    <el-table-column prop="code" label="设备编码" min-width="150" sortable="custom" />
                    <el-table-column prop="name" label="设备名称" min-width="150" sortable="custom" />
                    <el-table-column prop="gatewayIp" label="网关ip	" min-width="150" />
                    <el-table-column prop="gatewaySerialNo" label="网关序列号" min-width="200" sortable="custom" />
                    <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" min-width="80" />
                    <el-table-column label="操作" min-width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="edit(scope.row)">
                                设置参数
                            </el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
        <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
        <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" />
        <el-dialog title="设置参数" :visible.sync="dialogVisible" width="30%" lock-scroll
            class="JNPF-dialog JNPF-dialog_center">
            <el-form ref="dataForm" :model="dataForm" label-width="100px" style="margin-top: 10px;">
                <el-row :gutter="20" class="custom-row">
                    <el-col :span="24">
                        <el-form-item label="网关ip" prop="gatewayIp">
                            <el-input v-model="dataForm.gatewayIp" placeholder="请输入网关ip" maxlength="20" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="网关序列号" prop="gatewaySerialNo">
                            <el-input v-model="dataForm.gatewaySerialNo" placeholder="请输入网关序列号" maxlength="20" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getPositionList, deleteEquEquipment } from "@/api/permission/position";
import { getCategoryTrees, plmsync } from "@/api/basicData/index";
import {
    programIssuesParametersList,
    modifyProgramIssuesParameters
} from "@/api/productOrdes";

import Diagram from "@/views/permission/user/Diagram";

import moment from "moment";
import {
    getDictionaryType,
    getDictionaryDataList
} from "@/api/systemData/dictionary";
export default {
    name: "permission-position",
    components: { Diagram },
    data() {
        return {
            treeData: [],
            tableData: [],
            treeLoading: false,
            listLoading: false,
            authorizeFormVisible: false,
            userRelationListVisible: false,
            organizeIdTree: [],
            dialogVisible: false,
            listQuery: {
                name: "", // 设备名称
                code: "",
                orderItems: [
                    {
                        asc: false,
                        column: ""
                    },
                    {
                        asc: false,
                        column: "create_time"
                    }
                ],
                pageNum: 1,
                pageSize: 20,
                classAttribute: "equipment"
            },
            form: {
                productCategoryId: "",
                state: ""
            },
            dataForm: {
                classAttribute: "equipment",
                productCategoryId: "",
                id: "",
                gatewayIp: "",
                gatewaySerialNo: ""
            },
            typeList: [],
            equipmentStateList: [
                {
                    value: "normal",
                    label: "正常"
                },
                {
                    value: "repair",
                    label: "维修"
                },
                {
                    value: "discard",
                    label: "报废"
                }
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            gradeList: [],
            defaultProps: {
                children: "childrenList",
                label: "name"
            },

            total: 0,
            diagramVisible: false,
            formVisible: false,
            expands: true,
            refreshTree: true,
            filterText: ""
        };
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val);
        }
    },
    created() {
        this.getCategoryTrees(true);
        this.getDictionaryType();
        // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    methods: {
        edit(item) {
            this.dataForm = item;
            this.dialogVisible = true;
        },
        save() {
            modifyProgramIssuesParameters(this.dataForm).then(res => {
                this.$message({
                    type: "success",
                    message: "设置参数成功",
                    duration: 1500
                });
                this.dialogVisible = false;
            });
        },
        // 获取数据字典——等级
        getDictionaryType() {
            getDictionaryType().then(res => {
                console.log("rescc", res);
                let data = res.data.list;
                data.forEach(item => {
                    if (item.enCode == "partnerArchives") {
                        let children = item.children;
                        children.forEach(resp => {
                            if (resp.enCode == "grade") {
                                let id = resp.id;
                                let obj = {
                                    keyword: "",
                                    isTree: 0
                                };
                                getDictionaryDataList(id, obj).then(
                                    response => {
                                        console.log("response", response);
                                        this.gradeList = response.data.list;
                                    }
                                );
                            }
                        });
                    }
                });
            });
        },
        sortChange({ prop, order }) {
            let newProp = prop.replace(
                /[A-Z]/g,
                match => "_" + match.toLowerCase()
            );
            if (newProp === "create_name") {
                newProp = "create_by";
            }
            this.listQuery.orderItems[0].asc = order === "ascending";
            this.listQuery.orderItems[0].column = order === null ? "" : newProp;
            this.initData();
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.formVisible = false;
            if (isRefresh) {
                this.keyword = "";
                this.initData();
            }
        },
        showDiagram() {
            this.diagramVisible = true;
            this.$nextTick(() => {
                this.$refs.Diagram.init();
            });
        },
        toggleExpand(expands) {
            this.refreshTree = false;
            this.expands = expands;
            this.$nextTick(() => {
                this.refreshTree = true;
                this.$nextTick(() => {
                    this.$refs.treeBox.setCurrentKey(this.companyId);
                });
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        getCategoryTrees(isInit) {
            this.treeLoading = true;
            let listQuery = {
                page: 1,
                limit: 999,
                keyword: "",
                classAttribute: "equipment"
            };
            getCategoryTrees(listQuery)
                .then(res => {
                    console.log(99, res);
                    this.treeData = res.data;
                    this.getTypeList(res.data);
                    this.$nextTick(() => {
                        this.treeLoading = false;
                        if (isInit) this.initData();
                    });
                })
                .catch(() => {
                    this.treeLoading = false;
                });
        },
        // 获取设备类型
        getTypeList(data) {
            let arr = [];
            let fn = data => {
                data.forEach(item => {
                    arr.push(item);
                    if (item.childrenList && item.childrenList.length) {
                        fn(item.childrenList);
                    }
                });
            };
            fn(data);
            this.typeList = arr;
        },
        initData() {
            this.listLoading = true;
            this.listQuery = {
                ...this.listQuery,
                ...this.form
            };
            programIssuesParametersList(this.listQuery)
                .then(res => {
                    console.log("res++", res);
                    this.tableData = res.data.records;
                    // this.tableData.forEach(item=>{
                    //   if (item.state === 'normal'){
                    //     item.state = '正常'
                    //   }
                    //   if (item.state === 'repair'){
                    //     item.state = '维修'
                    //   }
                    //   if (item.state === 'maintain'){
                    //     item.state = '保养'
                    //   }
                    //   if (item.state === 'discard'){
                    //     item.state = '报废'
                    //   }
                    // })
                    this.total = res.data.total;
                    this.listLoading = false;
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
        search() {
            Object.keys(this.listQuery).forEach(key => {
                let item = this.listQuery[key];
                this.listQuery[key] =
                    typeof item === "string" ? item.trim() : item;
            });
            this.listQuery.pageNum = 1;
            this.initData();
        },
        reset() {
            this.$refs["dataTable"].$refs.JNPFTable.clearSort();
            this.listQuery = {
                orderItems: [
                    {
                        asc: false,
                        column: ""
                    },
                    {
                        asc: false,
                        column: "create_time"
                    }
                ],
                pageNum: 1,
                pageSize: 20,
                classAttribute: "equipment"
            };
            this.form = {
                state: "",
                productCategoryId: ""
            };

            this.getCategoryTrees(true);
            this.search();
        },
        handleNodeClick(data, node) {
            console.log("请选择节点", node);
            if (this.form.productCategoryId === data.id) return;
            this.form.productCategoryId = data.id;
            const nodePath = this.getNodePath(node);
            this.organizeIdTree = nodePath.map(o => o.id);
            this.search();
        },
        getNodePath(node) {
            let fullPath = [];
            const loop = node => {
                if (node.level) fullPath.unshift(node.data);
                if (node.parent) loop(node.parent);
            };
            loop(node);
            return fullPath;
        },

        addOrUpdateHandle(id, type, types) {
            this.formVisible = true;
            this.$nextTick(() => {
                this.$refs.Form.init(id, type, types);
            });
        },

        removeUserRelationList(isRefresh) {
            this.userRelationListVisible = false;
            if (isRefresh) {
                this.keyword = "";
                this.initData();
            }
        },
        removeAuthorizeForm(isRefresh) {
            this.authorizeFormVisible = false;
            if (isRefresh) {
                this.keyword = "";
                this.initData();
            }
        },
        handleDel(id) {
            this.$confirm(
                this.$t("common.delTip"),
                this.$t("common.tipTitle"),
                {
                    type: "warning"
                }
            )
                .then(() => {
                    deleteEquEquipment(id).then(res => {
                        this.initData();
                        this.$message({
                            type: "success",
                            message: "删除成功",
                            duration: 1500
                        });
                    });
                })
                .catch(() => { });
        }
    }
};
</script>

<style scoped>
.JNPF-common-layout-left {
    margin-right: 0;
    border-right: 6px solid #EBEEF5;
    width:180px;
}

::v-deep .el-tabs__content {
    height: calc(100vh - 163px);
}

::v-deep .el-tabs__header {
    margin-bottom: 5px;
    padding: 0 10px;
}

.JNPF-common-search-box {
    padding: 8px 0 0 0;
    margin-left: 0 !important;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 8px !important;
}

.pagination-container {
    background-color: #f5f7fa;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding: 0;
}

::v-deep.el-tree-node__content {
    height: 30px;
    line-height: 30px;
}

.JNPF-common-el-tree {
    margin: 5px 0;
}
</style>
