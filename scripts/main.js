/* global chrome */
let thisonehash; // global hack because I couldn't figure out the sync/await
let thisonseal;
function load(url, callback) {
    const xhr = new XMLHttpRequest;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr);
        } else {
            if (xhr.readyState === 4 && xhr.status !== 200) {
                console.log('No public seal found for this asset.');
                chrome.runtime.sendMessage({
                    total_alerts: false // or whatever you want to send
                  });
                return;
            }
        }
    };
    try {
        xhr.send();
    } catch {
        console.log('Catch - No public seal found for this asset.');
    }
}

function generatehash(url, element, output) {
    load(url, function (xhr) {
        // for SRI use these
        // const hasher = new jsSHA('SHA-384', 'TEXT');
        // hasher.update(xhr.responseText);
        // const sri = 'sha384-' + btoa(hasher.getHash('BYTES'));

        // For CW Regiter use these
        const hasher = new jsSHA('SHA-256', 'TEXT');
        hasher.update(xhr.responseText);
        const sri = hasher.getHash('HEX');
        // console.log(sri + ' - ' + url);

        element.setAttribute('cwhash', sri);
        // Create and update logging modal. TODO add verified status
        const log = document.createElement('div');
        log.setAttribute('style', 'white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin: 2px;');
        log.innerText = sri + ' - ' + url;
        output.appendChild(log);
        thisone = sri;

        // Get public seal
        generatepublicseal(sri, sri, output);

    });

    function generatepublicseal(url, thehash, output) {
        load(url, function (xhr) {
            console.log('you have called for public seal');
            // uugh why catch in load doesn't work IDK yet error next line
            let publicseal = JSON.parse(xhr.responseText);
            console.dir(publicseal.documents[0]);
            let seal = publicseal.documents[0].seal;
            console.dir(seal);
            verify(thehash, seal, function (xhr) {
                console.dir(xhr);
                let cwresponse = JSON.parse(xhr.responseText);
                let verified = cwresponse.verificationResults[0].verified;
                console.log(verified);

                chrome.runtime.sendMessage({
                    total_alerts: verified // or whatever you want to send
                  });
            });

        });
        async function verify(hash, seal, callback) {

            console.log(hash);
            console.log(seal);
  
            const xhr = new XMLHttpRequest;
            xhr.open('POST', 'https://developers.cryptowerk.com/platform/API/v8/verify', true);
            xhr.setRequestHeader('x-Accept', 'application/json');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            // TODO - This key will not be vaid so enter your own API key from Cryptowerk.com
            // TODO - Add setup options for user to get and enter API Key
            xhr.setRequestHeader('X-API-Key', '/pZqiO0DiWPzcTPrUcWeMTKf7eiwq+SqrO1s7wIdeoo= MlsDJz28Ax7O977fmkazXxjXWEbjgN3n+S4M7IULIf4=');
            // var params = 'retrievalId=ri317312689300628c627ddf94a90c52e26d962e60fe6e4edc1e00be6c1b6160526';
            var hashparams = 'verifyDocHashes=' + hash;
            // console.log('building params: ', hashparams);
            var processingparams = '&provideVerificationInfos=false&provideInstructions=false&';
            var sealparams = 'seals=' + JSON.stringify(seal);
            // console.log(hashparams, processingparams, sealparams);
            var params = hashparams + processingparams + sealparams;

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr);
                }
            };
            try {
                xhr.send(params);
            } catch {}

        };
    }
}

chrome.extension.onMessage.addListener(async function (request, sender, callback) {
    const output = document.createElement('div');
    output.setAttribute('style', 'position: fixed;border: 1px solid #000;z-index: 2147483647;color: #000;font: 12px monospace;padding: 2px;width: 100%;top: 0;left: 0;background: #fff;');
    document.body.appendChild(output);
    // TODO activate for more than png files. Use Scripts, CSS, ...
    /* const scripts = document.getElementsByTagName('script');

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (script.src) {
            generatehash(script.src, script, output);
        }
    }

    const styles = document.getElementsByTagName('link');

    for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        if (style.href && style.rel === 'stylesheet') {
            generatehash(style.href, style, output);
        }
    } */
    // TODO Increase beyond png file type as well as more than one file
    const images = document.getElementsByTagName('img');

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let filetype = image.src.split('.').pop();
        // png only for now could be an option
        if (image.src && filetype === 'png') {
            generatehash(image.src, image, output);
        }
    }

});