// Top-level imports in router file
import HomePage from "../page/home";
import LoginPage from "../page/login";
import RegisterPage from "../page/register";
import CourseDetailPage from "../page/course-detail";
import Hometemplate from "../templates/Hometemplate";
import AuthTemplate from "../templates/AuthTemplate";
import { Route, Navigate } from "react-router-dom"; // thêm Navigate
import React from "react";
import CoursePages from "../page/course-page";
import EventPage from "../page/event/EventPage";
import BlogPage from "../page/blog/BlogPage";
import InfoPage from "../page/info/InfoPage";
import SearchPage from "../page/search";
import { useSelector } from "react-redux"; // thêm useSelector
import MyCoursesPage from "../page/mycourse";
import ProfilePage from "../page/profile";

// GuestOnlyLayout: chặn người đã đăng nhập vào nhóm route Auth (login/register)
function GuestOnlyLayout() {
    const { infoUser } = useSelector((state) => state.userSlice);
    const isLoggedIn = !!infoUser && Object.keys(infoUser).length > 0;

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }
    return <AuthTemplate />;
}

function RequireAuth({ children }) {
    const { infoUser } = useSelector((state) => state.userSlice);
    const isLoggedIn = !!infoUser && Object.keys(infoUser).length > 0;
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

const routers = [
    {
        path: "",
        element: <Hometemplate />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "/detail/:courseID",
                element: <CourseDetailPage />
            },
            {
                path: "/course-page/:maDanhMuc",
                element: <CoursePages />
            },
            {
                path: "/events",
                element: <EventPage />
            },
            {
                path: "/blog",
                element: <BlogPage />
            },
            {
                path: "/info",
                element: <InfoPage />
            },
            {
                path: "/search",
                element: <SearchPage />
            },
            {
                path: "/my-courses",
                element: <RequireAuth><MyCoursesPage /></RequireAuth>
            },
            {
                path: "/profile",
                element: <RequireAuth><ProfilePage /></RequireAuth>
            },
        ]
    },
    // Auth routes as separate routes
    {
        path: "",
        element: <GuestOnlyLayout />, // đổi từ <AuthTemplate /> sang GuestOnlyLayout

        children: [
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            }
        ]
    },
];

export const renderRouters = () => {
    return routers.map((router, index) => {
        if (router.children) {
            return (
                <Route key={index} path={router.path} element={router.element}>
                    {router.children.map((child, idx) => (
                        <Route key={idx} path={child.path} element={child.element} />
                    ))}
                </Route>
            );
        } else {
            return <Route key={index} path={router.path} element={router.element} />;
        }
    });
}