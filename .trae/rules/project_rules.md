# Project Rules

## Git Commits
**IMPORTANT:** Commits should only be made when explicitly requested by the user. Never make commits without user approval.

## Deployment
- Always verify environment variables are properly configured before deployment
- Test locally before pushing to production
- Ensure Google Tag Manager is working in both development and production environments

## Page Structure (`src/app/page.tsx`)
**CRITICAL:** Do not alter the initial page flow. The application must always start with the Quiz, followed by the Lead Form, and finally the Offer Page. The `showOfferPage` state in `page.tsx` must be initialized to `false`.