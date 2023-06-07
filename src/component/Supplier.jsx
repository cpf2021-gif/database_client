import {
  useGetSuppliersQuery,
  useEditSupplierMutation
} from "../../feature/api/apiSlice";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Space,
  Typography,
  Button,
  message
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

export const Supplier = () => {
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

  // 获取用户列表
  const {
    data: suppliers = {},
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSuppliersQuery();

  // 编辑用户
  const [editSuppliers, { isLoading: isEditing }] = useEditSupplierMutation();

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
      const resp = await editSuppliers({
        name: record.name,
        phone: record.phone,
        location: record.location,
      }).unwrap();
      successM(resp.message);
    } catch (errInfo) {
      errorM(errInfo.data.error)
    }
  };

  const save = async (name) => {
    try {
      const row = await form.validateFields();
      handleEdit({ ...row, name });
      setEditingKey("");
    } catch (errInfo) {
      errorM("编辑失败")
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
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
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

  // 表格消息
  const columns = [
    {
      title: "销售商名称",
      dataIndex: "name",
      key: "name",
      editable: false,
      ...getColumnSearchProps("name"),
    },
    {
      title: "联系方式",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "地区",
      dataIndex: "location",
      key: "location",
      editable: true,
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
                onClick={() => save(record.name)}
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

  let content;
  let suppliersdata;
  if (isLoading) {
    content = <div>loading...</div>;
  } else if (isSuccess) {
    suppliersdata = suppliers.data.map((user) => {
      let nuer = { ...user };
      nuer.key = user.name;
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
          dataSource={suppliersdata}
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
      <h2>供应商数据</h2>
      {contextHolder}
      {content}
    </div>
  );
};