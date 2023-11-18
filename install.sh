#!/usr/bin/env bash

GAME_BASE="${HOME}/.steam/steam/steamapps/common/Sid Meier's Civilization IV Beyond the Sword/"

mkdir -p "${GAME_BASE}/Mods/Micro Civ IV"
cp -r src/* "${GAME_BASE}/Mods/Micro Civ IV/"
