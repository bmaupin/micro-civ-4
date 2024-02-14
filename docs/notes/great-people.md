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

This should be safer than removing great people altogether, but trickier. Each city generates a certain number of great person points, and when it reaches a certain threshold a great person is randomly generated (see [here](<https://civilization.fandom.com/wiki/Great_Person_(Civ4)#Great_People_Points>) for more information).

So I'm not sure if it's possible to disable a specific great person without removing them altogether. However, I think it _should_ be possible to disable a class of great person:

1. Look at `GreatPeopleUnitClass` in `Assets/XML/Units/CIV4SpecialUnitInfos.xml` and identify the class of great person you wish to disable
1. Edit `Assets/XML/Buildings/CIV4BuildingInfos.xml`
   1. Where `GreatPeopleUnitClass` is equal to the class of great person you wish to disable (e.g. `UNITCLASS_PROPHET`), set it to `NONE`
1. Edit `Assets/XML/Technologies/CIV4TechInfos.xml`
   1. Where `FirstFreeUnitClass` is equal to the class of great person you wish to disable (e.g. `UNITCLASS_PROPHET`), set it to `NONE`
1. Search `Assets` for any other reference to the great person class
1. ???
