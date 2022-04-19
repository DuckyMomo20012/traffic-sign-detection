# Traffic sign object detection

A website to detect traffic signs, built with NodeJS.

> WARNING: This website has a lot of bugs. Use it as reference only!!!

## Tech stacks:

<p align="center">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="javascript" height="48" width="48" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="css3" height="48" width="48" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/handlebars/handlebars-original.svg" alt="handlebars" height="48" width="48" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="nodejs" height="48" width="48" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="expressjs" height="48" width="48" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="python" height="48" width="48" />
</p>

## How to build:

yolov5 is a submodule, so you may have to clone repo recursively:

```console
git clone --recursive https://github.com/DuckyMomo20012/nodejs-yolov5.git
```

### 1. Install environment for YOLOv5:

```console
python -m venv .venv
```

### 2. Activate environment (cmd):

```console
.venv\Scripts\activate
```

### 3. Install python libs:

```console
pip install -r requirements.txt
```

### 4. Install packages for server:

#### 4.1 Change directories to app:

```console
cd app
```

#### 4.2 Install packages:

```console
npm i
```

## How to run server and YOLOv5 (cmd):

> NOTE: Make sure you in folder root directories (E.g: nodejs-yolov5)

> NOTE: To detect traffic sign use file `best.pt`

> NOTE: Upload model function doesn't work. Don't use it.

- Run server:

```console
runProject.bat
```

- Go to localhost:3000

- Go to tab "Upload image", upload image to detect (you can use file `traffic-sign.jpg`)

- Go to tab "Home, click "Run model"

> NOTE: If you don't see any detection, check in "app/public/model" whether it has file `best.pt`
