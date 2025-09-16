# DJ Elite Platform - Project Context & Development History

## Project Overview
DJ Elite is a React-based platform for DJ networking, matching, and coaching services. The platform combines gamification elements with professional networking features for DJs to find gigs, collaborate, and access premium coaching content.

## Current Platform Structure

### Core Architecture
- **Framework**: React with TypeScript
- **Routing**: React Router (BrowserRouter)
- **State Management**: Custom stores + React Context
- **Styling**: Tailwind CSS with custom CSS variables
- **Build Tool**: Vite

### Main Routes & Pages
```
/ - HomePage (main platform with sidebar navigation)
/funnel - DJElitePage (marketing funnel)
/swipe - SimpleDJMatchingPage (standalone swipe interface)
/checkout - CheckoutPage
/success - SuccessPage
/terms - TermsPage
/privacy - PrivacyPage
/premium - PremiumFeaturesDemo
/referrals - ReferralDashboard
```

### Key Components Structure
```
src/
├── components/
│   ├── pages/
│   │   ├── index.tsx (Dashboard, CoursesPage, EventsPage, ProfilePage, ReferralsPage)
│   │   ├── SimpleDJMatchingPage.tsx
│   │   ├── MainDJMatchingPage.tsx
│   │   └── DJMatchingPage.tsx
│   ├── platform/
│   │   ├── index.tsx (TopBar, SideNav, CourseCard)
│   │   └── PremiumFeaturesDemo.tsx
│   ├── swipe/
│   │   └── UltraFastSwipeCard.tsx
│   ├── messaging/
│   │   └── ChatInterface.tsx
│   └── premium/
│       ├── ReferralDashboard.tsx
│       └── WhoLikedYou.tsx
├── constants/
│   └── platform.tsx (NAV_ITEMS, course/opportunity data)
├── pages/
│   └── HomePage.tsx (main platform container)
└── contexts/
    ├── AuthContext.tsx
    └── ReferralContext.tsx
```

## Navigation System

### Sidebar Navigation (NAV_ITEMS in constants/platform.tsx)
```typescript
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🎯' },
  { id: 'courses', label: 'Courses', icon: '📚' },
  { id: 'events', label: 'Events', icon: '🎉' }, // Renamed from "Community"
  { id: 'referrals', label: 'Referrals', icon: '🎁' }, // Added
  // Profile removed from main nav, accessible via bottom profile section
]
```

### Page Routing Logic (HomePage.tsx)
- Uses `renderPage()` function to display content based on `activeSection` state
- Sidebar always visible (`isSidebarOpen: false` removed from navigate function)
- Profile access only through bottom profile section

## Recent Development History

### Major Changes Completed

#### 1. Navigation Restructuring
- **Issue**: User wanted all sections at `/` route instead of separate routes
- **Attempts**: Multiple restructuring attempts were reverted by user request
- **Final State**: Kept original routing structure, user prefers minimal changes only

#### 2. Navigation Updates
- Renamed "Community" section to "Events"
- Removed locked content from Events section
- Added "Referrals" section to main navigation
- Removed "Profile" from main navigation (access via bottom profile section only)

#### 3. Sidebar Alignment Fix
- **Problem**: Content hiding behind fixed sidebar
- **Solution**: Added `md:ml-64` class to all page components:
  - Dashboard, CoursesPage, CourseDetailPage, CommunityPage
  - PremiumFeaturesDemo

#### 4. Profile Editor Integration
- **Change**: Converted from popup modal to inline page component
- **Location**: ProfilePage in `src/components/pages/index.tsx`
- **Features**: Full database functionality, image upload, profile editing
- **Access**: Only through bottom profile section navigation

#### 5. Referrals Section
- **Implementation**: ReferralsPage wrapper around existing ReferralDashboard
- **Integration**: Added to sidebar navigation and HomePage routing

#### 6. Default Image Standardization
- **Latest Change**: Replaced all default images with person silhouette SVG
- **Previous**: Used `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400`
- **Current**: Uses base64-encoded SVG person silhouette
- **Files Updated**: All components using default images

#### 7. Navigation Default Fix
- **Issue**: Site was automatically redirecting when user became inactive
- **Solution**: Modified HomePage.tsx to only set page to 'opportunities' (swipe section) on initial load
- **Behavior**: Now defaults to swipe section on login/registration and stays on current page during session
- **File**: `src/pages/HomePage.tsx` - Updated useEffect to prevent automatic page switching

## Current Issues & Considerations

