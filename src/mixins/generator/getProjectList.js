import { getProjectList } from '@/api/system/projectManagement'
export default {
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
      this.projectIdData = res.data.records.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        }
      })
    },
  },
};
