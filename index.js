const readPkg = require('read-pkg-up')
const truncate = require('cli-truncate')
const wrap = require('wrap-ansi')
const types = require('./types')

const isWin = process.platform === 'win32'

function getChoices (types) {
  const maxNameLength = types.reduce(
    (maxLength, type) =>
      (type.name.length > maxLength ? type.name.length : maxLength),
    0
  )

  return types.map(choice => ({
    name: `${choice.name.padEnd(maxNameLength, ' ')}  ${isWin ? ':' : choice.emoji}  ${choice.description}`,
    value: choice.name
  }))
}

function createQuestions (res) {
  const config = res && res.pkg ? res.pkg.config || {} : {}
  const emojiConfig = config['cz-fbi'] || {}

  return [
    {
      type: 'list',
      name: 'type',
      message: 'type of change      (required):',
      choices: getChoices(emojiConfig.types || types)
    },
    {
      type: emojiConfig.scopes ? 'list' : 'input',
      name: 'scope',
      message: 'affected scope      (optional):',
      choices: emojiConfig.scopes &&
        [{ name: '[none]', value: '' }].concat(emojiConfig.scopes)
    },
    {
      type: 'input',
      name: 'subject',
      message: 'short description   (required):',
      validate: function (answer) {
        if (!answer) {
          return 'You must write a short description'
        }
        return true
      }
    },
    {
      type: 'input',
      name: 'body',
      message: 'longer description  (optional):'
      // \n - first \n - second \n - third
    },
    {
      type: 'input',
      name: 'issues',
      message: 'issue closed        (optional):'
    },
    {
      type: 'input',
      name: 'breaking',
      message: 'breaking change     (optional):'
    }
  ]
}

function format (answers) {
  const scope = answers.scope ? '(' + answers.scope.trim() + ')' : ''

  let commit = truncate(
    answers.type + scope + ': ' + answers.subject.trim(),
    100
  )

  const body = wrap(answers.body, 100)
  if (body) {
    commit += '\n\n' + body
  }

  const issues = wrap(answers.issues, 100)
  if (issues) {
    commit += '\n\n' + issues
  }

  let breaking = answers.breaking.trim()
  breaking = breaking
    ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '')
    : ''
  breaking = wrap(breaking, 100)
  if (breaking) {
    commit += '\n\n' + breaking
  }

  return commit
}

module.exports = {
  prompter: (cz, commit) => {
    readPkg().then(createQuestions).then(cz.prompt).then(format).then(commit)
  }
}
