# Tavio Kitchen

Responsive home, menu, Our Story and Visit Us pages for Tavio Kitchen, a neighbourhood takeout spot on Queen East. Built from the supplied design references, images and copy. Plain HTML, CSS and JavaScript; Node.js 20+ is the only requirement.

## Run locally

```sh
npm run dev
```

Open http://localhost:5173 for the home page, `/menu.html` for the menu, `/our-story.html` for Our Story, and `/visit-us.html` for Visit Us. On Windows with restricted PowerShell scripts, use `npm.cmd run dev`.

## Build

```sh
npm run build
npm run check
npm run preview
```

The static site is generated in `dist/` and can be hosted on any static web host. No dependencies need installing.

## GitHub Pages deployment

The repository is intended for `tavio-kitchen/tavio-kitchen.github.io`. GitHub Pages publishes the organization site at https://tavio-kitchen.github.io/. Every push to `main` runs the deployment workflow, builds `dist/`, checks all pages and local assets, and publishes the result. No hosting account, server or production secrets are required.

The custom domain is `taviokitchen.com`. Its GitHub Pages custom-domain setting and GoDaddy DNS must both be configured before the custom domain serves the site. Set the four apex `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`. Point the `www` CNAME to `tavio-kitchen.github.io`. Keep existing email records. See [GitHub's domain setup guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Original design references, the source menu PDF, local QA artifacts and dependencies remain local and are excluded from the repository. Only the built website is deployed.

## Scope and content

All four pages are implemented and connected through header and footer navigation. Copy describes takeout and delivery; the story was adjusted to remove on-site seating claims. The menu includes eight categories and the weekly rice special; item names and prices were checked against the supplied menu PDF. The home page retains its draft menu label. The Visit Us page has a real Google Maps embed and links to Google Maps and Apple Maps directions. Maps on the other pages are stylised illustrations with external Google Maps links.

## Confirm hours and telephone

Gomes still needs to confirm the weekly hours and telephone number. They remain unset in `business-details.js`. The public page shows "To be confirmed" for each day and no live call link until a valid telephone number is supplied.

Set each confirmed weekday to an object containing `open` and `close` as 24-hour `HH:MM` strings, or `{ closed: true }`. Set `telephone` to the confirmed international number beginning with `+` and `telephoneDisplay` to its readable display form. Today is highlighted in the restaurant's `America/Toronto` timezone. The call action becomes a real `tel:` link when configured. Unknown or invalid values retain the pending state.

Ordering buttons show an accessible coming-soon dialog. Replace the handlers with the client's verified pickup and delivery URLs before launch; no orders or payments are collected. No phone number, hours or ordering providers have been invented.

Shared brand colours and responsive styles are in `styles.css`; each additional page has its own stylesheet. Images are the original supplied assets. Design references and the source PDF are excluded from build output. Anton is served locally from `public/fonts/` with its SIL Open Font License.
