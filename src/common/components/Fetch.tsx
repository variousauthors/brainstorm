import React, {useState, useReducer} from 'react'
import axios from 'axios'

interface IState {
  error?: unknown,
  greeting: string,
}

interface IAction {
  type: 'SUCCESS' | 'ERROR',
  greeting: string
  error?: unknown
}

const initialState: IState = {
  greeting: '',
}

function greetingReducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'SUCCESS': {
      return {
        greeting: action.greeting,
      }
    }
    case 'ERROR': {
      return {
        error: action.error,
        greeting: '',
      }
    }
    default: {
      return state
    }
  }
}

export function Fetch({ url }: { url: string }) {
  const [{error, greeting}, dispatch] = useReducer(
    greetingReducer,
    initialState,
  )
  const [buttonClicked, setButtonClicked] = useState(false)

  const fetchGreeting = async (url: string) =>
    axios
      .get(url)
      .then((response: { data: { greeting: string }}) => {
        const {data} = response
        const {greeting} = data
        dispatch({type: 'SUCCESS', greeting})
        setButtonClicked(true)
      })
      .catch((error: unknown) => {
        dispatch({ type: 'ERROR', error, greeting: '' })
      })

  const buttonText = buttonClicked ? 'Ok' : 'Load Greeting'

  return (
    <div>
      <button onClick={() => fetchGreeting(url)} disabled={buttonClicked}>
        {buttonText}
      </button>
      {greeting !== '' && <h1>{greeting}</h1>}
      {error !== undefined && <p role="alert">Oops, failed to fetch!</p>}
    </div>
  )
}