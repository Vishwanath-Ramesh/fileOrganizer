const fs = require('fs');
const path = require('path');

const moveAlreadyExists = function (dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = moveAlreadyExists(dir + '/' + file, filelist);
        }
        else {
            filelist.push(file);
        }
    });
    return filelist;
};

const directoryExists = function (_path, _dirName, ttt) {
    var files = fs.readdirSync(_path);
    var _folderPath = _folderPath || '';
    return files.some(function (file) {
        alert(file);
        if (fs.statSync(_path + '/' + file).isDirectory()) {
            if (path.basename(_path + '/' + file) == _dirName) {
                // alert(path.basename(_path + '/' + file) + ' ' + _dirName);
                _folderPath = path.join(_path, file);
                alert('exists')
                return true;
            }
            else
                directoryExists(_path + '/' + file, _dirName, ttt);
        }
    });
    // alert(file);
    return _folderPath;
};

module.exports = { moveAlreadyExists, directoryExists };