<template>
    <div v-drag:[disabled].onlyFile="dragHandler" class="UploadFile-container">
        <template>
            <div class='UploadFile-container-main noUpload'>
                <el-upload
                    v-bind="$attrs"
                    action="#"
                    :file-list="fileList"
                    :show-file-list="false"
                    v-if="!detailed"
                    :on-change="onChange"
                    :disabled="disabled"
                    :auto-upload="false"
                    multiple
                    :on-progress="onProgress"
                    accept=".jpg, .jpeg, .png, .xls, .xlsx, .doc, .docx, .txt, .pdf, .MPF"
                    :headers="{
                        'token': `${token}`
                    }">
                    <el-button ref="clickUploadBtn" size="small" type="primary" icon="el-icon-upload" v-if="!disabled">点击上传</el-button>
                    <el-button size="small" slot="tip" type="primary" icon="el-icon-upload" style="margin-top:10px" :disabled="true" v-else>点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传不超过{{ fileSize }}{{ sizeUnit }}的{{ acceptText }}文件，您也可把文件拖拽至此以上传</div>
                </el-upload>
                <div v-else class="upload-list" style="padding-top: 0;">
                    <p>附件列表</p>
                </div>
                <div v-if="uploadlist">
                    <SwitchListAndFilter :need-filter="false" :switch-list.sync="switchList"></SwitchListAndFilter>
                </div>
            </div>
        </template>

        <template>
            <ul class="el-upload-list el-upload-list el-upload-list--text" v-if="!uploadlist" v-loading="loading">
                <li class="el-upload-list__item is-success" v-for="(file, index) in fileList" :key="file.fileId" :class="{ 'el-upload-list__item_detail': detailed }">
                    <a class="el-upload-list__item-name" @click="handlePreview(file)">
                        <i class="el-icon-paperclip"></i>
                        {{ file.name }}{{ file.fileSize ? `（${jnpf.toFileSize(file.fileSize)}）` : '' }}
                    </a>
                    <i class="el-icon-view" title="查看" @click="handlePreview(file)" style="font-size:20px"></i>
                    <i class="el-icon-download" title="下载" @click="handleClick(file)" style="font-size:20px"></i>
                    <label class="el-upload-list__item-status-label" :class="{ 'disabled': disabled }" style="font-size:20px">
                        <i class="el-icon-upload-success el-icon-circle-check"></i>
                    </label>
                    <i class="el-icon-close" title="删除" v-if="!disabled" @click="handleRemove(index)" style="font-size:20px"></i>
                </li>
            </ul>
            <div v-if="uploadlist">
                <el-table ref="dataTable" :data="fileList" style="margin-top: 5px;" v-loading="loading" v-if="switchList" :header-cell-style="{background:'#f5f7fa'}">
                    <el-table-column type="index" width="60" label="序号" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="文件名">
                        <template slot-scope="scope">
                            <i class="el-icon-paperclip"></i>
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="fileSize" label="大小" width="150">
                        <template slot-scope="scope">{{ scope.row.fileSize | toFileSize() }}</template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="160">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleRemove(scope.$index)" :disabled="disabled">删除
                            </el-button>
                            <el-button size="mini" type="text" @click="handleClick(scope.row)">下载
                            </el-button>
                            <el-button size="mini" type="text" @click="handlePreview(scope.row)">查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="uploadlist" v-else>
                    <ul class="ul-upload" :style="{height: gridHeight}" v-loading="loading">
                        <GridFileList @empty-lick="emptyUpload" :empty-description="disabled ? '当前状态不可上传文件': '暂无文件，您可点击或把文件拖拽至此上传'" :list="fileList" :file-options="fileOptions" @command="commandHandler" @item-click="itemClickHandler">
                            <template v-slot:tooltip="{ item }">
                                <el-row>
                                    <el-col style="text-align: right" :span="8">{{ item.type ? '文件名' : '文件夹名' }}：</el-col>
                                    <el-col :span="16">{{ item.name }}</el-col>
                                </el-row>
                                <el-row>
                                    <el-col style="text-align: right" :span="8">文件大小：</el-col>
                                    <el-col :span="16">{{ item.fileSize | toFileSize() }}</el-col>
                                </el-row>
                            </template>
                            <template v-slot:bottom="{item}">
                                <div>
                                    <p class="li-upload-p1 name">{{ item.name }}</p>
                                    <p class="li-upload-p2 file-size" >{{ item.fileSize | toFileSize() }}</p>
                                </div>
                            </template>
                        </GridFileList>
                    </ul>
                </div>
            </div>
        </template>
        <Preview :visible.sync="previewVisible" :file="activeFile" />
    </div>
