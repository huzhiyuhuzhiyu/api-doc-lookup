<template>
  <el-dialog v-bind="$attrs" :close-on-click-modal="false" :modal-append-to-body="false" v-on="$listeners" @open="onOpen"
    fullscreen lock-scroll class="JNPF-full-dialog" :show-close="false" :modal="false" append-to-body>
    <div class="JNPF-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/jnpf.png" class="header-logo" />
        <p class="header-txt"> · 打印预览</p>
      </div>
      <div class="options">
        <el-button v-if="isOrderConfirm" type="primary" size="small" @click="confirm">订单确认</el-button>
        <el-button type="primary" size="small" @click="word">下载</el-button>
        <el-button type="primary" size="small" @click="print">打印</el-button>
        <el-button @click="closeDialog()">{{ $t('common.cancelButton') }}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <div ref="tsPrint" class="print-content">
        <template v-if="data.pageType === 'custom'">
          <div v-for="(item, index) in data.T1" :key="index" v-html="printTemplate" :ref="'tsPrintItem' + index"
            style="page-break-after: always;font-family: simsun, 宋体, sans-serif; ">
          </div>
        </template>
        <template v-else>
          <div v-html="printTemplate" style="font-family: simsun, 宋体, sans-serif; " />
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import {getData} from '@/api/system/printDev'
import QRCode from 'qrcodejs2'
import { getQueryConfirm } from "@/utils";
import { confirmSaleOrdersNotice } from "@/api/salesManagement";
export default {
  props: ['id', 'formId', 'fullName', 'params','printHtml','noQr','recordList', 'enCode'],
  computed: {
    ...mapGetters(['userInfo']),
    isOrderConfirm() {
      return this.enCode === 'p003'
    },
  },
  data() {
    return {
      data: {},
      printTemplate: '',
      recordList: [],
      loading: false
    }
  },
  methods: {
     onOpen() {
       if(this.printHtml){
        this.printTemplate = this.printHtml
         this.loading = true
        this.$nextTick(()=>{
          const list = Array.from(this.$refs.tsPrint.querySelectorAll('[data-qrCode]'))
          list.forEach(item=>{
            const params = item.getAttribute('data-qrCode')
            let qrcode = new QRCode(item, JSON.parse(params))
            item.removeAttribute('data-qrCode')
            qrcode._el.title = ''
          })
          this.loading = false
        })
        return
      }
      if (!this.id) return
      this.printTemplate = ''
      this.data = {}
      this.loading = true
      console.log(this.params);

      let query = {
        id: this.id,
        formId: this.formId,
        params: this.params ? Object.values(this.params).join(',') : ''
      }
      console.log(query);
      return getData(query).then(async res => {
        if (!res.data) return
        this.printTemplate = res.data.printTemplate
        this.data = res.data.printData
        if (this.data.pageType === 'custom') {
          this.data.T1 && this.data.pageSize && (this.data.T1 = this.printPageDataFn(this.data.T1, this.data.pageSize * 1))
        }
        console.log(this.data.T1, 'this.data.T1');

        this.recordList = res.data.operatorRecordList || []
        this.replaceValue(this.data)
        this.replaceSysValue()
        await this.$nextTick()
          console.log(this.$refs.tsPrint, 'this.$refs.tsPrint');

          let barCodeEl = this.$refs.tsPrint.querySelector('[data-tag="headTable.bar_code"]')
          if (barCodeEl) {
            let str = barCodeEl.innerHTML
            // barCodeEl.parentElement.style.display = 'flex'
            // barCodeEl.parentElement.style.alignItems = 'center'
            barCodeEl.innerHTML = ''
            const params = {
              width: 65,
              height: 65,
              text: str, // 二维码内容
              // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
              correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
            }
            if(!this.noQr){
              let qrcode = new QRCode(barCodeEl, params)
              qrcode._el.title = ''
            }else{
              barCodeEl.setAttribute('data-qrCode', JSON.stringify(params))
            }

          }
          if (this.data.pageType === 'custom' && this.data.T1) {
            for (let t = 0; t < this.data.T1.length; t++) {
              const tableList = this.$refs['tsPrintItem' + t][0].getElementsByTagName('table')
              if (tableList.length) {
                for (let j = 0; j < tableList.length; j++) {
                  const tableObj = tableList[j];
                  // tableObj.style.border = '1px solid gray'
                  let tds = []
                  let newTable = []
                  for (let i = 0; i < tableObj.rows.length; i++) {
                    tds = tableObj.rows[i]
                    // tds.style.height = '22px'
                    // tds.style.border = '1px solid gray'
                    const dataTag = this.isChildTable(tds.cells)
                    if (dataTag) {
                      this.retrieveData(dataTag, tableObj, tds, newTable, t)
                    } else {
                      newTable.push(tds)
                    }
                  }
                  tableObj.getElementsByTagName('tbody')[0].innerHTML = ''
                  for (let i = 0; i < newTable.length; i++) {
                    tableObj.getElementsByTagName('tbody')[0].appendChild(newTable[i])
                  }
                }
              }
            }
          } else {
            const tableList = this.$refs.tsPrint.getElementsByTagName('table')
            if (tableList.length) {
              for (let j = 0; j < tableList.length; j++) {
                const tableObj = tableList[j];
                // tableObj.style.border = '1px solid gray' // 改代码为处理原来样式边框冲突问题，现已解决
                let tds = []
                let newTable = []
                for (let i = 0; i < tableObj.rows.length; i++) {
                  tds = tableObj.rows[i]
                  // tds.style.height = '22px'
                  const dataTag = this.isChildTable(tds.cells)
                  if (dataTag) {
                    this.retrieveDataTwo(dataTag, tableObj, tds, newTable)
                  } else {
                    newTable.push(tds)
                  }
                }
                tableObj.getElementsByTagName('tbody')[0].innerHTML = ''
                for (let i = 0; i < newTable.length; i++) {
                  tableObj.getElementsByTagName('tbody')[0].appendChild(newTable[i])
                }
              }
            }
          }
          if (this.$refs.tsPrint.querySelectorAll('img').length) {
            this.$refs.tsPrint.querySelectorAll('img').forEach(item => {
              item.crossOrigin = 'anonymous'
              const imgType = item.src.substring(item.src.lastIndexOf('.') + 1);
              this.compressImage(item, 0.7, 800, imgType)
            })
          }

          if (this.$refs.tsPrint && this.data.pageType === 'custom') {
            let upperMoneyList = this.$refs.tsPrint.querySelectorAll('[data-tag="T1.大写子表金额合计"]')
            let totalList = this.$refs.tsPrint.querySelectorAll('[data-tag="T1.小写子表金额合计"]')
            let numList = this.$refs.tsPrint.querySelectorAll('[data-tag="T1.子表数量合计"]')
            let pageNumList = this.$refs.tsPrint.querySelectorAll('[data-tag="pageNum.pageNum"]')
            let pageSizeList = this.$refs.tsPrint.querySelectorAll('[data-tag="pageSize.pageSize"]')
            let TbarCodeEl = this.$refs.tsPrint.querySelectorAll('[data-tag="T1.bar_code"]')
            // if (upperMoneyList.length) {
            if (this.data.T1 && this.data.T1.length) {
              this.data.T1.forEach((e, i) => {
                // pageSizeList[i].innerHTML = this.data.T1.length
                pageSizeList && pageSizeList[i] && (pageSizeList[i].textContent = this.data.T1.length)
                upperMoneyList && upperMoneyList[i] && (upperMoneyList[i].textContent = e['大写子表金额合计'])
                totalList && totalList[i] && (totalList[i].textContent = e['小写子表金额合计'])
                numList && numList[i] && (numList[i].textContent = e['子表数量合计'])
                pageNumList && pageNumList[i] && (pageNumList[i].textContent = i + 1)
                if (TbarCodeEl && TbarCodeEl[i]) {
                  e.pagedata?.forEach((j,b)=>{
                    let str = j.bar_code
                    TbarCodeEl[b].innerHTML = ''
                    const params ={
                      width: 65,
                      height: 65,
                      text: str, // 二维码内容
                      correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
                    }
                    if (!this.noQr) {
                      let qrcode = new QRCode(TbarCodeEl[b], params)
                      qrcode._el.title = ''
                    } else {
                      TbarCodeEl[b].setAttribute('data-qrCode', JSON.stringify(params))
                    }
                  })
                }
              })
            }
            // }
          }else{
            let TbarCodeEl = this.$refs.tsPrint.querySelectorAll('[data-tag="T1.bar_code"]')

            if (this.data.T1 && this.data.T1.length) {
              this.data.T1.forEach((e, i) => {
                if (TbarCodeEl && TbarCodeEl[i]) {
                  let str = e.bar_code
                  TbarCodeEl[i].innerHTML = ''
                  const params = {
                    width: 65,
                    height: 65,
                    text: str, // 二维码内容
                    correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
                  }
                  if (!this.noQr) {
                    let qrcode = new QRCode(TbarCodeEl[i], params)
                    qrcode._el.title = ''
                  } else {
                    TbarCodeEl[i].setAttribute('data-qrCode', JSON.stringify(params))
                  }
                }
              })
            }
          }
        this.loading = false
        return this.$refs.tsPrint.innerHTML
      })
    },
    async confirm() {
      this.loading = true
      try {
        await getQueryConfirm(this, '此操作将确认送货通知单，是否继续？')

        const formId = this.recordList.map(item => item.formId)[0]
        await confirmSaleOrdersNotice(formId)
        this.$message.success('确认成功')
      } catch ( error ) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '确认失败');
        }
      } finally {
        this.loading = false
      }
    },
    isChildTable(cells) {
      let tableName = ''
      outer: for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        // cell.style.height = '22px'
        // cell.style.border = '1px solid gray' // 改代码为处理原来样式边框冲突问题，现已解决
        let spanList = cells[j].getElementsByTagName('span')
        if (!spanList.length) break outer;
        let hasChildTable = false
        inner: for (let j = 0; j < spanList.length; j++) {
          const spanEle = spanList[j];
          const dataTag = spanEle.getAttribute('data-tag') ? spanEle.getAttribute('data-tag').split('.')[0] : 'null'
          if (dataTag && dataTag !== 'headTable' && dataTag !== 'null') {
            hasChildTable = true
            tableName = dataTag
            break inner
          }
        }
        if (hasChildTable) break outer;
      }
      return tableName
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    shengchengtable(data, tds) {
      for (let key in data) {
        for (let j = 0; j < tds.cells.length; j++) {
          // tds.cells[j].style.height = '22px'
          // tds.cells[j].style.border = '1px solid gray'
          let spanList = tds.cells[j].getElementsByTagName('span')

          for (let i = 0; i < spanList.length; i++) {
            if (`{${key}}` === spanList[i].innerHTML) {
              spanList[i].innerHTML = data[key]
            }
          }
        }
      }
      return tds
    },
    getAttribute(element,dataName){
      if (!element) return
      const val= element.getAttribute(dataName)
        if(val){return val}
        if(element.children.length){
            for(let item of element.children){
                const v = this.getAttribute(item,dataName)
                if(v){
                    return v
                }
            }
        }
        return null

    },
    // 固定头尾分页使用
    retrieveData(dataTag, tableObj, tds, newTable, j) {
      if (dataTag == 'T1') {
        inner: for (let c = 0; c < this.data.T1[j].pagedata.length; c++) {
          newTable.push(this.shengchengtable(this.data.T1[j].pagedata[c], tds.cloneNode(true)))
          if(this.getAttribute(tds,"data-tag") ==='T1.大写子表金额合计' || this.getAttribute(tds,"data-tag") ==='T1.小写子表金额合计' || this.getAttribute(tds,"data-tag") ==='T1.子表数量合计'){
            console.log("单行生成 return")
            return
          }
          if (c === this.data.T1[j].pagedata.length - 1) {
            newTable = []
          }
        }
      }
    },
    // 不固定 自动下一页使用
    retrieveDataTwo(dataTag, tableObj, tds, newTable) {
      for (let key in this.data) {
        if (key == dataTag) {
          for (let j = 0; j < this.data[key].length; j++) {
            newTable.push(this.shengchengtable(this.data[key][j], tds.cloneNode(true)))
          }
        }
      }
    },
    getHandleName(handleStatus) {
      if (handleStatus == 0) return "拒绝"
      if (handleStatus == 1) return "通过"
      if (handleStatus == 2) return "发起"
      if (handleStatus == 3) return "撤回"
      if (handleStatus == 4) return "终止"
      if (handleStatus == 5) return "指派"
      if (handleStatus == 6) return "加签"
      if (handleStatus == 7) return "转审"
      if (handleStatus == 8) return "变更"
      if (handleStatus == 9) return "复活"
      return ''
    },
    replaceSysValue() {
      const recordList = this.recordList
      const systemPrinter = this.userInfo.userName + '/' + this.userInfo.userAccount
      const systemPrintTime = this.jnpf.toDate(new Date())
      let systemApprovalContent = ''
      if (recordList.length) {
        systemApprovalContent += '<table style="border-collapse: collapse; width: 100%;" border="1" data-mce-style="border-collapse: collapse; width: 100%;"><tbody><tr><td style="width:20%;" data-mce-style="width: 20%;">节点名称</td><td style="width:20%;" data-mce-style="width: 20%;">操作人员</td><td style="width:20%;" data-mce-style="width: 20%;">操作时间</td><td style="width:20%;" data-mce-style="width: 20%;">执行动作</td><td style="width: 20%;" data-mce-style="width: 20%;">备注</td></tr>'
        let content = ''
        for (let i = 0; i < recordList.length; i++) {
          const record = recordList[i];
          content += `<tr><td style="width: 20%;" data-mce-style="width: 20%;"><span class="wk-print-tag-wukong wk-tiny-color--common" contenteditable="false">${record.nodeName}</span></td><td style="width: 20%;" data-mce-style="width: 20%;"><span class="wk-print-tag-wukong wk-tiny-color--common" contenteditable="false">${record.userName}</span></td><td style="width: 20%;" data-mce-style="width: 20%;"><span class="wk-print-tag-wukong wk-tiny-color--common" contenteditable="false">${this.jnpf.toDate(record.handleTime)}</span></td><td style="width: 20%;" data-mce-style="width: 20%;"><span class="wk-print-tag-wukong wk-tiny-color--common" contenteditable="false">${this.getHandleName(record.handleStatus)}</span></td><td style="width: 20%;" data-mce-style="width: 20%;"><span class="wk-print-tag-wukong wk-tiny-color--common" contenteditable="false">${record.handleOpinion || ""}</span></td></tr>`
        }
        systemApprovalContent += content
        systemApprovalContent += '</tbody></table>'
      }
      this.printTemplate = this.replaceAll(this.printTemplate, '{systemPrinter}', systemPrinter)
      this.printTemplate = this.replaceAll(this.printTemplate, '{systemPrintTime}', systemPrintTime)
      this.printTemplate = this.replaceAll(this.printTemplate, '{systemApprovalContent}', systemApprovalContent)
    },
    replaceValue(data) {
      for (let key in data) {
        this.printTemplate = this.replaceAll(this.printTemplate, `{${key}}`, data[key] || '')
        if (Array.isArray(data[key]) && data[key] && data[key].length) {
          this.replaceValue(data[key])
        }
      }
    },
    replaceAll(data, replace, value) {
      const lenr = replace.length
      const len = data.length
      let newData = ''
      let i = 0
      for (i; i < len; i++) {
        let k = 0
        let string = ''
        for (k; k < lenr; k++) {
          var n = i + k
          string += data[n]
        }
        if (string === replace) {
          newData += value
          i = i + lenr
        }
        newData += data[i]
      }
      return newData
    },
    word() {
      let print = this.$refs.tsPrint.innerHTML
      const blob = new Blob([print], {
        type: ''
      })
      const name = this.fullName ? `${this.fullName}.doc` : '下载文档.doc'
      this.downloadFile(blob, name)
    },
    downloadFile(data, name, type) {
      let blob = new Blob([data], {
        type: type || ''
      })
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = name
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
      this.$emit('close')
    },
    print() {
      let print = this.$refs.tsPrint.innerHTML
      this.$nextTick(() => {
        let newStr = print
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'position: absolute; width: 0;height: 0;');
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        // 4. 写入内容//
        doc.write('<style media="print"> @page {margin: 5mm; padding: 0;}</style>');
        doc.write(`<link href="./printForm.scss" media="print" rel="stylesheet" />`);
        doc.write(newStr);
        const link = doc.getElementsByTagName('link')[0];
        link.onload = async () => {
          try {
            iframe.contentWindow.print()
            iframe.contentWindow.location.reload(true)
          } catch (e) {
            console.error('记录打印失败:', e)
          } finally {
            iframe.remove()
            this.$refs.tsPrint.removeAttribute('style');
            this.$emit('close')
          }
        }
        // link.onload = () => { // 样式文件加载完毕后打印// 5.执行打印
        //   iframe.contentWindow.print();
        //   iframe.contentWindow.location.reload(true)
        //   // 6.重置工作
        //   // document.body.removeChild(iframe);
        //   iframe.remove()
        //   this.$refs.tsPrint.removeAttribute('style');
        //   this.$emit('close')
        // }


        // let newWindow = window.open('_blank')
        // newWindow.document.innerHTML = print
        // newWindow.print()
        // newWindow.close()

      })
    },
    // 处理分页
    printPageDataFn(data, pageSize = 20) {
      const printTable = []
      if (data && data.length > 0) {
        let remainderLength = Math.floor(data.length / pageSize) * pageSize
        let pagedata = []
        let pageNum = 0
        for (let i = 0; i < data.length; i++) {
          // 在将数据推入 pagedata 时，新增 index 字段
          data[i].index = i + 1
          pagedata.push(data[i])
          pageNum++
          if (pageNum === pageSize || ( i === data.length - 1)) {

            printTable.push({
              '小写子表金额合计': this.jnpf.numberFormat(pagedata.reduce((accumulator, currentValue) => (accumulator * 1 ? accumulator * 1 : '') + currentValue['子表金额'] * 1, 0),4),
              '子表数量合计': pagedata.reduce((accumulator, currentValue) => (accumulator * 1 ? accumulator * 1 : '') + currentValue['子表数量'] * 1, 0),
              '大写子表金额合计': this.digitUppercase(pagedata.reduce((accumulator, currentValue) => accumulator + currentValue['子表金额'] * 1, 0).toFixed(2)),
              pagedata: pagedata
            })
            pagedata = []
            pageNum = 0
          }
        }
        if (pageSize > data.length && pagedata && pagedata.length > 0) {
          printTable.push({
            '小写子表金额合计': this.jnpf.numberFormat(pagedata.reduce((accumulator, currentValue) => (accumulator * 1 ? accumulator * 1 : '') + currentValue['子表金额'] * 1, 0),4),
            '子表数量合计': this.jnpf.numberFormat(pagedata.reduce((accumulator, currentValue) => (accumulator * 1 ? accumulator * 1 : '') + currentValue['子表数量'] * 1, 0),4),
            '大写子表金额合计': this.digitUppercase(pagedata.reduce((accumulator, currentValue) => accumulator + currentValue['子表金额'] * 1, 0).toFixed(2)),
            pagedata: pagedata
          })
        }

      }
      return printTable
    },
    // 处理金额
    digitUppercase(n) {
      var fraction = ['角', '分'];
      var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
      ];
      var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ];
      var head = n < 0 ? '欠' : '';
      n = Math.abs(n);
      var s = '';
      for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
      }
      return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    },
    getBase64(image) {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      // 将canvas的内容转换为base64编码的字符串
      var base64 = canvas.toDataURL("image/png");// 可以根据需要更改为其他格式，如'image/jpeg'等
      return base64;
    },
    compressImage(img, quality, maxWidth, imgType) {
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(`image/${imgType}`, quality);
        img.src = dataUrl
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.print-content {
  position: relative;
  background: white;
  padding: 40px 30px;
  margin: 0 auto;
  border-radius: 4px;
  width: 776px;
  height: 100%;
  overflow: auto;
}

//.print-content table td,
//th {
//  border: 1px solid gray !important;
//
//}
</style>
<style lang="scss" scoped>
@media print {
  @page {
    // size: portrait !important; // 纵向
    size: auto; // 纵向
    margin: 3mm;
  }
}
</style>
