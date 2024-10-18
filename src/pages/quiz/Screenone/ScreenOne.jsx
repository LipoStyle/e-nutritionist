import image from "../../../images/quizImages/1.svg"
import "./screenone.css"

const ScreenOne = ({screen}) =>{
  return(
    <div id="screen1" className="screen">
      <h1 className="title">Time for a quick Quiz</h1>
      <p className="message">We're excited to assist you on your path to better health. To provide you with the most tailored advice, we invite you to share some basic information about yourself. Your well-being is our priority, and your details are handled with the utmost confidentiality. Let's begin sculpting a nutrition plan uniquely designed for you!</p>
      <p className="button-start" onClick={() => {screen("screen2",2)}}>Start</p>
      <div className="graph">
        <img src={image} alt="image" />
      </div>
    </div>
  )
}

export default ScreenOne;