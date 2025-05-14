import keyboardFocus from './keyboardFocus'

const install = function (Vue) {
    Vue.directive('keyboard-focus', keyboardFocus)
}

if (window.Vue) {
    window['keyboard-focus'] = keyboardFocus
    Vue.use(install); // eslint-disable-line
}

keyboardFocus.install = install
export default keyboardFocus
