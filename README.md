# Web project workshop

Open `project_tutorial.html` in a browser. Keep this folder together so the lesson links, styles, scripts and examples work. No server, build tools or account is needed. W3Schools and other external links need internet access.

## The seven lessons

1. Your first HTML page
2. Elements and attributes
3. Pages with meaning (semantic HTML)
4. Style with CSS
5. Responsive layouts: Flexbox, Grid and media queries
6. Forms and validation: a contact form with native browser checking
7. Test and publish: testing, project preparation, publishing and hand-in

Each lesson has a short explanation led by diagrams, an interactive demo, a practical task with an expected result, "Pause and check" questions and a "Spot the error" question. Advanced topics link to W3Schools instead of being explained in the lesson.

## Interactive features

- **Live editors** (`data-live`): learners edit HTML/CSS and see the result straight away. The result runs in a sandboxed frame. Form editors also allow a tiny helper script, so native validation can be tried safely.
- **Labs** (`data-lab`): sliders and menus change CSS on a sample and show the matching code. Lesson 5 uses them for Flexbox and Grid, with boxes that glide to their new positions (reduced motion is respected).
- **Responsive lab** (`data-bp`): a width slider lights up the media queries that apply.
- **Validation explorer** (`data-attrlab`, `forms-lab.js`): change `required`, `type`, `minlength`, `pattern` and more, and see the browser's own message.
- All of these need JavaScript. Without it the code and diagrams still display, and each quiz offers its answer in a disclosure. Nothing is saved or sent.

## Files

- `tutorial.css` is the one stylesheet every lesson links. It only imports the files in `styles/`, loaded in this order: `tokens.css` (colours, lesson themes, sizes), `base.css` (reset, typography, plain elements), `layout.css` (page frame), `components.css` (call-outs, code blocks, diagrams, tables, quizzes), `interactive.css` (live editors and labs), `mobile.css` (edge-to-edge cards at 440px and below) and `print.css`. Change a colour in `tokens.css`; add a new block to `components.css`. `tutorial.js` holds the shared behaviour and `forms-lab.js` is for lesson 6 only.
- `assets/`: original SVG teaching images, and `assets/practice/` with the cat-in-sunglasses practice image (PNG, JPG, SVG) used in lesson 2. Lessons also use original inline SVG diagrams, with descriptive titles and captions. Wide diagrams have a stacked `.narrow` version for phones.
- `example/`: a five-page fictional reference site (Alex Rivers) for comparison. It is not an assessed-project submission. Its contact form uses native validation; a small script only stops the practice form reloading and sends or stores nothing.

## Notes for staff

- The tutorials teach front-end skills only. The brief permits optional back-end work; none is needed here. The contact form is a prototype: a real inbox needs a server or service.
- Teacher context and the evidence map are in `../web_project_planning_data.md`. Source of truth: `Web Assignment Brief.docx`, plus the assignment guide and question template.
- Students work in college OneDrive/L2 Digital/Web Development, using a `website` subfolder opened in VS Code with its integrated browser preview.
- External W3Schools links were checked when the lessons were revised (October 2026). Technical cross-checks: [MDN HTML syntax](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax), [MDN responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design), [MDN form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation).
- Revision (student feedback): lesson text was reduced by roughly 40–55%, with diagrams, live editors and labs doing more of the teaching. Lesson 5 gained Flexbox/Grid basics with interactive demos. Lesson 6 became a dedicated forms and validation lesson. The old project-check material moved to the new lesson 7.
- `:user-invalid` (lesson 6 styling) is supported in current Chrome, Edge, Firefox and Safari. In older browsers the red error styling simply does not appear; validation still works.
