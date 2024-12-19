import React, { useEffect } from 'react';
import { fileUpload, getProduct } from '../utils/page-utils';
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
      setHead(filteredKeys);
    }
  }

  useEffect(() => {
    dataLoad();
  }, []);

  console.log(data, head);

  return (
    <>
      <h1>Product Page</h1>
      <div className='container mt3'>
        <form>
          <div className='my-3'>
            <label className='mx-3'>Upload CSV file:</label>
            <input
              onChange={handleFileChange}
              className='form-control d-inline'
              style={{ width: '30%' }}
              type='file'
              id='fileupload'
              enctype='multipart/form-data'
              // accept='.xlsx .xls'
              required
            />
          </div>
          <div>
            <button onClick={handleFileUpload} type='submit' className='mx-3 btn btn-primary'>
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className='mt-5'>
        {data && data.length > 0 && (
          <table class='table table-light'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                {head && head.map((i) => <th scope='col'>{i}</th>)}
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, i) => (
                  <tr>
                    <th scope='row'>{i + 1}</th>
                    <td>{item.PartType}</td>
                    <td>{item.PartDescription}</td>
                    <td>{item.ProductInfo}</td>
                    <td>{item.Color}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.PartNumber}</td>
                    <td>{item.SingleP}</td>
                    <td>{item.BulkP}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Product;
