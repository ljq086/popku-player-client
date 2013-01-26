(function(window){

	window.origin_contents = $("#playBox").html();

    var chromex = window.chromex = function(method, args, callback) {
        chrome.extension.sendRequest({method: method, args: args}, function(response){
            callback.call(chromex, response.result);
        });
    };

    chromex.getOriginContent = function(){
    	return window.origin_contents;
    }

	chromex._setIsDisplay = function(value) {
		window.localStorage["DISPLAY"] = value;
	};

	chromex.setDisplay = function(){
		this._setIsDisplay(true);
	}

	chromex.unsetDisplay = function(){
		this._setIsDisplay(false);
	}

	chromex.getDisplay = function(){
		var value = window.localStorage["DISPLAY"];
		if (typeof value == "undefined") {
			this.setDisplay();
			return true;
		} else {
			return value;
		}
	}

})(window);

