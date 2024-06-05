<template>
    <el-dialog title="详情"
               :close-on-click-modal="false" append-to-body
               :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
               width="800px"
    >
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-row :gutter="15">
                            <el-col :span="18">
                                <el-row :gutter="15">
                                    <el-col :span="24">
                                        <el-form-item label="系统看板"
                                                      prop="datascreenId"
                                        >
                                            <p>{{ dataForm.datascreenId }}</p>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="pic"
                                        >
                                            <p>{{ dataForm.datascreenId_backgroundUrl }}</p>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="url"
                                        >
                                            <p>{{ dataForm.datascreenId_id }}</p>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="名称"
                                                      prop="name"
                                        >
                                            <p>{{ dataForm.name }}</p>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="链接"
                                                      prop="url"
                                        >
                                            <p>{{ dataForm.url }}</p>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="分类"
                                                      prop="datascreenCategoryId"
                                        >
                                            <p>{{ dataForm.datascreenCategoryId }}</p>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="6">
                                <el-row :gutter="15">
                                    <el-col :span="14">
                                        <el-form-item label="图片"
                                                      prop="pic"
                                        >
                                            <JNPF-UploadImg v-model="dataForm.pic"
                                                            disabled
                                                            detailed :fileSize="10" sizeUnit="MB" :limit="1"
                                            >
                                            </JNPF-UploadImg>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                </template>
            </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
    </span>
    </el-dialog>
</template>
<script>
import request from '@/utils/request'
import PrintBrowse from '@/components/PrintBrowse'

export default {
    components: { PrintBrowse },
    props: [],
    data() {
        return {
            visible: false,
            loading: false,
            printBrowseVisible: false,
            printId: '',
            dataForm: {
                id: '',
                datascreenId: '352420839934660357',
                name: '',
                url: '',
                datascreenCategoryId: '',
                pic: [],
                creatoruserid: '',
                creatortime: '',
                lastmodifyuserid: '',
                lastmodifytime: ''
            },
            datascreenCategoryIdProps: { 'label': 'name', 'value': 'F_Id', 'children': 'children' }

        }
    },
    computed: {},
    watch: {},
    created() {

    },
    mounted() {
    },
    methods: {
        dataInfo(dataAll) {
            let _dataAll = dataAll
            _dataAll.pic = _dataAll.pic ? JSON.parse(_dataAll.pic) : []
            this.dataForm = _dataAll
        },

        init(id) {
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    this.loading = true
                    request({
                        url: '/api/base_datascteen/Base_datascteen/detail/' + this.dataForm.id,
                        method: 'get'
                    }).then(res => {
                        this.dataInfo(res.data)
                        this.loading = false
                    })
                }

            })
        }
    }
}

</script>
