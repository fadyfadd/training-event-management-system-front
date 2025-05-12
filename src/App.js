import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './Components/Home';
import LoginPage from './Components/Login';
import AdminDashboard from './Components/AdminDashboard';
import AllStudents from './Components/AllStudents';
import { AllTeachers } from './Components/AllTeachers';

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
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;