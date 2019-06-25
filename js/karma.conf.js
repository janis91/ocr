const realBrowser = String(process.env.BROWSER).match(/^(1|true)$/gi);
const travisLaunchers = {
    chrome_travis: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
    }
};
let local_chrome = 'ChromeHeadless';

if (process.argv.some(isDebug)) {
    local_chrome = 'Chrome';
}

const localBrowsers = realBrowser ? Object.keys(travisLaunchers) : [local_chrome];

module.exports = (config) => {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-typescript',
            'karma-spec-reporter',
            'karma-coverage'
        ],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json",
        },
        client: {
            // leave Jasmine Spec Runner output visible in browser
            clearContext: false,
            captureConsole: false,
        },
        files: ['test/fixtures/global.js', { pattern: 'src/**/*.ts' }, { pattern: 'test/**/*.ts' }],
        preprocessors: {
            'src/**/*.ts': ['karma-typescript', 'coverage'],
            'test/**/*.ts': ['karma-typescript']
        },
        reporters: ['spec', 'karma-typescript', 'coverage'],
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: localBrowsers,
        singleRun: true,
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/',
            subdir: 'report-lcov'
        }
    })
};

function isDebug(argument) {
    return argument === '--debug';
}