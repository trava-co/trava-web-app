import {
  ATTRACTION_DURATION,
  AUTHOR_TYPE,
  CURRENCY_TYPE,
  ATTRACTION_COST_TYPE,
  ATTRACTION_PRIVACY,
  StartEndLocationInput,
  ATTRACTION_TYPE,
  ATTRACTION_BEST_VISIT_TIME,
  CreateAttractionInput,
  CoordsInput,
  MealServicesInput,
  HoursInput,
  GenerationStep,
  Status,
  BADGES,
  AttractionLabel,
} from 'shared-types/API'
import { classifyDoOrEat } from './classifyDoOrEat'
import { getBestVisited } from './getBestVisited'
import { getTimezoneFromCoords } from '../../../utils/getTimezoneFromCoords'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import { checkIfValidTimestamp } from './checkIfValidTimestamp'

export interface IBusinessOverview {
  googlePlaceId: string
  coords: CoordsInput
  mealServices?: MealServicesInput | null
  name?: string | null
  hours?: HoursInput | null
  editorialSummary?: string | null
}

interface IGetInputToCreateAttraction {
  destinationId: string
  business: IBusinessOverview
  authorType: AUTHOR_TYPE
  authorId?: string
  recommendationBadges?: BADGES[] | null
}

export function getInputToCreateAttraction({
  business,
  authorType,
  authorId,
  destinationId,
  recommendationBadges,
}: IGetInputToCreateAttraction): CreateAttractionInput {
  // categorize attractionType
  const attractionType = classifyDoOrEat({
    mealServices: business.mealServices,
  })

  const bestVisited = getBestVisited({
    periods: business.hours?.periods,
    mealServices: business.mealServices,
    attractionType,
  })

  // currently, TPG only considers the duration variable when scheduling type DO attractions.
  const duration = ATTRACTION_DURATION.ONE_TWO_HOURS // hardcode, just for initialization of card.
  const timezone = getTimezoneFromCoords(business.coords)
  const locations = getLocations({ googlePlaceId: business.googlePlaceId, timezone })

  const now = new Date().toISOString()

  const getDescriptions = (editorialSummary?: string | null): { descriptionShort: string; descriptionLong: string } => {
    if (editorialSummary) {
      return {
        descriptionShort: editorialSummary,
        descriptionLong: `${'Generating description and details. This usually takes a few minutes...'}`,
      }
    } else {
      return {
        descriptionShort: 'Generating description and details',
        descriptionLong: 'This usually takes a few minutes...',
      }
    }
  }

  // assemble the input
  const createAttractionInput: CreateAttractionInput = {
    id: uuidv4(),
    type: attractionType,
    bestVisited,
    duration,
    destinationId,
    locations,
    authorType,
    isTravaCreated: 1,
    bucketListCount: 0,
    costCurrency: CURRENCY_TYPE.USD,
    costType: ATTRACTION_COST_TYPE.PERSON,
    name: business.name ?? 'Error adding name. Contact Support.',
    ...getDescriptions(business.editorialSummary),
    privacy: ATTRACTION_PRIVACY.PUBLIC,
    label: AttractionLabel.ATTRACTION,
    createdAt: now,
    updatedAt: now,
    generation: {
      step: GenerationStep.GET_PHOTOS,
      status: Status.PENDING,
      failureCount: 0,
      lastUpdatedAt: now,
    },
    ...(authorType === AUTHOR_TYPE.USER && { authorId }), // only include authorId if authorType is USER
    ...(recommendationBadges && { recommendationBadges }),
  }

  // validate the input
  const attractionErrors = validateAttractionSchema(createAttractionInput)

  if (attractionErrors.length) {
    throw new Error(`Error validating attraction input: ${attractionErrors.join(', ')}`)
  }

  return createAttractionInput
}

interface IGetLocations {
  googlePlaceId: string
  timezone: string
}

function getLocations({ googlePlaceId, timezone }: IGetLocations): StartEndLocationInput[] {
  return [
    {
      id: uuidv4(),
      displayOrder: 0,
      deleted: false,
      startLoc: {
        id: uuidv4(),
        googlePlaceId,
        timezone,
      },
      endLoc: {
        id: uuidv4(),
        googlePlaceId,
        timezone,
      },
    },
  ]
}

enum ATTRACTION_BEST_VISIT_TIME_DO {
  MORNING = ATTRACTION_BEST_VISIT_TIME.MORNING,
  AFTERNOON = ATTRACTION_BEST_VISIT_TIME.AFTERNOON,
  EVENING = ATTRACTION_BEST_VISIT_TIME.EVENING,
}

