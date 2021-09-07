<template>
	<view class="main">
		<view class="status-bar"></view>
		<!--  #ifdef  MP-WEIXIN -->
		<view class="volume-control mp-vlume-control"
			:style="{'height':`${pillButtonInfo.height}px`,'width':`${pillButtonInfo.left}px`}">
			<span class="volume-icon">
				<u-icon name="volume-up-fill" color="black" size="56"></u-icon>
			</span>
			<span class="volume-slider">
				<u-slider v-model="ringtoneVolume" @moving="volumeChange" block-width="30" inactive-color="black"
					active-color="black" block-color="black"></u-slider>
			</span>
		</view>
		<!--  #endif -->
		<!--  #ifdef  H5 || APP-PLUS -->
		<view class="volume-control">
			<span class="volume-icon">
				<u-icon name="volume-up-fill" color="black" size="56"></u-icon>
			</span>
			<span class="volume-slider">
				<u-slider v-model="ringtoneVolume" @moving="volumeChange" block-width="30" inactive-color="black"
					active-color="black" block-color="black"></u-slider>
			</span>
		</view>
		<!--  #endif -->


		<view class="timer">
			<view class="count-left">{{leftCycleTimes}}</view>
			<view class="pausedTimer">
				<view v-if="timerStatus === 'paused'">
					<view class="pausedTimer">{{$tools.secondsToString(pauseTime)}}</view>
				</view>
				<view v-else-if="timerStatus === 'running'">
					{{$tools.secondsToString(countDownLeftTime)}}
					<view style="display: none;">
						<u-count-down :timestamp="countDownLeftTime" :show-hours="true" font-size="120"
							bg-color="#19BE6B" separator-size="120" @change="timerChange" ref="timer"
							:show-border="false"></u-count-down>
					</view>

				</view>
			</view>

			<view class="timer-name">
				{{timerName}}
			</view>
		</view>

		<view class="button-group">
			<view class="left">
				<view @click="gotoIndexPage()">
					<u-icon name="close-circle-fill" size="120"></u-icon>
				</view>
			</view>
			<view class="right">
				<view v-if="timerStatus === 'paused'" @click="continueTimer()">
					<u-icon name="play-circle-fill" size="120"></u-icon>
				</view>
				<view v-else-if="timerStatus === 'running'" @click="pauseTimer()">
					<u-icon name="pause-circle-fill" size="120"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 铃声音频对象
				ringtoneAudio: {},
				// 铃声音量
				ringtoneVolume: 30,
				// 当前计时器
				currentTimer: {
					cycleTimes: 1,
					workTime: 0,
					resetTime: 0,
				},
				// 剩余循环次数
				leftCycleTimes: 0,
				// 计时器状态
				timerStatus: 'paused',
				// 工作时间
				workTime: 0,
				// 休息时间
				resetTime: 0,
				// 计时器剩余时间
				countDownLeftTime: 0,
				// 暂停时间
				pauseTime: 0,
				// 计时器标题
				timerName: '工作',
				// 胶囊按钮尺寸信息
				pillButtonInfo: {},
				// 定时器ID
				timerID:'',
			};
		},
		onLoad() {
			// console.clear()
			this.initTimer()
			// #ifdef  MP-WEIXIN
			this.pillButtonInfo = uni.getMenuButtonBoundingClientRect()
			// #endif
		},
		beforeDestroy() {
			this.ringtoneAudio.stop()
		},
		methods: {
			initTimer() {
				const {
					currentTimer: {
						cycleTimes,
						workTime,
						resetTime
					}
				} = uni.getStorageSync('interval-timer')

				if (workTime === 0 || resetTime === 0) {
					this.$u.toast('定时器时间不能为空')
					uni.navigateTo({
						url: 'index'
					})
				} else {
					this.leftCycleTimes = cycleTimes
					this.workTime = workTime
					this.resetTime = resetTime

					this.countDownLeftTime = workTime
					this.timerStatus = 'running'

					this.ringtoneAudio = uni.createInnerAudioContext()
					this.ringtoneAudio.src = "../static/high.mp3"
					this.ringtoneAudio.volume = (this.ringtoneVolume) / 100
					// #ifdef  MP-WEIXIN
					this.ringtoneAudio.src =
						"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6fec5402-1210-4b81-9949-97c1987784b9/9d7b1e3a-ac57-4f70-920c-1e1236c5a5ad.mp3"
					// #endif
					this.ringtoneAudio.autoplay = false
					this.ringtoneAudio.loop = true
				}
			},
			volumeChange() {
				this.ringtoneAudio.volume = (this.ringtoneVolume) / 100
			},
			pauseTimer() {
				this.ringtoneAudio.stop()
				this.pauseTime = this.countDownLeftTime
				this.countDownLeftTime = 0
				this.timerStatus = 'paused'
			},
			continueTimer() {
				this.countDownLeftTime = this.pauseTime
				this.timerStatus = 'running'
			},
			timerChange(e) {
				if (e < 0) {
					e = 0
				}
				
				this.countDownLeftTime = e

				if (e <= 5 && e > 0) {
					
					if(this.ringtoneAudio.paused){
						this.ringtoneAudio.play()
					}
				}
				if (e === 0) {
					this.ringtoneAudio.stop()					
					
					if (this.timerName === '工作') {
						this.timerName = '休息'
						this.countDownLeftTime = this.resetTime
					} else if (this.timerName === '休息') {
						this.leftCycleTimes--
						if (this.leftCycleTimes === 0) {
							this.gotoIndexPage()
						} else {
							this.timerName = '工作'
							this.countDownLeftTime = this.workTime
						}
					}
				}

			},
			gotoIndexPage() {
				this.countDownLeftTime = 0
				this.ringtoneAudio.stop()
				uni.navigateTo({
					url: 'index'
				})
			},
		}
	}
</script>

<style>
	page {
		max-width: 420px;
		margin: 0 auto;
		background-color: #19BE6B;
		height: 100%;
	}
</style>

<style lang="scss" scoped>
	.status-bar {
		background-color: #19BE6B;
		width: 100%;
		height: var(--status-bar-height);
	}

	.main {
		height: 100%;
		position: relative;
	}

	.volume-control {
		display: flex;
		align-items: center;

		/* #ifdef H5 || APP-PLUS */
		padding: 40rpx;

		/* #endif */
		.volume-icon {
			margin-right: 20rpx;
		}

		.volume-slider {
			width: 100%;
			background-color: green;
		}
	}

	.h5-volume-control {
		// margin-top: 40rpx;
		// width: 85%;
	}

	.mp-vlume-control {
		padding: 0 30rpx;
	}

	.timer {
		height: 75%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.count-left {
			font-size: 60px;
		}

		.timer-name {
			font-size: 50px;
		}
	}

	.button {
		position: absolute;
		right: 30px;
		bottom: 30px;
	}

	.button-group {
		position: absolute;
		bottom: 30px;
		width: 100%;

		display: flex;
		justify-content: space-around;
	}

	.pausedTimer {
		font-size: 120rpx;
	}

	[class^="u-countdown-colon"] {
		padding-left: 0;
	}
</style>
