<template>
	<view>
		<view class="timer-setting">
			<view class="title">快速开始</view>
			<view class="number-box">

				<view class="group-name">组数</view>
				<u-number-box v-model="cycleTimes"></u-number-box>

				<view class="group-name">工作</view>
				<view @click="showTimePicker.work = true" class="timer-show">{{showTime.work}}</view>


				<view class="group-name">休息</view>
				<view @click="showTimePicker.reset = true" class="timer-show">{{ showTime.reset }}</view>

			</view>
			<u-button class="start-button" type="primary" @click="gotoTimer">
				<u-icon class="start-icon" name="hourglass" color="white" size="42"></u-icon>开始
			</u-button>
		</view>
		<!-- 不显示的内容 -->
		<!-- 工作时间选择器 -->
		<u-picker v-model="showTimePicker.work" mode="time" :params="timePickerParams" @confirm="confirmWorkTime" default-time="00:00:00">
		</u-picker>
		<!-- 休息时间选择器 -->
		<u-picker v-model="showTimePicker.reset" mode="time" :params="timePickerParams" @confirm="confirmResetTime" default-time="00:00:00">
		</u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 时间选择器参数
				timePickerParams: {
					hour: true,
					minute: true,
					second: true
				},
				// 是否显示时间选择器
				showTimePicker: {
					work: false,
					reset: false,
				},
				// 循环次数
				cycleTimes: 0,
				// 设定的时间
				time: {
					work: 0,
					reset: 0
				},
				// 展示的时间
				showTime:{
					work:'请设置工作时间',
					reset:'请设置休息时间',
				}

			};
		},
		methods: {
			gotoTimer() {
				if(this.cycleTimes === 0 ){
					this.$u.toast('循环次数不能为0')
				} else if(this.time.work === 0){
					this.$u.toast('工作时间不能为空')
				} else if(this.time.reset === 0){
					this.$u.toast('休息时间不能为空')
				} else {
					uni.navigateTo({
						url:"../timer/timer"
					})
				}
			},
			confirmWorkTime(e){
				const time = e.hour*1 + e.minute*1 + e.second*1
				if(time === 0){
					this.$u.toast('请设置有效的时间')
				}else{
					this.time.work = time
					this.showTime.work = `${e.hour} : ${e.minute} : ${e.second}`
				}
			},
			confirmResetTime(e){
				const time = e.hour*1 + e.minute*1 + e.second*1
				if(time === 0){
					this.$u.toast('请设置有效的时间')
				}else{
					this.time.reset = time
					this.showTime.reset = `${e.hour} : ${e.minute} : ${e.second}`
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $u-bg-color;
		max-width: 420px;
	}

	.timer-setting {
		background-color: white;
		margin: 15px;

		.title {
			font-size: 24px;
			font-weight: bold;
			padding: 15px;
		}

		.number-box {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	.group-name {
		padding-top: 20px;
		padding-bottom: 10px;
	}

	.start-button {
		margin-top: 30px;
		border-radius: 0;

		.start-icon {
			padding-right: 10px;
		}
	}

	.bottom-padding {
		height: 30px;
	}

	.timer-show {
		background-color: rgb(242, 243, 245);
		height: 30px;
		line-height: 30px;
		font-size: 15px;
		text-align: center;
		padding: 0 15px;
	}
</style>
