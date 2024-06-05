<template>
  <div class="app-center JNPF-common-layout">
      <div v-for="(item,index) in list" :key="index"
          :style="{height:item.length*coeff+'px',width:item.width*coeff+'px',left:item.axisX*coeff+'px',top:item.axisY*coeff+'px', background:(item.result.boot?'#67C23A':(item.result.online?'#0BB04A':(item.result.warn?'#E6A23C':(item.result.error?'#f00':'#909399')))),
          'border-color':(item.result.boot?'#67C23A':(item.result.online?'#0BB04A':(item.result.warn?'#E6A23C':(item.result.error?'#f00':'#909399'))))}">
        <div>
          <div>{{item.name}}</div>
          <!-- <img :src="JSON.parse(item.pic)[0].url"/> -->
        </div>
      </div>
  </div>
</template>

<script>
  import {
    getListState
  } from '@/api/equipment'
  export default {
    data() {
      return {
        query: {
          categoryId: undefined,
          name: undefined,
        },
        listQuery: {
          superQueryJson: '',
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        list: [],
        coeff: 3


      };
    },
    mounted() {},
    created() {
      this.initData()
    },
    methods: {
      initData() {
        let _query = {
          ...this.listQuery,
          ...this.query,
          keyword: this.keyword,
          dataType: 0,
          menuId: this.menuId
        };
        getListState(_query).then(res => {
          this.list = res.data.list;
          let temp = 0;
          res.data.list.forEach(function(item, index) {
            if (temp < Number(item.axisX) + Number(item.width)) {
              temp = Number(item.axisX) + Number(item.width);
            }
          })
          let divWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          this.coeff = (divWidth - 240) / temp
        })
      }

    },
  };
</script>

<style scoped>
  .app-center{background: #EBEEF5;width: 100%;height: 100%;}
  .app-center>div {
    position: absolute;
    box-shadow: 5px 5px 5px gray;
    border:3px solid;
  }
  .app-center>div>div {
    background: white;
    width: 100%;
    height: 100%;
    /* color: white; */
    font-weight: bold;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px 0px 0px;
  }
  .app-center img{width: 80px;}

</style>
