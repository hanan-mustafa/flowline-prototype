import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function EngineerView() {
  // whether the engineer has confirmed the cause in this session
  const [confirmed, setConfirmed] = useState(false)
  return <Outlet context={{ confirmed, setConfirmed }} />
}
