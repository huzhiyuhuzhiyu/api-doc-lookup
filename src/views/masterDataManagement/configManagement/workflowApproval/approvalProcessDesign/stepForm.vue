<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <!-- <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')"
          content="审批模版" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div> -->
      <!-- <div :class="['stepHeaders',btnType == 'look' ? 'noButtons' : '']"> -->
      <div class="stepHeader">
        <el-page-header @back="$emit('close', true)" content="流程设计" />
        <el-steps :active="activeStep" finish-status="success" simple class="steps">
          <el-step title="模版信息"></el-step>
          <el-step title="流程信息"></el-step>
        </el-steps>
        <div class="options">
          <el-button @click="prev" :disabled="activeStep <= 0">{{ $t('common.prev') }}</el-button>
          <el-button @click="next" :disabled="activeStep >= 1 || loading">{{ $t('common.next') }}
          </el-button>
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')" v-show="btnType != 'look'">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')" v-show="btnType != 'look'">
            保存并提交</el-button>
          <el-button @click="$emit('close', true)">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <!-- </div> -->
      <div class="main" v-loading="formLoading">
        <el-row type="flex" justify="center" align="middle" v-show="!activeStep" class="basic-box">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="10" class="basicForm">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="140px" @submit.native.prevent
              label-position="right">
              <el-form-item label="审批模板编码" prop="code">
                <el-input v-model="dataForm.code" :disabled="btnType == 'edit' || btnType === 'look'"
                  placeholder="请输入审批模板编码" maxlength="20" />
              </el-form-item>

              <el-form-item label="审批模板名称" prop="name">
                <el-input v-model="dataForm.name" :disabled="btnType === 'look'" placeholder="请输入审批模板名称" maxlength="20" />
              </el-form-item>


              <el-form-item label="审批管理员" prop="adminName">
                <!-- <el-input v-model="dataForm.adminId" placeholder="请输入审批管理员ID" maxlength="20" /> -->
                <ComSelect-list :isdisabled="btnType === 'look'" v-model="dataForm.adminName" ref="userRef"
                  placeholder="请选择审批管理员名称" auth @change="sureApprover" :title="'选择审批管理员名称'"
                  :dataFormatting="dataFormatting" :method="getApprovalAdministratorList" :requestObj="approvalObj"
                  :paramsObj="{}" />
              </el-form-item>


              <el-form-item label="审批业务" prop="approvalBusinessName">
                <!-- <el-input v-model="dataForm.approvalBusinessName" placeholder="请输入审批业务ID" maxlength="20" /> -->
                <ComSelect-list :isdisabled="btnType == 'edit' || btnType === 'look'"
                  v-model="dataForm.approvalBusinessName" placeholder="请选择审批业务" auth @change="changeBusine"
                  :title="'选择审批业务'" :method="getApprovalListPage" :requestObj="requestObj" :paramsObj="{}" />
              </el-form-item>




            </el-form>
          </el-col>
        </el-row>
        <workFlow :workFlowT="workFlowTemplate" v-show="activeStep" ref="workflowRef" :nodeConfig.sync="busNodeConfig" />
        <errorDialog :visible.sync="tipVisible" :list="tipList" />
      </div>
    </div>
  </transition>
