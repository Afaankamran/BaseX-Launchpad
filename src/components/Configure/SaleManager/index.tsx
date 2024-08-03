import { PoolSaleConfigSchema } from '@/functions/validators/pool';
import { useIDOContract } from '@/hooks';
import { Box, Divider, InputLabel, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Error } from '@/components/FormikError';
import { formatUnits } from '@ethersproject/units';
import { toWei } from '@/functions';
export default function SaleManager({ data }) {
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
  const updateRate = async (values, validateForm) => {
    try {
      setPendingTx(true);
      const errors = await validateForm(values);
      if (!errors.rate) {
        const tx = await idoContract.setRate(toWei(values.rate.toString()));
      }
      setPendingTx(false);
      // console.log(errors);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const udpateTokensForSale = async (values, validateForm) => {
    try {
      setPendingTx(true);
      const errors = await validateForm(values);
      if (!errors.tokensToSell) {
        const tx = await idoContract.setTokensForSale(
          toWei(values.tokensToSell.toString()),
        );
        await tx.wait();
      }
      setPendingTx(false);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const updateMinSell = async (values, validateForm) => {
    try {
      setPendingTx(true);
      const errors = await validateForm(values);
      if (!errors.minBuy) {
        const tx = await idoContract.setMin(toWei(values.minBuy.toString()));
        await tx.wait();
      }
      setPendingTx(false);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const updateMaxSell = async (values, validateForm) => {
    try {
      setPendingTx(true);
      const errors = await validateForm(values);
      if (!errors.maxBuy) {
        const tx = await idoContract.setMax(toWei(values.maxBuy.toString()));
        await tx.wait();
      }
      setPendingTx(false);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const initialValues = {
    rate: formatUnits(data.rate),
    tokensToSell: formatUnits(data.tokensForSale),
    minBuy: formatUnits(data.minSell),
    maxBuy: formatUnits(data.maxSell),
  };
  return (
    <Box>
      <Formik
        validationSchema={PoolSaleConfigSchema}
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
            <div className="section-text">
              <Typography
                className=" section-title text-white"
                style={{ fontSize: '1rem' }}
              >
                Sale Config
              </Typography>
            </div>
            <div className="relative">
              {data.isLive && (
                <div className="absolute inset-0  z-20 flex justify-center items-center h-full backdrop-sepia">
                  <p className="font-bold ">Sale is Live</p>
                </div>
              )}
              <div className={` ${data.isLive ? 'opacity-10' : ''}`}>
                <div className="items-center grid grid-cols-2">
                  <Box className="">
                    <InputLabel>Rate (USD)</InputLabel>
                    <div className="flex align-items-end">
                      <TextField
                        sx={{ mt: 1 }}
                        size="small"
                        type="number"
                        name="rate"
                        onChange={handleChange}
                        value={values.rate}
                        fullWidth
                      />

                      <div className="flex items-center w-full">
                        <button
                          disabled={pendingTx}
                          onClick={async () => {
                            submitForm();
                            updateRate(values, validateForm);
                          }}
                          className="ml-2 btn btn-sm btn-primary"
                          type="submit"
                        >
                          Update Rate
                        </button>
                      </div>
                    </div>
                    <Error name="rate" />
                  </Box>
                  <Box className="">
                    <InputLabel>No of Tokens to sell</InputLabel>
                    <div className="flex">
                      <TextField
                        sx={{ mt: 1 }}
                        size="small"
                        type="number"
                        name="tokensToSell"
                        onChange={handleChange}
                        value={values.tokensToSell}
                        fullWidth
                      />

                      <div className="flex items-center w-full">
                        <button
                          disabled={pendingTx}
                          onClick={async () => {
                            udpateTokensForSale(values, validateForm);
                          }}
                          className="ml-2 btn btn-sm btn-primary"
                          type="submit"
                        >
                          Update Tokens to Sell
                        </button>
                      </div>
                    </div>
                    <Error name="tokensToSell" />
                  </Box>
                </div>
              </div>
            </div>

            <div className="mt-4"></div>
            <Divider />
            <div className="mt-4 grid grid-cols-2">
              <Box className="col-md-6">
                <InputLabel>Min Buy</InputLabel>
                <div className="flex">
                  <TextField
                    sx={{ mt: 1 }}
                    fullWidth
                    size="small"
                    type="number"
                    name="minBuy"
                    onChange={handleChange}
                    value={values.minBuy}
                  />
                  <div className="flex items-center w-full">
                    <button
                      disabled={pendingTx}
                      onClick={async () => {
                        handleSubmit();
                        updateMinSell(values, validateForm);
                      }}
                      className="ml-2 btn btn-sm btn-primary"
                      type="submit"
                    >
                      Update Min Buy
                    </button>
                  </div>
                </div>
                <Error name="minBuy" />
              </Box>
              <Box className="col-md-6">
                <InputLabel>Max Buy</InputLabel>
                <div className="flex">
                  <TextField
                    sx={{ mt: 1 }}
                    fullWidth
                    size="small"
                    type="number"
                    name="maxBuy"
                    onChange={handleChange}
                    value={values.maxBuy}
                  />
                  <div className="flex items-center w-full">
                    <button
                      disabled={pendingTx}
                      onClick={async () => {
                        handleSubmit();

                        updateMaxSell(values, validateForm);
                      }}
                      className="ml-2 btn btn-sm btn-primary"
                      type="submit"
                    >
                      Update Max Buy
                    </button>
                  </div>
                </div>
                <Error name="maxBuy" />
              </Box>
            </div>
          </form>
        )}
      </Formik>
    </Box>
  );
}
