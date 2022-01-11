
Development
-----------

The idea here is to develop in this repo as a kind of component library, and then import into another project.

This creates a little problem: while developing here, you will have react installed... but react is a peer dependency of this project. When you link this project into the parent app, for local testing, if the parent app also includes React, then you will have two versions of react, and this causes problems. To solve this, if your parent app is a react app, then you must link its versions of react and react-dom.

Supposing you are working on brainstorm, and your parent app is `my-react-app` a sibling of this repo.

```
cd ../my-react-app/node_modules/react
yarn link
cd ../react-dom
yarn link
cd ../../brainstorm
yarn link react
yarn link react-dom
```

Otherwise, if you are developing locally, we have installed `yarn-add-no-save` to allow you to install add the peer dependencies. This will eventually be rolled into an install script.

Unfortunately, you have to run `yarn peer` every time you run `yarn install` so we will have to bundle that up. Gosh.