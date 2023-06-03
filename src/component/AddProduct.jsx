import { Button, Form, Input, message, Select, Divider } from "antd";
import {
  useAddProductMutation,
  useGetSuppliersQuery,
  useAddSupplierMutation,
} from "../../feature/api/apiSlice";

export const AddProduct = () => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { data: suppliers = {}, isSuccess } = useGetSuppliersQuery();
  const [addSupplier, { isLoading: isSupplierLoading }] =
    useAddSupplierMutation();
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

  const onProductFinish = async (values) => {
    try {
      const resp = await addProduct(values).unwrap();
      successM(resp.message);
    } catch (err) {
      errorM(err.data.error);
    }
    form1.resetFields();
  };

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

  const vaildateString = (_, value) => {
    if (!value || value.length < 1 || value.length > 20) {
      return Promise.reject(new Error("长度为1-20位"));
    }
    return Promise.resolve();
  };

  const onSupplierFinish = async (values) => {
    try {
      const resp = await addSupplier(values).unwrap();
      successM(resp.message);
    } catch (err) {
      errorM(err.data.error);
    }
    form2.resetFields();
  };

  return !isSuccess ? (
    <div>loading</div>
  ) : (
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
              validator: vaildateString,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="供应商名称"
          name="supplier_name"
          rules={[
            {
              required: true,
              message: "请输入供应商名称!",
            },
          ]}
        >
          <Select>
            {suppliers.data.map((supplier) => (
              <Option key={supplier.name} value={supplier.name}>
                {supplier.name}
              </Option>
            ))}
          </Select>
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
      <h2>添加供应商</h2>
      <Form
        form={form2}
        name="supplier"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onSupplierFinish}
        autoComplete="off"
      >
        <Form.Item
          label="供应商名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入供应商名称!",
            },
            {
              validator: vaildateString,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="供应商电话"
          name="phone"
          rules={[
            {
              required: true,
              message: "请输入供应商电话!",
            },
            {
              validator: vaildatePhone,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="供应商地址"
          name="location"
          rules={[
            {
              required: true,
              message: "请输入供应商地址!",
            },
            {
              validator: vaildateString,
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
          <Button type="primary" htmlType="submit" disabled={isSupplierLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
