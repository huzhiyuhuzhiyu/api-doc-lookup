<template>
  <div class="app-container Document-container nohead">
    <el-tabs tab-position="left" style="height:100%" v-model="activeTab">
      <el-tab-pane name="allPanel">
        <span slot="label"><i class="icon-ym icon-ym-extend-folder-open"></i>全部文档</span>
        <div class="main JNPF-flex-main height-full">
          <div class="JNPF-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item v-if="levelList.length > 1">
                <a @click="jump(levelList[levelList.length - 2], levelList.length - 2)">返回上一级</a>
              </el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, i) in levelList" :key="i">
                <span v-if="i + 1 >= levelList.length">{{ item.fullName }}</span>
                <a v-else @click="jump(item, i)">{{ item.fullName }}</a>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <SwitchListAndFilter @command="filterExtHandler" :switch-list.sync="allSwitchList" :current-ext.sync="currentExt" :file-ext-filter-option="fileExtFilterOption"/>
          </div>
          <el-row class="JNPF-common-search-box searchWrapper">
              <SearchPlane
                  :loading.sync="searchPlaneLoading"
                  class="search-com"
                  :searchDropDownList="allSearchDropDownList"
                  @search-change="searchChange"
                  @item-click="searchItemClick"
                  :list="searchList"
                  :keyword.sync="keyword"
              ></SearchPlane>
             <div style="width: 250px">
                 <el-button style="margin-left: 10px" @click="addFolder()">新建文件夹</el-button>
                 <el-button type="primary" icon="el-icon-upload2" @click="uploadFile()">上传文件</el-button>
             </div>
          </el-row>
          <div class="height-full">
            <JNPF-table  class="table-style" v-if="allSwitchList" v-loading="listLoading" :data="list" empty-text="该文件夹为空" size="mini">
              <el-table-column prop="fullName" label="文件名" custom-column>
                <template slot-scope="scope">
                          <span v-if="scope.row.type" class="pointer" @click="listItemClick(scope.row)" >
                            <i :class='"icon-ym " + toFileExt(scope.row.fileExtension) + " i-default"' />
                            {{ scope.row.fullName }}
                          </span>
                          <span class='cursor-pointer' v-else @click="openFolder(scope.row)">
                            <i class='icon-ym icon-ym-extend-folder text-warning' />
                            {{ scope.row.fullName }}
                          </span>
                </template>
              </el-table-column>
              <el-table-column prop="isShare" label="共享文件" width="90px">
                <template slot-scope="scope">
                    <div class="flex-row justify-center align-center">
                        <span v-if="scope.row.type && scope.row.isShare" title='共享文件'><i
                            class="icon-ym icon-ym-extend-thumbs-up i-default"></i></span>
                    </div>

                </template>
              </el-table-column>
