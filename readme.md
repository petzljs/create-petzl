# create-quyz

#### Note: 99% of the work in this package was done by [@sindresorhus](https://github.com/sindresorhus) who does amazing things for the JS community. Be sure to check out his work.

> Add [quyz](https://github.com/quyz-js/quyz) to your project

## CLI

```
$ npm init quyz [options]
```

## API

```
$ npm install create-quyz
```

### Usage

```js
const createPetzl = require("create-quyz");

(async () => {
    await createQuyz();
})();
```

### createQuyz(options?)

Returns a `Promise`.

#### options

Type: `object`

#### cwd

Type: `string`<br>
Default: `process.cwd()`

Current working directory.

#### args

Type: `string[]`<br>
Default: CLI arguments _(`process.argv.slice(2)`)_

For instance, with the arguments `['--foo', '--bar']`, the following will be put in package.json:

```json
{
    "name": "awesome-package",
    "scripts": {
        "test": "quyz --foo --bar"
    }
}
```
