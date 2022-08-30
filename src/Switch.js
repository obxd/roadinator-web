import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import './Switch.css';

export default class Switch extends PureComponent {
  static propTypes = {
    isOn: PropTypes.bool,
    handleToggle: PropTypes.func
  };

  handleClick = () => {
    this.props.handleToggle(this.props.isOn);
  }

  render(){
    return (
      <>
        <input
          checked={this.props.isOn}
          onChange={this.handleClick}
          className="react-switch-checkbox"
          id={`react-switch-new`}
          type="checkbox"
        />
        <label
          className="react-switch-label"
          htmlFor={`react-switch-new`}
        >
          <span className={`react-switch-button`} />
        </label>
      </>
    );
  }
}

