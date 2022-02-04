var Generator = require('yeoman-generator');
var { upperFirst } = require('lodash')
var find = require('findit')
var path = require('path')

class Base extends Generator {
  createOrUpdateManifest () {
    const { pathToHook, hookName } = this
    const rootManifestPath = `${pathToHook}/index.ts`

    if (this.manifestExists(pathToHook)) {
      this.fs.append(rootManifestPath, `export * from './${hookName}'`)
    } else {
      this.fs.copyTpl(
        this.templatePath('manifest.template'),
        this.destinationPath(rootManifestPath),
        {
          moduleNames: [hookName]
        }
      );
    }
  }

  createHook () {
    const { pathToHook, hookName, queryName, QueryName, source } = this

    this.fs.copyTpl(
      this.templatePath('hook.template'),
      this.destinationPath(`${pathToHook}/${hookName}.ts`),
      {
        queryName,
        QueryName,
        hookName,
        source,
      }
    );
  }

  manifestExists (pathname) {
    return this.fs.exists(`${pathname}/index.ts`)
  }
}

module.exports = class extends Base {
  constructor (args, opts) {
    super(args, opts)
  }

  async prompting() {
    this.answers = await this.prompt([{
      type: 'input',
      name: 'componentName',
      message: 'Every query in brainstorm starts out as a helper for a specific component.\n\nWhat component are you working on right now?',
    }, {
      type: 'list',
      name: 'source',
      message: 'Which of Edvisor\'s graphql APIs will you be hitting?',
      choices: ['API_SERVER_V2', 'AGENCY_API']
    }, {
      type: 'input',
      name: 'queryName',
      message: 'What query will you be using? For example: agencyCompanyCurrencyRates',
    }]);
  }

  writing() {
    const done = this.async()
    const finder = find('src/')

    this.componentName = this.answers.componentName
    this.queryName = this.answers.queryName
    this.QueryName = upperFirst(this.answers.queryName)
    this.source = this.answers.source
    this.hookName = `use${this.QueryName}`

    finder.on('directory', (dir) => {
      const basename = path.basename(dir)

      if (basename === this.componentName) {
        this.pathToHook = `${dir}/hooks`
        finder.stop()
      }
    });

    finder.on('stop', () => {

      this.createHook()
      this.createOrUpdateManifest()

      done()
    })

    finder.on('end', () => {
      this.log(`It appears ${this.componentName} does not exist. Try generating it with yarn g:component!`)
      done()
    })
  }
}
