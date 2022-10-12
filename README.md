# Serverless Bundling Demo

## Background

This project shows how you can split your Twilio Functions & Assets project into multiple files without increasing the amount of Functions you actually deploy. This is helpful as it can help you with being able to better re-use code and test your code without creating additional Functions or using private Assets. [Check out the details below for a more detailed explanation](#details).

## Setup

```bash
git clone git@github.com:twilio-labs/serverless-bundling-demo.git
cd serverless-bundling-demo
npm install
```

## Local Development

```bash
npm start
```

## Deploying

### Option 1: Without the Twilio CLI

```bash
npx configure-env
npm run deploy
```

### Option 2: With the Twilio CLI

```bash
npm run build
twilio serverless:deploy
```

## Details

This project uses [`esbuild`](https://esbuild.github.io/) as it's a fast JavaScript bundler but the concept can be applied to other bundlers & compilers as well.

All endpoints that we want to deploy remain in the `functions/` folder. When `npm run build` or `npm run watch` are executed (or by proxy `npm run deploy` / `npm start` by proxy) `esbuild` gets kicked off to create new JavaScript output files in `out/functions`. The `.twilioserverlessrc` file points to the `functionsFolder` to be located at `out/functions`.

The build script is located at `scripts/build.js` and fetches automatically every Function inside the `functions/` directory to be compiled.

To use a file that you don't want to have deployed as a Function you can put them in any directory that is **not** `functions/` or `assets/` such as `utils/`. From here you can require any external file the way you'd with a regular Node.js project, for example: `require('../utils/greeting')`.

When the build script gets run it will automatically inline this code into your Functions code. External npm dependencies will not be inlined as long as they are part of the `dependencies` field of your `package.json`.

Any `require` or `import` that does not use strings as direct arguments will not be bundled. For example `require('../utils/greeting.js')` will be bundled but `require(Runtime.getAssets['/some-private-asset.js'].path)` will not be bundled. So your existing functionality should not be impacted.

Also since `esbuild` can handle both ES Modules and CommonJS you can, as a side effect of this work, also use ES Modules syntax in your code. See `functions/hello-world-esm.js` as an example. **Important** this code will still be compiled to CommonJS syntax for deployment.

## Limitations

- Depending on your shared code files your Function files might grow but should still execute faster than external requires
- `esbuild` will add some necessary boiler plate code during the bundling that might grow your Functions file size
- As your Functions grow with bundling you might reach the max filesize limit for Functions. One way to reduce the risk is to use `esbuild`'s tree shaking capabilities
- If you want to use `esbuild`'s tree shaking capabilities you have write your Function and the share code files in ES Modules syntax

## Add to your own project

1. Install the following devDependencies: `npm install -D esbuild glob`
2. Copy the contents of `script/build.js` into your own project either at the same location or your own preferred location.
3. Adjust paths in the `build.js` file if you put it in a different location
4. Update `.twilioserverlessrc` to include `"functionsFolder": "out/functions",` and make sure to commit the changes.
5. Add to the `"scripts"` section of your `package.json` the following lines:

```diff
+ "build": "node scripts/build.js",
+ "watch": "node scripts/build.js --watch",
- "start": "twilio-run",
+ "start": "npm run watch & twilio-run",
```

## License

MIT
