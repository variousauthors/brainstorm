var Generator = require('yeoman-generator');
var { defaultTo, isEmpty } = require('lodash')

class Base extends Generator {
  updateRootManifest (basepath, ComponentName) {
    const rootManifestPath = `${basepath}/index.ts`

    if (this.manifestExists(basepath)) {
      this.fs.append(rootManifestPath, `export * from './${ComponentName}'`)
    } else {
      this.fs.copyTpl(
        this.templatePath('manifest.template'),
        this.destinationPath(rootManifestPath),
        {
          moduleNames: [ComponentName]
        }
      );
    }
  }

  createComponent () {
    const { pathname, ComponentName } = this

    this.fs.copyTpl(
      this.templatePath('component.template'),
      this.destinationPath(`${pathname}/${ComponentName}.tsx`),
      {
        ComponentName,
        propsInterfaceName: `I${ComponentName}Props`,
        pathname,
      }
    );
  }

  createManifest () {
    const { pathname, ComponentName } = this

    this.fs.copyTpl(
      this.templatePath('manifest.template'),
      this.destinationPath(`${pathname}/index.ts`),
      {
        moduleNames: [ComponentName]
      }
    );
  }

  createStorybook () {
    const { pathname, ComponentName } = this

    this.fs.copyTpl(
      this.templatePath('storybook.template'),
      this.destinationPath(`${pathname}/${ComponentName}.stories.tsx`),
      {
        ComponentName,
      }
    );
  }

  createSubComponentsFolder () {
    const { pathname } = this

    this.fs.copyTpl(
      this.templatePath('manifest.template'),
      this.destinationPath(`${pathname}/components/index.ts`),
      {
        moduleNames: []
      }
    );
  }

  createSpecializations () {
    const { pathname, ComponentName } = this
    const SpecializedName = `${ComponentName}WebClient`

    // create the specialization component
    this.fs.copyTpl(
      this.templatePath('specialization.template'),
      this.destinationPath(`${pathname}/specializations/${SpecializedName}.tsx`),
      {
        ComponentName,
        specializer: 'agencyAngularize',
        SpecializedName
      }
    );

    // export it from the manifest
    this.fs.copyTpl(
      this.templatePath('manifest.template'),
      this.destinationPath(`${pathname}/specializations/index.ts`),
      {
        moduleNames: [SpecializedName]
      }
    );

    // update the parent manifest
    this.fs.copyTpl(
      this.templatePath('manifest.template'),
      this.destinationPath(`${pathname}/index.ts`),
      {
        moduleNames: ['specializations']
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
    this.argument("path", { type: String, required: true });
  }
  async prompting() {
    this.answers = await this.prompt([{
      type: 'input',
      name: 'componentName',
      message: 'The name of your component.\nFor example, StudentEnrollmentDocuments',
    }, {
      type: 'input',
      name: 'domainName',
      message: 'The business domain your component belongs to.\nFor example, StudentEnrollment.',
    }]);
  }

  writing() {
    /** @TODO need to be able to enter a name like client/Bob
     * and get a path like src/client/components/Bob
     * or maybe have another prompt: client, common?
     */
    const DomainName = defaultTo(this.answers.domainName, '')
    const ComponentName = this.answers.componentName
    const basepath = `${this.options.path}/${DomainName}`
    const pathname = `${basepath}/${ComponentName}`

    console.log(basepath, pathname, DomainName, ComponentName)

    this.rootPath = this.options.path
    this.pathname = pathname
    this.ComponentName = ComponentName

    if (this.manifestExists(pathname)) {
      console.log('component exists')
      return
    }

    if (!isEmpty(DomainName)) {
      if (this.manifestExists(basepath)) {
        // we are dealing with an existing domain
      } else {
        this.updateRootManifest(this.rootPath, DomainName)
      }
    }

    this.updateRootManifest(basepath, ComponentName)

    this.createComponent()
    this.createStorybook()
    this.createManifest()

    this.createSubComponentsFolder()
    this.createSpecializations()
  }
}
