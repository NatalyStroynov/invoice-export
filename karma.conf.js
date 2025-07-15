module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            { pattern: 'src/**/*.ts' } // include all TS files
        ],
        preprocessors: {
            'src/**/*.ts': ['karma-typescript']
        },
        reporters: ['progress', 'karma-typescript'],
        browsers: ['Chrome'],
        singleRun: true
    });
};