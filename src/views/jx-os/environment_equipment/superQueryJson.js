const superQueryJson = [{
  "clearable": true,
  "prefix-icon": "",
  "show-password": false,
  "__config__": {
    "formId": 101,
    "visibility": ["pc", "app"],
    "jnpfKey": "comInput",
    "noShow": false,
    "dragDisabled": false,
    "label": "点位名称",
    "trigger": "blur",
    "showLabel": true,
    "required": true,
    "tableName": "equipment",
    "renderKey": 1665985594210,
    "layout": "colFormItem",
    "tagIcon": "icon-ym icon-ym-generator-input",
    "unique": false,
    "tag": "el-input",
    "regList": [],
    "span": 24
  },
  "readonly": false,
  "__vModel__": "name",
  "style": {
    "width": "100%"
  },
  "disabled": false,
  "placeholder": "请输入",
  "show-word-limit": false,
  "__slot__": {
    "prepend": "",
    "append": ""
  },
  "suffix-icon": "",
  "on": {
    "change": "({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {n    // 在此编写代码n    n}",
    "blur": "({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {n    // 在此编写代码n    n}"
  }
}, {
  "clearable": true,
  "prefix-icon": "",
  "show-password": false,
  "__config__": {
    "formId": 102,
    "visibility": ["pc", "app"],
    "jnpfKey": "comInput",
    "noShow": false,
    "dragDisabled": false,
    "label": "点位编号",
    "trigger": "blur",
    "showLabel": true,
    "required": true,
    "tableName": "equipment",
    "renderKey": 1665985595352,
    "layout": "colFormItem",
    "tagIcon": "icon-ym icon-ym-generator-input",
    "unique": false,
    "tag": "el-input",
    "regList": [],
    "span": 24
  },
  "readonly": false,
  "__vModel__": "code",
  "style": {
    "width": "100%"
  },
  "disabled": false,
  "placeholder": "请输入",
  "show-word-limit": false,
  "__slot__": {
    "prepend": "",
    "append": ""
  },
  "suffix-icon": "",
  "on": {
    "change": "({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {n    // 在此编写代码n    n}",
    "blur": "({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {n    // 在此编写代码n    n}"
  }
}, {
  "filterable": false,
  "clearable": true,
  "__config__": {
    "formId": 103,
    "visibility": ["pc", "app"],
    "jnpfKey": "select",
    "defaultValue": "ELECTRICITY",
    "dataType": "dictionary",
    "dictionaryType": "351649524592159941",
    "dragDisabled": false,
    "label": "能耗类型",
    "trigger": "change",
    "propsUrl": "",
    "showLabel": true,
    "required": true,
    "tableName": "equipment",
    "props": {
      "label": "fullName",
      "value": "enCode"
    },
    "renderKey": 1665985633760,
    "layout": "colFormItem",
    "tagIcon": "icon-ym icon-ym-generator-select",
    "propsName": "",
    "tag": "el-select",
    "regList": [],
    "span": 24
  },
  "multiple": false,
  "__vModel__": "energyType",
  "style": {
    "width": "100%"
  },
  "disabled": false,
  "placeholder": "请选择",
  "__slot__": {
    "options": [{
      "enCode": "ELECTRICITY",
      "hasChildren": false,
      "fullName": "电",
      "id": "351650088159816901",
      "parentId": "0"
    }, {
      "enCode": "WATER",
      "hasChildren": false,
      "fullName": "水",
      "id": "351649884517969093",
      "parentId": "0"
    }, {
      "enCode": "GAS",
      "hasChildren": false,
      "fullName": "气",
      "id": "351649740284243141",
      "parentId": "0"
    }]
  },
  "on": {
    "change": "({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {n    // 在此编写代码n    n}"
  }
}, {
  "filterable": false,
  "clearable": true,
  "__config__": {
    "formId": 104,
    "visibility": ["pc", "app"],
    "jnpfKey": "select",
    "defaultValue": "NH",
    "dataType": "dictionary",
    "dictionaryType": "350188256479946181",
    "dragDisabled": false,
    "label": "类型",
    "trigger": "change",
    "propsUrl": "",
    "showLabel": true,
    "required": true,
    "tableName": "equipment",
    "props": {
      "label": "fullName",
      "value": "enCode"
    },
    "renderKey": 1665985703756,
    "layout": "colFormItem",
    "tagIcon": "icon-ym icon-ym-generator-select",
    "propsName": "",
    "tag": "el-select",
    "regList": [],
    "span": 24
  },
  "multiple": false,
  "__vModel__": "typeS",
  "style": {
    "width": "100%"
  },
  "disabled": false,
  "placeholder": "请选择",
  "__slot__": {
    "options": [{
      "enCode": "CG",
      "hasChildren": false,
      "fullName": "常规",
      "id": "350188585065915845",
      "parentId": "0"
    }, {
      "enCode": "NH",
      "hasChildren": false,
      "fullName": "能耗",
      "id": "350188782600857029",
      "parentId": "0"
    }, {
      "enCode": "XN",
      "hasChildren": false,
      "fullName": "虚拟",
      "id": "350189115192387013",
      "parentId": "0"
    }]
  },
  "on": {
    "change": "({ data, formData, setFormData, setShowOrHide, setRequired, setDisabled, request, getFieldOptions, setFieldOptions }) => {n    // 在此编写代码n    n}"
  }
}]
export default superQueryJson
