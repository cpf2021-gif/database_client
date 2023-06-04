import { useGetSuppliersQuery } from "../../feature/api/apiSlice";

import {
    Table,
    Input,
    Space,
    Button,
  } from "antd";

import { useState, useRef } from "react"
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export const Supplier = () => {
    const {
        data: suppliers = {},
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetSuppliersQuery();

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

    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
        },
        {
            title: "地址",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "联系电话",
            dataIndex: "phone",
            key: "phone",
        }
    ]

    let content;
    let suppliersdata;

    if (isLoading) {
        content = <div>loading...</div>;
    } else if (isSuccess) {
        suppliersdata = suppliers.data.map((supplier) => {
            let nuer = { ...supplier };
            nuer.key = supplier.name;
            return nuer;
        }
        );
        content = (
            <Table
                bordered
                dataSource={suppliersdata}
                columns={columns}
            />
        );
    } else if (isError) {
        content = <div>{error}</div>;
    }

    return (
        <div>
            <h2>供应商</h2>
            {content}
        </div>
    );
}