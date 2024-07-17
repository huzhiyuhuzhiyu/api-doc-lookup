<template>
  <div>
    <el-form :model="JNPFColTableData" ref="main">
      <el-table class="TableForm table" :data="JNPFColTableData.data" hasNO fixedNO hasC border ref="main">
        <el-table-column type="index" width="60" label="序号" align="center" :fixed="true ? 'left' : false" />

        <template v-for="item in tableItems">
          <el-table-column v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :min-width="item.minWidth" :fixed="item.fixed"
            :show-overflow-tooltip="item.type === 'view'">
            <template slot="header" v-if="isRequire(item)">
              <span class="required">*</span>{{ item.label }}
            </template>
            <template slot-scope="scope">
              <FormItem :item="item" :lineItem="JNPFColTableData.data[scope.$index]"
                :value="JNPFColTableData.data[scope.$index][scope.column.property]"
                @input="handleInput($event, scope.column.property, scope.$index)" :ref="scope.column.property"
                :openMode="realOpenMode" :scope="scope" :paramsObj="{ scope }" />
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" width="180" :fixed="true ? 'right' : false" v-if="hasA">
          <template slot-scope="scope">
            <!-- 抽屉 -->
            <el-button size="mini" type="text" v-if="hasEdit" @click="handlerOpenSource(scope)"
              :disabled="editDisabled">{{ editText }}</el-button>
            <el-button size="mini" type="text" v-if="hasDel"
            :disabled="delDisabled" @click="handlerDel(scope)">{{ delText }}</el-button>
          </template>
        </el-table-column>

        <div class="noDataTip" v-if="JNPFColTableData.data.length === 0">暂无数据</div>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import FormItem from "@/components/JNPF-col-table/item"
export default {
  components: { FormItem },
  name: 'tableFormProduct',
  data() {
    return {
      JNPFColTableData: {
        data: this.value
      }
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    tableItems: {
      type: Array,
      required: true
    },
    openMode: {
      type: String,
      default: '新建'
    },
    btnType: {
      type: String
    },
    hasA: {
      type: Boolean,
      default: true
    },
    delText: {
      type: String,
      default: '删除'
    },
    // 表格表单 操作抽屉栏按钮文字
    editText: {
      type: String,
      default: '编辑'
    },
    // 是否展示操作抽屉栏按钮
    hasEdit: {
      type: Boolean,
      default: true
    },
    // 是否展示删除按钮
    hasDel: {
      type: Boolean,
      default: true
    },
    editDisabled: {
      type: Boolean,
      default: false
    },
    delDisabled: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    value: {
      handler: function (newValue) {
        this.JNPFColTableData.data = newValue;
      },
      // deep: true
    }
  },
  computed: {
    hasFixed() {
      return this.tableItems.some(item => item.hasOwnProperty('fixed'))
    },
    realOpenMode() {
      if (this.btnType) {
        return this.btnType === 'look' ? '只读' : this.btnType === 'edit' ? '编辑' : '新建'
      } else {
        return this.openMode
      }
    }
  },
  mounted() {
    this.setDefaultValue();
  },
  methods: {
    handlerDel(scope) {
      this.$emit('delData', scope)
    },
    handleInput(val, key, index) {
      this.$emit('input', index, key, val);
    },
    setDefaultValue() {
      const formDataList = [...this.value]
      formDataList.forEach((item, index) => {
        this.tableItems.forEach((item2, index2) => {
          const { prop, value } = item2;
          if ((item[prop] === undefined || item[prop] === "" || item[prop] === null) && value != undefined) {
            item[prop] = value
          }
        })
      })
      this.$emit('input', [...formDataList]);
      // this.calcHeight()
    },
    handlerOpenSource(scope) {
      this.$emit('openSide', scope)
    },
    isRequire(data) {
      return data.hasOwnProperty('itemRules') && data.itemRules.some(item => item.required === true)
    },
    calcHeight() {
      this.$nextTick(() => {
        let tBody = document.querySelector('.TableForm.table')
        tBody.style.height = 'auto'
        tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
      });
    }
  }
}
</script>
<style scoped>
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

.topButton {
  margin-right: 8px;
  margin-left: 8px;
  font-size: 14px !important;
}

.noDataTip {
  text-align: 'center';
  padding: '10%';
  color: #aaa;
}
</style>