import PropTypes from "prop-types"
import classNames from "classnames"

import { useDispatch, useSelector } from "react-redux"
import { useCallback, useRef } from "react"

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar
} from "@nextui-org/react"

import FaIcon from "../faIcon"
import ModalComponent from "../modalComponent"

import UserForm from "@/shared/userForm"

import { logoutUser } from "@/helpers/axios/authService"
import { removeUser } from "@/redux/features/user/userSlice"

import styles from "./Header.module.css"

const propTypes = {
    paths: PropTypes.array,
    extraContent: PropTypes.node,
    appTitle: PropTypes.string,
    showLogo: PropTypes.bool,
    logoutUser: PropTypes.func,
    showRouteIcons: PropTypes.bool
}

const Header = ({
    paths,
    appTitle,
    showLogo = true,
    showRouteIcons = false
}) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const userLoginFormRef = useRef(null)

    const handleLogin = useCallback(() => {
        userLoginFormRef.current?.open()
    }, [])

    const handleLogout = useCallback(() => {
        logoutUser()
            .then(response => {
                if (response.status === 200) {
                    dispatch(removeUser())
                }
            })
    }, [dispatch])

    return (
        <Navbar
            className="bg-secondary"
            maxWidth="full"
        >
            {showLogo && (
                <NavbarBrand>
                    <p className={classNames(
                        "font-bold text-4xl text-default",
                        styles["app-title"]
                    )}>
                        {appTitle}
                    </p>
                </NavbarBrand>
            )}
            <NavbarContent>
                {paths?.map(({ path, title, icon }) => (
                    <NavbarItem
                        key={path}
                    >
                        <Link
                            className="text-default text-md"
                            href={path}
                        >
                            <FaIcon
                                icon={icon}
                                padded
                                isHidden={!showRouteIcons}
                            />
                            {title}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent as="div" justify="end">
                {Object.keys(user).length > 0 ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform text-default"
                                color="secondary"
                                name={`${user.Name} ${user.Surname}`}
                                size="sm"
                                src=""
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="flat"
                        >
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">
                                    <FaIcon
                                        icon="user"
                                        padded
                                    />
                                    {`${user.Name} ${user.Surname}`}
                                </p>
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                <Link onPress={handleLogout}>
                                    <FaIcon
                                        icon="arrow-right-from-bracket"
                                        padded
                                    />
                                    Log Out
                                </Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem>
                        <Link
                            className={classNames(
                                "text-default text-md",
                                styles["login-btn"]
                            )}
                            onPress={handleLogin}
                        >
                            <FaIcon
                                icon="arrow-right-to-bracket"
                                padded
                            />
                            Login
                        </Link>
                    </NavbarItem>
                )}
            </NavbarContent>
            <ModalComponent
                ref={userLoginFormRef}
                component={<UserForm formState={1} />}
                title="Login"
                confirmText="Login"
                onModalConfirm="login"
                width={500}
                disableEsc
            />
        </Navbar>
    )
}
Header.propTypes = propTypes

export default Header