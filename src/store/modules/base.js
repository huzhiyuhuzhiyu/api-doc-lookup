import { getDictionaryAll } from '@/api/systemData/dictionary'
import { UserListAll, getUserSelector } from '@/api/permission/user'
import { getPositionListAll, getPositionSelector } from '@/api/permission/position'
import { getRoleSelector } from '@/api/permission/role'
import { getPrintDevSelector } from '@/api/system/printDev'
import jnpf from '@/utils/jnpf';
import { getBimBusinessDetail, getOrderFiledMap, getBimBusinessSwitchConfigList } from '@/api/basicData'

const state = {
  dictionaryList: [],
  userList: [],
  userTree: [],
  positionList: [],
  positionTree: [],
  roleList: [],
  roleTree: [],
  printFlowTree: [],
  printFormTree: [],
  sealingCoverTyping:'',
  specialRequire:'',
  colour:'',
  configData: {},
  configGlobal:{}
}

const mutations = {
  SET_DICTIONARY_LIST: (state, dictionaryList) => {
    state.dictionaryList = dictionaryList
  },
  SET_USER_LIST: (state, userList) => {
    state.userList = userList
  },
  SET_USER_TREE: (state, userTree) => {
    state.userTree = userTree
  },
  SET_POSITION_LIST: (state, positionList) => {
    state.positionList = positionList
  },
  SET_POSITION_TREE: (state, positionTree) => {
    state.positionTree = positionTree
  },
  SET_ROLE_LIST: (state, roleList) => {
    state.roleList = roleList
  },
  SET_ROLE_TREE: (state, roleTree) => {
    state.roleTree = roleTree
  },
  SET_PRINT_FLOW_TREE: (state, printTree) => {
    state.printFlowTree = printTree
  },
  SET_PRINT_FORM_TREE: (state, printTree) => {
    state.printFormTree = printTree
  },
  SET_FIELD_NAME: (state, FieldNameJson) => { // 获取数据字典中字段名称配置
    if (!FieldNameJson.length) {
      state.sealingCoverTyping = '打字内容'
      state.specialRequire = '特殊要求'
      state.colour = '颜色'
      state.accuracyLevel = '精度等级'
      return
    }
    state.sealingCoverTyping = FieldNameJson.find(item=>item.enCode === 'sealingCoverTyping').fullName
    state.specialRequire = FieldNameJson.find(item=>item.enCode === 'specialRequire').fullName
    state.colour = FieldNameJson.find(item=>item.enCode === 'colour').fullName
    state.accuracyLevel = FieldNameJson.find(item=>item.enCode === 'accuracyLevel').fullName
  
  },
  SET_CONFIG_GLOBAL: (state, configGlobal) => {
    state.configGlobal = configGlobal
  },
  SET_CONFIG_DATA(state, configData) {
    const createProxy = (target) => {
      return new Proxy(target, {
        get(target, prop) {
          if (typeof prop === 'symbol' || prop === '_isVue') return;
          if (!(prop in target)) {
            console.error(`$store.configData属性访问错误 "${prop}"\n`, state.configData);
            return {};
          }
          if (typeof target[prop] === 'object' && target[prop] !== null) return createProxy(target[prop]);
          return target[prop];
        }
      });
    };
    state.configData = createProxy(configData);
  },
}

