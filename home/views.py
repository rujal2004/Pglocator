from django.shortcuts import render,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
# Create your views here.
def index(request):
    return render(request,'index.html')

def HomePage(request):
    pass

def signupPage(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm-password']
        if password != confirm_password:
            return HttpResponse('Password does not match')
        my_user = User.objects.create_user(username,email,password)
        my_user.save()
        return HttpResponse('User Created')
        print(username,email,password,confirm_password)
        
    return render(request,'signup.html')
def loginPage(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username,password=password)
        if user is not None:
            login(request,user)
            return HttpResponse('User Logged In')
        else:
            return HttpResponse('Invalid Credentials')
    return render(request,'login.html')