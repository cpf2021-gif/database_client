import { Descriptions } from "antd";
import { useGetUserQuery } from "../../feature/api/apiSlice";

export const UserInfo = ({ username }) => {
  const {
    data: user = {},
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserQuery(username);

  if (isLoading) {
    return <div>loading...</div>;
  } else if (isError) {
    return <div>{error.message}</div>;
  } else if (isSuccess) {
    let userdata = user.data;
    return (
      <Descriptions title="用户信息">
        <Descriptions.Item label="用户名">
          {userdata.username}
        </Descriptions.Item>
        <Descriptions.Item label="性别">{userdata.sex}</Descriptions.Item>
        <Descriptions.Item label="权限">{userdata.role}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{userdata.phone}</Descriptions.Item>
        <Descriptions.Item label="注册时间">
          {userdata.create_time}
        </Descriptions.Item>
        <Descriptions.Item label="修改时间">
          {userdata.create_time}
        </Descriptions.Item>
      </Descriptions>
    );
  }
};
