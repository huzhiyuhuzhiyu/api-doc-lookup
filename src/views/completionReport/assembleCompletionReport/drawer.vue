<template>
  <!-- <el-drawer @closed="cancelFun" title="报工" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="customerVisible" lock-scroll class="JNPF-common-drawer" size="70%" :wrapperClosable="false">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template> -->

  <!-- </el-drawer> -->
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    @close="customerVisible = false" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="80%" append-to-body>
    <div style="padding:10px">
      <el-col :span="11" class="fixedInfo" :style="{ height: targetHeight + 'px!important' }"
        style="width: 38%!important;">
        <el-row>
          <el-col :sm="24" :xs="24">

            <div class="info">
              <span class="left-title">工单单号：</span>
              <el-tooltip class="item" effect="dark" :content="form.workOrderNo" placement="top-start">
                <span class="left-title ts">
                  {{ form.workOrderNo }}
                </span>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :sm="24" :xs="24">
            <div class="info">
              <span class="left-title">工单类型：</span>
              <span class="left-title" v-if="form.processType == 'normal'">正常工序</span>
              <span class="left-title" v-if="form.processType == 'vibrate'">测振工序</span>
              <span class="left-title" v-if="form.processType == 'heat_treatment'">热工工序</span>
              <span class="left-title" v-if="form.processType == 'packing'">包装工序</span>
              <span class="left-title" v-if="form.processType == 'pairs'">配对工序</span>
              <span class="left-title" v-if="form.processType == 'grinding'">磨孔工序</span>
              <span class="left-title" v-if="form.processType == 'accuracy'">精度工序</span>
              <span class="left-title" v-if="form.processType == 'fatInjection'">注脂工序</span>
              <span class="left-title" v-if="form.processType == 'typing'">打字工序</span>
              <span class="left-title" v-if="form.processType == 'boxing'">装盒工序</span>
            </div>
          </el-col>

          <el-col :sm="24" :xs="24">
            <div class="info">
              <span class="left-title">品名规格：</span>
              <el-tooltip class="item" effect="dark" :content="form.productDrawingNo" placement="top-start">
                <span class="left-title ts">
                  {{ form.productDrawingNo }}
                </span>
              </el-tooltip>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24">
            <div class="info">
              <span class="left-title">加工工序：</span>
              <span class="left-title">{{ form.processName }}</span>
            </div>

          </el-col>


          <el-col :sm="24" :xs="24" v-if="sealingCoverTypingFlag === '1'">
            <div class="info">
              <span class="left-title">打字内容：</span>
              <span class="left-title">{{ form.sealingCoverTyping }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="accuracyLevelFlag === '1'">
            <div class="info">
              <span class="left-title">精度等级：</span>
              <span class="left-title">{{ form.accuracyLevel }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="vibrationLevelFlag === '1'">
            <div class="info">
              <span class="left-title">振动等级：</span>
              <span class="left-title">{{ form.vibrationLevel }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="oilFlag === '1'">
            <div class="info">
              <span class="left-title">油脂：</span>
              <span class="left-title">{{ form.oil }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="oilQuantityFlag === '1'">
            <div class="info">
              <span class="left-title">油脂量：</span>
              <span class="left-title">{{ form.oilQuantity }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="clearanceFlag === '1'">
            <div class="info">
              <span class="left-title">游隙：</span>
              <span class="left-title">{{ form.clearance }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="packagingMethodFlag === '1'">
            <div class="info">
              <span class="left-title">包装方式：</span>
              <span class="left-title">{{ form.packagingMethod }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="specialRequireFlag === '1'">
            <div class="info">
              <span class="left-title">特殊要求：</span>
              <span class="left-title">{{ form.specialRequire }}</span>
            </div>

          </el-col>
          <el-col :sm="24" :xs="24" v-if="materialFlag === '1'">
            <div class="info">
              <span class="left-title">保持架材质：</span>
              <span class="left-title">{{ form.material }}</span>
            </div>
          </el-col>
          <el-col :sm="24" :xs="24" v-if="colourFlag === '1'">
            <div class="info">
              <span class="left-title">颜色：</span>
              <span class="left-title">{{ form.colour }}</span>
            </div>
          </el-col>

        </el-row>
      </el-col>
      <el-col :span="12" class="rightInfo" ref="mycol" style="width: 62%;" >
        <el-form ref="reportRef" :model="form" :rules="dataRule" label-width="160px" label-position="left">
          <el-row>
            <div style="margin-bottom: 10px; background: #f2f2f2; padding: 20px 16px;">
              <span style="font-size: 18px;font-weight: bold">加工数量：</span><span
                style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{
                  form.productionQuantity }}]</span>
              <span style="font-size: 18px;font-weight: bold;margin-left: 10px;">可报工数量：</span><span
                style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{ form.waitReportNum }}]</span>
              <span style="font-size: 18px;font-weight: bold;margin-left: 10px;">报工数量：</span><span
                style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{ form.reportingQuantity }}]</span>
              <span style="font-size: 18px;font-weight: bold;margin-left: 10px;display: inline-block;">不合格数量：</span><span style="color: #3fb9f8;font-size: 18px;font-weight: bold">[{{
                  form.unqualifiedQuantity }}]</span>
            </div>
            <div style="padding: 0 20px;">
              <el-col :sm="24" :xs="24" class="iptLabel" v-if="currentProcessType === 4 || currentProcessType === 5">
                <el-form-item label="配对方式" prop="pairingModeName">
                  <el-select v-model="form.pairingModeId" placeholder="请选择配对方式" style="width: 60%;" clearable
                    @input="handleClear" class="ipt" @change="(value) => changePairingMode(value)">
                    <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <span class="pairNum" v-if="form.pairingModeId">配对基本数量：{{ pairingModeNum }}</span>
                </el-form-item>
              </el-col>
              <!-- //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序 -->
              <el-col :sm="24" :xs="24" class="iptLabel"
                v-if="currentProcessType !== 1 && currentProcessType !== 6 && form.accuracyReportFlag">
                <el-form-item label="精度等级:" prop="accuracyLevel" :style="{ marginBottom: producerMargin }">
                  <el-select v-model="form.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                    @change="(value) => handleSelectionChangeJD(value)" class="ipt">
                    <el-option v-for="(item, index) in accuracyLevelList" :key="index" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" class="iptLabel"
                v-if="currentProcessType !== 1 && form.vibrateReportFlag && currentProcessType !== 6">
                <el-form-item label="测振等级:" prop="vibrationLevel" :style="{ marginBottom: producerMargin }">
                  <el-select v-model="form.vibrationLevel" placeholder="请选择测振等级" style="width: 100%;"
                    @change="(value) => handleSelectionChangeZD(value)" class="ipt">
                    <el-option v-for="(item, index) in vibrationLevelList" :key="index" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>

              <el-col :sm="24" :xs="24" v-if="currentProcessType === 4 || currentProcessType === 5">
                <el-form-item label="总配对数量(对):" prop="matchedQuantity" class="iptLabel"
                  :style="{ marginBottom: iptLabelMargin }">
                  <el-input v-model="form.matchedQuantity" :disabled="!form.pairingModeId" placeholder="总配对数量"
                    class="ipt" @blur="countQualifiedQuantity" />
                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" v-if="currentProcessType !== 6">
                <el-form-item label="合格数量:" prop="qualifiedQuantity" class="iptLabel"
                  :style="{ marginBottom: iptLabelMargin }">
                  <el-input v-model="form.qualifiedQuantity" v-if="currentProcessType === 4 || currentProcessType === 5"
                    :disabled="form.pairingModeId" placeholder="合格数量" class="ipt" @blur="handleBlur()" />
                  <el-input v-model="form.qualifiedQuantity"
                    v-if="currentProcessType === 1 || currentProcessType === 2 || currentProcessType === 3"
                    placeholder="合格数量" class="ipt" @blur="handleBlur()" />
                </el-form-item>
              </el-col>

              <!-- stockFlag 0否 继续生产 2包装入库 -->
              <el-col :sm="24" :xs="24" class="iptLabel"
                v-if="currentProcessType !== 1 && form.reportFlag && currentProcessType !== 6">
                <el-form-item label="是否入库:" prop="stockFlag">
                  <el-select v-model="stockFlag" placeholder="请选择是否入库" :disabled="form.lastFlag" style="width: 100%;"
                    class="ipt">
                    <el-option v-for="(item, index) in stockFlagList" :key="item.id" :label="item.fullName"
                      :value="item.value"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" class="iptLabel" v-if="form.processType === 'packing' && form.reportFlag">
                <el-form-item label="包装方式:" prop="packagingMethod">
                  <el-select v-model="form.packagingMethod" placeholder="请选择包装方式" style="width: 100%;" class="ipt">
                    <el-option v-for="(item, index) in packagingMethodList" :key="item.id" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" class="iptLabel" v-if="form.processType === 'fatInjection' && form.reportFlag">
                <el-form-item label="注脂方式:" prop="oil">
                  <el-select v-model="form.oil" placeholder="请选择注脂方式" style="width: 100%;" class="ipt">
                    <el-option v-for="(item, index) in oilList" :key="item.id" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>


                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" class="iptLabel" v-if="form.processType === 'typing' && form.reportFlag">
                <el-form-item label="打字内容:" prop="sealingCoverTyping">
                  <el-select v-model="form.sealingCoverTyping" placeholder="请选择打字内容" style="width: 100%;" class="ipt">
                    <el-option v-for="(item, index) in sealingcoverTypingList" :key="item.id" :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>

              <el-col :sm="24" :xs="24" v-if="currentProcessType == 1"
                :style="!form.vibrateReportFlag ? 'margin-top:5px' : ''">
                <el-form-item label="责废数量:" class="iptLabel">
                  <el-input v-model="form.responsibilityWasteQuantity" disabled placeholder="责废数量" @blur="handleBlur2"
                    class="ipt materialWaste" />
                  <el-button type="primary" style="float: right;height: 50px" size="mini"
                    @click='setResponsWasteM()'>设置责废原因</el-button>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" v-if="currentProcessType == 1">
                <el-form-item label="料废数量:" class="iptLabel">
                  <el-input v-model="form.materialWasteQuantity" disabled placeholder="料废数量" @blur="handleBlur3"
                    class="ipt materialWaste" />
                  <el-button type="primary" style="float: right;height: 50px" size="mini"
                    @click='setMaterialWasteM()'>设置料废原因</el-button>
                </el-form-item>
              </el-col>



              <el-col :sm="24" :xs="24">
                <el-form-item label="报工时间" class="iptLabel">
                  <el-date-picker v-model="form.reportingTime" value-format="yyyy-MM-dd" @change="reportingTimeChange"
                    class="ipt" type="date" style="width: 100%;" placeholder="选择报工时间"> </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" class="iptLabel">
                <el-form-item label="生产人" prop="producerName" v-if="form.taskMethod != 'not_appoint'">
                  <el-select v-model="form.producerName" placeholder="生产人" style="width: 100%;" class="ipt">
                    <el-option v-for="(item, index) in personList" :key="index" :label="item.label"
                      :value="item.id"></el-option>
                  </el-select>

                  <!-- producerId -->
                </el-form-item>
                <el-form-item label="生产人" prop="producerId" v-if="form.taskMethod == 'not_appoint'" class="iptLabel">
                  <user-select v-model="form.producerId" placeholder="生产人" clearable style="width: 100%;" class="ipt"
                    @change="hangleSelectSales">
                  </user-select>

                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24">
                <el-form-item label="设备" class="iptLabel">
                  <el-select v-model="form.equipmentName" placeholder="设备" style="width: 100%;" class="ipt">
                    <el-option v-for="(item, index) in equipmentList" :key="index" :label="item.name"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :xs="24" class="iptLabel" v-if="currentProcessType == 6 && form.accuracyReportFlag">
                <div style="width: 100%;">
                  <div style="width: 49%;display: inline-block;">
                    <p class="accTitle">02精度</p>
                    <JNPF-table v-loading="listLoading" ref="dataTable" custom-column :data="tableDataList"
                      :fixedNO="true" customKey="JNPFTableKey_615493">
                      <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel" >
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                            @change="(value) => handleSelectionChangeaccOne(scope, value)">
                            <el-option v-for="(item, index) in getFilteredAccuracyLevelList(scope.row)" :key="index"
                              :label="item.name" :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="qualifiedQuantity" label="数量">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.qualifiedQuantity" />
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" @click="addFun">新增</el-button>
                          <el-button size="mini" type="text" @click="delFun(scope)" style=" color: #ff3a3a"
                            :disabled="tableDataList.length === 1">删除</el-button>
                        </template>
                      </el-table-column>
                    </JNPF-table>
                  </div>

                  <div style="width: 49%;display: inline-block;margin-left: 2%;vertical-align: top;">
                    <p class="accTitle">01精度</p>
                    <JNPF-table v-loading="listLoading" ref="dataTables" custom-column :data="tableDataList2"
                      :fixedNO="true" customKey="JNPFTableKey_425560">
                      <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel" >
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                            @change="selectAccuracyFun(scope)">
                            <el-option v-for="(item, index) in getFilteredAccuracyLevelList2(scope.row)" :key="index"
                              :label="item.name" :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="qualifiedQuantity" label="数量">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.qualifiedQuantity" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="stockFlag" label="是否入库">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.stockFlag" placeholder="请选择是否入库" :disabled="form.lastFlag"
                            style="width: 100%;">
                            <el-option v-for="(item, index) in stockFlagList" :key="item.id" :label="item.fullName"
                              :value="item.value"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" @click="addFun2">新增</el-button>
                          <el-button size="mini" type="text" @click="delFun2(scope)" style=" color: #ff3a3a"
                            :disabled="tableDataList2.length === 1">删除</el-button>
                        </template>
                      </el-table-column>
                    </JNPF-table>
                  </div>
                </div>
                <!-- <el-form-item label="精度等级:" prop="accuracyLevel" :style="{ marginBottom: producerMargin }">
                      <el-select v-model="form.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                        @change="(value) => handleSelectionChangeJD(value)" class="ipt">
                        <el-option v-for="(item, index) in accuracyLevelList" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>

                    </el-form-item> -->
              </el-col>
            </div>


          </el-row>
        </el-form>
      </el-col>
    </div>

    <!-- <span class="button-bottom">
        <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitReportFun()">
          提交
        </el-button>
      </span> -->

    <span slot="footer" class="dialog-footer">
      <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitReportFun()">
        提交</el-button>
    </span>
  </el-dialog>

</template>
<script>
import { detailordershengchan, getWorkList, addWorkReport, detailWorkData } from '@/api/productOrdes/index.js'
import { producePersonList } from "@/api/warehouseManagement/packingList.js"
import { getOrderFiledMap } from '@/api/basicData/index'
import { detailProcess, getvibrationList, getPairingModelList, getaccuracyList } from '@/api/basicData/processSettingss.js'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  data() {
    return {
      stockFlagList: [],
      tableDataList: [
        { accuracyLevel: "", qualifiedQuantity: "" }
      ],
      accuracyLevelList2: [],
      tableDataList2: [
        { accuracyLevel: "", qualifiedQuantity: "", stockFlag: 0, }
      ],
      pairingModeListCopy: [],
      targetHeight: "589",
      title: "",
      dataRule: {
        reportingTime: [
          { required: true, message: '报工时间不能为空', trigger: 'change' }
        ],
        producerName: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        producerId: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        qualifiedQuantity: [
          // { required: true, message: '合格数量不能为空', trigger: 'blur' },
          { validator: this.formValidate({ type: "decimal", params: [20, 2, "请输入正确的数量(最多保留2位小数,整数8位)"], }), trigger: "blur", },
          // { validator: this.formValidate('noZero', '合格数量不能为0', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' },
        ]
      },

      pairingModeNum: 0,
      personList: [],
      equipmentList: [],
      orderTypeList: [
        { label: "正常工单", value: "normal", },
        { label: "返工工单", value: "rework", },
      ],
      customerVisible: false,

      form: {

        reportingQuantity: 0,
        orderNo: "",
        orderType: "",
        productDrawingNo: "",
        processName: "",
        productionQuantity: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        specialRequire: "",
        qualifiedQuantity: "",
        unqualifiedQuantity: "",
        responsibilityWasteQuantity: "",
        materialWasteQuantity: "",
        reworkQuantity: "0",
        reportingTime: "",
        producerName: "",
        producerId: "",
        equipmentName: "",
        equipmentId: "",
        remark: "",
        workOrderNo: "",
        item: {},
      },
      selectArr: [],
      listLoading: false,
      total: 0,
      id: "",
      processData: [],
      codeConfig: {},
      vibrationLevelList: [],
      accuracyLevelList: [],
      packagingMethodList: [],
      oilList: [],
      sealingcoverTypingList: [],
      totalReportNum: 0,
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag: '',
      colourFlag: '',
      currentProcessType: "",
      materialWasteDataList: [],
      responsWasteDataList: [], 
      totalReportNum: "",
    }
  },
  async mounted() {
    await this.getpairingModeListFun()
    this.getInboundVal()

  },
  methods: {
    selectAccuracyFun(scope) {
      console.log(scope);
      if (scope.row.accuracyLevel === 'P0') {
        this.tableDataList2[scope.$index].stockFlag = 2
      } else {
        this.tableDataList2[scope.$index].stockFlag = 0

      }
    },
    // 过滤01精度已选择的数据
    getFilteredAccuracyLevelList2(currentRow) {
      // 生成当前行可以选择的精度等级列表  
      const selectedLevels = this.tableDataList2
        .filter(row => row !== currentRow) // 排除当前行  
        .map(row => row.accuracyLevel); // 获取其他行的已选择项  

      return this.accuracyLevelList2.filter(item => !selectedLevels.includes(item.name));
    },
    // 01精度新增
    addFun2(scope) {
      let len = this.tableDataList2.length
      // if (len >= this.tableDataList.length) return this.$message.error("表格数据条数已达到精度等级可选种类数量")
      this.tableDataList2.push({ accuracyLevel: "", qualifiedQuantity: "", stockFlag: 0, })
      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        this.targetHeight = Number(height) + 49>589?height:589;
      });
    },
    // 01精度删除
    delFun2(scope) {
      this.tableDataList2.splice(scope.$index, 1)
    
    },
    // 获取是否入库下拉框
    getInboundVal() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'NextProductionMethod' }).then((res) => {


        res.forEach(item => {
          if (item.enCode === "0") {
            this.$set(item, 'value', item.enCode * 1)
            this.stockFlagList = [...this.stockFlagList, item]
          }
          if (item.enCode === "2") {
            this.$set(item, 'value', item.enCode * 1)
            this.stockFlagList = [...this.stockFlagList, item]
          }
        });
        console.log("stock", this.stockFlagList);
        this.stockFlag = 0
      })
    },
    handleSelectionChangeZD(value) {
      console.log("value", value);
      if (this.currentProcessType !== 2) {
        //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
        const selectedItem = this.vibrationLevelList.find(item => item.name === value);
        console.log("selectedItem", selectedItem);
        this.form.waitReportNum = selectedItem.waitReportNum
      }


    },

    changePairingMode(value) {
      console.log("bbb", value);
      if (value) {
        console.log(this.pairingModeListCopy);
        this.pairingModeNum = this.pairingModeListCopy.filter(items => items.id === value)[0].quantity;
        this.form.waitReportNum=this.pairingModeList.filter(items => items.id === value)[0].waitReportNum 

        this.form.qualifiedQuantity = ''
        this.form.reportingQuantity = 0
        // if (this.currentProcessType !== 4) {

        //   this.getReprotNum(this.form.pairingModeId)
        // }
      }
    },
    handleSelectionChangeJD(value) {
      console.log("value", value);
      if (this.currentProcessType !== 6) {
        //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
        const selectedItem = this.accuracyLevelList.find(item => item.name === value);
        console.log("selectedItem", selectedItem);
        this.form.waitReportNum = selectedItem.waitReportNum
      }


    },
    countQualifiedQuantity() {
      if (this.form.matchedQuantity) {
        this.totalReportNum = this.form.reportingQuantity = this.form.qualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('multiply', [this.form.matchedQuantity, this.pairingModeNum]), 2)
      }
    },
    //生产人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.form.validateField('producerId')
      })
      this.form.producerId = e
    },
    forceUpdata() {
      this.$forceUpdate()
    },
    handleBlur(item, data) {
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.qualifiedQuantity, this.form.unqualifiedQuantity]), 6)

      this.$set(this.form, 'reportingQuantity', this.totalReportNum)
    },
    async init(workData, type) {
      console.log("workData", workData);
      await this.getOrderFiledMap()
      if (type == 'process') {
        this.title = "工序报工"
      }
      this.customerVisible = true

      this.getDetailWorkDataFun(workData.id)

    },
    handleBlur2() {
      this.form.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.materialWasteQuantity, this.form.responsibilityWasteQuantity]), 6)

    },
    handleBlur3() {
      this.form.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.materialWasteQuantity, this.form.responsibilityWasteQuantity]), 6)

    },
    reportingTimeChange(e) {
      this.form.reportingTime = e + ' 00:00:00'
    },
    getOrderFiledMap() {
      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },
    // 获取振动等级数据
    getvibrationLevelFun() {
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj3).then(res => {
        this.vibrationLevelList = res.data.records

        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = Number(height)>589?height:589;
        });
      })

    },
    // 获取精度等级
    getaccuracyFun() {
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj3).then(res => {
        this.accuracyLevelList = res.data.records
        console.log("精度等级", res);
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = Number(height)>589?height:589;
        });
      })

    },
    // 选择02精度  再将选中的值赋值给到01精度可选项
    handleSelectionChangeaccOne(scope, value) {
      console.log("vaue", scope);
      //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
      const selectedItem = this.accuracyLevelList.find(item => item.name === value);
      console.log("selectedItem", selectedItem);
      this.$set(this.tableDataList[scope.$index], 'sortCode', selectedItem.sortCode)
      let arr = JSON.parse(JSON.stringify(this.tableDataList))
      console.log("asrr", arr);
      arr.sort((a, b) => a.sortCode - b.sortCode);
      console.log("arr", arr);
      let sort = arr[0].sortCode
      console.log("sort", sort);
      this.accuracyLevelList2 = this.accuracyLevelList.filter(item => item.sortCode >= sort);
    },
    // 过滤已选择的数据
    getFilteredAccuracyLevelList(currentRow) {
      // 生成当前行可以选择的精度等级列表  
      const selectedLevels = this.tableDataList
        .filter(row => row !== currentRow) // 排除当前行  
        .map(row => row.accuracyLevel); // 获取其他行的已选择项  

      return this.accuracyLevelList.filter(item => !selectedLevels.includes(item.name));
    },
    // 02精度新增
    addFun(scope) {
      let len = this.tableDataList.length
      if (len >= this.accuracyLevelList.length) return this.$message.error("表格数据条数已达到精度等级可选种类数量")
      this.tableDataList.push({ accuracyLevel: "", qualifiedQuantity: "", })
      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        this.targetHeight = Number(height) >589?height:589;
        console.log("tthis.ta",height,this.targetHeight);
      });
    },
    // 02精度删除
    delFun(scope) {
      this.tableDataList.splice(scope.$index, 1)
      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        this.targetHeight = Number(height)>589?height:589;
      });
      let nameToFind = scope.row.accuracyLevel
      if (!this.tableDataList2.length) return

      const index = this.tableDataList2.findIndex(item => item.accuracyLevel === nameToFind);

      // 输出结果  
      if (index !== -1) {
        this.tableDataList2[index] = { accuracyLevel: "", qualifiedQuantity: "" }
      } else {
      }
    },
    // 获取包装方式
    getPackmethods() {
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj4).then(res => {
        this.packagingMethodList = res.data.records
        console.log("this.包装方式", this.packagingMethodList);
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })
    },
    // 获取注脂方式
    getOilList() {
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj4).then(res => {
        this.oilList = res.data.records
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })
    },
    // 获取打字内容
    getsealingcoverTypingList() {
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa007",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj4).then(res => {
        this.sealingcoverTypingList = res.data.records
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })
    },
    setDivHeight() {
      console.log(this.$refs.rightInfo.offsetHeight);
      // 获取源 div 的动态高度并设置目标 div 的高度  
      const sourceDivHeight = this.$refs.rightInfo.offsetHeight;
    },
    // 定义当前工序的类型
    //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
    setProcessType() {
      if (this.form.vibrateReportFlag || this.form.accuracyReportFlag || this.form.pairsReportFlag) {
        if (this.form.processType == 'vibrate') {
          this.currentProcessType = 2
        } else if (this.form.processType == 'pairs') {
          this.currentProcessType = 4

        } else if (this.form.processType == 'accuracy') {
          this.currentProcessType = 6

        } else if (!this.form.pairsReportFlag) {
          this.currentProcessType = 3
        } else {
          this.currentProcessType = 5
        }
      } else {
        this.currentProcessType = 1
      }
      console.log(this.currentProcessType);
    },
    // 获取配对方式
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
        this.pairingModeListCopy = JSON.parse(JSON.stringify(this.pairingModeList))
      } catch (error) { }


    },
    setMaterialWasteM() {
      console.log("this.materialWasteDataList", this.materialWasteDataList);
      this.materialWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.materialWasteFormRef.init(JSON.parse(JSON.stringify(this.materialWasteDataList)), this.form.materialWasteQuantity, this.dataForm.projectId)
      })
    },
    // 设置责废原因
    setResponsWasteM() {
      console.log("this.responsWasteDataList", this.responsWasteDataList);
      this.responsWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.responsWasteFormRef.init(JSON.parse(JSON.stringify(this.responsWasteDataList)), this.form.responsibilityWasteQuantity, this.dataForm.projectId)
      })
    },
    materialWasteData(data, totalNums) {
      console.log("设置的料废金额", data, totalNums);
      this.materialWasteDataList = data
      if (totalNums) {
        this.form.materialWasteQuantity = totalNums
        this.handleBlur2()
      }
    },
    responsWasteData(data, totalNums) {
      console.log("责废数据", data, totalNums);
      this.responsWasteDataList = data
      if (totalNums) {
        this.form.responsibilityWasteQuantity = totalNums
        this.handleBlur2()
      }
    },
    // 获取 可选的测振等级
    getReprotNum(id) {
      let obj = {
        workOrderId: this.form.id,
        pairingModeId: id,
      }
      getvibrationList(obj).then(res => {
        console.log("测振数据", res);
        this.vibrationLevelList = res.data
      })
    },
    // 获取 可选的精度等级
    getReprotNumJD(id) {
      let obj = {
        workOrderId: this.form.id,
        pairingModeId: id,
      }
      getaccuracyList(obj).then(res => {
        console.log("测振数据", res);
        this.accuracyLevelList = res.data
      })
    },
    // 获取工单详情
    getDetailWorkDataFun(id) {
      detailWorkData(id).then(res => {
        this.tableDataList= [
        { accuracyLevel: "", qualifiedQuantity: "" }
      ]
     this.tableDataList2= [
        { accuracyLevel: "", qualifiedQuantity: "", stockFlag: 0, }
      ],
        console.log("工单详情", res);
        res.data.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [res.data.materialWasteQuantity, res.data.responsibilityWasteQuantity]), 6)
        res.data.reportingQuantity = 0
        this.form = res.data
        this.$set(this.form, 'workOrderNo', this.form.orderNo)
        this.$set(this.form, 'item', {})
        this.setProcessType()
        if (this.form.processType == 'vibrate') this.getvibrationLevelFun()
        if (this.form.processType == 'packing') this.getPackmethods()
        if (this.form.processType == 'accuracy') this.getaccuracyFun()
        if (this.form.processType == 'fatInjection') this.getOilList()
        if (this.form.processType == 'typing') this.getsealingcoverTypingList()
        if (this.form.lastFlag === true) {
          this.stockFlag = 2
        }
        this.form.qualifiedQuantity = ""
        if (this.form.vibrateReportFlag === true && this.form.processType !== 'vibrate') {
          console.log("进来了");
          this.getReprotNum('')
        }
        if (this.form.pairingModeId && this.pairingModeList.length) this.pairingModeNum = this.pairingModeList.filter(items => items.id === this.form.pairingModeId)[0].quantity;
        if (this.form.accuracyReportFlag === true && this.form.processType !== "accuracy") {
          console.log("进来了2");
          this.getReprotNumJD('')
        }
        this.producePersonListFun(res.data.id)

        const end = new Date();//获取当前的日期
        this.$set(this.form, 'reportingTime', this.dateFormat(end))
      })
    },
    // 获取生产人员数据
    producePersonListFun(id) {
      producePersonList(id).then(res => {

        console.log("生产人", res);
        if (res.data) {
          let result = Object.entries(res.data).map(([key, value]) => {
            return {
              id: key,
              label: value
            };
          });
          this.personList = result
          console.log(result);
          if (result.length > 0) {
            this.$set(this.form, 'producerId', result[0].id)
            this.$set(this.form, 'producerName', result[0].label)

            this.$nextTick(() => {
              this.$refs.reportRef.clearValidate('producerName')
            })
          }

        }
      })
    },
    isPositiveInteger(num) {
      return /^\d+$/.test(num);
    },
    // 提交报工
    submitReportFun() {
      console.log("this.form", this.form);
      this.$refs['reportRef'].validate((valid) => {
        if (valid) {
          let submitFlag = null
          let totalNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.unqualifiedQuantity, this.form.qualifiedQuantity]), 6)
          if (this.totalReportNum > Number(this.form.waitReportNum)) {
            this.submitFlag = false
            this.$message.error("合格数量加上不合格数量不能超过可报工数量")
            return
          }
          if (this.form.reportFlag && this.currentProcessType === 1) {
            if (!this.totalReportNum) {
              submitFlag = false
              this.$message.error("合格数量加上不合格数量必须大于0")
              return
            }
          }
          if (this.form.reportFlag && this.form.accuracyReportFlag && this.currentProcessType !== 6) {
            if (!this.form.qualifiedQuantity) return this.$message.error("合格数量不能为空")
          }
          if (this.form.reportFlag && this.currentProcessType == 2) {
            if (!this.form.qualifiedQuantity) return this.$message.error("合格数量不能为空")
          }
          // 精度工序相关判断
          if (this.currentProcessType === 6 && this.form.reportFlag && this.form.accuracyReportFlag) {
            console.log(123);
            // 使用 every 方法检查是否所有 accuracyLevel 都为空
            var totalQualifiedQuantity, totalQualifiedQuantity2;
            if (this.tableDataList.length) {
              const allAccuracyLevelEmpty = this.tableDataList.every(item => item.accuracyLevel === "");
              if (allAccuracyLevelEmpty) {
                this.$message.error("请选择02精度等级")
                submitFlag = false
                return
              }
              for (let index = 0; index < this.tableDataList.length; index++) {
                const item = this.tableDataList[index];
                if (item.accuracyLevel && !item.qualifiedQuantity) {
                  this.$message({
                    message: "请输入02精度表格第" + (index + 1) + "行数量",
                    type: 'error',
                    duration: 1500,
                  })
                  submitFlag = false
                  break
                }
              }
              totalQualifiedQuantity = this.tableDataList.reduce((sum, item) => {
                return sum + parseInt(item.qualifiedQuantity, 10); // 将字符串转换为数字并累加  
              }, 0);
              if (totalQualifiedQuantity > this.form.waitReportNum) {
                this.$message.error("02精度总数量不能超过可报工数量")
                return
              }
            }
            if (this.tableDataList2.length) {
              const allAccuracyLevelEmpty2 = this.tableDataList2.every(item => item.accuracyLevel === "");
              if (allAccuracyLevelEmpty2) {
                this.$message.error("请选择01精度等级")
                submitFlag = false
                return
              }
              for (let index = 0; index < this.tableDataList2.length; index++) {
                const item = this.tableDataList2[index];
                if (item.accuracyLevel && !item.qualifiedQuantity) {
                  this.$message({
                    message: "请输入01精度表格第" + (index + 1) + "行数量",
                    type: 'error',
                    duration: 1500,
                  })
                  submitFlag = false
                  break
                }
              }
              totalQualifiedQuantity2 = this.tableDataList2.reduce((sum, item) => {
                return sum + parseInt(item.qualifiedQuantity, 10); // 将字符串转换为数字并累加  
              }, 0);
              if (totalQualifiedQuantity2 > totalQualifiedQuantity) {
                this.$message.error("01精度总数量不能超过02精度总数量")
                return
              }
            }
          }
          if (this.currentProcessType === 4 || this.currentProcessType === 5) {
            if (this.form.pairingModeId) {

              if (!this.form.matchedQuantity) return this.$messagea.error("总配对数量不能为空")
              let flag = this.isPositiveInteger(this.form.matchedQuantity)
              if (!flag) this.$message.error("总配对数量不能有小数")
              if (!flag) submitFlag = false
            } else {
              console.log("拦截了吗");
              if (!this.form.qualifiedQuantity) {

                this.$message.error("合格数量不能为空")
                submitFlag = false
              }
            }
          }
          if (submitFlag === false) return
          let arr = []
          if (this.form.vibrateReportFlag || this.form.pairsReportFlag) {
            let obj = {}
            if (this.currentProcessType === 2) {//1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
              // 测震工序
              console.log("测震工序");
              obj.classAttribute = this.form.classAttribute
              obj.orderType = this.form.orderType
              obj.productDrawingNo = this.form.productDrawingNo
              obj.processName = this.form.processName
              obj.productionQuantity = this.form.productionQuantity
              obj.equipmentId = this.form.equipmentId
              obj.remark = this.form.remark
              obj.reportingTime = this.form.reportingTime
              obj.reworkQuantity = this.form.reworkQuantity
              obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.form.materialWasteQuantity
              obj.pricingType = this.form.pricingType
              obj.processId = this.form.processId
              obj.producerId = this.form.producerId
              obj.productionOrderId = this.form.productionOrderId
              obj.qualifiedQuantity = this.form.qualifiedQuantity
              obj.reportingQuantity = this.form.reportingQuantity
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.form.unqualifiedQuantity
              obj.vibrationLevel = this.form.vibrationLevel
              obj.workOrderId = this.form.id
              obj.stockFlag = this.stockFlag
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
            } else if (this.currentProcessType === 3) {
              obj.classAttribute = this.form.classAttribute
              obj.orderType = this.form.orderType
              obj.productDrawingNo = this.form.productDrawingNo
              obj.processName = this.form.processName
              obj.productionQuantity = this.form.productionQuantity
              obj.equipmentId = this.form.equipmentId
              obj.remark = this.form.remark
              obj.reportingTime = this.form.reportingTime
              obj.reworkQuantity = 0
              obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.form.materialWasteQuantity
              obj.pricingType = this.form.pricingType
              obj.processId = this.form.processId
              obj.producerId = this.form.producerId
              obj.productionOrderId = this.form.productionOrderId
              obj.qualifiedQuantity = this.form.qualifiedQuantity
              obj.reportingQuantity = this.form.reportingQuantity
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.form.unqualifiedQuantity
              obj.vibrationLevel = this.form.vibrationLevel
              obj.workOrderId = this.form.id
              obj.stockFlag = this.stockFlag
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              console.log("测震到配对工序之间的工序");
            } else if (this.currentProcessType === 4) {
              obj.classAttribute = this.form.classAttribute
              obj.orderType = this.form.orderType
              obj.productDrawingNo = this.form.productDrawingNo
              obj.processName = this.form.processName
              obj.productionQuantity = this.form.productionQuantity
              obj.equipmentId = this.form.equipmentId
              obj.remark = this.form.remark
              obj.reportingTime = this.form.reportingTime
              obj.reworkQuantity = this.form.reworkQuantity
              obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.form.materialWasteQuantity
              obj.pricingType = this.form.pricingType
              obj.processId = this.form.processId
              obj.producerId = this.form.producerId
              obj.productionOrderId = this.form.productionOrderId
              obj.qualifiedQuantity = this.form.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.qualifiedQuantity, this.form.unqualifiedQuantity,]), 6)
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.form.unqualifiedQuantity
              obj.vibrationLevel = this.form.vibrationLevel
              obj.workOrderId = this.form.id
              obj.matchedQuantity = this.form.matchedQuantity
              obj.pairingModeId = this.form.pairingModeId
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              console.log("配对工序");
            } else {
              console.log("配对后工序");
              obj.classAttribute = this.form.classAttribute
              obj.orderType = this.form.orderType
              obj.productDrawingNo = this.form.productDrawingNo
              obj.processName = this.form.processName
              obj.productionQuantity = this.form.productionQuantity
              obj.equipmentId = this.form.equipmentId
              obj.remark = this.form.remark
              obj.reportingTime = this.form.reportingTime
              obj.reworkQuantity = this.form.reworkQuantity
              obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.form.materialWasteQuantity
              obj.pricingType = this.form.pricingType
              obj.processId = this.form.processId
              obj.producerId = this.form.producerId
              obj.productionOrderId = this.form.productionOrderId
              obj.qualifiedQuantity = this.form.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.qualifiedQuantity, this.form.unqualifiedQuantity]), 6)
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.form.unqualifiedQuantity
              obj.vibrationLevel = this.form.vibrationLevel
              obj.workOrderId = this.form.id
              obj.matchedQuantity = this.form.matchedQuantity
              obj.pairingModeId = this.form.pairingModeId
              obj.oil = this.form.oil
              obj.sealingCoverTyping = this.form.sealingCoverTyping
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
            }
            arr.push(obj)
          } else if (this.form.accuracyReportFlag) {
            if (this.currentProcessType === 6) {
              console.log("this.table", this.tableDataList2);
              this.tableDataList2.forEach(item => {
                let obj = {}
                this.$set(obj, 'classAttribute', this.form.classAttribute)
                this.$set(obj, 'orderType', this.form.orderType)
                this.$set(obj, 'productDrawingNo', this.form.productDrawingNo)
                this.$set(obj, 'processName', this.form.processName)
                this.$set(obj, 'productionQuantity', this.form.productionQuantity)
                this.$set(obj, 'equipmentId', this.form.equipmentId)
                this.$set(obj, 'remark', this.form.remark)
                this.$set(obj, 'reportingTime', this.form.reportingTime)
                this.$set(obj, 'reworkQuantity', this.form.reworkQuantity)
                this.$set(obj, 'responsibilityWasteQuantity', this.form.responsibilityWasteQuantity)
                this.$set(obj, 'materialWasteQuantity', this.form.materialWasteQuantity)
                this.$set(obj, 'pricingType', this.form.pricingType)
                this.$set(obj, 'processId', this.form.processId)
                this.$set(obj, 'producerId', this.form.producerId)
                this.$set(obj, 'productionOrderId', this.form.productionOrderId)
                this.$set(obj, 'qualifiedQuantity', item.qualifiedQuantity)
                this.$set(obj, 'reportingQuantity', item.qualifiedQuantity)
                this.$set(obj, 'stockFlag', item.stockFlag)
                this.$set(obj, 'reportingType', 'normal')
                this.$set(obj, 'unqualifiedQuantity', this.form.unqualifiedQuantity)
                this.$set(obj, 'vibrationLevel', this.form.vibrationLevel)
                this.$set(obj, 'workOrderId', this.form.id)
                this.$set(obj, 'matchedQuantity', this.form.matchedQuantity)
                this.$set(obj, 'pairingModeId', this.form.pairingModeId)
                this.$set(obj, 'accuracyLevel', item.accuracyLevel)
                this.$set(obj, 'causesList', [...this.materialWasteDataList, ...this.responsWasteDataList])




                arr.push(obj)
                console.log("精度报工", arr);
              })
            } else if (this.currentProcessType === 3) {
              let obj = {}
              obj.classAttribute = this.form.classAttribute
              obj.orderType = this.form.orderType
              obj.productDrawingNo = this.form.productDrawingNo
              obj.processName = this.form.processName
              obj.productionQuantity = this.form.productionQuantity
              obj.equipmentId = this.form.equipmentId
              obj.remark = this.form.remark
              obj.reportingTime = this.form.reportingTime
              obj.reworkQuantity = 0
              obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.form.materialWasteQuantity
              obj.pricingType = this.form.pricingType
              obj.processId = this.form.processId
              obj.producerId = this.form.producerId
              obj.productionOrderId = this.form.productionOrderId
              obj.qualifiedQuantity = this.form.qualifiedQuantity
              obj.reportingQuantity = this.form.reportingQuantity
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.form.unqualifiedQuantity
              obj.vibrationLevel = this.form.vibrationLevel
              obj.workOrderId = this.form.id
              obj.stockFlag = this.stockFlag
              obj.accuracyLevel = this.form.accuracyLevel
              obj.oil = this.form.oil
              obj.sealingCoverTyping = this.form.sealingCoverTyping
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              arr.push(obj)
              console.log("测震到配对工序之间的工序");
            } else if (this.currentProcessType === 4) {
              let obj = {}
              obj.classAttribute = this.form.classAttribute
              obj.orderType = this.form.orderType
              obj.productDrawingNo = this.form.productDrawingNo
              obj.processName = this.form.processName
              obj.productionQuantity = this.form.productionQuantity
              obj.equipmentId = this.form.equipmentId
              obj.remark = this.form.remark
              obj.reportingTime = this.form.reportingTime
              obj.reworkQuantity = this.form.reworkQuantity
              obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.form.materialWasteQuantity
              obj.pricingType = this.form.pricingType
              obj.processId = this.form.processId
              obj.producerId = this.form.producerId
              obj.productionOrderId = this.form.productionOrderId
              obj.qualifiedQuantity = this.form.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.qualifiedQuantity, this.form.unqualifiedQuantity]), 6)
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.form.unqualifiedQuantity
              obj.vibrationLevel = this.form.vibrationLevel
              obj.workOrderId = this.form.id
              obj.matchedQuantity = this.form.matchedQuantity
              obj.pairingModeId = this.form.pairingModeId
              obj.accuracyLevel = this.form.accuracyLevel
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              arr.push(obj)
              console.log("配对工序");
            } else {
              let obj = {}
              console.log("配对后工序");
              obj.classAttribute = this.form.classAttribute
              obj.orderType = this.form.orderType
              obj.productDrawingNo = this.form.productDrawingNo
              obj.processName = this.form.processName
              obj.productionQuantity = this.form.productionQuantity
              obj.equipmentId = this.form.equipmentId
              obj.remark = this.form.remark
              obj.reportingTime = this.form.reportingTime
              obj.reworkQuantity = this.form.reworkQuantity
              obj.responsibilityWasteQuantity = this.form.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.form.materialWasteQuantity
              obj.pricingType = this.form.pricingType
              obj.processId = this.form.processId
              obj.producerId = this.form.producerId
              obj.productionOrderId = this.form.productionOrderId
              obj.qualifiedQuantity = this.form.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.form.qualifiedQuantity, this.form.unqualifiedQuantity]), 6)
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.form.unqualifiedQuantity
              obj.vibrationLevel = this.form.vibrationLevel
              obj.workOrderId = this.form.id
              obj.matchedQuantity = this.form.matchedQuantity
              obj.pairingModeId = this.form.pairingModeId
              obj.accuracyLevel = this.form.accuracyLevel
              obj.oil = this.form.oil
              obj.sealingCoverTyping = this.form.sealingCoverTyping
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              arr.push(obj)
            }
          } else {
            let obj = {
              "classAttribute": this.form.classAttribute,
              orderType: this.form.orderType,
              productDrawingNo: this.form.productDrawingNo,
              processName: this.form.processName,
              productionQuantity: this.form.productionQuantity,
              equipmentId: this.form.equipmentId,
              remark: this.form.remark,
              reportingTime: this.form.reportingTime,
              reworkQuantity: this.form.reworkQuantity,
              responsibilityWasteQuantity: this.form.responsibilityWasteQuantity,
              "materialWasteQuantity": this.form.materialWasteQuantity,
              "pricingType": this.form.pricingType,
              "processId": this.form.processId,
              "producerId": this.form.producerId,
              "productionOrderId": this.form.productionOrderId,
              "qualifiedQuantity": this.form.qualifiedQuantity,
              "reportingQuantity": this.jnpf.numberFormat(this.jnpf.math('add', [this.form.qualifiedQuantity, this.form.unqualifiedQuantity,]), 6),
              "reportingType": "normal ",
              "unqualifiedQuantity": this.form.unqualifiedQuantity,
              "vibrationLevel": this.form.vibrationLevel,
              "oil": this.form.oil,
              "sealingCoverTyping": this.form.sealingCoverTyping,
              "workOrderId": this.form.id,
              causesList: [...this.materialWasteDataList, ...this.responsWasteDataList],

            }
            arr.push(obj)
          }
          addWorkReport(arr).then(res => {
            this.customerVisible = false
            this.$message.success("报工成功")
            this.$emit('close', true)
          })
        }
      })
    },





    dateFormat(dateData) {
      var date = new Date(dateData);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var hours = date.getHours().toString().padStart(2, "0");
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate
    },
  }
}
</script>
<style scoped>
.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 10px !important;
}

