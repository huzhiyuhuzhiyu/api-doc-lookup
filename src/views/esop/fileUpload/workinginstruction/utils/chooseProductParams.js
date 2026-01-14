import {getcategoryTree} from "@/api/basicData/materialSettings";
import {getProductList} from "@/api/basicData/materialFiles";
export default function (){
    return {
        ProductTableItems:Object.freeze([
            { prop: 'code', label: '产品编码', fixed: 'left' },
            { prop: 'name', label: '产品名称', fixed: 'left' },
            { prop: 'drawingNo', label: '型号' },
            // { prop: 'spec', label: '规格型号' },
            { prop: 'productCategoryName', label: '产品分类' }
        ]),
        listRequestObj: Object.freeze({
            classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
            productCategoryId: "",
            code: "",
            name: "",
            orderItems: [{
                "asc": false,
                "column": ""
            }, {
                "asc": false,
                "column": "create_time"
            }],
            productStatus: "enable",
            pageNum: 1,
            pageSize: 20,
        }),
        searchList: Object.freeze([
            { prop: 'productCode', label: '产品编码',type: 'input' },
            { prop: 'productName', label: '产品名称' ,type: 'input'},
            { prop: 'productDrawingNo', label: '型号',type: 'input' },
        ]),
        getcategoryTree,
        listMethod:getProductList,
        methodArr:{
            method: getcategoryTree,
            requestObj: { classAttribute: '' }
        }
    }
}
