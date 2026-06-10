<template>
  <div class="workNode" style="height: 100%; width: 100%; position: relative;">
    <!-- <div class="fd-nav">
			<div class="fd-nav-left">
				<div class="fd-nav-back" @click="toReturn"><i class="anticon anticon-left"></i></div>
				<div class="fd-nav-title">{{workFlowDef.name}}</div>
			</div> -->
    <!-- <div class="fd-nav-center">
                <div class="fd-nav-container">
                    <div class="ghost-bar" style="transform: translateX(300px);"></div>
                    <div class="fd-nav-item"><span class="order-num">1</span>基础设置</div>
                    <div class="fd-nav-item"><span class="order-num">2</span>表单设计</div>
                    <div class="fd-nav-item active"><span class="order-num">3</span>流程设计</div>
                    <div class="fd-nav-item"><span class="order-num">4</span>高级设置</div>
                </div>
            </div> -->
    <!-- <div class="fd-nav-right"> -->
    <!-- <button type="button" class="ant-btn button-preview"><span>预 览</span></button> -->
    <!-- <button type="button" class="ant-btn button-publish" @click="saveSet"><span>发 布</span></button> -->
    <!-- </div>
		</div> -->
    <!-- <div class="JNPF-common-page-header"> -->
      <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
      <!-- <el-page-header @back="goBack" content="审批流程设计" /> -->
      <!-- <div class="options" v-if="!btnType">
        <el-button type="success" :loading="btnLoading" @click="saveSet('draft')">
          保存草稿</el-button>
        <el-button type="primary" :loading="btnLoading" @click="saveSet('submit')">
          保存并提交</el-button>
        <el-button :loading="btnLoading" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
      </div> -->
    <!-- </div> -->
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div :class="'zoom-out' + (nowVal == 50 ? ' disabled' : '')" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div :class="'zoom-in' + (nowVal == 300 ? ' disabled' : '')" @click="zoomSize(2)"></div>
        </div>
        <div class="box-scale" id="box-scale"
          :style="'transform: scale(' + nowVal / 100 + '); transform-origin: 50% 0px 0px;'">
          <nodeWrap :btnType="btnType" :busType="busType" :codeList.sync="codeList" :nodeConfig.sync="nodeConfig"
            :flowPermission.sync="flowPermission">
          </nodeWrap>
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <Form v-if="formVisible" ref="formRef" :dataForm.sync="dataForm" />
    <errorDialog :visible.sync="tipVisible" :list="tipList" />
    <promoterDrawer />
    <approverDrawer :directorMaxLevel="directorMaxLevel" :busType="busType" />
    <copyerDrawer />
    <conditionDrawer :busType="busType" />
  </div>
