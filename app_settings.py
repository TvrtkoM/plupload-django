from django.conf import settings

RENAMETOSLUG = getattr(settings, 'FILEUPLOAD_RENAMETOSLUG', True)