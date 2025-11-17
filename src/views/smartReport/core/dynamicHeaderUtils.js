/**
 * 动态表头工具类
 */
export default {
  /**
   * 初始化表格数据
   * @param {Object} context - 组件上下文
   * @param {Object} dynamicHeadersConfig - 动态表头配置
   */
  async initData(context, dynamicHeadersConfig) {
    context.listLoading = true;
    const loadKey = context.loadKey = +new Date()
    const {enable, config} = dynamicHeadersConfig;

    try {
      // 从context中获取fetchApi而不是通过参数传递
      const res = await context.config.fetchApi(context.listQuery);
      if (loadKey !== context.loadKey) return
      let {records, total} = res.data?.page ?? res.data;

      // if(config.processColumns?.length){
      //   records = this.transformProcessData(records);
      // }

      context.apiTotalData = res.data?.page ? res.data.total : null;

      if (enable) {
        this.dynamicData(context, records, config);
      }

      context.tableData = records;
      context.total = total;
    } catch (error) {
      if (loadKey !== context.loadKey) return
      console.error('获取数据失败:', error);
    } finally {
      context.listLoading = false;
    }
  },

  getSummaries(param, context) {
    const {columns} = param;
    const sums = [];
    const {showSummary, summaryMapping = {}} = context.summaryConfig;

    // 需要存在接口返回汇总值
    if (!showSummary || !context.apiTotalData) return sums;

    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '合计';
        return;
      }

      // 获取映射后的汇总值
      sums[index] = this.getMappedSummaryValue(column.property, summaryMapping, context);
    });

    return sums;
  },

  /**
   * 获取映射后的接口汇总值
   */
  getMappedSummaryValue(displayProp, mapping, context) {
    // 1. 查找映射字段（优先使用配置的映射）
    const dataProp = mapping[displayProp] || displayProp;

    // 2. 处理嵌套属性（如date.qualified）
    const value = dataProp.includes('.')
      ? dataProp.split('.').reduce((obj, key) => obj?.[key], context.apiTotalData)
      : context.apiTotalData[dataProp];

    return value !== undefined ? value : '--';
  },

  /**
   * 处理动态数据
   * @param {Object} context - 组件上下文
   * @param {Array} records - 表格数据
   * @param {Object} headersConfig - 表头配置
   */
  dynamicData(context, records, headersConfig) {
    if (!records?.length) return;

    const newHeaders = this.generateHeaders(records[0], headersConfig);

    if (this.headersChanged(newHeaders, context.cachedHeaders)) {
      context.generatedHeaders = newHeaders;
      context.$nextTick(() => {
        context.$refs.dataTable?.doLayout();
      });

      context.cachedHeaders = JSON.parse(JSON.stringify(newHeaders));
    } else {
      context.generatedHeaders = context.cachedHeaders;
    }
  },

  /**
   * 检查表头是否变化
   */
  headersChanged(newHeaders, cachedHeaders) {
    return !cachedHeaders ||
      JSON.stringify(newHeaders) !== JSON.stringify(cachedHeaders);
  },

  /**
   * 生成表头
   * @param {Object} sampleData - 表头数据
   * @param {Object} headersConfig - 表头配置
   */
  generateHeaders(sampleData, headersConfig) {
    const headers = [];
    const {leftFields, dynamicColumns, dateColumns,processColumns} = headersConfig;

    // 优化固定列创建逻辑
    leftFields.forEach(fieldConfig => {
      headers.push(this.createBaseColumn(fieldConfig));
    });

    // 处理工序动态列
    // if (processColumns?.length) {
    //   // 收集所有可能的工序名称（从sampleData中提取）
    //   const processNames = Object.keys(sampleData).filter(key => {
    //     const value = sampleData[key];
    //     return value && typeof value === 'object' && 'num' in value && 'sort' in value;
    //   });
    //
    //   // 按sort排序
    //   const sortedProcesses = processNames
    //     .map(name => ({
    //       name,
    //       sort: parseInt(sampleData[name]?.sort || 0)
    //     }))
    //     .sort((a, b) => a.sort - b.sort);
    //
    //   // 创建表头
    //   sortedProcesses.forEach(process => {
    //     headers.push({
    //       prop: `${process.name}.num`,
    //       label: process.name,
    //       minWidth: this.calcWidthByText(process.name),
    //       align: 'center',
    //       sortable: true,
    //       formatter: (row) => row[process.name]?.num || '--'
    //     });
    //   });
    // }

    // 优化动态列处理
    if (dynamicColumns?.length) {
      dynamicColumns.forEach(colConfig => {
        const matchedFields = this.matchFields(sampleData, colConfig)
          .sort((a, b) => {
            if (a === "合计" && b === "合计") return 0;
            if (a === "合计") return 1;  // a是"合计"，排后面
            if (b === "合计") return -1; // b是"合计"，排前面
            return 0; // 其他情况保持原顺序
          });
        matchedFields.forEach(field => {
          headers.push(this.createDynamicColumn(field, colConfig, sampleData));
        });
      });
    }

    // 优化日期列处理
    if (dateColumns) {
      Object.keys(sampleData)
        .filter(key => {
          // 双重匹配条件
          const isDateField = dateColumns.datePattern.test(key);
          const isChineseField = /[\u4e00-\u9fa5]/.test(key);
          return isDateField || isChineseField;
        })
        .sort((a, b) => {
          // 判断字段类型
          const isDateA = dateColumns.datePattern.test(a);
          const isDateB = dateColumns.datePattern.test(b);
          const isChineseA = /[\u4e00-\u9fa5]/.test(a);
          const isChineseB = /[\u4e00-\u9fa5]/.test(b);

          // 规则 1: 日期字段排在最前面，并按时间排序
          if (isDateA && isDateB) {
            const getDay = (dateStr) => {
              // 提取“日”部分（支持格式：YYYY-MM-DD、YYYY/MM/DD、YYYY-M-D）
              const parts = dateStr.split('-');
              return Number(parts[parts.length - 1]);
            };
            return getDay(a) - getDay(b);
          }

          // 规则 2: 日期字段优先于中文字段
          if (isDateA && !isDateB) return -1;
          if (!isDateA && isDateB) return 1;

          // 规则 3: 中文字段统一放到最后，并按拼音排序
          if (isChineseA && isChineseB) {
            return a.localeCompare(b, 'zh-CN'); // 按中文拼音排序
          }

          // 默认：中文字段排最后
          if (isChineseA) return 1;
          if (isChineseB) return -1;

          return 0;
        })
        .forEach(matchedField => {
          // 创建对应的列配置
          const column = this.createDateColumn(matchedField, dateColumns);

          // 如果是纯中文字段（非日期）
          if (!dateColumns.datePattern.test(matchedField) && /[\u4e00-\u9fa5]/.test(matchedField)) {
            column.label = matchedField;  // 直接使用中文作为列名
            column.minWidth = this.calcWidthByText(matchedField); // 根据中文长度计算宽度
          }

          headers.push(column);
        });
    }

    return headers;
  },

  /**
   * 创建基础列
   */
  createBaseColumn(config) {
    return {
      prop: config.prop,
      label: config.label,
      minWidth: config.minWidth || this.calcWidthByText(config.label),
      sortable: config.sortable || false,
      fixed: config.fixed || false,
      align: config.align || 'left'
    };
  },

  /**
   * 创建动态列
   */
  createDynamicColumn(field, config, data) {
    const column = {
      prop: field,
      label: field,
      minWidth: this.calcWidthByText(field),
      align: 'center'
    };

    if (config.children && typeof data[field] === 'object') {
      column.children = config.children.map(child => ({
        prop: `${field}.${child.prop}`,
        label: child.label,
        minWidth: this.calcWidthByText(child.prop),
        align: 'center'
      }));
    }

    return column;
  },

  /**
   * 创建日期列
   */
  createDateColumn(dateField, dateConfig) {
    const isChineseField = !dateConfig.datePattern.test(dateField) && /[\u4e00-\u9fa5]/.test(dateField);
    const column = {
      prop: dateField,
      label: isChineseField
        ? dateField  // 中文字段直接显示
        : (dateConfig.dateFormatter?.(dateField) || dateField), // 日期字段格式化
      minWidth: isChineseField
        ? this.calcWidthByText(dateField)  // 中文宽度动态计算
        : 150,  // 日期列默认宽度
    };

    if (dateConfig.mergeParent && dateConfig.children) {
      column.children = dateConfig.children.map(child => ({
        prop: `${dateField}.${child.prop}`,
        label: child.label,
        minWidth: child.maxWidth ? child.maxWidth:this.calcWidthByText(child.prop),
        align: 'center'
      }));
    }

    return column;
  },

  /**
   * 字段匹配逻辑
   */
  matchFields(data, config) {
    const fields = Object.keys(data);

    if (config.type === 'exact') {
      return fields.includes(config.field) ? [config.field] : [];
    }

    if (config.type === 'chinese') {
      return fields.filter(field => /[\u4e00-\u9fa5]/.test(field));
    }

    if (config.type === 'hybird') {
      return fields.filter(field => /[\u4e00-\u9fa5]/.test(field) || config.extraColumns.includes(field));
    }


    return [];
  },

  /**
   * 计算文本宽度
   */
  calcWidthByText(text, options = {}) {
    const {
      baseWidth = 10,
      charWidth = 10,
      minWidth = 120,
      maxWidth = 300,
      unit = 'px'
    } = options;

    const length = [...String(text)].length;

    let width = baseWidth + (length * charWidth);

    width = Math.max(width, minWidth);
    width = Math.min(width, maxWidth);

    return `${width}${unit}`;
  },

  /**
   * 扁平化多级表头
   */
  flattenColumns(columns) {
    return columns.reduce((acc, column) => {
      if (column.children) {
        return [...acc, ...this.flattenColumns(column.children)];
      }
      return [...acc, column];
    }, []);
  },

  /**
   * 转换数据结构
   * 将 processWipCirculationList 数组转换为 { 工序名: { num, sort } } 平铺格式
   */
  transformProcessData(records) {
    if (!Array.isArray(records)) return records;

    return records.map(item => {
      if (!item) return item;

      // 确保处理的是原始数组格式
      if (Array.isArray(item.processWipCirculationList)) {
        // 创建平铺的工序属性
        item.processWipCirculationList.forEach(process => {
          item[process.processName] = {
            num: process.num,  // 确保使用正确的字段名
            sort: process.sort
          };
        });
      }
      return item;
    });
  },
}
