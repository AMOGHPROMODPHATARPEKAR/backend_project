import React from 'react'

const Button = ({
    children,
    type='button',
    bgColor='bg-blue-600',
    textColor='text-white',
    className ='',
    subscribed,
    ...props
}) => {
  return (
    <button className={`px-4 py-2 rounded-lg ${subscribed ? 'bg-gray-500' : bgColor } ${textColor} ${className}`}{...props}>
        {children}
    </button>
  )
}

export default Button