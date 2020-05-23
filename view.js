const Utility = require('./Utility');

const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const NodeID3 = require('node-id3');
const findFolder = require('node-find-folder');
const findUp = require('find-up');
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
var recursive = require("recursive-readdir");

let regEx, folderpath, propData = [], option, tagValue, foundFolderPath, _chkAlreadyPath; //'D:\/Songs\/2019\/Saaho\/';

regEx = new RegExp("\\\\", "g");
propData = [{ textField: 'album', valueField: 'TALB' },
{ textField: 'bpm', valueField: 'TBPM' },
{ textField: 'composer', valueField: 'TCOM' },
{ textField: 'genre', valueField: 'TCON' },
{ textField: 'copyright', valueField: 'TCOP' },
{ textField: 'date', valueField: 'TDAT' },
{ textField: 'playlistDelay', valueField: 'TDLY' },
{ textField: 'encodedBy', valueField: 'TENC' },
{ textField: 'textWriter', valueField: 'TEXT' },
{ textField: 'fileType', valueField: 'TFLT' },
{ textField: 'time', valueField: 'TIME' },
{ textField: 'contentGroup', valueField: 'TIT1' },
{ textField: 'title', valueField: 'TIT2' },
{ textField: 'subtitle', valueField: 'TIT3' },
{ textField: 'initialKey', valueField: 'TKEY' },
{ textField: 'language', valueField: 'TLAN' },
{ textField: 'length', valueField: 'TLEN' },
{ textField: 'mediaType', valueField: 'TMED' },
{ textField: 'originalTitle', valueField: 'TOAL' },
{ textField: 'originalFilename', valueField: 'TOFN' },
{ textField: 'originalTextwriter', valueField: 'TOLY' },
{ textField: 'originalArtist', valueField: 'TOPE' },
{ textField: 'originalYear', valueField: 'TORY' },
{ textField: 'fileOwner', valueField: 'TOWN' },
{ textField: 'artist', valueField: 'TPE1' },
{ textField: 'performerInfo', valueField: 'TPE2' },
{ textField: 'conductor', valueField: 'TPE3' },
{ textField: 'remixArtist', valueField: 'TPE4' },
{ textField: 'partOfSet', valueField: 'TPOS' },
{ textField: 'publisher', valueField: 'TPUB' },
{ textField: 'trackNumber', valueField: 'TRCK' },
{ textField: 'recordingDates', valueField: 'TRDA' },
{ textField: 'internetRadioName', valueField: 'TRSN' },
{ textField: 'internetRadioOwner', valueField: 'TRSO' },
{ textField: 'size', valueField: 'TSIZ' },
{ textField: 'ISRC', valueField: 'TSRC' },
{ textField: 'encodingTechnology', valueField: 'TSSE' },
{ textField: 'year', valueField: 'TYER' },
{ textField: 'comment', valueField: 'COMM' },
{ textField: 'image', valueField: 'APIC' },
{ textField: 'unsynchronisedLyrics', valueField: 'USLT' },
{ textField: 'userDefinedText', valueField: 'TXXX' },
];

propData.forEach((prop) => {
    option = document.createElement("OPTION");
    option.innerHTML = prop.textField;
    option.value = prop.valueField;
    if (prop.valueField === 'TALB')
        option.selected = true;
    document.getElementById('Ddl_Organize').options.add(option);
})

$('#Btn_Submit').on('click', () => {
    folderpath = $('#FilePath').val();
    _alreadyFolderPath = $('#FilePath').val();
    folderpath = folderpath.replace(regEx, "/");
    tagValue = $('#Ddl_Organize').val();
    _chkAlreadyPath = $('#Chk_AlreadyPath[type=checkbox]').prop('checked');

    fs.readdir(folderpath, { encoding: 'utf8', withFileTypes: false }, (err, files) => {
        if (err)
            alert(err);

        files.forEach(file => {
            fs.stat(folderpath + '\/' + file, (err, stats) => {
                if (!stats.isDirectory()) {
                    NodeID3.read(folderpath + '\/' + file, function (err, fileTags) {
                        if (err)
                            alert(err);
                        if (fileTags.raw[tagValue]) {
                            // alert(folderpath + '\/' + fileTags.raw[tagValue]);
                            // foundFolderPath = new findFolder(folderpath + '\/' + file);
                            let _dirExists = Utility.directoryExists(_alreadyFolderPath, fileTags.raw[tagValue], file);
                            alert('dir' + ' - ' + _dirExists);
                            if (_dirExists)
                                moveFile(folderpath + '\/' + file, _dirExists);
                            else if (!fs.existsSync(folderpath + '\/' + fileTags.raw[tagValue])) {
                                fs.mkdirSync(folderpath + '\/' + fileTags.raw[tagValue]);
                                moveFile(folderpath + '\/' + file, folderpath + '\/' + fileTags.raw[tagValue]);
                            } else {
                                moveFile(folderpath + '\/' + file, folderpath + '\/' + fileTags.raw[tagValue]);
                            }
                        }
                    });
                }
            });
        });
    });
});

$('#Chk_AlreadyPath').on('click', () => {
    // document.getElementById('Txt_AlreadyPath').disabled = true;
    // _chkAlreadyPath = $('#Chk_AlreadyPath[type=checkbox]').prop('checked');
    // if (_chkAlreadyPath)
    //     $("#Txt_AlreadyPath").attr('disabled', 'disabled');
    // else
    //     $("#Txt_AlreadyPath").removeAttr('disabled');
});

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
};

function getAllFiles(dirPath) {
    fs.readdirSync(dirPath).forEach(function (file) {
        let filepath = path.join(dirPath, file);
        let stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            getAllFiles(filepath);
        } else {
            console.info(filepath + '\n');
        }
    });
}

//moves the $file to $dir2
var moveFile = (file, dir2) => {
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);

    fs.rename(file, dest, (err) => {
        if (err) alert(err);
    });
};

var getDirs = function (rootDir, cb) {
    fs.readdir(rootDir, function (err, files) {
        var dirs = [];
        for (var index = 0; index < files.length; ++index) {
            var file = files[index];
            if (file[0] !== '.') {
                var filePath = rootDir + '/' + file;
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        dirs.push(this.file);
                    }
                    if (files.length === (this.index + 1)) {
                        return cb(dirs);
                    }
                }.bind({ index: index, file: file }));
            }
        }
    });
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(path => fs.statSync(path).isDirectory());
}

const directories = source => fs.readdirSync(source, {
    withFileTypes: true
}).reduce((a, c) => {
    c.isDirectory() && a.push(c.name)
    return a
}, [])

var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};