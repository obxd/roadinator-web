import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import nowaifu from './nowaifu.png';
import './Nowaifu.css';

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
          className="nowaifu"
          type="checkbox"
        />
        <img src={nowaifu} alt="nowaifu" />
      </>
    );
  }
}

