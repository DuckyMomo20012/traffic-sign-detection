import subprocess

venv_python = "./.venv/bin/python3"
args = [venv_python, "yolo.py"]
subprocess.run(args)
