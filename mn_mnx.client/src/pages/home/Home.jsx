import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react"

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter
} from "@nextui-org/react"

import Layout from "@/components/layout"

import { getPostListPublicData, respStatus } from "../../helpers/axios/postService"

import styles from "./Home.module.css"

const Home = () => {
    const [data, setData] = useState([])
    const [isDataLoading, setIsDataLoading] = useState(false)

    const axiosSignal = useRef(null)

    const getPosts = useCallback(() => {
        setIsDataLoading(true)

        getPostListPublicData(axiosSignal.current?.signal)
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
        axiosSignal.current = new AbortController()

        getPosts()

        return () => {
            axiosSignal.current?.abort()
        }
    }, [getPosts])

    return (
        <Layout type="slim">
            <div className="flex flex-col gap-2">
                {data.map(({
                    id,
                    title,
                    content,
                    createdAt,
                    createdBy
                }) => (
                    <Card
                        key={id}
                        className="w-full flex bg-slate-200"
                    >
                        <CardHeader>
                            <p className="text-md font-bold">
                                {title}
                            </p>
                        </CardHeader>
                        <CardBody className={styles["content"]}>
                            {content}
                        </CardBody>
                        <CardFooter className="flex justify-end">
                            <p>
                                {`${createdBy} | ${createdAt}`}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </Layout>
    )
}

export default Home