import { useGetOutboundsQuery } from "../../feature/api/apiSlice";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";


export const Outbound = () => {
    const {
        data: outbounds = {},
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetOutboundsQuery();

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
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "产品名称",
            dataIndex: "product_name",
            key: "product_name",
            ...getColumnSearchProps("product_name"),
        },
        {
            title: "数量",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "操作人",
            dataIndex: "user_name",
            key: "user_name",
            ...getColumnSearchProps("user_name"),
        }, 
        {
            title: "创建时间",
            dataIndex: "create_time",
            key: "create_time",
            ...getColumnSearchProps("create_time"),
        }
    ]

    let content;
    let outboundsdata;

    if (isLoading) {
        content = <div>loading...</div>;
    } else if (isSuccess) {
        outboundsdata = outbounds.data ? outbounds.data.map((outbound) => {
            let nuer = { ...outbound };
            nuer.key = outbound.id;
            return nuer;
        }
        ) : [];
        content = (
            <Table
                bordered
                dataSource={outboundsdata}
                columns={columns}
            />
        );
    } else if (isError) {
        content = <div>{error}</div>;
    }

    return (
        <div>
            <h2>出库信息</h2>
            {content}
        </div>
    );
}