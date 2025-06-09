from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
import json

from .models import Unit, Category, Subtopic, Paper, Question


# =======================
# UNITS
# =======================

@csrf_exempt
@require_http_methods(["GET", "POST"])
def units(request):
    if request.method == "GET":
        units = list(Unit.objects.values("id", "name").order_by("name"))
        return JsonResponse(units, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            if not name:
                return JsonResponse({"error": "Missing field: name"}, status=400)
            unit = Unit.objects.create(name=name)
            return JsonResponse({"id": unit.id, "name": unit.name}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# =======================
# CATEGORIES
# =======================

@csrf_exempt
@require_http_methods(["GET", "POST"])
def categories(request):
    if request.method == "GET":
        categories = list(Category.objects.values("id", "name", "unit_id").order_by("name"))
        return JsonResponse(categories, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            unit_id = data.get("unit")
            if not name or not unit_id:
                return JsonResponse({"error": "Missing fields: name and/or unit"}, status=400)
            unit = Unit.objects.get(id=unit_id)
            category = Category.objects.create(name=name, unit=unit)
            return JsonResponse({"id": category.id, "name": category.name, "unit": unit.id}, status=201)
        except ObjectDoesNotExist:
            return JsonResponse({"error": "Unit not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# =======================
# SUBTOPICS
# =======================

@csrf_exempt
@require_http_methods(["GET", "POST"])
def subtopics(request):
    if request.method == "GET":
        subtopics = [
            {
                "id": s.id,
                "name": s.name,
                "categories": list(s.categories.values_list("id", flat=True))
            }
            for s in Subtopic.objects.prefetch_related("categories").order_by("name")
        ]
        return JsonResponse(subtopics, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            categories = data.get("categories", [])
            if not name:
                return JsonResponse({"error": "Missing field: name"}, status=400)

            subtopic = Subtopic.objects.create(name=name)

            if categories:
                valid_categories = Category.objects.filter(id__in=categories)
                subtopic.categories.set(valid_categories)

            return JsonResponse(
                {"id": subtopic.id,
                 "name": subtopic.name
                 },status=201)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# =======================
# PAPERS
# =======================

@csrf_exempt
@require_http_methods(["GET", "POST"])
def papers(request):
    if request.method == "GET":
        papers = list(Paper.objects.values("id", "title", "description").order_by("title"))
        return JsonResponse(papers, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)

            title = data.get("title")
            description = data.get("description")
            date_of_creation = data.get("date_of_creation")
            main_subject = data.get("main_subject")

            if not all([title, description, date_of_creation, main_subject]):
                return JsonResponse({"error": "Missing required fields."}, status=400)
            try:
                category = Category.objects.prefetch_related("papers").get(name=main_subject)
            except Category.DoesNotExist:
                return JsonResponse({"error": "Missing category"}, status=400)

            paper = Paper.objects.create(
                title=title,
                description=description,
                date_of_creation=date_of_creation,
                main_subject=category
            )
            return JsonResponse({
                "id": paper.id,
                "title": paper.title,
                "description": paper.description,
                "date_of_creation": paper.date_of_creation,
                "main_subject": category.name
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


# =======================
# QUESTIONS
# =======================

@csrf_exempt
@require_http_methods(["GET", "POST"])
def questions(request):
    if request.method == "GET":
        papers = Paper.objects.prefetch_related("questions__subtopics", "questions__category").all()

        response = []
        for paper in papers:
            questions_data = []
        for question in paper.questions.all():
            questions_data.append({
                "id": question.id,
                "question_text": question.question_text,
                "answer": question.answer,
                "question_type": question.question_type,
                "difficulty_level": question.difficulty_level,
                "category": {
                    "id": question.category.id,
                    "name": question.category.name,
                } if question.category else None,
                "subtopics": [
                    {"id": s.id, "name": s.name}
                    for s in question.subtopics.all()
                ]
            })
        response.append({
            "paper_id": paper.id,
            "paper_title": paper.title,
            "questions": questions_data
        })

        return JsonResponse(response, safe=False)


    elif request.method == "POST":
        try:
            data = json.loads(request.body)

            required_fields = ["original_paper", "category", "question_text", "answer", "question_type", "difficulty_level"]
            if not all(field in data and data[field] for field in required_fields):
                return JsonResponse({"error": "Missing one or more required fields."}, status=400)

            original_paper = Paper.objects.get(pk=int(data["original_paper"]))
            category = Category.objects.get(pk=int(data["category"]))

            question = Question.objects.create(
                original_paper=original_paper,
                category=category,
                question_text=data["question_text"],
                answer=data["answer"],
                question_type=data["question_type"],
                difficulty_level=data["difficulty_level"],
            )

            # ManyToMany com subtopics
            subtopic_ids = data.get("subtopics", [])
            if isinstance(subtopic_ids, list):
                subtopics = Subtopic.objects.filter(pk__in=subtopic_ids)
                question.subtopics.set(subtopics)

            return JsonResponse({"message": "Question created successfully"}, status=201)

        except (Paper.DoesNotExist, Category.DoesNotExist) as e:
            return JsonResponse({"error": f"Foreign key not found: {str(e)}"}, status=400)
        except Subtopic.DoesNotExist:
            return JsonResponse({"error": "One or more subtopics do not exist"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Only GET and POST methods are allowed"}, status=405)
