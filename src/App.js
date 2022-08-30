import React, { PureComponent } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Header from "./Header";
import SearchInput from "./SearchInput";
import MapResults from "./MapResults";
import filterMaps from "./filterMaps";
import Description from "./Description";
import Switch from "./Switch";
import Waifu from './Waifu';
import Nowaifu from './Nowaifu';
import "./App.css";

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    const isDark = JSON.parse(localStorage.getItem("isDark"));
    const isNoWaifus = JSON.parse(localStorage.getItem("waifu"));

    this.state = {
      darkTheme : isDark !== null ? isDark : false,
      noWaifus: isNoWaifus !== null ? isNoWaifus : false,
      filteredMaps: filterMaps("", 20),
      description:  {}
    };
  }

  handleSearchChange = event => {
    const res = filterMaps(event.target.value, 20);
    this.setState({
      filteredMaps: res,
      description: res[0] || {}
    });
  };

  handleSelection = event => {
    this.setState({
      description: event.data
    });
  };

  toggleTheme = (isDark) =>{
    localStorage.setItem("isDark",!isDark);
    this.setState({
      darkTheme: !isDark
    });
  }

  toggleNowaifu = (isNoWaifus) =>{
    localStorage.setItem("waifu",!isNoWaifus);
    console.log(`setting no waifu to :${!isNoWaifus}`);
    this.setState({
      noWaifus : !isNoWaifus
    });
  }

  render() {
    return (
      <div className="fill-window" id={this.state.darkTheme ? "dark":"light"}>

        <Header />
        <div className="nowaifu-container">
          <Nowaifu 
              isOn={this.state.noWaifus}
              handleToggle={this.toggleNowaifu}
          />
        </div>
        <div className="switch-container">
          <Switch
            isOn={this.state.darkTheme}
            handleToggle={this.toggleTheme}
          />
        </div>
        { !this.state.noWaifus &&
          <Waifu/>
        }
        <SearchInput textChange={this.handleSearchChange} />
        <div className="pane">
        <Container>
          <Row>
            <Col>
              <MapResults mapsData={this.state.filteredMaps} onSelection={this.handleSelection} />
            </Col>
            <Col>
              <Description map={this.state.description} />
            </Col>
          </Row>
        </Container>
        </div>
      </div>
    );
  }
}
