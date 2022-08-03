<div align="center">

  <h1>Traffic sign object detection</h1>

  <p>
    A website to detect traffic signs
  </p>

<!-- Badges -->
<p>
  <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/DuckyMomo20012/nodejs-yolov5" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/DuckyMomo20012/nodejs-yolov5" alt="last update" />
  </a>
  <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/network/members">
    <img src="https://img.shields.io/github/forks/DuckyMomo20012/nodejs-yolov5" alt="forks" />
  </a>
  <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/stargazers">
    <img src="https://img.shields.io/github/stars/DuckyMomo20012/nodejs-yolov5" alt="stars" />
  </a>
  <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/issues/">
    <img src="https://img.shields.io/github/issues/DuckyMomo20012/nodejs-yolov5" alt="open issues" />
  </a>
  <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/DuckyMomo20012/nodejs-yolov5.svg" alt="license" />
  </a>
</p>

<h4>
    <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/">View Demo</a>
  <span> · </span>
    <a href="https://github.com/DuckyMomo20012/nodejs-yolov5">Documentation</a>
  <span> · </span>
    <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/DuckyMomo20012/nodejs-yolov5/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Screenshots](#camera-screenshots)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Run Locally](#running-run-locally)
- [Usage](#eyes-usage)
- [Training](#rocket-training)
- [Roadmap](#compass-roadmap)
- [Contributing](#wave-contributing)
  - [Code of Conduct](#scroll-code-of-conduct)
- [FAQ](#grey_question-faq)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

<!-- Screenshots -->

### :camera: Screenshots

<div align="center">
  <img src="https://user-images.githubusercontent.com/64480713/182522564-d872a2d6-646d-4223-9a2f-fe5ba3d12d66.png" alt="screenshot" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://www.python.org/">Python</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

- Detect traffic sign objects.

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Prerequisites -->

### :bangbang: Prerequisites

- Python: `>= 3.9`.

- This project uses [Yarn](https://yarnpkg.com/) as package manager:

  ```bash
  npm install --global yarn
  ```

- This project uses [Poetry](https://python-poetry.org/) as package manager:

  Linux, macOS, Windows (WSL)

  ```bash
  curl -sSL https://install.python-poetry.org | python3 -
  ```

  Read more about installation on
  [Poetry documentation](https://python-poetry.org/docs/master/#installation).

- To run the script, you need to install [zx](https://github.com/google/zx)
  tool:

  **Requirement**: Node version >= 16.0.0

  ```bash
  npm install --global zx
  ```

<!-- Run Locally -->

### :running: Run Locally

Clone the project:

[yolov5](https://github.com/ultralytics/yolov5) is a submodule, so you have to
clone repo recursively:

```bash
git clone --recursive https://github.com/DuckyMomo20012/nodejs-yolov5.git
```

Go to the project directory:

```bash
cd nodejs-yolov5
```

Install dependencies:

- **app:**

  ```bash
  cd ./app
  yarn
  ```

- **yolo:**

  Install dependencies with `Poetry`:

  ```bash
  cd ./yolo
  poetry install
  ```

  OR:

  Install dependencies with `pip`:

  ```bash
  pip install -r requirements.txt
  ```

Running script to start the server:

- **Windows:**

  ```console
  run.bat
  ```

- **Linux and macOS:** Requires zx tool to be installed.

  ```bash
  chmod +x ./run.mjs
  ./run.mjs
  ```

Start server manually:

> NOTE: `app` and `yolo` needs to be **run concurrently**.

- **app:**

  ```bash
  cd ./app
  yarn start
  ```

- **yolo:**

  ```bash
  cd ./yolo
  poetry shell
  poe dev
  ```

<!-- Usage -->

## :eyes: Usage

> NOTE: The model still needs more training, so the result may not be accurate.

- Go to the tab "UPLOAD MODEL", and upload the model to detect (you can use a
  sample file `yolo/best.pt`).

  > NOTE: This function is not "working" because the server will load the model
  > name `best.pt` from folder `app/public/model/` automatically.

- Go to the tab "UPLOAD IMAGE", and upload the image to detect (you can use a
  sample file `yolo/sample/traffic-sign.jpg`).

  - Accept image formats: `.png`, `.jpeg`, `.jpg`.

  - After uploading the image, the image will be renamed to `image.png`.

- Go to tab `HOME`, click `Run model`.

  > NOTE: If you don't see any detection, check in folder `app/public/model`
  > whether it has file `best.pt`. If not, then you have to copy the sample
  > model file from `yolo/best.pt` to `app/public/model/` manually.

- Traffic signs detectable by the model:

  <details>
  <summary>List</summary>

  ```
  - Cycle Zone
  - Danger Ahead
  - Deer Zone
  - End of Right Road Go straight
  - Give Way
  - Go Left or Straight
  - Go Right or Straight
  - Go Straight
  - Huddle Road
  - Left Curve Ahead
  - Left Sharp Curve
  - No Entry
  - No Over Taking Trucks
  - No Over Taking
  - No Stopping
  - No Waiting
  - Pedestrian
  - Right Curve Ahead
  - Right Sharp Curve
  - Road Work
  - RoundAbout
  - Slippery Road
  - Snow Warning Sign
  - Speed Limit 100
  - Speed Limit 120
  - Speed Limit 20
  - Speed Limit 30
  - Speed Limit 50
  - Speed Limit 60
  - Speed Limit 70
  - Speed Limit 80
  - Stop
  - Traffic Signals Ahead
  - Truck Sign
  - Turn Left
  - Turn Right
  ```

  </details>

- If you want to detect using other models, you can rename the model file to
  `best.pt` and copy it to `app/public/model/`.

<!-- Training -->

## :rocket: Training

Please go to folder `training` and read `README.md` file.

<!-- Roadmap -->

## :compass: Roadmap

- [ ] Fix server writing file problem.
- [ ] Fix fixed model and image name problem.
- [ ] Fix fixed uploading model problem.
- [ ] Update UI.
- [ ] Improve model for detection.

<!-- Contributing -->

## :wave: Contributing

<a href="https://github.com/DuckyMomo20012/nodejs-yolov5/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DuckyMomo20012/nodejs-yolov5" />
</a>

Contributions are always welcome!

<!-- Code of Conduct -->

### :scroll: Code of Conduct

Please read the [Code of Conduct](https://github.com/DuckyMomo20012/nodejs-yolov5/blob/main/CODE_OF_CONDUCT.md).

<!-- FAQ -->

## :grey_question: FAQ

- Is this project still maintained?

  - No, but I will only update documentation.

- Can't detect traffic signs:

  - Make sure that you run both `app` and `yolo`.
  - Check if `app/public/model/best.pt` exists.
  - The model can't detect that traffic sign :man_shrugging:.

<!-- License -->

## :warning: License

Distributed under Apache-2.0 license. See
[LICENSE](https://github.com/DuckyMomo20012/nodejs-yolov5/blob/main/LICENSE)
for more information.

<!-- Contact -->

## :handshake: Contact

Duong Vinh - [@duckymomo20012](https://twitter.com/duckymomo20012) - tienvinh.duong4@gmail.com

Project Link: [https://github.com/DuckyMomo20012/nodejs-yolov5](https://github.com/DuckyMomo20012/nodejs-yolov5).

<!-- Acknowledgments -->

## :gem: Acknowledgements

Here are useful resources and libraries that we have used in our projects:

- [YOLOv5](https://github.com/ultralytics/yolov5): YOLOv5 rocket is a family of
  object detection architectures and models pretrained on the COCO dataset, and
  represents Ultralytics open-source research into future vision AI methods,
  incorporating lessons learned and best practices evolved over thousands of
  hours of research and development.
- [Awesome Readme Template](https://github.com/Louis3797/awesome-readme-template):
  A detailed template to bootstrap your README file quickly.
