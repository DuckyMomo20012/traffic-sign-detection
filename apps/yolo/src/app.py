import asyncio
import contextlib
import io
import logging
import os
import re
import shutil
import threading

import socketio
import yolov5
from constants.constants import IMG_ACCEPT, RESULT_DIR, UPLOAD_DIR
from environs import Env
from fastapi import FastAPI

env = Env()
# Read .env into os.environ
env.read_env()

app = FastAPI()

# create a Socket.IO Async server
sio = socketio.AsyncServer(async_mode="asgi")
app = socketio.ASGIApp(sio)

# NOTE: Have to put this here, so socket io events can read "app.model"
modelFileName = "./model/best.pt"
app.model = yolov5.load(  # type: ignore
    model_path=modelFileName,
    autoshape=True,
    verbose=True,
)


@sio.on("detect")
async def detect(sid, data):
    idFolder = data.get("idFolder")
    imgs = []
    for ext in IMG_ACCEPT:
        imgs.extend(UPLOAD_DIR.joinpath(idFolder).glob("*" + ext))

    # NOTE: I don't put this function outside of this event, because I want
    # to make use of closure

    async def detectImage():
        try:
            if imgs:
                results = app.model(imgs, size=640)  # batched inference
                # Capture result output
                f = io.StringIO()
                with contextlib.redirect_stdout(f):
                    results.print()
                output = f.getvalue()

                results.print()
                # NOTE: YOLOv5 may rename the output file name, so be careful
                results.save(save_dir=RESULT_DIR.joinpath(idFolder))

                pattern = r"(image\s\d+/\d+):\s(\d+x\d+)\s(.*)"

                *detects, speed = output.splitlines()

                # NOTE: Parse detection results
                def parseRes():
                    for index, filePath in enumerate(imgs):
                        fileName = os.path.basename(filePath)

                        # NOTE: Image index of YOLOv5 printed result is still
                        # maintain the order of "imgs" array we passed in the
                        # model call
                        _imgIdx, imgSize, imgClass = re.match(
                            pattern, detects[index]
                        ).groups()

                        yield {
                            "fileName": fileName,
                            "imgSize": imgSize,
                            "imgClass": imgClass,
                        }

                detectRes = list(parseRes())

                # NOTE: We only emit this event when we have finished
                await sio.emit(
                    "detect-finished",
                    {
                        "idFolder": idFolder,
                        "detection": detectRes,
                        "speed": speed.replace("Speed: ", ""),
                    },
                )
            else:
                await sio.emit(
                    "detect-status",
                    {
                        "status": "error",
                        "msg": "Error during detection. No images found",
                    },
                )

        except Exception as err:
            logging.error(err)

            # Notify the client that we have errors
            await sio.emit(
                "detect-status",
                {
                    "status": "error",
                    "msg": "Error during detection",
                },
            )

            raise err

        # NOTE: Finally, we have to cleanup the upload folder
        finally:
            shutil.rmtree(
                UPLOAD_DIR.joinpath(idFolder),
                ignore_errors=True,
            )

    # NOTE: After a very LONG time, I found a way to run this function in
    # background AND ACK back before timeout. I start a thread but not call
    # "join" to wait for its result (like "fire and forget")

    # NOTE: Alternative way is you can create a FastAPI route and pass a param
    # "background_tasks" to it, add "detectImage" as task. Then Express will
    # request the route

    # NOTE: I can't use starlette.background because socketio can't serialize
    # its "JSONResponse" 😭

    # NOTE: Using "Celery" is a good way to run this function in background but
    # it is not necessary and complicated. "Dramatiq" is more simple and
    # promising.
    def handleThread():
        asyncio.run(detectImage())

    thread = threading.Thread(target=handleThread)
    thread.start()

    return (
        {
            "status": "ok",
            "msg": "Detection started",
        },
    )


# NOTE: I think users shouldn't be able to update the model manually 🤔
# @sio.on("update-model")
# def updateModel(sid, data):
#     idFolder = data.get("idFolder")
#     modelFileName = data.get("fileName")

#     modelFiles = glob(os.path.join("./upload/", idFolder, modelFileName))

#     if len(modelFiles) > 0:
#         modelFilePath = modelFiles[0]

#         app.model = yolov5.load(
#             model_path=modelFilePath,
#             autoshape=True,
#             verbose=True,
#         )
