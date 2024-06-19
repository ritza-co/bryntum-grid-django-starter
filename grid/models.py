from django.db import models

# Create your models here.
class Horse(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    trainer = models.CharField(max_length=100)
    years_raced = models.IntegerField(default=0)
    percentage_wins = models.IntegerField(default=0)

    class Meta:
        db_table = 'horses'
