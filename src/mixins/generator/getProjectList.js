import { getProjectList } from '@/api/system/projectManagement'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getProjectSwitch(code, type) {
      try {
        this.isProjectSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getProjectList() {
      let query = {
        pageNum: 1,
        pageSize: -1
      }
      const res = await getProjectList(query)
      // 包含通用项目下拉项
      this.projectIdData = res.data.records.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        }
      })
      // 不包含通用项目下拉项
      this.projectIdDataList = res.data.records.filter(item => item.id !== '1').map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        }
      })
    },
  },
};
