import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"

export const Protected = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        if (!user?.IsAdmin)
            navigate("/")
    }, [user, navigate])

    return (
        <Outlet />
    )
}