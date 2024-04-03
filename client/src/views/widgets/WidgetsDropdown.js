import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import "./wid.css";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { apiUrl } from "../../../server.json" 

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';
import { Pie } from 'react-chartjs-2'; 

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);
  const [bills, setBills] = useState([]); 
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);

  useEffect(() => {
    // Fetch bills data when the component mounts
    const fetchBills = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bills`);
        setBills(response.data.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []);

  const filteredBills = user ? bills.filter((bill) => bill.email === user.email) : [];

  const waterBillAmount = filteredBills.length > 0 ? filteredBills[0].waterbill : 0;
  const electricBillAmount = filteredBills.length > 0 ? filteredBills[0].electricbill : 0;
  const currentBalance = filteredBills.length > 0 ? filteredBills[0].currentbalance : 0;

  const mthdateelectricBill = filteredBills.length > 0 ? filteredBills[0].mthdateelectricbill : 0;
  const mthdatewaterBill = filteredBills.length > 0 ? filteredBills[0].mthdatewaterbill : 0;
  const mthdatecurrentBalance = filteredBills.length > 0 ? filteredBills[0].mthdatecurrentbalance : 0;

  const pieChartData = {
    labels: ['Water Bill', 'Electric Bill', 'Previous Bill'],
    datasets: [
      {
        data: [waterBillAmount, electricBillAmount, currentBalance, 
          mthdateelectricBill, mthdatewaterBill, mthdatecurrentBalance],
          
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], 
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], 
      },
    ],
  };

  return (
    <>
    {user ? (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              ₱{filteredBills.length > 0 ? filteredBills[0].waterbill : 0}{' '}
              <span className="fs-6 fw-normal">
              ({filteredBills.length > 0 ? filteredBills[0].mthdateelectricbill : 0}{' '})
              </span>
            </>
          }
          title="Water Bill"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              ₱{filteredBills.length > 0 ? filteredBills[0].electricbill : 0}{' '}
              <span className="fs-6 fw-normal">
                ({filteredBills.length > 0 ? filteredBills[0].mthdatewaterbill : 0}{' '})
              </span>
            </>
          }
          title="Electric Bill"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              ₱{filteredBills.length > 0 ? filteredBills[0].currentbalance : 0}{' '}
              <span className="fs-6 fw-normal">
                (Mar-Apr 15)
              </span>
            </>
          }
          title="Previous Bill"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <div className="pie-chart-container">
  <Pie className="pie-chart-canvas" data={pieChartData} />
</div>
    </CRow>
        
     ) : (
      <div className="text-center mt-3">You are not logged in.</div>
    )}
  </>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown