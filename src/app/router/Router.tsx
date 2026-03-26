import { Route, Routes } from "react-router";
import Layout from "../layout/Layout";
import MyPage from "../../pages/MyPage/MyPage";
import CallbackPage from "../../pages/CallbackPage/CallbackPage";
import HomePage from "../../pages/HomePage/HomePage";
import PocketPage from "../../pages/PocketPage/PocketPage";
import CreatePostPage from "../../pages/CreatePostPage/CreatePostPage";
import FriendPage from "../../pages/FriendPage/FriendPage";
import SettingPage from "../../pages/SettingPage/SettingPage";
import PostDetailPage from "../../pages/PostDetailPage/PostDetailPage";
import ProtectedRouter from "./ProtectedRouter";
import RecapPage from "@/pages/RecapPage/RecapPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/callback" element={<CallbackPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route element={<ProtectedRouter />}>
          <Route path="/pocket" element={<PocketPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/createpost" element={<CreatePostPage />} />
          <Route path="/friend" element={<FriendPage />} />
          <Route path="setting" element={<SettingPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/recap" element={<RecapPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
