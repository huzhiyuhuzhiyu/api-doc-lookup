<template>
 <div>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" label-position="top" label-width="120px">
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请选择客户" readonly @focus="openDialog"
          :disabled="btnType == 'add' ? false : true">
        </el-input>
      </el-form-item>
      <el-form-item label="客户编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入客户编码" maxlength="20" disabled />

      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注"
          :disabled="btnType == 'look'" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
  <el-dialog title="选择客户" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-left">
        <div class="JNPF-common-title">
          <h2>客户分类</h2>
          <span class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>

        <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
          <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
            :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
            v-if="refreshTree" :filter-node-method="filterNode">
            <!-- <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i
                    :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                  <span class="text" :title="data.name">{{ data.name }}</span>
                </span> -->
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.code" placeholder="请输入客户编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
            <el-table-column prop="code" label="客户编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="客户名称" />
            <el-table-column prop="taxId" label="税号" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="seleceCustomer(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData" />
        </div>
      </div>
    </div>

  </el-dialog>
 </div>
</template>

<script>
import { getOrderDetail, addOrders, editOrders, getcategoryTrees, getAttributeline, getcooperativeProduct, getCopyOrders, getWorkOrderNo, uploadProduct, } from '@/api/salesManagement/assemblyOrders'
import { getCounryData, getCooperativeInfo, getCooperativeData, getscheduleList } from '@/api/basicData/index'

