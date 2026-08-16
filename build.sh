#!/bin/bash

cd tools
bash status.sh
cd ..
jekyll build
rsync -v -rz --checksum  _site/ adulau@vernor.foo.be:/home/adulau/website/foo/
