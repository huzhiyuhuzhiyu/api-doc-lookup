<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <div class="pageTitle">新建成品采购退货通知单</div>
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交
          </el-button>
          <!-- <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button> -->
        </div>
      </div>
      <div class="main" ref="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="btnType == 'look'
                          ? true
                          : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                            ? false
                            : true
                          "></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="是否出库" prop="stockFlag">
                        <el-select v-model="dataForm.stockFlag" placeholder="请选择是否出库" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false">
                          <el-option v-for="(item, index) in stockFlagList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
               
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="供应商名称" prop="partnerName">
                        <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly @focus="openDialog"
                          :disabled="btnType == 'look'"></el-input>
                      </el-form-item>
                    </el-col>
             
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="操作人" prop="salesman">
                        <el-input v-model="dataForm.salesman" placeholder="请选择操作人"
                          :disabled="btnType == 'look'"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="退货日期" prop="deliverDate">
                        <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择退货日期" type="date"
                          :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="退货状态" prop="deliveryStatus">
                        <el-select v-model="dataForm.deliveryStatus" placeholder="请选择退货状态" clearable
                          style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                          <el-option v-for="(item, index) in deliveryStatusList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="退货完成时间" prop="deliveryCompletionDate">
                        <el-date-picker v-model="dataForm.deliveryCompletionDate" type="datetime"
                          placeholder="请选择退货完成时间" :disabled="btnType == 'look'" style="width: 100%;"
                          clearable></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="检验状态" prop="inspectionStatus">
                        <el-select v-model="dataForm.inspectionStatus" placeholder="请选择检验状态" clearable
                          style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                          <el-option v-for="(item, index) in inspectionStatusList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建时间" prop="createTime">
                        <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                          :disabled="btnType == 'look'" style="width: 100%;" clearable></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建人" prop="createByName">
                        <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                          maxlength="20" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'"
                          type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="productInfo">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    icon="el-icon-plus" @click="openSeleceProductDialog()">
                    选择产品
                  </el-button>
                  |
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                    批量删除
                  </el-button>
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO
                    @selection-change="handeleProductInfoData" :height="customStyleData">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType !== 'look'"
                      key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <!-- <el-table-column prop="customerProductNo" label="客户产品编码" width="200" show-overflow-tooltip> -->
                    <!-- </el-table-column> -->
                    <el-table-column prop="projectName" label="所属项目" width="120"
                      v-if="isProjectSwitch === '1'"></el-table-column>
                    <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom"
                      show-overflow-tooltip />
                    <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
                      :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
                    <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
                    <el-table-column prop="purchaseQuantity" label="订单数量" width="160" sortable="custom"
                      v-if="isReturnSwitch === '1'" />
                    <el-table-column prop="purchaseQuantity2" label="数量(副)" width="160" sortable="custom"
                      v-if="isDeputyUnitSwitch === '1' && isReturnSwitch === '1'" />
                    <el-table-column prop="receiptQuantity" label="入库数量" width="160" sortable="custom"
                      v-if="isReturnSwitch === '1'" />
                    <el-table-column prop="receivedQuantity" label="退货数量" width="170" v-if="!dataForm.exchangeGoodsFlag"
                      key="789">
                      <template slot="header">
                        <span class="required">*</span>
                        退货数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'receivedQuantity'"
                          :rules="productRules.receivedQuantity">
                          <el-input v-model="scope.row.receivedQuantity" placeholder="请输入退货数量"
                            :disabled="btnType == 'look'" maxlength="11" @input="watchnums(scope.row, scope.$index)"
                            style="width: 145px;">
                            {{ scope.row.receivedQuantity }}
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="含税单价" width="130">
                      <template slot="header">
                        <span class="required">*</span>
                        单价(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                          <el-input v-model="scope.row.price" placeholder="单价(含税)"
                            :disabled="isReturnSwitch === '1' || btnType == 'look'" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="金额" width="140">
                      <template slot="header">
                        <span class="required">*</span>
                        金额(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'totalAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxRate" label="税率" width="140">
                      <template slot="header">
                        <span class="required">*</span>
                        税率
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :rules="productRules.taxRate">
                          <el-select v-model="scope.row.taxRate" :disabled="isReturnSwitch === '1' || btnType == 'look'"
                            placeholder="请选择" style="width: 100%;">
                            <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                              :value="item.enCode"></el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150">
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxPrice'">
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxPrice }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="taxAmount" label="税额" min-width="100">
                      <template slot="header">
                        <span class="required">*</span>
                        税额
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'taxAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="180">
                      <template slot="header">
                        <span class="required">*</span>
                        金额(不含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                      </template>
                    </el-table-column>
                    <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom"
                      v-if="sealingCoverTypingFlag == 1" />
                    <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom"
                      v-if="accuracyLevelFlag == 1" />
                    <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom"
                      v-if="vibrationLevelFlag == 1" />
                    <el-table-column prop="oil" label="油脂" width="160" sortable="custom" v-if="oilFlag == 1" />
                    <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom"
                      v-if="oilQuantityFlag == 1" />
                    <el-table-column prop="clearance" label="游隙" width="160" sortable="custom"
                      v-if="clearanceFlag == 1" />
                    <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom"
                      v-if="packagingMethodFlag == 1" />
                    <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
                      v-if="specialRequireFlag === '1'" />
                    <el-table-column prop="material" label="材质" width="130" :key="1015"
                      v-if="materialFlag == 1"></el-table-column>
                    <el-table-column prop="colour" label="颜色" width="130" :key="1015"
                      v-if="colourFlag == 1"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin:0 10px">总退货数量：{{ totalDeliveryQuantity }}</span>
                  </div>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="选择供应商" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="customerVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="80%"
        append-to-body @close="handleClose">
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
              <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i :class="[
                    data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
                  ]" />
                  <span class="text" :title="data.name">{{ data.name }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="form.code" placeholder="请输入供应商编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="form.name" placeholder="请输入供应商名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="form.taxId" placeholder="请输入税号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
                <el-table-column prop="code" label="供应商编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="供应商名称" />
                <el-table-column prop="taxId" label="税号" />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="seleceCustomer(scope.row)" size="mini">选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData" />
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body @close="productVisible = false">
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6" v-if="isReturnSwitch === '0'">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun()"  v-model="productForm.productCode" placeholder="产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="isProductNameSwitch === '1'">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun()"  v-model="productForm.productName" placeholder="产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="isReturnSwitch === '1'">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun()"  v-model="orderForm.drawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-if="isReturnSwitch === '0'">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun()"  v-model="productForm.productDrawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="isReturnSwitch === '1'">
                  <el-form-item label="交货日期">
                    <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductFun()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductFun()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="productList" hasC
                @selection-change="handleSelectionChangeAllPruduct">
                <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom"
                  v-if="isReturnSwitch === '1'"></el-table-column>
                <el-table-column prop="projectName" label="所属项目" width="120"
                  v-if="isProjectSwitch === '1'"></el-table-column>
                <template v-if="isProductNameSwitch === '1'">
                  <el-table-column v-if="isReturnSwitch === '1'" prop="productName" label="产品名称" width="160"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column v-else prop="name" label="产品名称" width="160" show-overflow-tooltip></el-table-column>
                </template>
                <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="mainUnit" label="单位" width="160" v-if="isReturnSwitch === '1'" />
                <el-table-column prop="purchaseQuantity" label="数量" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="oil" label="油脂" width="160" sortable="custom" v-if="isReturnSwitch === '1'" />
                <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="clearance" label="游隙" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="processName" label="工序" width="160" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="remark" label="备注" width="160" v-if="isReturnSwitch === '1'" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"
                  v-if="isReturnSwitch === '1'" />
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip
                  v-if="isReturnSwitch === '0'"></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" v-if="isReturnSwitch === '0'" />
                <el-table-column prop="productCategoryName" label="所属分类" v-if="isReturnSwitch === '0'" />
                <el-table-column prop="mainUnit" label="单位" v-if="isReturnSwitch === '0'" />
                <el-table-column prop="inventoryQuantity" label="库存数量" v-if="isReturnSwitch === '0'">
                </el-table-column>
              </JNPF-table>
              <pagination v-if="isReturnSwitch === '1'" :total="productTotal" :page.sync="orderForm.pageNum"
                :limit.sync="orderForm.pageSize" @pagination="searchProductFun" />
              <pagination v-if="isReturnSwitch === '0'" :total="productTotal" :page.sync="productForm.pageNum"
                :limit.sync="productForm.pageSize" @pagination="searchProductFun" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="productVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


        <span slot="footer" class="dialog-footer">
          <el-button @click="goLine">返回通知单列表</el-button>
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()"> {{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()"> {{ btnText }}</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import {
  getcategoryTrees,
  getAttributeline,
  getcooperativeProduct,
  getOrderDetail,
  getsaleOrderDetailList
} from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData, getBimBusinessDetail, getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { detailpurchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index'
import {
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  getpurPurchaseReceiptReturnGoodsdetail
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getWarehouseList, getOrderFiledMap } from '@/api/basicData/index'
import { mapGetters } from "vuex"
import { getBusinessFlowInfo } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import { getclassAttributeList, getbimProductAttributes, getbimProductAttributesListMap, getProducts } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { Process },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tipsvisible: false,
      isattachmentswitch: '',
      categoryId: '',
      submitmethodsTitle: '',
      btnText: '继续新增',
      productList: [],
      deliveryDateArr: [],
      activeNames: ['productInfo', 'basicInfo'],
      productTotal: 0,
      codeConfig: {},
      datafilelist: [],
      classAttributeList: [],
      provinces: [],
      orderForm: {
        returnQueryFlag: 1,
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        endTime: '',
        orderNo: '',
        orderType: 'procure',
        classAttribute: 'finish_product',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: '',

        receivingStatus: 'received'
      },
      productForm: {
        classAttribute: 'finish_product',
        productSource: 'purchase',
        productDrawingNo: "",
        productStatus: 'enable',

        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      // orderList: [
      //   { label: "外协通知", value: "external" },
      //   { label: "采购通知", value: "sale" },
      // ],
      inspectionStatusList: [
        { label: '待检验', value: 'unInspect' },
        { label: '已检验', value: 'inspected' },
        { label: '检验中', value: 'inspecting' }
      ],
      deliveryStatusList: [
        { label: '未完成', value: 'not_returned' },
        { label: '已完成', value: 'returned' },
        { label: '已取消', value: 'canceled' }
      ],
      stockFlagList: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      documentStatusList: [{ label: '退货', value: false }, { label: '换货', value: true }],
      approvalStatusList: [
        { label: '审批中', value: 'ing' },
        { label: '审批通过', value: 'ok' },
        { label: '审批拒绝', value: 'rebut' }
      ],
      orderListtf: [{ label: '退货', value: 'back' }, { label: '发货', value: 'delivery' }],
      orderListdd: [
        { label: '外贸', value: 'foreign_trade' },
        { label: '内销', value: 'domestic_market' },
        { label: '总成', value: 'assembly' }
      ],
      orderListfhfs: [
        { label: '送货', value: 'deliver_goods' },
        { label: '自提', value: 'self_pickup' },
        { label: '快递', value: 'express_delivery' },
        { label: '货运', value: 'freight_transport' },
        { label: '到付', value: 'collect_payment' }
      ],
      orderList: [
        { label: '正常任务', value: 'normal' },
        { label: '预测订单', value: 'prediction' },
        { label: '样品订单', value: 'sample' },
        { label: '备货订单', value: 'stock_up' },
        { label: '急件订单', value: 'urgent' }
      ],
      productRules: {
        receivedQuantity: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：退货数量${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          { validator: this.calcValidate(), trigger: 'blur' },
          { validator: this.calcValidatenum(), trigger: 'blur' }
        ]
      },
      ordersLineId: '',
      code: '',
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,

      productVisible: false,
      cusPrototal: 0, //选择客户产品分页器的总条数
      cusProductData: [],
      // 选择全部产品参数
      allProVisible: false,
      ProductMethodArr: [
        {
          label: '物料分类',
          classAttribute: 'material',
          method: getcategoryTree,
          requestObj: { classAttribute: 'material' }
        }
      ],
      allproductData: [],
      allProductTotal: 0,
      orderDateArr: [],
      ProductTreeData: [],
      ProductListRequestObj: {
        // neOrderState: 'finish',
        orderNo: '',
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        orderType: '',
        salesName: '',
        workOrderNo: '',
        sourceOrderNo: '',
        orderStartDate: '',
        orderEndDate: '',
        contractNo: '',
        deliveryStartDate: '',
        deliveryEndDate: '',
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: '',
        orderState: '',
        productionStatus: '',
        documentStatus: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      attributeLines: [],
      dataFormTwo: {
        productData: []
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      paymentMethodList: [],
      paymentCycleList: [],
      activeNameDetail: 'productInfo',
      coverNum: '', //用于计算
      invoicingStatusList: [
        { label: '未开票', value: 'not_invoiced' },
        { label: '部分开票', value: 'partial_invoicing' },
        { label: '已开票', value: 'invoiced' }
      ],
      btnType: undefined,
      areaList: [],
      provinces: [],
      cities: [],
      areas: [],
      contactsList: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      activeName: 'orderInfo',
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        // orderCategory: "assembly",
        salesman: '',
        receiptReturnType: 'back',
        classAttribute: 'finish_product',
        notificationType: 'procure',
        stockFlag: 1,
        // notifyType: 'sale',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false
      },
      defaultAddress: '',
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dataRule: {
        partnerName: [{ required: true, message: '所属客户不能为空', trigger: 'change' }],
        exchangeGoodsFlag: [{ required: true, message: '换货标识不能为空', trigger: 'change' }],
        orderNo: [{ required: true, message: '订单编号不能为空', trigger: 'change' }],
        deliverDate: [{ required: true, message: '退货日期不能为空', trigger: 'change' }],
        logisticsCompany: [{ required: true, message: '物流公司不能为空', trigger: 'change' }],
        logisticsNumber: [{ required: true, message: '物流单号不能为空', trigger: 'change' }]
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      warehouseIdList: [],
      flowTemplateJson: {},
      flowData: {},
      customStyleData: 0,
      formLoading: true
    }
  },
  computed: {
    // 总发货数量
    totalDeliveryQuantity: function () {
      var totalNum = 0
      for (var i = 0; i < this.dataFormTwo.productData.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.productData[i].receivedQuantity])
      }
      return totalNum
    },
    ...mapGetters(['userInfo'])
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    'dataFormTwo.productData': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if ((item.price && item.taxRate) || (item.price && item.taxRate === 0)) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          } else {
            item.excludingTaxPrice = ''
          }
          if (item.receivedQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.receivedQuantity * item.excludingTaxPrice)
          } else {
            item.excludingTaxAmount = ''
          }
          if (item.price && item.receivedQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.receivedQuantity - item.excludingTaxAmount)
          } else {
            item.taxAmount = ''
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          } else {
            item.totalAmount = ''
          }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  async created() {
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getDeputyUnit()
    await this.getReturnswitch()
    this.getBimBusinessDetail()
    // this.handleChange()
    this.getProductClassFun()
    this.getAttributeline()
    this.getClassAttribute()
    this.getWarehouseList()
    await this.switchStyleheight()
    this.formLoading = false
  },
  mounted() {
    this.init()
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    switchStyleheight() {
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 430
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `procureDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    getOrderFiledMap() {
      getOrderFiledMap('purchase').then((res) => {
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
      })
    },
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesObj = res.data
        console.log(this.bimProductAttributesObj, 'this.bimProductAttributesObj')
      })
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    getReturnswitch() {
      let obj = {
        businessCode: 'return',
        pageSize: -1
      }
      getBimBusinessSwitchConfigList(obj).then((res) => {
        console.log(res, 's')
        res.data.return.forEach((item) => {
          if (item.configKey == 'purchase_order') {
            this.isReturnSwitch = item.configValue1
          }
        })
      })
    },
    goLine() {
      this.$router.push({
        path: '/purchasingManagement/finishedProductReturnManagement/purchaseReturnNote'
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_cpcgthtzd'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    getWarehouseList() {
      let obj = {
        type: 'virtually',
        category: "warehouse",
      }
      getWarehouseList(obj).then(res => {
        this.warehouseIdList = res.data
      })
    },
    //发货数量不能为0
    calcValidatenum() {
      return (rule, value, callback) => {
        let msg = `退货数量不能为'0'`
        if (value == 0) {
          callback(new Error(msg)), this.$message.error(msg)
        }
      }
    },
    //数量验证
    // list 中 a 不能 operator b 的校验规则
    calcValidate() {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = `退货数量超过最大可退货数量`
        if (!value || value == 0) {
          callback()
        } else {
          let flag = false
          let list = this.dataFormTwo.productData

          let num_1 = Number(list[index].receivedQuantity)
          let num_2 = Number(list[index].receiptQuantity)
          if (!(num_1 <= num_2)) {
            flag = true
          }


          if (flag) {
            this.$message.error(`第${index + 1}行${msg}`)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },

    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      const time = y + '-' + m + '-' + d
      return time
    },

    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i]
        const index = this.dataFormTwo.productData.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.selectRows = [] // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      if (this.btnType == 'qrsh') {
        if (this.dataFormTwo.productData.length > 1) {
          this.dataFormTwo.productData.splice(data.$index, 1)
        } else {
          this.$message({
            message: '已是最后一条数据',
            type: 'error',
            duration: 1500
          })
        }
      } else {
        this.dataFormTwo.productData.splice(data.$index, 1)
      }
    },

    // 搜索客户产品
    searchcusProduct() {
      this.productForm.pageNum = 1
      this.getcooperativeProduct()
    },
    // 获取客户产品数据
    getcooperativeProduct() {
      this.productForm.partnerId = this.dataForm.cooperativePartnerId
      getcooperativeProduct(this.productForm).then((res) => {
        this.cusProductData = res.data.records
      })
    },

    // 选择产品——搜索
    searchProductFun() {
      console.log(this.isReturnSwitch, 'this.isReturnSwitch')
      if (this.isReturnSwitch === '1') {
        console.log(1)
        if (this.deliveryDateArr.length) {
          this.orderForm.deliveryStarDate = this.deliveryDateArr[0]
          this.orderForm.deliveryEndDate = this.deliveryDateArr[1]
        } else {
          this.orderForm.deliveryStartDate = ''
          this.orderForm.deliveryEndDate = ''
        }
        this.orderForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
        detailpurchaseOrderList(this.orderForm)
          .then((res) => {
            this.productList = res.data.records
            this.productTotal = res.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      } else {
        console.log(3)
        getProducts(this.productForm).then((res) => {
          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        })
          .catch(() => {
            this.listLoading = false
          })
      }

    },
    // 选择产品——重置
    resetProductFun() {
      this.deliveryDateArr = []
      this.orderForm = {
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        customerProductDrawingNo: '',
        returnQueryFlag: 1,
        drawingNo: '', // customerProductNo: "",
        deliveryStartTime: '',
        deliveryEndTime: '',

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 't1.create_time'
          }
        ]
      }
      this.productForm = {
        classAttribute: 'finish_product',
        productSource: 'purchase',
        productDrawingNo: "",
        productStatus: 'enable',

        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      this.searchProductFun()
    },
    // 点击选择产品
    openSeleceProductDialog() {
      console.log(this.isReturnSwitch, ';')
      if (this.isReturnSwitch === '1') {
        if (!this.dataForm.cooperativePartnerId) return this.$message.error('请先选择供应商')
      } else {

      }

      this.productVisible = true
      this.searchProductFun()
    },
    submitAllProduct() {
      if (!this.selectArr.length) return this.$message.error('请选择产品！')
      this.productVisible = false
      if (this.isReturnSwitch === '1') {
        this.selectArr.forEach((item) => {
          item.ordersNum = item.num
          item.receiptQuantity = item.purchaseQuantity
          item.productName = item.productName
          this.dataFormTwo.productData.push(item)
        })
      } else {
        this.selectArr.forEach((item) => {
          item.receiptQuantity = item.inventoryQuantity
          item.productsId = item.id
          item.productName = item.name
          this.dataFormTwo.productData.push(item)
        })
      }

      let uniqueArr = []
      let idSet = new Set()

      this.dataFormTwo.productData.forEach((item) => {
        if (!idSet.has(item.id)) {
          uniqueArr.push(item)
          idSet.add(item.id)
        }
      })
      this.dataFormTwo.productData = uniqueArr

    },
    // },
    // 获取所有订单列表数据
    initData2() {
      this.ProductListRequestObj.cooperativePartnerCode = this.code ? this.code : this.dataForm.partnerCode
      this.listLoading = true
      getsaleOrderList(this.ProductListRequestObj).then((listRes) => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },

    // 监听主数量输入
    watchnums(row, index) {
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.orderDateArr = []
        ; (this.ProductListRequestObj = {
          // neOrderState: 'finish',
          orderNo: '',
          cooperativePartnerName: '',
          orderType: '',
          salesName: '',
          workOrderNo: '',
          sourceOrderNo: '',
          orderStartDate: '',
          orderEndDate: '',
          contractNo: '',
          deliveryStartDate: '',
          deliveryEndDate: '',
          distributeStatus: 'distributed',
          // orderCategory: "assembly",
          shipmentStatus: '',
          orderState: '',
          productionStatus: '',
          documentStatus: '',
          approvalStatus: '',
          startTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 20,
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'create_time'
            }
          ]
        })

    },
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },
    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then((res) => {
        this.attributeLines = res.data
      })
    },
    // 获取类别属性字段 编排属性
    getClassAttribute() {
      let obj = {

        pageNum: 1,
        pageSize: -1
      }
      getclassAttributeList(obj).then((res) => {
        this.classAttributeList = res.data.records.map(item => {
          return {
            label: item.name,
            value: item.code
          }

        })
      })
    },

    // 选完所属采购，带出所属部门
    hangleSelectSales(e, r) {
      this.dataForm.departmentId = r.parentId
      this.dataForm.departmentName = r.organize
    },
    handleClose() {
      this.form = {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      }
      this.initData()
    },
    // 选择客户
    seleceCustomer(e) {
      getCooperativeInfo(e.id).then((res) => {
        if (this.dataForm.cooperativePartnerId && res.msg == 'Success') {
          this.$confirm('已选择过客户，是否切换，切换后将清空订单和产品信息，是否继续！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '切换成功'
              })
              // this.dataForm = {
              //   exchangeGoodsFlag: false,
              //   // orderCategory: "assembly",
              //   receiptReturnType: 'back',
              //   notificationType: 'procure',
              //   // notifyType: 'sale',
              //   logisticsCompany: '',
              //   ordersId: '',
              //   deliverDate: '',
              //   logisticsNumber: '',
              //   cooperativePartnerId: '',
              //   remark: '',
              //   orderNo: this.codeConfig.number
              // }
              this.dataFormTwo.productData = []
              this.customerData = e
              this.dataForm.cooperativePartnerId = e.id
              this.ProductListRequestObj.cooperativePartnerCode = e.code
              this.code = e.code
              this.dataForm.partnerName = e.name
              this.dataForm.code = e.code
              this.customerVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
              this.customerVisible = true
            })
        } else {
          // this.$nextTick(() => { this.$refs['dataForm'].validateField('cooperativePartnerId') })
          // this.dataForm = {
          //   exchangeGoodsFlag: false,
          //   // orderCategory: "assembly",
          //   receiptReturnType: 'back',
          //   notificationType: 'procure',
          //   // notifyType: 'sale',
          //   logisticsCompany: '',
          //   ordersId: '',
          //   orderNo: this.codeConfig.number,
          //   deliverDate: '',
          //   logisticsNumber: '',
          //   cooperativePartnerId: '',
          //   remark: ''
          // }
          this.dataFormTwo.productData = []
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          this.ProductListRequestObj.cooperativePartnerCode = e.code
          this.code = e.code
          this.dataForm.partnerName = e.name
          this.dataForm.code = e.code
          this.customerVisible = false
        }
      })
    },

    search() {
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form = {
        code: '',
        taxId: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      }
      this.getcategoryTree()
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form)
        .then((res) => {
          this.tableDataCustomer = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
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
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
    // 获取客户数据
    getcategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        keyword: '',
        type: 'supplier'
      }
      getcategoryTrees(listQuery)
        .then((res) => {
          this.treeData = res.data
          this.$nextTick(() => {
            this.initData()
            this.treeLoading = false
          })
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    // 打开选择客户弹框
    openDialog() {
      this.customerVisible = true
      this.getcategoryTree()
    },
    // 切换table
    handleClick(tab, event) { },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
        console.log('dataForm', this.dataForm)
      } catch (error) { }
    },
    init() {
      this.fetchData('CGTH')
      this.getBusInfo()
      this.dataForm.salesman = this.userInfo.userName
      this.dataForm.classAttribute = 'finish_product'
    },
    goBack() {
      this.$emit('close', true)
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.dataFormTwo.productData = []
      this.dataForm = {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        // orderCategory: "assembly",
        salesman: '',
        receiptReturnType: 'back',
        classAttribute: 'finish_product',
        notificationType: 'procure',
        // notifyType: 'sale',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false
      }
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
      this.tipsvisible = false
      this.btnLoading = false
    },
    handleConfirm(value) {
      let submitFlag = true
      this.$refs['productForm'].validate((valid) => {
        if (!valid) {
          submitFlag = false
        }
      })
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (!valid) {
          submitFlag = false
        }
      })
      console.log(submitFlag, 'sun')
      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_cpcgthtzd',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        let obj = {
          attachmentList: this.datafilelist,
          returnGoods: this.dataForm,
          lines: [],
          flowData: this.flowData
        }
        if (!this.dataFormTwo.productData.length) {
          this.$message({
            message: '请选择产品',
            type: 'error',
            duration: 1500
          })
          return
        }

        this.dataFormTwo.productData.forEach((item, index) => {
          item.notificationType = 'procure'
          item.ordersLineId = item.ordersLineId ? item.ordersLineId : item.id
          item.returnDeliveryNoticeId = this.dataForm.id ? this.dataForm.id : ''

          if (this.btnType == 'add' || this.btnType == 'copy') {
            obj.lines = this.dataFormTwo.productData
          } else {
            obj.lines = this.dataFormTwo.productData
          }
        })
        this.btnLoading = true
        let formMethod = null

        // obj.returnGoods.deliveryStatus = 'not_returned'
        console.log(obj, 'ob')
        addpurPurchaseReceiptReturnGoods(obj)
          .then((res) => {
            let msg = ''
            if (value == 'draft') {
              this.submitmethodsTitle = "保存成功"
            } else if (value == 'submit') {
              this.submitmethodsTitle = "提交成功"
            }
            this.tipsvisible = true
            // this.$message({
            //   message: msg,
            //   type: 'success',
            //   duration: 1500,
            //   onClose: () => {
            //     // this.visible = false
            //     this.btnLoading = false
            //     this.dataFormTwo.productData = []
            //     this.dataForm = {
            //       exchangeGoodsFlag: false,
            //       inspectionStatus: '',
            //       receiptReturnType: 'back',
            //       notificationType: 'procure',
            //       notifyType: 'sale',
            //       logisticsCompany: '',
            //       ordersId: '',
            //       deliverDate: '',
            //       partnerName: '',
            //       orderNo: '',
            //       logisticsNumber: '',

            //       cooperativePartnerId: '',
            //       remark: ''
            //     }
            //     this.$refs.dataForm.resetFields()
            //     this.init()
            //   }
            // })
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b030').then(res => {
        if (res.data) {
          if (res.data.enabledMark) {
            this.flowData = res.data
            this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
            this.dataForm.approvalFlag = res.data.enabledMark
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
            this.$message.error('未找到审批流程！')
          }
        } else {
          this.flowTemplateJson = {}
          this.dataForm.approvalFlag = false
        }
      }).catch(() => { })
    },
  },
  beforeUpdate() {
    this.$nextTick(() => {
      //在数据加载完，重新渲染表格
      this.$refs['product'].doLayout();
    });
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.required {
  color: red;
  // margin-right: 4px;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>
<style lang="scss" scoped>
$footerPadding: '10px';

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .even-row,
::v-deep .odd-row {
  cursor: pointer;
}

.killPadding {
  padding: 0;
}

.killPaddingLeft {
  padding-left: 0 !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding: 2px 10px 2px 0;
}

::v-deep .JNPF-common-search-box.noSearchList {
  padding: 3px 0;
}

::v-deep .has-gutter .el-table__cell.gutter {
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important;
}

.options {
  display: inline-block;
  float: right;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