.selectProcess.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body {
  padding: 0 !important;
}

.button-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

.left-title {
  font-size: 18px;
  font-weight: 600;
}

.info {
  margin-top: 20px;
}

.fixedInfo {
  height:auto!important;
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);
  padding: 20px;
  color: #fff;
  border-radius: 4px;
  padding: 20px;
  color: #fff;
  border-radius: 4px;
  box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.20);
  padding-top: 0;
}

.rightInfo {
  /* border: 1px solid; */
  border-radius: 4px;
  /* margin-left: 20px; */
  box-shadow: beige;
  box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.20);
}

.ipt ::v-deep.el-input__inner {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
}

.iptLabel ::v-deep.el-form-item__label {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
}

.JNPF-common-drawer ::v-deep.el-drawer__body {
  overflow-y: auto;
}

.ts {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.JNPF-dialog.JNPF-dialog_center ::v-deep.el-dialog .el-dialog__body {
  padding: 10px !important;
}

.pairNum {
  display: inline-block;
  height: 50px;
  float: right;
  padding-right: 10px;
  line-height: 50px;
  background: #3fb9f8;
  padding-left: 10px;
  font-size: 18px;
  color: #fff;
}

.materialWaste {
  width: 70%;
}
::v-deep .el-table--scrollable-y .el-table__body-wrapper {
  height: auto !important;
}
</style>
