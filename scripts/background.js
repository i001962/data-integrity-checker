/* global chrome */
'use strict';

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {});
    // TODO is this sync needed?
    chrome.storage.sync.set({
        images: ""
    }, function () {
        console.log('Alerts init to false on extension clicked.');
    }); 
    chrome.browserAction.setPopup({
        tabId: tab.id,
        popup: 'imagesfound.html'
    });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        console.log(tab.url);
        chrome.storage.sync.set({
            alerts: "verify",
            images: ""
        }, function () {
            // TODO What about tab refresh?
            console.log('Alerts cleared due to change in tab.');
        });
        restIcon();
        chrome.tabs.sendMessage(tab.id, {});
    });
   
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // if (!changeInfo.url) return; // URL did not change
    // Might be better to analyze the URL to exclude things like anchor changes
    /* ... */
    restIcon();
    clearStorage();

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
    chrome.storage.local.remove(["alerts", "images"], function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });

}

function clearStorage(){
    chrome.storage.local.remove(["alerts", "images","hash","number"], function () {
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
                color: "red"
            });

        } else 
        if (current !== false) 
        {
            const text1 = "ok";
            chrome.browserAction.setBadgeText({
                text: text1
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "green"
            });
        } else
        if (current !== "verified") 
        {
            restIcon();
        }
    });
 
    chrome.storage.local.remove(["alerts", "images"], function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        localStorage["alerts"] = request.total_alerts;
        console.log('CW Verify method returned alerts = ', request.total_alerts);
        localStorage["images"] = request.total_images;
        console.log('CW Verify method returned images = ', request.total_images);

        updateIcon(request.total_alerts);
    }
);

// TODO Use this when there are env variables
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        number: 1
    }, function () {
        console.log('No Fakes extension installed.');
    });
});