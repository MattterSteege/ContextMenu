# ContextMenu

A fully customizable, lightweight, and flexible JavaScript library for creating context menus with various item types and animations.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Available Item Types](#available-item-types)
- [API Documentation](#api-documentation)
  - [Constructor](#constructor)
  - [Methods](#methods)
  - [Item Types](#item-types)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)

## Features

- Supports multiple item types, including buttons, inputs, dropdowns, checkboxes, radios, and submenus.
- Smooth animations with customizable duration and easing.
- Fully customizable styles via an intuitive API.
- Submenu nesting with automatic positioning and indentation.
- Simple and extensible API with fluent chaining support.
- Built-in support for accessibility and keyboard navigation.

## Installation

Install the library via npm:

Or include it directly in your project:

```html
<script src="path/to/ContextMenu.js"></script>
```

or use the minified version:

```html
<script src="path/to/ContextMenu.min.js"></script>
```

## Quick Start

```javascript
// Create a new context menu
const menu = new ContextMenu({
  width: 250,
  animation: { enabled: true }
});

// Add menu items
menu.button('Copy', () => navigator.clipboard.writeText('Copied text'))
    .button('Paste', () => pasteContent())
    .separator()
    .button('Settings', () => openSettings(), { icon: '⚙️' });

// Show the menu at cursor position
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.showAt(e.clientX, e.clientY);
});
```

## Constructor Options

```javascript
const menu = new ContextMenu({
  width: 200,                          // Menu width in pixels
  animation: {
    enabled: true,                     // Enable/disable animations
    duration: 200,                     // Animation duration in ms
    timing: 'ease-out'                 // Animation timing function
  },
  position: {
    xOffset: 0,                        // Horizontal offset
    yOffset: 0                         // Vertical offset
  },
  icons: {
    submenu: '❯'                       // Icon for submenu
  },
  style: {
    backgroundColor: '#ffffff',        // Menu background color
    textColor: '#333333',              // Text color
    backgroundHoverColor: '#f0f0f0',   // Background color on hover
    border: 'rgba(0, 0, 0, 0.08)',     // Border color
    shadow: '0 10px 25px rgba(0, 0, 0, 0.1)', // Shadow
    accent: '#3b82f6',                 // Accent color for marked items
    // Additional styling options available
  },
  closeOnClick: true,                  // Close menu when item is clicked
  closeOnOutsideClick: true            // Close menu when clicking outside
});
```

## Menu Item Types

### Button

Simple clickable menu item.

```javascript
menu.button('Label', () => {
  // Action to perform when clicked
}, {
  icon: '✓',                   // Optional icon before text
  ficon: 'fa fa-check',        // Optional font icon class
  disabled: false,             // Disable the button
  marked: false                // Apply accent styling to mark as selected
});
```

### Separator

Adds a horizontal line to separate menu items.

```javascript
menu.separator();
```

### Submenu

Creates a nested submenu.

```javascript
menu.submenu('More Options', (submenu) => {
  submenu.button('Option 1', () => {})
         .button('Option 2', () => {});
}, {
  icon: '↪'                    // Optional icon
});
```

### Input

Adds a text input field.

```javascript
menu.input('Search', {
  placeholder: 'Type to search...',
  value: '',                   // Default value
  onChange: (value) => {
    // Handle input changes
  }
});
```

### Dropdown

Creates a dropdown select element.

```javascript
menu.dropdown('Select Size', [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' }
], {
  value: 'md',                 // Default selected value
  onChange: (value) => {
    // Handle selection changes
  }
});
```

### Checkbox

Adds a checkbox item.

```javascript
menu.checkbox('Enable Feature', {
  checked: false,              // Initial state
  onChange: (checked) => {
    // Handle checkbox state changes
  }
});
```

### Radio Group

Creates a group of radio buttons.

```javascript
menu.radioGroup('theme', [
  { label: 'Light', value: 'light', checked: true },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' }
], {
  onChange: (value) => {
    // Handle radio selection changes
  }
});
```

### Search Select

Creates a searchable multi-select component.

```javascript
menu.searchSelect('Select Items', [
  { label: 'Item 1', value: 'item1' },
  { label: 'Item 2', value: 'item2' },
  { label: 'Item 3', value: 'item3' }
], {
  onChange: (selectedValues) => {
    // Handle selection changes
    // selectedValues is an array of selected values
  }
});
```

## Methods

### Show Methods

Display the menu at specific coordinates:

```javascript
// Show at position (x, y)
const menuElement = menu.showAt(100, 200);

// The method returns the DOM element for the menu
```

### Management Methods

```javascript
// Remove the menu from DOM
menu.destroy();

// Remove all items from the menu
menu.clear();
```

## Advanced Usage

### Creating Context Menu for Specific Elements

```javascript
document.getElementById('myElement').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  
  // Create a menu specific for this element
  const elementMenu = new ContextMenu({width: 200});
  elementMenu.button('Edit Element', () => editElement(e.target))
             .button('Delete Element', () => deleteElement(e.target));
             
  elementMenu.showAt(e.clientX, e.clientY);
});
```

### Dynamic Menu Items

```javascript
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  
  const menu = new ContextMenu();
  
  // Add basic items for all elements
  menu.button('Copy', () => {});
  
  // Add specific items based on target element
  if (e.target.tagName === 'IMG') {
    menu.button('Save Image', () => saveImage(e.target.src))
        .button('Copy Image URL', () => copyText(e.target.src));
  } else if (e.target.tagName === 'A') {
    menu.button('Open Link', () => window.open(e.target.href, '_blank'))
        .button('Copy Link', () => copyText(e.target.href));
  }
  
  menu.showAt(e.clientX, e.clientY);
});
```

## Styling

To customize the menu's appearance, use the `style` option in the constructor:

```javascript
const menu = new ContextMenu({
  style: {
    backgroundColor: '#f8f9fa',
    textColor: '#333333',
    backgroundHoverColor: '#f0f0f0',
    border: 'rgba(0, 0, 0, 0.08)',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    accent: '#007bff',
    separator: 'rgba(0, 0, 0, 0.08)'
  }
});
```

## Accessibility

The menu uses semantic HTML and includes ARIA attributes for accessibility. Keyboard navigation is supported within menu items.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description.

For issues and feature requests, open a GitHub issue.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
