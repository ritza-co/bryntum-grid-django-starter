from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .models import Horse
import json

# Create your views here.

def index(request): 
    return render(request, 'index.html')


@method_decorator(csrf_exempt, name='dispatch')
class HorseView(View):

    def get(self, request): 
        data = list(Horse.objects.all().values())        
        return JsonResponse({"success": True, "data": data})
    
    def post(self, request): 
        data = json.loads(request.body)["data"]
        for record in data: 
            del record["id"]
            horse = Horse.objects.create(**record)
        
        return JsonResponse({
            "success": True,
            "data": [{
                "id": horse.id,
                "name": horse.name,
                "country": horse.country,
                "trainer": horse.trainer,
                "years_raced": horse.years_raced,
                "percentage_wins": horse.percentage_wins}]
        })
    
    def patch(self, request):         
        try:
            data = json.loads(request.body)["data"][0]
            horse_id = data["id"]

            Horse.objects.filter(id=horse_id).update(**data)
            horse = Horse.objects.get(pk=horse_id)

            return JsonResponse({
                "success": True,
                "data": [{
                "id": horse.id,
                "name": horse.name,
                "country": horse.country,
                "trainer": horse.trainer,
                "years_raced": horse.years_raced,
                "percentage_wins": horse.percentage_wins}]
            })
        
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
    def delete(self, request):
        data = json.loads(request.body)

        try:
            ids_to_delete = data["ids"]
            for x in ids_to_delete:
                Horse.objects.filter(id=x).delete()

            return JsonResponse({"success": True})
        
        except Exception as e: 
            return JsonResponse({"success": False, "error": str(e)}, status=400)
