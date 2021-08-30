<template>
	<view class="main">
		<view class="volume">
			<u-row>
				<u-col span="2">
					<u-icon name="volume-up-fill" color="black" size="56"></u-icon>
				</u-col>
				<u-col span="10">
					<u-slider v-model="volume" @moving="volumeChange" block-width="30" class="volume-slider" inactive-color="black" active-color="black" block-color="black"></u-slider>
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
				<view v-if="isReady">做好准备</view>
				<view v-else>
					<view v-if="isWork">工作</view>
					<view v-else>休息</view>
				</view>
			</view>
		</view>
		
		<view class="button" @click="pause">
			<view v-if="playButton">
				<svg t="1602074836570" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7325" width="48" height="48"><path d="M149.989688 874.093352a509.948138 509.948138 0 1 0-109.714286-162.700613 513.206978 513.206978 0 0 0 109.714286 162.700613z" fill="#2c2c2c" p-id="7326" data-spm-anchor-id="a313x.7781069.0.i11" class="selected"></path><path d="M429.646454 687.977369a57.331447 57.331447 0 0 0 27.277699 7.000472 60.348892 60.348892 0 0 0 32.829797-10.017916l175.977369-115.990571a68.677039 68.677039 0 0 0 30.777935-58.055634 66.504479 66.504479 0 0 0-29.812353-56.486563l-177.54644-115.749175a57.934936 57.934936 0 0 0-60.348892-3.017445 67.832155 67.832155 0 0 0-33.312588 60.348893V627.628477a67.470061 67.470061 0 0 0 34.157473 60.348892z" fill="#FFFFFF" p-id="7327"></path></svg>
			</view>
			<view v-else>
				<svg t="1602077905261" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8188" width="48" height="48"><path d="M512 1024C229.23264 1024 0 794.76736 0 512S229.23264 0 512 0s512 229.23264 512 512-229.23264 512-512 512z" fill="#2c2c2c" p-id="8189" data-spm-anchor-id="a313x.7781069.0.i14" class="selected"></path><path d="M389.12 327.68a40.96 40.96 0 0 1 40.96 40.96v286.72a40.96 40.96 0 1 1-81.92 0V368.64a40.96 40.96 0 0 1 40.96-40.96z m245.76 0a40.96 40.96 0 0 1 40.96 40.96v286.72a40.96 40.96 0 1 1-81.92 0V368.64a40.96 40.96 0 0 1 40.96-40.96z" fill="#FFFFFF" p-id="8190"></path></svg>
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
				volume:30,
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
				pausedSecond:0
			};
		},
		onLoad(){
			this.initTimer()
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
					
					this.audio = uni.createInnerAudioContext()
					this.audio.src= "../../static/high.mp3"
					// this.audio.autoplay = true
					// this.audio.stop()
					this.audio.loop = true
					this.audio.puased = this.playState
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
				this.audio.volume = (this.volume)/100
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
		/* width: 800px; */
		margin: 0 auto;
		background-color: #19BE6B;
		height: 100%;
	}
</style>

<style lang="scss" scoped>	
	.main{
		height: 100%;
		position: relative;
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
