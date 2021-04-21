import React, { useReducer } from 'react'
import { ADD_NOTE, FETCH_NOTE, HIDE_ALERT, REMOVE_NOTE, SHOW_ALERT, SHOW_LOADER } from '../Type'
import { firebaseReducer } from './firebaseReducer'
import axios from 'axios'
import {FirebaseContext} from './firebaseContext'


const _apiBase = 'https://react-hooks-6b8c9-default-rtdb.firebaseio.com'
export const FirebaseState = ({children}) =>{
    
    const initialState ={
        notes: [],
        loading:false
    }
        
    const [state, dispatch] = useReducer(firebaseReducer, initialState)
    const showLoader = () => dispatch({type:SHOW_LOADER})
    
    
    const fetchNotes = async ()=> {
        showLoader()
        const res = await axios.get(`${_apiBase}/notes.json`)
        console.log(res.data)
        const payload = Object.keys(res.data).map(key =>{
            return{
                ...res.data[key],
                id:key
            }
        })

        dispatch({
            type:FETCH_NOTE,
            payload
            
        })
        
    }

    

    const addNote = async title =>{
        const note = {
            title, date:new Date().toJSON()
        }

        try{
            const res = await axios.post(`${_apiBase}/notes.json`, note)
            const payload ={
                ...note,
                id: res.data.name
            }

            dispatch({
                type:ADD_NOTE,
                payload
            })
        }
        catch(e){
            throw new Error(e.message)
        }
       
    }

   

    const removeNote = async id =>{
        await axios.delete(`${_apiBase}/notes/${id}.json`)
        console.log(1)

        dispatch({
            type:REMOVE_NOTE,
            payload:id
        })
    }

    return(
        <FirebaseContext.Provider value={{
           showLoader, addNote, removeNote, fetchNotes,
           loading: state.loading,
           notes: state.notes
        }}>
        {children}
        </FirebaseContext.Provider>
    )

}