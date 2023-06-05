import { Button, Form, message, Select, Divider, Input } from "antd";
import { handleExport } from "../../utils/educe";
import { useGetProductsQuery } from "../../feature/api/apiSlice";
import formateDate from "../../utils/formatDate"

const inventoriesColumns = [
  {
    header: "序号",
    key: "id",
    width: 20,
  },
  {
    header: "产品",
    key: "product_name",
    width: 20,
  },
  {
    header: "数量",
    key: "quantity",
    width: 20,
  },
  {
    header: "最大库存",
    key: "max_quantity",
    width: 20,
  },
  {
    header: "最小库存",
    key: "min_quantity",
    width: 20,
  },
  {
    header: "创建时间",
    key: "create_time",
    width: 20,
  },
  {
    header: "修改时间",
    key: "update_time",
    width: 20,
  },
];

const OrderColumns = [
  {
    header: "序号",
    key: "id",
    width: 20,
  },
  {
    header: "产品名称",
    key: "product_name",
    width: 20,
  },
  {
    header: "数量",
    key: "quantity",
    width: 20,
  },
  {
    header: "操作人",
    key: "user_name",
    width: 20,
  },
  {
    header: "创建时间",
    key: "create_time",
    width: 20,
  },
];

// 年月校验
const vaildateMonth = (_, value) => {
  // 'yyyy-MM'格式
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return Promise.reject(new Error("年月格式为yyyy-MM"));
  }
  return Promise.resolve();
};

export const ExportForm = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { data: products = {}, isSuccess } = useGetProductsQuery();
  // 提示信息
  const [messageApi, contextHolder] = message.useMessage();

  // 失败提示
  const errorM = (content) => {
    messageApi.open({
      type: "error",
      content: content,
      duration: 2,
    });
  };
  const handleOrder = async (values) => {
    try {
      if (values.type === "in") {
        const resp = await fetch("http://localhost:8080/inbounds/export", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            month: values.month ? values.month : "",
            product_name: values.product_name ? values.product_name : "",
          }),
        });
        const res = await resp.json();
        const data = res.data;
        // 文件名包含时间 "yyyy-MM"
        const name = "入库数据" + (values.month ? values.month : formateDate(Date.now()).substring(0, 7));
        handleExport({ columns: OrderColumns, data, name: name });
      } else {
        const resp = await fetch("http://localhost:8080/outbounds/export", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            month: values.month ? values.month : "",
            product_name: values.product_name ? values.product_name : "",
          }),
        });
        const res = await resp.json();
        const data = res.data;
        // 文件名包含时间 "yyyy-MM"
        const name = "出库数据" + (values.month ? values.month : formateDate(Date.now()).substring(0, 7));
        handleExport({ columns: OrderColumns, data, name: name });
      }
    } catch (err) {
      errorM("没有数据");
    }
    form.resetFields();
  };

  const handleExportInventory = async () => {
    try {
      const resp = await fetch("http://localhost:8080/inventories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await resp.json();
      const data = res.data;
      // 文件名包含时间 "yyyy-MM-dd"
      const name = "库存数据"+ formateDate(Date.now());
      handleExport({ columns: inventoriesColumns, data, name: name });
    } catch (err) {
      message.error("导出失败");
    }
  };

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {contextHolder}
      <h2>导出库存数据</h2>
      <Button type="primary" onClick={handleExportInventory}>
        导出
      </Button>
      <Divider />

      <h2>导出入库和出库数据</h2>
      <Form
        form={form}
        name="export"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={handleOrder}
        autoComplete="off"
      >
        <Form.Item
          label="类型"
          name="type"
          rules={[
            {
              required: true,
              message: "请选择类型!",
            },
          ]}
        >
          <Select>
            <Option value="in">入库</Option>
            <Option value="out">出库</Option>
          </Select>
        </Form.Item>

        <Form.Item label="产品名称" name="product_name">
          <Select>
            {products.data.map((product) => (
              <Option key={product.name} value={product.name}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="年月"
          name="month"
          rules={[
            {
              required: true,
              message: "请输入年月!",
            },
            {
              validator: vaildateMonth,
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
          <Button type="primary" htmlType="submit">
            导出
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
