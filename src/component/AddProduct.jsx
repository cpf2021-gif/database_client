import { Button, Form, Input, message, Select, Divider } from "antd";
import {
  useAddProductMutation,
  useAddSupplierMutation,
  useAddSellerMutation,
} from "../../feature/api/apiSlice";

export const AddProduct = () => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [addSupplier, { isLoading: isLoading1 }] = useAddSupplierMutation();
  const [addSeller, { isLoading: isLoading2 }] = useAddSellerMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const { Option } = Select;

  // 成功提示
  const successM = (content) => {
    messageApi.open({
      type: "success",
      content: content,
      duration: 2,
    });
  };

  // 失败提示
  const errorM = (content) => {
    messageApi.open({
      type: "error",
      content: content,
      duration: 2,
    });
  };

  const onCompanyFinish = async (values) => {
    try {
      if (values.type === "supplier") {
        const resp = await addSupplier({
          name: values.name,
          phone: values.phone,
          location: values.location,
        }).unwrap();
        successM(resp.message);
      } else {
        const resp = await addSeller({
          name: values.name,
          phone: values.phone,
          location: values.location,
        }).unwrap();
        successM(resp.message);
      }
    } catch (err) {
      errorM(err.data.error);
    }
    form2.resetFields();
  };

  const onProductFinish = async (values) => {
    try {
      const resp = await addProduct(values).unwrap();
      successM(resp.message);
    } catch (err) {
      errorM(err.data.error);
    }
    form1.resetFields();
  };

  //
  const vaildateProductName = (_, value) => {
    if (!value || value.length < 3 || value.length > 30) {
      return Promise.reject(new Error("长度为3-30位"));
    }
    return Promise.resolve();
  };

  const vaildateCompanyName = (_, value) => {
    if (!value || value.length < 3 || value.length > 40) {
      return Promise.reject(new Error("长度为3-40位"));
    }
    return Promise.resolve();
  };

  const vaildateLocation = (_, value) => {
    if (!value || value.length < 4 || value.length > 20) {
      return Promise.reject(new Error("长度为4-20位"));
    }
    return Promise.resolve();
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

  return (
    <div>
      <h2>添加产品</h2>
      {contextHolder}
      <Form
        form={form1}
        name="product"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onProductFinish}
        autoComplete="off"
      >
        <Form.Item
          label="商品名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入商品名称!",
            },
            {
              validator: vaildateProductName,
            },
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
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <h2>添加供应商/销售商</h2>
      <Form
        name="company"
        form={form2}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onCompanyFinish}
        autoComplete="off"
      >
        <Form.Item
          label="公司类型"
          name="type"
          rules={[
            {
              required: true,
              message: "请选择公司类型!",
            },
          ]}
        >
          <Select placeholder="请选择公司类型">
            <Option value="supplier">供应商</Option>
            <Option value="seller">销售商</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="公司名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入公司名称!",
            },
            {
              validator: vaildateCompanyName,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="公司地区"
          name="location"
          rules={[
            {
              required: true,
              message: "请输入公司地区!",
            },
            {
              validator: vaildateLocation,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="联系方式"
          name="phone"
          rules={[
            {
              required: true,
              message: "请输入联系方式!",
            },
            {
              validator: vaildatePhone,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 16,
            offset: 8,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={isLoading1 || isLoading2}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
