import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <ul className="header-bg">
      <Link to="/">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </li>
      </Link>
      <li>
        <div className="grp-header">
          <Link to="/">
            {' '}
            <p className="head-p">Home</p>{' '}
          </Link>
          <Link to="/jobs">
            {' '}
            <p className="head-p">Jobs</p>{' '}
          </Link>
        </div>
      </li>
      <li>
        <button type="button" className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
