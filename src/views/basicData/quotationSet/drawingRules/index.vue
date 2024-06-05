<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.customerProductNo" placeholder="请输入客户物料号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="query.customerDrawingNumber" placeholder="请输入客户图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model.trim="query.materialCode" placeholder="请输入产品图号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="query.bomFlag" placeholder="请选择是否有BOM" clearable>
                              <el-option v-for="(item, index) in bomFlagList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                $t('common.reset') }}
                            </el-button>

                        </el-form-item>

                    </el-col>
                    <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="visible = true">更多查询</el-button>

                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding:10px">
                    <!-- <el-dropdown> -->
                    <div>
                        <el-button type="primary" size="mini" icon="el-icon-plus" @click.native="addSupplier('add')">
                            新建
                        </el-button>
                        <el-button type="primary" size="mini" icon="el-icon-plus" @click.native="generateBOM()">
                            生成BOM
                        </el-button>
                        <el-button type="primary" size="mini" icon="el-icon-plus" @click.native="selectFile()">
                            批量翻译
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="batchDelete()">
                            批量删除
                        </el-button>
                        <el-button type="text" size="mini" icon="el-icon-download" @click.native="downLoadTemplate()">
                            下载模板
                        </el-button>
                    </div>

                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="tableDataList" hasC @sort-change="sortChange" ref="tableForm"
                    custom-column @selection-change="handleSelectionChange" :fixedSelect="true" :fixedNO="true"
                    :checkSelectable="disOutData" >

                    <el-table-column prop="customerProductNo" label="客户物料号" min-width="160" fixed="left" />
                    <el-table-column prop="customerDrawingNumber" label="客户图号" sortable="custom" min-width="160"
                        fixed="left">
                    </el-table-column>
                    <el-table-column prop="customerName" label="客户名称" min-width="160" />
                    <el-table-column prop="materialCode" label="产品图号" sortable="custom" min-width="600" />
                    <el-table-column prop="productType" label="产品类型" min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.productType == 'hose'">软管总成</div>
                            <div v-else-if="scope.row.productType == 'steel_pipe'">钢管总成</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bomFlag" label="是否有BOM" width="140">
                        <template slot-scope="scope">
                            <div v-if="scope.row.bomFlag">
                                <el-link type="primary"
                                    @click.native="handleUserRelations(scope.row.quotationBomId, 'look')">有</el-link>
                            </div>
                            <div v-else>否</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="splitFlag" label="是否降级拆分" width="140">
                        <template slot-scope="scope">
                            <div v-if="scope.row.splitFlag">是</div>
                            <div v-else>否</div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="quotationBomCode" label="BOM编码" min-width="380">
                        <template slot-scope="scope">

                            <el-link type="primary" @click.native="handleUserRelations(scope.row.quotationBomId, 'look')">{{
                                scope.row.quotationBomCode
                            }}</el-link>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="BomName" label="BOM名称" width="180" /> -->
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" width="120" />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id,)">

                                <el-dropdown hide-on-click>
                                    <span class="el-dropdown-link">
                                        <el-button type="text" size="mini">
                                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                                            查看详情
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </tableOpts>
                            <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                            <el-button type="text" @click="handleDel(scope.row.id,)" style=" color: #ff3a3a">删除</el-button>
                            <el-dropdown hide-on-click>
                                <span class="el-dropdown-link">
                                    <el-button type="text" size="mini">
                                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                                        查看详情
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown> -->
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="query.pageNum" :background="background" :limit.sync="query.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
          <el-row :gutter="20">
            <el-form ref="diaForm" :model="query" label-width="120px" label-position="top">
              <el-col :span="12">
                <el-form-item label="客户物料号">
                  <el-input v-model.trim="query.customerProductNo" placeholder="请输入客户物料号" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户图号">
                  <el-input v-model="query.customerDrawingNumber" placeholder="请输入客户图号" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品图号">
                  <el-input v-model.trim="query.materialCode" placeholder="请输入产品图号" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否有BOM">
                  <el-select v-model="query.bomFlag" placeholder="请选择是否有BOM" clearable>
                    <el-option v-for="(item, index) in bomFlagList" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否降级拆分">
                  <el-select v-model="query.splitFlag" placeholder="请选择是否降级拆分" clearable>
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间">
                  <el-date-picker v-model="createTimeArr" type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择开始时间"
                    end-placeholder="请选择结束时间" :picker-options="global.timePickerOptions"
                    :default-time="['00:00:00', '23:59:59']" clearable>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建人">
                  <el-input v-model="query.createByName" placeholder="请输入创建人" clearable />
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" @click="search()">
              搜索</el-button>
          </span>
        </el-dialog>

        <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
        <DepForm2 v-if="depFormVisibles" ref="depForms" @close="closeForm" />

        <!-- 批量翻译上传 -->
        <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadFile"
            :http-request="UploadFile" />
    </div>
</template>
  
