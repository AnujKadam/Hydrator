document.addEventListener('DOMContentLoaded', function() {

    var setReminderButton = this.getElementById('set-reminder');
	var turnOffButton = this.getElementById('turn-off');
    var reminderIntervalInput = document.getElementById('reminder-interval');
    var errorMessage = document.getElementById("error");
    var facebookLink = this.getElementById("facebookLink");
    var myFacebookLink = "https://www.facebook.com/kadamanuj";

    chrome.permissions.contains({
    	permissions: ["storage"]
    }, function(result){
    	if(result){
    		chrome.storage.local.get(["reminderValue"], function(result){
    			if(result && result.reminderValue){
    				reminderIntervalInput.value = result.reminderValue;
    			}
    		});
    	}
    })

    setReminderButton.addEventListener('click', function() {
        chrome.permissions.contains({
            permissions: ["notifications", "alarms", "storage"]
        }, function(result) {
            if (result) {
                var intervalValue = (' ' + reminderIntervalInput.value).slice(1);
                if (IsValidIntervalValue(intervalValue)) {
                	errorMessage.innerHTML = "";
                    chrome.storage.local.set({
                        "reminderValue": parseInt(intervalValue)
                    }, function() {});
                } else {
                    errorMessage.innerHTML = "Enter a valid value<br/> (Between 1 and 60)";
                }


            } else {
                // The extension doesn't have the permissions.
            }
        });
    })

	//This function clears the alarms.
	turnOffButton.addEventListener('click', function(){
		chrome.permissions.contains({
            permissions: ["alarms", "storage"]
        }, function(result) {
			if(result) {
				chrome.alarms.clearAll(function(wasCleared){
					chrome.storage.local.clear(function() {
						reminderIntervalInput.value = "";
					});
				})
			}
		})
	})
	

	//This function opens my facebook profile in a new tab.
	facebookLink.addEventListener('click', function(){
  		chrome.tabs.create({ url: myFacebookLink });
	});

    //This function validates the interval value.
    var IsValidIntervalValue = function(intervalValue) {
        if (intervalValue) {
            intervalValue = parseInt(intervalValue);
            return !isNaN(intervalValue) && !(intervalValue < 0 || intervalValue > 60);
        }
        return false;
    }
});