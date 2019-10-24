#!/bin/bash
# rsync release to updates server

rsync -azzP --chmod=ugo=rwX ./release/*.exe ra-update:/var/www/html/desktop
rsync -azzP --chmod=ugo=rwX ./release/*.blockmap ra-update:/var/www/html/desktop
rsync -azzP --chmod=ugo=rwX ./release/*.sig ra-update:/var/www/html/desktop
rsync -azzP --chmod=ugo=rwX ./release/*.yml ra-update:/var/www/html/desktop

# scp ./release/*.exe ra-update:/var/www/html/desktop/
# scp ./release/*.blockmap ra-update:/var/www/html/desktop/
# scp ./release/*.sig ra-update:/var/www/html/desktop/
# scp ./release/latest.yml ra-update:/var/www/html/desktop/
