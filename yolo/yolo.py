import os
import socket
import sys
import time
from glob import glob
from pathlib import Path

import torch
from flask import Flask

sys.path.append("../yolov5")

import socketio
from models.common import AutoShape, DetectMultiBackend
from models.experimental import attempt_load
from models.yolo import Model
from utils.general import check_requirements, intersect_dicts, set_logging
from utils.torch_utils import select_device

app = Flask(__name__)
# create a Socket.IO server
sio = socketio.Server()
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)


def _create(
    name,
    pretrained=True,
    channels=3,
    classes=80,
    autoshape=True,
    verbose=True,
    device=None,
):
    """Creates a specified YOLOv5 model

    Arguments:
        name (str): name of model, i.e. 'yolov5s'
        pretrained (bool): load pretrained weights into the model
        channels (int): number of input channels
        classes (int): number of model classes
        autoshape (bool): apply YOLOv5 .autoshape() wrapper to model
        verbose (bool): print all information to screen
        device (str, torch.device, None): device to use for model parameters

    Returns:
        YOLOv5 pytorch model
    """

    check_requirements(exclude=("tensorboard", "thop", "opencv-python"))
    set_logging(verbose=verbose)

    name = Path(name)
    path = name.with_suffix(".pt") if name.suffix == "" else name  # checkpoint path
    try:
        device = select_device(
            ("0" if torch.cuda.is_available() else "cpu") if device is None else device
        )

        if pretrained and channels == 3 and classes == 36:
            model = DetectMultiBackend(path, device=device)  # download/load FP32 model
            # model = models.experimental.attempt_load(path, map_location=device)  # download/load FP32 model
        else:
            cfg = list((Path(__file__).parent / "models").rglob(f"{path.stem}.yaml"))[
                0
            ]  # model.yaml path
            model = Model(cfg, channels, classes)  # create model
            if pretrained:
                ckpt = torch.load(
                    attempt_load(path),
                    map_location=device,
                    force_reload=True,
                )  # load
                csd = (
                    ckpt["model"].float().state_dict()
                )  # checkpoint state_dict as FP32
                csd = intersect_dicts(
                    csd, model.state_dict(), exclude=["anchors"]
                )  # intersect
                model.load_state_dict(csd, strict=False)  # load
                if len(ckpt["model"].names) == classes:
                    model.names = ckpt["model"].names  # set class names attribute
        if autoshape:
            model = AutoShape(model)  # for file/URI/PIL/cv2/np inputs and NMS
        return model.to(device)

    except Exception as e:
        help_url = "https://github.com/ultralytics/yolov5/issues/36"
        s = (
            "Cache may be out of date, try `force_reload=True`. See %s for help."
            % help_url
        )
        raise Exception(s) from e


@sio.on("predict")
def predict(sid, data):
    imgs = []
    for ext in ("*.png", "*.jpeg", "*.jpg"):
        imgs.extend(glob(os.path.join("./upload/", ext)))

    results = model(imgs, size=640)  # batched inference
    results.print()
    results.save(save_dir="../app/public/result")


if __name__ == "__main__":


    modelFileName = list(glob("./upload/*.pt") + glob("./upload/*.pth"))[0]
    model = _create(
        name=modelFileName,
        pretrained=True,
        channels=3,
        classes=36,
        autoshape=True,
        verbose=True,
    )  # pretrained

    app.run(host="127.0.0.1", port=1234)
