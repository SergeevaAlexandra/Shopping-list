import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import * as TanStackRouterProvider from '@/integrations/router/router-provider'
import * as TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'

import './styles.css'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider>
        <TanStackRouterProvider.Provider>
        </TanStackRouterProvider.Provider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}
