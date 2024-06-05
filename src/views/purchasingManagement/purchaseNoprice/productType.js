/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-05-15 11:28:36
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-05-15 11:32:23
 * @FilePath: \os-web\src\views\purchasingManagement\purchaseNoprice\productType.js
 * @Description: 产品类别 后续增加 加入
 */
const productType = {
  getType(type){
    switch (type) {
      case 'pt001':
        return '胶管总成'
        break;
      case 'pt002':
        return '钢管总成'
        break;
      case 'pt003':
        return '胶管'
        break;
      case 'pt004':
        return '套筒'
        break;
      case 'pt005':
        return '过渡接头总成'
        break;
      case 'pt006':
        return '软管接头总成'
        break;
      case 'pt007':
        return '过渡接头'
        break;
      case 'pt008':
        return '软管接头'
        break;
    
      case 'pt009':
        return '护套'
        break;
    
      default:
        break;
    }
  },
}
export default productType