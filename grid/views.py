from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.views import View
from .models import Horse
import json


def index(request):
    return render(request, 'index.html')


class HorseView(View):

    def get(self, request):
        data = list(Horse.objects.all().values())
        return JsonResponse({"success": True, "data": data})

    def post(self, request):
        try:
            data = json.loads(request.body)["data"]
            created_records = []
            for record in data:
                del record["id"]
                del record["expanded"]
                horse = Horse.objects.create(**record)
                created_records.append(model_to_dict(horse))
            return JsonResponse({"success": True, "data": created_records})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    def patch(self, request):
        try:
            data = json.loads(request.body)["data"]
            updated_records = []
            for record in data:
                horse_id = record["id"]
                Horse.objects.filter(id=horse_id).update(**record)
                horse = Horse.objects.get(pk=horse_id)
                updated_records.append(model_to_dict(horse))
            return JsonResponse({"success": True, "data": updated_records})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    def delete(self, request):
        try:
            data = json.loads(request.body)
            ids_to_delete = data["ids"]
            for x in ids_to_delete:
                Horse.objects.filter(id=x).delete()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
