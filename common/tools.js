function secondsToString(seconds){
	let h = (seconds / 3600) < 10 ? '0' + parseInt(seconds / 3600) : parseInt(seconds / 3600)
	let m = parseInt(seconds / 60) >= 60 ? parseInt(seconds / 60) % 60 : parseInt(seconds / 60)
	m = m < 10 ? '0' + m : m
	let s = (seconds % 60) < 10 ? '0' + parseInt(seconds % 60) : parseInt(seconds % 60)
	
	return h + ' : ' + m + ' : ' + s
}

export default {
	secondsToString
}