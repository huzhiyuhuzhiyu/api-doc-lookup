//查询车间下级所有车间ID
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

 function selectmrpWorkshopId(id,list){
    //查子ID数组
    let _query = {
        paramList: [{
            field: 'ID',
            fieldName: '',
            dataType: 'varchar',
            required: 0,
            defaultValue: id
        }],
        tenantId: '',
        origin: 'preview'
    }

     getDataInterfaceRes('365461198570824901', _query).then(res => {
        let data = res.data
        let _list = []
        for (let i = 0; i < res.data.length; i++) {
            let _data = res.data[i]
            _list.push(_data.F_Id)
        }

        list = _list
        console.log(list)

    })

}




export {
    selectmrpWorkshopId
}
