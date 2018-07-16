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

## Docs
- commit types: 
  - feat: new features
  - fix: bug fixes
  - chore: maintain
  - docs: documentation
  - style: formatting, missing semi colons, …
  - refactor
  - perf: improving performance
  - test: adds or modifies tests
  - revert: reverting changes
  - init: initial commit

## Types customization

```json
{
  "config": {
    "cz-fbi": [
      {
        "emoji": "✨",
        "description": "Introducing new features",
        "name": "feat"
      },
      ...
    ]
  }
}
```
