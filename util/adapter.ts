import {
  AbstractSDKRequest,
  IRequestOptions,
  IUploadRequestOptions,
  StorageInterface,
  WebSocketInterface,
  WebSocketContructor,
  SDKAdapterInterface,
  formatUrl
} from '@cloudbase/adapter-interface';

// isMatch函数判断当前平台是否匹配
function isMatch(): boolean {
  if (uni) return true;
  else return false;
}

// Request类为平台特有的网络请求，必须实现post/upload/download三个public接口
export class uniappRequest extends AbstractSDKRequest {
  // 实现post接口
  public post(options: IRequestOptions) {
    return new Promise((resolve, reject) => {
      try {
        const {
          url,
          data,
          headers
        } = options;
        uni.request({
          url: url,
          data: data,
          method: 'POST',
          header: headers,
          success: (res) => {
            resolve(res);
          },
          fail: function (err) {
            reject(err);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  // 实现upload接口
  public upload(options: IUploadRequestOptions) {
    return new Promise((resolve, reject) => {
      const { url, data, file, headers } = options;
      uni.uploadFile({
        url: url,
        header: headers,
        formData: data,
        filePath: file,
        name: 'file',
        success: (uploadFileRes) => {
          const result = {
            statusCode: uploadFileRes.statusCode,
            data: uploadFileRes.data || {}
          };
          resolve(result);
        }
      });
    });
  }
  // 实现download接口
  public download(options: IRequestOptions) {
    return new Promise((resolve, reject) => {
      const { url, headers } = options;
      uni.downloadFile({
        url: url,
        header: headers,
        success: (res) => {
          resolve(res);
        },
        fail: function (data, code) {
          reject(JSON.stringify({ data, code }));
        }
      });
    });
  }
}

// Storage为平台特有的本地存储，必须实现setItem/getItem/removeItem/clear四个接口
export const uniappStorage: StorageInterface = {
  setItem(key: string, value: any) {
    return uni.setStorageSync(key, value);
  },
  getItem(key: string): any {
    return uni.getStorageSync(key)
  },
  removeItem(key: string) {
    return uni.removeStorageSync(key);
  },
  clear() {
    return uni.clearStorageSync();
  }
};

// WebSocket为平台特有的WebSocket，与HTML5标准规范一致
export class uniappWebSocket {
  constructor(url: string, options: object = {}) {
    let uniws = uni.connectSocket({
      url,
      ...options,
      complete: () => { }
    });
    const socketTask: WebSocketInterface = {
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
      send: (data) => {
        return uniws.send({ data });
      },
      close: (code?: number, reason?: string) => {
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
}

// genAdapter函数创建adapter实体
function genAdapter() {
  const adapter: SDKAdapterInterface = {
    root: {},
    reqClass: uniappRequest,
    wsClass: uniappWebSocket as WebSocketContructor,
    localStorage: uniappStorage
  };
  return adapter;
}

const adapter = {
  genAdapter,
  isMatch,
  runtime: 'uniapp'
};

export default adapter;