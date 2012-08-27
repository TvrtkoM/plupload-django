var Uploader = window.Uploader = Ember.Application.create();

$.getCookie = function(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = $.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

$.readableFileSize = function(bytes) {
  var res = "", truncateRes, suffix, r;
  truncateRes = function(result) {
    var dotIdx = result.indexOf('.');
    return result.substr(0, dotIdx + 3);
  };
  if (bytes < 1024) {
    res += bytes + ' bytes';
  } else if (bytes > 1024 && bytes < 1048576) {
    r = bytes / 1024;
    res += truncateRes(r.toString()) + ' kB';
  } else if (bytes > 1048576 && bytes < 1073741824) {
    r = bytes / 1048576;
    res += truncateRes(r.toString()) + ' MB';
  } else if (bytes > 1073741824) {
    r = bytes / 1073741824;
    res += truncateRes(r.toString()) + ' GB';
  }
  return res;
}

var pluploader = new plupload.Uploader({
  runtimes: 'html5, flash',
  browse_button: 'file-to-upload',
  url: '/fileupload/upload/',
  flash_swf_url: '/static/plupload/js/plupload.flash.swf',
  multi_selection: false,
  multipart: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRFToken': $.getCookie('csrftoken')
  }
});

pluploader.init();

Uploader.fileInfo = Ember.Object.create({
  fileName:'',
  fileSize:'',
  progressPercent:null,
  fileData: function(key, value) {
    if(arguments.length == 1) {
      return {
        fileName: this.get('fileName'),
        fileSize: this.get('fileSize'),
      };
    } else {
      this.set('fileName', value.fileName);
      this.set('fileSize', value.fileSize);
      this.set('progressPercent', "0%");
      return value;
    }
  }.property('fileName', 'fileSize')
});

Uploader.FileUploadView = Ember.View.extend({
  template: Handlebars.templates.fileupload_tmpl,
  classNames: ['row'],
  readyToUpload: false,
  upload: function(e) {
    pluploader.start();
    e.preventDefault();
  }
});

Uploader.FileInfoView = Ember.View.extend({
  fileSizeBinding: 'Uploader.fileInfo.fileSize',
  fileNameBinding: 'Uploader.fileInfo.fileName',
  progressPercentBinding: 'Uploader.fileInfo.progressPercent',
});

Uploader.fileUploadView = Uploader.FileUploadView.create()
Uploader.fileUploadView.appendTo('.container');

pluploader.bind('FilesAdded', function(up, files) {
  var file = files[0];
  Uploader.fileInfo.set('fileData', { 
    fileName: file.name,
    fileSize: $.readableFileSize(file.size)
  });
  Uploader.fileUploadView.set('readyToUpload', true);
  up.refresh();
});

pluploader.bind('UploadProgress', function(up, file) {
  Uploader.fileInfo.set('progressPercent', file.percent + "%");
});
