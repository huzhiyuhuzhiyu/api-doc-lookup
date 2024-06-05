<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1200px" @closed="dialogClose">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-tabs v-model="activeabmqqm" tab-position="top" class="mb-20" style="height: 500px;">
                            <el-tab-pane label="基本">
                                <el-col :span="12">
                                    <el-row :gutter="15">
                                        <el-col :span="24">
                                            <el-form-item label="设备名称" prop="name">
                                                <el-input v-model="dataForm.name" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="设备编号" prop="code">
                                                <el-input v-model="dataForm.code" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="设备分类" prop="categoryId">
                                                <JNPFTreeSelect v-model="dataForm.categoryId" placeholder="请选择"
                                                    clearable :options="categoryIdOptions" :props="categoryIdProps">

                                                </JNPFTreeSelect>
                                            </el-form-item>
                                        </el-col>
                                        <!-- <el-col :span="12">
                      <el-form-item label="设备类型" prop="typeS">
                        <el-select v-model="dataForm.typeS" placeholder="请选择" :style='{"width":"100%"}'>
                          <el-option v-for="(item, index) in typeSOptions" :key="index" :label="item.fullName"
                            :value="item.enCode" :disabled="item.disabled"></el-option>

                        </el-select>
                      </el-form-item>
                    </el-col> -->
                                        <el-col :span="24">
                                            <el-form-item label="盒子ID" prop="uuid">
                                                <el-input v-model="dataForm.uuid" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="购置日期" prop="purchaseDate">
                                                <el-date-picker v-model="dataForm.purchaseDate" placeholder="请选择"
                                                    clearable :style='{"width":"100%"}' type="date" format="yyyy-MM-dd"
                                                    value-format="timestamp">

                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="启用日期" prop="effectiveDate">
                                                <el-date-picker v-model="dataForm.effectiveDate" placeholder="请选择"
                                                    clearable :style='{"width":"100%"}' type="date" format="yyyy-MM-dd"
                                                    value-format="timestamp">

                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <!--
                      <el-col :span="24">
                                          <el-form-item label="所属车间" prop="mrpWorkshopId">
                                            <popupTableSelect v-model="dataForm.mrpWorkshopId" placeholder="请选择" clearable
                                              field="mrpWorkshopId" interfaceId="339744098799848005"
                                              :columnOptions="mrpWorkshopIdcolumnOptions" propsValue="F_Id" relationField="name"
                                              popupType="popover" popupTitle="选择数据" popupWidth="800px">

                                            </popupTableSelect>
                                          </el-form-item>
                                        </el-col>
                                    -->
                                        <el-col :span="24">
                                            <el-form-item label="外径范围" required>
                                                <el-col :span="11">
                                                    <el-form-item prop="portraitMin">
                                                        <el-input v-model="dataForm.portraitMin" placeholder="请输入"
                                                            clearable>
                                                            <template slot="append">μm</template>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col class="line" :span="2">-</el-col>
                                                <el-col :span="11">
                                                    <el-form-item prop="portraitMax">
                                                        <el-input v-model="dataForm.portraitMax" placeholder="请输入"
                                                            clearable>
                                                            <template slot="append">μm</template>
                                                        </el-input>

                                                    </el-form-item>
                                                </el-col>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :span="24">
                                            <el-form-item label="宽度范围" required>
                                                <el-col :span="11">
                                                    <el-form-item prop="axialMin">
                                                        <el-input v-model="dataForm.axialMin" placeholder="请输入"
                                                            clearable>
                                                            <template slot="append">μm</template>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col class="line" :span="2">-</el-col>
                                                <el-col :span="11">
                                                    <el-form-item prop="axialMax">
                                                        <el-input v-model="dataForm.axialMax" placeholder="请输入"
                                                            clearable>
                                                            <template slot="append">μm</template>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-form-item>


                                        </el-col>

                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row :gutter="15">
                                        <el-col :span="24">
                                            <el-form-item prop="pic">
                                                <JNPF-UploadImg v-model="dataForm.pic" :fileSize="10" sizeUnit="MB"
                                                    :limit="1">

                                                </JNPF-UploadImg>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="说明" prop="note">
                                                <el-input v-model="dataForm.note" placeholder="请输入"
                                                    :style='{"width":"100%"}' true type="textarea"
                                                    :autosize='{"minRows":10,"maxRows":10}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>

                            </el-tab-pane>
                            <el-tab-pane label="出厂">
                                <el-col :span="12">
                                    <el-row :gutter="15">
                                        <el-col :span="24">
                                            <el-form-item label="制造日期" prop="productDate">
                                                <el-date-picker v-model="dataForm.productDate" placeholder="请选择"
                                                    clearable :style='{"width":"100%"}' type="date" format="yyyy-MM-dd"
                                                    value-format="timestamp">

                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="保修截至日期" prop="warrantyDate">
                                                <el-date-picker v-model="dataForm.warrantyDate" placeholder="请选择"
                                                    clearable :style='{"width":"100%"}' type="date" format="yyyy-MM-dd"
                                                    value-format="timestamp">

                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="品牌" prop="brank">
                                                <el-input v-model="dataForm.brank" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="重量" prop="weight">
                                                <el-input v-model="dataForm.weight" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>
                                                    <template slot="append">KG</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="额定电流" prop="electricCurrent">
                                                <el-input v-model="dataForm.electricCurrent" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>
                                                    <template slot="append">A</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="额定功率" prop="power">
                                                <el-input v-model="dataForm.power" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>
                                                    <template slot="append">W</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-col :span="24">
                                        <el-form-item label="理论节拍" prop="theoryBeat">
                                            <el-input v-model="dataForm.theoryBeat" placeholder="请输入" clearable
                                                :style='{"width":"100%"}'>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-col>
                                <el-col :span="12">
                                    <el-row :gutter="15">
                                        <el-col :span="24">
                                            <el-form-item label="生产厂家" prop="supplier">
                                                <el-input v-model="dataForm.supplier" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="成本" prop="cost">
                                                <el-input v-model="dataForm.cost" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>
                                                    <template slot="append">元</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="行业" prop="trade">
                                                <el-input v-model="dataForm.trade" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="用途" prop="usin">
                                                <el-input v-model="dataForm.usin" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>

                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="额定电压" prop="voltage">
                                                <el-input v-model="dataForm.voltage" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>
                                                    <template slot="append">V</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :span="24">
                                            <el-form-item label="使用年限" prop="serviceLife">
                                                <el-input v-model="dataForm.serviceLife" placeholder="请输入" clearable
                                                    :style='{"width":"100%"}'>
                                                    <template slot="append">年</template>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-tab-pane>
                            <el-tab-pane label="备件">
                                <el-col :span="24">
                                    <el-form-item label-width="0">
                                        <div class="JNPF-common-title">
                                            <h2></h2>
                                        </div>
                                        <el-table :data="dataForm.equipment_product_relList" size="mini">
                                            <el-table-column type="index" width="60" label="序号" align="center" />
                                            <el-table-column prop="productId" label="编号">
                                                <template slot-scope="scope">
                                                    <popupSelect v-model="scope.row.productId" placeholder="请选择"
                                                        clearable :field="'productId'+scope.$index"
                                                        interfaceId="340388223601609541"
                                                        :columnOptions="equipment_product_relproductIdcolumnOptions"
                                                        propsValue="F_Id" relationField="code" popupType="dialog"
                                                        popupTitle="选择数据" popupWidth="800px" @select="select">
                                                    </popupSelect>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="" label="名称">
                                                <template slot-scope="scope">
                                                    <popupAttr :relationField="'productId'+scope.$index"
                                                        showField="name">
                                                    </popupAttr>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="" label="规格">
                                                <template slot-scope="scope">
                                                    <popupAttr :relationField="'productId'+scope.$index"
                                                        showField="specification">
                                                    </popupAttr>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="qty" label="需求数量">
                                                <template slot-scope="scope">
                                                    <el-input v-model="scope.row.qty" placeholder="请输入" clearable
                                                        :style='{"width":"100%"}'>
                                                    </el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="" label="现有库存">
                                                <template slot-scope="scope">
                                                    <popupAttr :relationField="'productId'+scope.$index"
                                                        showField="repertory">
                                                    </popupAttr>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="note" label="备注">
                                                <template slot-scope="scope">
                                                    <el-input v-model="scope.row.note" placeholder="请输入" clearable
                                                        :style='{"width":"100%"}'>
                                                    </el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" width="60">
                                                <template slot-scope="scope">
                                                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                                        @click="delequipment_product_relList(scope.$index)">删除
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div class="table-actions" @click="addequipment_product_relList()">
                                            <el-button type="text" icon="el-icon-plus">添加</el-button>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-tab-pane>
                            <el-tab-pane label="保养">
                                <el-col :span="24">
                                    <el-form-item label-width="0">
                                        <div class="JNPF-common-title">
                                            <h2></h2>
                                        </div>
                                        <el-table :data="dataForm.equipment_task_generationList" size="mini">
                                            <el-table-column type="index" width="60" label="序号" align="center" />
                                            <el-table-column prop="equimentMaintainTypeId" label="内容">
                                                <template slot="header">
                                                    <span class="required-sign">*</span>内容
                                                </template>
                                                <template slot-scope="scope">
                                                    <popupSelect v-model="scope.row.equimentMaintainTypeId"
                                                        placeholder="请选择" clearable
                                                        :field="'equimentMaintainTypeId'+scope.$index"
                                                        interfaceId="340089684799522501" :columnOptions="baoyangOptions"
                                                        propsValue="F_Id" relationField="note" popupType="dialog"
                                                        popupTitle="选择数据" popupWidth="700px">
                                                    </popupSelect>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="frequency" label="频次">
                                                <template slot="header">
                                                    <span class="required-sign">*</span>频次
                                                </template>
                                                <template slot-scope="scope">
                                                    <el-input v-model="scope.row.frequency" placeholder="请输入" clearable
                                                        :style='{"width":"100%"}'>
                                                    </el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="frequencyType" label="频次类型">
                                                <template slot-scope="scope">
                                                    <el-select v-model="scope.row.frequencyType" placeholder="请选择"
                                                        :style='{"width":"100%"}'>
                                                        <el-option
                                                            v-for="(item, index) in equipment_task_generationfrequencyTypeOptions"
                                                            :key="index" :label="item.fullName" :value="item.id"
                                                            :disabled="item.disabled">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="lastTime" label="上次保养时间">
                                                <template slot-scope="scope">
                                                    <el-date-picker v-model="scope.row.lastTime" placeholder="请选择"
                                                        clearable :style='{"width":"100%"}' type="datetime"
                                                        format="yyyy-MM-dd HH:mm:ss" value-format="timestamp">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column>
                                            <!-- <el-table-column prop="type" label="类型">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.type" placeholder="请输入" clearable :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column> -->
                                            <el-table-column label="操作" width="60">
                                                <template slot-scope="scope">
                                                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                                        @click="delequipment_task_generationList(scope.$index)">删除
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div class="table-actions" @click="addequipment_task_generationList()">
                                            <el-button type="text" icon="el-icon-plus">添加</el-button>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-tab-pane>
                            <el-tab-pane label="点检">

                                <el-col :span="24">
                                    <el-form-item label-width="0">
                                        <div class="JNPF-common-title">
                                            <h2></h2>
                                        </div>
                                        <el-table :data="dataForm.v_equipment_task_generationList" size="mini">
                                            <el-table-column type="index" width="60" label="序号" align="center" />
                                            <el-table-column prop="equimentMaintainTypeId" label="内容">
                                                <template slot="header">
                                                    <span class="required-sign">*</span>内容
                                                </template>
                                                <template slot-scope="scope">
                                                    <popupSelect v-model="scope.row.equimentMaintainTypeId"
                                                        placeholder="请选择" clearable
                                                        :field="'equimentMaintainTypeId'+scope.$index"
                                                        interfaceId="341964890472190853"
                                                        :columnOptions="dianjianOptions" propsValue="F_Id"
                                                        relationField="note" popupType="dialog" popupTitle="选择数据"
                                                        popupWidth="600px">
                                                    </popupSelect>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="frequency" label="频次">
                                                <template slot="header">
                                                    <span class="required-sign">*</span>频次
                                                </template>
                                                <template slot-scope="scope">
                                                    <el-input v-model="scope.row.frequency" placeholder="请输入" clearable
                                                        :style='{"width":"100%"}'>
                                                    </el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="frequencyType" label="频次类型">
                                                <template slot-scope="scope">
                                                    <el-select v-model="scope.row.frequencyType" placeholder="请选择"
                                                        :style='{"width":"100%"}'>
                                                        <el-option
                                                            v-for="(item, index) in equipment_task_generationfrequencyTypeOptions"
                                                            :key="index" :label="item.fullName" :value="item.id"
                                                            :disabled="item.disabled">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="lastTime" label="上次保养时间">
                                                <template slot-scope="scope">
                                                    <el-date-picker v-model="scope.row.lastTime" placeholder="请选择"
                                                        clearable :style='{"width":"100%"}' type="datetime"
                                                        format="yyyy-MM-dd HH:mm:ss" value-format="timestamp">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column>
                                            <!-- <el-table-column prop="type" label="类型">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.type" placeholder="请输入" clearable :style='{"width":"100%"}'>
                          </el-input>
                        </template>
                      </el-table-column> -->
                                            <el-table-column label="操作" width="60">
                                                <template slot-scope="scope">
                                                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                                        @click="delv_equipment_task_generationList(scope.$index)">删除
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div class="table-actions" @click="addv_equipment_task_generationList()">
                                            <el-button type="text" icon="el-icon-plus">添加</el-button>
                                        </div>
                                    </el-form-item>
                                </el-col>

                            </el-tab-pane>
                            <el-tab-pane label="工序">
                            </el-tab-pane>
                            <el-tab-pane label="地图">
                                <el-col :span="12">
                                    <el-form-item label="生产车间" prop="mrpWorkshopId">
                                        <JNPFTreeSelect v-model="dataForm.mrpWorkshopId" placeholder="请选择" clearable
                                            :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps">

                                        </JNPFTreeSelect>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="生产产线" prop="productionLineId">
                                        <popupSelect v-model="dataForm.productionLineId" placeholder="请选择" clearable
                                            field="productionLineId" interfaceId="343363459485795781"
                                            :columnOptions="productionLineIdcolumnOptions" propsValue="F_Id"
                                            relationField="name" popupType="dialog" popupTitle="选择数据"
                                            popupWidth="800px">

                                        </popupSelect>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="长度" prop="length">
                                        <el-input v-model="dataForm.length" placeholder="请输入" clearable
                                            :style='{"width":"100%"}'>
                                            <template slot="append">mm</template>

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="X坐标" prop="axisX">
                                        <el-input v-model="dataForm.axisX" placeholder="请输入" clearable
                                            :style='{"width":"100%"}'>

                                        </el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="宽度" prop="width">
                                        <el-input v-model="dataForm.width" placeholder="请输入" clearable
                                            :style='{"width":"100%"}'>
                                            <template slot="append">mm</template>

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="Y坐标" prop="axisY">
                                        <el-input v-model="dataForm.axisY" placeholder="请输入" clearable
                                            :style='{"width":"100%"}'>

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="高度" prop="height">
                                        <el-input v-model="dataForm.height" placeholder="请输入" clearable
                                            :style='{"width":"100%"}'>
                                            <template slot="append">mm</template>

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="Z坐标" prop="axisZ">
                                        <el-input v-model="dataForm.axisZ" placeholder="请输入" clearable
                                            :style='{"width":"100%"}'>

                                        </el-input>
                                    </el-form-item>
                                </el-col>

                            </el-tab-pane>
                            <el-tab-pane label="附件">
                                <el-col :span="24">
                                    <el-form-item label="附件" prop="file">
                                        <JNPF-UploadFz v-model="dataForm.file" :fileSize="10" sizeUnit="MB" :limit="9"
                                            buttonText="点击上传">

                                        </JNPF-UploadFz>
                                    </el-form-item>
                                </el-col>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </template>
            </el-form>
            <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
                @select="addForSelect" @close="selectDialogVisible=false" />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false"> 取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    import request from '@/utils/request'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'

    // import popupSelect from './PopupSelect/index.vue'

    export default {
        // components: {
        //   popupSelect
        // },
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                btnLoading: false,
                selectDialogVisible: false,
                currTableConf: {},
                addTableConf: {
                    equipment_product_relList: {
                        'popupType': 'dialog',
                        'hasPage': true,
                        'popupTitle': '选择数据',
                        'pageSize': 20,
                        'columnOptions': [],
                        'interfaceId': '',
                        'interfaceName': '',
                        'relationOptions': [],
                        'templateJson': [],
                        'popupWidth': '800px'
                    },
                    equipment_task_generationList: {
                        'popupType': 'dialog',
                        'hasPage': true,
                        'popupTitle': '选择数据',
                        'pageSize': 20,
                        'columnOptions': [],
                        'interfaceId': '',
                        'interfaceName': '',
                        'relationOptions': [],
                        'templateJson': [],
                        'popupWidth': '800px'
                    }
                },
                tableRows: {
                    equipment_product_relList: {
                        productId: '',
                        qty: '',
                        note: '',
                        enabledmark: undefined
                    },
                    equipment_task_generationList: {
                        equimentMaintainTypeId: '',
                        frequency: '',
                        lastTime: '',
                        type: '',
                        enabledmark: undefined
                    }
                },
                currVmodel: '',
                dataForm: {
                    name: '',
                    code: '',
                    categoryId: '',
                    typeS: '',
                    uuid: '',
                    purchaseDate: '',
                    effectiveDate: '',
                    pic: [],
                    portraitMin: '',
                    portraitMax: '',
                    axialMin: '',
                    axialMax: '',
                    note: '',
                    active: 1,
                    productDate: '',
                    warrantyDate: '',
                    brank: '',
                    weight: '',
                    power: '',
                    voltage: '',
                    supplier: '',
                    cost: '',
                    trade: '',
                    usin: '',
                    electricCurrent: '',
                    serviceLife: '',
                    axisX: '',
                    axisY: '',
                    axisZ: '',
                    length: '',
                    width: '',
                    height: '',
                    mrpWorkshopId: '',
                    productionLineId: '',
                    file: [],
                    theoryBeat:'',
                    equipment_product_relList: [],
                    equipment_task_generationList: [],
                    v_equipment_task_generationList: []
                },
                activeabmqqm: '0',
                rules: {
                    name: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    code: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }],
                    categoryId: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }],
                    portraitMin: [],
                    portraitMax: [],
                    axialMin: [],
                    axialMax: []

                },
                categoryIdOptions: [],
                categoryIdProps: {
                    'label': 'name',
                    'value': 'id',
                    'children': 'children'
                },
                typeSOptions: [],

                mrpWorkshopIdcolumnOptions: [{
                    'label': '车间名称',
                    'value': 'name'
                }],
                productionLineIdcolumnOptions: [{
                    'label': '产线名称',
                    'value': 'name'
                }, {
                    'label': '描述',
                    'value': 'description'
                }],

                equipment_product_relproductIdcolumnOptions: [{
                    'label': '编号',
                    'value': 'code'
                }, {
                    'label': '名称',
                    'value': 'name'
                }, {
                    'label': '规格',
                    'value': 'specification'
                }, {
                    'label': '库存数量',
                    'value': 'repertory'
                }],
                baoyangOptions: [{
                    'label': '保养名称',
                    'value': 'name'
                }, {
                    'label': '保养内容',
                    'value': 'note'
                }],
                dianjianOptions: [{
                    'label': '点检名称',
                    'value': 'name'
                }, {
                    'label': '点检内容',
                    'value': 'note'
                }],
                equipment_task_generationfrequencyTypeOptions: [{
                    'fullName': '天数',
                    'id': '1'
                }, {
                    'fullName': '次数',
                    'id': '2'
                }],

                mrpWorkshopIdOptions: [],
                mrpWorkshopIdProps: {
                    "label": "name",
                    "value": "id",
                    "children": "children"
                },
            }
        },
        computed: {
            ...mapGetters(['newTimestamp']),
            powerChange() {
                return {
                    voltage: this.dataForm.voltage,
                    electricCurrent: this.dataForm.electricCurrent
                }
            }
        },
        watch: {
            powerChange(newValue, oldValue) {
                if (newValue.voltage != '' && newValue.electricCurrent != '') {
                    this.dataForm.power = parseFloat(newValue.voltage) * parseFloat(newValue.electricCurrent)
                } else {
                    this.dataForm.power = ''
                }

            }
        },
        created() {
            this.getcategoryIdOptions();
            this.gettypeSOptions();
            this.getmrpWorkshopIdOptions();
        },
        mounted() {},
        methods: {

            select(listValue) {
                console.log(listValue);
            },

            equipment_product_relExist() {
                let isOk = true
                for (let i = 0; i < this.dataForm.equipment_product_relList.length; i++) {
                    const e = this.dataForm.equipment_product_relList[i]
                }
                return isOk
            },
            equipment_task_generationExist() {
                let isOk = true
                for (let i = 0; i < this.dataForm.equipment_task_generationList.length; i++) {
                    const e = this.dataForm.equipment_task_generationList[i]
                    if (!e.equimentMaintainTypeId) {
                        this.$message({
                            message: '内容不能为空',
                            type: 'error',
                            duration: 1000
                        })
                        isOk = false
                        break
                    }
                    if (!e.frequency) {
                        this.$message({
                            message: '频次不能为空',
                            type: 'error',
                            duration: 1000
                        })
                        isOk = false
                        break
                    }
                }
                return isOk
            },
            getcategoryIdOptions() {
                let _query = {
                    paramList: [{
                        field: "parentId",
                        fieldName: "父ID",
                        dataType: "int",
                        required: 0,
                        defaultValue: -1
                    }, {
                        field: "type",
                        fieldName: "类型",
                        dataType: "varchar",
                        required: 0,
                        defaultValue: "生产设备"
                    }],
                    tenantId: "",
                    origin: "preview"
                }
                getDataInterfaceRes('339308611257762501', _query).then(res => {
                    let data = res.data
                    this.categoryIdOptions = data
                })
            },
            gettypeSOptions() {
                getDictionaryDataSelector('350188256479946181').then(res => {
                    this.typeSOptions = res.data.list
                })
            },
            getmrpWorkshopIdOptions() {
                getDataInterfaceRes('342715607101211205').then(res => {
                    let data = res.data
                    this.mrpWorkshopIdOptions = data
                })
            },

            clearData() {
                this.dataForm.name = ''
                this.dataForm.code = ''
                this.dataForm.categoryId = ''
                this.dataForm.typeS = 'CG'
                this.dataForm.uuid = ''
                this.dataForm.purchaseDate = this.newTimestamp
                this.dataForm.effectiveDate = this.newTimestamp
                this.dataForm.pic = []
                this.dataForm.portraitMin = ''
                this.dataForm.portraitMax = ''
                this.dataForm.axialMin = ''
                this.dataForm.axialMax = ''
                this.dataForm.note = ''
                this.dataForm.active = 1
                this.dataForm.productDate = ''
                this.dataForm.warrantyDate = ''
                this.dataForm.brank = ''
                this.dataForm.weight = ''
                this.dataForm.power = ''
                this.dataForm.voltage = ''
                this.dataForm.supplier = ''
                this.dataForm.cost = ''
                this.dataForm.trade = ''
                this.dataForm.usin = ''
                this.dataForm.electricCurrent = ''
                this.dataForm.serviceLife = ''
                this.dataForm.axisX = ''
                this.dataForm.axisY = ''
                this.dataForm.axisZ = ''
                this.dataForm.length = ''
                this.dataForm.width = ''
                this.dataForm.height = ''
                this.dataForm.mrpWorkshopId = ''
                this.dataForm.productionLineId = ''
                this.dataForm.file = []
                this.dataForm.theoryBeat = ''
                this.dataForm.equipment_product_relList = []
                this.dataForm.equipment_task_generationList = []
                this.dataForm.v_equipment_task_generationList = []
            },
            /**
             * 初始化参数
             * @param {Object} id
             */
            init(id) {
                this.dataForm.id = id || 0
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields()
                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/equipment/Equipment/' + this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    } else {
                        this.clearData()
                    }
                })
                this.$store.commit('generator/UPDATE_RELATION_DATA', {})
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['elForm'].validate((valid) => {
                    if (valid) {
                        if (!this.equipment_product_relExist()) return
                        if (!this.equipment_task_generationExist()) return
                        this.request()
                    }
                })
            },
            request() {
                this.btnLoading = true
                let _data = this.dataList()
                //数据修改
                _data.equipment_task_generationList = [
                    ..._data.equipment_task_generationList,
                    ..._data.v_equipment_task_generationList
                ]

                console.log(_data)
                if (!this.dataForm.id) {
                    request({
                        url: '/api/equipment/Equipment',
                        method: 'post',
                        data: _data
                    }).then((res) => {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.visible = false
                                this.btnLoading = false
                                this.$emit('refresh', true)
                            }
                        })
                    }).catch(() => {
                        this.btnLoading = false
                    })
                } else {
                    console.log('调用修改方法')
                    request({
                        url: '/api/equipment/Equipment/' + this.dataForm.id,
                        method: 'PUT',
                        data: _data
                    }).then((res) => {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.visible = false
                                this.btnLoading = false
                                this.$emit('refresh', true)
                            }
                        })
                    }).catch(() => {
                        this.btnLoading = false
                    })
                }
            },
            addequipment_product_relList() {
                let item = {
                    productId: '',
                    qty: undefined,
                    note: undefined
                }
                this.dataForm.equipment_product_relList.push(item)
            },
            delequipment_product_relList(index) {
                this.dataForm.equipment_product_relList.splice(index, 1)
            },
            /**
             * 添加备件记录
             */
            addequipment_task_generationList() {
                let item = {
                    equimentMaintainTypeId: '',
                    frequency: undefined,
                    frequencyType: undefined,
                    lastTime: undefined,
                    type: 1
                }
                this.dataForm.equipment_task_generationList.push(item)
            },
            delequipment_task_generationList(index) {
                this.dataForm.equipment_task_generationList.splice(index, 1)
            },

            /**
             * 添加点检记录
             */
            addv_equipment_task_generationList() {
                let item = {
                    equimentMaintainTypeId: '',
                    frequency: undefined,
                    frequencyType: undefined,
                    lastTime: undefined,
                    type: 2
                }
                this.dataForm.v_equipment_task_generationList.push(item)
            },
            delv_equipment_task_generationList(index) {
                this.dataForm.v_equipment_task_generationList.splice(index, 1)
            },

            openSelectDialog(key) {
                this.currTableConf = this.addTableConf[key]
                this.currVmodel = key
                this.selectDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.selectDialog.init()
                })
            },
            addForSelect(data) {
                for (let i = 0; i < data.length; i++) {
                    let item = {
                        ...this.tableRows[this.currVmodel],
                        ...data[i]
                    }
                    this.dataForm[this.currVmodel].push(item)
                }
            },
            dataList() {
                var _data = JSON.parse(JSON.stringify(this.dataForm))
                _data.pic = Array.isArray(_data.pic) ? JSON.stringify(_data.pic) : '[]'
                _data.file = Array.isArray(_data.file) ? JSON.stringify(_data.file) : '[]'
                for (let i = 0; i < _data.equipment_product_relList.length; i++) {
                    var _list = _data.equipment_product_relList[i]
                }
                for (let i = 0; i < _data.equipment_task_generationList.length; i++) {
                    var _list = _data.equipment_task_generationList[i]
                }
                return _data
            },
            dataInfo(dataAll) {
                let _dataAll = dataAll
                _dataAll.pic = _dataAll.pic ? JSON.parse(_dataAll.pic) : []
                _dataAll.file = _dataAll.file ? JSON.parse(_dataAll.file) : []
                for (let i = 0; i < _dataAll.equipment_product_relList.length; i++) {
                    var _list = _dataAll.equipment_product_relList[i]
                }

                _dataAll.v_equipment_task_generationList = []
                for (let i = 0; i < _dataAll.equipment_task_generationList.length; i++) {
                    var _list = _dataAll.equipment_task_generationList[i]
                    //处理得到的数据
                    if (_list.type == '2') {
                        _dataAll.v_equipment_task_generationList.push(_dataAll.equipment_task_generationList[i])
                        _dataAll.equipment_task_generationList.splice(i, 1)
                    }
                }
                console.log(_dataAll)
                this.dataForm = _dataAll
            },

            dialogClose() {
                this.activeabmqqm = '0'
            }

        }
    }
</script>
