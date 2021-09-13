import { useEffect, useState } from "react"
import ConfigEdit from "./components/ConfigEdit"
import EnvSelect from "./components/EnvSelect"
// import logo from "./logo.svg"
// import "./App.css"

function App() {
  // const [envs, setEnvs] = useState(null)
  const [envs, setEnvs] = useState(["development", "preview", "production"])
  const [selectedEnv, setSelectedEnv] = useState(null)
  const [vars, setVars] = useState(null)

  useEffect(() => {
    listEnvs().then((json) => {
      // setEnvs(json.available)
      setSelectedEnv(json.current)
    })
  }, [])

  useEffect(() => {
    if (selectedEnv) getEnv(selectedEnv).then(setVars)
  }, [selectedEnv])

  const handleChange = (newVars) => {
    setVars(newVars)
    setEnv(selectedEnv, newVars)
  }

  if (!envs) return "Loading ..."

  return (
    <div className="p-20">
      <div className="mb-5 flex justify-between items-center border-b-2 pb-5">
        <h1 className="text-xl font-bold">next-secrets</h1>
        <EnvSelect
          options={envs}
          selected={selectedEnv}
          onChange={setSelectedEnv}
        />
      </div>
      <ConfigEdit vars={vars} onChange={handleChange} />
    </div>
  )
}

async function listEnvs() {
  return fetch(`/api/secrets`, { method: "post" }).then(
    (res) => res.json()
  )
}

async function getEnv(env) {
  return fetch(`/api/secrets?env=` + env, {
    method: "post",
  }).then((res) => res.json())
}

async function setEnv(env, vars) {
  return fetch(`/api/secrets?env=` + env, {
    method: "put",
    body: JSON.stringify(vars),
  }).then((res) => res.json())
}

export default App
