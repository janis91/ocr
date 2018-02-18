#!/bin/bash
# This script replaces some output of webpack, that is not intended to be there.

echo 'replacing everything underscore related'
perl -i -pe 's/(underscore_1\.default)/_/g' ./dist/*

echo 'replacing everything jquery related'
perl -i -pe 's/(jquery_1\.default)/\$/g' ./dist/*

echo 'replacing everything translation function related'
perl -i -pe 's/(\_this\.t\()|(this\.t\()/t\(/g' ./dist/*
perl -i -pe 's/(\_this\.n\()|(this\.n\()/n\(/g' ./dist/*

echo 'replacing finished'