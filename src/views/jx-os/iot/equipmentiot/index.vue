<template>
    <div class="app-container  systemConfig" style="width: 100%;">
                <div class="JNPF-common-layout">
                    <div class="JNPF-common-layout-left">
                        <div class="JNPF-common-title">
                            <h2>生产车间</h2>
                        </div>
                        <el-tree :data="treeData" :props="treeProps" default-expand-all highlight-current ref="treeBox"
                                 :expand-on-click-node="false" @node-click="handleNodeClick" class="JNPF-common-el-tree"
                                 node-key="id"
                        >
                         <span class="custom-tree-node" slot-scope="{ node, data }">
                             <i :class="data.icon"></i>
                             <span class="text">{{ node.label }}</span>
                         </span>
                        </el-tree>
                    </div>

                    <div class="JNPF-common-layout-center">
                        <el-row class="JNPF-common-search-box" :gutter="16">
                            <el-form @submit.native.prevent>

                                <el-col :span="6">
                                    <el-form-item label="是否联网">
<!--                                        <JNPFTreeSelect v-model="query.isIot" placeholder="请选择"
                                                        :options="isIotOptions" :props="isIotProps"
                                        />-->
                                        <el-select v-model="query.isIot" placeholder="请选择" clearable>
                                            <el-option
                                                v-for="item in isIotOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="设备名称">
                                        <el-input v-model="query.name" placeholder="请输入" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="盒子ID">
                                        <el-input v-model="query.uuid" placeholder="请输入" clearable></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6">
                                    <el-form-item>
                                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                                        <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>

                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-row>
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <div class="JNPF-common-head">
                                <div>
                                    <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
                                    </el-button>
                                    <el-button type="text" icon="el-icon-download" @click="exportData()">导出
                                    </el-button>
                                </div>
                                <div class="JNPF-common-head-right">
                                    <el-tooltip content="高级查询" placement="top" v-if="true">
                                        <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                                 @click="openSuperQuery()"
                                        />
                                    </el-tooltip>
                                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                                        <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                                 @click="initData()"
                                        />
                                    </el-tooltip>
                                </div>
                            </div>

                            <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange"
                                        :span-method="arraySpanMethod"
                            >
                                <el-table-column prop="name_name" label="设备名称" align="left" min-width="100"/>
                                <el-table-column prop="code_name" label="设备编号" align="left" min-width="100"/>
                                <el-table-column prop="mrpWorkshopId_name" label="生产车间" align="left" min-width="100"/> <!-- -->

                                <el-table-column v-show="query.isIot || query.isIot == undefined" prop="uuid_name" label="盒子ID" align="left" min-width="100"/>
                                <el-table-column v-show="query.isIot || query.isIot == undefined" prop="theoryBeat_name" label="理论节拍" align="left" width="90"/>
                                <el-table-column prop="theoryBeat_name" label="是否联网" align="left" width="90">
                                    <template slot-scope="{row}">
                                        <el-switch
                                            v-model="row.isIot"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            @change="stateChanged(row)"
                                        >
                                        </el-switch>