### Database Issues
- Console shows persistent 500 errors
- Timeout errors (code '57014')
- **406 errors in profile editor**: Caused by `fetchSwipeProfiles` function triggering swipe queries when profile editor loads
- **Root cause**: Profile editor imports swipe-related functions that make database queries to swipes table
- **Solution**: Profile editor should only import profile-specific functions, not swipe functions
- These are server-side issues, not frontend code problems

### User Preferences Identified
- **Minimal Changes**: User consistently requests reverts when changes go beyond specific requests
- **No Broad Restructuring**: Prefers targeted updates over platform-wide changes
- **Navigation Simplicity**: Wants clean, focused navigation structure
- **Profile Access**: Prefers profile editor access only through bottom section

## Technical Implementation Details

### Default Image System
All default/placeholder images now use this person silhouette SVG:
```typescript
const PERSON_SILHOUETTE_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyNy42MTQgMTAwIDI1MCA4Ny42MTQyIDI1MCA2MEMyNTAgMzIuMzg1OCAyMjcuNjE0IDEwIDIwMCAxMEMxNzIuMzg2IDEwIDE1MCAzMi4zODU4IDE1MCA2MEMxNTAgODcuNjE0MiAxNzIuMzg2IDEwMCAyMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDM5MEgxMDBDMTAwIDMzMC4yIDEzOS44IDI4MCAyMDAgMjgwQzI2MC4yIDI4MCAzMDAgMzMwLjIgMzAwIDM5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
```

### Sidebar Alignment Pattern
All page components need `md:ml-64` class to prevent content hiding:
```typescript
<div className="p-6 md:ml-64">
  {/* Page content */}
</div>
```

### Navigation State Management
- `activeSection` state in HomePage controls which page displays
- `navigate` function updates activeSection
- Sidebar always visible (no toggle state)

## Files Modified in Recent Sessions

### Core Navigation & Structure
- `src/constants/platform.tsx` - Navigation items, default images
- `src/pages/HomePage.tsx` - Main platform container, routing logic
- `src/components/pages/index.tsx` - All page components, profile editor

### Platform Components
- `src/components/platform/index.tsx` - TopBar, SideNav, CourseCard
- `src/components/platform/PremiumFeaturesDemo.tsx` - Premium features

### Swipe/Matching Components
- `src/components/pages/SimpleDJMatchingPage.tsx` - Standalone swipe interface
- `src/components/pages/MainDJMatchingPage.tsx` - Main matching page
- `src/components/pages/DJMatchingPage.tsx` - Original matching page
- `src/components/swipe/UltraFastSwipeCard.tsx` - Swipe card component

### Other Components
- `src/components/messaging/ChatInterface.tsx` - Chat interface
- `src/components/premium/WhoLikedYou.tsx` - Premium feature component

## Development Guidelines for Future Work

### User Interaction Patterns
1. **Always ask for clarification** before making broad changes
2. **Make minimal changes** that directly address the specific request
3. **Avoid restructuring** unless explicitly requested
4. **Test changes incrementally** and be prepared to revert

### Code Modification Approach
1. **Read existing code** before making changes
2. **Maintain existing patterns** and architecture
3. **Update all related files** when making systematic changes (like image URLs)
4. **Preserve user customizations** and preferences

### Navigation & UI Guidelines
1. **Sidebar always visible** - don't add toggle functionality
2. **Profile access via bottom section only** - don't add to main nav
3. **Use `md:ml-64`** for all page components to prevent sidebar overlap
4. **Maintain consistent styling** with existing Tailwind classes

## Next Steps & Potential Improvements

### Identified Areas for Future Development
1. **Database Connection Issues** - Server-side fixes needed
2. **Performance Optimization** - Image loading, component rendering
3. **Mobile Responsiveness** - Sidebar behavior on mobile devices
4. **Error Handling** - Better user feedback for API failures
5. **Testing** - Unit tests for core components

### Feature Requests to Watch For
1. **Additional Navigation Items** - Follow established patterns
2. **Profile Enhancements** - Build on existing ProfilePage component
3. **Matching Algorithm Improvements** - Enhance UltraFastSwipeCard
4. **Premium Features** - Extend PremiumFeaturesDemo

## Important Notes for Future Developers

1. **User Prefers Minimal Changes** - Always start with the smallest possible implementation
2. **Revert-Friendly Development** - Structure changes to be easily reversible
3. **Consistent Image Handling** - Use the person silhouette SVG for all default images
4. **Sidebar Margin Pattern** - Remember `md:ml-64` for all page components
5. **Navigation Structure** - Modify NAV_ITEMS in constants/platform.tsx for nav changes

This documentation should provide sufficient context for any AI assistant to continue development work on the DJ Elite platform while respecting the user's preferences and maintaining the established architecture.