from pathlib import Path

IMG_ACCEPT = [".png", ".jpeg", ".jpg", ".webp"]

MIME_TYPE_ACCEPT = ["image/png", "image/jpeg", "image/webp"]

# NOTE: Current directory (".") is "src" folder, so we only need to go back 2
# levels, kinda weird 🤔
UPLOAD_DIR = Path("../../shared/assets/upload/").resolve()

RESULT_DIR = Path("../../shared/assets/result/").resolve()
