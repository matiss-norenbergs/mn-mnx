import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"

import Layout from "@/components/layout"
import Heading from '@/components/heading'

import { getPostListPublicData, respStatus } from "../../helpers/axios/postService"

import styles from "./Home.module.css"

const Home = () => {
    const [data, setData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDataLoading, setIsDataLoading] = useState(false)

    const axiosCancelToken = useRef(null)

    const getPosts = useCallback(() => {
        setIsDataLoading(true)

        getPostListPublicData(axiosCancelToken?.current.token)
            .then(response => {
                if (!!response && response.status === respStatus.success)
                    setData(response.data)
            })
            .catch(() => {
                setData([])
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [])

    useEffect(() => {
        axiosCancelToken.current = axios.CancelToken.source()

        getPosts()
    }, [getPosts])

    return (
        <Layout>
            <Heading
                level={3}
                center
            >
                {"Home"}
            </Heading>
            <div className={styles["post-cards"]}>
                {data.map(({
                    id,
                    title,
                    content,
                    createdAt,
                    createdBy
                }) => (
                    <div
                        key={id}
                        className={styles["post-card"]}
                    >
                        <Heading level={5}>
                            {title}
                        </Heading>
                        <p className={styles["content"]}>{content}</p>
                        <span className={styles["details"]}>{`${createdBy} | ${createdAt}`}</span>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export default Home