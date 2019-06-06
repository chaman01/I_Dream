const Config             = require('../../config'),
    UniversalFunctions = require('../../utils/universalFunctions'),
    async              = require('async'),
    Path               = require('path'),
    Thumbler           = require('thumbler'),
    fsExtra            = require('fs-extra'),
    Fs                 = require('fs'),
    AWS                = require("aws-sdk"),
    mime               = require('mime-types'),
    getVideoInfo       = require('get-video-info');


AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});
var s3 = new AWS.S3();
function uploadMultipart(fileInfo, uploadCb) {
    var options = {
        Bucket: process.env.BUCKET_NAME,
        Key: "images/"+fileInfo.filename,
        ACL: 'public-read',
        ContentType: mime.lookup(fileInfo.filename),
        ServerSideEncryption: 'AES256'
    };

    s3.createMultipartUpload(options, (mpErr, multipart) => {
        if (!mpErr) {
            Fs.readFile(fileInfo.path, (err, fileData) => {

                var partSize = 5242880;
                var parts = Math.ceil(fileData.length / partSize);

                async.times(parts, (partNum, next) => {

                    var rangeStart = partNum * partSize;
                    var end = Math.min(rangeStart + partSize, fileData.length);
                    partNum++;
                    async.retry((retryCb) => {
                        s3.uploadPart({
                            Body: fileData.slice(rangeStart, end),
                            Bucket:process.env.BUCKET_NAME,
                            Key:"images/"+fileInfo.filename,
                            PartNumber: partNum,
                            UploadId: multipart.UploadId
                        }, (err, mData) => {
                            retryCb(err, mData);
                        });
                    }, (err, data) => {
                        console.log(data);
                        next(err, {ETag: data.ETag, PartNumber: partNum});
                    });

                }, (err, dataPacks) => {
                    s3.completeMultipartUpload({
                        Bucket:process.env.BUCKET_NAME,
                        Key:"images/"+fileInfo.filename,
                        MultipartUpload: {
                            Parts: dataPacks
                        },
                        UploadId: multipart.UploadId
                    }, uploadCb);
                });
            });
        } else {
            uploadCb(mpErr);
        }
    });
}

function uploadFile1(fileObj, uploadCb) {

    var fileName = Path.basename(fileObj.finalUrl);
    var stats = Fs.statSync(fileObj.path);

    var fileSizeInBytes = stats["size"];

    if (fileSizeInBytes < 5242880) {
        async.retry((retryCb) => {
            Fs.readFile(fileObj.path, (err, fileData) => {
                s3.putObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: "images/"+fileName,
                    Body: fileData,
                    ContentType: mime.lookup(fileName),
                    ACL: 'public-read',
                    ServerSideEncryption: 'AES256'
                }, retryCb);
            });
        }, uploadCb);
    } else {
        fileObj.filename = fileName;
        uploadMultipart(fileObj, uploadCb)
    }
}


var uploadFilesOnS3 = function (fileData, callback) {

    var imageFile = false;
    var filename;
    var ext;
    var dataToUpload = []
    if (!fileData || !fileData.filename) {
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
    } else {
        filename = fileData.filename.toString();
        ext = filename.substr(filename.lastIndexOf('.'))
        var videosFilesExt = ['.3gp', '.3GP', '.mp4', '.MP4', '.avi', '.AVI'];
        var imageFilesExt = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.gif', '.GIF'];
        if (ext) {
            if (imageFilesExt.indexOf(ext) >= 0) {
                imageFile = true
            } else {
                if (!(videosFilesExt.indexOf(ext) >= 0)) {
                    return callback()
                }
            }
        } else {
            return callback()
        }
    }

    fileData.original = UniversalFunctions.getFileNameWithUserId(false, filename);
    fileData.thumb = UniversalFunctions.getFileNameWithUserId(true, imageFile && filename || (filename.substr(0, filename.lastIndexOf('.'))) + '.jpg');
    dataToUpload.push({
        path: Path.resolve('.') + '/uploads/' + fileData.thumb,
        finalUrl: process.env.BUCKET_URL + fileData.thumb,
    })

    dataToUpload.push({
        path: fileData.path,
        finalUrl: process.env.BUCKET_URL + fileData.original
    })


    async.auto({
        checkVideoDuration: function (cb) {
            if (!imageFile) {
                getVideoInfo(fileData.path).then(info => {
                    if (info.format.duration < 10) {
                        cb()
                    } else {
                        cb()
                    }
                })
            } else {
                cb()
            }
        },
        creatingThumb: ['checkVideoDuration', function (err,cb) {
            if (imageFile) {
                console.log('=======  IMAGE ===============')
                createThumbnailImage(fileData.path, Path.resolve('.') + '/uploads/' + fileData.thumb, function (err) {
                    cb()
                })
            } else {
                // cb()
                createVideoThumb(fileData, Path.resolve('.') + '/uploads/' + fileData.thumb, function (err) {
                    cb()
                })
            }
        }],
        uploadOnS3: ['creatingThumb', function (err,cb) {
            var functionsArray = [];

            dataToUpload.forEach(function (obj) {
                functionsArray.push((function (data) {
                    return function (internalCb) {
                        uploadFile1(data, internalCb)
                    }
                })(obj))
            });

            async.parallel(functionsArray, (err, result) => {
                deleteFile(Path.resolve('.') + '/uploads/' + fileData.thumb);
                cb(err)
            })

        }]
    }, function (err) {
        let responseObject = {
            original:fileData.original,
            thumbnail:fileData.thumb
        };
        callback(err, responseObject);
    })
};

function deleteFile(path) {
    fsExtra.remove(path, function (err) {
        console.log('error deleting file>>', err)
    });
}


function createThumbnailImage(originalPath, thumbnailPath, callback) {
    var gm = require('gm').subClass({imageMagick: true});

    var readStream = Fs.createReadStream(originalPath);
    gm(readStream)
        .size({bufferStream: true}, function (err, size) {
            console.log("sixw***********",size)
            if (size){
                this.thumb(size.width ,size.height,thumbnailPath,50,
                    function (err, data) {
                        callback()
                    })
            }
        });
}

function createVideoThumb(fileData, thumbnailPath, callback) {

    Thumbler({
        type: 'video',
        input: fileData.path,
        output: thumbnailPath,
        time: '00:00:03',
        size: '300x200'
    }, function (err) {
        callback(err)
    });

}

module.exports = {
    uploadFilesOnS3: uploadFilesOnS3
}
