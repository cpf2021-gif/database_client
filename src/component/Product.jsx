import {
  useGetProductsQuery,
  useEditProductMutation,
  useDeleteProductMutation,
} from "../../feature/api/apiSlice";

import {
  Table,
  Input,
  Popconfirm,
  Form,
  Space,
  Typography,
  Button,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef, useState } from "react";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const Product = () => {
  // 提示信息
  const [messageApi, contextHolder] = message.useMessage();

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

  // 获取数据
  const {
    data: products = {},
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery();

  // 编辑数据
  const [editProduct, { isLoading: isEditing }] = useEditProductMutation();

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEdit = (record) => record.name === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.name);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleEdit = async (record) => {
    if (isEditing) return;
    try {
      const resp = await editProduct({
        id: record.id,
        supplier_name: record.supplier_name,
        name: record.name,
      }).unwrap();
      successM(resp.message);
    } catch (err) {
      errorM(err.data.error);
    }
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      handleEdit({ id, ...row });
      setEditingKey("");
    } catch (errInfo) {
      errorM("编辑失败");
    }
  };

  // 搜索
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return value
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : true;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // 删除数据
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const handleDelete = async (id) => {
    if (isDeleting) return;
    try {
      const resp = await deleteProduct(id).unwrap();
      successM(resp.message);
    } catch (err) {
      errorM(err.data.error);
    }
  };

  let content;
  let productsdata;

  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      editable: false,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      editable: true,
    },
    {
      title: "供应商",
      dataIndex: "supplier_name",
      key: "supplier_name",
      editable: true,
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      editable: false,
    },
    {
      title: "修改时间",
      dataIndex: "update_time",
      key: "update_time",
      editable: false,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => {
        const editable = isEdit(record);
        if (editable) {
          return (
            <span>
              <Typography.Link
                onClick={() => save(record.id)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          );
        }
        return (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEdit(record),
      }),
    };
  });

  if (isLoading) {
    content = <div>loading...</div>;
  } else if (isSuccess) {
    productsdata = products.data.map((product) => {
      let nuer = { ...product };
      nuer.key = product.id;
      return nuer;
    });
    content = (
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={productsdata}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    );
  } else if (isError) {
    content = <div>{error.message}</div>;
  }

  return (
    <div>
      <h2>产品列表</h2>
      {contextHolder}
      {content}
    </div>
  );
};
