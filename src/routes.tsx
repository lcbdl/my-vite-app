import { Route, Routes } from "react-router";
import AboutPage from "./pages/about";
import { ArrayStringExamPage } from "./pages/array-string-exam";
import HomePage from "./pages/home";
import { HomeLayout } from "./pages/home-layout";
import { LinkedListExam } from "./pages/linked-list-exam";
import { TreeGraphExamPage } from "./pages/tree-graph-exam";
export const AppRoutes = () => (
  <Routes>
    <Route element={<HomeLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>
    <Route path="array-string-exam" element={<ArrayStringExamPage />} />
    <Route path="linked-list-exam" element={<LinkedListExam />} />
    <Route path="tree-graph-exam" element={<TreeGraphExamPage />} />
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
