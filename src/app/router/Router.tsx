import BoardPage from "../../pages/BoardPage/BoardPage";
import ArchivePage from "../../pages/ArchivePage/ArchivePage";
import CreatePostPage from "../../pages/CreatePostPage/CreatePostPage";
import FriendPage from "../../pages/FriendPage/FriendPage";
import SettingPage from "../../pages/SettingPage/SettingPage";
import { Route, Routes } from "react-router";
import Layout from "../layout/Layout";
import LoginPage from "../../pages/LoginPage/LoginPage";

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BoardPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/createpost" element={<CreatePostPage />} />
        <Route path="/friend" element={<FriendPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="setting" element={<SettingPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
