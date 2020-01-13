/* global chrome */
let thisonehash; // global hack because I couldn't figure out the sync/await
let thisonseal;
function load(url, type, callback) {
    const xhr = new XMLHttpRequest;
    xhr.responseType = type;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr);
        } else {
            if (xhr.readyState === 4 && xhr.status !== 200) {
                console.log('API Call failed.');
                // TODO pick a method of storing local. sync!
                chrome.runtime.sendMessage({
                    total_alerts: false // TODO Change this to False or Missing 
                });
                chrome.storage.sync.set({alerts: false}, function() {
                    console.log('Hash value is sync to ' + sri);
                  });
                console.log('this is the url for the xt to store ' + url);
                /* chrome.storage.sync.set({images: url}, function() {
                    console.log('Value is set to ' + url);
                  }); */

                return;
            }
        }
    };
    try {
        xhr.send();
    } catch {
        console.log('Catch - something failed in api call. See load().');
    }
}

function generatehash(url, element, output) {
    load(url, "arraybuffer", function (xhr) {
        console.log(url);
        // for SRI use these
        // const hasher = new jsSHA('SHA-384', 'TEXT');
        // hasher.update(xhr.responseText);
        // const sri = 'sha384-' + btoa(hasher.getHash('BYTES'));

        // For CW Regiter use these
        const hasher = new jsSHA('SHA-256', 'ARRAYBUFFER');
        hasher.update(xhr.response);
        console.dir(xhr);
        const sri = hasher.getHash('HEX');
        // console.log(sri + ' - ' + url);
        chrome.storage.sync.set({hash: sri}, function() {
            console.log('Hash value is sync to ' + sri);
          });
        element.setAttribute('cwhash', sri);
        // Create and update logging modal. TODO add verified status
        const log = document.createElement('div');
        log.setAttribute('style', 'white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin: 2px;');
        // log.innerText = sri + ' - ' + url;
        // output.appendChild(log);

        var createA = document.createElement('a');
        var createAText = document.createTextNode(url);
        createA.setAttribute('href', "https://kvdb.io/Gs6LrUTSX5RXX4ajTUsvFB/" + sri);
        createA.appendChild(createAText);
        log.appendChild(createA);
        thisone = sri;
        console.log('this is log ' + log);
      

        // gernate qr code TODO don't hard code 
        // const outputqr = document.createElement('div');
        log.setAttribute('style', 'position: fixed;border: 1px solid #000;z-index: 2147483647;color: #000;font: 12px monospace;padding: 2px;width: 100%;top: 0;left: 0;background: #fff;');
        log.id = "qrcode";
        // document.body.appendChild(outputqr);
        output.appendChild(log);
       /*  new QRCode(document.getElementById("qrcode"),
     {
            text: "https://data-integrity-demo.netlify.com/" + sri,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        }); */
    
        // Get public seal
        generatepublicseal(sri, sri);

    });

    function generatepublicseal(url, thehash) {
        // TODO Update this with public or private seal loacation
        url = "https://kvdb.io/Gs6LrUTSX5RXX4ajTUsvFB/" + thehash;
        console.log('the seal is being looked for here: ' + url);
        load(url, "text", function (xhr) {
            console.log('you have called for public seal');
            // uugh why catch in load doesn't work IDK yet error next line
            let publicseal = JSON.parse(xhr.response);
            console.dir(publicseal.documents[0]);
            // TODO check if more than one seal exists
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
            xhr.setRequestHeader('X-API-Key', 'ApeD9yhENMWVX1LKow6A9lJ7ru4u/jl4TyPWVn9Z8Jo= hjFqXkl3IJP6zNFHwe0cQ65t2V4jQ7Bwtew6+N/leig=');
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
    output.id = "qrcode";
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
             // TESTING passing to storage to pull into images found popup
          chrome.storage.sync.set({images: image.src}, function() {
            console.log('Value is set to ' + image.src);
          });
            generatehash(image.src, image, output);
        }
    }

});