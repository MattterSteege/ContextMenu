class ContextMenu{static ITEM_TYPES={BUTTON:"button",SEPARATOR:"separator",SUBMENU:"submenu",INPUT:"input",DROPDOWN:"dropdown",CHECKBOX:"checkbox",RADIO:"radio"};static CLASSNAMES={BUTTON:"context-menu-button",SUBMENU:"context-menu-submenu",SEPARATOR:"context-menu-separator",MENU:"context-menu",INPUT:"context-menu-input",DROPDOWN:"context-menu-dropdown",CHECKBOX:"context-menu-checkbox",RADIO:"context-menu-radio",CONTAINER:"context-menu-container",ICON:"context-menu-icon",LABEL:"context-menu-label"};constructor(options={}){this.options={width:options.width||200,animation:{enabled:options.animation?.enabled??!0,duration:options.animation?.duration||200,timing:options.animation?.timing||"ease-out"},position:{xOffset:options.position?.xOffset||0,yOffset:options.position?.yOffset||0},icons:options.icons||{submenu:"❯"},style:{backgroundColor:options.style?.backgroundColor||"#ffffff",textColor:options.style?.textColor||"#333333",backgroundHoverColor:options.style?.backgroundHoverColor||"#f0f0f0",border:options.style?.border||"rgba(0, 0, 0, 0.08)",shadow:options.style?.shadow||"0 10px 25px rgba(0, 0, 0, 0.1)",accent:options.style?.accent||"#3b82f6",separator:options.style?.separator||"rgba(0, 0, 0, 0.08)"},indentLevel:options.indentLevel||0,isRoot:void 0===options.isRoot},this.items=[],this.id=this._generateId(),this.installStyles()}addItem(type,config){const item={id:this._generateId(),type:type,position:this.items.length,...config};return item.type===ContextMenu.ITEM_TYPES.SUBMENU&&(item.submenu.options.indentLevel=(this.options.indentLevel||0)+1),this._validateItem(item),this.items.push(item),this}button(text,action,config={}){return this.addItem(ContextMenu.ITEM_TYPES.BUTTON,{text:text,action:action,icon:config.icon,ficon:config.ficon,disabled:config.disabled,marked:config.marked})}input(label,config={}){return this.addItem(ContextMenu.ITEM_TYPES.INPUT,{label:label,placeholder:config.placeholder,value:config.value,onChange:config.onChange})}dropdown(label,options,config={}){return this.addItem(ContextMenu.ITEM_TYPES.DROPDOWN,{label:label,options:options,value:config.value,onChange:config.onChange,multiSelect:config.multiSelect})}checkbox(text,config={}){return this.addItem(ContextMenu.ITEM_TYPES.CHECKBOX,{text:text,checked:config.checked||!1,onChange:config.onChange})}radioGroup(name,options,config={}){return options.forEach((option=>{this.addItem(ContextMenu.ITEM_TYPES.RADIO,{text:option.text,value:option.value,name:name,checked:option.checked,onChange:config.onChange})})),this}separator(){return this.addItem(ContextMenu.ITEM_TYPES.SEPARATOR,{})}submenu(text,submenuBuilder,config={}){const options={...this.options,isRoot:!1,indentLevel:(this.options.indentLevel||0)+1},submenu=new ContextMenu(options);submenuBuilder(submenu);const items=this.addItem(ContextMenu.ITEM_TYPES.SUBMENU,{text:text,submenu:submenu,icon:config.icon,ficon:config.ficon}).items;return items[items.length-1].id=submenu.id,this}showAt(x,y,autoAdd=!0){const menu=this._render();return document.getElementById(this.id)&&document.getElementById(this.id).remove(),autoAdd&&document.body.appendChild(menu),this._setupEventHandlers(menu),this._positionMenu(menu,{x:x,y:y,position:"fixed"}),this._animateIn(menu),menu}destroy(){const menu=document.getElementById(this.id);menu&&menu.remove();const{handleClick:handleClick,handleContextMenu:handleContextMenu,handleMouseOver:handleMouseOver}=this._eventHandlers;return document.removeEventListener("click",handleClick),document.removeEventListener("contextmenu",handleContextMenu),document.removeEventListener("mouseover",handleMouseOver),this.items=[],this._eventHandlers={},this}_setupEventHandlers(menu){const handleClick=e=>{if(e.target.classList.contains(ContextMenu.CLASSNAMES.BUTTON)){const button=this.items.find((item=>item.id===e.target.id));button&&button.action()}if(!e.target.closest("."+ContextMenu.CLASSNAMES.MENU)){const contextMenu=document.getElementById(this.id);contextMenu&&contextMenu.remove()}},handleMouseOver=e=>{if(e.target.classList.contains(ContextMenu.CLASSNAMES.SUBMENU)){const submenu=this.items.find((item=>item.id===e.target.dataset.submenuId));if(submenu){if(e.target.parentElement.querySelector("#"+submenu.submenu.id))return;const htmlElement=submenu.submenu._render();submenu.submenu._setupEventHandlers(htmlElement),submenu.submenu._positionMenu(htmlElement,{x:e.target.getBoundingClientRect().right,y:e.target.getBoundingClientRect().top}),htmlElement.style.position="absolute",htmlElement.style.left=this.options.width+"px",htmlElement.style.top=e.target.getBoundingClientRect().top-e.target.parentElement.getBoundingClientRect().top+"px",e.target.parentElement.appendChild(htmlElement),htmlElement.addEventListener("mouseleave",handleMouseLeave),e.target.addEventListener("mouseleave",handleMouseLeave)}}},handleMouseLeave=event=>{const target=event.target;if(target.className===ContextMenu.CLASSNAMES.MENU)return void target.remove();const submenu=document.getElementById(target.dataset?.submenuId),isMouseOverButton=target.matches(":hover"),isMouseOverSubmenu=submenu?.matches(":hover");isMouseOverButton||isMouseOverSubmenu||submenu?.remove()};menu.addEventListener("click",handleClick),menu.addEventListener("mouseover",handleMouseOver),document.addEventListener("click",(e=>{if(e.preventDefault(),!e.target.classList.contains(ContextMenu.CLASSNAMES.MENU)){const contextMenu=document.getElementById(this.id);contextMenu&&contextMenu.remove()}})),this._eventHandlers={click:handleClick,handleMouseOver:handleMouseOver,handleMouseLeave:handleMouseLeave}}_validateItem(item){const validTypes=Object.values(ContextMenu.ITEM_TYPES);if(!item.type||!validTypes.includes(item.type))throw new Error(`Invalid item type: ${item.type}. Allowed types are: ${validTypes.join(", ")}`);switch(item.type){case ContextMenu.ITEM_TYPES.BUTTON:if(!item.text||"string"!=typeof item.text)throw new Error('Button item must have a "text" property of type string.');if(item.action&&"function"!=typeof item.action)throw new Error("Button item action must be a function.");break;case ContextMenu.ITEM_TYPES.SEPARATOR:break;case ContextMenu.ITEM_TYPES.SUBMENU:if(!(item.submenu&&item.submenu instanceof ContextMenu))throw new Error('Submenu item must have a "submenu" property that is an instance of ContextMenu.');break;case ContextMenu.ITEM_TYPES.INPUT:if(!item.label||"string"!=typeof item.label)throw new Error('Input item must have a "label" property of type string.');break;case ContextMenu.ITEM_TYPES.DROPDOWN:if(!item.label||"string"!=typeof item.label)throw new Error('Dropdown item must have a "label" property of type string.');if(!Array.isArray(item.options)||0===item.options.length)throw new Error('Dropdown item must have a non-empty "options" array.');break;case ContextMenu.ITEM_TYPES.CHECKBOX:if(!item.text||"string"!=typeof item.text)throw new Error('Checkbox item must have a "text" property of type string.');if("boolean"!=typeof item.checked)throw new Error('Checkbox item must have a "checked" property of type boolean.');break;case ContextMenu.ITEM_TYPES.RADIO:if(!item.text||"string"!=typeof item.text)throw new Error('Radio item must have a "text" property of type string.');if(!item.name||"string"!=typeof item.name)throw new Error('Radio item must have a "name" property of type string.');break;default:throw new Error(`Unhandled item type: ${item.type}`)}}_generateId(){return"_"+Math.random().toString(36).substring(2,9)}_render(){const menuContainer=document.createElement("div");return menuContainer.classList.add(ContextMenu.CLASSNAMES.MENU),menuContainer.id=this.id,menuContainer.setAttribute("role","menu"),menuContainer.setAttribute("aria-orientation","vertical"),menuContainer.style.width=`${this.options.width}px`,menuContainer.dataset.indent=this.options.indentLevel,this.items.forEach((item=>{let element;switch(item.type){case ContextMenu.ITEM_TYPES.BUTTON:element=this._createButton(item);break;case ContextMenu.ITEM_TYPES.SEPARATOR:element=this._createSeparator();break;case ContextMenu.ITEM_TYPES.SUBMENU:element=this._createSubmenu(item);break;case ContextMenu.ITEM_TYPES.INPUT:element=this._createInput(item);break;case ContextMenu.ITEM_TYPES.DROPDOWN:element=this._createDropdown(item);break;case ContextMenu.ITEM_TYPES.CHECKBOX:element=this._createCheckbox(item);break;case ContextMenu.ITEM_TYPES.RADIO:element=this._createRadio(item);break;default:console.warn(`Unknown item type: ${item.type}`)}element&&menuContainer.appendChild(element)})),menuContainer}_createButton(item){const button=document.createElement("button");if(button.classList.add(ContextMenu.CLASSNAMES.BUTTON),button.id=item.id,button.innerText=item.text,button.disabled=item.disabled||!1,button.dataset.marked=item.marked||!1,item.icon){const icon=document.createElement("span");icon.innerText=item.icon,button.prepend(icon)}if(item.ficon){const ficon=document.createElement("i");ficon.className=item.ficon,button.append(ficon)}return button}_createSeparator(){const separator=document.createElement("div");return separator.classList.add(ContextMenu.CLASSNAMES.SEPARATOR),separator}_createSubmenu(item){const submenuButton=document.createElement("button");if(submenuButton.classList.add(ContextMenu.CLASSNAMES.SUBMENU),submenuButton.innerText=item.text,submenuButton.setAttribute("aria-haspopup","true"),submenuButton.dataset.submenuId=item.id,item.icon){const icon=document.createElement("span");icon.innerText=item.icon,submenuButton.prepend(icon)}const moreIcon=document.createElement("span");if(moreIcon.innerText=this.options.icons.submenu,moreIcon.style.marginLeft="auto",submenuButton.append(moreIcon),item.ficon){const ficon=document.createElement("i");ficon.className=item.ficon,submenuButton.append(ficon)}return submenuButton}_createInput(item){const inputContainer=document.createElement("div");inputContainer.classList.add(ContextMenu.CLASSNAMES.INPUT);const input=document.createElement("input");return input.type=item.type||"text",input.placeholder=item.placeholder||"",input.value=item.value||"",input.oninput=e=>item.onChange?.(e.target.value),inputContainer.appendChild(input),inputContainer}_createDropdown(item){const select=document.createElement("select");return select.classList.add(ContextMenu.CLASSNAMES.DROPDOWN),item.options.forEach((option=>{const opt=document.createElement("option");opt.value=option.value,opt.textContent=option.label,option.value===item.value&&(opt.selected=!0),select.appendChild(opt)})),select.onchange=e=>item.onChange?.(e.target.value),select}_createCheckbox(item){const label=document.createElement("label");label.classList.add(ContextMenu.CLASSNAMES.CHECKBOX);const checkbox=document.createElement("input");checkbox.type="checkbox",checkbox.checked=item.checked||!1,checkbox.onchange=e=>item.onChange?.(e.target.checked);const span=document.createElement("span");return span.textContent=item.text,label.appendChild(checkbox),label.appendChild(span),label}_createRadio(item){const label=document.createElement("label");label.classList.add(ContextMenu.CLASSNAMES.RADIO);const radio=document.createElement("input");radio.type="radio",radio.name=item.name,radio.value=item.value,radio.checked=item.checked||!1,radio.onchange=e=>item.onChange?.(e.target.value);const span=document.createElement("span");return span.textContent=item.text,label.appendChild(radio),label.appendChild(span),label}_positionMenu(menu,position){const{x:x,y:y}=position,{xOffset:xOffset,yOffset:yOffset}=this.options.position;menu.style.left=`${x+xOffset||this.options.width}px`,menu.style.top=`${y+yOffset}px`,menu.style.position="fixed"}_animateIn(menu){this.options.animation.enabled&&(menu.style.opacity=0,menu.style.transform="scale(0.9)",menu.style.transition=`opacity ${this.options.animation.duration}ms ${this.options.animation.timing}, \n                             transform ${this.options.animation.duration}ms ${this.options.animation.timing}`,requestAnimationFrame((()=>{menu.style.opacity=1,menu.style.transform="scale(1)"})))}installStyles(){if(document.getElementById("context-menu-styles"))return;const styleElement=document.createElement("style");styleElement.id="context-menu-styles",styleElement.textContent="\n:root {\n  --context-menu-bg: "+(this.options.style.backgroundColor||"#ffffff")+";\n  --context-menu-text: "+(this.options.style.textColor||"#333333")+";\n  --context-menu-hover-bg: "+(this.options.style.backgroundHoverColor||"#f0f0f0")+";\n  --context-menu-border: "+(this.options.style.border||"rgba(0, 0, 0, 0.08)")+";\n  --context-menu-shadow: "+(this.options.style.shadow||"0 10px 25px rgba(0, 0, 0, 0.1)")+";\n  --context-menu-accent: "+(this.options.style.accent||"#3b82f6")+";\n  --context-menu-separator: "+(this.options.style.separator||"rgba(0, 0, 0, 0.08)")+";\n}\n\n.context-menu {\n  background: var(--context-menu-bg);\n  border: 1px solid var(--context-menu-border);\n  border-radius: 8px;\n  box-shadow: var(--context-menu-shadow);\n  padding: 8px 0;\n  min-width: 220px;\n  z-index: 1000;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  color: var(--context-menu-text);\n}\n\n.context-menu-button,\n.context-menu-submenu {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  padding: 10px 16px;\n  border: none;\n  background: none;\n  font-size: 14px;\n  text-align: left;\n  cursor: pointer;\n  color: var(--context-menu-text);\n  transition: \n    background-color 0.15s ease,\n    color 0.15s ease;\n  position: relative;\n  gap: 10px;\n}\n\n.context-menu-button:disabled {\n  color: rgba(26, 26, 26, 0.4);\n  cursor: not-allowed;\n}\n\n.context-menu-button[data-marked=\"true\"] {\n    font-weight: bold;\n    background-color: var(--context-menu-accent);\n    color: white;\n    border-radius: 4px;\n    border: 1px solid var(--context-menu-accent);\n}\n\n.context-menu-button[data-marked=\"true\"]:hover {\n    background-color: var(--context-menu-accent);\n    color: white;\n}\n\n.context-menu-button span,\n.context-menu-submenu span {\n  display: flex;\n  align-items: center;\n  pointer-events: none;\n}\n\n.context-menu-button:hover,\n.context-menu-submenu:hover {\n  background-color: var(--context-menu-hover-bg);\n}\n\n.context-menu-button:focus,\n.context-menu-submenu:focus {\n  outline: none;\n  background-color: var(--context-menu-hover-bg);\n}\n\n.context-menu-separator {\n  height: 1px;\n  background-color: var(--context-menu-separator);\n  margin: 8px 0;\n}\n\n.context-menu-input {\n  padding: 8px 16px;\n}\n\n.context-menu-input input {\n  width: calc(100% - 16px);\n  padding: 8px;\n  border: 1px solid var(--context-menu-border);\n  border-radius: 6px;\n  font-size: 14px;\n  background-color: #f9fafb;\n  transition: \n    border-color 0.2s ease,\n    box-shadow 0.2s ease;\n}\n\n.context-menu-input input:focus {\n  outline: none;\n  border-color: var(--context-menu-accent);\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);\n}\n\n.context-menu-dropdown {\n  width: calc(100% - 32px);\n  margin: 8px 16px;\n  padding: 8px;\n  border: 1px solid var(--context-menu-border);\n  border-radius: 6px;\n  font-size: 14px;\n  background-color: #f9fafb;\n  transition: \n    border-color 0.2s ease,\n    box-shadow 0.2s ease;\n}\n\n.context-menu-checkbox,\n.context-menu-radio {\n  display: flex;\n  align-items: center;\n  padding: 10px 16px;\n  font-size: 14px;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n\n.context-menu-checkbox:hover,\n.context-menu-radio:hover {\n  background-color: var(--context-menu-hover-bg);\n}\n\n.context-menu-checkbox input,\n.context-menu-radio input {\n  margin-right: 10px;\n  accent-color: var(--context-menu-accent);\n}\n\n.context-menu-submenu {\n  position: relative;\n}\n\n/* Animation */\n@keyframes contextMenuSlideIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.context-menu {\n  animation: contextMenuSlideIn 0.2s ease-out;\n  transform-origin: top center;\n}\n\n/* Focus and Accessibility */\n.context-menu:focus {\n  outline: none;\n}\n\n.context-menu-button:focus-visible,\n.context-menu-submenu:focus-visible {\n  outline: 2px solid var(--context-menu-accent);\n  outline-offset: -2px;\n}\n",document.head.appendChild(styleElement)}}