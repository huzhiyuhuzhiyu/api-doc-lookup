<template>
    <div :class="{ maxHidden: isMaxHidden }">
        <el-upload v-bind="$attrs" v-loading="loading" action="#" list-type="picture-card" :file-list="fileList"
            :on-change="onChange" :on-remove="onRemove" :on-exceed="onExceed" :auto-upload="false" :on-preview="onPreview"
            :limit="limit" accept=".jpg, .jpeg, .png" :headers="{
                'token': `${token}`
            }">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">最多上传{{ limit }}张</div>
        </el-upload>
        <el-dialog :visible.sync="urlVisible" :modal-append-to-body="false" :modal="false">
            <img width="100%" :src="urlView" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { uploaderWithCode } from '@/api/equipment'
import { mapState } from 'vuex'
export default {
    props: {
        // v-model值
        value: {
            type: [String, Array],
            default: ''
        },
        // 限制上传的图片数量
        limit: {
            type: Number,
            default: 1
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
        }
    },
    data() {
        return {
            urlVisible: false,
            urlView: '',
            loading: false,
        }
    },

    computed: {
        ...mapState('user', ['token']),
        fileList: {
            get() {
                if (!this.value) return []
                if (typeof this.value === 'string') return this.value.split(',').map(x => {
                    return {
                        url: x
                    }
                })
                if (typeof this.value === 'object') {
                    return this.value.map(x => {
                        return {
                            url: x.url || x
                        }
                    })
                }
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        isMaxHidden() {
            return this.fileList.length >= this.limit
        },
    },

    created() {
        console.log('fff', this.fileList)
    },

    methods: {
        // 上传图片
        onChange(file) {
            var formData = new FormData()
            formData.append("file", file.raw)
            if (this.code != null) formData.append("code", this.code)
            if (this.parentId != null) formData.append("parentId", this.parentId)
            this.loading = true
            //调用上传文件接口
            uploaderWithCode(formData).then(({ data }) => {
                console.log('data', data)
                this.fileList.push({
                    id: data.id,
                    url: 'http://192.168.1.88:88' + data.url
                })
                this.$emit('input', this.fileList)
            }).catch(err => {
                this.fileList.splice(this.fileList.length - 1, 1)
            }).finally(() => {
                this.loading = false
            })
        },

        // 预览图片
        onPreview(file) {
            this.urlView = file.url
            this.urlVisible = true
        },

        // 删除图片
        onRemove(file, fileList) {
            const filePath = file.url
            const i = this.fileList.findIndex(x => x.url.indexOf(filePath))
            this.fileList.splice(i, 1)
            this.$emit('input', this.fileList)
        },

        // 上传图片超过限制
        onExceed(file) {
            this.$message.error(`最多只能上传${this.limit}张图片`)
        },
    }
}

</script>

<style scoped>
/deep/.maxHidden .el-upload--picture-card {
    display: none;
}

/deep/ .el-upload-list__item.is-ready {
    display: none;
}
</style>
