<template>
  <div class="JNPF-common-layout commonIng_box">
    <!-- <img src="@/assets/images/commonImg.png" alt="" srcset="" class="commonImg"> -->
    <img src="@/assets/images/welcomePage.jpg" alt="" srcset="" class="commonImg" />
    <!-- <div class="commonImg">欢迎使用数字化生产平台</div> -->
    <el-dialog title="是否设置所属项目，一旦设置无法修改" :visible.sync="dialogVisible" width="30%" :close-on-press-escape="false"
      :close-on-click-modal="false" :show-close="false">
      <el-radio-group v-model="radio">
        <el-radio :label="0">关闭</el-radio>
        <el-radio :label="1">开启</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
import { mapGetters } from 'vuex'
export default {
  name: 'commonPage',
  data() {
    return {
      dialogVisible: false,
      radio: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    console.log(this.userInfo, 'userInfo')
    if (this.userInfo.userAccount === 'admin') {
      // this.getProjectSwitch()
    }
  },
  methods: {
    getProjectSwitch() {
      let obj = {
        businessCode: 'system',
        pageSize: -1
      }
      getBimBusinessSwitchConfigList(obj).then((res) => {
        res.data.system.forEach((item) => {
          if (item.configKey == 'project') {
            this.isProjectSwitch = item.configValue1
            if (!this.isProjectSwitch) {
              this.dialogVisible = true
            }
          }
        })
      })
    },
    submit() {
      let query = [{
        active: true,
        businessCode: 'system',
        configKey: 'project',
        configKeyLabel: '启用项目管理',
        configValue1: Number(this.radio),
        configValue2: '',
        configValue3: '',
        createByName: null,
        description: '该设置涉及到整个系统是否使用多个项目管理，一但设置则不允许修改。',
        editFlag: false,
        id: '401',
        parentId: null,
        radio: 0,
        state: true,
        updateByName: null
      }]
      editBimBusinessData(query).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.dialogVisible = false
        } else {
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
<style scoped>
.commonIng_box {
  position: relative;
  background: #fff;
}

.commonImg {
  /* object-fit: fill; */

  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  /* color: #17abe3;
    font-size: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    letter-spacing: 4px; */
}
</style>