</template>

<script>
import { getDownloadUrl } from '@/api/common'
import Preview from '@/components/upload-wj/Preview'
import { uploaderWithCode } from '@/api/equipment'
import { mapState } from 'vuex'
import drag, {readFileBlob} from '@/views/esop/fileUpload/workinginstruction/utils/drag'
import {ext2Icon, getExt} from "@/views/drawingDocument/document/utils";
import GridFileList from "@/views/drawingDocument/document/GridFileList.vue";
import SwitchListAndFilter from "@/views/drawingDocument/document/SwitchListAndFilter.vue";
const units = {
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024
}

export default {
    directives:{
        drag
    },
    components: {SwitchListAndFilter, GridFileList, Preview},
    props: {
        gridHeight: {
            type: String,
            default: '300px'
        },
        // v-model值
        value: {
            type: Array,
            default: () => []
        },
        accept: {
            type: String,
            default: '*'
        },
        sizeUnit: {
            type: String,
            default: 'MB'
        },
        fileSize: {
            default: 5
        },
        uploadlist: {
            type: Boolean,
            default: true
        },
        detailed: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'document'
        },
        // 限制上传的图片数量
        limit: {
            type: Number,
            default: 0
        },
        // 文件夹编码
        code: {
            type: String,
            default: ''
        },
        // 文件夹id
        parentId: {
            type: Number,
            default: null
        },
    },
    data() {
        return {
            switchList:false,
            previewVisible: false,
            loading: false,
            activeFile: {},
            fileList: this.value,
            fileOptions:[
                {
                    value:'download',
                    text:'下载',
                },
                {
                    value:'preview',
                    text:'查看',
                },
                {
                    value:'delete',
                    text:'删除',
                    isShow:()=>!this.disabled
                }
            ]
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                const isTopLimit = this.limit ? val.length > this.limit : false
                if (isTopLimit) {
                    this.$message.error(`当前限制最多可以上传${this.limit}个文件`)
                    this.fileList = val.splice(this.limit)
                    return false
                }
                this.fileList = val
            }
        }
    },
    computed: {
        ...mapState('user', ['token']),
        acceptText() {
            let txt = ''
            switch (this.accept) {
                case 'image/*':
                    txt = '图片'
                    break
                case 'video/*':
                    txt = '视频'
                    break
                case 'audio/*':
                    txt = '音频'
                    break
                case '.xls,.xlsx':
                    txt = 'excel'
                    break
                case '.doc,.docx':
                    txt = 'word'
                    break
                case '.pdf':
                    txt = 'pdf'
                    break
                case '.txt':
                    txt = 'txt'
                    break
                case '.MPF':
                    txt = 'MPF'
                    break
                default:
                    txt = ''
                    break
            }
            return txt
        },
    },
    created() {
        // console.log('fff', this.fileList)
    },

    methods: {
        emptyUpload() {
            if(this.disabled) return this.$message.info('当前状态不可上传文件')
            this.$refs.clickUploadBtn.$el.click()
        },
        commandHandler(command, item,index) {
            switch (command) {
                case 'download':
                    this.handleClick(item)
                    break
                case 'preview':
                    this.handlePreview(item)
                    break
                case 'delete':
                    this.handleRemove(index)
                    break
            }
        },
        itemClickHandler(item) {
            this.handlePreview(item)
        },
        getExt,
        ext2Icon,
       async  dragHandler(filerFiles,files){
           console.log(filerFiles,files)
            if(filerFiles.length <files.length){
                this.$message.info('暂不支持文件夹上传，已自动过滤文件夹')
            }

            const fileArr =[]
            for (let filerFile of filerFiles) {
                fileArr.push({
                    raw: filerFile,
                    size : filerFile.size,
                    name : filerFile.name
                })
            }
           fileArr.forEach(file => {
               this.onChange(file)
           })

           console.log(fileArr)
        },
        getSwitchList() {
            this.switchList = !this.switchList
        },
        onProgress() {
        },
        handlePreview(file) {
            if (file.filename.split('.')[1].toUpperCase() == 'MPF') return this.$message.error('该文件格式不支持预览')
            this.activeFile = file
            this.previewVisible = true
        },
        handleClick(file) {
            // 点击下载文件
            if (!file.filename) return
            getDownloadUrl(this.type, file.filename).then(res => {
                this.jnpf.downloadFile(res.data.url, file.name)
            })
        },
        // 上传图片
        onChange(file) {
            const unitNum = units[this.sizeUnit]
            let isRightSize = this.fileSize ? file.size / unitNum < this.fileSize : true
            if (!isRightSize) {
                this.$message.error(`文件大小超过${this.fileSize}${this.sizeUnit}`)
                return isRightSize
            }
            var formData = new FormData()
            formData.append("file", file.raw)
            if (this.code != null) formData.append("code", this.code)
            if (this.parentId != null) formData.append("parentId", this.parentId)
            this.loading = true
            //调用上传文件接口
            uploaderWithCode(formData).then(({data}) => {
                this.fileList.push({
                    name: file.name,
                    fileSize: file.size,
                    filename: data.filename,
                    id: data.id,
                    url: data.url,
                    fullName: data.fullName,
                })
                this.$emit('input', this.fileList)
            }).catch(err => {
                this.$message.error(err.message || `当前文件上传失败`)
                this.loading = false
            }).finally(() => {
                this.loading = false
            })
        },
        // 预览图片
        // onPreview(file) {
        //     this.urlView = file.url
        //     this.urlVisible = true
        // },

        // 删除图片
        // onRemove(file, fileList) {
        //     const filePath = file.url
        //     const i = this.fileList.findIndex(x => x.url.indexOf(filePath))
        //     this.fileList.splice(i, 1)
        //     this.$emit('input', this.fileList)
        // },
        handleRemove(index) {
            this.fileList.splice(index, 1)
            this.$emit("input", this.fileList)
        },
        // // 上传图片超过限制
        // onExceed(file,fileList) {
        //     this.$message.error(`最多只能上传${this.limit}个文件`)
        // },
        onRemove(file, fileList) {
            const i = this.fileList.findIndex(x => x.url.indexOf(filePath))
            this.fileList.splice(i, 1)
            this.$emit('input', this.fileList)
        },
    }
}

