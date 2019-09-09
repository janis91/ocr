#!/bin/bash

SIGNATURE=`openssl dgst -sha512 -sign ocr.key ocr.tar.gz | openssl enc -A -base64`

app_version=$(cat new_version)

echo "Releasing the app v$app_version to the nextcloud app store."

curl -X POST -H 'Content-Type: application/json' -H "Authorization: Token $nextcloud_appstore_token" -d '{ "download": "https://github.com/janis91/ocr/releases/download/'"$app_version"'/ocr.tar.gz", "signature": "'"$SIGNATURE"'" }' https://apps.nextcloud.com/api/v1/apps/releases
