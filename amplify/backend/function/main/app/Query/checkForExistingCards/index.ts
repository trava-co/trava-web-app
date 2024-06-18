import { AppSyncResolverHandler } from 'aws-lambda'
import { CheckForExistingCardsResponse, CheckForExistingCardsQueryVariables } from 'shared-types/API'
import { checkForExistingCards as getExistingCards } from '../../utils/checkForExistingCards'

const checkForExistingCards: AppSyncResolverHandler<
  CheckForExistingCardsQueryVariables,
  CheckForExistingCardsResponse
> = async (event) => {
  if (!(event.identity && 'sub' in event.identity)) {
    throw new Error('User is not authorized')
  }

  const { googlePlaceId, destinationDates } = event.arguments.input

  if (!googlePlaceId) {
    throw new Error('GooglePlaceId is required')
  }

  const { existingAttractions } = await getExistingCards({
    googlePlaceId,
    userId: event.identity.sub,
    destinationDates: destinationDates || undefined,
  })

  return {
    __typename: 'CheckForExistingCardsResponse',
    attractions: existingAttractions,
  }
}

export default checkForExistingCards
