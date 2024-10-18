import "./getInTouchComponent.css"
import { Link } from "react-router-dom"
const GetInTouchComponent = () =>{
  return(
    <div className="get-in-touch-component">
      <h3>How do we see each other?</h3>
      <p>Online consultations will be carried out through a Google Meet link.</p>
      <p>If you are unable to attend a scheduled meeting, we kindly request that you inform us at least 24 hours in advance.</p>
      <Link to="/booking" className='button'>Book Your Appointment</Link>
    </div>
  )
}

export default GetInTouchComponent