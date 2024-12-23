import React from 'react'

type ButtonProps = React.ComponentProps<'button'> & {
    
}

function Button(props:ButtonProps) {
  return (
    <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        {props.children}
    </button>
  )
}

export default Button