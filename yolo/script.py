import subprocess

venv_python = "./.venv/bin/python3"
args = [venv_python, "server.py"]
subprocess.run(args)
