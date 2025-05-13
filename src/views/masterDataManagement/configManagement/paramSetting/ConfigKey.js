   const configFiles = require.context('./configKey', true, /\.js$/)
console.log('object :>> ', configFiles.keys());
   const modules = configFiles.keys().reduce((modules, modulePath) => {
       const value = configFiles(modulePath)
       Object.assign(modules, value.default)
       return modules
   }, {})
   console.log(modules)
export default modules
