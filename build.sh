#!/bin/bash

mod_name="Quick Civ 4"

mkdir "${mod_name}"
cp -av src/Assets "${mod_name}"
zip -r $(echo "${mod_name}.zip" | tr -d " ") "${mod_name}"
rm -rf "${mod_name}"
