#!/bin/bash

mod_name="Quick Civ 4"

mkdir "${mod_name}"
cp -av src/Assets "${mod_name}"
zip -r "${mod_name}.zip" "${mod_name}"
rm -rf "${mod_name}"
