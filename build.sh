#!/bin/bash

cd tools
bash status.sh
cd ..
jekyll build
rsync -v -rz --checksum  _site/ adulau@kb.quuxlabs.com:/home/adulau/website/foo/
