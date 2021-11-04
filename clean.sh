#!/bin/bash
find . | grep \' 
find . | grep -E "(__pycache__|\.pyc|\.pyo$)" | xargs rm -rf
find . | grep -E "(.DS_Store)" | xargs rm -rf
find . | grep -E "(.ipynb_checkpoints)" | xargs rm -rf


