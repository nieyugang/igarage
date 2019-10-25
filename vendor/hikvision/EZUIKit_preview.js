layui.use('layer', function () {
	var layer = layui.layer;
	window.onload = function () {
		TestActiveX();
		hikGetCameraList("129088421");
		// hikGetCameraByChannelNo("129088421",5);
		// Play("EZUIKit","150c6adecae64a4b9dae7dd9717daae8","at.6w4rlrjdbesna7uh0l5i5df89hglh89m-2rt4jubyi3-128sguu-yiehmq0ix","ezopen://open.ys7.com/122602365/5.live");
	}
});
//全局变量
var gAppKey = "150c6adecae64a4b9dae7dd9717daae8";
var gAccessToken; //accesstoken
var size;

//获取设备的通道信息
function ready4Preview(gAppKey, gAccessToken, deviceSerial, webCameraList) {
	//添加所有通道播放窗口
	var containerDom = $("#camera-container");
	//定义分屏
	size = webCameraList.length;
	var divWidth = 880;
	var divHeight = 500;
	var width;
	var height;
	if (1 >= size) { //1*1
		width = divWidth;
		height = divHeight;
	} else if (1 < size && size <= 4) { //2*2
		width = divWidth / 2;
		height = divHeight / 2;
	} else if (4 < size && size <= 9) { //3*3
		width = divWidth / 3;
		height = divHeight / 3;
	} else if (9 < size && size <= 16) { //4*4
		width = divWidth / 4;
		height = divHeight / 4;
	} else if (16 < size && size <= 25) { // 5*5
		width = divWidth / 5;
		height = divHeight / 5;
	} else { // 6*6
		width = divWidth / 6;
		height = divHeight / 6;
	}

	for (var i in webCameraList) {
		if (webCameraList.hasOwnProperty(i)) {
			var element = webCameraList[i];
			var index = element.channelNo;
			containerDom.append($('<object classid="clsid:54FC7795-1014-4BF6-8BA3-500C61EC1A05" id="EZUIKit' + index + '" width="' + width + '" height="' + height + '" 	name="EZUIKit' + index + '"></object>'));
		}
	}
	playAll(webCameraList, gAppKey, gAccessToken, deviceSerial);
}

//全部预览
function playAll(webCameraList, gAppKey, gAccessToken, deviceSerial) {
	// var index = layer.load(1, { time: 8 * 1000 });//由于视频流加载有一定时间，此处添加loading，并跟进加载时长设定6s后自动关闭。
	for (var i in webCameraList) {
		if (webCameraList.hasOwnProperty(i)) {
			var element = webCameraList[i];
			var index = element.channelNo;
			var EZUIKitID = "EZUIKit" + index;
			var ezurl = "ezopen://open.ys7.com/" + deviceSerial + "/" + index + ".hd.live";
			Play(EZUIKitID, gAppKey, gAccessToken, ezurl);
		}
	}
}
//预览函数
function Play(EZUIKitID, gAppKey, gAccessToken, ezurl) {

	//得到控件引用
	var playOcx = document.getElementById(EZUIKitID);
	if (!playOcx) {
		layer.msg("EZUIKit异常，无法正常播放", {
			icon: 2
		});
		return;
	}
	var appkey = gAppKey;
	var accesstoken = gAccessToken; // "at.47g932qxaj85hc8p0r2lhjckc271rt3u-8z4i5jphjn-0gcqr39-wobgwqamr";
	var ezurl = ezurl;
	//检测取流参数
	if (appkey == "" || accesstoken == "" || ezurl == "") {
		layer.msg("通道不存在，设备参数错误，无法正常播放", {
			icon: 2
		});
		return;
	}
	//设置appkey
	var res = playOcx.InitWithAppKey(appkey);
	if (0 != res) {
		layer.msg("appkey和AccessToken不匹配,建议更换appkey或者AccessToken，无法正常播放", {
			icon: 2
		});
		return;
	}
	//设置accesstoken
	var res = playOcx.SetAccessToken(accesstoken);
	if (0 != res) {
		layer.msg("appkey和AccessToken不匹配,建议更换appkey或者AccessToken，无法正常播放", {
			icon: 2
		});
		return;
	}
	//开始播放, 播放结果 根据 PluginEventHandler 回调函数
	var res = playOcx.StartPlay(ezurl);
	if (0 != res) {
		layer.msg("播放异常！请检查参数", {
			icon: 2
		});
		return;
	}
}
//检查activeX插件是否已安装并加载
function TestActiveX() {
	try {
		var ax = new ActiveXObject("EZOPENUIACTIVEXK.EzOpenUIActiveXKCtrl.1");
		bInstall = true;
	} catch (e) {
		layer.open({
			type: 1 //Page层类型
				,
			area: ['550px', '200px'],
			shade: 0.6 //遮罩透明度
				,
			anim: 1 //0-6的动画形式，-1不开启
				,
			content: '<div style="padding:50px;">' +
				'<p>您还未安装过插件，请下载安装后刷新页面重试！' +
				'<a href="../../EZUIKit.exe" target="_blank" class="layui-btn layui-btn-primary" title="局域网视频监控插件下载" style="text-decoration: none;">' +
				'  <i class="layui-icon">&#xe620;</i>&nbsp;&nbsp;EZUIKit.exe' +
				' </a></p>' +
				'</div>'
		});

	}
}
//从redis服务器获取token
function hikGetCameraList(deviceSerial) {
	sendAjaxRequest("POST", "/hikGetCameraList.json", "JSON", JSON.stringify({
		"deviceSerial": deviceSerial
	}), successCallback);

	function successCallback(res) {
		if ("N" == res.resFlag) {
			gAccessToken = res.token;
			var webCameraList = res.webCameraList;
			ready4Preview(gAppKey, gAccessToken, deviceSerial, webCameraList);
		} else {
			layer.msg("播放异常！请检查参数！异常：accessToken", {
				icon: 2
			});
		}
	}
}

function hikGetCameraByChannelNo(deviceSerial, channelNo) {
	sendAjaxRequest("POST", "/hikGetCameraList.json", "JSON", JSON.stringify({
		"deviceSerial": deviceSerial,
		"channelNo": channelNo
	}), successCallback);

	function successCallback(res) {
		if ("N" == res.resFlag) {
			gAccessToken = res.token;
			var webCameraList = res.webCameraList;
			ready4Preview(gAppKey, gAccessToken, deviceSerial, webCameraList);
		} else {
			layer.msg("播放异常！请检查参数！异常：accessToken", {
				icon: 2
			});
		}
	}
}


window.unload = function () {
	alert("unload");
}