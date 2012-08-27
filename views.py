from django.http import HttpResponse
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_protect

from fileupload.models import FileUpload

class UploadView(TemplateView):
    template_name = "fileupload.html"

@csrf_protect
def upload(request):
    if request.method == 'POST':
        f = request.FILES['file']
        FileUpload.objects.create(file=f)
        return HttpResponse('OK')
    return HttpResponse('Not OK')

