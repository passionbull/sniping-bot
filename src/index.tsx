import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import Example from './example/Bot'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>
)
