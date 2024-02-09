# Map sizes

#### Modding map sizes

1. First, modify the global map sizes

   1. Modify `Assets/XML/GameInfo/CIV4WorldInfo.xml`

      - e.g. for Beyond the Sword, modify `Beyond the Sword/Assets/XML/GameInfo/CIV4WorldInfo.xml`
      - e.g. for Planetfall, modify `Beyond the Sword/Mods/Planetfall v16/Assets/XML/GameInfo/CIV4WorldInfo.xml`
      - For Dune Wars, see below

   1. Modify `iGridWidth`/`iGridHeight` for each map size

      - My recommendation: change the grid sizes (X and Y) to 3/4/5/6/7/8 respectively for each of the different map sizes, e.g. for duel:

        ```xml
        <iGridWidth>3</iGridWidth>
        <iGridHeight>3</iGridHeight>
        ```

        Each grid is 4 tiles; this will result in a map of 12 x 12 tiles (the default size for duel maps is 40 x 24 tiles)

1. If that doesn't work for a particular map, you may also need to modify `getGridSize` in the map script

   - e.g. for the Dune Wars Arrakis map, modify `Beyond the Sword/Mods/DuneWars Revival/PrivateMaps/Arrakis.py`

     - Before:

       ```python
       def getGridSize(argsList):
         # ...
         WorldSizeTypes.WORLDSIZE_DUEL:       (8,8),
         WorldSizeTypes.WORLDSIZE_TINY:       (10,10),
         WorldSizeTypes.WORLDSIZE_SMALL:      (13,13),
         WorldSizeTypes.WORLDSIZE_STANDARD:   (16,16),
         WorldSizeTypes.WORLDSIZE_LARGE:      (18,18),
         WorldSizeTypes.WORLDSIZE_HUGE:       (21,21),
       ```

     - After:

       ```python
       def getGridSize(argsList):
         # ...
         WorldSizeTypes.WORLDSIZE_DUEL:       (3,3),
         WorldSizeTypes.WORLDSIZE_TINY:       (4,4),
         WorldSizeTypes.WORLDSIZE_SMALL:      (5,5),
         WorldSizeTypes.WORLDSIZE_STANDARD:   (6,6),
         WorldSizeTypes.WORLDSIZE_LARGE:      (7,7),
         WorldSizeTypes.WORLDSIZE_HUGE:       (8,8),
       ```
