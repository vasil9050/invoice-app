import React, { useEffect, useState } from 'react';
import { getProduct, submitInvoice, getInvoice, deleteInvoice } from '../utils/page-utils';
import './invoice.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from '../components/Card';

function Invoice() {
  const [data, setData] = useState([]);
  const [dataInvoice, setDataInvoice] = useState([]);
  const [partTypeDdl, setPartTypeDdl] = useState([]);
  const [colorDdl, setColorDdl] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    date: '',
    products: [
      {
        partType: '',
        partDescription: '',
        color: '',
        quantity: '',
        partNumber: '',
        productInfo: '',
        selectionType: 'single',
        price: '0',
      },
    ],
  });

  const [isFormVisible, setIsFormVisible] = useState(true);

  async function dataLoad() {
    const dataProduct = await getProduct();
    const dataInvoice = await getInvoice();
    if (dataProduct?.data?.length > 0) {
      setData(dataProduct.data);
      setPartTypeDdl([...new Set(dataProduct.data.map((item) => item.PartType))]);
      setColorDdl([...new Set(dataProduct.data.map((item) => item.Color))]);
    }
    console.log(dataInvoice.data);
    setDataInvoice(dataInvoice.data);
  }

  useEffect(() => {
    dataLoad();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;

    // Update the specific product's value
    const updatedProducts = [...form.products];
    const currentProduct = { ...updatedProducts[index], [name]: value };

    // Manage dropdowns specific to the product at the current index
    if (name === 'partType') {
      currentProduct.partDescriptionOptions = [
        ...new Set(data.filter((item) => item.PartType === value).map((item) => item.PartDescription)),
      ];
      currentProduct.productInfoOptions = [];
      currentProduct.partNumberOptions = [];
      currentProduct.quantityOptions = [];
      currentProduct.amount = 0;
      currentProduct.price = 0;
    }

    if (name === 'partDescription') {
      currentProduct.productInfoOptions = [
        ...new Set(data.filter((item) => item.PartDescription === value).map((item) => item.ProductInfo)),
      ];
      currentProduct.quantityOptions = [
        ...new Set(data.filter((item) => item.PartDescription === value).map((item) => item.Quantity)),
      ];
      currentProduct.partNumberOptions = [];
    }

    if (name === 'productInfo') {
      currentProduct.partNumberOptions = [
        ...new Set(data.filter((item) => item.ProductInfo === value).map((item) => item.PartNumber)),
      ];
    }

    // Calculate price and amount based on the current selection
    if (name === 'quantity' || name === 'selectionType') {
      const filteredData = data.filter((item) => {
        return (
          item.PartType === currentProduct.partType &&
          item.PartDescription === currentProduct.partDescription &&
          item.ProductInfo === currentProduct.productInfo &&
          item.PartNumber === currentProduct.partNumber
        );
      });

      const basePrice =
        currentProduct.selectionType === 'single'
          ? filteredData.map((item) => item.SingleP)[0]
          : filteredData.map((item) => item.BulkP)[0];

      currentProduct.price = basePrice || 0;
      currentProduct.amount = (currentProduct.price || 0) * (parseInt(currentProduct.quantity) || 1);
    }

    updatedProducts[index] = currentProduct;
    setForm({ ...form, products: updatedProducts });
  };

  const handleCheckboxChange = (index, type) => {
    const updatedProducts = [...form.products];
    updatedProducts[index].selectionType = type;
    if (type === 'bulk') {
      updatedProducts[index].quantity = '';
    }
    updatedProducts[index].amount = 0;
    updatedProducts[index].price = 0;
    setForm({ ...form, products: updatedProducts });
  };

  const addProduct = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        {
          partType: '',
          partDescription: '',
          color: '',
          quantity: '',
          partNumber: '',
          selectionType: 'single',
          price: '0',
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
        customerName: '',
        date: '',
        products: [
          {
            partType: '',
            partDescription: '',
            color: '',
            quantity: '',
            partNumber: '',
            productInfo: '',
            selectionType: 'single',
            price: '0',
          },
        ],
      });

      setIsFormVisible(false);
    } catch (error) {
      console.error('Error submitting invoice:', error);
      alert('There was an error submitting the invoice. Please try again.');
    }
  };

  const handledeleteInvoice = (id) => {
    try {
      deleteInvoice(id);
      setDataInvoice((prev) => prev.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [expandedRows, setExpandedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = dataInvoice.filter((invoice) => {
    const invoiceDate = new Date(invoice.date).toLocaleDateString();
    return (
      invoice.customerName?.toLowerCase().includes(searchQuery?.toLowerCase()) || invoiceDate.includes(searchQuery)
    );
  });

  function InvoiceTable({ data }) {
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
      setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    return (
      <div className='mt-3'>
        <table className='table table-bordered table-hover'>
          <thead className='table-dark'>
            <tr>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((invoice) => (
              <React.Fragment key={invoice._id}>
                <tr>
                  <td>{invoice.customerName}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{invoice.products.reduce((total, item) => total + Number(item.amount), 0)}</td>
                  <td>
                    <button
                      className={`btn btn-${
                        expandedRows.includes(invoice._id) ? 'outline-warning' : 'outline-primary'
                      }`}
                      onClick={() => toggleRow(invoice._id)}
                    >
                      {expandedRows.includes(invoice._id) ? (
                        <i className='bi bi-caret-up'>show less</i>
                      ) : (
                        <i className='bi bi-caret-down'>Product Details</i>
                      )}
                    </button>
                    {!expandedRows.includes(invoice._id) && (
                      <button onClick={() => handledeleteInvoice(invoice._id)} className='mx-3 btn btn-outline-danger'>
                        <i className='bi-trash3'></i>
                      </button>
                    )}
                  </td>
                </tr>

                {expandedRows.includes(invoice._id) && (
                  <tr>
                    <td colSpan='4'>
                      <table className='table table-sm table-striped'>
                        <thead>
                          <tr>
                            <th>Part Type</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Quantity</th>
                            <th>Part Number</th>
                            <th>Product Info</th>
                            <th>Selection Type</th>
                            <th>Amount</th>
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
                              <td>{product.amount}</td>
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
      <h1 className='mx-5'>Invoice</h1>
      <button
        type='button'
        className='btn btn-light mt-3 mb-3 d-flex align-items-center mx-5'
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <i
          className={`bi ${isFormVisible ? 'bi-caret-up-fill' : 'bi-caret-down-fill'} me-2`}
          style={{ fontSize: '20px' }}
        ></i>
        <span>{isFormVisible ? 'Create Invoice' : 'Create Invoice'}</span>
      </button>
      {isFormVisible && (
        <Card>
          {data && data.length > 0 ? (
            <form onSubmit={handleSubmit}>
              {/* Customer Info Section */}
              <div className='mb-3'>
                <div className='form-group mt-3 row'>
                  <div className='col-md-6'>
                    <label htmlFor='customerName' className='form-label'>
                      Customer Name:
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='customerName'
                      name='customerName'
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder='Enter your name'
                      required
                    />
                  </div>
                  <div className='col-md-6'>
                    <label htmlFor='date' className='form-label'>
                      Invoice Date:
                    </label>
                    <input
                      type='date'
                      className='form-control'
                      id='date'
                      name='date'
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
                  <div key={index} className='product-section mb-4 p-3 border rounded'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                      <h5 className='m-0'>Product {index + 1}</h5>
                      {index > 0 && (
                        <button
                          type='button'
                          className='btn btn-outline-danger btn-sm'
                          style={{ width: '150px' }}
                          onClick={() => removeProduct(index)}
                        >
                          Remove Product
                        </button>
                      )}
                    </div>
                    <div className='row'>
                      <div className='col-md-6 col-sm-12'>
                        <div className='form-group mt-3'>
                          <label className='form-label'>Part Type:</label>
                          <select
                            name='partType'
                            value={product.partType}
                            onChange={(e) => handleProductChange(index, e)}
                            className='form-control'
                          >
                            <option value=''>Select Part Type</option>
                            {partTypeDdl.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className='form-group mt-3'>
                          <label className='form-label'>Part Description:</label>
                          <select
                            name='partDescription'
                            value={product.partDescription}
                            onChange={(e) => handleProductChange(index, e)}
                            className='form-control'
                            disabled={!product.partDescriptionOptions || product.partDescriptionOptions.length === 0}
                          >
                            <option value=''>Select Part Description</option>
                            {product.partDescriptionOptions?.map((desc) => (
                              <option key={desc} value={desc}>
                                {desc}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className='form-group mt-3'>
                          <label className='form-label'>Product Info:</label>
                          <select
                            name='productInfo'
                            value={product.productInfo}
                            onChange={(e) => handleProductChange(index, e)}
                            className='form-control'
                            disabled={!product.productInfoOptions || product.productInfoOptions.length === 0}
                          >
                            <option value=''>Select Product Info</option>
                            {product.productInfoOptions?.map((info) => (
                              <option key={info} value={info}>
                                {info}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='col-md-6 col-sm-12'>
                        <div className='form-group mt-3'>
                          <label className='form-label'>Part Number:</label>
                          <select
                            name='partNumber'
                            value={product.partNumber}
                            onChange={(e) => handleProductChange(index, e)}
                            className='form-control'
                            disabled={!product.partNumberOptions || product.partNumberOptions.length === 0}
                          >
                            <option value=''>Select Part Number</option>
                            {product.partNumberOptions?.map((number) => (
                              <option key={number} value={number}>
                                {number}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='form-group mt-3'>
                          <label className='form-label'>Color:</label>
                          <select
                            className='form-control'
                            id={`color-${index}`}
                            name='color'
                            value={product.color}
                            onChange={(e) => handleProductChange(index, e)}
                            required
                          >
                            <option value=''>Select Color</option>
                            {colorDdl.map((color, idx) => (
                              <option key={idx} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='form-group mt-3'>
                          <label className='form-label'>Quantity:</label>
                          {product.selectionType === 'single' ? (
                            <select
                              name='quantity'
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, e)}
                              className='form-control'
                              disabled={!product.quantityOptions || product.quantityOptions.length === 0}
                            >
                              <option value=''>Select Quantity</option>
                              <option key={1} value={1}>
                                1
                              </option>
                            </select>
                          ) : (
                            <select
                              name='quantity'
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, e)}
                              className='form-control'
                              disabled={!product.quantityOptions || product.quantityOptions.length === 0}
                            >
                              <option value=''>Select Quantity</option>
                              {product.quantityOptions?.map((qty) => (
                                <option key={qty} value={qty}>
                                  {qty}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='form-group'>
                      <label className='form-label'>
                        <input
                          type='checkbox'
                          name='single'
                          checked={product.selectionType === 'single'}
                          onChange={() => handleCheckboxChange(index, 'single')}
                        />
                        Single
                      </label>
                      <label className='m-3'>
                        <input
                          type='checkbox'
                          name='bulk'
                          checked={product.selectionType === 'bulk'}
                          onChange={() => handleCheckboxChange(index, 'bulk')}
                        />
                        Bulk
                      </label>
                    </div>

                    <div className='row'>
                      <div className='form-group mt-3 col-md-6 col-sm-12'>
                        <label className='form-label'>Price($):</label>
                        <input type='text' className='form-control' value={product.price} readOnly />
                      </div>
                      <div className='form-group mt-3 col-md-6 col-sm-12'>
                        <label className='form-label'>Amount($):</label>
                        <input type='text' className='form-control' value={product.amount || 0} readOnly />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Product Button */}
              <button type='button' className='btn btn-outline-secondary mb-3' onClick={addProduct}>
                Add Product
              </button>

              <br />
              <button type='submit' className='btn btn-outline-primary'>
                Submit
              </button>
            </form>
          ) : (
            <p className='text-danger mx-5'>
              <i className='bi bi-exclamation-square'></i> No record found please upload data file for the filter tool
              to appear
            </p>
          )}
        </Card>
      )}
      <Card>
        {' '}
        <div className=''>
          <h2>Invoice Table</h2>
          <input
            type='text'
            className='form-control mt-3'
            placeholder='Search by Customer Name or Date'
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {dataInvoice && <InvoiceTable data={dataInvoice} />}
      </Card>{' '}
    </>
  );
}

export default Invoice;