</script>

<style scoped>


/deep/ .maxHidden .el-upload--picture-card {
    display: none;
}

/deep/ .el-upload-list__item.is-ready {
    display: none;
}
</style>
<style lang="scss" scoped>
.name{
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #222;
    display: -webkit-box;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    width: 104px;
    word-break: break-all;
}
.file-size{
    margin-top: -3px;
    color: #999;
    font-size: 12px;
    text-align: center;

}
.uploadlist {
    .ul-upload {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .li-upload {
            &:hover {
                background-color: #f5f8fb;

                .el-droupload {
                    opacity: 1 !important;
                }
            }

            cursor: pointer;
            border-radius: 8px;
            width: 120px;
            margin-right: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            list-style: none;

            .upload_img {
                width: 60px;
                height: 60px;
            }

            .li-upload-p1 {
                text-align: center;
                margin-top: 5px;
                font-size: 12px;
            }

            .li-upload-p2 {
                margin-top: 5px;
                font-size: 12px;
                color: #999;
            }
        }
    }
}

.UploadFile-container {
    position: relative;

    .UploadFile-container-main {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .upload-list {
            padding-top: 10px;
            line-height: 36px;
            font-size: 18px;
        }
    }

    .el-upload__tip {
        line-height: 1.2;
        color: #a5a5a5;
        margin-top: 5px;
    }
}

.getSwitchList-p {
    cursor: pointer;

    img {
        margin-top: 10px;
        width: 20px;
        height: 20px;
    }
}

.noUpload {
    border-bottom: 1px solid #dcdfe6;
    padding: 0 10px 10px 0;
}

.el-upload-list__item {
    &.el-upload-list__item_detail:first-child {
        margin-top: 5px !important;
    }

    .el-upload-list__item-name {
        margin-right: 70px;
        font-size: 18px;
    }

    &:hover {
        .el-upload-list__item-status-label.disabled {
            display: block !important;
        }
    }

    .el-icon-download {
        display: inline-block;
        position: absolute;
        top: 5px;
        right: 30px;
        cursor: pointer;
        opacity: 0.75;
        color: #606266;
    }

    .el-icon-view {
        display: inline-block;
        position: absolute;
        top: 5px;
        right: 55px;
        cursor: pointer;
        opacity: 0.75;
        color: #606266;
    }
}
</style>
