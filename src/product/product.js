import React, { useEffect } from 'react';
import { fileUpload, getProduct } from '../utils/page-utils';
import Card from '../components/Card';
import './product.css';

function Product() {
  const [data, setData] = React.useState([]);
  const [head, setHead] = React.useState([]);

  const [file, setFile] = React.useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!file) {
      console.log('Please select a file!');
    }

    const formData = new FormData();
    formData.append('file', file);

    fileUpload(formData);
  };

  async function dataLoad() {
    const excludeKeys = ['_id', '__v'];
    const dataProduct = await getProduct();
    if (dataProduct.data && dataProduct.data.length > 0) {
      setData(dataProduct.data);
      const filteredKeys = Object.keys(dataProduct.data[0]).filter((key) => !excludeKeys.includes(key));
      setHead([
        'Part Type',
        'Part Description',
        'Product Info',
        'Color',
        'Part Number',
        'Quantity',
        'Single Price',
        'Bulk Price',
      ]);
    }
  }

  useEffect(() => {
    dataLoad();
  }, []);

  console.log(data, head);

  return (
    <>
      <h1 className='mx-5'>Product</h1>
      <Card>
        <div className='container'>
          <form>
            <div className=' row'>
              <div className='col-lg-2 col-sm-12 mt-1'>
                <label>Upload CSV file:</label>
              </div>
              <div className='col-lg-8 col-sm-12 mt-1'>
                <input
                  onChange={handleFileChange}
                  className='form-control d-inline'
                  type='file'
                  id='fileupload'
                  enctype='multipart/form-data'
                  // accept='.xlsx .xls'
                  required
                />
              </div>
              <div className='col-lg-2 col-sm-12 mt-1'>
                <button onClick={handleFileUpload} type='submit' className='mx-3 btn btn-outline-primary'>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>
      <Card header='Project Table'>
        <div className='mt-5'>
          {data && data.length > 0 ? (
            <table className='table'>
              <thead className='table-dark'>
                <tr>
                  <th scope='col'>#</th>
                  {head &&
                    head.map((i, idx) => (
                      <th key={idx} scope='col'>
                        {i}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <tr key={i}>
                    <th scope='row'>{i + 1}</th>
                    <td>{item.PartType}</td>
                    <td>{item.PartDescription}</td>
                    <td>{item.ProductInfo}</td>
                    <td>{item.Color}</td>
                    <td>{item.PartNumber}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.SingleP}</td>
                    <td>{item.BulkP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-danger mx-5'>
              <i className='bi bi-exclamation-square'></i> No record found please upload file
            </p>  
          )}
        </div>
      </Card>
    </>
  );
}

export default Product;
