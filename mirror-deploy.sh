#!/bin/sh
cp -r ~/Developer/joyneop.github.io ~/Developer/Parse-Products/joyneop-website-mirror/
cd ~/Developer/Parse-Products/joyneop-website-mirror
rm -rf public
mv joyneop.github.io public
cd public
mv _robots.txt robots.txt
parse deploy
echo Done it.
exit 0