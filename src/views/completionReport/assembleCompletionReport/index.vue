<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="aaa">
        <el-tab-pane label="按生产任务报工" name="produce">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.orderNo" @keyup.enter.native="searchProductData()"
                      placeholder="生产任务单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.productDrawingNo" @keyup.enter.native="searchProductData()"
                      placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="计划开始日期">
                    <el-date-picker v-model="planDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                      :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>

                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductData()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProduceData()">{{
                      $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <el-row :gutter="10" class="content_box">
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>
                <el-col :span="6">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：PROD202408240015</span>
                      <el-button style="float: right;color:red; padding: 3px 0" type="text">关单</el-button>
                    </div>
                    <div class="label_title"> 订单类型:正常订单</div>
                    <div class="label_title"> 品名规格:6933ZZC03.4GN11AA6</div>
                    <div class="label_title"> 总生产数量:120</div>
                    <div class="label_title"> 已完成数量:0</div>
                    <div class="label_title"> 工艺路线名称:测试工艺路线</div>
                    <div>
                      <el-button type="primary" size="mini">报 工</el-button>
                      <el-button type="primary" size="mini">查看报工记录</el-button>
                    </div>
                  </el-card>

                </el-col>

              </el-row>
              <pagination :total="total" :page.sync="produceForm.pageNum" :limit.sync="produceForm.pageSize"
                @pagination="searchProductData">
              </pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按班组报工" name="workgroup">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workGroupForm.name" @keyup.enter.native="getWorkGroupData()" placeholder="名称"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workGroupForm.code" @keyup.enter.native="getWorkGroupData()" placeholder="编码"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="创建时间">
                    <el-date-picker v-model="createTimeArr" type="datetimerange" format="yyyy-MM-dd hh:mm:ss"
                      value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable>
                    </el-date-picker>
                  </el-form-item>

                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getWorkGroupData()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetWorkGroup()">{{ $t('common.reset')
                      }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <el-row :gutter="10" class="content_boxt">
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col> <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col> <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col> <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="3">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 名称:一号班组</div>
                    <div class="label_title"> 编码:1686764</div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>



              </el-row>
              <pagination :total="workGroupTotal" :page.sync="workGroupForm.pageNum"
                :limit.sync="workGroupForm.pageSize" @pagination="getWorkGroupData">
              </pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按人员报工" name="person">
          <div class="JNPF-common-layout">
            <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
              <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
                <div class="title_box">
                  <h5>{{ $t('common.organization') }}</h5>
                  <span class="options">
                    <el-dropdown>
                      <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
                        <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                        <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                        <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                        <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
                        <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </div>
                <div>
                  <el-input placeholder="输入关键字" v-model="filterText" suffix-icon="el-icon-search" clearable
                    style="width:200px;margin:10px auto;display:block" />
                </div>
              </div>

              <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
                <el-tree ref="treeBox" :data="filteredTree" :props="defaultProps" :default-expand-all="expands"
                  highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                  class="JNPF-common-el-tree" v-if="refreshTree">
                  <span class="custom-tree-node" slot-scope="{ data, node }" :title="data.fullName">
                    <i :class="data.icon" />
                    <span class="text" :title="data.fullName">{{ node.label }}</span>
                  </span>
                </el-tree>
              </el-scrollbar>
              <div v-if="!leftFlag" class="retract" style="position: absolute">
                <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
              </div>
              <div v-if="leftFlag" class="expand" style="position: absolute">
                <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
              </div>
            </div>
            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="personForm.realName" placeholder="姓名" clearable
                        @keyup.enter.native="searchPerson()" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="personForm.account" placeholder="账号" clearable
                        @keyup.enter.native="searchPerson()" />
                    </el-form-item>
                  </el-col>


                  <el-col :span="6">
                    <el-form-item>
                      <el-button size="mini" type="primary" icon="el-icon-search" @click="searchPerson()">{{
                        $t('common.search')
                      }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="resetPerson()">{{ $t('common.reset')
                        }}</el-button>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding:6px 10px">
                  <div></div>
                  <div class="JNPF-common-head-right">
                    <el-tooltip content="高级查询" placement="top" v-if="true">
                      <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                        @click="superQueryVisible = true" />
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                      <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                        @click="columnSetFun()" />
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                      <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                        @click="searchPerson()" />
                    </el-tooltip>
                  </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="personData" custom-column fixedNO @sort-change="sortChange"
                  ref="personRef" :setColumnDisplayList="columnList">
                  <el-table-column prop="realName" label="姓名" width="100" sortable="custom"></el-table-column>
                  <el-table-column prop="账号" label="账户" width="100" sortable="custom" />
                  <el-table-column prop="gender" label="性别" width="90" align="center" sortable="custom">
                    <template slot-scope="scope">
                      <span>{{ scope.row.gender == 1 ? '男' : (scope.row.gender == 2 ? '女' : '保密') }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="organizeName" label="所属部门" min-width="280" sortable="custom" />
                  <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="180"
                    sortable="custom" />
                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="handleReport(scope.row, 'person')">报工</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="personTotal" :page.sync="personForm.pageNum" :limit.sync="personForm.pageSize"
                  @pagination="searchPerson" />
              </div>
            </div>



          </div>

        </el-tab-pane>

      </el-tabs>
    </div>



    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
  </div>
</template>

<script>
import { prodOrderClose } from '@/api/productOrdes/finishedProductOrders.js'
import { ordershengchanList, addOrderNum } from '@/api/productOrdes/index.js'

import Diagram from '@/views/permission/user/Diagram.vue' // 树状列表-组织机构
import { getGroupList } from '@/api/basicData/index.js'



import { UserListAll, } from '@/api/permission/user'
import { excelExport } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal, batchRevokeorders } from '@/api/salesManagement/assemblyOrders'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import ExportForm from '@/components/no_mount/ExportBox/index'

export default {
  name: 'carrierProfile',
  components: { ExportForm, Diagram },
  data() {
    return {
      superQueryVisible: false,
      activeName: "produce",
      leftFlag: false,

      selectArr: [],

      produceTotal: 0,
      produceData: [],
      produceForm: {
        orderNo: "",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        orderStatus: "normal",
        documentStatus: "submit",
        classAttribute: "finish_product",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },
      planDate: [],
      orderTypeList: [
        { label: "正常订单", value: "normal" },
        { label: "返工订单", value: "rework" },
      ],


      personTotal: 0,
      personData: [],
      personForm: {
        realName: "",
        account: "",
        organizeId: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },

      workGroupForm: {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },

      treeLoading: false,
      treeData: [],
      filterText: "",
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },






    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  created() {


    this.searchProductData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    handleClick() {
      if (this.activeName == 'produce') {
        this.searchProductData()
      } else if (this.activeName == 'workgroup') {
        this.getWorkGroupData()
      } else {
        this.getOrganizeList()
        if (localStorage.getItem("userReportFlag")) {
          let userReportFlag = JSON.parse(localStorage.getItem('userReportFlag'))
          this.expands = userReportFlag
          console.log("userReportFlag", userReportFlag);
          this.toggleExpand(userReportFlag)

        }
      }
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    columnSetFun() {

    },
    // 多选
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.orderStatus !== 'normal' || row.orderStatus == 'suspend' || row.documentStatus == 'draft') {
        console.log(222);
        return false
      } else {
        console.log(333);
        return true

      }
    },
    // 关单
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请选择您要关单的任务")
      this.$confirm('您确认关闭选中的任务吗？', this.$t('common.tipTitle'), {
        type: 'warning',
        customClass: 'custom-confirm',
      }).then(() => {

        let arr = this.selectArr.map(item => {
          return item.id
        })
        console.log(arr)
        prodOrderClose(arr).then(res => {
          console.log(555);
          this.$message.success("关单成功")
          this.search()
        }).catch(() => {
        })
      }).catch(() => { })
    },
    // 生产任务列表
    searchProductData() {
      if (this.planDate.length) {
        this.produceForm.planSsd = this.planDate[0]
        this.produceForm.planSed = this.planDate[1]
      } else {
        this.produceForm.planSsd = ""
        this.produceForm.planSed = ""
      }
      this.listLoading = true
      ordershengchanList(this.produceForm).then(res => {
        this.produceData = res.data.records
        this.produceTotal = res.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    resetProduceData() {
      this.planDate = []
      this.produceForm = {
        orderNo: "",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        orderStatus: "normal",
        documentStatus: "submit",
        classAttribute: "finish_product",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      }
    },


    // 班组列表
    getWorkGroupData() {

    },
    resetWorkGroup() {

    },




    // 人员列表
    searchPerson() {

    },
    resetPerson() {

    },
    // 人员  ——左侧数据
    getOrganizeList() {
      this.filterText = ''
      this.treeLoading = true
      this.personForm.organizeId = ''
      getDepartmentSelectorByAuth().then(res => {
        this.treeData = res.data.list
        this.treeLoading = false
        this.initData()
      }).catch(() => {
        this.treeLoading = false
      })
    },

    // // 设置默认展开
    setexpand(expands) {
      console.log("expands", expands);
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("userReportFlag", expands)

      })
    },

    // 架构图
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },




















    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },



  }
}
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}

::v-deep .el-pagination {
  padding: 7px 5px;
}

.content_box {
  padding: 10px;
  overflow-y: auto;
  height:100%

}
.content_boxt{
  padding: 10px;
  overflow-y: auto;
  height:100%
}
.content_boxt .el-col:nth-child(n+9) {
  margin-top: 10px;
}
.content_box::-webkit-scrollbar {
  display: none;
  /* Safari 和 Chrome */
}

.box {
  height: 197px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px
}

.content_box :nth-child(n+5) {
  margin-top: 10px;
}

.label_title {
  margin-top: 10px
}

::v-deep .el-card__body {
  padding: 10px;
  padding-top: 0;
}

::v-deep .el-card__header {
  padding: 10px;
}

.orderNo {
  vertical-align: sub;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
