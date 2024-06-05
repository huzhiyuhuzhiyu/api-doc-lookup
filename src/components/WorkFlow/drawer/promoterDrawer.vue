<!--
 * @Date: 2022-08-04 16:29:35
 * @LastEditors: StavinLi
 * @LastEditTime: 2022-09-21 11:17:15
 * @FilePath: /Workflow/src/components/drawer/promoterDrawer.vue
-->
<template>
  <el-drawer :append-to-body="true" title="发起人" :visible.sync="promoterDrawer" direction="rtl"
    class="set_promoter JNPF-common-drawer" size="550px" :before-close="closeDrawer">
    <div class="demo-drawer__content">
      <div class="promoter_content drawer_content">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="节点编码" prop="code">
                <el-input v-model="dataForm.code" placeholder="请输入节点编码" maxlength="20" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="primary" @click="addPromoter">添加/修改发起人</el-button>
        <p class="selected_list">
          <span>{{ $func.arrToStr(flowPermission) ? $func.arrToStr(flowPermission) : '所有人' }}
          </span>
        </p>
      </div>
      <div class="demo-drawer__footer clear">
        <el-button type="primary" @click="savePromoter">确 定</el-button>
        <el-button @click="closeDrawer">取 消</el-button>
      </div>
      <user-select v-show="false" ref="userRef" @change="surePromoter" clearable style="width: 100%;"></user-select>
      <!-- <employees-dialog 
                :isDepartment="true"
                :visible.sync="promoterVisible"
                :data.sync="checkedList"
                @change="surePromoter"
            /> -->
    </div>
  </el-drawer>
</template>
<script>
import employeesDialog from '../dialog/employeesDialog.vue'
import { mapState, mapMutations } from 'vuex'
export default {
  components: { employeesDialog },
  data() {
    return {
      flowPermission: [],
      promoterVisible: false,
      checkedList: [],
      dataForm: {
        code: '',
      },
      dataRule: {
        code: [{ required: true, message: '请输入节点编码', trigger: 'blur' }],
      }
    }
  },
  computed: {
    ...mapState('workflow', ['promoterDrawer', 'flowPermission1']),
  },
  watch: {
    flowPermission1(val) {
      console.log(val);
      this.flowPermission = val.value
    }
  },
  methods: {
    ...mapMutations('workflow', ['SET_PROMOTER', 'SET_FLOW_PERMISSION']),
    addPromoter() {
      this.$nextTick(() => {
        console.log(this.$refs.userRef);
        this.$refs.userRef.openDialog()
      })
    },
    surePromoter(id, data) {
      let _data = []
      _data.push({
        targetId: data.id,
        type: 1,
        name: data.fullName.split('/')[0]
      })
      this.flowPermission = _data;
      this.promoterVisible = false;
    },
    savePromoter() {
      this.flowPermission[0].code = this.dataForm.code
      this.$store.commit('workflow/SET_FLOW_PERMISSION', {
        value: this.flowPermission,
        flag: true,
        id: this.flowPermission1.id
      })
      this.closeDrawer()
    },
    closeDrawer() {
      this.$store.commit('workflow/SET_PROMOTER', false)
    }
  }
}
</script>
<style lang="scss">
.set_promoter {
  .promoter_content {
    padding: 0 20px;

    .el-button {
      margin-bottom: 20px;
    }

    p {
      padding: 18px 0;
      font-size: 14px;
      line-height: 20px;
      color: #000000;
    }
  }
}
</style>