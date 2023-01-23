import React from 'react'
import ReactDOM from 'react-dom/client'
import ApplyPolyfills from './js/applyPolyfills'
ApplyPolyfills();
import MainRouter from './router/MainRouter'

ReactDOM.createRoot(document.getElementById('root')).render(
    <MainRouter/>
)
