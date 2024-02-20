# UI

## Advisor buttons

#### Remove advisor button from UI

e.g. to remove the corporation, espionage, or religion advisor button from the top right in the UI:

ⓘ This was based on investigations of the included mods/scenarios but needs to be confirmed

1. Modify Assets/Python/Screens/CvMainInterface.py

   - The buttons seem to be defined in `interfaceScreen`; removing or commenting this code should remove the corresponding advisor from the UI, e.g.

     ```python
     #iBtnX += iBtnAdvance
     #screen.setImageButton( "CorporationAdvisorButton", "", iBtnX, iBtnY, iBtnWidth, iBtnWidth, WidgetTypes.WIDGET_ACTION, gc.getControlInfo(ControlTypes.CONTROL_CORPORATION_SCREEN).getActionInfoIndex(), -1 )
     #screen.setStyle( "CorporationAdvisorButton", "Button_HUDAdvisorCorporation_Style" )
     #screen.hide(   "CorporationAdvisorButton" )
     ```

   - I've also seen this done by updating `updateMiscButtons` instead; for the corresponding button, comment or remove every instance of `screen.hide`, `screen.moveToFront`, or `screen.show`, e.g.

     ```python
     #screen.hide( "CorporationAdvisorButton" )
     #screen.show( "CorporationAdvisorButton" )
     #screen.moveToFront( "CorporationAdvisorButton" )
     ```

     ⚠️ Only commenting out these lines will leave a gap in the UI unless `iBtnX += iBtnAdvance` is also commented out

#### Research

- Broken Star: comments `screen.setImageButton` and surrounding code and all instances of `screen.hide`, `screen.moveToFront`, or `screen.show` for `CorporationAdvisorButton`
- Charlemagne
  - Comments all instances of `screen.hide`, `screen.moveToFront`, or `screen.show` for `EspionageAdvisorButton`
    - The `screeen.setImageButton` and surrounding code isn't commented, but there's no `iBtnX += iBtnAdvance` line, so I think that's why there's no gap for the button
  - `CorporationAdvisorButton` isn't in file
- Dune Wars: removes `screen.setImageButton` and surrounding code for `CorporationAdvisorButton`
  - All instances of `screen.hide`, `screen.moveToFront`, or `screen.show` are unchanged ...
- Final Frontier doesn't have any code for `CorporationAdvisorButton` in `Assets/Python/EntryPoints/CvScreensInterface.py`
- Mesoamerica comments `screen.setImageButton` and surrounding code for `CorporationAdvisorButton`
  - All instances of `screen.hide`, `screen.moveToFront`, or `screen.show` are unchanged ...
- Road to war: all `screen.show` instances for `CorporationAdvisorButton` have been set to `screen.hide` and `screen.moveToFront` has been commented out, **but this leaves a gap** where the corporation advisor button was
