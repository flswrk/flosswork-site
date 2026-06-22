# Mobile-First Architecture Guide

## Quick Reference for Developers

### Core Principles
1. **Mobile First**: Write mobile styles first, expand with `min-width` media queries
2. **Responsive Units**: Use `clamp()` for fluid typography and spacing
3. **Touch Friendly**: 44px minimum touch targets, no hover-only interactions
4. **Performance**: Minimal JavaScript, CSS-driven layouts

### Breakpoints
```
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

### Responsive Typography Pattern
```css
/* Mobile → Desktop scaling */
.display { font-size: clamp(32px, 8vw, 112px); }
.h2      { font-size: clamp(28px, 5vw, 62px); }
.lead    { font-size: clamp(14px, 4vw, 18px); }
```

### Responsive Grid Pattern
```css
/* Mobile first: single column */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(16px, 4vw, 24px);
}

/* Tablet: two columns */
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: three columns */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### Responsive Spacing Pattern
```css
.section {
  padding: clamp(48px, 12vh, 130px) 0;
  gap: clamp(32px, 8vw, 96px);
  margin-top: clamp(20px, 4vw, 28px);
}
```

### Touch-Friendly Interaction Pattern
```css
/* Hide hover states on mobile */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-3px);
  }
}

/* Active state for touch */
.card:active {
  transform: scale(0.98);
}
```

## CSS Variables (in `:root`)

### Spacing
```css
--gutter:    clamp(16px, 5vw, 40px);     /* Container padding */
--gutter-sm: clamp(12px, 3vw, 20px);     /* Small gaps */
```

### Navigation & CTA
```css
--nav-h:  68px;  /* Header height */
--cta-h:  68px;  /* Mobile CTA bar height */
```

### Typography
```css
--serif: 'Cormorant Garamond', Georgia, serif;
--sans:  'DM Sans', system-ui, -apple-system, sans-serif;
--mono:  ui-monospace, 'SF Mono', Menlo, 'Courier New', monospace;
```

### Colors
```css
--bg:          #ffffff;
--paper:       #f8f7f5;
--ink:         #0f0f0f;
--ink-soft:    #3d3d3d;
--ink-mute:    #7a7a7a;
--line:        #e8e8e8;
--accent:      #1a6b5a;    /* Teal */
--accent-lt:   #edf5f2;    /* Light teal */
--gold:        #b8936a;    /* Accent */
```

## Common Tasks

### Adding a New Section
```html
<section class="section">
  <div class="wrap">
    <!-- Content here -->
  </div>
</section>
```

### Creating a Responsive Grid
```html
<div class="card-grid">
  <div class="card">Item</div>
  <div class="card">Item</div>
</div>
```

```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;      /* Mobile: 1 column */
  gap: clamp(16px, 4vw, 24px);
}

@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

### Adding a New Button Style
```css
.btn--custom {
  background: var(--custom-color);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
}

@media (hover: hover) {
  .btn--custom:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.24);
  }
}

.btn--custom:active {
  transform: scale(0.98);
}
```

## File Organization

### CSS Files
- **base.css**: Global tokens, resets, typography, layouts
- **home.css**: Homepage-specific sections (hero, spotlight, etc.)
- **apple.css**: Premium design layer, components, cards
- **mobile-cta.css**: Mobile sticky CTA bar (NEW)

### JavaScript Files
- **layout.js**: Nav, footer, shared components
- **mobile-cta.js**: Mobile CTA bar rendering (NEW)
- **components.js**: General behavior
- **home.js**: Homepage-specific animations

## Performance Tips

1. **Avoid Fixed Dimensions**: Use `clamp()` for fluid scaling
2. **Minimize Media Queries**: Use CSS Grid and Flexbox with gap
3. **Touch Targets**: Always 44px minimum for interactive elements
4. **Lazy Load Images**: Add `loading="lazy"` when available
5. **Critical CSS**: Base and home CSS are critical, apple.css can defer

## Testing Checklist

When modifying responsive styles:
- [ ] Test mobile (320px, 480px, 640px)
- [ ] Test tablet (768px, 1024px)
- [ ] Test desktop (1200px+)
- [ ] Check button sizing (min 44px)
- [ ] Verify text wrapping at all breakpoints
- [ ] Test on actual touch device
- [ ] Verify no horizontal scroll

## Common Issues & Solutions

### Issue: Text truncation on mobile
**Solution**: Increase max-width, reduce font size using `clamp()`, or use text-wrap

### Issue: Layout shift on page load
**Solution**: Account for scrollbar width, use `overflow-y: scroll` on html

### Issue: Hover states showing on touch
**Solution**: Use `@media (hover: hover)` wrapper, never use hover-only interactions

### Issue: Button too small on mobile
**Solution**: Ensure min-height: 44px, use padding: clamp() for responsive sizing

## Migration from Old Code

### Old (Desktop-First)
```css
.grid { grid-template-columns: 1fr 1fr 1fr; }
@media (max-width: 1024px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
```

### New (Mobile-First)
```css
.grid {
  grid-template-columns: 1fr;
  gap: clamp(16px, 4vw, 24px);
}
@media (min-width: 640px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .grid { grid-template-columns: 1fr 1fr 1fr; } }
```

## Future Enhancements

1. **Dark Mode**: Add `prefers-color-scheme: dark` support
2. **Lazy Loading**: Implement native `loading="lazy"` on images
3. **Responsive Images**: Use `srcset` and `sizes` attributes
4. **Reduced Motion**: Respect `prefers-reduced-motion` media query
5. **RTL Support**: Add `dir="rtl"` support for right-to-left languages

---

**Version**: 1.0  
**Last Updated**: 2026-05-27  
**Maintainer**: Frontend Team
