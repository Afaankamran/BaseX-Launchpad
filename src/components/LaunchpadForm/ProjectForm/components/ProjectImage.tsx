import { Error } from "@/components/FormikError";
import { BASE_URI } from "@/constants";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const ProjectImage = ({
  projectData,
  setFieldValue,
  id,
  mutate,
  ConvertImgToBase64,
  param,
  imageType,
}) => {
  const [imageLoading, setImageUploading] = useState(false);
  const [image, setImage] = useState("");
  const formatImageType = imageType
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  const removeImage = () => {
    setImage("");
    // console.log('Icon Removed');
  };

  const uploadImage = async (values) => {
    if (
      values.type === "image/jpeg" ||
      values.type === "image/svg+xml" ||
      values.type === "image/png"
    ) {
      const ImageReader = await ConvertImgToBase64(values);
      setImage(ImageReader as string);
    }
  };

  async function handleChangeProjectImage(file) {
    try {
      if (projectData?.id) {
        setImageUploading(true);

        const formData = new FormData();
        formData.append(imageType, file);
        const res = await fetch(`${BASE_URI}/idos/${id}/${param}`, {
          method: "PATCH",
          body: formData,
        });
        if (res.status === 200) {
          mutate();
        } else {
          alert(`Can't update ${formatImageType} `);
        }
        setImageUploading(false);
      } else {
        uploadImage(file);
      }
    } catch (error) {
      console.error(error);
      setImageUploading(false);
    }
  }

  useEffect(() => {
    if (projectData?.[imageType]) {
      setImage(projectData?.[imageType]);
    }
  }, [projectData]);

  return (
    <>
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
              Upload an {formatImageType}
            </Typography>

            <label
              htmlFor="imageInput"
              className=" relative  w-full h-80  border cursor-pointer border-double flex justify-center items-center  p-20 "
            >
              {imageLoading && (
                <Box
                  className="absolute flex items-center justify-center"
                  sx={{
                    inset: 0,
                    zIndex: 1,
                    background: "rgba(0,0,0,0.5)",
                  }}
                >
                  Updating Project Icon...
                </Box>
              )}
              <input
                id={imageType}
                type="file"
                onChange={(e) => {
                  setFieldValue(imageType, e.target.files[0]);
                  handleChangeProjectImage(e.target.files[0]);
                }}
                name={imageType}
              />
            </label>
            <Error name={imageType} />
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
            Upload An {formatImageType}
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
              alt={`${imageType} here`}
              width="auto"
              height={"auto"}
            />
          </Box>
          <div className="flex justify-end">
            <button
              className="p-2 rounded-[5px] border border-red-500 hover:bg-red-500 transition mt-2 "
              onClick={removeImage}
            >
              Change Icon
            </button>
          </div>
        </>
      )}

      {/* Image upload End  */}
    </>
  );
};

export default ProjectImage;
