from django.db import models
from django.conf import settings
from os import path

class FileUpload(models.Model):
    file = models.FileField(upload_to='uploads')

