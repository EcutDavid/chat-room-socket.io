import React from 'react'
import io from '../helpers/socketIO'

import '../styles/chatroom.scss'

export default class Chatroom extends React.Component {
  constructor() {
    super()
    this.state = { messages: [] }
  }

  componentDidMount() {
    io.on('message', data => {
      this.setState({messages: this.state.messages.concat(data)})
    })
  }

  sendMessage() {
    const {message, userName} = this.refs;
    io.emit('message', {
      message: message.value,
      userName: userName.value
    })
    message.value = ''
  }

  render() {
    const { messages } = this.state

    return (
      <div className='chatroom'>
        <ul className="messages">
        {
          messages.map((d, i) => (
            <li key={i}>
              {d}
            </li>
          ))
        }
        </ul>
        <div className='input-area'>
          <div className='row'>
            <p className='column small-4 medium-2 large-2'>User name:</p>
            <input className='column small-7 medium-9 large-9 end' ref="userName" />
          </div>
          <div>
            <p className='column small-4 medium-2 large-2'>Message:</p>
            <input className='column small-7 medium-9 large-9 end' ref="message" />
          </div>
          <button className='button' onClick={this.sendMessage.bind(this)}>Send</button>
        </div>
      </div>
    )
  }
}
