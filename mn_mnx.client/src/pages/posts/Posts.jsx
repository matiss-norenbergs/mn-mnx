import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'

import Layout from '@/components/layout'
import Heading from "@/components/heading"
import Button from '@/components/button'
import Table from "@/components/table"
import FaIcon from "@/components/faIcon"

import { deletePostData, getPostListData, respStatus, savePostData } from '../../helpers/axios/postService'

const columns = [
    {
        field: "select",
        name: "",
        width: 30
    },
    {
        field: "title",
        name: "Title",
        width: 100
    },
    {
        field: "content",
        name: "Content",
        width: 150
    },
    {
        field: "createdBy",
        name: "Created by",
        width: 170
    },
    {
        field: "createdAt",
        name: "Created at",
        width: 200,
        align: "center"
    },
    {
        field: "updatedAt",
        name: "Updated at",
        width: 200,
        align: "center"
    },
    {
        field: "isPublic",
        name: "Public",
        width: 30,
        align: "center",
        cellRenderer: "yesNoRenderer"
    },
]

const cellRenderers = {
    yesNoRenderer: ({ value }) => <FaIcon icon={value ? ["fas", "circle-check"] : ["far", "circle"]} />
}

const Posts = () => {
    const [data, setData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDataLoading, setIsDataLoading] = useState(false)

    const axiosCancelToken = useRef(null)

    const isRowSelected = selectedRows.length === 1

    const getPosts = useCallback(() => {
        setIsDataLoading(true)

        getPostListData(axiosCancelToken?.current.token)
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

    const savePost = useCallback(() => {
        savePostData({}, axiosCancelToken?.current.token)
            .then(response => {
                if (!!response && response.status === respStatus.success)
                    console.log(response.data)
            })
            .catch(() => {
                //setData([])
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [])

    const handleDeleteClick = useCallback(() => {
        if (!isRowSelected)
            return

        setIsDataLoading(true)

        const postParams = {
            id: selectedRows[0].id
        }

        deletePostData(postParams, axiosCancelToken.current.token)
            .then(response => {
                if (!!response && response.status === 204)
                    getPosts()
            })
            .catch(() => {
                setIsDataLoading(false)
            })
    }, [isRowSelected, selectedRows, getPosts])

    useEffect(() => {
        axiosCancelToken.current = axios.CancelToken.source()

        getPosts()
    }, [getPosts])

    const toolbar = (
        <>
            <Button.Group disabled={isDataLoading}>
                <Button
                    type="primary"
                    onClick={savePost}
                    faIcon="plus"
                >
                    {"Create"}
                </Button>
                <Button
                    // onClick={handleEditClick}
                    disabled={!isRowSelected || true}
                    faIcon="edit"
                >
                    {"Edit"}
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    disabled={!isRowSelected}
                    faIcon="trash-alt"
                >
                    {"Delete"}
                </Button>
            </Button.Group>
            <Button.Spacer />
            <Button
                onClick={getPosts}
                disabled={isDataLoading}
                faIcon="sync"
            >
                {"Refresh"}
            </Button>
        </>
    )

    return (
        <Layout>
            <Heading
                level={3}
                center
            >
                {"Posts"}
            </Heading>
            <Table
                toolbar={toolbar}
                columns={columns}
                data={data}
                getSelectedRows={setSelectedRows}
                cellRenderers={cellRenderers}
            />
        </Layout>
    )
}

export default Posts