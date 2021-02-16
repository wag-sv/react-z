import React from "react";

class Search extends React.Component {
  render() {
    return (
      <div id="search">
        <form className="container">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="beerFormName"
              name="name"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Search;
