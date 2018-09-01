
let pssId = wx.getStorageSync('ss_id');
if (!Promise.prototype.fail) Promise.prototype.fail = Promise.prototype.catch;

function setSessionId(sessionId) {
  pssId = sessionId;
  wx.setStorageSync('ss_id', sessionId);
}

function getSessionId() {
  return wx.getStorageSync('ss_id');
}


module.exports = {
  setSessionId,
  getSessionId,
  
};