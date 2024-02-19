# Great people

#### Idea: Remove great people?

A simplified form of great people (military and scientific leaders) was introduced in Civ 3. Moreover, Civ Rev has great people. We could potentially keep this, but it is one more system to deal with which feels like it interrupts the flow of the game ...

#### How to remove great people

To remove great people (needs to be tested):

⚠️ From experience, removing items from the XML files tends to be very tricky, in particular because items are sometimes hard-coded in the Python and worst-case even in the DLL. It's much better to disable great people instead (see below).

1. Check for hard-coded references to the great person you wish to remove
   1. Find the great person you wish to remove in `Assets/XML/Units/CIV4SpecialUnitInfos.xml`
   1. Look for hard-coded references to that great person, in particular in `Assets/Python` and `Assets/CvGameCoreDLL.dll`
   1. If you don't find any hard-coded references, you might be able to remove the great person
1. Remove the great person
   1. Remove the great person from `Assets/XML/Units/CIV4SpecialUnitInfos.xml`
   1. Remove all references for the great person from other files in Assets
   1. ???

#### How to disable a class of great people

Each city generates a certain number of great person points, and when it reaches a certain threshold a great person is randomly generated (see [here](<https://civilization.fandom.com/wiki/Great_Person_(Civ4)#Great_People_Points>) for more information).

However, I'm not sure great people can be entirely disabled:

- It is possible to set `iMaxPlayerInstances` in `CIV4UnitClassInfos.xml` to `0` but this doesn't seem to have any impact on great person generation
- Setting `GreatPeopleUnitClass` in `CIV4BuildingInfos.xml` to `NONE` should disable generating great person points for that class, **but** generic great person points are also generated, so it's still possible that the great person is still generated.
