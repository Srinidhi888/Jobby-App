import './index.css'
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCard from '../JobCard'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const profile = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    type: [],
    salary: 0,
    profileData: {},
    profileStatus: profile.initial,
    searchStatus: profile.initial,
    searchInput: '',
    itemList: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getItems()
  }
  onSearch = () => {
    this.getItems()
  }
  onProfileSuccess = data => {
    this.setState({profileData: data, profileStatus: profile.success})
  }
  onProfileFailure = () => {
    this.setState({profileStatus: profile.failure})
  }
  onSuccess = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-bg">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="name-head">{name}</h1>
        <p className="para-bio">{shortBio}</p>
      </div>
    )
  }
  onFailure = () => {
    return (
      <div className="loader-container">
        <button
          type="button"
          className="logout-btn"
          onClick={this.onRetryProfile}
        >
          Retry
        </button>
      </div>
    )
  }
  onRenderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profile.inProgress:
        return this.onLoading()
      case profile.success:
        return this.onSuccess()
      case profile.failure:
        return this.onFailure()
      default:
        return null
    }
  }
  onLoading = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }
  onItemSuccess = () => {
    const {itemList} = this.state

    return (
      <ul>
        {itemList.map(each => (
          <JobCard key={each.id} details={each} />
        ))}
      </ul>
    )
  }
  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }
  getItems = async () => {
    this.setState({searchStatus: profile.inProgress})
    const {salary, type, searchInput} = this.state
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type.join()}&minimum_package=${salary}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({itemList: updatedData, searchStatus: profile.success})
      this.onItemSuccess()
    } else {
      this.setState({searchStatus: profile.failure})
    }
  }
  getProfile = async () => {
    this.setState({profileStatus: profile.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.onProfileSuccess(updatedData)
    } else {
      this.onProfileFailure()
    }
  }
  onCheck = event => {
    const updatedType = event.target.value
    const {type} = this.state
    if (type.includes(updatedType)) {
      const newType = type.filter(each => each !== updatedType)
      this.setState({type: newType}, this.getItems)
    } else {
      this.setState(
        prevState => ({type: [...prevState.type, updatedType]}),
        this.getItems,
      )
    }
  }
  onRetryProfile = () => {
    this.setState({profileStatus: profile.inProgress}, this.getProfile)
  }
  onSalary = event => {
    const newSalary = event.target.value
    this.setState({salary: newSalary}, this.getItems)
  }
  onRenderJobsFailure = () => {
    return (
      <div className="no-job-bg">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.onRetry} className="logout-btn">
          Retry
        </button>
      </div>
    )
  }
  onRetry = () => {
    this.setState({searchStatus: profile.inProgress}, this.getItems)
  }
  onRenderNoJobs = () => {
    return (
      <div className="no-job-bg">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }
  onRenderJobs = () => {
    const {searchStatus, itemList} = this.state
    const size = itemList.length
    switch (searchStatus) {
      case size === 0 && profile.success:
        return this.onRenderNoJobs()
      case profile.inProgress:
        return this.onLoading()
      case profile.success:
        return this.onItemSuccess()
      case profile.failure:
        return this.onRenderJobsFailure()
      default:
        return null
    }
  }
  render() {
    const {searchInput, type, salary} = this.state
    return (
      <div className="job-bg">
        <Header />
        <div className="total-grp">
          <div>
            {this.onRenderProfile()}
            <hr className="line" />
            <h1 className="head">Type of Employment</h1>
            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    onChange={this.onCheck}
                    value={each.employmentTypeId}
                    type="checkbox"
                    id={each.employmentTypeId}
                  />
                  <label className="types" htmlFor={each.employmentTypeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="line" />
            <h1 className="head">Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    onChange={this.onSalary}
                    checked={salary === each.salaryRangeId}
                    type="radio"
                    id={each.salaryRangeId}
                    value={each.salaryRangeId}
                  />
                  <label className="types" htmlFor={each.salaryRangeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="search-bg">
            <div className="search-input-bg">
             
              <input
                placeholder="Search"
                value={searchInput}
                onChange={this.onSearchInput}
                className="search-input"
                id="searched"
                type="search"
                aria-label="Search"
              />
              <button
                onClick={this.onSearch}
                type="button"
                className="search-btn"
                data-testid="searchButton"
                aria-label="Search"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>{this.onRenderJobs()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
