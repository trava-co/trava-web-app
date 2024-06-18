import { CreateGooglePlaceInput, PlaceDataInput } from 'shared-types/API'
import * as Yup from 'yup'
import { checkIfValidTimestamp } from './checkIfValidTimestamp'

interface IGetInputToCreateGooglePlace {
  googlePlaceId: string
  googlePlaceData: PlaceDataInput
}

export function getInputToCreateGooglePlace({
  googlePlaceId,
  googlePlaceData,
}: IGetInputToCreateGooglePlace): CreateGooglePlaceInput {
  if (!googlePlaceData || !googlePlaceData.coords) {
    throw new Error('Invalid googlePlaceData input')
  }

  const now = new Date().toISOString()

  const input: CreateGooglePlaceInput = {
    id: googlePlaceId,
    data: googlePlaceData,
    isValid: 1,
    consecutiveFailedRequests: 0,
    dataLastCheckedAt: now,
    dataLastUpdatedAt: now,
    createdAt: now,
    updatedAt: now,
  }

  const errors = validateGooglePlaceSchema(input)
  if (errors.length) {
    throw new Error(`Invalid google place input: ${errors.join(', ')}`)
  }

  return input
}

const GooglePlaceSchema = Yup.object({
  id: Yup.string().required(),
  isValid: Yup.number().oneOf([0, 1]).required(),
  data: Yup.object({
    coords: Yup.object({
      lat: Yup.number().required(),
      long: Yup.number().required(),
    }).required(),
    city: Yup.string().required(), // not technically required, but we'll enforce it
    state: Yup.string().nullable(),
    country: Yup.string().nullable(),
    continent: Yup.string().nullable(),
    name: Yup.string().nullable(),
    formattedAddress: Yup.string().nullable(),
    googlePlacePageLink: Yup.string().nullable(),
    websiteLink: Yup.string().nullable(),
    phone: Yup.string().nullable(),
    types: Yup.array().of(Yup.string().nullable()).nullable(),
    editorialSummary: Yup.string().nullable(),
    hours: Yup.object({
      // weekdayText must be an array of strings, at least one string long, and each string must be at least one character long
      weekdayText: Yup.array().of(Yup.string().min(1)).min(1).required(), // if hours is defined, weekdayText must be defined
      periods: Yup.array()
        .of(
          Yup.object({
            open: Yup.object({
              day: Yup.number().required(),
              time: Yup.string().required(),
            }).required(),
            close: Yup.object({
              day: Yup.number().nullable(),
              time: Yup.string().nullable(),
            })
              .default(null)
              .nullable()
              .test(
                'close-validation',
                'If close object is defined, then day, and time must be defined.',
                function (value: any) {
                  if (!value) {
                    return true
                  }

                  // If the close object is defined, then day and time must also be defined.
                  return value.day !== null && Boolean(value.time)
                },
              ),
          }),
        )
        .min(1)
        .required(), // if hours is defined, periods must be defined
    })
      .default(null)
      .nullable()
      .test(
        'hours-validation',
        'If hours object is defined, then weekdayText, and periods must be defined.',
        function (value: any) {
          console.log(`hours-validation: ${JSON.stringify(value, null, 2)}`)
          if (!value) {
            return true
          }

          // If the hours object is defined, then weekdayText and periods must also be defined.
          const fieldsAreDefined = value.weekdayText !== null && value.periods !== null

          if (!fieldsAreDefined) {
            return false
          }

          // hours object is defined
          // check to ensure that each period has an open and close object. if it only has an open object, then the open object must contain day 0 and time 0000
          const periodsAreValid = value.periods.every((period: any) => {
            if (!period.close) {
              return period.open.day === 0 && period.open.time === '0000'
            }
            return true
          })

          return periodsAreValid
        },
      ),
    businessStatus: Yup.string().nullable(),
    // if rating is defined, score and count must be defined
    rating: Yup.object({
      score: Yup.number().nullable(),
      count: Yup.number().nullable(),
    })
      .default(null)
      .nullable()
      .test(
        'rating-validation',
        'If rating object is defined, then score and count must be defined.',
        function (value: any) {
          if (!value) {
            return true
          }

          // If the rating object is defined, then score, and count must also be defined.
          return value.score !== null && value.count !== null
        },
      ),
    mealServices: Yup.object({
      servesBreakfast: Yup.boolean().nullable(),
      servesBrunch: Yup.boolean().nullable(),
      servesLunch: Yup.boolean().nullable(),
      servesDinner: Yup.boolean().nullable(),
      dineIn: Yup.boolean().nullable(),
      takeout: Yup.boolean().nullable(),
      delivery: Yup.boolean().nullable(),
    })
      .default(null)
      .nullable()
      .test(
        // if mealServices is defined, then at least one of the values must be defined
        'mealServices-validation',
        'If mealServices object is defined, then at least one of the values must be defined.',
        function (value: any) {
          if (!value) {
            return true
          }

          // If the mealServices object is defined, then at least one of the values must also be defined.
          return (
            Boolean(value.servesBreakfast) ||
            Boolean(value.servesBrunch) ||
            Boolean(value.servesLunch) ||
            Boolean(value.servesDinner) ||
            Boolean(value.dineIn) ||
            Boolean(value.takeout) ||
            Boolean(value.delivery)
          )
        },
      ),

    photos: Yup.array()
      .of(
        Yup.object({
          photo_reference: Yup.string().required(),
          height: Yup.number().required(),
          width: Yup.number().required(),
          html_attributions: Yup.array().of(Yup.string().required()).required(),
        }),
      )
      .default(null)
      .nullable()
      .test(
        'photos-validation',
        'If photos object is defined, then photo_reference must be defined.',
        function (value: any) {
          console.log(`photos-validation: ${JSON.stringify(value, null, 2)}`)
          if (!value) {
            return true
          }

          // If the photos object is defined then and photo_reference must also be defined.
          return value.photo_reference !== null
        },
      ),
  }).required(),
  consecutiveFailedRequests: Yup.number().required(),
  dataLastCheckedAt: Yup.string()
    .required()
    .test('is-iso-8601', 'dataLastCheckedAt must be in ISO 8601 format', checkIfValidTimestamp),
  dataLastUpdatedAt: Yup.string()
    .required()
    .test('is-iso-8601', 'dataLastUpdatedAt must be in ISO 8601 format', checkIfValidTimestamp),
  createdAt: Yup.string().required().test('is-iso-8601', 'createdAt must be in ISO 8601 format', checkIfValidTimestamp),
  updatedAt: Yup.string().required().test('is-iso-8601', 'updatedAt must be in ISO 8601 format', checkIfValidTimestamp),
  webData: Yup.object({
    menuLink: Yup.string().nullable(),
  })
    .default(null)
    .nullable()
    .test('webData-validation', 'If webData object is defined, then menuLink must be defined.', function (value: any) {
      if (!value) {
        return true
      }

      // If the webData object is defined, then menuLink must also be defined.
      return Boolean(value.menuLink)
    }),
})

function validateGooglePlaceSchema(googlePlace: any): string[] {
  const googlePlaceErrors: string[] = []

  // console.log(`Using Yum to validate ${JSON.stringify(googlePlace, null, 2)}`)
  console.log('Using Yum to validate googlePlace')

  try {
    GooglePlaceSchema.validateSync(googlePlace, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      for (const error of err.errors) {
        googlePlaceErrors.push(error)
      }
    } else {
      throw new Error(`Unexpected validation error: ${err}`)
    }
  }
  return googlePlaceErrors
}
