import os
from glob import glob

import socketio
import yolov5
from flask import Flask

app = Flask(__name__)
# create a Socket.IO server
sio = socketio.Server()
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)


@sio.on("predict")
def predict(sid, data):
    imgs = []
    for ext in ("*.png", "*.jpeg", "*.jpg"):
        imgs.extend(glob(os.path.join("./upload/", ext)))

    results = model(imgs, size=640)  # batched inference
    results.print()
    results.save(save_dir="../app/public/result")


@sio.on("update-model")
def updateModel(sid, data):
    global model

    fileName = data["file"]

    modelFileName = glob(f"./upload/{fileName}")

    if len(modelFileName) > 0:
        model = yolov5.load(
            model_path=modelFileName[0],
            autoshape=True,
            verbose=True,
        )


if __name__ == "__main__":

    modelFileName = "./model/best.pt"
    model = yolov5.load(
        model_path=modelFileName,
        autoshape=True,
        verbose=True,
    )

    app.run(host="127.0.0.1", port=1234)
