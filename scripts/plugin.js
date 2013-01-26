(function(window, $) {  
var popku = {};
    
    popku.elementInit = function() {
        $('body').prepend($('<div id="message-box"></div>'));
    };
    
    popku._messagebox = function(message, timeout, specialClass) {
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
    popku.notice = function(message, timeout) { this._messagebox(message, timeout, 'notice'); };
    popku.alert  = function(message, timeout) { this._messagebox(message, timeout, 'alert');  };
    popku.error  = function(message, timeout) { this._messagebox(message, timeout, 'error'); };
    
    window.popku = window.$S = popku;
})(window, jQuery);

$(function(){
    // 初始化元素
    $S.elementInit();
});