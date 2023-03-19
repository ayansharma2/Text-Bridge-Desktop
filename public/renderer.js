const os = require("os")
const getmac = require('getmac')
window.getMac = getmac
window.hostName = os.hostname()
