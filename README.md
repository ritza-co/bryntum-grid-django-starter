# Bryntum Grid with Django Starter

This repository contains the starter code for building a Bryntum Grid using Django. The code for the completed app is in the `completed-app` branch. To run this app, clone the repo and switch to the `completed-app` branch before following the steps below. 

## Setup

Create a virtual environment in the root folder: 

```
python -m venv venv
```

Activate the virtual environment: 

```
source venv/bin/activate
```

Inside the virtual environment, install Django: 

```
pip install django
```

Once Django is installed, make and run the migrations: 

```
python manage.py makemigrations
python manage.py migrate
```

Then add some data to the SQLite database: 

```
sqlite3 db.sqlite3
```

```
INSERT INTO horse (name, country, trainer, years_raced, percentage_wins) VALUES
('Kincsem', 'Hungary', 'Robert Hesp', 4, 100),
('Old Rosebud', 'United States', 'Frank D. Weir', 7, 50),
('Maximum Security', 'United States', 'Bob Baffert', 3, 71),
('Black Caviar', 'Australia', 'Peter Moody', 5, 100),
('Peppers Pride', 'United States', 'Joel Marr', 3, 100),
('Admire Moon', 'Japan', 'Hiroyoshi Matsuda', 3, 58),
('Eclipse', 'Great Britain', 'Sullivan', 2, 100), 
('Buckpasser', 'United States', 'Edward A. Neloy', 3, 80),
('Ormonde', 'Great Britain', 'John Porter', 3, 100),
('Equinox', 'Japan', 'Tetsuya Kimura', 3, 80);
```

Download the Bryntum Grid distribution folder [here](https://customerzone.bryntum.com/)

If you don't have a license for the Bryntum Grid, download the trial version [here](https://bryntum.com/download/). From the `/build` folder, copy the following files to the `static/bryntum-grid` folder: 

```
fonts
locales
grid.module.js
grid.module.js.map
grid.stockholm.css
grid.stockholm.css.map
```

Run the development server with:

```
python manage.py runserver
```

This will start a local server at `http://localhost:8000` and you can view the Grid app.  