import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'

import {
    Button,
    ButtonGroup,
    Spacer
} from "@nextui-org/react"

import Table from "@/components/table"
import FaIcon from "@/components/faIcon"
import ModalComponent from "@/components/modalComponent"

import PostsForm from './components/postsForm'

import { deletePostData, getPostListData, respStatus } from '../../helpers/axios/postService'

const columns = [
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

const Posts = () => {
    const [data, setData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDataLoading, setIsDataLoading] = useState(false)

    const axiosSignal = useRef(null)
    const postModalRef = useRef(null)

    const isRowSelected = selectedRows.length === 1

    const getPosts = useCallback(() => {
        setIsDataLoading(true)

        getPostListData(axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === respStatus.success)
                    setData(response.data)
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [])

    const handleCreateClick = useCallback(() => {
        postModalRef.current?.open({ id: "0" })
    }, [])

    const handleEditClick = useCallback(() => {
        if (!isRowSelected)
            return

        postModalRef.current?.open({ id: selectedRows[0].id })
    }, [isRowSelected, selectedRows])

    const handleDeleteClick = useCallback(() => {
        if (selectedRows.length === 0)
            return

        setIsDataLoading(true)

        const postParams = {
            ids: JSON.stringify(selectedRows.map(x => x.id))
        }

        deletePostData(postParams, axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === 200)
                    getPosts()
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [selectedRows, getPosts])

    useEffect(() => {
        axiosSignal.current = new AbortController()

        getPosts()

        return () => {
            axiosSignal.current?.abort()
        }
    }, [getPosts])

    const toolbar = (
        <>
            <ButtonGroup
                size="sm"
                isDisabled={isDataLoading}
            >
                <Button
                    color="primary"
                    onPress={handleCreateClick}
                >
                    <FaIcon icon="plus" />
                    {"Create"}
                </Button>
                <Button
                    onPress={handleEditClick}
                    isDisabled={!isRowSelected}
                >
                    <FaIcon icon="edit" />
                    {"Edit"}
                </Button>
                <Button
                    onPress={handleDeleteClick}
                    isDisabled={selectedRows.length === 0}
                >
                    <FaIcon icon="trash-alt" />
                    {"Delete"}
                </Button>
            </ButtonGroup>
            <Spacer />
            <Button
                onPress={getPosts}
                size="sm"
                isDisabled={isDataLoading}
            >
                <FaIcon icon="sync" />
                {"Refresh"}
            </Button>
        </>
    )

    return (
        <div className="flex flex-col p-6">
            <Table
                toolbar={toolbar}
                columns={columns}
                data={data}
                getSelectedRows={setSelectedRows}
                isBulkMode
            />
            <ModalComponent
                ref={postModalRef}
                title="Create post"
                component={<PostsForm />}
                onConfirm={getPosts}
                disableEsc
            />
        </div>
    )
}

export default Posts