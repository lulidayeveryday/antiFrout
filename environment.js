(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.__ce = factory())
})(this, (function () {
  //测试
  const urls = `http://10.93.57.250:18082`
//正式
// const urls = `http://130.84.201.71:18082`
  return {
    _: {},
    debug: true,
    baseURL: urls// 接口地址
  }
}));
