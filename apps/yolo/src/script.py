#!/usr/bin/env python3

import subprocess

venv_python = "../../../.venv/bin/python3"
args = [venv_python, "run.py"]
subprocess.run(args)
