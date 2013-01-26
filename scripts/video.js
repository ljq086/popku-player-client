$(function(){
	version = 1.5;
    current_url = window.location.href;
    host_production = "http://popku.szulabs.org"
    host = host_production
    $.ajax({
        type: "POST",
        url: host + "/youku",
        data: {url:current_url},
        dataType: "json",
        success:function(data){
            checkVersion();
            getInformation(data.vid);
        },
     });

    var getInformation = function(youkuid){
        $.ajax({
            type: "GET",
            url: 'http://v.youku.com/player/getPlayList/VideoIDS/' + youkuid,
            dataType: "text",
            success:function(data){
                postInformation(youkuid, data);
            },
         });
    }

    var postInformation = function(youkuid, information){
        $.ajax({
            type: "POST",
            url: host + '/postYoukuInformation/youkuid/' + youkuid,
            data: {information:information},
            dataType: "json",
            success:function(data){
                if(!data.error){
                    replacePlayer(youkuid);
                }else{
                    $S.error("抱歉，此视频之限于中国内地播放。\nSorry, this video can only be streamed within Mainland China.");
                }
            },
         });
    }
    
    var replacePlayer = function(vid){
		width = $("#playBox").width();
		height = $("#playBox").height();
        $("#playBox").empty();
        $("#playBox").append("<iframe frameborder='0' scrolling='no' src='" + host + "/video/vid/"+vid+"?width="+width+"&height="+height+"&version="+version+"' height='"+height+"' width='"+width+"' ></iframe>");
    }

    var checkVersion = function(){
    $.ajax({
        type: "GET",
        url: host + "/current_version",
        dataType: "text",
        success:function(data){
            if (version != data){
                $S.alert("您好，您的插件当前版本为: "+version+"。为了保证更好的体验，请更新至："+data, 5000);
            }
        },
     });
    }
});
