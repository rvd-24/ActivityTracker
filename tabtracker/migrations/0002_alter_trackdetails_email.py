# Generated by Django 4.0.5 on 2022-07-30 04:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tabtracker', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trackdetails',
            name='email',
            field=models.ForeignKey(max_length=80, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]