import React from 'react'
import socketIO from 'socket.io-client'

class AppComponent extends React.Component {
  componentDidMount() {
    const io = socketIO('localhost:5000');

    io.on('news', msg => console.log(msg))
  }

  render() {
    return (
      <div className="index">
        <button className="button">Hello human</button>
      </div>
    )
  }
}

export default AppComponent
