#!/bin/bash
# This script replaces some output of webpack, that is not intended to be there.

echo 'replacing everything underscore related'
perl -i -pe 's/(underscore_1\.default)/_/g' ./ocr.js

echo 'replacing everything jquery related'
perl -i -pe 's/(jquery_1\.default)/\$/g' ./ocr.js

echo 'replacing finished'