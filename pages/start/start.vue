<template>
	<view>
		<view class="timer-setting">
			<view class="title">快速开始</view>
			<view class="number-box">
				
				<view class="group-name">组数</view>
				<u-number-box v-model="count" @change="countChange"></u-number-box>
				
				<view class="group-name">工作</view>
				<view @click="showWork = true" class="timer-show" v-model="worktime">{{worktime}}</view>
				<u-picker v-model="showWork" mode="time" :params="params" @confirm="workchange" default-time="00:00:00"></u-picker>
				
				<view class="group-name">休息</view>
				<view @click="showReset = true" class="timer-show" v-model="resettime">{{resettime}}</view>
				<u-picker v-model="showReset" mode="time" :params="params" @confirm="resetchange" default-time="00:00:00"></u-picker>
			</view>
			<u-button class="start-button" type="primary" @click="gotoTimer"><u-icon class="start-icon" name="hourglass" color="white" size="42"></u-icon>开始</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count: 0,
				worktime:'请设置工作时间',
				resettime:'请设置休息时间',
				showWork:false,
				showReset:false,
				params:{
					minute:true,
					second: true
				},
				computedWorkTime:'60',
				computedResetTime:'60'
			};
		},
		methods:{
			gotoTimer(){
				this.$u.route({
					url:'pages/timer/timer',
					params:{
						count:this.count,
						work:this.computedWorkTime,
						reset:this.computedResetTime
					}
				})
			},
			workchange(e){
				this.worktime = e.minute + ' : ' + e.second
				this.computedWorkTime = (e.minute) * 60 + e.second * 1
			},
			resetchange(e){
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
	
	.timer-setting{
		background-color: white;
		margin: 15px;
		.title{
			font-size: 24px;
			font-weight: bold;
			padding: 15px;
		}
		.number-box{
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
	
	.group-name{
		padding-top: 20px;
		padding-bottom: 10px;
	}
	
	.start-button{
		margin-top: 30px;
		// width: 75%;
		border-radius: 0;
		.start-icon{
			padding-right: 10px;
		}
	}
	
	.bottom-padding{
		height: 30px;
	}
	
	.timer-show{
		background-color: rgb(242,243,245);
		// background-color: $u-type-primary;
		// color: white;
		height: 30px;
		line-height: 30px;
		font-size: 15px;
		text-align: center;
		padding: 0 15px;
	}
</style>
