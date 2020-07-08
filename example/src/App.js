import React from 'react'
import {
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom'

// This example is copied from https://reactrouter.com/web/example/auth-workflow

export default function AuthExample() {
  return (
    <div>
      <AuthButton />

      <ul>
        <li>
          <Link to='/public'>Public Page</Link>
        </li>
        <li>
          <Link to='/protected'>Protected Page</Link>
        </li>
      </ul>

      <Switch>
        <Route path='/public'>
          <PublicPage />
        </Route>
        <Route path='/login'>
          <LoginPage />
        </Route>
        <PrivateRoute path='/protected'>
          <ProtectedPage />
        </PrivateRoute>
      </Switch>
    </div>
  )
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    fakeAuth.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

function AuthButton() {
  let history = useHistory()

  return fakeAuth.isAuthenticated ? (
    <p>
      Welcome!{' '}
      <button
        onClick={() => {
          fakeAuth.signout(() => history.push('/'))
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

function PublicPage() {
  return <h3 onClick={(e) => console.log('child', e, e._targetInst)}>Public</h3>
}

function ProtectedPage() {
  return <h3>Protected</h3>
}

function LoginPage() {
  let history = useHistory()
  let location = useLocation()

  let { from } = location.state || { from: { pathname: '/' } }
  let login = () => {
    fakeAuth.authenticate(() => {
      history.replace(from)
    })
  }

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  )
}
