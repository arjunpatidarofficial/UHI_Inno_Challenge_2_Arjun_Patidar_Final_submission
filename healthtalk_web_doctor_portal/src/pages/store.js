import { combineReducers, createStore } from "redux";


const testReducer = (state = {
    total:[],
    selected: [],
    details: {},
    idArray: [],
    selfPatient: false
}, action) => {
    switch (action.type) {
        case 'totalTests':
            return state = {
                selected: state.selected,
                total: action.payload,
                idArray: state.idArray,
                details: state.details,
                selfPatient: state.selfPatient
            }
        case 'testSelected':
            return state = {
                selected: [...state.selected, action.payload],
                total: state.total,
                details: state.details,
                idArray: [...state.idArray, action.id],
                selfPatient: state.selfPatient
            }
        case 'testUnselected':
            return state = {
                selected: state.selected.filter((item, index) => item.id !== action.id),
                total: state.total,
                details: state.details,
                selfPatient: state.selfPatient,
                idArray: state.idArray.filter((item, index) => item !== action.id),
            }
        case 'userDetails':
            return state = {
                selected: state.selected,
                total: state.total,
                idArray: state.idArray,
                details: action.payload,
                selfPatient: state.selfPatient
            }
        case 'selfPatient':
            return state = {
                selected: state.selected,
                total: state.total,
                idArray: state.idArray,
                details: state.details,
                selfPatient: action.payload
            }
        default:
            return state
    }
}

const store = createStore(
    combineReducers({
        testsGlobal: testReducer,
    })
)

store.subscribe(() => {
    console.log('state changed..', store.getState())
})



export default store