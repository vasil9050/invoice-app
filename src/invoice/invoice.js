import React, { useEffect, useState } from "react";
import { getProduct, submitInvoice, getInvoice, deleteInvoice } from "../utils/page-utils";
import "./invoice.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Invoice() {
  const [data, setData] = useState([]);
  const [dataInvoice, setDataInvoice] = useState([]);
  const [partTypeDdl, setPartTypeDdl] = useState([]);
  const [partDescpDdl, setPartDescpDdl] = useState([]);
  const [prodInfoDdl, setProdInfoDdl] = useState([]);
  const [colorDdl, setColorDdl] = useState([]);
  const [quantityDdl, setQuantityDdl] = useState([]);
  const [partNoDdl, setPartNoDdl] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    date: "",
    products: [
      {
        partType: "",
        partDescription: "",
        color: "",
        quantity: "1",
        partNumber: "",
        productInfo: "",
        partNumber: "",
        selectionType: "single",
      },
    ],
  });

  // State to toggle visibility of the entire form
  const [isFormVisible, setIsFormVisible] = useState(true);

  // Load product data and populate dropdowns
  async function dataLoad() {
    const dataProduct = await getProduct();
    const dataInvoice = await getInvoice();
    if (dataProduct?.data?.length > 0) {
      setData(dataProduct.data);
      setPartTypeDdl([...new Set(dataProduct.data.map((item) => item.PartType))]);
      setColorDdl([...new Set(dataProduct.data.map((item) => item.Color))]);
      setQuantityDdl([...new Set(dataProduct.data.map((item) => item.Quantity))]);
    }
    console.log(dataInvoice.data);
    setDataInvoice(dataInvoice.data)
  }

  useEffect(() => {
    dataLoad();
  }, []);

  // Handle customer name and date change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle product field changes
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...form.products];
    updatedProducts[index][name] = value;
    setForm({ ...form, products: updatedProducts });

    if (name === "partType") {
      setPartDescpDdl([
        ...new Set(data.filter((item) => item.PartType === value).map((item) => item.PartDescription)),
      ]);
      setProdInfoDdl([]);
    }

    if (name === "partDescription") {
      setProdInfoDdl([
        ...new Set(data.filter((item) => item.PartDescription === value).map((item) => item.ProductInfo)),
      ]);
      setPartNoDdl([]);
    }

    if (name === "productInfo") {
      setPartNoDdl([
        ...new Set(data.filter((item) => item.ProductInfo === value).map((item) => item.PartNumber)),
      ]);
    }
  };

  const handleCheckboxChange = (index, type) => {
    const updatedProducts = [...form.products];
    updatedProducts[index].selectionType = type;
    setForm({ ...form, products: updatedProducts });
  };

  const addProduct = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        {
          partType: "",
          partDescription: "",
          color: "",
          quantity: "1",
          partNumber: "",
          selectionType: "single",
        },
      ],
    });
  };

  const removeProduct = (index) => {
    const updatedProducts = form.products.filter((_, i) => i !== index);
    setForm({ ...form, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      submitInvoice(form);

      dataLoad();

      setForm({
        customerName: "",
        date: "",
        products: [
          {
            partType: "",
            partDescription: "",
            color: "",
            quantity: "1",
            partNumber: "",
            productInfo: "",
            selectionType: "single",
          },
        ],
      });

      setIsFormVisible(false);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("There was an error submitting the invoice. Please try again.");
    }
  };

  const handledeleteInvoice = (id) => {
    try {
      deleteInvoice(id)
      setDataInvoice((prev) => prev.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  // Toggle expand/collapse for rows
  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Handle the search query input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [expandedRows, setExpandedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = dataInvoice.filter((invoice) => {
    const invoiceDate = new Date(invoice.date).toLocaleDateString();
    return (
      invoice.customerName?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      invoiceDate.includes(searchQuery)
    );
  });

  function InvoiceTable({ data }) {
    const [expandedRows, setExpandedRows] = useState([]);

    // Toggle expand/collapse for rows
    const toggleRow = (id) => {
      setExpandedRows((prev) =>
        prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
    };

    return (
      <div className="container mt-4">
        <h2>Invoice Table</h2>
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((invoice) => (
              <React.Fragment key={invoice._id}>
                {/* Main Row */}
                <tr>
                  <td>{invoice.customerName}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={`btn btn-${expandedRows.includes(invoice._id) ? 'danger' : 'primary'}`}
                      onClick={() => toggleRow(invoice._id)}
                    >
                      {expandedRows.includes(invoice._id) ? 'Collapse' : 'Expand'}
                    </button>
                    {!expandedRows.includes(invoice._id) && (
                      <button
                        onClick={() => handledeleteInvoice(invoice._id)}
                        className="mx-3 btn btn-outline-danger"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>

                {/* Expanded Section */}
                {expandedRows.includes(invoice._id) && (
                  <tr>
                    <td colSpan="3">
                      <table className="table table-sm table-striped">
                        <thead>
                          <tr>
                            <th>Part Type</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Quantity</th>
                            <th>Part Number</th>
                            <th>Product Info</th>
                            <th>Selection Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.products.map((product) => (
                            <tr key={product._id}>
                              <td>{product.partType}</td>
                              <td>{product.partDescription}</td>
                              <td>{product.color}</td>
                              <td>{product.quantity}</td>
                              <td>{product.partNumber}</td>
                              <td>{product.productInfo}</td>
                              <td>{product.selectionType}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  }



  return (
    <>
      <h1>Invoice Page</h1>

      {/* Toggle Button to Collapse/Expand the Entire Form */}
      <button
        type="button"
        className="btn btn-info mb-3 d-flex align-items-center"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {/* Bootstrap Icon for Expand/Collapse */}
        <i
          className={`bi ${isFormVisible ? "bi-caret-up-fill" : "bi-caret-down-fill"} me-2`}
          style={{ fontSize: "20px" }}
        ></i>
        <span>{isFormVisible ? "Collapse Form" : "Expand Form"}</span>
      </button>

      {/* Conditional Render for the Entire Form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          {/* Customer Info Section */}
          <div className="mb-3">
            <div className="form-group row">
              <div className="col-md-6">
                <label htmlFor="customerName" className="form-label">
                  Customer Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">
                  Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div>
            {form.products.map((product, index) => (
              <div key={index} className="product-section mb-4 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0">Product {index + 1}</h5>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ width: "150px" }}
                      onClick={() => removeProduct(index)}
                    >
                      Remove Product
                    </button>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor={`partType-${index}`} className="form-label">
                        Part Type:
                      </label>
                      <select
                        className="form-control"
                        id={`partType-${index}`}
                        name="partType"
                        value={product.partType}
                        onChange={(e) => handleProductChange(index, e)}
                        required
                      >
                        <option value="">Select Part Type</option>
                        {partTypeDdl.map((type, idx) => (
                          <option key={idx} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`partDescription-${index}`} className="form-label">
                        Part Description:
                      </label>
                      <select
                        className="form-control"
                        id={`partDescription-${index}`}
                        name="partDescription"
                        value={product.partDescription}
                        onChange={(e) => handleProductChange(index, e)}
                        required
                      >
                        <option value="">Select Description</option>
                        {partDescpDdl.map((desc, idx) => (
                          <option key={idx} value={desc}>
                            {desc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`productInfo-${index}`} className="form-label">
                        Part Information:
                      </label>
                      <select
                        className="form-control"
                        id={`productInfo-${index}`}
                        name="productInfo"
                        value={product.productInfo}
                        onChange={(e) => handleProductChange(index, e)}
                        required
                      >
                        <option value="">Select Information</option>
                        {prodInfoDdl.map((desc, idx) => (
                          <option key={idx} value={desc}>
                            {desc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor={`partNumber-${index}`} className="form-label">
                        Part Number:
                      </label>
                      <select
                        className="form-control"
                        id={`partNumber-${index}`}
                        name="partNumber"
                        value={product.partNumber}
                        onChange={(e) => handleProductChange(index, e)}
                        required
                      >
                        <option value="">Select Part Number</option>
                        {partNoDdl.map((desc, idx) => (
                          <option key={idx} value={desc}>
                            {desc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`color-${index}`} className="form-label">
                        Color:
                      </label>
                      <select
                        className="form-control"
                        id={`color-${index}`}
                        name="color"
                        value={product.color}
                        onChange={(e) => handleProductChange(index, e)}
                        required
                      >
                        <option value="">Select Color</option>
                        {colorDdl.map((color, idx) => (
                          <option key={idx} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`quantity-${index}`} className="form-label">
                        Quantity:
                      </label>
                      {product.selectionType === "single" ? (
                        <input
                          type="number"
                          className="form-control"
                          id={`quantity-${index}`}
                          name="quantity"
                          onChange={handleChange}
                          value={1}
                          readOnly
                          required
                        />
                      ) : (
                        <select
                          className="form-control"
                          id={`quantity-${index}`}
                          name="quantity"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, e)}
                          required
                        >
                          <option value="">Select Quantity</option>
                          {quantityDdl.map((qty, idx) => (
                            <option key={idx} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Option:</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`selectionType-${index}`}
                        id={`single-${index}`}
                        value="single"
                        checked={product.selectionType === "single"}
                        onChange={() => handleCheckboxChange(index, "single")}
                      />
                      <label className="form-check-label" htmlFor={`single-${index}`}>
                        Single
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`selectionType-${index}`}
                        id={`bulk-${index}`}
                        value="bulk"
                        checked={product.selectionType === "bulk"}
                        onChange={() => handleCheckboxChange(index, "bulk")}
                      />
                      <label className="form-check-label" htmlFor={`bulk-${index}`}>
                        Bulk
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Product Button */}
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={addProduct}
          >
            Add Product
          </button>

          <br />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      )}
      <div className="mt-5 mb-5">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Customer Name or Date"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {dataInvoice && <InvoiceTable data={dataInvoice} />}
      </div>
    </>
  );
}

export default Invoice;
