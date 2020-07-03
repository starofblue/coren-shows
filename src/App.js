import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    let url = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/1/public/full?alt=json';
    let data = [];
    let headers = [];

    fetch(url)
      .then(res => res.json())
      .then((spreadsheetJSON) => {
        const entries = spreadsheetJSON.feed.entry;
        entries.forEach(entry => {
          let entryContents = entry.gs$cell;
          if (entryContents.row === '1') {
            headers.push(entryContents.inputValue.toLowerCase());
          }
          else {
            if (entryContents.col === '1') {
              data.push(Object());
            }
            let row = data[data.length - 1];
            let header = headers[Number(entryContents.col) - 1];
            row[header] = entryContents.inputValue;
          }
        })
        this.setState({ data: data });
      })
      .catch(err => { throw err });  // TODO show a nice error message
  }

  render() {
    return (
      <div class='mainFrame'>
        <div class='title'>Coren's List, a website where I list TV shows I like</div>
        <div class='body'>
          <div class='subtitle'>Find your next TV show to watch!</div>
          <div class='filterBox'>
            <div class='filterLabel'>Filter by:</div>
            <select class='filter' name="genre" id="genre">
              <option value="" disabled selected>Genre</option>
            </select>
            <select class='filter' name="tags" id="tags">
              <option value="" disabled selected>Tags</option>
            </select>
            <select class='filter' name="streaming" id="streaming">
              <option value="" disabled selected>Streaming</option>
            </select>
          </div>
          <div class='tvShowList'>
            {this.state.data.map((show, index) => {
              return <div class='tvShow' key={index}>
                <div class='mainRow'>
                  <img class='thumbnail' src={show.imageurl} />
                  <div class='mainDetails'>
                    <div class='mainDetail showTitle'>{show.name}</div>
                    <div class='mainDetail'>Genre: {show.genre}</div>
                    <div class='mainDetail'>Tags: {show.tags}</div>
                  </div>
                </div>
                <div>{show.description}</div>
                <div>Status: {show.status}</div>
                <div>Where to watch: {show.streaming}</div>
                <hr class='hr' />
              </div>
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
