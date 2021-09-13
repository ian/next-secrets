import { useForm } from "react-hook-form"

import Button from "./Button"
import Input from "./Input"

export default function ConfigEdit(props) {
  const { vars, onChange } = props
  if (!vars) return "Loading ..."

  const handleDelete = (key) => {
    const newVars = { ...vars }
    delete newVars[key]
    onChange(newVars)
  }

  const handleAdd = (values) => {
    const { name, value } = values
    const newVars = { ...vars, [name]: value }
    onChange(newVars)
  }

  return (
    <div>
      <div className="mt-5 mb-10 bg-gray-50 border p-5 rounded-xl shadow-xl">
        <Add onSave={handleAdd} />
      </div>
      {Object.entries(vars).map(([k, v]) => (
        <Row name={k} value={v} onDelete={handleDelete} />
      ))}
    </div>
  )
}

const Row = ({ name, value, onDelete }) => {
  return (
    <div className="flex justify-between space-x-2 mb-2">
      <Input placeholder="NEXT_PUBLIC_VAR_NAME" value={name} />
      <Input placeholder="..." value={value} />
      <Button onClick={() => onDelete(name)}>X</Button>
    </div>
  )
}

function Add(props) {
  const { onSave } = props
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handler = (data) => {
    onSave(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handler)}>
      <label htmlFor="">Add new variable</label>
      <div className="flex justify-between space-x-2 mb-2">
        <input
          className="font-mono p-2 shadow-sm block w-full sm:text-sm border rounded-md"
          placeholder="NEXT_PUBLIC_VAR_NAME"
          {...register("name", { required: true })}
        />
        <input
          className="font-mono p-2 shadow-sm block w-full sm:text-sm border rounded-md"
          placeholder="..."
          {...register("value", { required: true })}
        />
        <Button type="submit">+</Button>
      </div>
    </form>
  )
}
