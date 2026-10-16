
# KN Studio

A personal freelance portfolio showcasing digital services, projects, and a streamlined client enquiry experience.

## Overview

KN Studio is a responsive, multi-page portfolio website built to present services, showcase projects, and help potential clients get in touch.

## Features

- Responsive, multi-page portfolio
- Home, About, Services, Projects, and Contact pages
- Dedicated College Sports Tournament Hub project page
- Project enquiry form with email submission through FormSubmit
- WhatsApp click-to-chat with prefilled enquiry details
- International phone country selector
- Animated enquiry success popup
- Custom SVG favicon
- Mobile-friendly layouts
- Reusable styles and JavaScript

## Tech Stack

- HTML5
- CSS3
- JavaScript
- FormSubmit for enquiry emails
- intl-tel-input for international phone selection
- Google Fonts: Space Grotesk and Inter

## Project Structure

```text
KN-Studio/
├── index.html
├── assets/
│   └── favicon.svg
├── css/
│   ├── style.css
│   ├── about.css
│   ├── services.css
│   ├── projects.css
│   ├── sports-tournament-hub.css
│   └── contact.css
├── js/
│   ├── main.js
│   └── contact.js
├── pages/
│   ├── about.html
│   ├── services.html
│   ├── projects.html
│   ├── sports-tournament-hub.html
│   └── contact.html
└── README.md
```

## Run Locally

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if needed.
4. Right-click `index.html` and select **Open with Live Server**.

You can also use any static HTTP server to serve the project root.

## Deployment

This is a static website and can be deployed using Netlify or GitHub Pages.

### Netlify

1. Push the repository to GitHub.
2. Import the repository into Netlify.
3. Leave the build command empty.
4. Set the publish directory to the project root (`.`).
5. Deploy the website.
6. Test all pages, images, favicon, and contact form on the deployed URL.

### GitHub Pages

GitHub Pages can host the static website from the repository root. Configure Pages in the repository settings and verify all page and asset paths after publishing.

## Contact Form

The contact form uses FormSubmit for email submission and WhatsApp click-to-chat for preparing a message.

Third-party services may require activation or configuration. Test the form on the live domain before relying on it.

## Customization

Update the HTML, CSS, and JavaScript files to modify page content, services, project details, branding, and form behavior.

## License

No license has been specified yet. All rights remain with their respective owners unless a license is added.
