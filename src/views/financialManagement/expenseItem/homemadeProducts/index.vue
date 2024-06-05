<template>
  <div class="main">
    <div class="JNPF-common-page-header">
      <div class="options">
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提 交</el-button>
        <el-button @click="goBack">重 置</el-button>
      </div>
    </div>
    <div class="transfer-layout">
      <div class="center">
        <div class="left-title">
          产品类别
        </div>
        <div class="list-content">
          <div v-for="(item, index) in productList" :key="index" class="contents" :ref="'productItem_' + `${index}`"
            @click="handeleProductInfoData(item, index, 'product')">
            <span>{{ item.productTypeName }}</span>
          </div>

        </div>
      </div>
      <div class="transferBtn">
        <el-button type="primary" @click="changeProducts">></el-button>
        <br>
        <el-button type="primary" @click="goProducts">< </el-button>
      </div>
      <div class="threeMain">
        <el-tabs v-model="activeName" @tab-click="handleClick" :tab-position="tabPosition"  style="height: 200px;" type="border-card">
          <el-tab-pane label="金工产品" name="metalwork">
            <div class="right">
              <div class="left-title">
                金工产品类别
              </div>
              <div class="list-content">
                <div v-for="(item, index) in metalworkList" :key="index" class="contents" :ref="'metalwork_' + `${index}`"
                  @click="handeleProductInfoData(item, index, 'metalwork')">
                  <span>{{ item.productTypeName }}</span>
                </div>
                <div class="noDataTip" v-if="metalworkList.length === 0">暂无数据</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="组装产品" name="assemble">
            <div class="right">
              <div class="left-title">
                组装产品类别
              </div>
              <div class="list-content">
                <div v-for="(item, index) in assembleList" :key="index" class="contents" :ref="'assemble_' + `${index}`"
                  @click="handeleProductInfoData(item, index, 'assemble')">
                  <span>{{ item.productTypeName }}</span>
                </div>
                <div class="noDataTip" v-if="assembleList.length === 0">暂无数据</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="总成产品" name="complete">
            <div class="right">
              <div class="left-title">
                总成产品类别
              </div>
              <div class="list-content">
                <div v-for="(item, index) in completeList" :key="index" class="contents" :ref="'complete_' + `${index}`"
                  @click="handeleProductInfoData(item, index, 'complete')">
                  <span>{{ item.productTypeName }}</span>
                </div>
                <div class="noDataTip" v-if="completeList.length === 0">暂无数据</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>



      <!-- <div class="left">
        <div class="left-title">
          总成产品类别
        </div>
        <div class="list-content">
          <div v-for="(item, index) in completeList" :key="index" class="contents" :ref="'complete_' + `${index}`"
            @click="handeleProductInfoData(item, index, 'complete')">
            <span>{{ item.productTypeName }}</span>
          </div>
          <div class="noDataTip" v-if="completeList.length === 0">暂无数据</div>
        </div>
      </div>

      <div class="transferBtn">
        <el-button type="primary" @click="changeComplete">></el-button>
        <br>
        <el-button type="primary" @click="goComplete"><</el-button>
      </div>

      <div class="center">
        <div class="left-title">
          产品类别
        </div>
        <div class="list-content">
          <div v-for="(item, index) in productList" :key="index" class="contents" :ref="'productItem_' + `${index}`"
            @click="handeleProductInfoData(item, index, 'product')">
            <span>{{ item.productTypeName }}</span>
          </div>

        </div>
      </div>

      <div class="transferBtn">
        <el-button type="primary" @click="gometalwork">></el-button>
        <br>
        <el-button type="primary" @click="backProduct"><</el-button>
      </div>
      <div class="right">
        <div class="left-title">
          金工产品类别
        </div>
        <div class="list-content">
          <div v-for="(item, index) in metalworkList" :key="index" class="contents" :ref="'metalwork_' + `${index}`"
            @click="handeleProductInfoData(item, index, 'metalwork')">
            <span>{{ item.productTypeName }}</span>
          </div>
          <div class="noDataTip" v-if="metalworkList.length === 0">暂无数据</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { bimProductTypeConfig, setProductTypeConfig } from '@/api/expenseItem/index'
export default {
  data() {
    return {
      listLoading: false,
      btnLoading: false,
      check: true,
      metalworkList: [],
      completeList: [],
      productList: [],
      assembleList: [],
      centerSelectData: [],
      leftSelectData: [],
      rightSelectData: [],
      flag: true,
      listQuery: {
        businessCode: "",
        id: null,
        productType: ""
      },
      type: '',
      activeName: 'metalwork',
      tabPosition:'left',
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 提交完成调接口
    requestData(data) {
      console.log(data, 'tij');
      setProductTypeConfig(data).then(res => {
        console.log(res);
        if (res.msg === 'Success') {
          this.$message.success('提交成功!')
          console.log(this.centerSelectData);
          this.type = ''
          this.leftSelectData = []
          this.rightSelectData = []
          this.centerSelectData.forEach((item, index) => {
            this.$refs['productItem_' + index][0].style.backgroundColor = '#fff'
          })
          this.getList()
          this.btnLoading = false
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 提交
    dataFormSubmit() {
      this.btnLoading = true
      let configs = []
      let _data
      if (!this.type) {
        this.btnLoading = false
        this.$message.error('请选择要配置的产品类别!')
      } else {

        if (this.type === 'complete') {
          this.completeList.forEach(item => {
            configs.push({
              businessCode: 'complete',
              productType: item.productType,
            })
          })
          if (this.metalworkList.length) {
            this.metalworkList.forEach(item => {
              configs.push({
                businessCode: item.businessCode,
                productType: item.productType,
              })
            })
          }
          if (this.assembleList.length) {
            this.assembleList.forEach(item => {
              configs.push({
                businessCode: item.businessCode,
                productType: item.productType,
              })
            })
          }
          _data = {
            configs: configs
          }
          // this.requestData(_data)
        }
        if (this.type === 'product') {
          this.completeList.forEach(item => {
            configs.push({
              businessCode: item.businessCode,
              productType: item.productType,
            })
          })
          this.metalworkList.forEach(item => {
            configs.push({
              businessCode: item.businessCode,
              productType: item.productType,
            })
          })
          if (this.assembleList.length) {
            this.assembleList.forEach(item => {
              configs.push({
                businessCode: item.businessCode,
                productType: item.productType,
              })
            })
          }
          _data = {
            configs: configs
          }
          // this.requestData(_data)
        }
        if (this.type === 'metalwork') {
          this.metalworkList.forEach(item => {
            configs.push({
              businessCode: 'metalworking',
              productType: item.productType,
            })
          })
          if (this.completeList.length) {
            this.completeList.forEach(item => {
              configs.push({
                businessCode: 'complete',
                productType: item.productType,
              })
            })
          }
          if (this.assembleList.length) {
            this.assembleList.forEach(item => {
              configs.push({
                businessCode: 'assemble',
                productType: item.productType,
              })
            })
          }
          _data = {
            configs: configs
          }
        }
        if (this.type === 'assemble') {
          this.assembleList.forEach(item => {
            configs.push({
              businessCode: 'assemble',
              productType: item.productType,
            })
          })
          if (this.completeList.length) {
            this.completeList.forEach(item => {
              configs.push({
                businessCode: 'complete',
                productType: item.productType,
              })
            })
          }
          this.metalworkList.forEach(item => {
            configs.push({
              businessCode: 'metalworking',
              productType: item.productType,
            })
          })

          _data = {
            configs: configs
          }
        }
        console.log(_data, 'canshu');
        this.requestData(_data)
      }

    },
    goBack() {
      this.centerSelectData = []
      this.getList()
    },
    async getData(typeArr, val, type, index) {
      console.log(typeArr, val, '数据数据', type);

      this.flag = true
      if (typeArr.length) {
        const ind = typeArr.indexOf(val);
        if (ind > -1) {
          console.log(1111);
          let isHas = true
          let detArr = typeArr.splice(ind, 1); // 从tableData中删除选中的行
          if (isHas) {
            // this.flag = await this.$confirm('已经选中该产品是否取消选中', '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
            //   console.log(type);
            //   this.$message({
            //     type: 'success',
            //     message: '取消成功!'
            //   });
            if (type === 'metalwork') {

              this.$refs['metalwork_' + index][0].style.backgroundColor = '#fff'
            }
            if (type === 'product') {
              this.$refs['productItem_' + index][0].style.backgroundColor = '#fff'
            }
            if (type === 'complete') {
              console.log(this.$refs);
              this.$refs['complete_' + index][0].style.backgroundColor = '#fff'
            }
            if (type === 'assemble') {
              console.log(this.$refs);
              this.$refs['assemble_' + index][0].style.backgroundColor = '#fff'
            }
            this.flag = false
            console.log(detArr, '取消后');
            console.log(typeArr, '取消后');
            // return false

            // }).catch(() => {
            //   this.$message({
            //     type: 'info',
            //     message: '已取消'
            //   });

            // });
          }
        }
      }
      if (this.flag) {
        typeArr.push(val)
      }
      typeArr = []
    },
    handeleProductInfoData(val, index, type) {
      console.log(val);
      if (type === 'metalwork') {
        this.$refs['metalwork_' + index][0].style.backgroundColor = '#F5F7FA'
        this.getData(this.rightSelectData, val, type, index)
      }
      if (type === 'product') {
        this.$refs['productItem_' + index][0].style.backgroundColor = '#F5F7FA'
        this.getData(this.centerSelectData, val, type, index)
      }
      if (type === 'complete') {
        this.$refs['complete_' + index][0].style.backgroundColor = '#F5F7FA'
        this.getData(this.rightSelectData, val, type, index)
      }
      if (type === 'assemble') {
        this.$refs['assemble_' + index][0].style.backgroundColor = '#F5F7FA'
        this.getData(this.rightSelectData, val, type, index)
      }

    },

    // 获取列表数据 
    getList() {
      bimProductTypeConfig().then(res => {
        console.log(res, '1111');
        this.productList = res.data.filter(item => item.businessCode !== "metalworking" && item.businessCode !== "complete" && item.businessCode !== "assemble");
        this.metalworkList = res.data.filter(item => item.businessCode === "metalworking");
        this.completeList = res.data.filter(item => item.businessCode === "complete");
        this.assembleList = res.data.filter(item => item.businessCode === "assemble");
      })
    },
    handleClick(tab, event) {
      console.log(tab);
      // this.centerSelectData = []
      this.activeName = tab.name
    },
    // 产品类别 分别穿梭到对应的产品
    changeProducts() {
      if (this.centerSelectData.length) {
        this.type = this.activeName
        if (this.activeName === 'complete') {
          this.completeList = [...this.completeList, ...this.centerSelectData]
          for (let i = 0; i < this.completeList.length; i++) {
            const row = this.completeList[i];
            const index = this.productList.indexOf(row);
            if (index > -1) {
              this.$refs['productItem_' + index][0].style.backgroundColor = '#fff'
              this.productList.splice(index, 1); // 从tableData中删除选中的行
              this.productList.forEach((item, ind) => {
                this.$refs['productItem_' + ind][0].style.backgroundColor = '#fff'
              })
            }
          }
          this.centerSelectData = []
        }
        if (this.activeName === 'metalwork') {
          this.metalworkList = [...this.metalworkList, ...this.centerSelectData]
          for (let i = 0; i < this.metalworkList.length; i++) {
            const row = this.metalworkList[i];
            const index = this.productList.indexOf(row);
            if (index > -1) {
              this.$refs['productItem_' + index][0].style.backgroundColor = '#fff'
              this.productList.splice(index, 1); // 从tableData中删除选中的行
              this.productList.forEach((item, ind) => {
                this.$refs['productItem_' + ind][0].style.backgroundColor = '#fff'
              })
            }
          }
          this.centerSelectData = []
        }
        if (this.activeName === 'assemble') {
          this.assembleList = [...this.assembleList, ...this.centerSelectData]
          for (let i = 0; i < this.assembleList.length; i++) {
            const row = this.assembleList[i];
            const index = this.productList.indexOf(row);
            if (index > -1) {
              this.$refs['productItem_' + index][0].style.backgroundColor = '#fff'
              this.productList.splice(index, 1); // 从tableData中删除选中的行
              this.productList.forEach((item, ind) => {
                this.$refs['productItem_' + ind][0].style.backgroundColor = '#fff'
              })
            }
          }
          this.centerSelectData = []
        }
      } else {
        this.$message.error(`请先选择产品类别!`)
      }
    },
    // 金工等 回产品
    goProducts() {
      // 金工
      if (this.activeName === 'metalwork') {
        if (this.metalworkList.length && this.rightSelectData.length) {
          console.log(this.rightSelectData, '1111');
          this.type = 'product'
          for (let i = 0; i < this.rightSelectData.length; i++) {
            const row = this.rightSelectData[i];
            const index = this.metalworkList.indexOf(row);
            if (index > -1) {
              this.metalworkList.splice(index, 1); // 从tableData中删除选中的行
              this.productList.push(row)
              this.metalworkList.forEach((item, ind) => {
                this.$refs['metalwork_' + ind][0].style.backgroundColor = '#fff'
              })
            }
          }
        } else {
          this.$message.error('请先选择金工产品!')
        }
      }
      // 总成
      if (this.activeName === 'complete') {
        if (this.completeList.length && this.rightSelectData.length) {
          this.type = 'product'
          for (let i = 0; i < this.rightSelectData.length; i++) {
            const row = this.rightSelectData[i];
            const index = this.completeList.indexOf(row);
            if (index > -1) {
              this.$refs['complete_' + index][0].style.backgroundColor = '#fff'
              this.completeList.splice(index, 1); // 从tableData中删除选中的行
              this.productList.push(row)
            }
          }
        } else {
          this.$message.error('请先选择总成产品!')
        }
      }
      // 组装
      if (this.activeName === 'assemble') {
        if (this.assembleList.length && this.rightSelectData.length) {
          this.type = 'product'
          for (let i = 0; i < this.rightSelectData.length; i++) {
            const row = this.rightSelectData[i];
            const index = this.assembleList.indexOf(row);
            if (index > -1) {
              this.$refs['assemble_' + index][0].style.backgroundColor = '#fff'
              this.assembleList.splice(index, 1); // 从tableData中删除选中的行
              this.productList.push(row)
            }
          }
        } else {
          this.$message.error('请先选择组装产品!')
        }
      }
    },
  }
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.transfer-layout {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  background: #fff;
  overflow: hidden;
  margin-top: 5px;
}

.left,
.center,
.right {
  width: 40%;
  height: 100%;
  // margin: 0px 10px 10px 10px;
  /* background: #2b63e7; */
  border: 1px solid #ebeef5;
  box-sizing: border-box;

  .left-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding: 20px 30px;
    border-bottom: 1px solid #ebeef5;
  }

  .list-content {
    // padding: 10px;
    width: 100%;
    height: 70vh;
    overflow: auto;
    box-sizing: border-box;
    cursor: pointer;

    .contents {
      width: 100%;
      padding: 10px 0px 10px 15px;
      border-bottom: 1px solid #ebeef5;
    }
  }

}

.threeMain {
  width: 60%;
  height: 100%;

  .right {
    width: 100%;

  }
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tab-pane {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  height: 100% !important;
}
::v-deep .el-tabs__header{
  margin-right:0px!important;
}
::v-deep .el-tabs__content{
  padding:0px!important;
}
::v-deep .el-tabs__nav{
  margin-top:62px!important;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
  width: 100%;
  height: 47px;
  box-sizing: border-box;
  background: #fff;
}

.noDataTip {
  text-align: center;
  padding: 10%;
  color: #aaa;
}




.transferBtn {
  width: 7%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 在交叉轴上居中 */
  // justify-content: center;
  margin-top: 8vh;
  /* 在主轴上居中 */
}
</style>