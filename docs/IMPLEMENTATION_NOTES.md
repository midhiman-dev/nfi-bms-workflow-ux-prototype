# Implementation Notes

- The prototype uses in-memory React state. Scenario changes reset the case list to deterministic synthetic mock data; browser refresh resets the selected scenario.
- The `Normal Approval` scenario begins at Initial Verification as required by the demo journey. Other representative cases remain in the local dataset to make role switching and queue visibility observable during that walkthrough.
- The available navigation routes intentionally expose all twelve blueprint surfaces for stakeholder review. Action availability still follows the case state and role-oriented queue guidance.
- The correction pass recreates a safe, generic NFI BMS-style shell (topbar, sidebar, compact Cases workspace) without copying production assets, data, configuration, or integrations. Demo controls deliberately live in the compact `Demo controls` utility menu.
