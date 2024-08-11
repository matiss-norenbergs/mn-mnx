import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react"

import {
    Image,
    Listbox,
    ListboxItem,
    Tabs,
    Tab,
    Chip,
    Button,
    Skeleton
} from "@nextui-org/react"

import Layout from "@/components/layout"
import FaIcon from "@/components/faIcon"
import ModalComponent from "@/components/modalComponent"

import UserProfileSettings from "@/shared/userProfileSettings"

import { getUserProfile, respStatus } from "@/helpers/axios/userService"

import styles from "./Profile.module.css"

const tmpImg0 = "https://scontent.frix5-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_p200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=BmsOX3Sy9RcQ7kNvgEMD4x-&_nc_ht=scontent.frix5-1.fna&oh=00_AYC7pkIKdeTs3U5UtMyuA_BNUQqY4clmpcYaeBmonn5Ylg&oe=66DF283A"
//const tmpImg1 = "https://avatars.akamai.steamstatic.com/b707ac3b768f97b6bffe7e23a70ffa9830e33dbb_full.jpg"

const Profile = () => {
    const { id } = useParams()
    const user = useSelector((state) => state.user)

    const axiosSignal = useRef(null)
    const userProfileSettingsModalRef = useRef(null)

    const [profile, setProfile] = useState({})
    const [isImageLoading, setIsImageLoading] = useState(false)

    const getProfile = useCallback(() => {
        const postParams = {
            id
        }

        getUserProfile(postParams, axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === respStatus.success)
                    setProfile(response.data)
            })
    }, [id])

    const handleUserProfileSettingsClick = useCallback(() => {
        userProfileSettingsModalRef.current?.open()
    }, [])

    useEffect(() => {
        axiosSignal.current = new AbortController()

        getProfile()

        return () => {
            axiosSignal.current?.abort()
        }
    }, [getProfile])

    return (
        <Layout
            layoutType="slim"
            breadcrumbItems={[{
                label: <FaIcon icon="home" fixedWidth />,
                href: "/"
            }, {
                label: "Profile"
            }, {
                label: profile.nameSurname || "User"
            }]}
        >
            <div className={styles["main-card"]}>
                <div className={styles["image"]}>
                    <Skeleton
                        className="w-200 h-200 rounded-xl"
                        isLoaded={isImageLoading}
                    >
                        <Image
                            onLoad={setIsImageLoading}
                            width={200}
                            height={200}
                            src={profile.imageUrl}
                            fallbackSrc={tmpImg0}
                            alt="Profile picture"
                            isBlurred
                        />
                    </Skeleton>
                    {id === user.Id && (
                        <Button
                            className="mt-6"
                            color="primary"
                            startContent={<FaIcon icon="cogs" />}
                            fullWidth
                            size="sm"
                            onPress={handleUserProfileSettingsClick}
                        >
                            Settings
                        </Button>
                    )}
                    <ModalComponent
                        ref={userProfileSettingsModalRef}
                        title="User profile settings"
                        component={<UserProfileSettings />}
                        disableEsc
                        onConfirm={getProfile}
                    />
                </div>
                <Listbox
                    className={styles["main-list"]}
                    aria-label="Profile details"
                    emptyContent="No data"
                >
                    {profile.details?.map(({
                        value,
                        description,
                        icon
                    }) => (
                        <ListboxItem
                            key={value}
                            startContent={<FaIcon
                                icon={icon}
                                fixedWidth
                            />}
                            description={description}
                        >
                            {value || "-"}
                        </ListboxItem>
                    ))}
                </Listbox>
            </div>
            <Tabs
                className="pt-6"
                aria-label="profile-options"
                color="primary"
                variant="underlined"
            >
                <Tab
                    key="posts"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaIcon
                                icon="book-open"
                                fixedWidth
                            />
                            <span>Posts</span>
                            <Chip size="sm">0</Chip>
                        </div>
                    }
                >
                    <h2>Posts...</h2>
                </Tab>
                <Tab
                    key="likes"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaIcon
                                icon={["far", "fa-thumbs-up"]}
                                fixedWidth
                            />
                            <span>Likes</span>
                            <Chip size="sm">0</Chip>
                        </div>
                    }
                >
                    <h2>Likes...</h2>
                </Tab>
                <Tab
                    key="friends"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaIcon
                                icon="fa-user-group"
                                fixedWidth
                            />
                            <span>Friends</span>
                            <Chip size="sm">0</Chip>
                        </div>
                    }
                >
                    <h2>Friends...</h2>
                </Tab>
            </Tabs>
        </Layout>
    )
}

export default Profile