<!--                                        <el-tag v-if="row.uuid != null && row.uuid != ''" type=""> 已联网</el-tag>
                                        <el-tag v-else type="info"> 未联网</el-tag>-->
                                    </template>
                                </el-table-column>
                                <el-table-column v-show="query.isIot || query.isIot == undefined" prop="theoryBeat_name" label="状态" align="left" width="90">
                                    <template slot-scope="{row}" v-if="row.uuid != null && row.uuid!= undefined && row.uuid != ''">
                                        <el-tag v-if="row.result.online" type=""> 在线</el-tag>
                                        <el-tag v-else type="info"> 离线</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="effectiveDate_name" label="生效日期" align="left" min-width="110"/>
                                <el-table-column label="操作" fixed="right" width="100">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                                        </el-button>
                                        <el-button type="text" class="JNPF-table-delBtn"
                                                   @click="handleDel(scope.row.id)"
                                        >删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </JNPF-table>
                            <pagination :total="total" :page.sync="listQuery.currentPage"
                                        :limit.sync="listQuery.pageSize"
                                        @pagination="initData"
                            />
                        </div>
                    </div>
                </div>





            <!--            <el-tab-pane label="未联网设备" name="isFalse">
                <div class="JNPF-common-layout">
                    <div class="JNPF-common-layout-left">
                        <div class="JNPF-common-title">
                            <h2>生产车间</h2>
                        </div>
                        <el-tree :data="treeData" :props="treeProps" default-expand-all highlight-current ref="treeBox"
                                 :expand-on-click-node="false" @node-click="handleNodeClick" class="JNPF-common-el-tree"
                                 node-key="id"
                        >
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                              <i :class="data.icon"></i>
                              <span class="text">{{ node.label }}</span>
                          </span>
                        </el-tree>
                    </div>
                    <div class="JNPF-common-layout-center">
                        <el-row class="JNPF-common-search-box" :gutter="16">
                            <el-form @submit.native.prevent>

                                <el-col :span="6">
                                    <el-form-item label="生产车间">
                                        <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                                        :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps"
                                                        clearable
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="设备名称">
                                        <el-input v-model="query.name" placeholder="请输入" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="盒子ID">
                                        <el-input v-model="query.uuid" placeholder="请输入" clearable></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6">
                                    <el-form-item>
                                        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                                        <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>

                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-row>
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <div class="JNPF-common-head">
                                <div>
                                    <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
                                    </el-button>
                                    <el-button type="text" icon="el-icon-download" @click="exportData()">导出
                                    </el-button>
                                    <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
                                </div>
                                <div class="JNPF-common-head-right">
                                    <el-tooltip content="高级查询" placement="top" v-if="true">
                                        <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                                 @click="openSuperQuery()"
                                        />
                                    </el-tooltip>
                                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                                        <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                                 @click="initData()"
                                        />
                                    </el-tooltip>
                                </div>
                            </div>

                            <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange"
                                        :span-method="arraySpanMethod"
                            >
                                <el-table-column prop="name_name" label="设备名称" align="left" min-width="100"/>
                                <el-table-column prop="code_name" label="设备编号" align="left" min-width="100"/>
                                <el-table-column prop="mrpWorkshopId_name" label="生产车间" align="left" min-width="100"/>
                                &lt;!&ndash; <el-table-column prop="uuid_name" label="盒子ID" align="left" /> &ndash;&gt;
                                <el-table-column prop="theoryBeat_name" label="理论节拍" align="left"/>
                                <el-table-column prop="effectiveDate_name" label="生效日期" align="left" min-width="110"/>
                                <el-table-column label="操作" fixed="right" width="150">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                                        </el-button>
                                        <el-button type="text" @click="doIot(scope.row.id)">联网
                                        </el-button>
                                        <el-button type="text" class="JNPF-table-delBtn"
                                                   @click="handleDel(scope.row.id)"
                                        >删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </JNPF-table>
                            <pagination :total="total" :page.sync="listQuery.currentPage"
                                        :limit.sync="listQuery.pageSize"
                                        @pagination="initData"
                            />
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        -->


        <Iot v-if="iotVisible" ref="IotForm" @refresh="refresh"/>
        <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
        <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
        <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()"/>
        <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false"/>
        <SuperQuery v-if="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuery"
        />

    </div>


</template>

<script>
import request from '@/utils/request'
import JNPFForm from './Form'
import Iot from './Iot'
import ExportBox from './ExportBox'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import Detail from './Detail'
import columnList from './columnList'
import SuperQuery from '@/components/SuperQuery'
import superQueryJson from './superQueryJson'
import ImportForm from './ImportForm'

