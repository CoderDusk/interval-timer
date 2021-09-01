<template>
	<view>
		<view class="status-bar"></view>
		<view class="timer-setting">
			<view class="title" :style="{'height':`${pillButtonInfo.height}px`}">快速开始</view>
			<view class="number-box">

				<view class="group-name">循环次数</view>
				<!-- <u-number-box v-model="cycleTimes" :min="1"></u-number-box> -->
				<u-input v-model="cycleTimes" type="number" input-align="center" border placeholder="请输入循环次数"></u-input>

				<view class="group-name">工作</view>
				<view @click="show.workTimePicker = true" class="timer-show">{{$tools.secondsToString(time.work)}}
				</view>


				<view class="group-name">休息</view>
				<view @click="show.reseTimetPicker = true" class="timer-show">{{ $tools.secondsToString(time.reset) }}
				</view>

			</view>

			<view class="action-button start-button" @click="startTimer()">
				<u-icon class="action-icon" name="hourglass" color="white" size="42"></u-icon>开始
			</view>

			<view class="action-button save-button" @click="saveTimer()">
				<u-icon class="action-icon" size="42" name="download"></u-icon>保存
			</view>
		</view>



		<view class="timer-list">
			<block v-for="(item,index) in timerList" :key="item.timestamp">
				<view class="timer-item" @click="readSavedTimer(item)" @longpress="handleLongPressTimerItem(index)">
					<view class="left">{{item.title}}</view>
					<view class="right">
						<view>循环：{{item.cycleTimes}}次</view>
						<view>工作时间：{{$tools.secondsToString(item.workTime)}}</view>
						<view>休息时间：{{$tools.secondsToString(item.resetTime)}}</view>
					</view>
				</view>
			</block>
		</view>


		<!-- 输入计时器标题的弹出层 -->
		<u-modal v-model="show.inputTimerTitleModal" @confirm="confirmInputTimerTitle()" title="计时器标题"
			show-cancel-button>
			<view class="timer-title-input">
				<u-input v-model="timerTitle" input-align="center" border placeholder="请输入计时器标题"></u-input>
			</view>

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
				pillButtonInfo:{},
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
					cycleTimesKeyboard: false,
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
			// #ifdef  MP-WEIXIN
			this.pillButtonInfo = uni.getMenuButtonBoundingClientRect()
			// #endif
		},
		methods: {
			// 判断两个计时器是否相等
			isTimerEqual(timer1, timer2) {
				let result = false

				if (timer1.cycleTimes === timer2.cycleTimes && timer1.workTime === timer2.workTime && timer1.resetTime ===
					timer2.resetTime && timer1.title === timer2.title) {
					result = true

				}
				return result
			},
			// 比较通过比较两个对象的指定属性的数值大小，比较两个对象的大小
			compareObjectByProperty(property) {
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
			},
			// 获取本地存储中的计时器
			getTimerStorage() {
				this.timerStorage = uni.getStorageSync('interval-timer')
				const {
					currentTimer,
					timerList
				} = this.timerStorage

				this.timerList = timerList.sort(this.compareObjectByProperty("timestamp"))

				if (currentTimer !== undefined) {
					this.cycleTimes = currentTimer.cycleTimes
					this.time.work = currentTimer.workTime
					this.time.reset = currentTimer.resetTime
				}
			},

			// 确认工作时间选择器
			confirmWorkTime(e) {
				const time = e.hour * 3600 + e.minute * 60 + e.second * 1
				if (time === 0) {
					this.$u.toast('请设置有效的时间')
				} else {
					this.time.work = time

				}
			},
			// 确认休息时间选择器
			confirmResetTime(e) {
				const time = e.hour * 3600 + e.minute * 60 + e.second * 1
				if (time === 0) {
					this.$u.toast('请设置有效的时间')
				} else {
					this.time.reset = time

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
				if (this.setCurrentTimer()) {
					uni.navigateTo({
						url: "timer"
					})
				}
			},
			// 保存计时器
			saveTimer() {
				if (this.setCurrentTimer()) {
					this.show.inputTimerTitleModal = true
				}
			},
			setCurrentTimer() {
				if (this.validateTimer()) {
					this.timerStorage.currentTimer = this.timer
					uni.setStorageSync('interval-timer', this.timerStorage)
					return true
				} else {
					this.$u.toast('当前计时器有误，请检查后再保存')
					return false
				}
			},
			// 确认输入计时器标题
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
					this.getTimerStorage()
				}

			},
			// 关闭输入计时器标题的对话框并清除标题值
			closeInputTimerTitle() {
				this.timerTitle = ''
				this.show.inputTimerTitleModal = false
			},
			// 读取一个当前已保存的计时器
			readSavedTimer(timer) {
				this.cycleTimes = timer.cycleTimes
				this.time.work = timer.workTime
				this.time.reset = timer.resetTime
			},
			handleLongPressTimerItem(index) {
				uni.showModal({
					title: '警告',
					content: '您确认要删除这个计时器吗',
					success: res => {
						if (res.confirm) {
							this.timerList.splice(index, 1)
							this.timerStorage.timerList = this.timerList
							uni.setStorageSync('interval-timer', this.timerStorage)
							this.getTimerStorage()
							this.$u.toast('删除成功')
						}
					}
				});
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
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $u-bg-color;
		max-width: 420px;
		margin: 0 auto;

		/* #ifdef H5 */
		padding: 30rpx;
		/* #endif */



	}
</style>

<style lang="scss" scoped>
	.status-bar {
		background-color: white;
		width: 100%;
		height: var(--status-bar-height);
	}

	.timer-setting {
		/* #ifdef MP-WEIXIN */
		// padding-top: 60rpx;
		/* #endif */
		background-color: white;

		.title {
			display: flex;
			align-items: center;
			font-size: 40rpx;
			font-weight: bold;
			
			/* #ifdef H5 || APP-PLUS */
			padding: 30rpx;
			/* #endif */
			
			/* #ifdef MP-WEIXIN */
			padding-left: 30rpx;
			/* #endif */
			
		}

		.number-box {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	.input-timer-title-area {
		background-color: pink;
	}

	.group-name {
		padding-top: 20px;
		padding-bottom: 10px;
	}

	.action-button {
		margin-top: 30px;
		display: flex;
		justify-content: center;
		padding: 20rpx;
		font-size: 30rpx;

		.action-icon {
			padding-right: 10px;
		}
	}

	.start-button {
		background-color: #2979ff;
		color: white;
	}

	.save-button {
		background-color: #ecf5ff;
		color: #2979ff;
		border: 1px solid #a0cfff;
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
