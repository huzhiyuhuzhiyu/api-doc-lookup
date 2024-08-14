<template>
  <div>
    <el-popover v-model="visible" placement="bottom-start" trigger="click" width="250" :visible-arrow="false" popper-class="no-padding-popover">
      <div class="xr-radio-menu">
        <div class="xr-radio-menu__content">
          <div v-for="item in userlist" :key="item.name" :class="{'selected':item.name==dataForm.name}" class="xr-radio-menu-item" @click="actionuser(item)">{{item.name}}</div>
          <div class="xr-radio-menu-default">
            <div></div>
            <el-button type="primary" @click="confirm">确定</el-button>
          </div>
        </div>
      </div>
      <el-input v-model="innerValue" readonly placeholder="请选择" slot="reference">
        <template slot="suffix">
          <i :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-down']"></i>
        </template>
      </el-input>
    </el-popover>
    <user-select ref="userselect" v-show="false" @change="userchange" :multiple="true"></user-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrganization } from '@/api/permission/user'
import { getSubordinate } from '@/api/permission/userSetting'
export default {
  data() {
    return {
      personnellist: [],
      visible: false,
      innerValue: '仅本人',
      dataForm: {
        name: '仅本人',
        code: 'jbr'
      },
      userlist: [
        { name: '仅本人', code: 'jbr' },
        { name: '本人及下属', code: 'brjxs' },
        { name: '仅本部门', code: 'jbbm' },
        // { name: '本部门及下属部门', code: 'bbmjxsbm' },
        { name: '自定义', code: 'zdy' }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    userchange(id, data) {
      this.personnellist = data
      this.dataForm.name = '自定义'
      this.dataForm.code = 'zdy'
      this.confirm()
    },
    actionuser(val) {
      if (val.code == 'zdy') {
        this.$refs.userselect.openDialog()
      } else {
        this.dataForm.name = val.name
        this.dataForm.code = val.code
      }
    },

    async confirm() {
      this.innerValue = this.dataForm.name
      if (this.dataForm.code == 'jbbm') {
        let organizelist = await getOrganization({ keyword: "", organizeId: this.userInfo.organizeId })
        this.personnellist = organizelist.data.map(item => item.id)
      } else if (this.dataForm.code == 'brjxs') {
        let Subordinates = await getSubordinate(this.userInfo.userId)
        this.personnellist = Subordinates.data.map(item => item.id)
      } else if (this.dataForm.code == 'jbr') {
        this.personnellist = [this.userInfo.userId]
      } else if (this.dataForm.code == 'zdy') {
        let a = this.personnellist.map(item => item.fullName)
        this.innerValue = a.join(',')
        this.personnellist = this.personnellist.map(item => item.id)
      }
      this.$emit('change', this.personnellist)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.xr-radio-menu {
  .xr-radio-menu__content {
    max-height: 250px;
    overflow-y: auto;
    .xr-radio-menu-item {
      position: relative;
      box-sizing: border-box;
      height: 34px;
      padding: 0 20px;
      overflow: hidden;
      font-size: 14px;
      line-height: 34px;
      color: #42526e;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &.selected {
        font-weight: 700;
        color: #0052cc;
        background-color: #deebff;
        box-shadow: inset 2px 0 0 #0052cc;
      }
    }
    .xr-radio-menu-item:hover {
      background-color: #ebecf0;
    }
    .xr-radio-menu-default {
      display: flex;
      -webkit-box-pack: justify;
      justify-content: space-between;
      padding: 8px 16px;
      line-height: 32px;
      border-top: 1px solid #dfe1e6;
    }
  }
}
</style>