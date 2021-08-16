'use strict';

/*!
 * MFramework JavaScript Library v1.0.0
 *
 * date: 1400-05-23
 */

var
      version = "1.0.0",

      // Use easy
      win = window,
      doc = win.document,

      // Main Function
      MF = (selector, name) => {
            return new MF.fn.convert(selector, name);
      };

// Save Maked MFNodes
MF.nodes = {};

MF.remove = name => {
      if(MF.nodes[name] !== undefined) {
            MF.nodes[name] = undefined;
            return true;
      }
      else return false;
};

// MF JS attributes
MF.fn = MF.__proto__ = {
      version: version,
      ver: version,
      constructor: MF,
      length: 0
};

// MF Selector Tag
MF.fn.convert = MF.convert = function (selector, name) {
      if (name === true) return MF.nodes[selector];
      if (name === undefined) {
            var rand = ((((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1));
            function check() {
                  if (MF.nodes[rand] !== undefined) {
                        rand = ((((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1));
                        check();
                  } else name = rand;
            }
            check();
      }
      MF.nodes[name] = this;
      this.name = name;
      var MFNode = this;

      // MF("") || MF(null) || MF(undefined) || MF(false)
      if (!selector) return false;

      if (selector.nodeType) { // When selector is a HTMLNode
            MFNode.elem = selector;
      } else if (typeof selector === "string") {
            MFNode.elem = document.querySelector(selector);
      } else return false;

      MFNode.remove = () => {
            MFNode.parent.elem.removeChild(MFNode.elem);
            MF.nodes[name] = undefined;
            MFNode = undefined;
      }

      // HTML attribute manager
      MFNode.HTML = (HTMLCode, append = false) => {
            if (HTMLCode === undefined) return MFNode.elem.innerHTML;
            else {
                  if (append) MFNode.elem.innerHTML += HTMLCode;
                  else MFNode.elem.innerHTML = HTMLCode;
            }
            return MFNode;
      };

      MFNode.HTML.__proto__ = {
            // Add new
            new: (name, value) => {
                  value = value || true;
                  MFNode.elem.setAttribute(name, value);
                  return MFNode;
            },

            // Delete old
            del: (name) => {
                  MFNode.elem.removeAttribute(name);
                  return MFNode;
            },

            // ClassList manager
            class: {
                  // Add
                  set new (val) {
                        val.split(' ').forEach((item, i) => {
                              MFNode.elem.classList.add(item)
                        });
                  },

                  // Remove
                  set del (val) {
                        val.split(' ').forEach((item, i) => {
                              MFNode.elem.classList.remove(item)
                        });
                  },

                  // Use with RETURN
                  add: (val) => {
                        val.split(' ').forEach((item, i) => {
                              MFNode.elem.classList.add(item)
                        });
                        return MFNode;
                  },
                  rem: (val) => {
                        val.split(' ').forEach((item, i) => {
                              MFNode.elem.classList.remove(item)
                        });
                        return MFNode;
                  },
                  remove: (val) => {
                        val.split(' ').forEach((item, i) => {
                              MFNode.elem.classList.remove(item)
                        });
                        return MFNode;
                  },

                  // Get list of classes
                  get list () {return MFNode.elem.classList}
            }
      };

      // JS attribute manager
      MFNode.JS = {
            // Add
            new: (name, value) => {
                  MFNode.elem[name] = value;
                  return MFNode;
            },

            // Delete
            del: (name) => {
                  MFNode.elem[name] = undefined;
                  return MFNode;
            },

            // Add a new value with += in a attribute
            plus: (name, value = 1) => {
                  MFNode.elem[name] += value;
                  return MFNode;
            },

            // Remove a old value with -= from a attribute
            minus: (name, value = 1) => {
                  MFNode.elem[name] -= value;
                  return MFNode;
            },

            // Get a attribute value
            get get () {return element[name]}
      };

      // CSS manager
      MFNode.CSS = cssValues => {
            cssValues = cssValues || false;
            if (!cssValues) {
                  return MFNode.elem.style;
            }
            var cssAttributes = Object.getOwnPropertyNames(MFNode.elem.style);
            cssAttributes.forEach((cssAttribute, cssAttributeIndex) => {
                  if (cssValues[cssAttribute] != undefined) {
                        MFNode.elem.style[cssAttribute] = cssValues[cssAttribute];
                  }
            });
            return MFNode;
      };

      // InnerText manager
      MFNode.Text = (PlainText, append = false) => {
            if (PlainText === undefined) return MFNode.elem.innerText;
            else {
                  if (append) MFNode.elem.innerText += PlainText;
                  else MFNode.elem.innerText = PlainText;
            }
            return MFNode;
      };

      // Child manager
      MFNode.append = child => {
            switch (typeof child) {
                  case "string":
                        MFNode.elem.append(child);
                        break;
                  case "object":
                        if (child.nodeType) {
                              MFNode.elem.appendChild(child);
                        } else if (child.MFramework) {
                              MFNode.elem.appendChild(child.elem);
                        } else if (child.forEach !== undefined) {
                              child.forEach((node, i) => {
                                    MFNode.append(node);
                              });
                        }
                        break;
            }
            return MFNode;
      };

      // Event manager
      MFNode.event = (eventName, behaviour) => {
            MFNode.elem['on' + eventName] = behaviour;
            return MFNode;
      }

      MFNode.__defineGetter__('parent', () => { return MF(MFNode.elem.parentElement); })

      MFNode.MFramework = true;
}

MF.fn.elem = MF.elem = (elementName, MFName, elementAttributes, elementStyles) => {
      // Make a new element
      var elem = doc.createElement(elementName);

      // Set non-required parameters
      elementAttributes = elementAttributes || [];
      elementStyles     = elementStyles     || [];

      // Set inline attributes
      elementAttributes.forEach((attributes, attributeIndex) => {
            // Syntax: <doType>@<name>@<value1>&&<value2>&&<value...>
            var attribute = attributes.split('@'),

            // Get <doType>
            doType = attribute[0],

            // Get <name>
            name = attribute[1],

            // Get <value>'s
            values = attribute[2].split('&&');

            // Set attributes per value
            values.forEach((value, valueIndex) => {
                  // Set default values (anything after "--- js: ")
                  var correctValue = value;
                  if (value.substr(0, 8) === "--- js: ") {
                        correctValue = eval(value.substr(8));
                  }

                  // do
                  switch (doType.toLowerCase()) {
                        case "+;":
                        case "atr":
                        case "attr":
                        case "att":
                        case "attrib":
                        case "attribute":
                              elem.setAttribute(name, correctValue);
                              break;
                        case "":
                        case "=":
                        case "eq":
                        case "equal":
                        case "set":
                              elem[name] = correctValue;
                              break;
                        case "+":
                        case "plus":
                        case "pluseq":
                        case "plusequal":
                              elem[name] += correctValue;
                              break;
                        case "++":
                        case "add":
                              elem[name].add(correctValue);
                              break;
                  }
            });
      });

      // Set Styles
      elementStyles.forEach((styles, styleIndex) => {
            // Syntax: @<name>@<value>
            var style = styles.split('@'),

            // Pick <name>
            name = style[1],

            // Pick <value>
            value = style[2];

            // Set style
            elem.style[name] = value;
      });


      // Convert HTMLNode to MFNode
      if (MFName !== undefined)
            return MF(elem, MFName);
      else
            return MF(elem);
};

MF.compressNodes = {};

// MF compress node class
MF.compressNode = function(name, MFNodes) {
      this.name = name;
      this.MFNodes = MFNodes;
      MF.compressNodes[this.name] = this;

      this.remove = () => {
            MF.compressNodes[this.name] = undefined;
            this.name = undefined;
            this.MFNodes = undefined;
      }

      this.do = (doing) => {
            var result = [];
            this.MFNodes.forEach((item, i) => {
                  var res = doing(item);
                  if (res !== undefined) result[i] = res;
            });
            if (result.length > 0) return result;
      }
}
MF.compressNode.remove = (name) => {
      if (MF.compressNodes[name] !== undefined) {
            MF.compressNodes[name].remove();
            return true;
      } else return false;
}

// Compress MFNodes for keep them as one
MF.compress = (name, ...MFNodes) => {
      if (MFNodes.length == 1 && typeof MFNodes[0] === "function" && MF.compressNodes[name] !== undefined) {
            return MF.compressNodes[name].do(MFNodes[0]);
      } else if (MFNodes.length == 0) return MF.compressNodes[name];
      else if (MFNodes.length > 1) {
            new MF.compressNode(name, MFNodes);
      } else return false;
}
