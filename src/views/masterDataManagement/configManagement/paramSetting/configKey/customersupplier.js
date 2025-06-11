export default {
  dz_customersupplier: {
    configKeyLabel: '启用地址必填',
    description: '启用地址，国家，省，市，区，地址必填'
  },
   customer_product_no: {
    configKeyLabel: '是否回写客户物料号',
    description: '如果启用，则在销售订单新建订单时，填写客户物料号后，在提交订单后，该物料号会新增到客户产品中'
  },
  included_tax_flag: {
    configKeyLabel: '启用含税不含税',
    description: '1、启用含税则在客户产品会显示含税单价；2、则在客户产品中展示不含税单价；3、都显示',
  },
}
