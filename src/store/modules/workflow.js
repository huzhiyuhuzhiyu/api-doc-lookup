
const state = {
    tableId: '',
    isTried: false,
    promoterDrawer: false,
    flowPermission1: {},
    approverDrawer: false,
    approverConfig1: {},
    copyerDrawer: false,
    copyerConfig1: {},
    conditionDrawer: false,
    conditionsConfig1: {
        conditionNodes: [],
    },
}

const mutations =  {
    // SET_TABLE_ID(status, payload) {
    //     status.tableId = payload
    // },
    SET_TABLE_ID:(state, payload)=> {
      state.tableId = payload
    },
    SET_IS_TRIED:(state, payload)=> {
        state.isTried = payload
    },
    SET_PROMOTER:(state, payload)=> {
        state.promoterDrawer = payload
        console.log(payload);
    },
    SET_FLOW_PERMISSION:(state, payload)=> {
        state.flowPermission1 = payload
        console.log(payload);
    },
    // SET_APPROVER(status, payload) {
    //     status.approverDrawer = payload
    // },
    SET_APPROVER:(state, payload)=> {
      // console.log(payload);
      state.approverDrawer = payload
      console.log(state.approverDrawer);
    },
    SET_APPROVER_CONFIG(status, payload) {
      console.log(payload);
        status.approverConfig1 = payload
    },
    SET_COPYER:(state, payload)=> {
        state.copyerDrawer = payload
    },
    SET_COPYER_CONFIG:(state, payload)=> {
        state.copyerConfig1 = payload
    },
    SET_CONDITION:(state, payload)=> {
        state.conditionDrawer = payload
    },
    SET_CONDITIONS_CONFIG(status, payload) {
        status.conditionsConfig1 = payload
    },
}

const actions = {}

export default {
  namespaced: true, //需要加上所属的模块名
  state,
  mutations,
  actions
}