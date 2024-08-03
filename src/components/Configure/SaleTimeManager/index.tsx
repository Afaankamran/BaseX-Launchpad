import { PoolSaleTimeSchema } from '@/functions/validators/pool';
import { useIDOContract } from '@/hooks';
import { Box, Divider, InputLabel, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { Error } from '@/components/FormikError';
export default function SaleTimeManager({ data }) {
  const [pendingTx, setPendingTx] = useState(false);
  const {
    query: { id },
  } = useRouter();
  const idoContract = useIDOContract(id.toString());
  const handleFormSubmit = async (values) => {
    try {
    } catch (error) {
      console.error(error);
    }
  };
  const updateStartTime = async (values, validateForm) => {
    try {
      setPendingTx(true);
      const errors = await validateForm(values);
      if (Object.values(errors).length <= 0) {
        const tx = await idoContract.setStartTime(
          moment(values.startTime).utc().unix(),
        );
      }
      setPendingTx(false);
      // console.log(errors);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const updateEndTime = async (values, validateForm) => {
    try {
      setPendingTx(true);
      const errors = await validateForm(values);
      if (Object.values(errors).length <= 0) {
        const tx = await idoContract.setDuration(
          moment(values.endTime)
            .utc()
            .diff(moment.unix(data.startTime).utc(), 'seconds'),
        );
        await tx.wait();
      }
      setPendingTx(false);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const updateTimings = async (values, validateForm) => {
    try {
      setPendingTx(true);
      const errors = await validateForm(values);
      if (Object.values(errors).length <= 0) {
        const tx = await idoContract.setTimeline(
          moment.duration(values.fcfsDuration, 'hours').asSeconds(),
        );
        await tx.wait();
      }
      setPendingTx(false);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const initialValues = {
    startTime: moment.unix(data.startTime).utc(),
    endTime: moment.unix(data.getEndTime).utc(),
    // registrationDuration: moment
    //   .duration(Number(data.registerDuration), 'seconds')
    //   .asHours(),
    // registrationStartTime:
    //   Number(data.registerTime) > 0 ? moment.unix(data.registerTime).utc() : '',
    fcfsDuration: moment
      .duration(Number(data.fcfsDuration), 'seconds')
      .asHours(),
  };
  return (
    <Box>
      <Formik
        validationSchema={PoolSaleTimeSchema}
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validateOnMount={true}
        validateOnBlur={true}
      >
        {({
          isSubmitting,
          handleSubmit,
          handleChange,
          values,
          errors,
          setValues,
          validateForm,
          setErrors,
          submitForm,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <div className="section-text">
                <Typography
                  className=" section-title"
                  style={{ fontSize: '1rem' }}
                  color="text.primary"
                >
                  Sale Timings
                </Typography>
              </div>
              <div className="items-center grid grid-cols-2">
                <Box className=" col-md-6">
                  <InputLabel>Start Time (UTC)</InputLabel>
                  <div className="flex align-items-end">
                    <DateTimePicker
                      ampm={false}
                      value={values.startTime}
                      disabled={pendingTx}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: 'startTime',
                            value: moment(value).isValid()
                              ? moment.utc(value.format('YYYY-MM-DD HH:mm:ss'))
                              : value,
                          },
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          sx={{
                            mt: 1,
                            borderRadius: 2,
                          }}
                          {...params}
                          fullWidth
                        />
                      )}
                    />
                    <div className="flex items-center w-full">
                      <button
                        disabled={pendingTx}
                        onClick={async () => {
                          submitForm();
                          updateStartTime(values, validateForm);
                        }}
                        className="ml-2 btn btn-sm btn-primary"
                        type="submit"
                      >
                        Update Start Time
                      </button>
                    </div>
                  </div>
                  <Error name="startTime" />
                </Box>
                <Box className="col-md-6">
                  <InputLabel>End Time (UTC)</InputLabel>
                  <div className="flex">
                    <DateTimePicker
                      disabled={pendingTx}
                      ampm={false}
                      value={values.endTime}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: 'endTime',
                            value: moment(value).isValid()
                              ? moment.utc(value.format('YYYY-MM-DD HH:mm:ss'))
                              : value,
                          },
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          sx={{
                            mt: 1,
                            borderRadius: 2,
                          }}
                          {...params}
                          fullWidth
                        />
                      )}
                    />
                    <div className="flex items-center w-full">
                      <button
                        disabled={pendingTx}
                        onClick={async () => {
                          handleSubmit();

                          updateEndTime(values, validateForm);
                        }}
                        className="ml-2 btn btn-sm btn-primary"
                        type="submit"
                      >
                        Update End Time
                      </button>
                    </div>
                  </div>
                  <Error name="endTime" />
                </Box>
              </div>
              <div className="mt-4"></div>
              <Divider />
              <div className="mt-4 grid grid-cols-2">
                {/* {data.levelsEnabled && (
                  <>
                    <Box className="col-md-3">
                      <InputLabel>Registrations Start Time (UTC)</InputLabel>
                      <div className="flex">
                        <DateTimePicker
                          disabled={pendingTx}
                          ampm={false}
                          value={values.registrationStartTime}
                          onChange={(value) =>
                            handleChange({
                              target: {
                                name: 'registrationStartTime',
                                value: moment(value).isValid()
                                  ? moment.utc(
                                      value.format('YYYY-MM-DD HH:mm:ss'),
                                    )
                                  : value,
                              },
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              sx={{
                                mt: 1,
                                borderRadius: 2,
                              }}
                              {...params}
                            />
                          )}
                        />
                      </div>
                      <Error name="registrationStartTime" />
                    </Box>
                    <Box className="col-md-3">
                      <InputLabel>Registrations Duration (hours)</InputLabel>
                      <div className="flex">
                        <TextField
                          sx={{ mt: 1 }}
                          fullWidth
                          size="small"
                          type="number"
                          name="registrationDuration"
                          onChange={handleChange}
                          value={values.registrationDuration}
                        />
                      </div>
                      <Error name="registrationDuration" />
                    </Box>
                  </>
                )} */}
                <Box className="col-md-3">
                  <InputLabel>FCFS Duration (hours)</InputLabel>
                  <TextField
                    sx={{ mt: 1 }}
                    fullWidth
                    size="small"
                    type="number"
                    name="fcfsDuration"
                    onChange={handleChange}
                    value={values.fcfsDuration}
                  />
                  <Error name="fcfsDuration" />
                </Box>
                <Box className="col-md-3">
                  <InputLabel sx={{ visibility: 'hidden' }}>confirm</InputLabel>
                  <div className="flex ">
                    <button
                      disabled={pendingTx}
                      onClick={async () => {
                        submitForm();
                        updateTimings(values, validateForm);
                      }}
                      className="ml-2 btn btn-sm btn-primary"
                      type="submit"
                    >
                      Update Timings
                    </button>
                  </div>
                </Box>
              </div>
            </LocalizationProvider>
          </form>
        )}
      </Formik>
    </Box>
  );
}
