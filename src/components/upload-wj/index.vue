<template>
  <div class="UploadFile-container">
    <template>
      <div class='UploadFile-container-main noUpload'>
        <el-upload v-bind="$attrs" action="#" :file-list="fileList" :show-file-list="false" v-if="!detailed" :on-change="onChange" :auto-upload="false" multiple :on-progress="onProgress" accept=".jpg, .jpeg, .png, .xls, .xlsx, .doc, .docx, .txt, .pdf, .MPF" :headers="{
                        'token': `${token}`
                    }">
          <el-button size="small" type="primary" icon="el-icon-upload" style="margin-top:10px" v-if="!disabled">点击上传</el-button>
          <el-button size="small" slot="tip" type="primary" icon="el-icon-upload" style="margin-top:10px" disabled v-else>点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传不超过{{ fileSize }}{{ sizeUnit }}的{{ acceptText }}文件</div>
        </el-upload>
        <div v-else class="upload-list">
          <p>附件列表</p>
        </div>
        <div v-if="uploadlist">
          <el-tooltip class="item" content="切换缩略模式" placement="bottom" effect="light" v-if="switchlist">
            <div class="getSwitchList-p" @click="getSwitchList()">
              <img src="@/assets/images/a1.png" alt="">
            </div>
          </el-tooltip>
          <el-tooltip class="item" content="切换列表模式" placement="bottom" effect="light" v-else>
            <div class="getSwitchList-p" @click="getSwitchList()">
              <img src="@/assets/images/a2.png" alt="">
            </div>
          </el-tooltip>
        </div>
      </div>
    </template>
    <template>
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
        <el-table ref="dataTable" :data="fileList" style="margin-top: 5px;" v-loading="loading" v-if="switchlist" :header-cell-style="{background:'#f5f7fa'}">
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
              <el-button size="mini" type="text" @click="handlePreview(scope.row)">查看
              </el-button>
              <el-button size="mini" type="text" @click="handleClick(scope.row)">下载
              </el-button>
              <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleRemove(scope.$index)" :disabled="disabled">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="uploadlist" v-else>
          <ul class="ul-upload" v-loading="loading">
            <li class="li-upload" v-for="(item, index) in fileList" :key="index">
              <el-dropdown style="margin-left: 72px;opacity: 0;" class="el-droupload" size="mini">
                <el-link icon="icon-ym el-icon-more" :underline="false" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handlePreview(item)"><i class="el-icon-view"></i>查看</el-dropdown-item>
                  <el-dropdown-item @click.native="handleClick(item)"><i class="el-icon-download"></i>下载</el-dropdown-item>
                  <el-dropdown-item @click.native="handleRemove(index)" v-if="!disabled"><i class="el-icon-close"></i>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <img src="@/assets/images/upload1.png" alt="" class="upload_img">
              <p class="li-upload-p1">{{ item.name }}</p>
              <p class="li-upload-p2">{{ item.fileSize | toFileSize() }}</p>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <Preview :visible.sync="previewVisible" :file="activeFile" />
  </div>
</template>

<script>
import { getDownloadUrl } from '@/api/common'
import Preview from './Preview'
import { uploaderWithCode } from '@/api/equipment'
import { mapState } from 'vuex'
const units = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
}
export default {
  components: { Preview },
  props: {
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
    }
  },
  data() {
    return {
      previewVisible: false,
      loading: false,
      fileList: this.value,
      activeFile: {},
      switchlist: true
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
    }
  },
  created() {
    // console.log('fff', this.fileList)
  },

  methods: {
    getSwitchList() {
      this.switchlist = !this.switchlist
    },
    onProgress() { },
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
      uploaderWithCode(formData).then(({ data }) => {
        this.fileList.push({
          name: file.name,
          fileSize: file.size,
          filename: data.filename,
          id: data.id,
          url: data.url
        })
        this.$emit('input', this.fileList)
      }).catch(err => {
        this.$message.error(`当前文件上传失败`)
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
/deep/.maxHidden .el-upload--picture-card {
  display: none;
}

/deep/ .el-upload-list__item.is-ready {
  display: none;
}
</style>
<style lang="scss" scoped>
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