#!/bin/bash
pgrep -d -l -f "node index.js" | sudo xargs kill