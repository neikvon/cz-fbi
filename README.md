# @peak-stone/cz-fbi

Commitizen adapter formatting commit messages

## usage

```bash
$ npm i -D @peak-stone/cz-fbi
```

```js
const { bootstrap } = require('@peak-stone/commitizen-promise/dist/cli/git-cz')

bootstrap({
  cliPath: 'node_modules/@peak-stone/commitizen-promise',
  config: {
    path: 'node_modules/@peak-stone/cz-fbi'
  }
})
```
