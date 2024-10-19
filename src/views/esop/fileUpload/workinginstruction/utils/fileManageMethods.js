import {getDelConfirm} from "@/utils";
import {deleteBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";

export default function (){
    return {
        async delFileUpload(){
            try {
                this.btnLoading = true
                await getDelConfirm(this)
                await deleteBimFileUpload(this.id)
                this.$message.success("操作成功")
                this.goBack()
            }catch (e) {

            }finally {
                this.btnLoading = false
            }

        }
    }
}
