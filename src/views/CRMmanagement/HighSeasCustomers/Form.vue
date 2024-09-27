<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType=='look' ? '查看公海客户' :btnType=='add'? '新建公海客户' :'编辑公海客户'" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()" v-if="btnType!='look'">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">

            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入客户编码" maxlength="20" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户分类" prop="partnerCategoryIdText">
                        <ComSelect-list :isdisabled="btnType === 'look'" v-model="dataForm.partnerCategoryIdText" placeholder="请选择客户分类" auth @change="onOrganizeChange" :title="'选择分类'" :method="getcategoryTree" :requestObj="requestObjTwo" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入客户名称" :disabled="btnType=='look' ? true : false" maxlength="100" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="英文名称" prop="nameEn">
                        <el-input v-model="dataForm.nameEn" placeholder="请输入英文名称" :disabled="btnType=='look' ? true : false" maxlength="200" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="联系人" prop="contacts">
                        <el-input v-model="dataForm.contacts" placeholder="请输入联系人" :disabled="btnType=='look' ? true : false" maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="负责人" prop="personResponsible">
                        <el-input v-model="dataForm.personResponsible" placeholder="请输入负责人" maxlength="20" :disabled="btnType=='look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="所属部门" prop="departmentId">
                        <ComSelect v-model="organizeIdTrees" :disabled="isdisabled" placeholder="请选择所属部门" auth @change="onOrganizeChangeHandle" :currOrgId="dataForm.departmentId || '0'" />
                      </el-form-item>

                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="所属销售" prop="salespersonId">
                        <el-select v-model="dataForm.salespersonIdText" placeholder="请选择所属销售人员" clearable style="width: 100%;" :disabled="salesFlag" filterable @change="selectsales">
                          <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="下次联系时间" prop="nextTime">
                        <el-date-picker v-model="dataForm.nextTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择下次联系时间" :disabled="btnType == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="内勤人员" prop="internalStaffId" ref="euqPeople">
                        <user-select v-model="dataForm.internalStaffId" :disabled="salesFlag" placeholder="请选择设备人员" @change="changePerple" clearable style="width: 100%;">
                        </user-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="认定日期" prop="customerRecognitionTime">

                        <el-date-picker v-model="dataForm.customerRecognitionTime" type="date" format="yyyy-MM-dd" style="width: 100%;" value-format="yyyy-MM-dd" :picker-options="pickerOptions" placeholder="请选择认定日期" :disabled="btnType=='look' ? true : false">
                        </el-date-picker>
                      </el-form-item></el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="等级" prop="grade">
                        <el-select v-model="dataForm.grade" placeholder="请选择等级" :disabled="btnType=='look' ? true : false" style="width: 100%;">
                          <el-option v-for="(item, index) in gradeList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="地区" prop="regionCode">
                        <el-select v-model="dataForm.regionCode" placeholder="请选择地区" style="width: 100%;" @change="handleChange" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="(item, index) in areaList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="国家" prop="country">

                        <el-select v-model="dataForm.country" placeholder="请选择国家" style="width: 100%;" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="(item, index) in countryList" :key="index" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.regionCode != 'foreign'">
                      <el-form-item label="地址" prop="provincecityarea">
                        <JNPF-Address v-model="dataForm.provincecityarea" @change="actiompro" placeholder="请选择地址" :disabled="btnType == 'look' ? true : false"></JNPF-Address>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="6" :xs="24" v-if="dataForm.regionCode != 'foreign'">
                  <el-form-item label="省" prop="province">
                    <el-select v-model="dataForm.province" placeholder="请选择省" style="width: 100%;"
                      :disabled="btnType=='look' ? true : false">
                      <el-option v-for="item in provinces" size="small" :key="item.id" :label="item.fullName"
                        :value="item.id" @click.native="changeProvince(item)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="dataForm.regionCode != 'foreign'">
                  <el-form-item label="市" prop="city">
                    <el-select v-model="dataForm.city" placeholder="请选择市" style="width: 100%;" @focus="focusfoundation(dataForm.province)" :loading="foundationloadingcity"
                      :disabled="btnType=='look' ? true : false||!dataForm.province">
                      <el-option v-for="item in cities" size="small" :key="item.id" :label="item.fullName"
                        :value="item.id" @click.native="changeCity(item)">{{ item.fullName }}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="dataForm.regionCode != 'foreign'">
                  <el-form-item label="区" prop="area">
                    <el-select v-model="dataForm.area" placeholder="请选择区" style="width: 100%;" @focus="foundationfocusactionarea(dataForm.city)" :loading="loadingareafoundation"
                      :disabled="btnType=='look' ? true : false||!dataForm.city">
                      <el-option v-for="item in area" size="small" :key="item.id" :label="item.fullName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="详细地址" prop="address">
                        <el-input v-model="dataForm.address" placeholder="请输入详细地址" :disabled="btnType=='look' ? true : false" maxlength="300" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="电话" prop="phone">
                        <el-input v-model="dataForm.phone" placeholder="请输入电话" :disabled="btnType=='look' ? true : false" maxlength="20" />
                      </el-form-item>
                    </el-col><el-col :sm="6" :xs="24">
                      <el-form-item label="手机号" prop="mobilePhone">
                        <el-input v-model="dataForm.mobilePhone" placeholder="请输入手机号" :disabled="btnType=='look' ? true : false" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="传真" prop="fax">
                        <el-input v-model="dataForm.fax" placeholder="请输入传真" :disabled="btnType=='look' ? true : false" maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="邮政编码" prop="zipCode">
                        <el-input v-model="dataForm.zipCode" placeholder="请输入邮政编码" :disabled="btnType=='look' ? true : false" maxlength="10" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="dataForm.email" placeholder="请输入邮箱" :disabled="btnType=='look' ? true : false" maxlength="100" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="网址" prop="website">
                        <el-input v-model="dataForm.website" placeholder="请输入网址" :disabled="btnType=='look' ? true : false" maxlength="512" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="渠道类型" prop="channel">
                        <el-select v-model="dataForm.channel" placeholder="请选择渠道类型" style="width: 100%;" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="(item, index) in channelList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24" v-if="btnType=='look'">
                      <el-form-item label="是否禁止发货出库" prop="shipmentFreezeFlag">
                        <el-select v-model="dataForm.shipmentFreezeFlag" placeholder="请选择是否禁止发货" style="width: 100%;" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="(item, index) in shipmentFreezeFlagList" :key="index" :label="item.text" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="运输方式" prop="modeTransport">
                        <el-select v-model="dataForm.modeTransport" placeholder="请选择运输方式" style="width: 100%;" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="(item, index) in modeTransportList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="运输时间(天)" prop="transportationTime">
                        <el-input v-model="dataForm.transportationTime" oninput="value = value.replace(/[^0-9]/g,'')" placeholder="请输入运输时间(天)" :disabled="btnType=='look' ? true : false" maxlength="4" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="行业类别" prop="industry">
                        <el-cascader placeholder="请选择/搜索行业类别" :show-all-levels="false" v-model="dataForm.industry" :disabled="btnType=='look' ? true : false" :options="industryoptions" :props="{ value: 'enCode',label: 'fullName'}" filterable style="width: 100%;" @change="changeindustry"></el-cascader>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" maxlength="200" :disabled="btnType=='look' ? true : false" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="财务信息" name="FinanceInfo">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="税号" prop="taxId">
                        <el-input v-model="dataForm.taxId" placeholder="请输入税号" :disabled="btnType=='look' ? true : false" maxlength="25" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="付款方式" prop="paymentMethod">
                        <el-select v-model="dataForm.paymentMethod" placeholder="请选择付款方式" style="width: 100%;" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="item in paymentMethodList" size="small" :key="item.enCode" :label="item.fullName" :value="item.enCode">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="付款周期" prop="paymentCycle">
                        <el-select v-model="dataForm.paymentCycle" placeholder="请选择付款周期" style="width: 100%;" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="item in paymentCycleList" size="small" :key="item.enCode" :label="item.fullName" :value="item.enCode">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="开票类型" prop="billingTypeText">
                        <el-select v-model="dataForm.billingType" placeholder="请选择开票类型" style="width: 100%;" :disabled="btnType=='look' ? true : false">
                          <el-option v-for="item in billingTypeList" size="small" :key="item.enCode" :label="item.fullName" :value="item.enCode">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="税率%" prop="taxRate">
                        <el-select v-model="dataForm.taxRate" placeholder="请选择税率" style="width: 100%;" :disabled="btnType === 'look' ? true : false">
                          <el-option v-for="item in taxRateTypeList" size="small" :key="item.enCode" :label="item.fullName" :value="item.enCode">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="开户银行" prop="bank">
                        <el-input v-model="dataForm.bank" placeholder="请输入开户银行" :disabled="btnType=='look' ? true : false" maxlength="100" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="银行账号" prop="bankInfo">
                        <el-input v-model="dataForm.bankInfo" placeholder="请输入银行账号" :disabled="btnType=='look' ? true : false" maxlength="100" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="联系人信息" name="lxr">
            <el-table :data="contactsList" style="width: 100%">
              <el-table-column prop="name" label="姓名" width="180">
                <template slot="header">
                  <span class="required">*</span>姓名
                </template>
                <template slot-scope="scope">

                  <el-input v-model="scope.row.name" :disabled="btnType=='look' ? true : false" maxlength="20" placeholder="请输入姓名">{{ scope.row.name
                    }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sex" label="性别" width="100">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.sex" placeholder="请选择性别" :disabled="btnType=='look' ? true : false">
                    <el-option v-for="(item, index) in sexList" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="电话" width="180">
                <template slot="header">
                  <span class="required">*</span>电话
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.phone" :disabled="btnType=='look' ? true : false" maxlength="50" placeholder="请输入电话">{{ scope.row.phone
                    }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="email" label="邮箱" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.email" :disabled="btnType=='look' ? true : false" maxlength="200" placeholder="请输入邮箱">{{
                      scope.row.email }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="地址" width="220">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.address" :disabled="btnType=='look' ? true : false" maxlength="250" placeholder="请输入地址">{{
                      scope.row.address }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="displayName" label="职务" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.displayName" :disabled="btnType=='look' ? true : false" maxlength="20" placeholder="请输入职务">{{
                      scope.row.displayName }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="departmentName" label="部门" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.departmentName" :disabled="btnType=='look' ? true : false" maxlength="20" placeholder="请输入部门">{{
                      scope.row.departmentName
                    }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="hobby" label="爱好" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.hobby" :disabled="btnType=='look' ? true : false" maxlength="200" placeholder="请输入爱好">{{
                      scope.row.hobby }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="220">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" :disabled="btnType=='look' ? true : false" maxlength="200" placeholder="请输入备注">{{
                      scope.row.remark }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <!-- <el-button @click="addtable(scope.row)" type="text" >添加</el-button> -->
                  <el-button @click="deltable(scope)" v-if="btnType!=='look'" type="text" style="color:rgb(245,108,108)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="addtable()" v-if="btnType!=='look'">
              <el-button type="text" icon="el-icon-plus">添加</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收货信息" name="second">
            <el-table :data="deliveryAddressList" style="width: 100%">
              <el-table-column prop="recipient" label="收件人" width="180">
                <template slot="header">
                  <span class="required">*</span>收件人
                </template>
                <template slot-scope="scope">

                  <el-input v-model="scope.row.recipient" :disabled="btnType=='look' ? true : false" maxlength="20" placeholder="请输入收件人">{{
                      scope.row.recipient }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="收件人电话" width="180">
                <template slot="header">
                  <span class="required">*</span>收件人电话
                </template>
                <template slot-scope="scope">

                  <el-input v-model="scope.row.phone" :disabled="btnType=='look' ? true : false" maxlength="20" placeholder="请输入收件人电话">{{ scope.row.phone
                    }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="country" label="国家" width="180" maxlength="50">
                <template slot="header">
                  <span class="required">*</span>国家
                </template>
                <template slot-scope="scope">

                  <el-select clearable v-model="scope.row.country" placeholder="请选择国家" filterable style="width: 100%;" :disabled="btnType=='look' ? true : false">
                    <el-option v-for="(item, index) in countryList1" :key="index" :label="item.name" @click.native="changeCountry(item, scope.$index)" :value="item.code">{{ item.name }}</el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="province" label="省" width="180">
                <template slot="header">
                  <span class="required">*</span>省
                </template>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.province" placeholder="请选择省份" :disabled="scope.row.country !== 'CN' ? true : btnType=='look' ? true : false">
                    <el-option v-for="item in provinces" :key="item.id" :label="item.fullName" :value="item.id" @click.native="changeProvince1(item, scope.row)"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="city" label="市" width="180">
                <template slot="header">
                  <span class="required">*</span>市
                </template>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.city" placeholder="请选择城市" @focus="focusaction(scope.row)" :loading="loadingcity" :disabled="!scope.row.province ? true : btnType=='look' ? true : false">
                    <el-option v-for="item in cities1" :key="item.id" :label="item.fullName" :value="item.id" @click.native="changeCity1(item, scope.row)"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="area" label="区" width="180">
                <template slot="header">
                  <span class="required">*</span>区
                </template>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.area" placeholder="请选择区" @focus="focusactionarea(scope.row)" :loading="loadingarea" :disabled="!scope.row.city ? true : btnType=='look' ? true : false">
                    <el-option v-for="item in area1" :key="item.id" :label="item.fullName" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="地址" width="220">
                <template slot="header">
                  <span class="required">*</span>地址
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.address" :disabled="btnType=='look' ? true : false" maxlength="300" placeholder="请输入地址">{{
                      scope.row.address }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="defaultFlag" label="是否默认" width="110">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.defaultFlag" placeholder="请选择" :disabled="btnType=='look' ? true : false" @change="handleAddress(scope)">
                    <el-option v-for="item in defaultFlagList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="220">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" :disabled="btnType=='look' ? true : false" maxlength="200" placeholder="请输入备注">{{
                      scope.row.remark }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                  <el-button @click="deleteth(scope)" type="text" style="color:rgb(245,108,108)" v-if="btnType!=='look'">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="adddeliveryAddressList()" v-if="btnType!=='look'">
              <el-button type="text" icon="el-icon-plus">添加</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch=='1'">
            <UploadWj v-model="datafilelist" :disabled="btnType=='look'" :detailed="btnType=='look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { checkPartner, addPartner, updatePartner, detailPartner } from '@/api/customerManagement'
import { getOrganization } from '@/api/permission/user'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getBimBusinessInfo, getCounryData, getcategoryTree } from '@/api/basicData/index'

import {
  getProvinceList,
} from '@/api/system/province'
export default {
  data() {
    return {
      getcategoryTree,
      requestObjTwo: {
        keyword: '',
        type: "customer"
      },
      codeConfig: {},//单据规则配置
      activeNames: ["basicInfo", "FinanceInfo"],
      tableData: [],
      taxRateTypeList: [],
      loadingareafoundation: false,
      foundationloadingcity: false,
      loadingarea: false,
      loadingcity: false,
      isdisabled: false,
      datafilelist: [],
      btnType: undefined,
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      cities1: [],
      area1: [],
      billingTypeList: [],
      paymentMethodList: [],
      modeTransportList: [],
      industryoptions: [],
      channelList: [],
      contactsList: [],
      paymentCycleList: [],
      deliveryAddressList: [],
      gradeList: [],
      countryList: [],
      countryList1: [],
      listQuery: {
        keyword: ''
      },
      activeName: "jcInfo",
      nodeId: -1,
      defaultFlagList: [
        {
          value: true,
          text: "是"
        }, {
          value: false,
          text: "否"
        }
      ],
      sexList: [
        {
          value: "男",
          label: "男"
        },
        {
          value: "女",
          label: "女"
        }, {
          value: "-",
          label: "-"
        },
      ],
      orderFreezeFlagList: [
        {
          text: "否",
          value: false
        }, {
          text: "是",
          value: true
        },
      ],
      shipmentFreezeFlagList: [
        {
          text: "否",
          value: false
        }, {
          text: "是",
          value: true
        },
      ],
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        industry: '',
        nextTime: '',
        // 合作伙伴
        code: '',
        taxId: '',
        name: '',
        nameEn: "",
        regionCode: '',
        country: '',
        province: '',
        city: '',
        area: '',
        address: '',
        contacts: '',
        phone: '',
        mobilePhone: '',
        includingTaxPrecision: '2',
        excludingTaxPrecision: '2',
        grade: "",
        parentName: "",
        partnerCategoryId: "",
        partnerCategoryIdText: "",
        paymentMethod: "",
        type: "customer",
        fax: "",
        zipCode: "",
        personResponsible: '',
        email: "",
        taxRate: "",
        paymentCycle: "",
        salespersonId: "",
        salespersonIdText: "",
        website: "",
        orderFreezeFlag: false,
        shipmentFreezeFlag: false,
        modeTransport: "",
        transportationTime: "",
        remark: "",
        departmentId: "",
        departmentIdText: "",
        customerStatus: "high_seas"
      },
      organizeIdTree: [],
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        partnerCategoryIdText: [
          { required: true, message: '客户分类不能为空', trigger: 'change' }
        ],
        mobilePhone: [{ validator: this.formValidate('iphone'), trigger: 'blur' }, { validator: this.validateField2, trigger: 'blur' }],
        // phone: [{ validator: this.validateField2, trigger: 'blur' }],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let obj = {
                id: this.dataForm.id,
                code: value,
                type: this.dataForm.type
              }
              checkPartner(obj).then(res => {
                if (res.data) {
                  callback(new Error("编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },

        ],


      },
      salesList: [],
      organizeIdTrees: [],
      salesFlag: false,
      businessType: "",
      isattachmentswitch: ''
    }
  },
  created() {
    this.getAttachmentswitch()
    this.getProvinceList()
    this.getDictionaryType()
  },
  methods: {
    changeindustry(val) {
      this.dataForm.industry = val[val.length - 1]
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (this.btnType == 'add') {
          this.dataForm.code = data.number
        }
      } catch (error) {
      }
    },
    actiompro(value) {
      if (value) {
        this.dataForm.province = value[0]
        this.dataForm.city = value[1]
        this.dataForm.area = value[2]
      } else {
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
      }
    },
    getAttachmentswitch() {
      getBimBusinessInfo('fj_ghkh').then(res => {
        this.isattachmentswitch = res.data.configValue1
      })
    },
    changePerple(internalStaffId, data) {
      if (!data) return
      this.$refs['dataForm'].validateField('internalStaffId')
      if (data) {

      } else {
        this.$refs['dataForm'].fields[0].resetField()
        this.dataForm.internalStaffId = data.internalStaffId
      }

    },
    //基础信息点击选择区
    foundationfocusactionarea(val) {
      this.loadingareafoundation = true
      getProvinceList(val).then(res => {
        this.area = res.data.list
        this.loadingareafoundation = false
      })
    },
    //基础信息选择市
    focusfoundation(val) {
      this.foundationloadingcity = true
      getProvinceList(val).then(res => {
        this.cities = res.data.list
        this.foundationloadingcity = false
      })
    },
    //点击选择市
    focusaction(val) {
      this.loadingcity = true
      getProvinceList(val.province).then(res => {
        this.cities1 = res.data.list
        this.loadingcity = false
      })
    },
    //点击选择区
    focusactionarea(val) {
      this.loadingarea = true
      getProvinceList(val.city).then(res => {
        this.area1 = res.data.list
        this.loadingarea = false
      })
    },
    // 电话 手机 二填一
    validateField2(rule, value, callback) {
      if (!this.dataForm.phone && !value) {
        callback(new Error('电话和手机号至少填一个'));
      } else {
        callback();
      }
    },
    changeCountry(e, index) {
      this.dataForm.country = e.code
      if (this.dataForm.country != 'CN') {
        this.deliveryAddressList[index].province = ''
        this.deliveryAddressList[index].city = ''
        this.deliveryAddressList[index].area = ''
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
      }
    },
    hangleSelectSales(e, r) {
      this.dataForm.departmentId = r.parentId
      this.dataForm.departmentIdText = r.organize
    },
    handleAddress(e) {
      if (e.row.defaultFlag) {
        this.deliveryAddressList.forEach((item, index) => {
          if (index != e.$index) {
            item.defaultFlag = false
          } else {
          }
        })
      }
    },
    selectsales(val) {
      this.dataForm.salespersonId = val
      // this.dataForm.salespersonIdText = val

    },
    onOrganizeChangeHandle(val) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      this.dataForm.salespersonIdText = ""
      this.dataForm.salespersonId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
      this.salesFlag = false

      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },
    handleChange($event) {
      if ($event == 'domestic') {
        // 国内
        this.countryList = [{
          code: "CN",
          id: "1663107232693223475",
          name: "中国",
          nameEn: "China",
        }]
        this.dataForm.country = "CN"
        this.dataForm.province = ""
        this.dataForm.city = ""
        this.dataForm.area = ""
        this.area = []
        this.cities = []
      } else {
        this.dataForm.country = ''
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
    },
    // 切换table
    handleClick(tab, event) {
      if (tab.label == '收货信息') {
        // 国内
        this.countryList1 = [{
          code: "CN",
          id: "1663107232693223475",
          name: "中国",
          nameEn: "China",
        }]
      }
    },
    // 联系人信息新增行
    addtable() {
      this.contactsList.push({
        name: '',
        email: '',
        sex: "男",
        phone: "",
        address: "",
        displayName: "",
        departmentName: "",
        hobby: "",
        remark: ""
      })

    },
    // 收货新增行
    adddeliveryAddressList() {
      if (this.deliveryAddressList.length > 0) {
        let flag = null;
        this.deliveryAddressList.forEach(item => {
          if (item.defaultFlag) {
            flag = true
          }
        })
        if (flag) {
          this.deliveryAddressList.push({
            country: "",
            province: "",
            city: "",
            area: "",
            address: "",
            defaultFlag: false,
            remark: "",
            recipient: "",
            phone: ""
          })
        }
      } else {
        this.deliveryAddressList.push({
          country: "",
          province: "",
          city: "",
          area: "",
          address: "",
          defaultFlag: true,
          remark: "",
          recipient: "",
          phone: ""
        })
      }


    },
    // 收获信息删除当前行
    deleteth(row, index) {
      this.deliveryAddressList.splice(row.$index, 1)

    },
    // 联系人信息删除当前行
    deltable(row, index) {
      this.contactsList.splice(row.$index, 1)
    },
    // 根据选择的省份获取相应的城市数据
    changeProvince(item, row) {

      if (row) {
        row.area = ''
        row.city = ''

      } else {
        this.dataForm.city = ""
        this.dataForm.area = ""
      }
      this.cities = []
      this.area = []

      getProvinceList(item.id).then(res => {
        this.cities = res.data.list
      })
    },
    changeProvince1(item, row) {
      if (row) {
        row.area = ''
        row.city = ''
      }
      this.cities1 = []
      this.area1 = []
      getProvinceList(item.id).then(res => {
        this.cities1 = res.data.list
      })
    },
    // 根据选择的城市获取各区的数据
    changeCity(item, row) {
      if (row) {
        row.area = ''

      } else {
        this.dataForm.area = ""

      }
      getProvinceList(item.id).then(res => {
        this.area = res.data.list
      })
    },
    changeCity1(item, row) {
      if (row) {
        row.area = ''
      }
      getProvinceList(item.id).then(res => {
        this.area1 = res.data.list
      })
    },
    // 获取省份数据
    getProvinceList() {
      getProvinceList(this.nodeId, this.listQuery).then(res => {
        this.provinces = res.data.list
        this.init(id, parentId)
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
        this.refreshTable = true
      })
    },


    // 获取等级、付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "taxrate") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.taxRateTypeList = response.data.list
                })
              }
              if (resp.enCode == "grade") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.gradeList = response.data.list
                })
              }
              if (resp.enCode == "regionCode") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.areaList = response.data.list
                })
              }
              if (resp.enCode == "paymentMethod") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentMethodList = response.data.list
                })
              }
              if (resp.enCode == "paymentCycle") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentCycleList = response.data.list
                })
              }
              if (resp.enCode == "channel") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.channelList = response.data.list
                })
              }
              if (resp.enCode == "modeTransport") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.modeTransportList = response.data.list
                })
              }
              if (resp.enCode == "IndustryType") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 1
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.industryoptions = response.data.list
                })
              }
            });
          }
          if (item.enCode == "CWGL") {
            item.children.forEach(resp => {
              if (resp.enCode == "billingType") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.billingTypeList = response.data.list
                })
              }
            })
          }
        });
      })
    },




    init(id, parentId, btnType) {
      this.visible = true
      this.dataForm.id = id || ''
      this.parentId = parentId || ''
      this.btnType = btnType
      if (this.btnType === 'add' || this.btnType === 'edit') this.fetchData('ZGTKHBM')
      // getBimBusinessInfo('bm_khbm').then(res=>{
      //   this.businessType = res.data.configValue1
      // })
      if (this.btnType == 'look') {
        this.salesFlag = true
        this.isdisabled = true
      } else {
        this.isdisabled = false

      }
      if (this.dataForm.id) {
        detailPartner(this.dataForm.id).then(res => {
          this.dataForm = res.data.cooperativePartner
          this.tableData = res.data.recordsList
          this.dataForm.cooperativePartner.provincecityarea = []
          if (res.data.province) {
            this.dataForm.provincecityarea.push(res.data.cooperativePartner.province)
            this.dataForm.provincecityarea.push(res.data.cooperativePartner.city)
            this.dataForm.provincecityarea.push(res.data.cooperativePartner.area)
          }
          if (this.dataForm.departmentId) {
            getOrganizeInfo(this.dataForm.departmentId).then(sss => {
              this.organizeIdTrees = sss.data.organizeIdTree || []
              this.organizeIdTrees.push(this.dataForm.departmentId)
            })
            getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
              if (res.data.length > 0) {
                res.data.forEach(item => {
                  item.name = item.fullName.split('/')[0]
                });
              }
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
              this.cities = res.data.list
            })

          }
          if (res.data.cooperativePartner.city) {
            let ooo = {
              id: res.data.cooperativePartner.city
            }
            // this.changeCity(ooo)
            getProvinceList(res.data.cooperativePartner.city).then(res => {
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
    onOrganizeChange(val, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('partnerCategoryIdText')
      })
      this.dataForm.partnerCategoryId = data ? data[0].id : ''
      this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
    },
    handleConfirm() {
      let flag = null;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          this.contactsList.forEach((item, index) => {
            item.id = ""
            if (!item.name) {
              flag = false
              this.activeName = "lxr"
              return this.$message({
                message: "请填写联系人姓名",
                type: 'error',
                duration: 1500,
              })
            } else if (!item.phone) {
              this.activeName = "lxr"
              flag = false
              return this.$message({
                message: "请填写联系人电话",
                type: 'error',
                duration: 1500,
              })
            }
          });
          this.deliveryAddressList.forEach((item, index) => {
            item.id = ""
            if (item.country === 'CN') {
              if (!item.recipient) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: "请填写收货信息的收件人",
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.phone) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: "请填写收货信息的收件人电话",
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.country) {
                this.activeName = "second"

                flag = false
                return this.$message({
                  message: `请填写第${index + 1}行收货信息的国家`,
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.province) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: `请填写第${index + 1}行收货信息的省份`,
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.city) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: `请填写第${index + 1}行收货信息的城市`,
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.area) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: `请填写第${index + 1}行收货信息的区`,
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.address) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: `请填写第${index + 1}行收货信息的地址`,
                  type: 'error',
                  duration: 1500,
                })
              }
            } else {
              if (!item.recipient) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: "请填写收货信息的收件人",
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.phone) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: "请填写收货信息的收件人电话",
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.country) {
                this.activeName = "second"

                flag = false
                return this.$message({
                  message: `请填写第${index + 1}行收货信息的国家`,
                  type: 'error',
                  duration: 1500,
                })
              } else if (!item.address) {
                this.activeName = "second"
                flag = false
                return this.$message({
                  message: `请填写第${index + 1}行收货信息的地址`,
                  type: 'error',
                  duration: 1500,
                })
              }
            }
          });
          if (this.dataForm.regionCode == "foreign") {
            this.dataForm.province = ""
            this.dataForm.city = ""
            this.dataForm.area = ""
          }
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'customer',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {
            attachmentList: this.datafilelist,
            cooperativePartner: this.dataForm,
            deliveryAddressList: this.deliveryAddressList,
            contactsList: this.contactsList
          }
          if (flag === false) return
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updatePartner : addPartner
          formMethod(obj).then(res => {
            let msg = "";
            if (formMethod == updatePartner) {
              msg = "修改成功"
            } else {
              msg = "新建成功"
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })

        } else {

          this.activeName = "jcInfo"
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
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
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
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
::v-deep .el-tabs__header {
  padding: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
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