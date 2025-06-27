from rest_framework import serializers
from shop.models import Item, List, Category, ListItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        extra_kwargs = {
            'name': {'validators': []} 
        }

class ItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer(required=False, allow_null=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'category']

    def create(self, validated_data):
        category_data = validated_data.pop('category', None)
        item = Item.objects.create(**validated_data)
        
        if category_data:
            category, _ = Category.objects.get_or_create(name=category_data['name'])
            item.category = category
            item.save()
            
        return item

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        
        if category_data is not None:
            if category_data: 
                category, _ = Category.objects.get_or_create(name=category_data['name'])
                instance.category = category
            else:  
                instance.category = None
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance

    def to_internal_value(self, data):
        if 'category' in data and isinstance(data['category'], str):
            data = data.copy()
            data['category'] = {'name': data['category']}
        return super().to_internal_value(data)

class ListItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()
    
    class Meta:
        model = ListItem
        fields = ['id', 'item', 'checked']
        read_only_fields = ['id']

class ListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['id', 'name']
        read_only_fields = ['id']

class BulkListItemCreateSerializer(serializers.Serializer):
    list = serializers.PrimaryKeyRelatedField(queryset=List.objects.all())
    items = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Item.objects.all()),
        allow_empty=False
    )

    def create(self, validated_data):
        list_instance = validated_data['list']
        items = validated_data['items']
        list_items = [
            ListItem(list=list_instance, item=item)
            for item in items
        ]
        return ListItem.objects.bulk_create(list_items)
    
class ListUpdateSerializer(serializers.ModelSerializer):
    items = ListItemSerializer(source='listitem_set', many=True)
    name = serializers.CharField(required=False)

    class Meta:
        model = List
        fields = ['id', 'name', 'items']
        read_only_fields = ['id']

class ListRetrieveSerializer(serializers.ModelSerializer):

    class Meta:
        model = List
        fields = ['id', 'name']
        read_only_fields = ['id']

