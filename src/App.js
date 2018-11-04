import React, { Component } from 'react';
import router from './router';
import axios from 'axios';

import './reset.css';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    axios.post('/api/login', {
      email: 'test@gmail.com',
      password: 'testPassword88'
    })
      .then(res => {
        console.log(res)
      })
  }

  render() {
    return (
      <div className="App">

        {router}

      </div>
    );
  }
}


export default App;
