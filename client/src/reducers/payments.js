import {
    UPDATE_NEW_CARD_INFO,
    UPDATE_INVOICE,
    UPDATE_MANGOPAY_USER_ID,
    SET_REDIRECT_NAME,
    SET_CARD_REGISTRATION_ID,
    GET_USER_BALANCE,
    REFRESH_USER_BALANCE,
    GET_USER_KYC
} from '../actions/payments';


const initState = {
    mangopayUserId: null,
    cardRegistrationId: null,
    newCardInfo: {
        name: null,
        number: null,
        expired: null,
        cvvCode: null,
        type: null,
    },
    invoice: {
        booking: {},
        plan: {},
    },
    currentInvoiceType: null,
    currentRedirectName: null,
    userBalance: null,
    userKyc: null
}

export default (state = initState, { type, payload }) => {
    switch (type) {
        case UPDATE_NEW_CARD_INFO: {
            return {
                ...state,
                newCardInfo: {
                    ...state.newCardInfo,
                    ...payload
                }
            }
        }

        case UPDATE_INVOICE: {
            const { invoiceType, data } = payload;
            return {
                ...state,
                invoice: {
                    ...state.invoice,
                    [invoiceType]: {
                        ...state.invoice[invoiceType],
                        ...data
                    },
                },
                currentInvoiceType: invoiceType.toUpperCase()
            }
        }

        case UPDATE_MANGOPAY_USER_ID: {
            return {
                ...state,
                mangopayUserId: payload
            }
        }

        case SET_REDIRECT_NAME: {
            return {
                ...state,
                currentRedirectName: payload
            }
        }

        case GET_USER_BALANCE: {
            return {
                ...state,
                userBalance: payload
            }
        }
        case REFRESH_USER_BALANCE: {
            return {
                ...state,
                userBalance: null
            }
        }
        case GET_USER_KYC: {
            return {
                ...state,
                userKyc: payload
            }
        }
        case SET_CARD_REGISTRATION_ID: {
            return {
                ...state,
                cardRegistrationId: payload
            }
        }

        default: return state
    }
}
