# Exercise 0.6 — New Note in Single Page App Sequence Diagram

This diagram shows what happens when a user creates a new note using the SPA version of the notes app at https://studies.cs.helsinki.fi/exampleapp/spa.

```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Types a note and clicks "Save"

    Note right of browser: spa.js intercepts the form submit<br/>
    with e.preventDefault(), stopping<br/>
    the default page reload behavior.<br/>
    It creates a new note object, pushes it<br/>
    to the local notes array, and re-renders<br/>
    the list via the DOM API — all without<br/>contacting the server.

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa (JSON: { content, date })
    activate server
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: No redirect, no page reload.<br/>The new note is already visible<br/>from the local DOM update.
```
