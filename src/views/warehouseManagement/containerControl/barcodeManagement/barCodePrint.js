import { getLodop } from '@/utils/LodopFuncs'
import { message } from '@/utils/message';
import jnpf from '@/utils/jnpf';

// 长度控制（字符串数组，行最大长度）
function splitString(arr, maxLength) {
  const newArr = [];
  arr.forEach(item => {
    newArr.push('')
    let lineLength = 0;
    for (let i = 0; i < item.length; i++) {
      let spec = item[i].charCodeAt() > 255 ? 2 : 1
      if (lineLength + spec <= maxLength) { // 如果当前项还允许放入这一个字符
        newArr[newArr.length - 1] += item[i]
        lineLength += spec;
      } else {
        newArr.push('')
        lineLength = 0
        i--
      }
    }
  });
  return newArr
}

let printNum = 1 // 打印数量
let printTotal = 0 // 打印完成数量
const printWithLodop = (row, callBack, packingType, printType) => {
  const LODOP = getLodop();
  if (!LODOP) return message({
    dangerouslyUseHTMLString: true,
    message: `请先 <a style="text-decoration: underline;" target="_blank" href="${location.origin + '/static/print/logo-ys.jpg'}">下载Lodop打印插件</a>，如果已安装完成请刷新`,
    type: 'warning'
  });

  if (Array.isArray(row)) {
    if (!row.length) return message.error('请先选择要打印的条码')
    if (location.hostname === 'localhost' || location.href.indexOf('mode=dev') !== -1) if (row.length > 3) row = row.slice(0, 2) // 调试模式最多打印三张
    printNum = row.length
    printTotal = 0
    row.forEach(line => { printWithLodop(line, callBack, packingType, 'batch') })
    return
  }
  let printData = []
  /* 打印整体设置 */
  // LODOP.PRINT_INITA(0, 0, 260, 190, "");
  LODOP.PRINT_INITA(0, 0, 400, 600, "");
  LODOP.SET_PRINT_PAGESIZE(1, 1000, 700, ''); // 设置纸张大小 SET_PRINT_PAGESIZE(intOrient, PageWidth,PageHeight,strPageName)
  LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Width:100%;Height:100%"); // 指定整页缩放打印的比例。
  LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", true); // 设置打印完毕是否自动关闭预览窗口。

  LODOP.SET_PRINTER_INDEX("TSC TTP-244 Pro"); //设置默认打印机(这里用的是打印机名称)

  if (row.barcodeLines) { // 数据兼容
    row.productsName = row.barcodeLines[0].productsName
    row.drawingNo = row.barcodeLines[0].drawingNo
    row.spec = row.barcodeLines[0].productSpec
    row.productsNum = row.barcodeLines[0].totalNum
    row.netWeight = row.barcodeLines[0].netWeight
    row.productCategoryCode = row.barcodeLines[0].productCategoryCode
    row.productType = row.barcodeLines[0].productType
    row.mainUnit = row.barcodeLines[0].mainUnit
    packingType = row.packingType
  } else {
    row.productsNum = row.productsNum || row.totalNum
  }
  console.log('接收到打印', row, !!callBack, packingType, printType);
  if (row.documentType === 'purchase_receiving' && row.productCategoryCode == '6' && row.productType === 'pt003') { // 采购的原材料胶管箱子
    LODOP.SET_PRINT_PAGESIZE(1, 1000, 1500, '');
    LODOP.ADD_PRINT_RECT(10, 0, 365, 60, 0, 1);
    LODOP.ADD_PRINT_RECT(70, 0, 365, 60, 0, 1);
    LODOP.ADD_PRINT_RECT(130, 0, 365, 60, 0, 1);
    LODOP.ADD_PRINT_RECT(190, 0, 365, 60, 0, 1);
    LODOP.ADD_PRINT_RECT(250, 0, 365, 40, 0, 1);
    LODOP.ADD_PRINT_RECT(290, 0, 365, 40, 0, 1);
    LODOP.ADD_PRINT_RECT(330, 0, 365, 298, 0, 1);
    LODOP.ADD_PRINT_IMAGE(15, 300, 50, 50, `<img border='0' src='${location.origin}/static/print/logo-ys.png' width='100%' />`);
    LODOP.ADD_PRINT_TEXT(30, 20, 400, 30, '宁波怡盛液压技术有限公司'); // 文字打印 ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
    LODOP.SET_PRINT_STYLEA(0, "FontWidth", 900);
    LODOP.ADD_PRINT_BARCODE(360, 120, 135, 135, "QRCode", row.barCode); // 增加条形码 ADD_PRINT_BARCODE(Top, Left,Width, Height, CodeType, CodeValue)
    LODOP.ADD_PRINT_TEXT(485, 125, 400, 20, row.barCode); // 文字打印 ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "FontWidth", 700);
    LODOP.ADD_PRINT_TEXT(95, 45, 400, 20, '浙江省宁波市镇海区蛟川街道金达路259号');
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(155, 30, 400, 20, `生产日期：${row.productionDate || ''}`);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(155, 190, 400, 20, `到货日期：${row.sourceNoDeliverDate || ''}`);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(215, 30, 400, 20, `代码：${row.partnerCode || ''}`);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(265, 30, 400, 20, `产品代号`);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(305, 30, 400, 20, row.drawingNo || '');
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(265, 145, 400, 20, `管体型号`);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(305, 145, 400, 20, row.spec || '');
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(265, 260, 400, 20, `数量（${row.mainUnit}）`);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT(305, 260, 400, 20, row.productsNum || '');
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
  } else if (packingType === 'single') { // 单装
    const weight = jnpf.math('multiply', [row.netWeight, row.productsNum])
    const lineHeight = 18 // 行高

    LODOP.ADD_PRINT_RECT(10, 0, 365, 255, 0, 1); // 边框 ADD_PRINT_RECT(Top,Left,Width,Height,Type,lineWidth) 0-实线 1-破折线 2-点线 3-点划线 4-双点划线
    LODOP.ADD_PRINT_RECT(70, 0, 365, 1, 0, 1);
    LODOP.ADD_PRINT_IMAGE(15, 20, 50, 50, `<img border='0' src='${location.origin}/static/print/logo-ys.png' width='100%' />`);
    LODOP.ADD_PRINT_TEXT(30, 75, 400, 30, '宁波怡盛液压技术有限公司'); // 文字打印 ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
    LODOP.SET_PRINT_STYLEA(0, "FontWidth", 900);
    LODOP.ADD_PRINT_BARCODE(75, 230, 135, 135, "QRCode", row.barCode); // 增加条形码 ADD_PRINT_BARCODE(Top, Left,Width, Height, CodeType, CodeValue)
    LODOP.ADD_PRINT_TEXT(200, 235, 400, 20, row.barCode); // 文字打印 ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "FontWidth", 700);
    printData = [
      `产品图号：${row.drawingNo}`,
      row.processName ? `工序名称：${row.processName}` : null,
      `装箱数量：${row.productsNum} ${row.mainUnit || ' '}`,
      weight ? `单箱重量：${jnpf.numberFormat(weight, 4)} KG` : null,
      `入库日期：${row.createTime ? jnpf.toDate(row.createTime, 'yyyy-MM-dd') : jnpf.getToday()}`,
      row.sourceOrderNo ? `来源单据：${row.sourceOrderNo}` : null,
      row.partnerCode ? `供应商代码：${row.partnerCode}` : null
    ].filter(item => !!item)
    printData = splitString(printData, 30)
    for (let i = 0; i < printData.length; i++) {
      LODOP.ADD_PRINT_TEXT(85 + i * lineHeight, 10, 400, 20, printData[i]);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
      LODOP.SET_PRINT_STYLEA(0, "FontWidth", 700);
    }
  } else { // 混装
    const lineHeight = 18 // 行高

    LODOP.ADD_PRINT_RECT(10, 0, 365, 255, 0, 1); // 边框 ADD_PRINT_RECT(Top,Left,Width,Height,Type,lineWidth) 0-实线 1-破折线 2-点线 3-点划线 4-双点划线
    LODOP.ADD_PRINT_RECT(70, 0, 365, 1, 0, 1);
    LODOP.ADD_PRINT_IMAGE(15, 20, 50, 50, `<img border='0' src='${location.origin}/static/print/logo-ys.png' width='100%' />`);
    LODOP.ADD_PRINT_TEXT(30, 75, 400, 30, '宁波怡盛液压技术有限公司'); // 文字打印 ADD_PRINT_TEXT(Top,Left,Width,Height,strContent)
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 17);
    LODOP.SET_PRINT_STYLEA(0, "FontWidth", 900);
    LODOP.ADD_PRINT_BARCODE(75, 115, 135, 135, "QRCode", row.barCode); // 增加条形码 ADD_PRINT_BARCODE(Top, Left,Width, Height, CodeType, CodeValue)
    LODOP.ADD_PRINT_TEXT(200, 120, 400, 20, row.barCode);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.SET_PRINT_STYLEA(0, "FontWidth", 700);
    printData = [
      `入库日期：${jnpf.toDate(row.createTime, 'yyyy-MM-dd')}（混装）`
    ]
    printData = splitString(printData, 30)
    for (let i = 0; i < printData.length; i++) {
      LODOP.ADD_PRINT_TEXT(218 + i * lineHeight, 85, 400, 20, printData[i]);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
      LODOP.SET_PRINT_STYLEA(0, "FontWidth", 700);
    }

  }
  // LODOP.ADD_PRINT_IMAGE(0,0,100,400,"<img border='0' src='https://profile-avatar.csdnimg.cn/8127294c7ac1479d87c8dbbc05683d69_weixin_43966996.jpg!1' width='100%' />");
  // LODOP.PRINT_DESIGN(); // 设计
  // LODOP.PREVIEW(); // 预览
  LODOP.PRINT(); // 直接打印

  // 打印完成的回调
  if (printType === 'batch') {
    if (++printTotal === printNum) callBack()
  } else callBack()

}
export default printWithLodop