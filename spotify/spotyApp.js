const fetch = require("node-fetch");
var btoa = require('btoa');

const APPController = (function() {
    
    const clientId = 'efd093599e78473cba0bf2f430a1d23b';
    const clientSecret = '47d62254a879473d975377fee1b211be';

    // private methods

    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();

        return data.access_token;
        
    } 


    const _getReleases = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/new-releases?country=IT&limit=10`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.albums.items;
    }

    // return

    return {
        getToken() {
            return _getToken();
        }, 
        getReleases(token) {
            return _getReleases(token);
        }
    }


})();


module.exports.APPController = APPController;
