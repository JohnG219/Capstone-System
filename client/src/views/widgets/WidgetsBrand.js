import React, { useEffect, useState, useContext  } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types'
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibFacebook, cibLinkedin, cibTwitter, cilCalendar } from '@coreui/icons'
import { CChart } from '@coreui/react-chartjs'
import useFetch from '../../hooks/useFetch';
import homecaintaphoto from '../widgets/caintagreenpark.jpg';

const WidgetsBrand = (props) => {
  const { data: meetingsData, loading, error, reFetch } = useFetch('/meetings');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    reFetch(); 
  }, []);

  const renderMeetingInfo = () => {
    if (loading) return 'Loading...';
    if (error) return 'Error fetching data';
  
    if (meetingsData && meetingsData.data && meetingsData.data.length > 0) {
      const latestMeeting = meetingsData.data[0]; 
  
      return {
        Meetings: latestMeeting.dateyr,
        Time: latestMeeting.time,
      };
    }
  
    return {
      Meetings: 'No meetings found',
      Time: '-',
    };
  };
  

  const chartOptions = {
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  }

  return (
    <>
    {user ? (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsD
          color="warning"
          {...(props.withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      backgroundColor: 'rgba(255,255,255,.1)',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointHoverBackgroundColor: '#fff',
                      borderWidth: 2,
                      data: [35, 23, 56, 22, 97, 23, 64],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={<CIcon icon={cilCalendar} height={52} className="my-4 text-white" />}
          values={[
            { title: 'Meetings', value: renderMeetingInfo().Meetings },
            { title: 'Time', value: renderMeetingInfo().Time },
          ]}       
        />
      </CCol>
    </CRow>
    ) : (
      <div className="text-center mt-3">
          <img src={homecaintaphoto} alt="Cainta Green Park" />
      </div>
    )}
  </>
  )
}

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsBrand