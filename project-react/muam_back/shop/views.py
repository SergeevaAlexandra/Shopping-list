from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from .models import Item, List, Category, ListItem
from .serializers import BulkListItemCreateSerializer, ItemSerializer, ListCreateSerializer, CategorySerializer, ListItemSerializer, ListRetrieveSerializer, ListUpdateSerializer

def create_item_with_category(item_name, category_name, **category_fields):
    with transaction.atomic():
        category, created = Category.objects.update_or_create(
            name=category_name,
            defaults=category_fields
        )
        
        item = Item.objects.create(name=item_name, category=category)
        return item

class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class CreateItemWithCategoryView(APIView):
    def post(self, request):
        item_name = request.data.get('name')
        category_name = request.data.get('category')
        
        if not item_name or not category_name:
            return Response(
                {'error': 'Both item name and category name are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            item = create_item_with_category(item_name, category_name)
            return Response({
                'name': str(item.name),
                'category': str(item.category.name),
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ItemUpdateView(generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response({}, status=status.HTTP_200_OK)



class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class ItemRetrieveView(generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]


class ItemDeleteView(generics.DestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ListCreateSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]


# Create (only name)
class ListCreateView(generics.CreateAPIView):
    queryset = List.objects.all()
    serializer_class = ListCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


# Update (name + items)
class ListUpdateView(generics.UpdateAPIView):
    queryset = List.objects.all()
    serializer_class = ListUpdateSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response({}, status=status.HTTP_200_OK)


# Retrieve
class ListRetrieveView(generics.RetrieveAPIView):
    queryset = List.objects.all()
    serializer_class = ListUpdateSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]


# Delete
class ListDeleteView(generics.DestroyAPIView):
    queryset = List.objects.all()
    serializer_class = ListCreateSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]


class ListListView(generics.ListAPIView):
    queryset = List.objects.all()
    serializer_class = ListRetrieveSerializer
    permission_classes = [permissions.IsAuthenticated]



class ListItemDeleteView(generics.DestroyAPIView):
    queryset = ListItem.objects.all()
    serializer_class = ListItemSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]


class ListItemUpdateView(generics.UpdateAPIView):
    queryset = ListItem.objects.all()
    serializer_class = ListItemSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response('', status=status.HTTP_200_OK)



class BulkListItemCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BulkListItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        list_items = serializer.save()
        return Response({}, status=status.HTTP_201_CREATED)