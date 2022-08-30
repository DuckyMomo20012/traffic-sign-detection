# Setup guide for training process on Google Colab

> **Note**: It's recommended to train the model using Google Colab.

## Traffic Sign Localization Detection YOLO

- Download the dataset from
  [Traffic-Sign-Localization-Detection-YOLO-Annotated](https://www.kaggle.com/datasets/ahemateja19bec1025/trafficsignlocalizationdetectionyoloannotated)

- Create a folder name `traffic` in Google Drive's **root directory**.

  > **Note**: You can replace `traffic` with any name you want in the file
  > `YOLOv5_traffic.ipynb`.

- After finishing setup, your folder should look like this:

```
traffic
├── TrafficSignLocalizationandDetection
│   ├── test
│   │   ├── images
│   │   └── labels
│   ├── train
│   │   ├── images
│   │   ├── labels
│   │   └── labels.cache
│   └── valid
│       ├── images
│       ├── labels
│       └── labels.cache
├── custom_config.yaml
├── Custom_data.yaml
└── labels_YOLO_Traffic_Sign.csv
```

- Training with Google Colab by running through steps in file `YOLOv5_traffic.ipynb`.

  > **Note**: `Install environment for CPU` is an optional step if you can't run with
  > GPU (exceeded usage limit).

- You can download your trained model by running step `Zip result`.

## Other training:

- I have trained models for chest anatomy or hand gestures, but it doesn't give
  good result.

- You can check other training in the folder `others`.

- For **chest anatomy** training, you will have to create a folder name
  `anatomy` in Google Drive's root directory.

- For **hand gestures** training, you will have to create a folder name
  `hand_gestures` in Google Drive's root directory.
