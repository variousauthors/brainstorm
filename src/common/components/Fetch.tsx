import React, { useReducer, useState } from 'react'
import axios from 'axios'
import { isDefined } from '@atoms/helpers'

interface IState {
  error: string
  greeting: string
}

const initialState: IState = {
  error: '',
  greeting: '',
}

type IAction = { type: 'SUCCESS' | 'ERROR', error: string, greeting: string }

function greetingReducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'SUCCESS': {
      return {
        error: '',
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
      .get<{ greeting: string }>(url)
      .then((response) => {
        const greeting = response.data.greeting
        dispatch({ type: 'SUCCESS', greeting, error: '' })
        setButtonClicked(true)
      })
      .catch((error: string) => {
        dispatch({ type: 'ERROR', error, greeting: '' })
      })

  const buttonText = buttonClicked ? 'Ok' : 'Load Greeting'

  return (
    <div>
      <button onClick={() => fetchGreeting(url)} disabled={buttonClicked}>
        {buttonText}
      </button>
      {isDefined(greeting) && <h1>{greeting}</h1>}
      {isDefined(error) && <p role="alert">Oops, failed to fetch!</p>}
    </div>
  )
}