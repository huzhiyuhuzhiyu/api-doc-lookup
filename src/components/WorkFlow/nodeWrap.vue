<template>
    <div>
        <div class="node-wrap" v-if="nodeConfig.nodeType<3">
            <div class="node2-wrap-box" :class="(nodeConfig.nodeType==0?'start-node ':'')+(isTried&&nodeConfig.error?'active error':'')">
                <div>
                    <div :class="['title',nodeConfig.nodeType==0 && busType === 'busing' ? 'titleOk' : nodeConfig.nodeName == '抄送人' && busType === 'busing' ? 'titleCsr' : nodeConfig.approvalStatus && (nodeConfig.approvalStatus == 'ok' || nodeConfig.approvalStatus == 'rebut' || nodeConfig.approvalStatus == 'transferred') ? 'titleOk'  : nodeConfig.approvalStatus && nodeConfig.approvalStatus == 'wait' ? 'titleWait' :  nodeConfig.approvalStatus == 'no' ? 'titleNo' : '' ]" :style="`background: rgb(${bgColor});`">
                        <span v-if="nodeConfig.nodeType==0">{{nodeConfig.nodeName}}</span>
                        <template v-else>
                            <span class="iconfont">{{nodeConfig.nodeType==1?'':''}}</span>
                            <!-- <input type="text" 
                                v-if="isInput"
                                class="ant-input editable-title-input" 
                                @blur="blurEvent()" 
                                @focus="$event.currentTarget.select()" 
                                disabled
                                v-focus
                                v-model="nodeConfig.nodeName" 
                                :placeholder="defaultText"
                            > -->
                            <span v-if="isInput">{{defaultText}}</span>
                            <span v-else class="editable-title" @click="clickEvent()">{{nodeConfig.nodeName}}</span>
                            <i v-if=" busType == '' && btnType" class="anticon anticon-close close" @click="delNode"></i>
                        </template>
                    </div>
                    <div class="content" @click="setPerson">
                        <div class="text">
                            <span class="placeholder" v-if="!showText">请选择{{defaultText}}</span>
                            {{showText}} <span :class="[nodeConfig.approvalStatus == 'ok' || nodeConfig.approvalStatus == 'transferred'  ? 'green' : nodeConfig.approvalStatus == 'rebut' ? 'red' : '' ]"> {{showText2}} </span>
                        </div>
                        <div class="text">
                            {{showText3}}
                        </div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                    <div class="error_tip" v-if="isTried&&nodeConfig.error">
                        <i class="anticon anticon-exclamation-circle"></i>
                    </div>
                </div>
            </div>
            <addNode :btnType="btnType" :busType="busType" :childNodeP.sync="nodeConfig.childNode"></addNode>
        </div>
        <div class="branch-wrap" v-if="nodeConfig.nodeType == 4 && nodeConfig.conditionNodes.length">
            <div class="branch-box-wrap">
                <div :class="['branch-box',busType == 'busing' && btnType ? 'branch-box1' : busType == 'look' && btnType ? 'branch-box2' : '']">
                    <button v-if="!busType" class="add-branch" @click="addTerm">添加条件</button>
                    <div class="col-box" v-for="(item,index) in nodeConfig.conditionNodes" :key="index">
                        <div class="condition-node" v-if="busType!='busing'">
                            <div class="condition-node-box">
                                <div class="auto-judge" :class="isTried&&item.error?'error active':''">
                                    <div class="sort-left" v-if="index!=0" @click="arrTransfer(index,-1)">&lt;</div>
                                    <div class="title-wrapper">
                                        <!-- <input 
                                            v-if="isInputList[index]"
                                            type="text" 
                                            class="ant-input editable-title-input" 
                                            @blur="blurEvent(index)" 
                                            @focus="$event.currentTarget.select()" 
                                            v-focus v-model="item.nodeName"
                                        > -->
                                        <span v-if="isInputList[index]">{{item.nodeName}}</span>
                                        <span  v-else class="editable-title" @click="clickEvent(index)">{{item.nodeName}}</span>
                                        <span class="priority-title" @click="setPerson(item.priorityLevel)">优先级{{item.priorityLevel}}</span>
                                        <i v-if="btnType !== 'look'" class="anticon anticon-close close" @click="delTerm(index)"></i>
                                    </div>
                                    <div class="sort-right" v-if="index!=nodeConfig.conditionNodes.length-1" @click="arrTransfer(index)">&gt;</div>
                                    <div class="content" @click="setPerson(item.priorityLevel)">{{$func.conditionStr(nodeConfig,index)}}</div>
                                    <div class="error_tip" v-if="isTried&&item.error">
                                        <i class="anticon anticon-exclamation-circle"></i>
                                    </div>
                                </div>
                                <addNode :btnType="btnType" :busType="busType" :childNodeP.sync="item.childNode"></addNode>
                            </div>
                        </div>
                        <nodeWrap :btnType="btnType" :busType="busType" v-if="item.childNode" :nodeConfig.sync="item.childNode"></nodeWrap>
                        <template v-if="index==0 && busType!='busing'">
                            <div class="top-left-cover-line"></div>
                            <div class="bottom-left-cover-line"></div>
                        </template>
                        <template v-if="index==nodeConfig.conditionNodes.length-1 && busType!='busing'">
                            <div class="top-right-cover-line"></div>
                            <div class="bottom-right-cover-line"></div>
                        </template>
                    </div>
                </div>
                <!-- <addNode :childNodeP.sync="nodeConfig.childNode"></addNode> -->
              </div>
        </div>
        <nodeWrap :btnType="btnType" :busType="busType" :codeList.sync="codeList" v-if="nodeConfig.childNode" :nodeConfig.sync="nodeConfig.childNode"></nodeWrap>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    props: ["nodeConfig", "flowPermission","codeList","busType",'btnType'],
    data() {
        return {
            placeholderList: ["发起人", "审核人", "抄送人"],
            isInputList: [],
            isInput: false,
            typeFlag:'',
            // busType:'busing'
        }
    },
    mounted() {
        if (this.nodeConfig.nodeType == 1) {
            this.nodeConfig.error = !this.$func.setApproverStr(this.nodeConfig)
        } else if (this.nodeConfig.nodeType == 2) {
            this.nodeConfig.error = !this.$func.copyerStr(this.nodeConfig)
        } else if (this.nodeConfig.nodeType == 4) {
            this.resetConditionNodesErr()
        }
    },
    computed: {
        ...mapState('workflow',['isTried', 'flowPermission1', 'approverConfig1', 'copyerConfig1', 'conditionsConfig1']),
        defaultText() {
            return this.placeholderList[this.nodeConfig.nodeType]
        },
        showText() { 
          // this.codeList = this.nodeConfig.codeList
            if (this.nodeConfig.nodeType == 0) return this.$func.arrToStr(this.flowPermission) || '所有人'
            if (this.nodeConfig.nodeType == 1) return this.$func.setApproverStr(this.nodeConfig,this.busType)
            return this.$func.copyerStr(this.nodeConfig)
        },
        showText2() { 
          // this.codeList = this.nodeConfig.codeList
          if (this.busType) {
            if (this.nodeConfig.nodeType == 1) return this.$func.setApproverStr2(this.nodeConfig,this.busType)
          }
            // return this.$func.copyerStr(this.nodeConfig)
        },
        showText3() { 
          // this.codeList = this.nodeConfig.codeList
          if (this.busType) {
            if (this.nodeConfig.nodeType == 1) return this.$func.setApproverStr3(this.nodeConfig,this.busType)
          }
            // return this.$func.copyerStr(this.nodeConfig)
        },
        bgColor() {
            return ['87, 106, 149', '255, 148, 62', '50, 150, 250'][this.nodeConfig.nodeType]
        }
    },
    watch: {
        flowPermission1(data) {
            if (data.flag && data.id === this._uid) {
                this.$emit('update:flowPermission', data.value)
            }
        },
        approverConfig1(data) {
            if (data.flag && data.id === this._uid) {
                this.$emit('update:nodeConfig', data.value)
            }
        },
        copyerConfig1(data) {
            if (data.flag && data.id === this._uid) {
                this.$emit('update:nodeConfig', data.value)
            }
        },
        conditionsConfig1(data) { 
            if (data.flag && data.id === this._uid) {
                this.$emit('update:nodeConfig', data.value)
            }
        },
    },
    methods: {
        ...mapMutations('workflow',[
            'SET_PROMOTER',
            'SET_APPROVER',
            'SET_COPYER',
            'SET_CONDITION',
            'setFlowPermission',
            'SET_APPROVER_CONFIG',
            'SET_COPYER_CONFIG',
            'SET_CONDITIONS_CONFIG'
        ]),
        clickEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, true)
            } else {
                this.isInput = true;
            }
        },
        blurEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, false)
                this.nodeConfig.conditionNodes[index].nodeName = this.nodeConfig.conditionNodes[index].nodeName || "条件"
            } else {
                this.isInput = false;
                this.nodeConfig.nodeName = this.nodeConfig.nodeName || this.defaultText
            }
        },
        delNode() {
            this.$emit("update:nodeConfig", this.nodeConfig.childNode);
        },
        addTerm() { 
          // return
            let len = this.nodeConfig.conditionNodes.length + 1
            this.nodeConfig.conditionNodes.push({
                "nodeName": "条件" + len,
                "nodeType": 3,
                "priorityLevel": len,
                "conditionList": [],
                "nodeUserList": [],
                "childNode": null
            });
            this.resetConditionNodesErr()
            this.$emit("update:nodeConfig", this.nodeConfig);
        },
        delTerm(index) { 
          // return
          this.nodeConfig.conditionNodes.splice(index, 1)
          this.nodeConfig.conditionNodes.map((item, index) => {
            item.priorityLevel = index + 1
            item.nodeName = `条件${index + 1}`
          });
          this.resetConditionNodesErr()
          this.$emit("update:nodeConfig", this.nodeConfig); 
       
            if (this.nodeConfig.conditionNodes.length == 1) {
                if (this.nodeConfig.childNode) {
                    if (this.nodeConfig.conditionNodes[0].childNode) {
                        this.reData(this.nodeConfig.conditionNodes[0].childNode, this.nodeConfig.childNode)
                    } else {
                        this.nodeConfig.conditionNodes[0].childNode = this.nodeConfig.childNode
                    }
                    this.$emit("update:nodeConfig", this.nodeConfig.conditionNodes[0].childNode);
                  }
              //  return
            }
        },
        reData(data, addData) {
            if (!data.childNode) {
                data.childNode = addData
            } else {
                this.reData(data.childNode, addData)
            }
        },
        setPerson(priorityLevel) {  
          console.log(this.btnType);
          if (this.busType == 'busing') {
            if (this.nodeConfig.nodeType == 2 && [true,'look'].indexOf(this.btnType) == -1) { 
              this.$store.commit("workflow/SET_COPYER",true)
                this.$store.commit('workflow/SET_COPYER_CONFIG',{
                  value: {
                    ...JSON.parse(JSON.stringify(this.nodeConfig)),
                    ...{ codeList:this.codeList }
                  } ,
                    flag: false,
                    id: this._uid
                })
                // this.setCopyerConfig({
                //     value: JSON.parse(JSON.stringify(this.nodeConfig)),
                //     flag: false,
                //     id: this._uid
                // })
            }
          }else if (this.btnType == 'look' || this.btnType == true){

          }else{
            var { nodeType } = this.nodeConfig; 
            if (nodeType == 0) {
                // this.$store.commit("workflow/SET_PROMOTER",true) 
                // this.$store.commit('workflow/SET_FLOW_PERMISSION',{
                //   value: this.flowPermission,
                //   flag: false,
                //   id: this._uid
                // })
            } else if (nodeType == 1) {    
              this.$store.commit('workflow/SET_APPROVER', true) 
              this.$store.commit('workflow/SET_APPROVER_CONFIG', {
                    value: {
                        ...JSON.parse(JSON.stringify(this.nodeConfig)),
                        ...{ approvalType: this.nodeConfig.approvalType,codeList:this.codeList }
                    },
                    flag: false,
                    id: this._uid
                })
              // return
              // console.log(this.SET_APPROVER);
              //   this.SET_APPROVER(true)
              //   // return
              //   this.SET_APPROVER_CONFIG({
              //       value: {
              //           ...JSON.parse(JSON.stringify(this.nodeConfig)),
              //           ...{ settype: this.nodeConfig.settype ? this.nodeConfig.settype : 1 }
              //       },
              //       flag: false,
              //       id: this._uid
              //   })
            } else if (nodeType == 2) {
                this.$store.commit("workflow/SET_COPYER",true)
                this.$store.commit('workflow/SET_COPYER_CONFIG',{
                  value: {
                    ...JSON.parse(JSON.stringify(this.nodeConfig)),
                    ...{ codeList:this.codeList }
                  } ,
                    flag: false,
                    id: this._uid
                })
                // this.setCopyerConfig({
                //     value: JSON.parse(JSON.stringify(this.nodeConfig)),
                //     flag: false,
                //     id: this._uid
                // })
            } else {
                this.$store.commit('workflow/SET_CONDITION',true)
                this.$store.commit('workflow/SET_CONDITIONS_CONFIG',{
                  value:{
                    ...JSON.parse(JSON.stringify(this.nodeConfig)),
                    ...{ codeList:this.codeList }
                  },
                    priorityLevel,
                    flag: false,
                    id: this._uid
                })
            }
          }
          if (this.nodeConfig.approvalType === 'option' && this.busType === 'busing' && !this.nodeConfig.designatedMembersId) {
            this.$store.commit('workflow/SET_APPROVER', true) 
              this.$store.commit('workflow/SET_APPROVER_CONFIG', {
                    value: {
                        ...JSON.parse(JSON.stringify(this.nodeConfig)),
                        ...{ approvalType: this.nodeConfig.approvalType,codeList:this.codeList }
                    },
                    flag: false,
                    id: this._uid
              })
          }
        },
        arrTransfer(index, type = 1) {//向左-1,向右1
            this.nodeConfig.conditionNodes[index] = this.nodeConfig.conditionNodes.splice(index + type, 1, this.nodeConfig.conditionNodes[index])[0];
            this.nodeConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
            })
            this.$emit("update:nodeConfig", this.nodeConfig);
        },
        resetConditionNodesErr() {
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.$func.conditionStr(this.nodeConfig, i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
        },
    }
}
</script>
<style>
.error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
}
.titleOk{
  background:#67c23a !important;
}
.titleNo{
  background:#909399 !important;
}
.titleWait{
  background:rgb(50, 150, 250) !important;
}
.titleCsr{
  background-color: #576a95 !important;
}
.promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
}

.selected_list {
    margin-bottom: 20px;
    line-height: 30px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
}

.selected_list span {
    margin-right: 10px;
    padding: 10px 6px 10px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
}

.selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
}
.branch-box1{
  /* margin-top:-40px!important; */
  border-bottom: none!important;
  border-top: none!important;
}
.branch-box2{
  margin-top:0px!important;
  border-bottom: 2px solid #ccc !important;
  border-top: 2px solid #ccc !important;
}
/* ::v-deep .el-popover__reference-wrapper{
  display: none;
} */
.red{
  color:#f56c6c;
}
.green{
  color:#67C23A;
}
</style>