enum ATTRACTION_BEST_VISIT_TIME_EAT {
  BREAKFAST = ATTRACTION_BEST_VISIT_TIME.BREAKFAST,
  LUNCH = ATTRACTION_BEST_VISIT_TIME.LUNCH,
  DINNER = ATTRACTION_BEST_VISIT_TIME.DINNER,
  SNACK = ATTRACTION_BEST_VISIT_TIME.SNACK,
}

function validateAttractionSchema(attraction: any): string[] {
  const attractionErrors: string[] = []

  try {
    AttractionSchema.validateSync(attraction, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      for (const error of err.errors) {
        attractionErrors.push(error)
      }
    } else {
      throw new Error(`Unexpected validation error: ${err}`)
    }
  }
  return attractionErrors
}

// Create a validation schema with yup that validates each of the input fields listed:
// id, type, bestVisited, duration, destinationId, locations, authorType, isTravaCreated, bucketListCount, costCurrency, costType, name, descriptionShort, descriptionLong, privacy, authorId
// Reference @API.ts for the types and requirements of each field
const AttractionSchema = Yup.object({
  id: Yup.string()
    .required('Attraction ID is required')
    // add assertion for uuid v4 format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where: x represents a hexadecimal digit (0-9a-f) y represents a hexadecimal digit that is either 8, 9, A, or B.
    .test(
      'is-uuid-v4',
      'Attraction ID must be uiud v4, which follows a precise format. See here for details on format: https://www.uuidgenerator.net/',
      (value) => {
        if (!value) return false
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i')
        return regex.test(value)
      },
    ),
  type: Yup.mixed().oneOf(Object.values(ATTRACTION_TYPE)).required(),
  bestVisited: Yup.array()
    .min(1, 'At least one best visited time is required')
    .required('At least one best visited time is required')
    .when('type', {
      is: ATTRACTION_TYPE.DO,
      then: (schema) => schema.of(Yup.mixed().oneOf(Object.values(ATTRACTION_BEST_VISIT_TIME_DO))),
      otherwise: (schema) => schema.of(Yup.mixed().oneOf(Object.values(ATTRACTION_BEST_VISIT_TIME_EAT))),
    }),
  duration: Yup.mixed().oneOf(Object.values(ATTRACTION_DURATION)).required(),
  destinationId: Yup.string()
    .required()
    // add assertion for uuid v4 format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where: x represents a hexadecimal digit (0-9a-f) y represents a hexadecimal digit that is either 8, 9, A, or B.
    .test(
      'is-uuid-v4',
      'Destination ID must be uiud v4, which follows a precise format. See here for details on format: https://www.uuidgenerator.net/',
      (value) => {
        if (!value) return false
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i')
        return regex.test(value)
      },
    ),
  locations: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        displayOrder: Yup.number().required(),
        deleted: Yup.boolean().required(),
        startLoc: Yup.object()
          .shape({
            id: Yup.string().required(),
            googlePlaceId: Yup.string().required(),
            timezone: Yup.string().required(),
          })
          .required(),
        endLoc: Yup.object()
          .shape({
            id: Yup.string().required(),
            googlePlaceId: Yup.string().required(),
            timezone: Yup.string().required(),
          })
          .required(),
      }),
    )
    .required(),
  authorType: Yup.mixed().oneOf(Object.values(AUTHOR_TYPE)).required(),
  authorId: Yup.string().when('authorType', (authorType: any, schema) => {
    return authorType === AUTHOR_TYPE.USER ? schema.required() : schema.nullable()
  }),
  isTravaCreated: Yup.number().oneOf([0, 1]).required(),
  bucketListCount: Yup.number().integer().required(),
  costCurrency: Yup.mixed().oneOf(Object.values(CURRENCY_TYPE)).required(),
  costType: Yup.mixed().oneOf(Object.values(ATTRACTION_COST_TYPE)).required(),
  name: Yup.string().required(),
  descriptionShort: Yup.string().required(),
  descriptionLong: Yup.string().required(),
  privacy: Yup.mixed().oneOf(Object.values(ATTRACTION_PRIVACY)).required(),
  label: Yup.mixed().oneOf(Object.values(AttractionLabel)).required(),
  createdAt: Yup.string().required().test('is-iso-8601', 'createdAt must be in ISO 8601 format', checkIfValidTimestamp),
  updatedAt: Yup.string().required().test('is-iso-8601', 'updatedAt must be in ISO 8601 format', checkIfValidTimestamp),
  generation: Yup.object()
    .shape({
      step: Yup.mixed().oneOf(Object.values(GenerationStep)).required(),
      status: Yup.mixed().oneOf(Object.values(Status)).required(),
      lastUpdatedAt: Yup.string()
        .required()
        .test('is-iso-8601', 'lastUpdatedAt must be in ISO 8601 format', checkIfValidTimestamp),
      failureCount: Yup.number().integer(),
      lastFailureReason: Yup.string().nullable(),
    })
    .nullable(),
})
