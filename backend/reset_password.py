import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ep_viagens_app.settings')
django.setup()

from django.contrib.auth.models import User

user = User.objects.get(username='admin')
user.set_password('admin123')
user.save()
print('✅ Senha do admin resetada para: admin123')
