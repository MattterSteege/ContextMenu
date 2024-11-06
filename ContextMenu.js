class ContextMenu {
    constructor(data = {}) {
        this.buttons = [];
        this.separators = [];
        this.submenus = [];
        this.nextPosition = 0;
        this.id = this.getRandomId();

        //you can change these values for layout customization
        this.style = {
            initialYOffset: data.initialXOffset || 10, //pixels between the bottom of the element and the top of the first menu
            initialXOffset: data.initialXOffset || 0, //pixels between the left of the element and the left of the first menu
            menuWidth: data.menuWidth || 200, //pixels
            RTL: data.RTL || false //right-to-left layout
        }

        // Animation configuration
        this.animation = {
            duration: data.animationDuration || 200, // milliseconds
            timing: data.animationTiming || 'ease-out' // CSS timing function
        };

        //event listeners
        this.handleClick = this.click.bind(this);
        this.handleContextMenu = this.contextMenu.bind(this);
        this.handleMouseOver = this.mouseOver.bind(this);
        this.handleKeyPress = this.keyPress.bind(this);

        //fast initialization
        if (data.buttons) {
            this.buttons = data.buttons;
        }
        if (data.separators) {
            this.separators = data.separators;
        }
        if (data.submenus) {
            this.submenus = data.submenus;
        }

        return this;
    }

    // Add class name constants
    static CLASSNAMES = {
        BUTTON: 'context-menu-button',
        SUBMENU: 'submenu-button',
        SEPARATOR: 'context-menu-separator',
        MENU: 'context-menu',
    };

    //initialation
    addEventListeners() {
        document.addEventListener('click', this.handleClick);
        document.addEventListener('contextmenu', this.handleContextMenu);
        document.addEventListener('mouseover', this.handleMouseOver);
        document.addEventListener('keydown', this.handleKeyPress);
        document.addEventListener('keyup', this.handleKeyPress);
    }

    destroy() {
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('contextmenu', this.handleContextMenu);
        document.removeEventListener('mouseover', this.handleMouseOver);
        document.removeEventListener('keydown', this.handleKeyPress);
        document.removeEventListener('keyup', this.handleKeyPress);

        const contextMenu = document.getElementById(this.id);
        if (contextMenu) {
            contextMenu.remove();
        }
    }

    //event listeners
    click(e) {
        if (e.target.classList.contains(ContextMenu.CLASSNAMES.BUTTON)) {
            const button = this.buttons.find(b => b.id == e.target.id);
            if (button) {
                button.action();
            }
        }

        if (!e.target.closest('.' + ContextMenu.CLASSNAMES.MENU)) {
            const contextMenu = document.getElementById(this.id);
            if (contextMenu) {
                contextMenu.remove();
            }
        }
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    mouseOver(e) {
        if (e.target.classList.contains(ContextMenu.CLASSNAMES.SUBMENU)) {
            const submenu = this.submenus.find(s => s.subMenu.id === e.target.getAttribute('data-submenu'));
            if (!submenu || document.getElementById(submenu.subMenu.id)) return; //if no item is found or the submenu is already open, return

            if (submenu) {
                // Hide other submenus at the same level
                const parentMenu = e.target.closest('.' + ContextMenu.CLASSNAMES.MENU);
                const siblingSubmenus = parentMenu.querySelectorAll('.' + ContextMenu.CLASSNAMES.MENU);
                siblingSubmenus.forEach(menu => {
                    if (!menu.contains(e.target)) {
                        menu.remove();
                    }
                });

                const subMenu = submenu.subMenu.show(e.target, false, true);
                if (!subMenu) return;

                if (!this.style.RTL)
                 subMenu.style.left = `${e.target.getBoundingClientRect().right}px`;
                else
                    subMenu.style.right = `${e.target.getBoundingClientRect().left}px`;

                subMenu.style.top = `${e.target.getBoundingClientRect().top}px`;
                subMenu.style.display = 'block';

                e.target.parentElement.append(subMenu);

                e.troughTab ? subMenu.querySelector('.' + ContextMenu.CLASSNAMES.BUTTON).focus() : null;

                // Add mouseout handler to the submenu
                const handleMouseLeave = (event) => {
                    const submenuEl = document.getElementById(subMenu.id);
                    const relatedTarget = event.relatedTarget;

                    if (!submenuEl) return;

                    // Check if mouse moved to the parent button or the submenu itself
                    if (!submenuEl.contains(relatedTarget) &&
                        !e.target.contains(relatedTarget) &&
                        relatedTarget !== e.target) {
                        submenuEl.remove();
                    }
                };

                subMenu.addEventListener('mouseleave', handleMouseLeave);
                e.target.addEventListener('mouseleave', handleMouseLeave);
            }
        }
    }

    //don't allow a button to be pressed when the keystroke just opened a submenu
    keyPress(e) {
        //first check if the active element is a button or a submenu
        if (!document.activeElement) return;
        if (!document.activeElement.classList.contains(ContextMenu.CLASSNAMES.BUTTON) &&
            !document.activeElement.classList.contains(ContextMenu.CLASSNAMES.SUBMENU)) return;


        if (this.isKeyDown == e.type) return;
        this.isKeyDown = e.type;
        if (e.type === 'keyup') return;

        if (e.key === 'Escape') {
            const contextMenu = document.getElementById(this.id);
            if (contextMenu) {
                contextMenu.remove();
            }
        }

        if (e.key === 'Enter' || e.key === ' ' || (e.key === 'ArrowRight' && !this.style.RTL) || (e.key === 'ArrowLeft' && this.style.RTL)) {
            const focused = document.activeElement;
            if (focused.classList.contains(ContextMenu.CLASSNAMES.SUBMENU)
                && focused.classList.contains(ContextMenu.CLASSNAMES.BUTTON)) {
                this.mouseOver({target: focused, troughTab: true});
                e.preventDefault();
                return;
            }
        }

        //or if the current focused element is the top-most child and shift-tab is pressed
        if (((e.key === 'ArrowLeft') && !this.style.RTL) || ((e.key === 'ArrowRight') && this.style.RTL)) {
            if (document.activeElement.parentElement.id !== this.id) return;
            const id = document.activeElement.parentElement.id;
            const submenu = document.querySelector(`[data-submenu="${id}"]`);
            if (submenu) {
                submenu.focus();
            }
        }

        //with arrow up and down, get the previous or next CLASSES.BUTTON element
        if (e.key === 'ArrowDown' && this.isRoot) {
            let focused = document.activeElement;
            if (!focused) return;

            focused = focused.nextElementSibling;
            while (!focused.classList.contains(ContextMenu.CLASSNAMES.BUTTON) && focused.nextElementSibling) {
                focused = focused.nextElementSibling;
            }

            if (focused) {
                focused.focus();
            }

            //any child of the parent of this element that is a submenu, remove it
            const parent = focused.parentElement;
            const submenus = parent.querySelectorAll('.' + ContextMenu.CLASSNAMES.MENU);
            submenus.forEach(menu => menu.remove());
        }

        if (e.key === 'ArrowUp' && this.isRoot) {
            let focused = document.activeElement;
            if (!focused) return;

            focused = focused.previousElementSibling;
            while (!focused.classList.contains(ContextMenu.CLASSNAMES.BUTTON) && focused.previousElementSibling) {
                focused = focused.previousElementSibling;
            }

            if (focused) {
                focused.focus();
            }

            //any child of the parent of this element that is a submenu, remove it
            const parent = focused.parentElement;
            const submenus = parent.querySelectorAll('.' + ContextMenu.CLASSNAMES.MENU);
            submenus.forEach(menu => menu.remove());
        }
    }

    // The rest of the methods remain the same
    addButton(button) {
        if (!button || typeof button !== 'object') {
            throw new Error('Button must be an object');
        }
        if (!button.text || typeof button.text !== 'string') {
            throw new Error('Button must have a text property');
        }
        if (!button.action || typeof button.action !== 'function') {
            throw new Error('Button must have an action function');
        }

        button.position = this.nextPosition++;
        button.id = this.getRandomId();
        this.buttons.push(button);
        return this;
    }

    addSeparator() {
        this.separators.push({position: this.nextPosition++, id: Math.random().toString(36).substring(7)});
        return this;
    }

    addSubMenu(submenu) {
        if (!submenu || typeof submenu !== 'object') {
            throw new Error('Submenu must be an object');
        }
        if (!submenu.text || typeof submenu.text !== 'string') {
            throw new Error('Submenu must have a text property');
        }
        if (!submenu.subMenu || !(submenu.subMenu instanceof ContextMenu)) {
            throw new Error('Submenu must have a subMenu property that is an instance of ContextMenu');
        }
        submenu.position = this.nextPosition++;
        submenu.id = this.getRandomId();
        submenu.subMenu.style = this.style;
        this.submenus.push(submenu);
        return this;
    }

    showAt(x, y) {
        const existingContextMenu = document.getElementById(this.id);
        if (existingContextMenu) {
            return;
        }

        let contextMenu = this.render();

        this.addEventListeners();

        document.body.appendChild(contextMenu);

        contextMenu.style.left = `${x - 5}px`;
        contextMenu.style.top = `${y - 5}px`;
        contextMenu.style.position = 'fixed';
        if (this.animation.duration !== 0) {
            contextMenu.style.transition = `opacity ${this.animation.duration}ms ${this.animation.timing}`;

            requestAnimationFrame(() => {
                contextMenu.style.opacity = 1;
            });
        }

        this.isRoot = true;

        contextMenu.querySelectorAll('.' + ContextMenu.CLASSNAMES.BUTTON).forEach(_button => {
            const id = _button.id;
            _button.addEventListener('click', () => {
                const button = this.buttons.find(b => b.position == id);
                if (button) {
                    button.action();
                }
            });
        });

        contextMenu.querySelector('.' + ContextMenu.CLASSNAMES.BUTTON).focus();

        this.addEventListeners();

        return contextMenu;
    }

    show(element, isRoot = true, dontAutoAdd = false) {
        const existingContextMenu = document.getElementById(this.id);
        if (existingContextMenu) {
            return;
        }

        let contextMenu = this.render();

        const calculatePosition = (element, isRoot) => {
            const rect = element.getBoundingClientRect();
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };

            let left = 0;

            if (!this.style.RTL) {
                left = isRoot ?
                    rect.left + this.style.initialXOffset :
                    rect.right;
            }
            else {
                left = isRoot ?
                    rect.right - this.style.initialXOffset :
                    rect.left;
            }
            let top = isRoot ?
                rect.bottom + this.style.initialYOffset :
                rect.top;

            // Prevent menu from going off-screen
            if (left + this.style.menuWidth > viewport.width) { // assuming 200px menu width
                left = rect.left - this.style.menuWidth;
            }

            return { left, top };
        };

        const position = calculatePosition(element, isRoot);
        contextMenu.style.left = `${position.left}px`;
        contextMenu.style.top = `${position.top}px`;
        contextMenu.style.position = 'fixed';
        if (this.animation.animationDuration !== 0) {
            contextMenu.style.transition = `opacity ${this.animation.duration}ms ${this.animation.timing}`;

            requestAnimationFrame(() => {
                contextMenu.style.opacity = 1;
            });
        }

        if (!isRoot)
            contextMenu.style.display = 'none'

        this.isRoot = isRoot;

        contextMenu.querySelectorAll('.' + ContextMenu.CLASSNAMES.BUTTON).forEach(_button => {
            const id = _button.id;
            _button.addEventListener('click', () => {
                const button = this.buttons.find(b => b.position == id);
                if (button) {
                    button.action();
                }
            });
        });

        !dontAutoAdd && document.body.appendChild(contextMenu);

        isRoot ? contextMenu.querySelector('.' + ContextMenu.CLASSNAMES.BUTTON).focus() : null;

        this.addEventListeners();

        return contextMenu;
    }

    render() {
        const buttonHTML = (icon, text, id) => {
            var button = document.createElement('button');
            button.classList.add(ContextMenu.CLASSNAMES.BUTTON);
            button.id = id;
            button.setAttribute('role', 'menuitem');
            button.setAttribute('aria-label', text);
            button.style.width = `${this.style.menuWidth}px`;

            var i = undefined;

            if (icon) {
                i = document.createElement('i');
                i.className += " " + icon;
                i.setAttribute('aria-hidden', 'true');
            }

            var span = document.createElement('span');
            span.innerText = text;

            if (!this.style.RTL) {
                if (i){
                    i.style.marginRight = 'var(--spacing)';
                    button.appendChild(i);
                }

                button.style.justifyContent = 'flex-start';
                button.appendChild(span);
            }
            else {
                button.style.justifyContent = 'flex-end';
                button.appendChild(span);
                if (i) {
                    i.style.marginLeft = 'var(--spacing)';
                    button.appendChild(i);
                }
            }

            return button;
        }

        const separatorHTML = (id) => {
            var separator = document.createElement('div');
            separator.classList.add(ContextMenu.CLASSNAMES.SEPARATOR);
            separator.id = id;
            return separator;
        }

        const submenuHTML = (icon, text, id, submenuId) => {
            var button = document.createElement('button');
            button.classList.add(ContextMenu.CLASSNAMES.SUBMENU);
            button.classList.add(ContextMenu.CLASSNAMES.BUTTON);
            button.id = id;
            button.setAttribute('role', 'menuitem');
            button.setAttribute('aria-haspopup', 'true');
            button.setAttribute('aria-label', text);
            button.setAttribute('data-submenu', submenuId);
            button.style.width = `${this.style.menuWidth}px`;


            var i = undefined;

            if (icon) {
                i = document.createElement('i');
                i.className += " " + icon;
                i.setAttribute('aria-hidden', 'true');
            }

            var subMenuIcon = document.createElement('span');
            subMenuIcon.innerText = this.style.RTL ? '❮' : '❯';


            var span = document.createElement('span');
            span.innerText = text;

            if (!this.style.RTL) {
                if (i){
                    i.style.marginRight = 'var(--spacing)';
                    button.appendChild(i);
                }

                button.style.justifyContent = 'flex-start';
                button.appendChild(span);

                subMenuIcon.style.marginLeft = 'auto';
                button.appendChild(subMenuIcon);
            }
            else {
                subMenuIcon.style.marginRight = 'auto';
                button.appendChild(subMenuIcon);

                button.style.justifyContent = 'flex-end';
                button.appendChild(span);
                if (i) {
                    i.style.marginLeft = 'var(--spacing)';
                    button.appendChild(i);
                }
            }

            return button;
        }


        const items = this.buttons.map(button => ({type: 'button', ...button}))
            .concat(this.separators.map(sep => ({type: 'separator', ...sep})))
            .concat(this.submenus.map(submenu => ({type: 'submenu', ...submenu})))
            .sort((a, b) => a.position - b.position);

        let contextMenu = document.createElement('div');
        contextMenu.classList.add(ContextMenu.CLASSNAMES.MENU);
        contextMenu.id = this.id;
        contextMenu.setAttribute('role', 'menu');
        contextMenu.setAttribute('aria-orientation', 'vertical');
        contextMenu.setAttribute('tabindex', '0');
        contextMenu.style.width = `${this.style.menuWidth}px`;

        items.forEach(item => {
            switch (item.type) {
                case 'button':
                    contextMenu.append(buttonHTML(item.icon, item.text, item.id));
                    break;
                case 'separator':
                    contextMenu.append(separatorHTML(item.id));
                    break;
                case 'submenu': {
                    contextMenu.append(submenuHTML(item.icon, item.text, item.id, item.subMenu.id));
                    break;
                }
            }
        });

        return contextMenu;
    }

    getRandomId() {
        let a = (Math.random() * 2 ** 32) >>> 0;
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return (((t = t ^ t >>> 15) >>> 0) / 4294967296).toString(36).substring(2);
    }

    get data() {
        return {
            buttons: this.buttons,
            separators: this.separators,
            submenus: this.submenus
        };
    }

    get json() {
        return JSON.stringify(this.data);
    }
}