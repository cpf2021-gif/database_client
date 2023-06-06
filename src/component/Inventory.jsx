import {
  useGetInventoriesQuery,
  useEditInventoryMutation,
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
  Tag,
  notification,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef, useState, useEffect } from "react";

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

export const Inventory = () => {
  // 获取数据
  const {
    data: inventories = {},
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetInventoriesQuery();

  // 提示信息
  const [messageApi, contextHolder] = message.useMessage();
  // 警告提示
  const [notificationApi, contextHolder2] = notification.useNotification();
  // 过高过低提示
  const onpeNotification = (inventories) => {
    inventories.map((inventory) => {
      if (inventory.quantity < inventory.min_quantity) {
        notificationApi.warning({
          message: "库存过低",
          description: `${inventory.product_name} 库存过低`,
          duration: 0,
          placement: "topRightt",
        });
      }
      if (
        inventory.max_quantity - inventory.quantity <
        inventory.max_quantity / 10
      ) {
        notificationApi.warning({
          message: "库存过高",
          description: `${inventory.product_name} 库存过高`,
          duration: 0,
          placement: "topRight",
        });
      }
    });
  };
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

  // 编辑
  const [editInventory, { isLoading: isEditing }] = useEditInventoryMutation();

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEdit = (record) => record.product_name === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    console.log(record.product_name);
    setEditingKey(record.product_name);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleEdit = async (record) => {
    console.log(record);
    if (isEditing) return;
    try {
      const resp = await editInventory({
        id: record.id,
        max_quantity: +record.max_quantity,
        min_quantity: +record.min_quantity,
      }).unwrap();
      successM(resp.message);
    } catch (errInfo) {
      errorM(errInfo.data.error);
    }
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      handleEdit({ ...row, id });
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
              confirm({
                closeDropdown: false,
              });
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
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      editable: false,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "产品",
      dataIndex: "product_name",
      key: "product_name",
      editable: false,
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
      editable: false,
    },
    {
      title: "状态",
      dataIndex: "tag",
      key: "tag",
      editable: false,
      render: (_, record) => (
        <>
          {record.tag === "normal" ? (
            <Tag color="green">normal</Tag>
          ) : record.tag == "low" ? (
            <Tag color="red">low</Tag>
          ) : (
            <Tag color="orange">high</Tag>
          )}
        </>
      ),
    },
    {
      title: "最大库存",
      dataIndex: "max_quantity",
      key: "max_quantity",
      editable: true,
    },
    {
      title: "最小库存",
      dataIndex: "min_quantity",
      key: "min_quantity",
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
  let inventoriesdata;

  if (isLoading) {
    content = <div>loading...</div>;
  } else if (isSuccess) {
    inventoriesdata = inventories.data.map((inventory) => {
      let nivt = { ...inventory };
      nivt.key = inventory.id;
      nivt.tag = "normal";
      if (inventory.quantity < inventory.min_quantity) {
        nivt.tag = "low";
      }
      if (
        inventory.max_quantity - inventory.quantity <
        inventory.max_quantity / 10
      ) {
        nivt.tag = "high";
      }
      return nivt;
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
          dataSource={inventoriesdata}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    );
  } else if (isError) {
    content = <div>{error}</div>;
  }

    useEffect(() => {
      if (isSuccess) {
        onpeNotification(inventoriesdata);
      }
    }, [inventoriesdata]);

  return (
    <div>
      <h2>库存</h2>
      {contextHolder2}
      {contextHolder}
      {content}
    </div>
  );
};
