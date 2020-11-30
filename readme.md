# create-petzl

#### Note: 99% of the work in this package was done by @sindresorhus who does amazing things for the JS community. Be sure to check out his work.

> Add [petzl](https://github.com/petzljs/petzl) to your project

## CLI

```
$ npm init petzl [options]
```

## API

```
$ npm install create-petzl
```

### Usage

```js
const createPetzl = require("create-petzl");

(async () => {
    await createPetzl();
})();
```

### createPetzl(options?)

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
        "test": "petzl --foo --bar"
    }
}
```
