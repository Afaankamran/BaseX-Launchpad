import { DefiPoolSchema } from '@/functions/validators/pool';
import { ErrorMessage, Formik } from 'formik';
import moment from 'moment-timezone';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import {
  Card,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import Image from 'next/image';
import Images from '@/public/Assets/Images';
import { Error } from '../FormikError';

const initialValues = {
  startTime: moment.utc(),
  endTime: moment.utc(),
  projectName: '',
  rate: '',
  tokensForSale: '',
  levelsEnabled: false,
  video: '',
};
export default function DefiLaunchPadForm({
  handleBack,
  setPoolData,
  handleNext,
}) {
  // const [image, setImage] = useState('');
  // const [video, setVideo] = useState('');

  // const UploadImage = async (values) => {
  //   console.log(values.type);
  //   if (
  //     values.type === 'image/jpeg' ||
  //     values.type === 'image/svg+xml' ||
  //     values.type === 'image/png'
  //   ) {
  //     const ImageReader = await ConvertImgToBase64(values);
  //     setImage(ImageReader as string);
  //   }
  // };
  // const removeImage = () => {
  //   setImage('');
  //   console.log('Image Removed');
  // };

  // const UploadVideo = async (values) => {
  //   console.log('video here', values.type);
  //   if (
  //     values.type === 'video/mov' ||
  //     values.type === 'video/mp4' ||
  //     values.type === 'video/avi'
  //   ) {
  //     const VideoReader = await ConvertImgToBase64(values);
  //     setVideo(VideoReader as string);
  //   }
  // };
  // const removeVideo = () => {
  //   setVideo('');
  //   console.log('Video Removed');
  // };

  // const ConvertImgToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     // console.log(file);
  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = () => reject(reader.error);
  //   });
  // };
  const handleFormSubmit = async (values) => {
    setPoolData(values);

    handleNext();
  };
  return (
    <Card
      sx={{
        mt: 6,
        backgroundColor: '#08192e',
        boxShadow: 'none',
        mb: '150px',
        p: 4,
      }}
    >
      <Formik
        validationSchema={DefiPoolSchema}
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
      >
        {({
          isSubmitting,
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          errors,
          setValues,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className="mt-1">
              <InputLabel>Project Name</InputLabel>
              <TextField
                sx={{ mt: 1 }}
                size="small"
                name="projectName"
                placeholder="Project Name"
                onChange={handleChange}
                value={values.projectName}
                type="text"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="projectName" />
            </div>
            {/* <Box mt={1}>
              <InputLabel>Token Name</InputLabel>

              <TextField
                sx={{ mt: 1 }}
                size="small"
                name="name"
                placeholder="Token Name"
                onChange={handleChange}
                value={values.name}
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="name" />
            </Box>
            <Box mt={1}>
              <InputLabel>Token Symbol</InputLabel>

              <TextField
                sx={{ mt: 1 }}
                size="small"
                name="symbol"
                placeholder="Token Symbol"
                onChange={handleChange}
                value={values.symbol}
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="symbol" />
            </Box> */}
            <Box mt={1}>
              <InputLabel>Rate (USD)</InputLabel>

              <TextField
                sx={{ mt: 1 }}
                size="small"
                name="rate"
                placeholder="Rate (USD)"
                onChange={handleChange}
                value={values.rate}
                type="number"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="rate" />
            </Box>
            <Box mt={1}>
              <InputLabel>Number of tokens To Sell</InputLabel>

              <TextField
                size="small"
                name="tokensForSale"
                placeholder="No Of tokens "
                onChange={handleChange}
                value={values.tokensForSale}
                type="number"
                className="block w-full mt-1 text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Error name="tokensForSale" />
            </Box>
            <div className="mt-1">
              <label className="block w-full ">
                <span className="text-white"></span>

                <FormControlLabel
                  onChange={handleChange}
                  name="levelsEnabled"
                  control={<Switch value={values.levelsEnabled} />}
                  label="Enable Levels"
                />
              </label>
            </div>
            <Box mt={1}>
              <InputLabel>Sale Start Time (UTC)</InputLabel>

              <Box mt={1}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    ampm={false}
                    value={values.startTime}
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
                        fullWidth
                        size="small"
                        sx={{
                          borderRadius: 2,
                        }}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>

              <Error name="startTime" />
            </Box>
            <Box mt={1}>
              <InputLabel>Sale End Time(UTC)</InputLabel>

              <Box mt={1}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
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
                        fullWidth
                        sx={{
                          borderRadius: 2,
                        }}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
                <Error name="endTime" />
              </Box>

              {/* Image upload  */}
              {/* {image ? (
                ''
              ) : (
                <Box mt={1}>
                  <Box
                    sx={{
                      margin: '1rem 0 10px 0',
                    }}
                  >
                    <Typography
                      sx={{
                        marginBottom: '10px',
                      }}
                    >
                      Upload An Image
                    </Typography>

                    <label
                      htmlFor="imageInput"
                      className="   w-full h-80  border cursor-pointer border-double flex justify-center items-center  p-20 "
                    >
                      <input
                        id="imageInput"
                        type="file"
                        onChange={(e) => {
                          setFieldValue('image', e.target.files[0]);
                          UploadImage(e.target.files[0]);
                        }}
                        name="image"
                      />
                    </label>
                    <Error name="image" />
                  </Box>
                </Box>
              )}
              {image && (
                <>
                  <Typography
                    sx={{
                      margin: '10px 0',
                    }}
                  >
                    Upload An Image
                  </Typography>
                  <Box
                    sx={{
                      marginTop: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      minHeight: '300px',
                    }}
                  >
                    <img
                      src={image}
                      alt="Image here"
                      width="100%"
                      height={300}
                    />
                  </Box>
                  <div className="flex justify-end">
                    <button
                      className="p-2 rounded-[5px] border border-red-500 hover:bg-red-500 transition mt-2 "
                      onClick={removeImage}
                    >
                      Remove Image
                    </button>
                  </div>
                </>
              )} */}

              {/* Image upload End  */}

              {/* Video Upload  */}
              {/* <Box mt={1}>
                {video ? (
                  ''
                ) : (
                  <>
                    <Box
                      sx={{
                        margin: '1rem 0 10px 0',
                      }}
                    >
                      <Typography
                        sx={{
                          marginBottom: '10px',
                        }}
                      >
                        Upload A Video
                      </Typography>
                      <label
                        htmlFor="videoInput"
                        className="   w-full h-80  border  cursor-pointer border-double flex justify-center items-center  p-20 "
                      >
                        <input
                          id="videoInput"
                          type="file"
                          onChange={(e) => {
                            setFieldValue('video', e.target.files[0]);
                            UploadVideo(e.target.files[0]);
                          }}
                          name="video"
                          className=" "
                        />
                      </label>
                      <br />
                    </Box>
                    <Error name="video" />
                  </>
                )}

                {video && (
                  <Box
                    sx={{
                      marginTop: '1rem',
                    }}
                  >
                    <Typography
                      sx={{
                        marginBottom: '10px',
                      }}
                    >
                      Upload A Video
                    </Typography>
                    <video src={video} controls type="video/*" />
                    <div className="flex justify-end">
                      <button
                        className="p-2 rounded-[5px] border border-red-500 hover:bg-red-500 transition mt-2 "
                        onClick={removeVideo}
                      >
                        Remove Video
                      </button>
                    </div>
                  </Box>
                )}
              </Box> */}

              {/* Video Upload  End */}
            </Box>
            <button className="mt-3 btn btn-primary btn-sm" type="submit">
              Next
            </button>
          </form>
        )}
      </Formik>
    </Card>
  );
}
