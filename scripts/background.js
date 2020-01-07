/* global chrome */
'use strict';

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        console.log(tab.url);
        chrome.storage.sync.set({
            alerts: false
        }, function () {
            // TODO What about tab refresh?
            console.log('Alerts cleared due to change in tab.');
        });
        restIcon();
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    //TODO - Is this redundant?
    chrome.tabs.sendMessage(tab.id, {});
    chrome.storage.sync.set({
        alerts: false
    }, function () {
        console.log('Alerts init to false on extension clicked.');
    });
});


function restIcon() {
    console.log('you are in badge reset');
    // console.dir(request);

    chrome.browserAction.setBadgeText({
        text: "Verify"
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: [0, 0, 0, 0]
    });
    chrome.storage.local.remove(["alerts"], function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });

}

function updateIcon(request) {
    console.log('you are in badge update');
    // console.dir(request);
    chrome.storage.sync.get('alerts', function (data) {
        var current = request;
        console.log('data alrerts', current);
        if (current !== true) {
            const text1 = "Warn";
            chrome.browserAction.setBadgeText({
                text: text1
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color:  "red"
            });
   
        } else {
            const text1 = "ok";
            chrome.browserAction.setBadgeText({
                text: text1
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "green"
            });
        }
    });
    chrome.storage.local.remove(["alerts", "number"], function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });

}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        localStorage["alerts"] = request.total_alerts;
        console.log('CW Verify method returned = ', request.total_alerts);
        updateIcon(request.total_alerts);
    }
);

/* // TODO Use this when there are env variables
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        number: 1
    }, function () {
        console.log('The number is set to 1.');
    }); 

});
*/

// chrome.browserAction.onClicked.addListener(updateIcon);
// updateIcon();