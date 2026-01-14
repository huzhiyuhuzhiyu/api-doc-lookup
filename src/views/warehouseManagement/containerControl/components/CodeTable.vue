<template>
	<div>
		<div
			style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;margin-bottom:5px;">
			<h5>装箱条码</h5>
			<span class="text" style="position: absolute;top: 0;right: 30px;color: #1980ff;cursor: pointer;"
				@click.stop="printWithLodop(selectedData, morePrintData.packingType)">批量打印条码</span>
		</div>
		<div class="boxCode-table tableContainer">
			<div class="JNPF-common-layout-center JNPF-flex-main" v-if="morePrintData.packingType === 'single'">
				<el-table ref="dataTable" key="dataTable" v-loading="listLoading" :data="tableData" fixedNO
					@selection-change="handleSelectionChange" border>
					<el-table-column type="selection" width="45" align="center" fixed="left" />
					<el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
					<el-table-column prop="barCode" label="装箱条码" min-width="200" show-overflow-tooltip />
					<el-table-column prop="productsCode" label="产品编码" min-width="120" show-overflow-tooltip />
					<el-table-column prop="productsName" label="产品名称" min-width="120" show-overflow-tooltip />
					<el-table-column prop="drawingNo" label="型号" min-width="200" show-overflow-tooltip />
					<template v-if="showRoutingLine">
						<el-table-column prop="routingName" label="工艺路线名称" min-width="160" show-overflow-tooltip />
						<el-table-column prop="processName" label="工序名称" min-width="160" show-overflow-tooltip />
					</template>
					<el-table-column prop="totalNum" label="装箱数量" min-width="120" />
					<el-table-column prop="standardBoxName" label="包材" min-width="200" />
					<el-table-column prop="oddFlag" label="是否零头" min-width="120">
						<template slot-scope="scope">
							<div v-if="scope.row.oddFlag === 0">否</div>
							<div v-if="scope.row.oddFlag === 1">是</div>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div class="JNPF-common-layout-center JNPF-flex-main" v-if="morePrintData.packingType === 'mixed'">
				<el-table ref="mixedTable" key="mixedTable" v-loading="listLoading" :data="mixedTableData" fixedNO
					@selection-change="handleSelectionChange">
					<el-table-column type="selection" width="45" align="center" fixed="left" />
					<el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
					<el-table-column prop="barCode" label="装箱条码" fixed="left" min-width="200" />
					<el-table-column prop="standardBoxName" label="包材" min-width="200" />
					<el-table-column prop="oddFlag" label="是否零头" min-width="120">
						<template slot-scope="scope">
							<div v-if="scope.row.oddFlag === 0">否</div>
							<div v-if="scope.row.oddFlag === 1">是</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="120" fixed="right">
						<template slot-scope="scope">
							<el-button type="text" class="JNPF-table-delBtn" size="mini" v-if="btnType !== 'look'"
								@click="$emit('delth', scope.row, scope.$index)">删除</el-button>
							<el-button type="text" size="mini" @click="$emit('lookCode', scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

		</div>
		<el-dialog title="选择生产日期" :close-on-click-modal="false" :close-on-press-escape="false"
			:visible.sync="dateSelectVisable" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px" append-to-body>
			<el-row :gutter="20">
				<el-form label-width="120px" label-position="top">
					<el-col :span="24">
						<el-form-item label="生产日期">
							<el-date-picker v-model="productionDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
								:picker-options="global.timePicker" placeholder="请选择生产日期" style="width: 100%;">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dateSelectVisable = false">{{ $t('common.cancelButton') }}</el-button>
				<el-button type="primary" @click="dateSelectSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import barCodePrint from '@/views/warehouseManagement/containerControl/barcodeManagement/barCodePrint.js'
export default {
	props: {
		btnType: {
			default: 'add'
		},
		showRoutingLine: { // 展示工艺路线明细
			default: false
		},
		morePrintData: { // 打印补充数据
			required: true,
			default: () => { }
		},
		tableData: {
			type: Array,
			default: () => []
		},
		mixedTableData: {
			type: Array,
			default: () => []
		},
		listLoading: {
			default: false,
			type: Boolean
		},
		show: {}
	},
	data() {
		return {
			selectedData: [],

			productionDate: '',
			dateSelectVisable: false,
		}
	},
	watch: {
		show(val) {
			if (val) { // 样式缺陷修复
				if (this.morePrintData.packingType === 'single') {
					this.$refs.dataTable.doLayout()
				} else {
					this.$refs.mixedTable.doLayout()
				}
			}
		}
	},
	methods: {
		handleSelectionChange(data) {
			this.selectedData = data
		},
		//批量打印条码
		printWithLodop(row, type) {
			if (this.dateSelectVisable) this.dateSelectVisable = false
			else {
				if (this.selectedData.some(box => box.barcodeLines.some(row => box.documentType === 'purchase_receiving' && row.productCategoryCode == '6' && row.productType === 'pt003'))) {
					this.productionDate = this.jnpf.getToday()
					this.tempPrintData = this.selectedData // 暂存打印数据
					this.dateSelectVisable = true // 唤起日期选择框
					return
				}
			}
			const callBack = () => {
				this.$refs.dataTable && this.$refs.dataTable.clearSelection()
				this.$refs.mixedTable && this.$refs.mixedTable.clearSelection()
				this.selectedData = []
				this.$message.success('打印成功')
			}
			let printDataList = row.map(item => ({
				...item,
				...this.morePrintData,
				partnerCode: this.morePrintData.cooperativePartnerCode
			}))
			barCodePrint(printDataList, callBack, type)
		},
		// 日期选择框提交
		dateSelectSubmit() {
			// this.dateSelectVisable = false
			this.tempPrintData = this.tempPrintData.map(item => ({
				...item,
				productionDate: this.productionDate
			}))
			this.printWithLodop(this.tempPrintData)
			delete this.tempPrintData
		},
	}
}
</script>