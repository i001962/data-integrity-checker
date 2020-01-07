# data-integrity-checker

Chrome extension to check data integrity of assets loaded into webpage

## Demo only

Works with [this demo site](https://data-integrity-demo.netlify.com/).

## Instructions

1. Downlaod content of this repository.
2. Install unpacked chrome extention
3. Update API keys in main.js (get key at cryptowerk.com)
4. Visit demo site
5. Click extension icon to verify pgn file on page has not been tampered
6. Try on other sites and get warning that seal doesn't exist/match

### Follow the steps to download and load the unpacked extension:

1. Goto Chrome Settings using three dots on the top right corner.
2. Now, Enable developer mode.
3. Click on Load Unpacked and select your Unzip folder. Note: You need to select the folder in which the manifest file exists. ...
4. The extension will be installed now.

### Visit a site like

[placeholder.com](https://placeholder.com/) and click icon in chrome extension.
No seal exists so warning about content.

## Motivation

The idea is to show if data has been tampered with. To keep this demo simple I am hashing only png files found on webpages and then looking to see if there is a public seal (mathmatical proof that links to a block in one of more blockchains as source of truth). As a result you will only find a valid seal on the demo site. The chrome extension will show a green badge with OK in it if the seal and the hash of the png file match.

Open to ideas for a better done. Feel free to create an issue to discuss...

## TODO

I am open to ideas for a better done. Feel free to create an issue or PR to discuss...

1 - Add option for API Key entry. (currently you need to update main.js manually to add your API key)
2 - Support more than just finding PNG files
3 - Report verification results on all PNG files not just 1
4 - Currently Seals must be publicly accessible and are addressed via so called rID. Consider hash addressing
5 - Add option to Register assets on page that don't have a seal
6 - Refactor code
7 - Handle the true false and not found case for seal matching content
