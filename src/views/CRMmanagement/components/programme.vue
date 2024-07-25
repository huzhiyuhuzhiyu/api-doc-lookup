
 <template>
  
</template>
<script>
export default {
  props: {
    programmefrom: {
      type: Object
    }
  },
  data() {
    return {
      matchLogic: 'AND',
      conditionList: [],
      symbolOptions: [{
        label: '等于',
        value: "==",
        effectType: ['input', 'select', 'date', 'datetime', 'custom']
      }, {
        label: '大于等于',
        value: ">=",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '大于',
        value: ">",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '小于等于',
        value: "<=",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '小于',
        value: "<",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '不等于',
        value: "<>",
        effectType: ['input', 'date', 'datetime']
      }, {
        label: '包含',
        value: "like",
        effectType: ['input', 'select', 'custom']
      }, {
        label: '不包含',
        value: "notLike",
        effectType: ['input', 'select', 'custom']
      }, {
        label: '介于',
        value: "between",
        effectType: ['daterange', 'datetimerange']
      }]
    }
  },
  watch: {
    programmefrom(newtitle) {
      if (newtitle) this.selectPlan(newtitle)
    }
  },
  methods: {
    selectPlan(item) {
      this.matchLogic = item.matchLogic
      let tempConditionList = item.conditionJson ? JSON.parse(item.conditionJson) : []
      tempConditionList.forEach(condition => {
        condition.symbolOptions = this.symbolOptions.filter(symbolOption => symbolOption.effectType.includes(condition.type))
      })
      // 这里需要有解析方法名称的解决方案
      this.conditionList = tempConditionList
      this.query()
    },
    exist() {
      let isOk = true
      for (let i = 0; i < this.conditionList.length; i++) {
        const e = this.conditionList[i];
        if (!e.prop) {
          this.$message.error(`请选择查询字段`);
          isOk = false
          break
        }
      }
      return isOk
    },
    query() {
      if (!this.exist()) return
      let query = {
        matchLogic: this.matchLogic,
        condition: this.conditionList.reduce((result, item) => {
          let field = item.prop
          let fieldValue = item.value
          if (Array.isArray(fieldValue)) fieldValue = fieldValue.join(',')
          if (item.shiftConditionItem) { // 如果此搜索条件有映射的字段
            field = Object.keys(item.shiftConditionItem)[0]
            fieldValue = item.shiftConditionItem[Object.keys(item.shiftConditionItem)[0]]
          }
          if (typeof fieldValue === 'object' && false) { // 解析区间字段
            
          } else {
            result.push({
              field,
              fieldValue,
              symbol: item.symbol
            })
          }
          return result
        }, [])
      }
      this.$emit('superQuery', query)
      this.visible = false
    }
  }
}
</script>