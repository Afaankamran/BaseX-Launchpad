import { PoolClaimSchema } from '@/functions/validators/pool';
import { useActiveWeb3React, useIDOContract, useTokenContract } from '@/hooks';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Error } from '@/components/FormikError';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { calculateGasMargin, getContract, isAddress, toWei } from '@/functions';
import moment from 'moment-timezone';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DateTimePicker from '@mui/lab/DateTimePicker';

import { Token } from '@devdot/basex-sdk';
import ERC_20_ABI from '@/constants/abis/erc20.json';

export default function ClaimManager({ data }) {
  const [pendingTx, setPendingTx] = useState(false);
  const [token, setToken] = useState<Token | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { chainId, library } = useActiveWeb3React();
  const {
    query: { id },
  } = useRouter();
  const idoContract = useIDOContract(id.toString());

  const tokenContract = useTokenContract(token?.address);
  const handleFormSubmit = async (values) => {
    try {
      if (error) return;
      setPendingTx(true);
      const estimatedGas = await idoContract.estimateGas.setClaimInfo(
        values.token,
        values.claims.map((claim) => moment(claim.unlockTime).utc().unix()),
        values.claims.map((claim) =>
          parseUnits(claim.percentage.toString(), 6),
        ),
      );
      const transfertx = await tokenContract.transfer(
        idoContract.address,
        data?.tokensForSale,
      );
      const tx = await idoContract.setClaimInfo(
        values.token,
        values.claims.map((claim) => moment(claim.unlockTime).utc().unix()),
        values.claims.map((claim) =>
          parseUnits(claim.percentage.toString(), 6),
        ),
        {
          gasLimit: calculateGasMargin(estimatedGas),
        },
      );
      await tx.wait();
      setPendingTx(false);
    } catch (error) {
      alert(error?.data?.message);
      setPendingTx(false);
      console.error(error);
    }
  };

  const getTokenData = async (tokenAddress) => {
    if (!isAddress(tokenAddress)) {
      setError('Invalid token address');
      return;
    }
    setLoading(true);
    try {
      const tokenContract = getContract(tokenAddress, ERC_20_ABI, library);
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      const data = new Token(chainId, tokenAddress, decimals, symbol, name);
      setToken(data);
      setLoading(false);
    } catch (error) {
      setError("Couldn't get token data");
      setLoading(false);
      console.error(error);
    }
  };
  const handleTokenAddressChange = (e) => {
    const value = e.target.value;
    if (isAddress(value)) {
      getTokenData(value);
      setError('');
    } else {
      setToken(null);
      setError('Invalid token address');
    }
  };
  const claimAlreadyExists = data?.getAllClaims?.length > 0;
  const initialValues = {
    claims: claimAlreadyExists
      ? data.getAllClaims.map((claim) => {
        return {
          percentage: formatUnits(claim?.[1], 6),
          unlockTime: moment.unix(claim?.[0]).utc(),
        };
      })
      : [
        {
          unlockTime: null,
          percentage: null,
        },
        {
          unlockTime: null,
          percentage: null,
        },
      ],
    token: data?.token,
    endTime: moment.unix(data.getEndTime).utc(),
  };

  return (
    <Box>
      <Formik
        validationSchema={PoolClaimSchema}
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
                className=" section-title"
                style={{ fontSize: '1rem' }}
              >
                Claim Info
              </Typography>
            </div>
            <Box className="col-md-12" sx={{ mt: 2 }}>
              <InputLabel>Token Address</InputLabel>
              <div className="flex">
                <TextField
                  sx={{ mt: 1 }}
                  size="small"
                  name="token"
                  onChange={(e) => {
                    handleTokenAddressChange(e);
                    handleChange(e);
                  }}
                  value={values.token}
                  fullWidth
                />
              </div>
              <Error name="token" />
            </Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <FieldArray
                name="claims"
                render={(arrayHelpers) => (
                  <Box>
                    {values.claims.map((claim, index) => {
                      return (
                        <Box key={index} mt={2}>
                          {index == 0 && (
                            <div className="section-text">
                              <Typography
                                className=" section-title"
                                style={{ fontSize: '1rem' }}
                              >
                                TGE Info
                              </Typography>
                            </div>
                          )}
                          {index == 1 && (
                            <div className="section-text">
                              <Typography
                                className=" section-title"
                                style={{ fontSize: '1rem' }}
                              >
                                Vesting Info
                              </Typography>
                            </div>
                          )}
                          <Grid container sx={{ mt: 2 }} columnSpacing={4}>
                            <Grid item md={5} xs={12}>
                              <Box>
                                <InputLabel>Percentage</InputLabel>
                                <Field
                                  disabled={claimAlreadyExists}
                                  component={TextField}
                                  placeholder="Ex : 10"
                                  sx={{ mt: 1 }}
                                  size="small"
                                  type="number"
                                  name={`claims.${index}.percentage`}
                                  onChange={(e) =>
                                    handleChange({
                                      target: {
                                        name: `claims.${index}.percentage`,
                                        value: e.target.value,
                                      },
                                    })
                                  }
                                  value={values.claims[index].percentage}
                                  fullWidth
                                />
                              </Box>
                            </Grid>
                            <Grid item md={5} xs={12}>
                              <InputLabel>Claim Time</InputLabel>
                              <DateTimePicker
                                ampm={false}
                                value={values.claims[index].unlockTime}
                                disabled={pendingTx || claimAlreadyExists}
                                onChange={(value) =>
                                  handleChange({
                                    target: {
                                      name: `claims.${index}.unlockTime`,
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
                                    fullWidth
                                  />
                                )}
                              />
                              <Error name={`claims.${index}.unlockTime`} />
                            </Grid>
                            {index >= 1 && (
                              <Grid
                                item
                                md={2}
                                xs={12}
                                sx={{ minHeight: '100%' }}
                              >
                                <InputLabel sx={{ visibility: 'hidden' }}>
                                  ..
                                </InputLabel>
                                {!claimAlreadyExists && (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{ minHeight: '100%' }}
                                  >
                                    <Button
                                      color="secondary"
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      Remove
                                    </Button>
                                  </Box>
                                )}
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      );
                    })}
                    <Box display="flex" justifyContent={'flex-end'}>
                      <Grid
                        container
                        justifyContent={'flex-end'}
                        columnSpacing={4}
                      >
                        {!claimAlreadyExists &&
                          values.claims.reduce(
                            (sum, claim) =>
                              Number(sum) + Number(claim.percentage || 0),
                            0,
                          ) != 100 && (
                            <Grid item md={2} xs={12}>
                              <Button
                                sx={{ mt: 2 }}
                                variant="contained"
                                onClick={() =>
                                  arrayHelpers.push({
                                    unlockTime: null,
                                    percentage: null,
                                  })
                                }
                              >
                                Add Vesting
                              </Button>
                            </Grid>
                          )}
                      </Grid>
                    </Box>
                  </Box>
                )}
              />
            </LocalizationProvider>
            <Box
              display="flex"
              alignItems={'center'}
              flexDirection="column"
              justifyContent={'center'}
            >
              {!claimAlreadyExists && (
                <Button
                  type="submit"
                  sx={{ mt: 2 }}
                  variant="contained"
                  disabled={
                    pendingTx ||
                    isSubmitting ||
                    values.claims.reduce(
                      (sum, claim) =>
                        Number(sum) + Number(claim.percentage || 0),
                      0,
                    ) != 100
                  }
                >
                  Add Claiming Info
                </Button>
              )}

              {!claimAlreadyExists &&
                values.claims.reduce(
                  (sum, claim) => Number(sum) + Number(claim.percentage || 0),
                  0,
                ) != 100 && (
                  <Typography sx={{ mt: 2 }} className="text-danger">
                    Sum of Percentage must be 100
                  </Typography>
                )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
