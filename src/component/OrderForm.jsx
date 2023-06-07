import { Button, Form, Input, message, Select, Cascader } from "antd";

import {
  useAddInboundMutation,
  useAddOutboundMutation,
  useGetProductsQuery,
  useGetSellersQuery,
  useGetSuppliersQuery,
} from "../../feature/api/apiSlice";

export const OrderForm = ({ username }) => {
  const [form] = Form.useForm();
  const [addInbound, { isLoading: isAddInboundLoading }] =
    useAddInboundMutation();
  const [addOutbound, { isLoading: isAddOutboundLoading }] =
    useAddOutboundMutation();
   
  const { data: products = {}, isSuccess } = useGetProductsQuery();
  const { data: suppliers = {}, isSuccess: isSuccess1 } = useGetSuppliersQuery();
  const { data: sellers = {}, isSuccess: isSuccess2 } = useGetSellersQuery();
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

  // 警告提示
  const warningM = (content) => {
    messageApi.open({
      type: "warning",
      content: content,
      duration: 2,
    });
  };

  // 校验数字
  const vaildateNumber = (_, value) => {
    if (!value || !/^[0-9]*$/.test(value)) {
      return Promise.reject(new Error("只能是数字"));
    }
    if (!value || +value > 1000) {
      return Promise.reject(new Error("单笔订单最多1000"));
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    if (isAddInboundLoading || isAddOutboundLoading) {
      return;
    }
    const type = values.type[0];
    const company = values.type[1];
    try {
      if (type === "inbound") {
        const resp = await addInbound({
          user_name: values.user_name,
          quantity: +values.quantity,
          product_name: values.product,
          supplier_name: company,
        }).unwrap();
        // 提示信息
        if (resp.message !== "success") {
          warningM(resp.message);
        } else {
          successM(resp.message);
        }
      } else {
        // 提示信息
        const resp = await addOutbound({
          user_name: values.user_name,
          quantity: +values.quantity,
          product_name: values.product,
          seller_name: company,
        }).unwrap();
        if (resp.message !== "success") {
          warningM(resp.message);
        } else {
          successM(resp.message);
        }
      }
    } catch (err) {
      errorM(err.data.error);
    }
    form.resetFields();
  };

  let options;

  if (isSuccess && isSuccess1 && isSuccess2) {
    options = [
      {
        value: "inbound",
        label: "入库",
        children: suppliers.data.map((supplier) => ({
          value: supplier.name,
          label: supplier.name,
        })),
      },
      {
        value: "outbound",
        label: "出库",
        children: sellers.data.map((seller) => ({
          value: seller.name,
          label: seller.name,
        })),
      }
    ]
  }


  return !(isSuccess && isSuccess1 && isSuccess2) ? (
    <div>loading...</div>
  ) : (
    <div>
      <h2>订单管理</h2>
      {contextHolder}
      <Form
        form={form}
        name="order"
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
          label="订单对象"
          name="type"
          rules={[
            {
              required: true,
              message: "请选择订单类型",
            },
          ]}
        >
          <Cascader options={options} /> 
        </Form.Item>

        <Form.Item
          label="操作人"
          name="user_name"
          rules={[
            {
              required: true,
              message: "请输入操作人",
            },
          ]}
        >
          <Select>
            <Option key={username} value={username}>
              {username}
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="产品"
          name="product"
          rules={[
            {
              required: true,
              message: "请选择产品",
            },
          ]}
        >
          <Select>
            {products.data.map((product) => (
              <Option key={product.name} value={product.name}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="数量"
          name="quantity"
          rules={[
            {
              required: true,
              message: "请输入数量",
            },
            {
              validator: vaildateNumber,
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
          <Button
            type="primary"
            htmlType="submit"
            loading={isAddInboundLoading || isAddOutboundLoading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
