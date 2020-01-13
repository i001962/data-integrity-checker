//'use strict';

console.log('\'Allo \'Allo! Images found');



chrome.storage.sync.get(['images', 'hash', 'alerts'], function (data) {
    // var current = request;

    console.log('data images from the imagesfound popup');
    console.dir(data.images);
    console.dir(data.hash);
    console.dir(data.alerts);
    var x = document.getElementById("myBtn");
    var y = document.getElementById("subheading");

    if (data.alerts == true || data.alerts == 'verify') {
        // show the register button
        x.style.display = "none";
        y.innerText = "The image was found in public records.";

    } else {
        x.style.display = "block";
    };

    document.getElementById("myBtn").addEventListener("click", function () {
        document.getElementById("myBtn").innerHTML = "Done";
        document.getElementById("myBtn").disabled = true;
        var regStaus = generatehash(data.images);
        // TODO uugh need to get value via callback ideally hash
        document.getElementById("error").innerHTML = "Image registered. Use QR code to locate Seal.";
    });

    var element = document.getElementById("showImages");
    element.innerText = data.images;
    // document.body.appendChild(element);
    console.log(element);

    var createA = document.createElement('a');
    var createAText = document.createTextNode(data.images);
    createA.setAttribute('href', JSON.stringify(data.images));
    // createA.appendChild(createAText);
    element.appendChild(createA);
    var createB = document.createElement('img');

    createB.src = data.images;
    createB.width = 100;
    createB.innerHTML = JSON.stringify(data.images);
    document.getElementById('showImages').appendChild(createB);
    createA.appendChild(createB);
    new QRCode(document.getElementById("showImages"), {
        text: "https://kvdb.io/Gs6LrUTSX5RXX4ajTUsvFB/" + data.hash,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

});