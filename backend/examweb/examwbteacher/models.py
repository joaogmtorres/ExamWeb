from django.db import models

class Unit(models.Model):
    name = models.CharField(max_length=20, unique=True, default="General")

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, default="General")
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name="categories", default=1)

    def __str__(self):
        return self.name    

class Subtopic(models.Model):
    name = models.CharField(max_length=100, default="General", blank=False, null=False)
    categories = models.ManyToManyField(Category, related_name="subtopics", blank=True)

    def __str__(self):
        return self.name

class Paper(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date_of_creation = models.DateField()
    main_subject = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="papers")

    def __str__(self):
        return self.title

class Question(models.Model):
    original_paper = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name="questions")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="questions")
    subtopics = models.ManyToManyField(Subtopic, related_name="questions", blank=True)
    question_text = models.TextField(null=False, blank=False, default="No Question Text")
    image = models.ImageField(upload_to='question_images/', null=True, blank=True)
    pdf = models.FileField(upload_to='question_pdfs/', null=True, blank=True)
    answer = models.TextField(null=True, blank=False)

    QUESTION_TYPE = [
        ("MCQ", "Multiple Choice Question"),
        ("SAQ", "Short Answer Question"),
        ("LAQ", "Long Answer Question"),
        ("OTR", "Others"),
    ]   
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPE)

    DIFFICULTY_CHOICES = [
        ("1", "Very Easy"),
        ("2", "Easy"),
        ("3", "Medium"),
        ("4", "Hard"),
        ("5", "Very Hard"),
        ("6", "Extreme"),
    ]
    difficulty_level = models.CharField(max_length=1, choices=DIFFICULTY_CHOICES)

    def __str__(self):
        return self.question_text[:50] if self.question_text else "No Question Text"

