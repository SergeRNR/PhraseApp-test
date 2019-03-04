'use strict';

/**
 *  This file contains the variables and functions used in other
 *  gulp files which defines tasks.
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

const _ = require('lodash');


exports.isProd = process.env.NODE_ENV === 'production';
exports.serverName = 'tu-dev-server';

exports.bundleTypes = {
    APP: 'app',
    VENDOR: 'vendor'
};

const templateModes = exports.templateModes = [
    {name: 'normal', cacheSuffix: '', indexSuffix: ''},
    {name: 'mobile', cacheSuffix: '-mobile', indexSuffix: ''},
    {name: 'hybrid', cacheSuffix: '-mobile', indexSuffix: '-hybrid'},
];

/**
 *  The main paths of your project handle these with care
 */
const paths = exports.paths = {
    src: 'src',
    cfg: 'config',
    tmp: '.tmp',
    dist: 'dist',
    e2e: 'test/e2e',
    allure: 'allure-results',
    modules: 'node_modules',
    i18n: 'i18n'
};

exports.taskPaths = {
    scripts: {
        coffee: {
            src: `${paths.src}/app/**/*.coffee`,
            dest: `${paths.tmp}/serve/app`
        },
        js: {
            src: `${paths.src}/app/**/*.js`
        },
        vendor: {
            src: `${paths.src}/vendor/**/*.js`,
            dest: `${paths.tmp}/serve/vendor`
        },
        bundles: {
            dest: `${paths.tmp}/serve`,
            dist: paths.dist
        },
        lintResults: `${paths.tmp}/lint-results.json`,
        vendorUpdate: `${paths.tmp}/last-vendor-update.tmp`,
        dist: `${paths.dist}/scripts`
    },
    styles: {
        base: `${paths.src}/app`,
        inject: `${paths.src}/app/**/*.scss`,
        src: `${paths.src}/app/index.scss`,
        dest: `${paths.tmp}/serve/app`,
        dist: `${paths.dist}/styles`
    },
    templates: {
        src: _.map(templateModes, mode =>
            `${mode.cacheSuffix ? '!' : ''}${paths.src}/app/**/*${mode.cacheSuffix}.html`
        ),
        dest: `${paths.tmp}/serve/app`,
        modeSrc: mode => mode !== templateModes[0] ? `${paths.src}/app/**/*${mode.cacheSuffix}.html` : null,
        cache: mode => `${paths.tmp}/.${mode.name}`,
        baseName: 'templates'
    },
    iconfont: {
        src: `${paths.src}/local-assets/svg-icons/*.svg`,
        dest: `${paths.tmp}/serve/fonts`,
        cssTemplate: `${paths.src}/local-assets/svg-icons/icons.css.template`,
        cssDest: `${paths.tmp}/serve/app`,
        dist: `${paths.dist}/fonts`
    },
    inject: {
        src: `${paths.src}/index.html`,
        dest: `${paths.tmp}/serve`,
        dist: paths.dist
    }
};

exports.watchOpts = {
    usePolling: true,
    interval: 400,
    delay: 200
};
