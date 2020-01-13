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

                return;
            }
        }
    };
    try {
        xhr.send();
    } catch {
        console.log('Catch - something failed in api call. See load().');
    }
};



function generatehash(url) {
    load(url, "arraybuffer", function (xhr) {
        console.log(url);
        // For CW Regiter use these
        const hasher = new jsSHA('SHA-256', 'ARRAYBUFFER');
        hasher.update(xhr.response);
        console.dir(xhr);
        const sri = hasher.getHash('HEX');
        console.log(sri + ' - ' + url);
        // Return visual sealed img
        //build cw register call 
        register(sri, url);
        
    });
    
};


function register(hash, lookupInfo) {
    console.log(hash);
    console.log(lookupInfo);
    const xhr = new XMLHttpRequest;
    xhr.open('POST', 'https://developers.cryptowerk.com/platform/API/v8/register', true);
    xhr.setRequestHeader('x-Accept', 'application/json');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // TODO - This key will not be vaid so enter your own API key from Cryptowerk.com
    // TODO - get from local storage once that option is developed
    xhr.setRequestHeader('X-API-Key', 'ApeD9yhENMWVX1LKow6A9lJ7ru4u/jl4TyPWVn9Z8Jo= hjFqXkl3IJP6zNFHwe0cQ65t2V4jQ7Bwtew6+N/leig=');
    var hashparams = 'hashes=' + hash;
    // console.log('building params: ', hashparams);
    var processingparams = '&lookupInfo=' + lookupInfo; // add more here if needed
    var publicSealcb = '&callback=' + 'http:jsonplain:https://kvdb.io/Gs6LrUTSX5RXX4ajTUsvFB/' + hash;
    // console.log(hashparams, processingparams, publicSealcb);
    var params = hashparams + processingparams + publicSealcb;

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('200 on register');
           // callback(xhr);
           return xhr.status;
        }
    };
    try {
        xhr.send(params);
    } catch {return 'oops'}

};