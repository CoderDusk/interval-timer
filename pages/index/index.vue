<template>
	<view>
		<view class="timer-setting">
			<view class="title">快速开始</view>
			<view class="number-box">

				<view class="group-name">循环次数</view>
				<u-number-box v-model="cycleTimes" :min="1"></u-number-box>

				<view class="group-name">工作</view>
				<view @click="show.workTimePicker = true" class="timer-show">{{showTime.work}}</view>


				<view class="group-name">休息</view>
				<view @click="show.reseTimetPicker = true" class="timer-show">{{ showTime.reset }}</view>

			</view>
			<u-button class="start-button" type="primary" @click="startTimer">
				<u-icon class="start-icon" name="hourglass" color="white" size="42"></u-icon>开始
			</u-button>

			<u-button class="start-button" type="primary" plain @click="saveTimer()">
				<u-icon class="start-icon" size="42" name="download"></u-icon>保存
			</u-button>
		</view>



		<view class="timer-list">
			<block v-for="item in timerList" :key="item.timestamp">
				<view class="timer-item" @click="readTimer(item)">
					<view class="left">{{item.title}}</view>
					<view class="right">
						<view>循环：{{item.cycleTimes}}次</view>
						<view>工作时间：{{secondsToString(item.workTime)}}</view>
						<view>休息时间：{{secondsToString(item.resetTime)}}</view>
					</view>
				</view>
			</block>
		</view>


		<!-- 输入计时器标题的弹出层 -->
		<u-modal v-model="show.inputTimerTitleModal" @confirm="confirmInputTimerTitle()" title="计时器标题"
			show-cancel-button>
			<u-input placeholder="请输入计时器标题" v-model="timerTitle" placeholder-style="padding-left:20rpx;" trim
				class="timer-title-input" :clearable="false" spellcheck="false"></u-input>
		</u-modal>

		<!-- 不显示的内容 -->
		<!-- 工作时间选择器 -->
		<u-picker v-model="show.workTimePicker" mode="time" :params="timePickerParams" @confirm="confirmWorkTime"
			default-time="00:00:00">
		</u-picker>
		<!-- 休息时间选择器 -->
		<u-picker v-model="show.reseTimetPicker" mode="time" :params="timePickerParams" @confirm="confirmResetTime"
			default-time="00:00:00">
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
				// 是否显示时间选择器、输入计时器标题对话框
				show: {
					workTimePicker: false,
					reseTimetPicker: false,
					inputTimerTitleModal: false,
				},
				// 循环次数
				cycleTimes: 1,
				// 设定的时间
				time: {
					work: 0,
					reset: 0
				},
				// 本地存储中的计时器应用相关数据
				timerStorage: {},
				// 定时器标题
				timerTitle: '',
				// 定时器列表
				timerList: []
			};
		},
		onLoad() {
			this.getTimerStorage()

			if (this.timerStorage.currentTimer !== undefined) {
				const timer = this.timerStorage.currentTimer
				this.cycleTimes = timer.cycleTimes
				this.time.work = timer.workTime
				this.time.reset = timer.resetTime
			}
		},
		methods: {
			isTimerEqual(timer1, timer2) {
				let result = false

				if (timer1.cycleTimes === timer2.cycleTimes && timer1.workTime === timer2.workTime && timer1.resetTime ===
					timer2.resetTime && timer1.title === timer2.title) {
					result = true

				}
				return result
			},
			getTimerStorage() {
				this.timerStorage = uni.getStorageSync('interval-timer')
				this.timerList = this.timerStorage.timerList

				function compare(property) {
					return function(obj1, obj2) {
						let value1 = obj1[property];
						let value2 = obj2[property];
						
						if (value1 > value2) {
							return -1;
						}
						if (value1 < value2) {
							return 1;
						}
						return 0;
					};
				}
				
				this.timerList = this.timerList.sort(compare("timestamp"))
			},
			secondsToString(seconds) {
				let h = (seconds / 3600) < 10 ? '0' + parseInt(seconds / 3600) : parseInt(seconds / 3600)
				let m = parseInt(seconds / 60) >= 60 ? parseInt(seconds / 60) % 60 : parseInt(seconds / 60)
				m = m < 10 ? '0' + m : m
				let s = (seconds % 60) < 10 ? '0' + parseInt(seconds % 60) : parseInt(seconds % 60)

				return h + ':' + m + ':' + s
			},
			// 确认工作时间选择器
			confirmWorkTime(e) {
				const time = e.hour * 3600 + e.minute * 60 + e.second * 1
				if (time === 0) {
					this.$u.toast('请设置有效的时间')
				} else {
					this.time.work = time
					this.showTime.work = `${e.hour} : ${e.minute} : ${e.second}`
				}
			},
			// 确认休息时间选择器
			confirmResetTime(e) {
				const time = e.hour * 3600 + e.minute * 60 + e.second * 1
				if (time === 0) {
					this.$u.toast('请设置有效的时间')
				} else {
					this.time.reset = time
					this.showTime.reset = `${e.hour} : ${e.minute} : ${e.second}`
				}
			},
			// 验证计时器
			validateTimer() {
				if (this.cycleTimes === 0) {
					this.$u.toast('循环次数不能为0')
					return false
				} else if (this.time.work === 0) {
					this.$u.toast('工作时间不能为空')
					return false
				} else if (this.time.reset === 0) {
					this.$u.toast('休息时间不能为空')
					return false
				} else {
					return true
				}
			},
			// 开始计时器
			startTimer() {
				if (this.validateTimer()) {
					uni.navigateTo({
						url: "../timer/timer"
					})
				}
			},
			saveTimer() {
				if (this.validateTimer()) {
					let intervalTimer = uni.getStorageSync('interval-timer')
					intervalTimer.currentTimer = this.timer
					uni.setStorageSync('interval-timer', intervalTimer)

					this.show.inputTimerTitleModal = true
				}

			},
			confirmInputTimerTitle() {
				if (this.timerTitle.trim() === '') {
					this.$u.toast('计时器标题不能为空')
				} else {
					const timerObj = {
						title: this.timerTitle,
						timestamp: new Date().getTime(),
						cycleTimes: this.cycleTimes,
						workTime: this.time.work,
						resetTime: this.time.reset
					}

					let intervalTimerStorage = uni.getStorageSync('interval-timer')
					let timerList = intervalTimerStorage.timerList
					if (timerList == undefined) {
						timerList = []
					}
					let isExisted = false


					timerList.forEach(item => {
						if (this.isTimerEqual(item, timerObj)) {
							isExisted = true
						}
					})

					if (isExisted) {
						this.$u.toast('这个计时器已经存在，无需重复保存')
						return
					} else {
						timerList.push(timerObj)
						intervalTimerStorage.timerList = timerList
						uni.setStorageSync('interval-timer', intervalTimerStorage)
						this.$u.toast('保存成功')
					}

					this.closeInputTimerTitle()
				}

			},
			closeInputTimerTitle() {
				this.timerTitle = ''
				this.show.inputTimerTitleModal = false
			},
			readSavedTimer(timer){
				console.log(timer)
				this.cycleTimes = timer.cycleTimes
				this.time.work = timer.workTime
				this.time.reset = timer.resetTime
			},
			setCurrentTimer(){
				
			},

		},
		computed: {
			timer() {
				return {
					cycleTimes: this.cycleTimes,
					workTime: this.time.work,
					resetTime: this.time.reset,
				}
			},
			showTime() {
				return {
					work: this.time.work === 0 ? '请设置工作时间' : this.secondsToString(this.time.work),
					reset: this.time.reset === 0 ? '请设置休息时间' : this.secondsToString(this.time.reset)
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $u-bg-color;
		max-width: 420px;
		margin: 0 auto;
		padding: 30rpx;
	}

	.timer-setting {
		background-color: white;

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

	.timer-title-input {
		margin: 20rpx 30rpx;
		border: 1px solid gray;
		border-radius: 10rpx;
		padding-left: 20rpx;

		/deep/ .uni-input-input {
			padding-left: 20rpx;
		}
	}

	.timer-list {
		margin-top: 40rpx;

		.timer-item {
			background-color: white;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 30rpx;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			
			.left {
				font-size: 36rpx;
				font-weight: bold;
			}
		}

		
	}
</style>
