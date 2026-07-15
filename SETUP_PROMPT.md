# SETUP_PROMPT.md

This file documents the exact AI prompt used to set up this repository.
It is included to make it transparent that GitHub Copilot (Agent mode) was used to
streamline the initial repository structure and progress-tracking setup.

---

## Prompt Used

> Set up this repository as my University of Helsinki Full Stack Open exercise and progress-tracking repository.
>
> Work in Agent mode and make the required file and folder changes directly. Do not generate solutions to any course exercises.
>
> ## 1. Retrieve the current curriculum
>
> Before creating the checklist, retrieve the current English-language curriculum directly from the official Full Stack Open course website.
>
> Use the official Part 0 through Part 7 pages as the source of truth. Do not use:
>
> * Your internal memory of older course versions
> * Public student submission repositories
> * Model answers
> * Third-party curriculum lists
> * Old Redux-based Part 6 templates if the current curriculum teaches something different
>
> For each part:
>
> 1. Open its official landing page.
> 2. Follow all section links belonging to that part.
> 3. Extract every exercise heading.
> 4. Match headings shaped like `0.1: HTML`, `1.11*: unicafe step 6`, and similar.
> 5. Deduplicate exercises by exercise number.
> 6. Sort them numerically.
> 7. Preserve the exact current exercise number, title, capitalization, and optional `*`.
> 8. Preserve which source page contains each exercise.
>
> If web access is unavailable, do not invent the checklist. Create only the basic repository structure and clearly report that the curriculum could not be retrieved.
>
> ## 2. Create the repository structure
>
> Create this baseline structure:
>
> ```text
> .
> ├── README.md
> ├── .gitignore
> ├── part0/
> ├── part1/
> │   ├── courseinfo/
> │   ├── unicafe/
> │   └── anecdotes/
> ├── part2/
> │   ├── courseinfo/
> │   ├── phonebook/
> │   └── countries/
> ├── part3/
> │   └── phonebook-backend/
> ├── part4/
> │   └── bloglist-backend/
> ├── part5/
> │   └── bloglist-frontend/
> ├── part6/
> ├── part7/
> ├── scripts/
> │   └── update-progress.mjs
> └── notes/
> ```
>
> Rules for the structure:
>
> * Add `.gitkeep` to directories that would otherwise be empty.
> * Do not initialize Vite, npm, React, Express, Zustand, databases, tests, or other application code.
> * Do not create `package.json` files.
> * Do not install dependencies.
> * Do not copy starter code or solutions.
> * Do not create obsolete application folders based only on older course versions.
> * If the current Parts 5, 6, or 7 clearly introduce additional named exercise applications, create sensible kebab-case directories for those applications.
> * Keep different applications in separate directories.
> * Do not create a separate folder for every incremental exercise when multiple exercises build the same application.
> * Part 0 diagram files will eventually live directly inside `part0`.
> * The `notes` directory is for my own study notes, not exercise submissions.
>
> ## 3. Create a suitable `.gitignore`
>
> Create a root `.gitignore` covering at least:
>
> ```gitignore
> node_modules/
> dist/
> build/
> coverage/
> .env
> .env.*
> !.env.example
> *.log
> .DS_Store
> .vscode/
> .idea/
> ```
>
> Also ignore common deployment, test, and local database artifacts where appropriate, but do not add overly broad rules that could hide exercise source files.
>
> ## 4. Build the README progress tracker
>
> Create a polished root `README.md` titled:
>
> ```md
> # Full Stack Open
> ```
>
> Include the following introductory information:
>
> * This repository contains my Full Stack Open exercise submissions.
> * The curriculum snapshot date, using today's actual date.
> * The curriculum was retrieved from the official English course material.
> * Parts 0–7 are tracked in detail here.
> * Parts 8–14 are separate extension courses and are listed separately.
> * Exercise checkboxes track my working progress but do not replace the official University of Helsinki submission system.
> * Exercises for a part should not be formally submitted until I have completed every exercise from that part that I intend to submit.
> * A legend explaining:
>
>   * `[ ]` not completed
>   * `[x]` completed
>   * `*` optional exercise for Parts 1–4, where applicable
>   * "Reading only" for exercises such as the introductory Part 0 reading tasks
>
> ### Progress summary
>
> Add a table between these exact markers:
>
> ```md
> <!-- progress-summary:start -->
> <!-- progress-summary:end -->
> ```
>
> The table should contain:
>
> | Part | Topic | Completed | Total | Progress |
> | ---- | ----- | --------: | ----: | -------: |
>
> Include rows for Parts 0–7 and one total row.
>
> Use the current official part topics rather than outdated topic names.
>
> Initially, every completed value should be zero. Calculate each total from the exercise headings actually retrieved from the official site.
>
> ### Detailed checklists
>
> Create one collapsible `<details>` section for each Part 0 through Part 7.
>
> Example format:
>
> ```md
> <details>
> <summary><strong>Part 1 — Introduction to React</strong> — 0/14</summary>
>
> - [ ] **1.1: Course Information, step 1**
> - [ ] **1.2: Course Information, step 2**
> - [ ] **1.3: Course Information, step 3**
>
> </details>
> ```
>
> Requirements:
>
> * Include every current official exercise for Parts 0–7.
> * Keep the exact exercise number and title.
> * Keep the `*` on optional exercises.
> * Add `— Optional` after starred exercises.
> * Add `— Reading only` where the official material explicitly says no GitHub submission is required.
> * Link each exercise title to the official section containing that exercise when a reliable link can be generated.
> * Do not include exercise descriptions or solutions.
> * Do not mark any exercise complete.
> * Keep checkboxes in strict numerical order.
> * Add a short "Applications" line near the top of each part listing the relevant local repository directories.
>
> ### Extension courses
>
> After Part 7, add an "Extension courses" section listing:
>
> * Part 8 — GraphQL
> * Part 9 — TypeScript
> * Part 10 — React Native
> * Part 11 — Continuous Integration / Continuous Delivery
> * Part 12 — Containers
> * Part 13 — Relational databases
> * Part 14 — Next.js
>
> Link each one to its current official course page.
>
> Do not create detailed exercise checklists for Parts 8–14 unless their current official course pages are accessible and the exercise headings can be reliably retrieved. Clearly label these as separate courses rather than implying they use the same Parts 0–7 submission workflow.
>
> ### Workflow section
>
> Add a concise workflow section containing:
>
> ```bash
> git add .
> git commit -m "Complete exercise 1.1"
> git push
> node scripts/update-progress.mjs
> ```
>
> Explain that applications built incrementally only need their final state for submission, although one commit per exercise provides a useful development history.
>
> ## 5. Create the progress-update script
>
> Create `scripts/update-progress.mjs` using only built-in Node.js modules.
>
> It must:
>
> 1. Read the root `README.md`.
> 2. Find checklist entries whose exercise numbers begin with Parts 0 through 7.
> 3. Count completed and total exercises per part.
> 4. Count all exercises, including optional exercises.
> 5. Update the table between:
>
>    * `<!-- progress-summary:start -->`
>    * `<!-- progress-summary:end -->`
> 6. Update each `<details>` summary from values such as `0/14` to the current completed count.
> 7. Calculate the percentage as a whole number.
> 8. Leave all other README content unchanged.
> 9. Print a concise progress report to the terminal.
> 10. Fail with a helpful error if the expected markers cannot be found.
>
> The script must work with:
>
> ```bash
> node scripts/update-progress.mjs
> ```
>
> Do not add third-party dependencies.
>
> ## 6. Validate everything
>
> After making the changes:
>
> 1. Run the progress-update script.
> 2. Confirm it does not alter any exercise checkbox.
> 3. Confirm the totals match the number of retrieved official exercise headings.
> 4. Confirm there are no duplicate exercise numbers.
> 5. Confirm Parts 0–7 are all represented.
> 6. Confirm the README has no stale references to Redux if the current curriculum has replaced it.
> 7. Confirm `.gitignore` does not ignore the exercise directories.
> 8. Show me the final directory tree.
> 9. Report:
>
>    * Curriculum snapshot date
>    * Number of exercises found in each part
>    * Total number of exercises
>    * Any official pages that could not be accessed
>    * Any directories added beyond the baseline structure and why
>
> Do not implement any exercise. This task is only repository organization, curriculum retrieval, and progress tracking.
>
> Include a SETUP_PROMPT.md file with the exact prompt (everything above this line) used to setup the project structure so it's obvious I used AI to streamline the initial setup.
