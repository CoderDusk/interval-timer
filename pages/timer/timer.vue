<template>
	<view class="main">
		<view class="volume-control">
			<u-row>
				<u-col span="2">
					<u-icon name="volume-up-fill" color="black" size="56"></u-icon>
				</u-col>
				<u-col span="10">
					<u-slider v-model="ringtoneVolume" @moving="volumeChange" block-width="30" class="volume-slider" inactive-color="black" active-color="black" block-color="black"></u-slider>
				</u-col>
			</u-row>
		</view>
		
		<view class="timer">
			<view class="count-left">{{count}}</view>
			<view class="pausedTimer">
				<view v-if="isPaused">
					<view class="pausedTimer">{{pausedMinute}}:{{pausedSecond}}</view>
				</view>
				<view v-else>
					<u-count-down :timestamp="timer" :show-hours="false" font-size="200" bg-color="#19BE6B" separator-size="200" @change="timerChange" ref="timer" :show-border="false"></u-count-down>
				</view>
			</view>
			
			<view class="timer-name">
				<view v-if="timerStatus === 'notReady'">做好准备</view>
				<!-- <view v-else-if="timerStatus === 'paused'">暂停</view>
				<view v-else-if="timerStatus === 'running'">暂停</view> -->
				<view v-else>
					{{timerName}}
				</view>
			</view>
		</view>
		
		<view class="button" @click="pause">
			<view v-if="timerStatus === 'paused'">
				<u-icon name="pause-circle-fill" size="96"></u-icon>
			</view>
			<view v-else-if="timerStatus === 'running'">
				<u-icon name="play-circle-fill" size="96"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer:5,
				count:'',
				work:'',
				reset:'',
				playButton:false,
				audio:{},
				timerName:'做好准备',
				isWork:false,
				isReady:true,
				// isPaused:false,
				isPaused:true,
				pausedCount:0,
				pausedTimer:0,
				pausedMinute:0,
				pausedSecond:0,
				
				// 铃声音量
				ringtoneVolume:30,
				// 当前计时器
				currentTimer:{
					cycleTimes:1,
					workTime:0,
					resetTime:0,
				},
				// 剩余循环次数
				leftCycleTimes:0,
				// 计时器状态
				timerStatus:'paused'
			};
		},
		onLoad(){
			this.initTimer()
			
			
			this.audio = uni.createInnerAudioContext()
			this.audio.src= "../../static/high.mp3"
			this.audio.autoplay = false
			this.audio.loop = true
			// this.audio.puased = this.playState
		},
		
		methods:{
			initTimer(){		
				const {currentTimer:{cycleTimes,workTime,resetTime}} = uni.getStorageSync('interval-timer')				
				
				if(workTime === 0 || resetTime === 0 ){
					this.$u.toast('定时器时间不能为空')
					uni.navigateTo({
						url:'../index/index'
					})
				}else{
					this.count = cycleTimes
					this.work = workTime
					this.reset = resetTime
					
					// this.audio = uni.createInnerAudioContext()
					// this.audio.src= "../../static/high.mp3"
					// this.audio.autoplay = true
					// this.audio.loop = true
					// this.audio.puased = this.playState
				}
			},
			getTimerStorage() {
				this.timerStorage = uni.getStorageSync('interval-timer')
				const {
					currentTimer,
					timerList
				} = this.timerStorage
				
				this.timerList = timerList.sort(this.compareObjectByProperty("timestamp"))
				
				if(currentTimer !== undefined){
					this.cycleTimes = currentTimer.cycleTimes
					this.time.wrok = currentTimer.workTime
					this.time.reset = currentTimer.resetTime
				}				
			},
			volumeChange(){
				this.audio.volume = (this.ringtoneVolume)/100
			},
			pause(){
				this.playButton = !this.playButton
				
				if(!this.isPaused){
					this.audio.pause()
					this.pausedMinute = parseInt((this.pausedTimer)/60)
					if(this.pausedMinute<10){
						this.pausedMinute = '0' + this.pausedMinute 
					}
					this.pausedSecond = (this.pausedTimer)%60
					if(this.pausedSecond<10){
						this.pausedSecond = '0' + this.pausedSecond
					}
					this.timer = 0
					this.isPaused = !this.isPaused
				}else{
					this.timer = this.pausedTimer
					this.isPaused = !this.isPaused
				}

				
			},
			timerChange(e){
				this.pausedTimer = e
				if(this.isPaused == false){
					if(e <= 5){
						this.audio.play()
					}
					if(e == 0){
						this.audio.pause()
						if(this.isReady == true){
							this.isReady = false
						}
						if(this.count > 0){
							this.count = this.count - 1
							this.isWork = !this.isWork
							if(this.isWork == true){
								this.timer = this.work
							}else{
								this.timer = this.reset
							}
							this.$refs.timer.start();
						}					
					}
				}
				
			}
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
	.main{
		height: 100%;
		position: relative;
		padding: 20px;
	}
	
	.timer{
		// background-color: pink;
		height: 75%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.count-left{
			font-size: 60px;
		}
		.count-down{
			// padding: 20px 0;
		}
		.timer-name{
			font-size: 50px;
		}
	}
	
	.volume-control{
		// margin-top: 20px;
	}
	
	.button{
		position: absolute;
		right: 30px;
		bottom: 30px;
	}
		
	.pausedTimer{
		font-size: 200rpx;
		color: white;
	}
	
	[class^="u-countdown-colon"]{
		padding-left: 0;
	}
</style>
