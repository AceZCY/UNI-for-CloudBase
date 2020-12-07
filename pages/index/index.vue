<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import cloudbase from '@cloudbase/js-sdk'
	export default {
		data() {
			return {
				title: '登录中'
			}
		},
		onLoad() {
			cloudbase.auth().anonymousAuthProvider().signIn().then(res => {
				this.title = '匿名登录成功'
				this.call()
			}).catch(err => {
				console.error(err)
			})
		},
		methods: {
			call: function() {
				cloudbase.callFunction({
					name: "test",
					data: {
						a: 1
					}
				}).then((res) => {
					console.log(res)
				});
			},
			database: function() {
				cloudbase.database().collection('test').get().then(res => {
					console.log(res)
				})
			},
			socket: function() {
				let ref = cloudbase.database().collection('test').where({}).watch({
					onChange: (snapshot) => {
						console.log("收到snapshot", snapshot);
					},
					onError: (error) => {
						console.log("收到error", error);
					}
				});
			},
			upload: function() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						console.log(res.tempFilePaths[0])
						cloudbase.uploadFile({
							cloudPath: "test-admin.png",
							filePath: res.tempFilePaths[0],
							onUploadProgress: function(progressEvent) {
								console.log(progressEvent);
								var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
							}
						}).then((result) => {
							console.log(result)
						});
					}
				});
			},
			download: function() {
				cloudbase.downloadFile({
					fileID: "cloud://demo-env-1293829/test-admin.png"
				}).then((res) => {
					console.log(res)
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
