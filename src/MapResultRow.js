import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import MapName from "./MapName";
import "./MapResultRow.css";

export default class MapResultsRow extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    matches: PropTypes.array,
    data: PropTypes.object,
    onSelection: PropTypes.func
  };

   handleClick = (event) => {
    event.data = this.props.data;
    this.props.onSelection(event);
  }

  render() {
    return (
      <div 
        className="component-map-result-row" 
        onClick={this.handleClick}
      >
        <span className="title" >
          <MapName name={this.props.name} matches={this.props.matches} />
        </span>
      </div>
    );
  }
}
