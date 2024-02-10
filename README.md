# Ph Lotto Results

App for getting pcso results and showing it in a more accessible manner.

- Better UI, UX
- Offline support (PWA)

Split into

- `app`: Front-end, react app.
- `functions`: Backend-end, Firebase functions.

## Road Map

### MVP:

- [x] Cleanup
- [x] Deploy APP
  - [x] Refactor to Vite or Next.js
- [ ] Add host name #23
- [x] Configure app check
  - [x] Add limits on firebase:
    - Only budgets - are not always hard limits.
  - [x] Add reporting when function fails -
    - Add email notification, install google cloud app
- [ ] Cleanups #24
- [ ] Add Ads #25
- [ ] Show current date as waiting results #27
- [ ] Get old data #26
- [ ] SEO optimize #29

### Post MVP:

#### Maintenance:

- Add test code unit/functional testing.
- CI/CD: Github actions.
- Update libraries (ie firebase to latest)

#### Features:

- Add notifications
