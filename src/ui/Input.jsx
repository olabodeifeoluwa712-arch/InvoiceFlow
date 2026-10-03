import React from 'react'

const Input = ({label, ...props}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-[#6A799E]">
      {label}
    </label>

    <input
      {...props}
      className="
      w-full
      h-12
      rounded-xl
      border border-gray-200
      bg-white
      px-4
      text-sm
      text-gray-900
      placeholder:text-[#99A1AF]
      outline-none
      transition
      focus:border-[#7F22FE]
      focus:ring-4
      focus:ring-[#F5F3FF]
      "
    />
  </div>
);
export default Input