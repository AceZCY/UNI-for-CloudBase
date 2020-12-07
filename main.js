import Vue from 'vue'
import App from './App'
import cloudbase from '@cloudbase/js-sdk'
import adapter from 'util/adapter.js'

cloudbase.useAdapters(adapter);

cloudbase.init({
	env: '',//云开发环境ID
	appSign: '',//凭证描述
	appSecret: {
		appAccessKeyId: 1,//凭证版本
		appAccessKey: ''//凭证
	}
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
