const FUNCTIONS_BASE_DIR = 'functions';
const FUNCTIONS_OUT_DIR = 'out/functions';

const glob = require('glob');
const esbuild = require('esbuild');
const packageJson = require('../package.json');

// we'll fetch all the dependencies listed in the "dependencies" 
// section of the package.json to not bundle these because they'll be installed
// as dependencies in Functions
const dependencies = Object.keys(packageJson).dependencies;

// search for all JavaScript files in the base directory to make sure they get
// compiled and result in separate files
const functionsFiles = glob.sync(FUNCTIONS_BASE_DIR + '/**/*.js');

const watch = process.argv.includes('--watch');
if (watch) {
  console.log('Running in watch mode')
}

esbuild.build({
  entryPoints: functionsFiles,
  bundle: true,
  platform: 'node',
  external: dependencies,
  target: ['node14'],
  format: 'cjs',
  outdir: FUNCTIONS_OUT_DIR,
  watch
}).catch(() => process.exit(1))