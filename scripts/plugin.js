// 初始化提示框
(function(window, $) {  
    var popku_tipbar = {};
    popku_tipbar.elementInit = function() {
        $('body').prepend($('<div id="message-box"></div>'));
    };
    popku_tipbar._messagebox = function(message, timeout, specialClass) {
        var entity = $('<div class="message-content"></div>')
            .hide()
            .append($('<span class="message-text"></span>').append(message))
            .append($('<a href="javascript:void(0);" class="button message-close-btn">关闭</a>'))
            .addClass(specialClass);
        $('#message-box').append(entity);
        entity.fadeIn(500);
        if (timeout > 0) {
            setTimeout(function(){
                entity.fadeOut(500, function(){
                    $(this).remove();
                });
            }, timeout);
        }
        entity.children('a.message-close-btn').click(function(){
            entity.fadeOut(500, function(){
                $(this).remove();
            });
        });
    };
    popku_tipbar.notice = function(message, timeout) { this._messagebox(message, timeout, 'notice'); };
    popku_tipbar.alert  = function(message, timeout) { this._messagebox(message, timeout, 'alert');  };
    popku_tipbar.error  = function(message, timeout) { this._messagebox(message, timeout, 'error'); };
    window.popku_tipbar = window.$S = popku_tipbar;
})(window, jQuery);


// 初始化工具栏
(function(window, $) { 
    var popku_toolbar = {};

    popku_toolbar.getBarContent = function(){
        var isDisplay = chromex.getDisplay();
        if (isDisplay == "true"){
            return $("<a href='#' id='close-player-btn'>关闭 Popku 播放器</a>");
        }
        else{
            return $("<a href='#' id='open-player-btn'>启动 Popku 播放器</a>");
        }
    }

    popku_toolbar.setToolbar = function(object){
        $("#plugin-toolbar").empty();
        $("#plugin-toolbar").append(object);
    }

    popku_toolbar.toolbarUpdate = function(){
        popku_toolbar.setToolbar(popku_toolbar.getBarContent());
        popku_toolbar.btnActionInit();
    }

    popku_toolbar.btnActionInit = function(){
        $("#close-player-btn").click(function(){
            chromex.unsetDisplay();
            $P._useYoukuPlayer();
            popku_toolbar.toolbarUpdate();
        });
        $("#open-player-btn").click(function(){
            chromex.setDisplay();
            $P._usePopkuPlayer();
            popku_toolbar.toolbarUpdate();
        });
    }

    popku_toolbar.elementInit = function() {
        $('body').prepend($('<div id="plugin-toolbar"></div>').hide());
        popku_toolbar.setToolbar(popku_toolbar.getBarContent());
        popku_toolbar.btnActionInit();
    };

    popku_toolbar.setLocation = function(top, left){
        $("#plugin-toolbar").css("top", top);
        $("#plugin-toolbar").css("left", left);
    }

    popku_toolbar.fadeIn = function(){ $('#plugin-toolbar').fadeIn(); }
    popku_toolbar.fadeOut = function(){ $('#plugin-toolbar').fadeOut(); }

    window.popku_toolbar = window.$T = popku_toolbar;
})(window, jQuery);


// 初始化播放器
(function(window, $) { 
    var popku_player = {};

    popku_player.version = 2.0;
    popku_player.request_server = "http://popku.szulabs.org"
    popku_player.host = popku_player.request_server
   
    popku_player.positionInit = function(){
        popku_player.playerBox = {}
        popku_player.playerBox.width = $("#playBox").width();
        popku_player.playerBox.height = $("#playBox").height();
        playBox_position = $("#playBox").position();
        playBox_top = playBox_position.top;
        playBox_right = popku_player.playerBox.width + playBox_position.left;
        $T.setLocation(playBox_top - 35, playBox_right - 160);
        $T.fadeIn();
    }

    popku_player.playerInit = function(request_url){
        popku_player.checkVersion();
        popku_player.positionInit();
        var isDisplay = chromex.getDisplay();
        if (isDisplay == "false"){
            return null;
        }
        $.ajax({
            type: "POST",
            url: popku_player.host + "/youku",
            data: {url:request_url},
            dataType: "json",
            success:function(data){
                popku_player.getInformation(data.vid);
            },
        });
    }

    popku_player.getInformation = function(youkuid){
        $.ajax({
            type: "GET",
            url: 'http://v.youku.com/player/getPlayList/VideoIDS/' + youkuid,
            dataType: "text",
            success:function(data){
                popku_player.postInformation(youkuid, data);
            },
         });
    }

    popku_player.postInformation = function(youkuid, information){
        $.ajax({
            type: "POST",
            url: popku_player.host + '/postYoukuInformation/youkuid/' + youkuid,
            data: {information:information},
            dataType: "json",
            success:function(data){
                if(!data.error){
                    popku_player.replacePlayer(youkuid);
                }else{
                    $S.error("抱歉，此视频之限于中国内地播放。\nSorry, this video can only be streamed within Mainland China.");
                }
            },
         });
    }
    
    popku_player.replacePlayer = function(vid){
        $("#playBox").empty();
        $("#playBox").append("<iframe frameborder='0' scrolling='no' src='" + popku_player.host + "/video/vid/" + vid + "?width=" + popku_player.playerBox.width + "&height=" + popku_player.playerBox.height + "&version=" + popku_player.version + "' height='" + popku_player.playerBox.height + "' width='" + popku_player.playerBox.width + "' ></iframe>");
    }

    popku_player.checkVersion = function(){
    $.ajax({
        type: "GET",
        url: popku_player.host + "/current_version",
        dataType: "text",
        success:function(data){
            if (popku_player.version != data){
                $S.alert("您好，您的插件当前版本为: " + popku_player.version + "。为了保证更好的体验，请更新至：" + data, 5000);
            }
        },
     });
    }

    popku_player._useYoukuPlayer = function(){
        $("#playBox").empty();
        $("#playBox").prepend(chromex.getOriginContent());
    }

    popku_player._usePopkuPlayer = function(){
        popku_player.playerInit(window.location.href);
    }

    window.popku_player = window.$P = popku_player;

})(window, jQuery);

$(function(){
    // 初始化元素
    $S.elementInit();
    $T.elementInit();
});