import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import axios from "../../libraries/axiosClient";
import React, { useCallback } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Styles from "./index.module.css";

import type { ColumnsType } from "antd/es/table";
import numeral from "numeral";

const apiName = "/products";

export default function Products() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [suppliers, setSuppliers] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [category, setCategory] = React.useState<any[]>([]);
  const [supplier, setSupplier] = React.useState<any[]>([]);
  const [productName, setProductName] = React.useState("");
  const [stockStart, setStockStart] = React.useState("");
  const [stockEnd, setStockEnd] = React.useState("");
  const [priceStart, setPriceStart] = React.useState("");
  const [priceEnd, setPriceEnd] = React.useState("");
  const [discountStart, setDiscountStart] = React.useState("");
  const [discountEnd, setDiscountEnd] = React.useState("");

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalProducts, setTotalProducts] = React.useState<number>(0);

  const [updateForm] = Form.useForm();

  const onSelectCategoryFilter = useCallback((e: any) => {
    setCategory(e.target.value);
  }, []);

  const onSelectSupplierFilter = useCallback((e: any) => {
    setSupplier(e.target.value);
  }, []);

  const onSelectStockStartFilter = useCallback((e: any) => {
    setStockStart(e.target.value);
  }, []);

  const onSelectStockEndFilter = useCallback((e: any) => {
    setStockEnd(e.target.value);
  }, []);

  const onSelectPriceStartFilter = useCallback((e: any) => {
    setPriceStart(e.target.value);
  }, []);

  const onSelectPriceEndFilter = useCallback((e: any) => {
    setPriceEnd(e.target.value);
  }, []);

  const onSelectDiscountStartFilter = useCallback((e: any) => {
    setDiscountStart(e.target.value);
  }, []);

  const onSelectDiscountEndFilter = useCallback((e: any) => {
    setDiscountEnd(e.target.value);
  }, []);

  const onSelectProductNameFilter = useCallback((e: any) => {
    setProductName(e.target.value);
  }, []);

  const callApi = useCallback((searchParams: any) => {
    axios
      .get(`${apiName}?${searchParams.toString()}`)
      .then((response) => {
        const { data } = response;
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onSearch = useCallback(() => {
    let filters: {
      category: any;
      supplier: any;
      productName: any;
      stockStart: any;
      stockEnd: any;
      priceStart: any;
      priceEnd: any;
      discountStart: any;
      discountEnd: any;
    } = {
      category: category,
      supplier: supplier,
      productName: productName,
      stockStart: stockStart || 0,
      stockEnd: stockEnd || 9999,
      priceStart: priceStart || 0,
      priceEnd: priceEnd || 9999999999,
      discountStart: discountStart || 0,
      discountEnd: discountEnd || 75,
    };
    const searchParams: URLSearchParams = new URLSearchParams(filters);

    callApi(searchParams);
  }, [
    callApi,
    category,
    supplier,
    productName,
    stockStart,
    stockEnd,
    priceStart,
    priceEnd,
    discountStart,
    discountEnd,
  ]);

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Tên danh mục",
      dataIndex: "category.name",
      key: "category.name",
      render: (text, record, index) => {
        return <span>{record.category.name}</span>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier.name",
      key: "supplier.name",
      render: (text, record, index) => {
        return <span>{record.supplier.name}</span>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: "nowrap" }}>Giảm giá</div>;
      },
      dataIndex: "discount",
      key: "discount",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}%</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: "nowrap" }}>Tồn kho</div>;
      },
      dataIndex: "stock",
      key: "stock",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Mô tả / Ghi chú",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record.id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log(record.id);
                axios.delete(apiName + "/" + record.id).then((response) => {
                  setRefresh((f) => f + 1);
                  message.success("Xóa danh mục thành công!", 1.5);
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  // Get products
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  // Get categories
  React.useEffect(() => {
    axios
      .get("/categories")
      .then((response) => {
        const { data } = response;
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Get suppliers
  React.useEffect(() => {
    axios
      .get("/suppliers")
      .then((response) => {
        const { data } = response;
        setSuppliers(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* TABLE */}
      <div className={Styles.filter}>
        <select
          className={Styles.select}
          id="cars"
          onChange={onSelectCategoryFilter}
        >
          {categories.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>
        <select
          className={Styles.select}
          id="cars"
          onChange={onSelectSupplierFilter}
        >
          {suppliers.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>
        <Input
          placeholder="Tìm kiếm sản phẩm"
          value={productName}
          onChange={onSelectProductNameFilter}
          className={Styles.input}
          allowClear
        />
        <Input
          placeholder="Tồn kho thấp nhất"
          value={stockStart}
          onChange={onSelectStockStartFilter}
          className={Styles.input}
          allowClear
        />
        <Input
          placeholder="Tồn kho cao nhất"
          value={stockEnd}
          onChange={onSelectStockEndFilter}
          className={Styles.input}
          allowClear
        />
        <Input
          placeholder="Giá thấp nhất"
          value={priceStart}
          onChange={onSelectPriceStartFilter}
          className={Styles.input}
          allowClear
        />
        <Input
          placeholder="Giá cao nhất"
          value={priceEnd}
          onChange={onSelectPriceEndFilter}
          className={Styles.input}
          allowClear
        />
        <Input
          placeholder="Giảm giá thấp nhất"
          value={discountStart}
          onChange={onSelectDiscountStartFilter}
          className={Styles.input}
          allowClear
        />
        <Input
          placeholder="Giám giá cao nhất"
          value={discountEnd}
          onChange={onSelectDiscountEndFilter}
          className={Styles.input}
          allowClear
        />
        <Button className={Styles.button} onClick={onSearch}>
          Search
        </Button>
      </div>
      <Table
        className={Styles.table}
        rowKey="id"
        dataSource={products}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: totalProducts,
          onChange: onPageChange,
        }}
      />

      {/* EDIT FORM */}
      <Modal
        open={open}
        title="Cập nhật danh mục"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Danh mục sản phẩm"
            name="categoryId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Danh mục sản phẩm bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Nhà cung cấp bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên sản phẩm bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="price"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Giá bán bắt buộc phải nhập",
              },
            ]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Tồn kho" name="stock" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
