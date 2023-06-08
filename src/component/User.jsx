import {
  useGetUsersQuery,
  useEditUserMutation,
  useDeteleUserMutation,
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
  console.log(editing)
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

export const User = () => {
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
    data: users = {},
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  // 编辑用户
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEdit = (record) => record.username === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.username);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleEdit = async (record) => {
    if (isEditing) return;
    try {
      const resp = await editUser({
        username: record.username,
        role: record.role,
        phone: record.phone,
        sex: record.sex, 
      }).unwrap();
      successM(resp.message);
    } catch (errInfo) {
      errorM(errInfo.data.error)
    }
  };

  const save = async (username) => {
    try {
      const row = await form.validateFields();
      handleEdit({ ...row, username });
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

  // 删除用户
  const [deleteUser, { isLoading: isDeleting }] =  useDeteleUserMutation();
  const handleDelete = async (username) => {
    if (isDeleting) return;
    try {
      const resp = await deleteUser(username).unwrap();
      successM(resp.message);
    } catch (errInfo) {
      errorM(errInfo.data.error)
    }
  };


  // 表格消息
  const columns = [
    {
      title: "名称",
      dataIndex: "username",
      key: "username",
      editable: false,
      ...getColumnSearchProps("username"),
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      editable: true,
    },
    {
      title: "联系方式",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "权限",
      dataIndex: "role",
      key: "role",
      editable: true,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "created_time",
      editable: false,
    },
    {
      title: "更新时间",
      dataIndex: "update_time",
      key: "updated_time",
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
                onClick={() => save(record.username)}
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
            <Popconfirm  title="Sure to delete?" onConfirm={() => handleDelete(record.username)}>
              <a disabled={editingKey !== ""}>Delete</a>
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

  let content;
  let usersdata;
  if (isLoading) {
    content = <div>loading...</div>;
  } else if (isSuccess) {
    usersdata = users.data.map((user) => {
      let nuer = { ...user };
      nuer.key = user.username;
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
          dataSource={usersdata}
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
      <h2>用户管理</h2>
      {contextHolder}
      {content}
    </div>
  );
};
