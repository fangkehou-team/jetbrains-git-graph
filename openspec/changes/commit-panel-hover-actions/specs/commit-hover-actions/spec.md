## ADDED Requirements

### Requirement: File rows display hover action buttons
Each file row in the Commit panel file list SHALL display inline action buttons when hovered.

#### Scenario: Unstaged file hover shows stage and open buttons
- **WHEN** the user hovers over a file row in the Changes or Unversioned Files group
- **THEN** a Stage button (+) and an Open File button appear on the right side of the row
- **AND** the status label is hidden while the buttons are visible

#### Scenario: Staged file hover shows unstage and open buttons
- **WHEN** the user hovers over a file row in the Staged group
- **THEN** an Unstage button (-) and an Open File button appear on the right side of the row
- **AND** the status label is hidden while the buttons are visible

#### Scenario: Hover buttons trigger correct actions
- **WHEN** the user clicks the Stage button on an unstaged file
- **THEN** the file is staged via git add
- **WHEN** the user clicks the Unstage button on a staged file
- **THEN** the file is unstaged via git reset HEAD
- **WHEN** the user clicks the Open File button
- **THEN** the file is opened in the VSCode editor

#### Scenario: Buttons do not interfere with existing interactions
- **WHEN** the user double-clicks a file row
- **THEN** the diff view opens as before
- **WHEN** the user right-clicks a file row
- **THEN** the context menu appears as before
- **WHEN** the user clicks the checkbox on a file row
- **THEN** the file selection toggles as before

### Requirement: Directory rows display hover action buttons
Each directory row in the Commit panel file list SHALL display inline action buttons when hovered.

#### Scenario: Directory in Changes group shows stage-all button
- **WHEN** the user hovers over a directory row in the Changes or Unversioned Files group
- **THEN** a Stage All button (+) appears on the right side of the row
- **AND** the file count label is hidden while the button is visible

#### Scenario: Directory in Staged group shows unstage-all button
- **WHEN** the user hovers over a directory row in the Staged group
- **THEN** an Unstage All button (-) appears on the right side of the row
- **AND** the file count label is hidden while the button is visible

#### Scenario: Directory buttons trigger bulk actions
- **WHEN** the user clicks the Stage All button on a directory row
- **THEN** all files under that directory are staged
- **WHEN** the user clicks the Unstage All button on a directory row
- **THEN** all files under that directory are unstaged

### Requirement: Group headers display hover action buttons
Each group header (Staged, Changes, Unversioned Files) in the Commit panel SHALL display inline action buttons when hovered.

#### Scenario: Changes group header shows stage-all button
- **WHEN** the user hovers over the Changes group header
- **THEN** a Stage All button (+) appears on the right side of the header
- **AND** the file count is hidden while the button is visible

#### Scenario: Staged group header shows unstage-all button
- **WHEN** the user hovers over the Staged group header
- **THEN** an Unstage All button (-) appears on the right side of the header
- **AND** the file count is hidden while the button is visible

#### Scenario: Group header buttons trigger group-wide actions
- **WHEN** the user clicks the Stage All button on the Changes header
- **THEN** all files in the Changes group are staged
- **WHEN** the user clicks the Unstage All button on the Staged header
- **THEN** all files in the Staged group are unstaged

### Requirement: File group order places Staged above Changes
The Commit panel SHALL display file groups in the order: Staged, Changes, Unversioned Files.

#### Scenario: Staged group renders above Changes
- **WHEN** the Commit panel renders with both staged and unstaged changes
- **THEN** the Staged group appears first (top) in the file list
- **AND** the Changes group appears below it

### Requirement: Hover buttons are visually consistent
All hover inline buttons SHALL follow consistent visual styling.

#### Scenario: Button appearance on hover
- **WHEN** a row or header is hovered
- **THEN** action buttons fade in smoothly
- **AND** buttons use the same icon style as the existing toolbar
- **AND** buttons have hover feedback (background highlight)

#### Scenario: Button appearance on non-hover
- **WHEN** the mouse leaves a row or header
- **THEN** action buttons fade out
- **AND** the status label or file count reappears
