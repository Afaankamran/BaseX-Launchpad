import { boolean, number, object, string, date, ref, array, mixed } from 'yup';
import { ethers } from 'ethers';
import moment from 'moment-timezone';


const validateImageFormat = (value) => {
  return (
    value &&
    ((typeof value === 'string' && value?.includes('cloudinary')) ||
      (value.type === 'image/jpeg' ||
        value.type === 'image/svg+xml' ||
        value.type === 'image/png'))
  );
};
export const ProjectInfoSchema = object({
  name: string().required('Token Name is required'),
  symbol: string().required('Token Symbol is required'),
  projectIcon: mixed()
    .required('Image is required')
    .test(
      'type',
      'Only the following formats are accepted: .jpeg, .svg, .png ',
      validateImageFormat
    ),
  image: mixed()
    .required('Image is required')
    .test(
      'type',
      'Only the following formats are accepted: .jpeg, .svg, .png ',
      validateImageFormat
  ),
  
  tokenomicDistribution: mixed()
    .required('Image is required')
    .test(
      'type',
      'Only the following formats are accepted: .jpeg, .svg, .png ',
      validateImageFormat
  ),
  
  vastingSchedule: mixed()
    .required('Image is required')
    .test(
      'type',
      'Only the following formats are accepted: .jpeg, .svg, .png ',
      validateImageFormat
  ),

  video: mixed()
    .required('video is required')
    .test(
      'type',
      'Only the following formats are accepted: .mp4, .mov, .avi ',
      (value) => {
        return (
          value &&
          ((typeof value === "string" && value?.includes("cloudinary")) || (value.type === 'video/mp4' ||
            value.type === 'video/mov' ||
            value.type === 'video/avi'))
        );
      },
    ),
  website: string().url('Must be a url').required("Website can't be empty"),
  description: string().min(100).max(1000).required("Description can't be empty"),
  roadmapq1: string().required("Roadmap Q1 can't be empty"),
  roadmapq2: string().required("Roadmap Q2 can't be empty"),
  roadmapq3: string().required("Roadmap Q3 can't be empty"),
  roadmapq4: string().required("Roadmap Q4 can't be empty"),
});
export const PoolClaimSchema = object({
  // tgePercentage: number()
  //   .positive('Vesting first release must be positive')
  //   .max(100, 'Max 100%')
  //   .required(),
  // interval:
  //   number()
  //     .integer('Vesting Interval must be integer')
  //     .min(1, 'Vesting Interval must be greater than 1 days')
  //     .positive('Vesting Interval must be positive')
  //     .required(),
  // vestingPercentage:
  //   number().when(
  //     'tgePercentage',
  //     (vestingFirstRelease, schema) => {
  //       return schema
  //         .positive('Vesting Percentage must be positive')
  //         .min(1, 'Vesting Percentage must be greater than 1')
  //         .test(
  //           'isValid',
  //           'First release for presale and Presale token release each Percentage must be less than 100 percent',
  //           (value) => {
  //             return value + vestingFirstRelease < 100;
  //           },
  //         )
  //         .required()
  //     },
  //   ),
  endTime: string()
    .transform((value) => (value ? value : ''))
    .required(),
  // tgeStartTime: string()
  //   .transform((value) => (value ? value : ''))
  //   .when("endTime", (endTime, schema) => {
  //     return schema
  //       .transform((value) => (value ? value : ''))
  //       .test('isValid', "TGE StartTime can't be empty", (value) => {
  //         return moment(value).isValid();
  //       })
  //       .test(
  //         'isAfterEndTime',
  //         'TGE Start Time must be after Sale End Time',
  //         (value) => {
  //           return moment(value).utc().isAfter(moment(endTime).utc());
  //         },
  //       )
  //   })
  //   .required('StartTime is required'),
  claims: array().of(
    object().shape({
      unlockTime: string()
        .transform((value) => (value ? value : ''))
        .when('endTime', (endTime, schema) => {
          return schema
            .transform((value) => (value ? value : ''))
            .test('isValid', "Claim Time can't be empty", (value) => {
              return moment(value).isValid();
            })
            .test(
              'isAfterEndTime',
              'Claim Time must be after Sale End Time',
              (value) => {
                return moment(value).utc().isAfter(moment(endTime).utc());
              },
            );
        })
        .required('Claim Time is required'),
      percentage: number().required(),
    }),
  ),
  token: string()
    .test('token', 'Please Enter a Valid Address', (value) =>
      ethers.utils.isAddress(value),
    )
    .test(
      'notNullAddress',
      'Please Enter a Valid Address',
      (value) => value !== '0x0000000000000000000000000000000000000000',
    )
    .required('Token is Required'),
});
export const PoolSaleConfigSchema = object({
  rate: number()
    .positive('Rate must be positive number')
    .required('Rate is required'),
  tokensForSale: number()
    .positive('Number of tokens must be positive number')
    .required('This field is required'),
  minBuy: number()
    .min(0, 'Min Buy can not be nagative ')
    .required('This field is required'),
  maxBuy: number()
    .min(ref('minBuy'), 'Max Buy can not be nagative ')
    .required('This field is required'),
});
export const PoolSaleTimeSchema = object({
  registrationStartTime: string()
    .transform((value) => (value ? value : ''))
    .when('startTime', (startTime, schema) => {
      return schema
        .test('isValid', "Registration time can't be empty", (value) => {
          return value ? moment(value).isValid() : true;
        })
        .test(
          'isBeforeStartTime',
          'Registration time must be before StartTime',
          (value) => {
            return value
              ? moment(value).utc().isBefore(moment(startTime).utc())
              : true;
          },
        );
    })
    .optional(),
  registrationDuration: number().when(
    ['startTime', 'registrationStartTime'],
    (startTime, registrationStartTime, schema) => {
      return !registrationStartTime
        ? schema.optional()
        : schema
          .positive("Registration duration can't be negative")
          .integer("Registration duration can't be decimal")
          .test(
            'isValid',
            'Register end must be before the start time',
            (value) => {
              return value
                ? moment(registrationStartTime)
                  .add(value, 'hours')
                  .utc()
                  .isBefore(moment(startTime).utc())
                : true;
            },
          )
          .required("Registration duration can't be empty");
    },
  ),
  fcfsDuration: number()
    .min(0, "FCFS duration can't be negative")
    .integer("FCFS duration can't be decimal")
    .optional(),
  startTime: string()
    .transform((value) => (value ? value : ''))
    .test('isValid', "StartTime can't be empty", (value) => {
      return moment(value).isValid();
    })
    .required('StartTime is required'),
  endTime: string()
    .transform((value) => (value ? value : ''))
    .when('startTime', (startTime, schema) => {
      return schema
        .test('isValid', "EndTime can't be empty", (value) => {
          return moment(value).isValid();
        })
        .test(
          'isAfterStartTime',
          'EndTime must be after StartTime',
          (value) => {
            return moment(value).utc().isAfter(moment(startTime).utc());
          },
        );
    })
    .required('Endtime is required'),
});
export const DefiPoolSchema = object().shape({
  projectName: string().required('Project Name is required'),
  // name: string().required('Token Name is required'),
  // symbol: string().required('Token Symbol is required'),
  startTime: string()
    .transform((value) => (value ? value : ''))
    .test('isValid', "StartTime can't be empty", (value) => {
      return moment(value).isValid();
    })
    .test('isFuture', 'StartTime must be in future', (value) => {
      return moment(value).utc().isAfter(moment().utc());
    })
    .required('StartTime is required'),
  endTime: string()
    .transform((value) => (value ? value : ''))
    .when('startTime', (startTime, schema) => {
      return schema
        .test('isValid', "EndTime can't be empty", (value) => {
          return moment(value).isValid();
        })
        .test(
          'isAfterStartTime',
          'EndTime must be after StartTime',
          (value) => {
            return moment(value).utc().isAfter(moment(startTime).utc());
          },
        );
    })
    .required('Endtime is required'),
  rate: number()
    .positive('Rate must be positive number')
    .required('Rate is required'),
  levelsEnabled: boolean().required('LevelsEnabled is required'),
  tokensForSale: number()
    .positive('Number of tokens must be positive number')
    .required('This field is required'),
  // image: mixed()
  //   .required('Image is required')
  //   .test(
  //     'type',
  //     'Only the following formats are accepted: .jpeg, .svg, .png ',
  //     (value) => {
  //       return (
  //         value &&
  //         (value.type === 'image/jpeg' ||
  //           value.type === 'image/svg+xml' ||
  //           value.type === 'image/png')
  //       );
  //     },
  //   ),

  // video: mixed()
  //   .required('video is required')
  //   .test(
  //     'type',
  //     'Only the following formats are accepted: .mp4, .mov, .avi ',
  //     (value) => {
  //       return (
  //         value &&
  //         (value.type === 'video/mp4' ||
  //           value.type === 'video/mov' ||
  //           value.type === 'video/avi')
  //       );
  //     },
  //   ),
});
const PoolSchema = object({
  // id: string()
  //   .required()
  //   .matches(/^[a-z\s]+$/, "Only small alphabets are allowed for this field "),
  tokenAddress: string()
    .test('tokenAddress', 'Please Enter a Valid Address', (value) =>
      ethers.utils.isAddress(value),
    )
    .required(),
  tokenName: string().required(),
  tokenDecimals: number().min(1).required(),
  tokenSymbol: string().required(),
  tokenType: string().oneOf([
    'ERC-20',
    //  "BEP-20"
  ]),
  initialSupply: string().optional(),
  listingON: string().required(),
  listingTime: date().required(),
  tokenDistribution: string().optional(),
  // poolAddress: string().when("active", (active, schema) => {
  //   return active
  //     ? schema
  //         .test("poolAddress", "Please Enter a Valid Address", (value) =>
  //           ethers.utils.isAddress(value)
  //         )
  //         .required()
  //     : schema.nullable();
  // }),
  logo: string().url().required(),
  smallLogo: string().url().required(),
  vesting: string().optional(),
  // private: boolean().required("Private is Required"),
  // softCap: number().required().min(1).required(),
  // hardCap: number().required().min(1).required(),
  // startTime: date()
  //   .required()
  //   .test(
  //     'startTime',
  //     'Start Time has to be in Future',
  //     (value) => new Date(value) > new Date(),
  //   ),
  // endTime: date().when('startTime', (startTime, schema) => {
  //   return startTime ? schema.min(startTime).required() : schema.required();
  // }),
  // claimTime: date().required(),
  // claimerType: string().oneOf(['mov']).required(),
  // price: number().min(0).required(),
  raiseAmount: number().min(0).required(),
  // minRaise: number().min(0).required(),
  // maxRaise: number()
  //   .min(0)
  //   .when('minRaise', (minRaise, schema) => {
  //     return minRaise ? schema.min(minRaise).required() : schema.required();
  //   })
  //   .required(),
  accessType: string()
    .oneOf(['public', 'private', 'privateandpublic'])
    .required(),

  description: string().required().max(1500),
  shortDescription: string().required().max(300),
  ownerOfRaise: string()
    .test('ownerOfRaise', 'Please Enter a Valid Address', (value) =>
      ethers.utils.isAddress(value),
    )
    .required(),
  projectName: string().required(),
  website: string().url().required(),
  github: string().url().nullable(),
  telegram: string().url().nullable(),
  medium: string().url().nullable(),
  twitter: string().url().nullable(),
  ...getSaleSchema('public'),
  ...getSaleSchema('private'),
  // active: boolean().optional(),
});
function getSaleSchema(prefix) {
  return {
    [`${prefix}StartTime`]: date().when('accessType', (accessType, schema) => {
      return accessType === prefix || accessType === 'privateandpublic'
        ? schema
          .required()
          .test(
            `${prefix}StartTime`,
            `${prefix}Start Time has to be in Future`,
            (value) => new Date(value) > new Date(),
          )
        : schema.nullable();
    }),
    // .required()
    // .test(
    //   `${prefix}StartTime`,
    //   `${prefix}Start Time has to be in Future`,
    //   (value) => new Date(value) > new Date(),
    // ),
    [`${prefix}EndTime`]: date().when(
      ['accessType', `${prefix}StartTime`],
      (accessType, startTime, schema) => {
        return (accessType === prefix || accessType === 'privateandpublic') &&
          startTime
          ? schema.min(startTime).required()
          : schema.nullable();
      },
    ),
    [`${prefix}Price`]: number()
      .min(0)
      .when('accessType', (accessType, schema) => {
        return accessType === prefix || accessType === 'privateandpublic'
          ? schema.min(0).required()
          : schema.nullable();
      }),
    [`${prefix}TgePercentage`]: number().when(
      ['accessType', `$${prefix}VestingPercentage`],
      (accessType, vesting, schema) => {
        return accessType === prefix || accessType === 'privateandpublic'
          ? schema
            .min(0)
            .max(100 - (vesting ?? 0))
            .required()
          : schema.nullable();
      },
    ),
    [`${prefix}VestingPercentage`]: number()
      .min(0)
      .when(
        ['accessType', `${prefix}TgePercentage`],
        (accessType, TgePercentage, schema) => {
          return accessType === prefix || accessType === 'privateandpublic'
            ? schema
              .min(0)
              .max(100 - (TgePercentage ?? 0))
              .required()
            : schema.nullable();
        },
      ),

    [`${prefix}Cliff`]: number().when('accessType', (accessType, schema) => {
      return accessType === prefix || accessType === 'privateandpublic'
        ? schema.min(0).required()
        : schema.nullable();
    }),
    [`${prefix}Interval`]: number().when('accessType', (accessType, schema) => {
      return accessType === prefix || accessType === 'privateandpublic'
        ? schema.min(0).required()
        : schema.nullable();
    }),
    [`${prefix}TgeStartTime`]: date().when(
      ['accessType', `${prefix}EndTime`],
      (accessType, saleEndTime, schema) => {
        return (accessType === prefix || accessType === 'privateandpublic') &&
          saleEndTime
          ? schema.min(saleEndTime).required()
          : schema.nullable();
      },
    ),
    ...(prefix === 'public' && {
      [`${prefix}MaxBuy`]: number()
        .min(0)
        .when('accessType', (accessType, schema) => {
          return accessType === prefix || accessType === 'privateandpublic'
            ? schema.min(0).required()
            : schema.nullable();
        }),
    }),
    // [`${prefix}EndTime`]: date().when(
    //   `${prefix}StartTime`,
    //   (startTime, schema) => {
    //     return startTime ? schema.min(startTime).required() : schema.required();
    //   },
    // ),
  };
}
export default PoolSchema;
