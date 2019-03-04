'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const _ = require('lodash');
const gulp = require('gulp');
const cfg = require('./config');

const fsReaddir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);

const diffDir = path.join(cfg.paths.i18n, 'diff');
const importDir = path.join(cfg.paths.i18n, 'import');
const readyDir = path.join(cfg.paths.i18n, 'ready');
const sourceDir = path.join(cfg.paths.i18n, 'source');

const baseLang = 'en';
const diffTree = {};
const queue = [];

const buildTreeFromDir = dirName => {
    return fsReaddir(dirName)
        .then(files => {
            const tree = {};

            _.each(files, file => {
                const fileName = path.basename(file, '.json');
                tree[fileName] = require(path.resolve(dirName, file));
            });

            return tree;
        });
};

gulp.task('i18n-diff', done => {
    buildTreeFromDir(sourceDir)
        .then(tree => {
            const baseMap = tree[baseLang];
            const langs = _.chain(tree).keys().without(baseLang).value();

            _.each(baseMap, (value, key) => {
                _.each(langs, lang => {
                    const langValue = tree[lang][key];
                    if (langValue == null || langValue === '') {
                        diffTree[lang] = diffTree[lang] || {};
                        diffTree[lang][key] = {
                            [baseLang]: value,
                            [lang]: ''
                        };
                    }
                });
            });

            _.each(langs, lang => {
                queue.push(writeFile(
                    path.resolve(diffDir, `${lang}.json`),
                    JSON.stringify(diffTree[lang], null, 4)
                ));
            });

            return Promise.all(queue).then(() => done());
        });
});

gulp.task('i18n-import', done => {
    buildTreeFromDir(importDir)
        .then(tree => {
            const langs = _.keys(tree);
            const baseMap = require(path.resolve(sourceDir, `${baseLang}.json`));
            const baseMapKeys = _.keys(baseMap);

            _.each(langs, lang => {
                let langMap = require(path.resolve(sourceDir, `${lang}.json`));
                let translation;

                if (!langMap) {
                    return;
                }

                _.each(tree[lang], (value, key) => {
                    if (translation = value[lang]) {
                        langMap[key] = translation;
                    }
                });

                langMap = _.chain(langMap).pairs().sortBy(pair => baseMapKeys.indexOf(pair[0])).object().value();

                console.log(JSON.stringify(langMap, null, 4));
            });

            done();
        });
});
