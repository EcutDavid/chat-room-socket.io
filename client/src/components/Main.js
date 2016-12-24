import React from 'react'
import io from '../helpers/socketIO'

import '../styles/main.scss'


// TODO list:
// 1. chat room
// 2. clean code
class AppComponent extends React.Component {
  constructor() {
    super()
    this.state = { rooms: [], isInTransaction: false }
  }

  componentDidMount() {
    io.emit('fetchData', {
      type: 'dashboard'
    })
    io.on('data', ({type, value}) => {
      if (type === 'dashboard') {
        this.setState({ rooms: value })
      }
    })
    io.on('update', ({type, value}) => {
      if (type === 'dashboard') {
        this.setState({ rooms: value })
      }
    })
  }

  createNewRoom() {
    io.emit('room', {
      type: 'create'
    })
    this.setState({isInTransaction: true})
  }

  enterRoom(ID) {
    io.emit('room', {
      type: 'enter',
      ID
    })
    this.setState({isInTransaction: true})
  }

  render() {
    const { rooms, isInTransaction } = this.state

    return isInTransaction ? (
      <div>Chart room</div>
    ) : (
      <div className='row small-up-2 medium-up-3 large-up-4'>
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
    )
  }
}

export default AppComponent
