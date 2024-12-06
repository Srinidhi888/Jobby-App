import './index.css'
import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {HiLocationMarker,HiMail} from 'react-icons/hi'

const JobCard = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = details
  return (
    <Link className="link" to={`/jobs/${id}`}>
      <li className="item-bg">
        <div className="inner-title">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="title">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
