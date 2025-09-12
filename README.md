# ElementExplorer

## Overview

ElementExplorer is a lightweight, responsive web app for exploring chemical elements. Users can search by element name or symbol and view detailed information in a clean, interactive card layout. Perfect for students, educators, or anyone curious about chemistry.

# ElementExplorer Release Notes

**Version 1.1** – 2025-09-12

Release Date: 12 Sep 2025

Overview

Version 1.1 introduces significant backend improvements while maintaining the familiar frontend and user experience. This release focuses on performance, accuracy, and maintainability.

New Features & Improvements

Backend switch to JSON dataset

Replaced the Mendeleev Python library with a lightweight JSON dataset for element information.

Dramatically improves page load times both in development and production.

Corrected melting and boiling points

Values are now correctly displayed in °C (converted from Kelvin where applicable).

Future PWA readiness

Data is now served from a static JSON file, making offline functionality easier to implement in upcoming releases.

Consistency & reliability

The search feature behaves exactly as before; element cards and info display remain unchanged.

Bug Fixes

Fixed slow initial load caused by heavy library imports.

Fixed inaccurate or missing melting/boiling points for some elements.

**Author:** Lefa Mofokeng  
**Instagram:** [@theyenvyllefa](https://www.instagram.com/theyenvyllefa)
