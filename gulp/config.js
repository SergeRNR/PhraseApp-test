'use strict';

/**
 *  The main paths of your project handle these with care
 */
const paths = exports.paths = {
    i18n: 'i18n'
};

exports.taskPaths = {
    i18n: {
        src: `${paths.src}/index.html`,
        dest: `${paths.tmp}/serve`,
        dist: paths.dist
    }
};
