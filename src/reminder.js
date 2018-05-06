chrome.permissions.contains({
    permissions: ["alarms", "storage"]
}, function(result) {
    if (result) {

        var drinkWaterNotificationId = '';

        var drinkWaterNotificationOptions = {
            type: "basic",
            iconUrl: "notification_icon.png",
            title: "Drink Water",
            message: "Hydrate yourself"
        };

        chrome.storage.onChanged.addListener(function(changes, namespace) {
            chrome.alarms.clear("drinkWaterAlarm",function(wasCleared) {
            	chrome.storage.local.get(["reminderValue"], function(result) {

                    if (result && result.reminderValue) {
                        chrome.alarms.create("drinkWaterAlarm", {
                            when: Date.now() + 1000,
                            periodInMinutes: result.reminderValue
                        })
                    }
                });
            });
        });

        chrome.alarms.onAlarm.addListener(function(alarm) {
        	if (drinkWaterNotificationId) {
                chrome.notifications.clear(drinkWaterNotificationId, function(notificationId) {});
             }

             chrome.notifications.create('', drinkWaterNotificationOptions, function(notificationId) {
                drinkWaterNotificationId = notificationId;
                });
            });

    } else {
        // The extension doesn't have the permissions.
    }
});