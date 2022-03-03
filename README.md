# rubik-dashamail
Dashamail's Bot API kubik for the Rubik

## Install

### npm
```bash
npm i rubik-dashamail
```

### yarn
```bash
yarn add rubik-dashamail
```

## Use
```js
const { App, Kubiks } = require('rubik-main');
const Dashamail = require('rubik-dashamail');
const path = require('path');

// create rubik app
const app = new App();
// config need for most modules
const config = new Kubiks.Config(path.join(__dirname, './config/'));

const dashamail = new Dashamail();

app.add([ config, dashamail ]);

app.up().
then(() => console.info('App started')).
catch(err => console.error(err));
```

## Config
`dashamail.js` config example

module.exports = {
  host: 'https://api.dashamail.com/', // host
  token: 'token' // token
};

```

## Call

```js
...
...

````

## Extensions
Dashamail kubik doesn't has any extension.
