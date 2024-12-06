import './index.css'
import {BiLinkExternal} from 'react-icons/bi'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import {FaStar} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'
import {HiMail} from 'react-icons/hi'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    api: apiStatus.initial,
    skills: [],
    lifeAtCompany: {},
  }
  componentDidMount() {
    this.getItemDetails()
  }
  getItemDetails = async () => {
    this.setState({api: apiStatus.inProgress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobDetails = data.job_details

      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        rating: jobDetails.rating,
        title: jobDetails.title,
        packagePerAnnum: jobDetails.package_per_annum,
      }
      const skills = jobDetails.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))
      const lifeAtCompany = {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      }
      const similarJobDetails = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState(
        {
          jobDetails: updatedJobDetails,
          similarJobs: similarJobDetails,
          api: apiStatus.success,
          skills,
          lifeAtCompany,
        },
        this.onRenderJob,
      )
    } else {
      this.setState({api: apiStatus.failure})
    }
  }
  onLoading = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }
  onRetry = () => {
    this.setState({api: apiStatus.inProgress}, this.getItemDetails)
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
  onRenderJob = () => {
    const {jobDetails, similarJobs, skills, lifeAtCompany} = this.state

    const {
      companyLogoUrl,
      title,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = jobDetails
    return (
      <>
        <div className="items-bg">
          <div className="inner-title">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <div className="life-grp">
                <FaStar className="star" /> <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-grp">
            <div className="inner-grp">
              <div className="inner-grp life-grp">
                <HiLocationMarker />
                <p>{location}</p>
              </div>
              <div className="life-grp">
                <HiMail />
                <p>{employmentType}</p>
              </div>
            </div>
            <div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line-1" />
          <div className="visit-grp">
            <h1>Description</h1>
            <a className="link-ref" href={companyWebsiteUrl}>
              Visit <BiLinkExternal />{' '}
            </a>
          </div>
          <p>{jobDescription}</p>
          <h1>Skills</h1>
          <ul className="items-bg-1">
            {skills.map(each => (
              <li className="skill-li" key={each.name}>
                <img
                  className="ima-skill"
                  src={each.imageUrl}
                  alt={each.name}
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="life-grp">
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="items-bg-1">
          {similarJobs.map(each => (
            <li className="items-bg-2" key={each.id}>
              <div className="inner-title">
                <img
                  className="company-logo"
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                />
                <div>
                  <h1 className="title">{each.title}</h1>
                  <div className="life-grp">
                    <FaStar className="star" /> <p>{each.rating}</p>
                  </div>
                </div>
              </div>
              <h1>Description</h1>
              <p>{each.jobDescription}</p>
              <div className="grp-location">
                <div className="life-grp">
                  <HiLocationMarker />
                  <p>{each.location}</p>
                </div>
                <div className="life-grp">
                  <HiMail />
                  <p>{each.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }
  onRenderItem = () => {
    const {api} = this.state
    switch (api) {
      case apiStatus.inProgress:
        return this.onLoading()
      case apiStatus.success:
        return this.onRenderJob()
      case apiStatus.failure:
        return this.onRenderJobsFailure()
      default:
        return null
    }
  }
  render() {
    return (
      <div className="details-bg">
        <Header />
        {this.onRenderItem()}
      </div>
    )
  }
}

export default JobItemDetails
