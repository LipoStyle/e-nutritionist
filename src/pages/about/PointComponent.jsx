
const PointComponent = ({title, description, active, handlePoint}) => {


  return(
    <div className={active ? "informations active" : "informations"}>
      <h3 className="title-of-information" onClick={handlePoint}>{title}
        <span className={active ? "sign active":"sign"}>&#10596;</span>
        </h3>
      {active && <p className="description-of-information">{description}</p>}
    </div>
  )
}

export default PointComponent