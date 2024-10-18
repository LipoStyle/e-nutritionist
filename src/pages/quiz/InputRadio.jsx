const InputRadio = ({labelFor, typeOfInput, idOfInput, nameOfInput, valueOfInput, imageUrl}) =>{
  return(
    <label htmlFor={labelFor}>
      <input 
        type={typeOfInput}
        id={idOfInput}
        name={nameOfInput}
        value={valueOfInput}
      />
      <p>{valueOfInput}</p>
      <img src={imageUrl} alt="image" />
    </label>
  )
}

export default InputRadio