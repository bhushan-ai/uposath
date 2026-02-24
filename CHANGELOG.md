# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2026-02-24

### Added
- **Mantrin's Daily Routine**: Integrated "The Daily Routine of a Mantrin" (Toh 805) with 100% wording fidelity and premium glassmorphic UI.
- **Structured Practice Layouts**: Implemented specialized grids for the Six Recollections and ritualized numbering for sequential practices.
- **Tabbed Routine Navigation**: Organized the 14 sections of the liturgical source into 6 intuitive tabs.
- **Improved Backup & Restore**: User-uploaded deity images are now embedded as Base64 strings in backups, ensuring full data persistence across devices.

### Changed
- **Premium UI Polish**: Refined the routine component with radial gradients, glow effects, and smooth transitions.
- **Compact Typography**: Optimized font sizes and table spacing for a high-density, professional mobile experience.
- **Enhanced Tab UX**: Added the primary accent color and shadow highlights to the active tab for clear visual navigation.
- **WebP Migration**: Converted internal and user-uploaded deity images to WebP format for superior compression and faster load times.

### Fixed
- **Liturgical Fidelity**: Audited all text against the source document to ensure verbatim accuracy (e.g., matching "Tathāgata" and exact ritual counts).
- **Vridhi Tithi Logic**: Corrected lunar display for Vridhi days and disabled adherence tracking for duplicate tithis.
- **City Search UI**: Resolved layout clipping issues in the city search results on the Settings page.
- **CSS Compatibility**: Added standard `background-clip` and `background-origin` properties for consistent rendering across browsers.

## [1.0.2] - 2026-02-24

### Added
- **Native In-App Updates**: Implemented a robust update system for Android with markdown support for release notes.
- **Mantra Deity System**: Added liturgical deity images and enhanced placeholder icons for the Mantra system.
- **Haptic Feedback**: Introduced tactile feedback for key interactions in the Mantra and Practice sections.
- **Auto-Scroll**: The Calendar Year view now automatically snaps to the current month on load.
- **Day Detail Page**: Added a "Calculations Reference" section to explain the logic behind Uposatha status and festival calculations.

### Changed
- **Premium Redesign**: 
    - Complete visual overhaul of **Mantra Edit**, **Day Detail**, and **Home** pages using an advanced dark glassmorphism theme.
    - Redesigned **Mantra cards** and **Practice summaries**.
- **Refined Animations**: Replaced emoji-based sparkles with CSS-based `premiumShine` pulse and `shimmer` sweep effects for Uposatha days.
- **Observance Tracking**: Streamlined the Uposatha logging flow and unified the status model for better consistency.
- **Liturgical Accuracy**: Aligned Uposatha terminology (Kshaya, Vridhi) and logic across the application.
- **Home Header**: Integrated location display and practice stats into the main hero section.

### Fixed
- **Uposatha Logic**: Corrected issues with lunar date calculations and timezone offsets.
- **UI Refinements**: Fixed status bar overlaps, input placeholder styling, and layout persistence bugs.
- **Audio Player**: Refined playback metadata decoding and player layout.

## [1.0.1] - 2026-02-22

### Added
- **Festival Accuracy**: Integrated native Panchangam matching for Ashoka Vijayadashami and Vajrayana festival logic.
- **Indian Buddhist Festivals**: Added specialized calendars for Indian Buddhist and Dharmapala traditions.
- **Year Selector**: Added the ability to browse festivals and Uposatha days by year.
- **Audio Controls**: Added playback speed controls and improved empty state handling.

### Fixed
- **Session Tracking**: Enabled duration tracking and manual editing for meditation and mantra sessions.

## [1.0.0] - 2026-02-22
- Initial Production Release.
