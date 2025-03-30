# Interactive Marketplace Testing Guide

## 1. Launch Application

1. Install dependencies and start development server:
```bash
npm install
npm run dev
```

2. Verify the application loads successfully at the provided URL
3. Check browser console for any errors

## 2. Navigation Testing

### Header Navigation
- [ ] Click InteractiveHub logo - Should return to home page
- [ ] Test Marketplace link - Should navigate to /marketplace
- [ ] Test Videos link - Should navigate to /video/1
- [ ] Test Analytics link - Should navigate to /analytics
- [ ] Verify user icon functionality
- [ ] Confirm active state styling on current route

### Responsive Navigation
- [ ] Test mobile menu functionality (viewport < 768px)
- [ ] Verify hamburger menu opens/closes correctly
- [ ] Confirm all navigation items are accessible on mobile

## 3. Page-Specific Testing

### Home Page
1. Hero Section:
   - [ ] Verify all text is readable
   - [ ] Test "Browse Marketplace" button
   - [ ] Test "Start Learning" button

2. Featured Products:
   - [ ] Confirm products are loading
   - [ ] Verify product images load correctly
   - [ ] Test "View all" link
   - [ ] Check price formatting
   - [ ] Verify ratings display

3. Latest Videos:
   - [ ] Verify video thumbnails load
   - [ ] Test video duration display
   - [ ] Check hover effects
   - [ ] Verify play button overlay
   - [ ] Test video links

4. Continue Learning (authenticated users):
   - [ ] Verify section only shows when logged in
   - [ ] Check progress bars
   - [ ] Test continue watching links
   - [ ] Verify last watched timestamp

### Marketplace Page
1. Search & Filters:
   - [ ] Test search functionality
   - [ ] Verify category filter
   - [ ] Test price range filters
   - [ ] Check sort options
   - [ ] Verify filter reset

2. Product Grid:
   - [ ] Verify product cards display correctly
   - [ ] Test add to cart functionality
   - [ ] Check stock status display
   - [ ] Verify price formatting
   - [ ] Test product image loading

3. Shopping Cart:
   - [ ] Test cart open/close
   - [ ] Verify add/remove items
   - [ ] Test quantity adjustment
   - [ ] Check total calculation
   - [ ] Verify checkout button

### Video Player Page
1. Video Controls:
   - [ ] Test play/pause
   - [ ] Verify volume control
   - [ ] Test fullscreen toggle
   - [ ] Check progress bar
   - [ ] Verify time display

2. Interactive Features:
   - [ ] Test quiz popup timing
   - [ ] Verify answer selection
   - [ ] Check score calculation
   - [ ] Test continue watching
   - [ ] Verify progress saving

3. Video Information:
   - [ ] Check title display
   - [ ] Verify description
   - [ ] Test related videos
   - [ ] Check progress indicator

### Analytics Page
1. Overview Stats:
   - [ ] Verify watch time calculation
   - [ ] Check videos watched count
   - [ ] Test average score display
   - [ ] Verify completion rate

2. Progress Section:
   - [ ] Test progress bars
   - [ ] Verify recent activity
   - [ ] Check timestamp display
   - [ ] Test video links

## 4. Data Flow Testing

### Authentication Flow
1. Test user session:
   - [ ] Verify session persistence
   - [ ] Check protected routes
   - [ ] Test authentication state

2. Progress Tracking:
   - [ ] Verify video progress saves
   - [ ] Test quiz results storage
   - [ ] Check analytics updates

### Cart Management
1. Test cart persistence:
   - [ ] Verify items remain after refresh
   - [ ] Check quantity updates
   - [ ] Test cart across pages

## 5. Error Handling

### Network Issues
- [ ] Test offline behavior
- [ ] Verify error messages
- [ ] Check retry mechanisms

### Input Validation
- [ ] Test form submissions
- [ ] Verify field validation
- [ ] Check error states

## 6. Performance Testing

### Load Times
- [ ] Measure initial page load
- [ ] Check image optimization
- [ ] Verify lazy loading

### Resource Usage
- [ ] Monitor memory usage
- [ ] Check network requests
- [ ] Verify caching

## 7. Troubleshooting Guide

### Common Issues

1. Blank Page/Loading Issues:
   - Clear browser cache
   - Check console for errors
   - Verify network connectivity
   - Restart development server

2. Authentication Problems:
   - Clear local storage
   - Check token expiration
   - Verify Supabase connection

3. Video Playback Issues:
   - Check video format support
   - Verify network bandwidth
   - Clear browser cache
   - Test different browsers

4. Database Connection:
   - Verify environment variables
   - Check Supabase status
   - Test database queries
   - Monitor error logs

### Resolution Steps

1. Development Server:
```bash
# Stop current server
Ctrl + C

# Clear npm cache
npm cache clean --force

# Remove dependencies
rm -rf node_modules

# Reinstall and restart
npm install
npm run dev
```

2. Database Issues:
   - Check Supabase dashboard
   - Verify RLS policies
   - Test queries in dashboard
   - Check connection string

3. Component Problems:
   - Check React DevTools
   - Verify prop types
   - Test in isolation
   - Check state management

## 8. Regression Testing

After making changes:
1. Rerun all critical path tests
2. Verify core functionality
3. Check cross-browser compatibility
4. Test responsive layouts
5. Validate data persistence