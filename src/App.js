import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './Components/Home';
import LoginPage from './Components/Login';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import AllStudents from './Components/AllStudents';
import { AllTeachers } from './Components/AllTeachers';
import TeacherDashboard from './Components/Dashboard/TeacherDashboard'
import { AllEvents } from './Components/AllEvents';
import StudentDashboard from './Components/Dashboard/StudentDashboard';
import TeacherEvents from './Components/TeacherEvents';
import RegisterStudentToEvent from './Components/RegisterStudentToEvent';

const RootLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "admin/home",
        element: <AdminDashboard />,
      },
      {
        path: "admin/getAllStudents",
        element: <AllStudents />,
      },
      {
        path: "admin/getAllTeachers",
        element: <AllTeachers />
      },
      {
        path: "admin/getAllEvents",
        element: <AllEvents />
      },
      {
        path: "/admin/registerStudentToEvent",
        element: <RegisterStudentToEvent />
      },
      {
        path: "teacher/home",
        element: <TeacherDashboard />
      },
      {
        path: "teacher/getAllStudents",
        element: <AllStudents />,
      },
      {
        path: "teacher/myEvents",
        element: <TeacherEvents />,
      },
      {
        path: "student/home",
        element: <StudentDashboard />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;