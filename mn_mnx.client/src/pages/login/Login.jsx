import { useCallback, useRef, useState } from "react"

import Layout from "@/components/layout"
import Heading from "@/components/heading"
import Button from "@/components/button"

import UserForm from '@/shared/userForm'

import styles from "./Login.module.css"

const Login = () => {
    const [isLogin, setIsLogin] = useState(true)

    const userFormRef = useRef(null)

    const handleUserLogin = useCallback(() => {
        userFormRef.current?.login()
    }, [])

    return (
        <Layout layoutType="center">
            <div className={styles["login-form"]}>
                <Heading level={3}>
                    {"Login"}
                </Heading>
                <UserForm
                    ref={userFormRef}
                    formState={1}
                />
                <Button
                    type="primary"
                    onClick={handleUserLogin}
                >
                    {"Login"}
                </Button>
            </div>
        </Layout>
    )
}

export default Login