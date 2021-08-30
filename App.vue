<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			const intervalTimer = uni.getStorageSync('interval-timer')
			
			if((typeof intervalTimer) !== 'object'){
				uni.setStorageSync('interval-timer',{
					currentTimer:{
						cycleTimes:1,
						workTime:0,
						resetTime:0
					},
					timerList:[]
				})
			}
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	
	page{
		// background-color: green;
		max-width: 420px!important;
	}
</style>
