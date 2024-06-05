<template>
  <el-dialog title="选择产品" :close-on-click-modal="false" :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center"
    lock-scroll append-to-body width="700px">
    <el-row class="JNPF-common-search-box" :gutter="16">
      <el-form @submit.native.prevent>
        <el-col :span="10">
          <el-form-item label="关键词">
            <el-input v-model="keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="init()" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="init()">{{$t('common.search')}}
            </el-button>
            <el-button icon="el-icon-refresh-right" @click="refresh()">{{$t('common.reset')}}
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="JNPF-common-search-box-right">
        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
          <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="init()" />
        </el-tooltip>
      </div>
    </el-row>
    <JNPF-table v-loading="listLoading" :data="list" hasC @selection-change="handleSelectionChange" :border="false">
      <el-table-column prop="name" label="名称" width="200" />
      <el-table-column prop="code" label="编码" />
      <el-table-column prop="specification" label="规格" />
      <el-table-column prop="repertory" label="库存数量" />
    </JNPF-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" @click="select()">{{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    GoodsList
  } from '@/api/extend/order'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  export default {
    data() {
      return {
        visible: false,
        listLoading: true,
        keyword: '',
        list: [],
        total: 0,
        checked: []
      }
    },
    methods: {
      init() {
        this.visible = true
        this.listLoading = true
        let query = {
          keyword: this.keyword
        }
        // GoodsList(query).then(res => {
        //   this.list = res.data.list
        //   this.listLoading = false
        // })
        getDataInterfaceRes("340388223601609541",query).then(res =>{
          console.log(res);
            this.list = res.data
            this.listLoading = false
        })


      },
      refresh() {
        this.keyword = ''
        this.init()
      },
      select() {
        if (!this.checked.length) return
        this.visible = false
        this.$emit('refreshDataList', this.checked)
      },
      handleSelectionChange(val) {
        this.checked = val
      }
    }
  }
</script>
<style lang="scss" scoped>
  >>>.el-dialog__body {
    height: 70vh;
    padding: 0 0 10px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .JNPF-common-search-box {
      margin-bottom: 0;

      .JNPF-common-search-box-right {
        padding: 10px 10px 0 0;
      }
    }
  }
</style>
