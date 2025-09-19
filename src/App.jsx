import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./page/home"
import LoginPage from "./page/login"
import RegisterPage from "./page/register"
import CourseDetailPage from "./page/course-detail"
import Hometemplate from "./templates/Hometemplate"
import AuthTemplate from "./templates/AuthTemplate"
import { renderRouters } from "./router";


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="" element={<Hometemplate />} >
            <Route path="" element={<HomePage />} />
            <Route path="/detail" element={<CourseDetailPage />} />
          </Route>

          <Route path="" element={<AuthTemplate />} >
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route> */}
         {renderRouters()}
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
