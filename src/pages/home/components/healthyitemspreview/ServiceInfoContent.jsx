const ServiceInfoContent = ({imgUrl, title, description}) => {
  return(
    <div className="carusel-item">
      <img src={imgUrl} alt="image" className="image-of-services-section"/>
      <h3 className="title-of-service">{title}</h3>
      <p className="description-of-service">{description}</p>
    </div>
  )
}

export default ServiceInfoContent