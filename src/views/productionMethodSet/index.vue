<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div style="overflow-x:auto;width:100%;height:100%">
          <div class="methodTitle">
              <div style="display:inline-block">
                <span>当前生产方式:</span><span style="color:#3fb9f8">{{ methodTitle }}</span>
              </div>
              <div class="btn">
                <el-button 
                 type="text" @click="allretract(true)">全部收起</el-button>
                <el-button 
                 type="text" @click="allretract(false)">全部展开</el-button>
              </div>
            </div>
          <div class="body">
           
            <div class="card-wrapper" v-loading="loading">
              <div class="box-card" v-for="item in list" :key="item.id">
                <el-card  :class="item.enableStatus === 'enable' ? 'enableColor' : ''" shadow="always">
                  <div slot="header" class="clearfix">
                    <span style="font-size:22px;">{{ item.name }}</span>
                    <el-tooltip effect="dark" content="展开" placement="top" style="float:right; padding: 3px 10px">
                      <el-link v-show="!item.showCon" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                        :underline="false" @click="toggleExpand(item)" />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="折叠" placement="top" style="float:right; padding: 3px 10px">
                      <el-link v-show="item.showCon" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                        :underline="false" @click="toggleExpand(item)" />
                    </el-tooltip>
                    <el-button :disabled="item.enableStatus === 'enable' ? true : false"
                      style="float: right; padding: 3px 0" type="text" @click="changeSet(item)">设置为当前生产方式</el-button>
                  </div>
                  <el-collapse-transition>
                    <div class="list-item" v-show="!item.showCon"  style="padding: 10px">
                      <div>
                        <el-image :src="define.comUrl + item.picPath"></el-image>
                      </div>
                      <div class="remark">
                        <span>{{ item.description }}</span>
                      </div>
                    </div>
                  </el-collapse-transition>
                </el-card>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProdMethodList, changeProdMethod } from "@/api/productionMethodSet/index.js";
export default {
  name: 'productionMethodSet',
  data() {
    return {
      list: [],
      loading: false,
      expands: true,
      methodTitle:"",
    }
  },
  created() {
    this.initData()
    
  },
  mounted () {
   setTimeout(() => {
    if(localStorage.getItem("methodFlag")){
      this.allretract(localStorage.getItem("methodFlag"))
    }
   }, 100);
  },
  methods: {
    allretract(flag){
      this.list.forEach(item=>{
          item.showCon=flag
        })
      this.$forceUpdate()
      localStorage.setItem("methodFlag",flag)
    },
    toggleExpand(item) {
      item.showCon = !item.showCon
    },
    initData() {
      this.loading = true;
      getProdMethodList().then(res => {
        this.list = res.data.map(item => {
          return {
            ...item,
            showCon: false
          }
        })
        console.log(this.list);
        
        
        this.loading = false
        this.methodTitle=this.list.filter(item => item.enableStatus === 'enable')[0].name
      }).catch(() => { this.loading = false })
    },
    changeSet(row) {
      this.$confirm('更改生产方式将影响整个业务流程，您确定设置当前生产方式吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeProdMethod(row.id).then(res => {
        if (res.msg === "Success") {
          this.$message.success('切换成功')
          this.initData()
        }
      }).catch(() => { })
      })
     
    },
  },

}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  .body {
    width: 1200px;
  }
}

.body {
  position: relative;
  padding-bottom: 16px;
  margin-top: 0;
  flex: 1;
}

.card-wrapper {
  width: 100%;
  display: grid;
  /*  行间距和列间距  */
  grid-gap: 10px;
  padding: 10px;
  padding-top:0;
  .box-card {
    // height: 400px;
    flex: 1;

    .list-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-image {
        width: 100%;
        height: 270px;
        object-fit: fill;
      }

      .remark {
        padding: 14px;
      }
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }
  }
}

.enableColor {
  box-shadow: 0 2px 12px 0 #67C23A !important;
}

  ::v-deep .el-card__body {
    padding: 0 !important;
  }
  .methodTitle{
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    margin: 10px 0;
    span{
      font-size:22px;
    }
  }
  .btn{
    height: 40px;
    line-height: 40px;
    display: inline-block;
    float: right;
    font-size: 22px;
    ::v-deep .el-button span{
      font-size:22px!important
    }
  }
</style>