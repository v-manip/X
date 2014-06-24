#!/bin/sh
echo "\nSettings for the build can be changed in ./utils/_core/_builder.py\n"
echo "\nThe output file is located at ./utils/xtk.js\n"
echo "\nCopy the output file to the RectangularBoxViewer's root sub-directory 'deps/xtk.js' and call 'grunt' in the RBV root directory to install the updated RBV library to the Webclient library\n"
python ./utils/build.py
