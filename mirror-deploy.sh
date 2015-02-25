#!/bin/sh
cp -r ~/Developer/joyneop.github.io ~/Developer/Parse-Products/joyneop-website-mirror/public
cd ~/Developer/Parse-Products/joyneop-website-mirror/public
parse deploy
echo Done it.
exit 0