export default {
    components: {
        JNPFForm,
        ExportBox,
        Detail,
        SuperQuery,
        Iot,
        ImportForm
    },
    data() {
        return {
            expandObj: {},
            columnOptions: [],
            mergeList: [],
            columnList,

            showAll: false,
            superQueryVisible: false,
            superQueryJson,
            detailVisible: false,
            query: {
                isIot:undefined,
                mrpWorkshopIds: [],
                mrpWorkshopId: undefined,
                name: undefined,
                uuid: undefined,
                typeS: undefined,
                active: 1
            },
            treeProps: {
                children: 'children',
                label: 'name',
                value: 'id'
            },
            list: [],
            listLoading: true,
            total: 0,
            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: 'effectiveDate'
            },
            formVisible: false,
            iotVisible: false,
            exportBoxVisible: false,
            treeData: [],
            treeActiveId: '',
            mrpWorkshopIdOptions: [],
            mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },
            isIotOptions:[
                {
                    label:'已联网',
                    value:true
                },{
                    label:'未联网',
                    value:false
                }
            ],
            isIotProps: {
                'label': 'label',
                'value': 'value',
            },

            activeName: 'isTrue',



            importFormVisible: false

        }
    },
    computed: {
        menuId() {
            return this.$route.meta.modelId || ''
        }
    },
    created() {
        this.getColumnList(),
            this.getTreeView()
        this.getmrpWorkshopIdOptions()
    },
    methods: {

        stateChanged(row){
            console.log(row.isIot)
        },


        getColumnList() {
            // 没有开启权限
            this.columnOptions = this.transformColumnList(this.columnList)
        },
        transformColumnList(columnList) {
            let list = []
            for (let i = 0; i < columnList.length; i++) {
                const e = columnList[i]
                if (!e.prop.includes('-')) {
                    list.push(e)
                } else {
                    let prop = e.prop.split('-')[0]
                    let label = e.label.split('-')[0]
                    let vModel = e.prop.split('-')[1]
                    let newItem = {
                        align: 'center',
                        jnpfKey: 'table',
                        prop,
                        label,
                        children: []
                    }
                    e.vModel = vModel
                    if (!this.expandObj.hasOwnProperty(`${prop}Expand`)) {
                        this.$set(this.expandObj, `${prop}Expand`,
                            false)
                    }
                    if (!list.some(o => o.prop === prop)) list.push(newItem)
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].prop === prop) {
                            list[i].children.push(e)
                            break
                        }
                    }
                }
            }
            this.getMergeList(list)
            return list
        },
        arraySpanMethod({
            column
        }) {
            for (let i = 0; i < this.mergeList.length; i++) {
                if (column.property == this.mergeList[i].prop) {
                    return [this.mergeList[i].rowspan, this.mergeList[i].colspan]
                }
            }
        },
        getMergeList(list) {
            let newList = JSON.parse(JSON.stringify(list))
            newList.forEach(item => {
                if (item.children && item.children.length) {
                    let child = {
                        prop: item.prop + '-child-first'
                    }
                    item.children.unshift(child)
                }
            })
            newList.forEach(item => {
                if (item.children && item.children.length) {
                    item.children.forEach((child, index) => {
                        if (index == 0) {
                            this.mergeList.push({
                                prop: child.prop,
                                rowspan: 1,
                                colspan: item.children.length
                            })
                        } else {
                            this.mergeList.push({
                                prop: child.prop,
                                rowspan: 0,
                                colspan: 0
                            })
                        }
                    })
                } else {
                    this.mergeList.push({
                        prop: item.prop,
                        rowspan: 1,
                        colspan: 1
                    })
                }
            })
        },
        getmrpWorkshopIdOptions() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data
                this.mrpWorkshopIdOptions = data
                // console.log(this.mrpWorkshopIdOptions);
            })
        },
        goDetail(id) {
            this.detailVisible = true
            this.$nextTick(() => {
                this.$refs.Detail.init(id)
            })
        },
        sortChange({
            column,
            prop,
            order
        }) {
            this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
            this.listQuery.sidx = !order ? '' : prop
            this.initData()
        },
        getTreeView() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data
                this.treeData = data
                this.initData()
            })
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
        handleNodeClick(data, node) {
            this.treeActiveId = data.id
            for (let
                key in this.query) {
                this.query[key] = undefined
            }
            this.query.mrpWorkshopId = data.id

            this.selectmrpWorkshopId(data.id)
        },
        //查询车间下级所有车间ID
        selectmrpWorkshopId(id) {
            //查子ID数组
            let _query = {
                paramList: [{
                    field: 'ID',
                    fieldName: '',
                    dataType: 'varchar',
                    required: 0,
                    defaultValue: id
                }],
                tenantId: '',
                origin: 'preview'
            }

            this.listQuery = {
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: 'effectiveDate'
            }
            getDataInterfaceRes('365461198570824901', _query).then(res => {
                let data = res.data
                let _list = []
                for (let i = 0; i < res.data.length; i++) {
                    let _data = res.data[i]
                    _list.push(_data.F_Id)
                }
                this.query.mrpWorkshopIds = _list

                this.initData()
            })

        },

        initData() {
            this.listLoading = true
            let _query = {
                ...this.listQuery,
                ...this.query,
                keyword: this.keyword,
                dataType: 0,
                menuId: this.menuId
            }
            //TODO
            console.log(_query)
            request({ url: `/api/jx/EquipmentIot/getList`, method: 'post', data: _query }).then(res => {
                var _list = []
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i]

                    if(_data.uuid != null && _data.uuid != ''){
                        _data.isIot = true
                    }else{
                        _data.isIot = false
                    }


                    _list.push(_data)
                }
                this.list = _list.map(o => ({
                    ...o,
                    ...this.expandObj
                }))

                console.log(this.list)

                this.total = res.data.pagination.total
                this.listLoading = false
            })
        },
        handleDel(id) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                request({
                    url: `/api/jx/EquipmentIot/${id}`,
                    method: 'DELETE'
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        onClose: () => {
                            this.initData()
                        }
                    })
                })
            }).catch(() => {
            })
        },
        openSuperQuery() {
            this.superQueryVisible = true
            this.$nextTick(() => {
                this.$refs.SuperQuery.init()
            })
        },
        superQuery(queryJson) {
            this.listQuery.superQueryJson = queryJson
            this.listQuery.currentPage = 1
            this.initData()
        },
        addOrUpdateHandle(id, isDetail) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.JNPFForm.init(id, isDetail)
            })
        },
        //联网
        doIot(id) {
            this.iotVisible = true
            this.$nextTick(() => {
                this.$refs.IotForm.init(id)
            })
        },

        //导出按钮点击事件
        exportData() {
            this.exportBoxVisible = true
            this.$nextTick(() => {
                this.$refs.ExportBox.init(this.columnList)
            })
        },
        download(data) {
            let query = {
                ...data,
                ...this.listQuery,
                ...this.query,
                menuId: this.menuId
            }
            request({
                url: `/api/jx/EquipmentIot/Actions/Export`,
                method: 'post',
                data: query
            }).then(res => {
                if (!res.data.url) return
                this.jnpf.downloadFile(res.data.url)
                this.$refs.ExportBox.visible = false
                this.exportBoxVisible = false
            })
        },

        //导入按钮点击事件
        uploadForm() {
            this.importFormVisible = true
            this.$nextTick(() => {
                this.$refs.importForm.init()
            })
        },

        search() {
            console.log(this.query.mrpWorkshopId)
            if (this.query.mrpWorkshopId != undefined && this.query.mrpWorkshopId != '') {
                this.selectmrpWorkshopId(this.query.mrpWorkshopId)
            } else {
                this.listQuery.currentPage = 1
                this.listQuery.pageSize = 20
                this.listQuery.sort = 'desc'
                this.listQuery.sidx = 'effectiveDate'
                this.initData()
            }
        },
        refresh(isrRefresh) {
            this.formVisible = false
            if (isrRefresh) this.reset()
        },
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.query.isIot = true
            this.query.active = 1
            this.search()
        }
    }
}
</script>
