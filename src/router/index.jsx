import HomePage from "../page/home";
import LoginPage from "../page/login";
import RegisterPage from "../page/register";
import CourseDetailPage from "../page/course-detail";
import Hometemplate from "../templates/Hometemplate";
import AuthTemplate from "../templates/AuthTemplate";
import { Route } from "react-router-dom";
import React from "react";

const routers = [
    // Home routes with Hometemplate
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
            }
        ]
    },
    // Auth routes as separate routes
     {
        path: "",
        element: <AuthTemplate />,
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