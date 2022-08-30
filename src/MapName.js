import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class MapName extends PureComponent {
  static propTypes = {
    matches: PropTypes.object,
    name: PropTypes.string
  };

  render() {
    let matches = [...this.props.matches];
    matches.sort((a, b) =>  a - b);
    return (
      <span>
      {
        [...this.props.name].map((c,i) => {
          if(matches.length > 0 && i === matches[0])      
          {
            matches.shift();
            return (<span key={i} style={{color:"red"}}><b>{c}</b></span>);
          }
          else
            return c;
        })
      }
      </span>
    );
  }
}
