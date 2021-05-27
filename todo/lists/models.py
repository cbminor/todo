from django.db import models

# Create your models here.


class TodoItem(models.Model):
    title = models.CharField(max_length=120)
    complete = models.BooleanField(default=False)

    def _str_(self):
        return self.title
