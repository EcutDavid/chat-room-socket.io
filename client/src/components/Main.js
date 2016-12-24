import React from 'react'
import io from '../helpers/socketIO'
import ChatRoom from './Chatroom'

import '../styles/main.scss'

// TODO: clean code
export default class Main extends React.Component {
  constructor() {
    super()
    this.state = { rooms: [], isInTransaction: false, totalUserCount: 0 }
  }

  componentDidMount() {
    io.emit('fetchData', {
      type: 'dashboard'
    })
    io.on('data', ({type, value: {rooms, totalUserCount}}) => {
      if (type === 'dashboard') {
        this.setState({ rooms, totalUserCount })
      }
    })
    io.on('update', ({type, value: {rooms, totalUserCount}}) => {
      if (type === 'dashboard') {
        if (rooms)
          this.setState({ rooms })
        if (totalUserCount)
          this.setState({ totalUserCount })
      }
    })
  }

  createNewRoom() {
    io.emit('room', { type: 'create' })
    this.setState({isInTransaction: true})
  }

  enterRoom(ID) {
    io.emit('room', { type: 'enter', ID })
    this.setState({isInTransaction: true})
  }

  render() {
    const { rooms, isInTransaction, totalUserCount } = this.state

    return isInTransaction ? (
      <ChatRoom />
    ) : (
      <div>
        <header className='row'>
          <div className='column column-block'>
            <h2>{`${totalUserCount} user${totalUserCount > 1 ? 's' : ''} online`}</h2>
          </div>
        </header>
        <div>
          <div className='rooms-container small-up-2 medium-up-3 large-up-4'>
            {
              rooms.map(({ID, userCount}, i) => (
                <div
                  className='room column column-block'
                  key={i}
                  onClick={() => this.enterRoom(ID)}
                  >
                  <article>
                    <p>{`Room ${ID}`}</p>
                    <p>{`${userCount} user${userCount > 1 ? 's' : ''}`}</p>
                  </article>
                </div>
              ))
            }
            <button
              className='submit-btn button'
              onClick={this.createNewRoom.bind(this)}
            >
              Create a New Room
            </button>
          </div>
        </div>
      </div>
    )
  }
}
