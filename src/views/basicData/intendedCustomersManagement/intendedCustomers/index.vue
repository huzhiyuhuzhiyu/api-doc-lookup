<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
                <h2>意向客户分类</h2>
                <span class="options">
                    <el-dropdown>
                        <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                            <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                            <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </div>

            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
                <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                    highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                    class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                    <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                        <i
                            :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                        <span class="text" :title="data.name">{{ data.name }}</span>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center">
            <!-- 查询表单 -->
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="listQuery.name" placeholder="请输入意向客户名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="listQuery.taxId" placeholder="请输入税号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="listQuery.mobilePhone" placeholder="请输入手机号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <el-button :loading="btnLoading" style="float: right;margin-right: 20px;" size="mini" type="primary"
                        icon="el-icon-search" @click="moreQueries()">更多查询</el-button>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <topOpts @add="addSupplier('','','add')" />
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table ref="dataTable" v-loading="listLoading" :data="list" @sort-change='sortChange' highlight-current-row
                    :fixedNO="true" custom-column>
                    <el-table-column prop="name" label="意向客户名称" min-width="160" fixed="left" sortable="custom" />
                    <el-table-column prop="taxId" label="税号" width="200" />
                    <el-table-column prop="nameEn" label="英文名称" width="200" />
                    <el-table-column prop="regionCodeText" label="地区" width="100" />
                    <el-table-column prop="countryText" label="国家" min-width="150" />
                    <el-table-column prop="provinceText" label="省" width="160" />
                    <el-table-column prop="cityText" label="市" width="160" />
                    <el-table-column prop="areaText" label="区" width="160" />
                    <el-table-column prop="address" label="地址" width="160" />
                    <el-table-column prop="contacts" label="联系人" width="160" />
                    <el-table-column prop="phone" label="电话" width="160" />
                    <el-table-column prop="mobilePhone" label="手机号" width="160" />
                    <el-table-column prop="zipCode" label="邮政编码" width="160" />
                    <el-table-column prop="email" label="邮箱" width="160" />
                    <el-table-column prop="channelText" label="渠道类型" width="160" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id,scope.row.partnerCategoryId,'edit')" @del="handleDel(scope.row.id)">
                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id,scope.row.partnerCategoryId,  'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
        <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
            lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
            <el-row :gutter="20">

                <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

                    <el-col :span="12">
                        <el-form-item label="意向客户名称">
                            <el-input v-model="listQuery.name" placeholder="请输入意向客户名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文名称">
                            <el-input v-model="listQuery.nameEn" placeholder="请输入英文名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="税号">
                            <el-input v-model="listQuery.taxId" placeholder="请输入税号" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="地区">
                            <el-select v-model="listQuery.regionCode" placeholder="请选择地区" clearable style="width: 100%;"
                                @change="handleChange">
                                <el-option v-for="(item, index) in areaList" :key="index" :label="item.fullName"
                                    :value="item.enCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="国家">
                            <el-select v-model="listQuery.country" placeholder="请选择国家" clearable style="width: 100%;"
                                v-if="listQuery.regionCode == 'foreign'" filterable>
                                <el-option v-for="(item, index) in countryList" :disabled="item.code == 'CN'" :key="index"
                                    :label="item.name" :value="item.code"></el-option>
                            </el-select>
                            <el-select v-model="listQuery.country" placeholder="请选择国家" clearable style="width: 100%;"
                                v-else>
                                <el-option v-for="(item, index) in countryList" :key="index" :label="item.name"
                                    :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="listQuery.regionCode != 'foreign'">
                        <el-form-item label="省">
                            <el-select v-model="listQuery.province" placeholder="请选择省" style="width: 100%;">
                                <el-option v-for="item in provinces" size="small" :key="item.id" :label="item.fullName"
                                    :value="item.id" @click.native="changeProvince(item)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="listQuery.regionCode != 'foreign'">
                        <el-form-item label="市">
                            <el-select v-model="listQuery.city" placeholder="请选择市" style="width: 100%;">
                                <el-option v-for="item in cities" size="small" :key="item.id" :label="item.fullName"
                                    :value="item.id" @click.native="changeCity(item)">{{ item.fullName }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="listQuery.regionCode != 'foreign'">
                        <el-form-item label="区">
                            <el-select v-model="listQuery.area" placeholder="请选择区" style="width: 100%;">
                                <el-option v-for="item in area" size="small" :key="item.id" :label="item.fullName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="联系人">
                            <el-input v-model="listQuery.contacts" placeholder="请输入联系人" clearable />
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="手机号">
                            <el-input v-model="listQuery.mobilePhone" placeholder="请输入手机号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱">
                            <el-input v-model="listQuery.email" placeholder="请输入邮箱" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="渠道类型">
                            <el-select v-model="listQuery.channel" placeholder="请选择渠道类型" clearable>
                                <el-option v-for="(item, index) in channelList" :key="index" :label="item.fullName"
                                    :value="item.enCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>


                </el-form>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit()">
                    搜索</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import request from '@/utils/request'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import {
    getProvinceList,
} from '@/api/system/province'
import { getCounryData, getPrivateList, deletePrivate, getcategoryTree } from '@/api/basicData/index'
import Form from './Form'

export default {
    components: { Form },
    data() {
        return {
            title: "更多查询",
            channelList: [],
            areaList: [],
            provinces: [],
            cities: [],
            area: [],
            list: [],
            countryList: [],
            listLoading: true,
            btnLoading: false,
            visible: false,
            total: 0,
            nodeId: -1,
            listQuery: {
                pageNum: 1,
                pageSize: 20,

                "address": "",
                "area": "",
                "channel": "",
                "city": "",
                "contacts": "",
                "country": "",
                "email": "",
                "keyword": "",
                "mobilePhone": "",
                "name": "",
                "nameEn": "",
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                "province": "",
                "regionCode": "",
                "taxId": "",
                partnerCategoryId: ""
            },
            formVisible: false,
            treeData: [],
            expands: true,
            refreshTree: true,
            defaultProps: {
                children: 'childrenList',
                label: 'name'
            },
        }
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val)
        }
    },
    computed: {
        menuId() {
            return this.$route.meta.modelId || ''
        }
    },
    created() {
        this.getcategoryTree(true)
        this.getProvinceList()
        this.getDictionaryType()
    },
    methods: {
        handleNodeClick(data, node) {
            console.log("选择节点", node);
            if (this.listQuery.partnerCategoryId === data.id) return
            this.listQuery.partnerCategoryId = data.id
            const nodePath = this.getNodePath(node)
            this.organizeIdTree = nodePath.map(o => o.id)
            this.search()
        },
        getNodePath(node) {
            let fullPath = []
            const loop = (node) => {
                if (node.level) fullPath.unshift(node.data)
                if (node.parent) loop(node.parent)
            }
            loop(node)
            return fullPath
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        toggleExpand(expands) {
            this.refreshTree = false
            this.expands = expands
            this.$nextTick(() => {
                this.refreshTree = true
                this.$nextTick(() => {
                    this.$refs.treeBox.setCurrentKey(this.companyId)
                })
            })
        },
        // 根据选择的省份获取相应的城市数据
        changeProvince(item) {
            this.listQuery.city = ""
            this.listQuery.area = ""

            console.log("item", item);
            getProvinceList(item.id).then(res => {
                console.log(res);
                this.cities = res.data.list
            })
        },
        // 根据选择的城市获取各区的数据
        changeCity(item) {
            console.log("item", item);
            this.listQuery.area = ""
            getProvinceList(item.id).then(res => {
                console.log(res);
                this.area = res.data.list
            })
        },
        // 获取省份数据
        getProvinceList() {
            getProvinceList(this.nodeId,).then(res => {
                console.log("省份数据", res);
                this.provinces = res.data.list
            }).catch(() => {
                this.listLoading = false
                this.refreshTable = true
            })
        },
        // 选择国内或者国外
        handleChange($event) {
            if ($event == 'domestic') {
                // 国内
                this.countryList = [{
                    code: "CN",
                    id: "1663107232693223475",
                    name: "中国",
                    nameEn: "China",
                }]
                this.listQuery.country = "CN"
            } else {
                this.listQuery.country = ''

                this.countryList = []
                let obj = {
                    "keyword": "",
                    "orderItems": [
                        {
                            "asc": true,
                            "column": ""
                        }
                    ],
                    "pageNum": 1,
                    "pageSize": -1
                }
                getCounryData(obj).then(res => {
                    this.countryList = res.data.records

                })
            }
        },
        // 获取地区、渠道类型
        getDictionaryType() {
            getDictionaryType().then(res => {
                let data = res.data.list
                data.forEach(item => {
                    if (item.enCode == "partnerArchives") {
                        let children = item.children
                        children.forEach(resp => {

                            if (resp.enCode == "regionCode") {
                                let id = resp.id;
                                let obj = {
                                    keyword: '',
                                    isTree: 0
                                }
                                getDictionaryDataList(id, obj).then(response => {
                                    console.log("地区", response);
                                    this.areaList = response.data.list
                                })
                            }
                            if (resp.enCode == "channel") {
                                let id = resp.id;
                                let obj = {
                                    keyword: '',
                                    isTree: 0
                                }
                                getDictionaryDataList(id, obj).then(response => {
                                    this.channelList = response.data.list
                                })
                            }
                        });

                    }

                });
            })
        },
        moreQueries() {
            this.visible = true
        },
        addSupplier(id,parentId,type) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(id,parentId,type)
            })
        },
        dataFormSubmit() {
            this.listQuery.pageNum = 1
            this.btnLoading = true
            this.initData()

        },
        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.listQuery.orderItems[0].asc = order === "ascending"
            this.listQuery.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        getcategoryTree(isInit) {
            this.treeLoading = true
            let listQuery = {
                keyword: '',
                type: "public_private_sea"
            };
            getcategoryTree(listQuery).then(res => {
                console.log(99, res);
                this.treeData = res.data
                this.$nextTick(() => {
                    this.treeLoading = false
                    if (isInit) this.initData()
                })
            }).catch(() => {
                this.treeLoading = false
            })
        },
        initData() {
            this.listLoading = true;
            getPrivateList(this.listQuery).then(res => {
                console.log(123321, res);
                this.list = res.data.records
                this.total = res.data.total
                this.listLoading = false
                this.visible = false
                this.btnLoading = false
            }).catch(error => {
                this.listLoading = false
                this.btnLoading = false
            })
        },
        handleDel(id) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                deletePrivate(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })

            }).catch(() => {
            });
        },
        addOrUpdateHandle(id,parentId,type) {
            console.log("121342134", id,);
            this.formVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.Form.init(id,parentId,type)
                })
                // }, 600);
            }


        },
        handleUserRelation(id,parentId, btnType) {
            console.log(btnType);
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.Form.init(id,parentId, btnType)
            })
        },
        // 关闭新建、编辑页面 
        closeForm(isRefresh) {
            this.formVisible = false
            if (isRefresh) {
                this.keyword = ''
                this.initData()
            }
        },
        search() {
            this.listQuery.pageNum = 1
            this.listQuery.pageSize = 20
            this.initData()
        },
        reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.listQuery = {
                pageNum: 1,
                pageSize: 20,

                "address": "",
                "area": "",
                "channel": "",
                "city": "",
                "contacts": "",
                "country": "",
                "email": "",
                "mobilePhone": "",
                "name": "",
                "nameEn": "",
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                "province": "",
                "regionCode": "",
                "taxId": "",
                partnerCategoryId:""
            },
                this.getcategoryTree(true)
        },
    }
}
</script>
<style scoped>
.JNPF-common-layout-left {
    margin-right: 0;
    border-right: 1px solid #cacaca;
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

.el-tabs__nav-scroll {
    padding-left: 0;
}
</style>