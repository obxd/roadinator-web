import React, { PureComponent } from "react";
import "./Header.css";

export default class Header extends PureComponent {
  render() {
    return (
      <header className="component-header">
        <img
          src="//cdn.jsdelivr.net/npm/emojione-assets@4.5.0/png/128/1f984.png"
          width="32"
          height="32"
          alt=""
        />
        Roadinator-Web
        <img
          src="//cdn.jsdelivr.net/npm/emojione-assets@4.5.0/png/128/1f984.png"
          width="32"
          height="32"
          alt=""
        />
      </header>
    );
  }
}
