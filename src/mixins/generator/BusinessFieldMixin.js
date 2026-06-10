import {getbimProductAttributesListMap} from '@/api/masterDataManagement';
import {getOrderFiledMap} from '@/api/basicData';

export default {
    data(){
        return{
            accuracyLevelFlag: false,
            clearanceFlag: false,
            oilFlag: false,
            oilQuantityFlag: false,
            packagingMethodFlag: false,
            sealingCoverTypingFlag: false,
            specialRequireFlag: false,
            vibrationLevelFlag: false,
            protrusionFlag: false,
            preloadFlag: false,
            materialFlag: false,
            colourFlag: false,
            angleFlag: false,
            centerDiameterFlag:false,
            sealingCoverTypingList: [],
            accuracyLevelList: [],
            vibrationLevelList: [],
            oilList: [],
            oilQuantityList: [],
            clearanceList: [],
            packagingMethodList: [],
            specialRequireList: [],
            materialList: [],
            colourList: [],
            protrusionList: [],
            preloadList: [],
            angleList: [],
        }
    },
    methods:{
        async getBusinessFieldList(){
            const res =await getbimProductAttributesListMap()
            return res.data
        },
        async getBusinessFieldFlag(needList=true) {
            let bimProductAttributesList = {
                pa001: [],
                pa002: [],
                pa003: [],
                pa005: [],
                pa006: [],
                pa007: [],
                pa010: [],
                pa015: [],
                pa016: [],
                pa021: [],
                pa023: [],
                pa024: [],
                pa025: [],
            }
            if(needList){
                bimProductAttributesList =   await this.getBusinessFieldList()
            }
            await Promise.all([
                getOrderFiledMap('sale').then(res => {
                    this.accuracyLevelFlag = res.data.accuracyLevel === '1' //list1
                    if (this.accuracyLevelFlag) {
                        this.accuracyLevelList = bimProductAttributesList.pa006.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.clearanceFlag = res.data.clearance === '1'
                    if (this.clearanceFlag) {
                        this.clearanceList = bimProductAttributesList.pa001.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.oilFlag = res.data.oil  === '1'
                    if (this.oilFlag) {
                        this.oilList = bimProductAttributesList.pa002.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.oilQuantityFlag = res.data.oilQuantity === '1'
                    if (this.oilQuantityFlag) {
                        this.oilQuantityList = bimProductAttributesList.pa003.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.packagingMethodFlag = res.data.packagingMethod === '1'
                    if (this.packagingMethodFlag) {
                        this.packagingMethodList = bimProductAttributesList.pa015.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.sealingCoverTypingFlag = res.data.sealingCoverTyping === '1'
                    if (this.sealingCoverTypingFlag) {
                        this.sealingCoverTypingList = bimProductAttributesList.pa007.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.specialRequireFlag = res.data.specialRequire === '1'
                    if (this.specialRequireFlag) {
                        this.specialRequireList = bimProductAttributesList.pa016.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.vibrationLevelFlag = res.data.vibrationLevel === '1'
                    if (this.vibrationLevelFlag) {
                        this.vibrationLevelList = bimProductAttributesList.pa005.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.materialFlag = res.data.material === '1'
                    if (this.materialFlag) {
                        this.materialList = bimProductAttributesList.pa021.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.colourFlag = res.data.colour === '1'
                    if (this.colourFlag) {
                        this.colourList = bimProductAttributesList.pa010.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                }),
                getOrderFiledMap('gobal').then(res => {
                    this.protrusionFlag = res.data.protrusion === '1' //list1
                    if (this.protrusionFlag) {
                        this.protrusionList = bimProductAttributesList.pa023.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.preloadFlag = res.data.preload === '1'
                    if (this.preloadFlag) {
                        this.preloadList = bimProductAttributesList.pa024.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.angleFlag = res.data.angle === '1'
                    if (this.angleFlag) {
                        this.angleList = bimProductAttributesList.pa025.map((item) => {
                            return {
                                label: item.name,
                                value: item.name
                            }
                        })
                    }
                    this.centerDiameterFlag = res.data.centerDiameter === '1'
                })
            ])
        },
    }

}
