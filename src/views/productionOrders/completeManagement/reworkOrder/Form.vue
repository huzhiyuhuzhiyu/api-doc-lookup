<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add'
          ? '新建返工订单'
          : btnType == 'edit'
            ? '编辑返工订单'
            : btnType == 'look'
              ? '查看返工订单'
              : ''
          " />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t("common.cancelButton") }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单信息" name="orderInfo">
            <div style="
                line-height: 33px;
                font-size: 18px;
                border-bottom: 1px solid #dcdfe6;
                background: #fafafa;
                padding-left: 5px;
              ">
              <h5>订单信息</h5>
            </div>
            <el-form ref="dataForms" :model="reworkForm" :rules="dataRule" label-width="200px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="返工产品" prop="productsId">
                    <el-input readonly placeholder="请选择返工产品" :disabled="btnType == 'look' ? true : false"
                      v-model="reworkForm.productName" @focus="openProductDialog"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="工作令号" prop="workOrderNo">
                    <el-input placeholder="请输入工作令号" :disabled="btnType == 'look' ? true : false"
                      v-model="reworkForm.workOrderNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="工艺路线" prop="routingName">
                    <el-input placeholder="请输入工艺路线" disabled v-model="reworkForm.routingName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="是否有生产BOM" prop="bomId">
                    <el-input placeholder="请输入生产BOM" disabled v-model="reworkForm.bomFlag"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="交货日期" prop="deliveryDate">
                    <el-date-picker v-model="reworkForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                      :disabled="btnType == 'look' ? true : false" style="width: 100%" placeholder="交货日期"
                      :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="8" :xs="24">
                  <el-form-item label="计划开始日期" prop="planStartDate">
                    <el-date-picker v-model="reworkForm.planStartDate" type="date" value-format="yyyy-MM-dd"
                      @change="handleStDate" :disabled="btnType == 'look' ? true : false" style="width: 100%"
                      placeholder="计划开始日期" :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="计划结束日期" prop="planEndDate">
                    <el-date-picker v-model="reworkForm.planEndDate" type="date" value-format="yyyy-MM-dd"
                      @change="handleEnDate" :disabled="btnType == 'look' ? true : false" style="width: 100%"
                      placeholder="计划结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->

                <el-col :sm="8" :xs="24">
                  <el-form-item label="返工生产数量" prop="productionQuantity">
                    <el-input v-model="reworkForm.productionQuantity" placeholder="请输入返工生产数量" @input="handleInput"
                      :disabled="btnType == 'look' ? true : false" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="返工类型" prop="reworkType">
                    <el-select v-model="reworkForm.reworkType" placeholder="请选择返工类型" style="width: 100%"
                      @change="selectReworkTypeFun" :disabled="btnType == 'look' ? true : false">
                      <el-option v-for="(item, index) in reworkTypeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="reworkForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="
                line-height: 33px;
                font-size: 18px;
                border-bottom: 1px solid #dcdfe6;
                background: #fafafa;
                padding-left: 5px;
              ">
              <h5>工单信息</h5>
            </div>
            <div v-if="btnType != 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择工序</el-button>|
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                @click="batchDeleteProcess">批量删除</el-button>|
            </div>
            <el-table ref="products" :data="workOrderData" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" v-if="btnType != 'look'" :key="11">
              </el-table-column>
              <el-table-column type="index" width="60" label="序号" :key="13">
              </el-table-column>
              <el-table-column prop="processCode" label="工序编码" :key="14" min-width="100"></el-table-column>
              <el-table-column prop="processName" label="工序名称" :key="15" min-width="100" />
              <el-table-column prop="processingType" label="加工类型" :key="19" min-width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.processingType == 'self_produced' ? '自制' : "外协" }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="firstFlag" label="是否首道工序" :key="16" min-width="120">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.firstFlag" disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="chargeableReworkFlag" label="是否计费返工" :key="18" min-width="120">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.chargeableReworkFlag" :checked="scope.row.chargeableReworkFlag"
                    :disabled="btnType === 'look'" @change="hangleChargeble(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="firstInspection" label="是否首检" :key="29" min-width="100">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.firstInspection"
                    :disabled="btnType == 'look' ? true : false"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="stockFlag" label="是否入库" :key="10" min-width="100">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.stockFlag" :disabled="btnType === 'look' ||
                    scope.$index == workOrderData.length - 1 ||
                    scope.row.processingType != 'self_produced' || workOrderData[scope.$index + 1].processingType != 'self_produced'
                    " @change="changstockFlagFun(scope)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="reportFlag" label="是否报工" :key="111" min-width="100">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.reportFlag" :disabled="btnType == 'look' ||
                    scope.row.processingType !== 'self_produced' ||
                    scope.$index == workOrderData.length - 1 || workOrderData[scope.$index + 1].processingType != 'self_produced'
                    " @change="changreportFlagFun(scope)"></el-checkbox>
                </template>
              </el-table-column>

              <el-table-column prop="lastFlag" label="是否末道工序" :key="121" min-width="120">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.lastFlag" disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" fixed="right" v-if="btnType != 'look'">
                <template slot-scope="scope">
                  <el-button type="text" @click="delworkOrder(scope)" style="color: #ff3a3a">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="用料清单" name="annex">
            <div v-if="btnType != 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look' ? true : false" @click="openAllProductDialog()">选择产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look' ? true : false" @click="openProcssDialog()">选择工序产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-row :gutter="30" style="padding: 0 15px">
              <el-table ref="product" :data="productData" :fixedNO="false" @selection-change="handeleProductInfoData"
                :key="99" border>
                <el-table-column type="selection" width="55" fixed="left" v-if="btnType != 'look'" :key="1">
                </el-table-column>
                <el-table-column type="index" width="60" fixed="left" label="序号" :key="2">
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" :key="3" min-width="160" />
                <el-table-column prop="productName" label="产品名称" :key="4" min-width="160">
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="380" :key="5" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="160" :key="6" />
                <el-table-column prop="processName" label="工序名称" :key="7" min-width="160" />
                <el-table-column prop="materialsUsedQuantity" label="用料数量" min-width="160" :key="8">
                  <template slot="header">
                    <span class="required">*</span>用料数量
                  </template>
                  <template slot-scope="scope">
                    <el-input @input="handleInputFun(scope)" v-model="scope.row.materialsUsedQuantity"
                      :disabled="btnType == 'look' ? true : false">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120" :key="9" />
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" :key="101">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look'" label="流程卡" name="approval">
            <el-form ref="dataForm" :model="flowCard" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品编码" prop="productCode">
                    <el-input placeholder="请输入产品编码" disabled v-model="flowCard.productCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品名称" prop="productName">
                    <el-input placeholder="请输入产品名称" disabled v-model="flowCard.productName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品图号" prop="productDrawingNo">
                    <el-input placeholder="请输入产品图号" disabled v-model="flowCard.productDrawingNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="软管净长" prop="hoseLength">
                    <el-input placeholder="请输入软管净长" disabled v-model="flowCard.hoseLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="左芯子（图号）" prop="leftCore">
                    <el-input placeholder="请输入左芯子（图号）" disabled v-model="flowCard.leftCore"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="左芯子长" prop="leftCoreLength">
                    <el-input placeholder="请输入左芯子长" disabled v-model="flowCard.leftCoreLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="右芯子（图号）" prop="rightCore">
                    <el-input placeholder="请输入左芯子（图号）" disabled v-model="flowCard.rightCore"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="右芯子长" prop="rightCoreLength">
                    <el-input placeholder="请输入右芯子长" disabled v-model="flowCard.rightCoreLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="套筒（图号）" prop="sleeveModel">
                    <el-input placeholder="请输入套筒（图号）" disabled v-model="flowCard.sleeveModel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="护套（图号）" prop="sheathModel">
                    <el-input placeholder="请输入护套（图号）" disabled v-model="flowCard.sheathModel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="剥内胶长" prop="innerRubberLength">
                    <el-input placeholder="请输入剥内胶长" disabled v-model="flowCard.innerRubberLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="剥外胶长" prop="externalAdhesive">
                    <el-input placeholder="请输入剥外胶长" disabled v-model="flowCard.externalAdhesive"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="扣压伸长量" prop="compressionElongation">
                    <el-input placeholder="请输入扣压伸长量" disabled v-model="flowCard.compressionElongation"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="扣压量" prop="withhold">
                    <el-input placeholder="请输入扣压量" disabled v-model="flowCard.withhold"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="扣压时间" prop="withholdingTime">
                    <el-input placeholder="请输入扣压时间" disabled v-model="flowCard.withholdingTime"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="芯孔变型量" prop="coreHoleDeformation">
                    <el-input placeholder="请输入芯孔变型量" disabled v-model="flowCard.coreHoleDeformation"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 所有产品弹框 -->
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>
        <div class="JNPF-common-layout" style="height: 68vh; overflow: auto">
          <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
              <h2>产品分类</h2>
              <span class="options">
                <el-dropdown>
                  <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click="getcategoryTree()">刷新数据</el-dropdown-item>
                    <el-dropdown-item @click="toggleExpand(true)">展开全部</el-dropdown-item>
                    <el-dropdown-item @click="toggleExpand(false)">折叠全部</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>

            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
              <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands"
                highlight-current :expand-on-click-node="false" @node-click="handleNodeAllProduct" node-key="id"
                class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
                <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i :class="[
                    data.childrenList.length > 0
                      ? 'icon-ym icon-ym-tree-organization3'
                      : 'icon-ym icon-ym-systemForm',
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
                    <el-input v-model="ProductListRequestObj.code" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.name" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.drawingNo" placeholder="请输入图号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{ $t("common.reset")
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-if="productType == 'workerInfo'">
              <JNPF-table v-loading="listLoading" :data="allproductData" :key="144" :checkSelectable="disproduceData">
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="产品名称" :key="2" />
                <el-table-column prop="drawingNo" label="图号" :key="3" />
                <el-table-column prop="spec" label="规格型号" :key="4" />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click.stop="radioProduct(scope.row)">
                      选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                :limit.sync="ProductListRequestObj.pageSize" @pagination="getAllProductList" />
            </div>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-else>
              <JNPF-table v-loading="listLoading" :data="allproductData" @row-dblclick="handleDBRowProductClick"
                @row-click="handleRowProductClick" :checkSelectable="disproduceData" ref="procForm" hasC
                @selection-change="handleSelectionChangeAllPruduct" :key="145">
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip :key="7"></el-table-column>
                <el-table-column prop="name" label="产品名称" :key="8" />
                <el-table-column prop="drawingNo" label="图号" :key="9" />
                <el-table-column prop="spec" label="规格型号" :key="6" />
              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                :limit.sync="ProductListRequestObj.pageSize" @pagination="getAllProductList" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" v-if="productType != 'workerInfo' ? true : false">
          <el-button @click="allProVisible = false">{{
            $t("common.cancelButton")
          }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <!-- 根据工艺路线 获取产品 -->
      <el-dialog title="选择工序产品" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="routProVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body>
        <div class="JNPF-common-layout" style="height: 68vh; overflow: auto; margin-top: 15px">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="routproductData" hasC
                @selection-change="handleSelectionChangeAllPruduct" ref="procForm" @row-dblclick="handleDBRowProductClick"
                @row-click="handleRowProductClick" :checkSelectable="disproduceData">
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="产品名称" />
                <el-table-column prop="drawingNo" label="产品图号" />
                <el-table-column prop="spec" label="规格型号" />
                <el-table-column prop="routingCode" label="工艺编码" />
                <el-table-column prop="routingName" label="工艺名称" />
                <el-table-column prop="processName" label="工序名称" />
              </JNPF-table>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="routProVisible = false">{{
            $t("common.cancelButton")
          }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitRoutProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="选择工序" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="processDialog"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="50%" append-to-body @close="closePro">
        <div class="JNPF-common-layout" style="height: 40vh; overflow: auto; margin-top: 10px">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" ref="workOrder" :data="processList" :fixedNO="true"
                @selection-change="selectProcess" @row-dblclick="handleDBRowClick" @row-click="handleRowClick" hasC>
                <el-table-column prop="code" label="工序编码">
                </el-table-column>
                <el-table-column prop="name" label="工序名称"></el-table-column>
                <el-table-column prop="productCategoryIdText" label="工序分类"></el-table-column>
                <el-table-column prop="processingTypeName" label="加工类型"></el-table-column>
                <el-table-column prop="pricingTypeName" label="计价类型"></el-table-column>
              </JNPF-table>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="processDialog = false">{{
            $t("common.cancelButton")
          }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitProcess()">
            确定</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { getProductList } from "@/api/basicData/materialFiles"; // 产品列表
import { getcategoryTree } from "@/api/basicData/materialSettings"; // 产品分类 编排属性值
import {
  getprodOrderList,
  prodOrderInfo,
  addProdOrder,
  updateprodOrderFinished,
} from "@/api/productOrdes/finishedProductOrders";
import { detailProcess } from "@/api/basicData/processSettingss";
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 86400000; // 86400000为一天的毫秒数
        }
      },
      reworkTypeList: [
        { label: "返工成品", value: "product" },
        { label: "返工成品工序", value: "process" },
      ],
      processDialog: false,
      processList: [],
      selectProcessArr: [],
      routProVisible: false,
      defaultProps: {
        children: "childrenList",
        label: "name",
      },
      ProductTreeData: [],
      treeLoading: false,
      allproductData: [],
      allProductTotal: 0,
      ProductMethodArr: [
        {
          label: "物料分类",
          classAttribute: "material",
          method: getcategoryTree,
          requestObj: { classAttribute: "material" },
        },
      ],
      allProVisible: false,
      // 订单类型
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "返工", value: "rework" },
      ],
      // 订单状态
      orderStatusList: [
        { label: "正常", value: "normal" },
        { label: "暂停", value: "suspend" },
        { label: "关闭", value: "closed" },
        { label: "已完成", value: "finish" },
      ],
      // 生产状态
      productionStatusList: [
        { label: "未生产", value: "not_started" },
        { label: "生产中", value: "start_production" },
        { label: "生产完成", value: "production_completed" },
      ],
      // 接收状态
      receiveStatusList: [
        { label: "未接收", value: "not_received" },
        { label: "已接收", value: "received" },
        { label: "已拒绝", value: "refused" },
      ],
      workOrderData: [],
      reworkForm: {
        reworkType: "product",

        bomId: "",
        bomName: "",
        orderNo: "",
        productionOrderId: "",
        workOrderNo: "",
        productsId: "",
        routingName: "",
        routingId: "",
        planStartDate: "",
        planEndDate: "",
        productionQuantity: "",
        remark: "",
        demandType: "",
        orderStatus: "normal",
        orderType: "rework",
        deputyUnit: "",
        insertOrderFlag: false,
        productionStatus: "not_started",
        receiveStatus: "received",
        documentStatus: "",
      },
      ProductListRequestObj: {
        classAttributeList: [
          "raw_material",
          "semi_finished",
          "finish_product",
          "accessories",
        ],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        productStatus: "enable",
        code: "",
        name: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      },
      // 选择生产订单的查询条件
      orderForm: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        orderNo: "",
        workOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        orderType: "",
        planSsd: "",
        planSed: "",
        planEsd: "",
        planEed: "",
        receiveStatus: "received",
        productionStatus: "",
        orderStatus: "normal",
        insertOrderFlag: "",
        demandType: "",
      },
      listLoading: false,
      total: 0,
      orderDetailData: [],
      btnType: false,
      activeName: "orderInfo",
      nodeId: -1,
      btnLoading: false,
      formLoading: false,
      parentId: "",
      dataRule: {
        productsId: [
          { required: true, message: "返工产品不能为空", trigger: "change" },
        ],
        reworkType: [
          { required: true, message: "请选择返工类型", trigger: "change" },
        ],
        workOrderNo: [
          { required: true, message: "请输入工作令号", trigger: "blur" },
        ],

        deliveryDate: [
          { required: true, message: "请选择交货日期", trigger: "change" },
        ],
        // planEndDate: [
        //   { required: true, message: "请选择计划结束日期", trigger: "change" },
        // ],
        // planStartDate: [
        //   { required: true, message: "请选择计划结束日期", trigger: "change" },
        // ],
        productionQuantity: [
          { required: true, message: "请输入返工生产数量", trigger: "blur" },
          {
            validator: this.formValidate({
              type: "decimal",
              params: [
                10,
                2,
                false,
                (errMsg) => {
                  this.$message.error(`返工生产数量${errMsg}`);
                },
              ],
            }),
            trigger: "blur",
          },
          {
            validator: this.formValidate(
              "positiveNumber",
              "请输入大于0的正整数"
            ),
            trigger: "blur",
          },
        ],
      },
      id: "",
      collectionForm: {},
      flowCard: {},
      materialList: [],
      allproductData: [],
      productArr: [],
      selectRows: [],
      productData: [],
      refreshTree: true,
      expands: true,
      productSourceType: "",
      routproductData: [],
      productType: "",
      productInfo: {},
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {
    this.reworkTypeCopy = JSON.parse(JSON.stringify(this.reworkForm.reworkType))
  },
  mounted() { },
  methods: {
    selectReworkTypeFun(e) {
      console.log(e, this.reworkTypeCopy);
      if (this.reworkTypeCopy !== e && this.workOrderData.length) {
        this.$confirm("此操作将更新工单表格数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.workOrderData = [];
          this.reworkTypeCopy = e
        }).catch(() => {
          this.reworkForm.reworkType = this.reworkTypeCopy
        });
      }
    },

    changreportFlagFun(row) {
      console.log(row);
      let arr = JSON.parse(JSON.stringify(this.workOrderData))
      this.$set(arr[row.$index], "reportFlag", row.row.reportFlag)
      this.workOrderData = arr
      this.$forceUpdate()
    },
    changstockFlagFun(row) {
      console.log(row);
      let arr = JSON.parse(JSON.stringify(this.workOrderData))
      this.$set(arr[row.$index], "stockFlag", row.row.stockFlag)
      this.workOrderData = arr
      this.$forceUpdate()
    },
    disproduceData(row) {
      return row.selectFlag
    },
    handleInputFun(row) {
      this.productData[row.$index].materialsUsedQuantity = this.productData[
        row.$index
      ].materialsUsedQuantity.replace(/[^0-9.]/g, "");
    },
    handleRowClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return
      const isSelected =
        this.$refs.workOrder.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    handleDBRowClick(row) {
      // 判断当前行是否已经选中
      const isSelected =
        this.$refs.workOrder.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    handleRowProductClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return

      const isSelected =
        this.$refs.procForm.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    handleDBRowProductClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return
      const isSelected =
        this.$refs.procForm.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    hangleChargeble(row) {
      console.log(row);
    },
    handleInput() {
      if (this.workOrderData.length > 0) {
        this.workOrderData.forEach((item) => {
          item.workOrderQuantity = this.reworkForm.productionQuantity;
        });
      }
    },
    // handleStDate() {
    //   if (this.workOrderData.length > 0) {
    //     this.workOrderData.forEach((item) => {
    //       item.planStartDate = this.reworkForm.planStartDate;
    //     });
    //   }
    // },
    // handleEnDate() {
    //   if (this.workOrderData.length > 0) {
    //     this.workOrderData.forEach((item) => {
    //       item.planEndDate = this.reworkForm.planEndDate;
    //     });
    //   }
    // },

    // 点击确认 将数据赋值给工单表格
    submitProcess() {
      this.selectProcessArr.sort(function (a, b) {
        return a.index - b.index;
      });
      // if ( this.selectProcessArr[this.selectProcessArr.length - 1] .processingType !== "self_produced" ) {
      //   this.btnLoading = false;
      //   this.$message({
      //     message: "最后一道工序必须为自制",
      //     type: "error",
      //     duration: 1500,
      //   });
      //   return;
      // }
      if (this.workOrderData.length > 0) {
        this.$confirm("此操作将更新工单表格数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.workOrderData = [];
          this.processDialog = false;
          this.selectProcessArr.forEach((item, index) => {
            item.workOrderQuantity = this.reworkForm.productionQuantity;
            item.planEndDate = this.reworkForm.planEndDate;
            item.planStartDate = this.reworkForm.planStartDate;
            item.firstFlag = false;
            item.lastFlag = false;
            if (index == 0) {
              item.firstFlag = true;
              item.lastFlag = false;
            } else if (index == this.selectProcessArr.length - 1) {
              item.firstFlag = false;
              item.lastFlag = true;
              item.stockFlag = true;
              if (this.selectProcessArr[index].processingType !== "self_produced") {
                item.reportFlag = false;
              } else {
                item.reportFlag = true;
              }
            } else {
              item.firstFlag = false;
              item.lastFlag = false;
            }
            if (item.processingType !== "self_produced") {
              item.stockFlag = true
            }
            // item.firstInspection = false
            // item.chargeableReworkFlag = false
            // item.reportFlag = true
            // item.stockFlag = true

            item.processCode = item.code;
            item.processName = item.name;
            item.processId = item.id;
            item.orderType = "rework";
            console.log("234", item.processingType);
            if (item.processingType !== "self_produced" && this.selectProcessArr.length > 1) {
              console.log(333, this.selectProcessArr, index);
              if (item.firstFlag) {
                this.selectProcessArr[index].stockFlag = true;
              }
              this.selectProcessArr[index - 1].stockFlag = true;
              this.selectProcessArr[index - 1].reportFlag = true;

            }

          });
          if (this.selectProcessArr.length == 1) {
            this.selectProcessArr[0].firstFlag = true;
            this.selectProcessArr[0].lastFlag = true;
            this.selectProcessArr[0].stockFlag = true;
            console.log("345", this.selectProcessArr[0]);
            if (this.selectProcessArr[0].processingType !== "self_produced") {
              this.selectProcessArr[0].reportFlag = false;
            } else {
              this.selectProcessArr[0].reportFlag = true;

            }
          }
          setTimeout(() => {
            this.workOrderData = this.selectProcessArr;
          }, 500);
        });
      } else {
        this.processDialog = false;
        this.selectProcessArr.forEach((item, index) => {
          item.workOrderQuantity = this.reworkForm.productionQuantity;
          item.planEndDate = this.reworkForm.planEndDate;
          item.planStartDate = this.reworkForm.planStartDate;
          item.firstFlag = false;
          item.lastFlag = false;
          if (index == 0) {
            item.firstFlag = true;
            item.lastFlag = false;
          } else if (index == this.selectProcessArr.length - 1) {
            item.firstFlag = false;
            item.lastFlag = true;
            item.stockFlag = true;
            if (this.selectProcessArr[index].processingType !== "self_produced") {
              item.reportFlag = false;
            } else {
              item.reportFlag = true;
            }
          } else {
            item.firstFlag = false;
            item.lastFlag = false;
          }
          if (item.processingType !== "self_produced") {
            item.stockFlag = true
          }
          item.processCode = item.code;
          item.processName = item.name;
          item.processId = item.id;
          item.orderType = "rework";
          if (item.processingType !== "self_produced" && this.selectProcessArr.length > 1) {
            if (item.firstFlag) {
              this.selectProcessArr[index].stockFlag = true;
            }
            this.selectProcessArr[index - 1].stockFlag = true;
            this.selectProcessArr[index - 1].reportFlag = true;
          }
        });
        if (this.selectProcessArr.length == 1) {
          this.selectProcessArr[0].firstFlag = true;
          this.selectProcessArr[0].lastFlag = true;
          this.selectProcessArr[0].stockFlag = true;
          if (this.selectProcessArr[0].processingType !== "self_produced") {
            this.selectProcessArr[0].reportFlag = false;
          } else {
            this.selectProcessArr[0].reportFlag = true;

          }
        }

        console.log("selectProcessArr", this.selectProcessArr);
        setTimeout(() => {
          this.workOrderData = this.selectProcessArr;
        }, 500);
      }
    },
    // 多选  工序
    selectProcess(val) {
      this.selectProcessArr = val;
    },
    // 删除工序
    delworkOrder(data) {
      this.workOrderData.splice(data.$index, 1);

      if (this.workOrderData.length == 1) {
        if (this.workOrderData[0].processingType !== "self_produced") {
          this.workOrderData[this.workOrderData.length - 1].stockFlag = false;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = false;
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
        } else {
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
          this.workOrderData[this.workOrderData.length - 1].stockFlag = true;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = true;
        }
      } else {
        if (this.workOrderData[0].processingType !== "self_produced") {
          this.workOrderData[this.workOrderData.length - 1].stockFlag = false;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = false;
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
        } else {
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
          this.workOrderData[this.workOrderData.length - 1].stockFlag = true;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = true;
        }
        if (this.workOrderData[this.workOrderData.length - 1].processingType !== "self_produced") {
          this.workOrderData[this.workOrderData.length - 1].stockFlag = false;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = false;
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
        } else {
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
          this.workOrderData[this.workOrderData.length - 1].stockFlag = true;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = true;
        }
      }
      console.log("this.workOrderData", this.workOrderData);
    },
    // 关闭
    closePro() {
      this.processDialog = false;
    },
    // 打开选择工序弹框
    openSeleceProductDialog() {
      this.processList = [];
      this.selectProcessArr = [];
      if (!this.reworkForm.productsId) {
        this.$message({
          message: "请先选择返工产品",
          type: "error",
        });
        return;
      }
      if (this.reworkForm.routingId) {
        this.processDialog = true;
        detailProcess(this.reworkForm.routingId).then((res) => {

          console.log("工序", res);

          let data = res.data.bimRoutingLineVOList;
          if (data.length > 0) {
            data.forEach((item) => {
              this.processList.push(item.processVO);
            });
            if (this.processList.length > 0) {
              this.processList.forEach((item, index) => {
                item.index = index;
              });
              this.$nextTick(() => {
                if (this.reworkForm.reworkType !== "product") {
                  this.processList = this.processList.slice(0, this.processList.length - 1)
                }
              })
            }
            console.log(111, this.processList);

          }
        });
      } else {
        this.$message({
          message: "所选返工产品没有工艺",
          type: "error",
        });
      }
    },
    // 批量删除
    batchDeleteProcess() {
      // 遍历选中的行的数据
      if (this.selectArr.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        });
      }
      for (let i = 0; i < this.selectArr.length; i++) {
        const row = this.selectArr[i];
        const index = this.workOrderData.indexOf(row);
        if (index > -1) {
          this.workOrderData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.workOrderData[0].firstFlag = true;
      if (this.workOrderData.length == 1) {
        if (this.workOrderData[0].processingType !== "self_produced") {
          this.workOrderData[this.workOrderData.length - 1].stockFlag = false;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = false;
        } else {
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
          this.workOrderData[this.workOrderData.length - 1].stockFlag = true;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = true;
        }
      } else {
        if (this.workOrderData[0].processingType !== "self_produced") {
          this.workOrderData[this.workOrderData.length - 1].stockFlag = false;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = false;
        } else {
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
          this.workOrderData[this.workOrderData.length - 1].stockFlag = true;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = true;
        }
        if (this.workOrderData[this.workOrderData.length - 1].processingType !== "self_produced") {
          this.workOrderData[this.workOrderData.length - 1].stockFlag = false;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = false;
        } else {
          this.workOrderData[this.workOrderData.length - 1].lastFlag = true;
          this.workOrderData[this.workOrderData.length - 1].stockFlag = true;
          this.workOrderData[this.workOrderData.length - 1].reportFlag = true;
        }
      }


      this.selectArr = []; // 清空选中的行的数据
      console.log(41234, this.workOrderData);
    },

    openProductDialog() {
      this.productType = "workerInfo";
      this.allProVisible = true;
      this.ProductListRequestObj = {
        classAttributeList: [
          "raw_material",
          "semi_finished",
          "finish_product",
          "accessories",
        ],
        classAttribute: "",
        drawingNo: "",
        queryType: 1,
        productStatus: "enable",

        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      };
      this.allproductData = [];
      let successTotal = 0;
      let tempTreeData = [...this.ProductMethodArr];
      this.ProductMethodArr.forEach((item, index) => {
        item.method(item.requestObj).then((res) => {
          if (Array.isArray(res.data)) {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data,
            };
          } else {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data.records,
            };
          }
          if (++successTotal === this.ProductMethodArr.length) {
            this.ProductTreeData = tempTreeData;
            this.getAllProductList();
          }
        });
      });
    },
    radioProduct(row) {
      console.log("产品数据", row);
      if (!row.routingId) {
        return this.$message({
          message: "请配置产品工艺路线",
          type: "error",
          duration: 1500,
        });
      }
      if (this.reworkForm.productsId && row.id != this.reworkForm.productsId) {
        if (this.workOrderData.length > 0 || this.productData.length > 0) {
          let msg = "";
          if (this.productData.length > 0 && this.workOrderData.length > 0) {
            msg = "此操作将清空工单列表及用料清单数据, 是否继续?";
          } else if (this.workOrderData.length > 0) {
            msg = "此操作清空将工单列表数据, 是否继续?";
          } else if (this.productData.length > 0) {
            msg = "此操作将清空用料清单数据, 是否继续?";
          }
          this.$confirm(msg, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // prodOrderInfo(row.id).then(res => {
              // console.log("详情数据", res);
              this.productInfo = row;
              this.reworkForm.productsId = row.id;
              this.reworkForm.productName = row.name;
              this.reworkForm.productName = row.name;
              this.reworkForm.routingName = row.routingName;
              this.reworkForm.routingId = row.routingId;
              this.reworkForm.bomId = row.bomId;
              this.reworkForm.bomFlag = row.bomId ? "是" : "否";
              this.reworkForm.bomName = row.bomName;
              this.reworkForm.mainUnit = row.mainUnit;
              this.reworkForm.deputyUnit = row.deputyUnit;
              this.reworkForm.ratio = row.ratio;
              this.reworkForm.calculationDirection = row.calculationDirection;
              this.allProVisible = false;
              this.tableFlag = false;
              // })
              this.workOrderData = [];
              this.productData = [];
            })
            .catch((error) => {
              this.orderVisible = false;
            });
        } else {
          this.productInfo = row;
          this.reworkForm.productsId = row.id;
          this.reworkForm.productName = row.name;
          this.reworkForm.routingName = row.routingName;
          this.reworkForm.routingId = row.routingId;
          this.reworkForm.bomId = row.bomId;
          this.reworkForm.bomName = row.bomName;
          this.reworkForm.bomFlag = row.bomId ? "是" : "否";
          this.reworkForm.mainUnit = row.mainUnit;
          this.reworkForm.deputyUnit = row.deputyUnit;
          this.reworkForm.ratio = row.ratio;
          this.reworkForm.calculationDirection = row.calculationDirection;
          this.allProVisible = false;
        }
      } else {
        this.productInfo = row;
        this.reworkForm.productsId = row.id;
        this.reworkForm.productName = row.name;
        this.reworkForm.routingName = row.routingName;
        this.reworkForm.routingId = row.routingId;
        this.reworkForm.bomId = row.bomId;
        this.reworkForm.bomName = row.bomName;
        this.reworkForm.bomFlag = row.bomId ? "是" : "否";
        this.reworkForm.mainUnit = row.mainUnit;
        this.reworkForm.deputyUnit = row.deputyUnit;
        this.reworkForm.ratio = row.ratio;
        this.reworkForm.calculationDirection = row.calculationDirection;
        this.allProVisible = false;
      }

      this.reworkForm.deputyUnit = row.deputyUnit;
    },
    handleClick() { },
    // 将选中的产品数据赋值给表格
    submitAllProduct() {
      if (!this.productArr.length) return this.$message.error("请选择产品");
      this.allProVisible = false;
      this.productSourceType = "all";
      this.productArr.forEach((item) => {
        item.productName = item.name;
        item.productCode = item.code;
        item.productDrawingNo = item.drawingNo;
        item.routingName =
          this.productSourceType == "all" ? "" : this.reworkForm.routingName;
        item.routingId =
          this.productSourceType == "all" ? "" : this.reworkForm.routingId;
        item.materialProcessId =
          this.productSourceType == "all" ? "" : this.reworkForm.processId;
        item.materialProcessName =
          this.productSourceType == "all" ? "" : this.reworkForm.processName;
        item.productsId = item.id;
        if (this.btnType == "edit") {
          item.id = "";
        }
      });
      this.productData = [
        ...this.productData,
        ...JSON.parse(JSON.stringify(this.productArr)),
      ];
      console.log("this.productData", this.productData);
    },
    // 单个删除
    handleDel(data) {
      this.productData.splice(data.$index, 1);
    },
    // 用料清单列表选中
    handeleProductInfoData(val) {
      console.log(val);
      this.selectRows = val;
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        });
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.productData.indexOf(row);
        if (index > -1) {
          this.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    filterNodeAllProduct(value, data) {
      console.log(333, value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return;
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty(
        "parentId"
      )
        ? data.id
        : "";
      console.log(this.ProductListRequestObj.productCategoryId, data.id);
      const nodePath = this.getNodePathProduct(node);
      this.organizeIdTree = nodePath.map((o) => o.id);
      this.ProductListRequestObj.classAttribute = data.classAttribute;
      console.log(this.ProductListRequestObj.classAttribute);
      this.searchAllProduct();
    },
    getNodePathProduct(node) {
      let fullPath = [];
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data);
        if (node.parent) loop(node.parent);
      };
      loop(node);
      return fullPath;
    },
    toggleExpand(expands) {
      this.refreshTree = false;
      this.expands = expands;
      this.$nextTick(() => {
        this.refreshTree = true;
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId);
        });
      });
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1;
      this.getAllProductList();
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.ProductListRequestObj = {
        classAttributeList: [
          "raw_material",
          "semi_finished",
          "finish_product",
          "accessories",
        ],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        productStatus: "enable",

        code: "",
        name: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      };
      if (this.productType == "workerInfo") {
        this.ProductListRequestObj.queryType = 1;
        this.ProductListRequestObj.productStatus = "enable";
      }
      this.searchAllProduct();
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      console.log("val", val);
      this.productArr = val;
    },
    // 打开所有产品弹框
    openAllProductDialog() {
      if (!this.reworkForm.productsId) {
        this.$message({
          message: "请先选择返工产品",
          type: "error",
        });
        return;
      }
      this.productType = "inventory";
      this.$nextTick(() => {
        this.allProVisible = true;
      });
      this.ProductListRequestObj = {
        classAttributeList: [
          "raw_material",
          "semi_finished",
          "finish_product",
          "accessories",
        ],
        classAttribute: "",
        drawingNo: "",
        productStatus: "enable",

        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      };
      this.allproductData = [];
      let successTotal = 0;
      let tempTreeData = [...this.ProductMethodArr];
      this.ProductMethodArr.forEach((item, index) => {
        item.method(item.requestObj).then((res) => {
          if (Array.isArray(res.data)) {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data,
            };
          } else {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data.records,
            };
          }
          if (++successTotal === this.ProductMethodArr.length) {
            this.ProductTreeData = tempTreeData;
            this.getAllProductList();
          }
        });
      });
    },
    // 获取所有产品列表数据
    getAllProductList() {
      this.listLoading = true;
      getProductList(this.ProductListRequestObj).then((listRes) => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data;
        } else {
          this.allproductData = listRes.data.records;
        }
        console.log("listRes", listRes);
        if (this.allproductData.length) {
          this.allproductData.forEach(item => {
            item.selectFlag = true
          });
          if (this.productData.length > 0) {
            console.log("this.allproductData", this.allproductData);
            console.log("this.productData", this.productData);
            for (let i = 0; i < this.allproductData.length; i++) {
              for (let j = 0; j < this.productData.length; j++) {

                if (this.allproductData[i].id === this.productData[j].productsId && this.allproductData[i].processId === this.productData[j].processId) {
                  this.allproductData[i].selectFlag = false;
                  this.$forceUpdate()
                  console.log("this.allproductData2===>", this.allproductData);

                }
              }
            }
          }
        }
        this.allProductTotal = listRes.data.total;
        this.$forceUpdate();
        this.treeLoading = false;
        this.listLoading = false;
      });
    },
    // 获取工艺产品
    getRoutProduc() {
      let obj = {
        classAttributeList: [
          "raw_material",
          "semi_finished",
          "finish_product",
          "accessories",
        ],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        queryType: 5,
        productStatus: "enable",
        routingId: this.reworkForm.routingId,
        code: "",
        name: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: -1,
      };
      getProductList(obj).then((listRes) => {
        if (Array.isArray(listRes.data)) {
          this.routproductData = listRes.data;
        } else {
          this.routproductData = listRes.data.records;
        }
        if (this.routproductData.length) {
          this.routproductData.forEach(item => {
            item.selectFlag = true
          });
          if (this.productData.length > 0) {
            for (let i = 0; i < this.routproductData.length; i++) {
              for (let j = 0; j < this.productData.length; j++) {

                if (this.routproductData[i].id === this.productData[j].productsId && this.routproductData[i].processId === this.productData[j].processId) {
                  this.routproductData[i].selectFlag = false;
                }
              }
            }
          }
        }
        console.log("listRes", listRes);
        this.$forceUpdate();
        this.listLoading = false;
      });
    },
    // 根据工艺 选择产品
    submitRoutProduct() {
      this.productSourceType = "routProduct";
      this.routProVisible = false;
      this.productArr.forEach((item) => {
        item.productName = item.name;
        item.productCode = item.code;
        item.productDrawingNo = item.drawingNo;

        item.routingName = this.reworkForm.routingName;
        item.routingId = this.reworkForm.routingId;
        item.materialProcessId = this.reworkForm.processId;
        item.materialProcessName = this.reworkForm.processName;
        item.productsId = item.id;
        item.id = ""

      });
      // this.$refs.dataForms.resetFields(['productName'])
      this.productData = [
        ...this.productData,
        ...JSON.parse(JSON.stringify(this.productArr)),
      ];
      console.log("this.productData", this.productData);
    },
    // 打开工序产品弹框
    openProcssDialog() {
      this.selectArr = [];
      if (!this.reworkForm.productsId) {
        this.$message({
          message: "请先选择返工产品",
          type: "error",
        });
        setTimeout(() => {
          this.activeName = "orderInfo";
        }, 1500);
      } else if (!this.reworkForm.routingId) {
        this.$message({
          message: "当前所选返工产品没有工艺",
          type: "error",
        });
        setTimeout(() => {
          this.activeName = "orderInfo";
        }, 1500);
      } else {
        this.routProVisible = true;
        this.getRoutProduc();
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectArr = val;
    },
    search() {
      this.orderForm.pageNum = 1;
      this.getOrderData();
    },
    reset() {
      this.orderForm = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        orderNo: "",
        workOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        orderType: "",
        planSsd: "",
        planSed: "",
        planEsd: "",
        planEed: "",
        receiveStatus: "received",
        productionStatus: "",
        orderStatus: "normal",
        insertOrderFlag: "",
        demandType: "",
      };
      this.search();
    },
    
    init(id, btnType) {
      this.id = id || "";
      this.btnType = btnType;
      console.log("00000", id, btnType, this.id);
      if (this.id) {
        let obj = {
          id: id,
          dispatch: "0",
        };
        console.log(4);
        prodOrderInfo(obj).then((res) => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.workOrderData = res.data.workOrderList;
            this.productData = res.data.materialList;
            this.flowCard = res.data.flowCard
              ? res.data.flowCard
              : this.flowCard;
            if (res.data.prodOrder.bomId) {
              res.data.prodOrder.bomFlag = "是"
            } else {
              res.data.prodOrder.bomFlag = "否"

            }
            this.reworkForm = res.data.prodOrder;

            // this.dataForm = res.data.stop
            // res.data.lines.forEach(item => {
            //   item.drawingNo = item.productDrawingNo
            // })
            // this.orderDetailData = res.data.lines
            // 根据生产订单号查找原订单生产数量
            let obj = {
              pageNum: 1,
              pageSize: -1,
              orderItems: [
                {
                  asc: false,
                  column: "",
                },
                {
                  asc: false,
                  column: "create_time",
                },
              ],
              orderNo: this.reworkForm.orderNo,
              workOrderNo: "",
              productCode: "",
              productName: "",
              productDrawingNo: "",
              orderType: "",
              planSsd: "",
              planSed: "",
              planEsd: "",
              planEed: "",
              receiveStatus: "",
              productionStatus: "",
              orderStatus: "",
              insertOrderFlag: "",
              demandType: "",
            };
            getprodOrderList(obj).then((res) => {
              console.log("++++++++", res);
              this.orderQuantity = res.data.records[0].productionQuantity;
            });
          });
        });
      }
    },
    goBack() {
      this.$emit("close",true);
    },
    isNumberKey(evt) {
      var charCode = evt.which ? evt.which : event.keyCode;
      // 允许小数点和数字
      if (charCode == 46 || (charCode >= 48 && charCode <= 57)) {
        return true;
      }
      return false;
    },
    handleConfirm(value) {
      this.$refs["dataForms"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let submitFlag = null;
          this.reworkForm.documentStatus = value;
          this.reworkForm.businessCode = "complete";

          console.log(this.selectArr);
          if (this.workOrderData.length < 1) {
            this.activeName = "orderInfo";
            submitFlag = false;
            this.btnLoading = false;
            this.$message({
              message: "请选择工序",
              type: "error",
              duration: 1500,
            });
            return;
          }
          // if ( this.workOrderData[this.workOrderData.length - 1].processingType !== "self_produced") {
          //   submitFlag = false;
          //   this.btnLoading = false;
          //   this.$message({
          //     message: "最后一道工序必须为自制",
          //     type: "error",
          //     duration: 1500,
          //   });
          //   return;
          // }
          // if (Number(this.reworkForm.productionQuantity) > Number(this.orderQuantity)) {
          //   this.activeName = "orderInfo"
          //   submitFlag = false
          //   this.btnLoading = false
          //   this.$message({
          //     message: "返工数量不得超过原订单生产数量",
          //     type: 'error',
          //     duration: 1500,
          //   })
          //   return
          // }
          var pattern = /^\d{1,8}(\.\d{1,2})?$/;

          if (this.productData.length > 0) {
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.materialsUsedQuantity) {
                this.activeName = "annex";
                submitFlag = false;
                this.btnLoading = false;
                this.$message({
                  message: "请填写" + (index + 1) + "行用料数量",
                  type: "error",
                  duration: 1500,
                });
                break;
              }

              if (!pattern.test(item.materialsUsedQuantity)) {
                this.btnLoading = false;
                submitFlag = false;
                this.$message({
                  message:
                    "第" +
                    (index + 1) +
                    "行用料数量，请输入正确的数字，整数不能超过8位，小数不能超过2位",
                  type: "error",
                });
              }
            }
          }
          const date1 = new Date(this.reworkForm.planStartDate);
          const date2 = new Date(this.reworkForm.planEndDate);
          if (date1.getTime() > date2.getTime()) {
            this.btnLoading = false;
            submitFlag = false;
            this.$message({
              message: "计划结束日期不能在计划开始日期之前",
              type: "error",
            });
          }
          if (submitFlag === false) return;

          if (this.workOrderData.length > 0) {
            this.workOrderData.forEach((item, index) => {
              item.firstFlag = item.firstFlag ? true : false;
              item.chargeableReworkFlag = item.chargeableReworkFlag
                ? true
                : false;
              item.firstInspection = item.firstInspection ? true : false;
              item.reportFlag = item.reportFlag ? true : false;
              item.stockFlag = item.stockFlag ? true : false;
              item.lastFlag = item.lastFlag ? true : false;
              item.sort = index + 1;
              item.id = this.btnType == 'add' || this.btnType == 'edit' ? '' : item.id
            });
          }
          console.log("this.workOrderData", this.workOrderData);
          for (let index = 0; index < this.productData.length; index++) {
            const item = this.productData[index];
          }
          let obj = {
            materialList: this.productData,
            prodOrder: this.reworkForm,
            workOrderList: this.workOrderData,
          };
          let methods = null;
          let msg = "";
          if (this.btnType == "add") {
            methods = addProdOrder;
          } else if (this.btnType == "edit") {
            methods = updateprodOrderFinished;
          }
          if (value == "draft") {
            msg = "保存成功";
            methods(obj)
              .then((res) => {
                this.$message({
                  message: msg,
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.btnLoading = false;
                    this.$emit("close", true);
                  },
                });
              })
              .catch(() => {
                this.btnLoading = false;
              });
          } else {
            //     { label: "返工成品", value: "product" },
            // { label: "返工成品工序", value: "process" },
            //             当前提交的返工订单是返工成品，您确定吗？
            // 当前提交的返工订单是返工成品工序，您确定吗？

            msg = "提交成功";
            let submitMsg = "";
            if (this.reworkForm.reworkType == "product") {
              submitMsg = "当前提交的返工订单是返工成品，您确定吗？";
            } else {
              submitMsg = "当前提交的返工订单是返工成品工序，您确定吗？";
            }
            this.$confirm(submitMsg, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                methods(obj)
                  .then((res) => {
                    this.$message({
                      message: msg,
                      type: "success",
                      duration: 1500,
                      onClose: () => {
                        this.visible = false;
                        this.btnLoading = false;
                        this.$emit("close", true);
                      },
                    });
                  })
                  .catch(() => {
                    this.btnLoading = false;
                  });
              })
              .catch((error) => {
                this.btnLoading = false;
              });
          }
        } else {
          this.activeName = "orderInfo";
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

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