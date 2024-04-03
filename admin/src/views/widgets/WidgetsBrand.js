import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { CChart } from '@coreui/react-chartjs'
import { cibFacebook, cibLinkedin, cibTwitter, cilCalendar, cilPencil,
  cilTrash } from '@coreui/icons'
import useFetch from '../../hooks/useFetch';
import homecaintaphoto from '../widgets/caintagreenpark.jpg';
import { Modal, Form, Button } from 'react-bootstrap';
import { apiUrl } from "../../../server.json";

const WidgetsBrand = (props) => {
  const { data: meetingsData, loading, error, reFetch } = useFetch('/meetings');
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    id: '',
    Meetings: '',
    Time: '',
  });

  useEffect(() => {
    reFetch();
  }, []);

  const handleEditMeeting = (meeting) => {
    setMeetingDetails({
      id: meeting._id,
      Meetings: meeting.dateyr,
      Time: meeting.time,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${apiUrl}/meetings/${meetingDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateyr: meetingDetails.Meetings,
          time: meetingDetails.Time,
        }),
      });
      if (response.ok) {
        setShowModal(false);
        reFetch();
      } else {
        // Handle error
        console.error('Failed to update meeting');
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

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
  };

  return (
    <>
      {user ? (
        <CRow className={props.className} xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={3}>
            <CIcon className='editmeetingbtn' icon={cilPencil} onClick={() => handleEditMeeting(meetingsData.data[0])} />
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="Formlisttt">
            <Form.Group controlId="formMeeting">
              <Form.Label>Meeting</Form.Label>
              <Form.Control
                type="text"
                placeholder="Meeting"
                value={meetingDetails.Meetings}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, Meetings: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="timeform" controlId="formTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Time"
                value={meetingDetails.Time}
                onChange={(e) => setMeetingDetails({ ...meetingDetails, Time: e.target.value })}
              />
            </Form.Group>

            <Button className='updatebtnmeeting' variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsBrand;