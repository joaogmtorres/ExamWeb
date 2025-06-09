from django.contrib import admin
from .models import Paper, Question, Category, Subtopic, Unit

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit')
    search_fields = ('name',)
    list_filter = ('unit',)

@admin.register(Subtopic)
class SubtopicAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('categories',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'original_paper', 'category', 'question_type', 'difficulty_level', 'get_subtopics')
    list_filter = ('question_type', 'difficulty_level', 'category', 'subtopics')
    search_fields = ('question_text', 'answer')
    filter_horizontal = ('subtopics',)
    autocomplete_fields = ('original_paper',)

    @admin.display(description='Subtopics')
    def get_subtopics(self, obj):
        return ", ".join([sub.name for sub in obj.subtopics.all()])

@admin.register(Paper)
class PaperAdmin(admin.ModelAdmin):
    list_display = ('title', 'main_subject', 'date_of_creation')
    search_fields = ('title', 'main_subject')
    list_filter = ('main_subject',)
    