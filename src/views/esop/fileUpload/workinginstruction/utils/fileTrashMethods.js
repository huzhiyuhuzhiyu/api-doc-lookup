import {getDelConfirm} from "@/utils";
import {deleteBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";

export default function (){
    return {
        async delFileUpload(){
            this.btnLoading = true
            await getDelConfirm(this)
            await deleteBimFileUpload(this.id)
            this.btnLoading = false
            this.$message.success("操作成功")
            this.goBack()
        }
    }
}
