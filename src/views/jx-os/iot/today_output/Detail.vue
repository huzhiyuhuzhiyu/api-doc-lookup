<template>
  <el-dialog title="详情" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1200px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="设备名称" prop="name">
              <p>{{dataForm.name}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备分类" prop="categoryId">
              <p>{{dataForm.categoryId}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备编号" prop="code">
              <p>{{dataForm.code}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="运行时间" prop="brank">
              <p>{{dataForm.brank}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="生产数量" prop="supplier">
              <p>{{dataForm.output}}</p>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'
  import PrintBrowse from '@/components/PrintBrowse'
  import jnpf from '@/utils/jnpf'
  export default {
    components: {
      PrintBrowse
    },
    props: [],
    data() {
      return {
        visible: false,
        loading: false,
        printBrowseVisible: false,
        printId: '',
        dataForm: {
          id: '',
          name: '',
          categoryId: "",
          code: '',
          brank: '',
          supplier: '',
        },
        categoryIdProps: {
          "label": "name",
          "value": "id",
          "children": "children"
        },

      }
    },
    computed: {},
    watch: {},
    created() {

    },
    mounted() {},
    methods: {
      dataInfo(dataAll) {
        let _dataAll = dataAll
        this.dataForm = _dataAll
      },

      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.loading = true
            request({
              url: '/api/equipment/Equipment/detail/' + this.dataForm.id,
              method: 'get'
            }).then(res => {
              this.dataInfo(res.data)
              this.loading = false
            })
          }

        })
      },
    },
  }
</script>
