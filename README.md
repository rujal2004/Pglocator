#  PG Locator (Built with Django)

A simple web application to search for Paying Guest (PG) accommodations in popular cities like Bangalore, using Django and external location APIs.

##  Features

-  Search PGs by city name (e.g., Bangalore, Delhi, etc.)
-  
-  Integrated with external location/map API (HERE Maps)
-  
-  Built with Django for backend routing and page rendering


## 🛠️ Tech Stack

- **Backend**: Django (Python)
- 
- **Frontend**: HTML, CSS, Bootstrap 
- 
- **APIs Used**: [HERE Maps API] 

## 📁 Project Structure



pg-locator/
├── pgapp/                # Main Django app

│   ├── templates/        # HTML templates

│   ├── views.py          # Backend views and logic

│   ├── urls.py           # URL routing

├── pg-locator/           # Django project config

│   ├── settings.py       # Project settings

├── static/               # Static files (CSS, JS, images)

├── manage.py


# Setup Instructions
###   1. Clone the Repository

git clone https://github.com/rujal2004/Pglocator.git

cd pg-locator

##  2. Create Virtual Environment 
python -m venv env

env\Scripts\activate

##  3. Install Dependencies
pip install -r requirements.txt

If requirements.txt doesn’t exist yet, run:

pip freeze > requirements.txt
##  4. Run the Server

python manage.py runserver
