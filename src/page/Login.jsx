import { Button, Form, Input, message } from "antd";

export const Login = ({ setuser }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // 成功提示
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Login success!",
      duration: 1,
    });
  };

  // 失败提示
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Login failed!",
      duration: 1,
    });
  };

  const onFinish = async (values) => {
    const rep = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    let data = await rep.json();

    if (rep.status !== 200) {
      error();
    } else {
      success();
    }
    // 重置表单
    form.resetFields();
    setTimeout(() => {
      setuser({ username: values.username, role: data.role });
    }, 1000);
  };

  return (
    <div className=" flex justify-center items-center flex-col bg-slate-300 h-screen">
      {contextHolder}
      <header className=" text-6xl font-bold mb-12">库存管理系统</header>
      <div className=" bg-white p-4 rounded-lg shadow-xl">
        <div className=" text-center">
          <h1 className="text-3xl font-bold mb-2">登入</h1>
        </div>
        <Form
          form={form}
          name="basic"
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
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
