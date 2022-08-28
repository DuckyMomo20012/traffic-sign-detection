@echo off
start cmd.exe /k "cd web & yarn dev"
start cmd.exe /k "cd app & yarn dev"
start cmd.exe /k ".venv\Scripts\activate & python script.py"
