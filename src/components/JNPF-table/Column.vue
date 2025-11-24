<script>
export default {
  name: 'jnpf-table-column',
  functional: true,
  render(createElement, context) {
    const columns = context.props.columns || []
    const columnList = context.props.columnList || []

    // 建立 prop 到 vnode 的映射
    const propToVNode = {}
    columns.forEach(vnode => {
      const prop = vnode.componentOptions?.propsData?.prop
      if (prop) propToVNode[prop] = vnode
    })

    // 按 columnList 顺序渲染
    const renderVNodes = columnList
      .filter(item => item.columnVisible)
      .map(item => {
        const vnode = propToVNode[item.prop]
        if (vnode) {
          if (vnode.componentOptions && vnode.componentOptions.propsData) {
            if (!vnode.componentOptions.propsData.key) {
              vnode.componentOptions.propsData.key = item.prop
            }
            if (!vnode.componentOptions.propsData.showOverflowTooltip !== false) {
              vnode.componentOptions.propsData.showOverflowTooltip = true
            }
          }
          vnode.key = item.prop
        }
        return vnode
      })
      .filter(Boolean)

    // 处理无prop的列（如操作列/插槽列）
    const noPropVNodes = columns.filter(
      vnode => !vnode.componentOptions?.propsData?.prop
    )
      .map((vnode, index) => {
        const uniqueKey = `no-prop-${index}`
        if (vnode.componentOptions && vnode.componentOptions.propsData) {
          if (!vnode.componentOptions.propsData.key) {
            vnode.componentOptions.propsData.key = uniqueKey
          }
        }
        vnode.key = uniqueKey
        return vnode
      })

    return [...renderVNodes, ...noPropVNodes]
  }
}
</script>
