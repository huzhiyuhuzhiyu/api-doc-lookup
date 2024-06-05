/**重置message，防止重复点击重复弹出message弹框 */
import { Message } from 'element-ui'

let messageInstance = null;
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = options ? Message(options) : null
};
['error', 'success', 'info', 'warning', 'close'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options ? options.type = type : null
    return resetMessage(options)
  }
})
export const message = resetMessage