<!--              <el-table-column prop="fileSize" label="大小">-->
<!--                <template slot-scope="scope">{{ scope.row.fileSize | toFileSize() }}</template>-->
<!--              </el-table-column>-->
              <el-table-column prop="creatorTime" label="创建日期" width="200"/>
              <el-table-column label="操作" fixed="right" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="handleDownLoad(scope.row.id)"
                    :disabled="!scope.row.type">下载</el-button>
                  <el-button size="mini" type="text" class="JNPF-table-delBtn"
                    @click="handleDel(scope.$index, scope.row.id)" v-if="scope.row.canEdit">删除</el-button>
                  <el-dropdown v-if="scope.row.canEdit">
                    <el-button type=" text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="shareFolder(scope.row.id)" v-if="scope.row.type">
                        共享
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="getFolder(scope.row.id)">重命名
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="moveTo(scope.row.id, scope.row.parentId)">
                        移动到
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </JNPF-table>
            <GridFileList v-loading="gridFileListLoading" class="table-style" v-else @item-click="listItemClick" @command="allItemCommandHandler"  :list="list" :file-options="allFileOptions"></GridFileList>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="shareoutPanel">
        <span slot="label"><i class="icon-ym icon-ym-extend-thumbs-up"></i>我的共享</span>
        <div class="main JNPF-flex-main height-full">
          <div class="JNPF-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item>我的共享</el-breadcrumb-item>
            </el-breadcrumb>
              <SwitchListAndFilter @command="filterExtHandler" :switch-list.sync="shareSwitchList" :current-ext.sync="currentExt" :file-ext-filter-option="fileExtFilterOption"/>

          </div>
          <el-row class="JNPF-common-search-box searchWrapper">
              <SearchPlane
                  :loading.sync="searchPlaneLoading"
                  class="width-full"
                  :searchDropDownList="otherSearchDropDownList"
                  @search-change="searchChange"
                  @item-click="searchItemClick"
                  :list="searchList"
                  :keyword.sync="keyword"
              ></SearchPlane>
          </el-row>
          <div class="height-full">
            <JNPF-table   class="table-style" v-if="shareSwitchList"  v-loading="listLoading" :data="list" empty-text="该文件夹为空" size="mini">
              <el-table-column prop="fullName" label="文件名">
                <template slot-scope="scope">
                    <span class="pointer" @click="listItemClick(scope.row)">
                           <i :class='"icon-ym " + toFileExt(scope.row.fileExtension) + " i-default"' />
                            {{ scope.row.fullName }}
                    </span>

                </template>
              </el-table-column>
              <el-table-column prop="fileSize" label="大小" width="90">
                <template slot-scope="scope">{{ scope.row.fileSize | toFileSize() }}</template>
              </el-table-column>
              <el-table-column prop="shareTime" label="共享日期" width="180">
                <template slot-scope="scope">
                  <div>{{ jnpf.dateTimeString(scope.row.shareTime) }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" class="JNPF-table-delBtn"
                    @click="unshare(scope.$index, scope.row.id)">取消共享</el-button>
                </template>
              </el-table-column>
            </JNPF-table>
            <GridFileList class="table-style" v-else @command="shareItemCommandHandler" @item-click="listItemClick"  :list="list" :file-options="shareFileOptions"></GridFileList>

          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="sharetomePanel">
        <span slot="label"><i class="icon-ym icon-ym-extend-share"></i>共享给我</span>
        <div class="main JNPF-flex-main height-full">
          <div class="JNPF-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item>共享给我</el-breadcrumb-item>
            </el-breadcrumb>
            <SwitchListAndFilter @command="filterExtHandler" :switch-list.sync="shareToMeSwitchList" :current-ext.sync="currentExt" :file-ext-filter-option="fileExtFilterOption"/>

          </div>
            <el-row class="JNPF-common-search-box searchWrapper">
                <SearchPlane
                    :loading.sync="searchPlaneLoading"
                    class="width-full"
                    :searchDropDownList="otherSearchDropDownList"
                    @search-change="searchChange"
                    @item-click="searchItemClick"
                    :list="searchList"
                    :keyword.sync="keyword"
                ></SearchPlane>
            </el-row>
          <div class="height-full">
            <JNPF-table  class="table-style" v-if="shareToMeSwitchList" v-loading="listLoading" :data="list" empty-text="该文件夹为空" size="mini" >
              <el-table-column prop="fullName" label="文件名">
                <template slot-scope="scope">
                    <span class="pointer" @click="listItemClick(scope.row)">
                        <i :class='"icon-ym " + toFileExt(scope.row.fileExtension) + " i-default"' />
                  {{ scope.row.fullName }}
                    </span>

                </template>
              </el-table-column>
              <el-table-column prop="fileSize" label="大小" width="90">
                <template slot-scope="scope">{{ scope.row.fileSize | toFileSize() }}</template>
              </el-table-column>
              <el-table-column prop="shareTime" label="共享日期" width="200" />
              <el-table-column prop="creatorUserId" label="共享人员" width="120" />
              <el-table-column label="操作" fixed="right" width="70">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="handleDownLoad(scope.row.id)">下载
                  </el-button>
                </template>
              </el-table-column>
            </JNPF-table>
            <GridFileList v-loading="gridFileListLoading" @item-click="listItemClick" class="table-style" v-else @command="shareToMeItemCommandHandler"  :list="list" :file-options="shareToMeFileOptions"></GridFileList>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="trashPanel">
        <span slot="label"><i class="icon-ym icon-ym-extend-trash"></i>回收站</span>
        <div class="main JNPF-flex-main height-full">
          <div class="JNPF-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item>回收站</el-breadcrumb-item>
            </el-breadcrumb>
            <SwitchListAndFilter @command="filterExtHandler" :switch-list.sync="trashSwitchList" :current-ext.sync="currentExt" :file-ext-filter-option="fileExtFilterOption"/>

          </div>
            <el-row class="JNPF-common-search-box searchWrapper">
                <SearchPlane
                    :loading.sync="searchPlaneLoading"
                    class="width-full"
                    :searchDropDownList="otherSearchDropDownList"
                    @search-change="searchChange"
                    @item-click="searchItemClick"
                    :list="searchList"
                    :keyword.sync="keyword"
                ></SearchPlane>
            </el-row>
          <div class="height-full">
            <JNPF-table  class="table-style" v-if="trashSwitchList"  v-loading="listLoading" :data="list" empty-text="该文件夹为空" size="mini" >
              <el-table-column prop="fullName" label="文件名">
                <template slot-scope="scope">
                  <span v-if="scope.row.type"  class="pointer" @click="listItemClick(scope.row)">
                    <i :class='"icon-ym " + toFileExt(scope.row.fileExtension) + " i-default"' />
                    {{ scope.row.fullName }}
                  </span>
                  <span v-else>
                    <i class='icon-ym icon-ym-extend-folder text-warning' />
                    {{ scope.row.fullName }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="fileSize" label="大小" width="90">
                <template slot-scope="scope">{{ scope.row.fileSize | toFileSize() }}</template>
              </el-table-column>
              <el-table-column prop="deleteTime" label="删除日期" width="200" />
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="recovery(scope.$index, scope.row.id)">
                    还原</el-button>
                  <el-button size="mini" type="text" class="JNPF-table-delBtn"
                    @click="trashDel(scope.$index, scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </JNPF-table>
            <GridFileList v-loading="gridFileListLoading" class="table-style" v-else  @item-click="listItemClick" @command="trashItemCommandHandler"  :list="list" :file-options="trashFileOptions"></GridFileList>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <userBox v-if="userBoxVisible" ref="userBox" @refresh="initData" />
    <folderTree v-if="folderTreeVisible" ref="folderTree" @refresh="initData" />
    <fileUploader ref="fileUploader" :parentId="parentId" @fileSuccess="fileSuccess" />
      <el-dialog
          :visible.sync="previewVisible"
          top="5vh"
          width="80%">
          <Detail @close="previewVisible = false" style="height: 90vh" ref="detail"></Detail>
      </el-dialog>
      <Preview  class="search-left" :visible.sync="previewVisible" :file="previewFile" />
  </div>
</template>

<script>
import moment from 'moment'
import { AllList, Create, Delete, Download, DocumentInfo, ShareCancel, ShareOutList, ShareTomeList, TrashDelete, TrashList, TrashRecovery, Update } from '@/api/extend/document'
import userBox from './UserBox'
import folderTree from './FolderTree'
import FileUploader from './fileUploader'
import {
    excelSuffix,
    imgSuffix,
    isFile,
    mindSuffix,
    pdfSuffix,
    txtSuffix, Type2SuffixArr,
    wordSuffix
} from "@/views/drawingDocument/document/utils";
import Preview from "@/components/upload-wj/Preview.vue";
import {getFilePreviewUrl} from "@/views/esop/fileUpload/utils";
const ALL_TEXT ='全部'

const fileExtFilterOption =Object.freeze( [
    {
        text:ALL_TEXT,
        icon:'zgt-ifont-quanbu'
    },
    {
      text:'txt',
      icon:'zgt-ifont-txt'
    },
    {
        text:'pdf',
        icon:'zgt-ifont-pdf'
    },
    {
        text:'word',
        icon:'zgt-ifont-doc'
    },
    {
        text:'excel',
        icon:'zgt-ifont-excel'
    },
    {
        text:'ppt',
        icon:'zgt-ifont-ppt'
    },
    {
        text:'图片',
        icon:'zgt-ifont-tupian'
    }, {
        text:'思维导图',
        icon:'zgt-ifont-suolvetu-siweidaotu'
    },
])
const TIME_OPTION ={
    "NO_LIMIT":'不限时间',
    "ONE_WEEK":'最近七天',
    "ONE_MONTH":'最近一个月',
    "TOW_MONTH":'最近两个月',
    "THREE_MONTH":'最近三个月'
}
function getBeforeDate(n){
    const date = new Date()
    date.setDate(date.getDate() - n)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
}

function timeOptionHandler(timeOption){
    const data ={
        start:'',
        end: new Date()
    }

    if(timeOption === TIME_OPTION.NO_LIMIT){
        data.end =''
        return data
    }
    switch (timeOption){
        case TIME_OPTION.ONE_WEEK:
            data.start = getBeforeDate(7)
            break;
        case TIME_OPTION.ONE_MONTH:
            data.start = getBeforeDate(30)
            break;
        case TIME_OPTION.TOW_MONTH:
            data.start = getBeforeDate(60)
            break;
        case TIME_OPTION.THREE_MONTH:
            data.start = getBeforeDate(90)
            break;
    }
    data.start= moment(data.start).format('YYYY-MM-DD HH:mm:ss')
    data.end = moment(data.end).format('YYYY-MM-DD HH:mm:ss')
    return data
}



const FILE_EXT_OPTION=fileExtFilterOption.reduce((acc,cur)=>{
    acc[cur.text] = cur.text
    return acc
},{})
function fileExtOptionHandler(ext){
    if(ext === FILE_EXT_OPTION[ALL_TEXT]){
        return ''
    }
    switch (ext){
        case '图片':
            return 'pic'
        case '思维导图':
            return 'mindMap'
        default:
            return ext
    }
}
const FILE_CATEGORY_OPTION={
    "all":'全部',
    "share":'我的共享',
    "shareToMe":'共享给我'
}
function fileCategoryOptionHandler(category){
    switch (category){
        case FILE_CATEGORY_OPTION.all:
            return ''
        case FILE_CATEGORY_OPTION.share:
            return 'share'
        case FILE_CATEGORY_OPTION.shareToMe:
            return 'shareToMe'
        default:
            return ''
    }
}
const TIME_OPTION_FLAG ='time';
const FILE_EXT_OPTION_FLAG ='fileType';
const FILE_CATEGORY_OPTION_FLAG ='documentType';
const FILE_OPERATE ={
    DOWNLOAD:'DOWNLOAD',
    DELETE:'DELETE',
    SHARE:'SHARE',
    RENAME:'RENAME',
    MOVE:'MOVE',
    UNSHARE:'UNSHARE',
    RECOVERY:'RECOVERY',
    TRASH_DEL:'TRASH_DEL'
}



export default {
  name: 'extend-document',
  components: {
      Preview,
    SearchPlane:()=>import('@/views/drawingDocument/document/SearchPlane.vue'),
    Detail:()=>import('@/views/extend/documentPreview/Detail.vue') ,userBox, folderTree, FileUploader,GridFileList:()=>import('./GridFileList'),
    SwitchListAndFilter:()=>import('./SwitchListAndFilter')
  },
  data() {
    return {
      gridFileListLoading:false,
      previewVisible:false,
      previewFile:{
          name:'',
          filename:'',
          url:''
      },
      userBoxVisible: false,
      folderTreeVisible: false,
      detailVisible: false,
      activeTab: 'allPanel',
      keyword: '',
      parentId: '0',
      listLoading: true,
      list: [],
      levelList: [{
        id: '0',
        fullName: '全部文档'
      }],
      allSwitchList: false,
      shareSwitchList:false,
      shareToMeSwitchList:false,
      trashSwitchList:false,
      fileExtFilterOption,
      currentExt:'',
      searchFocus:false,
      searchPlaneTransform:'scale(0)',
      allSearchDropDownList:[
          {
              currentChoose:TIME_OPTION.NO_LIMIT,
              defaultChoose:TIME_OPTION.NO_LIMIT,
              option:TIME_OPTION,
              flag:TIME_OPTION_FLAG
          },
          {
              currentChoose:FILE_EXT_OPTION[ALL_TEXT],
              defaultChoose:FILE_EXT_OPTION[ALL_TEXT],
              option:FILE_EXT_OPTION,
              flag:FILE_EXT_OPTION_FLAG
          },
          {
              currentChoose:FILE_CATEGORY_OPTION.all,
              defaultChoose:FILE_CATEGORY_OPTION.all,
              option:FILE_CATEGORY_OPTION,
              flag:FILE_CATEGORY_OPTION_FLAG
          }
      ],
      otherSearchDropDownList:[
          {
              currentChoose:TIME_OPTION.NO_LIMIT,
              defaultChoose:TIME_OPTION.NO_LIMIT,
              option:TIME_OPTION,
              flag:TIME_OPTION_FLAG
          },
          {
              currentChoose:FILE_EXT_OPTION[ALL_TEXT],
              defaultChoose: FILE_EXT_OPTION[ALL_TEXT],
              option:FILE_EXT_OPTION,
              flag:FILE_EXT_OPTION_FLAG
          },
      ],
      searchList:[],
      allFileOptions:[
          {
              text:'下载',
              value:FILE_OPERATE.DOWNLOAD,
              disabled:item=>!item.type
          },
          {
              text:'删除',
              value:FILE_OPERATE.DELETE,
              isShow:item=>item.canEdit,
          },
          {
              text:'共享',
              value:FILE_OPERATE.SHARE,
              isShow:item=>item.canEdit && item.type
          },
          {
              text:'重命名',
              value:FILE_OPERATE.RENAME,
              isShow:item=>item.canEdit
          },
          {
              text:'移动到',
              value:FILE_OPERATE.MOVE,
              isShow:item=>item.canEdit
          }
      ],
      shareFileOptions:[
         {
            text:'取消共享',
            value:FILE_OPERATE.UNSHARE,
         }
      ],
      shareToMeFileOptions:[
         {
             text:'下载',
             value:FILE_OPERATE.DOWNLOAD,
         }
      ],
      trashFileOptions:[
          {
              text:'还原',
              value:FILE_OPERATE.RECOVERY,
          },
          {
              text:'删除',
              value:FILE_OPERATE.TRASH_DEL,
          }
      ],
      searchPlaneLoading:false,
      listCopy:[]

    }
  },
  watch: {
    activeTab(val) {
      if (val === 'allPanel') {
        this.levelList = [{
          id: "0",
          fullName: '全部文档'
        }]
        this.parentId = "0"
      }
      this.reset()
    }
  },
  created() {
    this.initData()
  },
  methods: {
   getArrayItem(index,count){
     return this.list.slice(index,index+count)
   },
   listSplice(index,count){
       const ids =this.getArrayItem(index,count).map(item=>item.id)
       this.list.splice(index,count)
       this.listCopy = this.listCopy.filter(item=>!ids.includes(item.id))
   },
   async searchChange(data){
        if(data.keyword === ''){
           return this.searchList = []
        }
        this.searchPlaneLoading = true
        const { start,end }= timeOptionHandler(data[TIME_OPTION_FLAG])
        const fileType = fileExtOptionHandler(data[FILE_EXT_OPTION_FLAG])
        const documentType = fileCategoryOptionHandler(data[FILE_CATEGORY_OPTION_FLAG])
        const params ={
            keyword:data.keyword,
            start,
            end,
            fileType,
            parentId:this.parentId,
            documentType,
            subsetFlag:true
        }

        switch (this.activeTab){
            case "shareoutPanel":
                params.documentType = 'share'
                break;
            case "sharetomePanel":
                params.documentType = 'shareToMe'
                break;
            case "trashPanel":
                params.documentType = 'trash'
                break;

        }
        try {
           const res = await AllList(params)
           this.searchList = res.data.list.filter(item=>isFile(item))
        }catch (e) {
            console.error(e)
        }finally {
           this.searchPlaneLoading = false
        }

    },
    searchItemClick({item,position,hideSearchPanel}){
        if(position === 'right'){
            const sourceName = item.source.split('/')
            const sourceId = item.sourceId.split('/')
            sourceId[0] = '0'
            this.levelList = sourceName.map((fullName,id)=>({
                id:sourceId[id],
                fullName
            }))
            this.parentId = sourceId[sourceId.length-1]
            hideSearchPanel()
            return this.reset()
        }
        return this.listItemClick(item)
    },
    async listItemClick(item){
        console.log(item)
        if(!isFile(item)){
          return this.openFolder(item)
        }
        this.previewFile = {
            name:item.fullName,
            filename:item.filePath,
            url: getFilePreviewUrl(item.filePath)
        }
        this.previewVisible = true
    },

    allItemCommandHandler(command, {id,parentId},index){
        switch (command) {
            case FILE_OPERATE.DOWNLOAD:
                return this.handleDownLoad(id)
            case FILE_OPERATE.DELETE:
                return this.handleDel(index,id)
            case FILE_OPERATE.SHARE:
                return this.shareFolder(id)
            case FILE_OPERATE.RENAME:
                return this.getFolder(id)
            case FILE_OPERATE.MOVE:
                return this.moveTo(id,parentId)
            default:
                break;
        }
    },
    shareItemCommandHandler(command, {id,parentId},index){
        switch (command) {
            case FILE_OPERATE.UNSHARE:
                return this.unshare(index,id)
            default:
                break;
        }
    },
    shareToMeItemCommandHandler(command, {id,parentId},index){
        switch (command) {
            case FILE_OPERATE.DOWNLOAD:
                return this.handleDownLoad(id)
            default:
                break;
        }
    },
    trashItemCommandHandler(command, {id,parentId},index){
        switch (command) {
            case FILE_OPERATE.RECOVERY:
                return this.recovery(index,id)
            case FILE_OPERATE.TRASH_DEL:
                return this.trashDel(index,id)
            default:
                break;
        }
    },

    filterExtHandler(command){
        if(command === ALL_TEXT){
           this.currentExt= ''
           return this.list = this.listCopy
        }
        this.currentExt= command
        const suffixArr = Type2SuffixArr.get(command)
        if(suffixArr && suffixArr.length){
          return this.list = this.listCopy.filter(item=>suffixArr.includes(item.fileExtension))
        }
    },
    reset() {
      this.list = []
      this.listCopy = []
      this.searchList = []
      this.keyword = ''
      this.currentExt = ''

      this.otherSearchDropDownList.forEach(item=>{
          item.currentChoose = item.defaultChoose
      })
      this.allSearchDropDownList.forEach(item=>{
          item.currentChoose = item.defaultChoose
      })
      this.initData()
    },
    async initData() {
      // this.listLoading = true
      // this.gridFileListLoading = true
      // let data = { keyword: this.keyword }
      // if (this.activeTab === 'allPanel') {
      //   data = { ...data, parentId: this.parentId }
      //   AllList(data).then(res => {
      //     this.list = res.data.list
      //     this.listCopy = res.data.list
      //     this.listLoading = false
      //     this.gridFileListLoading = true
      //   })
      // }
      // if (this.activeTab === 'shareoutPanel') {
      //   ShareOutList(data).then(res => {
      //     this.list = res.data.list
      //     this.listCopy = res.data.list
      //     this.listLoading = false
      //   })
      // }
      // if (this.activeTab === 'sharetomePanel') {
      //   ShareTomeList(data).then(res => {
      //     this.list = res.data.list
      //     this.listCopy = res.data.list
      //     this.listLoading = false
      //   })
      // }
      // if (this.activeTab === 'trashPanel') {
      //   TrashList(data).then(res => {
      //     this.list = res.data.list
      //     this.listCopy = res.data.list
      //     this.listLoading = false
      //   })
      // }
        this.listLoading = true
        this.gridFileListLoading = true
        let data = { keyword: this.keyword }
        let api = AllList
        switch (this.activeTab) {
            case "allPanel":
              data.parentId= this.parentId
              break;
            case "shareoutPanel":
                api = ShareOutList
                break;
            case "sharetomePanel":
                api = ShareTomeList
                break;
            case "trashPanel":
                api = TrashList
                break;
        }
        try {
            const res =await api(data)
            this.list = res.data.list
            this.listCopy = res.data.list
        }catch (e) {
            console.error(e)
        }finally {
            this.listLoading = false
            this.gridFileListLoading = false
        }




    },
    search() {
      this.initData()
    },
    handleDel(index, id) {
      this.$confirm('您确定要把所选文件放入回收站, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
        // this.list.splice(index, 1)
        this.listSplice(index,1)
        this.$message({
            type: 'success',
            message: res.msg
          })

        })
      }).catch(() => { })
    },
    unshare(index, id) {
      this.$confirm('您确定要取消共享, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        ShareCancel(id).then(res => {
          //this.list.splice(index, 1)
          this.listSplice(index,1)
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => { })
    },
    recovery(index, id) {
      this.$confirm('您确定要还原选中的文件?', '提示', {
        type: 'warning'
      }).then(() => {
        TrashRecovery(id).then(res => {
          // this.list.splice(index, 1)
            this.listSplice(index,1)
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => { })
    },
    trashDel(index, id) {
      this.$confirm('文件删除后将无法恢复，您确定要彻底删除所选文件吗?', '提示', {
        type: 'warning'
      }).then(() => {
        TrashDelete(id).then(res => {
          // this.list.splice(index, 1)
          this.listSplice(index,1)
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => { })
    },
    moveTo(id, parentId) {
      this.folderTreeVisible = true
      this.$nextTick(() => {
        this.$refs.folderTree.init(id, parentId)
      })
    },
    shareFolder(id) {
      this.userBoxVisible = true
      this.$nextTick(() => {
        this.$refs.userBox.init(id)
      })
    },
    getFolder(id) {
      DocumentInfo(id).then(res => {
        this.addFolder(res.data)
      })
    },
    // 新建文件夹
    addFolder(info) {
      let inputValue = ""
      if (info) { inputValue = info.fullName }
      let title = info ? (info.type ? '重命名文件' : '重命名文件夹') : '新建文件夹'
      this.$prompt('', title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '输入名称',
        inputErrorMessage: '请正确输入文件夹名称',
        inputValue: inputValue,
        // inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        closeOnClickModal: false
      }).then(({ value }) => {
        let data = {
          type: info && info.type ? info.type : "0",
          parentId: this.parentId,
          fullName: value
        }
        if (info && info.id) {
          Object.assign(data, { id: info.id })
          Update(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.initData()
          })
        } else {
          Create(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.initData()
          })
        }
      }).catch(() => { })
    },
    uploadFile() {
      this.$refs.fileUploader && this.$refs.fileUploader.openUploader()
    },
    fileSuccess() {
      this.reset()
    },
    // 下载文件
    handleDownLoad(id) {
      Download(id).then(res => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    // 打开文件夹
    openFolder(item) {
      this.parentId = item.id
      this.levelList.push(item)
      this.reset()
    },
    jump(item, i) {
      this.parentId = item.id
      this.reset()
      this.levelList = this.levelList.slice(0, i + 1)
    },
    toFileExt(ext) {
      if (ext) ext = ext.replace('.', '')
      if (ext == "doc" || ext == "docx") {
        return "icon-ym-file-word"
      }
      if (ext == "xls" || ext == "xlsx") {
        return "icon-ym-file-excel"
      }
      if (ext == "ppt" || ext == "pptx") {
        return "icon-ym-file-ppt"
      }
      if (ext == "rar" || ext == "zip") {
        return "icon-ym-file-zip"
      }
      if (ext == "txt" || ext == "log") {
        return "icon-ym-file-text"
      }
      if (ext == "html" || ext == "cs" || ext == "xml") {
        return "icon-ym-file-code"
      }
      if (ext == "gif" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "png") {
        return "icon-ym-file-image1"
      }
      if (ext == "pdf") {
        return "icon-ym-file-pdf"
      }
      if (ext == "mp3") {
        return "icon-ym-file-audio"
      }
      if (ext == "mp4") {
        return "icon-ym-file-movie"
      }
      return "icon-ym-file-blank"
    }
  }
}
</script>
<style lang="scss" scoped>
.table-style{
    border: 1px solid #EBEEF5;
    height: 100%;
}
.search-com{
    width: calc(100% - 250px)
}
::v-deep .el-tabs__content{
    height: 100%;
}
::v-deep .el-tab-pane{
    height: 100%;
}

.Document-container {
  position: relative;

  .JNPF-common-search-box {
    margin-bottom: 0;
    padding-left: 0;
  }
    .searchWrapper{
        padding: 0;
        margin: 5px 0;
        display: flex;
        align-items: center;

    }

  .JNPF-common-head {
    padding: 12px 0 10px;
  }

  >>>.el-tabs__item {
    text-align: left !important;
    width: 160px;

    .icon-ym {
      font-size: 14px;
      margin-right: 8px;
    }
  }

  >>>.el-tabs__content {
    height: 100%;

    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }

  .main {
    height: 100%;

    .icon-ym {
      font-size: 14px;
    }

    .cursor-pointer {
      cursor: pointer;
    }
  }

}
</style>
