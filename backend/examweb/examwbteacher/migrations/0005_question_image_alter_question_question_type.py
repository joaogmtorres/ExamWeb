# Generated by Django 5.2.1 on 2025-06-04 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('examwbteacher', '0004_remove_question_subject_question_answer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='question_images/'),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.CharField(choices=[('MCQ', 'Multiple Choice Question'), ('SAQ', 'Short Answer Question'), ('LAQ', 'Long Answer Question'), ('OTR', 'Others')], max_length=50),
        ),
    ]
