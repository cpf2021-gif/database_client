import { useGetSuppliersQuery } from "../../feature/api/apiSlice";

import { Table } from "antd";

export const Supplier = () => {
    const {
        data: suppliers = {},
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetSuppliersQuery();

    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
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