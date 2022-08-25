import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import MapResultRow from "./MapResultRow";
import "./MapResults.css";

export default class MapResults extends PureComponent {
  static propTypes = {
    mapsData: PropTypes.array,
    onSelection: PropTypes.func
  };

  render() {
    return (
      <div className="component-map-results">
        {this.props.mapsData.map(mapData => (
          <MapResultRow
            key={mapData.name}
            name={mapData.name}
            matches={mapData.matches}
            data={mapData}
            onSelection={this.props.onSelection}
          />
        ))}
      </div>
    );
  }
}
