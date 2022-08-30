import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import "./Description.css";

export default class Description extends PureComponent {
  static propTypes = {
    map: PropTypes.object,
  };


  render() {
    if (Object.getOwnPropertyNames(this.props.map).length === 0 )
      return <div></div>
    else
      return (
      <div>
        <h2> {this.props.map.name} </h2>
        <p> Road type: <b>{this.props.map.data.type}</b></p>
        <p> Tier: <b>{this.props.map.data.tier}</b></p>
         <table border="1">
          <thead>
            <tr>
              <th>Type</th>
              <th>Size</th>
              <th>Tier</th>
            </tr>
          </thead>
        <tbody>
          {this.props.map.data.components.map( (component,index) => (
            <tr className = {component.bgcolor} key={index}>
              <td>{component.type}</td>
              <td>{component.size}</td>
              <td>{component.tier}</td>
            </tr>
          ))}
        </tbody>

        </table>
      </div>
    );
  }
}
