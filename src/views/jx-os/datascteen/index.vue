<template>

    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
                        </el-button>
                    </div>
                    <div class="JNPF-common-head-right">
                        <!-- <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                @click="openSuperQuery()" />
                        </el-tooltip> -->
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <div style='display:flex;flex-wrap:wrap;overflow-y: scroll;'>

                        <el-card v-for="(item,i) in list" :key="i" :body-style="{ padding: '0px' }" style="margin: 0 10px 20px 10px;">
                             <a :href = "JSON.stringify(item.url).indexOf('http')>-1 ? (item.url) : ('http://10.10.67.113:40010/?sys='+sys+'&v='+item.url)"  target="_blank">
                              <!-- <a @click="toUrl(item.url)"> -->
                              <img :src="item.pic" class="image" style="width:322px ;height:181px;display: block;">
                              </a>
                              <div style="padding: 14px;display:flex;justify-content: space-between">
                                  <span>{{item.name_name}}</span>

                                  <div>
                                      <el-link icon="el-icon-edit" :underline="false" @click="addOrUpdateHandle(item.id)"></el-link>
                                      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                      <el-link icon="el-icon-delete" :underline="false" @click="handleDel(item.id)"></el-link>
                                  </div>
                              </div>

                         </el-card>

                </div>

                <!-- <template slot-scope="scope">
                    <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                    </el-button>
                    <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                    </el-button>
                    <el-button type="text" @click="goDetail(scope.row.id)">详情
                    </el-button>
                </template> -->
            </div>
        </div>
        <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    </div>
</template>

<script>
    import request from '@/utils/request'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'
    import JNPFForm from './Form'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'
    import columnList from './columnList'

    export default {
        components: {
            JNPFForm
        },
        data() {
            return {
                sys:localStorage.getItem('sys'),
                expandObj: {},
                columnOptions: [],
                mergeList: [],
                columnList,

                superQueryVisible: false,
                detailVisible: false,
                query: {},
                treeProps: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                list: [],
                listLoading: true,
                total: 0,
                listQuery: {
                    currentPage: 1,
                    pageSize: 4,
                    sort: "desc",
                    sidx: "",
                },
                formVisible: false,
                exportBoxVisible: false,
                treeData: [],
                treeActiveId: '',
                datascreenCategoryIdOptions: [],
                datascreenCategoryIdProps: {
                    "label": "name",
                    "value": "F_Id",
                    "children": "children"
                },
            }
        },
        computed: {
            menuId() {
                return this.$route.meta.modelId || ''
            }
        },
        created() {
            // this.getColumnList(),
                // this.getTreeView();
                this.initData()
        },
        methods: {
            // toUrl(u){
            //     console.log(u,1111111111)
            //     window.open('http://localhost:3000/jx-os/datascteen/index',null,'width='+(window.screen.availWidth)+',height='+(window.screen.availHeight)+ ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no，fullscreen=yes')

            //     // <!-- <a :href = "JSON.stringify(item.url).indexOf('http')>-1 ? (item.url) : ('http://dv.zhouguantong.com/?sys='+sys+'&uname=admin&pass=jx123..&v='+item.url)"  target="_blank"> -->
            //     //  <a @click="window.open('https://www.processon.com/diagrams','big','fullscreen=yes')">
            //     if(JSON.stringify(u).indexOf('http')>-1){

            //     }else{
            //         u =
            //     }
            // },
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
                this.query.datascreenCategoryId = data.id
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 8,
                    sort: "desc",
                    sidx: "",
                }
                this.initData()
            },
            initData() {
                this.listLoading = true;
                let _query = {
                    ...this.listQuery,
                    ...this.query,
                    keyword: this.keyword,
                    dataType: 1,
                    menuId: this.menuId
                };
                request({
                    url: `/api/base_datascteen/Base_datascteen/getList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    var _list = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i];
                        _list.push(_data)
                    }
                    this.list = _list.map(o => ({
                        ...o,
                        ...this.expandObj
                    }))
                    this.total = res.data.pagination.total
                    this.listLoading = false
                })
            },
            handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/base_datascteen/Base_datascteen/${id}`,
                        method: 'DELETE'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => {});
            },
            openSuperQuery() {
                this.superQueryVisible = true
                this.$nextTick(() => {
                    this.$refs.SuperQuery.init()
                })
            },
            superQuery(queryJson) {
                this.listQuery.currentPage = 1
                this.initData()
            },
            addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.JNPFForm.init(id, isDetail)
                    // console.log(22);
                    // console.log(this.$refs);
                    // console.log(this.$refs.JNPFForm.$refs.jjjj.value);
                })
            },
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
                    url: `/api/base_datascteen/Base_datascteen/Actions/Export`,
                    method: 'post',
                    data: query
                }).then(res => {
                    if (!res.data.url) return
                    this.jnpf.downloadFile(res.data.url)
                    this.$refs.ExportBox.visible = false
                    this.exportBoxVisible = false
                })
            },
            search() {
                this.listQuery.currentPage = 1
                this.listQuery.pageSize = 20
                this.listQuery.sort = "desc"
                this.listQuery.sidx = ""
                this.initData()
            },
            refresh(isrRefresh) {
                this.formVisible = false
                if (isrRefresh) this.reset()
            },
            reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.search()
            }
        }
    }
</script>
<style>

</style>
