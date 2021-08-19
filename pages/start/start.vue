<template>
	<view>
		<view class="timer-setting">
			<view class="title">快速开始</view>
			<view class="number-box">

				<view class="group-name">组数</view>
				<u-number-box v-model="count" @change="countChange"></u-number-box>

				<view class="group-name">工作</view>
				<view @click="showWork = true" class="timer-show" v-model="worktime">{{worktime}}</view>


				<view class="group-name">休息</view>
				<view @click="showReset = true" class="timer-show" v-model="resettime">{{resettime}}</view>

			</view>
			<u-button class="start-button" type="primary" @click="gotoTimer">
				<u-icon class="start-icon" name="hourglass" color="white" size="42"></u-icon>开始
			</u-button>
		</view>
		<!-- 不显示的内容 -->
		<!-- 工作时间选择器 -->
		<u-picker v-model="showWork" mode="time" :params="params" @confirm="confirmTimePicker" default-time="00:00:00">
		</u-picker>
		<!-- 休息时间选择器 -->
		<u-picker v-model="showReset" mode="time" :params="params" @confirm="resetchange" default-time="00:00:00">
		</u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count: 0,
				worktime: '请设置工作时间',
				resettime: '请设置休息时间',
				showWork: false,
				showReset: false,
				// showTimePicker:false,
				params: {
					hour: true,
					minute: true,
					second: true,
					timestamp: true
				},

				computedWorkTime: '60',
				computedResetTime: '60',

				// 时间选择器参数
				timePickerParams: {
					hour: true,
					minute: true,
					second: true,
					timestamp: true
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
				}

			};
		},
		methods: {
			gotoTimer() {
				this.$u.route({
					url: 'pages/timer/timer',
					params: {
						count: this.count,
						work: this.computedWorkTime,
						reset: this.computedResetTime
					}
				})
			},
			// showTimePicker(type){
			// 	if(type === 'work'){

			// 	}else if (type === 'reset'){

			// 	}
			// },
			confirmTimePicker(e) {
				console.log(e)
			},
			workchange(e) {
				this.worktime = e.minute + ' : ' + e.second
				this.computedWorkTime = (e.minute) * 60 + e.second * 1
			},
			resetchange(e) {
				this.resettime = e.minute + ' : ' + e.second
				this.computedResetTime = (e.minute) * 60 + e.second * 1
			}
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
		// width: 75%;
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
		// background-color: $u-type-primary;
		// color: white;
		height: 30px;
		line-height: 30px;
		font-size: 15px;
		text-align: center;
		padding: 0 15px;
	}
</style>
