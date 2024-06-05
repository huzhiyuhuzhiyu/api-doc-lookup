<template>
  <div>
    <el-drawer title="资源配置" :visible.sync="drawer" :direction="direction" :wrapperClosable="false"
      :before-close="handleClose" size="40%" class="JNPF-common-drawer">
      <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
        <div v-if="type !== 'look'">
          <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus"
            :disabled="type == 'look' ? true : false" @click="openSeleceProcessDialog(personData.length, activeName)">选择{{
              actTitle }}</el-button>|
          <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
            :disabled="type == 'look' ? true : false" icon="el-icon-delete"
            @click="batchDelete(activeName)">批量删除</el-button>|

        </div>
        <el-tab-pane class="custom-tab-pane" label="人员" name="personnel">
          <!-- 人员配置 -->
          <JNPF-table :hasC="type != 'look'" @selection-change="handelepersonInfoData" :data="personData" width="100%">
            <el-table-column prop="resourceId" label="人员名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.resourceName" placeholder="请输入人员名称" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="resourceType" label="人员工号">
              <template slot-scope="scope">
                <el-input disabled v-model="scope.row.jobNumber" placeholder="" />
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="90">
              <template slot-scope="scope">
                <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                  @click="handlerDelete(scope.$index, 'personnel')">删除</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
        </el-tab-pane>

        <el-tab-pane class="custom-tab-pane" label="班组" name="work_group">
          <JNPF-table :hasC="type != 'look'" @selection-change="handeleworkgroupInfoData" :data="classData"
            style="width: 100%">
            <el-table-column prop="resourceId" label="班组" ref="workGroup">
              <template slot-scope="scope">
                <el-input v-model="scope.row.resourceName" placeholder="请输入班组名称" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="resourceType" label="班组编码">
              <template slot-scope="scope">
                <el-input v-model="scope.row.resourceCode" placeholder="请输入班组编码" disabled />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90">
              <template slot-scope="scope">
                <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                  @click="handlerDelete(scope.$index, 'work_group')">删除</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
        </el-tab-pane>

        <el-tab-pane class="custom-tab-pane" label="设备" name="device">
          <JNPF-table :hasC="type != 'look'" @selection-change="handeledeviceInfoData" :data="equipData"
            style="width: 100%">
            <el-table-column prop="resourceId" label="设备">
              <template slot-scope="scope">
                <el-input v-model="scope.row.resourceName" placeholder="请输入设备名称" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="resourceType" label="设备编码">
              <template slot-scope="scope">
                <el-input v-model="scope.row.resourceCode" placeholder="请输入设备编码" disabled />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90">
              <template slot-scope="scope">
                <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                  @click="handlerDelete(scope.$index, 'device')">删除</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
        </el-tab-pane>

        <el-tab-pane class="custom-tab-pane" label="工具" name="tool">
          <JNPF-table :hasC="type != 'look'" @selection-change="handeletoolInfoData" :data="toolData" style="width: 100%">
            <el-table-column prop="resourceId" label="工具">
              <template slot-scope="scope">
                <el-input v-model="scope.row.resourceName" placeholder="请输入工具名称" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="resourceType" label="工具编码">
              <template slot-scope="scope">
                <el-input v-model="scope.row.resourceCode" placeholder="请输入工具编码" disabled />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90">
              <template slot-scope="scope">
                <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                  @click="handlerDelete(scope.$index, 'tool')">删除</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <div class="submit" v-if="type != 'look' ? true : false">
        <el-button type="primary" @click="submitForm('dataForm')">确定</el-button>
      </div> -->
      <div class="footer">
        <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button  type="primary" @click="submitForm('dataForm')" v-if="type != 'look' ? true : false">
          {{ $t('common.confirmButton') }}
        </el-button>
      </div>
    </el-drawer>

    <user-select v-if="personnelVisibled" ref="personnelRef"  multiple  style="width: 100%;"  @change="submit">
                    </user-select>

    <ComSelect-page  ref="ComSelect-page3" @change="WorkgroupSubmit" :tableItems="WorkgroupTableItems" title="选择班组" 
       :listMethod="getGroupList" :listRequestObj="WorkgroupRequestObj" :renderTree="false"
      :searchList="WorkgroupTableSearchList" :elementShow="false" multiple />
    <ComSelect-page  ref="ComSelect-page" @change="DeviceSubmit" :tableItems="DeviceTableItems" title="选择设备" treeTitle="设备分类"
      :methodArr="DeviceMethodArr" :listMethod="stateEquEquipment" :listRequestObj="DeviceRequestObj"
      :searchList="DeviceTableSearchList" :elementShow="false" multiple />
    <ComSelect-page  ref="ComSelect-page2" @change="ToolSubmit" :tableItems="ToolTableItems" title="选择工具" treeTitle="工具分类"
      :methodArr="ToolMethodArr" :listMethod="stateEquEquipment" :listRequestObj="ToolRequestObj"
      :searchList="ToolTableSearchList" :elementShow="false" multiple />
  </div>
