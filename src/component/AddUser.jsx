import { Button, Form, Input, message, Select } from "antd";
import { useAddUserMutation } from "../../feature/api/apiSlice";

export const AddUser = () => {
  const [form] = Form.useForm();
  const [addUser, { isLoading }] = useAddUserMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const { Option } = Select;

  // 成功提示
  const success = (content) => {
    messageApi.open({
      type: "success",
      content: content,
      duration: 2,
    });
  };

  // 失败提示
  const error = (content) => {
    messageApi.open({
      type: "error",
      content: content,
      duration: 2,
    });
  };

  const onFinish = async (values) => {
    try {
      const resp = await addUser(values).unwrap();
      success(resp.message);
    } catch (err) {
        error(err.data.error);
    }
    form.resetFields();
  };

  // 电话号码校验
  const vaildatePhone = (_, value) => {
    // 只能是数字
    if (!value || !/^[0-9]*$/.test(value)) {
      return Promise.reject(new Error("电话只能是数字"));
    }
    if (!value || value.length !== 11) {
      return Promise.reject(new Error("电话长度为11位"));
    }
    return Promise.resolve();
  };

  // 用户名校验
  const vaildatename = (_, value) => {
    if (!value || value.length < 1 || value.length > 20) {
      return Promise.reject(new Error("用户名长度为1-20位"));
    }
    return Promise.resolve();
  };

  // 密码校验
  const vaildatePassword = (_, value) => {
    if (!value || value.length < 2 || value.length > 15) {
      return Promise.reject(new Error("密码长度为2-15位"));
    }
    return Promise.resolve();
  };

  return (
    <div>
      <h2>添加用户</h2>
      {contextHolder}
      <Form
        form={form}
        name="user"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: "请输入用户名!",
            },
            {
                validator: vaildatename,
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: "请输入密码!",
            },
            {
              validator: vaildatePassword,
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="性别"
          name="sex"
          rules={[
            {
              required: true,
              message: "请输入性别!",
            },
          ]}
        >
          <Select>
            <Option value="男">男</Option>
            <Option value="女">女</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="角色"
          name="role"
          rules={[
            {
              required: true,
              message: "请输入用户权限!",
            },
          ]}
        >
          <Select>
            <Option value="admin">管理员</Option>
            <Option value="guest">普通用户</Option>
            <Option value="editor">操作人员</Option>
            <Option value="analyst">分析员</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="电话"
          name="phone"
          rules={[
            {
              required: true,
              message: "请输入联系电话!",
            },
            {
                validator: vaildatePhone,
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" disabled={isLoading} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
