import { Error } from "@/components/FormikError";
import { BASE_URI } from "@/constants";
import { ProjectInfoSchema } from "@/functions/validators/pool";
import {
  Box,
  Button,
  Card,
  Grid,
  InputLabel,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import ProjectImage from "./components/ProjectImage";

const initialValues = {
  name: "",
  symbol: "",
  image: "",
  projectIcon: "",
  video: "",
  website: "",
  facebook: "",
  twitter: "",
  instagram: "",
  github: "",
  linkedin: "",
  discord: "",
  description: "",
  telegram: "",
  roadmapq1: "",
  roadmapq2: "",
  roadmapq3: "",
  roadmapq4: "",
  tokenomicDistribution: "",
  vastingSchedule: "",
};
export default function ProjectForm({ projectData, id, mutate, projectName }) {
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [video, setVideo] = useState("");

  const UploadImage = async (values) => {
    if (
      values.type === "image/jpeg" ||
      values.type === "image/svg+xml" ||
      values.type === "image/png"
    ) {
      const ImageReader = await ConvertImgToBase64(values);
      setImage(ImageReader as string);
    }
  };
  const removeImage = () => {
    setImage("");
    // console.log('Image Removed');
  };

  const UploadVideo = async (values) => {
    // console.log('video here', values.type);
    if (
      values.type === "video/mov" ||
      values.type === "video/mp4" ||
      values.type === "video/avi"
    ) {
      const VideoReader = await ConvertImgToBase64(values);
      setVideo(VideoReader as string);
    }
  };

  const removeVideo = () => {
    setVideo("");
    // console.log('Video Removed');
  };

  const ConvertImgToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // console.log(file);
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => reject(reader.error);
    });
  };

  useEffect(() => {
    if (projectData?.image) {
      setImage(projectData.image);
    }
    if (projectData?.video) {
      setVideo(projectData.video);
    }
  }, [projectData]);
  async function handleChangeImage(file) {
    try {
      if (projectData?.image) {
        setUploadingImage(true);

        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${BASE_URI}/idos/${id}/updateImage`, {
          method: "PATCH",
          body: formData,
        });
        if (res.status === 200) {
          mutate();
        } else {
          alert("Can't update image");
        }
        setUploadingImage(false);
      } else {
        UploadImage(file);
      }
    } catch (error) {
      console.error(error);
      setUploadingImage(false);
    }
  }
  async function handleChangeVideo(file) {
    try {
      if (projectData?.video) {
        setUploadingVideo(true);
        const formData = new FormData();
        formData.append("video", file);
        const res = await fetch(`${BASE_URI}/idos/${id}/updateVideo`, {
          method: "PATCH",
          body: formData,
        });
        if (res.status === 200) {
          mutate();
        } else {
          alert("Can't update video");
        }
        setUploadingVideo(false);
      } else {
        UploadVideo(file);
      }
    } catch (error) {
      console.error(error);
      setUploadingVideo(false);
    }
  }
  const handleFormSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      const formData = new FormData();

      for (const name in values) {
        if (values[name]) formData.append(name, values[name]);
      }
      formData.append("id", id);
      formData.append("projectName", projectName);
      const res = await fetch(
        projectData ? `${BASE_URI}/idos/${id}` : `${BASE_URI}/idos`,
        {
          method: projectData ? "PATCH" : "POST",
          body: projectData ? JSON.stringify(values) : formData,
          headers: {
            ...(projectData ? { "Content-Type": "application/json" } : {}),
          },
        }
      );
      if (res.status === 201 || res.status === 200) {
        alert("Successfully Added");
        mutate();
      } else {
        alert("Something went wrong");
      }
      actions.setSubmitting(false);
    } catch (error) {
      actions.setSubmitting(false);
      console.error(error);
    }
  };
  return (
    <Box>
      <Card
        sx={{
          mt: 6,
          backgroundColor: "#08192e",
          boxShadow: "none",
          mb: "150px",
        }}
      >
        <Box p={3}>
          <Typography variant="caption" color="primary.dark">
            (*) is required field.
          </Typography>
          <Box mt={1}>
            <Formik
              validationSchema={ProjectInfoSchema}
              onSubmit={handleFormSubmit}
              initialValues={projectData ? projectData : initialValues}
              enableReinitialize
            >
              {({
                isSubmitting,
                handleSubmit,
                handleChange,
                values,
                errors,
                setValues,
                isValid,
                setFieldValue,
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Box mt={1}>
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
                  <Box mt={1} mb={1}>
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
                  </Box>
                  <Grid container spacing={2}>
                    {/* <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel>Logo URL*</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="logoUrl"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.logoUrl}
                        />
                        <Error name="logoUrl" />
                        <Typography
                          variant="caption"
                          color="red"
                          lineHeight={'2px'}
                        >
                          URL must end with a supported image extension png,
                          jpg, jpeg or gif.
                        </Typography>
                      </Box>
                    </Grid> */}
                    <Grid item xs={12} md={12}>
                      <Box>
                        <InputLabel>Website*</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="website"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.website}
                        />
                        <Error name="website" />
                      </Box>
                    </Grid>
                    {/* <Grid item xs={12}>
                      <Box>
                        <InputLabel>Tokenomics URL*</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="tokenomics"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.tokenomics}
                        />
                        <Error name="tokenomics" />
                        <Typography
                          variant="caption"
                          color="red"
                          lineHeight={'2px'}
                        >
                          URL must end with a supported image extension png,
                          jpg, jpeg or gif.
                        </Typography>
                      </Box>
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel>Facebook</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="facebook"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.facebook}
                        />
                        <Error name="facebook" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel>Twitter</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="twitter"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.twitter}
                        />
                        <Error name="twitter" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel>Github</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="github"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.github}
                        />
                        <Error name="github" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel>Telegram</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="telegram"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.telegram}
                        />
                        <Error name="telegram" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel>Instagram</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="instagram"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.instagram}
                        />
                        <Error name="instagram" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel>Discord</InputLabel>
                        <TextField
                          sx={{ mt: 0.5 }}
                          size="small"
                          fullWidth
                          name="discord"
                          placeholder="Ex: htps://...."
                          onChange={handleChange}
                          value={values.discord}
                        />
                        <Error name="discord" />
                      </Box>
                    </Grid>
                  </Grid>
                  <Box mt={2} sx={{ "&>textarea": { borderRadius: "4px" } }}>
                    <InputLabel>Description</InputLabel>
                    <TextareaAutosize
                      className="w-full mt-1 bg-transparent border border-gray-400 p-2"
                      name="description"
                      placeholder="Enter Project Description"
                      onChange={handleChange}
                      value={values.description}
                      minRows={3}
                    />
                    <Error name="description" />
                  </Box>
                  <Box mt={2} sx={{ "&>textarea": { borderRadius: "4px" } }}>
                    <InputLabel>Roadmap Q1</InputLabel>
                    <TextareaAutosize
                      className="w-full mt-1 bg-transparent border border-gray-400 p-2"
                      name="roadmapq1"
                      placeholder="Enter Roadmap Q1"
                      onChange={handleChange}
                      value={values.roadmapq1}
                      minRows={3}
                    />
                    <Error name="roadmapq1" />
                  </Box>
                  <Box mt={2} sx={{ "&>textarea": { borderRadius: "4px" } }}>
                    <InputLabel>Roadmap Q2</InputLabel>
                    <TextareaAutosize
                      className="w-full mt-1 bg-transparent border border-gray-400 p-2"
                      name="roadmapq2"
                      placeholder="Enter Roadmap Q2"
                      onChange={handleChange}
                      value={values.roadmapq2}
                      minRows={3}
                    />
                    <Error name="roadmapq2" />
                  </Box>
                  <Box mt={2} sx={{ "&>textarea": { borderRadius: "4px" } }}>
                    <InputLabel>Roadmap Q3</InputLabel>
                    <TextareaAutosize
                      className="w-full mt-1 bg-transparent border border-gray-400 p-2"
                      name="roadmapq3"
                      placeholder="Enter Roadmap Q3"
                      onChange={handleChange}
                      value={values.roadmapq3}
                      minRows={3}
                    />
                    <Error name="roadmapq3" />
                  </Box>
                  <Box mt={2} sx={{ "&>textarea": { borderRadius: "4px" } }}>
                    <InputLabel>Roadmap Q4</InputLabel>
                    <TextareaAutosize
                      className="w-full mt-1 bg-transparent border border-gray-400 p-2"
                      name="roadmapq4"
                      placeholder="Enter Roadmap Q4"
                      onChange={handleChange}
                      value={values.roadmapq4}
                      minRows={3}
                    />
                    <Error name="roadmapq4" />
                  </Box>
                  {/* Image upload  */}
                  {image ? (
                    ""
                  ) : (
                    <Box mt={1}>
                      <Box
                        sx={{
                          margin: "1rem 0 10px 0",
                        }}
                      >
                        <Typography
                          sx={{
                            marginBottom: "10px",
                          }}
                        >
                          Upload An Image
                        </Typography>

                        <label
                          htmlFor="imageInput"
                          className=" relative  w-full h-80  border cursor-pointer border-double flex justify-center items-center  p-20 "
                        >
                          {uploadingImage && (
                            <Box
                              className="absolute flex items-center justify-center"
                              sx={{
                                inset: 0,
                                zIndex: 1,
                                background: "rgba(0,0,0,0.5)",
                              }}
                            >
                              Updating Image...
                            </Box>
                          )}
                          <input
                            id="imageInput"
                            type="file"
                            onChange={(e) => {
                              setFieldValue("image", e.target.files[0]);

                              handleChangeImage(e.target.files[0]);
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
                          margin: "10px 0",
                        }}
                      >
                        Upload An Image
                      </Typography>
                      <Box
                        sx={{
                          marginTop: "1rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          minHeight: "300px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={image}
                          alt="Image here"
                          width="auto"
                          height={"auto"}
                        />
                      </Box>
                      <div className="flex justify-end">
                        <button
                          className="p-2 rounded-[5px] border border-red-500 hover:bg-red-500 transition mt-2 "
                          onClick={removeImage}
                        >
                          Change Image
                        </button>
                      </div>
                    </>
                  )}

                  {/* Image upload End  */}

                  {/* Project Icon */}

                  <ProjectImage
                    ConvertImgToBase64={ConvertImgToBase64}
                    id={id}
                    mutate={mutate}
                    projectData={projectData}
                    setFieldValue={setFieldValue}
                    param="updateProjectIcon"
                    imageType="projectIcon"
                  />

                  {/* Project Icon End */}

                  {/* Tokenomic Image  */}

                  <ProjectImage
                    ConvertImgToBase64={ConvertImgToBase64}
                    id={id}
                    mutate={mutate}
                    projectData={projectData}
                    setFieldValue={setFieldValue}
                    param="updateTokenomicDistribution"
                    imageType="tokenomicDistribution"
                  />

                  {/* Tokenomic Image End */}

                  {/* Vasting Image  */}

                  <ProjectImage
                    ConvertImgToBase64={ConvertImgToBase64}
                    id={id}
                    mutate={mutate}
                    projectData={projectData}
                    setFieldValue={setFieldValue}
                    param="updateVastingSchedule"
                    imageType="vastingSchedule"
                  />

                  {/* Vasting Image End */}

                  {/* Video Upload  */}
                  <Box mt={1}>
                    {video ? (
                      ""
                    ) : (
                      <>
                        <Box
                          sx={{
                            margin: "1rem 0 10px 0",
                          }}
                        >
                          <Typography
                            sx={{
                              marginBottom: "10px",
                            }}
                          >
                            Upload A Video
                          </Typography>
                          <label
                            htmlFor="videoInput"
                            className="relative  w-full h-80  border  cursor-pointer border-double flex justify-center items-center  p-20 "
                          >
                            {uploadingVideo && (
                              <Box
                                className="absolute flex items-center justify-center"
                                sx={{
                                  inset: 0,
                                  zIndex: 1,
                                  background: "rgba(0,0,0,0.5)",
                                }}
                              >
                                Updating Video...
                              </Box>
                            )}
                            <input
                              id="videoInput"
                              type="file"
                              onChange={(e) => {
                                setFieldValue("video", e.target.files[0]);
                                handleChangeVideo(e.target.files[0]);
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
                          marginTop: "1rem",
                        }}
                      >
                        <Typography
                          sx={{
                            marginBottom: "10px",
                          }}
                        >
                          Upload A Video
                        </Typography>
                        <video src={video} controls />
                        <div className="flex justify-end">
                          <button
                            className="p-2 rounded-[5px] border border-red-500 hover:bg-red-500 transition mt-2 "
                            onClick={removeVideo}
                          >
                            Change Video
                          </button>
                        </div>
                      </Box>
                    )}
                  </Box>

                  {/* Video Upload  End */}
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Box>
                      {/* <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={handleBack}
                      >
                        Back
                      </button> */}

                      <button
                        style={{ marginLeft: "10px" }}
                        className="btn btn-sm btn-primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Update
                      </button>
                    </Box>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
