   const configFiles = require.context('./configKey', true, /\.js$/)

   const modules = configFiles.keys().reduce((modules, modulePath) => {
       const value = configFiles(modulePath)
       Object.assign(modules, value.default)
       return modules
   }, {})
export default modules
