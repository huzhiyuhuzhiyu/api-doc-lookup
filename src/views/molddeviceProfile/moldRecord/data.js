/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "moldName",
      label: "模具名称",
      minWidth: 120,
    },
    {
      prop: "moldCode",
      label: "模具编码",
      minWidth: 120,
    },
    {
      prop: "categorizeName",
      label: "分类名称",
      minWidth: 120,
    },
    {
      prop: "moldStatus",
      label: "模具状态",
      minWidth: 120,
      slot: true,
      dictType: "moldStatusList",
    },
    {
      prop: "moldUsedNumber",
      label: "模具使用次数",
      minWidth: 160,
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    }
  ]
}
