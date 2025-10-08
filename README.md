# CSS Documentation

This document provides an overview of the CSS styles used in our project.

## Structure

Our CSS is organized into the following:

1. **Base**: Styles related to base such as normilize, functions, mixins etc.
2. **Components**: Styles related to reusable components, such as sections or cards.
3. **Layouts**: Styles for to main page layouts and elements related to layouts, such as containers, grids, headers and footers.
4. **Forms**: Styles for buttons, inputs, forms.
5. **UI**: Styles for modal, toggle, tabs etc.

## Naming Conventions

We follow the BEM (Block Element Modifier) naming convention for our classes. For example:

- `.block` for block-level components.
- `.block__element` for elements within a block.
- `.block--modifier` for modifiers that change a block's appearance.

## Maintenance Guidelines

- Avoid excessive nesting to keep our styles maintainable. At most consider 3 levels deep.
