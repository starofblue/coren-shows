import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
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
        <div class='title'>
          <img class='titlePic' src='https://drive.google.com/uc?export=view&id=1lk2mztscq5D2stuCj9lOW2JEM2zbSfp8' alt="Coren's shows" />
          A website where I list TV shows I like
        </div>
        <div class='body'>
          <div class='subtitle'>I have personally watched every show listed, so you can rest assured that the quality of this content has been properly vetted.</div>
          <div class='subtitle'>Filter by genre, tags, or availability on streaming services to find your next show.</div>
          <div class='subtitle'>Happy watching!</div>
          <div class='filterBox'>
            <div class='filterLabel'>Filter by:</div>
            <DropdownButton className='filter' id='genre' variant='default' title="Genre">
              <Dropdown.Item>Action</Dropdown.Item>
            </DropdownButton>
            <DropdownButton className='filter' id='tags' variant='default' title="Tags">
              <Dropdown.Item>Action</Dropdown.Item>
            </DropdownButton>
            <DropdownButton className='filter' id='streaming' variant='default' title="Streaming">
              <Dropdown.Item>Action</Dropdown.Item>
            </DropdownButton>
          </div>
          <div class='tvShowList'>
            {this.state.data.map((show, index) => {
              return <div class='tvShow' key={index}>
                <div class='mainRow'>
                  <img class='thumbnail' src={'https://drive.google.com/uc?export=view&id=' + show.image_id} alt='Show thumbnail' />
                  <div class='mainDetails'>
                    <div class='showTitle'>{show.name}</div>
                    <div class='genre'>Genre: {show.genre}</div>
                    <div class='tags'>Tags: {show.tags}</div>
                  </div>
                </div>
                <div class='description'>{show.description}</div>
                <div class='status'><span class='bold'>Status: </span>{show.status}</div>
                <div class='streaming'><span class='bold'>Where to watch: </span>{show.streaming}</div>
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
