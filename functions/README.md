# daily-pcso-cloud-functions

Backend, Firebase cloud functions, for daily-pcso app.

## Testing

#### Running the emulators (firestore and functions):

```sh
firebase emulators:start --project daily-pcso
```

- Call the function by using this test URL this link in the browser:

  - `http://127.0.0.1:5001/daily-pcso/asia-northeast1/testPushYesterdaysResults`.

- Note: Scheduled functions is not testable locally.

## Debugging

#### pwa is not loading, just shows spinner.

- Request is getting auth error, check the rules in `firestore.rules`.
