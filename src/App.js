import React, { PureComponent } from "react";
import { Container, Row, Col } from 'react-grid-system';
import Header from "./Header";
import SearchInput from "./SearchInput";
import MapResults from "./MapResults";
import filterMaps from "./filterMaps";
import Description from "./Description";

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    return (
      <div>
      <Header />
      <SearchInput textChange={this.handleSearchChange} />
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
    );
  }
}


