#!/bin/bash
cd /home/ubuntu/tr-poke-sm
pgrep -d -l -f "node index.js" | sudo xargs kill