const actions = {
  getDictionaryAll({ commit }) {
    return new Promise((resolve, reject) => {
      getDictionaryAll().then(res => {
        commit('SET_DICTIONARY_LIST', res.data.list)
        resolve(res.data.list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDictionaryData({ state, dispatch }, info) {
    return new Promise(async resolve => {
      let list = [],
        data = [],
        json = []
      if (!state.dictionaryList.length) {
        list = await dispatch('getDictionaryAll')
      } else {
        list = state.dictionaryList
      }
      if (info.sort) {
        let arr = list.filter(o => o.enCode === info.sort)
        if (!arr.length) return resolve([])
        data = arr[0]
        if (!info.id) {
          json = data.dictionaryList
          json.sort((a, b) => a.enCode - b.enCode)
        } else {
          let rowData = [];
          if (!data.isTree) {
            rowData = data.dictionaryList.filter(o => o.id == info.id)
          } else {
            function findData(list) {
              for (let i = 0; i < list.length; i++) {
                const e = list[i];
                if (e.id == info.id) {
                  rowData[0] = e
                  break
                }
                if (e.children && e.children.length) {
                  findData(e.children)
                }
              }
            }
            findData(data.dictionaryList)
          }
          if (rowData.length) {
            json = rowData[0];
          } else {
            json = {
              id: "",
              fullName: ""
            };
          }
        }
      }
      resolve(json)
    })
  },
  getPositionList({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (!state.positionList.length) {
        getPositionListAll().then(res => {
          commit('SET_POSITION_LIST', res.data.list)
          resolve(res.data.list)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.positionList)
      }
    })
  },
  getPositionTree({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (!state.positionTree.length) {
        getPositionSelector().then(res => {
          commit('SET_POSITION_TREE', res.data.list)
          resolve(res.data.list)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.positionTree)
      }
    })
  },
  getRoleList({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      if (!state.roleList.length) {
        dispatch('getRoleTree').then(res => {
          let data = jnpf.treeToArray(res, 'role')
          commit('SET_ROLE_LIST', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.roleList)
      }
    })
  },
  getRoleTree({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (!state.roleTree.length) {
        getRoleSelector().then(res => {
          commit('SET_ROLE_TREE', res.data.list)
          resolve(res.data.list)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.roleTree)
      }
    })
  },
  getUserTree({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (!state.userTree.length) {
        getUserSelector().then(res => {
          commit('SET_USER_TREE', res.data.list)
          resolve(res.data.list)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.userTree)
      }
    })
  },
  getUserList({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (!state.userList.length) {
        UserListAll().then(res => {
          commit('SET_USER_LIST', res.data.list)
          resolve(res.data.list)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.userList)
      }
    })
  },
  getUserInfo({ state, dispatch }, id) {
    return new Promise(async resolve => {
      let list = []
      if (!state.userList.length) {
        list = await dispatch('getUserList')
      } else {
        list = state.userList
      }
      let item = list.filter(o => o.id === id)[0]
      resolve(item || {})
    })
  },
  getPrintFlowTree({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (!state.printFlowTree.length) {
        getPrintDevSelector(1).then(res => {
          // commit('SET_PRINT_FLOW_TREE', res.data.list)
          resolve(res.data.list)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.printFlowTree)
      }
    })
  },
  getPrintFormTree({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (!state.printFormTree.length) {
        getPrintDevSelector(2).then(res => {
          // commit('SET_PRINT_FORM_TREE', res.data.list)
          resolve(res.data.list)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.printFormTree)
      }
    })
  },
  getBusinessConfig({ commit },type) {
        return new Promise((resolve, reject) => {
            getOrderFiledMap(type).then(res => {
                if (type === 'gobal') commit('SET_CONFIG_GLOBAL', res.data)
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
  },
  // 获取全部业务参数配置
  refreshConfigData({ commit }, type) {
    return new Promise((resolve, reject) => {
      getBimBusinessSwitchConfigList({ pageSize: -1 }).then(res => {
        commit('SET_CONFIG_DATA', transformConfig(res.data))
        function transformConfig(configObj) {
          const result = {};
          for (const [key, configList] of Object.entries(configObj)) {
            result[key] = {};
            configList.forEach((item) => {
              result[key][item.configKey] = item.configValue1 === '1' ? true : false;
            });
          }
          return result;
        }
        resolve()
      }).catch(error => {
        reject()
      })
    })
  },
  getParamSetConfig({ commit },params) {
        return new Promise((resolve, reject) => {
            let obj = {
                businessCode: params.code,
                configKey: params.type
            }
            getBimBusinessDetail(obj).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