<script>
import { deleteRuleData, getRuleList, generateData, uploadCalculate, BatchdeleteRuleData } from '@/api/basicData/index'
import DepForm from './depForm'
import DepForm2 from '../quotationBOM/depForm'
import { mapGetters, mapState } from 'vuex'
export default {
    name: 'quality',
    components: { DepForm, DepForm2 },
    data() {
        return {
            createTimeArr:[],
            bomFlagList:[
              {label:'否',value:0},
              {label:'有',value:1}
            ],
            depFormVisibles: false,
            depFormVisible: false,
            background: true,//分页器背景颜色
            visible: false,
            tableDataList: [],
            query: {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                customerDrawingNumber: "",
                materialCode: "",
                bomFlag: "",
                customerProductNo: "",
                createByName: "",
                startTime: "",
                endTime: ""
            },
            listLoading: false,
            total: 0,
            formVisible: false,
            seleceData: [],
            idList: []
        }
    },
    created() {
        this.initData()
    },
    computed: {

        ...mapState('user', ['token']),
    },
    methods: {
      //批量删除
      batchDelete(){
        if (this.seleceData.length < 1) {
          this.$message({
            type: 'error',
            message: "请选择要删除的数据",
            duration: 1500,
          })
          return
        }
        this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
            type: 'warning'
        }).then(() => {
          let a = this.seleceData.map(item=>{
            return item.id
          })
          BatchdeleteRuleData(a).then(res => {
            this.initData()
            this.$message({
                type: 'success',
                message: "删除成功",
                duration: 1500,
            })
          })
        }).catch(() => { })
      },
        handleUserRelations(id, btnType) {
            this.depFormVisibles = true
            this.$nextTick(() => {
                this.$refs.depForms.init(id, btnType)
            })
        },
        disOutData(row) {
            return true
            return !row.bomFlag
        },
        handleSelectionChange(val) {
            console.log("选中", val);
            this.seleceData = val
            this.idList = []
        },
        generateBOM() {
            if (this.seleceData.length < 1) {
                this.$message({
                    type: 'error',
                    message: "请选择数据",
                    duration: 1500,

                })
            } else {
                this.seleceData.forEach(item => {
                    this.idList.push(item.id)
                });
                console.log(this.idList);
                generateData(this.idList).then(res => {
                    console.log("生成BOM", res);
                    this.$message({
                        type: 'success',
                        message: "生成BOM成功",
                        duration: 1500,

                    })
                    this.seleceData = []
                    this.initData()
                })
            }
        },
        sortChange({ prop, order }) {

            const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
            this.query.orderItems[0].asc = order === "ascending"
            this.query.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        // 关闭新建、编辑页面
        closeForm(isRefresh) {
            this.depFormVisibles = false
            this.formVisible = false
            if (isRefresh) {
                this.initData()
            }
        },
        initData() {
            this.jnpf.searchTimeFormat(this.query, this.createTimeArr, 'startTime', 'endTime')
            Object.keys(this.query).forEach(key => {
              let item = this.query[key]
              this.query[key] = typeof item === 'string' ? item.trim() : item
            })
            getRuleList(this.query).then(res => {
                this.tableDataList = res.data.records
                this.listLoading = false
                this.total = res.data.total
                this.visible= false
            }).catch(() => {
                this.listLoading = false
                this.visible= false
            })
        },
        search() {
            this.query.pageNum = 1
            this.initData()
        },
        reset() {
            this.$refs['tableForm'].$refs.JNPFTable.clearSort()
            this.createTimeArr = []
            this.query = {
                pageNum: 1,
                pageSize: 20,
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                customerDrawingNumber: "",
                materialCode: "",
                bomFlag: "",
                customerProductNo: "",
                createByName: "",
                startTime: "",
                endTime: ""
            }
            this.search()
        },
        addSupplier(type) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init('', type)
            })
        },
        addOrUpdateHandle(id, btnType) {
            this.depFormVisible = true
            if (id) {
                // setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.depForm.init(id, btnType)
                })
                // }, 600);
            }
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                deleteRuleData(id).then(res => {
                    this.initData()
                    this.$message({
                        type: 'success',
                        message: "删除成功",
                        duration: 1500,
                    })
                })
            }).catch(() => { })
        },
        handleUserRelation(id, btnType) {
            this.depFormVisible = true
            this.$nextTick(() => {
                this.$refs.depForm.init(id, btnType)
            })
        },
        selectFile() {
            this.$refs.UploadFile.$el.querySelector('input').click()
        },
        // 上传获取牌价
        UploadFile(data) {
            var formData = new FormData()
            formData.append("file", data.file)
            //调用上传文件接口
            uploadCalculate(formData).then(res => {
                if (res.data.url) {
                    this.$message.error(`存在不能翻译的数据，请查看`)
                    this.jnpf.downloadFile(res.data.url, res.data.name)
                } else {
                    this.$message.success(`操作成功`)
                    this.search()
                }
            }).catch(err => {
                this.$message.error(`文件上传失败`)
            })
        },
        // 下载模板
        downLoadTemplate() {
            const a = document.createElement('a')
            a.setAttribute('download', '')
            a.setAttribute('href', location.origin + '/static/客户图号模板.xlsx')
            a.click()
        },
    }
}
</script>
<style scoped>
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
  