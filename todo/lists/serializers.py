from rest_framework import serializers
from .models import TodoItem

class TodoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=120)
    complete = serializers.BooleanField(required=False)

    def create(self, validated_data):
        """
        Create and return a new 'TodoItem' instance, given the validated data
        """
        return TodoItem.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing 'TodoItem' instance given the validated data.
        """
        instance.title = validated_data.get('title', instance.title)
        instance.complete = validated_data.get('complete', instance.complete)
        instance.save()
        return instance
