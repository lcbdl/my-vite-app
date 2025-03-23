import { Route, Routes } from "react-router";
import AboutPage from "./pages/about";
import HomePage from "./pages/home";
import { HomeLayout } from "./pages/home-layout";
export const AppRoutes = () => (
  <Routes>
    <Route element={<HomeLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>

    {/* <Route element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>

  <Route path="concerts">
    <Route index element={<ConcertsHome />} />
    <Route path=":city" element={<City />} />
    <Route path="trending" element={<Trending />} />
  </Route> */}
  </Routes>
);