</template>
<script>
import errorDialog from './dialog/errorDialog.vue'
import promoterDrawer from './drawer/promoterDrawer.vue'
import approverDrawer from './drawer/approverDrawer.vue'
import copyerDrawer from './drawer/copyerDrawer.vue'
import conditionDrawer from './drawer/conditionDrawer.vue'
import Form from './form.vue'
// import { getWorkFlowData, setWorkFlowData } from '@/plugins/api.js'
import { mapMutations } from 'vuex'
import { addApprovalFlow, getApprovalDetail, getApprovalDetailTree } from '@/api/basicData/approvalAdministrator'
export default {
  components: {
    errorDialog,
    promoterDrawer,
    approverDrawer,
    copyerDrawer,
    conditionDrawer,
    Form
  },
  props: {
    workFlowT: {
      type: Object,
    },
    nodeConfig:{
      type: Object,
    },
  },
  data() {
    return {
      btnLoading: false,
      tipList: [],
      workFlowTemplate: {},
      dataForm: {
        adminId: "",
        approvalBusinessId: 1,
        code: "",
        id: '',
        name: "",
        state: "disable"
      },
      tipVisible: false,
      formVisible: false,
      nowVal: 100,
      processConfig: {},
      // nodeConfig: {},
      codeList: [],
      dataInit: {
        tableId: 1,
        workFlowDef: {
          name: "审批"
        },
        directorMaxLevel: [
          { label: '直接主管', value: 1 },
          { label: '第二级主管', value: 2 },
          { label: '第三级主管', value: 3 },
          { label: '第四级主管', value: 4 },
        ],
        flowPermission: [],
        // nodeConfig: {
        //   nodeName: "发起人",
        //   nodeType: 0,
        //   type: 'node',
        //   priorityLevel: "",
        //   approvalType: "appoint",
        //   selectMode: "",
        //   selectRange: "",
        //   directorLevel: "",
        //   examineMode: "",
        //   whenEmpty: "",
        //   examineEndDirectorLevel: "",
        //   ccSelfSelectFlag: "",
        //   conditionList: [],
        //   nodeUserList: [],
        //   childNode: null,
        //   conditionNodes: []
        // }
      },
      workFlowDef: {},
      flowPermission: [],
      directorMaxLevel: 0,
      ifHeadName: false,
      count: 0,
      busType: '',
      btnType: '',
    }
  },
  created() {
    // getWorkFlowData({ workFlowDefId: this.$route.params.workFlowDefId }).then(({ data }) => {
    // 	this.processConfig = data;
    let { flowPermission, directorMaxLevel, workFlowDef, tableId } = this.dataInit
    // this.nodeConfig = nodeConfig;
    this.flowPermission = flowPermission;
    this.directorMaxLevel = directorMaxLevel;
    this.workFlowDef = workFlowDef
    this.codeList = []
    this.btnType = ''
    this.$store.commit('workflow/SET_TABLE_ID', this.workFlowT.approvalBusinessId)
    // })
    // this.initData()
  },
  methods: {
    ...mapMutations('workflow', ['SET_TABLE_ID', 'SET_IS_TRIED']),
    toReturn() {
      //window.location.href = ""
    },
    addNodeTypeAndNodeName(obj) {
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
    initData(id, type) {
      // this.busType = type
      this.btnType = type
      if (this.btnType === 'look') {
        this.busType = 'look'
      }
    },
    goBack() {
      this.$emit('close')
    },
    reErr({ childNode }) {
      if (childNode) {
        let { nodeType, error, nodeName, conditionNodes, code } = childNode
        if (nodeType == 1 || nodeType == 2) {
          if (!code) {
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
        this.count++
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
    async saveSet(submitType) {
      this.btnLoading = true
      this.$store.commit('workflow/SET_IS_TRIED', true)
      this.tipList = [];
      this.reErr(this.nodeConfig);
      if (this.tipList.length != 0) {
        this.tipVisible = true;
        this.btnLoading = false
        return;
      }
      // console.log(this.flowPermission);
      this.processConfig.flowPermission = this.flowPermission
      let data = JSON.parse(JSON.stringify(this.nodeConfig))
      let flattenedNodes = this.flattenNodes(data);
      flattenedNodes.splice(0, 1)
      // return
      if (!flattenedNodes.length) {
        this.$message.error('请至少添加一个节点！')
        this.btnLoading = false
        return
      }
      flattenedNodes = flattenedNodes.map(item => {
        return {
          ...item,
          type: item.type != 'node' && item.conditionList.length ? 'condition' : item.type,
        }
      })
      // 审批人节点数组 templateLineList
      let templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
      // 抄送人节点数组 ccList
      let ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
      // 条件节点数组 nodeJudgmentList
      let nodeJudgmentList = flattenedNodes.filter(item => item.type === 'condition')
      let ccLists = []
      for (var i = 0; i < ccList.length; i++) {
        var nodeUserList = ccList[i].nodeUserList;
        ccLists = ccLists.concat(nodeUserList);
      }
      // console.log(nodeJudgmentList[0].conditionNodes, '条件');
      // 找到第一个类型为"condition"的数据项的上一个数据项的"code"值
      // let previousCode = "";
      // for (let i = 0; i < flattenedNodes.length; i++) {
      //   if (i === 0 && flattenedNodes[i].type === "condition" && flattenedNodes[i].priorityLevel == '1') {
      //     previousCode =  "";
      //     // break;
      //   }
      //   if (i != 0 && flattenedNodes[i].type === "condition" && flattenedNodes[i].priorityLevel == '1') {
      //     previousCode =  flattenedNodes[i - 1].code;
      //     break;
      //   }
      // }

      // // 添加"previousCode"属性并设置值
      // for (let i = 0; i < flattenedNodes.length; i++) {
      //   if (i!== 0 && flattenedNodes[i].type === "condition" && flattenedNodes[i].priorityLevel !== "" && flattenedNodes[i].priorityLevel !== '1') {
      //     flattenedNodes[i].previousCode = previousCode;
      //   }
      // }
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
          approvalTemplateId: this.workFlowTemplate.id,
          ccToId: item.targetId,
          approvalTemplateLineCode:item.approvalTemplateLineCode ? item.approvalTemplateLineCode :  item.code,
          id: item.id ? item.id : ''
        }
      })
      let nodeJudg = []
      if (nodeJudgmentList.length) {
        nodeJudg = nodeJudgmentList.map(item => {
          return {
            ...item,
            approvalTemplateId: this.workFlowTemplate.id,
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

      this.workFlowTemplate.documentStatus = submitType
      let msg = this.workFlowTemplate.documentStatus == 'draft' ? '保存成功' : '提交成功'
      let _data = {
        ccList:ccLists,
        nodeJudgmentList: nodeJudg,
        template: this.workFlowTemplate,
        templateLineList
      }
      // return
      let res = await addApprovalFlow(_data)
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
    },
    zoomSize(type) {
      if (type == 1) {
        if (this.nowVal == 50) return;
        this.nowVal -= 10;
      } else {
        if (this.nowVal == 300) return;
        this.nowVal += 10;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
//@import "./css/workflow.css";

.error-modal-list {
  width: 455px;
}

.title-wrapper {
  font-size: 16px;
}
.workNode{
  background-color: #f5f5f7;
}
</style>
