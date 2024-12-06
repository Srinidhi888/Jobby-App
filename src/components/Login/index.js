import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}
  
  onUsername = event => {
    this.setState({username: event.target.value})
  }
  onPassword = event => {
    this.setState({password: event.target.value})
  }
  onSuccess = jwtToken => {
    this.setState({username: '', password: ''})
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    const {history} = this.props
    history.replace('/')
  }
  onFailure = errorMsg => {
    this.setState({errorMsg: `*${errorMsg}`})
  }
  onLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      console.log(data)
      this.onFailure(data.error_msg)
    }
  }
  render() {
    const {username, password, errorMsg} = this.state
    const jwt = Cookies.get('jwt_token')
    if (jwt !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg">
        <form className="login-inner-bg" onSubmit={this.onLogin}>
          <div className="website-ima">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <div className="input-bg">
            <label htmlFor="username">USERNAME</label>
            <input
              value={username}
              type="text"
              onChange={this.onUsername}
              className="user-input"
              id="username"
              placeholder="Username"
            />
          </div>
          <div className="input-bg">
            <label htmlFor="password">PASSWORD</label>
            <input
              value={password}
              type="password"
              onChange={this.onPassword}
              className="user-input"
              id="password"
              placeholder="Password"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          <p className="error-msg">{errorMsg}</p>
        </form>
      </div>
    )
  }
}

export default Login
