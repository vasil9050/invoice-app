import React, { useEffect, useState } from 'react';
import { getProduct } from '../utils/page-utils';

function Invoice() {
  const [data, setData] = React.useState([]);
  const [partTypeDdl, setPartTypeDdl] = React.useState([]);

  async function dataLoad() {
    const dataProduct = await getProduct();
    if (dataProduct.data && dataProduct.data.length > 0) {
      setData(dataProduct.data);
      setPartTypeDdl(
        dataProduct.data
          .map((i) => i.PartType)
          .filter((obj, index, self) => index === self.findIndex((t) => t.PartType === obj.PartType))
      );
    }
  }

  useEffect(() => {
    dataLoad();
  }, []);

  console.log(data, partTypeDdl);

  return (
    <>
      <h1>Invoice Page</h1>
      <form action=''>
        <div className='row'>
          <div className='col-6'>
            <div class='mb-3 form-group'>
              <label for='customername'>Customer Name:</label>
              <input type='text' className='form-control' id='customername' />
            </div>
            <div class='mb-3 form-group'>
              <label for='date'>Customer Name:</label>
              <input type='date' className='form-control' id='date' />
            </div>
            <div class='mb-3 form-group'>
              <label for=''>Part Type:</label>
              <select className='form-control'>
                <option value=''>1</option>
                <option value=''>2</option>
                <option value=''>3</option>
              </select>
            </div>
            <div class='mb-3 form-group'>
              <label for=''>Part Description:</label>
              <select className='form-control'>
                <option value=''>1</option>
                <option value=''>2</option>
                <option value=''>3</option>
              </select>
            </div>
          </div>
          <div className='col-6'>
            <div class='mb-3 form-group'>
              <label for=''>Part Description:</label>
              <select className='form-control'>
                <option value=''>1</option>
                <option value=''>2</option>
                <option value=''>3</option>
              </select>
            </div>
            <div class='mb-3 form-group'>
              <label for=''>Quantity:</label>
              <select className='form-control'>
                <option value=''>1</option>
                <option value=''>2</option>
                <option value=''>3</option>
              </select>
            </div>
            <div class='mb-3 form-group'>
              <label for=''>Part Description:</label>
              <select className='form-control'>
                <option value=''>1</option>
                <option value=''>2</option>
                <option value=''>3</option>
              </select>
            </div>
            {/* <div class='mb-3 form-group'>
            <label for='customername'>Select Option:</label>
            <label for='customername'>Single:</label>
            <input type='checkbox' className='form-control' id='single' />
            <label for='customername'>Bulk:</label>
            <input type='checkbox' className='form-control' id='bulk' />
          </div> */}
          </div>

          <button type='submit' className='btn btn-primary' style={{ width: '150px', marginLeft: '10px' }}>
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default Invoice;
