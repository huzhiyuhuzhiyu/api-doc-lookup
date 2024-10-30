import configKey2Detail from "@/views/esop/fileManagement/system/ConfigKey2Detail";
import {isEmpty} from "@/utils";
import {ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";

export default {
    data(){
        return {
            showDetailVisible:false,
            componentPath:"",
            componentBindParams:{},
            componentBindEvents:{},
        }
    },
    methods:{
        closeDetail(){
            this.showDetailVisible = false;
        },
       async showDetail({configKey,businessId}){
            const config =configKey2Detail[configKey]
            console.log(config,'p===')
            if(isEmpty(config)){
                this.$message.error("未找到对应的配置");
                return;
            }
            this.componentPath = this.getComponentPath(config.path) ;
            this.componentBindParams = config.params;
            this.componentBindEvents = config.closeEventName ? {[config.closeEventName]:this.closeDetail} : { close:this.closeDetail};
            this.showDetailVisible = true;
            await this.$nextTick()
            this.$refs.detailRef.init(businessId,ModelType.VIEW,false,this.componentBindParams.inspectionType)

        },
        getComponentPath(path){
            return resolve => require([`@/views/${path}`], resolve)
        }
    },
    computed:{
        configKey2Detail(){
            return configKey2Detail
        }
    }
}
