"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var adapter_interface_1 = require("@cloudbase/adapter-interface");
// isMatch函数判断当前平台是否匹配
function isMatch() {
    if (uni)
        return true;
    else
        return false;
}
// Request类为平台特有的网络请求，必须实现post/upload/download三个public接口
var uniappRequest = /** @class */ (function (_super) {
    __extends(uniappRequest, _super);
    function uniappRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 实现post接口
    uniappRequest.prototype.post = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var url = options.url, data = options.data, headers = options.headers;
                uni.request({
                    url: url,
                    data: data,
                    method: 'POST',
                    header: headers,
                    success: function (res) {
                        resolve(res);
                    },
                    fail: function (err) {
                        reject(err);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    // 实现upload接口
    uniappRequest.prototype.upload = function (options) {
        return new Promise(function (resolve, reject) {
            var url = options.url, data = options.data, file = options.file, headers = options.headers;
            uni.uploadFile({
                url: url,
                header: headers,
                formData: data,
                filePath: file,
                name: 'file',
                success: function (uploadFileRes) {
                    var result = {
                        statusCode: uploadFileRes.statusCode,
                        data: uploadFileRes.data || {}
                    };
                    resolve(result);
                }
            });
        });
    };
    // 实现download接口
    uniappRequest.prototype.download = function (options) {
        return new Promise(function (resolve, reject) {
            var url = options.url, headers = options.headers;
            uni.downloadFile({
                url: url,
                header: headers,
                success: function (res) {
                    resolve(res);
                },
                fail: function (data, code) {
                    reject(JSON.stringify({ data: data, code: code }));
                }
            });
        });
    };
    return uniappRequest;
}(adapter_interface_1.AbstractSDKRequest));
exports.uniappRequest = uniappRequest;
// Storage为平台特有的本地存储，必须实现setItem/getItem/removeItem/clear四个接口
exports.uniappStorage = {
    setItem: function (key, value) {
        return uni.setStorageSync(key, value);
    },
    getItem: function (key) {
        return uni.getStorageSync(key);
    },
    removeItem: function (key) {
        return uni.removeStorageSync(key);
    },
    clear: function () {
        return uni.clearStorageSync();
    }
};
// WebSocket为平台特有的WebSocket，与HTML5标准规范一致
var uniappWebSocket = /** @class */ (function () {
    function uniappWebSocket(url, options) {
        if (options === void 0) { options = {}; }
        var uniws = uni.connectSocket(__assign({ url: url }, options, { complete: function () { } }));
        var socketTask = {
            set onopen(cb) {
                uniws.onOpen(cb);
            },
            set onmessage(cb) {
                uniws.onMessage(cb);
            },
            set onclose(cb) {
                uniws.onClose(cb);
            },
            set onerror(cb) {
                uniws.onError(cb);
            },
            send: function (data) {
                return uniws.send({ data: data });
            },
            close: function (code, reason) {
                return uniws.close({
                    code: code,
                    reason: reason
                });
            },
            get readyState() {
                return uniws.readyState;
            },
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        };
        return socketTask;
    }
    return uniappWebSocket;
}());
exports.uniappWebSocket = uniappWebSocket;
// genAdapter函数创建adapter实体
function genAdapter() {
    var adapter = {
        root: {},
        reqClass: uniappRequest,
        wsClass: uniappWebSocket,
        localStorage: exports.uniappStorage
    };
    return adapter;
}
var adapter = {
    genAdapter: genAdapter,
    isMatch: isMatch,
    // runtime为标记平台唯一性的说明
    runtime: 'uniapp'
};
exports["default"] = adapter;
