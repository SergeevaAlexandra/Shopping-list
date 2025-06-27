from django.urls import path
from .views import BulkListItemCreateView, CreateItemWithCategoryView, ItemUpdateView, ItemDeleteView, ItemListView, ListItemDeleteView, ListItemUpdateView, ListRetrieveView, ListCreateView, ListUpdateView, \
    ListDeleteView, ListListView, CategoryCreateView

urlpatterns = [
    path('item/', CreateItemWithCategoryView.as_view(), name='item-create'),
    path('item/<uuid:pk>/update/', ItemUpdateView.as_view(), name='item-update'),
    # path('item/<uuid:pk>/', ItemRetrieveView.as_view(), name='item-update'),
    path('item/<uuid:pk>/delete/', ItemDeleteView.as_view(), name='item-update'),
    path('items/', ItemListView.as_view(), name='item-list'),
    path('shopping-list/', ListCreateView.as_view(), name='list-create'),
    path('shopping-list/<uuid:pk>/', ListRetrieveView.as_view(), name='list-get'),
    path('shopping-list/<uuid:pk>/update/', ListUpdateView.as_view(), name='list-update'),
    path('shopping-list/<uuid:pk>/delete/', ListDeleteView.as_view(), name='list-delete'),
    path('shopping-lists/', ListListView.as_view(), name='list-list'),
    path('category/', CategoryCreateView.as_view(), name='category-create'),
    path('list-item/', BulkListItemCreateView.as_view(), name='list-item'),
    path('list-item/<uuid:pk>/delete/', ListItemDeleteView.as_view(), name='list-item-delete'),
    path('list-item/<uuid:pk>/update/', ListItemUpdateView.as_view(), name='list-item-delete'),
]