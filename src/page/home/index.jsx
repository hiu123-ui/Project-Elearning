import React from 'react'
import BannerPage from '../../components/Banner'
import Listcourse from '../../components/ListCourse/Listcourse'
import FrontendCourse from '../../components/FrontendCourse'
import BackendCourse from '../../components/BackendCourse'
import TeacherPage from '../../components/TeacherPage'

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 min-h-screen px-6 py-6">
    <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-lg p-6 md:p-8 space-y-10 divide-y divide-gray-200/60">
      <section>
        <BannerPage />
      </section>
      <section>
        <Listcourse />
      </section>
      <section>
        <FrontendCourse />
      </section>
      <section>
        <BackendCourse />
      </section>
      <section>
        <TeacherPage />
      </section>
    </div>
    </div>
  );
}

export default HomePage