from django.conf.urls import patterns, include, url

from fileupload.views import UploadView

urlpatterns = patterns('fileupload.views',
    url(r'^upload/$', 'upload', name='upload'),
    url(r'^$', UploadView.as_view(), name='upload_view')
)