import { CreateAttractionInput, CreateGooglePlaceInput } from 'shared-types/API'
import getTableName from '../../../utils/getTableName'

interface IGetInputToTransaction {
  createAttractionInput: CreateAttractionInput
  createGooglePlaceInput?: CreateGooglePlaceInput
}

export function getInputToTransaction({ createAttractionInput, createGooglePlaceInput }: IGetInputToTransaction) {
  const attractionTableName = getTableName(process.env.API_TRAVA_ATTRACTIONTABLE_NAME)
  const googlePlaceTableName = getTableName(process.env.API_TRAVA_GOOGLEPLACETABLE_NAME)

  interface IPutOperation {
    Put: {
      TableName: string
      Item: CreateAttractionInput | CreateGooglePlaceInput
    }
  }

  type ITransactOperation = IPutOperation

  const transaction: { TransactItems: ITransactOperation[] } = {
    TransactItems: [
      {
        Put: {
          TableName: attractionTableName,
          Item: createAttractionInput,
        },
      },
    ],
  }

  if (createGooglePlaceInput) {
    transaction.TransactItems.push({
      Put: {
        TableName: googlePlaceTableName,
        Item: createGooglePlaceInput,
      },
    })
  }

  return transaction
}
