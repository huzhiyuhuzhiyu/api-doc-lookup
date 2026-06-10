<template>
  <div>
    <el-drawer title="配置订购比例" :visible.sync="drawer" :direction="direction" :wrapperClosable="false"
      :before-close="handleClose" size="40%">
      <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
        <el-tab-pane label="供应商配置订购比例" name="personnel">
          <!-- 人员配置 -->
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-table hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" size='mini' id="table"
              style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
              <el-table-column prop="cooperativePartnerName" label="供应商名称">
                <template slot="header">
                  <span class="required">*</span>供应商名称
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'cooperativePartnerName'"
                    :rules='productRule.listPrice'>
                    <el-input v-model="scope.row.cooperativePartnerName" :disabled="type === 'look'" readonly
                      maxlength="20" placeholder="供应商名称">
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="orderProportion" label="订购比例">
                <template slot="header">
                  <span class="required">*</span>订购比例(%)
                </template>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.orderProportion" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'orderProportion'"
                    :rules='productRule.orderProportion'>
                    <el-input v-model="scope.row.orderProportion" :disabled="type === 'look'" maxlength="5"
                      placeholder="请输入订购比例">
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <!-- <el-table-column label="操作" width="90">
                <template slot-scope="scope">
                  <el-button type="text" v-if="type != 'look'" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                    @click="handlerDelete(scope.$index, 'personnel')">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </el-form>

        </el-tab-pane>


      </el-tabs>

      <div class="footer">
        <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submitForm('dataForm')" v-if="type != 'look' ? true : false">
          {{ $t('common.confirmButton') }}
        </el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script>

import formValidate from "@/utils/formValidate";
export default {
  components: {

  },
  data() {
    return {
      types: '',
      drawer: false,
      direction: 'rtl',
      type: '',
      activeName: 'personnel',
      dataFormTwo: {
        data: [],
      },
      productRule: {
        orderProportion: [
          { required: true, message: '请输入订购比例', trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [5, 2, "", (errMsg) => { this.$message.error('订购比例：' + errMsg) }] }), trigger: ['blur'] },
          { validator: this.maxLength(), trigger: ['blur'] },
        ],
      }
    }
  },

  methods: {
    // 订购比例校验
    maxLength() {
      return (rule, value, callback) => {
        let msg = '比例不能超过100'
        if (!value || value == 0) { callback() }
        else {
          if (value * 1 > 100) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg));
          }else{
            callback()
          }
        }
      };
    },
    init(data, type) {
      console.log(data, '资源')
      // this.dataForm = data
      this.type = type
      console.log(this.type);
      this.dataFormTwo.data = data
      console.log(this.dataFormTwo.data);
      this.drawer = true

    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },

    handleClose(done) {
      this.drawer = false
    },
   async submitForm() {
      let sum = 0
      console.log(this.dataFormTwo.data);
      this.dataFormTwo.data.forEach(item => {
        if(item.orderProportion) {
          item.orderProportion = item.orderProportion * 1
          if (!isNaN(item.orderProportion)) {
            console.log(item.orderProportion);
            sum += item.orderProportion
            console.log(sum);
          }
        }else{
          this.$message.error('订购比例不能为空')
        }
      });
      if (sum  > 100 || sum != 100) {
        this.$message.error('订购比例之和应为100')
      } else {
        let form_2 = this.$refs['productForm']
        let valid_2 = await form_2.validate().catch(err => false)
        if  (!valid_2) {
          for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                const item = this.dataFormTwo.data[i]
                if (!item.orderProportion) {
                  this.$message({
                    type: 'error',
                    message: '请选择第' + (i + 1) + '行的订购比例',
                    duration: 1500,
                  })
                  break
                }
              }
              return
        }else{
          this.drawer = true
          this.$message.success('配置订购比例成功')
          this.$emit('confirm', this.dataFormTwo.data)
        }
      }



    },

  }
}
</script>

<style scoped>
.submit {
  position: absolute;
  bottom: 20px;
  left: 50%;
}

.footer {
  margin: 20px 20px 20px;
  display: flex;
  justify-content: flex-end;
}

::v-deep .is-stretch {
  display: block !important;
}

.el-tabs__nav.is-stretch /deep/ {
  min-width: none !important;
  display: flex;
  justify-content: flex-start;
}

.custom-tab-pane .el-tab-pane__content {
  width: 500px;
}

.el-tabs__active-bar /deep/ {
  width: 60px !important;
}

.el-tabs__header {
  max-width: 316px !important;
}

::v-deep .el-tabs__content {
  padding: 0px 10px !important;
}

::v-deep .el-tab-pane {
  height: 75vh !important;
}

.required {
  color: red;
  margin-right: 4px;
}

/* ::v-deep .el-table__body-wrapper.is-scrolling-none {
  min-height: 685px !important;

} */</style>