</template>

<script>
import { getConditionUser } from '@/api/permission/user'
import { getGroupList, editEquEquipmentAll, getEquEquipmentList ,stateEquEquipment} from '@/api/basicData/index'
import {getcategoryTree} from '@/api/basicData/materialSettings'
import PersonnelDialog from './personnel-dialog.vue'

export default {
  components: {
    PersonnelDialog,

  },
  data() {
    return {
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      getGroupList,
      WorkgroupRequestObj: {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        state: 'enable'
      }, // 产品选择弹出框列表请求参数
      WorkgroupTableItems: [
        { prop: 'code', label: '班组编码', fixed: 'left' },
        { prop: 'name', label: '班组名称', fixed: 'left' },
      ], // 产品选择弹出框表单展示字段
      WorkgroupTableSearchList: [
        { prop: "code", label: "班组编码", type: 'input' },
        { prop: "name", label: "班组名称", type: 'input' }
      ], // 产品选择弹出框搜索条件
      stateEquEquipment,
      getcategoryTree,
      DeviceMethodArr: [
      { label: "设备", classAttribute: 'tool', method: getcategoryTree, requestObj: {  classAttribute: 'equipment' } },
      ], // 产品选择弹出框树状列表
      DeviceRequestObj: {
        classAttribute: "equipment",
        drawingNo: "",
     
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
        state:''
      }, // 产品选择弹出框列表请求参数
      DeviceTableItems: [
        { prop: 'code', label: '设备编码', fixed: 'left' },
        { prop: 'name', label: '设备名称', fixed: 'left' },
     
   
      ], // 产品选择弹出框表单展示字段
      DeviceTableSearchList: [
        { prop: "code", label: "设备编码", type: 'input' },
        { prop: "name", label: "设备名称", type: 'input' }
      ], // 产品选择弹出框搜索条件
      ToolMethodArr: [
      { label: "工具", classAttribute: 'tool', method: getcategoryTree, requestObj: {  classAttribute: 'tool' } },
      ], // 产品选择弹出框树状列表
      ToolRequestObj: {
        classAttribute: "tool",
        drawingNo: "",
     
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
        state:''
      }, // 产品选择弹出框列表请求参数
      ToolTableItems: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' },
     
   
      ], // 产品选择弹出框表单展示字段
      ToolTableSearchList: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' }
      ], // 产品选择弹出框搜索条件
      personnelVisibled: false,
      ToolVisibled: false,     //工具抽屉
      DeviceVisibled: false,  // 设备抽屉
      WorkgroupVisibled: false, // 班组抽屉
      actTitle: '人员',  //多选显示名称
      getGroupList,   //班组
      editEquEquipmentAll, //设备
      getEquEquipmentList, //工具
      drawer: false,
      direction: 'rtl',
      type: '',
      requestParam: {},
      personIndex: null,
      classIndex: null,
      equipIndex: null,
      toolIndex: null,
      activeName: 'personnel',
      personArr: [],
      classArr: [],
      equipArr: [],
      toolArr: [],
      personData: [],
      classData: [],
      equipData: [],
      toolData: [],
      routingId: '', //工艺路线id
      routingLineId: '',  // 工艺路线明细id
      recourceData: [],
    }
  },
  methods: {

    init(data, type,id) {
      console.log('资源===>',data,type,id )
      // this.dataForm = data
      this.type = type
      console.log(this.type);
      this.routingLineId = data[0].id
      this.routingId = id
      this.drawer = true
      // if (type == 'add') {
      if (data[0].bimRoutingProcessResourceVOList) {
        const filteredData = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'personnel')
        this.personData = filteredData
        console.log(filteredData, 'ren');
        this.personData.forEach((item, index) => {
          this.personData[index].resourceId = item.resourceId
          this.personData[index].jobNumber = item.jobNumber
          this.personData[index].recourceName = item.recourceName
          this.personData[index].routingId = this.routingId
          this.personData[index].resourceClass = item.resourceClass
        })

        const filteredData2 = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'work_group')
        this.classData = filteredData2
        this.classData.forEach((item, index) => {
          this.classData[index].resourceId = item.resourceId
          this.classData[index].resourceCode = item.resourceCode
          this.classData[index].recourceName = item.recourceName
          this.classData[index].resourceClass = item.resourceClass
        })

        const filteredData3 = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'device')
        this.equipData = filteredData3
        this.equipData.forEach((item, index) => {
          this.equipData[index].resourceId = item.resourceId
          this.equipData[index].resourceCode = item.resourceCode
          this.equipData[index].recourceName = item.recourceName
          this.equipData[index].resourceClass = item.resourceClass
        })

        const filteredData4 = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'tool')
        this.toolData = filteredData4
        this.toolData.forEach((item, index) => {
          this.toolData[index].resourceId = item.resourceId
          this.toolData[index].routingId = this.routingId
          this.toolData[index].resourceCode = item.resourceCode
          this.toolData[index].recourceName = item.recourceName
          this.toolData[index].resourceClass = item.resourceClass
        })
      }
      // }
      // if (type === 'edit' || type === 'look') {
      //   if (data[0].bimRoutingProcessResourceVOList) {
      //     const filteredData = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'personnel')
      //     this.personData = filteredData
      //     console.log(filteredData, 'ren');

      //     const filteredData2 = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'work_group')
      //     this.classData = filteredData2

      //     const filteredData3 = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'device')
      //     this.equipData = filteredData3

      //     const filteredData4 = data[0].bimRoutingProcessResourceVOList.filter(item => item.resourceType === 'tool')
      //     this.toolData = filteredData4
      //   }
      //   if (data[0].bimRoutingProcessResourceVOList && data[0].bimRoutingProcessResourceDTOList) {
      //     let dataAll = [...data[0].bimRoutingProcessResourceVOList, ...data[0].bimRoutingProcessResourceDTOList]
      //     console.log(dataAll, '都有');
      //     const filteredData = dataAll.filter(item => item.resourceType === 'personnel')
      //     this.personData = [...new Set(filteredData)]
      //     console.log(filteredData, 'ren');

      //     const filteredData2 = dataAll.filter(item => item.resourceType === 'work_group')
      //     this.classData = filteredData2

      //     const filteredData3 = dataAll.filter(item => item.resourceType === 'device')
      //     this.equipData = filteredData3

      //     const filteredData4 = dataAll.filter(item => item.resourceType === 'tool')
      //     this.toolData = filteredData4
      //   }
      // }



    },

    handleClick(tab, event) {
      this.activeName = tab.name
      if (this.activeName == 'personnel') {
        this.actTitle = '人员'
      }
      if (this.activeName == 'work_group') {
        this.actTitle = '班组'
      }
      if (this.activeName == 'device') {
        this.actTitle = '设备'
      }
      if (this.activeName == 'tool') {
        this.actTitle = '工具'
      }
    },
    // 可以多选
    openSeleceProcessDialog(e, type) {
      this.index = e
      this.types = type
      if (type === 'personnel') {
        this.personnelVisibled = true
        this.$nextTick(() => {
          this.$refs['personnelRef'].openDialog()
        })
      }
      if (type === 'work_group') {
        this.$nextTick(() => {
          this.$refs['ComSelect-page3'].openDialog()
        })
      }
      if (type === 'device') {
        // this.DeviceVisibled = true
        this.$nextTick(() => {
          this.$refs['ComSelect-page'].openDialog()
        })
      }
      if (type === 'tool') {
        this.$nextTick(() => {
          this.$refs['ComSelect-page2'].openDialog()
        })
      }


    },

    // 批量删除
    batchDelete(type) {
      // 遍历选中的行的数据
      if (type === 'personnel') {
        if (this.personArr.length < 1) {
          this.$message({
            message: "请选择你要删除的数据",
            type: "error",
            duration: 1500,
          })
        }
        for (let i = 0; i < this.personArr.length; i++) {
          const row = this.personArr[i];
          const index = this.personData.indexOf(row);
          if (index > -1) {
            this.personData.splice(index, 1); // 从tableData中删除选中的行
          }
        }
        this.personArr = []  // 清空选中的行的数据
      }
      if (type === 'work_group') {
        if (this.classArr.length < 1) {
          this.$message({
            message: "请选择你要删除的数据",
            type: "error",
            duration: 1500,
          })
        }
        for (let i = 0; i < this.classArr.length; i++) {
          const row = this.classArr[i];
          const index = this.classData.indexOf(row);
          if (index > -1) {
            this.classData.splice(index, 1); // 从tableData中删除选中的行
          }
        }
        this.classArr = []  // 清空选中的行的数据
      }
      if (type === 'device') {
        console.log('设备');
        console.log(this.equipData);
        console.log(this.equipArr);
        if (this.equipArr.length < 1) {
          this.$message({
            message: "请选择你要删除的数据",
            type: "error",
            duration: 1500,
          })
        }
        for (let i = 0; i < this.equipArr.length; i++) {
          const row = this.equipArr[i];
          const index = this.equipData.indexOf(row);
          if (index > -1) {
            this.equipData.splice(index, 1); // 从tableData中删除选中的行
          }
        }

        this.equipArr = []  // 清空选中的行的数据
      }
      if (type === 'tool') {
        if (this.toolArr.length < 1) {
          this.$message({
            message: "请选择你要删除的数据",
            type: "error",
            duration: 1500,
          })
        }
        for (let i = 0; i < this.toolArr.length; i++) {
          const row = this.toolArr[i];
          const index = this.toolData.indexOf(row);
          if (index > -1) {
            this.toolData.splice(index, 1); // 从tableData中删除选中的行
          }
        }
        this.toolArr = []  // 清空选中的行的数据
      }
    },
    // 选中人员的数据
    handelepersonInfoData(val) {
      console.log(val);
      this.personArr = val
    },
    // 选中班组的数据
    handeleworkgroupInfoData(val) {
      this.classArr = val
    },
    // 选中设备的数据
    handeledeviceInfoData(val) {
      console.log(val, '选中设备');
      this.equipArr = val
    },
    // 选中工具的数据
    handeletoolInfoData(val) {
      this.toolArr = val
    },
    // 人员数据
    submit(id, data) {
      console.log(data, '生产资源弹框传递数据');
      // let type = Array.isArray(data) ? 'Array' : 'Object'
      // if (type === 'Object') {}
      if (data.length === 0) {

      } else {
        let tempList = JSON.parse(JSON.stringify(this.personData))
        console.log(tempList,'sasdasdas');
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          const hasFlag = this.personData.find(i => item.id === i.resourceId)
          if (hasFlag) { hasItemList.push(item.fullName.split('/')[0]) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的人员：${hasItemList.join('、')}`)
        }
        this.personData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.fullName.split('/')[0],
            resourceClass:item.resourceClass ? item.resourceClass : '',
            jobNumber: item.jobNumber,
            resourceType: "personnel",
            routingId: this.routingId,
            routingLineId: this.routingLineId,
          };
        });
      }
      console.log(this.personData, '再次添加人员');
    },
    // 班组
    WorkgroupSubmit(id,data) {
      console.log(data, '班组');
      if (data.length === 0) {

      } else {
        let list = data.map(item => item.all)
        let tempList = JSON.parse(JSON.stringify(this.classData))
        let hasItemList = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          const hasFlag = this.classData.find(i => item.id === i.resourceId)
          if (hasFlag) { hasItemList.push(item.name) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的班组：${hasItemList.join('、')}`)
        }
        this.classData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.name,
            resourceCode: item.resourceCode ? item.resourceCode : item.code,
            resourceType: "work_group",
            routingId: this.routingId,
            routingLineId: this.routingLineId,
          };
        });
      }
    },
    // 设备
    DeviceSubmit(id,data) {
      console.log(data, '设备');
      if (data.length === 0) {

      } else {
        let list = data.map(item => item.all)
        let tempList = JSON.parse(JSON.stringify(this.equipData))
        let hasItemList = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          const hasFlag = this.equipData.find(i => item.id === i.resourceId)
          if (hasFlag) { hasItemList.push(item.name) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的设备：${hasItemList.join('、')}`)
        }
        this.equipData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.name,
            resourceCode: item.resourceCode ? item.resourceCode : item.code,
            resourceType: "device",
            routingId: this.routingId,
            routingLineId: this.routingLineId,
          };
        });
      }
      console.log(this.equipData, '设备数据');
    },
    // 工具
    ToolSubmit(id,data) {
      if (data.length === 0) {

      } else {
        let list = data.map(item => item.all)
        let tempList = JSON.parse(JSON.stringify(this.toolData))
        let hasItemList = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          const hasFlag = this.toolData.find(i => item.id === i.resourceId)
          if (hasFlag) { hasItemList.push(item.name) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的工具：${hasItemList.join('、')}`)
        }
        this.toolData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.name,
            resourceCode: item.resourceCode ? item.resourceCode : item.code,
            resourceType: "tool",
            routingId: this.routingId,
            routingLineId: this.routingLineId,
          };
        });
      }
      console.log(this.toolData, '工具数据');
    },


    // 删除
    handlerDelete(index, type) {
      if (type == 'personnel') {
        this.personData.splice(index, 1)
      } else if (type == 'work_group') {
        this.classData.splice(index, 1)
      } else if (type == 'device') {
        this.equipData.splice(index, 1)
      } else if (type == 'tool') {
        this.toolData.splice(index, 1)
      }
    },

    handleClose() {
      // this.submitForm()
      this.drawer = false
    },
    submitForm(formName) {
      console.log(this.personData, 'wwwww');
      let data = [
        ...this.personData,
        ...this.classData,
        ...this.equipData,
        ...this.toolData
      ]
      var msg = ''
      if (data.length === 0) {
        // this.drawer = true
        this.$emit('confirm', data)
      } else {
        data.forEach((item, index) => {
          if (item.resourceId == '') {
            this.$message.error('有添加项未添加')
            msg = 'error'
            this.drawer = true
          } else {
            msg = 'success'
          }
        })
        if (msg == 'success') {
          this.$message.success('配置成功')
          this.$emit('confirm', data)
        }
      }
      console.log(data, '121212');

    },
  }
}
</script>

<style scoped>
.submit {
  position: absolute;
  bottom: 20px;
  left: 50%;
}
::v-deep .el-drawer__header{
  font-size:16px !important;
}
::v-deep .is-stretch {
  display: block !important;
}
.footer {
    margin: 20px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
.el-tabs__nav.is-stretch /deep/ {
  min-width: none !important;
  display: flex;
  justify-content: flex-start;
}

.custom-tab-pane .el-tab-pane__content {
  width: 500px;
}

.el-tabs__active-bar /deep/ {
  width: 60px !important;
}

.el-tabs__header {
  max-width: 316px !important;
}

::v-deep .el-tabs__content {
  padding: 0px 10px !important;
}

::v-deep .el-tab-pane{
  height:75vh !important;
}
</style>