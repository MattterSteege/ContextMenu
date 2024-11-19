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

## Usage

### Basic Example

```javascript
const menu = new ContextMenu({
  width: 250,
  animation: { enabled: true, duration: 300 },
  style: { backgroundColor: '#f8f9fa', accent: '#007bff' }
});

menu
  .button('Action 1', () => alert('Action 1 triggered'))
  .button('Action 2', () => alert('Action 2 triggered'))
  .separator()
  .checkbox('Enable feature', { checked: true, onChange: (checked) => console.log('Checked:', checked) });

menu.showAt(100, 200); // Show menu at x=100, y=200

// or show menu on right click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.showAt(e.clientX, e.clientY);
});
```

### Available Item Types

- **Button**
- **Separator**
- **Submenu**
- **Input**
- **Dropdown**
- **Checkbox**
- **Radio Group**

## API Documentation

### Constructor

```javascript
new ContextMenu(options = {});
```

**Options**:
- `width` *(number)*: Width of the menu (default: `200`).
- `animation` *(object)*: Animation settings:
    - `enabled` *(boolean)*: Enable or disable animation (default: `true`).
    - `duration` *(number)*: Duration in milliseconds (default: `200`).
    - `timing` *(string)*: CSS timing function (default: `'ease-out'`).
- `position` *(object)*: Position offset:
    - `xOffset` *(number)*: Horizontal offset (default: `0`).
    - `yOffset` *(number)*: Vertical offset (default: `0`).
- `icons` *(object)*: Customize icons for submenus
- `style` *(object)*: Customizable styles (background color, hover effects, etc.).
    - `backgroundColor` *(string)*: Background color of the menu (default: `#ffffff`).
    - `textColor` *(string)*: Text color of the menu items (default: `#333333`).
    - `backgroundHoverColor` *(string)*: Background color on hover (default: `#f0f0f0`).
    - `border` *(string)*: Border color (default: `rgba(0, 0, 0, 0.08)`).
    - `shadow` *(string)*: Box shadow (default: `0 10px 25px rgba(0, 0, 0, 0.1)`).
    - `accent` *(string)*: Accent color for active items (default: `#3b82f6`).
    - `separator` *(string)*: Separator color (default: `rgba(0, 0, 0, 0.08)`).

*indentation means that the item is a child of the item above it*

### Methods

#### Adding Menu Items

- `.button(text, action, config)`
- `.input(label, config)`
- `.dropdown(label, options, config)`
- `.checkbox(text, config)`
- `.radioGroup(name, options, config)`
- `.separator()`
- `.submenu(text, submenuBuilder, config)`

#### Menu Actions

- `.showAt(x, y, autoAdd = true)`: Display the menu at a specific location.
- `.destroy()`: Remove the menu from the DOM.



### Item Types

#### **BUTTON**<br>
  Adds a button to the menu.  
<br>
  *Parameters*:  
- `text` _(string)_  
- `action` _(function)_  
- `config` _(object)_  
  - `icon` _(string)_ any ASCII character (includes emojis).  
  - `ficon` _(string)_ any icon class (`fas fa-save`, ...).  
  - `disabled` _(bool)_ whether the button is disabled.  
  - `marked` _(bool)_ whether the button should stand out (default: `false`).  

**Example**:  
```javascript
menu.button('Save', () => console.log('Saved'), //text, action
    { icon: 'save', ficon: 'far fa-save', disabled: false, marked: false }); //config
```

---

#### **INPUT**<br>
  Adds an input field to the menu.  
  <br>
  *Parameters*:
- `label` _(string)_
- `config` _(object)_
    - `placeholder` _(string)_ placeholder text for the input.
    - `value` _(string)_ initial value of the input.
    - `onChange` _(function)_ callback when the input value changes.
  
**Example**:
```javascript
menu.input('Name', { placeholder: 'Enter your name', onChange: (value) => console.log(value) });
```

---

#### **DROPDOWN**<br>
  Adds a dropdown to the menu.  
  <br>
  *Parameters*:
- `label` _(string)_
- `options` _(array)_ list of options for the dropdown.
- `config` _(object)_
    - `value` _(any)_ selected value(s).
    - `onChange` _(function)_ callback for selection changes.
    - `multiSelect` _(boolean)_ enables multi-selection (default: `false`).

**Example**:
```javascript
menu.dropdown('Select Color', ['Red', 'Green', 'Blue'], { value: 'Green' });
```

---

#### **CHECKBOX**<br>
  Adds a checkbox to the menu.  
  <br>
  *Parameters*:
- `text` _(string)_
- `config` _(object)_
    - `checked` _(boolean)_ initial checked state (default: `false`).
    - `onChange` _(function)_ callback when the state changes.

**Example**:
```javascript
menu.checkbox('Enable Feature', { checked: true, onChange: (checked) => console.log(checked) });
```

---

#### **RADIO GROUP**<br>
  Adds a group of radio buttons to the menu.  
  <br>
  *Parameters*:
- `name` _(string)_ name for the radio group.
- `options` _(array)_ list of radio options with `text` and `value`.
- `config` _(object)_
    - `onChange` _(function)_ callback when a radio button is selected.

**Example**:
```javascript
menu.radioGroup('Gender', [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }]);
```

---

#### **SEPARATOR**<br>
  Adds a separator line to the menu.  

**Example**:
```javascript
menu.separator();
```

---

#### **SUBMENU**<br>
  Adds a nested submenu to the menu.  
  <br>
  *Parameters*:
- `text` _(string)_ label for the submenu.
- `submenuBuilder` _(function)_ builder function to construct the submenu.
- `config` _(object)_
    - `icon` _(string)_ icon for the submenu.
    - `ficon` _(string)_ dynamic icon function.

**Example**:
```javascript
menu.submenu('Settings', (submenu) => { 
    submenu.button('Option 1', () => console.log('Option 1'));
}, { icon: '⚙️' });
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

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description.

For issues and feature requests, open a GitHub issue.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.