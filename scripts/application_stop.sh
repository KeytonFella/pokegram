#!/bin/bash

pgrep -d -l -f "node app.js" | sudo xargs kill