<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @keyup.native.enter="search()"  v-model="listQuery.code" placeholder="代号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input @keyup.native.enter="search()"  v-model="listQuery.drawingNo" placeholder="品名规格" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding: 8px">
                    <topOpts @add="addOrUpdateHandle('','add')" :isJudgePer="true" :addPerCode="'btn_add'">
                        <el-button icon="el-icon-plus" type="primary" size="mini" @click.native="batchRelatedProduct()">
                            产品绑定代号
                        </el-button>
                    </topOpts>

                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                     @click="superQueryVisible = true" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-if="tableData.length" hasC ref="dataTable" v-loading="listLoading" highlight-current-row :data="tableData" custom-column customKey="JNPFTableKey_26735678567">
                    <el-table-column min-width="120" prop="code" label="代号" />
                    <el-table-column min-width="220" prop="drawingNo" label="品名规格" />
                    <el-table-column v-for="item in attrDictionaryData" :key="item.id" min-width="140" :prop="item.description" :label="$store.getters[item.description] || item.fullName" />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column label="操作" width="240" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                                       @edit="addOrUpdateHandle(scope.row.id,'edit')" @del="handleDel(scope.row.id)">
                                <el-button type="text" size="mini" @click.native="relatedProduct(scope.row)">
                                    绑定产品
                                </el-button>
                                <el-button type="text" size="mini" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                                    查看详情
                                </el-button>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :background="true" :limit.sync="listQuery.pageSize"
                            @pagination="initData" />
            </div>
        </div>
        <productAttributeSymbolForm v-if="formVisible" ref="productAttributeSymbolForm" @refreshDataList="initData" @close="closeForm" />
        <!-- 高级查询 -->
        <SuperQuery :table-ref="'dataTable'" :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <relatedProductForm :mainCode="mainCode" v-if="relatedProductVisible" ref="relatedProductForm" @close="closeForm"></relatedProductForm>
        <ComSelect-page ref="comSelect-page"  dialogTitle="选择产品"
                        :elementShow="false" multiple @change="addth"
                        :tableItems="tableItems"
                        :listMethod="getProductList"
                        :listRequestObj="listRequestObj"
                        :searchList="ProductTableSearchList"
                        treeTitle="物料分类" :methodArr="ProductMethodArr"
        />
    </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
    productAttributesCodeList, delProductAttributesCode, addProductAttributeCodeRelated, getbimProductAttributesListMap
} from '@/api/masterDataManagement'
import ProductAttributeSymbolForm from '@/views/masterDataManagement/productSet/productAttributeSymbol/Form.vue'
import RelatedProductForm from '@/views/masterDataManagement/productSet/productAttributeSymbol/relatedProductForm.vue'
import { getProductList } from '@/api/basicData/materialFiles'
import { getcategoryTree } from '@/api/basicData/materialSettings'

export default {
    name: 'productAttributeSymbol' ,
    components: { RelatedProductForm, ProductAttributeSymbolForm, SuperQuery },
    data(){
        return {
            ProductMethodArr: { method: getcategoryTree, requestObj: { classAttribute: "", } }, // 产品选择弹出框树状列表
            tableItems:[
                { prop: 'drawingNo',value: '', type: 'view', minWidth: 340, label: '品名规格' },
                { prop: 'code', label: '产品编码', value: '', type: 'view', minWidth: 160 },
                { prop: 'name',value: '', type: 'view', minWidth: 140, label: '产品名称',render:this.$store.getters.configData.product.enable_productName },
                { prop: 'mainUnit', label: '单位', value: '', type: 'view', minWidth: 100 },
                { prop: 'productCategoryName', label: '产品分类', sortable: 'custom' }, { prop: 'productCategoryName', label: '产品分类', sortable: 'custom' },
            ],
            listRequestObj:{
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "createTime"
                }],
                pageNum: 1,
                pageSize: 20,
                orderNo:'',
            },
            ProductTableSearchList:[
                { prop: 'productCode', label: '产品编码', type: 'input' },
                { prop: 'productDrawingNo', label: '品名规格', type: 'input'},
            ],
            mainCode:'',
            relatedProductVisible: false,
            superQueryVisible: false,
            formVisible: false,
            listLoading: false,
            superQueryJson: [],
            tableData:[],
            listQuery:{},
            total:0,
            initListQuery:{
                drawingNo:'',
                "code": "",
                "createByName": "",
                "endTime": "",
                "endUpdateTime": "",
                "keyword": "",
                "orderEndDate": "",
                "orderItems": [
                    {
                        "asc": false,
                        "column": ""
                    },{
                        "asc": false,
                        "column": "create_time"
                    },
                ],
                "orderStartDate": "",
                "pageNum": 1,
                "pageSize": 20,
                "productId": '',
                "projectId": '',
                "startTime": "",
                "startUpdateTime": "",
                "superQuery": {},
                "totalRowFlag": false
            },
            bimProductAttributesList:{},
            attrDictionaryData:[]
        }
    },
    async created(){
        const res = await getbimProductAttributesListMap()
        this.bimProductAttributesList = res.data
        const productAttribute = await this.$store.dispatch('base/getDictionaryData', { sort: 'productAttributes'})
        this.attrDictionaryData = productAttribute.filter(item=>!['pa014','pa017','pa018','pa021','pa022'].includes(item.enCode)).map(item=>{
            return {
                ...item,
                list:this.bimProductAttributesList[item.enCode].map(item=>{
                    return {
                        label:item.name,
                        value:item.name,
                    }
                })
            }
        })
        console.log(this.attrDictionaryData,'attrDictionaryData')
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
        this.initData()
    },
    methods:{
        getProductList,
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },
        search() {
            this.initData()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
            this.initData()
        },
        initData(){
            this.listLoading = true
            Object.keys(this.listQuery).forEach((key) => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            productAttributesCodeList(this.listQuery)
                .then((res) => {
                    this.tableData = res.data.records
                    this.total = res.data.total
                    this.listLoading = false
                    this.visible = false
                })
                .catch(() => {
                    this.listLoading = false
                })

        },
        superQuerySearch(){
            this.listQuery.superQuery = query
            this.superQueryVisible = false
            this.search()
        },
        closeForm(){
            this.formVisible = false
            this.relatedProductVisible = false
            this.initData()
        },
        addOrUpdateHandle(id,btnType){
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.productAttributeSymbolForm.init(id, btnType)
            })
        },
        relatedProduct(row){
            this.mainCode = row.code
            this.relatedProductVisible = true
            this.$nextTick(() => {
                this.$refs.relatedProductForm.init()
            })
        },
        handleDel(id){
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                delProductAttributesCode(id).then((res) => {
                        this.initData()
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                            duration: 1500
                        })
                    })
                }).catch(() => { })
        },
        addth(id,data){
            console.log(data,'data')
            if (!data && !data.length) return
            let list = data.map(item=>item.all)
            let _data = {
                codeIdList:this.$refs.dataTable.selection.map(item=>item.id),
                productIdList:list.map(item=>item.id)
            }
            addProductAttributeCodeRelated(_data).then(res=>{
                this.$message({
                    type: 'success',
                    message: '绑定成功',
                    duration: 1500
                })
            })
        },
        batchRelatedProduct(){
            console.log(this.$refs.dataTable.selection,'this.$refs.dataTable.selection')
            if (!this.$refs.dataTable.selection.length) return this.$message.warning('请先选择您要绑定的代号数据')
            this.$refs['comSelect-page'].openDialog()
        },
    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
