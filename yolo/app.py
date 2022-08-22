import asyncio
import logging
import os
import shutil
from glob import glob

import socketio
import uvicorn
import yolov5
from fastapi import FastAPI

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
    for ext in ("*.png", "*.jpeg", "*.jpg"):
        imgs.extend(glob(os.path.join("./upload/", idFolder, ext)))

    # NOTE: I don't put this function outside of this event, because I want
    # to make use of closure

    async def detectImage():
        try:
            if imgs:
                results = app.model(imgs, size=640)  # batched inference
                results.print()
                results.save(save_dir=f"./result/{idFolder}")
                # NOTE: We only emit this event when we have finished
                await sio.emit("detect-finished", {"idFolder": idFolder})

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
                os.path.join("./upload/", idFolder),
                ignore_errors=True,
            )

    # NOTE: Create task to keep running in background after we return
    asyncio.create_task(
        detectImage(),
    )


@sio.on("update-model")
def updateModel(sid, data):
    idFolder = data.get("idFolder")
    modelFileName = data.get("fileName")

    modelFiles = glob(os.path.join("./upload/", idFolder, modelFileName))

    if len(modelFiles) > 0:
        modelFilePath = modelFiles[0]

        app.model = yolov5.load(
            model_path=modelFilePath,
            autoshape=True,
            verbose=True,
        )


if __name__ == "__main__":

    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=1234,
        reload=True,
        debug=True,
    )  # no qa
