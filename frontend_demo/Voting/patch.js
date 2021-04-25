const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

fs.readFile(f, 'utf8', function (err, data) {
    if (err) {
        return;
    }
    var result = data.replace(/node: false/g, "node: {fs: 'empty', crypto: 'empty', tls: 'empty', net: 'empty'}", );
    fs.writeFile(f, result, 'utf8', function (err) {
        if (err) return;
    });
});