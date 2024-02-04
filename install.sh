#!/usr/bin/env bash

GAME_BASE="${HOME}/.steam/steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword/Beyond the Sword"

MOD_NAME="Quick Civ 4"

mkdir -p "${GAME_BASE}/Mods/${MOD_NAME}"
cp -r src/* "${GAME_BASE}/Mods/${MOD_NAME}/"
