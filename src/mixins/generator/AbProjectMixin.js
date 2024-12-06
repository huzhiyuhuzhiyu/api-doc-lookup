import { getProjectList } from '@/api/system/projectManagement'
import { mapGetters } from 'vuex'
import {getPromise} from "@/utils";

const promiseName =Symbol('abProjectPromise' )
export default {
    computed: {
        ...mapGetters(['userInfo']),
        abProjectSwitchVisible(){
            console.log("this.abProjectSwitch ",this.abProjectSwitch === '1' )
            return this.abProjectSwitch === '1'
        },
        abIsCommonUser(){
            return this.userInfo.projectId === '1'
        },
        abProjectId(){
            return this.userInfo.projectId
        }
    },
    data(){
      return {
          abProjectSwitch:false,
          abProjectList:[],
          abProjectNoCommonList:[],
          [promiseName]:null
      }
    },
    methods: {
        /**
         * 如果需要在获取完AB项目配置之后的再操作，则await此方法
         * @returns {*}
         */
        awaitAbProject(){
            return this[promiseName]
        },
        getProjectSwitch() {
            const {promise,reject,resolve} = getPromise()
             this[promiseName] = promise
             this.jnpf.getMainUnitFun('system', 'project').then(async flag=>{
                 this.abProjectSwitch = flag
                 if(!this.abProjectSwitchVisible){
                     return resolve(this.abProjectSwitchVisible)
                 }
                 await this.getProjectList()
                 return resolve(this.abProjectList)
             }).catch(reject)
          return promise
        },
        async getProjectList() {
          let query = {
            pageNum: 1,
            pageSize: -1
          }
          const res = await getProjectList(query)
          // 包含通用项目下拉项
          this.abProjectList = res.data.records.map(item => {
            return {
              ...item,
              label: item.name,
              value: item.id,
            }
          })
          // 不包含通用项目下拉项
          this.abProjectNoCommonList = res.data.records.filter(item => item.id !== '1').map(item => {
            return {
              ...item,
              label: item.name,
              value: item.id,
            }
          })
        },
    },
    created() {
            this.getProjectSwitch()
    }
};
