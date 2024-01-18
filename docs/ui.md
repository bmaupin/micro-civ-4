# UI

#### Remove advisor button from UI

e.g. to remove the corporation, espionage, or religion advisor button from the top right in the UI:

ⓘ This was based on investigations of the included mods/scenarios but needs to be

- Modify Assets/Python/Screens/CvMainInterface.py ?

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

- This seems less common (Barbarians, Afterworld?), but I've also seen it done by modifing `Assets/Python/EntryPoints/CvScreensInterface.py`

  - Modify the function to show the screen with an empty return, e.g.

    ```python
    def showReligionScreen():
        return
    ```
