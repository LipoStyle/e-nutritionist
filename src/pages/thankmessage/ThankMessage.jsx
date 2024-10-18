import './thankmessage.css'
import icon from "../../images/quizImages/thankyou_icon.svg"
import { Link } from 'react-router-dom'

const ThankMessage = () =>{
  return(
    <div className='thank-message'>
      <img src={icon} alt="ticked-image" className='ticked-image'/>
        <p className="head-1">Thank you for your cooperation!</p>
        <p className="head-3">One of our consultants will make sure to contact you through your email you provided!</p>
        <p className="head-2">Have a nice day!</p>
        <div className="back-to-home">
          <p className="label-for-button">Back to Homepage</p>
          <Link to="/" className="home-button" onClick={window.scrollTo(0, 0)}>Home</Link>
        </div>
    </div>
  )
}

export default ThankMessage;