<script>
import {getcategoryTrees} from "@/api/salesManagement/assemblyOrders";
import {getProducts} from "@/api/masterDataManagement";
import {getcategoryTree as productTree} from "@/api/basicData/materialSettings";
export default {
    name: "ChooseProductDialog",
    props:{
        visible:{
            type:Boolean,
            required:true
        },
    },
    computed:{
        allProVisible:{
            get(){
                return this.visible
            },
            set(val){
                this.$emit('update:visible',val)
            }
        }
    },
    data(){
        return {
            ProductMethodArr: [
                { label: "产品分类", classAttribute: "", method: productTree, requeseObj: { classAttribute: "" } },
            ],
            treeLoading: false,
            ProductTreeData: [],
            expands: true,
            refreshTree: true,
            ProductListRequestObj: {
                classAttributeList: [],
                classAttribute: "",
                productDrawingNo: "",
                productCategoryId: "",
                queryType: 2,
                productStatus: 'enable',
                productCode: "",
                productName: "",
                orderItems: [{
                    "asc": false,
                    "column": ""
                }, {
                    "asc": false,
                    "column": "create_time"
                }],
                pageNum: 1,
                pageSize: 20,
            },
            listLoading: false,
            allproductData: [],
            allProductTotal: 0,
            btnLoading: false,
            productId: "",
            productObj: {},
        }
    },
    methods:{

        openSeleceProductDialog() {
            this.allProVisible = true
            let arr = [];
            this.ProductListRequestObj = {
                classAttributeList: [],
                classAttribute: "",
                productDrawingNo: "",
                queryType: 2,
                productStatus: 'enable',

                productCategoryId: "",
                code: "",
                name: "",
                orderItems: [{
                    "asc": false,
                    "column": ""
                }, {
                    "asc": false,
                    "column": "create_time"
                }],
                pageNum: 1,
                pageSize: 20,
            }
            this.allproductData = []
            let successTotal = 0;
            let tempTreeData = [...this.ProductMethodArr]
            this.ProductMethodArr.forEach((item, index) => {
                item.method(item.requeseObj).then(res => {
                    if (Array.isArray(res.data)) {
                        tempTreeData[index] = {
                            id: item.label,
                            name: item.label,
                            classAttribute: item.classAttribute,
                            childrenList: res.data
                        }
                    } else {
                        tempTreeData[index] = {
                            id: item.label,
                            name: item.label,
                            classAttribute: item.classAttribute,
                            childrenList: res.data.records
                        }
                    }
                    if ((++successTotal) === this.ProductMethodArr.length) {
                        this.ProductTreeData = tempTreeData
                        this.initData2()
                    }
                })
            });
        },
        submitAllProduct() {

            this.$emit('submit',{
                productId:this.productId,
                productObj:this.productObj,
                hideModel:()=>{
                    this.allProVisible = false
                }
            })
        },
        // 获取所有产品列表数据
        initData2() {
            this.listLoading = true
            getProducts(this.ProductListRequestObj).then(listRes => {
                if (Array.isArray(listRes.data)) {
                    this.allproductData = listRes.data
                } else {
                    this.allproductData = listRes.data.records
                }
                this.allProductTotal = listRes.data.total
                this.$forceUpdate()
                this.treeLoading = false
                this.listLoading = false
            })
        },
        rowClickHandle(row) {
            this.productId = row.id
            this.productObj = row
             this.$emit('selected',row)
        },

        handleSelectionChangeAllPruduct(val) {
            this.selectArr = val
        },
        searchAllProduct() {
            this.ProductListRequestObj.pageNum = 1
            this.initData2()
        },
        resetAllProduct() {
            this.ProductListRequestObj = {
                classAttributeList: [],
                classAttribute: "",
                productDrawingNo: "",
                productCategoryId: "",
                queryType: 2,

                productCode: "",
                productName: "",
                orderItems: [{
                    "asc": false,
                    "column": ""
                }, {
                    "asc": false,
                    "column": "create_time"
                }],
                pageNum: 1,
                pageSize: 20,
            },
                this.searchAllProduct()
        },
        filterNodeAllProduct(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleNodeAllProduct(data, node) {
            if (this.ProductListRequestObj.productCategoryId === data.id) return
            this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
            const nodePath = this.getNodePathProduct(node)
            this.organizeIdTree = nodePath.map(o => o.id)
            this.ProductListRequestObj.classAttribute = data.classAttribute
            this.searchAllProduct()
        },
        getNodePathProduct(node) {
            let fullPath = []
            const loop = (node) => {
                if (node.level) fullPath.unshift(node.data)
                if (node.parent) loop(node.parent)
            }
            loop(node)
            return fullPath
        },
        getcategoryTree(isInit) {
            this.treeLoading = true
            let listQuery = {
                keyword: '',
                type: "customer"
            };
            getcategoryTrees(listQuery).then(res => {
                this.treeData = res.data
                this.$nextTick(() => {
                    this.initData()
                    this.treeLoading = false
                })
            }).catch(() => {
                this.treeLoading = false
            })
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
    },
    created() {
        this.openSeleceProductDialog()
    }
}
</script>

<template>
    <el-dialog title="选择产品"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               destroy-on-close
               :visible.sync="allProVisible"
               lock-scroll
               class="JNPF-dialog JNPF-dialog_center selectPro"
               style="overflow: hidden"
               width="70%"

               append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
            <div class="JNPF-common-layout-left">
                <div class="JNPF-common-title">
                    <h2>产品分类</h2>
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
                    <el-tree ref="treeBox" :data="ProductTreeData"
                             :props="{
                                children: 'childrenList',
                                label: 'name'
                             }"
                             :default-expand-all="expands"
                             highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct"
                             class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
                  <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                    <i
                        :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                    <span class="text" :title="data.name">{{ data.name }}</span>
                  </span>
                    </el-tree>
                </el-scrollbar>
            </div>
            <div class="JNPF-common-layout-center JNPF-flex-main">
                <el-row class="JNPF-common-search-box" :gutter="16">
                    <el-form @submit.native.prevent>
                        <el-col :span="6">
                            <el-form-item>
                                <el-input v-model="ProductListRequestObj.productCode" placeholder="请输入产品编码" clearable />
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item>
                                <el-input v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                                    {{ $t('common.search') }}</el-button>
                                <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{
                                        $t('common.reset')
                                    }}
                                </el-button>
                            </el-form-item>
                        </el-col>

                    </el-form>
                </el-row>
                <div class="JNPF-common-layout-main JNPF-flex-main">
                    <JNPF-table v-loading="listLoading"
                                :data="allproductData"
                                @row-click="rowClickHandle"
                                row-class-name="pointer"
                                ref="dataTable">
                        <el-table-column prop="code" label="产品编码">
                            <template slot-scope="{row}">
                                <el-radio class="square-radio" v-model="productId" :label="row.id">
                                    {{row.code}}
                                </el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="drawingNo" label="品名规格" />
                        <el-table-column prop="productCategoryName" label="所属分类" />
                        <el-table-column prop="mainUnit" label="单位" />

                    </JNPF-table>
                    <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                                :limit.sync="ProductListRequestObj.pageSize" @pagination="initData2" />
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="allProVisible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" :loading="btnLoading" @click="submitAllProduct">
              确定</el-button>
          </span>
    </el-dialog>
</template>

<style scoped lang="scss">

</style>
