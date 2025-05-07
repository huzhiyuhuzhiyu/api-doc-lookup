<script>
import {getLabel} from "@/utils";
import {getcategoryTree} from "@/api/basicData/materialSettings";
import {getclassAttributeList} from "@/api/masterDataManagement";
import {debounce} from "throttle-debounce";

Vue.prototype.$getLabel = getLabel
export default {
    name: "chooseCagtegory",
    data(){
        return{
            listLoading: false,
            treeList: [],
            refreshTable: true,
            categoryPropertList:[],
            expands: true,
            columnList: ['sort','classAttribute', 'classType', 'createTime', 'createByName', 'remark'],

            listQuery: {
                classAttribute: '',
                type: 'material',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'create_time'
                    }
                ],
                pageNum: 1,
                pageSize: 20
            },
        }
    },
    props:{
      chooseValue:{
          type: String,
          default: ''
      },
      chooseRow:{
        type: Object,
        default: null
      }
    },
    model:{
        prop: 'chooseValue',
        event: 'update:chooseValue'
    },
    computed:{
        radio:{
            get(){
                return this.chooseValue
            },
            set(val){
                this.$emit('update:chooseValue', val)
            }
        },
        currentRow:{
            get(){
                return this.chooseRow
            },
            set(val){
                this.$emit('update:chooseRow', val)
            }
        }
    },
    created() {
        this.getList()
        this.getclassAttributeList()
    },
    methods:{

        setTableIndex(arr, index) {
            arr.forEach((item, key) => {
                item.index = key + 1
                if (index) {
                    item.index = index + 1
                }
                if (item.childrenList.length > 0) {
                    item.hasChildren = true
                    this.setTableIndex(item.childrenList, item.index)
                }
            })
        },
        async getList(){
            this.listLoading = true
           try {
               const {data} = await getcategoryTree(this.listQuery)
               this.treeList = data
               if (this.treeList.length > 0) this.setTableIndex(this.treeList)
           }catch (e) {
               console.error(e)
           }finally {
               this.listLoading = false
           }

        },
        currentChange(val){
            this.currentRow = val
        },
        rowClick(row){
            if(row.parentId === '-1') return
            this.radio = row.id
            this.currentChange(row)
        },
        async getclassAttributeList() {
            let obj = {
                pageNum: 1,
                pageSize: -1
            }
            const res =  await getclassAttributeList(obj)
            this.categoryPropertList = res.data.records.map((item) => {
                return {
                    label: item.name,
                    value: item.code
                }
            })

        },
        search: debounce(350,false, function (){
            this.getList()
        }),
        rowClassName({row, rowIndex}) {
            if (row.parentId === '-1') {
                return 'not-allowed'
            }
            return 'pointer'
        },
    }
}
// highlight-current-row
// @current-change="currentChange"
</script>

<template>
    <div class="height-full">
        <el-row style="height:50px">
            <el-form @submit.native.prevent>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-input @input="search" v-model="listQuery.name" placeholder="分类名称" clearable />
                    </el-form-item>
                </el-col>

            </el-form>
        </el-row>
        <div style="height:calc(100% - 50px)">

            <JNPF-table   v-loading="listLoading"
                          :row-class-name="rowClassName"
                          :data="treeList"
                        :row-key="'id'"
                        v-if="refreshTable"
                        fixedNO
                        :default-expand-all="expands"
                        :tree-props="{ children: 'childrenList', hasChildren: '' }"
                        ref="dataTable"
                          @row-click="rowClick"
                          custom-column
                        :setColumnDisplayList="columnList" customKey="JNPFTableKey_310340">

                <el-table-column prop="name" label="分类名称" min-width="200">
                    <template slot-scope="scope">

                        <el-radio class="square-radio" @input="currentChange(scope.row)" :disabled=" scope.row.parentId === '-1'" :label="scope.row.id" v-model="radio" >
                            <i :class="[
                                    scope.row.childrenList.length >= 1
                                      ? 'icon-ym icon-ym-tree-organization3'
                                      : 'icon-ym icon-ym-systemForm'
                                  ]"></i>{{ scope.row.name }}</el-radio>

                    </template>
                </el-table-column>

                <el-table-column prop="code" label="分类编码" min-width="200" />
                <el-table-column prop="parentName" label="上级分类" min-width="100" />
                <!-- <el-table-column prop="integger" label="分类编码" min-width="120" /> -->
                <el-table-column prop="classAttribute" label="类别属性" min-width="120">
                    <template slot-scope="scope">
                        {{ $getLabel(categoryPropertList, scope.row.classAttribute, 'value', 'label') }}
                    </template>
                </el-table-column>

                <el-table-column prop="classType" label="类型" min-width="100">
                    <template slot-scope="scope">
                        {{ $getLabel(classTypelist, scope.row.classType, 'value', 'label') }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="sort" label="排序" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input @change="switchShow(scope.row, 'sort')" @blur="sortCodeBlur(scope.row)"
                                  v-model="scope.row.sort"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200" />


            </JNPF-table>
        </div>
    </div>


</template>

<style scoped lang="scss">

</style>
