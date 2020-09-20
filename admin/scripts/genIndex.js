/**
 * Generate index.tsx
 */
const fs = require('fs');
const path = require('path');
var folder = './src/';
var exports = '// Auto generated file\n';
exports += '// Run command `node .\\scripts\\generatePublicApi.js`\n\n';

function prepareFiles(dir) {
  console.log('prepareFiles', dir);
  var files = fs.readdirSync(dir);
  files.forEach((file) => {
    var filePath = dir + path.sep + file;
    var stat = fs.lstatSync(filePath);
    var parsed = path.parse(file);
    //console.log('parsed', dir, file);
    //console.log('parsed', parsed);
    if (stat.isFile() && filePath.indexOf('spec.ts') == -1 && ['.ts','.tsx'].indexOf(parsed.ext) != -1) {
      filePath = filePath.replace(folder, '').replace(/\\/gim, '/').replace('.tsx', '').replace('.ts', '');
      exports += "export * from '." + filePath + "';\n";
      //exports += "export * as " + parsed.name.replace('.tsx', '').replace('.ts', '') + " from '." + filePath + "';\n";
      return;
    }
    if (stat.isDirectory()) prepareFiles(filePath);
  });
}
prepareFiles(folder + '/assets');
prepareFiles(folder + '/business');
prepareFiles(folder + '/data');
prepareFiles(folder + '/ui');
fs.writeFileSync(folder + '/index.ts', exports);
console.log(exports);
