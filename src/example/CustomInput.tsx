import React, { useState } from 'react'

interface Props {
  defaultInput: string
  txt: string
  handleInput: (input: string) => void
}

const CustomInput: React.FC<Props> = ({ txt, defaultInput, handleInput }) => {
  const [inputValue, setInputValue] = useState(defaultInput)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    handleInput(event.target.value)
  }

  return (
    <div>
      <div>{`${txt}`}</div>
      <input type="number" value={inputValue} onChange={handleChange} />
    </div>
  )
}

export default CustomInput
