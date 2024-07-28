import { Provider } from "react-redux"

import Core from "./components/core"

import Home from './pages/home'
import Login from "./pages/login"
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
    },
    {
        path: "/login",
        title: "Login",
        icon: "arrow-right-to-bracket",
        element: Login,
        menuHidden: true
    }
]

const App = () => {
    return (
        <Provider store={store}>
            <Core
                appTitle="MNX"
                showHeaderLogo={false}
                routes={routes}
                hideFooter
            />
        </Provider>
    )
}

export default App