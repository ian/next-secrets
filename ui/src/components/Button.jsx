export default function Button(props) {
  const { children, ...rest } = props
  return (
    <button
      {...rest}
      className="flex-shrink px-4 p-2 shadow-sm sm:text-sm border rounded-md hover:bg-gray-50"
    >
      {children}
    </button>
  )
}
