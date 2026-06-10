<template>
  <div class="workNode">
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="statusColor">
          <span>已完成</span>
          <span>进行中</span>
          <span>未进行</span>
        </div>
        <!-- <div class="zoom">
          <div :class="'zoom-out' + (nowVal == 50 ? ' disabled' : '')" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div :class="'zoom-in' + (nowVal == 300 ? ' disabled' : '')" @click="zoomSize(2)"></div>
        </div> -->
        <div class="box-scale" id="box-scale"
          :style="'transform: scale(' + nowVal / 100 + '); transform-origin: 50% 0px 0px;'">
          <nodeWrap  :nodeConfig.sync="nodeConfig" :flowPermission.sync="flowPermission" :codeList.sync="codeList"  :busType="busType" :btnType="btnType">
          </nodeWrap>
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <errorDialog :visible.sync="tipVisible" :list="tipList" />
    <promoterDrawer />
    <approverDrawer :directorMaxLevel="directorMaxLevel" :busType="busType"/>
    <copyerDrawer :busType="busType" />
    <conditionDrawer />
  </div>
</template>
<script>
import errorDialog from './dialog/errorDialog.vue'
import promoterDrawer from './drawer/promoterDrawer.vue'
import approverDrawer from './drawer/approverDrawer.vue'
import copyerDrawer from './drawer/copyerDrawer.vue'
import conditionDrawer from './drawer/conditionDrawer.vue'
import Form from './form.vue'
import { mapMutations ,mapGetters,mapState} from 'vuex'
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
    nodeFirst: {
      type: Array,
    },
    nodeConfig:{
      type: Object,
    },
    btnType:{
      type: String | Boolean,
    },
  },
  data() {
    return {
      tipList: [],
      workFlowTemplate: {},
      tipVisible: false,
      nowVal: 100,
      processConfig: {},
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
      count:0,
      busType:'busing',
    }
  },
  computed:{
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
  created() {
    let {  directorMaxLevel, tableId ,flowPermission} = this.dataInit
    this.directorMaxLevel = directorMaxLevel;
    this.flowPermission = this.nodeFirst
    this.busType = 'busing'
    this.codeList = []

  },
  methods: {
    ...mapMutations('workflow', ['SET_TABLE_ID', 'SET_IS_TRIED']),

    initData(type,btnType) {
      // this.$store.commit('workflow/SET_TABLE_ID', id)
      // this.btnType = btnType
      // console.log(this.btnType,'__________');
    },
    // 节点未填错误提示
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
    flattenNodes(node, flattenedNodes = [],previousCode = '') {
      if (node) {

        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes,node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

                // let previousCode = node.conditionNodes[i].code
                node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes,node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes,node.code);
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
          designatedMembersId: item.type != 'condition' && item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
          previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
          levelSupervisor: item.approvalType == 'manager' ? item.directorLevel : item.approvalType == 'multilevel' ? item.examineEndDirectorLevel : '',
          priority: item.type == 'condition' ? item.priorityLevel : '',
          code: item.code
        }
      })
      ccList = ccList.map(item => {
        return {
          ...item,
          approvalTemplateId: this.workFlowTemplate.id,
          ccToId: item.nodeUserList[0].targetId,
          approvalTemplateLineCode: item.code,
          id: ''
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
            id:item.conditionList[0].id ? item.conditionList[0].id : ''
          }
        })
      }

      this.workFlowTemplate.documentStatus = submitType
      let msg = this.workFlowTemplate.documentStatus == 'draft' ? '保存成功' : '提交成功'
      let _data = {
        ccList,
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
.end-node1{
  margin-top:-20px !important;
}
.title-wrapper {
  font-size: 16px;
}

::v-deep .JNPF-common-page-header {

  background-color: #fff;
}
.fd-nav-content{
  top:20px!important;
}
.statusColor{
    width: 17%;
    height: 30px;
    font-size: 16px;
    display: flex;
    justify-content: space-around;
    margin-left:10px;
}
.statusColor span::before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
.statusColor span:nth-child(1)::before {
  background-color: #67c23a;
}

.statusColor span:nth-child(2)::before {
  // background-color: #576a95;
  background-color: rgb(50, 150, 250);
}

.statusColor span:nth-child(3)::before {
  background-color: #909399;
}
</style>
