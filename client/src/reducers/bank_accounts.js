import * as actionBankAccountMethods from '../actions/bank_accounts';
const defaultState = {
    data: [],
    loading: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionBankAccountMethods.LOADING_BANK_ACCOUNT_METHODS: {
            return {data: state.data, loading: true}
        }
        case actionBankAccountMethods.ADD_BANK: {
            return {data: [...state.data, action.payload], loading: false}
        }
        case actionBankAccountMethods.GET_ALL_BANK: {
            return {data: [...action.payload], loading: false}
        }
        case actionBankAccountMethods.DEACTIVE_BANK_ACCOUNT: {
            let arr = [];
            arr = state.data.map(item=>{
                let tmp = {...item};
                if(item.Id === action.payload.Id){
                    tmp = {...action.payload};
                }
                return tmp;
            })
            return {data: [...arr], loading: false}

        }
        default: return state;
    }
}