</template>
<script>
import { getApprovalList, getApprovalListPage } from '@/api/basicData/approvalBusinessConditions'
import { getApprovalAdministratorList, checkApprovalCode, addApprovalTemplate, getApprovalDetail, updateApprovalTemplate, getApprovalDetailTree } from '@/api/basicData/approvalAdministrator'
import formValidate from "@/utils/formValidate";
import workFlow from '@/components/WorkFlow/setting.vue'
import errorDialog from '@/components/WorkFlow/dialog/errorDialog.vue'
import { mapMutations } from 'vuex'
export default {
  components: { workFlow, errorDialog },
  data() {
    return {
      getApprovalList,
      getApprovalListPage,
      getApprovalAdministratorList,
      formLoading: false,
      btnLoading: false,
      loading: false,
      btnType: '',
      activeStep: 0,
      dataForm: {
        adminId: "",
        adminName: "",
        approvalBusinessId: '',
        approvalBusinessName: '',
        documentStatus: '',
        code: "",
        id: '',
        name: "",
        state: "disabled"
      },
      approvalObj: {
        createByName: "",
        endTime: "",
        keyword: "",
        name: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: -1,
        startTime: ""
      },
      requestObj: {
        code: "",
        name: "",
        orderItems: [{
          asc: true,
          column: ""
        }],
        pageNum: 1,
        pageSize: -1
      },
      dataRule: {
        code: [
          { required: true, message: '请输入模版编码', trigger: 'blur' },
          { validator: formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkApprovalCode(value, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("审批模版编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur',
          }
        ],
        name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
        adminName: [{ required: true, message: '请选择审批管理员', trigger: 'change' }],
        approvalBusinessName: [{ required: true, message: '请选择审批业务', trigger: 'change' }],
      },
      workFlowTemplate: {},
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      tipList: [],
      tipVisible: false,
    }
  },
  methods: {
    ...mapMutations('workflow', ['SET_TABLE_ID', 'SET_IS_TRIED']),
    init(id, type) {
      this.btnType = type
      this.dataForm.id = id || ''
      if (this.dataForm.id) {
        if (this.btnType === 'copy') {
          getApprovalDetailTree(id).then(res => {
            console.log(res, '详情');
            this.dataForm = res.data.template
            this.dataForm.state = 'disabled'
            this.dataForm.documentStatus = ''
            this.dataForm.id = ''
            let data = res.data.tempLineTree.childNode
            if (data) {
              this.addNodeTypeAndNodeName(data)
              console.log(data);
              this.busNodeConfig.childNode = data
            }
          })
        } else {
          getApprovalDetailTree(id).then(res => {
            console.log(res, '详情');
            this.dataForm = res.data.template
            let data = res.data.tempLineTree.childNode
            if (data) {
              this.addNodeTypeAndNodeName(data)
              console.log(data);
              this.busNodeConfig.childNode = data
            }
          })
        }
      }
    },
    async next() {
      let submitFlag = await this.$refs['dataForm'].validate().catch(err => false)
      if (submitFlag) {
        this.activeStep = 1
        this.$nextTick(() => {
          this.$refs.workflowRef.initData(this.dataForm.id, this.btnType)
          console.log(this.workFlowTemplate);
          this.workFlowTemplate = {
            approvalBusinessId: this.dataForm.approvalBusinessId
          }
          this.$store.commit('workflow/SET_TABLE_ID', this.dataForm.approvalBusinessId)
        })
      }
    },
    prev() {
      this.activeStep = 0
    },
    // 审批管理员
    sureApprover(id, data) {
      console.log(data);
      this.$nextTick(() => { this.$refs['dataForm'].validateField('adminName') })
      if (data.length === 0) {
        this.dataForm.adminName = ''
        this.dataForm.adminId = ''
      } else {
        this.dataForm.adminName = data[0].name
        this.dataForm.adminId = data[0].all.personId
      }
    },
    // 选择业务
    changeBusine(id, data) {
      console.log(data);
      this.$nextTick(() => { this.$refs['dataForm'].validateField('approvalBusinessName') })
      if (data.length === 0) {
        this.dataForm.approvalBusinessName = ''
        this.dataForm.approvalBusinessId = ''
      } else {
        this.dataForm.approvalBusinessName = data[0].all.name
        this.dataForm.approvalBusinessId = data[0].all.id
      }
    },
    dataFormatting(res) {
      let treeData = res.data.records.map(item => {
        item.name = item.personName;
        return item;
      });
      return treeData
    },
    addNodeTypeAndNodeName(obj) {
      console.log(obj);
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? 1 : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''

                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    reErr({ childNode }) {
      console.log(childNode, 'errrrrrr');
      if (childNode) {
        let { nodeType, error, nodeName, conditionNodes, code, nodeUserList, approvalType } = childNode
        if (nodeType == 1) {
          if (approvalType != 'option') {
            if (!code || !nodeUserList.length) {
              this.tipList.push({ name: nodeName, nodeType: ["", "审核人", "抄送人"][nodeType] })
            }
          }
          this.reErr(childNode)
        } else if (nodeType == 2) {
          if (!code || !nodeUserList.length) {
            this.tipList.push({ name: nodeName, nodeType: ["", "审核人", "抄送人"][nodeType] })
          }
          this.reErr(childNode)
        } else if (nodeType == 3) {
          this.reErr(childNode)
        } else if (nodeType == 4) {
          this.reErr(childNode)
          for (var i = 0; i < conditionNodes.length; i++) {
            if (!conditionNodes[i].code || !conditionNodes[i].conditionList.length) {
              this.tipList.push({ name: conditionNodes[i].nodeName, nodeType: "条件" })
            }
            this.reErr(conditionNodes[i])
          }
        }
      } else {
        childNode = null
      }
    },
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1');
        this.count++
        console.log(this.count);
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    async handleConfirm(submitType) {
      this.btnLoading = true
      let submitFlag = await this.$refs['dataForm'].validate().catch(err => false)
      // this.$store.commit('workflow/SET_IS_TRIED', true)
      this.tipList = []; 
      this.reErr(this.busNodeConfig);
      if (this.tipList.length != 0) { 
        this.tipVisible = true;
        this.btnLoading = false
        return;
      }
      // return
      // this.processConfig.flowPermission = this.flowPermission
      let data = JSON.parse(JSON.stringify(this.busNodeConfig))
      let flattenedNodes = this.flattenNodes(data);
      console.log(flattenedNodes, 'tijiao');
      flattenedNodes.splice(0, 1)
      // return
      if (submitType == 'submit') {
        if (!flattenedNodes.length) {
          this.$message.error('请至少添加一个节点！')
          this.btnLoading = false
          submitFlag = false
          return
        }
      }
      console.log(flattenedNodes, 'flattenedNodesflattenedNodes');
      flattenedNodes = flattenedNodes.map(item => {
        return {
          ...item,
          type: item.type != 'node' && item.conditionList.length ? 'condition' : item.type,
          nodeUserList: item.nodeUserList ? item.nodeUserList : []
        }
      })
      // 审批人节点数组 templateLineList
      let templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
      if (templateLineList.length) {
        templateLineList.forEach(item => {
          if (item.approvalType != 'option') {
            submitFlag = item.nodeUserList.length ? true : false
          }
        })
        if (!submitFlag) {
          this.$message.error('审核人不能为空！')
          this.btnLoading = false
          return
        }
      }

      // 抄送人节点数组 ccList
      let ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')

      // 条件节点数组 nodeJudgmentList
      let nodeJudgmentList = flattenedNodes.filter(item => item.type === 'condition')

      let ccLists = []
      for (var i = 0; i < ccList.length; i++) {
        var nodeUserList = ccList[i].nodeUserList;
        ccLists = ccLists.concat(nodeUserList);
      }
      if (ccList.length && submitType === 'submit') {
        submitFlag = ccList.every(item => item.nodeUserList.length)
        if (!submitFlag) {
          this.$message.error('抄送人不能为空！')
          this.btnLoading = false
          return
        }
      }
      // return
      templateLineList = flattenedNodes.map((item, index) => {
        return {
          ...item,
          name: item.nodeName,
          designatedMembersId: item.approvalType == 'appoint' && item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
          previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
          levelSupervisor: item.approvalType == 'multilevel' ? item.examineEndDirectorLevel : '',
          priority: item.type == 'condition' ? item.priorityLevel : '',
          code: item.code
        }
      })
      ccLists = ccLists.map(item => {
        return {
          ...item,
          approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : '',
          ccToId: item.targetId,
          approvalTemplateLineCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
          id: item.id ? item.id : ''
        }
      })
      let nodeJudg = []
      if (nodeJudgmentList.length) {
        nodeJudg = nodeJudgmentList.map(item => {
          return {
            ...item,
            approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : '',
            approvalTemplateLineCode: item.code,
            name: item.conditionList[0].showName,
            code: item.conditionList[0].tjCode,
            comparisonValue: item.conditionList[0].zdy1,
            dataType: item.conditionList[0].columnType == 'Double' || item.conditionList[0].columnType == 'number' ? 'number' : 'string',
            operationalFormula: item.conditionList[0].columnType == 'string' ? 'eq' : item.conditionList[0].optType == 1 ? 'lt' : item.conditionList[0].optType == 2 ? 'gt' : item.conditionList[0].optType == 3 ? 'le' : 'ge',
            id: item.conditionList[0].id ? item.conditionList[0].id : ''
          }
        })
      }
      // 限制最后一级节点为抄送人
      if (templateLineList.length) {
        let targetNode = templateLineList.filter(item => item.nodeName === '抄送人')
        if (targetNode.length) {

          let targetCode = targetNode[0].code;
          var nextNode = templateLineList.find(item => targetCode === item.previousCode)
          console.log(nextNode, '下一项数据');
          if (nextNode) {
            this.$message.error('抄送人只能为最后一级节点！')
            this.btnLoading = false
            submitFlag = false
            return
          } else {
            if (templateLineList.length == 1) {
              this.$message.error('请至少添加一个审批节点！')
              this.btnLoading = false
              submitFlag = false
              return
            }
          }
        }
      }
      // 限制条件节点后必须为审批节点
      if (templateLineList.length) {
        let targetNode = templateLineList.filter(item => item.type === 'condition')
        if (targetNode.length) {

          let targetCode = targetNode[targetNode.length - 1].code;
          var nextNode = templateLineList.find(item => targetCode === item.previousCode)
          console.log(nextNode, '下一项数据');
          if (nextNode && nextNode.nodeName != '审核人') {
            this.$message.error('条件节点下必须为审批节点！')
            this.btnLoading = false
            submitFlag = false
            return
          } else if (!nextNode) {
            console.log('1111111111111111')
            // if (templateLineList.length == 1) {
            this.$message.error('条件节点下必须为审批节点！')
            this.btnLoading = false
            submitFlag = false
            return
            // }
          }
        }
      }

      this.dataForm.documentStatus = submitType
      let msg = this.dataForm.documentStatus == 'draft' ? '保存成功' : '提交成功'
      if (submitFlag) {
        let _data = {
          ccList: ccLists,
          nodeJudgmentList: nodeJudg,
          template: this.dataForm,
          templateLineList
        }
        console.log(_data);
        // return
        let formMethod = this.dataForm.id ? updateApprovalTemplate : addApprovalTemplate
        let res = await formMethod(_data)
        console.log(res);
        if (res.msg === 'Success') {
          this.$message({
            message: msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }
      } else {
        this.btnLoading = false
      }
    },
  },
}
</script>

<style scoped lang='scss'>
// .stepHeaders{
//   width:100%;

.stepHeader {
  width: 100%;
  padding: 13px 10px;
  background: #fff;
  // margin:0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .steps {
    width: 42%;
    background: none;
  }
}

.main {
  background: #ebeef5;
}

.main .basic-box {
  height: 100%;
  overflow: hidden;

  .basicForm {
    background: #fff;
    padding: 18px;
    height: 100%;
  }
}

::v-deep .el-form-item__label {
  text-align: center !important;
}

// }</style>