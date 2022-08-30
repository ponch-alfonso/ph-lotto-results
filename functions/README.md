# daily-pcso-cloud-functions
Backend, Firebase cloud functions, for daily-pcso app.

## Testing

#### Running the emulators (firestore and functions):
``` sh
firebase emulators:start --project daily-pcso
```

#### Triggering the scrapper via an API call:

* Add this in `functions/index.js`: 

``` js
exports.addMessage = functions.https.onRequest((req, res) => {
    pushYesterdaysResults();
    res.status(200).send('Woohoo');
});
```
* Call the API by opening this link in the browser: 
    * `http://127.0.0.1:5001/daily-pcso/us-central1/addMessage`.


## Debugging 

#### pwa is not loading, just shows spinner.
 
* Request is getting auth error, check the rules in `firestore.rules`.