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
    // this.test()
  }

  test() {
    axios.post('/api/createUser', {
      // axios.post('/api/allUsers', {
      id: 1000015,
      updates: {
        email: 'test@test.com',
        password: 'test'
      },
      limit: 2,
      offset: 2,
      email: 'test@test.com',
      password: 'test'
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
