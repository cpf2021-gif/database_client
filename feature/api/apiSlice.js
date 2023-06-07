import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ["User", "Product", "Supplier", "Inventory", "Inbound", "Outbound", "seller"],
  endpoints: (builder) => ({
    // 数据
    getDashboard: builder.query({
      query: () => "/data",
      providesTags: ["Inventory", "Inbound", "Outbound", "Product", "User"],
    }),

    // 用户
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (username) => `/users/${username}`,
      providesTags: ["User"],
    }),
    editUser: builder.mutation({
      query: ({ username, ...data }) => ({
        url: `/users/${username}`,
        method: "PATCH",
        body: { ...data },
      }),
      invalidatesTags: ["User"],
    }),
    editPassword: builder.mutation({
      query: ({ username, password }) => ({
        url: `/users/password/${username}`,
        method: "PATCH",
        body: { password: password },
      }),
      invalidatesTags: ["User"],
    }),
    deteleUser: builder.mutation({
      query: (username) => ({
        url: `/users/${username}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),

    // 产品,供应商,销售商
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getSuppliers: builder.query({
      query: () => "/suppliers",
      providesTags: ["Supplier"],
    }),
    getSellers: builder.query({
      query: () => "/sellers",
      providesTags: ["seller"],
    }),
    addProduct: builder.mutation({
      query: ({ name }) => ({
        url: "/products",
        method: "POST",
        body: { name: name },
      }),
      invalidatesTags: ["Product", "Inventory"],
    }),
    addSupplier: builder.mutation({
      query: ({ name, phone, location }) => ({
        url: "/suppliers",
        method: "POST",
        body: { name: name, phone: phone, location: location },
      }),
      invalidatesTags: ["Supplier"],
    }),
    addSeller: builder.mutation({
      query: ({ name, phone, location }) => ({
        url: "/sellers",
        method: "POST",
        body: { name: name, phone: phone, location: location },
      }),
      invalidatesTags: ["seller"],
    }),
    addSeller: builder.mutation({
      query: ({ name, phone, location }) => ({
        url: "/sellers",
        method: "POST",
        body: { name: name, phone: phone, location: location },
      }),
      invalidatesTags: ["seller"],
    }),
    editProduct: builder.mutation({
      query: ({ id, name }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: { name: name },
      }),
      invalidatesTags: ["Product"],
    }),
    editSupplier: builder.mutation({
      query: ({ name, phone, location }) => ({
        url: `/suppliers/${name}`,
        method: "PATCH",
        body: { phone: phone, location: location },
      }),
      invalidatesTags: ["Supplier", "Inbound"],
    }),
    editSeller: builder.mutation({
      query: ({ name, phone, location }) => ({
        url: `/sellers/${name}`,
        method: "PATCH",
        body: { phone: phone, location: location },
      }),
      invalidatesTags: ["seller", "Outbound"],
    }),

    // 订单和库存
    getInventories: builder.query({
      query: () => "/inventories",
      providesTags: ["Inventory"],
    }),
    getInbounds: builder.query({
      query: () => "/inbounds",
      providesTags: ["Inbound"],
    }),
    getOutbounds: builder.query({
      query: () => "/outbounds",
      providesTags: ["Outbound"],
    }),
    editInventory: builder.mutation({
      query: ({ id, max_quantity, min_quantity }) => ({
        url: `/inventories/${id}`,
        method: "PATCH",
        body: { max_quantity: max_quantity, min_quantity: min_quantity },
      }),
      invalidatesTags: ["Inventory"],
    }),
    addInbound: builder.mutation({
      query: ({ product_name, quantity, user_name, supplier_name}) => ({
        url: "/inbounds",
        method: "POST",
        body: { product_name: product_name, quantity: quantity, user_name: user_name, supplier_name: supplier_name },
      }),
      invalidatesTags: ["Inbound", "Inventory"],
    }),
    addOutbound: builder.mutation({
      query: ({ product_name, quantity, user_name, seller_name }) => ({
        url: "/outbounds",
        method: "POST",
        body: { product_name: product_name, quantity: quantity, user_name: user_name, seller_name: seller_name },
      }),
      invalidatesTags: ["Outbound", "Inventory"],
    }),
  }),
});

export const { 
  useGetDashboardQuery,

  useGetUsersQuery,
  useGetUserQuery,
  useEditUserMutation, 
  useEditPasswordMutation,
  useDeteleUserMutation,
  useAddUserMutation,

  useGetProductsQuery,
  useGetSuppliersQuery,
  useGetSellersQuery,
  useAddProductMutation,
  useAddSellerMutation,
  useAddSupplierMutation,
  useEditProductMutation,
  useEditSellerMutation,
  useEditSupplierMutation,

  useGetInventoriesQuery,
  useGetInboundsQuery,
  useGetOutboundsQuery,
  useEditInventoryMutation,
  useAddInboundMutation,
  useAddOutboundMutation,
 } =
  apiSlice;
