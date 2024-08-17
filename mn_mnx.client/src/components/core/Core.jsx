import PropTypes from "prop-types"

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import {
    useDispatch,
    useSelector
} from "react-redux"
import {
    Routes,
    Route
} from "react-router-dom"

import { library } from "@fortawesome/fontawesome-svg-core"
import { far } from "@fortawesome/free-regular-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"

import { CircularProgress } from "@nextui-org/react"

import Header from "../header"
import Admin from "./components/admin"

import { getUser, respStatus } from "../../helpers/axios/publicService"
import { setUser } from "@/redux/features/user/userSlice"

import styles from "./Core.module.css"

library.add(far, fas)

const propTypes = {
    appTitle: PropTypes.string,
    routes: PropTypes.array,
    headerProps: PropTypes.object
}

const Core = ({
    appTitle,
    routes = [],
    headerProps
}) => {
    const axiosSignal = useRef(null)

    const [isDataLoading, setIsDataLoading] = useState(true)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const headerPaths = useMemo(() => {
        const isAdmin = user?.IsAdmin === true

        const headerRoutes = routes.filter(({ menuHidden, admin }) => !menuHidden && !admin)
            .map(({ path, title, icon }) => ({
                path,
                title,
                icon
            }))

        if (isAdmin) {
            headerRoutes.push({
                path: "/admin",
                title: "Admin",
                icon: "lock"
            })
        }

        return headerRoutes
    }, [routes, user])

    const handleGetUser = useCallback(() => {
        getUser(axiosSignal.current?.signal)
            .then(response => {
                if (response?.status === respStatus.success)
                    dispatch(setUser(response.data))
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [dispatch])

    useEffect(() => {
        axiosSignal.current = new AbortController()

        handleGetUser()

        return () => {
            axiosSignal.current?.abort()
        }
    }, [handleGetUser])

    useEffect(() => {
        if (appTitle)
            document.title = appTitle
    }, [appTitle])

    const handleRoutes = useMemo(() => {
        const adminRoutes = []
        let adminIndexRoute = {}
        const adminHeaderPaths = []
        const renderRoutes = []

        routes.forEach(({ path, element: Element, admin, title, icon }) => {
            if (admin) {
                const adminRoutePath = `/admin${path}`

                if (adminRoutes.length === 0) {
                    Object.assign(adminIndexRoute, {
                        path,
                        index: true,
                        element: <Element />
                    })
                }

                adminRoutes.push(<Route
                    key={path}
                    path={adminRoutePath}
                    element={<Element />}
                />)
                
                adminHeaderPaths.push({
                    path: adminRoutePath,
                    title,
                    icon
                })
            } else {
                renderRoutes.push(<Route
                    key={path}
                    exact={path === "/"}
                    path={path}
                    element={<Element />}
                />)
            }
        })

        if (Object.keys(adminIndexRoute).length > 0)
            adminRoutes.push(<Route
                key={`index${adminIndexRoute.path}`}
                index
                element={adminIndexRoute.element}
            />)

        return [
            ...renderRoutes,
            <Route
                key="admin"
                path="/admin"
                element={<Admin paths={adminHeaderPaths} />}
            >
                {adminRoutes}
            </Route>
        ]
    }, [routes])

    return (
        <div className={styles["core-wrapper"]}>
            <Header
                appTitle={appTitle}
                paths={headerPaths}
                {...headerProps}
            />
            {!isDataLoading ? (
                <Routes>
                    {handleRoutes}
                </Routes>
            ) : (
                <div className={styles["core-loader"]}>
                    <CircularProgress
                        label="Loading..."
                        color="default"
                    />
                </div>
            )}
        </div>
    )
}
Core.propTypes = propTypes

export default Core