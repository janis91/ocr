const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const appInfo = cp.execSync('grep -oPm1 "(?<=<version>)[^<]+" appinfo/info.xml').toString().trim();

console.log('AppInfo: ' + appInfo);

const appInfoFloat = withoutDot(appInfo);

let gitTagOld;
try {
    gitTagOld = cp.execSync('git describe --tags $(git rev-list --tags --max-count=1)').toString().trim();
} catch (e) {
    gitTagOld = 0;
}
console.log('Current git tag:' + gitTagOld);

const gitTagOldFloat = withoutDot(gitTagOld);

if (appInfoFloat > gitTagOldFloat) {
    // git tag with appInfo
    console.log('major or minor version step');
    cp.execSync('git tag ' + appInfo);
} else {
    console.log('they equal or git tag version is higher => patch version step');
    const newVersion = patch(gitTagOld);
    // git tag with newVersion
    console.log('New version: '+ newVersion);
    fs.writeFileSync("new_version", newVersion);
    cp.execSync('git tag ' + newVersion);
    cp.execSync('sed -i \"s\/\\(<version.*>\\)[^<>]*\\(<\\\/version.*\\)\/\\1' + newVersion + '\\2\/\" ' + path.resolve(__dirname, '..\/appinfo\/info.xml'));
}

function patch(v) {
    const parts = v.split('.');
    parts.push(Number.parseInt(parts.pop()) + 1);
    return parts.join('.');
}

function withoutDot(v) {
    const parts = v.split('.');
    return Number.parseFloat(parts.shift() + '.' + parts.join(''));
}