export default {
  data() {
    return {
      customerVisible: false,
      title: "",
      visible: false,
      btnLoading: false,
      formLoading: false,

      dataForm: {
        // 合作伙伴
        code: '',
        name: '',

      },
      tableDataCustomer: [],
      treeData: [],
      btnType: "",
      treeLoading: false,
      refreshTree: true,
      expands: true,
      total: 0,
      listLoading: false,
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
    }
  },
  created() {
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.search()
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
      this.searchAllProduct()
    },
    getNodePathProduct(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    handleClose() {
      this.form = {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 打开选择客户弹框
    openDialog() {
      this.customerVisible = true
      this.getcategoryTree()
    },
      // 获取客户数据
      getcategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        keyword: '',
        type: "customer"
      };
      getcategoryTrees(listQuery).then(res => {
        this.treeData = res.data
        this.$nextTick(() => {
          this.initData()
          this.treeLoading = false
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    // 选择客户
    seleceCustomer(e) {
      console.log("e====>", e);
      if (this.productData.length > 0) {
        this.$confirm('此操作将清空产品数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.contractId = ''
          this.dataForm.contractNo = ''
          this.productData = []
          getCooperativeInfo(e.id).then(res => {
            let addressInfo = {}
            if (res.data.deliveryAddressList.length > 0) {
              res.data.deliveryAddressList.forEach((item, index) => {
                if (item.defaultFlag) {
                  addressInfo = item
                  this.dataForm.recipient = addressInfo.recipient
                  this.dataForm.phone = addressInfo.phone
                  this.dataForm.country = addressInfo.country === '中国' ? 'CN' : addressInfo.country
                  if (this.dataForm.country === 'CN') {

                    this.dataForm.province = addressInfo.province
                    this.dataForm.city = addressInfo.city
                    this.dataForm.area = addressInfo.area
                    this.dataForm.address = addressInfo.address
                    this.defaultAddress = addressInfo.countryText + addressInfo.provinceText + addressInfo.cityText + addressInfo.areaText + addressInfo.address
                  } else {
                    this.dataForm.province = ''
                    this.dataForm.city = ''
                    this.dataForm.area = ''
                    this.defaultAddress = (addressInfo.countryText ? addressInfo.countryText : '') + addressInfo.address
                  }
                } else {
                  this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
                  this.dataForm.phone = res.data.deliveryAddressList[0].phone
                  this.dataForm.country = res.data.deliveryAddressList[0].country === '中国' ? 'CN' : res.data.deliveryAddressList[0].country
                  if (this.dataForm.country === 'CN') {

                    this.dataForm.province = res.data.deliveryAddressList[0].province
                    this.dataForm.city = res.data.deliveryAddressList[0].city
                    this.dataForm.area = res.data.deliveryAddressList[0].area
                    this.dataForm.address = res.data.deliveryAddressList[0].address
                    this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].provinceText + res.data.deliveryAddressList[0].cityText + res.data.deliveryAddressList[0].areaText + res.data.deliveryAddressList[0].address
                  } else {
                    this.dataForm.province = ''
                    this.dataForm.city = ''
                    this.dataForm.area = ''
                    this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].address
                  }
                }
              });
            } else {
              this.dataForm.recipient = ""
              this.dataForm.phone = ""
              this.dataForm.country = ""
              this.dataForm.province = ""
              this.dataForm.city = ""
              this.dataForm.area = ""
              this.dataForm.address = ""
              this.defaultAddress = ""
            }

          })
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          console.log(56565656);
          this.ProductListRequestObjs.partnerId = e.id
          console.log("this.ProductListRequestObjs", this.ProductListRequestObjs);
          this.dataForm.cooperativePartnerName = e.name
          this.dataForm.cooperativePartnerCode = e.code

          this.dataForm.code = e.code
          this.customerVisible = false
          this.getQuotationdatalist()


          // }
          if (this.dataForm.orderType != 'normal' && this.dataForm.orderType != 'urgent') {
            this.contractFlag = true
          } else {
            this.contractFlag = false

          }
        }).catch(() => {
          this.customerVisible = false
        })
      } else {
        getCooperativeInfo(e.id).then(res => {
          let addressInfo = {}
          if (res.data.deliveryAddressList.length > 0) {
            res.data.deliveryAddressList.forEach((item, index) => {
              if (item.defaultFlag) {
                addressInfo = item
                this.dataForm.recipient = addressInfo.recipient
                this.dataForm.phone = addressInfo.phone
                this.dataForm.country = addressInfo.country === '中国' ? 'CN' : addressInfo.country
                if (this.dataForm.country === 'CN') {

                  this.dataForm.province = addressInfo.province
                  this.dataForm.city = addressInfo.city
                  this.dataForm.area = addressInfo.area
                  this.dataForm.address = addressInfo.address
                  this.defaultAddress = addressInfo.countryText + addressInfo.provinceText + addressInfo.cityText + addressInfo.areaText + addressInfo.address
                } else {
                  this.dataForm.province = ''
                  this.dataForm.city = ''
                  this.dataForm.area = ''
                  this.defaultAddress = (addressInfo.countryText ? addressInfo.countryText : '') + addressInfo.address
                }
              } else {
                this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
                this.dataForm.phone = res.data.deliveryAddressList[0].phone
                this.dataForm.country = res.data.deliveryAddressList[0].country === '中国' ? 'CN' : res.data.deliveryAddressList[0].country
                if (this.dataForm.country === 'CN') {

                  this.dataForm.province = res.data.deliveryAddressList[0].province
                  this.dataForm.city = res.data.deliveryAddressList[0].city
                  this.dataForm.area = res.data.deliveryAddressList[0].area
                  this.dataForm.address = res.data.deliveryAddressList[0].address
                  this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].provinceText + res.data.deliveryAddressList[0].cityText + res.data.deliveryAddressList[0].areaText + res.data.deliveryAddressList[0].address
                } else {
                  this.dataForm.province = ''
                  this.dataForm.city = ''
                  this.dataForm.area = ''
                  this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].address
                }
              }
            });
          } else {
            this.dataForm.recipient = ""
            this.dataForm.phone = ""
            this.dataForm.country = ""
            this.dataForm.province = ""
            this.dataForm.city = ""
            this.dataForm.area = ""
            this.dataForm.address = ""
            this.defaultAddress = ""
          }

        })
        this.customerData = e
        this.dataForm.cooperativePartnerId = e.id
        this.dataForm.cooperativePartnerName = e.name
        this.dataForm.cooperativePartnerCode = e.code
        this.ProductListRequestObjs.partnerId = e.id


        this.dataForm.code = e.code
        this.customerVisible = false
        this.getQuotationdatalist()
        // if (e.country) {
        //   this.changeCountry(e.country)
        // }
        // if (e.province) {
        //   let obj = {
        //     id: e.province
        //   }
        //   this.changeProvince(obj)

        // }
        // if (e.city) {
        //   let ooo = {
        //     id: e.city
        //   }
        //   this.changeCity(ooo)


        // }
        if (this.dataForm.orderType != 'normal' && this.dataForm.orderType != 'urgent') {
          this.contractFlag = true
        } else {
          this.contractFlag = false

        }
      }

      this.dataForm.paymentMethod = e.paymentMethod
      this.dataForm.paymentCycle = e.paymentCycle
      if (e.modeTransport == "SH") {
        this.dataForm.delivery = "deliver_goods"
      }
      if (e.modeTransport == "ZT") {
        this.dataForm.delivery = "self_pickup"
      }

      if (e.modeTransport == "KD") {
        this.dataForm.delivery = "express_delivery"
      }
      if (e.modeTransport == "HY") {
        this.dataForm.delivery = "freight_transport"
      }
      if (e.modeTransport == "DF") {
        this.dataForm.delivery = "collect_payment"
      }
    },



    cancelFun() {
      this.visible = false
      console.log("this.$refs['dataForm']",);
      this.$refs['dataForm'].resetFields()
    },
    // 电话 手机 二填一
    validateField2(rule, value, callback) {
      if (!this.dataForm.phone && !value) {
        callback(new Error('电话和手机号至少填一个'));
      } else {
        callback();
      }
    },







    init(id, btnType) {
      this.visible = true
      if (btnType == "add") {
        this.title = "新增服务记录"
      } else if (btnType == "edit") {
        this.title = "编辑服务记录"
      } else {
        this.title = "查看服务记录"
      }
      this.btnType = btnType
      return
      this.dataForm.id = id || ''
      this.parentId = parentId || ''
      if (this.btnType) {
        this.salesFlag = true
        this.isdisabled = true
      } else {
        this.isdisabled = false

      }
      if (this.dataForm.id) {
        getCooperativeInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data.cooperativePartner
          if (this.dataForm.departmentId) {
            getOrganizeInfo(this.dataForm.departmentId).then(sss => {
              this.organizeIdTrees = sss.data.organizeIdTree || []
              console.log("this.dataForm.departmentId", this.dataForm.departmentId);
              this.organizeIdTrees.push(this.dataForm.departmentId)
            })
            getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
              if (res.data.length > 0) {
                res.data.forEach(item => {
                  item.name = item.fullName.split('/')[0]
                });
              }
              console.log(this.salesList);
              this.salesList = res.data
            })
          }
          if (res.data.cooperativePartner.regionCode == 'domestic') {
            // 国内
            this.countryList = [{
              code: "CN",
              id: "1663107232693223475",
              name: "中国",
              nameEn: "China",
            }]
          } else {

            this.countryList = []
            let obj = {
              "keyword": "",
              "orderItems": [
                {
                  "asc": true,
                  "column": ""
                }
              ],
              "pageNum": 1,
              "pageSize": -1
            }
            getCounryData(obj).then(res => {
              this.countryList = res.data.records.filter((item) => {
                return item.name !== '中国'
              })

            })
          }

          if (res.data.cooperativePartner.province) {
            let obj = {
              id: res.data.cooperativePartner.province
            }
            getProvinceList(res.data.cooperativePartner.province).then(res => {
              console.log(res);
              this.cities = res.data.list
            })

          }
          if (res.data.cooperativePartner.city) {
            let ooo = {
              id: res.data.cooperativePartner.city
            }
            // this.changeCity(ooo)
            getProvinceList(res.data.cooperativePartner.city).then(res => {
              console.log(res);
              this.area = res.data.list
            })
          }

          this.contactsList = res.data.contactsList
          this.deliveryAddressList = res.data.deliveryAddressList
          this.deliveryAddressList.forEach(is => {
            if (is.province) {
              let ccc = {
                id: is.province
              }
              this.changeProvince1(ccc)
            }
            if (is.city) {
              let fff = {
                id: is.city
              }
              this.changeCity1(fff)

            }
          });
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }
        })
      }
    },
    goBack() {
      this.$emit('close')
    },


  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}
</style>