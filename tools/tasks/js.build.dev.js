/**
 * ES6 JavaScript Compiling {Production}
 * @task js.build.prod
 */
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const es = require('event-stream');
const rollup = require('rollup');
const conf = require('../config');

module.exports = () => {

  const isDirectory = source => lstatSync(source).isDirectory();
  const getDirectories = source =>
    readdirSync(source).map(name => join(source, name)).filter(isDirectory);

  const directories = getDirectories(conf.src.extensions);
  const split = path.split('/');
  const extension = split[split.length -1];

  const tasks = directories
    .map(entry => {

      const path = entry.replace(/\\/g, '/');

      return rollup.rollup({
        input: `${path}/${extension}.js`,
      })
        .then(bundle => {
          return bundle.write({
            file: `${conf.dist.dev}${path.split('src/')[1]}/${extension}.js`,
            format: 'cjs',
            sourcemap: true
          });
        })
    });

  return es.merge.apply(tasks);
};
