const readPkg = require('read-pkg-up')
const truncate = require('cli-truncate')
const wrap = require('wrap-ansi')
const defaultTypes = require('./types')

const isWin = process.platform === 'win32'

function getTypeChoices (types) {
  const maxNameLength = types.reduce(
    (maxLength, type) =>
      (type.name.length > maxLength ? type.name.length : maxLength),
    0
  )

  return types.map(choice => ({
    name: `${choice.name.padEnd(maxNameLength, ' ')}  ${isWin ? ':' : choice.emoji || ':'}  ${choice.description}`,
    value: choice.name
  }))
}

function createQuestions (res) {
  const configs = res && res.pkg && res.pkg['cz-fbi'] ? res.pkg['cz-fbi'] : {}
  const types = configs.types || defaultTypes

  return [
    {
      type: 'list',
      name: 'type',
      message: 'type of change      (required):',
      choices: getTypeChoices(types),
      pageSize: 10
    },
    {
      type: configs.scopes ? 'list' : 'input',
      name: 'scope',
      message: 'affected scope      (optional):',
      choices: configs.scopes &&
        [{ name: '[none]', value: '' }].concat(configs.scopes)
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
    const issuesIds = issues.match(/#\d+/g)
    if (issuesIds) {
      commit += '\n\n' + issuesIds.map(issue => `fixed ${issue}`).join(', ')
    }
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
