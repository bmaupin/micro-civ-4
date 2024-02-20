# Espionage

## Motivation

- Espionage in Civ 4 is more than just a unit, it's an entire separate system that adds friction when trying to play quickly
- Espionage events in particular can be frustrating when trying to play quickly, such as having a technology stolen, a building or improvement destroyed, your entire treasury stolen, etc.
- "... espionage has become somewhat of a hindrance in the pursuit of normal diplomatic victories. The act of catching opposing AI controlled spies will devastate your diplomatic relations with those players forcing you into a negative relationship that you cannot recover from." ([source](https://en.wikipedia.org/wiki/Civilization_IV:_Beyond_the_Sword))

## Espionage in other Civ games

In Civ 1 - 3 and Civ Rev, espionage consisted almost entirely of a spy (or diplomat in Civ 1) unit that could perform a variety of missions, including:

- Establish embassy
- Investigate city
- Steal technology
- Destroy a building or production in a city
- Gain control of the city (starts a war)
- Reduce city population by 1
- Plant a nuclear device
- Reveal location of enemy units

## Disable espionage

#### For now, disable espionage by default

⚠️ For now espionage is disabled by setting it as disabled by default in the game options as this is low effort with the added advantage that it allows players to enable it if they wish. However, as per the [End of Espionage Mod](https://forums.civfanatics.com/resources/end-of-espionage-mod.13540/), it seems that this effectively converts espionage points to culture points, which can end up making the game unbalanced.

## Later, simplify espionage or remove it altogether

#### Idea: ~~Remove all but the spy unit~~

In earlier Civ games as well as Civ Rev, espionage consisted of a spy who could infiltrate enemy cities. Would it be possible to do something like this, just with XML changes? I'm not sure ...

For example, could we just remove espionage buildings, triggers, events, great people, etc. and just leave the spy unit? Although this would require espionage points in order for the spy to perform missions, I think this would still work because you could still use the espionage slider to accumulate espionage points.

But my current thinking is we should remove the spy unit as well, because I'm not sure performing spy missions would be compatible with the goal of extreme reduction of playtime.

#### Idea: Remove destructive spy missions

Remove all entities related to espionage (buildings, triggers, events, great people, units, etc.) but don't hide the espionage avisor button from the UI. This would remove friction from having espionage buildings and units in the city production list as well as remove the annoyance of destructive espionage missions. However, I think this might still allow for "passive" missions, such as seeing demographics, research, and information on enemy cities.

This would require use of the espionage slider to accumulate espionage points.

#### Idea: Remove espionage altogether

If simplifying espionage isn't possible and disabling espionage in the game options ends up being problematic, a better approach may be to remove espionage altogether; this could potentially be done by removing espionage buildings, units, triggers, events, great people, etc.

I think we would need to:

- Remove all entities related to espionage (buildings, triggers, events, great people, units, etc.)
- Set espionage to disabled in the game options by default
  - I think this should take care of hiding the advisor button and also the espionage slider, and also prevent the AI from conducting passive espionage missions

#### Research

- Included Charlemagne mod has espionage removed from UI
  - The spy unit seems to have been removed from most Python and XML asset files
  - The great spy is still in CIV4UnitInfos.xml but seems to have been removed from other asset files (buildings, civilizations, events, technologies)
  - Espionage buildings have been removed (which makes sense since the buildings are modern and the mod is set in the medieval era)
