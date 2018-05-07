import React, { Component } from 'react';
import propTypes from 'prop-types';

class CustomProperties extends Component {
  styleElement = null
  customClass = ''

  constructor(props) {
    super(props);

    this.container = null;
    this.handleNewProperties = this.handleNewProperties.bind(this);

    if (!document.querySelector("style#react-css-custom-styles")) {
      // Create the <style> tag
      const styleElement = document.createElement("style");
      styleElement.setAttribute("id", "react-css-custom-styles")

      // WebKit hack
      styleElement.appendChild(document.createTextNode(""));

      // Add the <style> element to the page
      document.head.appendChild(styleElement);

      this.styleElement = styleElement

      window.onbeforeunload = () => sessionStorage.removeItem("customClassSequence");
    } else {
      this.styleElement = document.querySelector("style#react-css-custom-styles")
    }

    let customClassSequence = sessionStorage.getItem("customClassSequence")
    if (!customClassSequence) {
      customClassSequence = 0
      sessionStorage.setItem("customClassSequence", customClassSequence)
    } else {     
      customClassSequence = customClassSequence + 1
      sessionStorage.setItem("customClassSequence", customClassSequence)
    }
    this.customClass = `react-css-custom-${customClassSequence}`
    
  }

  componentDidMount() { 
    const { properties } = this.props;
    const keys = Object.keys(properties);
    this.insertStyles(properties)
  }

  componentWillReceiveProps(nextProps) {
    const { properties } = this.props;

    if (nextProps.properties !== properties) {
      this.handleNewProperties(nextProps.properties, properties);
    }
  }

  componentWillUnmount() {
    const { global, properties } = this.props;

    if (!global) {
      return;
    }
    this.removeStyles()
  }

  handleNewProperties(next, previous) {
    this.removeStyles()
    this.insertStyles(next)
  }

  insertStyles(properties) {
    const customStringify = (obj_from_json) => {
      if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
          // not an object, stringify using native function
          return JSON.stringify(obj_from_json);
        }
        // Implements recursive object serialization according to JSON spec
        // but without quotes around the keys.
        let props = Object
          .keys(obj_from_json)
            .map(key => `${key}:${customStringify(obj_from_json[key])}`)
            .join(";");
        return `{${props}}`;
    }

    const ruleSet = customStringify(properties)
    debugger
    const styleSpecifier = this.props.global ? ':root' : `.${this.customClass}`
    this.styleElement.sheet.insertRule(`${styleSpecifier} ${ruleSet}`,0)
  }

  removeStyles() {
    const currentStyleSheet = this.styleElement.sheet;
    const styleSpecifier = this.props.global ? ':root' : `.${this.customClass}`
    for (let i=0; i < currentStyleSheet.cssRules.length; i++) {
      if (currentStyleSheet.cssRules[i].selectorText === styleSpecifier)
        currentStyleSheet.deleteRule(i)
        break
    }
  }

  render() {
    return !this.props.global ? (
      <div className={this.customClass}>
        {this.props.children}
      </div>
    ) : (this.props.children || null);
  }
}

CustomProperties.propTypes = {
  global: propTypes.bool,
  properties: propTypes.objectOf((value, key, componentName) => {
    const pattern = /^--\S+$/;
    if (!pattern.test(key)) {
      return new Error(`
<${componentName} /> could not set the property "${key}: ${value[key]};".
Custom Property names must be a string starting with two dashes, for example "--theme-background".
      `.trim());
    }
  }),
};

CustomProperties.defaultProps = {
  global: false,
  properties: {},
};

export default CustomProperties;
