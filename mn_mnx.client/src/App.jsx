import { Provider } from "react-redux"
import { useNavigate } from "react-router-dom"

import { NextUIProvider } from "@nextui-org/react"

import Core from "./components/core"

import Home from './pages/home'
import Users from './pages/users'
import Posts from "./pages/posts"

import store from "./redux/stores/store"

const routes = [
    {
        path: "/",
        title: "Home",
        icon: "home",
        element: Home,
        //menuHidden: true
    },
    {
        path: "/users",
        title: "Users",
        icon: "person",
        element: Users,
        //menuHidden: true,
        admin: true
    },
    {
        path: "/posts",
        title: "Posts",
        icon: "book-open",
        element: Posts,
        //menuHidden: true,
        admin: true
    }
]

const App = () => {
    const navigate = useNavigate()

    return (
        <NextUIProvider
            navigate={navigate}
            locale="en-GB"
        >
            <main className="light text-foreground bg-background">
                <Provider store={store}>
                    <Core
                        appTitle="MNX"
                        routes={routes}
                        headerProps={{
                            showLogo: true,
                            showRouteIcons: true
                        }}
                    />
                </Provider>
            </main>
        </NextUIProvider>
    )
}

export default App